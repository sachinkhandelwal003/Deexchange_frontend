// src/pages/MultiLoginPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios'; // axios install kar lena agar nahi hai toh

export default function MultiLoginPage() {
  // State for form fields
  const [clientId, setClientId] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [transactionCode, setTransactionCode] = useState('');

  // API se aane wale data ke liye state
  const [privilegeData, setPrivilegeData] = useState([]);
  // Selected IDs ya names ko track karne ke liye
  const [selectedPrivileges, setSelectedPrivileges] = useState({});

  // Fetch Privileges from API
  useEffect(() => {
    const fetchPrivileges = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/get-all-priviliges');
        if (response.data.success) {
          setPrivilegeData(response.data.data);
          
          // Initial state set karna (sab false)
          const initialObj = {};
          response.data.data.forEach(item => {
            initialObj[item.name] = false;
          });
          setSelectedPrivileges(initialObj);
        }
      } catch (error) {
        console.error("Error fetching privileges:", error);
      }
    };
    fetchPrivileges();
  }, []);

  const handlePrivilegeChange = (e) => {
    const { name, checked } = e.target;
    setSelectedPrivileges(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out only selected privilege names/IDs
    const selectedList = Object.keys(selectedPrivileges).filter(key => selectedPrivileges[key]);
    
    console.log('Form submitted:', { 
      clientId, 
      fullName, 
      password, 
      confirmPassword, 
      selectedPrivileges: selectedList, 
      transactionCode 
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 pb-12">
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

            {/* Privileges Section - Dynamic rendering */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Privileges</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-gray-50 p-4 rounded border border-gray-200">
                {privilegeData.map((item) => (
                  <label key={item._id} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={selectedPrivileges[item.name] || false}
                      onChange={handlePrivilegeChange}
                      className="h-4 w-4 text-[#0088CC] focus:ring-[#0088CC] border-gray-300 rounded"
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bottom Action Table + Transaction Code */}
            <div className="border border-gray-200 rounded overflow-hidden mb-6">
              <div className="overflow-x-auto bg-gray-100">
                <table className="min-w-max w-full">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                      <th className="px-4 py-3 text-left">Action</th>
                      <th className="px-4 py-3 text-left">Username</th>
                      <th className="px-4 py-3 text-left">Full Name</th>
                      {privilegeData.slice(0, 10).map(item => (
                        <th key={item._id} className="px-4 py-3 text-center">{item.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-gray-50 text-sm">
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" className="h-4 w-4 text-[#0088CC]" />
                      </td>
                      <td className="px-4 py-3">demo_user</td>
                      <td className="px-4 py-3">Demo User</td>
                      {privilegeData.slice(0, 10).map(item => (
                        <td key={item._id} className="px-4 py-3 text-center">
                            <input type="checkbox" checked={selectedPrivileges[item.name] || false} readOnly />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

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
                    onClick={() => {
                        setSelectedPrivileges({});
                        setClientId('');
                        setFullName('');
                    }}
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