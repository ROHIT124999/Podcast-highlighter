import React from 'react';

export function Card({ children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {children}
    </div>
  );
}
