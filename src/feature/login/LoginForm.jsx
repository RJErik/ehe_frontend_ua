import { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Alert, AlertTitle, AlertDescription } from "../Alert.jsx";
import { useNavigate } from "react-router-dom";

// Email validation function using regex
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleResendVerification = async () => {
        if (!registeredEmail || resendLoading) return;

        setResendLoading(true);
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: registeredEmail }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess({
                    message: data.message,
                    showResendButton: data.showResendButton !== false,
                    actionLink: data.actionLink || null
                });
                setError(null);
            } else {
                setError({
                    message: data.message || "Failed to resend verification email.",
                    showResendButton: data.showResendButton !== false,
                    actionLink: data.actionLink || null
                });
                setSuccess(null);
            }
        } catch (err) {
            console.error("Failed to resend verification:", err);
            setError({
                message: "Failed to resend verification email. Please try again later.",
                showResendButton: true
            });
        } finally {
            setResendLoading(false);
        }
    };

    const handleButtonClick = (e) => {
        // Check for empty fields first
        if (!formData.email && !formData.password) {
            e.preventDefault(); // Prevent form submission
            setError({ message: "Please enter both email and password", showResendButton: false });
            return;
        }

        if (!formData.email) {
            e.preventDefault(); // Prevent form submission
            setError({ message: "Please enter your email address", showResendButton: false });
            return;
        }

        if (!formData.password) {
            e.preventDefault(); // Prevent form submission
            setError({ message: "Please enter your password", showResendButton: false });
            return;
        }

        // Validate email format when button is clicked
        if (!validateEmail(formData.email)) {
            e.preventDefault(); // Prevent form submission
            setError({ message: "Please enter a valid email address", showResendButton: false });
            return;
        }

        // If validation passes, form will submit normally
        // and handleSubmit will be called
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Save the email for potential resend operations
        const submittedEmail = formData.email;

        try {
            console.log("Making fetch request to /api/auth/login");
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            console.log("Response received:", response);
            const data = await response.json();
            console.log("Response data:", data);

            if (data.success) {
                window.location.href = data.redirectUrl;
            } else {
                // For errors where resend might be needed
                if (data.showResendButton) {
                    setRegisteredEmail(submittedEmail);
                }

                // Set error message with any action link
                setError({
                    message: data.message || "Login failed. Please check your credentials.",
                    showResendButton: data.showResendButton === true,
                    actionLink: data.actionLink || null
                });
            }
        } catch (err) {
            console.error("Login error:", err);
            setError({
                message: "An error occurred. Please try again later.",
                showResendButton: false
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/home");
    };

    // Rest of the component remains unchanged
    return (
        <div className="max-w-xs w-full mx-auto mt-8 flex flex-col items-center">
            {/* Component JSX remains the same */}
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

            <h1 className="text-4xl font-semibold mb-8">Log In</h1>

            <div className="w-full">
                {error && (
                    <Alert variant="destructive" className="mb-6 w-full overflow-hidden">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription className="break-words overflow-wrap-anywhere">
                            <span className="inline">
                                {typeof error === 'string' ? error : error.message}
                                {error.actionLink && (
                                    <Button
                                        variant="link"
                                        className="p-0 px-1.5 h-auto text-red-300 hover:text-red-400 font-medium inline"
                                        onClick={() => navigate("/" + error.actionLink.target)}
                                    >
                                        {error.actionLink.text}
                                    </Button>
                                )}
                            </span>

                            {/* Resend verification button */}
                            {typeof error !== 'string' && error.showResendButton && registeredEmail && (
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResendVerification}
                                        disabled={resendLoading}
                                        className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                                    >
                                        {resendLoading ? "Sending..." : "Resend Verification Email"}
                                    </Button>
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800 w-full overflow-hidden">
                        <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-300 break-words overflow-wrap-anywhere">
                            <span className="inline">
                                {success.message}
                                {success.actionLink && (
                                    <Button
                                        variant="link"
                                        className="p-0 px-1.5 h-auto text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium inline"
                                        onClick={() => navigate("/" + success.actionLink.target)}
                                    >
                                        {success.actionLink.text}
                                    </Button>
                                )}
                            </span>

                            {/* Resend verification button */}
                            {success.showResendButton && registeredEmail && (
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResendVerification}
                                        disabled={resendLoading}
                                        className="border-green-500 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900"
                                    >
                                        {resendLoading ? "Sending..." : "Resend Verification Email"}
                                    </Button>
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        name="email"
                        type="text"
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

                    {/* Add forgot password link */}
                    <div className="flex justify-end mt-1">
                        <Button
                            variant="link"
                            className="p-0 text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => navigate("/forgot-password", { initialEmail: formData.email })}
                            type="button"
                        >
                            Forgot password?
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="min-w-20"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        onClick={handleButtonClick}
                        className="min-w-20 whitespace-nowrap"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 w-full">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Logging in...</span>
                            </div>
                        ) : "Log In"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
