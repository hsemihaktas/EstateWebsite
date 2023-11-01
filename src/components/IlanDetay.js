import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function IlanDetay() {
  const { ilanId } = useParams();
  const [ilan, setIlan] = useState(null);

  useEffect(() => {
    // ilanId'ye göre ilan verilerini alın
    axios.get(`http://localhost:3001/ilanlar/${ilanId}`)
      .then((response) => {
        setIlan(response.data);
      })
      .catch((error) => {
        console.error('İlan alınırken hata oluştu:', error);
      });
  }, [ilanId]);

  if (!ilan) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md flex">
        {/* Resim */}
        <div className="w-1/2">
          <img src={`http://localhost:3001/ilan-resim/${ilanId}`} alt={ilan.baslik} className="max-w-full h-auto" />
        </div>
        {/* Bilgiler */}
        <div className="w-1/2 p-4">
          <h1 className="text-2xl font-bold mb-4">{ilan.baslik}</h1>
          <p className="text-gray-700">{ilan.aciklama}</p>
        </div>
      </div>
    </div>
  );
}

export default IlanDetay;
