import React from 'react'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from 'react';

const DateSelection = ({
  availableDates,
  currentMonth,
  setCurrentMonth,
  formatDateToString,
  handleDateClick,
  isLoadingDates,
  selectedDate,
  isLoadingTimeSlots,
  availableTimeSlots,
  handleTimeSelection,
  selectedTime,
}) => {
  

  const getDaysInMonth = (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const days = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let date = 1; date <= lastDay.getDate(); date++) {
      const dayDate = new Date(year, monthIndex, date);
      days.push({
        date: dayDate,
        dateString: formatDateToString(dayDate),
      });
    }

    return days;
  };


  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Select Date</h2>

      {!availableDates || isLoadingDates ? (
        <div className="flex justify-center items-center mb-4">
          <div
            className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
            style={{
              borderColor: "#5FD4D0",
              borderTopColor: "#5FD4D0",
            }}
          ></div>
        </div>
      ) : (
        <>
          {/* Month navigation */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1
                  )
                )
              }
              className="rounded hover:bg-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="font-[GeistSans,'GeistSans Fallback'] text-sm font-medium">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                  )
                )
              }
              className="rounded hover:bg-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Days of the week header */}
          <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-center text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-3 text-center">
            {getDaysInMonth(currentMonth).map((dayInfo, idx) => (
              <div key={idx}>
                {dayInfo ? (
                  <button
                    className={`flex items-center justify-center rounded-md 
                      ${
                        availableDates.includes(dayInfo.dateString)
                          ? "font-bold"
                          : ""
                      } 
                      ${
                        selectedDate &&
                        dayInfo.date.toDateString() ===
                          selectedDate.toDateString()
                          ? "bg-[#5FD4D0] text-white"
                          : "hover:bg-red-500 hover:text-red-500"
                      } 
                      ${
                        !availableDates.includes(dayInfo.dateString)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    onClick={() =>
                      dayInfo &&
                      availableDates.includes(dayInfo.dateString) &&
                      handleDateClick(dayInfo.date)
                    }
                  >
                    <span className="border p-[2.5px] border-[#d9d9d9] rounded-md text-[13px] hover:bg-[#d9d9d9] hover:text-[black] min-w-7">
                      {dayInfo.date.getDate()}
                    </span>
                  </button>
                ) : (
                  <span className="text-[red]">&nbsp;</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="text-lg font-semibold mt-4 mb-2">Select Time</h2>
      <div className="space-y-4">
        {isLoadingTimeSlots ? (
          <div className="text-center py-4">Loading available times...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {availableTimeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleTimeSelection(slot.time, slot.id)}
                className={`w-full p-2 text-sm rounded-lg transition-colors duration-200
                  ${
                    selectedTime === slot.time
                      ? "bg-[#5FD4D0] text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}

        {!isLoadingTimeSlots &&
          availableTimeSlots.length === 0 &&
          selectedDate && (
            <p className="text-center text-gray-500">
              No available time slots for this date. Kindly select another date
            </p>
          )}
      </div>
    </div>
  );
};

export default DateSelection;
