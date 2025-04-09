// eslint-disable-next-line import/extensions,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions
// noinspection HttpUrlsUsage
import { createServer } from 'http';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions
// import type { FileUpload } from "graphql-upload/processRequest.js";
// import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer, Extra } from 'graphql-ws/lib/use/ws';
import bodyParser from 'body-parser';
import { Context, SubscribeMessage } from 'graphql-ws';
import * as dotenv from 'dotenv';
import { ExecutionArgs } from 'graphql';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';
// import jwt from 'jsonwebtoken';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import resolvers from './schema/resolvers';
import typeDefs from './schema/types';
import { syncDatabase } from './db_loaders/mysql';
import { app } from './config/appConfig';
import { USER_JWT } from './lib/ultis/jwt';
// import { queryExample } from './playground';

dotenv.config();

export interface LapContext {
    isAuth: boolean;
    users?: USER_JWT;
    error: any;
    req: express.Request;
    res: express.Response;
    // pubsub: PubSubService;
}

interface ContextFunctionProps {
    req: express.Request;
    res: express.Response;
}
const authentication = async (
    authorization: string,
    req: express.Request,
    res: express.Response
): Promise<LapContext & JwtPayload> => {
    let token: string;
    if (authorization.startsWith('Bearer ')) {
        token = authorization.slice(7, authorization.length);
    }
    const user: JwtPayload = new Promise((resolve, reject) => {
        jwt.verify(token, app.secretSign, (err, decoded) => {
            if (err) return reject(err);
            return resolve(decoded);
        });
    });
    return await user
        .then((result: USER_JWT & JwtPayload) => ({
            isAuth: true,
            user: result,
            req,
            res,
        }))
        .catch((err: Error) => ({
            isAuth: false,
            error: err.message,
            req,
            res,
        }));
};

const context = async ({
    req,
    res,
}: ContextFunctionProps): Promise<LapContext> => {
    const token = req.headers?.authorization || '';
    const auth = await authentication(token, req, res);
    return {
        ...auth,
        // ...appContext,
    };
};
const getDynamicContext = async (
    ctx: Context<
        Record<string, unknown> | undefined,
        Extra & Partial<Record<PropertyKey, never>>
    >,
    msg: SubscribeMessage,
    args: ExecutionArgs
) => {
    if (ctx.connectionParams?.authentication) {
        // TODO
        console.log('msg: ', msg);
        console.log('args: ', args);
        return { currentUser: { id: 1 } };
    }
    return { currentUser: null };
};

async function startServer() {
    await Promise.all([syncDatabase()]);
    const appSrv = express();
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });
    const httpServer = createServer(appSrv);

    // Create WebSocket server using the HTTP server.
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/subscriptions',
    });
    // Save the returned server's info that we can shut down this server later
    const serverCleanup = useServer(
        {
            schema,
            context: async (ctx, msg, args) => {
                console.log('msg: ');
                return getDynamicContext(ctx, msg, args);
            },
            onConnect: async () => {
                console.log('A client connected!');
            },
            onDisconnect() {
                console.log('Disconnected!');
            },
        },
        wsServer
    );

    const server = new ApolloServer<LapContext>({
        typeDefs,
        resolvers,
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
                title: 'Recruitment-API in development',
                settings: {
                    'general.betaUpdates': false,
                    'editor.theme': 'dark',
                    'editor.cursorShape': 'line',
                    'editor.reuseHeaders': true,
                    'tracing.hideTracingResponse': true,
                    'queryPlan.hideQueryPlanResponse': true,
                    'editor.fontSize': 14,
                    'editor.fontFamily':
                        '"Source Code Pro", "Consolas", "Inconsolata", "Droid Sans Mono", "Monaco", monospace',
                    'request.credentials': 'omit',
                    'schema.polling.enable': false,
                },
                // tabs: await queryExample(),
                subscriptionEndpoint: `ws://${app.host}:${app.port}/subscriptions`,
            })
        );
    }

    await server.start();
    // This middleware should be added before calling `applyMiddleware`.
    // appSrv.use(graphqlUploadExpress());
    appSrv.use(cors());
    appSrv.use(
        '/graphql',
        bodyParser.json(),
        expressMiddleware(server, {
            context,
        })
    );
    await new Promise<void>((resolve) => {
        httpServer.listen({ port: app.port, hostname: app.host }, resolve);
        console.log(
            `🚀 Server ready at http://${app.host}:${app.port}/graphql`
        );
        // console.log(
        //     `🚀 Subscription endpoint ready at ws://${app.host}:${app.port}/subscriptions`
        // );
    });
}

startServer().catch((error) => {
    console.error('Unable start server: ', error);
});
