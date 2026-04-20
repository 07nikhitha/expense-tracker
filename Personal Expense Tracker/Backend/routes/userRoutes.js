const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/allUsers', userController.getAllUsers);
router.get('/getUser/:id', userController.getUserById);
router.post('/register', userController.createUser);
router.post('/login', userController.checkUser);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.get('/publicUsers',userController.getPublicUsers);

module.exports = router;
