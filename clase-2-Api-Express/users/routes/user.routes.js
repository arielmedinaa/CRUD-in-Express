import express from 'express';
import multer from 'multer';
import { getAllUsers, createUser, importUserExcel, deleteUser } from '../controller/user.controller.js';

const router = express.Router();

const upLoad = multer({
    dest: 'uploads/'
});

router.post('/users', createUser);
router.post('/usersList', getAllUsers);
router.post('/importUserExcel', upLoad.single('file'), importUserExcel);
router.delete('/users/:idUser', deleteUser);

export default router;