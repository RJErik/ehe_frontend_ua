import { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Alert, AlertTitle, AlertDescription } from "../Alert.jsx";
import { useNavigate } from "react-router-dom";

// Email validation using regex
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

const ForgotPasswordForm = ({ initialEmail = "" }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(initialEmail);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState(initialEmail || null);

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleResendRequest = async () => {
        if (!submittedEmail || resendLoading) return;

        setResendLoading(true);
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: submittedEmail }),
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
                    message: data.message || "Failed to request password reset.",
                    showResendButton: data.showResendButton !== false,
                    actionLink: data.actionLink || null
                });
                setSuccess(null);
            }
        } catch (err) {
            console.error("Failed to request password reset:", err);
            setError({
                message: "Failed to request password reset. Please try again later.",
                showResendButton: true
            });
        } finally {
            setResendLoading(false);
        }
    };

    const handleButtonClick = (e) => {
        // Validate before submitting
        if (!email || email.trim() === '') {
            e.preventDefault();
            setError({ message: "Please enter your email address", showResendButton: false });
            return;
        }

        if (!validateEmail(email)) {
            e.preventDefault();
            setError({ message: "Please enter a valid email address", showResendButton: false });
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Store the email for potential resend operations
        const emailToSubmit = email.trim();
        setSubmittedEmail(emailToSubmit);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailToSubmit }),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                setSuccess({
                    message: data.message,
                    showResendButton: data.showResendButton === true,
                    actionLink: data.actionLink || null
                });

                // Clear form on success
                setEmail("");
            } else {
                setError({
                    message: data.message || "Request failed. Please try again.",
                    showResendButton: data.showResendButton === true,
                    actionLink: data.actionLink || null
                });
            }
        } catch (err) {
            console.error("Password reset request error:", err);
            setError({
                message: "An error occurred. Please try again later.",
                showResendButton: false
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/login");
    };

    return (
        <div className="max-w-xs w-full mx-auto mt-8 flex flex-col items-center">
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
                        <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10a2 2 0 012-2h3.9L9 6a5 5 0 015 0l1.1 2z"></path>
                        <rect width="10" height="1" x="7" y="15" rx=".5"></rect>
                    </svg>
                </AvatarFallback>
            </Avatar>

            <h1 className="text-4xl font-semibold mb-4">Reset Password</h1>
            <p className="text-center text-muted-foreground mb-8">
                Enter your email address and we'll send you a link to reset your password.
            </p>

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

                            {/* Resend reset email button */}
                            {typeof error !== 'string' && error.showResendButton && submittedEmail && (
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResendRequest}
                                        disabled={resendLoading}
                                        className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                                    >
                                        {resendLoading ? "Sending..." : "Resend Reset Email"}
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

                            {/* Resend reset email button */}
                            {success.showResendButton && submittedEmail && (
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResendRequest}
                                        disabled={resendLoading}
                                        className="border-green-500 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900"
                                    >
                                        {resendLoading ? "Sending..." : "Resend Reset Email"}
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
                        type="email"
                        placeholder="your@email.com"
                        value={email}
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
                                <span>Sending...</span>
                            </div>
                        ) : "Reset Password"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
