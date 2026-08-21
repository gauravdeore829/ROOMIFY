import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Fix default Leaflet icon marker issues in Vite build
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const MapComponent = ({ properties = [], center = [18.5204, 73.8567], zoom = 12 }) => {
  return (
    <div className="w-full h-full min-h-[350px] rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((prop) => {
          if (!prop.latitude || !prop.longitude) return null;
          return (
            <Marker key={prop.id} position={[prop.latitude, prop.longitude]}>
              <Popup>
                <div className="p-1 space-y-1 font-sans">
                  <h4 className="font-bold text-slate-900 text-sm">{prop.name}</h4>
                  <p className="text-xs text-slate-600">{prop.address}, {prop.area}</p>
                  <div className="text-sky-600 font-bold text-xs">
                    ₹{prop.minRent || (prop.rooms && prop.rooms[0]?.rent) || 'N/A'} / mo
                  </div>
                  <Link
                    to={`/property/${prop.id}`}
                    className="inline-block mt-1 text-[11px] font-semibold text-white bg-sky-600 px-2 py-1 rounded hover:bg-sky-500 transition"
                  >
                    View Room
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
