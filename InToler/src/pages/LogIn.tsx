import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type FormData = {
  email: string;
  password: string;
};

type FormErrors = {
  email?: string;
  password?: string;
};

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

const LogIn: React.FC = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=Madrid&appid=9bb2bc0f636a99daa03a208326be47e5`)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener el clima:', error);
      });
  }, []);

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    let formIsValid: boolean = true;

    if (!formData.email) {
      formIsValid = false;
      tempErrors.email = 'El email es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      tempErrors.email = 'Debe ser un email válido.';
    }

    if (!formData.password) {
      formIsValid = false;
      tempErrors.password = 'La contraseña es requerida.';
    } else if (formData.password.length < 4 || formData.password.length > 12) {
      formIsValid = false;
      tempErrors.password = 'La contraseña debe tener entre 4 y 12 caracteres.';
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      axios.post('http://localhost:3000/login', formData)
        .then(response => {
          setUser(response.data.user);
          localStorage.setItem('userInfo', JSON.stringify(response.data.user));
          toast.success('Usuario Logueado con éxito!', { position: 'top-center', autoClose: 2000 });
          setTimeout(() => {
            navigate('/BooksPage');
          }, 3000);
        })
        .catch(error => {
          console.error('Error al iniciar sesión:', error);
          toast.error(`Error al iniciar sesión: ${error.response.data.message}`, { position: 'top-center', autoClose: 2000 });
        });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const currentTime = format(new Date(), 'HH:mm:ss');
  const currentDate = format(new Date(), 'eeee, MMMM do, yyyy', { locale: es });

  return (
    <div className="bg-cover bg-center h-screen transition-all duration-1000" style={{ backgroundImage: "url('/imgs/img_fondo_login.jpg')", backgroundSize: '75%', maxHeight: "550px" }}>
      <div className="flex justify-center items-center pt-24 border-dashed">
        {/* Bloque Izquierdo (Calendario) */}
        <div className="w-1/5  bg-green-800 rounded-xl bg-opacity-50 text-black hover:bg-white absolute top-72 left-8">
          <div className="mt-1 px-4 rounded-lg flex items-center bg-orange-200 gap-1 font-light">
            <p className="font-semibold">{currentTime}</p>
            <p className="text-pink-600 ">{currentDate}</p>
          </div>
          <Calendar />
        </div>

        {/* Bloque Central (Formulario de Inicio de Sesión) */}
        <div className="w-[300px] hover:bg-green-800 hover:bg-opacity-50 p-5 ml-22 rounded-xl">
          <h1 className="text-2xl font-bold mb-4 text-slate-800 hover:text-yellow-500">Logueate</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="email">
                Email:
              </label>
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-green-100 hover:bg-white w-full"
                id="email"
                type="email"
                name="email"
                placeholder="Tu email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="password">
                Contraseña:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-green-100 hover:bg-white"
                id="password"
                type="password"
                name="password"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-yellow-700 hover:bg-yellow-950 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline ml-[30%] mt-20" type="submit">
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>

        {/* Bloque Derecho (Datos Meteorológicos) */}
        <div className="w-28 items-center self-center rounded-xl absolute right-[350px] top-[118px] px-2  font-semibold bg-green-800 bg-opacity-15 hover:bg-white">
          {weatherData && (
            <div>
              <h2 className="text-3xl text-yellow-400">{weatherData.name}</h2>
              <h3 className="text-5xl text-red-600">{Math.round(weatherData.main.temp - 273.15)}°C</h3>
              <p className='text-xs text-center text-blue-800 bg-cyan-400 bg-opacity-15'>{weatherData.weather[0].description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}

export default LogIn;
