import VoiceRecorderApp from './components/VoiceRecorder/VoiceRecorderApp';
import VoiceRecorder from './components/VoiceRecorder/VoiceRecorder';
import LandingPage from './LandingPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route  path='/' element={<LandingPage />}/>
        <Route path='/tvara' element={<VoiceRecorder/>}/>
      </Routes>

      {/* // <VoiceRecorderApp /> */}
      
    </BrowserRouter>


  );
}

export default App;

