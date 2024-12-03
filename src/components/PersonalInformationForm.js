import React from "react";

const PersonalInformationForm = ({
  firstName,
  setFirstName,
  email,
  setEmail,
  mobile,
  setMobile,
  onSubmit,
  isLoading,
}) => {
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleMobileChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatPhoneNumber(inputValue);
    setMobile(formattedValue);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

      <div className="space-y-2">
        <label htmlFor="firstName" className="text-sm font-medium block">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter your first name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium block">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter your email address"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="mobile" className="text-sm font-medium block">
          Mobile Number
        </label>
        <input
          id="mobile"
          type="tel"
          value={mobile}
          onChange={handleMobileChange}
          required
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter your mobile number"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full h-10 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#5FD4D0] hover:bg-[#5FD4D0]/90"
        }`}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default PersonalInformationForm;
