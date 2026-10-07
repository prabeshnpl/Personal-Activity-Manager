import { Search } from "lucide-react"; // optional icon
import {useState} from 'react';

const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  className = "max-w-md",
}) => {

  const [barValue, setBarValue] = useState(value || '');
  const handleChange = (nextValue) => {
    setBarValue(nextValue);
    onChange?.(nextValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(barValue);
    }
  };

  return (
    <div
      className={`flex items-center border border-gray-300 rounded-4xl px-3 py-2 bg-white ${className}`}
    >
      <Search className=" w-8 text-black mr-2" />
      <input
        type="text"
        value={barValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full focus:outline-none focus:ring-0 text-sm"
      />
    </div>
  );
};

export default SearchBar;
