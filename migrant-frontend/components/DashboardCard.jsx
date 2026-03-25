import React from 'react';

const DashboardCard = ({ title, children, className }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default DashboardCard;