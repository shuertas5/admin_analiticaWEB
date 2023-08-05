// --------------------------------------------------------------
// Servidor: Pantalla de Analiticas Detalle
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const rutinas = require('../treu/rutinas_server.js');
const treu = require('../treu/treu_file.js');
const formato = require('../treu/formato.js')

/* GET home page. */
router.get('/analiticas_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
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

        empresas.push({ num_empre, nombre, pin, imagen, correo_user, driver, cadena_conexion, usuario, password, host, base_datos, admin_pas });
    }

    fichero.cerrarFichero();

    var content;
    fs.readFile('./views/analiticas_detalle.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        if (opcion == "alta") {
            num_e = -1;
            res.send(pug.render(content, { copyrigth, opcion, num_e, empre: { num_empre: "", nombre: "", pin: "", imagen: "", driver: "", cadena_conexion: "", usuario: "", password: "", host: "", base_datos: "", admin_pas: "" } }));
        }
        else {
            res.send(pug.render(content, { copyrigth, opcion, num_e, empre: empresas[num_e] }));
        }
    });

});

router.post('/analiticas_detalle', async function (req, res, next) {

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
        var contrasena = fichero.valorSerie(3);
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

        empresas.push({ num_empre, nombre, pin, imagen, correo_user, driver, cadena_conexion, usuario, password, host, base_datos, admin_pas });
    }

    fichero.cerrarFichero();

    var descri_error = '';
    var errores = false;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var posi = req.body.posicion;
    var opcion = req.body.opcionx;
    var numero_empre = req.body.clave;
    var nombre = req.body.nombre;
    var pin = req.body.contrase;
    var imagen = req.body.imagen;
    var correo_user = req.body.correo_user;
    var driver = req.body.driver;
    var cadena_conexion = req.body.conexion;
    var usuario_db = req.body.usuario_db;
    var contrase_db = req.body.contrase_db;
    var nombre_db = req.body.nombre_db;
    var host = req.body.servidor_db;
    var admin_pas = req.body.admin_pas;

    if (opcion == "modi") {
        empresas[posi] = { num_empre: numero_empre, nombre: nombre, pin: pin, imagen: imagen, correo_user: correo_user, driver: driver, cadena_conexion: cadena_conexion, usuario: usuario_db, password: contrase_db, host: host, base_datos: nombre_db, admin_pas: admin_pas };
    } else if (opcion == "alta") {
        empresas.push({ num_empre: numero_empre, nombre: nombre, pin: pin, imagen: imagen, correo_user: correo_user, driver: driver, cadena_conexion: cadena_conexion, usuario: usuario_db, password: contrase_db, host: host, base_datos: nombre_db, admin_pas: admin_pas });
    } else if (opcion == "baja") {
        numero_empre = -1;
        empresas[posi] = { num_empre: numero_empre, nombre: nombre, pin: pin, imagen: imagen, correo_user: correo_user, driver: driver, cadena_conexion: cadena_conexion, usuario: usuario_db, password: contrase_db, host: host, base_datos: nombre_db, admin_pas: admin_pas };
    }

    if (opcion == "alta" || opcion == "modi" || opcion == 'baja') {

        fichero = new treu.TreuFile("../" + aplicacion + "/datos_texto/empresas_analiticas.ini");
        fichero.abrirFichero("w");

        fichero.setDelimitado(true);
        fichero.setComillas(true);
        fichero.setSeparador(',');

        for (var i = 0; i < empresas.length; i++) {

            if (empresas[i].num_empre == -1) continue;

            fichero.grabarCampoNumero(empresas[i].num_empre, "######", false);
            fichero.grabarCampoSerie(empresas[i].nombre, false);
            fichero.grabarCampoSerie(empresas[i].pin, false);
            fichero.grabarCampoSerie(empresas[i].imagen, false);
            fichero.grabarCampoSerie(empresas[i].correo_user, false);
            fichero.grabarCampoSerie(empresas[i].driver, false);
            fichero.grabarCampoSerie(empresas[i].cadena_conexion, false);
            fichero.grabarCampoSerie(empresas[i].usuario, false);
            fichero.grabarCampoSerie(empresas[i].password, false);
            fichero.grabarCampoSerie(empresas[i].host, false);
            fichero.grabarCampoSerie(empresas[i].base_datos, false);
            fichero.grabarCampoSerie(empresas[i].admin_pas, true);
            fichero.grabarBuffer();

        }

        fichero.cerrarFichero();

        res.send('');

    }
    else {
        res.send('');
    }

});

module.exports = router;