import { Route, Routes } from 'react-router-dom';
import './App.css';
import { HomeApp } from './components/HomeApp';
import { SalaApp } from './components/SalaApp';
import { UserNameApp } from './components/UserNameApp';



function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<HomeApp />} />
        <Route path='home' element={<HomeApp />} />
        <Route path='sala/:codigo' element={<SalaApp />} />
        <Route path='username/:codigo' element={<UserNameApp />} />
      </Routes>
    </>
  );
}

export default App;
