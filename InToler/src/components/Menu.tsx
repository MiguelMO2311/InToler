import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AiOutlineUserAdd } from "react-icons/ai";
import { SlMagnifier } from "react-icons/sl";
import api from './Api';
import useReservations from './UseReservation';

type MenuProps = {
    className?: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Restaurante {
    info: {
        previewLink: string;
        imageLinks: {
            thumbnail: string;
        };
        title: string;
    };
}

const Menu: React.FC<MenuProps> = ({ className, isOpen, setIsOpen }) => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [ciudad, setCiudad] = useState('');
    const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
    const { createReservation, loading, error } = useReservations();

    useEffect(() => {
        localStorage.removeItem('UserInfo');
    }, []);

    const logOut = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        navigate('/Home');
    };

    const handleLogin = () => {
        setIsOpen(false);
        navigate('/login');
    };

    const buscarRestaurantes = async () => {
        try {
            const response = await api.get(`/search?city=${ciudad}&type=restaurant`);
            if (response.data.items && response.data.items.length > 0) {
                setRestaurante(response.data.items[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReservation = () => {
        createReservation({
            name: 'Nombre del Cliente',
            date: '2024-07-21',
            time: '20:00',
            guests: 2
        });
    };

    return (
        <div className={className}>
            <nav className={`flex ${isOpen ? 'flex-col' : ''} justify-start items-center px-4 text-xl`}>
                <div className={`flex ${isOpen ? 'flex-col' : ''} justify-start`}>
                    <div className="mr-24 flex items-center rounded-md">
                        <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Busca tú Restaurante" className="rounded-lg  w-44 text-center text-yellow-950 font-light italic bg-yellow-100  hover:bg-white" />
                        <button onClick={buscarRestaurantes} className="ml-3 text-yellow-950 border-yellow-900"><SlMagnifier /></button>
                    </div>
                    {restaurante && ciudad && (
                        <a className='absolute top-0  left-[490px] w-[62px] hover:size-60 pt-1 ' href={restaurante.info.previewLink} target="_blank" rel="noopener noreferrer">
                            <img src={restaurante.info.imageLinks.thumbnail} alt={restaurante.info.title} />
                        </a>
                    )}
                    {user ? (
                        <>
                            <NavLink className="ml-8 text-red-500 hover:text-red-400" to="/cardsPage" onClick={() => setIsOpen(false)}>Cards</NavLink>
                            <NavLink className="ml-8 text-gray-800 hover:text-gray-500" to="/profile" onClick={() => setIsOpen(false)}>Profile</NavLink>
                            <NavLink className="ml-8 text-green-600 hover:text-green-400" to="/addCard" onClick={() => setIsOpen(false)}>AddCard</NavLink>
                            <button onClick={logOut} className="ml-8 flex items-center text-yellow-400 hover:bg-yellow-400 hover:text-black focus:outline-none border-2 border-green-700 rounded-lg p-1 transition-colors duration-200">
                                <img src={user.photo} alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                <span className="text-xs ml-1">Log Out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink className="ml-8 text-yellow-600 hover:text-black" to="/Home" onClick={() => setIsOpen(false)}>Home</NavLink>
                            <NavLink className="ml-8 text-yellow-600 hover:text-black" to="/Register" onClick={() => setIsOpen(false)}>Register</NavLink>
                            <button onClick={handleLogin} className="flex items-center ml-16 text-yellow-700 hover:bg-yellow-500 hover:text-black focus:outline-none border-2 border-yellow-700 rounded-lg p-1 transition-colors duration-200">
                                <AiOutlineUserAdd size={20} color="" />
                                <span className="text-xs ml-1">Log In</span>
                            </button>
                        </>
                    )}
                </div>
            </nav>
            {restaurante && (
                <div>
                    <h2>{restaurante.info.title}</h2>
                    <button onClick={handleReservation} disabled={loading}>Reservar</button>
                    {error && <p>{error}</p>}
                </div>
            )}
        </div>
    );
};

export default Menu;
