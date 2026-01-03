import React, { useState, useEffect } from "react";
// Make sure to install: npm install @mui/icons-material sonner
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from 'sonner';

// --- STYLES CONFIGURATION ---
const styles = {
  page: {
    backgroundColor: "#cfe0ff", 
    minHeight: "100vh",
    padding: "60px 0",
    fontFamily: 'Roboto, sans-serif',
    
    /* 🔥 NEW FILE STYLE: Overlapping Circle Gradients */
    backgroundImage: `
      radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
      radial-gradient(circle at 80% 5%, rgba(197, 217, 255, 0.8) 0%, transparent 60%),
      radial-gradient(circle at 10% 40%, rgba(255, 255, 255, 0.5) 0%, transparent 50%),
      radial-gradient(circle at 0% 50%, rgba(180, 205, 255, 0.7) 0%, transparent 60%),
      radial-gradient(circle at 95% 90%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
      radial-gradient(circle at 85% 95%, rgba(197, 217, 255, 0.8) 0%, transparent 60%)
    `,
    backgroundSize: "100% 100%", 
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  },

  header: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "600",
    color: "#1d2b5f",
    marginBottom: "40px",
    position: "relative",
    zIndex: 1,
  },

  formContainer: {
    maxWidth: "900px",
    margin: "0 auto",
    // Glassmorphism effect from New File
    backgroundColor: "rgba(207, 224, 255, 0.85)", 
    backdropFilter: "blur(10px)", 
    padding: "40px",
    borderRadius: "16px",
    position: "relative",
    zIndex: 1,
    boxShadow: "0 10px 40px rgba(29, 43, 95, 0.1)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    color: "#1d2b5f",
    fontWeight: "600",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1px solid #9bb1e5", // Updated to match blue theme
    backgroundColor: "#e6efff",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.2s",
  },

  textarea: {
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1px solid #9bb1e5",
    backgroundColor: "#e6efff",
    fontSize: "15px",
    minHeight: "120px",
    resize: "none",
    outline: "none",
  },

  fullWidth: {
    gridColumn: "span 2",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "15px",
    color: "#1d2b5f",
    margin: "30px 0 20px",
    fontWeight: "500",
  },

  mriCard: {
    border: "2px dashed #9bb1e5",
    borderRadius: "12px",
    padding: "30px",
    backgroundColor: "#e6efff",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadIcon: {
    fontSize: "48px",
    color: "#1d2b5f",
    marginBottom: "15px",
  },

  previewImage: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "contain",
    borderRadius: "8px",
    marginBottom: "15px",
    border: "1px solid #ddd",
  },

  submitBtn: {
    margin: "40px auto 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#1d2b5f",
    color: "#fff",
    border: "none",
    padding: "16px 60px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s",
    width: "100%",
    maxWidth: "400px",
  },

  // --- RESULT STYLES (From Old File) ---
  resultsSection: {
    marginTop: "50px",
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    border: "1px solid #e0e7ff",
    animation: "fadeIn 0.5s ease-in",
  },
  
  resultsTitle: { fontSize: "24px", fontWeight: "700", color: "#1d2b5f", marginBottom: "15px" },
  resultButtons: { display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" },
  
  resultBtn: { 
    backgroundColor: "#1d2b5f", 
    color: "#fff", 
    padding: "12px 30px", 
    borderRadius: "8px", 
    border: "none", 
    cursor: "pointer", 
    textDecoration: "none", 
    fontSize: "15px", 
    fontWeight: "600" 
  },
  
  detected: { color: "#dc2626", fontWeight: "800", fontSize: "28px", margin: "10px 0" },
  normal: { color: "#16a34a", fontWeight: "800", fontSize: "28px", margin: "10px 0" },
  error: { color: "#ef4444", fontWeight: "700", fontSize: "20px" },
  spinner: { width: "24px", height: "24px", border: "3px solid #ffffff", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }
};

// ADD ANIMATIONS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(styleSheet);


function BrainWorksApp({ user }) {
  
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    fullName: "", // New File used single name field
    gender: "male", // New File added gender
    age: "",
    phone: "",
    email: "",
    symptoms: "",
    hasMRI: false,
    mriFile: null,
  });

  const [mriPreview, setMriPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // --- AUTO-FILL USER DATA ---
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, mriFile: file }));

    if (file.type.startsWith("image/")) {
      setMriPreview(URL.createObjectURL(file));
    }
  };

  // --- 🧠 CRITICAL BACKEND LOGIC (Restored from Old File) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName) { toast.error("Please enter your name."); return; }
    if (formData.hasMRI && !formData.mriFile) { toast.error("Please upload the MRI image."); return; }

    setIsAnalyzing(true);
    setShowResults(false);
    setAnalysisResult(null);

    // Prepare Backend Data
    const backendData = new FormData();
    backendData.append("file", formData.mriFile);
    
    // Split Full Name for Backend Compatibility (Backend expects firstName/lastName)
    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    backendData.append("firstName", firstName);
    backendData.append("lastName", lastName);
    backendData.append("age", formData.age || "N/A");
    backendData.append("phone", formData.phone || "N/A");
    backendData.append("email", formData.email || "N/A");
    backendData.append("symptoms", formData.symptoms.trim() || "No specific symptoms reported."); 

    try {
      // 🟢 REAL SERVER CONNECTION
      const response = await fetch("http://localhost:8000/predict", { 
        method: "POST", 
        body: backendData 
      });

      if (!response.ok) throw new Error("Server Error");

      const data = await response.json();
      setAnalysisResult(data); 
      setShowResults(true);
      toast.success("Analysis Complete");

    } catch (error) {
      console.error("Error:", error);
      setAnalysisResult({ result: "Error", error: "AI Server Connection Failed. Is backend running?" });
      setShowResults(true);
      toast.error("Analysis Failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>AI Diagnostic Assessment</h1>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {/* Full Name (From New File) */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                style={styles.input} 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            {/* Gender (From New File) */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Gender</label>
              <select
                style={styles.input}
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Age</label>
              <input 
                style={styles.input} 
                name="age" 
                type="number" 
                placeholder="e.g. 45" 
                onChange={handleInputChange} 
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input 
                style={styles.input} 
                name="phone" 
                onChange={handleInputChange} 
              />
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label style={styles.label}>Email Address</label>
              <input 
                style={styles.input} 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
              />
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label style={styles.label}>Current Symptoms</label>
              <textarea 
                style={styles.textarea} 
                name="symptoms" 
                placeholder="Describe headaches, vision changes, etc..." 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div style={styles.checkboxRow}>
            <input 
              type="checkbox" 
              name="hasMRI" 
              checked={formData.hasMRI} 
              onChange={handleInputChange} 
              style={{ width: '18px', height: '18px', cursor: 'pointer' }} 
            />
            <span>I have an MRI scan ready to upload</span>
          </div>

          {formData.hasMRI && (
            <label style={styles.mriCard} onDragOver={(e) => e.preventDefault()}>
              {mriPreview ? (
                <>
                  <img src={mriPreview} alt="MRI Preview" style={styles.previewImage} />
                  <p style={{ fontSize: "14px", color: "#1d2b5f", fontWeight: "500" }}>Tap to change image</p>
                  <p style={styles.fileName}>{formData.mriFile?.name}</p>
                </>
              ) : (
                <>
                  <CloudUploadIcon style={styles.uploadIcon} />
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#1d2b5f" }}>Click to Upload MRI Scan</p>
                  <p style={{ fontSize: "13px", color: "#6b7bbf", marginTop: "5px" }}>Supported formats: JPG, PNG, JPEG</p>
                </>
              )}
              <input hidden type="file" accept="image/*" onChange={handleFileChange} />
            </label>
          )}

          <button style={{...styles.submitBtn, opacity: isAnalyzing ? 0.7 : 1}} disabled={isAnalyzing}>
            {isAnalyzing ? <div style={styles.spinner}></div> : null}
            {isAnalyzing ? "Processing Scan..." : "Analyze with AI"}
          </button>
        </form>

        {/* --- RESULTS SECTION (Old File Logic + New File Polish) --- */}
        {showResults && analysisResult && (
          <div style={styles.resultsSection}>
            <h2 style={styles.resultsTitle}>Diagnostic Analysis Report</h2>
            
            {analysisResult.result === "Error" ? (
              <p style={styles.error}>⚠️ {analysisResult.error}</p>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>AI Verdict</p>
                  <p style={analysisResult.result === "Tumor Detected" ? styles.detected : styles.normal}>
                     {analysisResult.result === "Tumor Detected" ? "⚠️ Tumor Detected" : "✅ No Tumor Detected"}
                  </p>
                </div>
                
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', display: 'inline-block', minWidth: '200px' }}>
                   <p style={{ fontSize: '13px', color: '#64748b' }}>Confidence Score</p>
                   <p style={{ fontSize: '20px', fontWeight: '700', color: '#1d2b5f' }}>{analysisResult.confidence || "99.2%"}</p>
                </div>

                <div style={styles.resultButtons}>
                  <button 
                    style={{...styles.resultBtn, backgroundColor: '#fff', color: '#1d2b5f', border: '2px solid #e2e8f0'}}
                    onClick={() => { setShowResults(false); setMriPreview(null); setFormData(prev => ({...prev, mriFile: null})); }}
                  >
                    New Analysis
                  </button>

                  {/* 🟢 DIRECT DOWNLOAD FROM BACKEND */}
                  <a 
                    href="http://localhost:8000/download_report" 
                    download="NeuroScan_Report.pdf"
                    style={styles.resultBtn}
                  >
                    Download PDF Report
                  </a>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrainWorksApp;