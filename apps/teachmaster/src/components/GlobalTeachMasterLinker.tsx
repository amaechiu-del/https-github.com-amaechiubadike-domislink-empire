'use client'

import { useState, useEffect } from 'react'
import GeolocationDataManager from '@domislink/geolocation'

interface RegionalCurriculum {
  [key: string]: {
    exams: string[]
    subjects: string[]
    characters: string[]
    currency: string
    description: string
  }
}

export default function GlobalTeachMasterLinker() {
  const [userLocation, setUserLocation] = useState<any>(null)
  const [currentExamIndex, setCurrentExamIndex] = useState(0)

  const regionalCurriculum: RegionalCurriculum = {
    'AFRICA': {
      exams: ['WAEC', 'JAMB', 'NECO', 'GCE'],
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics'],
      characters: ['Prof. Wahala', 'Mama Maths', 'Pastor Physics', 'DJ Knowledge'],
      currency: '₦',
      description: 'West African curriculum with local AI tutors'
    },
    'NORTH_AMERICA': {
      exams: ['SAT', 'ACT', 'AP', 'GED'],
      subjects: ['Math', 'English', 'Science', 'Social Studies', 'Foreign Languages'],
      characters: ['The Rock', 'Oprah', 'Coach Chemistry', 'Prof. Calculator'],
      currency: '$',
      description: 'US curriculum with American AI tutors'
    },
    'EUROPE': {
      exams: ['GCSE', 'A-Level', 'IB', 'Baccalauréat'],
      subjects: ['Maths', 'English Literature', 'Sciences', 'History', 'Modern Languages'],
      characters: ['David Beckham', 'Gordon Ramsay', 'Dr. Elena', 'Prof. James'],
      currency: '€',
      description: 'European curriculum with British AI tutors'
    },
    'ASIA_PACIFIC': {
      exams: ['CBSE', 'ICSE', 'JEE', 'NEET', 'GAOKAO'],
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
      characters: ['Shah Rukh Khan', 'APJ Abdul Kalam', 'Dr. Sarah', 'Prof. Kumar'],
      currency: '¥',
      description: 'Asian curriculum with regional AI tutors'
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

    const curriculum = regionalCurriculum[userLocation.region] || regionalCurriculum['NORTH_AMERICA']
    const interval = setInterval(() => {
      setCurrentExamIndex((prev) => (prev + 1) % curriculum.exams.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [userLocation])

  if (!userLocation) {
    return <div className="loading">🎓 Loading your curriculum...</div>
  }

  const curriculum = regionalCurriculum[userLocation.region] || regionalCurriculum['NORTH_AMERICA']
  const currentExam = curriculum.exams[currentExamIndex]

  return (
    <div className="teachmaster-hub">
      <header className="curriculum-header">
        <div className="location-info">
          📍 {userLocation.city}, {userLocation.country}
          <span className="region">{userLocation.region.replace('_', ' ')}</span>
        </div>
        <h1>🎓 TeachMaster</h1>
        <p>{curriculum.description}</p>
      </header>

      <div className="exam-spotlight">
        <div className="rotating-exam">
          <div className="exam-badge">{currentExam}</div>
          <h2>Preparing for {currentExam}?</h2>
          <p>Get ready with our AI tutors specialized in your curriculum!</p>
          <a href="https://teachmaster.domislink.com" className="start-prep-btn">
            Start Preparation 🚀
          </a>
        </div>
      </div>

      <div className="curriculum-grid">
        <div className="exams-section">
          <h3>📋 Your Exams</h3>
          <div className="items-list">
            {curriculum.exams.map((exam, index) => (
              <div 
                key={exam} 
                className={`item ${index === currentExamIndex ? 'active' : ''}`}
              >
                {exam}
              </div>
            ))}
          </div>
        </div>

        <div className="subjects-section">
          <h3>📚 Subjects</h3>
          <div className="items-list">
            {curriculum.subjects.map(subject => (
              <div key={subject} className="item">
                {subject}
              </div>
            ))}
          </div>
        </div>

        <div className="characters-section">
          <h3>🎭 Your AI Tutors</h3>
          <div className="items-list">
            {curriculum.characters.map(character => (
              <div key={character} className="item character">
                {character}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="features-showcase">
        <h3>🌟 Localized for {userLocation.region.replace('_', ' ')}</h3>
        <div className="features">
          <div className="feature">
            <span className="icon">🎯</span>
            <span>Curriculum-compliant content</span>
          </div>
          <div className="feature">
            <span className="icon">🤖</span>
            <span>Regional AI tutors</span>
          </div>
          <div className="feature">
            <span className="icon">💰</span>
            <span>Local pricing ({curriculum.currency})</span>
          </div>
          <div className="feature">
            <span className="icon">🏆</span>
            <span>Exam-focused preparation</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .teachmaster-hub {
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

        .curriculum-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }

        .location-info {
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

        .region {
          background: rgba(255, 255, 255, 0.3);
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: bold;
          font-size: 12px;
        }

        .curriculum-header h1 {
          font-size: 3rem;
          margin: 20px 0 10px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .exam-spotlight {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 40px;
          text-align: center;
        }

        .rotating-exam {
          animation: spotlight 3s ease-in-out infinite;
        }

        .exam-badge {
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
          color: white;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 1.5rem;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .start-prep-btn {
          background: linear-gradient(45deg, #4ECDC4, #45B7D1);
          color: white;
          padding: 15px 30px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: bold;
          display: inline-block;
          margin-top: 20px;
          transition: transform 0.3s ease;
        }

        .start-prep-btn:hover {
          transform: scale(1.05);
        }

        .curriculum-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .exams-section,
        .subjects-section,
        .characters-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 25px;
        }

        .curriculum-grid h3 {
          margin: 0 0 20px 0;
          font-size: 1.5rem;
          text-align: center;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .item {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px 15px;
          border-radius: 10px;
          transition: all 0.3s ease;
          text-align: center;
        }

        .item.active {
          background: rgba(255, 215, 0, 0.3);
          transform: scale(1.05);
          box-shadow: 0 2px 10px rgba(255, 215, 0, 0.2);
        }

        .item.character {
          background: linear-gradient(45deg, rgba(255, 107, 107, 0.2), rgba(78, 205, 196, 0.2));
        }

        .features-showcase {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 25px;
          text-align: center;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          padding: 12px 15px;
          border-radius: 10px;
        }

        .feature .icon {
          font-size: 1.5rem;
        }

        @keyframes spotlight {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @media (max-width: 768px) {
          .location-info {
            position: static;
            margin-bottom: 20px;
          }
          
          .curriculum-header h1 {
            font-size: 2rem;
          }
          
          .curriculum-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}