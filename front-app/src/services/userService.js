export const fetchCurrentUser = async (token) => {
    const response = await fetch('http://localhost:8080/api/user/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  };
  
export const updateUserData = async (token, data) => {
  console.log('Sending update:', data); 
  const response = await fetch('http://localhost:8080/api/user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.message || 'Update failed');
  }
  
  return responseData;
};