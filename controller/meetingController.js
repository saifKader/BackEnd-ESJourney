import meetingService from '../services/meetingService.js';

export const startMeeting = (req, res, next) => {
    const {hostId, hostName} = req.body;

    var model = {
        hostId: hostId,
        hostName: hostName,
        startTime: Date.now()
    };

    meetingService.startMeeting(model, (err, results) => {
        if(err) {
        return next(err);
    }
    return res.status(200).send({
        message: "Success",
         data: results.id,
        });
    })
}
export const checkMeetingExists = (req, res,next) => {
    const {meetingId} = req.query;

    meetingService.checkMeetingExists(meetingId, (err, results) => {
        if(err) {
        return next(err);
    }
    return res.status(200).send({
        message: "Success",
        data: results
        });
    })
}

export const getAllMeetingUsers = (req, res, next) => {
    const {meetingId} = req.query;

    meetingService.getAllMeetingUsers(meetingId, (err, results) => {
        if(err) {
        return next(err);
    }
    return res.status(200).send({
        message: "Success",
        data: results
        });
    })
}