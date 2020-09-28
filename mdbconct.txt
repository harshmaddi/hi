var express= require('express');
var app=express();
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='mpone';//Type your database name which contains the collections of the hospital and ventilator names
const vent ="ventoinfo";//Type your collection name of ventilator details
const hosp='hospitalinfo';//Type your collection name of the hospital details
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
app.get('/status', (req, res) => {

    db.collection(vent, function (err, collection) {
       // var x = String(req.query.cs);
       collection.find({"status":req.query.cs}).toArray(function(err, items) {
        if(err) throw err;    
        res.send(items);            
    });
    
        });
    });
    app.get('/hname', (req, res) => {

        db.collection(vent, function (err, collection) {
           // var x = String(req.query.cs);
           collection.find({"name":req.query.hn}).toArray(function(err, items) {
            if(err) throw err;    
            res.send(items);            
        });
            });
        });
        app.get('/hospname', (req, res) => {

            db.collection(hosp, function (err, collection) {
               // var x = String(req.query.cs);
               collection.find({"name":req.query.hn}).toArray(function(err, items) {
                if(err) throw err;    
                res.send(items);            
            });
                });
            });  

       app.put('/update',(req,res)=>{
        db.collection(vent, function (err, collection) {
        
            collection.update({"ventilatorId":req.query.vid}, { $set: {"status" : req.query.vcs} },
                    function(err, result){
                    if(err) throw err;    
                    console.log('Document Updated Successfully');
                    });
            });
        });
        app.post('/add',(req,res)=>
        {
            db.collection(vent,function(err,collection)
            {
                collection.insert({ "hId" :req.query.nid,
                "ventilatorId" : req.query.nvid,
                "status" : req.query.ns,
                "name" : req.query.nn})
            });
        });
        app.delete('/remove',(req,res)=>
        {
            db.collection(vent,function(err,collection)
            {
                collection.remove({"ventilatorId":req.query.vid});
            });
        });

    app.listen(3000);
    


});
