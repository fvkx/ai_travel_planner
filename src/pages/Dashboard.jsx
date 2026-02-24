import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, Clock, Loader2, Plus, Minus, ChevronRight, Globe, LogOut } from 'lucide-react';
import { generateTravelPlan } from '../services/llmService';
import { fetchPlans, deletePlan } from '../services/apiService';
import { getUser, clearUser } from '../services/storageService';
import GeneratedPlan from '../components/ui/GeneratedPlan';
import SavedPlansList from '../components/SavedPlansList';
import MapPreview from '../components/ui/MapPreview';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    days: 3,
    interests: ''
  });
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedPlaces, setExtractedPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [focused, setFocused] = useState('');

  // Load user on mount
  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleSignout = () => {
    clearUser();
    setUser(null);
    navigate('/login');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.nav-avatar') && !e.target.closest('.user-menu-dropdown')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    // Lazy load saved plans - only fetch when needed
    const onPlansUpdated = (e) => {
      if (Array.isArray(e?.detail)) {
        setSavedPlans(e.detail);
      } else {
        fetchPlans().then(d => setSavedPlans(d)).catch(() => {});
      }
    };

    window.addEventListener('plansUpdated', onPlansUpdated);
    return () => window.removeEventListener('plansUpdated', onPlansUpdated);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this saved plan?')) return;
    try {
      await deletePlan(id);
      setSavedPlans(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete plan', err);
      alert('Failed to delete plan');
    }
  };

  const handleGenerate = async () => {
    if (!formData.destination || !formData.startDate) {
      alert('Please fill in destination and start date');
      return;
    }
    setLoading(true);
    try {
      const result = await generateTravelPlan(formData);
      setPlan(result);
      const places = extractPlacesFromPlan(result);
      setExtractedPlaces(places);
    } catch (error) {
      console.error('Error:', error);
      if (error.name === 'AbortError') {
        alert('Request timed out (60 seconds). The AI server is taking too long. Please try again.');
      } else {
        alert(`Failed to generate plan: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const extractPlacesFromPlan = (plan) => {
    const places = [];
    if (typeof plan === 'object' && plan.days && Array.isArray(plan.days)) {
      plan.days.forEach(day => {
        if (day.places && Array.isArray(day.places)) places.push(...day.places);
      });
    } else if (typeof plan === 'string') {
      const lines = plan.split('\n');
      lines.forEach(line => {
        if (line.match(/visit|explore|go to|check out|head to/i)) {
          const match = line.match(/(?:visit|explore|go to|check out|head to)\s+([^.,!?]+)/i);
          if (match && match[1]) {
            const placeName = match[1].trim();
            if (placeName.length > 3 && placeName.length < 50) places.push(placeName);
          }
        }
      });
    }
    return [...new Set(places)].slice(0, 10);
  };

  const today = new Date().toISOString().split('T')[0];

  const interestTags = ['Food & Dining', 'Culture', 'History', 'Adventure', 'Shopping', 'Nature', 'Nightlife', 'Art'];

  const toggleInterest = (tag) => {
    const current = formData.interests ? formData.interests.split(', ').filter(Boolean) : [];
    const updated = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
    setFormData({ ...formData, interests: updated.join(', ') });
  };

  const activeInterests = formData.interests ? formData.interests.split(', ').filter(Boolean) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        *, *::before, *::after {
          margin: 0; padding: 0; box-sizing: border-box;
        }

        html, body {
          width: 100%; height: 100%; overflow-x: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        :root {
          --violet: #667eea;
          --purple: #764ba2;
          --violet-light: rgba(102,126,234,0.1);
          --violet-mid: rgba(102,126,234,0.18);
          --text-primary: #1a1a2e;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --surface: #ffffff;
          --surface-2: #f8f7ff;
          --border: rgba(102,126,234,0.15);
          --border-hover: rgba(102,126,234,0.35);
          --shadow-sm: 0 2px 8px rgba(102,126,234,0.08);
          --shadow-md: 0 8px 28px rgba(102,126,234,0.12);
          --shadow-lg: 0 20px 60px rgba(102,126,234,0.18);
          --radius: 16px;
          --radius-sm: 10px;
          --radius-xs: 8px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .dashboard-layout {
          min-height: 100vh;
          background: var(--surface-2);
          display: flex;
          flex-direction: column;
        }

        /* ── NAVBAR ── */
        .dash-nav {
          background: white;
          border-bottom: 1px solid var(--border);
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 20px rgba(102,126,234,0.08);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .nav-logo-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(102,126,234,0.35);
        }

        .nav-title {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 17px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-hint {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .nav-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 13px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(102,126,234,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        }

        .nav-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102,126,234,0.5);
        }

        .user-menu-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(102,126,234,0.15);
          z-index: 1000;
          min-width: 200px;
          overflow: hidden;
        }

        .user-menu-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%);
        }

        .user-menu-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
          margin-bottom: 2px;
        }

        .user-menu-email {
          font-size: 12px;
          color: var(--text-muted);
        }

        .user-menu-items {
          padding: 8px 0;
        }

        .user-menu-item {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-primary);
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 14px;
        }

        .user-menu-item:hover {
          background-color: var(--surface-2);
          color: var(--violet);
        }

        .user-menu-item.danger {
          color: #dc3545;
        }

        .user-menu-item.danger:hover {
          background-color: rgba(220, 53, 69, 0.1);
          color: #c82333;
        }

        /* ── MAIN AREA ── */
        .dash-main {
          flex: 1;
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 0;
          min-height: calc(100vh - 64px);
        }

        @media (max-width: 1024px) {
          .dash-main { grid-template-columns: 1fr; }
          .dash-sidebar { border-right: none; border-bottom: 1px solid var(--border); }
        }

        /* ── SIDEBAR ── */
        .dash-sidebar {
          background: white;
          border-right: 1px solid var(--border);
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: sticky;
          top: 64px;
          height: calc(100vh - 64px);
          overflow-y: auto;
        }

        .sidebar-heading {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.03em;
          margin-bottom: 4px;
        }

        .sidebar-sub {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 20px;
          line-height: 1.5;
        }

        /* ── FIELD GROUPS ── */
        .field-group {
          margin-bottom: 18px;
        }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
          display: block;
        }

        .field-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 13px;
          color: var(--text-muted);
          pointer-events: none;
          transition: color 0.2s;
          z-index: 1;
        }

        .field-input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: var(--text-primary);
          background: var(--surface);
          transition: all 0.2s ease;
          outline: none;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: var(--text-muted); }

        .field-input:focus {
          border-color: var(--violet);
          box-shadow: 0 0 0 3px rgba(102,126,234,0.12);
          background: #fdfcff;
        }

        .field-input:focus + .field-icon,
        .field-input-wrap:focus-within .field-icon {
          color: var(--violet);
        }

        input[type="date"] {
          position: relative;
          cursor: pointer;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0.5;
        }

        input[type="date"]:hover::-webkit-calendar-picker-indicator { opacity: 0.8; }

        textarea.field-input {
          padding-top: 11px;
          resize: none;
          min-height: 80px;
        }

        /* ── DAYS STEPPER ── */
        .days-stepper {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: white;
          height: 44px;
        }

        .stepper-btn {
          width: 44px; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: var(--surface-2);
          border: none;
          cursor: pointer;
          color: var(--violet);
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .stepper-btn:hover:not(:disabled) {
          background: var(--violet-light);
        }

        .stepper-btn:active:not(:disabled) {
          background: var(--violet-mid);
        }

        .stepper-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .stepper-input {
          flex: 1;
          height: 100%;
          border: none;
          border-left: 1.5px solid var(--border);
          border-right: 1.5px solid var(--border);
          text-align: center;
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--violet);
          background: white;
          outline: none;
          width: 0;
          min-width: 0;
          -moz-appearance: textfield;
        }

        .stepper-input::-webkit-outer-spin-button,
        .stepper-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .stepper-input:focus {
          background: #fdfcff;
        }

        /* ── INTEREST TAGS ── */
        .interest-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 6px;
        }

        .interest-tag {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          border: 1.5px solid var(--border);
          background: white;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.18s ease;
          user-select: none;
        }

        .interest-tag:hover {
          border-color: var(--violet);
          color: var(--violet);
          background: var(--violet-light);
        }

        .interest-tag.active {
          border-color: var(--violet);
          background: linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(118,75,162,0.12) 100%);
          color: var(--violet);
          font-weight: 600;
        }

        /* ── GENERATE BUTTON ── */
        .btn-generate {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          letter-spacing: -0.01em;
          box-shadow: 0 4px 20px rgba(102,126,234,0.35);
          margin-top: 6px;
          position: relative;
          overflow: hidden;
        }

        .btn-generate::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .btn-generate:hover:not(:disabled)::before { opacity: 1; }

        .btn-generate:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(102,126,234,0.45);
        }

        .btn-generate:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 16px rgba(102,126,234,0.3);
        }

        .btn-generate:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* ── DIVIDER ── */
        .sidebar-divider {
          height: 1px;
          background: var(--border);
          margin: 8px 0;
        }

        /* ── CONTENT AREA ── */
        .dash-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .dash-content { padding: 20px 16px; }
          .dash-sidebar { padding: 20px 16px; position: relative; height: auto; }
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 40px;
          animation: fadeSlideUp 0.5s ease;
        }

        .empty-orb {
          width: 100px; height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(118,75,162,0.12) 100%);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 28px;
          position: relative;
        }

        .empty-orb::before {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1.5px dashed rgba(102,126,234,0.25);
          animation: pulse-ring 3s ease-in-out infinite;
        }

        .empty-title {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
          letter-spacing: -0.03em;
        }

        .empty-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.7;
          max-width: 380px;
          margin: 0 auto 32px;
        }

        .empty-hints {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hint-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 20px;
          background: white;
          border: 1.5px solid var(--border);
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .hint-chip span { color: var(--violet); }

        /* ── LOADING STATE ── */
        .loading-card {
          background: white;
          border-radius: var(--radius);
          padding: 60px 40px;
          text-align: center;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          animation: fadeSlideUp 0.4s ease;
        }

        .loading-spinner-wrap {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }

        .loading-title {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .loading-subtitle {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 28px;
        }

        .loading-bar-wrap {
          width: 240px;
          height: 4px;
          background: var(--violet-light);
          border-radius: 2px;
          margin: 0 auto;
          overflow: hidden;
        }

        .loading-bar {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
          background-size: 200% 100%;
          animation: shimmer 1.5s linear infinite;
        }

        /* ── PLAN CONTAINER ── */
        .plan-wrapper {
          animation: fadeSlideUp 0.5s ease;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── SECTION HEADER ── */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .section-badge {
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          background: var(--violet-light);
          color: var(--violet);
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0;
        }

        /* ── DESTINATION BANNER ── */
        .destination-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: var(--radius);
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 24px rgba(102,126,234,0.3);
        }

        .destination-banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .banner-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
        }

        .banner-dest {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.03em;
          margin-bottom: 2px;
        }

        .banner-meta {
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          font-weight: 400;
        }

        .banner-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .banner-stat {
          text-align: center;
        }

        .banner-stat-val {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: white;
          line-height: 1;
          margin-bottom: 2px;
        }

        .banner-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.65);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .banner-divider {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="dashboard-layout">
        {/* Navbar */}
        <nav className="dash-nav">
          <a href="/" className="nav-brand">
            <div className="nav-logo-icon">
              <Sparkles size={18} color="white" />
            </div>
            <span className="nav-title">ThinkSpots AI</span>
          </a>
          <div className="nav-right">
            <span className="nav-hint">Generate your perfect itinerary</span>
            <div style={{ position: 'relative' }}>
              <div 
                className="nav-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0) || 'U'}
              </div>
              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-header">
                    <div className="user-menu-name">{user?.firstName} {user?.lastName}</div>
                    <div className="user-menu-email">{user?.email}</div>
                  </div>
                  <div className="user-menu-items">
                    <button 
                      className="user-menu-item danger"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleSignout();
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main layout */}
        <div className="dash-main">
          {/* ── SIDEBAR ── */}
          <aside className="dash-sidebar">
            <h2 className="sidebar-heading">Plan a Trip</h2>
            <p className="sidebar-sub">Fill in the details and let AI do the rest.</p>

            {/* Destination */}
            <div className="field-group">
              <label className="field-label">Destination</label>
              <div className="field-input-wrap">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  className="field-input"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g., Tokyo, Japan"
                />
              </div>
            </div>

            {/* Start Date */}
            <div className="field-group">
              <label className="field-label">Start Date</label>
              <div className="field-input-wrap">
                <Calendar size={15} className="field-icon" />
                <input
                  type="date"
                  className="field-input"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  min={today}
                />
              </div>
            </div>

            {/* Number of Days */}
            <div className="field-group">
              <label className="field-label">Number of Days</label>
              <div className="days-stepper">
                <button
                  className="stepper-btn"
                  onClick={() => setFormData({ ...formData, days: Math.max(formData.days - 1, 1) })}
                  disabled={formData.days <= 1}
                  type="button"
                >
                  <Minus size={15} />
                </button>
                <input
                  type="number"
                  className="stepper-input"
                  value={formData.days}
                  min={1}
                  max={6}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      setFormData({ ...formData, days: Math.min(Math.max(val, 1), 6) });
                    }
                  }}
                />
                <button
                  className="stepper-btn"
                  onClick={() => setFormData({ ...formData, days: Math.min(formData.days + 1, 6) })}
                  disabled={formData.days >= 6}
                  type="button"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* Interests */}
            <div className="field-group">
              <label className="field-label">Interests</label>
              <div className="interest-tags">
                {interestTags.map(tag => (
                  <button
                    key={tag}
                    className={`interest-tag ${activeInterests.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleInterest(tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <textarea
                className="field-input"
                style={{ paddingLeft: '14px', marginTop: '8px' }}
                rows={2}
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="Or type your own, e.g. Street art, Jazz clubs…"
              />
            </div>

            <div className="sidebar-divider" />

            <button
              className="btn-generate"
              onClick={handleGenerate}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <>
                  <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
                  Generating Itinerary...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Generate Itinerary
                </>
              )}
            </button>
          </aside>

          {/* ── CONTENT ── */}
          <main className="dash-content">
            {/* Loading */}
            {loading && (
              <div className="loading-card">
                <div className="loading-spinner-wrap">
                  <Loader2 size={32} style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} />
                </div>
                <div className="loading-title">Creating Your Itinerary</div>
                <div className="loading-subtitle">This usually takes 10–20 seconds…</div>
                <div className="loading-bar-wrap">
                  <div className="loading-bar" />
                </div>
              </div>
            )}

            {/* Plan generated */}
            {!loading && plan && (
              <div className="plan-wrapper">
                {/* Destination banner */}
                <div className="destination-banner">
                  <div className="destination-banner-left">
                    <div className="banner-icon">
                      <Globe size={22} color="white" />
                    </div>
                    <div>
                      <div className="banner-dest">{formData.destination}</div>
                      <div className="banner-meta">
                        {formData.startDate
                          ? new Date(formData.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'Your upcoming adventure'}
                      </div>
                    </div>
                  </div>
                  <div className="banner-right">
                    <div className="banner-stat">
                      <div className="banner-stat-val">{formData.days}</div>
                      <div className="banner-stat-label">Days</div>
                    </div>
                    <div className="banner-divider" />
                    <div className="banner-stat">
                      <div className="banner-stat-val">{extractedPlaces.length || '—'}</div>
                      <div className="banner-stat-label">Places</div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                {formData.destination && (
                  <MapPreview
                    destination={formData.destination}
                    places={extractedPlaces}
                    interests={formData.interests}
                    onHotelsFound={setHotels}
                    plans={savedPlans}
                    onDelete={handleDelete}
                  />
                )}

                {/* Generated Plan */}
                <GeneratedPlan
                  plan={plan}
                  destination={formData.destination}
                  hotels={hotels}
                  startDate={formData.startDate}
                  days={formData.days}
                  interests={formData.interests}
                  prompt={`Destination: ${formData.destination}. Start Date: ${formData.startDate}. Days: ${formData.days}. Interests: ${formData.interests}.`}
                />

                {/* Saved Plans */}
                {savedPlans && savedPlans.length > 0 && (
                  <div>
                    <div className="section-header">
                      <div className="section-label">
                        <Clock size={14} style={{ color: '#667eea' }} />
                        Saved Plans
                        <span className="section-badge">{savedPlans.length}</span>
                      </div>
                    </div>
                    <SavedPlansList plans={savedPlans} onDelete={handleDelete} />
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!loading && !plan && (
              <div className="empty-state">
                <div className="empty-orb">
                  <Sparkles size={38} style={{ color: '#667eea' }} />
                </div>
                <div className="empty-title">Ready to Plan Your Trip?</div>
                <p className="empty-desc">
                  Fill in your destination, pick your dates, and let our AI build a personalized day-by-day itinerary with an interactive map.
                </p>
                <div className="empty-hints">
                  <div className="hint-chip">
                    <MapPin size={13} style={{ color: '#667eea' }} />
                    <span>190+</span> destinations
                  </div>
                  <div className="hint-chip">
                    <Clock size={13} style={{ color: '#667eea' }} />
                    Ready in <span>~15 sec</span>
                  </div>
                  <div className="hint-chip">
                    <Sparkles size={13} style={{ color: '#667eea' }} />
                    AI‑powered
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}