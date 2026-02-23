import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await api.loginUser({ email: form.email, password: form.password });
      setLoading(false);
      if (res.status === 'success') {
        try { localStorage.setItem('user', JSON.stringify(res.user)); } catch {}
        navigate('/dashboard');
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed');
    }
  };

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

        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

        .form-input {
          width: 100%; padding: 12px 16px 12px 44px;
          border: 1px solid #dee2e6; border-radius: 10px;
          font-size: 15px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fff; color: #333;
        }
        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
        }
        .form-input::placeholder { color: #aaa; }
        .input-wrapper { position: relative; }
        .input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: #aaa; pointer-events: none;
        }
        .input-icon-right {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          color: #aaa; cursor: pointer; background: none; border: none; padding: 0;
          display: flex; align-items: center;
        }
        .input-icon-right:hover { color: #667eea; }

        .btn-submit {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none; border-radius: 10px; color: white;
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: all 0.3s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .social-btn {
          flex: 1; padding: 12px;
          border: 1px solid #dee2e6; border-radius: 10px;
          background: white; cursor: pointer; font-size: 14px; font-weight: 500; color: #444;
          transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .social-btn:hover { border-color: #667eea; color: #667eea; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

        .checkbox-custom {
          width: 18px; height: 18px; border: 1px solid #dee2e6;
          border-radius: 5px; cursor: pointer; appearance: none;
          flex-shrink: 0; transition: all 0.2s; margin-top: 1px;
        }
        .checkbox-custom:checked { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-color: #667eea; }
        .checkbox-custom:checked::after { content: '✓'; display: block; color: white; font-size: 12px; text-align: center; line-height: 18px; }

        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
        .divider-line { flex: 1; height: 1px; background: #e9ecef; }
        .divider-text { font-size: 13px; color: #aaa; white-space: nowrap; }

        .error-box {
          background: #fff5f5; border: 1px solid #fed7d7; border-radius: 10px;
          padding: 12px 16px; font-size: 14px; color: #c53030; margin-bottom: 20px;
        }

        .card-custom {
          background: white; border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12); padding: 40px;
          width: 100%; max-width: 440px;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
        {/* Background circles (matching dashboard style) */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', right: -150, top: -150, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', left: -80, bottom: -80, pointerEvents: 'none' }} />

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32, position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12, display: 'flex' }}>
            <Sparkles color="white" size={22} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, color: 'white' }}>ThinkSpots AI</span>
        </a>

        {/* Card */}
        <div className="card-custom" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Welcome back</h2>
            <p style={{ color: '#6c757d', fontSize: 14 }}>
              Sign in to continue planning your trips
            </p>
          </div>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail size={17} className="input-icon" />
                <input
                  type="email" name="email" className="form-input"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <a href="/forgot-password" style={{ fontSize: 13, color: '#667eea', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
              </div>
              <div className="input-wrapper">
                <Lock size={17} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'} name="password" className="form-input"
                  style={{ paddingRight: 44 }}
                  placeholder="Enter your password"
                  value={form.password} onChange={handleChange}
                />
                <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24 }}>
              <input type="checkbox" id="remember" name="remember" className="checkbox-custom" checked={form.remember} onChange={handleChange} />
              <label htmlFor="remember" style={{ fontSize: 14, color: '#555', cursor: 'pointer', lineHeight: 1.4 }}>
                Remember me for 30 days
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading
                ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing In...</>
                : 'Sign In'
              }
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or continue with</span>
            <div className="divider-line" />
          </div>

          {/* Social */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="social-btn">
              <span style={{ fontWeight: 700, fontSize: 15 }}>G</span> Google
            </button>
            <button className="social-btn">
              <span style={{ fontWeight: 700 }}>⌘</span> Apple
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6c757d', marginTop: 28 }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none' }}>Create one free</a>
          </p>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 24, position: 'relative', zIndex: 1 }}>
          By signing in, you agree to our{' '}
          <a href="/terms" style={{ color: 'rgba(255,255,255,0.85)' }}>Terms</a> and{' '}
          <a href="/privacy" style={{ color: 'rgba(255,255,255,0.85)' }}>Privacy Policy</a>
        </p>
      </div>
    </>
  );
}