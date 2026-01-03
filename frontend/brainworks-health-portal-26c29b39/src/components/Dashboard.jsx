import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, Activity, LogOut, User, HeartPulse, 
  ChevronRight, Bell, Sparkles, ShieldCheck, 
  AlertCircle, CheckCircle, XCircle // Added these for professional icons
} from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('new');
  
  const inputRef = useRef(null);

  const handleChange = (e) => { 
      e.preventDefault(); 
      if (e.target.files && e.target.files[0]) {
          processFile(e.target.files[0]);
          e.target.value = null;
      }
  };

  const processFile = async (file) => {
      if (!file) return;
      setLoading(true); setResult(null);
      const formData = new FormData();
      formData.append("file", file);

      try {
        await new Promise(r => setTimeout(r, 1000)); 
        const response = await fetch("http://localhost:8000/predict", { method: "POST", body: formData });
        const data = await response.json();
        setResult(data);
      } catch (error) {
        setResult({ result: "Error", error: "Cannot connect to Backend." });
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="dashboard-container">
      
      {/* 1. SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <HeartPulse size={28} color="#1A237E" />
          <div style={{ marginLeft: '10px' }}>
             <span>NeuroCheck</span>
             <p style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>Patient Portal</p>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li>
            <button className={activeTab === 'new' ? 'active' : ''} onClick={() => {setActiveTab('new'); setResult(null);}}>
              <FileText size={20} /> <span>My Scan</span>
            </button>
          </li>
          <li>
            <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
              <Activity size={20} /> <span>My History</span>
            </button>
          </li>
          <li>
            <button className={activeTab === 'patients' ? 'active' : ''} onClick={() => setActiveTab('patients')}>
              <User size={20} /> <span>Profile</span>
            </button>
          </li>
          
          <li style={{ marginTop: 'auto' }}>
            <button onClick={onLogout} className="logout-btn">
              <LogOut size={20} /> <span>Log Out</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="dashboard-content">
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Health Dashboard</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Bell size={20} color="#64748b" style={{ cursor: 'pointer' }} />
                <div style={{ textAlign: 'right', marginRight: '10px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{user?.displayName || "Patient"}</p>
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>ID: #8492</p>
                </div>
                <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User"} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} alt="Profile" />
            </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            {/* 1. UPLOAD STATE */}
            {!loading && !result && (
                <div className="upload-section animate-slide-up">
                    <div className="welcome-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1>Hello, {user?.displayName ? user.displayName.split(" ")[0] : "there"}</h1>
                        <p>Upload your MRI scan to get an instant AI health check.</p>
                    </div>

                    <div className="upload-card" onClick={() => inputRef.current.click()} style={{ cursor: 'pointer' }}>
                        <input type="file" ref={inputRef} onChange={handleChange} accept="image/*" style={{ display: 'none' }} />
                        <div className="upload-icon-large">
                            <Upload size={40} />
                        </div>
                        <h3>Upload MRI Scan</h3>
                        <p>Supported formats: JPG, PNG, DICOM</p>
                        <button className="upload-btn-primary">Select File</button>
                    </div>

                    {/* Stats Grid */}
                    <div className="dashboard-stats" style={{ marginTop: '40px' }}>
                        <StatCard label="My Scans" value="3 Total" icon={FileText} />
                        <StatCard label="Last Checkup" value="Oct 24" icon={Activity} />
                        <StatCard label="Data Privacy" value="Protected" icon={ShieldCheck} />
                    </div>
                </div>
            )}

            {/* 2. LOADING STATE */}
            {loading && (
                <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loader"></div>
                    <h3 style={{ marginTop: '20px', fontSize: '20px', color: '#1e293b' }}>Analyzing Scan...</h3>
                    <p style={{ color: '#64748b' }}>Consulting AI Model & Generating Report</p>
                </div>
            )}

            {/* 3. RESULT STATE */}
            {result && (
                <div className="results-container animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
                    
                    {/* Left: Summary Card */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                         
                        {/* 🔴 REPLACED EMOJIS WITH ICONS HERE */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            {result.result === "Error" ? (
                                <XCircle size={80} color="#ef4444" strokeWidth={1.5} />
                            ) : result.result === "Tumor Detected" ? (
                                <AlertCircle size={80} color="#ef4444" strokeWidth={1.5} />
                            ) : (
                                <CheckCircle size={80} color="#10b981" strokeWidth={1.5} />
                            )}
                        </div>
                        
                        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: result.result === "Error" ? '#ef4444' : '#1e293b', marginBottom: '5px' }}>
                            {result.result === "Error" ? "Error" : result.result}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#64748b' }}>AI Diagnosis Result</p>
                    </div>

                    {/* Right: Report & Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        {/* Confidence Bar */}
                        <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>AI Confidence</span>
                                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{result.confidence || "0%"}</span>
                            </div>
                            <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: result.confidence || '0%', height: '100%', background: result.result === 'Tumor Detected' ? '#ef4444' : '#10b981', borderRadius: '10px', transition: 'width 1s ease' }}></div>
                            </div>
                        </div>

                        {/* Report Text */}
                        <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                                <Sparkles size={18} color="#6366f1" />
                                <h3 style={{ fontWeight: 'bold', color: '#1e293b' }}>AI Analysis Report</h3>
                            </div>
                            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569' }}>
                                {result.report || result.error || "No report generated."}
                            </p>

                            {/* Actions */}
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                {result.result !== "Error" && (
                                    <a href="http://localhost:8000/download_report" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                                        Download PDF
                                    </a>
                                )}
                                <button onClick={() => setResult(null)} style={{ flex: 1, padding: '12px', background: '#1e293b', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                    Check Again <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}

        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
    return (
        <div className="stat-card">
            <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '10px', color: '#2563eb' }}>
                <Icon size={20} />
            </div>
            <div>
                <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{value}</p>
            </div>
        </div>
    );
}