import React, { useState, useEffect } from 'react'; 

function Booking() {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2025-05-05');
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {   // Загрузка списка больниц
    const fetchHospitals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/hospitals/');
        if (!response.ok) {
          throw new Error('Failed to fetch hospitals');
        }
        const data = await response.json();
        setHospitals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHospitals();
  }, []);
  useEffect(() => {  // Загрузка списка врачей при выборе больницы
    if (selectedHospital) {
      const fetchDoctors = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`http://localhost:8000/doctors/`);
          if (!response.ok) {
            throw new Error('Failed to fetch doctors');
          }
          const data = await response.json();
          // Фильтруем врачей по выбранной больнице
          const filteredDoctors = data.filter(doctor => 
            doctor.hospital_id === parseInt(selectedHospital)
          );
          setDoctors(filteredDoctors);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDoctors();
    } else {
      setDoctors([]);
      setSelectedDoctor('');
    }
  }, [selectedHospital]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHospital || !selectedDoctor || !appointmentDate || !appointmentTime) {
      setError('Please fill all fields');
      return;
    }
    try {
      setIsLoading(true);
      const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00`;
      const response = await fetch('http://localhost:8000/appointments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: parseInt(selectedDoctor),
          patient_id: 1, // Здесь нужно использовать ID текущего пользователя
          appointment_date: appointmentDateTime
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create appointment');}
      const result = await response.json();
      alert('Appointment created successfully!');
      // Сброс формы после успешного создания
      setSelectedHospital('');
      setSelectedDoctor('');
      setAppointmentDate('2025-05-05');
      setAppointmentTime('09:00');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); }};
  return (
    <div className="booking module" id="Booking">
      <h2>Make an appointment</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="data-input">Date of appointment:</label>
        <input
          type="date"
          id="data-input"
          name="data-booking"
          value={appointmentDate}
          min="2025-01-01"
          max="2026-12-31"
          onChange={(e) => setAppointmentDate(e.target.value)}
          style={{ 
            backgroundImage: "url('/assets/images/calendar.png')",
          }} />
        <label htmlFor="time-input">Time:</label>
        <input
          type="time"
          id="time-input"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          min="09:00"
          max="22:00"
          required
          style={{ 
            backgroundImage: "url('/assets/images/clock.png')",
          }}/>
        <div className="booking__select-wrapper">
          <label htmlFor="hospital-select">Clinic address:</label>
          <select 
            name="hospital" 
            id="hospital-select"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            disabled={isLoading}>
            <option value="">Select a clinic</option>
            {hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name} - {hospital.address}
              </option> ))}
          </select>
        </div>
        <div className="booking__select-wrapper">
          <label htmlFor="doctor-select">Doctor:</label>
          <select 
            name="doctor" 
            id="doctor-select"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            disabled={isLoading || !selectedHospital}>
            <option value="">Select a doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} (Available: {doctor.work_days?.join(', ')} {doctor.shift_start}-{doctor.shift_end})
              </option> ))}
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Register'}
        </button>
      </form>
    </div>);}
export default Booking;