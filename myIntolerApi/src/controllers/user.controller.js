const { connectionPromise } = require('../dataBase');

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { name, surname, email, password } = req.body;
  const connection = await connectionPromise;

  try {
    const [user] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length > 0) {
      return res.status(409).send({ message: 'El email ya está registrado.' });
    }

    await connection.query(
      'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
      [name, surname, email, password]
    );

    res.status(201).send({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    res.status(500).send({ message: 'Error al registrar el usuario', error });
  }
};

// Función para actualizar los datos del usuario
const updateUserProfile = async (req, res) => {
  const { user_id } = req.params;
  const { name, surname, email, photo } = req.body;
  const connection = await connectionPromise;

  try {
    const [results] = await connection.query(
      'UPDATE users SET name = ?, surname = ?, email = ?, photo = ? WHERE user_id = ?',
      [name, surname, email, photo, user_id]
    );

    if (results.affectedRows > 0) {
      res.status(200).send({ message: 'Perfil actualizado con éxito.' });
    } else {
      res.status(404).send({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error al actualizar el perfil', error });
  }
};
// Función para cargar los datos actualizados de nuevo y enviarlos a la pagina Profile del front

const getUserProfile = async (req, res) => {
  const { user_id } = req.params;
  console.log(`user_id recibido: ${user_id}`); 
  const connection = await connectionPromise;

  try {
    const [user] = await connection.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

    if (user.length > 0) {
      res.status(200).send(user[0]);
    } else {
      res.status(404).send({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener el perfil del usuario', error });
  }
};


// Función para iniciar sesión

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const connection = await connectionPromise;

  try {
    const [user] = await connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

    if (user.length > 0) {
      res.status(200).send({ message: 'Inicio de sesión exitoso.', user: user[0] });
    } else {
      res.status(404).send({ message: 'Credenciales incorrectas.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error al iniciar sesión', error });
  }
};

// Función para cambiar la contraseña del usuario
const changeUserPassword = async (req, res) => {
  const { user_id } = req.params;
  const { oldPassword, newPassword } = req.body;
  const connection = await connectionPromise;

  try {
    const [user] = await connection.query('SELECT * FROM users WHERE user_id = ? AND password = ?', [user_id, oldPassword]);

    if (user.length === 0) {
      return res.status(404).send({ message: 'Contraseña incorrecta.' });
    }

    await connection.query(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [newPassword, user_id]
    );

    res.status(200).send({ message: 'Contraseña cambiada con éxito!' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).send({ message: 'Error al cambiar la contraseña.' });
  }
};

module.exports = { registerUser, updateUserProfile, loginUser, getUserProfile,  changeUserPassword };


