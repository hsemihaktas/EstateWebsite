import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function IlanCard({ ilan }) {
  const [resimBase64, setResimBase64] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/ilan-resim/${ilan.id}`, { responseType: 'blob' })
      .then((response) => {
        const reader = new FileReader();
        reader.onload = () => {
          setResimBase64(reader.result);
        };
        reader.readAsDataURL(response.data);
      })
      .catch((error) => {
        console.error('Resim alınırken hata oluştu:', error);
      });
  }, [ilan.id]);

  return (
    <div className="max-w-md rounded overflow-hidden shadow-lg">
      {resimBase64 && <img src={resimBase64} alt={ilan.baslik} className="w-full h-48 object-cover" />}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{ilan.baslik}</div>
        <div className="font-bold text-xl mb-2">{ilan.fiyat} TL</div>
        <Link to={`/ilanlar/${ilan.id}`} className="text-blue-600 hover:underline">Detaylar</Link>
      </div>
    </div>
  );
}

export default IlanCard;
