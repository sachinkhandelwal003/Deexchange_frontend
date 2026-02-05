import { NavLink } from "react-router-dom";

const tabs = [
  { label: "HOME", path: "/" },
  { label: "LOTTERY", path: "/lottery" },
  { label: "CRICKET", path: "/cricket" },
  { label: "TENNIS", path: "/tennis" },
  { label: "FOOTBALL", path: "/football" },
  { label: "TABLE TENNIS", path: "/table-tennis" },
  { label: "BACCARAT", path: "/baccarat" },
  { label: "32 CARDS", path: "/32-cards" },
  { label: "TEENPATTI", path: "/teenpatti" },
  { label: "POKER", path: "/poker" },
  { label: "LUCKY 7", path: "/lucky-7" },
  { label: "CRASH", path: "/crash" }
];

export default function CategoryTabs() {
  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <nav className="bg-[#2C3E50] text-white shadow-md pb-1">
        <div className="flex overflow-x-auto scrollbar-hide px-2 sm:px-4 text-xs sm:text-sm font-medium">
          {tabs.map(({ label, path }) => {
            const isCrash = label === "CRASH";

            return (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) => `
                  relative group flex-shrink-0
                  px-3 sm:px-5 py-3
                  transition-colors duration-200
                  ${isActive ? "font-semibold" : ""}
                  ${
                    isCrash
                      ? "text-red-400 hover:text-red-300"
                      : "hover:text-gray-200"
                  }
                `}
              >
                {label}

                {/* underline */}
                <span
                  className={`
                    absolute bottom-0 left-1/2 right-1/2 h-[2px]
                    transition-all duration-300
                    ${isCrash ? "bg-red-400" : "bg-white"}
                    group-hover:left-0 group-hover:right-0
                  `}
                />
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}