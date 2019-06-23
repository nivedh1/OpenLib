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

var personSchema = new mongoose.Schema({
    username:String,
    password:String
})

var Kitty=mongoose.model('Kitty',personSchema);

app.get('/details',function(req,res){
    res.sendFile('details.html',{ root :path.join(__dirname,'/static')});

})

app.post('/details',(req,res,next)=>{

    if(!req.body.username) {
        res.send("Username field is empty");
        return;
    }
    if(!req.body.password) {
        res.send("Password field is empty");
        return;
    }

   // res.send(`hi`);

    var fluffy=new Kitty({
        username:req.body.username,
        password:req.body.password
    })
   // res.send(`hi ${req.body.username} and ${req.body.password}`)
    fluffy.save((err,fluffy)=>{
        if(err){
            res.send(`error`)
        }else{
            res.send(`added successfully`)
        }
    })

})

app.get('/getn',(req,res,next)=>{
    Kitty.findOne({
        'username':'nivedh'
    })
    .then(doc=>{
        res.json(doc);
    })

})



//app.use(express.static("static"))


app.get('/random',function(req,res,next){
    res.send(""+Math.floor(+Math.random()*100000));

})

app.get('/hi',function(req,res,next){
    res.send("hi")
})

app.post('/sayhello',function(req,res,next){
    var name=req.body.name;
    res.send(`Hello ${name}`)

})



app.post('/mydata',function(req,res){
   // res.end(JSON.stringify(req.body));
   res.send(`hi my name is ${req.body.name}`)
})

var bookSchema=new mongoose.Schema({
    name:String,
    author:String,
    edition:String,
    type:String,
    owner:String,
    phn_No:String,
    rating:Number,
    lending_method:String,
    amount:Number
});

var book=mongoose.model('book',bookSchema);

app.get("/dashboard", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        book.find({$or:[{name: regex},{author:regex},{type:regex}]}, function(err, allBooks){
           if(err){
               console.log(err);
           } else {
              if(allBooks.length < 1) {
                  noMatch = "No books match that query, please try again.";
              }
              res.render("/views/main",{books:allBooks, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        book.find({}, function(err, allBooks){
           if(err){
               console.log(err);
           } else {
              res.render("/views/main",{books:allBooks, noMatch: noMatch});
           }
        });
    }
});
console.log("hi")

app.listen(8080);