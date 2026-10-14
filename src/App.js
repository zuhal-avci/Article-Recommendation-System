import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ArticlesPage from './pages/ArticlesPage';
import LikedArticlesPage from './pages/LikedArticlesPage';
import ReadArticlesPage from './pages/ReadArticlesPage';
import ProfilePage from './pages/ProfilePage';

import ProfileIcon from './components/ProfileIcon';
import Exit from './components/Exit';
import HomeIcon from './components/HomeIcon';

import './App.css';

function App() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kullanıcı giriş yaptığında localStorage'a kaydet
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('userData');
      setIsLoggedIn(false);
    }
  }, [userData]);

  // Sayfa kapatıldığında localStorage'dan verileri sil
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('userData');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <div className="App" style={{ position: 'relative' }}>
        {isLoggedIn && (
          <div className="icon-bar">
            <ProfileIcon />
            <HomeIcon />
            <Exit setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
          </div>
        )}

        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn
                ? <Navigate to="/" />
                : <LoginPage setUserData={setUserData} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn
                ? <Navigate to="/" />
                : <SignupPage setUserData={setUserData} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn
                ? <ArticlesPage userData={userData} />
                : <Navigate to="/login" />
            }
          />
          <Route
            path="/liked"
            element={
              isLoggedIn
                ? <LikedArticlesPage userData={userData} />
                : <Navigate to="/login" />
            }
          />
          <Route
            path="/read"
            element={
              isLoggedIn
                ? <ReadArticlesPage userData={userData} />
                : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn
                ? <ProfilePage userData={userData} />
                : <Navigate to="/login" />
            }
          />
          <Route
            path="*"
            element={
              isLoggedIn
                ? <Navigate to="/" />
                : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
