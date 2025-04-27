import { createServer } from 'http';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer, Extra } from 'graphql-ws/lib/use/ws';
import bodyParser from 'body-parser';
import { Context } from 'graphql-ws';
import * as dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import resolvers from './schema/resolvers';
import typeDefs from './schema/types';
import { syncDatabase } from './db_loaders/mysql';
import { connectMongo, models as mongoModels, db } from './db_loaders/mongodb';
import { app } from './config/appConfig';
import { USER_JWT } from './lib/ultis/jwt';
import { queryExample } from './playground';

dotenv.config();

// Global instances
let globalMysqlInstance: Sequelize;
let globalMongodbInstance: typeof mongoose;

export interface LapContext {
    isAuth: boolean;
    users?: USER_JWT;
    error: any;
    req: express.Request;
    res: express.Response;
    mysql: Sequelize;
    mongodb: typeof mongoose;
    mongoModels: ReturnType<typeof db.initModels>;
}

interface ContextFunctionProps {
    req: express.Request;
    res: express.Response;
}

const authentication = async (
    authorization: string,
    req: express.Request,
    res: express.Response
): Promise<LapContext> => {
    let token: string = authorization || '';
    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    const mysql = globalMysqlInstance;
    const mongodb = globalMongodbInstance;
    const mongoModelsInstance = mongoModels;

    if (!token) {
        return { isAuth: false, error: 'No token provided', req, res, mysql, mongodb, mongoModels: mongoModelsInstance };
    }

    try {
        const user = await new Promise<USER_JWT & JwtPayload>((resolve, reject) => {
            // eslint-disable-next-line consistent-return
            jwt.verify(token, app.secretSign, (err, decoded) => {
                if (err) return reject(err);
                if (!decoded || typeof decoded === 'string') return reject(new Error('Invalid token format'));
                resolve(decoded as USER_JWT & JwtPayload);
            });
        });
        return { isAuth: true, users: user, req, res, mysql, mongodb, mongoModels: mongoModelsInstance, error: null };
    } catch (err) {
        return { isAuth: false, error: (err as Error).message, req, res, mysql, mongodb, mongoModels: mongoModelsInstance };
    }
};

const context = async ({ req, res }: ContextFunctionProps): Promise<LapContext> => {
    const token = req.headers?.authorization || '';
    return authentication(token, req, res);
};

const getDynamicContext = async (
    ctx: Context<Record<string, unknown> | undefined, Extra & Partial<Record<PropertyKey, never>>>
): Promise<{ currentUser: USER_JWT | null; mysql: Sequelize; mongodb: typeof mongoose; mongoModels: typeof mongoModels }> => {
    const token = ctx.connectionParams?.authentication as string | undefined;
    const mysql = globalMysqlInstance;
    const mongodb = globalMongodbInstance;
    const mongoModelsInstance = mongoModels;

    if (token) {
        try {
            const decoded = await new Promise<USER_JWT & JwtPayload>((resolve, reject) => {
                // eslint-disable-next-line consistent-return
                jwt.verify(token, app.secretSign, (err, decoded) => {
                    if (err) return reject(err);
                    if (!decoded || typeof decoded === 'string') return reject(new Error('Invalid token format'));
                    resolve(decoded as USER_JWT & JwtPayload);
                });
            });
            return { currentUser: decoded, mysql, mongodb, mongoModels: mongoModelsInstance };
        } catch (err) {
            console.error('WebSocket auth error:', err);
        }
    }
    return { currentUser: null, mysql, mongodb, mongoModels: mongoModelsInstance };
};

async function startServer() {
    globalMysqlInstance = await syncDatabase();
    globalMongodbInstance = await connectMongo();

    const appSrv = express();
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const httpServer = createServer(appSrv);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/subscriptions',
    });

    const serverCleanup = useServer(
        {
            schema,
            context: async (ctx) => getDynamicContext(ctx),
            onConnect: async () => console.log('WebSocket: client connected!'),
            onDisconnect: () => console.log('WebSocket: client disconnected!'),
        },
        wsServer
    );

    const server = new ApolloServer<LapContext>({
        schema,
        csrfPrevention: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    if (process.env.NODE_ENV === 'development') {
        server.addPlugin(
            ApolloServerPluginLandingPageGraphQLPlayground({
                title: 'GraphQL Playground',
                settings: {
                    'editor.theme': 'dark',
                    'editor.fontSize': 14,
                    'request.credentials': 'omit',
                    'schema.polling.enable': false,
                },
                tabs: await queryExample(),
                subscriptionEndpoint: `ws://${app.host}:${app.port}/subscriptions`,
            })
        );
    }

    await server.start();
    appSrv.use(cors());
    appSrv.use('/graphql', bodyParser.json(), expressMiddleware(server, { context }));

    await new Promise<void>((resolve) => {
        httpServer.listen({ port: app.port, hostname: app.host }, resolve);
        console.log(`🚀 Server ready at http://${app.host}:${app.port}/graphql`);
    });
}

startServer().catch((error) => {
    console.error('Unable to start server:', error);
});
