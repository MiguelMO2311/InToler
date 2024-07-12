const { Router } = require('express');
const router = Router();
const userCtrl = require('../controllers/user.controller');

// Endpoints User //

// Ruta para obtener el user logueado
router.post('/login', userCtrl.loginUser);

// Ruta para actualizar el user desde profile
router.put('/users/:user_id', userCtrl.updateUserProfile);

// Ruta que envia el user actualizado a la pagina profile del front
router.get('/users/:user_id', userCtrl.getUserProfile);

// Ruta para registrar un user
router.post('/register', userCtrl.registerUser);

// Ruta para cambiar la contraseña del usuario
router.put('/users/:user_id/password', userCtrl.changeUserPassword);

module.exports = router;
