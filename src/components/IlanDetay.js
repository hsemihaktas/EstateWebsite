import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function IlanDetay() {
  const { ilanId } = useParams();
  const [ilan, setIlan] = useState(null);
  const [resimler, setResimler] = useState([]);
  

  useEffect(() => {
    // ilanId'ye göre ilan verilerini alın
    axios.get(`http://localhost:3001/ilanlar/${ilanId}`)
      .then((response) => {
        setIlan(response.data);
      })
      .catch((error) => {
        console.error('İlan alınırken hata oluştu:', error);
      });

    // ilanId'ye göre resimlerin id'lerini ve resim_blob'ları alın
    axios.get(`http://localhost:3001/resimler/${ilanId}`)
      .then((response) => {
        setResimler(response.data);
      })
      .catch((error) => {
        console.error('Resimler alınırken hata oluştu:', error);
      });
  }, [ilanId]);

  if (!ilan || resimler.length === 0) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md flex">
        {/* Carousel */}
        <div className="w-1/2 h-500 w-500">
          <Carousel showThumbs={true} showArrows={true} showIndicators={true} width={500} height={500}>
            {resimler.map((resim) => (
              <div key={resim.id}>
                <img
                  src={`http://localhost:3001/ilan-resim/${ilanId}/${resim}`}
                  alt={ilan.baslik}
                  width={500}
                  height={500}
                />
              </div>
            ))}
          </Carousel>
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
