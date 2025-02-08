import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parseISO } from 'date-fns';
import { styled } from '@mui/material/styles';

interface DueDateCellProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const StyledDatePicker = styled(DatePicker)({
  '& .MuiInputBase-root': {
    fontSize: '14px',
    padding: '0px',
    '& .MuiInputBase-input': {
      padding: '4px 8px',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid rgba(0, 0, 0, 0.23)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #0073ea',
  },
});

export const DueDateCell: React.FC<DueDateCellProps> = ({ value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledDatePicker
        value={value ? parseISO(value) : null}
        onChange={(date: Date | null) => onChange(date ? date.toISOString() : null)}
        slotProps={{
          textField: {
            placeholder: 'Set date',
            size: 'small',
            fullWidth: true,
          },
          popper: {
            placement: 'bottom-start'
          }
        }}
      />
    </LocalizationProvider>
  );
};
