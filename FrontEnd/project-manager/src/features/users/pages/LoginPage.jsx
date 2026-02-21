import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../shared/components/FormInput';
import { useAuthStore } from '../../../stores/authStore';
import { authService } from '../services/authService';
import LoadingButton from '../../../shared/components/LoadingButton';
import ErrorMessage from "../../../shared/components/Error/ErrorMessage"

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        return newErrors;
    };

    const goToRegister = () => {
        navigate("/register");
    }

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
        const newErrors = validateForm();
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try{
            var response = await authService.login(formData);
            useAuthStore.getState().login(response);
            navigate('/');
            setLoading(false);
        } catch {
            setLoading(false);
            return;
        }
    };

    return (
        <div className="grid grid-cols-2 gap-0 h-screen overflow-hidden">
            {/* Left Side - Welcome Section */}
            <div className="bg-linear-to-br from-blue-500 to-blue-600 flex flex-col justify-center items-center text-white p-8">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
                    <p className="text-xl opacity-90">Login to your account to continue</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 overflow-y-auto h-screen">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Login</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <FormInput
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="Enter your email"
                        />

                        {/* Password Input */}
                        <FormInput
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Enter your password"
                        />

                        {/* Remember Me & Forgot Password */}
                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2 cursor-pointer" />
                                <span className="text-gray-700">Remember me</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:text-blue-700">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <LoadingButton loading={loading} className={"w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
                        }>
                            Login
                        </LoadingButton>
                        
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600 mt-6">
                        Don't have an account?{' '}
                        <a onClick={goToRegister} className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
            <ErrorMessage />
        </div>
    );
};

export default LoginPage;
