const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth.middleware');

// Apply auth protection to all routes
router.use(protect);

// @route   GET api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  '/',
  [
    body('title', 'Title is required').not().isEmpty(),
    body('category', 'Category is required').not().isEmpty(),
    body('priority', 'Priority is required').not().isEmpty(),
    body('dueDate', 'Due date is required').not().isEmpty()
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, priority, dueDate, completed } = req.body;

    try {
      const newTask = new Task({
        title,
        description,
        category,
        priority,
        dueDate,
        completed: completed || false,
        user: req.user.id
      });

      const task = await newTask.save();
      res.status(201).json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the task belongs to user
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, category, priority, dueDate, completed } = req.body;

    // Build task object
    const taskFields = {};
    if (title !== undefined) taskFields.title = title;
    if (description !== undefined) taskFields.description = description;
    if (category !== undefined) taskFields.category = category;
    if (priority !== undefined) taskFields.priority = priority;
    if (dueDate !== undefined) taskFields.dueDate = dueDate;
    if (completed !== undefined) taskFields.completed = completed;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the task belongs to user
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.findByIdAndRemove(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT api/tasks/:id/toggle
// @desc    Toggle task completion status
// @access  Private
router.put('/:id/toggle', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the task belongs to user
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { completed: !task.completed } },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
