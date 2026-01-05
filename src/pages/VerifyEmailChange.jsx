import { useState, useEffect } from "react";
import { useNavigate, useSearchParams  } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "../feature/Alert.jsx";
import { Button } from "../components/ui/button";

const VerifyEmailChange = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [verificationState, setVerificationState] = useState({
        loading: true,
        success: false,
        message: ""
    });

    useEffect(() => {
        if (!token) {
            setVerificationState({
                loading: false,
                success: false,
                message: "No verification token provided. Please check your email link."
            });
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/email-verifications/${token}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                setVerificationState({
                    loading: false,
                    success: data.success,
                    message: data.message
                });
            } catch (error) {
                console.error("Email change verification error:", error);
                setVerificationState({
                    loading: false,
                    success: false,
                    message: "Failed to verify email change. Please try again later."
                });
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <h1 className="text-3xl font-bold text-center mb-6">Email Change Verification</h1>

                    {verificationState.loading ? (
                        <div className="flex flex-col justify-center items-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mb-4"></div>
                            <span>Verifying your email change...</span>
                        </div>
                    ) : verificationState.success ? (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
                            <AlertTitle className="text-green-800 dark:text-green-400">
                                Email Change Successful
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
                    ) : (
                        <Alert variant="destructive">
                            <AlertTitle>Verification Failed</AlertTitle>
                            <AlertDescription>
                                {verificationState.message}
                                <div className="mt-4">
                                    <Button
                                        onClick={() => navigate('/login')}
                                        className="bg-primary hover:bg-primary/90 text-white mr-2"
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/')}
                                        className="ml-2"
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

export default VerifyEmailChange;