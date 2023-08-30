const express = require('express');
const v1 = require('./v1/routes');
const v2 = require('./v2/routes');

const router = express.Router();

router.use('/v1', v1);
router.use('/v2', v2);

module.exports = router;
