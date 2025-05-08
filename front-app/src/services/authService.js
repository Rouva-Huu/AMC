export const isAuthenticated = () => {
  return !!localStorage.getItem('jwt');
};

export const getToken = () => {
  return localStorage.getItem('jwt');
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const response = await fetch('http://localhost:8080/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};