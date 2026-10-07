const PasswordStrengthIndicator = ({ password }) => {
    const calculateStrength = () => {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        
        return Math.min(strength, 4);
    };

    const strength = calculateStrength();
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-600'];

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                <span className={`text-xs font-bold ${strengthColors[strength].replace('bg-', 'text-')}`}>
                    {strengthLabels[strength]}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all ${strengthColors[strength]}`}
                    style={{ width: `${((strength + 1) / 5) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
