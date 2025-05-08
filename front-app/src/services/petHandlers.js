export const handleAddPet = async (petData, token, setPets) => {
    try {
      const response = await fetch('http://localhost:8081/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: petData.name,
          breed: petData.breed,
          age: petData.age // Преобразование в число
        })
      });
      
      if (!response.ok) throw new Error('Failed to add pet');
      
      const newPet = await response.json();
      setPets(prev => [...prev, newPet]);
      return newPet;
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    }
  };
  
export const handleEditPet = async (petId, petData, token, setPets) => {
    try {
      const response = await fetch(`http://localhost:8081/api/pets/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(petData)
      });
      
      if (!response.ok) throw new Error('Failed to update pet');
      
      const updatedPet = await response.json();
      setPets(prev => prev.map(pet => 
        pet.id === updatedPet.id ? updatedPet : pet
      ));
      return true;
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    }
  };

// export  const handleDeletePet = async (petId, setPets) => {
//     try {
//       const token = localStorage.getItem('jwt');
//       if (!token) throw new Error('Not authenticated');
      
//       await deleteUserPets(token, petId);
      
//       // Обновляем состояние после удаления
//       setPets(prev => prev.filter(pet => pet.id !== petId));
//     } catch (error) {
//       console.error('Error deleting pet:', error);
//       alert(`Failed to delete pet: ${error.message}`);
//     }
//   };
// перемещен в App.js

export const updateMedicalRecords = async (token, petId, medicalData) => {
    const response = await fetch(`http://localhost:8081/api/pets/${petId}/medical-record`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(medicalData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update medical records');
    }
    
    return await response.json();
  };