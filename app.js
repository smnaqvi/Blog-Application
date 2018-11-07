var express = require('express'),
    app = express(),
    bodyParser= require('body-parser'),
    mongoose = require("mongoose");
    methodOverride = require("method-override");
    expressSanitizer= require("express-sanitizer")

    
    
mongoose.connect('mongodb://localhost:27017/restful_blogapp',{ useNewUrlParser: true });
app.use (express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//Mongoose/Model Config
var blogSchema= new mongoose.Schema({
    title: String,
    image: String,
    body : String,
    created: {type:Date, default:Date.now}
});

var Blog =mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Sample blog",
//     image: "https://www.telegraph.co.uk/content/dam/football/2018/09/29/TELEMMGLPICT000176293916_trans_NvBQzQNjv4BqKQ5Yvlf_tS7m85BSV1LmKrBhbs7CvLTdB2Dq7IMvb4Y.jpeg?imwidth=480",
//     body: "Arsenal 2-0 Watford"
// })

//Routes

// app.get("/", function (req, res) {
//   res.redirect("/blogs");
// });
 
// app.get("/blogs", function (req, res) {
//   Blog.find({}, function (err, blogs) {
//     if (err) {
//       console.log("Error");
//     } else {
//       res.render("index", {blogs: blogs});
//     }
//   });
// });

// INDEX ROUTE
app.get("/",function(req,res){
    res.redirect("/blogs");
})

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error!");
        } else{
            res.render("index", {blogs: blogs});
        }
    })
})

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
})


//CREATE ROUTE

app.post("/blogs",function(req,res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
        if (err){
            res.render("new")
        }else
        //redirect to index
        { res.redirect("/blogs")}
    })
})

//Show route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect('/blogs');
        } else {
            res.render("show",{blog:foundBlog});
        }
    })
})

//EDIT route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if (err){res.redirect("/blogs")}
        else{    res.render("edit",{blog: foundBlog});}
    })
    
})

//Update route
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body) 
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if (err){res.redirect("/blogs"); 
        } else {res.redirect("/blogs/" + req.params.id)};
        })
})

//Delete route
app.delete("/blogs/:id", function(req,res){
  // destroy blog
  Blog.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/blogs")
      } else {
          res.redirect("/blogs")
      }
  })
  // redirect back
})



app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server is running")
})