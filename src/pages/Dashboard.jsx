import { useState } from 'react';
import { Calendar, MapPin, Sparkles, Clock, Loader2, Plus, Minus } from 'lucide-react';
import { generateTravelPlan } from '../services/llmService';
import GeneratedPlan from '../components/ui/GeneratedPlan';
import MapPreview from '../components/ui/MapPreview';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    days: 3,
    interests: ''
  });
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedPlaces, setExtractedPlaces] = useState([]);

  const handleGenerate = async () => {
    if (!formData.destination || !formData.startDate) {
      alert('Please fill in destination and start date');
      return;
    }
    
    setLoading(true);
    try {
      const result = await generateTravelPlan(formData);
      setPlan(result);
      
      // Extract place names from the generated plan (simple extraction)
      const places = extractPlacesFromPlan(result);
      setExtractedPlaces(places);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simple function to extract place names from the itinerary
  const extractPlacesFromPlan = (text) => {
    const lines = text.split('\n');
    const places = [];
    
    lines.forEach(line => {
      // Look for lines that mention specific places (simple pattern matching)
      if (line.match(/visit|explore|go to|check out|head to/i)) {
        // Extract the place name (this is a simple implementation)
        const match = line.match(/(?:visit|explore|go to|check out|head to)\s+([^.,!?]+)/i);
        if (match && match[1]) {
          const placeName = match[1].trim();
          if (placeName.length > 3 && placeName.length < 50) {
            places.push(placeName);
          }
        }
      }
    });
    
    // Return unique places, limit to 10
    return [...new Set(places)].slice(0, 10);
  };

  const incrementDays = () => {
    setFormData({ ...formData, days: Math.min(formData.days + 1, 30) });
  };

  const decrementDays = () => {
    setFormData({ ...formData, days: Math.max(formData.days - 1, 1) });
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .btn-generate {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-generate:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .btn-generate:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .btn-generate:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .number-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .number-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .number-btn:hover {
          background: #f8f9fa;
          border-color: #667eea;
        }
        
        .number-btn:active {
          transform: scale(0.95);
        }
        
        .number-display {
          min-width: 60px;
          text-align: center;
          font-size: 1.1rem;
          font-weight: 600;
          color: #667eea;
        }
        
        /* Better date input styling */
        input[type="date"] {
          position: relative;
          padding-right: 40px;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          position: absolute;
          right: 10px;
          cursor: pointer;
          filter: invert(50%);
        }
        
        input[type="date"]:hover::-webkit-calendar-picker-indicator {
          filter: invert(40%);
        }
        
        @media (max-width: 991px) {
          .sticky-sidebar {
            position: relative !important;
            top: 0 !important;
          }
        }
        
        /* Fixed width container for results */
        .results-container {
          max-width: 100%;
          overflow-x: hidden;
        }
      `}</style>

      <div style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Header */}
        <nav className="navbar navbar-light bg-white shadow-sm">
          <div className="container-fluid px-3 px-md-4 py-3">
            <div className="d-flex align-items-center gap-2 gap-md-3">
              <div className="p-2 rounded-3 gradient-bg">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h1 className="h5 h4-md mb-0 fw-bold gradient-text">
                  AI Travel Planner
                </h1>
                <small className="text-muted d-none d-sm-inline">Create your perfect itinerary with map</small>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container-fluid px-3 px-md-4 py-4 py-md-5">
          <div className="row g-3 g-md-4">
            {/* Form Section */}
            <div className="col-12 col-lg-5 col-xl-4">
              <div className="card shadow-lg border-0 rounded-4 sticky-sidebar" style={{ top: '100px' }}>
                <div className="card-body p-3 p-md-4">
                  <h5 className="card-title d-flex align-items-center gap-2 mb-3 mb-md-4">
                    <MapPin size={20} style={{ color: '#667eea' }} />
                    <span className="fw-semibold">Trip Details</span>
                  </h5>

                  {/* Destination */}
                  <div className="mb-3">
                    <label className="form-label fw-medium small">Destination</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <MapPin size={18} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="e.g., Tokyo, Japan"
                      />
                    </div>
                  </div>

                  {/* Start Date - Better UI */}
                  <div className="mb-3">
                    <label className="form-label fw-medium small">Start Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Calendar size={18} className="text-muted" />
                      </span>
                      <input
                        type="date"
                        className="form-control border-start-0"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        min={today}
                        title="Click to open calendar"
                      />
                    </div>
                    <small className="text-muted">Click the calendar icon to choose a date</small>
                  </div>

                  {/* Number of Days - Custom Input with +/- buttons */}
                  <div className="mb-3">
                    <label className="form-label fw-medium small">Number of Days</label>
                    <div className="number-input-wrapper">
                      <button 
                        type="button"
                        className="number-btn"
                        onClick={decrementDays}
                        disabled={formData.days <= 1}
                      >
                        <Minus size={16} style={{ color: '#667eea' }} />
                      </button>
                      <div className="number-display">
                        {formData.days}
                      </div>
                      <button 
                        type="button"
                        className="number-btn"
                        onClick={incrementDays}
                        disabled={formData.days >= 30}
                      >
                        <Plus size={16} style={{ color: '#667eea' }} />
                      </button>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.days}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          setFormData({ ...formData, days: Math.max(1, Math.min(30, value)) });
                        }}
                        min="1"
                        max="30"
                        style={{ maxWidth: '80px' }}
                      />
                    </div>
                    <small className="text-muted">Use +/- buttons or type a number (1-30)</small>
                  </div>

                  {/* Interests */}
                  <div className="mb-3 mb-md-4">
                    <label className="form-label fw-medium small">Interests</label>
                    <textarea
                      className="form-control"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      placeholder="e.g., Food, Culture, History, Adventure..."
                      rows="3"
                    />
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn btn-generate btn-lg w-100 text-white fw-semibold shadow-lg d-flex align-items-center justify-content-center gap-2"
                    style={{ minHeight: '48px' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span>Generate Itinerary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section - Fixed Width Container */}
            <div className="col-12 col-lg-7 col-xl-8">
              <div className="results-container">
                {loading && (
                  <div className="card shadow-lg border-0 rounded-4 mb-4">
                    <div className="card-body text-center py-5">
                      <Loader2 size={48} style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} className="mb-3" />
                      <h5 className="fw-semibold mb-2">Creating Your Perfect Itinerary</h5>
                      <p className="text-muted mb-0">This may take a few moments...</p>
                    </div>
                  </div>
                )}

                {!loading && plan && (
                  <>
                    {/* Map Preview */}
                    {formData.destination && (
                      <div className="mb-4">
                        <MapPreview 
                          destination={formData.destination} 
                          places={extractedPlaces}
                        />
                      </div>
                    )}
                    
                    {/* Generated Plan */}
                    <GeneratedPlan plan={plan} destination={formData.destination} />
                  </>
                )}

                {!loading && !plan && (
                  <div className="card shadow-lg border-0 rounded-4">
                    <div className="card-body text-center py-5">
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                           style={{ 
                             width: '80px', 
                             height: '80px',
                             background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                           }}>
                        <Sparkles size={40} style={{ color: '#667eea' }} />
                      </div>
                      <h5 className="fw-semibold mb-2">Ready to Plan Your Trip?</h5>
                      <p className="text-muted mb-0 mx-auto px-3" style={{ maxWidth: '500px' }}>
                        Fill in your travel details and let AI create a personalized itinerary with an interactive map showing all recommended places.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}