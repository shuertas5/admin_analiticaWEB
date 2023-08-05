// --------------------------------------------------------------
// Servidor: Ejecutar Script SQL
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
router.get('/ejecutar_script_sql', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    var num_e = search_params.get('empre');
    var ejecutada = search_params.get('ejecutada');

    var rows = [];
    var empresas = [];

    var fecha = new Date();

     if (ejecutada != 'true') {

        fichero = new treu.TreuFile("./temporal/salida_script.txt");
        fichero.abrirFichero("w");
        fichero.cerrarFichero();

    }

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

    const files = fs.readdirSync("../" + aplicacion + "/local/");

    // Filter SQL files
    const sqlFiles = files.filter(file => path.extname(file) === '.sql');

    var files_script = [];

    // Process each SQL file
    sqlFiles.forEach(sqlFile => {
        if (sqlFile != 'analiticaWeb.sql') {
            files_script.push(sqlFile);
        }
    });

    const file_content = fs.readFileSync("./temporal/salida_script.txt", 'utf-8');

    var content;
    fs.readFile('./views/ejecutar_script_sql.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { copyrigth, num_e, ejecutada, files_script, file_content, empre: empresas[num_e] }));
    });

});

router.post('/ejecutar_script_sql', async function (req, res, next) {

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
    var file_script = req.body.script;

    // Create a new PostgreSQL client
    const client = new Client({
        host: empresas[posi].host,
        port: 5432, // default PostgreSQL port
        user: empresas[posi].usuario,
        password: empresas[posi].password,
        database: 'postgres'
    });

    if (empresas[posi].usuario == '' || empresas[posi].password == '') {

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

            client.end();

        });

    } catch {

        descri_error += "-- Usuario o Contaseña Incorrecta o DB No Existe.\r\n";
        errores = true;

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);

        res.send('');

        return;
    }

    // Ejecucion Comando

    const client2 = new Client({
        host: empresas[posi].host,
        port: 5432, // default PostgreSQL port
        user: empresas[posi].usuario,
        password: empresas[posi].password,
        database: empresas[posi].base_datos
    });

    // Connect to the PostgreSQL database

    await client2.connect().then(async () => {

        const sqlFile = fs.readFileSync("../" + aplicacion + "/local/" + file_script, 'utf-8');

        // Creamos las Tablas

        const resultado = await client2.query(sqlFile);

        fs.writeFileSync("./temporal/salida_script.txt", JSON.stringify(resultado), 'utf-8');

        client2.end();

    });

    res.send('');

});

module.exports = router;