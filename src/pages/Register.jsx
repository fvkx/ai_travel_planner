import { useState } from 'react';
import api from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Loader2, Check, MapPin } from 'lucide-react';

const TRAVEL_STYLES = [
  'Adventure', 'Culture & History', 'Relaxation',
  'Food & Cuisine', 'Business', 'Family',
];

const STEP_LABELS = ['Account', 'Preferences', 'Done'];

export default function Register() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirm: '',
    travelStyles: [], homeCity: '', agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toggleStyle = (s) => {
    setForm((prev) => ({
      ...prev,
      travelStyles: prev.travelStyles.includes(s)
        ? prev.travelStyles.filter((x) => x !== s)
        : [...prev.travelStyles, s],
    }));
  };

  const validateStep0 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to continue';
    return e;
  };

  const handleNext = async () => {
    if (step === 0) {
      const errs = validateStep0();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setStep(1);
    } else if (step === 1) {
      setLoading(true);
      try {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          travelStyles: form.travelStyles,
          homeCity: form.homeCity,
        };
        const res = await api.registerUser(payload);
        setLoading(false);
        if (res.status === 'success') {
          try { localStorage.setItem('user', JSON.stringify({ firstName: form.firstName, email: form.email })); } catch {}
          setStep(2);
        } else {
          setErrors((prev) => ({ ...prev, general: res.message || 'Registration failed' }));
        }
      } catch (err) {
        setLoading(false);
        setErrors((prev) => ({ ...prev, general: err.message || 'Registration failed' }));
      }
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .form-input {
          width: 100%; padding: 12px 16px 12px 44px;
          border: 1px solid #dee2e6; border-radius: 10px;
          font-size: 15px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fff; color: #333;
        }
        .form-input.no-icon { padding-left: 16px; }
        .form-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.15); }
        .form-input.error-field { border-color: #ef4444; }
        .form-input::placeholder { color: #aaa; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; }
        .input-icon-right { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #aaa; cursor: pointer; background: none; border: none; padding: 0; display: flex; align-items: center; }
        .input-icon-right:hover { color: #667eea; }

        .err-msg { font-size: 12px; color: #ef4444; margin-top: 5px; }

        .btn-submit {
          width: 100%; padding: 14px; border: none; border-radius: 10px; color: white;
          font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(102,126,234,0.4); }
        .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .btn-back {
          padding: 14px 24px; border: 1px solid #dee2e6; border-radius: 10px; background: white;
          font-size: 15px; font-weight: 500; color: #555; cursor: pointer; transition: all 0.2s;
        }
        .btn-back:hover { border-color: #667eea; color: #667eea; }

        .checkbox-custom {
          width: 18px; height: 18px; border: 1px solid #dee2e6; border-radius: 5px;
          cursor: pointer; appearance: none; flex-shrink: 0; transition: all 0.2s; margin-top: 1px;
        }
        .checkbox-custom:checked { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-color: #667eea; }
        .checkbox-custom:checked::after { content: '✓'; display: block; color: white; font-size: 12px; text-align: center; line-height: 18px; }

        .style-chip {
          padding: 8px 16px; border: 1px solid #dee2e6; border-radius: 8px;
          background: white; font-size: 14px; color: #555; cursor: pointer; transition: all 0.2s;
          font-weight: 500;
        }
        .style-chip:hover { border-color: #667eea; color: #667eea; }
        .style-chip.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent; color: white;
        }

        .step-indicator {
          display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 32px;
        }
        .step-dot {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; transition: all 0.3s;
          border: 2px solid #dee2e6; background: white; color: #aaa;
        }
        .step-dot.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-color: transparent; color: white; }
        .step-dot.done { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-color: transparent; color: white; }
        .step-line { width: 48px; height: 2px; background: #dee2e6; transition: background 0.3s; }
        .step-line.done { background: #667eea; }

        .card-custom {
          background: white; border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12); padding: 40px;
          width: 100%; max-width: 480px;
        }
        .success-circle {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }
        .btn-dashboard {
          display: inline-block; padding: 14px 36px; border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; font-weight: 700; font-size: 15px; text-decoration: none;
          transition: all 0.3s;
        }
        .btn-dashboard:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(102,126,234,0.4); color: white; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        {/* Background circles */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', right: -150, top: -150, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', left: -80, bottom: -80, pointerEvents: 'none' }} />

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 28, position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12, display: 'flex' }}>
            <Sparkles color="white" size={22} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, color: 'white' }}>ThinkSpots AI</span>
        </a>

        {/* Card */}
        <div className="card-custom" style={{ position: 'relative', zIndex: 1 }}>
          {/* Step Indicator */}
          <div className="step-indicator">
            {STEP_LABELS.map((label, i) => (
              <>
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: i <= step ? '#667eea' : '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div key={`line-${i}`} className={`step-line ${i < step ? 'done' : ''}`} style={{ marginBottom: 16 }} />
                )}
              </>
            ))}
          </div>

          {errors.general && (
            <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', padding: 12, borderRadius: 8, color: '#c53030', marginBottom: 12 }}>
              {errors.general}
            </div>
          )}

          {/* STEP 0 */}
          {step === 0 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Create Your Account</h2>
                <p style={{ color: '#6c757d', fontSize: 14 }}>Free forever. No credit card required.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Name row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>First Name</label>
                    <div className="input-wrapper">
                      <User size={16} className="input-icon" />
                      <input type="text" name="firstName" className={`form-input${errors.firstName ? ' error-field' : ''}`} placeholder="Jane" value={form.firstName} onChange={handleChange} />
                    </div>
                    {errors.firstName && <div className="err-msg">{errors.firstName}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Name</label>
                    <div className="input-wrapper">
                      <User size={16} className="input-icon" />
                      <input type="text" name="lastName" className={`form-input${errors.lastName ? ' error-field' : ''}`} placeholder="Smith" value={form.lastName} onChange={handleChange} />
                    </div>
                    {errors.lastName && <div className="err-msg">{errors.lastName}</div>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input type="email" name="email" className={`form-input${errors.email ? ' error-field' : ''}`} placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  </div>
                  {errors.email && <div className="err-msg">{errors.email}</div>}
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                  <div className="input-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input type={showPassword ? 'text' : 'password'} name="password" className={`form-input${errors.password ? ' error-field' : ''}`} style={{ paddingRight: 44 }} placeholder="Min. 8 characters" value={form.password} onChange={handleChange} />
                    <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form.password && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} style={{ height: 4, flex: 1, borderRadius: 4, background: i <= strength ? strengthColor[strength] : '#e9ecef', transition: 'background 0.2s' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: strengthColor[strength], fontWeight: 500 }}>{strengthLabel[strength]}</span>
                    </div>
                  )}
                  {errors.password && <div className="err-msg">{errors.password}</div>}
                </div>

                {/* Confirm */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input type={showConfirm ? 'text' : 'password'} name="confirm" className={`form-input${errors.confirm ? ' error-field' : ''}`} style={{ paddingRight: 44 }} placeholder="Re-enter password" value={form.confirm} onChange={handleChange} />
                    <button type="button" className="input-icon-right" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirm && <div className="err-msg">{errors.confirm}</div>}
                </div>

                {/* Terms */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <input type="checkbox" id="agreeTerms" name="agreeTerms" className="checkbox-custom" checked={form.agreeTerms} onChange={handleChange} />
                    <label htmlFor="agreeTerms" style={{ fontSize: 14, color: '#555', cursor: 'pointer', lineHeight: 1.5 }}>
                      I agree to the <a href="/terms" style={{ color: '#667eea', fontWeight: 500 }}>Terms of Service</a> and <a href="/privacy" style={{ color: '#667eea', fontWeight: 500 }}>Privacy Policy</a>
                    </label>
                  </div>
                  {errors.agreeTerms && <div className="err-msg" style={{ marginTop: 4 }}>{errors.agreeTerms}</div>}
                </div>

                <button type="button" className="btn-submit" onClick={handleNext} style={{ marginTop: 4 }}>
                  Continue
                </button>

                <p style={{ textAlign: 'center', fontSize: 14, color: '#6c757d', marginTop: 4 }}>
                  Already have an account?{' '}
                  <a href="/login" style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none' }}>Sign in</a>
                </p>
              </div>
            </>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Your Travel Style</h2>
                <p style={{ color: '#6c757d', fontSize: 14 }}>Help our AI personalize your experience. You can update this later.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    What kind of traveler are you?
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {TRAVEL_STYLES.map((s) => (
                      <button key={s} type="button" className={`style-chip${form.travelStyles.includes(s) ? ' selected' : ''}`} onClick={() => toggleStyle(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Home City</label>
                  <div className="input-wrapper">
                    <MapPin size={16} className="input-icon" />
                    <input type="text" name="homeCity" className="form-input" placeholder="e.g. New York, London, Tokyo" value={form.homeCity} onChange={handleChange} />
                  </div>
                  <p style={{ fontSize: 12, color: '#aaa', marginTop: 5 }}>Used to suggest departure options and local travel deals.</p>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <button type="button" className="btn-back" onClick={() => setStep(0)}>Back</button>
                  <button type="button" className="btn-submit" disabled={loading} onClick={handleNext}>
                    {loading
                      ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating Account...</>
                      : 'Create Account'
                    }
                  </button>
                </div>
              </div>
            </>
          )}

          {/* STEP 2 — Done */}
          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div className="success-circle">
                <Check size={36} color="white" strokeWidth={3} />
              </div>
              <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 10 }}>
                <span className="gradient-text">You're all set, {form.firstName}!</span>
              </h2>
              <p style={{ color: '#6c757d', lineHeight: 1.7, marginBottom: 32, maxWidth: 340, margin: '0 auto 32px' }}>
                Your account is ready. Start planning your first AI-powered trip right now — it only takes seconds.
              </p>
              <a href="/dashboard" className="btn-dashboard">
                <Sparkles size={16} style={{ display: 'inline', marginRight: 8 }} />
                Plan My First Trip
              </a>
            </div>
          )}
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 24, position: 'relative', zIndex: 1, textAlign: 'center' }}>
          © 2025 ThinkSpots AI · <a href="/privacy" style={{ color: 'rgba(255,255,255,0.7)' }}>Privacy</a> · <a href="/terms" style={{ color: 'rgba(255,255,255,0.7)' }}>Terms</a>
        </p>
      </div>
    </>
  );
}