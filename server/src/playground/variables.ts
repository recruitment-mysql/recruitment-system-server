const email = 'admin@gmail.com';
const password = '123456';
const userForLogin = 'userdemo@gmail.com';
const passwordForLogin = '123456';

export const variables = {
    login: {
        input: {
            email,
            password,
        },
    },
    register: {
        input: {
            email: userForLogin,
            password: passwordForLogin,
            full_name: 'demo',
            role:1,
        },
    },
};
