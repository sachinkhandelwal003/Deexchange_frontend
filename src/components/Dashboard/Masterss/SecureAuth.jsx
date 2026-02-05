import React from 'react';
import Navbar from '../Navbar';
const SecureAuthPage = () => {
  return (
    <>
    {/* <Navbar/> */}
    <div className="min-h-screen bg-white font-sans">
      {/* Header / Navbar Area */}
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Secure Auth Verification
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-12 px-4 text-center">
        <div className="flex flex-col items-center space-y-4">
          
          {/* Status Row */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg font-bold text-gray-800">
              Secure Auth Verification Status:
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
              Disabled
            </span>
          </div>

          {/* Instruction Text */}
          <p className="text-blue-900 text-lg">
            Please select <span className="italic">below option</span> to enable secure auth verification
          </p>

          {/* Action Buttons/Links */}
          <div className="flex flex-wrap justify-center gap-8 mt-4">
            <button className="text-orange-600 font-medium hover:underline transition-all">
              Enable Using Mobile App
            </button>
            <button className="text-orange-600 font-medium hover:underline transition-all">
              Enable Using Telegram
            </button>
          </div>

        </div>

        {/* Decorative Bottom Border as seen in image */}
        <div className="mt-8 border-t border-gray-100 w-full"></div>
      </main>
    </div>
    </>
  );
};

export default SecureAuthPage;