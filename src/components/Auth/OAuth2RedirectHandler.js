import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log("OAuth2RedirectHandler : " + params);
    console.log("OAuth2RedirectHandler : " + token);

    if (token) {
      const decodedToken = jwtDecode(token);
      localStorage.setItem('JWT_TOKEN', token);
      const user = {
        username: decodedToken.sub,
        roles: decodedToken.roles.split(','),
      };
      localStorage.setItem('USER', JSON.stringify(user));
      navigate('/notes');
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
