const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', homeController.userInfo ,homeController.index);

router.get('/users/login', userController.login);

module.exports = router;
