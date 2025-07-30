import React from 'react';

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-[#95aac0] mb-1">
        {label}
      </label>
      <select
        {...props}
        className="w-full bg-[#212934] border border-[#5c6f7e] text-gray-200 rounded-md p-2 focus:ring-[#e2a32d] focus:border-[#e2a32d] transition"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;