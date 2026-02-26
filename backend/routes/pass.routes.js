const express = require('express');
const { getMyPass } = require('../controllers/pass.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/my-pass', getMyPass);

module.exports = router;
