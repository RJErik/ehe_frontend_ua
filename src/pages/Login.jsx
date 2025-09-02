import LoginForm from "@/feature/login/LoginForm.jsx";

const Login = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center p-4">
                <LoginForm />
            </main>
        </div>
    );
};

export default Login;
