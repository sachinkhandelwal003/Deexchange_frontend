// src/pages/MultiLoginPage.jsx
import { useState } from 'react';
import Navbar from '../Dashboard/Navbar';

export default function MultiLoginPage() {
  // State for form fields
  const [clientId, setClientId] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [transactionCode, setTransactionCode] = useState('');

  // State for checkboxes (Privileges)
  const [privileges, setPrivileges] = useState({
    all: false,
    dashboard: false,
    marketAnalysis: false,
    userList: false,
    insertUser: false,
    accountStatement: false,
    partyWinLoss: false,
    currentBets: false,
    generalLock: false,
    casinoResult: false,
    liveCasinoResult: false,
    ourCasino: false,
    events: false,
    marketSearchAnalysis: false,
    loginUserCreation: false,
    withdraw: false,
    deposit: false,
    creditReference: false,
    userInfo: false,
    userPasswordChange: false,
    userLock: false,
    betLock: false,
    activeUser: false,
    agentAssign: false,
    userRegisterReport: false,
    totalProfitLoss: false,
    userWinLoss: false,
  });

  const handlePrivilegeChange = (e) => {
    const { name, checked } = e.target;
    setPrivileges(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { clientId, fullName, password, confirmPassword, privileges, transactionCode });
    // Yahan API call ya validation daal dena
  };

  return (
    <>
      {/* <Navbar />     */}

      <div className="min-h-screen bg-gray-50  px-4 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0088CC] text-white px-6 py-4 font-semibold text-xl">
            Multi Login Account
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0088CC]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0088CC]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0088CC]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0088CC]"
                  />
                </div>
              </div>
            </div>

            {/* Privileges Section */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Privileges</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-gray-50 p-4 rounded border border-gray-200">
                {Object.keys(privileges).map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name={key}
                      checked={privileges[key]}
                      onChange={handlePrivilegeChange}
                      className="h-4 w-4 text-[#0088CC] focus:ring-[#0088CC] border-gray-300 rounded"
                    />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bottom Action Table + Transaction Code */}
            <div className="border border-gray-200 rounded overflow-hidden mb-6">
              {/* Scrollable Table Header */}
              <div className="overflow-x-auto bg-gray-100">
                <table className="min-w-max w-full">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                      <th className="px-4 py-3 text-left">Action</th>
                      <th className="px-4 py-3 text-left">Username</th>
                      <th className="px-4 py-3 text-left">Full Name</th>
                      <th className="px-4 py-3 text-center">Dashboard</th>
                      <th className="px-4 py-3 text-center">Market Analysis</th>
                      <th className="px-4 py-3 text-center">User List</th>
                      <th className="px-4 py-3 text-center">Insert User</th>
                      <th className="px-4 py-3 text-center">Account Statement</th>
                      <th className="px-4 py-3 text-center">Party Win Loss</th>
                      <th className="px-4 py-3 text-center">Current Bets</th>
                      <th className="px-4 py-3 text-center">General Lock</th>
                      <th className="px-4 py-3 text-center">Casino Result</th>
                      <th className="px-4 py-3 text-center">Live Casino Result</th>
                      <th className="px-4 py-3 text-center">Our Casino</th>
                      {/* ... aur baaki columns */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Example row – real data ke liye map kar dena */}
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" className="h-4 w-4 text-[#0088CC]" />
                      </td>
                      <td className="px-4 py-3">demo_user</td>
                      <td className="px-4 py-3">Demo User</td>
                      <td className="px-4 py-3 text-center"><input type="checkbox" /></td>
                      <td className="px-4 py-3 text-center"><input type="checkbox" /></td>
                      {/* ... baaki checkboxes */}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Transaction Code + Buttons */}
              <div className="p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Transaction Code</label>
                  <input
                    type="text"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-[#0088CC]"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-[#0088CC] hover:bg-[#006699] text-white px-8 py-2.5 rounded font-medium shadow transition"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-2.5 rounded font-medium transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}