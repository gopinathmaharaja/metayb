"use client";
import React from "react";

const UnauthorizedPage: React.FC = () => {

  const handleGoBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="mb-4">You do not have permission to view this page.</p>
        <button
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          onClick={handleGoBack}
        >
          Go To Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

