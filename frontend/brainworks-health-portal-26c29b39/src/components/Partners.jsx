import React from 'react';

function Partners() {
  const partners = ['Lifetrace', 'Medcare', 'BETAEL', 'Hoaler.', 'SOVEN'];

  return (
    <section className="partners">
      <div className="partners-container">
        {partners.map((partner, index) => (
          <div className="partner-logo" key={index}>
            {partner}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Partners;