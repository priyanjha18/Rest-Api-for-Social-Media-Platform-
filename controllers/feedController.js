const { validationResult } = require("express-validator");
const Post = require("../model/post");
const fs = require("fs");
const path = require("path");
const io=require("../socket")
const User = require("../model/user");
exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    let totalItems = await Post.find().countDocuments();
    let posts = await Post.find().populate("creator").sort({createdAt:-1})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Data fetched successfully",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.createPost = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error("Validation failed,entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    creator: req.userId,
    imageUrl: imageUrl,
  });
  try {
    const save = await post.save();

    const user = await User.findById(req.userId);
    creator = user;
    user.posts.push(post);

    const result = await user.save();
    console.log(result);
    
    io.getIo().emit("post",{action:"create",post:{...post._doc,creator:{_id:req.userId,name:user.name}}})
    res.status(201).json({
      message: "Post created successfully",
      post: post,
      creator: { _id: creator._id, name: creator.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

  //create post in db
};
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Unable to find any post");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Success,Post Fetched", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    const error = new Error("no file picked");
    error.statusCode = 422;
    throw error;
  }

  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Unable to find any pic");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Not Authorized to update this post");
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImg(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const result = await post.save();
    io.getIo().emit("post",{action:"update",post:result})
    if (result) {
      res
        .status(200)
        .json({ message: "Post updated Successfully", post: result });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 422;
    }
    next(err);
  }
};
exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post =await Post.findById(postId);
    if (!post) {
      const error = new Error("Cannot Find Post");
      error.statusCode = 422;
      throw error;
    }
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error(" USer unable to  Delete Post");
      error.statusCode = 403;
      throw error;
    }

    clearImg(post.imageUrl);
    const result = await Post.findByIdAndDelete(postId);
    if (result) {
      const user = await User.findById(req.userId);
      user.posts.pull(postId);
      await user.save();
      res.status(200).json({ message: "Post deleted Successfully" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    io.getIo().emit("post",{action:"delete",post:postId})
    next(err);
  }
};
//

const clearImg = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
