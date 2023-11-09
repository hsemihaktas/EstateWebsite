import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function IlanEkle() {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [fiyat, setFiyat] = useState(''); // Fiyatı burada ekleyin
  const [resimler, setResimler] = useState([]); // Resimleri bir dizi olarak saklayın

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('baslik', baslik);
    formData.append('aciklama', aciklama);
    formData.append('fiyat', fiyat); // Fiyatı formData'ya ekleyin

    // Tüm resimleri formData'ya ekleyin
    for (let i = 0; i < resimler.length; i++) {
      formData.append('resimler', resimler[i]);
    }

    axios.post('http://localhost:3001/ilan-ekle', formData)
      .then((response) => {
        // Başarılı bir şekilde eklenmişse, kullanıcıya bir mesaj gösterilebilir
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('İlan eklenirken hata oluştu:', error);
      });
  };

  return (
    <div className='relative'>
      <div className="p-4 flex items-center">
        <Link to="/" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-auto">
          Anasayfa
        </Link>
      </div>
      <div className="max-w-md mx-auto mt-6 p-4">

        <h1 className="text-xl font-bold mb-4">İlan Ekle</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="baslik" className="block">Başlık:</label>
            <input type="text" id="baslik" value={baslik} onChange={(e) => setBaslik(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="aciklama" className="block">Açıklama:</label>
            <textarea id="aciklama" value={aciklama} onChange={(e) => setAciklama(e.target.value)} className="w-full p-2 border rounded"></textarea>
          </div>
          <div>
            <label htmlFor="fiyat" className="block">Fiyat:</label>
            <input type="text" id="fiyat" value={fiyat} onChange={(e) => setFiyat(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="resim" className="block">Resimler:</label>
            <input type="file" id="resim" accept="image/*" multiple onChange={(e) => setResimler(e.target.files)} className="w-full p-2 border rounded" />
            {/* multiple özelliği ekleyin */}
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Ekle</button>
        </form>
      </div>
    </div>
  );
}

export default IlanEkle;
