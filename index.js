const express = require('express');
const common = require('./common');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./server.key', 'utf8');
var certificate = fs.readFileSync('./server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var app = express();

app.get('/', function (req, res) {
    res.send('TFS-endpoint is up');
});

app.get('/env', function (req, res) {
    res.send(JSON.stringify(process.env));
});

app.post('/tfs/projects/:project/branch/:branchName/buildDefinitions/:id/queue', function (req, res) {
    var payload = {
        definition: {
            id: req.params.id
        },
        sourceBranch: req.params.branchName
    };
    var options = {
        uri: 'https://' + process.env.TFSUrl + '/' + req.params.project + '/_apis/build/builds?api-version=2.0',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + process.env.TFSAccessToken
        },
        json: true,
        body: payload
    };

    var sendRequest = new common().sendRequest;
    var promise = sendRequest(options);
    promise.then(success, error);

    function success(result) {
        res.send(result);
    }

    function error(reason) {
        res.send('Request failed: ' + reason);
    }
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);