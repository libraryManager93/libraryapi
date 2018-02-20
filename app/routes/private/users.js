const express= require('express');
const app= express();
const router= express.Router();
const userController = require('../../controllers/users')

router.route('/users')
    .get(userController.getUsers)
    .post(userController.addUsers)
    .put(userController.editUsers)
    .delete(userController.deleteUsers);
module.exports=router;