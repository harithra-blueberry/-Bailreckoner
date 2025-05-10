import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JCaseDetails.css";

const CaseDetails = () => {
  const { caseId } = useParams(); // this is actually case_number
  const [caseDetails, setCaseDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/cases/${caseId}`, {
          method: "GET",
          headers: { "x-api-key": "mysecureapikey123" },
        });

        if (!response.ok) {
          throw new Error("Case not found");
        }

        const caseData = await response.json();
        setCaseDetails(caseData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId]);

  const handleCheckRisk = async () => {
    if (!caseDetails || !caseDetails.bail_assessment) {
      setError("No bail assessment factors available.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5002/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_number: caseDetails.case_number }), // ✅ send case_number
      });

      const predictionData = await response.json();

      if (!response.ok) {
        throw new Error(predictionData.error || "Prediction failed.");
      }

      // Redirect to JudgeResult page with prediction
      navigate(`/Judgeresult/${caseDetails.case_number}`, { state: { predictionData } });
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="prisoner-details-container">
      <div className="details-box">
        <h2 className="details-title">Case Details</h2>

        <div className="details-table">
          <div><strong>Case Number:</strong></div>
          <div>{caseDetails.case_number}</div>

          <div><strong>Client Name:</strong></div>
          <div>{caseDetails.client_name}</div>

          <div><strong>Crime:</strong></div>
          <div>{caseDetails.crime}</div>

          <div><strong>Lawyer ID:</strong></div>
          <div>{caseDetails.lawyer_id}</div>

          <div><strong>Hearing Dates:</strong></div>
          <div>{caseDetails.hearing_dates?.join(", ") || "N/A"}</div>

          <div><strong>Status:</strong></div>
          <div>{caseDetails.status}</div>

          <div><strong>Details:</strong></div>
          <div>{caseDetails.details}</div>

          
        </div>

        <button className="check-button" onClick={handleCheckRisk}>
          Check Bail Risk
        </button>
      </div>
    </div>
  );
};

export default CaseDetails;
