import { Button } from "./ui/button";
import { ModeToggle } from "@/components/mode-toggle.jsx";
import { Menubar } from "./ui/menubar";

const Header = ({ navigate, currentPage }) => {
    return (
        <Menubar className="py-7 px-7 flex items-center justify-between">
            <Button
                variant="outline"
                size="icon"
                className="cursor-pointer h-10 w-10"
                onClick={() => navigate && navigate("home")}
            >
                Logo
            </Button>

            <nav className="flex space-x-6">
                <Button
                    variant="outline"
                    className={`px-4 py-2 ${currentPage === 'home' ? 'bg-muted' : ''}`}
                    onClick={() => navigate && navigate("home")}
                >
                    Home
                </Button>
                <Button
                    variant="outline"
                    className={`px-4 py-2 ${currentPage === 'login' ? 'bg-muted' : ''}`}
                    onClick={() => navigate && navigate("login")}
                >
                    Login
                </Button>
                <Button
                    variant="outline"
                    className={`px-4 py-2 ${currentPage === 'register' ? 'bg-muted' : ''}`}
                    onClick={() => navigate && navigate("register")}
                >
                    Register
                </Button>
                <ModeToggle />
            </nav>
        </Menubar>
    );
};

export default Header;
