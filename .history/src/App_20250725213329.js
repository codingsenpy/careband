import React, { useEffect, useState } from 'react';
import './App.css';

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="pwa-install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-icon">📱</div>
        <div className="install-prompt-text">
          <h3>Install CareBand</h3>
          <p>Add CareBand to your home screen for quick access and offline use.</p>
        </div>
        <div className="install-prompt-actions">
          <button onClick={handleInstallClick} className="install-btn">
            Install
          </button>
          <button onClick={handleDismiss} className="dismiss-btn">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

function StartupAnimation() {
  return (
    <div className="startup-animation">
      <div className="pulse-logo">
        <img src="/favicon.png" alt="CareBand Logo" className="pulse-favicon" />
        <span className="pulse-text">CareBand</span>
      </div>
    </div>
  );
}

export default function App() {
  const [showAnim, setShowAnim] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowAnim(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  if (showAnim) return <StartupAnimation />;
  return (
    <div className="dashboard">
      {/* Top status bar */}
      <div className="status-bar">
        <span className="band-status connected">🟢 Band Connected</span>
        <span className="battery-status">🔋 82%</span>
      </div>
      {/* Emergency SOS */}
      <div className="sos-section">
        <button className="sos-btn">🚨 SOS</button>
        <div className="sos-label">Emergency Alert</div>
      </div>
      {/* Vitals */}
      <div className="vitals-row">
        <div className="vital-card">
          <span className="vital-icon" role="img" aria-label="Heart">💓</span>
          <div className="vital-value">76</div>
          <div className="vital-label">bpm</div>
        </div>
        <div className="vital-card">
          <span className="vital-icon" role="img" aria-label="Oxygen">🫁</span>
          <div className="vital-value">98%</div>
          <div className="vital-label">SpO₂</div>
        </div>
        <div className="vital-card">
          <span className="vital-icon" role="img" aria-label="Temp">🌡️</span>
          <div className="vital-value">36.7°C</div>
          <div className="vital-label">Temp</div>
        </div>
      </div>
      {/* Reminders */}
      <div className="reminders">
        <div className="reminder-card">
          <span className="reminder-icon">💊</span>
          <span className="reminder-text">Meds: 2:00 PM</span>
        </div>
        <div className="reminder-card">
          <span className="reminder-icon">🥤</span>
          <span className="reminder-text">Drink Water: 2:30 PM</span>
        </div>
        <div className="reminder-card">
          <span className="reminder-icon">🍽️</span>
          <span className="reminder-text">Eat: 6:00 PM</span>
        </div>
      </div>
      {/* AI Bathroom Prediction */}
      <div className="ai-bathroom">
        <span className="ai-icon">🧠</span>
        <span className="ai-text">Bathroom likely needed in 20 min</span>
      </div>
      {/* Caregiver Panic Button */}
      <button className="panic-btn">📲 Contact Caregiver</button>
    </div>
  );
}
