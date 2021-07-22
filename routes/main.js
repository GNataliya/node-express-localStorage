const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const upload = multer();


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('main', { title: 'Express' });
});

// вынести в модуль
router.get('/product/list', (req, res) => {

  const itemsList = [
    {id: '1', title: 'Salad', price: 5, img: 'images/lettuce-salad.jpg' },
    {id: '2', title: 'Tomatoes', price: 8, img: 'images/tomatoes.jpg' },
    {id: '3', title: 'Meat', price: 26, img: 'http://localhost:8000/images/meat.jpg' },
  ];

  res.json(itemsList);
})


module.exports = router;
