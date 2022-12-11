const express = require('express');
const Datastore = require('nedb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('src/ui'));

let schemaDb = new Datastore({ filename: './src/db/schema.db', autoload: true })
    , recordsDb = new Datastore({ filename: './src/db/records.db', autoload: true });

app.get('/schema', (req, res) => {
    schemaDb.find({}, function (err, docs) {
        res.send(docs);
    });
});

app.get('/schema/:formName', (req, res) => {
    schemaDb.find({ formName: req.params.formName }, function (err, docs) {
        res.send(docs[0]);
    });
});

app.post('/schema', (req, res) => {
    schemaDb.insert(req.body, (err, docs) => {
        res.send(docs);
    });
});

app.delete('/schema/:formName/:id', (req, res) => {
    schemaDb.remove({ _id: req.params.id }, {}, function (err, numRemoved) {
        if (numRemoved)
            recordsDb.remove({ formName: req.params.formName }, { multi: true }, function (err, numRemoved) {
                res.send({ numRemoved });
            });
        else
            res.send({ numRemoved });
    });
});

app.get('/records/:formName', (req, res) => {
    recordsDb.find({ formName: req.params.formName }, function (err, docs) {
        res.send(docs);
    });
});

app.post('/records/:formName', (req, res) => {
    recordsDb.insert(req.body, function (err, docs) {
        res.send(docs);
    });
});

app.delete('/records/:formName/:id', (req, res) => {
    recordsDb.remove({ _id: req.params.id }, {}, function (err, numRemoved) {
        res.send({ numRemoved });
    });
});

app.listen(port, () => {
    console.log(`Listening at ${port}`);
});
