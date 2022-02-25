import { useState } from 'react';
import { BrowserRouter as Router, Routes , Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import ParkingSystem from './pages/ParkingSystem';
import './App.css';

function App() {
  const [currTime, setCurrTime] = useState(new Date());
  const [timeSpeed, setTimeSpeed] = useState(1000);
  const [selectedGate, setSelectedGate] = useState('A');
  const [waitingCar, setWaitingCar] = useState({gate: 'A', carPlateNum: '', carSize: 'S'});

  return (
    <div className='App'>
      <Header 
        currTime={currTime}
        setCurrTime={setCurrTime}
        timeSpeed={timeSpeed}
        setTimeSpeed={setTimeSpeed}
        setWaitingCar={setWaitingCar}
        selectedGate={selectedGate}
        setSelectedGate={setSelectedGate}
        />
      <Routes>
        <Route path="*" element={
          <ParkingSystem 
            currTime={currTime}
            waitingCar={waitingCar}
            setSelectedGate={setSelectedGate}/>
        } />
      </Routes>
    </div>
  );
}

export default App;
