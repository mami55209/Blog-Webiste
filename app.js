import express from "express";
import bodyParser from "body-parser";
import lodash from "lodash";
import mongoose from "mongoose";
import {fileURLToPath } from 'url';
import {dirname } from 'path';
import defaultPosts from "./public/js/starterText.js";
import { PostModel} from "./public/schemas/postSchema.js";
import PageModel from "./public/schemas/pageSchema.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//initialize the app instance

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +"/public"));
// connecting to the mongodb DB
mongoose.connect("mongodb://localhost:27017/Blog-website");



app.get("/",async(req,res)=>{
  const posts = await PostModel.find();
  const homePost = await PostModel.findOne({title:"Home"});
  const pages = await PageModel.findOne({page:"Home"});
  if(pages.posts === null){
    const homePage =  new PageModel({
      page: "Home",
      posts: []
    });
    await homePage.save();
  }
  if(posts.length === 0 ){
     await PostModel.insertMany(defaultPosts);
     res.redirect("/");
  }else{
    res.render("home.ejs",{homeContent:homePost.post, postsArr:pages.posts});
  }
})
app.get("/about",async(req,res)=>{
  const  aboutPost = await PostModel.findOne({title:"About"});
  res.render("about.ejs",{aboutContent:aboutPost.post});
})
app.get("/contact",async(req,res)=>{
  const  contactPost = await PostModel.findOne({title:"Contact"});
  res.render("contact.ejs",{contactContent:contactPost.post});
})
app.get("/compose",(req,res)=>{
  res.render("compose.ejs");
})
app.post("/compose",async(req,res)=>{
  const newHomePost = new PostModel({
    title:req.body.titleInput,
    post: req.body.postInput
  });
  const homePage = await PageModel.findOne({page:"Home"});
  homePage.posts.push(newHomePost);
  await homePage.save()
  res.redirect("/");
})
app.get("/posts/:postId",async(req,res)=>{
  const postId =lodash.lowerCase(req.params.postId);
  const homePage = await PageModel.findOne({page:"Home"});
  homePage.posts.forEach((post)=>{
    const postTitle = lodash.lowerCase(post.title);
   if( postTitle === postId){
    res.render("post.ejs",{
      titleContent : post.title,
      postContent : post.post,
      postId: post._id
    })
   }
  })
})

//handling the delete button to delete posts
app.post("/delete",async(req,res)=>{
  const postId =req.body.deletePost;
  await PageModel.findOneAndUpdate({page:"Home"},
  {$pull:{posts: {_id:postId}}});
  res.redirect("/");
})

app.listen(port,()=>{
  console.log(`Server is running at http://$127.0.0.1:${port}`);
});
