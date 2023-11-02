import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import IlanCard from './IlanCard';

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
      {/* Üst div */}
      <div className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">İlanlar</h1>
        <div className="p-4">
        <Link to="/ilan-ekle" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          İlan Ekle
        </Link>
      </div>
      </div>

      <div className="p-4 flex items-center">
        <select
          value={siralama}
          onChange={handleSiralamaChange}
          className="p-2 rounded border ml-auto"
        >
          <option value="varsayilan">Varsayılan Sıralama</option>
          <option value="fiyatArtan">Fiyata Göre Artan</option>
          <option value="fiyatAzalan">Fiyata Göre Azalan</option>
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
