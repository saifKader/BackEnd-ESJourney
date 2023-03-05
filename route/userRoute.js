import {Router} from 'express';
import {
    createAccount,
    login,
    logout,
    getUserData
} from "../controller/userController.js";
import {requireAuth} from "../middleware/authMiddleware.js";

const router = Router();

router.post('/signup', createAccount)
router.post('/signin', login)
router.get('/logout', requireAuth, logout)
router.get('/getUserData',requireAuth, getUserData)

export default router