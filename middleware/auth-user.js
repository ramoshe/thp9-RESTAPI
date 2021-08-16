'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    let message;
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name} });
        console.log(user.firstName);
        try {
            if (user) {
                const authenticated = bcrypt
                    .compareSync(credentials.pass, user.password);
                console.log(`authenticated: ${authenticated}`);
                if (authenticated) {
                    console.log(`Authentication successful for ${user.firstName} ${user.lastName}`);
                    req.currentUser = user;
                } else {
                    message = `Authentication failure for ${user.firstName} ${user.lastName}`;
                }
            } else {
                message = `User not found for ${credentials.name}`;
            }
        } catch {
            console.log('Error authorizing credentials');
        }
    } else {
        message = `Auth header not found`;
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
}