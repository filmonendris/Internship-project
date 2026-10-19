import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import Button from '../ui/Button'
import { Link } from 'react-router-dom'

// Fix Leaflet's default icon path issues with bundlers
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Branch Data with Verification Status
const mapBranches = [
  {
    id: 1,
    name: 'Bole Branch',
    address: '123 Djibouti Street, Bole, Addis Ababa',
    phone: '+251911634938',
    hours: '10:00 AM - 10:00 PM',
    coordinates: [8.99732, 38.78675],
    verified: true,
    link: 'https://maps.google.com/?q=8.99732,38.78675'
  },
  {
    id: 2,
    name: 'Piassa Branch',
    address: 'Near Taitu Hotel, Arada, Piassa, Addis Ababa',
    phone: '+251990222919',
    hours: '10:00 AM - 10:00 PM',
    coordinates: [9.0317, 38.7533],
    verified: true,
    link: 'https://maps.google.com/?q=9.0317,38.7533'
  }
];

// Component to dynamically set map view when marker is clicked
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export default function LocationsMap() {
  const [activeBranch, setActiveBranch] = useState(mapBranches[0])

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto h-[700px] lg:h-[500px]">
      
      {/* ── Branch List / Cards ── */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {mapBranches.map(branch => (
          <div 
            key={branch.id} 
            role="button"
            tabIndex={0}
            onClick={() => setActiveBranch(branch)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setActiveBranch(branch)
              }
            }}
            aria-pressed={activeBranch.id === branch.id}
            aria-label={`Select ${branch.name}${!branch.verified ? ' (Unverified location)' : ''}`}
            className={`card p-5 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${activeBranch.id === branch.id ? 'border-primary-500 shadow-glow-red bg-brand-darker/50' : 'hover:border-primary-500/50'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-surface-primary">{branch.name}</h3>
              {!branch.verified && (
                <span className="text-xs font-semibold px-2 py-1 bg-gray-500/20 text-surface-muted rounded-full">
                  Unverified Location
                </span>
              )}
            </div>
            
            <div className="space-y-2 mt-3">
              <div className="flex items-start gap-2 text-surface-muted">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary-500" aria-hidden="true" />
                <span className="text-sm">{branch.address}</span>
              </div>
              <div className="flex items-center gap-2 text-surface-muted">
                <Phone size={16} className="flex-shrink-0 text-primary-500" aria-hidden="true" />
                <span className="text-sm">{branch.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-surface-muted">
                <Clock size={16} className="flex-shrink-0 text-primary-500" aria-hidden="true" />
                <span className="text-sm">{branch.hours}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to={`/branch/${branch.id}`}
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View menu for ${branch.name}`}
              >
                <Button variant="outline" size="sm" className="w-full">
                  Menu
                </Button>
              </Link>
              {branch.verified && branch.link && (
                <a
                  href={branch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Get directions to ${branch.name} on Google Maps (opens in new tab)`}
                >
                  <Button variant="secondary" size="sm" className="w-full gap-1">
                    <Navigation size={14} aria-hidden="true" /> Directions
                  </Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Interactive Map ── */}
      <div className="w-full lg:w-2/3 h-full rounded-2xl overflow-hidden border border-brand-border z-0">
        <MapContainer 
          center={activeBranch.coordinates || [9.02, 38.75]} 
          zoom={13} 
          className="w-full h-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {activeBranch.coordinates && (
            <ChangeView center={activeBranch.coordinates} zoom={15} />
          )}

          {mapBranches.map(branch => {
            if (!branch.verified || !branch.coordinates) return null;
            return (
              <Marker 
                key={branch.id} 
                position={branch.coordinates}
                eventHandlers={{
                  click: () => setActiveBranch(branch)
                }}
              >
                <Popup className="wow-popup">
                  <div className="font-sans">
                    <strong className="block text-base mb-1">{branch.name}</strong>
                    <span className="block text-sm text-gray-600 mb-2">{branch.address}</span>
                    <a href={branch.link} target="_blank" rel="noopener noreferrer" className="text-primary-500 text-sm font-semibold hover:underline flex items-center gap-1">
                      <Navigation size={12} /> Get Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

    </div>
  )
}
