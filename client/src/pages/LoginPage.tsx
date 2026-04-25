import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Wallet, Mail, LogIn, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    /* global google */
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!isDemoMode && clientId) {
      const initGoogle = () => {
        if ((window as any).google) {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleLogin,
          });
          (window as any).google.accounts.id.renderButton(
            document.getElementById('google-button-container'),
            { theme: 'outline', size: 'large', width: '320' }
          );
        } else {
          setTimeout(initGoogle, 100);
        }
      };
      initGoogle();
    }
  }, [isDemoMode]);

  const handleGoogleLogin = async (response: any) => {
    try {
      await login(response.credential);
      navigate('/');
    } catch (err) {
      alert('Google Login failed.');
    }
  };

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await demoLogin(email || 'demo@example.com', name || 'Demo User');
      navigate('/');
    } catch (err) {
      alert('Login failed. Is the server running?');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <div className="logo-badge">
            <Wallet size={32} />
          </div>
          <h1>Emphor Finance</h1>
          <p>Personalized wealth management at your fingertips.</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab-btn ${isDemoMode ? 'active' : ''}`}
            onClick={() => setIsDemoMode(true)}
          >
            Demo Access
          </button>
          <button 
            className={`tab-btn ${!isDemoMode ? 'active' : ''}`}
            onClick={() => setIsDemoMode(false)}
          >
            Google Cloud
          </button>
        </div>

        <div className="login-body">
          {isDemoMode ? (
            <form onSubmit={handleDemoLogin} className="login-form">
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} />
                  <input 
                    type="email" 
                    placeholder="demo@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <LogIn size={18} />
                  <input 
                    type="text" 
                    placeholder="Demo User" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn highlight">
                <span>Enter Personal Dashboard</span>
                <ChevronRight size={18} />
              </button>
            </form>
          ) : (
            <div className="google-auth-placeholder">
              <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.6)' }}>
                Secure authentication via Google Cloud.
              </p>
              <div id="google-button-container"></div>
            </div>
          )}
        </div>

        <div className="login-footer">
          <p>Secure. Private. Intelligent.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
