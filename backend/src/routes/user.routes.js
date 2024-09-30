import { Router } from "express"
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(verifyJWT, logoutUser)
router.route('/profile').get(verifyJWT, getCurrentUser)
router.route('/change-password').patch(verifyJWT, changeCurrentPassword)
router.route('/update-details').put(verifyJWT, updateAccountDetails)
router.route('/refreshToken').post(refreshAccessToken)

export default router

