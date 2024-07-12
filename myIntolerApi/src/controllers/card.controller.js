const { connectionPromise } = require('../dataBase');


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
    
    // Verifica si se encontraron libros y envía la respuesta adecuada
    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      // Si no se encuentran libros, envía un 404 con un mensaje de error
      res.status(404).send({ error: true, message: 'No se encontraron libros para este usuario' });
    }
  } catch (error) {
    // Si hay un error en la consulta, imprime el error y envía un 500
    console.error('Error en la consulta:', error);
    res.status(500).send({ error: true, message: 'Error interno del servidor' });
  }
}


// Función para obtener un libro existente por ID
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
    console.error('Error al obtener el libro:', error);
    res.status(500).send({ message: 'Error al obtener el libro', error });
  }
};

// Función para actualizar un libro existente
const updateCard = async (req, res) => {
  const { card_id } = req.params;
  console.log(`card_id recibido: ${card_id}`); // Imprime el card_id recibido
  const { title, author, photo, type, price } = req.body;
  console.log('Datos recibidos:', { title, author, photo, type, price });
  const connection = await connectionPromise;

  try {
    const [results] = await connection.query(
      'UPDATE cards SET title = ?, author = ?, photo = ?, type = ?, price = ? WHERE card_id = ?',
      [title, author, photo, type, price, card_id]
    );
    console.log('Resultados de la actualización:', results); // Imprime los resultados de la actualización

    if (results.affectedRows > 0) {
      const [updatedBook] = await connection.query('SELECT * FROM cards WHERE card_id = ?', [card_id]);
      res.status(200).send(updatedBook[0]);
    } else {
      res.status(404).send({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el libro:', error);
    res.status(500).send({ message: 'Error al actualizar el libro', error });
  }
};



// Función para añadir un nuevo libro
const addCard = async (req, res) => {
  const { user_id, title, author, type, photo, price } = req.body;
  const connection = await connectionPromise;

  try {
    const [card] = await connection.query('SELECT * FROM cards WHERE title = ?', [title]);

    if (card.length > 0) {
      return res.status(409).send({ message: 'El libro ya está registrado.' });
    }

    await connection.query(
      'INSERT INTO cards (user_id, title, author, type, photo, price) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, title, author, type, photo, price]
    );

    res.status(201).send({ message: 'Book registrado con éxito.' });
  } catch (error) {
    res.status(500).send({ message: 'Error al registrar el Book', error });
  }
};

// Función para eliminar un libro
const deleteCard = async (req, res) => {
  const card_id = Number(req.params.card_id);
  const connection = await connectionPromise;

  try {
    const [card] = await connection.query('SELECT * FROM cards WHERE card_id = ?', [card_id]);

    if (card.length === 0) {
      return res.status(404).send({ message: 'No se encontró el libro con el id proporcionado.' });
    }

    await connection.query('DELETE FROM cards WHERE card_id = ?', [card_id]);

    res.status(200).send({ message: 'Libro eliminado con éxito.' });
  } catch (error) {
    res.status(500).send({ message: 'Hubo un error al eliminar el libro', error });
  }
};






  module.exports = {getCardsByUserId, getCardById, updateCard, addCard, deleteCard }