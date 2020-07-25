const express = require('express');
const axios = require('axios');
const formData = require('form-data');
const fs = require('fs');

const router = express.Router();
router.get('/', (req,res) =>{
     res.render('index');
});

router.post('/upload', (req, res) => {
     if(req.file == null){
          console.log('Debe proporcionar un archivo');
     }else{
          console.log(req.file.filename);
          nameImage = req.file.filename;
          const form = new formData();

          form.append('image', fs.createReadStream(req.file.path));
          // La url para contenedores es: 'http://files:8081/'
          axios.post('http://files:8081/', form, {
               headers: {
                    'Content-Type': `multipart/form-data; boundary=${form._boundary}`
               }
          }).then(function (response) {
               console.log('La imagen se ha enviado de forma satisfactoria')
               console.log(response.data);
          })
          .catch(function (response) {
               console.log(response.data);
          }); 
          fs.unlink(req.file.path, (err) => {
               if(err) throw err;
               console.log('Limpiando el servidor');
          });
     }
     res.redirect('/');
});

module.exports = router;