import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const FormInput = ({ 
    id, 
    name,
    label, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    placeholder,
    disabled = false 
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${isPasswordField ? 'pr-10' : ''}`}
                    placeholder={placeholder}
                />
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                    text-gray-600 hover:text-gray-800 focus:outline-none transition"
                        disabled={disabled}
                        aria-label={showPassword ? "Show password" : "Hide password"}
                        >
                        {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                            <EyeIcon className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">✕</span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;
