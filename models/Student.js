const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentName: {
        type: String, 
        required: [true, 'Name must be provided'],
        trim: true,
        maxlength: [40, 'The name should not be longer than 40 characters']
    },
    parents: {
        father: {
            name: String,
            email: String,
            phone: String
        },
        mother: {
            name: String,
            email: String,
            phone: String
        }
    },
    educationLevel: {
        type: String,
        enum: [
            'beginner',
            'intermediate',
            'advanced',
        ],
        required: [true, 'Student level must be provided'],
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        street: String,
        city: String,
        zipCode: String,
        state: String,
        country: String
    },
    typeOfLesson: {
        type: String,  
        enum: ['online', 'offline'],  
    },
    socialLinks: {
        facebook: String,
        instagram: String,
    },
    avatar: {
        type: String,
        default: 'default.jpg'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user']
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);