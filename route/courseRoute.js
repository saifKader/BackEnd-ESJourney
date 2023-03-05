import {Router} from 'express';
import {createCourse, getCourses, getUserCourses} from "../controller/courseController.js";
import {requireAuth} from "../middleware/authMiddleware.js";
//import multer from "../middleware/multer-config.js";

const router = Router();

router.post('/create', createCourse)
router.get('/getAll', getCourses)
router.get('/get/user', requireAuth, getUserCourses)

export default router