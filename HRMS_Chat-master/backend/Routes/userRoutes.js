const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../Controllers/userController");

const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
//Auth is the login controller
router.post("/login", authUser);

module.exports = router;
