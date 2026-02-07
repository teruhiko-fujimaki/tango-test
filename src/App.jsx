
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import CourseSelect from './components/CourseSelect';
import Quiz from './components/Quiz';
import ReviewList from './components/ReviewList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>英単語学習アプリ</h1>
          <div className="header-user-area">
            {user && (
              <>
                <span className="user-display">User: {user}</span>
                <Link to="/review" className="review-link">見直し帳</Link>
              </>
            )}
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/course-select"
            element={user ? <CourseSelect /> : <Navigate to="/" replace />}
          />
          <Route
            path="/quiz"
            element={user ? <Quiz /> : <Navigate to="/" replace />}
          />
          <Route
            path="/review"
            element={user ? <ReviewList /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
