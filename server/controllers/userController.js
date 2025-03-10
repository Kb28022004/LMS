import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import brycpt from "bcryptjs";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

// register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Filled required credentials",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({
        success: false,
        message: "User already registered with this email , try another !",
      });
    }

    const hashedPassword = await brycpt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

// login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Filled required credentials",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found  with this email!",
      });
    }

    const isPasswordMatched = await brycpt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "password is in correct",
      });
    }

    const tokenId = {
      id: user._id,
    };
    const token = await jwt.sign(tokenId, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        message: "You're logged in your account successfully",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

// logout user

const logoutUser = async (_, res) => {
  try {
    res
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .status(200)
      .json({
        success: true,
        message: "You're logged out from your account",
      });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

// user profile

const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'enrolledCourses',
        populate: {
          path: 'creator', // Yeh creator ki details ko bhi fetch karega
         
        },
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};


// user profile update

const userProfileUpdate = async (req, res) => {
  try {
    const { name, email } = req.body;
    const profilePicture = req.file; // Using multer for file upload

    if (!name && !email && !profilePicture) {
      return res.status(400).json({
        success: false,
        message: "Provide credentials to update.",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let updatedData = { name, email };

    if (profilePicture) {
      // Delete old profile picture from Cloudinary if exists
      if (user.profilePicture) {
        const publicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract public ID
        await deleteMediaFromCloudinary(publicId);
      }

      // Upload new profile picture
      const cloudResponse = await uploadMedia(profilePicture.path);
      updatedData.profilePicture = cloudResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export { registerUser, loginUser, userProfile, logoutUser, userProfileUpdate };
