import * as meetingHelper from './utils/meeting-helper.js';
import { MeetingPayloadEnum } from './utils/meeting-payload.enum.js';
import { Server } from 'socket.io';


function parseMessage(message) {
    try {
        const payload = JSON.parse(message);
        return payload;
    } catch (err) {
        return { type: MeetingPayloadEnum.UNKNOWN };
    }
}

function listenMessage(meetingId, socket, meetingServer) {
    console.log('part1');
    socket.on('message', (message) => handleMeetingMessage(meetingId, socket, message, meetingServer));
    console.log('part2');
}  

function handleMeetingMessage(meetingId, socket, message, meetingServer) {
    console.log('part3');
    console.log('Received message:', message);
    var payload = "";

    if (typeof message === 'string') {
        payload = parseMessage(message);
        console.log('part4')
    }
    else {
        payload = message;
    }
    console.log('Payload:', payload);
    switch (payload.type) {
        case MeetingPayloadEnum.JOIN_MEETING:
            console.log('part 5')
            meetingHelper.joinMeeting(meetingId, socket, payload, meetingServer);
            break;
        case MeetingPayloadEnum.CONNECTION_REQUEST:
            meetingHelper.forwardConnectionRequest(meetingId, socket, payload, meetingServer);
            break;
        case MeetingPayloadEnum.OFFER_SDP:
            meetingHelper.forwardOfferSDP(meetingId, socket, payload, meetingServer);
            break;
        case MeetingPayloadEnum.ICECANDIDATE:
            meetingHelper.forwardIceCandidate(meetingId, socket, payload, meetingServer);
            break;
        case MeetingPayloadEnum.ANSWER_SDP:
            meetingHelper.forwardAnswerSDP(meetingId, socket, payload, meetingServer);
            break;
        case MeetingPayloadEnum.LEAVE_MEETING:
            meetingHelper.userLeft(meetingId, socket, payload, meetingServer);
            break;
        case MeetingPayloadEnum.END_MEETING:
            meetingHelper.endMeeting(meetingId, socket, payload, meetingServer);
            break;
        case MeetingPayloadEnum.VIDEO_TOGGLE:
        case MeetingPayloadEnum.AUDIO_TOGGLE:
            meetingHelper.forwardEvent(meetingId, socket, payload, meetingServer);
            break;
        case MeetingPayloadEnum.UNKNOWN:
            break;
        default:
            break;
    }
}

export function initMeeting(server) {
    const meetingServer = new Server(server);
    meetingServer.on('connect', (socket) => {
      const meetingId = socket.handshake.query.id;
      socket.join(meetingId)
      console.log('User connected to meeting:', meetingId);
      console.log("users in meeting: ", meetingServer.sockets.adapter.rooms.get(meetingId).size);
      listenMessage(meetingId, socket, meetingServer);
    });
}
