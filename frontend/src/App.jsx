import VoiceRecorderApp from './pages/VoiceRecorderApp';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import withAuthModal from "./hoc/withAuthModal"
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import OTPVerification from './components/auth/OTPVerification';
import Dashboard from './pages/Dashboard';

const AuthenticatedVoiceRecorderAppRoute = withAuthModal(VoiceRecorderApp);
const AuthenticatedDashboardRoute = withAuthModal(Dashboard);

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/tvara' element={<AuthenticatedVoiceRecorderAppRoute/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Signup/>}/>
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path='/dashboard' element={<AuthenticatedDashboardRoute/>}/>
      </Routes>
    </BrowserRouter>


  );
}

export default App;

