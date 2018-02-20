const express= require('express');
const app= express();
const router= express.Router();
const borrowedBooksController = require('../../controllers/borrowedBooks')

router.route('/borrowedBooks')
    .get(borrowedBooksController.getborrowedBooks)
    .post(borrowedBooksController.addborrowedBooks)//=====> For direct borrowal
    .put(borrowedBooksController.editborrowedBooks)// =====> Returned 
    .delete(borrowedBooksController.deleteborrowedBooks);
module.exports=router;