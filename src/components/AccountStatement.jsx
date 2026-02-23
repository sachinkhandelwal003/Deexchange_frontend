import React, { useState, useEffect } from "react";
import axios from "axios";

const AccountStatement = () => {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-02-25");
  const [type, setType] = useState("");

  const fetchStatements = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("userToken");

      const response = await axios.get(
        "https://devexchangee.in/api/api/users/get-all-account-statements",
        {
          params: {
            page: 1,
            limit: entriesPerPage,
            from: dateFrom,
            to: dateTo,
            search: searchTerm,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStatements(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statements:", error);
      if (error.response?.status === 401) {
        alert("Invalid or expired token. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, [entriesPerPage]); // auto reload when limit changes

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const formatNumber = (num) => {
    return Number(num || 0).toFixed(2);
  };

  return (
    <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-[#2C3E50] text-white px-4 py-2 text-lg font-medium">
        Account Statement
      </div>

      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-3">

          {/* DATE FILTER */}
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            From:
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            To:
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 outline-none"
            />
          </div>

          {/* TYPE FILTER */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm bg-white min-w-[220px] outline-none"
          >
            <option value="">All</option>
            <option value="CATEGORY_ID_1">Deposit / Withdraw</option>
            <option value="CATEGORY_ID_2">Sports</option>
            <option value="CATEGORY_ID_3">Casino</option>
            <option value="CATEGORY_ID_4">Third Party Casino</option>
          </select>

          <button
            onClick={fetchStatements}
            className="bg-[#008CBA] text-white px-8 py-1 rounded text-sm"
          >
            Submit
          </button>
        </div>

        {/* TABLE CONTROLS */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm flex items-center gap-2 font-medium text-gray-600">
            Show
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-1 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            Entries
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            Search:
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchStatements()}
              placeholder="Type and press Enter..."
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-sm font-semibold text-gray-700">
              <th className="px-4 py-3 border-r">Date</th>
              <th className="px-4 py-3 border-r">Sr No</th>
              <th className="px-4 py-3 border-r text-right">Credit</th>
              <th className="px-4 py-3 border-r text-right">Debit</th>
              <th className="px-4 py-3 border-r text-right">Pts</th>
              <th className="px-4 py-3">Remark</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-gray-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-16 text-center text-gray-400 italic">
                  Loading account statements...
                </td>
              </tr>
            ) : statements.length > 0 ? (
              statements.map((item, index) => (
                <tr key={item._id} className="border-b hover:bg-blue-50/20">
                  <td className="px-4 py-2.5 border-r whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-2.5 border-r">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2.5 border-r text-right text-green-600 font-semibold">
                    {formatNumber(item.credit)}
                  </td>
                  <td className="px-4 py-2.5 border-r text-right text-red-600 font-semibold">
                    {formatNumber(item.debit)}
                  </td>
                  <td className="px-4 py-2.5 border-r text-right font-bold text-blue-800">
                    {formatNumber(item.pts)}
                  </td>
                  <td className="px-4 py-2.5 uppercase text-[11px] tracking-wide text-gray-500">
                    {item.remark}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-20 text-center text-gray-400">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountStatement;