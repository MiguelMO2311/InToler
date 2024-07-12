import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { User } from '../models/User';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<User>();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors } } = useForm<ChangePasswordForm>();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const user_id = Number(userInfo.user_id || '0');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${user_id}`);
        const { name, surname, email, photo } = response.data;
        setValue('name', name);
        setValue('surname', surname);
        setValue('email', email);
        setValue('photo', photo);

      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, [setValue, user_id]);

  const onSubmit = (data: User) => {
    axios.put(`http://localhost:3000/users/${user_id}`, data)
      .then(response => {
        console.log('Perfil actualizado con éxito:', response.data);
        alert('Usuario actualizado con éxito');
        setTimeout(() => {
          navigate('/BooksPage');
        }, 1000);
      })
      .catch(error => {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil.');
      });
  };


  const onSubmitPassword = async (data: ChangePasswordForm) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      const response = await axios.put(`http://localhost:3000/users/${user_id}/password`, data);
      console.log('Contraseña cambiada con éxito:', response.data);
      alert('Cambiada contraseña con exito');
      setTimeout(() => {
        navigate('/BooksPage');
      }, 1000);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      alert('Error al cambiar la contraseña.');
    }
  };


  return (
    <div className="bg-cover bg-center h-screen transition-all duration-1000" style={{ backgroundImage: "url('/imgs/img_fondo_profile.jpg')", backgroundSize: 'cover', maxHeight: "550px" }}>
      <div className="flex justify-center items-start pt-10 border-dashed ">
        <div className="w-5/6 shadow-md rounded px-8 pt-6 pb-8 mb-4 hover:bg-green-800 hover:bg-opacity-40 flex">
          <div className="w-1/5 pt-12">
            <img src={userInfo.photo} alt="User" style={{ width: '90%', height: '84%', borderRadius: '5%' }} />
            <div className="flex justify-center mt-5">
            </div>
          </div>
          <div className="w-3/5 ml-2 pr-5">
            <h1 className="text-2xl font-bold mb-3 text-slate-800 hover:text-slate-400">Perfil</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Nombre:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="name"
                  type="text"
                  {...register('name', { required: 'El nombre es requerido.' })}
                />
                {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                  Apellido:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="surname"
                  type="text"
                  {...register('surname', { required: 'El apellido es requerido.' })}
                />
                {errors.surname && <p className="text-red-500 text-xs italic">{errors.surname.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'El email es requerido.',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'El formato del email no es válido.'
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                  Foto:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="photo"
                  type="text"
                  {...register('photo', { required: 'La foto es requerida.' })}
                />
                {errors.photo && <p className="text-red-500 text-xs italic">La foto es requerida.</p>}
              </div>
              <div className="flex justify-center mt-6">
                <button type="submit" className="bg-yellow-700 hover:bg-yellow-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Actualizar Perfil
                </button>
              </div>
            </form>
          </div>
          <div className="w-1/5 ml-4  hover:bg-green-800 hover:bg-opacity-50 ">
            <h2 className="text-xl font-bold mb-4 text-slate-800 hover:text-slate-400">Cambiar contraseña</h2>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="oldPassword">
                  Contraseña actual:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="oldPassword"
                  type="password"
                  {...registerPassword('oldPassword', { required: 'La contraseña actual es requerida.' })}
                />
                {passwordErrors.oldPassword && <p className="text-red-500 text-xs italic">{passwordErrors.oldPassword.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                  Nueva contraseña:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="newPassword"
                  type="password"
                  {...registerPassword('newPassword', { required: 'La nueva contraseña es requerida.' })}
                />
                {passwordErrors.newPassword && <p className="text-red-500 text-xs italic">{passwordErrors.newPassword.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirmar nueva contraseña:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-green-100 hover:bg-white"
                  id="confirmPassword"
                  type="password"
                  {...registerPassword('confirmPassword', { required: 'Confirmar la nueva contraseña es requerido.' })}
                />
                {passwordErrors.confirmPassword && <p className="text-red-500 text-xs italic">{passwordErrors.confirmPassword.message}</p>}
              </div>
              <div className="flex items-center justify-between">
                <button className="bg-yellow-700 hover:bg-yellow-950 text-white font-bold py-2 ml-7 rounded focus:outline-none focus:shadow-outline mt-[88px]" type="submit" >
                  Cambiar contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;