import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
  ExpressCheckoutElement
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_live_51PpC5qDKlQeK4p1VuJZfUVUXQvWXVYX7ST1pd1Nd7q3ndS0tsrR6ENm5E4KumRp8661lUhfFF1NV8r8hncvEcdSN00fxa6AR9D");

const PaymentForm = ({ 
  onClose, 
  firstName, 
  email, 
  mobile, 
  handleSubmit,
  clientSecret  
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleExpressCheckout = async () => {
    console.log('Starting Express Checkout...');
    
    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.');
      setPaymentError('Stripe.js has not loaded yet. Please try again later.');
      return;
    }

    console.log('Stripe and Elements loaded:', { stripe, elements });

    setIsProcessing(true);
    setPaymentError(null);

    try {
      console.log('Submitting payment data via ExpressCheckoutElement...');
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        console.error('Error during form submission:', submitError.message);
        setPaymentError(`Form submission failed: ${submitError.message}`);
        setIsProcessing(false);
        return;
      }
      console.log('Form submission successful.');

      if (!clientSecret) {
        console.error('Client secret is missing');
        setPaymentError('Payment initialization failed');
        return;
      }

      console.log('Retrieved clientSecret:', clientSecret);

      console.log('Confirming PaymentIntent...');
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required', // Prevent automatic redirection
      });

      if (error) {
        console.error('Error confirming payment:', error.message);
        setPaymentError(`Payment confirmation failed: ${error.message}`);
        setIsProcessing(false);
      } else {
        console.log('Payment succeeded!');
        
        console.log('User details:', { firstName, email, mobile });
  
        console.log('Closing the payment window...');
        onClose();
        
        // Modify handleSubmit call to work without an event
        console.log('Calling handleSubmit...');
        await handleSubmit();
        console.log('handleSubmit executed successfully.');
      }
    } catch (err) {
      console.error('Unexpected error occurred:', err);
      setPaymentError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Secure Your Appointment
        </h3>
        <p className="text-sm text-gray-600">
          $29 to hold your appointment with our certified Aesthetician.
          This amount will be fully credited towards your first procedure.
        </p>
      </div>

      {paymentError && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 text-sm">
          {paymentError}
        </div>
      )}

      <div className="mb-4">
        <ExpressCheckoutElement onConfirm={handleExpressCheckout} />
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5FD4D0] mr-2" />
          <span className="text-gray-600">Processing payment...</span>
        </div>
      )}
    </div>
  );
};

const PaymentComponent = ({
  onClose,
  firstName,
  email,
  mobile,
  handleSubmit,
  clientSecret
}) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#5FD4D0",
          },
        },
      }}
    >
      <PaymentForm
        onClose={onClose}
        firstName={firstName}
        email={email}
        mobile={mobile}
        handleSubmit={handleSubmit}
        clientSecret={clientSecret}
      />
    </Elements>
  );
};

export default PaymentComponent;