// --------------------------------------------------------------
// Servidor: Crear Base de Datos
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
const { Client } = require('pg');

/* GET home page. */
router.get('/crear_base_datos', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    var num_e = search_params.get('empre');
    var creada = search_params.get('creada');

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

        empresas.push({ num_empre, nombre, pin, imagen, correo_user: correo_user, driver, cadena_conexion, usuario, password, host, base_datos, admin_pas });
    }

    fichero.cerrarFichero();

    var existe = await checkDatabaseExists(empresas[num_e].base_datos, empresas[num_e].host, empresas[num_e].usuario, empresas[num_e].password)
    var existe_str;

    if (existe == true) {
        existe_str = 'true';
    }
    else {
        existe_str = 'false';
    }

    var content;
    fs.readFile('./views/crear_base_datos.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { copyrigth, num_e, creada, existe_str, empre: empresas[num_e] }));
    });

});

router.post('/crear_base_datos', async function (req, res, next) {

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

        empresas.push({ num_empre, nombre, pin, imagen, correo_user: correo_user, driver, cadena_conexion, usuario, password, host, base_datos, admin_pas });
    }

    fichero.cerrarFichero();

    var descri_error = '';
    var errores = false;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    var posi = req.body.posicion;
    var admin_pass = req.body.contrass;

    // Create a new PostgreSQL client
    const client = new Client({
        host: empresas[posi].host,
        port: 5432, // default PostgreSQL port
        user: empresas[posi].usuario,
        password: empresas[posi].password,
        database: 'postgres'
    });

    if (empresas[posi].usuario=='' || empresas[posi].password=='') {

        descri_error += "-- Usuario o Contaseña Incorrecta.\r\n";
        errores = true;

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);

        res.send('');

        return;
    }

    // Connect to the PostgreSQL database

    try {

        await client.connect().then(async () => {

            var creada;

            const createDatabaseQuery = 'CREATE DATABASE ' + empresas[posi].base_datos + ";";

            // Creamos la Base de Datos

            await client.query(createDatabaseQuery);

        });

    } catch {

        descri_error += "-- Usuario o Contaseña Incorrecta.\r\n";
        errores = true;

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);

        res.send('');

        return;
    }

    // Creacion de las tablas

    const client2 = new Client({
        host: empresas[posi].host,
        port: 5432, // default PostgreSQL port
        user: empresas[posi].usuario,
        password: empresas[posi].password,
        database: empresas[posi].base_datos
    });

    // Connect to the PostgreSQL database

    await client2.connect().then(async () => {

        const sqlFile = fs.readFileSync("../" + aplicacion + "/local/analiticaWeb.sql", 'utf-8');

        // Creamos las Tablas

        await client2.query(sqlFile);

        client2.end();

    });

    res.send('');

});

async function checkDatabaseExists(databaseName, host, user, pass) {

    const client = new Client({
        host: host,
        port: 5432, // default PostgreSQL port
        user: user,
        password: pass,
        database: 'postgres'
    });

    if (user == '' || pass == '') {
        return false;
    }

    try {
        await client.connect();
    } catch {
        return false;
    }

    try {
        // Query the pg_database table to check if the database exists
        const query = `SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`;
        const values = [databaseName];
        const result = await client.query(query, values);
        return result.rowCount > 0;
    } catch (error) {
        console.log('Error checking database existence:', error);
        return false;
    } finally {
        await client.end();
    }
}

module.exports = router;