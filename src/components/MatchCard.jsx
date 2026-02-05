export default function MatchCard({ title, time, odds1, oddsX, odds2 }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
      <div className="font-semibold text-gray-800 mb-1.5">{title}</div>
      <div className="text-sm text-gray-500 mb-3">{time}</div>

      <div className="flex gap-8 text-sm">
        <div>
          1 <span className="font-bold text-green-600 ml-1.5">{odds1}</span>
        </div>
        <div>
          X <span className="font-bold text-blue-600 ml-1.5">{oddsX || '-'}</span>
        </div>
        <div>
          2 <span className="font-bold text-purple-600 ml-1.5">{odds2}</span>
        </div>
      </div>
    </div>
  );
}