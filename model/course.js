import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    module: {
        type: String, required: true, trim: true,
    }, title: {
        type: String, required: true, trim: true,
    }, grade: {
        type: Number, required: true,
    }, /*icon: {
        type: String, required: true,
    }, image: {
        type: String, required: true,
    },*/ estimatedTime: {
        type: String, required: true,
    }, words: {
        type: Array, required: true,
    }, definitions: {
        type: Array, required: true,
    },

});

const Course = mongoose.model('course', courseSchema);

export default Course;