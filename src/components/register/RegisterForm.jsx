import { useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar.jsx";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";
import { Label } from "../ui/label.jsx";
import { Alert, AlertTitle, AlertDescription } from "../Alert.jsx";

// Email validation using regex
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

// Username validation (alphanumeric and underscore only, minimum 3 characters)
const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]{3,}$/;
    return regex.test(username);
};

// Password validation (min 8 characters, at least 1 letter and 1 number)
const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
};

const RegisterForm = ({ navigate }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [resendLoading, setResendLoading] = useState(false);

    const handleCancel = () => {
        if (navigate) {
            navigate("home");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleResendVerification = async (email) => {
        if (!email || resendLoading) return;

        setResendLoading(true);
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess({
                    message: data.message,
                    details: data.details || "Check your email for the verification link.",
                    email
                });
                setError(null);
            } else if (response.status === 429) {
                // Rate limit hit
                setError({
                    message: data.message,
                    details: data.details
                });
                setSuccess(null);
            } else {
                // Other error
                setError({
                    message: data.message,
                    details: data.details
                });
                setSuccess(null);
            }
        } catch (err) {
            console.error("Failed to resend verification:", err);
            setError({
                message: "Failed to resend verification email.",
                details: "Please try again later."
            });
            setSuccess(null);
        } finally {
            setResendLoading(false);
        }
    };

    const handleButtonClick = (e) => {
        // Check for empty fields first
        if (!formData.name && !formData.email && !formData.confirmPassword && !formData.password) {
            e.preventDefault(); // Prevent form submission
            setError("Please fill in all fields");
            return;
        }

        if (!formData.name) {
            e.preventDefault(); // Prevent form submission
            setError("Please enter a username");
            return;
        }

        if (!formData.email) {
            e.preventDefault(); // Prevent form submission
            setError("Please enter your email address");
            return;
        }

        if (!formData.password) {
            e.preventDefault(); // Prevent form submission
            setError("Please enter a password");
            return;
        }

        if (!formData.confirmPassword) {
            e.preventDefault(); // Prevent form submission
            setError("Please confirm your password");
            return;
        }

        // Validate username format
        if (!validateUsername(formData.name)) {
            e.preventDefault(); // Prevent form submission
            setError("Username must be at least 3 characters and contain only letters, numbers, and underscores");
            return;
        }

        // Validate email
        if (!validateEmail(formData.email)) {
            e.preventDefault(); // Prevent form submission
            setError("Please enter a valid email address");
            return;
        }

        // Validate password
        if (!validatePassword(formData.password)) {
            e.preventDefault(); // Prevent form submission
            setError("Password must be at least 8 characters with at least one letter and one number");
            return;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            e.preventDefault(); // Prevent form submission
            setError("Passwords do not match");
            return;
        }

        // If validation passes, form will submit normally
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log("Making fetch request to /api/auth/register");
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
                credentials: 'include'
            });

            console.log("Response received:", response);
            const data = await response.json();
            console.log("Response data:", data);

            if (data.success) {
                // Instead of navigating, show success message with the registration success info
                setSuccess({
                    message: data.message,
                    details: "Please check your email for the verification link.",
                    email: formData.email
                });

                // Clear the form on successful registration
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
            } else {
                setError(data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 flex flex-col items-center">
            <Avatar className="h-16 w-16 mb-4">
                <AvatarFallback>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </AvatarFallback>
            </Avatar>

            <h1 className="text-4xl font-semibold mb-8">Register</h1>

            {error && (
                <Alert variant="destructive" className="mb-6 w-full">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        <p>{typeof error === 'string' ? error : error.message}</p>
                        {typeof error !== 'string' && error.details && (
                            <p className="mt-2 text-sm opacity-90">{error.details}</p>
                        )}
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-6 w-full border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
                    <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                        <p>{success.message}</p>
                        {success.details && (
                            <p className="mt-2 text-sm">{success.details}</p>
                        )}
                        {success.email && (
                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleResendVerification(success.email)}
                                    disabled={resendLoading}
                                    className="border-green-500 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900"
                                >
                                    {resendLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : "Resend Verification Email"}
                                </Button>
                            </div>
                        )}
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Username</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Your Username"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        onClick={handleButtonClick}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </span>
                        ) : "Register"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
