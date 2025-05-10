import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import lawyerImage from "./assets/lawyer.png";
import "./LawyerLogin.css";

const LawyerLogin = () => {
  const [lawyerId, setLawyerId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();   

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch(`http://localhost:5000/lawyers/${lawyerId}`, {
        method: "GET",
        headers: { "x-api-key": "mysecureapikey123" }, 
      });

      if (!response.ok) {
        throw new Error("Lawyer not found");
      }

      const lawyerData = await response.json();
      console.log("✅ Lawyer Found:", lawyerData);

      // Redirect to the result page with lawyer data
      navigate("/Lawyercases", { state: { lawyer: lawyerData } });

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="lawyer-login-container">
      <h2 className="login-title">LAWYER LOGIN</h2>
      <div className="login-box">
        <img src={lawyerImage} alt="Lawyer" className="login-img" />
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Lawyer ID"
            value={lawyerId}
            onChange={(e) => setLawyerId(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LawyerLogin;
