// implement your posts router here
const Posts = require("./posts-model");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: "The posts information could not be retrieved",
      error: err.message,
    });
  }
});

module.exports = router;
