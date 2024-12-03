import React from 'react';

const FirstVisitPrompt = ({ onFirstVisitChange }) => {
  return (
    <div>
      
      <h2 className="text-lg mb-4">Is this your first visit?</h2>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => onFirstVisitChange(true)}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-[#5FD4D0] hover:bg-[#5FD4D0]/90 text-white"
        >
          Yes
        </button>
        <button
          onClick={() => onFirstVisitChange(false)}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-[#5FD4D0] hover:bg-[#5FD4D0]/90 text-white"
        >
          No
        </button>
      </div>
    </div>
  );
};


export default FirstVisitPrompt;