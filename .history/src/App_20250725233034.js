import React, { useEffect, useState, useRef } from 'react';
import './App.css';

// Dummy data for historic health metrics
const generateHeartRateData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    avgHeartRate: Math.floor(Math.random() * 30) + 65, // 65-95 bpm
    minHeartRate: Math.floor(Math.random() * 20) + 55, // 55-75 bpm
    maxHeartRate: Math.floor(Math.random() * 40) + 90, // 90-130 bpm
    hourlyData: Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      value: Math.floor(Math.random() * 40) + 60 + (hour > 6 && hour < 22 ? 10 : 0)
    }))
  }));
};

const generateSpO2Data = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    avgSpO2: Math.floor(Math.random() * 5) + 96, // 96-100%
    minSpO2: Math.floor(Math.random() * 3) + 94, // 94-96%
    maxSpO2: 100,
    hourlyData: Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      value: Math.floor(Math.random() * 6) + 95
    }))
  }));
};

const generateTempData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    avgTemp: (Math.random() * 2 + 97.5).toFixed(1), // 97.5-99.5°F
    minTemp: (Math.random() * 1.5 + 97).toFixed(1), // 97-98.5°F
    maxTemp: (Math.random() * 1.5 + 98.5).toFixed(1), // 98.5-100°F
    hourlyData: Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      value: (Math.random() * 2.5 + 97.2).toFixed(1)
    }))
  }));
};

// Heart Rate Detail Component
function HeartRateDetail({ onClose }) {
  const [weekData] = useState(generateHeartRateData());
  const [selectedDay, setSelectedDay] = useState(6); // Today (Sunday)

  const maxHeartRate = Math.max(...weekData.map(d => d.avgHeartRate));

  return (
    <div className="health-detail-page heart-rate-theme">
      <div className="detail-header">
        <button className="back-btn" onClick={onClose}>
          ← Back
        </button>
        <h2>❤️ Heart Rate</h2>
      </div>

      <div className="chart-section">
        <h3>Weekly Average</h3>
        <div className="bar-chart">
          {weekData.map((data, index) => (
            <div
              key={data.day}
              className={`bar-item ${selectedDay === index ? 'selected' : ''}`}
              onClick={() => setSelectedDay(index)}
            >
              <div
                className="bar"
                style={{
                  height: `${(data.avgHeartRate / maxHeartRate) * 100}%`
                }}
              >
                <span className="bar-value">{data.avgHeartRate}</span>
              </div>
              <span className="bar-label">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="daily-detail">
        <h3>{weekData[selectedDay].day} - {weekData[selectedDay].date}</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Average</span>
            <span className="stat-value">{weekData[selectedDay].avgHeartRate} bpm</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Min</span>
            <span className="stat-value">{weekData[selectedDay].minHeartRate} bpm</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Max</span>
            <span className="stat-value">{weekData[selectedDay].maxHeartRate} bpm</span>
          </div>
        </div>

        <div className="hourly-chart">
          <h4>Hourly Data</h4>
          <div className="line-chart">
            {weekData[selectedDay].hourlyData.map((data, index) => (
              <div key={data.hour} className="line-point">
                <div
                  className="point"
                  style={{
                    bottom: `${((data.value - 50) / 80) * 100}%`
                  }}
                  title={`${data.hour}: ${data.value} bpm`}
                />
                {index % 4 === 0 && (
                  <span className="time-label">{data.hour}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// SpO2 Detail Component
function SpO2Detail({ onClose }) {
  const [weekData] = useState(generateSpO2Data());
  const [selectedDay, setSelectedDay] = useState(6);

  return (
    <div className="health-detail-page spo2-theme">
      <div className="detail-header">
        <button className="back-btn" onClick={onClose}>
          ← Back
        </button>
        <h2>🫁 Blood Oxygen</h2>
      </div>

      <div className="chart-section">
        <h3>Weekly Average</h3>
        <div className="circular-progress-grid">
          {weekData.map((data, index) => (
            <div
              key={data.day}
              className={`circular-item ${selectedDay === index ? 'selected' : ''}`}
              onClick={() => setSelectedDay(index)}
            >
              <div className="circular-progress">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${data.avgSpO2}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">{data.avgSpO2}%</text>
                </svg>
              </div>
              <span className="circular-label">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="daily-detail">
        <h3>{weekData[selectedDay].day} - {weekData[selectedDay].date}</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Average</span>
            <span className="stat-value">{weekData[selectedDay].avgSpO2}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Min</span>
            <span className="stat-value">{weekData[selectedDay].minSpO2}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Max</span>
            <span className="stat-value">{weekData[selectedDay].maxSpO2}%</span>
          </div>
        </div>

        <div className="hourly-chart">
          <h4>Hourly Data</h4>
          <div className="area-chart">
            {weekData[selectedDay].hourlyData.map((data, index) => (
              <div key={data.hour} className="area-point">
                <div
                  className="area-bar"
                  style={{
                    height: `${((data.value - 90) / 10) * 100}%`
                  }}
                  title={`${data.hour}: ${data.value}%`}
                />
                {index % 4 === 0 && (
                  <span className="time-label">{data.hour}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Temperature Detail Component
function TemperatureDetail({ onClose }) {
  const [weekData] = useState(generateTempData());
  const [selectedDay, setSelectedDay] = useState(6);

  return (
    <div className="health-detail-page temp-theme">
      <div className="detail-header">
        <button className="back-btn" onClick={onClose}>
          ← Back
        </button>
        <h2>🌡️ Temperature</h2>
      </div>

      <div className="chart-section">
        <h3>Weekly Average</h3>
        <div className="thermometer-grid">
          {weekData.map((data, index) => (
            <div
              key={data.day}
              className={`thermo-item ${selectedDay === index ? 'selected' : ''}`}
              onClick={() => setSelectedDay(index)}
            >
              <div className="thermometer">
                <div className="thermo-scale">
                  <div
                    className="thermo-fill"
                    style={{
                      height: `${((parseFloat(data.avgTemp) - 96) / 5) * 100}%`
                    }}
                  />
                </div>
                <span className="thermo-value">{data.avgTemp}°F</span>
              </div>
              <span className="thermo-label">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="daily-detail">
        <h3>{weekData[selectedDay].day} - {weekData[selectedDay].date}</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Average</span>
            <span className="stat-value">{weekData[selectedDay].avgTemp}°F</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Min</span>
            <span className="stat-value">{weekData[selectedDay].minTemp}°F</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Max</span>
            <span className="stat-value">{weekData[selectedDay].maxTemp}°F</span>
          </div>
        </div>

        <div className="hourly-chart">
          <h4>Hourly Data</h4>
          <div className="wave-chart">
            {weekData[selectedDay].hourlyData.map((data, index) => (
              <div key={data.hour} className="wave-point">
                <div
                  className="wave-dot"
                  style={{
                    bottom: `${((parseFloat(data.value) - 96) / 5) * 100}%`
                  }}
                  title={`${data.hour}: ${data.value}°F`}
                />
                {index % 4 === 0 && (
                  <span className="time-label">{data.hour}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const handleHealthMetricClick = (metric) => {
    setPageTransition('slide-up');
    setTimeout(() => {
      setCurrentPage(metric);
      setPageTransition('');
    }, 150);
  };

  if (showAnim) return <StartupAnimation />;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'heart-rate':
        return <HeartRateDetail onClose={handleBackToDashboard} />;
      case 'spo2':
        return <SpO2Detail onClose={handleBackToDashboard} />;
      case 'temperature':
        return <TemperatureDetail onClose={handleBackToDashboard} />;
      case 'features':
        return <UpcomingFeaturesPage onClose={handleBackToDashboard} />;
      default:
        return (
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
      
      {/* Swipe hint */}
      <div className="swipe-hint">
        <span>← Swipe left for upcoming features</span>
      </div>
          </div>
        </SwipeContainer>
      ) : (
        <UpcomingFeaturesPage onClose={handleBackToDashboard} />
      )}
    </div>
  );
}
