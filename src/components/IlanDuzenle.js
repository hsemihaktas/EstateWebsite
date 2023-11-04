import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const IlanDuzenle = () => {
  const { ilanId } = useParams();

  const [ilan, setIlan] = useState({
    baslik: '',
    aciklama: '',
    fiyat: 0,
    resimIdleri: []
  });

  const [yeniResimler, setYeniResimler] = useState([]);
  const [silinecekResimler, setSilinecekResimler] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/ilan-detay/${ilanId}`)
      .then((response) => {
        setIlan(response.data);
      })
      .catch((error) => {
        console.error('İlan alınırken hata oluştu:', error);
      });
  }, [ilanId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIlan({ ...ilan, [name]: value });
  };

  const handleIlanGuncelle = () => {
    axios.put(`http://localhost:3001/ilanlar/${ilanId}`, ilan)
      .then(() => {
        // Yeni resimlerin yüklenmesi
        yeniResimler.forEach((resim) => {
          const formData = new FormData();
          formData.append('files', resim);
          axios.post(`http://localhost:3001/ilan-resim-yukle/${ilanId}`, formData)
            .then(() => {
              // Yükleme başarılı olduğunda işlemleri burada yapabilirsiniz
            })
            .catch((error) => {
              console.error('Resim yüklenirken hata oluştu:', error);
            });
        });

        // Silinmesi gereken resimlerin silinmesi
        if (silinecekResimler.length > 0) {
          silinecekResimler.forEach((resimId) => {
            axios.delete(`http://localhost:3001/ilan-resim/${ilanId}/${resimId}`)
              .then(() => {
                setIlan({ ...ilan, resimIdleri: ilan.resimIdleri.filter(id => id !== resimId) });
              })
              .catch((error) => {
                console.error('Resim silinirken hata oluştu:', error);
              });
          });

          // Silme işlemi tamamlandığında, silinecekResimler dizisini sıfırla
          setSilinecekResimler([]);
        }

        window.location.href = `http://localhost:3000/ilanlar/${ilanId}`;
      })
      .catch((error) => {
        console.error('İlan güncellenirken hata oluştu:', error);
      });
  };

  const handleResimSil = (resimId) => {
    setSilinecekResimler([...silinecekResimler, resimId]);
    setIlan({ ...ilan, resimIdleri: ilan.resimIdleri.filter(id => id !== resimId) });
  };

  const handleResimYukle = (e) => {
    const resimler = e.target.files;
    setYeniResimler([...yeniResimler, ...resimler]);
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">İlan Düzenle</h1>
        <div className="mb-4" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {ilan.resimIdleri.map((resimId) => (
            <div key={resimId} className="relative border border-gray-200 rounded-lg p-2 m-2" style={{ width: '360px', height: '270px', position: 'relative' }}>
              <button
                onClick={() => handleResimSil(resimId)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-600 cursor-pointer"
              >
                &#10006; {/* Çarpı işareti */}
              </button>
              <img
                src={`http://localhost:3001/ilan-resim/${ilanId}/${resimId}`}
                alt={ilan.baslik}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
          <div className="relative border border-gray-200 rounded-lg p-2 m-2" style={{ width: '360px', height: '270px', position: 'relative' }}>
            <label htmlFor="resimYukle" className="w-full h-full cursor-pointer hover:bg-gray-100 flex justify-center items-center">
              <input
                type="file"
                id="resimYukle"
                accept="image/*"
                multiple
                onChange={handleResimYukle}
                className="hidden"
              />
              Resim Yükle
            </label>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="mb-4">
            <label htmlFor="baslik" className="block font-semibold">Başlık:</label>
            <input
              type="text"
              id="baslik"
              name="baslik"
              value={ilan.baslik}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="aciklama" className="block font-semibold">Açıklama:</label>
            <textarea
              id="aciklama"
              name="aciklama"
              value={ilan.aciklama}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fiyat" className="block font-semibold">Fiyat:</label>
            <input
              type="number"
              id="fiyat"
              name="fiyat"
              value={ilan.fiyat}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            onClick={handleIlanGuncelle}
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover-bg-blue-600"
          >
            İlanı Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default IlanDuzenle;
