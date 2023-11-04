import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function IlanDetay() {
  const { ilanId } = useParams();
  const [ilan, setIlan] = useState(null);

  useEffect(() => {
    // İlan ve resim verilerini çekme
    axios.get(`http://localhost:3001/ilan-detay/${ilanId}`)
      .then((response) => {
        setIlan(response.data);
      })
      .catch((error) => {
        console.error('İlan ve resimler alınırken hata oluştu:', error);
      });
  }, [ilanId]);

  const handleIlanSil = () => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      axios
        .delete(`http://localhost:3001/ilanlar/${ilanId}`)
        .then(() => {
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('İlan silinirken hata oluştu:', error);
        });
    }
  };

  if (!ilan || !ilan.resimIdleri) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md flex flex-col lg:flex-row">
          <div className="w-full md:w-1/3">
            <Carousel showThumbs={true} showArrows={true} showIndicators={true} showStatus={false}>
              {ilan.resimIdleri.map((resimId, index) => (
                <div key={resimId}>
                  <img
                    src={`http://localhost:3001/ilan-resim/${ilanId}/${resimId}`}
                    alt={ilan.baslik}
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="w-full md:w-1/2 p-4 relative">
            <h1 className="text-2xl font-bold mb-4">{ilan.fiyat} TL</h1>
            <h1 className="text-2xl font-bold mb-4">{ilan.baslik}</h1>
            <p className="text-gray-700 mb-4" style={{ overflowWrap: 'break-word' }}>{ilan.aciklama}</p>
            <div className="flex justify-end items-end">
              <Link
                to={`/ilan-duzenle/${ilan.id}`}
                className="bg-blue-500 text-white font-semibold px-4 py-2 mt-2 rounded hover:bg-blue-600 mr-2"
              >
                İlanı Düzenle
              </Link>
              <button
                onClick={handleIlanSil}
                className="bg-red-500 text-white font-semibold px-4 py-2 mt-2 rounded hover:bg-red-600"
              >
                İlanı Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IlanDetay;
