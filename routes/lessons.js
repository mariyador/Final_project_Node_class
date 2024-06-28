const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const authMiddleware = require('../middleware/auth'); 
const Lesson = require('../models/Lesson');
const Student = require('../models/Student');

// GET all lessons for the current user
router.get('/', auth, async (req, res) => {
    try {
      const lessons = await Lesson.find().populate('student').exec();
      const students = await Student.find();
      lessons.sort((a, b) => new Date(a.date) - new Date(b.date));
      res.render('lessons', { lessons, students });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// GET the form for adding a new lesson
router.get('/new', auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.render('newLesson', { students });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// POST a new lesson (creating lessons requires authMiddleware)
router.post('/', auth, authMiddleware, async (req, res) => {
  const { title, description, date, time, student } = req.body;
  const createdBy = req.user._id;

  try {
    const newLesson = new Lesson({
      title,
      description,
      date,
      time,
      student,
      createdBy
    });

    await newLesson.save();
    res.redirect('/lessons');
  } catch (err) {
    console.error('Error creating lesson:', err);
    res.status(500).send('Failed to create lesson.');
  }
});

// GET a specific lesson for editing
router.get('/edit/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('student').exec();
    const students = await Student.find().exec(); 
    res.render('lesson', { lesson, students });
  } catch (err) {
    console.error('Error rendering edit form:', err);
    res.render('error');
  }
});

// POST an updated lesson
router.post('/update/:id', auth, async (req, res) => {
  try {
    const updatedLesson = await Lesson.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLesson) {
      res.status(404).send('Lesson not found');
      return;
    }
    res.redirect('/lessons');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// POST to delete a lesson
router.post('/delete/:id', auth, async (req, res) => {
  try {
    const deletedLesson = await Lesson.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!deletedLesson) {
      res.status(404).send('Lesson not found');
      return;
    }
    res.redirect('/lessons');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
