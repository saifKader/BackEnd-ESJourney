import meetingServices from '../services/meetingService.js';
import { MeetingPayloadEnum } from '../utils/meeting-payload.enum.js';


async function joinMeeting(meetingId, socket, payload, meetingServer) {
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
                    // Set the meetingId in the socket's data object
                    socket.data.meetingId = meetingId;

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

 function forwardConnectionRequest(meetingId, socket, payload, meetingServer) {
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

 function forwardIceCandidate(meetingId, socket, payload, meetingServer) {
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

 function forwardOfferSDP(meetingId, socket, payload, meetingServer) {
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

 function forwardAnswerSDP(meetingId, socket, payload, meetingServer) {
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

function userLeft(meetingId, socket, payload, meetingServer) {
    const { userId } = payload.data;
    socket.disconnect()
    meetingServices.removeMeetingUser({ meetingId, userId }, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
    console.log('User left:', userId);
    broadcastUsers(meetingId, socket, meetingServer, {
      type: MeetingPayloadEnum.USER_LEFT,
      data: {
        userId: userId,
      },
    });
  }

//end meeting and remove zombie sockets
async function endMeeting(meetingId, socket, payload, meetingServer) {
    var i = 0;
    const { userId } = payload.data;
    const userPromise = new Promise((resolve, reject) => {
      meetingServices.getMeetingUser({ meetingId, userId }, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    userPromise.then(async (results) => {
      if (results && results.isHost) {
        // If the user leaving is the host, end the meeting for all users
        broadcastUsers(meetingId, socket, meetingServer, {
          type: MeetingPayloadEnum.MEETING_ENDED,
          data: {
            userId: payload.data.userId,
          },
        });
        const socketsInMeeting = meetingServer.sockets.adapter.rooms.get(`meeting-${meetingId}`);
        if (socketsInMeeting) {
            for (const socketId of socketsInMeeting) {
                console.log('Disconnecting socket:', socketId);
                meetingServer.sockets.sockets.get(socketId).disconnect(true);
              }
        }
        meetingServer.sockets.adapter.rooms.delete(`meeting-${meetingId}`);
      } else {
        userLeft(meetingId, socket, payload, meetingServer);
    
      }
    }).catch((err) => {
      console.error(err);
    });
  }
  
  
 function forwardEvent(meetingId, socket, payload, meetingServer) {
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
                        // Set the socket.data object here
                        socket.data = { meetingId, userId };
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
                        // Set the socket.data object here
                        socket.data = { meetingId, userId };
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
/*function broadcastUsers(meetingId, socket, meetingServer, payload) {
    const socketsInMeeting = meetingServer.sockets.adapter.rooms.get(`meeting-${meetingId}`);
console.log('socketsInMeeting',socketsInMeeting);
    if (socketsInMeeting) {
        console.log('sayeb zebi')
      socketsInMeeting.forEach((_, socketId) => {
        if (socketId !== socket.id) {
            console.log('ena howa');
          meetingServer.to(socketId).emit('message', JSON.stringify(payload));
        }
      });
    }
  }*/
function broadcastUsers(meetingId, socket, meetingServer, payload) {
    socket.broadcast.to(`meeting-${meetingId}`).emit('message', JSON.stringify(payload));
}


export{
    joinMeeting,
    forwardConnectionRequest,
    forwardIceCandidate,
    forwardOfferSDP,
    forwardAnswerSDP,
    userLeft,
    endMeeting,
    forwardEvent
}

