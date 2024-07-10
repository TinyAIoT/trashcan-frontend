import React from 'react';

const LoadingComponent: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      userSelect: 'none',
      fontSize: '20px',
    //   fontWeight: 'bold'
    }}>
      Loading...
    </div>
  );
};

export default LoadingComponent;
