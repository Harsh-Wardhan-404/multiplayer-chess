export const Button = ({ onClick, children, variant = "primary", disabled = false }: {
  onClick: () => void,
  children: React.ReactNode,
  variant?: "primary" | "danger" | "success",
  disabled?: boolean
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case "danger": return "bg-red-600 hover:bg-red-700";
      case "success": return "bg-green-600 hover:bg-green-700";
      default: return "bg-blue-600 hover:bg-blue-700";
    }
  }
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
  return <button
    onClick={onClick}
    disabled={disabled}
    className={`${getButtonClass()} ${disabledClass} text-gray-100 rounded p-2 w-20 font-bold`}
  >
    {children}
  </button>
}