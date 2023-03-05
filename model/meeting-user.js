import mongoose from 'mongoose';

const meetingUserSchema = new mongoose.Schema({
    socketId: {
        type: String,
    },
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
    },
    userId: {
        type: String,
        required: true,
    },
    joined: {
        type: Boolean,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    isAlive: {
        type: Boolean,
        required: true,
    },
},
    {timestamps: true}
);

const MeetingUser = mongoose.model('MeetingUser', meetingUserSchema);

export default MeetingUser;



