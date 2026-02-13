import { Calendar, MapPin, Coffee, Camera, Download, Share2 } from 'lucide-react';

export default function GeneratedPlan({ plan, destination, hotels = [] }) {
  // Handle structured JSON format
  const formatPlanAsDocument = () => {
    if (typeof plan === 'object' && plan.days && Array.isArray(plan.days)) {
      return plan;
    }
    return null;
  };

  const planData = formatPlanAsDocument();

  const handleDownload = () => {
    const lines = [];
    if (planData) {
      lines.push(planData.title || `Trip to ${destination}`);
      lines.push('');
      if (planData.summary) {
        lines.push(planData.summary);
        lines.push('');
      }
      
      planData.days.forEach(day => {
        lines.push(`Day ${day.day}: ${day.title}`);
        lines.push('');
        
        if (day.activities?.length) {
          lines.push('Activities:');
          day.activities.forEach(a => lines.push(`  - ${a}`));
          lines.push('');
        }
        
        if (day.places?.length) {
          lines.push('Places to Visit:');
          day.places.forEach(p => lines.push(`  - ${p}`));
          lines.push('');
        }
        
        if (day.meals) {
          lines.push('Meals:');
          if (day.meals.breakfast) lines.push(`  - Breakfast: ${day.meals.breakfast}`);
          if (day.meals.lunch) lines.push(`  - Lunch: ${day.meals.lunch}`);
          if (day.meals.dinner) lines.push(`  - Dinner: ${day.meals.dinner}`);
          lines.push('');
        }
        
        if (day.tips?.length) {
          lines.push('Tips:');
          day.tips.forEach(t => lines.push(`  - ${t}`));
          lines.push('');
        }
      });
    }
    
    if (hotels.length > 0) {
      lines.push('');
      lines.push('RECOMMENDED HOTELS');
      lines.push('');
      hotels.slice(0, 10).forEach(hotel => {
        lines.push(`${hotel.name}`);
        if (hotel.stars) lines.push(`  Rating: ${'⭐'.repeat(Math.min(parseInt(hotel.stars), 5))}`);
        if (hotel.address) lines.push(`  Address: ${hotel.address}`);
        if (hotel.phone) lines.push(`  Phone: ${hotel.phone}`);
        if (hotel.website) lines.push(`  Website: ${hotel.website}`);
        lines.push('');
      });
    }
    
    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${destination}-itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const lines = [];
    if (planData) {
      lines.push(planData.title || `Trip to ${destination}`);
      lines.push('');
      if (planData.summary) {
        lines.push(planData.summary);
        lines.push('');
      }
      
      planData.days.forEach(day => {
        lines.push(`Day ${day.day}: ${day.title}`);
        if (day.activities?.length) {
          lines.push('Activities: ' + day.activities.join(', '));
        }
        if (day.places?.length) {
          lines.push('Places: ' + day.places.join(', '));
        }
        lines.push('');
      });
    }
    
    if (hotels.length > 0) {
      lines.push('Top Hotels:');
      hotels.slice(0, 5).forEach(hotel => {
        lines.push(`- ${hotel.name}${hotel.stars ? ' (' + '⭐'.repeat(Math.min(parseInt(hotel.stars), 5)) + ')' : ''}`);
      });
    }
    
    const shareText = lines.join('\n');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${destination} Travel Itinerary`,
          text: shareText
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
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
        
        .section-header {
          color: #667eea;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .content-item {
          background: #f8f9fa;
          padding: 1rem;
          margin-bottom: 0.75rem;
          border-left: 4px solid #667eea;
          border-radius: 0.5rem;
        }
        
        .meal-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .meal-time {
          font-weight: 600;
          color: #667eea;
          min-width: 100px;
        }
        
        .meal-description {
          flex: 1;
          color: #495057;
        }
        
        .tip-item {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%);
          padding: 0.75rem 1rem;
          margin-bottom: 0.75rem;
          border-left: 4px solid #ffc107;
          border-radius: 0.5rem;
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

        {/* Content */}
        <div className="card-body p-3 p-md-4">
          {planData ? (
            <>
              {/* Title */}
              <div className="mb-4">
                <h1 className="h3 fw-bold text-break">{planData.title || `Trip to ${destination}`}</h1>
              </div>
              
              {/* Summary */}
              {planData.summary && (
                <div className="mb-4">
                  <p className="lead text-muted mb-0">{planData.summary}</p>
                </div>
              )}
              
              {/* Days */}
              {planData.days && planData.days.map((day, index) => (
                <div key={index} className="mb-5 pb-4 border-bottom" style={{ ':last-child': { borderBottom: 'none' } }}>
                  {/* Day Header */}
                  <div className="d-flex align-items-center gap-2 gap-md-3 mb-4">
                    <div className="day-header-box d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" 
                         style={{ width: '50px', height: '50px' }}>
                      <Calendar className="text-white" size={24} />
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold text-break">
                        Day {day.day}: {day.title}
                      </h5>
                    </div>
                  </div>
                  
                  {/* Activities */}
                  {day.activities && day.activities.length > 0 && (
                    <div>
                      <h6 className="section-header">Activities</h6>
                      <div className="mb-4">
                        {day.activities.map((activity, i) => (
                          <div key={i} className="d-flex gap-2 mb-2">
                            <span style={{ color: '#667eea', fontWeight: 'bold' }}>•</span>
                            <p className="mb-0 text-secondary">{activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Places to Visit */}
                  {day.places && day.places.length > 0 && (
                    <div>
                      <h6 className="section-header">Places to Visit</h6>
                      <div className="mb-4">
                        {day.places.map((place, i) => (
                          <div key={i} className="content-item">
                            <p className="mb-0 fw-medium">{place}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Meals */}
                  {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                    <div>
                      <h6 className="section-header">Meals</h6>
                      <div className="mb-4">
                        {day.meals.breakfast && (
                          <div className="meal-item">
                            <div className="meal-time">Breakfast</div>
                            <div className="meal-description">{day.meals.breakfast}</div>
                          </div>
                        )}
                        {day.meals.lunch && (
                          <div className="meal-item">
                            <div className="meal-time">Lunch</div>
                            <div className="meal-description">{day.meals.lunch}</div>
                          </div>
                        )}
                        {day.meals.dinner && (
                          <div className="meal-item">
                            <div className="meal-time">Dinner</div>
                            <div className="meal-description">{day.meals.dinner}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Tips */}
                  {day.tips && day.tips.length > 0 && (
                    <div>
                      <h6 className="section-header">Pro Tips</h6>
                      <div>
                        {day.tips.map((tip, i) => (
                          <div key={i} className="tip-item d-flex gap-2">
                            <span style={{ color: '#ffc107' }}>✓</span>
                            <p className="mb-0 text-secondary text-break">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <p className="text-muted">Unable to format itinerary</p>
          )}
          
          {/* Hotels Section */}
          {hotels.length > 0 && (
            <div className="mt-5 pt-4 border-top">
              <h5 className="fw-bold text-break mb-4">Recommended Hotels in {destination}</h5>
              <div className="row g-3">
                {hotels.slice(0, 6).map((hotel, idx) => (
                  <div key={idx} className="col-12 col-md-6">
                    <div className="card border-0 rounded-3 shadow-sm h-100">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-start gap-2 mb-2">
                          <div style={{ width: '12px', height: '12px', backgroundColor: '#FF6B6B', borderRadius: '50%', marginTop: '2px', flexShrink: 0 }} />
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold text-break" style={{ color: '#FF6B6B' }}>
                              {hotel.name}
                            </h6>
                            {hotel.stars && (
                              <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                {'⭐'.repeat(Math.min(parseInt(hotel.stars), 5))}
                              </div>
                            )}
                          </div>
                        </div>
                        {hotel.address && (
                          <p className="mb-2 small text-muted text-break">
                            🏢 {hotel.address}
                          </p>
                        )}
                        {hotel.phone && (
                          <p className="mb-2 small text-muted">
                            📞 {hotel.phone}
                          </p>
                        )}
                        {hotel.website && (
                          <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary rounded-2 text-decoration-none">
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {hotels.length > 6 && (
                <p className="text-muted small mt-3 text-center">
                  ... and {hotels.length - 6} more hotels available on the map
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}