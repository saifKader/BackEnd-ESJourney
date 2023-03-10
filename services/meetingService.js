import meeting from "../model/meeting.js";
import meetingUser from "../model/meeting-user.js";

const meetingService = {
    getAllMeetingUsers: async function (meetId, callback){
        meetingUser.find({meetingId: meetId})
            .then((response) => {
                console.log('here2', response);
                return callback(null,response);
            })
            .catch((err) => {
                return callback(err);
            });
    },
    startMeeting: async function (params, callback) {
        const meetingSchema = new meeting(params);
        meetingSchema
            .save()
            .then((response) => {
                
                return callback(null,response);
            })
            .catch((err) => {
                return callback(err);   
            });
    },
    joinMeeting: async function (params,callback){
        const meetingUserModel = new meetingUser(params);
    
        meetingUserModel
        .save()
        .then(async (response) => {
            await meeting.findOneAndUpdate({id: params.meetingId}, {$addToSet:{'meetingUsers':meetingUserModel}});
            console.log('Meeting updated');
            return callback(null,response); 
        })
            
        .catch((err) => {
            console.log('Error', err);
            return callback(err);
        })
    },
    
    isMeetingPresent: async function (meetingId, callback){
        meeting.findById(meetingId)
            .populate('meetingUsers','MeetingUser')
            .then((response) => {
                if(!response) callback('Invalid Meeting Id');
                else callback(null,true);
            })
            .catch((err) => {
                return callback(err,false);
            });
    },
    checkMeetingExists: async function (meetingId, callback){
        //meeting.findById(meetingId,"hostId,hostName,startTime")
        meeting.findById(meetingId)
            .populate('meetingUsers','MeetingUser')
            .then((response) => {
                if(!response) callback('Invalid Meeting Id');
                else callback(null,response);
            })
            .catch((err) => {
                return callback(err,false);
            });
    },
    getMeetingUser: async function (params,callback){
        const {meetingId,userId} = params;
        meetingUser.find({meetingId,userId})
            .then((response) => {
                return callback(null,response[0]);
            })
            .catch((err) => {
                return callback(err);
            });
    },
    updateMeetingUser: async function (params,callback){
        meetingUser
            .updateOne({userId: params.userId},{$set: params}, {new: true})
            .then((response) => {
                return callback(null,response);
            })
            .catch((err) => {
                return callback(err);
            });
    },
    getUserBySocketId: async function (params,callback){
        const {meetingId,socketId} = params;
        meetingUser
            .find({meetingId,socketId})
            .limit(1)
            .then((response) => {
                return callback(null,response);
            })
            .catch((err) => {
                return callback(err);
            });
    },
};

export default meetingService;
