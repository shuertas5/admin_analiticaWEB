// --------------------------------------------------------------
// Servidor: Pantalla de Entrada
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const rutinas = require('../treu/rutinas_server.js');
const treu = require('../treu/treu_file.js');

/* GET home page. */
router.get('/acceso', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    var recuperado = search_params.get('recuperado');

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

    }

    fichero.cerrarFichero();

    var content;
    fs.readFile('./views/acceso.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { recuperado, rows: rows }));
    });

});


router.post('/acceso', async function (req, res, next) {

    var contrasena = req.body.contrasena;

    var empresas = [];

    var fichero;

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
        var contrasenax = fichero.valorSerie(3);
        var email = fichero.valorSerie(4);

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

        empresas.push({num_empre, nombre, pin, imagen, correo_user, cadena_conexion, usuario, password, host, base_datos, admin_pas});
    }

    fichero.cerrarFichero();

    var descri_error = '';
    var errores = false;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    if (contrasena != contrasenax) {

        descri_error += "-- Contraseña Incorrecta\r\n";
        errores = true;

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);

        res.send('');
    }
    else {

        var content;
        fs.readFile('./views/contabilidades.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { empresas: empresas }));
        });

    }

});

module.exports = router;