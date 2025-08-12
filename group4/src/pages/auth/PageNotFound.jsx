import React from 'react';

const PageNotFound = () => {
    const primaryColor = '#E53935';
    const secondaryColor = '#D32F2F';
    const lightColor = '#FFCDD2';
    
    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, #B71C1C)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                {/* Animated 404 */}
                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(6rem, 15vw, 12rem)',
                        fontWeight: 'bold',
                        color: lightColor,
                        textShadow: `0 0 20px ${primaryColor}, 0 0 40px ${primaryColor}`,
                        margin: 0,
                        animation: 'pulse 2s ease-in-out infinite alternate'
                    }}>
                        404
                    </h1>
                </div>

                {/* Error message */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '1rem'
                    }}>
                        Oops! Page Not Found
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        color: lightColor,
                        maxWidth: '28rem',
                        margin: '0 auto',
                        opacity: 0.9
                    }}>
                        The page you're looking for seems to have wandered off into the digital void.
                    </p>
                </div>

                {/* Floating elements */}
                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                    <div style={{
                        position: 'absolute',
                        top: '-1rem',
                        left: '-1rem',
                        width: '2rem',
                        height: '2rem',
                        backgroundColor: primaryColor,
                        borderRadius: '50%',
                        animation: 'bounce 2s infinite',
                        opacity: 0.7
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        top: '-0.5rem',
                        right: '-1.5rem',
                        width: '1.5rem',
                        height: '1.5rem',
                        backgroundColor: '#FF5722',
                        borderRadius: '50%',
                        animation: 'bounce 2s infinite 0.2s',
                        opacity: 0.5
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        bottom: '-1rem',
                        left: '2rem',
                        width: '1rem',
                        height: '1rem',
                        backgroundColor: lightColor,
                        borderRadius: '50%',
                        animation: 'bounce 2s infinite 0.4s',
                        opacity: 0.6
                    }}></div>
                </div>

                {/* Action buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <button 
                        onClick={() => window.history.back()}
                        style={{
                            padding: '0.75rem 2rem',
                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(229, 57, 53, 0.3)',
                            fontSize: '1rem'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 6px 20px rgba(229, 57, 53, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 15px rgba(229, 57, 53, 0.3)';
                        }}
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={() => window.location.href = '/'}
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'transparent',
                            color: lightColor,
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            border: `2px solid ${primaryColor}`,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '1rem'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = primaryColor;
                            e.target.style.color = 'white';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = lightColor;
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        Home Page
                    </button>
                </div>

                {/* Decorative elements */}
                <div style={{ marginTop: '3rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            backgroundColor: primaryColor,
                            borderRadius: '50%',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}></div>
                        <div style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            backgroundColor: '#FF5722',
                            borderRadius: '50%',
                            animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                        }}></div>
                        <div style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            backgroundColor: lightColor,
                            borderRadius: '50%',
                            animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                        }}></div>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '25%',
                left: '25%',
                width: '16rem',
                height: '16rem',
                backgroundColor: primaryColor,
                borderRadius: '50%',
                filter: 'blur(60px)',
                opacity: 0.2,
                animation: 'pulse 3s ease-in-out infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                top: '75%',
                right: '25%',
                width: '16rem',
                height: '16rem',
                backgroundColor: '#FF5722',
                borderRadius: '50%',
                filter: 'blur(60px)',
                opacity: 0.2,
                animation: 'pulse 3s ease-in-out infinite 0.5s'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '25%',
                left: '33%',
                width: '16rem',
                height: '16rem',
                backgroundColor: lightColor,
                borderRadius: '50%',
                filter: 'blur(60px)',
                opacity: 0.15,
                animation: 'pulse 3s ease-in-out infinite 1s'
            }}></div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                
                @media (max-width: 640px) {
                    .button-container {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default PageNotFound;