export const Button = ({ onClick, children, variant = "primary" }: {
  onClick: () => void,
  children: React.ReactNode,
  variant?: "primary" | "danger" | "success"
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case "danger": return "bg-red-600 hover:bg-red-700";
      case "success": return "bg-green-600 hover:bg-green-700";
      default: return "bg-blue-600 hover:bg-blue-700";
    }
  }
  return <button onClick={onClick} className={`${getButtonClass()}  text-gray-100 rounded p-2 w-20 font-bold `} > {children}</button >

}