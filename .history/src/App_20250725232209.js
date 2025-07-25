import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function UpcomingFeaturesPage({ onClose }) {
  return (
    <div className="upcoming-features-page">
      <div className="features-header">
        <button className="back-btn" onClick={onClose}>
          ← Back
        </button>
        <h2>Coming Soon</h2>
      </div>
      
      <div className="features-content">
        <div className="feature-card ai-health">
          <div className="feature-icon">🧠</div>
          <div className="feature-info">
            <h3>AI Emotional Health Detection</h3>
            <p>Advanced AI algorithms analyze your vitals and physical movement patterns to detect mood changes and emotional well-being.</p>
            <div className="feature-details">
              <div className="detail-item">
                <span className="detail-icon">💓</span>
                <span>Heart rate variability analysis</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🚶</span>
                <span>Movement pattern recognition</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📊</span>
                <span>Mood trend tracking</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🎯</span>
                <span>Personalized wellness recommendations</span>
              </div>
            </div>
            <div className="feature-status">
              <span className="status-badge beta">Beta Testing</span>
            </div>
          </div>
        </div>

        <div className="feature-card telemedicine">
          <div className="feature-icon">👩‍⚕️</div>
          <div className="feature-info">
            <h3>Telemedicine Integration</h3>
            <p>Seamlessly connect with healthcare providers for virtual consultations and real-time health monitoring.</p>
            <div className="feature-details">
              <div className="detail-item">
                <span className="detail-icon">📹</span>
                <span>Video consultations</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📋</span>
                <span>Real-time data sharing</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">💊</span>
                <span>Digital prescriptions</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🔔</span>
                <span>Appointment scheduling</span>
              </div>
            </div>
            <div className="feature-status">
              <span className="status-badge development">In Development</span>
            </div>
          </div>
        </div>

        <div className="feature-card additional">
          <div className="feature-icon">✨</div>
          <div className="feature-info">
            <h3>More Features Coming</h3>
            <p>We're constantly working on new features to enhance your health monitoring experience.</p>
            <div className="feature-details">
              <div className="detail-item">
                <span className="detail-icon">🏥</span>
                <span>Hospital integration</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">👥</span>
                <span>Family sharing dashboard</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🎮</span>
                <span>Gamified wellness challenges</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🌐</span>
                <span>Multi-language support</span>
              </div>
            </div>
            <div className="feature-status">
              <span className="status-badge planned">Planned</span>
            </div>
          </div>
        </div>
      </div>

      <div className="features-footer">
        <p>Stay tuned for updates! 🚀</p>
      </div>
    </div>
  );
}

function SwipeContainer({ children, onSwipeLeft }) {
  const containerRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setCurrentX(touch.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    setCurrentX(touch.clientX);
    const deltaX = touch.clientX - startX;
    
    // Only allow left swipe (negative deltaX)
    if (deltaX < 0) {
      setTranslateX(Math.max(deltaX, -100)); // Limit the drag distance
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const deltaX = currentX - startX;
    const threshold = -80; // Minimum swipe distance
    
    if (deltaX < threshold) {
      // Trigger swipe left action
      onSwipeLeft();
    }
    
    // Reset
    setIsDragging(false);
    setTranslateX(0);
    setStartX(0);
    setCurrentX(0);
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setCurrentX(e.clientX);
    const deltaX = e.clientX - startX;
    
    // Only allow left swipe (negative deltaX)
    if (deltaX < 0) {
      setTranslateX(Math.max(deltaX, -100));
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const deltaX = currentX - startX;
    const threshold = -80;
    
    if (deltaX < threshold) {
      onSwipeLeft();
    }
    
    setIsDragging(false);
    setTranslateX(0);
    setStartX(0);
    setCurrentX(0);
  };

  return (
    <div
      ref={containerRef}
      className="swipe-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {children}
      {translateX < -20 && (
        <div className="swipe-indicator">
          <span>← Swipe to see upcoming features</span>
        </div>
      )}
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
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageTransition, setPageTransition] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowAnim(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSwipeLeft = () => {
    setPageTransition('slide-left');
    setTimeout(() => {
      setCurrentPage('features');
      setPageTransition('');
    }, 150);
  };

  const handleBackToDashboard = () => {
    setPageTransition('slide-right');
    setTimeout(() => {
      setCurrentPage('dashboard');
      setPageTransition('');
    }, 150);
  };

  if (showAnim) return <StartupAnimation />;

  return (
    <div className={`app-container ${pageTransition}`}>
      {currentPage === 'dashboard' ? (
        <SwipeContainer onSwipeLeft={handleSwipeLeft}>
          <div className="dashboard">
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
        </SwipeContainer>
      ) : (
        <UpcomingFeaturesPage onClose={handleBackToDashboard} />
      )}
    </div>
  );
}
