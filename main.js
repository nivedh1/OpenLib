var mongoose =require('mongoose')
const express=require('express')
const bodyParser=require('body-parser')

var path=require('path')
var mongoose =require('mongoose')

var app=express();

var bodyparser =require('body-parser')
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}));



mongoose.connect('mongodb://localhost/hands_on',{useNewUrlParser:true});
var db =mongoose.connection
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log("connected to the database")
});

var bookSchema=new mongoose.Schema({
    name:String,
    author:String,
    edition:String,
    owner:String,
    phn_No:String,
    rating:Number,
    lending_method:String,
    amount:Number
})

var book=mongoose.model('book',bookSchema);

app.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        book.find({$or:[{name: regex},{author:regex}]}, function(err, allBooks){
           if(err){
               console.log(err);
           } else {
              if(allBooks.length < 1) {
                  noMatch = "No books match that query, please try again.";
              }
              res.render("/main",{books:allBooks, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        book.find({}, function(err, allBooks){
           if(err){
               console.log(err);
           } else {
              res.render("/main",{books:allBooks, noMatch: noMatch});
           }
        });
    }
});