import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  message: string; // This will be "You Won!" or "You Lost."
}

export const Card: React.FC<CardProps> = ({ message }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    // Modal overlay
    <div className="fixed inset-0   flex items-center justify-center z-50">
      {/* Card content */}
      <div className="bg-gradient-to-b from-slate-700 to-slate-900 p-8 rounded-xl shadow-2xl text-center w-full max-w-sm border-2 border-slate-600 transform transition-all">
        <h2 className="text-3xl font-bold text-white mb-4">
          Game Over
        </h2>
        <p className="text-2xl font-semibold text-white mb-6">
          {message}
        </p>
        <div className="mt-8">
          <button
            onClick={handleHomeClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};