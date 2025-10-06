// src/components/Header.jsx - Auth header with React Router
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import { ModeToggle } from "@/feature/Mode-toggle.jsx";
import { Menubar } from "../components/ui/menubar.jsx";
import Logo from "../assets/Logo.png";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Menubar className="py-7 px-7 flex items-center justify-between">
            <Button
                variant="outline"
                size="icon"
                className="cursor-pointer h-10 w-10"
                onClick={() => navigate("/")}
            >
                <img src={Logo} className="rotating-image" alt="Logo"/>
            </Button>

            <nav className="flex space-x-6">
                <Button
                    variant="outline"
                    className={`px-4 py-2 ${location.pathname === '/' ? 'bg-muted' : ''}`}
                    onClick={() => navigate("/")}
                >
                    Home
                </Button>
                <Button
                    variant="outline"
                    className={`px-4 py-2 ${location.pathname === '/login' ? 'bg-muted' : ''}`}
                    onClick={() => navigate("/login")}
                >
                    Login
                </Button>
                <Button
                    variant="outline"
                    className={`px-4 py-2 ${location.pathname === '/register' ? 'bg-muted' : ''}`}
                    onClick={() => navigate("/register")}
                >
                    Register
                </Button>
                <ModeToggle />
            </nav>
        </Menubar>
    );
};

export default Header;