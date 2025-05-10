import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./PrisonerDetails.css";

const PrisonerDetails = () => {
  const location = useLocation();
  const prisoner = location.state?.prisoner;
  const [bailResult, setBailResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!prisoner) {
    return <h2 className="error-message">No prisoner details found.</h2>;
  }

  const checkBailEligibility = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          case_description: prisoner.case_description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bail eligibility");
      }

      const data = await response.json();
      const formattedResult =
        data.bailability === "bailable" ? "Eligible for Bail" : "Not Eligible for Bail";
      setBailResult(formattedResult);
    } catch (error) {
      console.error("Error checking bail eligibility:", error);
      setError("Failed to fetch bail eligibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prisoner-details-container">
      <h2 className="details-title">PRISONER DETAILS</h2>
      <div className="details-box">
        <p><strong>ID:</strong> {prisoner.prisoner_id}</p>
        <p><strong>Name:</strong> {prisoner.name}</p>
        <p><strong>Age:</strong> {prisoner.age}</p>
        <p><strong>Gender:</strong> {prisoner.gender}</p>
        <p><strong>Crime:</strong> {prisoner.crime}</p>
        <p><strong>Case Number:</strong> {prisoner.case_number}</p>
        <p><strong>Prison:</strong> {prisoner.prison}</p>
        <p><strong>Cell:</strong> {prisoner.cell}</p>
        <p><strong>Case Description:</strong> {prisoner.case_description}</p>
        <button className="check-button" onClick={checkBailEligibility} disabled={loading}>
          {loading ? "Checking..." : "Check Bail Eligibility"}
        </button>

        {error && <p className="error-message">{error}</p>}  

        {bailResult && (
          <div className="bail-result">
            <h3>Eligibility Result</h3>
            <p className={`result ${bailResult === "Eligible for Bail" ? "bailable" : "nonbailable"}`}>
              {bailResult}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrisonerDetails;
