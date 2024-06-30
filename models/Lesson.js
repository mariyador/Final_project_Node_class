const mongoose = require('mongoose');
const Student = require('../models/Student');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: { type: String, required: true }, 
    description: {
        type: String,
        required: true
    },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
