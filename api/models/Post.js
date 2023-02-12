const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    images:[
      {
        url: String,
        filename: String,
      }
    ],
    content: String,
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
