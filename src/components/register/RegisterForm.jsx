// RegisterForm.jsx
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

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const data = await response.json();
            console.log("Response data:", data);

            if (data.success) {
                navigate("stockMarket");
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
                <AvatarFallback className="bg-gray-200">
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

            <h1 className="text-4xl font-semibold text-gray-600 mb-8">Register</h1>

            {error && (
                <Alert variant="destructive" className="mb-6 w-full">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
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
                        className="bg-gray-500 hover:bg-gray-600"
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
