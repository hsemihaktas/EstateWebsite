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
      <div className="bg-white rounded-lg shadow-md flex flex-col lg:flex-row">
        {/* Carousel */}
        <div className="w-full md:w-1/2">
          <Carousel showThumbs={true} showArrows={true} showIndicators={true} showStatus={false}>
            {resimler.map((resim, index) => (
              <div key={resim}>
                <img
                  src={`http://localhost:3001/ilan-resim/${ilanId}/${resim}`}
                  alt={ilan.baslik}
                />
              </div>
            ))}
          </Carousel>
        </div>
        {/* Bilgiler */}
        <div className="w-full md:w-1/2 p-4">
          <h1 className="text-2xl font-bold mb-4">{ilan.baslik}</h1>
          <p className="text-gray-700">{ilan.aciklama}</p>
        </div>
      </div>
    </div>
  );
}

export default IlanDetay;
