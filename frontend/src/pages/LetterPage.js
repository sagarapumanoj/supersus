import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './LetterPage.css';

const LetterPage = ({ navigate }) => {
  const [credentials, setCredentials] = useState({ name: '', purpose: '', date: '' });
  const [generatedLetter, setGeneratedLetter] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const generateLetter = () => {
    if (!credentials.name || !credentials.purpose || !credentials.date) return alert('Fill all fields');
    const letter = `To Whomsoever It May Concern,

This is to certify that ${credentials.name} is requesting permission for ${credentials.purpose} on ${credentials.date}.

Thank you.

Campus Portal`;
    setGeneratedLetter(letter);
  };

  return (
    <div className="letter-container">
      <Navbar user={{ name: credentials.name }} navigate={navigate} />
      <h2>Generate Letter</h2>
      <input type="text" placeholder="Your Name" name="name" value={credentials.name} onChange={handleChange} />
      <input type="text" placeholder="Purpose" name="purpose" value={credentials.purpose} onChange={handleChange} />
      <input type="date" name="date" value={credentials.date} onChange={handleChange} />
      <button className="btn" onClick={generateLetter}>Generate</button>

      {generatedLetter && (
        <textarea readOnly value={generatedLetter} rows="10" />
      )}
    </div>
  );
};

export default LetterPage;
