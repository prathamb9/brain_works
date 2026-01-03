import React from 'react';

// --- ICONS ---
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import EmergencyIcon from '@mui/icons-material/Emergency';

function Services() {
  // 🟢 Updated Service List: Focused on AI & NeuroScan features
  const services = [
    {
      icon: <LocalHospitalIcon />,
      title: 'MRI Image Analysis',
      description: 'Upload MRI scans and let our AI analyze them to identify potential brain tumors with high accuracy and speed.'
    },
    {
      icon: <VaccinesIcon />,
      title: 'AI Tumor Detection',
      description: 'Advanced deep learning models detect and classify brain tumors, supporting early diagnosis and clinical decisions.'
    },
    {
      icon: <EmergencyIcon />,
      title: 'Tumor Classification & Insights',
      description: 'Provides detailed insights such as tumor type, location, and severity to assist doctors in treatment planning.'
    },
    {
      icon: <AttachFileIcon />,
      title: 'Report Generation & Support',
      description: 'Generates clear diagnostic reports and supports patients and clinicians with actionable results and guidance.'
    }
  ];

  return (
    <section className="services" id="services-section">
      <div className="section-header">
        <h2>Our Best Services For Your Solution</h2>
        <p>
          Combining artificial intelligence with MRI analysis to deliver reliable brain tumor detection 
          and assist healthcare professionals in taking timely action.
        </p>
      </div>
      
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">
              {service.icon}
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;