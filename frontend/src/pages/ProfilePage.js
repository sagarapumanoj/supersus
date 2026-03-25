import React from 'react';
import Navbar from '../components/Navbar';
import './ProfilePage.css';

const ProfilePage = ({ user, navigate }) => {
  return (
    <div className="profile-container">
      <Navbar user={user} navigate={navigate} />
      <h2>Profile of {user.name}</h2>
      <p>Role: {user.role}</p>
      <p>Department: {user.department}</p>
      <button className="btn" onClick={() => navigate('home')}>Back to Home</button>
    </div>
  );
};

export default ProfilePage;
