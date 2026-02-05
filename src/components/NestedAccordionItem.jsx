import { FaPlus, FaMinus } from "react-icons/fa";

export default function NestedAccordionItem({
  title,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <div className="border-b border-gray-300">
      <button
        onClick={onToggle}
        className="
          w-full flex items-center gap-2
          px-4 py-2 text-sm font-medium
          hover:bg-gray-300 transition
        "
      >
        {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
        <span>{title}</span>
      </button>

      {isOpen && (
        <div className="pl-8 pb-2 space-y-1 text-sm text-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}