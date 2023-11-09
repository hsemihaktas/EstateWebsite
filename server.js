const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');

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
app.use(bodyParser.json());

// Dosya yükleme ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Anasayfa İlan Bilgileri Çekme  -- Anasayfa
app.get('/ilanlar', (req, res) => {
  const sıralama = req.query.siralama || 'varsayilan'; // Varsayılan sıralama türü

  // SQL sorgusu oluşturun
  let selectIlanlarSql = 'SELECT * FROM ilanlar';
  if (sıralama === 'fiyatArtan') {
    selectIlanlarSql += ' ORDER BY fiyat ASC';
  } else if (sıralama === 'fiyatAzalan') {
    selectIlanlarSql += ' ORDER BY fiyat DESC';
  } else if (sıralama === 'isimAZ') { // İsme göre A-Z sıralama
    selectIlanlarSql += ' ORDER BY baslik ASC';
  } else if (sıralama === 'isimZA') { // İsme göre Z-A sıralama
    selectIlanlarSql += ' ORDER BY baslik DESC';
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

//Anasayfa İlan Resmi İçin İlk Resmi Çekiyor -- Anasayfa
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
//İlan Bilgileri Çekme -- İlan Detay
app.get('/ilan-detay/:ilanId', (req, res) => {
  const ilanId = req.params.ilanId;
  const selectIlanSql = 'SELECT * FROM ilanlar WHERE id = ?';
  const selectResimIdSql = 'SELECT id FROM resimler WHERE ilan_id = ?';

  db.query(selectIlanSql, [ilanId], (err, ilanResults) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'İlan alınırken hata oluştu.' });
    } else {
      if (ilanResults.length === 0) {
        res.status(404).json({ error: 'İlan bulunamadı.' });
      } else {
        const ilan = ilanResults[0];
        db.query(selectResimIdSql, [ilanId], (err, resimResults) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Resim idleri alınırken hata oluştu.' });
          } else {
            const resimIdler = resimResults.map(result => result.id);
            ilan.resimIdleri = resimIdler;
            res.json(ilan);
          }
        });
      }
    }
  });
});

//Resimleri Çekme -- İlan Detay
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

// İlan Ekleme 
app.post('/ilan-ekle', upload.array('resimler', 10), (req, res) => {
  const { baslik, aciklama, fiyat } = req.body;
  const resimBlobs = req.files.map(file => file.buffer); // Tüm resimleri buffer olarak al

  const insertIlanSql = 'INSERT INTO ilanlar (baslik, aciklama , fiyat ) VALUES (?, ?, ?)';
  db.query(insertIlanSql, [baslik, aciklama, fiyat], (err, result) => {
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

//İlan Silme 
app.delete('/ilanlar/:ilanId', (req, res) => {
  const ilanId = req.params.ilanId;

  // İlanla ilişkili resimleri sil
  const deleteResimSql = 'DELETE FROM resimler WHERE ilan_id = ?';

  db.query(deleteResimSql, [ilanId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'İlanla ilişkili resimler silinemedi.' });
    }

    // İlanı sil
    const deleteIlanSql = 'DELETE FROM ilanlar WHERE id = ?';

    db.query(deleteIlanSql, [ilanId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'İlan silinemedi.' });
      }

      return res.status(204).send(); // İşlem başarılıysa 204 (No Content) yanıtını döndürün
    });
  });
});

//İlanı Düzenle
app.put('/ilanlar/:ilanId', (req, res) => {
  const ilanId = req.params.ilanId;
  const { baslik, aciklama, fiyat } = req.body;

  const updateIlanSql = 'UPDATE ilanlar SET baslik = ?, aciklama = ?, fiyat = ? WHERE id = ?';

  db.query(updateIlanSql, [baslik, aciklama, fiyat, ilanId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'İlan güncellenirken hata oluştu.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'İlan bulunamadı.' });
    }

    res.json({ success: 'İlan başarıyla güncellendi.' });
  });
});

// İlan Düzenleme Sayfasında Resim silme
app.delete('/ilan-resim/:ilanId/:resimId', (req, res) => {
  const ilanId = req.params.ilanId;
  const resimId = req.params.resimId;

  // Resim silme SQL sorgusu
  const deleteResimSQL = 'DELETE FROM resimler WHERE ilan_id = ? AND id = ?';

  db.query(deleteResimSQL, [ilanId, resimId], (err, results) => {
    if (err) {
      console.error('Resim silinirken hata oluştu: ' + err);
      res.status(500).json({ error: 'Resim silinirken hata oluştu.' });
    } else {
      res.status(200).json({ message: 'Resim başarıyla silindi.' });
    }
  });
});

// İlan Düzenlenleme Sayfasında Çoklu resim yükleme 
app.post('/ilan-resim-yukle/:ilanId', upload.array('files', 10), (req, res) => {
  const ilanId = req.params.ilanId;
  const resimBlobs = req.files.map(file => file.buffer); // Tüm resimleri buffer olarak al

  const insertResimSql = 'INSERT INTO resimler (ilan_id, resim_blob) VALUES (?, ?)';

  const insertions = resimBlobs.map(resimBlob => {
    return new Promise((resolve, reject) => {
      db.query(insertResimSql, [ilanId, resimBlob], (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  });

  Promise.all(insertions)
    .then((insertedIds) => {
      res.json({ success: 'Resimler başarıyla yüklendi.', resimIdleri: insertedIds });
    })
    .catch((error) => {
      console.error('Resimler yüklenirken hata oluştu:', error);
      res.status(500).json({ error: 'Resimler yüklenirken hata oluştu.' });
    });
});


app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
