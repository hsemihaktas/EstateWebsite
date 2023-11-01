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
app.post('/yukle-resim', upload.single('resim'), (req, res) => {
  const { baslik, aciklama } = req.body;
  const resimBlob = req.file.buffer; // Resmi buffer olarak al

  const insertIlanSql = 'INSERT INTO ilanlar (baslik, aciklama) VALUES (?, ?)';
  db.query(insertIlanSql, [baslik, aciklama], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'İlan eklenirken hata oluştu.' });
    } else {
      const ilanId = result.insertId;
      const insertResimSql = 'INSERT INTO resimler (ilan_id, resim_blob) VALUES (?, ?)';
      db.query(insertResimSql, [ilanId, resimBlob], (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Resim eklenirken hata oluştu.' });
        } else {
          res.json({ success: 'İlan ve resim başarıyla eklendi.' });
        }
      });
    }
  });
});

app.get('/ilanlar', (req, res) => {
  const selectIlanlarSql = 'SELECT * FROM ilanlar';
  db.query(selectIlanlarSql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'İlanlar alınırken hata oluştu.' });
    } else {
      res.json(results);
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

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
