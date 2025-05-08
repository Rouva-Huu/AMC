export const fetchUserPets = async (token) => {
    const response = await fetch('http://localhost:8081/api/pets', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user pets');
        return await response.json();
};

export const addUserPet = async (token, petData) => {
    const response = await fetch('http://localhost:8081/api/pets', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(petData)
    });
    if (!response.ok) throw new Error('Failed to add user pet');
    return await response.json();
  };
  
export const updateUserPet = async (token, petId, petData) => {
    const response = await fetch(`http://localhost:8081/api/pets/${petId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(petData)
    });
    if (!response.ok) throw new Error('Failed to update user pet');
    return await response.json();
  };

  export const deleteUserPets = async (token, petId) => {
    const response = await fetch(`http://localhost:8081/api/pets/${petId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete user pet');
    }
    
    return await response.text(); // Если сервер возвращает простой текст
  };

  export const updateMedicalRecords = async(token, petId, medicalData) => {
  const response = await fetch(`http://localhost:8081/api/pets/${petId}/medical-record`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(medicalData)
    });

    if (!response.ok) throw new Error('Failed to update medical records');
    
    return await response.json();
  };