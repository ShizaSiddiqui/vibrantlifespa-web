import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmationView from "./ConfirmationView.js";
import DateSelect from "./DateSelect.js";
import FirstVisitPrompt from "./FirstVisitPrompt.js";
import ProcedureSelect from "./ProcedureSelect.js";
import PaymentComponent from './PaymentComponent';
import logo from "../images/bookingflowlogo.png";
import AestheticianSelect from "./AestheticianSelect.js";
import confetti from "canvas-confetti";
import SignIn from "./Signin.js";
import PersonalInformationForm from "./PersonalInformationForm";

export default function BookingDisplayMain() {
  const [isFirstVisit, setIsFirstVisit] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [selectedAesthetician, setSelectedAesthetician] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [newClientId, setNewClientId] = useState(null);
  const [procedures, setProcedures] = useState([]);
  const [aestheticians, setAestheticians] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [staffError, setStaffError] = useState("");
  const [procedureItemMap, setProcedureItemMap] = useState({});
  const [cartId, setCartId] = useState("");
  const [appointmentcartId, setAppointmentCartId] = useState("");
  const [timebookedid, setTimeBookedId] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const firstVisitRef = useRef(null);
  const procedureRef = useRef(null);
  const aestheticianRef = useRef(null);
  const dateTimeRef = useRef(null);
  const personalInfoRef = useRef(null);
  const confirmationRef = useRef(null);
  const [staffVariantMap, setStaffVariantMap] = useState({});
  const [selectedStaffVariantId, setSelectedStaffVariantId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedTimeId, setSelectedTimeId] = useState("");
  const [clientSecret, setClientSecret] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  

  const createPaymentIntent = async () => {
    try {
      const whitelistedEmails = [
        'shafiqkassam@vibrantlifespa.com', 
        'shadmanzafar@gmail.com'
      ];

      const servicesTotal = whitelistedEmails.includes(email) 
      ? 200 // $2.00 for whitelisted emails 
      : 2900; // $29.00 for regular price

      const response = await fetch('https://api.vibrantlifespa.com:8001/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: 'usd',
          servicesTotal: servicesTotal,
          tip: 0
        }),
      });
      
      const data = await response.json();
      if (data && data.client_secret) {
        setClientSecret(data.client_secret);
        return data.client_secret;
      } else {
        console.error('Failed to retrieve client_secret');
        return null;
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return null;
    }
  };  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setShowPayment(true);
    await createPaymentIntent();
  };

  const handlePaymentSuccess = async () => {
    setIsConfirmed(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5FD4D0'],
    });
  };

  useEffect(() => {
    if (isFirstVisit !== null) {
      scrollToRef(isFirstVisit ? personalInfoRef : procedureRef);
      if (isFirstVisit === false) {
        setIsSignInOpen(true);
      }
    }
  }, [isFirstVisit]);

  useEffect(() => {
    if (clientId) {
      setIsSignedIn(true);
      setIsSignInOpen(false); 
    }
  }, [clientId]);
  useEffect(() => {
    if (isFirstVisit !== null) {
      scrollToRef(isFirstVisit ? personalInfoRef : procedureRef);
    }
  }, [isFirstVisit]);

  useEffect(() => {
    if (selectedProcedure && !isFirstVisit) {
      scrollToRef(aestheticianRef);
    }
  }, [selectedProcedure, isFirstVisit]);

  useEffect(() => {
    if (selectedAesthetician && !isFirstVisit) {
      scrollToRef(dateTimeRef);
    }
  }, [selectedAesthetician, isFirstVisit]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      scrollToRef(personalInfoRef);
    }
  }, [selectedDate, selectedTime]);


  // creating appointment cart for first time
  useEffect(() => {
    const fetchAppointmentData = async (retryCount = 5) => {
      setLoading(true); 
      let extractedClientId;
      if (!isFirstVisit) {
        extractedClientId = clientId.split(":").pop();
      }

      try {
        const response = await fetch(
          "https://api.vibrantlifespa.com:8001/createAppoinmentCart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              locationId:
                "urn:blvd:Location:90184c75-0c8b-48d8-8a8a-39c9a22e6099",
              clientId: isFirstVisit
                ? "00f42824-4154-4e07-8240-e694d2c2a7c7"
                : extractedClientId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();

        const { availableCategories, id: newCartId } =
          data.data?.data?.createCart?.cart || {};
        setCartId(newCartId); // Store the cart ID

        if (Array.isArray(availableCategories)) {
          const filteredCategories = availableCategories.filter(
            (category) =>
              ![
                "Add-On",
                "Investor's family & Staffs Pricing",
                "Memberships",
                "Gift Cards",
              ].includes(category.name),
          );

          const procedures = filteredCategories.map(
            (category) => category.name,
          );

          const procedureMap = {};
          const staffMap = {};

          filteredCategories.forEach((category) => {
            if (category.availableItems && category.availableItems.length > 0) {
              const item = category.availableItems[0];
              procedureMap[category.name] = {
                itemId: item.id,
                name: item.name,
              };

              if (item.staffVariants) {
                item.staffVariants.forEach((variant) => {
                  staffMap[variant.staff.displayName] = variant.id;
                });
              }
            }
          });

          const aestheticians = Object.keys(staffMap);

          setProcedures(procedures);
          setAestheticians(aestheticians);
          setProcedureItemMap(procedureMap);
          setStaffVariantMap(staffMap);
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
        if (retryCount > 0) {
          setTimeout(() => fetchAppointmentData(retryCount - 1), 2000);
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (isFirstVisit === true || (isFirstVisit === false && clientId)) {
      fetchAppointmentData();
    }
  }, [isFirstVisit, isSignedIn]);

  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.innerHTML = `
       (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:5212846,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;

    // Add script to document
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!appointmentcartId) return;
      setIsLoadingDates(true); // Set loading to true when fetching data

      const today = new Date();
      const twoWeeksLater = new Date();
      twoWeeksLater.setDate(today.getDate() + 56);

      const requestBody = {
        cartId: appointmentcartId,
        searchRangeLower: formatDateToString(today),
        searchRangeUpper: formatDateToString(twoWeeksLater),
      };


      try {
        const response = await fetch(
          "https://api.vibrantlifespa.com:8001/appointmentAvailableDatesSlots",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          },
        );

        const result = await response.json();
        if (result.status && result.data?.data?.cartBookableDates) {
          const dates = result.data.data.cartBookableDates.map(
            (slot) => slot.date,
          );
          setAvailableDates(dates);
          console.log("Available dates 1:", dates);
        }
      } catch (error) {
        console.error("Error fetching available dates:", error);
      } finally {
        setIsLoadingDates(false); // Set loading to false when data is fetched
      }
    };

    fetchAvailableDates();
  }, [selectedProcedure, appointmentcartId]);

  const formatDateToString = (date) => {
    return date.toISOString().split("T")[0];
  };


  // When rendering dates:
  const handleDateClick = async (selectedDate) => {
    if (!selectedDate || !cartId) return;

    // Format the date to 'YYYY-MM-DD'
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

    setSelectedDate(selectedDate);

    setSelectedTime(""); // Reset selected time when date changes
    setIsLoadingTimeSlots(true);

    try {
      const response = await fetch(
        "https://api.vibrantlifespa.com:8001/appointmentAvailableTimeSlots",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartId: appointmentcartId,
            date: formattedDate, // Use the formatted date here
          }),
        },
      );

      const result = await response.json();

      if (result.status && result.data?.data?.cartBookableTimes) {
        const timeSlots = result.data.data.cartBookableTimes.map((slot) => {
          const startTime = new Date(slot.startTime); // This converts the time with the timezone offset
          return {
            id: slot.id,
            time: startTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Local time zone of user
            }),
          };
        });
        setAvailableTimeSlots(timeSlots);
      }
    } catch (error) {
      console.error("Error fetching available time slots:", error);
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setIsLoading(true);
    // Split the full name
    const nameParts = firstName.trim().split(" ");

    let updatedFirstName, updatedLastName;

    if (nameParts.length === 1) {
      // If only one word is entered, assign it to both first and last name
      updatedFirstName = nameParts[0] || "";
      updatedLastName = nameParts[0] || ""; // Use the same for last name
    } else {
      // Otherwise, split normally
      updatedFirstName = nameParts[0] || "";
      updatedLastName = nameParts.slice(1).join(" ") || "";
    }

    // Update the state with the new names
    setFirstName(updatedFirstName);
    setLastName(updatedLastName);

    // Format phone number to digits only and ensure it is in the correct format (+ country code)
    let formattedPhoneNumber = mobile.replace(/[^\d]/g, ""); // Removes anything that's not a number

    // Check if the phone number has the correct length for your country (adjust based on region)
    if (formattedPhoneNumber.length === 10) {
      // Assuming a local number format
      formattedPhoneNumber = `+1${formattedPhoneNumber}`; // Adding country code for US
    }

    // Check if all personal information fields are filled
    if (!updatedFirstName || !updatedLastName || !email || !mobile) {
      alert("Please fill out all personal information fields.");
      return;
    }

    // Prepare the request body for client creation
    const requestBody = {
      email,
      dob: "1990-01-01",
      externalId: email,
      firstName: updatedFirstName,
      lastName: updatedLastName,
      mobilePhone: formattedPhoneNumber, // Use the correctly formatted phone number
      pronoun: "Mr/Mrs",
    };

    try {
      if (isFirstVisit) {
        //client info
        console.log("Step 1");
        const createClientNoteResponse = await fetch('https://api.vibrantlifespa.com:8001/addClientNoteToAppoinmentCart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartId: appointmentcartId,
            note: `Type:Digital - Name: ${updatedFirstName} ${updatedLastName} - Email: ${email} - Phone: ${formattedPhoneNumber}`
          }),
        });
        console.log(createClientNoteResponse);
        if (!createClientNoteResponse.ok) {
          throw new Error('Failed to create client');
        }
        const clientNoteData = await createClientNoteResponse.json();
        console.log("Client created: ", clientNoteData);
        
        // For first-time users, create a new client
        console.log("Step 2");
        let newClientIdValue;
        try {
          const createClientResponse = await fetch(
            "https://api.vibrantlifespa.com:8001/createClient",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            },
          );
          const clientcreateresponseData = await createClientResponse.json();
          newClientIdValue = clientcreateresponseData.data.data.createClient.client.id;
          console.log("New client ID:", newClientIdValue);
        } catch (error) {
          
        }

        // crearing second cart to store user information instead of admin

        if (newClientIdValue) {
          newClientIdValue = newClientIdValue.split(":").pop();
          console.log("New client ID:", newClientIdValue);
          try {
            console.log("creating new appointment cart")
            const createAppointmentCartResponse = await fetch(
              "https://api.vibrantlifespa.com:8001/createAppoinmentCart",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  locationId:"urn:blvd:Location:90184c75-0c8b-48d8-8a8a-39c9a22e6099",
                  clientId: newClientIdValue
                }),
              }
            );
        
            if (!createAppointmentCartResponse.ok) {
              throw new Error(`Failed to create appointment cart: ${createAppointmentCartResponse.statusText}`);
            }
        
            const appointmentCartData = await createAppointmentCartResponse.json();
            const newCartId = appointmentCartData.data?.data?.createCart?.cart?.id;
            console.log("New appointment cart ID:", newCartId);
            if (newCartId) {
              const addItemResponse = await fetch(
                "https://api.vibrantlifespa.com:8001/addItemtoAppoinmentCart",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    cartId: newCartId,
                    itemId: selectedItemId,
                    itemStaffVariantId: selectedStaffVariantId,
                  }),
                }
              );

              if (!addItemResponse.ok) {
                throw new Error("Failed to add item to appointment cart");
              }
    
              const addItemData = await addItemResponse.json();
              console.log("Item added to cart: ", addItemData);
              const newAppointmentCartId = addItemData.data?.data?.addCartSelectedBookableItem?.cart?.id;
              console.log(newAppointmentCartId);  

              if (newAppointmentCartId) {
                try {
                  // Add the selected time to the cart
                  console.log("Adding selected time to cart");
                  console.log("Selected time id:", selectedTimeId);
                  const addSelectedTimeResponse = await fetch(
                    "https://api.vibrantlifespa.com:8001/addSelectedTimeToCart",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        cartId: newAppointmentCartId,
                        bookableTimeId: selectedTimeId,
                      }),
                    }
                  );
              
                  if (!addSelectedTimeResponse.ok) {
                    throw new Error("Failed to add selected time to cart");
                  }
              
                  const addSelectedTimeData = await addSelectedTimeResponse.json();
                  console.log("Selected time added to cart:", addSelectedTimeData);
                  const newtimebookedid = addSelectedTimeData.data.data.reserveCartBookableItems.cart.id;
              
                  // Proceed to checkout
                  console.log("Proceeding to checkout");
                  const checkoutAppoinmentCart = await fetch(
                    "https://api.vibrantlifespa.com:8001/checkoutAppoinmentCart",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        cartId: newtimebookedid,
                      }),
                    }
                  );
              
                  if (!checkoutAppoinmentCart.ok) {
                    throw new Error("Failed to checkout appointment cart");
                  }
              
                  const checkoutData = await checkoutAppoinmentCart.json();
                  console.log("Checkoutappointment cart:", checkoutData);
                } catch (error) {
                  console.error("Error processing appointment cart:", error);
                }
              }
             
            }
            

            
            // You might want to store the new cart ID or do additional processing here
          } catch (error) {
            console.error("Error creating appointment cart:", error);
          }
        }
        else {
          // Step 3: Add client information to the appointment cart
          console.log("Step 3 - No new client ID");
          const clientInfoRequestBody = {
            cartId: appointmentcartId,
            clientInformation: {
              email: email,
              firstName: updatedFirstName,
              lastName: updatedLastName,
              phoneNumber: formattedPhoneNumber,
            },
          };
        
          try {
            const clientInfoResponse = await fetch(
              "https://api.vibrantlifespa.com:8001/addClientInfoToAppoinmentCart",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(clientInfoRequestBody),
              }
            );
        
            if (!clientInfoResponse.ok) {
              throw new Error("Failed to add client info to appointment cart");
            }
        
            const clientInfoData = await clientInfoResponse.json();
            console.log("Client info added to cart:", clientInfoData);
        
            // Checkout the appointment cart
            const checkoutResponse = await fetch(
              "https://api.vibrantlifespa.com:8001/checkoutAppoinmentCart",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  cartId: timebookedid,
                }),
              }
            );
        
            if (!checkoutResponse.ok) {
              throw new Error("Failed to checkout appointment cart");
            }
        
            const checkoutData = await checkoutResponse.json();
            console.log("Checkout completed:", checkoutData);
          } catch (error) {
            console.error("Error in Step 3:", error);
            alert("There was an error processing your appointment. Please try again.");
          }
        }
      } else {
        // For existing users, just checkout the appointment cart
        const checkoutResponse = await fetch(
          "https://api.vibrantlifespa.com:8001/checkoutAppoinmentCart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cartId: timebookedid,
            }),
          },
        );

        if (!checkoutResponse.ok) {
          throw new Error(
            "Failed to checkout appointment cart for existing user",
          );
        }

        const checkoutData = await checkoutResponse.json();
      }

      // Add client info to the appointment cart after creating/checking out the cart
      const clientInfoRequestBody = {
        cartId: appointmentcartId,
        clientInformation: {
          email: email,
          firstName: updatedFirstName,
          lastName: updatedLastName,
          phoneNumber: formattedPhoneNumber,
        },
      };

      const clientInfoResponse = await fetch(
        "https://api.vibrantlifespa.com:8001/addClientInfoToAppoinmentCart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientInfoRequestBody),
        },
      );

      if (!clientInfoResponse.ok) {
        throw new Error("Failed to add client info to appointment cart");
      }

      const clientInfoData = await clientInfoResponse.json();

      // If everything is successful, show confirmation and trigger confetti
      setIsConfirmed(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#5FD4D0"],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "There was an error processing your appointment. Please try again.",
      );
    }
  };



 
  const handleTimeSelection = async (time, timeId) => {
    setSelectedTime(time);
    setSelectedTimeId(timeId);

    try {
      const response = await fetch(
        "https://api.vibrantlifespa.com:8001/addSelectedTimeToCart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartId: appointmentcartId,
            bookableTimeId: timeId,
          }),
        },
      );

      const data = await response.json();

      console.log(
        "time added id: ",
        data.data.data.reserveCartBookableItems.cart.id,
      );
      setTimeBookedId(data.data.data.reserveCartBookableItems.cart.id);

      if (!response.ok) {
        throw new Error("Failed to add selected time to cart");
      }
    } catch (error) {
      console.error("Error adding selected time to cart:", error);
      // Optionally reset the selection if the API call fails
      setSelectedTime("");
      setSelectedTimeId("");
    }
  };



  const handleProcedureChange = (e) => {
    const selectedProcedure = e.target.value;
    setSelectedProcedure(selectedProcedure);

    // Get the itemId for the selected procedure
    const itemInfo = procedureItemMap[selectedProcedure];
    if (itemInfo) {
      setSelectedItemId(itemInfo.itemId);
    } else {
      setSelectedItemId("");
    }
  };

  const handleAestheticianChange = async (e) => {
    const selectedStaff = e.target.value;
    setSelectedAesthetician(selectedStaff);

    setAvailableTimeSlots([]);
    setSelectedDate(null);

    // Get the staff variant ID
    const variantId = staffVariantMap[selectedStaff];
    setSelectedStaffVariantId(variantId);

    try {
      let extractedClientId;
      if (!isFirstVisit) {
        extractedClientId = clientId.split(":").pop();
      }
      console.log("Creating appointment cart for second time");
      const response = await fetch(
        "https://api.vibrantlifespa.com:8001/createAppoinmentCart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationId:
              "urn:blvd:Location:90184c75-0c8b-48d8-8a8a-39c9a22e6099",
            clientId: isFirstVisit
              ? "00f42824-4154-4e07-8240-e694d2c2a7c7"
              : extractedClientId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      const { availableCategories, id: newCartId } =
        data.data?.data?.createCart?.cart || {};
      setCartId(newCartId); // Store the cart ID
    } catch (error) {
      console.error(error);
    }

    if (variantId && selectedItemId && cartId) {
      try {
        const response = await fetch(
          "https://api.vibrantlifespa.com:8001/addItemtoAppoinmentCart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cartId: cartId,
              itemId: selectedItemId,
              itemStaffVariantId: variantId,
            }),
          },
        );

        const data = await response.json();
        if (
          data.data?.errors &&
          data.data.errors.length > 0 &&
          data.data.errors[0]?.message
        ) {
          setStaffError(
            "This Aesthetician is not available for the selected procedure. Kindly choose another Aesthetician.",
          );
        } else {
          setStaffError("");
          setAppointmentCartId(
            data.data?.data?.addCartSelectedBookableItem?.cart.id,
          );
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }
  };

  if (isConfirmed) {
    return (
      <div className="font-[GeistSans,'GeistSans Fallback'] max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
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
  }

  return (  
    <>
        {isSignInOpen && (
        <div className="font-[GeistSans,'GeistSans Fallback'] fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
          <div className="rounded-lg w-full max-w-md transform transition-all duration-700 scale-0 opacity-0 ease-out"
               style={{
                 transition: "transform 0.7s ease-out, opacity 0.7s ease-out",
                 transform: isSignInOpen ? "scale(1)" : "scale(0)",
                 opacity: isSignInOpen ? "1" : "0",
               }}>
            <SignIn 
              setClientId={setClientId}
              onClose={() => setIsSignInOpen(false)}
            />
          </div>
        </div>
      )}
       <div className="font-[GeistSans,'GeistSans Fallback'] min-h-screen w-full flex items-center justify-center bg-gray-50 py-10 px-4">
       <div className="w-[350px] mx-auto p-[1.5rem] bg-white rounded-lg shadow-lg space-y-8">
       <div className="flex justify-center ">
          <img src={logo} alt="Logo" className="h-[8rem] w-auto" />
        </div>
           <h1 className="text-2xl font-bold mb-6 text-center">
            Let's get you scheduled
          </h1>
          <div className="fixed bottom-1 right-2 text-[8px] text-gray-400">
            v1.1.2
          </div>
          {isConfirmed ? (
            <ConfirmationView
              firstName={firstName}
              mobile={mobile}
              selectedProcedure={selectedProcedure}
              selectedAesthetician={selectedAesthetician}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              isFirstVisit={isFirstVisit}
            />
          ) : (
            <>
              {!isSignedIn && (
                <FirstVisitPrompt 
                  onFirstVisitChange={(isFirst) => {
                    setIsFirstVisit(isFirst);
                    setIsSignedIn(false);
                    setClientId(null);
                    if (!isFirst) setIsSignInOpen(true);
                  }}
                />
              )}
              
              {/* Procedure */}

              {(isFirstVisit === true || (isFirstVisit === false && clientId)) && (
                <ProcedureSelect
                  procedures={procedures}
                  selectedProcedure={selectedProcedure}
                  onProcedureChange={handleProcedureChange}
                  loading={loading}
                />
              )}

              {/* Aesthetician*/}

              {selectedProcedure && (
                <AestheticianSelect
                  aestheticians={aestheticians}
                  selectedAesthetician={selectedAesthetician}
                  onAestheticianChange={handleAestheticianChange}
                  staffError={staffError}
                />
              )}

          {/* DateTimePicker  */}
          {selectedProcedure && selectedAesthetician && (
            <DateSelect
              availableDates={availableDates}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              handleDateClick={handleDateClick}
              isLoadingDates={isLoadingDates}
              selectedDate={selectedDate}
              isLoadingTimeSlots={isLoadingTimeSlots}
              availableTimeSlots={availableTimeSlots}
              handleTimeSelection={handleTimeSelection}
              selectedTime={selectedTime}
              formatDateToString={formatDateToString}
            />
            )}
              {/* Payment components goes here */}
              {selectedDate &&
  selectedTime &&
  (isFirstVisit === true || selectedProcedure) && (
    <div ref={personalInfoRef}>
      {showPayment && clientSecret ? (
        <PaymentComponent
          onClose={() => setShowPayment(false)}
          firstName={firstName}
          email={email}
          mobile={mobile}
          handleSubmit={handleSubmit}
          clientSecret={clientSecret}
        />
      ) : (
        <PersonalInformationForm
          firstName={firstName}
          setFirstName={setFirstName}
          email={email}
          setEmail={setEmail}
          mobile={mobile}
          setMobile={setMobile}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  )}

            </>
          )}
        </div>
      </div>
    </>
  );
}