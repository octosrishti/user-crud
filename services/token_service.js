const bcrypt = require('bcryptjs');
const utils = require('../../utils/utils');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/userModel')

/** ***************************************************
 * Utility method to generate access Token for a user *
 ****************************************************** */

const generateAccessToken = async (user) => {
  let accessToken;
  try {
    return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7days",
    });
  } catch (err) {
    console.log('Error - generateAccessToken - ', err);
    return null;
  }
};

/* ******************************************************
 * Utility method to verify access token from a request *
 ******************************************************** */

const verifyAuthToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token)
    return next(createError.Unauthorized('Invalid Token, Access Denied'));

  let verifiedUser;
  try {
    verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verifiedUser) {
      return next(createError.Unauthorized('Invalid Token, Access Denied'));
    }
  } catch (err) {
    console.log('Error - verifyAuthToken - verifiedUser - ', err);
    return next(createError.Unauthorized('Invalid Token, Access Denied'));
  }
  try {
    // If Current date - lastActive > 7 days then return 401 status(Token Expired)
    // const currentUser = await User.findById(verifiedUser._id);
    let currentUser;
    currentUser = await User.findById(verifiedUser.id);
    if (!currentUser) {
      return next(createError.Unauthorized('Invalid Token, Access Denied'));
    }

    // const activityInterval =
    //   (Date.now() - currentUser.lastActive.getTime()) / (1000 * 3600 * 24);
    // if (activityInterval > 30) {
    //   return next(createError(701, 'Token Expired, Please Login')); // Custom status code 701 for accessToken Expired
    // }

    // await Vendor.findByIdAndUpdate(verifiedUser._id, {
    //   lastActive: Date.now(),
    // });

    req.user = verifiedUser;
    return next();
  } catch (err) {
    console.log('Error - verifyAuthToken - ', err);
    return next(createError.InternalServerError());
  }
};

module.exports.generateAccessToken = generateAccessToken;
module.exports.verifyAuthToken = verifyAuthToken;
