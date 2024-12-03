import React, { useState } from "react";
import {
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {ExpressCheckoutElement} from '@stripe/react-stripe-js';


const AestheticianSelect = ({ 
    aestheticians, 
    selectedAesthetician, 
    onAestheticianChange,
    staffError 
  }) => {


    
    return (
      <div className="mb-4 transition-opacity duration-700 ease-in-out opacity-100">
        {staffError && (
          <div className="text-red-500 text-sm mb-4">{staffError}</div>
        )}
        <label htmlFor="aesthetician" className="text-lg font-semibold block">
          Select Aesthetician
        </label>
        <div className="relative">
          <select
            id="aesthetician"
            value={selectedAesthetician}
            onChange={onAestheticianChange}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" className="text-muted-foreground">Choose an Aesthetician</option>
            {aestheticians.map((aesthetician) => (
              <option key={aesthetician} value={aesthetician} className="text-sm text-foreground">
                {aesthetician}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };
  

  export default AestheticianSelect;