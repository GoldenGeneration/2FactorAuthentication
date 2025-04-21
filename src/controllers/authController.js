import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";

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
export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "Unauthorized User" });
  }
};
export const logout = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized User" });
  }
  req.logout((err) => {
    if (err) res.status(401).json({ message: "User not logged in." });
    res.status(200).json({ message: "Logout Successful" });
  });
};
export const setup2FA = async (req, res) => {
  try {
    console.log("The req.uer is : ", req.user);
    const user = req.user;
    var secret = speakeasy.generateSecret();
    console.log("The secret object is : ", secret);
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;

    await user.save();

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "www.webmath.com",
      encoding: "base32",
    });

    const qrImageUrl = await qrCode.toDataURL(url);
    res.status(200).json({
      secret: secret.base32, // not recomended to pass, only for dev-environment
      qrCode: qrImageUrl,
    });
  } catch (error) {
    res.status(401).json({ error: "Error setting up 2FA", message: error });
  }
};
export const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret, // should not be passed during production
    encoding: "base32",
    token,
  });

  if (verified) {
    const jwtToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
    res
      .status(200)
      .json({ message: "2FA verification successful", token: jwtToken });
  } else {
    res.status(400).json({ message: "Invalid 2FA Token" });
  }
};

export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2FA reset successful" });
  } catch (error) {
    res.status(500).json({error: "Error resetting 2FA", message: error})
  }
};
