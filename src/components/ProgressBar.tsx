import React from 'react';

interface ProgressBarProps {
  value: number;
  onChange: (value: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempValue, setTempValue] = React.useState(value.toString());

  const handleSubmit = () => {
    const newValue = Math.min(100, Math.max(0, parseInt(tempValue) || 0));
    onChange(newValue);
    setIsEditing(false);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#34d399';
    if (progress >= 40) return '#60a5fa';
    return '#f59e0b';
  };

  return (
    <div className="relative w-full group">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="100"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-16 px-2 py-1 text-sm border rounded"
            autoFocus
          />
          <span className="text-sm text-gray-500">%</span>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 ease-in-out"
              style={{
                width: `${value}%`,
                backgroundColor: getProgressColor(value)
              }}
            />
          </div>
          <span className="text-sm text-gray-600 min-w-[32px]">{value}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
