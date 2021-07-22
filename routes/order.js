const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const upload = multer();

router.post('/', upload.none(), async (req, res) => {
    
    const orderData = await req.body;
    console.log(orderData);

    res.json({status: 'ok'});
});

module.exports = router;