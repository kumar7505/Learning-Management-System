const express = require('express');
const {registerUser, loginUser} = require('../../controllers/auth-controller/index');
const authenticateMiddleWare = require('../../middleware/auth-middleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/check-auth', authenticateMiddleWare, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: "Authenticated user!",
        data: {
            user,
        },
    });
});
module.exports = router; 