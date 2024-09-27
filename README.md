
# ESTATE WEBSİTE

Kendimi geliştirme üzere yaptığım bir emlak sitesidir. Bu projede ReactJS, NodeJS ve MySql işlemleri yapıldı. MySql'e veri ve resim kaydetme, MySql'den veri ve resim bilgilerini çekme ve MySql'deki verilerin ve resimlerin güncelleştirilme işlemleri yapıldı.


## Projeyi çalıştırmak için yapılması gerekenler

### Gerekli paketleri yükleyin

İlk önce bilgisayarınızda MySQL'i açın ve daha sonrasında ilan_veritabanı adında bir database oluşturun. ilan_veritabanı.sql dosyasını içe aktar yaparak açılması gereken sütunları açılacaktır.

### Gerekli paketleri yükleyin

```bash
  npm install
```

### NodeJS Uygulamasını Çalıştırmak
Porje dizininde server.js dosyasını çalışmak için çalıştırın:

```bash
  node server.js
```

### React Uygulamasını Çalıştırmak
React uygulamanızın olduğu dizinde terminali açın ve şu komutu çalıştırın:

```bash
  npm start
```

  
## Server.js Komutları işlevleri




| Parametre | Açıklama                |
| :-------- | :------------------------- |
| `/ilanlar` | Tüm ilan bilgisini getirir. JSON olarak dönüş yapar. |
| `/ilan-resim/:ilanId` | Anasayfaya getirilen ilanların kapak resmini çeker. |
| `/ilan-detay/:ilanId` | Girilen ilanın tüm bilgilerini ve resimlerinin idlerini döndürür. |
| `/ilan-resim/:ilanId/:resimId` | Girilen ilanın girilen resim idsnin blob verisini döndürür. |
| `/ilan-ekle` | Yeni bir ilanın bilgilerini ve resimlerini databaseye kayıt eder.|
| `/ilan-sil/:ilanId` | Seçilen ilanın verilerini siler.|
| `/ilan-duzenle/:ilanId` | Seçilen ilanın verilerini günceller.|
| `/ilan-duzenle-resim-sil/:ilanId/:resimId` | Seçilen ilanın silinen resimlerin databaseden silmeyi sağlar.|
| `/ilan-duzenle-resim-yukle/:ilanId` | Seçilen ilanın eklenen resimlerin database'e eklenmesini sağlar..|

  
## Ekran Görüntüleri

### Anasayfa
![anasayfa](https://github.com/hsemihaktas/EstateWebsite/blob/master/readme_image/IlanAnasayfa.png)

### Ilan Sayfası
![IlanSayfa](https://github.com/hsemihaktas/EstateWebsite/blob/master/readme_image/IlanSayfa.png)

### Ilan Düzenleme Sayfası
![IlanDuzenleme](https://github.com/hsemihaktas/EstateWebsite/blob/master/readme_image/IlanDuzenle.png)

### Ilan Ekleme Sayfas
![IlanEkleme](https://github.com/hsemihaktas/EstateWebsite/blob/master/readme_image/IlanEkle.png)

  