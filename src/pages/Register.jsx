import RegisterForm from "@/feature/register/RegisterForm.jsx";

const Register = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-start justify-center p-4">
                <RegisterForm />
            </main>
        </div>
    );
};

export default Register;
