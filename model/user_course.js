import mongoose from 'mongoose';

const userCourseSchema = new mongoose.Schema({
    courseId: {
        type: String, required: true,
    }, words: {
        type: Array, required: true,
    }, definitions: {
        type: Array, required: true,
    },

});

const UserCourse = mongoose.model('userCourse', userCourseSchema);

export default UserCourse;