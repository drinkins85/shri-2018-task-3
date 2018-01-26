const express = require('express');
const router = express.Router();
const { index } = require('./controllers');

router.get('/', index);
router.get('/add-event(/*)?', index);

module.exports = router;
