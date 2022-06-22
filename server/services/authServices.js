const firebase = require('../config/firebase');
const db = firebase.firestore();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUser = (user) => {
    return {
        name: user.name,
        _id: user._id,
        email: user.email,
        role: user.role,
    };
};

const authServices = {
    async register(firstname, lastname, username, password, role) {
        try {
            const userRef = db.collection('users');
            let userDoc = await userRef.where('Username', '==', username).get();
            userDoc = userDoc.docs[0];
            if (userDoc)
                return { status: 'failed', code: 409, message: 'Username is taken', data: {} };
            const salt = bcrypt.genSaltSync(10);
            const passwordHashed = bcrypt.hashSync(password, salt);

            const userAdd = await userRef.add({
                Firstname: firstname,
                Lastname: lastname,
                Username: username,
                Password: passwordHashed,
                Role: role,

            });

            return {
                status: true,
                message: 'User added successfully',
                code: 200,
                data: {
                    id: userAdd.id,
                    Firstname: firstname,
                    Lastname: lastname,
                    Username: username,
                    Role: role,
                },
            };

        } catch (error) {
            return {
                status: 'failed',
                code: 500,
                message: error.trace,
                data: {},
            };
        }
    },
    async login(username, password) {
        try {
            const userRef = db.collection('users');
            let userDoc = await userRef.where('Username', '==', username).get();
            userDoc = userDoc.docs[0];
            if (!userDoc || !bcrypt.compareSync(password, userDoc.data().Password))
                return {
                    status: 'failed',
                    code: '409',
                    message: 'Problem with password or user',
                    data: {},
                };

            return {
                status: 'success',
                code: 200,
                message: 'User logged',
                data: {
                    user: {
                        id: userDoc.id,
                        Firstname: userDoc.data().Firstname,
                        Lastname: userDoc.data().Lastname,
                        Username: userDoc.data().Username,
                        Role: userDoc.data().Role,

                        //TODO: PONER SECRET COMO VARIABLE DE ENTORNO

                    },
                    token: jwt.sign({
                        id: userDoc.id,
                        Firstname: userDoc.data().Firstname,
                        Lastname: userDoc.data().Lastname,
                        Username: userDoc.data().Username,
                        Role: userDoc.data().Role
                    }, 'abc123'),
                },
            };
        } catch (error) {
            return {
                status: 'failed',
                code: 500,
                message: error.trace,
                data: {},
            };
        }
    },
};

module.exports = authServices;