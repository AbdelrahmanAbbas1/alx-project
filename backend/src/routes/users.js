const express = require('express');
const router = express.Router();
const { registerUser, loginUser, allUsers, logoutUser } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
// Register User

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/all', verifyToken, allUsers);
router.post('/logout', verifyToken, logoutUser);

module.exports = router;