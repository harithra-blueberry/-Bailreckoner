import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import judgeImage from "./assets/judge.png";  // Replace with the appropriate image
import "./LawyerLogin.css";

const JudgeLogin = () => {
  const [judgeId, setJudgeId] = useState("");  // State to store Judge ID
  const [error, setError] = useState("");  // State to store error messages
  const navigate = useNavigate();  // Hook to navigate between pages

  const handleLogin = async (e) => {
    e.preventDefault();  // Prevent page reload on form submit
    setError("");  // Clear previous error messages

    try {
      const response = await fetch(`http://localhost:5000/judge/${judgeId}`, {
        method: "GET",
        headers: { "x-api-key": "mysecureapikey123" },  // Secure API key for validation
      });

      if (!response.ok) {
        throw new Error("Judge not found");
      }

      const judgeData = await response.json();  // Get judge data from the response
      console.log("✅ Judge Found:", judgeData);

      // Redirect to the Judge's dashboard page with judge data
      navigate("/JudgeCases", { state: { judge: judgeData } });

    } catch (error) {
      setError(error.message);  // Set error message if the judge is not found
    }
  };

  return (
    <div className="judge-login-container">
      <h2 className="login-title">JUDGE LOGIN</h2>
      <div className="login-box">
        <img src={judgeImage} alt="Judge" className="login-img" />
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Judge ID"
            value={judgeId}
            onChange={(e) => setJudgeId(e.target.value)}  // Update Judge ID in state
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}  {/* Show error if login fails */}
      </div>
    </div>
  );
};

export default JudgeLogin;
