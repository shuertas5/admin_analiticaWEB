// --------------------------------------------------------------
// Servidor: Envio de Correos a Usuario
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const rutinas = require('../treu/rutinas_server.js');
const treu = require('../treu/treu_file.js');
const formato = require('../treu/formato.js')
const nodemailer = require('nodemailer');
const util = require('util');

/* GET home page. */
router.get('/envio_correo_usuario', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    var num_e = search_params.get('empre');

    var rows = [];
    var empresas = [];

    var fecha = new Date();

    var fichero;

    fichero = new treu.TreuFile("./datos_texto/confi_frontal.txt");
    fichero.abrirFichero("r");

    fichero.setDelimitado(true);
    fichero.setComillas(true);
    fichero.setSeparador(';');

    while (true) {

        var stat = fichero.leerRegistro();
        if (stat == false) {
            break;
        }

        var imagen = fichero.valorSerie(1);
        var copyrigth = fichero.valorSerie(2);
        var site = fichero.valorSerie(3);

    }

    fichero.cerrarFichero();

    fichero = new treu.TreuFile("./datos_texto/parametros.txt");
    fichero.abrirFichero("r");

    fichero.setDelimitado(true);
    fichero.setComillas(true);
    fichero.setSeparador(';');

    while (true) {

        var stat = fichero.leerRegistro();
        if (stat == false) {
            break;
        }

        var aplicacion = fichero.valorSerie(1);
        var usuario = fichero.valorSerie(2);
        var contrasena = fichero.valorSerie(3);
        var email = fichero.valorSerie(4);
        var usuario_gemail = fichero.valorSerie(5);
        var contrasena_gemail = fichero.valorSerie(6);
    }

    fichero.cerrarFichero();

    fichero = new treu.TreuFile("../" + aplicacion + "/datos_texto/empresas_analiticas.ini");
    fichero.abrirFichero("r");

    fichero.setDelimitado(true);
    fichero.setComillas(true);
    fichero.setSeparador(',');

    while (true) {

        var stat = fichero.leerRegistro();
        if (stat == false) {
            break;
        }

        var num_empre = fichero.valorNumero(1)
        var nombre = fichero.valorSerie(2);
        var pin = fichero.valorSerie(3);
        var imagen = fichero.valorSerie(4);
        var correo_user = fichero.valorSerie(5);
        var driver = fichero.valorSerie(6);
        var cadena_conexion = fichero.valorSerie(7);
        var usuario = fichero.valorSerie(8);
        var password = fichero.valorSerie(9);
        var host = fichero.valorSerie(10);
        var base_datos = fichero.valorSerie(11);
        var admin_pas = fichero.valorSerie(12);

        empresas.push({ num_empre, nombre, pin, imagen, correo_user: correo_user, driver, cadena_conexion, usuario, password, host, base_datos,admin_pas });
     }

    fichero.cerrarFichero();

    var content;
    fs.readFile('./views/envio_correo_usuario.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { copyrigth, num_e, empre: empresas[num_e] }));
     });

});

router.post('/envio_correo_usuario', async function (req, res, next) {

    var empresas = [];

    var fichero;

    fichero = new treu.TreuFile("./datos_texto/confi_frontal.txt");
    fichero.abrirFichero("r");

    fichero.setDelimitado(true);
    fichero.setComillas(true);
    fichero.setSeparador(';');

    while (true) {

        var stat = fichero.leerRegistro();
        if (stat == false) {
            break;
        }

        var imagen = fichero.valorSerie(1);
        var copyrigth = fichero.valorSerie(2);
        var site = fichero.valorSerie(3);

    }

    fichero.cerrarFichero();

    fichero = new treu.TreuFile("./datos_texto/parametros.txt");
    fichero.abrirFichero("r");

    fichero.setDelimitado(true);
    fichero.setComillas(true);
    fichero.setSeparador(';');

    while (true) {

        var stat = fichero.leerRegistro();
        if (stat == false) {
            break;
        }

        var aplicacion = fichero.valorSerie(1);
        var usuario = fichero.valorSerie(2);
        var contrasena = fichero.valorSerie(3);
        var email = fichero.valorSerie(4);
        var usuario_gemail = fichero.valorSerie(5);
        var contrasena_gemail = fichero.valorSerie(6);

    }

    fichero.cerrarFichero();

    fichero = new treu.TreuFile("../" + aplicacion + "/datos_texto/empresas_analiticas.ini");
    fichero.abrirFichero("r");

    fichero.setDelimitado(true);
    fichero.setComillas(true);
    fichero.setSeparador(',');

    while (true) {

        var stat = fichero.leerRegistro();
        if (stat == false) {
            break;
        }

        var num_empre = fichero.valorNumero(1)
        var nombre = fichero.valorSerie(2);
        var pin = fichero.valorSerie(3);
        var imagen = fichero.valorSerie(4);
        var correo_user = fichero.valorSerie(5);
        var driver = fichero.valorSerie(6);
        var cadena_conexion = fichero.valorSerie(7);
        var usuario = fichero.valorSerie(8);
        var password = fichero.valorSerie(9);
        var host = fichero.valorSerie(10);
        var base_datos = fichero.valorSerie(11);
        var admin_pas = fichero.valorSerie(12);

        empresas.push({ num_empre, nombre, pin, imagen, correo_user: correo_user, driver, cadena_conexion, usuario, password, host, base_datos,admin_pas });
    }

    fichero.cerrarFichero();

    var descri_error = '';
    var errores = false;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var posi = req.body.posicion;
    var asunto = req.body.asunto;
    var texto = req.body.texto;

    var email = empresas[posi].correo_user;
 
    const transporter = nodemailer.createTransport({
        host: 'shuertas.es',
        port: 465,
        secure: true, // Set to true if using a secure connection (e.g., SSL/TLS)
        tls: {
            ciphers: 'TLSv1.2'
        },
        auth: {
            user: usuario_gemail,
            pass: contrasena_gemail
        }
    });

    // Opciones del correo electrónico
    const mailOptions = {
        from: usuario_gemail,
        to: email,
        subject: asunto,
        text: texto
    };

    var recuperado;

    const sendMailPromise = util.promisify(transporter.sendMail).bind(transporter);

    try {
        const info = await sendMailPromise(mailOptions);
        //console.log('Correo electrónico enviado correctamente:', info.response);
        recuperado = true;
    } catch (error) {
        //console.log('Error al enviar el correo electrónico:', error);
        recuperado = false;
    }

    res.send('');

});

module.exports = router;