const express = require("express");
const feedController = require("../controllers/feedController");

const { body } = require("express-validator");
const router = express.Router();
const isAuth=require("../middlewares/is-auth")

router.get("/posts",isAuth,feedController.getPosts);
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],isAuth,
  feedController.createPost
);
router.get("/post/:postId", isAuth,feedController.getPost);
router.delete("/post/:postId",isAuth,feedController.deletePost)
router.put("/post/:postId", [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],isAuth,feedController.updatePost)

module.exports = router;
