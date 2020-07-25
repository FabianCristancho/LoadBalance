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
          console.log("Nombre de archivo");
          console.log(req.file.filename);
          nameImage = req.file.filename;
          const form = new formData();

          /*
          soliciteSizeFile(8081).then((res) => {
               console.log("Tam1: " +res);
          });*/

          getSizeServersFolder().then((res) => {
               console.log("Tam server1: " +res[0]);
               console.log("Tam server2: " +res[1]);
               console.log("Tam server3: " +res[2]);
          })

          /*
          axios.get('http://localhost:8081/sizeFolder').then(function (response) {
               console.log('Recibido tamaño de archivo');
               console.log(response.data);
          })
          .catch(function (response) {
               console.log(response.data);
          });*/
          /*
          form.append('image', fs.createReadStream(req.file.path));
          // La url para contenedores es: 'http://files:8081/'
          axios.post('http://localhost:8081/', form, {
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
          });*/
     }
     res.redirect('/');
});

function soliciteSizeFile(server){
     return new Promise(function(resolve, reject){
          let size = 0;
          axios.get('http://localhost:'+server+'/sizeFolder').then(function (response) {
               console.log('Recibido tamaño de archivo, server '+server);
               console.log(response.data);
               size = parseInt(response.data, 10);
               resolve(size);
          })
          .catch(function (response) {
               console.log(response.data);
          });
          
     });
}

function getSizeServersFolder(){
     return new Promise(function(resolve, reject){
          let array = [];
          soliciteSizeFile(8081).then((res) => {
               array.push(res);
          }).then((res) => {
	       soliciteSizeFile(8082).then((res) => {
               	 array.push(res);
               }).then((res) => {
                    soliciteSizeFile(8083).then((res) => {
                         array.push(res);
                   }).then((res) => {
                        resolve(array);
                   })
	       });
	  });
     });
}

function getLowerSize(sizeServer1, sizeServer2, sizeServer3){
     if(sizeServer1<sizeServer2 && sizeServer1<sizeServer3){
          return "8081";
     }else if(sizeServer2<sizeServer3){
          return "8082";
     }
     return "8083";
}

module.exports = router;
