import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

interface DueDateCellProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const DueDateCell: React.FC<DueDateCellProps> = ({ value, onChange }) => {
  return (
    <div className="date-picker-wrapper">
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date: Date | null) => onChange(date ? date.toISOString() : null)}
        dateFormat="MM/dd/yyyy"
        className="w-full text-[#323338] cursor-pointer focus:outline-none"
        calendarClassName="date-picker-calendar"
        popperPlacement="bottom-start"
        shouldCloseOnSelect={true}
        placeholderText="Select date"
      />
    </div>
  );
};
