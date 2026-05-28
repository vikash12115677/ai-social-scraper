const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePreferences, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, registerValidation, loginValidation } = require('../middleware/validate');

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/me', authenticate, getMe);
router.put('/preferences', authenticate, updatePreferences);
router.put('/change-password', authenticate, changePassword);

module.exports = router;
