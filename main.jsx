import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import TramaQuiz from "./trama-quiz.jsx";

const BACKEND_URL = "https://trama-backend-production.up.railway.app";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      setFormSubmitted(true);
    }
  };

  const handleQuizSubmit = async (quizData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          ...quizData
        })
      });
      const result = await response.json();
      if (result.resultId) {
        window.resultId = result.resultId;
        window.quizData = quizData;
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Errore invio:", error);
      alert("Errore nel salvataggio");
    }
  };

  const downloadPDF = async () => {
    if (!window.resultId) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/download-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId: window.resultId,
          name,
          email,
          ...window.quizData
        })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trama-${window.resultId}.pdf`;
      a.click();
    } catch (error) {
      console.error("Errore PDF:", error);
    }
  };

  if (!formSubmitted) {
    return (
      <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
        <h1>TRAMA Quiz</h1>
        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label>Nome:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            />
          </div>
          <button type="submit" style={{ padding: "10px 20px" }}>
            Inizia Quiz
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <TramaQuiz 
        userName={name} 
        userEmail={email}
        onSubmit={handleQuizSubmit}
        showPdfButton={submitted}
        onDownloadPdf={downloadPDF}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
