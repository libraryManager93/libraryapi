const express= require('express');
const app= express();
const router= express.Router();
const booksController = require('../../controllers/books')

router.route('/book')
    .post(booksController.addBooks)
    .put(booksController.editBooks)
    .delete(booksController.deleteBooks)
module.exports=router;