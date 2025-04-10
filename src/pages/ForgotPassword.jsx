import Header from "../components/Header";
import ForgotPasswordForm from "../components/forgotPassword/ForgotPasswordForm.jsx";

const ForgotPassword = ({ navigate, params }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header navigate={navigate} />
            <main className="flex-1 flex items-center justify-center p-4">
                <ForgotPasswordForm
                    navigate={navigate}
                    initialEmail={params?.initialEmail || ""}
                />
            </main>
        </div>
    );
};

export default ForgotPassword;
