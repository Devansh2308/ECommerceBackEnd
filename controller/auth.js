const User = require("./../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

const check = (a, b) => {
  if (a == b) return false;
  return true;
};
exports.signup = (req, res) => {
  const newUser = {
    name: req.body.user.name,
    email: req.body.user.email,
    encryptPassword: req.body.user.encryptPassword
  };

  const user = new User(newUser);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT ABLE TO SAVE USER IN DB"
      });
    }

    return res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};

exports.signin = (req, res) => {
  const { email, encryptPassword } = req.body.user;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER DOES NOT EXIST"
      });
    }

    if (check(user.encryptPassword, encryptPassword)) {
      return res.status(401).json({
        error: "PASSWORD INCORRECT"
      });
    }

    //token created
    const token = jwt.sign({ _id: user.id }, "YOU CANT GUESS");
    //cookie
    res.cookie("token", token, { expire: new Date().getTime() + 9999 });

    const { _id, name, email, role } = user;

    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookies("token");
  res.json({ message: "User signed out successfully" });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: "YOU CANT GUESS",
  userProperty: "auth"
});

//custom Middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({ err: "ACESS DENIED" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      err: "YOU ARE NOT ADMIN,ACESS DENIED"
    });
  }
  next();
};
