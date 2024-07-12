import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Card } from '../models/Card';

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
        throw new Error('Error al eliminar el tarjeta');
      }

      setUserCards(prevCards => prevCards.filter(card => card.card_id !== card_id));
      toast.success('Tarjeta eliminada correctamente', { position: "top-center", autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al eliminar la tarjeta', { position: "top-center", autoClose: 2000 });
    }
  };


  return (
    <div className="flex justify-center items-center flex-wrap "
      style={{ backgroundImage: `url('/imgs/img_fondo_addCard.jpg')`, backgroundSize: 'cover' }}>
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
  return (
    <div className="flex flex-col bg-yellow-100 shadow-lg rounded-md overflow-hidden" style={{ height: '500px' }}>
      <div className="h-[400px] flex justify-center items-center bg-cover bg-center " style={{ backgroundImage: `url(${card.photo})` }}>
      </div>
      <div className="p-4 flex-grow h-24">
        <h2 className="text-xl text-violet-600 font-bold">{card.name}</h2>
        <p className="text-md text-indigo-600">{card.surname}</p>
      </div>
      <div className="flex justify-between items-center p-4 border-t">
        <div className="text-lg font-bold">{card.foodPreferencies}</div>
        <div className="text-lg font-bold">{card.allergies}</div>
        <div className="text-lg font-bold">{card.intolerances}</div>
        <div>
          <FaPencilAlt className="inline-block text-lime-500 hover:text-yellow-500 cursor-pointer"
            onClick={() => window.location.href = `./edit-card/${card.card_id}`} />
          <FaTrash className="inline-block text-red-700 hover:text-red-400 cursor-pointer ml-2"
            onClick={() => handleDelete(card.card_id)} />
        </div>
      </div>
    </div>
  );
};

export default CardsPage;
