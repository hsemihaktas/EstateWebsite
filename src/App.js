import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IlanAnasayfa from './components/IlanAnasayfa';
import IlanDetay from './components/IlanDetay';
import IlanEkle from './components/IlanEkle';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact element={<IlanAnasayfa/>} />
          <Route path="/ilanlar/:ilanId" exact element={<IlanDetay/>} />
          <Route path="/ilan-ekle" exact element={<IlanEkle/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;