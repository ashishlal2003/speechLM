import { Link } from "react-router-dom";
import BrandLogo from "../elements/BrandLogo";

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-slate-50">
    <div className="pt-6 pl-6">
      <div className="text-2xl font-bold">
        <Link to="/" className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
          Tvara
        </Link>
      </div>
    </div>

    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">{title}</h1>
          {/* <p className="text-slate-600 text-lg">{subtitle}</p> */}
        </div>

        {children}
    <p className="text-xs text-center text-slate-500 leading-relaxed mt-12">
      <button className="text-blue-500 hover:underline">Terms of Uses</button>{' | '}
      <button className="text-blue-500 hover:underline">Privacy Policy</button>
    </p>
      </div>
    </div>
  </div>
);

export default AuthLayout;