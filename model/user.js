import mongoose from 'mongoose';
import UserCourse from './user_course.js';
import Event from './event.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    grade: {
        type: Number,
        default: 1,
        required: true,
    },
    coins: {
        type: Number,
        default: 1000,
    },
    courses: [UserCourse.schema],
    events: [Event.schema],
});

const User = mongoose.model('user', userSchema);

export default User;