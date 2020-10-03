var express= require('express');
var bodyParser = require('body-parser');
var middleware=require('./middleware');
var server=require('./server');
var app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
//Type your database name which contains the collections of the hospital and ventilator names
const dbName='mp1';
//Type your collection name of ventilator details
const vent ="vinfo";
//Type your collection name of the hospital details
const hosp='hinfo';
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    //This gives the all hosp info
    app.get('/hospitalinfo',middleware.checkToken, (req, res) => {
        db.collection(hosp).find().toArray().then(result => res.json(result));
    });
    // All ventilator info
    app.get('/ventilatorinfo',middleware.checkToken, (req, res) => {
        db.collection(vent).find().toArray().then(result => res.json(result));
    });
    //Gives the vent info by giving ventstatus
    app.post('/status',middleware.checkToken, (req, res) => {
        db.collection(vent, function (err, collection) {
       // var x = String(req.body.cs);
       collection.find({"status":req.body.cs}).toArray(function(err, items) {
        if(err) throw err;    
        res.send(items);            
    });
    });
    });
    //Gives vent info when you give hosp name 
    app.post('/hname',middleware.checkToken, (req, res) => {
        db.collection(vent, function (err, collection) {
           // var x = String(req.body.cs);
           collection.find({"name":req.body.hn}).toArray(function(err, items) {
            if(err) throw err;    
            res.send(items);            
        });
            });
        });
    //Gives hospital info when you give hosp name
    app.post('/hospname',middleware.checkToken, (req, res) => {
        db.collection(hosp, function (err, collection) {
        // var x = String(req.body.cs);
        collection.find({"name":req.body.hn}).toArray().then((result)=>res.send(result));
        });
    });  
    //Upadate the status of the vent by giving ventid 
    app.put('/update',middleware.checkToken,(req,res)=>{
        db.collection(vent, function (err, collection) {    
        collection.update({"ventilatorId":req.body.vid},
        { $set: {"status" : req.body.vcs} }).then((result)=>res.send(result));
        });
    });
    //Adding a new ventilator
    app.post('/add',middleware.checkToken,(req,res)=>
        {
            db.collection(vent,function(err,collection)
            {
                collection.insert({ "hId" :req.body.nid,
                "ventilatorId" : req.body.nvid,
                "status" : req.body.ns,
                "name" : req.body.nn})
            });
    });
    //Remove the vent by giving vent id
    app.delete('/remove',middleware.checkToken,(req,res)=>
    {
        db.collection(vent,function(err,collection)
        {
            collection.remove({"ventilatorId":req.body.vid});
        });
    });

    app.listen(3000);
    


});
