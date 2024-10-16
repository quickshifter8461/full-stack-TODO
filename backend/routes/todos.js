const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const ToDo = require("../models/ToDo");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const todos = await ToDo.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/",
  [
    auth,
    body("title", "Title is required").not().isEmpty(),
    body("title", "Title should not exceed 100 characters").isLength({
      max: 100,
    }),
    body(
      "description",
      "Description should not exceed 500 characters"
    ).isLength({ max: 500 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    try {
      const newToDo = new ToDo({
        title,
        description,
        user: req.user.id,
      });

      const todo = await newToDo.save();
      res.status(201).json(todo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/:id",
  [
    auth,
    body("title", "Title should not exceed 100 characters")
      .optional()
      .isLength({ max: 100 }),
    body("description", "Description should not exceed 500 characters")
      .optional()
      .isLength({ max: 500 }),
    body("completed").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, completed } = req.body;

    const toDoFields = {};
    if (title) toDoFields.title = title;
    if (description) toDoFields.description = description;
    if (typeof completed === "boolean") toDoFields.completed = completed;

    try {
      let todo = await ToDo.findById(req.params.id);

      if (!todo) {
        return res.status(404).json({ message: "ToDo not found" });
      }

      if (todo.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" });
      }

      todo = await ToDo.findByIdAndUpdate(
        req.params.id,
        { $set: toDoFields },
        { new: true }
      );

      res.json(todo);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ message: "ToDo not found" });
      }
      res.status(500).send("Server error");
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await ToDo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "ToDo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await ToDo.findByIdAndDelete(req.params.id);

    res.json({ message: "ToDo removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "ToDo not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
