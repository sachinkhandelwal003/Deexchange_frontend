// AccordionItem.jsx
import { FaChevronDown } from "react-icons/fa";

export default function AccordionItem({ title, isOpen, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="
          w-full px-5 py-3 text-left
          bg-[#0088CC] text-white
          flex justify-between items-center
          font-medium text-base
          transition-colors duration-200
          hover:bg-[#0077b3]
          active:bg-[#006699]
        "
      >
        <span>{title}</span>
        <FaChevronDown
          size={18}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-[#BBBBBB] py-2 text-sm">{children}</div>
      </div>
    </div>
  );
}