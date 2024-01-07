import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: String,
    post: String
});
const PostModel = mongoose.model("post",postSchema);


export { PostModel , postSchema};