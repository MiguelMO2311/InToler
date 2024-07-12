import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Esquema de validación para el formulario
const bookSchema = z.object({

  title: z.string().min(1, 'El título es requerido.'),
  author: z.string().min(1, 'El autor es requerido.'),
  photo: z.string().url('Debe ser una URL válida.'),
  type: z.string().min(1, 'El tipo es requerido.'),
  price: z.number().min(0, 'El precio es requerido.'),
});

// Tipo de datos para el formulario
type FormData = z.infer<typeof bookSchema>;

const EditBook: React.FC = () => {
  const navigate = useNavigate();
  const { book_id } = useParams<{ book_id: string }>();
  console.log(book_id);


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/books/book/${book_id}`);
        const { title, author, photo, type, price } = response.data;
        setValue('title', title);
        setValue('author', author);
        setValue('photo', photo);
        setValue('type', type);
        setValue('price', price);
      } catch (error) {
        console.error('Error al cargar los datos del libro:', error);
      }
    };

    fetchBookData();
  }, [setValue, book_id]);


  const onSubmit = async (data: FormData) => {
    console.log('onSubmit ejecutado', data);
    const updatedData = {
      ...data,
      book_id: Number(data), // Convierte book_id a un número
      price: parseFloat(data.price.toString()),
    };
    console.log('Datos enviados:', updatedData);

    await axios.put(`http://localhost:3000/books/book/${book_id}`, updatedData)
      .then(() => {
        console.log('Libro actualizado con éxito');
        toast.success('Libro editado actualizado', { position: "top-center", autoClose: 2000 });
        setTimeout(() => {
          navigate('/BooksPage');
        }, 3000);
      })
      .catch(error => {
        console.error('Error al actualizar el libro:', error);
        toast.error('Libro editado NO actualizado', { position: "top-center", autoClose: 2000 });
      });

  };
  return (
    <div className="bg-cover bg-center h-screen transition-all duration-1000" style={{ backgroundImage: "url('/imgs/img_fondo_addBook.jpg')", backgroundSize: 'cover', maxHeight: "550px" }}>
      <div className="flex justify-center items-start pt-5 my-5 border-dashed h-1/3">
        <div className="w-2/3 shadow-md rounded px-8 pt-6 pb-8 mb-4  hover:bg-green-800 hover:bg-opacity-50 ">
          <h1 className="text-2xl font-bold m-1 text-slate-800 hover:text-lime-200">Editar Libro</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Título:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="title"
                type="text"
                {...register('title')}
                placeholder="Introduce el título"
              />
              {errors.title && <p className="text-red-500 text-xs italic">{errors.title.message}</p>}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                Autor:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="author"
                type="text"
                {...register('author')}
                placeholder="Introduce el autor"
              />
              {errors.author && <p className="text-red-500 text-xs italic">{errors.author.message}</p>}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                Tipo:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="type"
                type="text"
                {...register('type')}
                placeholder="Introduce el tipo"
              />
              {errors.type && <p className="text-red-500 text-xs italic">{errors.type.message}</p>}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                URL de la Foto:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="photo"
                type="text"
                {...register('photo')}
                placeholder="Introduce la URL de la foto"
              />
              {errors.photo && <p className="text-red-500 text-xs italic">{errors.photo.message}</p>}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Precio:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                id="price"
                type="text"
                {...register('price', {
                  setValueAs: (value) => parseFloat(value) || 0, // Convierte el valor del input a un número flotante
                })}
                placeholder="Introduce el precio"
              />
              {errors.price && <p className="text-red-500 text-xs italic">{errors.price.message}</p>}

              <button
                className="bg-yellow-700 hover:bg-yellow-950 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline float-right mt-5"
                type="submit"
              >
                Editar Libro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
