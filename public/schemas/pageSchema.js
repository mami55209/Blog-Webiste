import mongoose from "mongoose";
import {postSchema} from "./postSchema.js";

const pageSchema = new mongoose.Schema({
    page: String,
    posts: [postSchema]
});

const PageModel = mongoose.model("page",pageSchema);
export default PageModel;