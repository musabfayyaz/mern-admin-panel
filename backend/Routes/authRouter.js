const { login} = require('../Controllers/authController');
const router = require('express').Router();

router.post('/login', login);
module.exports = router