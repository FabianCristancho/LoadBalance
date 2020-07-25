const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const bodyparser = require('body-parser');
const port = 8081;

app.get('/', (req, res) => {
     res.send('Servidor activo');
});

const storage = multer.diskStorage({
     destination: path.join(__dirname, 'public/uploads'),
     filename: (req, file, cb) => {
          cb(null, file.originalname);
     }
})

app.use(multer({
     storage,
     dest: path.join(__dirname, 'public/uploads')
 }).single('image'))


app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.post("/", (request, response) => {
     console.log('--------------Server has heard---------------');
     console.log(request.file );
     response.send('Received data');
 });


 //METODO ESTA SIRVIENDO BIEN
// app.post("/", (request, response) => {
//      console.log('--------------Server has heard---------------');
//      console.log('My name is ' +request.body.firstName +" " +request.body.lastName +", i am " +request.body.age +" years old, and i live in " +request.body.city);
//      response.send('Received data');
//  });

// const storage = multer.diskStorage({
//      destination: path.join(__dirname, '../public/uploads'),
//      filename: (req, file, cb) => {
//          cb(null, file.originalname);
//      }
//  });

 //settings
// app.set('port', process.env.PORT || 8081);



//  app.post('/', (req, res) => {
//      console.log('Proceso Exitoso');
//      console.log(req.file);
// });

app.listen(port, function(){
     console.log('Servidor funcionando en el puerto ' +port);
});