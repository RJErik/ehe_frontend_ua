import { useState } from "react";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Alert, AlertTitle, AlertDescription } from "../Alert.jsx";
import { useNavigate } from "react-router-dom";

// Password validation (min 8 characters, at least 1 letter and 1 number)y
const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
};

const ResetPasswordForm = ({ token }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors when typing
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleButtonClick = (e) => {
        // Validate before submitting
        if (!formData.password && !formData.confirmPassword) {
            e.preventDefault();
            setError({ message: "Please enter and confirm your new password", showResendButton: false });
            return;
        }

        if (!formData.password) {
            e.preventDefault();
            setError({ message: "Please enter your new password", showResendButton: false });
            return;
        }

        if (!formData.confirmPassword) {
            e.preventDefault();
            setError({ message: "Please confirm your new password", showResendButton: false });
            return;
        }

        if (!validatePassword(formData.password)) {
            e.preventDefault();
            setError({ message: "Password must be at least 8 characters with at least one letter and one number", showResendButton: false });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            e.preventDefault();
            setError({ message: "Passwords don't match", showResendButton: false });
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess({
                    message: data.message,
                    showLoginButton: true
                });
                // Clear form on success
                setFormData({
                    password: "",
                    confirmPassword: ""
                });
            } else {
                setError({
                    message: data.message || "Password reset failed. Please try again.",
                    showResendButton: data.showResendButton === true
                });
            }
        } catch (err) {
            console.error("Password reset error:", err);
            setError({
                message: "An error occurred. Please try again later.",
                showResendButton: false
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-sm w-full mx-auto mt-8 flex flex-col">
            <div className="w-full">
                {error && (
                    <Alert variant="destructive" className="mb-6 w-full overflow-hidden">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription className="break-words overflow-wrap-anywhere">
                            {typeof error === 'string' ? error : error.message}
                        </AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800 w-full overflow-hidden">
                        <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-300 break-words overflow-wrap-anywhere">
                            {success.message}
                            {success.showLoginButton && (
                                <div className="mt-4">
                                    <Button
                                        onClick={() => navigate('/login')}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Log In Now
                                    </Button>
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading || success}
                    />
                    <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters with at least one letter and one number.
                    </p>
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
                        disabled={isLoading || success}
                    />
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={isLoading || success}
                        onClick={handleButtonClick}
                        className="w-full"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 w-full">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Updating Password...</span>
                            </div>
                        ) : "Reset Password"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
