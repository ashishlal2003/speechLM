const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  disabled = false, 
  loading = false,
  className = "" 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600",
    secondary: "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600",
    outline: "bg-white border-1 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm hover:shadow-md"
  };

  const baseStyles = "w-full font-medium py-4 px-4 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none";
  
  const colorStyles = disabled 
    ? "bg-gray-400 text-white cursor-not-allowed" 
    : variant === "outline" 
      ? variants[variant] 
      : `${variants[variant]} text-white shadow-lg hover:shadow-xl`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${colorStyles} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;