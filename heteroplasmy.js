#!/bin/env node
'use strict';

// Config
const config = {
    port: 3000,
    sessionOpts: {
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }
};

//
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let multer = require('multer');
let session = require('express-session');
let path = require('path');

let app = express();

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

let heteroplasmy = (file) => {
    return require('fs')
        .readFileSync(file, 'utf-8')
        .split('\n')
        .filter(row => { return row.split('\t').length > 9 })
        .map(row => {
            row = row.split('\t');
            return { position: parseInt(row[3]), sequence: row[9].split('') }
        })
        .reduce((heteroplasmyMap, read) => {
            read.sequence.forEach((n, i) => {
                i += read.position;
                if (!heteroplasmyMap[i]) heteroplasmyMap[i] = (new Array(7)).fill(0);
                heteroplasmyMap[i]['ATGCN-U'.indexOf(n.match(/[ATGCN-]/i) || 'U')]++;
            });
            return heteroplasmyMap;
        }, [[0]])
        .map(p => { return Math.max(...p)/p.reduce((a, b) => { return a + b }) });
};

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

    console.log(req.session);
    res.json(req.session.results);
});