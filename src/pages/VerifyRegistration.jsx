// src/pages/VerifyRegistration.jsx - Updated with React Router
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "../feature/Alert.jsx";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const VerifyRegistration = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [verificationState, setVerificationState] = useState({
        loading: true,
        success: false,
        message: "",
        showResendButton: false,
        showEmailForm: false,
        email: "",
        resendLoading: false,
        resendSuccess: false
    });

    useEffect(() => {
        // Get token from URL search parameters
        const token = searchParams.get("token");

        if (!token) {
            setVerificationState({
                loading: false,
                success: false,
                message: "No verification token provided. Please check your email link.",
                showResendButton: false
            });
            return;
        }

        // Call verification endpoint
        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/verify_registration?token=${token}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                setVerificationState({
                    loading: false,
                    success: data.success,
                    message: data.message,
                    // Use the showResendButton flag directly from backend
                    showResendButton: data.showResendButton === true,
                    showEmailForm: false
                });
            } catch (error) {
                console.error("Verification error:", error);
                setVerificationState({
                    loading: false,
                    success: false,
                    message: "Failed to verify email. Please try again later.",
                    showResendButton: false
                });
            }
        };

        verifyToken();
    }, [searchParams]);

    const handleResendVerification = () => {
        // Show email form when resend button is clicked
        setVerificationState(prev => ({
            ...prev,
            showEmailForm: true
            // Keep showResendButton true in case they want to cancel and try again
        }));
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');

        setVerificationState(prev => ({
            ...prev,
            email,
            resendLoading: true
        }));

        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            setVerificationState(prev => ({
                ...prev,
                resendLoading: false,
                resendSuccess: data.success,
                message: data.message,
                showEmailForm: false, // Hide form after submission
                showResendButton: data.showResendButton === true // Update based on response
            }));
        } catch (error) {
            console.error("Resend verification error:", error);
            setVerificationState(prev => ({
                ...prev,
                resendLoading: false,
                resendSuccess: false,
                message: "Failed to resend verification email. Please try again.",
                showEmailForm: true // Keep form open on error
            }));
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <h1 className="text-3xl font-bold text-center mb-6">Email Verification</h1>

                    {verificationState.loading ? (
                        <div className="flex flex-col justify-center items-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mb-4"></div>
                            <span>Verifying your email...</span>
                        </div>
                    ) : verificationState.success ? (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
                            <AlertTitle className="text-green-800 dark:text-green-400">
                                Verification Successful
                            </AlertTitle>
                            <AlertDescription className="text-green-700 dark:text-green-300">
                                {verificationState.message}
                                <div className="mt-4">
                                    <Button
                                        onClick={() => navigate('/login')}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Log In Now
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    ) : verificationState.resendSuccess ? (
                        // Show success message for resend email
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
                            <AlertTitle className="text-green-800 dark:text-green-400">
                                Email Sent
                            </AlertTitle>
                            <AlertDescription className="text-green-700 dark:text-green-300">
                                {verificationState.message}
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
                            <AlertTitle>Verification Failed</AlertTitle>
                            <AlertDescription>
                                {verificationState.message}

                                {/* Show resend button if backend indicates we should */}
                                {verificationState.showResendButton && !verificationState.showEmailForm && (
                                    <div className="mt-4">
                                        <Button
                                            onClick={handleResendVerification}
                                            className="border-red-300 bg-transparent text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                                        >
                                            Resend Verification Email
                                        </Button>
                                    </div>
                                )}

                                {/* Show email form only after resend button is clicked */}
                                {verificationState.showEmailForm && (
                                    <form onSubmit={handleEmailSubmit} className="mt-4 p-4 border border-red-300 rounded-md dark:border-red-800 transition-all duration-300 ease-in-out">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-red-700 dark:text-red-300">
                                                Enter your email to resend verification
                                            </Label>
                                            <Input
                                                type="email"
                                                name="email"
                                                id="email"
                                                required
                                                className="border-red-300 bg-transparent dark:border-red-800"
                                                placeholder="your@email.com"
                                                disabled={verificationState.resendLoading}
                                            />
                                        </div>
                                        <div className="flex space-x-2 mt-3">
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                className="bg-red-600 hover:bg-red-700"
                                                disabled={verificationState.resendLoading}
                                            >
                                                {verificationState.resendLoading ? (
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
                                                onClick={() => setVerificationState(prev => ({...prev, showEmailForm: false}))}
                                                disabled={verificationState.resendLoading}
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

export default VerifyRegistration;