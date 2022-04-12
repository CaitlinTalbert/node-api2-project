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

router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post information could not be retrieved",
      error: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  try {
    if (!contents || !title) {
      res.status(400).json({
        message: "Please provide title and contents for the post",
      });
    } else {
      Posts.insert({ title, contents })
        .then(({ id }) => {
          return Posts.findById(id);
        })
        .then((post) => {
          res.status(201).json(post);
        });
    }
  } catch (err) {
    res.status(500).json({
      message: "There was an error while saving the post to the database",
      error: err.message,
    });
  }
});

module.exports = router;
