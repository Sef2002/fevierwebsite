import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const allTimeSlots = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
  '22:00'
];

export default function BookService() {
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [status, setStatus] = useState('Confermato');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!date) return;

      const { data, error } = await supabase
        .from('Appointments')
        .select('time')
        .eq('date', date);

      if (error) {
        console.error('Errore durante il fetch:', error.message);
        setAvailableTimes([]);
        return;
      }

      const booked = data.map((d) => d.time);
      const free = allTimeSlots.filter((slot) => !booked.includes(slot));
      setAvailableTimes(free);
    };

    fetchAvailableTimes();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const { error } = await supabase.from('Appointments').insert([
      { client_name: clientName, service, date, time, status }
    ]);

    setLoading(false);

    if (error) {
      setErrorMessage('Errore nella prenotazione.');
      console.error(error);
    } else {
      setSuccessMessage('Appuntamento registrato con successo!');
      setClientName('');
      setService('');
      setDate('');
      setTime('');
      setAvailableTimes([]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Prenota un Servizio</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome cliente"
          className="w-full p-2 border rounded"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Servizio"
          className="w-full p-2 border rounded"
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime('');
          }}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          disabled={!availableTimes.length}
          required
        >
          <option value="">-- Seleziona un orario --</option>
          {availableTimes.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Salvataggio...' : 'Prenota'}
        </button>
      </form>

      {successMessage && (
        <p className="mt-4 text-green-600 font-medium">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mt-4 text-red-600 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}