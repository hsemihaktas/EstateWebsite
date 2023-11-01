import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IlanCard  from './IlanCard';

function IlanAnasayfa() {
  const [ilanlar, setIlanlar] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/ilanlar')
      .then((response) => {
        setIlanlar(response.data);
      })
      .catch((error) => {
        console.error('İlanlar alınırken hata oluştu:', error);
      });
  }, []);

  return (
    <div className="flex flex-wrap -mx-4">
      {ilanlar.map((ilan) => (
        <div key={ilan.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 py-4">
          <IlanCard ilan={ilan} />
        </div>
      ))}
    </div>
  );
}

export default IlanAnasayfa;
