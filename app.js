//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// set up mongoDB

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

// schema

const articleSchema = new mongoose.Schema ({
  title: String,
  content: String
});

//model

const Article = mongoose.model('Article', articleSchema);

// RESTful -GET
// get route that fetches all the articleSchema

app.get("/articles", function(req,res){

  // inside the callback function we query our database to find all
  // the documents inside the articles collection

  Article.find({}, function(err, foundArticles){
    if (!err) {
      //console.log(foundArticles);
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
