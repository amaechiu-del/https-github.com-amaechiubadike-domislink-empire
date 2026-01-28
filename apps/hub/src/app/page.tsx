export default function HubPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        🌍 DomisLink Empire
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
        ONE CODEBASE. ONE DATABASE. WORLDWIDE. AI-POWERED.
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <a href="https://realestate.domislink.com" style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '30px',
          borderRadius: '15px',
          textDecoration: 'none',
          color: 'white',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏠</div>
          <h3>Real Estate</h3>
          <p>Worldwide property listings</p>
        </a>
        
        <a href="https://teachmaster.domislink.com" style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '30px',
          borderRadius: '15px',
          textDecoration: 'none',
          color: 'white'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎓</div>
          <h3>TeachMaster</h3>
          <p>AI-powered education</p>
        </a>
        
        <a href="https://tickets.domislink.com" style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '30px',
          borderRadius: '15px',
          textDecoration: 'none',
          color: 'white'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✈️</div>
          <h3>TicketMaster</h3>
          <p>Flight booking worldwide</p>
        </a>
        
        <a href="https://fm.domislink.com" style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '30px',
          borderRadius: '15px',
          textDecoration: 'none',
          color: 'white'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📡</div>
          <h3>Flight Monitor</h3>
          <p>Real-time flight tracking</p>
        </a>
      </div>
    </div>
  )
}