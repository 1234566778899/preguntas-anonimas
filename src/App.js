import { Route, Routes } from 'react-router-dom';
import './App.css';
import { HomeApp } from './components/HomeApp';
import { SalaApp } from './components/SalaApp';



function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<HomeApp />} />
        <Route path='home' element={<HomeApp />} />
        <Route path='sala/:codigo' element={<SalaApp/>} />
      </Routes>
    </>
  );
}

export default App;
