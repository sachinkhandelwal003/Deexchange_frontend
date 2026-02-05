// RecursiveSidebarItem.jsx
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function RecursiveSidebarItem({ item, level = 0 }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  return (
    <div style={{ paddingLeft: `${level * 14}px` }}>
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className="
          w-full flex items-center gap-2 px-3 py-2 text-sm
          hover:bg-gray-300 transition-colors
          text-left
        "
      >
        {hasChildren &&
          (open ? <FaMinus size={12} /> : <FaPlus size={12} />)}

        <span
          className={`
            ${item.premium ? "premium-text-blink font-medium" : ""}
          `}
        >
          {item.title}
        </span>
      </button>

      {hasChildren && open && (
        <div>
          {item.children.map((child) => (
            <RecursiveSidebarItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}