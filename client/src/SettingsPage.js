import React, { useState, useEffect } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [defaultSignatureUrl, setDefaultSignatureUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/settings/profile');
        if (response.ok) {
          const data = await response.json();
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
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const profileData = {
        companyName,
        companyAddress,
        companyPhone,
        companyWebsite,
        logoUrl,
        defaultSignatureUrl,
      };

      await fetch('/api/settings/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

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
