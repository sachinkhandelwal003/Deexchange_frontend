// Sidebar.jsx
import { useState } from "react";
import sidebarData from "./sidebarData";
import AccordionItem from "./AccordionItem";
import RecursiveSidebarItem from "./RecursiveSidebarItem";

export default function Sidebar({ onClose }) {
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <aside className=" flex flex-col bg-[#BBBBBB]">
      {/* Mobile header + close button */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <span className="text-lg font-semibold text-gray-800">Menu</span>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close menu"
        >
          <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable sidebar content */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {sidebarData.map((section) => (
            <AccordionItem
              key={section.id}
              title={section.title}
              isOpen={openSections.includes(section.id)}
              onToggle={() => toggleSection(section.id)}
            >
              {section.children?.map((item) => (
                <RecursiveSidebarItem key={item.id} item={item} />
              ))}
            </AccordionItem>
          ))}
        </div>
      </div>
    </aside>
  );
}