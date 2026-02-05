export default function SportTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="
      flex bg-[#CCCCCC] overflow-x-auto 
      scrollbar-hide
      [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
      border-b border-gray-400
    ">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab)}
          className={`
            px-5 py-2.5 text-[15px] whitespace-nowrap border-r border-gray-400 transition-all
            ${
              activeTab.id === tab.id
                ? "bg-[#2C3E50] text-white font-bold"
                : "bg-[#CCCCCC] text-black hover:bg-[#bfbfbf]"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}