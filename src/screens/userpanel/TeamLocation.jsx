import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { format } from 'date-fns';

// Fix Leaflet icon loading issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function TeamLocation() {
  const location = useLocation();
  const teamid = location.state?.teamid;

  const [locationsByDate, setLocationsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (teamid) {
      fetch(`https://server-three-mu-70.vercel.app/api/getUserLocations/${teamid}`)
        .then(res => res.json())
        .then(data => {
          const grouped = {};

          data.forEach(entry => {
            const dateKey = format(new Date(entry.timestamp), 'yyyy-MM-dd');
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(entry);
          });

          setLocationsByDate(grouped);
        })
        .catch(err => console.error(err));
    }
  }, [teamid]);

  const renderMap = () => {
    const points = locationsByDate[selectedDate];
    if (!points || points.length === 0) return <p>No locations for this date.</p>;

    const center = [points[0].lat, points[0].lng];

    return (
      <MapContainer center={center} zoom={16} scrollWheelZoom style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {points.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lng]}>
            <Popup>
              Time: {format(new Date(point.timestamp), 'hh:mm:ss a')}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  return (
    <div className="container mt-5">
      <h3>Location Tracking</h3>
      <div className="mb-4">
        <h5>Select Date:</h5>
        <ul className="list-group">
          {Object.keys(locationsByDate).map(date => (
            <li
              key={date}
              className={`list-group-item ${date === selectedDate ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </li>
          ))}
        </ul>
      </div>

      {selectedDate && (
        <div className="my-4">
          <h5>Map for {selectedDate}</h5>
          {renderMap()}
        </div>
      )}
    </div>
  );
}
