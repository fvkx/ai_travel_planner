import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export default function MapPreview({ destination, places = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);

  // Initialize Google Map & geocode destination
  useEffect(() => {
    if (!destination || !mapRef.current) return;

    // Load Google Maps script if not loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: destination }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;

          const map = new window.google.maps.Map(mapRef.current, {
            center: location,
            zoom: 13,
            styles: [
              { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });

          mapInstance.current = map;

          // Add main destination marker
          new window.google.maps.Marker({
            position: location,
            map,
            title: destination,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#667eea",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }
          });

          setLoading(false);
        } else {
          console.error('Geocoding failed:', status);
          setLoading(false);
        }
      });
    }
  }, [destination]);

  // Add recommended places markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || places.length === 0) return;

    // Remove old markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const service = new window.google.maps.places.PlacesService(map);

    places.forEach((placeName, index) => {
      const request = {
        query: `${placeName} in ${destination}`,
        fields: ['name', 'geometry'],
      };

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
          const marker = new window.google.maps.Marker({
            position: results[0].geometry.location,
            map,
            title: placeName,
            label: { text: `${index + 1}`, color: 'white', fontSize: '12px', fontWeight: 'bold' },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 15,
              fillColor: "#764ba2",
              fillOpacity: 0.9,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding:8px;font-family:Inter,sans-serif;">
              <strong style="color:#667eea;">${placeName}</strong>
            </div>`
          });

          marker.addListener('click', () => infoWindow.open(map, marker));

          markersRef.current.push(marker);
        }
      });
    });

  }, [destination, places]);

  return (
    <div className="card shadow-lg border-0 rounded-4 overflow-hidden position-relative" style={{ height: '400px' }}>
      {loading && (
        <div className="d-flex align-items-center justify-content-center h-100 bg-light">
          <div className="text-center">
            <Loader2 size={32} className="mb-2" style={{ color: '#667eea', animation: 'spin 1s linear infinite' }} />
            <p className="text-muted small mb-0">Loading map...</p>
          </div>
        </div>
      )}

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {places.length > 0 && (
        <div className="position-absolute bottom-0 start-0 m-3 bg-white rounded-3 shadow p-2" style={{ maxWidth: '200px' }}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <MapPin size={16} style={{ color: '#667eea' }} />
            <small className="fw-semibold">Recommended Places</small>
          </div>
          <small className="text-muted d-block">{places.length} locations marked</small>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
