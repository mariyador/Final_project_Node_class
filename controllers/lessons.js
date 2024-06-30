const Lesson = require("../models/Lesson");
const handleErrors = require("../utils/parseErrors");
const Student = require('../models/Student'); 


// GET all lessons for the current user
const getLessons = async (req, res, next) => {
    try {
        const lessons = await Lesson.find({ createdBy: req.user._id });
        lessons.sort((a, b) => new Date(a.date) - new Date(b.date));
        res.render('lessons', { lessons });
    } catch (error) {
        handleErrors(error, req, res);
    }
};

// POST a new lesson
const addLesson = async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const newLesson = await Lesson.create({
            title,
            description,
            date,
            createdBy: req.user._id,
        });
        res.redirect('/lessons');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// GET the form for adding a new lesson
const getNewLesson = async (req, res) => {
    try {
        const students = await Student.find();
        res.render('newLesson', { students });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// GET a specific lesson for editing
const editLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!lesson) {
            res.status(404);
            req.flash('error', 'Lesson not found');
            return;
        }
        res.render('lesson', { lesson }); 
    } catch (error) {
        handleErrors(error, req, res); 
    }
};

// POST an updated lesson
const updateLesson = async (req, res, next) => {
    try {
        const updatedLesson = await Lesson.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedLesson) {
            res.status(404);
            req.flash('error', 'Lesson not found');
            return;
        }
        res.redirect('/lessons');
    } catch (error) {
        handleErrors(error, req, res, '/lessons/edit/' + req.params.id);
    }
};

// POST to delete a lesson
const deleteLesson = async (req, res, next) => {
    try {
        const deletedLesson = await Lesson.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
        if (!deletedLesson) {
            res.status(404);
            req.flash('error', 'Lesson not found');
            return res.redirect('/lessons'); 
        }
        req.flash('success', 'Lesson was deleted');
        res.redirect('/lessons');
    } catch (error) {
        handleErrors(error, req, res); 
    }
};

module.exports = {
  getLessons,
  getNewLesson,
  addLesson,
  editLesson,
  updateLesson,
  deleteLesson
};
