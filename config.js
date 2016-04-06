'use strict';

module.exports = {
    port: 3000,
    sessionOpts: {
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    }
};