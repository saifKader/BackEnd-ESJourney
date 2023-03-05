import {Router} from 'express'
import {createEvent,getEvents,registerEvent,getUserEvents} from "../controller/eventController.js";
import {requireAuth} from "../middleware/authMiddleware.js";
//import multer from "../middleware/multer-config.js";

const router = Router();
router.post('/create', createEvent)
router.get('/getEvents', getEvents)
router.post('/register',requireAuth, registerEvent)
router.get('/getUserEvents',requireAuth, getUserEvents)




export default router