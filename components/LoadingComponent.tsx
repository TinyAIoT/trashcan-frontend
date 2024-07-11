import React from 'react';

interface LoadingComponentProps {
  text?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex justify-center items-center select-none text-lg">
      {text}
    </div>
  );
};

export default LoadingComponent;
