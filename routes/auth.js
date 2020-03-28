var express = require("express");
var router = express.Router();
const { signup, signin, signout, isSignedIn } = require("../controller/auth");
const { check } = require("express-validator");

router.post("/signup", signup);

router.post("/signin", signin);
router.get("/signout", signout);
router.get("/test", isSignedIn, (req, res) => {
  res.send("A PROTECTED ROUTE");
});

module.exports = router;
