import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Pagina404 = () => {
  const navigate = useNavigate();
  const [contador, setContador] = useState(5);

  useEffect(() => {
    if (contador === 0) {
      navigate('/');
    }
    const intervalId = setInterval(() => {
      setContador((prevContador) => prevContador - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [contador, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', alignSelf: 'center', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '40px' }}>
      <h1 className='text-6xl text-sky-600'>404</h1>
      <p className='text-2xl text-black'>
        Página No encontrada. `Serás redirigido a la página HOME en
        <span style={{ fontWeight: 'bold', color: 'red' }}> {contador} </span>
        segundos``.
      </p>
    </div>
  );
};

export default Pagina404;
