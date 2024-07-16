import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Esquema de validación para el formulario
const cardSchema = z.object({
  allergies: z.string().min(1, 'Las alergias son requeridas.'),
  allergiesImg: z.string().url('Debe ser una URL válida.'),
  intolerances: z.string().min(1, 'Las intolerancias son requeridas.'),
  intolerancesImg: z.string().url('Debe ser una URL válida.'),
});

// Tipo de datos para el formulario
type FormData = z.infer<typeof cardSchema>;

const EditCard: React.FC = () => {
  const navigate = useNavigate();
  const { card_id } = useParams<{ card_id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(cardSchema),
  });

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cards/card/${card_id}`);
        const { allergies, intolerances, allergiesImg, intolerancesImg } = response.data;
        setValue('allergies', allergies);
        setValue('intolerances', intolerances);
        setValue('allergiesImg', allergiesImg);
        setValue('intolerancesImg', intolerancesImg);
      } catch (error) {
        console.error('Error al cargar los datos de la tarjeta:', error);
      }
    };

    fetchCardData();
  }, [setValue, card_id]);

  const onSubmit = async (data: FormData) => {
    const updatedData = {
      ...data,
      card_id: Number(card_id),
    };

    await axios.put(`http://localhost:3000/cards/card/${card_id}`, updatedData)
      .then(() => {
        toast.success('Card actualizada correctamente', { position: "top-center", autoClose: 2000 });
        setTimeout(() => {
          navigate('/CardsPage');
        }, 3000);
      })
      .catch(error => {
        console.error('Error al actualizar la tarjeta:', error);
        toast.error('Hubo un error al actualizar la tarjeta', { position: "top-center", autoClose: 2000 });
      });
  };

  return (
    <div className="flex justify-center items-center flex-wrap "
      style={{ backgroundImage: `url('/imgs/img_fondo_addBook.jpg')`, backgroundSize: 'cover' }}>
      <ToastContainer />
      <div key={card_id} className="m-8" style={{ width: '240px' }}>
        <div className="flex flex-col items-center justify-center h-300">
          <div className="flex flex-col items-center justify-center bg-yellow-200 shadow-lg rounded-full p-10" style={{ width: '33vw', height: '33vw' }}>
            <h4 className="text-2xl text-blue-600 font-bold mt-4 py-6">Editar esta tarjeta:</h4>
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
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCard;