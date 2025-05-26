const Divider = ({ text = "or" }) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-slate-300"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-4 bg-slate-50 text-slate-500 font-medium">{text}</span>
    </div>
  </div>
);
export default Divider;