// src/hooks/usePreventBackLogout.js

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export const usePreventBackLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Push dummy state so back button interception works
    window.history.pushState({ preventBack: true }, '', window.location.href);

    const handlePopState = () => {
      const confirmLogout = window.confirm(
        'Are you sure you want to log out?'
      );

      if (confirmLogout) {
        // Clear storage and dispatch redux logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
        navigate('/login', { replace: true });
      } else {
        // Restore pushState to keep user on the dashboard
        window.history.pushState({ preventBack: true }, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, dispatch, navigate]);
};