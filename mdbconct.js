var express= require('express');
var bodyParser = require('body-parser');
var middleware=require('./middleware');
var server=require('./server');
var app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='mpone';//Type your database name which contains the collections of the hospital and ventilator names
const vent ="ventoinfo";//Type your collection name of ventilator details
const hosp='hospitalinfo';//Type your collection name of the hospital details
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
app.get('/hospitalinfo',middleware.checkToken, (req, res) => {
   db.collection(hosp).find().toArray().then(result => res.json(result));
    });
app.get('/ventilatorinfo',middleware.checkToken, (req, res) => {
    db.collection(vent).find().toArray().then(result => res.json(result));
    });
app.post('/status',middleware.checkToken, (req, res) => {

    db.collection(vent, function (err, collection) {
       // var x = String(req.body.cs);
       collection.find({"status":req.body.cs}).toArray(function(err, items) {
        if(err) throw err;    
        res.send(items);            
    });
    
        });
    });
    app.post('/hname',middleware.checkToken, (req, res) => {

        db.collection(vent, function (err, collection) {
           // var x = String(req.body.cs);
           collection.find({"name":req.body.hn}).toArray(function(err, items) {
            if(err) throw err;    
            res.send(items);            
        });
            });
        });
        app.post('/hospname',middleware.checkToken, (req, res) => {

            db.collection(hosp, function (err, collection) {
               // var x = String(req.body.cs);
               collection.find({"name":req.body.hn}).toArray(function(err, items) {
                if(err) throw err;    
                res.send(items);            
            });
                });
            });  

       app.put('/update',middleware.checkToken,(req,res)=>{
        db.collection(vent, function (err, collection) {
        
            collection.update({"ventilatorId":req.body.vid}, { $set: {"status" : req.body.vcs} },
                    function(err, result){
                    if(err) throw err;    
                    console.log('Document Updated Successfully');
                    });
            });
        });
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
        app.delete('/remove',middleware.checkToken,(req,res)=>
        {
            db.collection(vent,function(err,collection)
            {
                collection.remove({"ventilatorId":req.body.vid});
            });
        });

    app.listen(3000);
    


});
