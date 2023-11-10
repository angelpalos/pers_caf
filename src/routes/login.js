//se crea una constante y se requiere 'Express'
const express = require('express');
//se crean las contantes para el login, personal y productos
//que obtienen las funciones de cada JS 
const LoginController = require('../controllers/LoginController');
const pedidoController = require('../controllers/pedidoController');
const agregaController = require('../controllers/agregaController');
const detalleController = require('../controllers/detalleController');

const router = express.Router();

//Define las rutas que tendran
router.get('/login', LoginController.index);
router.get('/register', LoginController.register);
router.post('/register', LoginController.storeUser);
router.post('/login', LoginController.auth);
router.get('/logout', LoginController.logout);

router.post('/detalle', pedidoController.detalle);
router.post('/detalle_agrega', pedidoController.detalle_agr);
router.get('/pedidos', pedidoController.pedido);
router.get('/terminado', pedidoController.terminado);
router.get('/pagado', pedidoController.pagado);
router.get('/entregado', pedidoController.entregado);
router.post('/pedidos/marcar', pedidoController.marca);

router.post('/productos', agregaController.indexp);
router.post('/productos/buscar', agregaController.buscar);
router.post('/productos/agrega', agregaController.agrega);

router.post('/suma',detalleController.mas);
router.post('/resta',detalleController.menos);
router.post('/destroy',detalleController.destroy);


//Exporta las rutas 
module.exports = router;
