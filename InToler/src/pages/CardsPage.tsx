import { useState, useEffect } from 'react';
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
    <div className="flex justify-center items-center flex-wrap "
      style={{ backgroundImage: `url('/imgs/img_fondo_cardsPage.jpg')`, backgroundSize: 'cover', height: '670px'  }}>
      <ToastContainer />
      {userCards.map(card => (
        <div key={card.card_id} className="mx-40" style={{ width: '204px' }}>
          <TarjetCard card={card} handleDelete={handleDelete} />
        </div>
      ))}
    </div>
  );
}

const TarjetCard: React.FC<{ card: Card, handleDelete: (card_id: number) => void }> = ({ card, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center align-middle self-center">
      <div className="relative flex flex-col items-center justify-center bg-yellow-100 bg-opacity-80 shadow-lg rounded-full p-8" style={{ width: '30.05vw', height: '30.05vw'}}>
        <div className="flex flex-col items-center justify-center bg-yellow-100 bg-opacity-70 shadow-lg rounded-full p-4" style={{ width: '23.8vw', height: '23.8vw'}}>
          <h4 className=" text-blue-600 font-bold m-4 ">Este usuario tiene alergia e intolerancia a:</h4>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-center">
              <h1 className='text-red-500 font-bold'>Alergias:</h1>
              <div className="rounded-full bg-cover bg-center mb-2" style={{ width: '8.5vw', height: '8.5vw', backgroundImage: `url(${card.allergiesImg})` }}></div>
              <h3 className="text-xl text-red-500 font-bold">{card.allergies}</h3>
            </div>
            <div className="flex flex-col items-center">
              <h1 className='text-yellow-500 font-bold'>Intolerancias:</h1>
              <div className="rounded-full bg-cover bg-center mb-2" style={{ width: '8.5vw', height: '8.5vw', backgroundImage: `url(${card.intolerancesImg})` }}></div>
              <h3 className="text-xl text-yellow-500 font-bold">{card.intolerances}</h3>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 flex justify-center items-center w-full mt-30 space-x-12 size-10 bg-transparent rounded-full" style={{ width: '28.05vw', height: '1vw' }}>
          <FaPencilAlt className="inline-block text-lime-500 hover:text-black cursor-pointer"
             onClick={() => navigate(`/edit-card/${card.card_id}`)} />
          <FaTrash className="inline-block text-red-700 hover:text-black cursor-pointer"
            onClick={() => handleDelete(card.card_id)} />
        </div>
      </div>
    </div>
  );
}

export default CardsPage;
