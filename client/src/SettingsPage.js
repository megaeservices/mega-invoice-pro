import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './context/AuthContext';
import { db } from './firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './SettingsPage.css';

const SettingsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [defaultSignatureUrl, setDefaultSignatureUrl] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, 'settings', 'companyProfile');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompanyName(data.companyName || '');
        setCompanyAddress(data.companyAddress || '');
        setCompanyPhone(data.companyPhone || '');
        setCompanyWebsite(data.companyWebsite || '');
        setLogoUrl(data.logoUrl || '');
        setDefaultSignatureUrl(data.defaultSignatureUrl || '');
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const profileData = {
        companyName,
        companyAddress,
        companyPhone,
        companyWebsite,
        logoUrl,
        defaultSignatureUrl,
      };
      const docRef = doc(db, 'settings', 'companyProfile');
      await setDoc(docRef, profileData, { merge: true });

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving company profile:', error);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Company Profile</h1>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Company Address</label>
          <input
            type="text"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Company Phone</label>
          <input
            type="text"
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Company Website</label>
          <input
            type="text"
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Logo URL</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Default Signature URL</label>
          <input
            type="text"
            value={defaultSignatureUrl}
            onChange={(e) => setDefaultSignatureUrl(e.target.value)}
          />
        </div>
        <button className="save-button" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
