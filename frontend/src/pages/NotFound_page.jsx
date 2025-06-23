import React from 'react';

function NotFoundPage() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>404</h1>
        <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
        <p style={styles.suggestion}>Perhaps you want to go back to the <a href="/" style={styles.link}>Home Page</a>?</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #ff8a00, #e52e71)', // Gradient background
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: '50px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  heading: {
    fontSize: '100px',
    margin: '0',
    fontWeight: 'bold',
    letterSpacing: '5px',
  },
  message: {
    fontSize: '24px',
    marginTop: '20px',
    marginBottom: '20px',
  },
  suggestion: {
    fontSize: '18px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default NotFoundPage;
