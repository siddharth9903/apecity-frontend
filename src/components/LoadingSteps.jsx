import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const STEPS = [
  'Metadata uploading to IPFS',
  'Token and BC contract creation',
  'Waiting for transaction to get confirmed',
  'Data indexing',
];

const LoadingSteps = ({ progress }) => {
  const currentStep = STEPS[progress-1];
  const totalSteps = STEPS.length;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-black bg-opacity-50 rounded-lg p-8 max-w-md w-full text-center">
        <div className="w-48 h-48 mx-auto">
          <CircularProgressbar
            value={((progress) / (totalSteps)) * 100}
            text={`${(progress)}/${totalSteps}`}
            styles={buildStyles({
              pathColor: '#fefb72',
              textColor: '#fff',
              trailColor: '#f0bb31',
              backgroundColor: '#1b1d28',
            })}
          />
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-white break-words">{currentStep}</h2>
          <p className="text-gray-400 mt-2">Please wait...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSteps;