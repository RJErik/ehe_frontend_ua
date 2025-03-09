import Header from "../components/Header";
import LoginForm from "../components/login/LoginForm.jsx";
import {Button} from "@/components/ui/button.jsx";

const Login = ({ navigate }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header navigate={navigate} currentPage="login" />
            <main className="flex-1 flex items-center justify-center p-4">
                <LoginForm navigate={navigate} />
            </main>
        </div>
    );
};

export default Login;
