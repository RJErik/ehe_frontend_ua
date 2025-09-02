import Header from "../feature/Header.jsx";
import ForgotPasswordForm from "@/feature/forgotPassword/ForgotPasswordForm.jsx";

const ForgotPassword = ({ params }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center p-4">
                <ForgotPasswordForm
                    initialEmail={params?.initialEmail || ""}
                />
            </main>
        </div>
    );
};

export default ForgotPassword;
