const express= require('express');
const app= express();
const router= express.Router();
const booksController = require('../../controllers/books')
const userController = require('../../controllers/users')

router.route('/getAllBooks')
    .get(booksController.getAllBooks)
router.route('/authenticate')
    .post(userController.authenticateUser);
    module.exports=router;