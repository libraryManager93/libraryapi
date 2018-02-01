const express= require('express');
const app= express();
const router= express.Router();
const booksController = require('../../controllers/books')

router.route('/getAllBooks')
    .get(booksController.getAllBooks)

    module.exports=router;