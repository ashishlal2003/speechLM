const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  focusColor = "orange"
}) => {
  const focusColors = {
    orange: 'focus:border-orange-500 focus:ring-orange-100',
    green: 'focus:border-green-500 focus:ring-green-100',
    red: 'focus:border-red-500 focus:ring-red-200'
  };

  const borderColor = error
    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
    : `border-slate-300 focus:ring-2 ${focusColors[focusColor]}`;

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className={`peer w-full pt-5 pb-2 px-4 rounded-sm border-1 bg-white text-slate-800 outline-none transition-all duration-200 placeholder-transparent ${borderColor}`}
      />

      <label
        htmlFor={name}
        className={`
          absolute left-3 px-1 bg-white transition-all duration-200 text-slate-500 pointer-events-none
          -top-2 text-xs 
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-slate-600
        `}
      >
        {label}
      </label>

      {/* Error message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
