import { useNavigate } from "react-router-dom";

export default function TableView({ data, loading }) {
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
            <th className="text-left px-2 py-1 font-bold">Game / Match</th>
            <th colSpan={2} className="text-center px-2 py-1 font-bold">1</th>
            <th colSpan={2} className="text-center px-2 py-1 font-bold">X</th>
            <th colSpan={2} className="text-center px-2 py-1 font-bold">2</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => navigate(`/game/${row.id}`)}
            >
              <td className="px-2 py-1 text-gray-800 whitespace-nowrap">
                <div className="font-medium text-blue-700 hover:underline">
                  {row.title}
                </div>
                <div className="text-[11px] text-gray-500">
                  {row.date}
                </div>
                {/* Show live scores/status if available */}
                {row.scores && (
                  <div className="text-[10px] font-semibold text-green-600">
                    {row.scores}
                  </div>
                )}
                {row.status && !row.scores && (
                  <div className="text-[10px] text-orange-500">
                    {row.status}
                  </div>
                )}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}