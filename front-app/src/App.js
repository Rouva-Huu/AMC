import './assets/css/styles.css';
import './assets/images/down2.png';
import './assets/images/clock.png';
import './assets/images/calendar.png';
import Booking from './components/Booking';
import PetsList from './components/PetsList';
import MedicalEntryForm from './components/MedicalEntryForm';
import React, { useState, useEffect } from 'react';
import { initPopups } from './scripts/popup';
import { fetchCurrentUser } from './services/userService';
import { fetchUserPets, addUserPet } from './services/petsService';
// import { handleAddPet, handleEditPet, handleDeletePet, updateMedicalRecords } from './services/petHandlers';
import { handleAddPet, handleEditPet, updateMedicalRecords } from './services/petHandlers';
import { deleteUserPets } from './services/petsService';

function App() {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', username: '', password: '' });
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [petFormData, setPetFormData] = useState({ id: null, name: '', breed: '', age: ''});
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [editData, setEditData] = useState({ email: '', phone: '', city: '' });
  const [medicalData, setMedicalData] = useState({ vaccinations: [], allergies: [], chronicDiseases: [] });
  const [newEntry, setNewEntry] = useState({ type: 'vaccinations', value: '' });

  useEffect(() => { 
    const loadUserAndPets = async () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const userData = await fetchCurrentUser(token);
          setUser(userData);
          
          // Загрузка питомцев
          const petsData = await fetchUserPets(token);
          setPets(petsData);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
    };
    loadUserAndPets();
    initPopups();
  }, []);

  const handleConfirmClick = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('Вы не авторизованы');
      }
      const userData = {
        email: editData.email || null,
        phone: editData.phone || null,
        city: editData.city || null
      };
      console.log('Отправляем данные:', userData);
      const response = await fetch('http://localhost:8080/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка сервера');
      }
      const updatedUser = await response.json();
      console.log('Получен обновленный пользователь:', updatedUser);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.hash = '';
      console.log('Данные успешно сохранены!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert(`Не удалось сохранить данные: ${error.message}`);
    }
  };
  
  const openAddPetForm = () => {
    setIsEditingPet(false);
    setMedicalData({ 
      vaccinations: [],
      allergies: [],
      chronicDiseases: []
    });
    setPetFormData({ id: null, name: '', breed: '', age: '' });
    (document.getElementById('Account')).classList.remove('open');
    (document.getElementById('EditPet')).classList.add('open');
  };

  const openEditPetForm = (pet) => {
    setIsEditingPet(true);
    setMedicalData({ 
      vaccinations: [],
      allergies: [],
      chronicDiseases: []
    });
    setPetFormData(pet);
    (document.getElementById('Account')).classList.remove('open');
    (document.getElementById('EditPet')).classList.add('open');
  };

  const resetMedicalData = () => {
    setMedicalData({
      vaccinations: [],
      allergies: [],
      chronicDiseases: []
    });
  };

  const handleDeletePet = async (petId) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('Not authenticated');
      
      await deleteUserPets(token, petId);
      
      // Обновляем состояние после удаления
      setPets(prev => prev.filter(pet => pet.id !== petId));
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert(`Failed to delete pet: ${error.message}`);
    }
  };


  const handlePetConfirm = async () => {
    try {
      if (!petFormData.name || !petFormData.breed || !petFormData.age) {
        throw new Error('All fields are required');
      }
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('Not authenticated');

      const petData = {
        name: petFormData.name,
        breed: petFormData.breed,
        age: petFormData.age,
        medicalRecord: medicalData
      };

      console.log(medicalData);
      
      if (isEditingPet) {
        // Обновление медицинских записей
        // const response = await fetch(`http://localhost:8081/api/pets/${petFormData.id}/medical-record`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        //   },
        //   body: JSON.stringify(medicalData)
        // });
  
        // if (!response.ok) throw new Error('Failed to update medical records');
        
        // Обновляем состояние
        // const updatedPet = updateMedicalRecords(token, petFormData.id, medicalData);
        // setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
        const updatedPet = updateMedicalRecords(token, petFormData.id, medicalData);
        setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
      } else {
        // Создание нового питомца с медицинскими записями
        const newPet = await handleAddPet(petData, token, setPets);
        // console.log(newPet);
        if (medicalData) {
          await updateMedicalRecords(token, newPet.id, medicalData);
          // console.log(newPet.id);
          // Обновляем состояние с полными данными питомца
          setPets(prev => prev.map(p => p.id === newPet.id ? {...p, medicalRecord: medicalData} : p));
        }

      }
      (document.getElementById('EditPet')).classList.remove('open');
      (document.getElementById('Account')).classList.add('open');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { username, password } = loginData;
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const { token, user } = await response.json(); // Предполагаем, что бэкенд возвращает user
      localStorage.setItem('jwt', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      setLoginData({ username: '', password: '' });
      (document.getElementById('Auth')).classList.remove('open');
      (document.getElementById('Booking')).classList.add('open');
      } catch (error) {
        alert('Login failed. Please check your credentials.');
      }
    };
  
    const handleRegister = async (e) => {
      e.preventDefault();
      try {
        const { name, username, password } = registerData;
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, username, password })
        });
        
        if (!response.ok) throw new Error('Registration failed');
        
        alert('Registration successful! Please login.');
        setRegisterData({ name: '', username: '', password: '' });
        window.location.hash = '';
      } catch (error) {
        alert('Registration failed. Username might be taken.');
      }
    };

  useEffect(() => {
    if (user) {
      setEditData({
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || ''
      });
    }
  }, [user]);

  return (
    <>
      {/* HOMEPAGE */}
      <div className="homepage">
        <div className="homepage__header">
          <p>
            more than 40 top clinics
            <br />
            across the country
          </p>
          <div
            style={{
              backgroundColor: '#dfeae0',
              width: '188px',
              height: '18px',
              margin: '8px 0 0 -1110px',
              zIndex: -1,
            }}
          />
          <p>every day from 9:00 to 22:00, no weekends</p>
        </div>

        <div className="homepage__container module open" id="Homepage">
          <h1>Animal Medical Center</h1>
          <h3>
            professional doctors, modern equipment and sincere love for animals
            – everything for the health and
            <br />
            peace of mind of your pets
          </h3>

          <div className="homepage__container-img">
            <img src="/assets/images/cat.png" alt="cat" />
            <img src="/assets/images/dog.png" alt="dog" />
            <img src="/assets/images/kitten.png" alt="kitten" />
            <img src="/assets/images/hamster.png" alt="hamster" />
            <img src="/assets/images/aquarium.png" alt="fish" />
            <img src="/assets/images/turtle.png" alt="turtle" />
          </div>
          <div className="homepage__container-img">
            <p>cats&nbsp;&nbsp;&nbsp;</p>
            <p>dogs&nbsp;&nbsp;&nbsp;</p>
            <p>babies</p>
            <p>rodents</p>
            <p>&nbsp;fish&nbsp;&nbsp;</p>
            <p>&nbsp;exotic</p>
          </div>
          <a href="#Booking" className="popup__link" data-require-auth="true">
            <button>Make an appointment</button>
          </a>
        </div>

        <div
          style={{
            backgroundColor: '#2f6261',
            width: '890px',
            height: '890px',
            position: 'absolute',
            top: '-24vw',
            left: '57vw',
            zIndex: -1,
            borderRadius: '50%',
          }}
        />
        <img
          style={{
            position: 'absolute',
            width: '560px',
            top: '25vw',
            left: '64vw',
          }}
          src="/assets/images/cat2.png"
          alt="cat2"
        />
      </div>

      {/* LOGIN / REGISTER */}
      <div className="auth module" id="Auth">
        <div className="auth__container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input 
                type="text" 
                placeholder="Username" 
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                required
              />
            <input 
              type="password" 
              placeholder="Password" 
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
            />
            <button type="submit">Sign in</button>
          </form>
        </div>
        <div className="auth__container">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input 
              type="text" 
              placeholder="Name" 
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              required
            />
            <input 
              type="text" 
              placeholder="Username" 
              value={registerData.username}
              onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              required
            />
            <button type="submit">Sign up</button>
          </form>
        </div>
      </div>

      {/* PERSONAL ACCOUNT */}
      <div className="account module" id="Account">
        <div className="account__header"><h2>{user?.name || 'User'}</h2><a href="#EditAccount" className="popup__link"><button></button></a>
        <button 
        data-logout
        style={{
          backgroundImage: 'url("../assets/images/exit.png")',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '0 0 0 20px',
        }}
      ></button></div>
        <h3>
          {user?.email || 'Email not provided'} |         
          {' ' + (user?.phone || 'Phone not provided')} | 
          {' ' + (user?.city || 'City not provided')}
        </h3>
        <hr />
        <img src="/assets/images/pets.png" alt="pets" />
        <PetsList pets={pets} onEditClick={openEditPetForm} onDeleteClick={handleDeletePet} />

        <button onClick={openAddPetForm} className="add-pet-button" style={{
              backgroundImage: 'url("../assets/images/add.png")',
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'transparent',
              border: 'none',
              width: '60px', height: '60px',
              cursor: 'pointer',
              verticalAlign: 'top',
              marginTop: '30px'}}></button>
        {/* <hr />
        <img src="/assets/images/health-calendar.png" alt="calendar" />
        <div className="account__container">
          <h6>28.05 | 18:30</h6>
          <hr />
          <h5>Doctor's specialty</h5>
        </div> */}
      </div>

      {/* EDIT-ADD PET */}

      <div className="edit" style={{
        margin: '-36vw 0 0 12vw',
      }}> 
        <div className="edit__container module" id="EditPet">
          <h3>{isEditingPet ? 'Edit Pet' : 'Add New Pet'}</h3>
          <div className="edit__container-input">
            <label>Name: </label>
            <input type="text" minLength="1" size="12"
              value={petFormData.name} placeholder="Enter name "
              onChange={(e) => setPetFormData({...petFormData, name: e.target.value})} ></input>
          </div>
          <div className="edit__container-input">
            <label>Pet's age: </label>
            <input type="number" size="12"
              value={petFormData.age} placeholder="Enter age "
              onChange={(e) => setPetFormData({...petFormData, age: Number(e.target.value)})} ></input>
          </div>
          <div className="edit__container-input">
            <label>Breed: </label>
            <input minLength="3" size="12" type="text" 
              value={petFormData.breed} placeholder="Enter breed"
              onChange={(e) => setPetFormData({...petFormData, breed: e.target.value})} ></input>
          </div>
           <div className="medical-section">
            <h3>Medical Records</h3>
            <MedicalEntryForm
              medicalData={medicalData} 
              onReset={resetMedicalData}
              onAdd={(type, value) => setMedicalData(prev => ({
                ...prev,
                [type]: [...prev[type], value]
              }))}
            />
          </div>
          
          <div className="edit__container-button">
            <button className="edit_cancel" id="Cancel"
            style={{
              backgroundColor: '#2f6261ab',
            }}>Cancel</button>
            <button onClick={handlePetConfirm}>
              {isEditingPet ? 'Save Changes' : 'Add Pet'}
            </button>
          </div>
        </div> 
      </div>

      {/* EDIT ACCOUNT */}

      <div className="edit" style={{
          margin: '-31vw 0 0 12vw'
        }}> 
        <div className="edit__container module" id="EditAccount">
          <h2> Edit my account </h2>
          
            <div className="edit__container-input">
              <label>Email: </label>
              <input type="email" minLength="4" size="12"
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}></input>
            </div>
            <div className="edit__container-input">
              <label>Phone number: </label>
              <input type="tel" required minLength="4" size="12"
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}></input>
            </div>
            <div className="edit__container-input">
              <label>City: </label>
              <input required minLength="4" size="12" type="text" 
                value={editData.city}
                onChange={(e) => setEditData({...editData, city: e.target.value})} ></input>
            </div>
          
          <div className="edit__container-button">
            <button className="edit_cancel" id="Cancel"
            style={{
              backgroundColor: '#2f6261ab',
            }}>Cancel</button>
            <button type="submit" className="edit_confirm"           
              onClick={handleConfirmClick}>Confirm</button>
          </div>
        </div> 
      </div>

      {/* BOOKING */}
      <Booking />

      {/* EMERGENCY CALL */}

      <div className="emergency module" id="EmergCall">
        <div className="emergency__container">
          <div className="emergency__header"><img src="/assets/images/hospital.png" alt=""/><h2>Emergency veterinary care</h2></div>
          <div id="map" 
          style={{
            width: '36vw', 
            height: '25vw',
            backgroundColor: '#2f6261',
            margin: '0 0 24px 0'
            }}></div>
          <button>Find a clinic near you</button>
        </div>
        <div className="emergency__container-panel">
          <div className="emergency__header"><img src="/assets/images/hospitals.png" alt=""/><h2>Emergency veterinarian call</h2></div>
          <input type="tel" id="phoneNumber" placeholder="Your phone number" required size="22"></input>
          <button>Call a veterinarian</button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer__container">
        <img src="/assets/images/homepage.png" alt=""/><a href="#Homepage" className="popup__link">homepage</a></div> 
        <div className="footer__container">
        <img src="/assets/images/user.png" alt=""/><a href="#Account" className="popup__link" data-require-auth="true">my account</a></div> 
        <div className="footer__container">
        <img src="/assets/images/booking.png" alt=""/><a href="#Booking" className="popup__link">booking</a></div> 
        <div className="footer__container">
        <img src="/assets/images/siren.png" alt=""/><a href="#EmergCall" className="popup__link">emergency call</a></div> 
      </div>
    </>
  );
}

export default App;