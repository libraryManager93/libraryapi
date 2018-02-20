const express= require('express');
const app= express();
const router= express.Router();
const bookRequestController = require('../../controllers/bookRequests')

router.route('/bookRequests')
    .get(bookRequestController.getBookRequests)
    .post(bookRequestController.addBookRequests)
    .put(bookRequestController.editBookRequests)// Approve or Reject or Lend
    .delete(bookRequestController.deleteBookRequests);
module.exports=router;