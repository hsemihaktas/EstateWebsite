import React, { useState } from 'react';
import axios from 'axios';

function IlanEkle() {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [resim, setResim] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('baslik', baslik);
    formData.append('aciklama', aciklama);
    formData.append('resim', resim);

    axios.post('http://localhost:3001/yukle-resim', formData)
      .then((response) => {
        console.log(response.data);
        // Başarılı bir şekilde eklenmişse, kullanıcıya bir mesaj gösterilebilir
      })
      .catch((error) => {
        console.error('İlan eklenirken hata oluştu:', error);
      });
  };

  return (
    <div>
      <h1>İlan Ekle</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="baslik">Başlık:</label>
          <input type="text" id="baslik" value={baslik} onChange={(e) => setBaslik(e.target.value)} />
        </div>
        <div>
          <label htmlFor="aciklama">Açıklama:</label>
          <textarea id="aciklama" value={aciklama} onChange={(e) => setAciklama(e.target.value)} />
        </div>
        <div>
          <label htmlFor="resim">Resim:</label>
          <input type="file" id="resim" accept="image/*" onChange={(e) => setResim(e.target.files[0])} />
        </div>
        <button type="submit">Ekle</button>
      </form>
    </div>
  );
}

export default IlanEkle;
