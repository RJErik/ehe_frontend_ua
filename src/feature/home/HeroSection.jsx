import { Button } from "../../components/ui/button.jsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.jsx";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] py-12">
            <h1 className="text-4xl font-semibold mb-2">Event Horizon Exchange</h1>
            <p className="text-xl mb-12">A powerful stocktrading platform</p>

            <div className="flex flex-col items-center mb-8">
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
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="flex space-x-4">
                <Button
                    variant="outline"
                    className="min-w-[120px]"
                    onClick={() => navigate("/login")}
                >
                    Log In
                </Button>
                <Button
                    className="min-w-[120px]"
                    onClick={() => navigate("/register")}
                >
                    Register
                </Button>
            </div>
        </div>
    );
};

export default HeroSection;
