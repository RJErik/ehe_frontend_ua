import { useState } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
    const [currentPage, setCurrentPage] = useState("home");

    const navigate = (page) => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case "home": return <Home navigate={navigate} />;
            case "register": return <Register navigate={navigate} />;
            case "login": return <Login navigate={navigate} />;
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
