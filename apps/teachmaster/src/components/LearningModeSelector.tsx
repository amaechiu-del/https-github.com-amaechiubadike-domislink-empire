'use client'

import { useState } from 'react'

interface LearningMode {
  id: 'gamified' | 'serious'
  title: string
  description: string
  characters: string
  features: string[]
  icon: string
  color: string
}

export default function LearningModeSelector({ onModeSelect }: { onModeSelect: (mode: string) => void }) {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)

  const modes: LearningMode[] = [
    {
      id: 'gamified',
      title: 'Gamified Learning',
      description: 'Fun characters, games, competitions, and entertainment',
      characters: '50 Exaggerated AI Tutors',
      features: ['XP & Badges', 'Leaderboards', 'Character Unlocks', 'Study Battles', 'Viral Challenges'],
      icon: '🎮',
      color: '#FF6B6B'
    },
    {
      id: 'serious',
      title: 'Serious Learning',
      description: 'Professional tutors, focused study, academic excellence',
      characters: '20 Inspiring Professors',
      features: ['Progress Tracking', 'Academic Focus', 'Scholarly Environment', 'Research-Based', 'Exam Mastery'],
      icon: '📚',
      color: '#4ECDC4'
    }
  ]

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId)
    onModeSelect(modeId)
  }

  return (
    <div className="mode-selector">
      <div className="header">
        <h1>Choose Your Learning Style</h1>
        <p>Select the teaching approach that works best for you. You can change this anytime!</p>
      </div>

      <div className="modes-container">
        {modes.map((mode) => (
          <div 
            key={mode.id}
            className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
            onClick={() => handleModeSelect(mode.id)}
          >
            <div className="mode-icon" style={{ color: mode.color }}>
              {mode.icon}
            </div>
            
            <h2>{mode.title}</h2>
            <p className="mode-description">{mode.description}</p>
            
            <div className="characters-info">
              <strong>{mode.characters}</strong>
            </div>

            <div className="features-list">
              {mode.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  ✓ {feature}
                </div>
              ))}
            </div>

            <div className="mode-examples">
              {mode.id === 'gamified' ? (
                <div className="example">
                  <strong>Example:</strong>
                  <em>"Prof. Wahala: 'EMERGENCY MATH! We must DEFEAT this algebra!'"</em>
                </div>
              ) : (
                <div className="example">
                  <strong>Example:</strong>
                  <em>"Dr. Elena: 'Let's approach this problem methodically, step by step.'"</em>
                </div>
              )}
            </div>

            <button 
              className="select-button"
              style={{ backgroundColor: mode.color }}
            >
              Choose {mode.title}
            </button>
          </div>
        ))}
      </div>

      <div className="hybrid-option">
        <h3>🔄 Hybrid Learning</h3>
        <p>Want both? Premium users can switch between modes anytime or use different modes for different subjects!</p>
        <button 
          className="hybrid-button"
          onClick={() => handleModeSelect('hybrid')}
        >
          Get Both Modes (Premium)
        </button>
      </div>

      <div className="comparison-table">
        <h3>Quick Comparison</h3>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Gamified 🎮</th>
              <th>Serious 📚</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Teaching Style</td>
              <td>Entertaining & Dramatic</td>
              <td>Professional & Inspiring</td>
            </tr>
            <tr>
              <td>Motivation</td>
              <td>XP, Badges, Competitions</td>
              <td>Personal Growth, Mastery</td>
            </tr>
            <tr>
              <td>Best For</td>
              <td>Ages 8-16, Engagement Issues</td>
              <td>Ages 14+, Exam Prep</td>
            </tr>
            <tr>
              <td>Environment</td>
              <td>Colorful, Animated</td>
              <td>Clean, Academic</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .mode-selector {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #333;
        }

        .modes-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .mode-card {
          background: white;
          border: 3px solid #e0e0e0;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .mode-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .mode-card.selected {
          border-color: #4ECDC4;
          box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
        }

        .mode-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .mode-card h2 {
          font-size: 1.8rem;
          margin-bottom: 15px;
          color: #333;
        }

        .mode-description {
          color: #666;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .characters-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          color: #333;
        }

        .features-list {
          text-align: left;
          margin-bottom: 20px;
        }

        .feature-item {
          padding: 5px 0;
          color: #555;
        }

        .example {
          background: #f0f8ff;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: left;
        }

        .select-button {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .select-button:hover {
          opacity: 0.9;
        }

        .hybrid-option {
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
          color: white;
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          margin-bottom: 40px;
        }

        .hybrid-button {
          background: white;
          color: #333;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 15px;
        }

        .comparison-table {
          background: white;
          padding: 30px;
          border-radius: 20px;
          border: 1px solid #e0e0e0;
        }

        .comparison-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .comparison-table th {
          background: #f8f9fa;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .modes-container {
            grid-template-columns: 1fr;
          }
          
          .mode-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}