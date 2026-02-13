import { Calendar, MapPin, Coffee, Camera, Download, Share2 } from 'lucide-react';

export default function GeneratedPlan({ plan, destination }) {
  const handleDownload = () => {
    const blob = new Blob([plan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${destination}-itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${destination} Travel Itinerary`,
          text: plan
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(plan);
      alert('Itinerary copied to clipboard!');
    }
  };

  return (
    <>
      <style>{`
        .plan-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .btn-action {
          transition: all 0.2s ease;
        }
        
        .btn-action:hover {
          transform: translateY(-2px);
        }
        
        .btn-action:active {
          transform: translateY(0);
        }
        
        .day-header-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .time-block {
          background-color: rgba(102, 126, 234, 0.1);
          border-left: 3px solid #667eea;
        }
        
        .pro-tip-block {
          background-color: rgba(255, 193, 7, 0.1);
          border-left: 3px solid #ffc107;
        }
        
        /* Prevent text overflow - CRITICAL FIX */
        .itinerary-content {
          max-width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }
        
        .itinerary-content p,
        .itinerary-content h5,
        .itinerary-content h6,
        .itinerary-content div {
          max-width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }
        
        @media (max-width: 576px) {
          .plan-header h4 {
            font-size: 1.25rem;
          }
          
          .btn-action {
            padding: 0.5rem;
          }
        }
      `}</style>

      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        {/* Header */}
        <div className="plan-header text-white p-3 p-md-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <MapPin size={18} />
                <small className="opacity-75">Your Itinerary for</small>
              </div>
              <h4 className="mb-0 fw-bold text-break">{destination}</h4>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              <button
                onClick={handleShare}
                className="btn btn-light btn-sm rounded-3 btn-action d-flex align-items-center gap-1"
                title="Share"
              >
                <Share2 size={16} />
                <span className="d-none d-sm-inline">Share</span>
              </button>
              <button
                onClick={handleDownload}
                className="btn btn-light btn-sm rounded-3 btn-action d-flex align-items-center gap-1"
                title="Download"
              >
                <Download size={16} />
                <span className="d-none d-sm-inline">Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content - With proper word wrapping */}
        <div className="card-body p-3 p-md-4">
          <div className="itinerary-content">
            {plan.split('\n').map((line, index) => {
              // Style day headers
              if (line.match(/^Day \d+/i) || line.match(/^\*\*Day \d+/i)) {
                return (
                  <div key={index} className="d-flex align-items-center gap-2 gap-md-3 pb-2 pb-md-3 mb-3 mb-md-4 border-bottom border-primary border-2 mt-3 mt-md-4" style={{ marginTop: index === 0 ? '0' : undefined }}>
                    <div className="day-header-box d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" 
                         style={{ width: '40px', height: '40px' }}>
                      <Calendar className="text-white" size={20} />
                    </div>
                    <h5 className="mb-0 fw-bold text-break" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                      {line.replace(/\*\*/g, '')}
                    </h5>
                  </div>
                );
              }
              
              // Style section headers
              if (line.match(/^#+\s/) || line.match(/^\*\*[^*]+\*\*$/)) {
                return (
                  <h6 key={index} className="fw-semibold mt-3 mt-md-4 mb-2 mb-md-3 text-break" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
                    {line.replace(/^#+\s/, '').replace(/\*\*/g, '')}
                  </h6>
                );
              }
              
              // Style bullet points
              if (line.match(/^[\s]*[-*•]\s/)) {
                return (
                  <div key={index} className="d-flex gap-2 gap-md-3 mb-2 mb-md-3 ms-2 ms-md-3">
                    <span className="badge rounded-circle p-1 mt-1 flex-shrink-0" 
                          style={{ 
                            width: '8px', 
                            height: '8px',
                            background: '#667eea'
                          }}></span>
                    <p className="mb-0 text-secondary text-break" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', flex: 1 }}>
                      {line.replace(/^[\s]*[-*•]\s/, '')}
                    </p>
                  </div>
                );
              }
              
              // Style time indicators
              if (line.match(/^\d{1,2}:\d{2}|Morning|Afternoon|Evening|Night/i)) {
                return (
                  <div key={index} className="time-block d-flex align-items-start gap-2 gap-md-3 my-2 my-md-3 p-2 p-md-3 rounded-3">
                    <Coffee size={18} className="flex-shrink-0 mt-1" style={{ color: '#667eea' }} />
                    <p className="mb-0 fw-medium text-break" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', flex: 1 }}>
                      {line}
                    </p>
                  </div>
                );
              }
              
              // Regular paragraphs
              if (line.trim()) {
                return (
                  <p key={index} className="mb-2 mb-md-3 text-secondary text-break" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', lineHeight: '1.6' }}>
                    {line}
                  </p>
                );
              }
              
              return <div key={index} style={{ height: '8px' }} />;
            })}
          </div>

          {/* Footer Tips */}
          <div className="mt-3 mt-md-4 pt-3 pt-md-4 border-top">
            <div className="pro-tip-block d-flex align-items-start gap-2 gap-md-3 p-2 p-md-3 rounded-3">
              <Camera size={18} className="flex-shrink-0 mt-1" style={{ color: '#f59e0b' }} />
              <div style={{ flex: 1 }}>
                <p className="fw-semibold mb-1 small">Pro Tip</p>
                <p className="mb-0 small text-break" style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.875rem)' }}>
                  Remember to check local events, weather conditions, and operating hours before your trip. 
                  Have a wonderful journey!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}