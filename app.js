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

// Requests targeting all articles //

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


// ************* TARGETING A SPECIFIC ARTICLES ****************
// using the chaining method to target a specific article

app.route("/articles/:articleTitle")

  .get(function(req,res){

    // inside the callback function we query our database to find
    // the document inside the articles collection the client requested

    // the condition for our findOne() method is that the title of the article in our database
    // has to match the title the user requested
    // the code now says: We are looking through our articles collection, we are going
    // to find one document where the title is equal to the title inside the request parameters
    //    hence, it's foundArticle (singular)

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title found.");
      }
    });
  })

// PUT method going to the same ROUTE

.put(function(req,res){

  // inside the article function we need to specify three things:

  Article.update(

    // 1. condition
    // the conditions upon which we want to perform the update method, i.e. what specific
    //  article
    // in this case the title of the article we want to update has to match the title of the article
    //  specified in the URL put in by the user in "/articles/:articleTitle"
    {title: req.params.articleTitle},

    // 2. actual update
    // kind of like the post request when the client submits a new article title and new content
    // req.body.X is bodyParser parsing our request and looking for that thing that is sent over,
    //   through an HTML form, for example
    {title: req.body.title, content: req.body.content},

    // 3. overwrite: true
    // by default mongoose will prevent content from being overwritten, so we need to specify this
    //   argument separately
    {overwrite: true},

    // 4. callback to check for errors
    function(err) {
      if(!err) {
        res.send("Successfully updated article.");
      }
    })
})

// PATCH method

.patch(function(req,res){

  // we want to update a document but only the field that we provide new information for
  // "update" part of CRUD
  Article.update(
    // 1. condition
    {title: req.params.articleTitle},
    // we want to make our code dynamic, so the client can choose what fields they want updated
    {$set: req.body},
    // callback function
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    })

});



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
