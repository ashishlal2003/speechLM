import VoiceRecorderApp from './pages/VoiceRecorderApp';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import withAuthModal from "./hoc/withAuthModal"
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

const AuthenticatedVoiceRecorderAppRoute = withAuthModal(VoiceRecorderApp);

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/tvara' element={<AuthenticatedVoiceRecorderAppRoute/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Signup/>}/>
      </Routes>
    </BrowserRouter>


  );
}

export default App;

