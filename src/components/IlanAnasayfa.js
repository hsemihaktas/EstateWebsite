import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IlanCard from './IlanCard';
import Navbar from './Navbar';

function IlanAnasayfa() {
  const [ilanlar, setIlanlar] = useState([]);
  const [siralama, setSiralama] = useState('varsayilan');

  useEffect(() => {
    axios.get(`http://localhost:3001/ilanlar?siralama=${siralama}`)
      .then((response) => {
        setIlanlar(response.data);
      })
      .catch((error) => {
        console.error('İlanlar alınırken hata oluştu:', error);
      });
  }, [siralama]);

  const handleSiralamaChange = (e) => {
    setSiralama(e.target.value);
  };

  return (
    <div className="relative">
      <Navbar />

      <div className="p-4 flex items-center">
        <select
          value={siralama}
          onChange={handleSiralamaChange}
          className="p-2 rounded border ml-auto"
        >
          <option value="varsayilan">Varsayılan Sıralama</option>
          <option value="fiyatArtan">Fiyata Göre Artan</option>
          <option value="fiyatAzalan">Fiyata Göre Azalan</option>
          <option value="isimAZ">A-Z'ye Göre Sıralama</option>
          <option value="isimZA">Z-A'ye Göre Sıralama</option>
        </select>
      </div>

      {/* İlanlar */}
      <div className="flex flex-wrap mx-4">
        {ilanlar.map((ilan) => (
          <div key={ilan.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 py-4">
            <IlanCard ilan={ilan} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default IlanAnasayfa;
