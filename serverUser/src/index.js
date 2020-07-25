const express = require('express')
const path = require('path');
const indexRoutes = require('./routes/index');
const multer = require('multer');
const uuid = require('uuid');


const storage = multer.diskStorage({
     destination: path.join(__dirname, '/public'),
     filename: (req, file, cb) => {
         cb(null, uuid.v4() + path.extname(file.originalname).toLowerCase());
     }
 });

const app = express()
const port = 3000

//settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '../public'));

//middleware
app.use(multer({
     storage,
     fileFilter: (req, file, cb) => {
         const filetypes = /jpeg|jpg|PNG|png/
         const mimetype = filetypes.test(file.mimetype);
         const extname = filetypes.test(path.extname(file.originalname));
         if(mimetype && extname){
             return cb(null, true);
         }
         cb("Error: Archivo debe ser una imagen valida");
     }
 }).single('image'));
app.use(express.urlencoded({extended: false}));


//routes
app.use('/', indexRoutes);


app.listen(port, () => console.log(`Server listening on port ${port}!`))