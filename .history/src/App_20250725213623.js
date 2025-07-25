import React, { useEffect, useState } from 'react';
import './App.css';

// Debug component to help troubleshoot PWA issues
function PWADebugInfo() {
  const [debugInfo, setDebugInfo] = useState({});
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const info = {
      isSecureContext: window.isSecureContext,
      hasServiceWorker: 'serviceWorker' in navigator,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      navigatorStandalone: window.navigator.standalone,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent,
      manifestLink: document.querySelector('link[rel="manifest"]')?.href
    };
    setDebugInfo(info);
  }, []);

  if (!showDebug) {
    return (
      <button 
        onClick={() => setShowDebug(true)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#7F3FBF',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 1001
        }}
      >
        Debug PWA
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1001,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <button 
        onClick={() => setShowDebug(false)}
        style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        ✕
      </button>
      <h4>PWA Debug Info</h4>
      <div>
        <strong>Secure Context:</strong> {debugInfo.isSecureContext ? '✅' : '❌'}<br/>
        <strong>Service Worker:</strong> {debugInfo.hasServiceWorker ? '✅' : '❌'}<br/>
        <strong>Standalone:</strong> {debugInfo.isStandalone ? '✅' : '❌'}<br/>
        <strong>Protocol:</strong> {debugInfo.protocol}<br/>
        <strong>Hostname:</strong> {debugInfo.hostname}<br/>
        <strong>Manifest:</strong> {debugInfo.manifestLink ? '✅' : '❌'}<br/>
        <strong>User Agent:</strong> {debugInfo.userAgent?.substring(0, 50)}...
      </div>
    </div>
  );
}

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (running in standalone mode)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              window.navigator.standalone ||
                              document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt after a short delay to ensure user engagement
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setShowManualInstructions(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    // Show manual instructions if no beforeinstallprompt after 5 seconds
    const manualTimer = setTimeout(() => {
      if (!deferredPrompt && !isStandalone) {
        console.log('No beforeinstallprompt event, showing manual instructions');
        setShowManualInstructions(true);
      }
    }, 5000);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(manualTimer);
    };
  }, [deferredPrompt, isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
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
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setShowManualInstructions(false);
  };

  // Don't show anything if app is already installed
  if (isStandalone) return null;

  // Show automatic install prompt if available
  if (showInstallPrompt && deferredPrompt) {
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

  // Show manual instructions for browsers that don't support beforeinstallprompt
  if (showManualInstructions) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    return (
      <div className="pwa-install-prompt">
        <div className="install-prompt-content">
          <div className="install-prompt-icon">📱</div>
          <div className="install-prompt-text">
            <h3>Install CareBand</h3>
            {isIOS && (
              <p>Tap the share button <span style={{fontSize: '1.2em'}}>⬆️</span> and select "Add to Home Screen"</p>
            )}
            {isAndroid && (
              <p>Tap the menu button <span style={{fontSize: '1.2em'}}>⋮</span> and select "Add to Home screen" or "Install app"</p>
            )}
            {!isIOS && !isAndroid && (
              <p>Look for the install button in your browser's address bar or menu to add this app to your device.</p>
            )}
          </div>
          <div className="install-prompt-actions">
            <button onClick={handleDismiss} className="dismiss-btn">
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
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
      <PWADebugInfo />
      <PWAInstallPrompt />
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
