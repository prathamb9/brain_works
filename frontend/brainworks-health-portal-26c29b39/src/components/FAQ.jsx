import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How does this platform detect brain tumors from MRI scans?',
      answer: 'The platform uses advanced AI and machine learning models trained on medical MRI images. These models analyze patterns in the scan to identify signs that may indicate the presence of a brain tumor.'
    },
    {
      question: 'What types of brain tumors can be detected?',
      answer: 'The platform can detect and classify common brain tumor types such as glioma, meningioma, and pituitary tumors, based on MRI scan analysis.'
    },
    {
      question: 'Do I need a doctor’s prescription to use this service?',
      answer: 'No prescription is required to use the platform. However, users are strongly encouraged to consult a doctor for medical advice and interpretation of results.'
    },
    {
      question: 'What should I do if the result shows a tumor?',
      answer: 'If a tumor is detected, you should consult a neurologist or specialist as soon as possible and share the generated report for further medical evaluation.'
    },
    {
      question: 'Is this platform suitable for research or academic use?',
      answer: 'Yes. The platform can be used for educational or research purposes to study AI-based brain tumor detection, with proper data permissions.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <div className="section-header">
        <h2>We've Got Answers</h2>
        <p className="subtitle">Why To Believe With BrainWorks?</p>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div 
              className={`faq-question ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <h4>{faq.question}</h4>
              <ExpandMoreIcon />
            </div>
            <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;