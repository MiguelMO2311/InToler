import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Card } from '../models/Card';
import { useNavigate } from 'react-router-dom';

const CardsPage: React.FC = () => {
  const [userCards, setUserCards] = useState<Card[]>([]);
  

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo.user_id === undefined || isNaN(Number(userInfo.user_id))) {
      console.error('Error: user_id no válido:', userInfo.user_id);
      return;
    }
    const userId = Number(userInfo.user_id);

    axios.get(`http://localhost:3000/cards/${userId}`)
      .then(response => {
        const cardsData = Array.isArray(response.data) ? response.data : [];
        console.log('Respuesta de la API:', cardsData);
        setUserCards(cardsData);
      })
      .catch(error => {
        console.error(`Error al obtener libros del usuario ${userId}:`, error);
      });
  }, []);

  const handleDelete = async (card_id: number) => {
    try {
      const response = await axios.delete(`http://localhost:3000/card/${card_id}`);

      if (response.status !== 200) {
        throw new Error('Error al eliminar el libro');
      }

      setUserCards(prevCards => prevCards.filter(card => card.card_id !== card_id));
      toast.success('Libro eliminado correctamente', { position: "top-center", autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al eliminar el libro', { position: "top-center", autoClose: 2000 });
    }
  };

  return (
    <div className="flex justify-around items-center flex-wrap"
      style={{ backgroundImage: `url('/imgs/img_fondo_addBook.jpg')`, backgroundSize: 'cover' }}>
      <ToastContainer />
      {userCards.map(card => (
        <div key={card.card_id} className="m-8" style={{ width: '240px' }}>
          <TarjetCard card={card} handleDelete={handleDelete} />
        </div>
      ))}
    </div>
  );
}

const TarjetCard: React.FC<{ card: Card, handleDelete: (card_id: number) => void }> = ({ card, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-300">
      <div className="flex flex-col items-center justify-center bg-yellow-200 shadow-lg rounded-full p-8" style={{ width: '33vw', height: '33vw' }}>
        <h4 className=" text-blue-600 font-bold m-4 ">Este usuario tiene alergia e intolerancia a:</h4>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center">
            <h1 className='text-red-500 font-bold'>Alergias:</h1>
            <div className="rounded-full bg-cover bg-center mb-2" style={{ width: '10vw', height: '10vw', backgroundImage: `url(${card.allergiesImg})` }}></div>
            <h3 className="text-xl text-red-500 font-bold">{card.allergies}</h3>
            </div>
          <div className="flex flex-col items-center">
            <h1 className='text-yellow-500 font-bold'>Intolerancias:</h1>
            <div className="rounded-full bg-cover bg-center mb-2" style={{ width: '10vw', height: '10vw', backgroundImage: `url(${card.intolerancesImg})` }}></div>
            <h3 className="text-xl text-yellow-500 font-bold">{card.intolerances}</h3>
            </div>
        </div>
        <div className="flex justify-center items-center w-full mt-20 space-x-20 size-10">
          <FaPencilAlt className="inline-block text-red-500 hover:text-black cursor-pointer"
             onClick={() => navigate(`/edit-card/${card.card_id}`)} />
          <FaTrash className="inline-block text-red-700 hover:text-black cursor-pointer"
            onClick={() => handleDelete(card.card_id)} />
        </div>
      </div>
    </div>
  );
}

export default CardsPage;
