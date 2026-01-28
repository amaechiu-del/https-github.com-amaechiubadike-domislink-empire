'use client'

import { useState, useEffect } from 'react'
import GeolocationDataManager from '@domislink/geolocation'

interface Airline {
  code: string
  name: string
  logo: string
  type: 'domestic' | 'international'
  region: string
}

interface RegionalAirlines {
  [key: string]: {
    domestic: Airline[]
    international: Airline[]
  }
}

export default function GlobalDynamicWingsHeader() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userLocation, setUserLocation] = useState<any>(null)
  const [currentAirlines, setCurrentAirlines] = useState<Airline[]>([])

  const regionalAirlines: RegionalAirlines = {
    'AFRICA': {
      domestic: [
        { code: 'ADK', name: 'Arik Air', logo: '🇳🇬', type: 'domestic', region: 'AFRICA' },
        { code: 'AXM', name: 'Air Peace', logo: '🇳🇬', type: 'domestic', region: 'AFRICA' },
        { code: 'MAX', name: 'Max Air', logo: '🇳🇬', type: 'domestic', region: 'AFRICA' },
        { code: 'SAA', name: 'South African Airways', logo: '🇿🇦', type: 'domestic', region: 'AFRICA' },
        { code: 'KQ', name: 'Kenya Airways', logo: '🇰🇪', type: 'domestic', region: 'AFRICA' },
        { code: 'MS', name: 'EgyptAir', logo: '🇪🇬', type: 'domestic', region: 'AFRICA' }
      ],
      international: [
        { code: 'ET', name: 'Ethiopian Airlines', logo: '🇪🇹', type: 'international', region: 'AFRICA' },
        { code: 'KQ', name: 'Kenya Airways', logo: '🇰🇪', type: 'international', region: 'AFRICA' },
        { code: 'SAA', name: 'South African Airways', logo: '🇿🇦', type: 'international', region: 'AFRICA' },
        { code: 'MS', name: 'EgyptAir', logo: '🇪🇬', type: 'international', region: 'AFRICA' }
      ]
    },
    'NORTH_AMERICA': {
      domestic: [
        { code: 'AA', name: 'American Airlines', logo: '🇺🇸', type: 'domestic', region: 'NORTH_AMERICA' },
        { code: 'DL', name: 'Delta Air Lines', logo: '🇺🇸', type: 'domestic', region: 'NORTH_AMERICA' },
        { code: 'UA', name: 'United Airlines', logo: '🇺🇸', type: 'domestic', region: 'NORTH_AMERICA' },
        { code: 'WN', name: 'Southwest Airlines', logo: '🇺🇸', type: 'domestic', region: 'NORTH_AMERICA' },
        { code: 'AC', name: 'Air Canada', logo: '🇨🇦', type: 'domestic', region: 'NORTH_AMERICA' },
        { code: 'AM', name: 'Aeromexico', logo: '🇲🇽', type: 'domestic', region: 'NORTH_AMERICA' }
      ],
      international: [
        { code: 'AA', name: 'American Airlines', logo: '🇺🇸', type: 'international', region: 'NORTH_AMERICA' },
        { code: 'DL', name: 'Delta Air Lines', logo: '🇺🇸', type: 'international', region: 'NORTH_AMERICA' },
        { code: 'UA', name: 'United Airlines', logo: '🇺🇸', type: 'international', region: 'NORTH_AMERICA' },
        { code: 'AC', name: 'Air Canada', logo: '🇨🇦', type: 'international', region: 'NORTH_AMERICA' }
      ]
    },
    'EUROPE': {
      domestic: [
        { code: 'BA', name: 'British Airways', logo: '🇬🇧', type: 'domestic', region: 'EUROPE' },
        { code: 'LH', name: 'Lufthansa', logo: '🇩🇪', type: 'domestic', region: 'EUROPE' },
        { code: 'AF', name: 'Air France', logo: '🇫🇷', type: 'domestic', region: 'EUROPE' },
        { code: 'KL', name: 'KLM', logo: '🇳🇱', type: 'domestic', region: 'EUROPE' },
        { code: 'IB', name: 'Iberia', logo: '🇪🇸', type: 'domestic', region: 'EUROPE' },
        { code: 'AZ', name: 'Alitalia', logo: '🇮🇹', type: 'domestic', region: 'EUROPE' }
      ],
      international: [
        { code: 'BA', name: 'British Airways', logo: '🇬🇧', type: 'international', region: 'EUROPE' },
        { code: 'LH', name: 'Lufthansa', logo: '🇩🇪', type: 'international', region: 'EUROPE' },
        { code: 'AF', name: 'Air France', logo: '🇫🇷', type: 'international', region: 'EUROPE' },
        { code: 'KL', name: 'KLM', logo: '🇳🇱', type: 'international', region: 'EUROPE' },
        { code: 'TK', name: 'Turkish Airlines', logo: '🇹🇷', type: 'international', region: 'EUROPE' }
      ]
    },
    'ASIA_PACIFIC': {
      domestic: [
        { code: '6E', name: 'IndiGo', logo: '🇮🇳', type: 'domestic', region: 'ASIA_PACIFIC' },
        { code: 'AI', name: 'Air India', logo: '🇮🇳', type: 'domestic', region: 'ASIA_PACIFIC' },
        { code: 'SG', name: 'SpiceJet', logo: '🇮🇳', type: 'domestic', region: 'ASIA_PACIFIC' },
        { code: 'CZ', name: 'China Southern', logo: '🇨🇳', type: 'domestic', region: 'ASIA_PACIFIC' },
        { code: 'NH', name: 'ANA', logo: '🇯🇵', type: 'domestic', region: 'ASIA_PACIFIC' },
        { code: 'JL', name: 'JAL', logo: '🇯🇵', type: 'domestic', region: 'ASIA_PACIFIC' }
      ],
      international: [
        { code: 'SQ', name: 'Singapore Airlines', logo: '🇸🇬', type: 'international', region: 'ASIA_PACIFIC' },
        { code: 'EK', name: 'Emirates', logo: '🇦🇪', type: 'international', region: 'ASIA_PACIFIC' },
        { code: 'QR', name: 'Qatar Airways', logo: '🇶🇦', type: 'international', region: 'ASIA_PACIFIC' },
        { code: 'CX', name: 'Cathay Pacific', logo: '🇭🇰', type: 'international', region: 'ASIA_PACIFIC' },
        { code: 'TG', name: 'Thai Airways', logo: '🇹🇭', type: 'international', region: 'ASIA_PACIFIC' }
      ]
    }
  }

  useEffect(() => {
    const geoManager = new GeolocationDataManager()
    geoManager.detectUserLocation().then(location => {
      setUserLocation(location)
      const regionAirlines = regionalAirlines[location.region] || regionalAirlines['NORTH_AMERICA']
      setCurrentAirlines([...regionAirlines.domestic, ...regionAirlines.international])
    })
  }, [])

  useEffect(() => {
    if (currentAirlines.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentAirlines.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [currentAirlines.length])

  if (!userLocation || currentAirlines.length === 0) {
    return <div className="loading">Detecting your location...</div>
  }

  const currentAirline = currentAirlines[currentIndex]
  const isInternational = currentAirline.type === 'international'
  const domesticAirlines = currentAirlines.filter(a => a.type === 'domestic')
  const internationalAirlines = currentAirlines.filter(a => a.type === 'international')

  return (
    <div className="wings-header">
      <div className="location-info">
        📍 {userLocation.city}, {userLocation.country} | {userLocation.region.replace('_', ' ')}
      </div>
      
      <div className="wings-container">
        {/* Left Wing - Domestic */}
        <div className={`wing left-wing ${isInternational ? 'inactive' : 'active'}`}>
          <div className="wing-section">
            <h3>DOMESTIC FLIGHTS</h3>
            <div className="airline-logos">
              {domesticAirlines.map((airline) => (
                <div 
                  key={airline.code}
                  className={`airline-item ${currentAirline.code === airline.code ? 'highlighted' : ''}`}
                >
                  <span className="logo">{airline.logo}</span>
                  <span className="name">{airline.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Plane */}
        <div className="plane-center">
          <div className={`plane ${isInternational ? 'international-mode' : 'domestic-mode'}`}>
            ✈️
          </div>
          <div className="current-airline">
            <span className="current-logo">{currentAirline.logo}</span>
            <div className="airline-info">
              <h2>{currentAirline.name}</h2>
              <p className="airline-type">{currentAirline.type.toUpperCase()}</p>
              <p className="region">{userLocation.region.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Right Wing - International */}
        <div className={`wing right-wing ${isInternational ? 'active' : 'inactive'}`}>
          <div className="wing-section">
            <h3>INTERNATIONAL FLIGHTS</h3>
            <div className="airline-logos">
              {internationalAirlines.map((airline) => (
                <div 
                  key={airline.code}
                  className={`airline-item ${currentAirline.code === airline.code ? 'highlighted' : ''}`}
                >
                  <span className="logo">{airline.logo}</span>
                  <span className="name">{airline.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wings-header {
          width: 100%;
          height: 350px;
          background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .loading {
          color: white;
          font-size: 18px;
          text-align: center;
        }

        .location-info {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .wings-container {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          position: relative;
        }

        .wing {
          flex: 1;
          height: 200px;
          position: relative;
          transition: all 0.8s ease;
          transform-origin: center;
        }

        .left-wing {
          background: linear-gradient(45deg, #32CD32, #228B22);
          clip-path: polygon(0 50%, 80% 0, 100% 50%, 80% 100%);
          animation: flapLeft 3s ease-in-out infinite;
        }

        .right-wing {
          background: linear-gradient(45deg, #FFD700, #FF8C00);
          clip-path: polygon(20% 0, 100% 50%, 20% 100%, 0 50%);
          animation: flapRight 3s ease-in-out infinite;
        }

        .wing.active {
          transform: scale(1.1);
          filter: brightness(1.2);
        }

        .wing.inactive {
          transform: scale(0.9);
          filter: brightness(0.7);
        }

        .wing-section {
          padding: 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .wing-section h3 {
          color: white;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .airline-logos {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 120px;
          overflow: hidden;
        }

        .airline-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          font-size: 11px;
          color: white;
        }

        .airline-item.highlighted {
          background: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .airline-item .logo {
          font-size: 14px;
        }

        .airline-item .name {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .plane-center {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 20px;
        }

        .plane {
          font-size: 4rem;
          transition: all 0.8s ease;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        .plane.international-mode {
          transform: scale(1.2) rotate(5deg);
          animation: flyInternational 4s ease-in-out infinite;
        }

        .plane.domestic-mode {
          transform: scale(1) rotate(-2deg);
          animation: flyDomestic 3s ease-in-out infinite;
        }

        .current-airline {
          margin-top: 20px;
          background: rgba(255, 255, 255, 0.9);
          padding: 15px 25px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 280px;
        }

        .current-logo {
          font-size: 2.5rem;
        }

        .airline-info h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
          font-weight: bold;
        }

        .airline-type {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #666;
          font-weight: 500;
          letter-spacing: 1px;
        }

        .region {
          margin: 2px 0 0 0;
          font-size: 10px;
          color: #999;
          font-style: italic;
        }

        @keyframes flapLeft {
          0%, 100% { transform: rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateY(-10deg) rotateZ(-2deg); }
          50% { transform: rotateY(0deg) rotateZ(0deg); }
          75% { transform: rotateY(10deg) rotateZ(2deg); }
        }

        @keyframes flapRight {
          0%, 100% { transform: rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateY(10deg) rotateZ(2deg); }
          50% { transform: rotateY(0deg) rotateZ(0deg); }
          75% { transform: rotateY(-10deg) rotateZ(-2deg); }
        }

        @keyframes flyInternational {
          0%, 100% { transform: scale(1.2) rotate(5deg) translateY(0px); }
          33% { transform: scale(1.2) rotate(8deg) translateY(-15px); }
          66% { transform: scale(1.2) rotate(2deg) translateY(-5px); }
        }

        @keyframes flyDomestic {
          0%, 100% { transform: scale(1) rotate(-2deg) translateY(0px); }
          50% { transform: scale(1) rotate(1deg) translateY(-8px); }
        }

        @media (max-width: 768px) {
          .wings-header {
            height: 280px;
          }
          
          .location-info {
            position: static;
            margin-bottom: 10px;
          }
          
          .wing {
            height: 150px;
          }
          
          .plane {
            font-size: 3rem;
          }
          
          .current-airline {
            min-width: 200px;
            padding: 10px 15px;
          }
        }
      `}</style>
    </div>
  )
}