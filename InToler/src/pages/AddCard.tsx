import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define el esquema de Zod para la validación
const cardSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  surname: z.string().min(1, 'El apellido es requerido.'),
  email: z.string().min(1, 'El email es requerido.'),
  photo: z.string().min(1, 'La foto es requerida.'),
  foodPreferencies: z.string().min(1, 'La preferencia Alimentaria es requerida.'),
  allergies: z.string().min(1, 'Las alergias alimentarias son requeridas.'),
  intolerances: z.string().min(1, 'Las intolerancias alimentarias son requeridas.')
});

type FormData = z.infer<typeof cardSchema>;
// Define la URL de la imagen por defecto
const defaultCardImage = '/assets/NoCard.jpg';

const AddCard: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(cardSchema),
  });
  const [cardImage, setCardImage] = useState(defaultCardImage); // Usa la imagen por defecto como valor inicial

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Obtén el userInfo del almacenamiento local
    const userInfoString = localStorage.getItem('userInfo');
 
    if (userInfoString !== null) {
      const userInfo = JSON.parse(userInfoString);

      // Asegúrate de que userInfo y userInfo.user_id existen
      if (userInfo && userInfo.user_id) {
        // Añade el user_id al objeto data
        const dataWithUserId = { ...data, user_id: Number(userInfo.user_id) };
        console.log(dataWithUserId)
        axios.post('http://localhost:3000/add', dataWithUserId)
          .then(() => {
            toast.success('Tarjeta añadida con éxito', { position: "top-center", autoClose: 2000 });
            setTimeout(() => {
              navigate('/CardCreation');
            }, 2000);
          })
          .catch(error => {
            console.error(error);
            toast.error('Ohh, Esta tarjeta ya existe!', { position: "top-center", autoClose: 3000 });
          });

      } else {
        console.error(errors);
      }
    }
  };

  return (
    <div className="bg-cover bg-center h-screen transition-all duration-1000" style={{ backgroundImage: "url('/imgs/img_fondo_addCard.jpg')", backgroundSize: 'cover', maxHeight: "550px" }}>
      <div className="flex justify-center items-start py-2 border-dashed h-1/3">
        <ToastContainer />
        <div className="w-2/3 shadow-md rounded px-8 pt-6 pb-8 mb-4 hover:bg-green-800 hover:bg-opacity-40">
          <h1 className="text-2xl font-bold m-1 text-slate-800 hover:text-green-400">Añadir Tarjeta Alimentaria </h1>
          <div className="flex justify-between">
            <div className="w-3/4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nombre:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                    id="name"
                    type="text"
                    {...register('name')}
                    placeholder="Introduce el nombre"
                  />
                  {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                    Apellido:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                    id="surname"
                    type="text"
                    {...register('surname')}
                    placeholder="Introduce el apellido"
                  />
                  {errors.surname && <p className="text-red-500 text-xs italic">{errors.surname.message}</p>}
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                    id="type"
                    type="email"
                    {...register('email')}
                    placeholder="Introduce el email"
                  />
                  {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                    URL de la Foto:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                    id="photo"
                    type="text"
                    {...register('photo')}
                    placeholder="Introduce la URL de la foto"
                    onChange={(e) => setCardImage(e.target.value)}
                  />
                  {errors.photo && <p className="text-red-500 text-xs italic">{errors.photo.message}</p>}
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="foodPreferencies">
                    Preferencia Alimentaria:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                    id="foodPreferencies"
                    type="text"
                    {...register('foodPreferencies')}
                    placeholder="Indica tú Preferencia Alimentaria"
                  />
                  {errors.foodPreferencies && <p className="text-red-500 text-xs italic">{errors.foodPreferencies.message}</p>}
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allergies">
                    Alergia Alimentaria:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                    id="allergies"
                    type="text"
                    {...register('allergies')}
                    placeholder="Indica tus Alergias Alimentarias"
                  />
                  {errors.allergies && <p className="text-red-500 text-xs italic">{errors.allergies.message}</p>}
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="intolerances">
                    Intolerancia Alimentaria:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                    id="intolerances"
                    type="text"
                    {...register('intolerances')}
                    placeholder="Indica tú Intolerancia Alimentaria"
                  />
                  {errors.intolerances && <p className="text-red-500 text-xs italic">{errors.intolerances.message}</p>}
                </div>
                <button
                  className="bg-yellow-700 hover:bg-yellow-950 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline float-right mt-5"
                  type="submit"
                >
                  Añadir Tarjeta Alimentaria
                </button>
              </form>
            </div>
            <div className="w-1/4 flex flex-col items-center justify-between mt-7 ml-6">
              <img src={cardImage} alt="Card" style={{ width: '180px', height: '330px', borderRadius: '3%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default AddCard;
