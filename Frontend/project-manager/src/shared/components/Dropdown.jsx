// Dropdown.jsx
import { createPortal } from "react-dom";

export default function Dropdown({
  children,
  isOpen,
  onClose,
  style,
  className = "",
}) {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div
        className={`fixed z-50 ${className}`}
        style={style}
      >
        {children}
      </div>
    </>,
    document.body
  );
}
