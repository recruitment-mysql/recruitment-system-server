import 'graphql-import-node';
import * as root from './root.graphql';
import * as userType from './users.graphql';

console.log('root:', root);
console.log('userType:', userType);
export default [root, userType];
