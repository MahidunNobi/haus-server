const { Router } = require("express");
const verifyToken = require("../utiles/middleware");
const User = require("../models/UserModel");
const connect = require("../utiles/dbConnect");

const alertRouter = Router();

alertRouter.post("/", verifyToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { alert } = req.body;
    if (!email || !alert) {
      return res.status(404).json({ message: "Email or alert type not found" });
    }
    await connect();
    const user = await User.findOne({ email });
    user.alert_type = alert;

    await user.save();

    if (alert === "never") {
      return res.json({
        message: "You will never get any alert.",
        success: true,
      });
    }

    return res.json({ message: `You will get alert ${alert}`, success: true });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});

alertRouter.get("/", verifyToken, async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({ message: "Email or alert type not found" });
    }
    await connect();
    const user = await User.findOne({ email });
    if (!user.alert_type) {
      user.alert_type = "immediately";
      await user.save();
    }

    return res.json({ message: `Successfull`, alert_type: user.alert_type });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = alertRouter;
