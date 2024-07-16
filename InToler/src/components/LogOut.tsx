import { AiOutlineUserAdd } from "react-icons/ai"; 
import { AiOutlineUserDelete } from "react-icons/ai"; 

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

type MenuProps = {
    className?: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LogOut: React.FC<MenuProps> = ({ className, isOpen, setIsOpen }) => {
    const [user, setUser] = useState<unknown | null>(null);

    const toggleUser = () => {
        setUser(user ? null : {}); // Cambia el estado del usuario cuando se hace clic en el botón
    };

    return (
        <div className={className}>
            <nav className={`flex ${isOpen ? 'flex-col' : ''} justify-start items-center px-4 text-xl`}>
                <div className={`flex ${isOpen ? 'flex-col' : ''} justify-start`}>
                    {user ? (
                        <>
                            <NavLink className="ml-8 text-blue-700 hover:text-blue-400" to="/Home" onClick={() => setIsOpen(false)}>Home</NavLink>
                            <NavLink className="ml-8 text-red-700 hover:text-red-300" to="/CardsPage" onClick={() => setIsOpen(false)}>Books</NavLink>
                            <NavLink className="ml-8 text-purple-700 hover:text-purple-300" to="/Profile" onClick={() => setIsOpen(false)}>Profile</NavLink>
                            <NavLink className="ml-8 text-yellow-700 hover:text-yellow-300" to="/AddCard" onClick={() => setIsOpen(false)}>Add Book</NavLink>
                            <NavLink className="ml-8 text-green-700 hover:text-green-300" to="/EditCard" onClick={() => setIsOpen(false)}>Edit Book</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink className="ml-8 text-blue-700 hover:text-blue-400" to="/Home" onClick={() => setIsOpen(false)}>Home</NavLink>
                            <NavLink className="ml-8 text-lime-600 hover:text-lime-400" to="/Register" onClick={() => setIsOpen(false)}>Register</NavLink>
                            <NavLink className=" space-x-8 ml-10 text-white hover:text-black px-1 py-2 border-2 border-green-100 rounded hover:bg-yellow-500"
                                to="/Login" onClick={() => setIsOpen(false)}>Log In</NavLink>
                        </>
                    )}
                </div>
                <button onClick={toggleUser} style={{ fontSize: '8px', margin: '5%', width: '40px' }}>
                    {user ? <AiOutlineUserDelete  size={30} color="red" /> : <AiOutlineUserAdd size={30} color="white" />}
                    <span style={{ color: user ? 'red' : 'white' }}>
                        {user ? ' DEL User' : ' ADD User'}
                    </span>
                </button>

            </nav>
        </div>
    );
};


export default LogOut;
