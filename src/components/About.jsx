import React from "react";

const About = () => {
  return (
    <div className="about-section-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #0d9488 100%)',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '80px' // Added to account for fixed navbar
    }}>
      <div style={{
        maxWidth: '1200px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        animation: 'fadeInUp 0.8s ease-out',
        marginTop: '20px' // Added extra margin to push it down
      }}>
        
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(45deg, #10b981, #0d9488)',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'rotate 20s linear infinite'
          }}></div>
          <p className="primary-subheading" style={{ 
            color: '#ffffff', 
            fontSize: '2rem',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1,
            opacity: 0.9,
            letterSpacing: '2px'
          }}>About</p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: '500px'
        }}>
          
          {/* Background Image Container */}
          <div className="about-background-image-container" style={{
            flex: '1',
            padding: '3rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '350px',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
              transform: 'scale(1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              
            </div>
          </div>

          {/* Text Container */}
          <div className="about-section-text-container" style={{
            flex: '1',
            padding: '3rem 2rem'
          }}>
            
            {/* Story Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                color: '#047857',
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '1rem',
                position: 'relative',
                paddingBottom: '0.5rem'
              }}>
                Our Journey
                <span style={{
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  width: '50px',
                  height: '3px',
                  background: 'linear-gradient(45deg, #10b981, #0d9488)',
                  borderRadius: '2px'
                }}></span>
              </h2>
              <p className="primary-text" style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                marginBottom: '1rem',
                color: '#374151',
                textAlign: 'justify'
              }}>
                Traveling by train offers a unique and immersive experience, allowing you to journey through diverse landscapes and cultures. From bustling cities to picturesque countryside, trains offer a window into the heart of every destination.
              </p>
              <p className="primary-text" style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
                color: '#374151',
                textAlign: 'justify'
              }}>
                Discover the joy of slow travel, where the journey itself becomes an adventure. Whether it's the rhythmic clacking of wheels on the tracks or the panoramic views unfolding outside your window, every moment on a train is filled with anticipation and discovery.
              </p>
            </div>

            {/* Mission Highlight */}
            <div style={{
              background: 'linear-gradient(120deg, rgba(16, 185, 129, 0.1), rgba(13, 148, 136, 0.1))',
              padding: '1.5rem',
              borderRadius: '12px',
              borderLeft: '4px solid #10b981',
              marginBottom: '2rem',
              transform: 'scale(1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <h3 style={{
                color: '#047857',
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '0.8rem'
              }}>Our Mission</h3>
              <p style={{
                color: '#374151',
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>
                We are dedicated to creating extraordinary rail travel experiences that connect people with the beauty of the world, one journey at a time. Through sustainable travel and authentic connections, we make every mile meaningful.
              </p>
            </div>

            {/* Buttons Container */}
            <div className="about-buttons-container" style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button className="secondary-button2" style={{
                background: '#10b981',
                color: 'white',
                padding: '0.8rem 2rem',
                borderRadius: '50px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#059669';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#10b981';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
              }}
              >
                Learn More
              </button>
              
              <button className="watch-video-button" style={{
                background: 'white',
                border: '2px solid #10b981',
                color: '#10b981',
                padding: '0.8rem 2rem',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0fdfa';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
              >
                <a 
                  href="https://www.youtube.com/watch?v=_BXmqEwgEk8&list=RDa_XQdhxeZ10&index=2" 
                  style={{ 
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <svg style={{
                    width: '20px',
                    height: '20px',
                    fill: 'currentColor'
                  }} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10,8 16,12 10,16 10,8" fill="white"/>
                  </svg>
                  Watch Video
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
<style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .about-section-container {
            padding-top: 100px !important; /* Increased for mobile */
          }
          
          .about-section-container > div {
            margin: 1rem !important;
            border-radius: 16px !important;
          }
          
          .about-section-container > div > div:nth-child(2) {
            flex-direction: column !important;
          }
          
          .about-background-image-container {
            padding: 2rem 1rem !important;
          }
          
          .about-section-text-container {
            padding: 2rem 1rem !important;
          }
          
          .about-buttons-container {
            flex-direction: column !important;
          }
          
          .about-buttons-container button {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
  