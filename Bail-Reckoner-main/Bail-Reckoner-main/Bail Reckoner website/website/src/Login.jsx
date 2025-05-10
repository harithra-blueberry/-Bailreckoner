import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation
import "./Login.css";
import logo from "./assets/logo.png";
import prisoner from "./assets/prisoner.png";
import lawyer from "./assets/lawyer.png";
import judge from "./assets/judge.png";
import police from "./assets/police.png";

const Login = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate(); // ✅ Initialize navigate function

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > window.innerHeight / 2);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="login-container">
            <div className={`splash-screen ${isScrolled ? "hide" : ""}`}>
                <img src={logo} alt="Bail Reckoner Logo" className="splash-logo" />
            </div>
            <div className={`login-content ${isScrolled ? "show" : ""}`}>
                <h1 className="login-title">LOGIN</h1>
                <div className="login-options">
                    <button className="login-button" onClick={() => navigate("/PrisonerLogin")}>
                        <img src={prisoner} alt="Prisoner" className="login-icon" />
                        <span className="login-text">PRISONER</span>
                    </button>
                    <button className="login-button" onClick={() => navigate("/LawyerLogin")}>
                        <img src={lawyer} alt="Lawyer" className="login-icon" />
                        <span className="login-text">LAWYER</span>
                    </button>
                    <button className="login-button" onClick={() => navigate("/JudgeLogin")}>
                        <img src={judge} alt="Judge" className="login-icon" />
                        <span className="login-text">JUDGE</span>
                    </button>
                    <button className="login-button" onClick={() => navigate("/PoliceLogin")}>
                        <img src={police} alt="Police" className="login-icon" />
                        <span className="login-text">POLICE</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
