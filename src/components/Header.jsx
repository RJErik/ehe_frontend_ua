import { Button } from "./ui/button";
import {ModeToggle} from "@/components/mode-toggle.jsx";

const Header = ({ navigate, currentPage }) => {
    return (
        <header className="bg-gray-700 text-white p-4 flex items-center justify-between">
            <div
                className="bg-gray-300 text-gray-700 p-3 rounded cursor-pointer"
                onClick={() => navigate && navigate("home")}
            >
                Logo
            </div>

            <nav className="flex space-x-6">
                <Button
                    variant="ghost"
                    className={`text-white ${currentPage === 'login' ? 'bg-gray-600' : ''}`}
                    onClick={() => navigate && navigate("login")}
                >
                    Login
                </Button>
                <Button
                    variant="ghost"
                    className={`text-white ${currentPage === 'register' ? 'bg-gray-600' : ''}`}
                    onClick={() => navigate && navigate("register")}
                >
                    Register
                </Button>
                <ModeToggle />
            </nav>
        </header>
    );
};

export default Header;
