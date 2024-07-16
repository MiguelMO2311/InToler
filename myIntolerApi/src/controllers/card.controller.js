const { connectionPromise } = require('../database.js');


// Inicializa la variable card como un objeto vacío
let card = {};

async function getCardsByUserId(req, res) {
  const connection = await connectionPromise;
  try {
    // Imprime el ID del usuario recibido para verificar que es correcto
    console.log('User ID recibido:', req.params.id);
    
    // Ejecuta la consulta y almacena los resultados
    const [results] = await connection.query('SELECT * FROM cards WHERE user_id = ?', [req.params.id]);
    
    // Imprime los resultados de la consulta para depuración
    console.log('Resultados de la consulta:', results);
    
    // Verifica si se encontraron cards y envía la respuesta adecuada
    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      // Si no se encuentran cards, envía un 404 con un mensaje de error
      res.status(404).send({ error: true, message: 'No se encontraron cards para este usuario' });
    }
  } catch (error) {
    // Si hay un error en la consulta, imprime el error y envía un 500
    console.error('Error en la consulta:', error);
    res.status(500).send({ error: true, message: 'Error interno del servidor' });
  }
}


// Función para obtener una card existente por ID
const getCardById = async (req, res) => {
  const { card_id } = req.params;
  console.log(`card_id recibido: ${card_id}`); // Imprime el card_id recibido
  const connection = await connectionPromise;

  try {
    const [results] = await connection.query('SELECT * FROM cards WHERE card_id = ?', [card_id]);
    console.log('Resultados de la consulta:', results); // Imprime los resultados de la consulta

    if (results.length > 0) {
      res.status(200).send(results[0]);
    } else {
      res.status(404).send({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener la card:', error);
    res.status(500).send({ message: 'Error al obtener la card', error });
  }
};

// Función para actualizar una card existente
const updateCard = async (req, res) => {
  const { card_id } = req.params;
  console.log(`card_id recibido: ${card_id}`); // Imprime el card_id recibido
  const { allergies, allergiesImg, intolerances, intolerancesImg } = req.body;
  console.log('Datos recibidos:', { allergies, allergiesImg, intolerances, intolerancesImg });
  const connection = await connectionPromise;

  try {
    const [results] = await connection.query(
      'UPDATE cards SET allergies = ?, allergiesImg = ?, intolerances = ?, intolerancesImg = ? WHERE card_id = ?',
      [allergies, allergiesImg, intolerances, intolerancesImg, card_id]
    );
    console.log('Resultados de la actualización:', results); // Imprime los resultados de la actualización

    if (results.affectedRows > 0) {
      const [updatedCard] = await connection.query('SELECT * FROM cards WHERE card_id = ?', [card_id]);
      res.status(200).send(updatedCard[0]);
    } else {
      res.status(404).send({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar la card:', error);
    res.status(500).send({ message: 'Error al actualizar la card', error });
  }
};


// Función para añadir una nueva card
const addCard = async (req, res) => {
  const { user_id, allergies, allergiesImg, intolerances, intolerancesImg } = req.body;
  const connection = await connectionPromise;

  try {
    // Busca si ya existe una tarjeta con las mismas alergias e intolerancias para el mismo usuario
    const [existingCard] = await connection.query(
      'SELECT * FROM cards WHERE user_id = ? AND allergies = ? AND intolerances = ?',
      [user_id, allergies, intolerances]
    );

    if (existingCard.length > 0) {
      return res.status(409).send({ message: 'El usuario ya tiene una tarjeta con estas alergias e intolerancias.' });
    }

    // Si no existe, añade la nueva tarjeta
    await connection.query(
      'INSERT INTO cards (user_id, allergies, allergiesImg, intolerances, intolerancesImg) VALUES (?, ?, ?, ?, ?)',
      [user_id, allergies, allergiesImg, intolerances, intolerancesImg]
    );

    res.status(201).send({ message: 'Tarjeta registrada con éxito.' });
  } catch (error) {
    res.status(500).send({ message: 'Error al registrar la tarjeta', error });
  }
};

// Función para eliminar una card
const deleteCard = async (req, res) => {
  const card_id = Number(req.params.card_id);
  const connection = await connectionPromise;

  try {
    const [cardcard] = await connection.query('SELECT * FROM cards WHERE card_id = ?', [card_id]);

    if (card.length === 0) {
      return res.status(404).send({ message: 'No se encontró la card con el id proporcionado.' });
    }

    await connection.query('DELETE FROM cards WHERE card_id = ?', [card_id]);

    res.status(200).send({ message: 'Libro eliminado con éxito.' });
  } catch (error) {
    res.status(500).send({ message: 'Hubo un error al eliminar la card', error });
  }
};






  module.exports = {getCardsByUserId, updateCard, addCard, deleteCard, getCardById }