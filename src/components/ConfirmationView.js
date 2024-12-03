import React, { useState } from "react";
import {
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {ExpressCheckoutElement} from '@stripe/react-stripe-js';



const ConfirmationView = ({ 
    firstName, 
    mobile, 
    selectedProcedure, 
    selectedAesthetician, 
    selectedDate, 
    selectedTime,
    isFirstVisit 
  }) => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6 text-center text-teal-500">
          Thank You! We look forward to seeing you:
        </h1>
        <div className="space-y-4">
          <p>
            Name:<strong> {firstName} </strong>
          </p>
          <p>
            Mobile:<strong> {mobile} </strong>
          </p>
          <p>
            {isFirstVisit ? "Initial consultation: " : `Procedure: `}
            <strong>{selectedProcedure}</strong>
          </p>
          {!isFirstVisit && (
            <p>
              Aesthetician:<strong> {selectedAesthetician} </strong>{" "}
            </p>
          )}
          <p>
            Date:<strong> {selectedDate?.toLocaleDateString()} </strong>{" "}
          </p>
          <p>
            Time:<strong> {selectedTime} </strong>
          </p>
        </div>
      </div>

    
    );
  };

  export default ConfirmationView;