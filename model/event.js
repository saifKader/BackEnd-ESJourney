import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    isDone: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        enum: ['Orientation', 'Project'],
        required: true,
    },
    eventImage: {
        type: String,
        default:'/Users/abdelkaderseifeddine/Documents/GitHub/ESJourney-frontoffice/assets/images/C++event.png'
    },
    location:{
        type: String,   
    },
    requirementsDescription:{
        type: String,
    }
});

const Event = mongoose.model('event',eventSchema);

export default Event;
