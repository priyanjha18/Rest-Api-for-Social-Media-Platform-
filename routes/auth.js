const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const User = require("../model/user");
const isAuth = require("../middlewares/is-auth");
const router = express.Router();

router.put("/signup", [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-mail address already exist");
        }
      });
    }),
  body("password").trim().isLength({ min: 5 }),
  body("name").trim().not().isEmpty(),
],authController.signup);
router.post("/login",authController.login)
router.get("/status",isAuth,authController.getStatus)
router.put("/status",isAuth,[body("status").trim().not().isEmpty()],authController.updateStatus)
module.exports = router;
