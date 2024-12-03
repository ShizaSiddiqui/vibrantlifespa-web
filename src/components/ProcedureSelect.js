import React, { useState } from "react";
import {
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {ExpressCheckoutElement} from '@stripe/react-stripe-js';


const ProcedureSelect = ({ procedures, selectedProcedure, onProcedureChange, loading }) => {

  
    if (loading) {
      return (
        <div className="mb-4">
          <div className="text-lg font-semibold block mb-2">Select Procedure</div>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" 
                 style={{ borderColor: "#5FD4D0", borderTopColor: "#5FD4D0" }}></div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="mb-4 transition-opacity duration-500 ease-in-out opacity-100">
        <label htmlFor="procedure" className="text-lg font-semibold block">
          Select Procedure
        </label>
        <div className="relative">
          <select
            id="procedure"
            value={selectedProcedure}
            onChange={onProcedureChange}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" className="text-muted-foreground">Choose a Procedure</option>
            {procedures.map((procedure) => (
              <option key={procedure} value={procedure} className="text-sm text-foreground">
                {procedure}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };
  

  export default ProcedureSelect;