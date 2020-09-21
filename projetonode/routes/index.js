const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

const imageMiddleware = require('../middlewares/imageMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', homeController.index);

router.get('/users/login', userController.login);
router.post('/users/login', userController.loginAction);

router.get('/users/register', userController.register);
router.post('/users/register', userController.registerAction);

router.get('/profile', authMiddleware.isLogged, userController.profile);
router.post('/profile', authMiddleware.isLogged, userController.profileAction);

router.post('/profile/password', authMiddleware.isLogged, authMiddleware.changePassword);

router.get('/users/logout', userController.logout);

router.get('/post/add', authMiddleware.isLogged, postController.add);
router.post('/post/add',
    authMiddleware.isLogged,
    imageMiddleware.upload,
    imageMiddleware.resize,
    postController.addAction
);   
    
router.get('/post/:slug/edit', authMiddleware.isLogged, postController.edit);  
 
router.post('/post/:slug/edit',
    authMiddleware.isLogged,      
    imageMiddleware.upload,
    imageMiddleware.resize,
    postController.editAction 
); 
 
router.get('/post/:slug', postController.view);

module.exports = router;  
 