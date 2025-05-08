import React, { useState } from 'react';
import MedicalRecords from './MedicalRecords';

const Pet = ({ pet, onEditClick, onDeleteClick }) => {
  const [qrCode, setQrCode] = useState(null);
  const [showQr, setShowQr] = useState(false);

  const handleGetQrCode = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`http://localhost:8081/api/pets/${pet.id}/qr`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to get QR code');
      }

      const qrBlob = await response.blob();
      const qrUrl = URL.createObjectURL(qrBlob);
      setQrCode(qrUrl);
      setShowQr(true);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="account__container">
      <div className="account__container-header">
      <button onClick={() => onEditClick(pet)} style={{
        backgroundImage: 'url("../assets/images/edit-property.png")',
        backgroundColor: 'transparent',
        border: 'none',
        width: '32px', height: '32px',
        cursor: 'pointer'}}></button>
      <button onClick={handleGetQrCode} style={{
        backgroundImage: 'url("../assets/images/qr.png")',
        backgroundColor: 'transparent',
        border: 'none',
        width: '32px', height: '32px',
        cursor: 'pointer',
        marginLeft: '22px'}}></button> 
      <button onClick={() => onDeleteClick(pet.id)} style={{
        backgroundImage: 'url("../assets/images/delete.png")',
        backgroundColor: 'transparent',
        border: 'none',
        width: '32px', height: '32px',
        cursor: 'pointer',
        marginLeft: '22px'}}></button>
    </div>
    <hr/>
    <h4>{pet.name}</h4>
    <h5>
      Age: {pet.age} years
      <br />
      Breed: {pet.breed}
    </h5>
    <MedicalRecords record={pet.medicalRecord} />

    {showQr && (
        <div className="qr-modal" style={{
          width: 'fit-content',
          height: 'fit-content',
        }}>
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}> 
          <h3>QR of the medical record</h3> <button 
            onClick={() => setShowQr(false)}
            style={{
              backgroundImage: 'url("../assets/images/close.png")',
              backgroundColor: 'transparent',
              border: 'none',
              width: '32px', height: '32px',
              cursor: 'pointer',
              margin: '8px 0 0 14px'
            }}
          >
          </button>
          </div>
          <img 
            src={qrCode} 
            alt="QR код медицинской карты" 
            style={{ width: '200px', height: '200px', margin: '0px'}}
          />

        </div>
        </div>
      )}
  </div>
  );
};

const accountContainers = document.querySelectorAll('.account__container');
accountContainers.forEach(cont => {
  cont.addEventListener('mouseenter', () => {
    const angle = 3;
    const direction = Math.random() < 0.5 ? -1 : 1;
    cont.style.transform = 'rotate('+ direction * angle +'deg)';
  });
  cont.addEventListener('mouseleave', () => {
    cont.style.transform = 'rotate(0deg)';
  });
});

const PetsList = ({ pets, onEditClick, onDeleteClick }) => {
  return pets.map(pet => (
    <Pet 
      pet={pet} 
      key={pet.id} 
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    />
  ));
};

export default PetsList;