const express = require('express');
const router = express.Router();
const { index } = require('./controllers');

router.get('/', index);
router.get('/form', index);

module.exports = router;
