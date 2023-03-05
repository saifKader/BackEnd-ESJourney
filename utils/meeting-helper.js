import meetingServices from '../services/meetingService.js';
import { MeetingPayloadEnum } from '../utils/meeting-payload.enum.js';



export default async function joinMeeting (meetingId, socket, payload, meetingServer) {
    const { userId, name } = payload.data;

    meetingServices.isMeetingPresent(meetingId, async (err, results) => {
        if (err && !results) {
            sendMessage(socket, {
                type: MeetingPayloadEnum.NOT_FOUND,
            });
        }
        if (results) {
            addUser(socket, { meetingId, userId, name }).then((result) => {
                if (result) {
                    sendMessage(socket, {
                        type: MeetingPayloadEnum.JOINED_MEETING, data: {
                            userId
                        }
                    });
                    broadcastUsers(meetingId, socket, meetingServer, {
                        type: MeetingPayloadEnum.USER_JOINED,
                        data: {
                            userId,
                            name,
                            ...payload.data
                        }
                    });
                }
            }, (err) => {
                console.log(err);
            });
        }
    });


}
export function forwardConnectionRequest(meetingId, socket, payload, meetingServer) {
    const { userId, name, otherUserId } = payload.data;

    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };
    meetingServices.getMeetingUser(model, (err, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.CONNECTION_REQUEST,
                data: {
                    userId,
                    name,
                    ...payload.data
                }
            });
            meetingServer.to(results.socketId).emit('message', sendPayload);
        }
    });

}

export function forwardIceCandidate(meetingId, socket, payload, meetingServer) {
    const { userId, candidate, otherUserId } = payload.data;

    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };
    meetingServices.getMeetingUser(model, (err, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ICECANDIDATE,
                data: {
                    userId,
                    candidate
                }
            });
            meetingServer.to(results.socketId).emit('message', sendPayload);
        }
    });

}

export function forwardOfferSDP(meetingId, socket, payload, meetingServer) {
    const { userId, sdp, otherUserId } = payload.data;

    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };
    meetingServices.getMeetingUser(model, (err, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.OFFER_SDP,
                data: {
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit('message', sendPayload);
        }
    });

}

export function forwardAnswerSDP(meetingId, socket, payload, meetingServer) {
    const { userId, sdp, otherUserId } = payload.data;

    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };
    meetingServices.getMeetingUser(model, (err, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ANSWER_SDP,
                data: {
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit('message', sendPayload);
        }
    });

}

export function userLeft(meetingId, socket, payload, meetingServer) {
    const { userId } = payload.data;

    broadcastUsers(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.USER_LEFT,
        data: {
            userId: userId
        }
    });

}

export function endMeeting(meetingId, socket, payload, meetingServer) {
    const { userId } = payload.data;

    broadcastUsers(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.MEETING_ENDED,
        data: {
            userId: userId
        }
    });
    meetingServices.getAllMeetingUsers(meetingId, (err, results) => {
        for (let i = 0; i < results.length; i++) {
            const meetingUser = results[i];
            meetingServer.sockets.connected[meetingUser.socketId].disconnect();
        }
    });
}

export function forwardEvent(meetingId, socket, payload, meetingServer) {
    const { userId } = payload.data;

    broadcastUsers(meetingId, socket, meetingServer, {
        type: payload.type,
        data: {
            userId: userId,
            ...payload.data
        }
    });

}

function addUser(socket, { meetingId, userId, name }) {
    let promise = new Promise(function (resolve, reject) {
        meetingServices.getMeetingUser({ meetingId, userId }, (err, results) => {
            if (!results) {
                var model = {
                    socketId: socket.id,
                    meetingId: meetingId,
                    userId: userId,
                    joined: true,
                    name: name,
                    isAlive: true,
                };
                meetingServices.joinMeeting(model, (err, results) => {
                    if (results) {
                        resolve(true);
                    }
                    if (err) {
                        reject(err);
                    }
                });
            }
            else {
                meetingServices.updateMeetingUser({
                    userId: userId,
                    socketId: socket.id,
                }, (err, results) => {
                    if (results) {
                        resolve(true);
                    }
                    if (err) {
                        reject(err);
                    }
                });
            }
        });
    });
    return promise;
}

function sendMessage(socket, payload) {
    socket.send(JSON.stringify(payload));
}
function broadcastUsers(meetingId, socket, meetingServer, payload) {
    socket.broadcast.emit('message', JSON.stringify(payload));
}

