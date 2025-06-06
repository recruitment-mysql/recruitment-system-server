import { LapContext } from '../../server';
import { AuthenticationError } from '../classes/graphqlErrors';

export const checkAuthentication = (context: LapContext) => {
    if (!context.isAuth && !context.user)
        throw new AuthenticationError(context.error);
};
