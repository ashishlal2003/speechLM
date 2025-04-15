import VoiceRecorderApp from './pages/VoiceRecorderApp';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route  path='/' element={<LandingPage />}/>
        <Route path='/tvara' element={<VoiceRecorderApp />}/>
      </Routes>
    </BrowserRouter>


  );
}

export default App;

