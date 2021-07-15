const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const upload = multer();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express' });
});



module.exports = router;
