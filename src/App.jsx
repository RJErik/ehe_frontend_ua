import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyRegistration from "./pages/VerifyRegistration.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [pageParams, setPageParams] = useState({});

    useEffect(() => {
        // Check URL for token on initial load
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const path = window.location.pathname;

        if (token) {
            if (path.includes('/verify-registration')) {
                navigate('verify', { token });
            } else if (path.includes('/reset-password')) {
                navigate('reset-password', { token });
            } else {
                // Default to verification if no specific path
                navigate('verify', { token });
            }
        }
    }, []);

    const navigate = (page, params = {}) => {
        setCurrentPage(page);
        setPageParams(params);
    };

    const renderPage = () => {
        switch (currentPage) {
            case "home": return <Home navigate={navigate} />;
            case "register": return <Register navigate={navigate} />;
            case "login": return <Login navigate={navigate} />;
            case "verify": return <VerifyRegistration navigate={navigate} params={pageParams} />;
            case "forgot-password": return <ForgotPassword navigate={navigate} params={pageParams} />;
            case "reset-password": return <ResetPassword navigate={navigate} params={pageParams} />;
            default: return <Home navigate={navigate} />;
        }
    };

    return (
        <>
            {renderPage()}
        </>
    );
}

export default App;
