// import React, { useState } from 'react';
// import FavoriteIcon from '@mui/icons-material/Favorite';

// function CardiologyClinic() {
//   const [activeTab, setActiveTab] = useState(0);

//   const clinics = [
//     {
//       name: 'Glioma',
//       title: 'Glioma',
//       description: 'Gliomas are one of the most common types of brain tumors and develop from glial cells. They can affect brain function and may vary from slow-growing to aggressive forms, making early detection very important.'
//     },
//     {
//       name: 'Meningioma',
//       title: 'Meningioma',
//       description: 'Meningiomas originate from the protective membranes surrounding the brain and spinal cord. They are often slow-growing and benign, but timely diagnosis helps prevent complications.'
//     },
//     {
//       name: 'Pituitary Tumor',
//       title: 'Pituitary Tumor',
//       description: 'Pituitary tumors form in the pituitary gland and can affect hormone production. Although many are non-cancerous, they may cause vision problems or hormonal imbalance if left untreated.'
//     },
//     {
//       name: 'Metastatic Brain Tumor',
//       title: 'Metastatic Brain Tumor',
//       description: 'Metastatic brain tumors spread to the brain from cancers in other parts of the body. Early identification helps doctors plan appropriate treatment and manage symptoms effectively.'
//     }
//   ];

//   return (
//     <section className="cardiology">
//       <div className="clinic-tabs">
//         {clinics.map((clinic, index) => (
//           <button
//             key={index}
//             className={`clinic-tab ${activeTab === index ? 'active' : ''}`}
//             onClick={() => setActiveTab(index)}
//           >
//             {clinic.name}
//           </button>
//         ))}
//       </div>
//       <div className="clinic-content">
//         <div className="clinic-text">
//           <h2>{clinics[activeTab].title}</h2>
//           <p>{clinics[activeTab].description}</p>
//           {/* <button className="learn-more-btn">Learn More</button> */}
//         </div>
//         <div className="clinic-icon">
//           <FavoriteIcon />
//         </div>
//       </div>
//     </section>
//   );
// }

// export default CardiologyClinic;




import React, { useState } from "react";
import Logo from "../assets/snake.png"; // ← your logo file

function CardiologyClinic() {
  const [activeTab, setActiveTab] = useState(0);

  const clinics = [
    /* … your clinic data … */
    {
      name: 'Glioma',
      title: 'Glioma',
      description: 'Gliomas are one of the most common types of brain tumors and develop from glial cells. They can affect brain function and may vary from slow-growing to aggressive forms, making early detection very important.'
    },
    {
      name: 'Meningioma',
      title: 'Meningioma',
      description: 'Meningiomas originate from the protective membranes surrounding the brain and spinal cord. They are often slow-growing and benign, but timely diagnosis helps prevent complications.'
    },
    {
      name: 'Pituitary Tumor',
      title: 'Pituitary Tumor',
      description: 'Pituitary tumors form in the pituitary gland and can affect hormone production. Although many are non-cancerous, they may cause vision problems or hormonal imbalance if left untreated.'
    },
    {
      name: 'Metastatic Brain Tumor',
      title: 'Metastatic Brain Tumor',
      description: 'Metastatic brain tumors spread to the brain from cancers in other parts of the body. Early identification helps doctors plan appropriate treatment and manage symptoms effectively.'
    }
  ];

  return (
    <section className="cardiology">
      <div className="clinic-tabs">
        {clinics.map((clinic, index) => (
          <button
            key={index}
            className={`clinic-tab ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {clinic.name}
          </button>
        ))}
      </div>

      <div className="clinic-content">
        <div className="clinic-text">
          <h2>{clinics[activeTab].title}</h2>
          <p>{clinics[activeTab].description}</p>
        </div>

        <div
          className="clinic-logo"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <img
            src={Logo}
            alt="Clinic Logo"
            style={{
              width: "200px",
              height: "200px",
            
              borderRadius: "10px",
             
            }}
          />
        </div>

      </div>
    </section>
  );
}

export default CardiologyClinic;
