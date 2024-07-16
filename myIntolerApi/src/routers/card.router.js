const {Router} = require ('express')
const router = Router();
const cardCtrl = require ('../controllers/card.controller');


// Ruta para obtener todos los libros de un UserID
router.get('/cards/:id', cardCtrl.getCardsByUserId);
// Ruta para obtener un libro por ID
router.get('/cards/card/:card_id', cardCtrl.getCardsByUserId); //{la hemos adaptado porque daba conflicto con otra}
// Ruta para actualizar una card por ID
router.put('/cards/card/:card_id', cardCtrl.updateCard);
// Ruta para registrar una nueva Card
router.post('/add', cardCtrl.addCard);
// Ruta para eliminar un libro
router.delete('/card/:card_id', cardCtrl.deleteCard);


module.exports = router;