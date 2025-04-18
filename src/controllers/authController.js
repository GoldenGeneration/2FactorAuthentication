import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
      //   twoFactorSecret: false
    });
    console.log("New User: ", newUser);
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user", message: error });
  }
};

export const login = async (req, res) => {
  try {
    console.log("The authenticated user is: ", req.user);
    res.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } catch (error) {
    res.status(500).json({ error: "Error login credentials", message: error });
  }
};
export const authStatus = (req, res) => {};
export const logout = (req, res) => {};
export const setup2FA = (req, res) => {};
export const verify2FA = (req, res) => {};
export const reset2FA = (req, res) => {};
