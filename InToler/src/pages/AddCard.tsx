import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define el esquema de Zod para la validación
const cardSchema = z.object({
  allergies: z.string().min(1, 'Las alergias son requeridas.'),
  allergiesImg: z.string().url('Debe ser una URL válida.'),
  intolerances: z.string().min(1, 'Las intolerancias son requeridas.'),
  intolerancesImg: z.string().url('Debe ser una URL válida.'),
});

type FormData = z.infer<typeof cardSchema>;

const AddCard: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(cardSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Obtén el userInfo del almacenamiento local
    const userInfoString = localStorage.getItem('userInfo');
 
    if (userInfoString !== null) {
      const userInfo = JSON.parse(userInfoString);

      // Asegúrate de que userInfo y userInfo.user_id existen
      if (userInfo && userInfo.user_id) {
        // Añade el user_id al objeto data
        const dataWithUserId = { ...data, user_id: Number(userInfo.user_id) };

        try {
          // Verifica si el usuario ya tiene una tarjeta
          const response = await axios.get(`http://localhost:3000/cards/${userInfo.user_id}`);
          if (response.data.length > 0) {
            toast.warning('Este usuario ya tiene otras tarjetas', { position: "top-center", autoClose: 2000 });
          }

          // Añade la nueva tarjeta
          await axios.post('http://localhost:3000/add', dataWithUserId);
          toast.success('Tarjeta añadida con éxito', { position: "top-center", autoClose: 2000 });
          setTimeout(() => {
            navigate('/CardsPage');
          }, 2000);
        } catch (error) {
          console.error(error);
          toast.error('Ohh, hubo un error al añadir la tarjeta!', { position: "top-center", autoClose: 3000 });
        }
      } else {
        console.error(errors);
      }
    }
  };

  return (
    <div className="flex justify-center items-center flex-wrap "
      style={{ backgroundImage: `url('/imgs/img_fondo_addCard.jpg')`, backgroundSize: '40%', maxHeight: "640px"  }}>
      <ToastContainer />
      <div className="m-10" style={{ width: '240px' }}>
        <div className="flex flex-col items-center justify-center h-300">
          <div className="flex flex-col items-center justify-center bg-yellow-200 shadow-lg rounded-full p-10" style={{ width: '33vw', height: '33vw' }}>
            <h4 className=" text-blue-600 font-bold my-4 ">Añadir nueva tarjeta:</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allergies">
                  Alergia:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="allergies"
                  type="text"
                  {...register('allergies')}
                  placeholder="Introduce las alergias"
                />
                {errors.allergies && <p className="text-red-500 text-xs italic">{errors.allergies.message}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allergiesImg">
                  Imagen de la Alergia:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="allergiesImg"
                  type="text"
                  {...register('allergiesImg')}
                  placeholder="Introduce imagen de la alergia"
                />
                {errors.allergiesImg && <p className="text-red-500 text-xs italic">{errors.allergiesImg.message}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="intolerances">
                  Intolerancia:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="intolerances"
                  type="text"
                  {...register('intolerances')}
                  placeholder="Introduce las intolerancias"
                />
                {errors.intolerances && <p className="text-red-500 text-xs italic">{errors.intolerances.message}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="intolerancesImg">
                  Imagen Intolerancia:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="intolerancesImg"
                  type="text"
                  {...register('intolerancesImg')}
                  placeholder="Introduce la Imagen de la intolerancia"
                />
                {errors.intolerancesImg && <p className="text-red-500 text-xs italic">{errors.intolerancesImg.message}</p>}
              </div>
              <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  Añadir Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCard;
