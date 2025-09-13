# Vercel'e Deployment Rehberi

## 🚀 Adım Adım Vercel'e Deploy Etme

### 1. **GitHub'a Proje Yükleme**
```bash
git init
git add .
git commit -m "İlk commit: Yönetim paneli hazır"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git push -u origin main
```

### 2. **Vercel Hesabı ve Bağlantı**
- https://vercel.com adresine git
- GitHub hesabın ile giriş yap
- "New Project" butonuna tıkla
- GitHub reposunu seç ve "Import" et

### 3. **Environment Variables Ekleme**
Vercel dashboard'da projenin **Settings** > **Environment Variables** bölümünde şu değişkenleri ekle:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDcBUzGEKFTL4MY_evup_yRKz9MyPsGmJU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=digiroom-337be.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=digiroom-337be
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=digiroom-337be.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=901622228883
NEXT_PUBLIC_FIREBASE_APP_ID=1:901622228883:web:32df90b2c4df370a182a66
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-NRZVZ9WWPP
```

**ÖNEMLİ:** Her değişkeni tek tek ekle:
- Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
- Value: `AIzaSyDcBUzGEKFTL4MY_evup_yRKz9MyPsGmJU`
- Environment: `Production`, `Preview`, `Development` (hepsini seç)

### 4. **Deploy Butonu**
- Environment variables'ı ekledikten sonra
- "Deploy" butonuna tıkla
- 2-3 dakika bekle
- ✅ **Başarılı!**

### 5. **Domain Ayarları (Opsiyonel)**
- Settings > Domains bölümünden
- Kendi domain'ini ekleyebilirsin
- Örnek: `admin.sirketadi.com`

---

## 🔐 Login Bilgileri
Deploy edilen sitede giriş yapmak için:
- **admin** / **123456**
- **editor** / **editor123** 
- **manager** / **manager123**

## 🛠 Local Geliştirme
Local'de çalıştırmak için `.env.local` dosyası oluştur ve Firebase ayarlarını ekle:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDcBUzGEKFTL4MY_evup_yRKz9MyPsGmJU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=digiroom-337be.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=digiroom-337be
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=digiroom-337be.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=901622228883
NEXT_PUBLIC_FIREBASE_APP_ID=1:901622228883:web:32df90b2c4df370a182a66
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-NRZVZ9WWPP
```

## 🎯 Vercel Özellikleri
- ✅ Otomatik HTTPS
- ✅ Global CDN
- ✅ GitHub push'ta otomatik deploy
- ✅ Hızlı yükleme
- ✅ Ücretsiz (hobby projeler için)

## 📞 Sorun Giderme
- Firebase bağlantı sorunu → Environment variables'ı kontrol et
- Build hatası → Local'de `npm run build` çalıştır, hataları gider
- Sayfa açılmıyor → Vercel dashboard'dan logs'u incele
