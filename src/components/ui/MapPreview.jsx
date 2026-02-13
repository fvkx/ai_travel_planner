import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapPreview({ destination, places = [], onHotelsFound = null, interests = '' }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const hotelsRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [attractions, setAttractions] = useState([]);

  // Fetch hotels from Overpass API
  const fetchHotels = async (location, map) => {
    const [lat, lon] = location;
    const bbox = `${lat - 0.05},${lon - 0.05},${lat + 0.05},${lon + 0.05}`;

    try {
      const query = `[bbox:${bbox}];(node["tourism"="hotel"];way["tourism"="hotel"];relation["tourism"="hotel"];);out center;`;
      const response = await fetch(
        'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query)
      );
      const data = await response.json();

      const hotelsList = [];

      // Process nodes
      if (data.elements) {
        data.elements.forEach((element) => {
          let hotelLat, hotelLon;

          if (element.lat && element.lon) {
            hotelLat = element.lat;
            hotelLon = element.lon;
          } else if (element.center) {
            hotelLat = element.center.lat;
            hotelLon = element.center.lon;
          }

          if (hotelLat && hotelLon) {
            const hotelName = element.tags?.name || 'Hotel';
            const stars = element.tags?.['stars'] || '';
            const website = element.tags?.website || '';
            const phone = element.tags?.phone || '';
            const address = element.tags?.['addr:full'] || '';

            hotelsList.push({
              name: hotelName,
              lat: hotelLat,
              lon: hotelLon,
              stars,
              website,
              phone,
              address,
            });

            // Add hotel marker to map
            const hotelMarker = L.circleMarker([hotelLat, hotelLon], {
              radius: 6,
              fillColor: '#FF6B6B',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            }).addTo(map);

            const popupContent = `
              <div style="padding:10px;font-family:Inter,sans-serif;min-width:180px;">
                <strong style="color:#FF6B6B;">${hotelName}</strong>
                ${stars ? `<div style="color:#f59e0b;margin:2px 0;">${'⭐'.repeat(Math.min(parseInt(stars), 5))}</div>` : ''}
                ${address ? `<div style="font-size:12px;color:#666;margin:4px 0;">${address}</div>` : ''}
                ${phone ? `<div style="font-size:12px;color:#666;"><strong>Phone:</strong> ${phone}</div>` : ''}
                ${website ? `<div style="font-size:12px;"><a href="${website}" target="_blank" style="color:#667eea;">Visit Website</a></div>` : ''}
              </div>
            `;
            hotelMarker.bindPopup(popupContent);
            hotelsRef.current.push(hotelMarker);
          }
        });
      }

      setHotels(hotelsList);
      if (onHotelsFound) {
        onHotelsFound(hotelsList);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  // Fetch real attractions from Overpass API based on interests
  const fetchAttractions = async (location, map, userInterests) => {
    const [lat, lon] = location;
    const bbox = `${lat - 0.08},${lon - 0.08},${lat + 0.08},${lon + 0.08}`;

    // Map user interests to OSM tags
    const interestMap = {
      culture: ['tourism=museum', 'tourism=art_gallery', 'tourism=historical', 'historic=castle', 'historic=monument'],
      history: ['historic=castle', 'historic=monument', 'historic=archaeological_site', 'tourism=museum'],
      food: ['amenity=restaurant', 'amenity=cafe', 'amenity=bar', 'cuisine=*'],
      nature: ['tourism=viewpoint', 'leisure=park', 'natural=peak', 'tourism=attraction'],
      adventure: ['tourism=attraction', 'sport=climbing', 'leisure=sports_centre'],
      art: ['tourism=art_gallery', 'tourism=museum', 'amenity=theatre'],
      shopping: ['shop=mall', 'amenity=market', 'shop=department_store'],
    };

    try {
      let attractionTags = ['tourism=attraction', 'tourism=viewpoint', 'tourism=museum'];
      
      // Add tags based on user interests
      if (userInterests) {
        const interests = userInterests.toLowerCase().split(',').map(i => i.trim());
        interests.forEach(interest => {
          Object.keys(interestMap).forEach(key => {
            if (interest.includes(key)) {
              attractionTags.push(...interestMap[key]);
            }
          });
        });
      }

      // Remove duplicates
      attractionTags = [...new Set(attractionTags)];

      // Build Overpass query
      const tagQueries = attractionTags.map(tag => `node["${tag.split('=')[0]}"="${tag.split('=')[1]}"];`).join('');
      const query = `[bbox:${bbox}];(${tagQueries}way["${attractionTags[0].split('=')[0]}"="${attractionTags[0].split('=')[1]}"];);out center 50;`;

      const response = await fetch(
        'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query)
      );
      const data = await response.json();

      const attractionsList = [];

      if (data.elements) {
        data.elements.slice(0, 15).forEach((element) => {
          let attLat, attLon;

          if (element.lat && element.lon) {
            attLat = element.lat;
            attLon = element.lon;
          } else if (element.center) {
            attLat = element.center.lat;
            attLon = element.center.lon;
          }

          if (attLat && attLon) {
            const name = element.tags?.name || 'Attraction';
            const type = element.tags?.tourism || element.tags?.amenity || element.tags?.historic || 'Landmark';
            const website = element.tags?.website || '';
            const openingHours = element.tags?.opening_hours || '';

            attractionsList.push({
              name,
              lat: attLat,
              lon: attLon,
              type,
              website,
              openingHours,
            });

            // Add attraction marker to map
            const attMarker = L.circleMarker([attLat, attLon], {
              radius: 7,
              fillColor: '#10B981',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            }).addTo(map);

            const popupContent = `
              <div style="padding:10px;font-family:Inter,sans-serif;min-width:180px;">
                <strong style="color:#10B981;">${name}</strong>
                <div style="font-size:12px;color:#666;margin:4px 0;"><strong>Type:</strong> ${type}</div>
                ${openingHours ? `<div style="font-size:12px;color:#666;">Hours: ${openingHours}</div>` : ''}
                ${website ? `<div style="font-size:12px;"><a href="${website}" target="_blank" style="color:#667eea;">Learn More</a></div>` : ''}
              </div>
            `;
            attMarker.bindPopup(popupContent);
            markersRef.current.push(attMarker);
          }
        });
      }

      setAttractions(attractionsList);
    } catch (error) {
      console.error('Error fetching attractions:', error);
    }
  };

  // Initialize Leaflet map & geocode destination using Nominatim
  useEffect(() => {
    if (!destination || !mapRef.current) return;

    const geocodeDestination = async () => {
      try {
        // Use Nominatim API to geocode the destination (free, no API key needed)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`
        );
        const results = await response.json();

        if (results.length > 0) {
          const { lat, lon } = results[0];
          const location = [parseFloat(lat), parseFloat(lon)];

          // Initialize Leaflet map
          const map = L.map(mapRef.current).setView(location, 13);

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            maxNativeZoom: 18,
          }).addTo(map);

          mapInstance.current = map;

          // Add main destination marker
          const mainMarker = L.circleMarker(location, {
            radius: 10,
            fillColor: '#667eea',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 1,
          }).addTo(map);

          mainMarker.bindPopup(`<div style="padding:8px;font-family:Inter,sans-serif;"><strong style="color:#667eea;">${destination}</strong></div>`);

          // Fetch hotels and attractions using Overpass API
          fetchHotels(location, map);
          fetchAttractions(location, map, interests);

          setLoading(false);
        } else {
          console.error('Geocoding failed: location not found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setLoading(false);
      }
    };

    geocodeDestination();
  }, [destination, interests]);

  // Add recommended places markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || places.length === 0) return;

    // Remove old markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Geocode each place and add markers
    places.forEach((placeName, index) => {
      const geocodePlace = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${placeName} ${destination}`)}`
          );
          const results = await response.json();

          if (results.length > 0) {
            const { lat, lon } = results[0];
            const location = [parseFloat(lat), parseFloat(lon)];

            const marker = L.circleMarker(location, {
              radius: 8,
              fillColor: '#764ba2',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.9,
            }).addTo(map);

            marker.bindPopup(`<div style="padding:8px;font-family:Inter,sans-serif;"><strong style="color:#667eea;">${placeName}</strong></div>`);

            markersRef.current.push(marker);
          }
        } catch (error) {
          console.error(`Error geocoding ${placeName}:`, error);
        }
      };

      geocodePlace();
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

      {hotels.length > 0 && (
        <div className="position-absolute bottom-0 end-0 m-3 bg-white rounded-3 shadow p-3" style={{ maxWidth: '250px', maxHeight: '150px', overflowY: 'auto' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div style={{ width: '12px', height: '12px', backgroundColor: '#FF6B6B', borderRadius: '50%' }} />
            <small className="fw-semibold">Hotels Found</small>
          </div>
          <div style={{ fontSize: '12px' }}>
            {hotels.slice(0, 3).map((hotel, idx) => (
              <div key={idx} className="mb-1 pb-1" style={{ borderBottom: idx < Math.min(2, hotels.length - 1) ? '1px solid #eee' : 'none' }}>
                <div style={{ color: '#333', fontWeight: '500' }}>{hotel.name}</div>
                {hotel.stars && <div style={{ color: '#f59e0b' }}>{'⭐'.repeat(Math.min(parseInt(hotel.stars), 5))}</div>}
              </div>
            ))}
            {hotels.length > 3 && <small style={{ color: '#999' }}>+{hotels.length - 3} more hotels</small>}
          </div>
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
