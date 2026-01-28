'use client'

import { useState, useEffect } from 'react'

interface EmergencyCharacter {
  name: string
  personality: string
  catchphrase: string
  teachingStyle: string
  mannerisms: string[]
  avatar: string
  region: string
}

export default function EmergencyCharacterSummon({ 
  isTriggered, 
  userLocation, 
  subject, 
  failureContext,
  onCharacterSummoned 
}: {
  isTriggered: boolean
  userLocation: string
  subject: string
  failureContext: string
  onCharacterSummoned: (character: EmergencyCharacter) => void
}) {
  const [summoningStage, setSummoningStage] = useState(0)
  const [character, setCharacter] = useState<EmergencyCharacter | null>(null)

  const regionalCharacters: Record<string, EmergencyCharacter[]> = {
    'NG': [
      {
        name: "Davido",
        personality: "Energetic Afrobeats star, motivational",
        catchphrase: "We rise by lifting others! Let's BLOW this math!",
        teachingStyle: "Turns lessons into song lyrics and rhythm",
        mannerisms: ["*snaps fingers*", "Assurance! You can do this!", "30BG energy!", "*dances*", "Make we dey go!"],
        avatar: "🎤",
        region: "Nigeria"
      },
      {
        name: "Funke Akindele",
        personality: "Comedic actress, motherly but hilarious",
        catchphrase: "Omo see me see trouble! But we go solve am!",
        teachingStyle: "Uses Jenifa comedy to explain concepts",
        mannerisms: ["*dramatic gestures*", "Kilo de happen?", "You too much!", "*laughs*", "Omo!"],
        avatar: "🎭",
        region: "Nigeria"
      }
    ],
    'US': [
      {
        name: "The Rock",
        personality: "Motivational wrestler-actor, never gives up",
        catchphrase: "Can you smell what the MATH is cooking?!",
        teachingStyle: "Treats learning like championship training",
        mannerisms: ["*flexes*", "Let's go champ!", "You got this, superstar!", "*raises eyebrow*", "Finally!"],
        avatar: "💪",
        region: "USA"
      },
      {
        name: "Oprah",
        personality: "Inspirational talk show host, believes in everyone",
        catchphrase: "You get knowledge! You get understanding! EVERYBODY gets success!",
        teachingStyle: "Makes every lesson feel life-changing",
        mannerisms: ["*spreads arms wide*", "Aha moment!", "This is YOUR time!", "*points*", "Yes honey!"],
        avatar: "👑",
        region: "USA"
      }
    ],
    'GB': [
      {
        name: "David Beckham",
        personality: "Football legend, team player mentality",
        catchphrase: "Bend it like Beckham? Nah, SOLVE it like Beckham!",
        teachingStyle: "Uses football strategies for problem-solving",
        mannerisms: ["*kicks imaginary ball*", "Right, let's have it!", "Brilliant!", "*adjusts hair*", "Class!"],
        avatar: "⚽",
        region: "UK"
      }
    ],
    'IN': [
      {
        name: "Shah Rukh Khan",
        personality: "Bollywood king, romantic and dramatic",
        catchphrase: "Kuch kuch hota hai... when you understand mathematics!",
        teachingStyle: "Makes learning feel like Bollywood romance",
        mannerisms: ["*spreads arms*", "Rahul naam toh suna hoga!", "*dramatic pause*", "King Khan!", "Dilwale!"],
        avatar: "👑",
        region: "India"
      }
    ]
  }

  const summoningStages = [
    "🌟 Emergency help activated...",
    "📡 Detecting your location...",
    "✨ Scanning for regional heroes...",
    "🎭 Summoning character...",
    "🚀 Help has arrived!"
  ]

  useEffect(() => {
    if (!isTriggered) return

    const summonSequence = async () => {
      for (let i = 0; i < summoningStages.length; i++) {
        setSummoningStage(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Select random character from user's region
      const regionChars = regionalCharacters[userLocation] || regionalCharacters['US']
      const selectedChar = regionChars[Math.floor(Math.random() * regionChars.length)]
      
      setCharacter(selectedChar)
      onCharacterSummoned(selectedChar)
    }

    summonSequence()
  }, [isTriggered])

  if (!isTriggered) return null

  return (
    <div className="emergency-summon">
      {!character ? (
        <div className="summoning-animation">
          <div className="portal">
            <div className="spinning-ring"></div>
            <div className="center-icon">🆘</div>
          </div>
          <h2>{summoningStages[summoningStage]}</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((summoningStage + 1) / summoningStages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="character-arrival">
          <div className="character-intro">
            <div className="character-avatar">{character.avatar}</div>
            <h2>{character.name} has arrived!</h2>
            <div className="character-speech">
              <p>"{character.catchphrase}"</p>
              <div className="mannerisms">
                {character.mannerisms.slice(0, 2).map((mannerism, index) => (
                  <span key={index} className="mannerism">{mannerism}</span>
                ))}
              </div>
            </div>
            <div className="help-message">
              <p>
                I see you're struggling with <strong>{subject}</strong>! 
                Don't worry, {character.name} is here to help you succeed!
              </p>
              <p className="teaching-style">
                <em>{character.teachingStyle}</em>
              </p>
            </div>
            <button className="start-help" onClick={() => setCharacter(null)}>
              Let's Do This! 🚀
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .emergency-summon {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4);
          background-size: 400% 400%;
          animation: gradientShift 3s ease infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .summoning-animation {
          text-align: center;
          color: white;
        }

        .portal {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto 30px;
        }

        .spinning-ring {
          width: 200px;
          height: 200px;
          border: 4px solid transparent;
          border-top: 4px solid #EEFF00;
          border-right: 4px solid #FF6B6B;
          border-radius: 50%;
          animation: spin 2s linear infinite;
        }

        .center-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 4rem;
          animation: pulse 1s ease-in-out infinite;
        }

        .progress-bar {
          width: 300px;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          margin: 20px auto;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #EEFF00;
          transition: width 0.5s ease;
        }

        .character-arrival {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          max-width: 500px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .character-avatar {
          font-size: 5rem;
          margin-bottom: 20px;
          animation: bounce 2s ease infinite;
        }

        .character-speech {
          background: #f0f8ff;
          padding: 20px;
          border-radius: 15px;
          margin: 20px 0;
          border-left: 4px solid #4ECDC4;
        }

        .mannerisms {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 10px;
        }

        .mannerism {
          background: #EEFF00;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }

        .help-message {
          margin: 20px 0;
        }

        .teaching-style {
          color: #666;
          font-style: italic;
        }

        .start-help {
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .start-help:hover {
          transform: scale(1.05);
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}