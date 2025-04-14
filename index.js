import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js"
import checkAuth from "./utils/checkAuth.js"
import { getMe, login, register } from "./controllers/UserController.js"
import { create, getAll, getOne, remove, update, getLastTags } from "./controllers/PostController.js"
import handleValidationErrors from './utils/handleValidationErrors.js';

// "mongodb+srv://admin:123@cluster0.j8sfs60.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(`DB ok`))
    .catch((error) => console.log(`DB error ${error}`))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json())
app.use(cors());

app.use('/uploads', express.static('uploads'));

app.post("/auth/register", registerValidation, handleValidationErrors, register)
app.post("/auth/login", loginValidation, handleValidationErrors, login)
app.get("/auth/me", checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', getAll);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch(
    '/posts/:id',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    update,
);
app.get('/posts/tags', getLastTags);
app.get('/tags', getLastTags);
app.listen(4444, () => {
    console.log(`http://localhost:4444`)
})