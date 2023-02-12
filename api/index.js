const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { storage, cloudinary } = require("./cloudinary");
const uploadMiddleware = multer({ storage });

//const fs = require("fs");
dotenv.config();

mongoose.set("strictQuery", false);
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());



const db_url = process.env.MONGO_URL;
mongoose
  .connect(db_url)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      //TODO:logged in: using jwt
      //FIXME:res.json()
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  }
  // else{
  //   res.status(400).send("empty token");
  // }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.array("file"), async (req, res) => {
  //console.log(req.files);

  let imageFiles = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  //console.log(imageFiles);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      images: imageFiles,
      author: info.id,
    });
    res.json(postDoc);
  });
});
app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.put("/post", uploadMiddleware.array("file"), async (req, res) => {
  console.log(req.body);
  const { id, title, summary, content } = req.body;
  const postDoc = await Post.findById(id);
  let imageFiles = postDoc.images;

  if (req.files) {
    req.files.map((file) =>
      imageFiles.push({
        url: file.path,
        filename: file.filename,
      })
    );
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    if (req.body.deletefile) {
      
      for (let filename of req.body.deletefile) {
        await cloudinary.uploader.destroy(filename);
      }
      
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      images: imageFiles ? imageFiles : postDoc.images,
    });
    await postDoc.updateOne({
      $pull: { images: { filename: { $in: req.body.deletefile } } },
    });

    res.json(postDoc);
  });
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;

      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      } else {
        for (let img of postDoc.images) {
          await cloudinary.uploader.destroy(img.filename);
        }
        await Post.deleteOne({ _id: id });
        res.status(200).send("post deleted successfully");
      }
    });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
