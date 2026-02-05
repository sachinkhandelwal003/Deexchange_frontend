export default function TrendingTabs({ tabs, active, onChange }) {
  return (
    /* Added scrollbar-hide logic using Tailwind arbitrary classes */
    <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className="
          grid grid-flow-col auto-cols-fr
          gap-3
          min-w-max
        "
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab)}
              className={`
                flex items-center justify-center gap-2
                px-4 py-2 text-sm whitespace-nowrap
                border border-gray-600
                
                transition
                ${
                  active?.id === tab.id
                    ? "bg-[#1f2d3d] text-white font-semibold"
                    : "bg-[#1f2d3d] text-white"
                }
              `}
            >
              <span
                className={
                  tab.trending
                    ? "trending-blink flex items-center gap-2"
                    : "flex items-center gap-2"
                }
              >
                <Icon size={16} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}