import {Router} from 'express'
import {startMeeting, checkMeetingExists, getAllMeetingUsers} from "../controller/meetingController.js";

const router = Router();
router.post('/start', startMeeting);
router.get('/join', checkMeetingExists);

router.get('/get', getAllMeetingUsers);


export default router