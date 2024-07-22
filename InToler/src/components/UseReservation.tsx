import { useState } from 'react';
import api from './Api';

interface Reservation {
  name: string;
  date: string;
  time: string;
  guests: number;
}

const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createReservation = async (reservation: Reservation) => {
    setLoading(true);
    try {
      const response = await api.post('/reservations', reservation);
      setReservations([...reservations, response.data]);
    } catch (err) {
      setError('Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return { reservations, createReservation, loading, error };
};

export default useReservations;
