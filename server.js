const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3001;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ilan_veritabanı',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL veritabanına bağlandı');
});

app.use(cors()); // CORS ayarları

// Dosya yükleme ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Resim yükleme endpoint'i
app.post('/yukle-resim', upload.array('resimler', 10), (req, res) => {
  const { baslik, aciklama , fiyat} = req.body;
  const resimBlobs = req.files.map(file => file.buffer); // Tüm resimleri buffer olarak al

  const insertIlanSql = 'INSERT INTO ilanlar (baslik, aciklama , fiyat ) VALUES (?, ?, ?)';
  db.query(insertIlanSql, [baslik, aciklama , fiyat], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'İlan eklenirken hata oluştu.' });
    } else {
      const ilanId = result.insertId;
      const insertResimSql = 'INSERT INTO resimler (ilan_id, resim_blob) VALUES (?, ?)';
      const insertions = resimBlobs.map(resimBlob => {
        return new Promise((resolve, reject) => {
          db.query(insertResimSql, [ilanId, resimBlob], (err) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      Promise.all(insertions)
        .then(() => {
          res.json({ success: 'İlan ve resimler başarıyla eklendi.' });
        })
        .catch((error) => {
          res.status(500).json({ error: 'Resimler eklenirken hata oluştu.' });
        });
    }
  });
});

app.get('/ilanlar', (req, res) => {
  const sıralama = req.query.siralama  || 'varsayilan'; // Varsayılan sıralama türü

  // SQL sorgusu oluşturun
  let selectIlanlarSql = 'SELECT * FROM ilanlar';
  if (sıralama === 'fiyatArtan') {
    selectIlanlarSql += ' ORDER BY fiyat ASC';
  } else if (sıralama === 'fiyatAzalan') {
    selectIlanlarSql += ' ORDER BY fiyat DESC';
  }
  db.query(selectIlanlarSql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'İlanlar alınırken hata oluştu.' });
    } else {
      res.json(results);
    }
  });
});

app.get('/ilan-resim/:ilanId', (req, res) => {
  const ilanId = req.params.ilanId;
  const selectResimSql = 'SELECT resim_blob FROM resimler WHERE ilan_id = ?';
  db.query(selectResimSql, [ilanId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Resim alınırken hata oluştu.' });
    } else {
      res.contentType('image/jpeg'); // Resim içeriği olarak gönder
      res.end(results[0].resim_blob, 'binary');
    }
  });
});
app.get('/ilanlar/:ilanId', (req, res) => {
  const ilanId = req.params.ilanId;
  const selectIlanSql = 'SELECT * FROM ilanlar WHERE id = ?';
  db.query(selectIlanSql, [ilanId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'İlan alınırken hata oluştu.' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'İlan bulunamadı.' });
      } else {
        res.json(results[0]);
      }
    }
  });
});
app.get('/resimler/:ilanId', (req, res) => {
  const ilanId = req.params.ilanId;
  const selectResimIdSql = 'SELECT id FROM resimler WHERE ilan_id = ?';
  
  db.query(selectResimIdSql, [ilanId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Resim idleri alınırken hata oluştu.' });
    } else {
      const resimIdler = results.map(result => result.id);
      res.json(resimIdler);
    }
  });
});
app.get('/ilan-resim/:ilanId/:resimId', (req, res) => {
  const ilanId = req.params.ilanId;
  const resimId = req.params.resimId;
  const selectResimSql = 'SELECT resim_blob FROM resimler WHERE ilan_id = ? AND id = ?';
  
  db.query(selectResimSql, [ilanId, resimId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Resim alınırken hata oluştu.' });
    } else {
      if (results.length > 0) {
        res.contentType('image/jpeg'); // Resim içeriği olarak gönder
        res.end(results[0].resim_blob, 'binary');
      } else {
        res.status(404).json({ error: 'Resim bulunamadı.' });
      }
    }
  });
});





app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
