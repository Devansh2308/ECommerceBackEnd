const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

require("dotenv").config;
const app = express();
//MiddleWares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

app.get("/", (req, res) => {
  if (req) {
    console.log("GOT REQUEST");
  }
  res.send("WOrkinf");
});

mongoose
  .connect(
    "mongodb+srv://Devansh:Devansh@cluster0-ixpyc.mongodb.net/store?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("CONNECTED TO DB");
    app.listen(process.env.PORT || 8000, () =>
      console.log("listening on Port 8000....")
    );
  });
