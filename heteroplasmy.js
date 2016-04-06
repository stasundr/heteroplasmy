#!/bin/env node
'use strict';

//
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let multer = require('multer');
let session = require('express-session');
let path = require('path');

let app = express();
let config = require(path.join(__dirname, 'config'));
app.locals.basedir = path.join(__dirname, 'public');

app
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'jade')
    .use(morgan('dev'))
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(session(config.sessionOpts))
    .listen(config.port);

// Routing
let index = require(path.join(__dirname, 'routes', 'index'));
app.use('/', index);

let upload = multer({ dest: 'uploads/' });
let heteroplasmy = require(path.join(__dirname, 'library', 'heteroplasmy'));

app.post('/sam/upload', upload.any(), (req, res) => {
    res.sendStatus(200);

    console.log(req.files);
    console.log(req.session);

    req.files.forEach(file => {
        console.log(heteroplasmy(path.join(__dirname, file.path)));
    });
});

app.post('/refresh', (req, res) => {
    if (req.session.results == undefined) req.session.results = 0;
    else req.session.results++;

    console.log(req.session.results);
    res.json(req.session.results);
});