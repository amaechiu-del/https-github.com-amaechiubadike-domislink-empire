'use client'

import { useState } from 'react'

export default function TeachMasterIntro() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Welcome to TeachMaster! 🎓",
      content: "Meet 50 unforgettable AI tutors who make learning fun while following your exact curriculum!",
      icon: "🎭"
    },
    {
      title: "Gamified Learning 🎮",
      content: "Earn XP, unlock characters, compete with friends - but always learning real curriculum content!",
      icon: "🏆"
    },
    {
      title: "Curriculum Compliant 📚",
      content: "Every lesson follows your regional syllabus: WAEC, SAT, GCSE, CBSE - we've got you covered!",
      icon: "✅"
    },
    {
      title: "Crazy Characters, Serious Learning 🤪",
      content: "Prof. Wahala screams math, but teaches real algebra. Mama Maths uses food analogies for actual fractions!",
      icon: "🎪"
    },
    {
      title: "Your Success Guaranteed 🎯",
      content: "Fun personalities + strict curriculum compliance = better grades and exam results!",
      icon: "📈"
    }
  ]

  return (
    <div className="intro-modal">
      <div className="slide-container">
        <div className="slide-icon">{slides[currentSlide].icon}</div>
        <h2>{slides[currentSlide].title}</h2>
        <p>{slides[currentSlide].content}</p>
        
        <div className="slide-navigation">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <div className="slide-controls">
          {currentSlide > 0 && (
            <button onClick={() => setCurrentSlide(currentSlide - 1)}>
              Previous
            </button>
          )}
          
          {currentSlide < slides.length - 1 ? (
            <button onClick={() => setCurrentSlide(currentSlide + 1)}>
              Next
            </button>
          ) : (
            <button className="start-learning">
              Start Learning! 🚀
            </button>
          )}
        </div>
      </div>

      <div className="compliance-notice">
        <h3>📋 Important Notice</h3>
        <p>
          <strong>TeachMaster is curriculum-compliant:</strong> Our fun characters teach 
          real syllabus content aligned with your regional education standards. 
          Gamification enhances learning, never replaces academic rigor.
        </p>
      </div>

      <style jsx>{`
        .intro-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .slide-container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          max-width: 500px;
          margin-bottom: 20px;
        }

        .slide-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .slide-navigation {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 20px 0;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: #ddd;
          cursor: pointer;
        }

        .dot.active {
          background: #EEFF00;
        }

        .slide-controls {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .slide-controls button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: #4CAF50;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }

        .start-learning {
          background: #EEFF00 !important;
          color: black !important;
        }

        .compliance-notice {
          background: #f0f8ff;
          padding: 20px;
          border-radius: 10px;
          max-width: 500px;
          border-left: 4px solid #4CAF50;
        }

        .compliance-notice h3 {
          margin: 0 0 10px 0;
          color: #2E7D32;
        }

        .compliance-notice p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}