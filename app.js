var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs')
const pug = require('pug');
const url = require('url');
const treu = require('./treu/treu_file');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const puerto = 8080;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/treu', express.static(__dirname + '/treu'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/includes', express.static(__dirname + '/includes'));
app.use('/html', express.static(__dirname + '/html'));
app.use('/temporal', express.static(__dirname + '/temporal'));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.listen(puerto, () => {
    console.log(`Escuchando el puerto: ${puerto}`);
});

// ---------------------------------
// Rutas de pantallas
// ---------------------------------

var contabilidades_Router = require('./routes/server_contabilidades.js');
var acceso_Router = require('./routes/server_acceso.js');
var analiticas_detalle_Router = require('./routes/server_analiticas_detalle.js');
var recuperar_contrasena_Router = require('./routes/server_recuperar_contrasena.js');
var envio_correo_usuario_Router = require('./routes/server_envio_correo_usuario.js');
var crear_base_datos_Router = require('./routes/server_crear_base_datos.js');
var ejecutar_script_sql_Router = require('./routes/server_ejecutar_script_sql.js');

app.use('/contabilidades', contabilidades_Router);
app.use('/acceso', acceso_Router);
app.use('/analiticas_detalle', analiticas_detalle_Router);
app.use('/recuperar_contrasena', recuperar_contrasena_Router);
app.use('/envio_correo_usuario', envio_correo_usuario_Router);
app.use('/crear_base_datos', crear_base_datos_Router);
app.use('/ejecutar_script_sql', ejecutar_script_sql_Router);

app.get('/contabilidades', contabilidades_Router);
app.get('/acceso', acceso_Router);
app.get('/analiticas_detalle', analiticas_detalle_Router);
app.get('/recuperar_contrasena', recuperar_contrasena_Router);
app.get('/envio_correo_usuario', envio_correo_usuario_Router);
app.get('/crear_base_datos', crear_base_datos_Router);
app.get('/ejecutar_script_sql', ejecutar_script_sql_Router);

app.post('/contabilidades', contabilidades_Router);
app.post('/acceso', acceso_Router);
app.post('/analiticas_detalle', analiticas_detalle_Router);
app.post('/recuperar_contrasena', recuperar_contrasena_Router);
app.post('/envio_correo_usuario', envio_correo_usuario_Router);
app.post('/crear_base_datos', crear_base_datos_Router);
app.post('/ejecutar_script_sql', ejecutar_script_sql_Router);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

app.get('/', (req, res) => {

    //res.sendFile(path.resolve(__dirname, 'frontend', '/index'));

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
        res.send(pug.render(content, { copyrigth, rows: rows }));
    });

});

module.exports = app;
