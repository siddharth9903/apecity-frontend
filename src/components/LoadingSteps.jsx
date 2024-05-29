import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const LoadingSteps = ({ progress }) => {
    const steps = [
        'Image uploading to IPFS',
        'Token metadata uploading to IPFS',
        'Token and Bonding curve contract creation transaction submitting',
        'Waiting for transaction to get confirmed',
        'Data indexing by indexers',
    ];

    const currentStep = steps[progress];

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
            <div className="bg-black bg-opacity-50 rounded-lg p-8">
                <div style={{ width: 200, height: 200 }}>
                    <CircularProgressbar
                        value={(progress + 1) / (steps.length+1) * 100}
                        text={`${progress + 1}/${steps.length + 1}`}
                        styles={buildStyles({
                            pathColor: '#fefb72',
                            textColor: '#fff',
                            trailColor: '#f0bb31',
                            backgroundColor: '#1b1d28',
                        })}
                    />
                </div>
                <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-white">{currentStep}</h2>
                    <p className="text-gray-400">Please wait...</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingSteps;
// import React, { useState, useEffect } from 'react';
// import { ProgressBar, Step } from 'react-step-progress-bar';
// import 'react-step-progress-bar/styles.css';

// const LoadingSteps = ({ progress }) => {
//     const steps = [
//         'Image uploading to IPFS',
//         'Token metadata uploading to IPFS',
//         'Token and Bonding curve contract creation',
//         'Token and Bonding curve contract confirmation',
//         'Data indexing by indexers',
//     ];

//     return (
//         <ProgressBar
//             percent={((progress + 1) / steps.length) * 100}
//             filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
//         >
//             {steps.map((step, index) => (
//                 <Step key={index} transition="scale">
//                     {({ accomplished }) => (
//                         <div
//                             className={`step-progress-dot ${accomplished ? 'accomplished' : ''}`}
//                         >
//                             {accomplished ? '✓' : index + 1}
//                         </div>
//                     )}
//                 </Step>
//             ))}
//         </ProgressBar>
//     );
// };

// export default LoadingSteps;