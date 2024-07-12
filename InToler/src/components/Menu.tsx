import { SlMagnifier } from "react-icons/sl";
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AiOutlineUserAdd } from "react-icons/ai";
import axios from 'axios';

type MenuProps = {
    className?: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Book {
    volumeInfo: {
        title: string;
        imageLinks: {
            thumbnail: string;
        };
        previewLink: string;
    };
}

const Menu: React.FC<MenuProps> = ({ className, isOpen, setIsOpen }) => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate(); // Hook para navegar

    useEffect(() => {
        localStorage.removeItem('UserInfo');
    }, []);


    const logOut = () => {
        setUser(null); // Esto es válido si UserType incluye null
        localStorage.removeItem('userInfo');
        navigate('/Home'); // Navega a la página de LogIn
    };

    const handleLogin = () => {
        setIsOpen(false); // Cierra el menú
        navigate('/login'); // Navega a la página de LogIn
    };

    const [isbn, setIsbn] = useState('');
    const [book, setBook] = useState<Book | null>(null);

    const searchBook = async () => {
        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            if (response.data.items && response.data.items.length > 0) {
                setBook(response.data.items[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={className}>
            <nav className={`flex ${isOpen ? 'flex-col' : ''} justify-start items-center px-4 text-xl`}>
                <div className={`flex ${isOpen ? 'flex-col' : ''} justify-start`}>
                    <div className="mr-24 flex items-center rounded-md ">
                        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="  Busca Restaurante" className="rounded-lg w-44 text-center text-black font-light italic bg-yellow-300  hover:bg-white" />
                        <button onClick={searchBook} className="ml-3"><SlMagnifier /></button>
                    </div>
                    {book && isbn && (
                        <a className='absolute top-0  left-[490px] w-[62px] hover:size-60 pt-1 ' href={book.volumeInfo.previewLink} target="_blank" rel="noopener noreferrer">
                            <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
                        </a>
                    )}
                    {user ? (
                        <>
                            {/* Enlaces para usuario logueado */}
                            <NavLink className="ml-8 text-red-500 hover:text-red-400" to="/cardCreation" onClick={() => setIsOpen(false)}>Cards</NavLink>
                            <NavLink className="ml-8 text-gray-800 hover:text-gray-500" to="/profile" onClick={() => setIsOpen(false)}>Profile</NavLink>
                            <NavLink className="ml-8 text-green-600 hover:text-green-400" to="/addCard" onClick={() => setIsOpen(false)}>AddCard</NavLink>
                            <button onClick={logOut} className="ml-8 flex items-center text-yellow-400 hover:bg-yellow-400
                             hover:text-black focus:outline-none border-2 border-green-700 rounded-lg p-1 transition-colors
                             duration-200"><img src={user.photo} alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%' }} /><span className="text-xs ml-1">Log Out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Enlaces para usuario no logueado */}
                            <NavLink className="ml-8 text-yellow-600 hover:text-white" to="/Home" onClick={() => setIsOpen(false)}>Home</NavLink>
                            <NavLink className="ml-8 text-yellow-600 hover:text-white" to="/Register" onClick={() => setIsOpen(false)}>Register</NavLink>
                            <button onClick={handleLogin} className="flex items-center ml-16 text-white hover:bg-yellow-500 hover:text-black focus:outline-none border-2 border-yellow-700 rounded-lg p-1 transition-colors duration-200 "> <AiOutlineUserAdd size={20} color="white" />
                                <span className="text-xs ml-1">Log In</span>
                            </button>

                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Menu;
