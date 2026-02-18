import { useNavigate } from "react-router-dom";
import { memo } from "react";

function TableRow({ row, onClick }) {
  return (
    <tr
      className="border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer"
      onClick={onClick}
    >
      <td className="px-2 py-1 text-gray-800 whitespace-nowrap">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-blue-700 hover:underline">
            {row.isLive && (
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
            {row.title}
          </div>

          <div className="text-[11px] text-gray-500">
            {row.date}
          </div>
        </div>
      </td>

      <td className="w-20 text-center bg-[#7ec3f5] font-bold border-l border-white">
        {row.back1}
      </td>
      <td className="w-20 text-center bg-[#f7b2c4] font-bold border-l border-white">
        {row.lay1}
      </td>

      <td className="w-20 text-center bg-[#7ec3f5] font-bold border-l border-white">
        {row.backX}
      </td>
      <td className="w-20 text-center bg-[#f7b2c4] font-bold border-l border-white">
        {row.layX}
      </td>

      <td className="w-20 text-center bg-[#7ec3f5] font-bold border-l border-white">
        {row.back2}
      </td>
      <td className="w-20 text-center bg-[#f7b2c4] font-bold border-l border-white">
        {row.lay2}
      </td>
    </tr>
  );
}

const MemoRow = memo(TableRow);

export default function TableView({ data = [], loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-600">
        Loading matches...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="p-5 text-center text-gray-500">
        No matches available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs md:text-sm border-collapse">
        <thead className="bg-gray-100 border-y border-gray-400">
          <tr>
            <th className="text-left px-2 py-1 font-bold">
              Game / Match
            </th>
            <th colSpan={2} className="text-center px-2 py-1 font-bold">
              1
            </th>
            <th colSpan={2} className="text-center px-2 py-1 font-bold">
              X
            </th>
            <th colSpan={2} className="text-center px-2 py-1 font-bold">
              2
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <MemoRow
              key={row.id}
              row={row}
              onClick={() => navigate(`/game/${row.id}`)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
