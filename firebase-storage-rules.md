# Firebase Storage Kuralları

Firebase Console > Storage > Rules bölümünden aşağıdaki kuralları ekleyin:

## 🚨 CORS Sorunu İçin Basit Kurallar (Test Amaçlı):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**ÖNEMLİ:** Bu kuralları Firebase Console'da aktif edin! 

## CORS Sorunu Çözümleri:

### 1. Firebase CLI ile CORS Ayarla
Terminal'de şu komutları çalıştırın:

```bash
npm install -g firebase-tools
firebase login
```

Sonra bir `cors.json` dosyası oluşturun:
```json
[
  {
    "origin": ["http://localhost:3000", "https://yourapp.vercel.app"],
    "method": ["GET", "POST", "DELETE", "PUT"],
    "maxAgeSeconds": 3600
  }
]
```

Sonra CORS'u uygulayın:
```bash
gsutil cors set cors.json gs://investmanager-496f6.firebasestorage.app
```

### 2. Firebase Storage Güvenlik Kuralları (Çalıştıktan Sonra):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profil fotoğrafları
    match /profile-photos/{userId}_{timestamp}.{extension} {
      allow read: if true;
      allow write, delete: if request.auth != null 
                         && request.auth.uid == userId
                         && request.resource.size < 5 * 1024 * 1024
                         && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 3. Test İçin Alternatif Domain:

Eğer localhost sorunu devam ederse, uygulamayı farklı bir portta çalıştırın:
```bash
npm run dev -- -p 3001
```

Veya production build test edin:
```bash
npm run build
npm start
```

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profil fotoğrafları için kurallar
    match /profile-photos/{userId} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null && request.auth.uid == userId; // Sadece kendi fotoğrafını yükleyebilir
    }
    
    // Dosya boyutu ve tipi kontrolü
    match /profile-photos/{allPaths=**} {
      allow write: if request.auth != null 
                   && resource.size < 5 * 1024 * 1024 // 5MB limit
                   && request.resource.contentType.matches('image/.*'); // Sadece resim dosyaları
    }
  }
}
```

## Alternatif Basit Kurallar:

Eğer yukarıdaki kurallar çalışmazsa, test amaçlı olarak geçici olarak bu basit kuralları kullanabilirsiniz:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**ÖNEMLİ:** Test ettikten sonra güvenlik için yukarıdaki detaylı kuralları kullanın. 