'use client'

import { useState, useEffect } from 'react'
import GeolocationDataManager from '@domislink/geolocation'

interface RegionalApp {
  name: string
  url: string
  icon: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface RegionalContent {
  [key: string]: {
    apps: RegionalApp[]
    featured: string[]
    currency: string
    language: string
  }
}

export default function GlobalHubLinker() {
  const [userLocation, setUserLocation] = useState<any>(null)
  const [currentAppIndex, setCurrentAppIndex] = useState(0)

  const regionalContent: RegionalContent = {
    'AFRICA': {
      apps: [
        { name: 'Real Estate', url: 'https://realestate.domislink.com', icon: '🏠', description: 'Find properties in your community', priority: 'high' },
        { name: 'TeachMaster', url: 'https://teachmaster.domislink.com', icon: '🎓', description: 'WAEC, JAMB, NECO prep with AI tutors', priority: 'high' },
        { name: 'TicketMaster', url: 'https://tickets.domislink.com', icon: '✈️', description: 'Book flights across Africa & worldwide', priority: 'high' },
        { name: 'Flight Monitor', url: 'https://fm.domislink.com', icon: '📡', description: 'Track flights in real-time', priority: 'medium' },
        { name: 'Admin AI', url: 'https://admin.domislink.com', icon: '🤖', description: 'AI-powered administration', priority: 'low' }
      ],
      featured: ['Real Estate', 'TeachMaster', 'TicketMaster'],
      currency: '₦',
      language: 'English'
    },
    'NORTH_AMERICA': {
      apps: [
        { name: 'Real Estate', url: 'https://realestate.domislink.com', icon: '🏠', description: 'Discover properties nationwide', priority: 'high' },
        { name: 'TeachMaster', url: 'https://teachmaster.domislink.com', icon: '🎓', description: 'SAT, ACT prep with AI tutors', priority: 'high' },
        { name: 'TicketMaster', url: 'https://tickets.domislink.com', icon: '✈️', description: 'Book domestic & international flights', priority: 'high' },
        { name: 'Flight Monitor', url: 'https://fm.domislink.com', icon: '📡', description: 'Real-time flight tracking', priority: 'medium' },
        { name: 'Admin AI', url: 'https://admin.domislink.com', icon: '🤖', description: 'AI administration tools', priority: 'low' }
      ],
      featured: ['Real Estate', 'TeachMaster', 'TicketMaster'],
      currency: '$',
      language: 'English'
    },
    'EUROPE': {
      apps: [
        { name: 'Real Estate', url: 'https://realestate.domislink.com', icon: '🏠', description: 'European property marketplace', priority: 'high' },
        { name: 'TeachMaster', url: 'https://teachmaster.domislink.com', icon: '🎓', description: 'GCSE, A-Level prep with AI', priority: 'high' },
        { name: 'TicketMaster', url: 'https://tickets.domislink.com', icon: '✈️', description: 'European & global flight booking', priority: 'high' },
        { name: 'Flight Monitor', url: 'https://fm.domislink.com', icon: '📡', description: 'Flight tracking across Europe', priority: 'medium' },
        { name: 'Admin AI', url: 'https://admin.domislink.com', icon: '🤖', description: 'AI-powered management', priority: 'low' }
      ],
      featured: ['Real Estate', 'TeachMaster', 'TicketMaster'],
      currency: '€',
      language: 'English'
    },
    'ASIA_PACIFIC': {
      apps: [
        { name: 'Real Estate', url: 'https://realestate.domislink.com', icon: '🏠', description: 'Asia-Pacific property listings', priority: 'high' },
        { name: 'TeachMaster', url: 'https://teachmaster.domislink.com', icon: '🎓', description: 'CBSE, ICSE, JEE prep with AI', priority: 'high' },
        { name: 'TicketMaster', url: 'https://tickets.domislink.com', icon: '✈️', description: 'Asian & international flights', priority: 'high' },
        { name: 'Flight Monitor', url: 'https://fm.domislink.com', icon: '📡', description: 'Asia-Pacific flight tracking', priority: 'medium' },
        { name: 'Admin AI', url: 'https://admin.domislink.com', icon: '🤖', description: 'AI administration suite', priority: 'low' }
      ],
      featured: ['Real Estate', 'TeachMaster', 'TicketMaster'],
      currency: '¥',
      language: 'English'
    }
  }

  useEffect(() => {
    const geoManager = new GeolocationDataManager()
    geoManager.detectUserLocation().then(location => {
      setUserLocation(location)
    })
  }, [])

  useEffect(() => {
    if (!userLocation) return

    const apps = regionalContent[userLocation.region]?.apps || regionalContent['NORTH_AMERICA'].apps
    const interval = setInterval(() => {
      setCurrentAppIndex((prev) => (prev + 1) % apps.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [userLocation])

  if (!userLocation) {
    return <div className="loading">🌍 Detecting your location...</div>
  }

  const regionData = regionalContent[userLocation.region] || regionalContent['NORTH_AMERICA']
  const currentApp = regionData.apps[currentAppIndex]

  return (
    <div className="global-hub">
      <header className="hub-header">
        <div className="location-badge">
          📍 {userLocation.city}, {userLocation.country}
          <span className="currency">{regionData.currency}</span>
        </div>
        <h1>🌍 DomisLink Empire</h1>
        <p>ONE CODEBASE. ONE DATABASE. WORLDWIDE. AI-POWERED.</p>
        <div className="region-tag">{userLocation.region.replace('_', ' ')}</div>
      </header>

      <div className="featured-showcase">
        <div className="current-app-spotlight">
          <div className={`app-icon rotating ${currentApp.priority}`}>
            {currentApp.icon}
          </div>
          <div className="app-details">
            <h2>{currentApp.name}</h2>
            <p>{currentApp.description}</p>
            <a href={currentApp.url} className="launch-btn">
              Launch App 🚀
            </a>
          </div>
        </div>
      </div>

      <div className="apps-grid">
        {regionData.apps.map((app, index) => (
          <a 
            key={app.name} 
            href={app.url} 
            className={`app-card ${app.priority} ${index === currentAppIndex ? 'active' : ''}`}
          >
            <div className="app-icon">{app.icon}</div>
            <h3>{app.name}</h3>
            <p>{app.description}</p>
            <div className="priority-badge">{app.priority}</div>
          </a>
        ))}
      </div>

      <style jsx>{`
        .global-hub {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 24px;
          color: white;
        }

        .hub-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }

        .location-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .currency {
          background: rgba(255, 255, 255, 0.3);
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: bold;
        }

        .hub-header h1 {
          font-size: 3rem;
          margin: 20px 0 10px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .region-tag {
          background: rgba(255, 255, 255, 0.2);
          padding: 5px 15px;
          border-radius: 15px;
          display: inline-block;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 500;
        }

        .featured-showcase {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 40px;
          text-align: center;
        }

        .current-app-spotlight {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
        }

        .app-icon {
          font-size: 4rem;
          transition: all 0.5s ease;
        }

        .app-icon.rotating {
          animation: spotlight 3s ease-in-out infinite;
        }

        .app-icon.high {
          filter: drop-shadow(0 0 20px #FFD700);
        }

        .app-details h2 {
          font-size: 2rem;
          margin: 0 0 10px 0;
        }

        .launch-btn {
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
          color: white;
          padding: 12px 25px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: bold;
          display: inline-block;
          margin-top: 15px;
          transition: transform 0.3s ease;
        }

        .launch-btn:hover {
          transform: scale(1.05);
        }

        .apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .app-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 25px;
          text-decoration: none;
          color: white;
          transition: all 0.3s ease;
          position: relative;
          border: 2px solid transparent;
        }

        .app-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.2);
        }

        .app-card.active {
          border-color: #FFD700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .app-card.high {
          border-left: 4px solid #FF6B6B;
        }

        .app-card.medium {
          border-left: 4px solid #4ECDC4;
        }

        .app-card.low {
          border-left: 4px solid #95A5A6;
        }

        .app-card .app-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .app-card h3 {
          margin: 0 0 10px 0;
          font-size: 1.5rem;
        }

        .app-card p {
          margin: 0 0 15px 0;
          opacity: 0.9;
          line-height: 1.4;
        }

        .priority-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 12px;
          text-transform: uppercase;
        }

        @keyframes spotlight {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(5deg); }
          50% { transform: scale(1.05) rotate(0deg); }
          75% { transform: scale(1.1) rotate(-5deg); }
        }

        @media (max-width: 768px) {
          .location-badge {
            position: static;
            margin-bottom: 20px;
          }
          
          .current-app-spotlight {
            flex-direction: column;
            gap: 20px;
          }
          
          .hub-header h1 {
            font-size: 2rem;
          }
          
          .apps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}