import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;


    if (!token) {
      res.status(403).json({
        success: false,
        message: "unauthorized token",
      });
    }

    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
    

    if (!decodedToken) {
      res.status(403).json({
        success: false,
        message: "unauthorized user token",
      });
    }
    req.user = await User.findById(decodedToken.id);
    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;
