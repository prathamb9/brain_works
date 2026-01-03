import React from 'react';

function StatsBar() {
  const stats = [
    { number: '+5120', label: 'Happy Patients' },
    { number: '+26', label: 'Total Branches' },
    { number: '+53', label: 'Senior Doctors' },
    { number: '+10', label: 'Years Experience' }
  ];

  return (
    <section className="stats-bar">
      {stats.map((stat, index) => (
        <div className="stat-item" key={index}>
          <h2>{stat.number}</h2>
          <p>{stat.label}</p>
        </div>
      ))}
    </section>
  );
}

export default StatsBar;