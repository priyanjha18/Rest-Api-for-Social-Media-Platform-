const User = require("../model/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("validation failed");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
    });
    const result = await user.save();
    if (result) {
      res.status(201).json({ message: "user Created", userId: result._id });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("A user with this email could not be found");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("wrong password");
      error.statusCode(401);
      throw error;
    }
    const token = jwt.sign(
      { email: loadedUser.Email, userId: loadedUser._id.toString() },
      "someSuperSecretSecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.getStatus = async (req, res, next) => {
  if (!req.userId) {
    const error = new Error("No User found");
    error.statusCode(401);
    throw error;
  }
  try {
    const user = await User.findById(req.userId);
    let status = user.status;
    res
      .status(200)
      .json({ message: "Status fetched Successfully", status: status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.updateStatus = async (req, res, next) => {
  if (!req.userId) {
    const error = new Error("No User found");
    error.statusCode(401);
    throw error;
  }
  try {
    const newStatus = req.body.status;
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No User found");
      error.statusCode(401);
      throw error;
    }
    user.status = newStatus;
    const result = await user.save();
    if (result) {
      res.status(200).json({ message: "Status updated successfully" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
