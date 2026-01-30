import { useState } from 'react';
import FormInput from '../../../shared/components/FormInput';
import PasswordStrengthIndicator from '../../../shared/components/PasswordStrengthIndicator';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../../../stores/authStore';
import ErrorMessage from "../../../shared/components/Error/ErrorMessage"
import LoadingButton from '../../../shared/components/LoadingButton';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        } else if (formData.first_name.length < 2) {
            newErrors.first_name = 'First name must be at least 2 characters';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        } else if (formData.last_name.length < 2) {
            newErrors.last_name = 'Last name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try{
        const response = await authService.register(formData);
        useAuthStore.getState().login(response);
        } catch (error){
            setLoading(false);
            return;
        }
        
        setSuccessMessage('Registration successful! Redirecting to HomePage...');
        // Reset form
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
        setLoading(false);
        setTimeout(() => navigate('/'), 2000);
    };

    return (
        <div className="grid grid-cols-2 h-screen overflow-hidden">
            {/* Left Side - Welcome Section */}
            <div className="bg-linear-to-br from-green-500 to-green-600 flex flex-col justify-center items-center text-white p-8">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-4">Join Us</h1>
                    <p className="text-xl opacity-90 mb-8">Create your account to get started</p>
                    <div className="space-y-4 text-left">
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">✓</span>
                            <span>Fast and easy registration</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">✓</span>
                            <span>Secure and private</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">✓</span>
                            <span>Access to exclusive features</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="flex flex-col items-center justify-start p-8 bg-gray-50 overflow-y-auto h-screen">
                <div className="w-full max-w-md py-8 ">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create Account</h2>

                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* First Name */}
                        <FormInput
                            id="first_name"
                            label="First Name"
                            type="text"
                            value={formData.first_name}
                            onChange={handleChange}
                            error={errors.first_name}
                            placeholder="John"
                            name="first_name"
                        />

                        {/* Last Name */}
                        <FormInput
                            id="last_name"
                            label="Last Name"
                            type="text"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={errors.last_name}
                            placeholder="Doe"
                            name="last_name"
                        />

                        {/* Email */}
                        <FormInput
                            id="email"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="john@example.com"
                            name="email"
                        />

                        {/* Password */}
                        <div>
                            <FormInput
                                id="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="Create a strong password"
                                name="password"
                            />
                            <PasswordStrengthIndicator password={formData.password} />
                            <p className="text-xs text-gray-500 mt-2">
                                Password must contain uppercase, lowercase, numbers, and be at least 8 characters.
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <FormInput
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            placeholder="Confirm your password"
                            name="confirmPassword"
                        />

                        {/* Terms & Conditions */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 mr-3 cursor-pointer"
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700">
                                I agree to the{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Terms of Service
                                </a>
                                {' '}and{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <LoadingButton loading={loading} className={"w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6"
                        }>
                            Create Account
                        </LoadingButton>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-600 mt-6">
                        Already have an account?{' '}
                        <a onClick={()=>{navigate("/login")}} className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
            <ErrorMessage />
        </div>
    );
};

export default RegisterPage;
