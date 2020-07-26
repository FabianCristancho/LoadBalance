const express = require('express');
const dbConnection = require('../db/dbConnection');
const axios = require('axios');
const formData = require('form-data');
const fs = require('fs');
const connection = dbConnection();
var pathImage = "";

const router = express.Router();

router.get('/', (req,res) =>{
     connection.query("SELECT * FROM images", (err, rows)=>{
          if(err) throw err;
          res.render('index' ,{rows, pathImage});
     });
});

router.get('/image', (req,res) => {
     console.log("entra");
     console.log(req.query);
     pathImage = req.query.server +"/" +req.query.code;
     console.log(pathImage);
     res.redirect('/');
})

router.post('/upload', (req, res) => {
     if(req.file == null){
          console.log('Debe proporcionar un archivo');
     }else{
          console.log("Nombre de archivo");
          console.log(req.file.filename);
          console.log("Tamaño imagen: " +req.file.size);
          console.log("Nombre original");
          console.log(req.file.originalname);
          originalName = req.file.originalname;
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
               let lowerSize = getLowerSize(res[0], res[1], res[2]);
               let serverLower = getLowerServer(res[0], res[1], res[2]);

               if(lowerSize < 9.5e7){
                    form.append('image', fs.createReadStream(req.file.path));
                    // La url para contenedores es: 'http://files:8081/'
                    axios.post('http://localhost:'+serverLower, form, {
                         headers: {
                              'Content-Type': `multipart/form-data; boundary=${form._boundary}`
                         }
                    }).then(function (response) {
                         console.log('La imagen se ha enviado de forma satisfactoria');

                         connection.query("INSERT INTO images(original_name, code_name, size,server) VALUES ('"+req.file.originalname +"','" +req.file.filename +"'," +req.file.size +",'" +serverLower +"')", (err, result) => {
                              if(result){
                                   console.log('Los datos de la donacion se han agregado correctamente');
                              }else{
                                   console.log('Ha ocurrido un problema al insertar los datos de la donacion')
                                   console.log(err);
                              }
                         });

                         console.log(response.data);
                    })
                    .catch(function (response) {
                         console.log(response.data);
                    }); 
                    fs.unlink(req.file.path, (err) => {
                         if(err) throw err;
                         console.log('Limpiando el servidor');
                    });
               }else{
                    console.log("Se ha sobrepasado las 10MB");
               }
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
	       soliciteSizeFile(8083).then((res) => {
               	 array.push(res);
               }).then((res) => {
                    soliciteSizeFile(8084).then((res) => {
                         array.push(res);
                   }).then((res) => {
                        resolve(array);
                   })
	       });
	  });
     });
}

function getLowerServer(sizeServer1, sizeServer2, sizeServer3){
     if(sizeServer1<sizeServer2 && sizeServer1<sizeServer3){
          return "8081";
     }else if(sizeServer2<sizeServer3){
          return "8083";
     }
     return "8084";
}

function getLowerSize(sizeServer1, sizeServer2, sizeServer3){
     if(sizeServer1<sizeServer2 && sizeServer1<sizeServer3){
          return sizeServer1;
     }else if(sizeServer2<sizeServer3){
          return sizeServer2;
     }
     return sizeServer3;
}

module.exports = router;
