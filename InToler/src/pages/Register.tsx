import React, { useState, FormEvent, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
 

type FormData = {
  name: string;
  surname: string;
  email: string;
  photo?: string;
  password: string;
  passwordRepeat: string;
  foodPreferencies?: string

};

type FormErrors = {
  [key: string]: string | undefined;
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  passwordRepeat?: string;
  foodPreferencies?:string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    photo: '',
    password: '',
    passwordRepeat: '',
    foodPreferencies: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    // Validaciones aquí...
    if (!formData.name) {
      isValid = false;
      tempErrors.name = 'El nombre es requerido.';
    }
    if (!formData.surname) {
      isValid = false;
      tempErrors.surname = 'El apellido es requerido.';
    }
    if (!formData.email) {
      isValid = false;
      tempErrors.email = 'El email es requerido.';
    }
    if (!formData.password) {
      isValid = false;
      tempErrors.password = 'La contraseña es requerida.';
    }
    if (formData.password !== formData.passwordRepeat) {
      isValid = false;
      tempErrors.passwordRepeat = 'Las contraseñas no coinciden.';
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const isValid = validateForm();
    setFormSubmitted(true); // Esto establecerá formSubmitted en true cuando el formulario se envíe

    if (isValid) {
      // Lógica para enviar los datos al servidor
      console.log(formData)
      axios.post('http://localhost:3000/register', formData)
        .then(response => {
          // Actualiza el contexto del usuario
          setUser(response.data.user);
          console.log(response.data.user)
          alert('Usuario registrado con éxito!, ... ya puede Loguearse!');
          navigate('/');
        })
        .catch(error => {
          console.error(error);
          toast.error('Ohh, Este Usuario ya existe!', { position: "top-center", autoClose: 4000 });
        });

    } else {
      console.error(errors);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  

  return (
    <div className="bg-cover bg-center h-screen transition-all duration-1000" style={{ backgroundImage: "url('/imgs/img_fondo_register.jpg')", backgroundSize: "57%", maxHeight: "640px" }}>
      <div className="flex justify-center items-start border-dashed py-10">
        <div className="w-2/3 shadow-md rounded px-8 py-4 hover:bg-yellow-600 hover:bg-opacity-50 ">
          <h1 className="text-2xl font-bold mb-1 text-white hover:text-black">Regístrate</h1>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="name">
                Nombre:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="name"
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
              />
              {formSubmitted && errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="surname">
                Apellido:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="surname"
                type="text"
                name="surname"
                placeholder="Tu apellido"
                value={formData.surname}
                onChange={handleChange}
              />
              {formSubmitted && errors.surname && <p className="text-red-500 text-xs italic">{errors.surname}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="email">
                Email:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="email"
                type="email"
                name="email"
                placeholder="Tu email"
                value={formData.email}
                onChange={handleChange}
              />
              {formSubmitted && errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="password">
                Contraseña:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="password"
                type="password"
                name="password"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
              />
              {formSubmitted && errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="passwordRepeat">
                Repetir Contraseña:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="passwordRepeat"
                type="password"
                name="passwordRepeat"
                placeholder="Repite tu contraseña"
                value={formData.passwordRepeat}
                onChange={handleChange}
              />
              {formSubmitted && errors.passwordRepeat && <p className="text-red-500 text-xs italic">{errors.passwordRepeat}</p>}
            </div>
            <div className="mb-4">
  <label className="block text-black text-sm font-bold mb-2" htmlFor="foodPreferencias">
    Preferencia alimentaria del usuario:
  </label>
  <select
    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none bg-green-100 hover:bg-white"
    id="foodPreferencias"
    name="foodPreferencias"
    value={formData.foodPreferencies}
    onChange={handleChange}
  >
    <option value="">Selecciona una preferencia</option>
    <option value="Omnivoro">Omnívoro</option>
    <option value="Vegetariano">Vegetariano</option>
    <option value="Vegano">Vegano</option>
    <option value="Pescetariano">Pescetariano</option>
    <option value="Flexitariano">Flexitariano</option>
    {/* Agrega más opciones según sea necesario */}
  </select>
  {formSubmitted && errors.foodPreferencias && <p className="text-red-500 text-xs italic">{errors.foodPreferencias}</p>}
</div>


            <button type="submit" className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2">
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
