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

// *** app.route() *** /

// using the app.route() method to make our code more succinct
// without any content our method would look like this: app.route("/articles").get().post().delete()
// app.route is a chainable route handler

app.route("/articles")

// each request starts with a dot to show that they are chained

// GET request

.get(function(req,res){

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
})

// POST request

.post(function(req, res){
  // once the post request comes in from the client we need to tap into body to tap into
  // some of the data that was put in
  // the names of the variables whose data we are trying to access are called title and content
  // console.log(req.body.title);
  // console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err) {
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

// DELETE request

.delete(function(req, res){
  // how our server will respond when the user makes the request to delete all the articles
  //  in our collection
  Article.deleteMany(
    // ignore the {conditions} argument to delete everything (first argument)
    // then check for error (second argument)
    function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.")
      } else {
        // if there was an error, send the error
        res.send(err);
      }
    });
}); // closing parantheses for app.route()


// using the chaining method to target a specific article




app.listen(3000, function(){
  console.log("Server started on port 3000.");
});


// *** PREVIOUS CODE: "/articles" ROUTE IS ACCESSED INDIVIDUALLY BY EACH REQUEST ***

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

// POST request

app.post("/articles", function(req, res){
  // once the post request comes in from the client we need to tap into body to tap into
  // some of the data that was put in
  // the names of the variables whose data we are trying to access are called title and content
  // console.log(req.body.title);
  // console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err) {
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });

});

// DELETE request

app.delete("/articles", function(req, res){
  // how our server will respond when the user makes the request to delete all the articles
  //  in our collection
  Article.deleteMany(
    // ignore the {conditions} argument to delete everything (first argument)
    // then check for error (second argument)
    function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.")
      } else {
        // if there was an error, send the error
        res.send(err);
      }
    });
});

// *** PREVIOUS CODE END *** //
