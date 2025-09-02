// src/pages/ResetPassword.jsx - Updated with React Router
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ResetPasswordForm from "@/feature/resetPassword/ResetPasswordForm.jsx";
import { Alert, AlertTitle, AlertDescription } from "../feature/Alert.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [tokenState, setTokenState] = useState({
        loading: true,
        isValid: false,
        message: "",
        showResendButton: false,
        token: null
    });
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    useEffect(() => {
        // Get token from URL search parameters
        const token = searchParams.get("token");

        if (!token) {
            setTokenState({
                loading: false,
                isValid: false,
                message: "No reset token provided. Please check your email link.",
                showResendButton: false,
                token: null
            });
            return;
        }

        // Validate token with backend
        const validateToken = async () => {
            try {
                const response = await fetch(`/api/auth/reset-password/validate?token=${token}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                setTokenState({
                    loading: false,
                    isValid: data.success,
                    message: data.message,
                    showResendButton: data.showResendButton === true,
                    token: token
                });
            } catch (error) {
                console.error("Token validation error:", error);
                setTokenState({
                    loading: false,
                    isValid: false,
                    message: "Failed to validate reset token. Please try again later.",
                    showResendButton: false,
                    token: token
                });
            }
        };

        validateToken();
    }, [searchParams]);

    const handleResendRequest = () => {
        // Show email form when resend button is clicked
        setShowEmailForm(true);
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const emailValue = formData.get('email');

        setEmail(emailValue);
        setResendLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailValue })
            });

            const data = await response.json();

            setResendLoading(false);
            setResendSuccess(data.success);

            if (data.success) {
                setTokenState(prev => ({
                    ...prev,
                    message: data.message,
                    showResendButton: data.showResendButton === true
                }));
                setShowEmailForm(false);
            } else {
                // Keep email form open on error
                setTokenState(prev => ({
                    ...prev,
                    message: data.message,
                    showResendButton: data.showResendButton === true
                }));
            }
        } catch (error) {
            console.error("Resend reset email error:", error);
            setResendLoading(false);
            setResendSuccess(false);
            setTokenState(prev => ({
                ...prev,
                message: "Failed to send reset email. Please try again.",
                showResendButton: true
            }));
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <h1 className="text-3xl font-bold text-center mb-6">Reset Your Password</h1>

                    {tokenState.loading ? (
                        <div className="flex flex-col justify-center items-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mb-4"></div>
                            <span>Validating your reset link...</span>
                        </div>
                    ) : tokenState.isValid ? (
                        <ResetPasswordForm
                            token={tokenState.token}
                        />
                    ) : resendSuccess ? (
                        // Show success message for resend email
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
                            <AlertTitle className="text-green-800 dark:text-green-400">
                                Email Sent
                            </AlertTitle>
                            <AlertDescription className="text-green-700 dark:text-green-300">
                                {tokenState.message}
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/')}
                                        className="border-green-500 hover:bg-green-50 text-green-700"
                                    >
                                        Return to Home
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="destructive">
                            <AlertTitle>Reset Link Invalid</AlertTitle>
                            <AlertDescription>
                                {tokenState.message}

                                {/* Show resend button if backend indicates we should */}
                                {tokenState.showResendButton && !showEmailForm && (
                                    <div className="mt-4">
                                        <Button
                                            onClick={handleResendRequest}
                                            variant="outline"
                                            className="border-red-300 bg-transparent text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                                        >
                                            Request New Reset Link
                                        </Button>
                                    </div>
                                )}

                                {/* Show email form only after resend button is clicked */}
                                {showEmailForm && (
                                    <form onSubmit={handleEmailSubmit} className="mt-4 p-4 border border-red-300 rounded-md dark:border-red-800 transition-all duration-300 ease-in-out">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-red-700 dark:text-red-300">
                                                Enter your email to receive a new reset link
                                            </Label>
                                            <Input
                                                type="email"
                                                name="email"
                                                id="email"
                                                required
                                                className="border-red-300 bg-transparent dark:border-red-800"
                                                placeholder="your@email.com"
                                                disabled={resendLoading}
                                            />
                                        </div>
                                        <div className="flex space-x-2 mt-3">
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                className="bg-red-600 hover:bg-red-700"
                                                disabled={resendLoading}
                                            >
                                                {resendLoading ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                                        <span>Sending...</span>
                                                    </div>
                                                ) : (
                                                    "Send"
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowEmailForm(false)}
                                                disabled={resendLoading}
                                                className="border-red-300 text-red-700"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/')}
                                    >
                                        Return to Home
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;