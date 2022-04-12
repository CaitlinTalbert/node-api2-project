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

router.put("/:id", async (req, res) => {
  const { title, contents } = req.body;
  try {
    if (!contents || !title) {
      res.status(400).json({
        message: "Please provide title and contents for the post",
      });
    } else {
      Posts.findById(req.params.id)
        .then((newPost) => {
          if (!newPost) {
            res.status(404).json({
              message: "The post with the specified ID does not exist",
            });
          } else {
            return Posts.update(req.params.id, req.body);
          }
        })
        .then((updatedPost) => {
          if (updatedPost) {
            return Posts.findById(req.params.id);
          }
        })
        .then((post) => {
          res.json(post);
        });
    }
  } catch (err) {
    res.status(500).json({
      message: "The post information could not be modified",
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      await Posts.remove(req.params.id);
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
    });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    await Posts.findPostComments(req.params.id).then((post) => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exists",
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "The comments information could not be retrieved",
    });
  }
});

module.exports = router;
