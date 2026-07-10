# 🏥 Terk Edilmiş Hastane: Sektör 4

C#, JavaScript, HTML ve CSS dilleri kullanılarak geliştirilmiş; ASP.NET Core MVC altyapısına ve Three.js (WebGL) 3D grafik motoruna sahip, gerilim dolu bir birinci şahıs (First-Person) korku/kaçış oyunudur.

> *"Bazı kapılar hiç açılmamalı..."*

---

## 🎮 Oyun Özellikleri

- **👁️ Birinci Şahıs Kamera Kontrolü (FPS):** WebGL (Three.js) tabanlı akıcı 3D çevre kontrolü ve FPS kamera mekanikleri.
- **🔦 Fener ve Batarya Yönetimi:** Sınırlı fener pil süresi ve atmosferi destekleyen rastgele fener kırpışmaları.
- **💓 Dinamik Panik ve Kalp Atış Hızı (BPM) Ses Sistemi:** Karakterin durumuna (koşma, korku anları, olay tetiklenmeleri) göre hızlanan dinamik kalp atışı ve gerilim sesleri.
- **🧩 Etkileşimli Korku Mekanikleri:** Dr. Aris'in gizemli notlarını bulup okuma, jeneratörleri devreye sokarak gizli geçitleri aktif etme ve çıkışa ulaşma.

---

## 🛠️ Kullanılan Teknolojiler ve Diller

*   **Programlama Dilleri:** C#, JavaScript, HTML, CSS
*   **Web Framework:** ASP.NET Core MVC (.NET 10.0)
*   **3D Grafik Kütüphanesi:** Three.js (WebGL)
*   **Arayüz & Tasarım:** Özel fontlar (Creepster, Special Elite) ve CSS animasyonları

---

## 🚀 Projeyi Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### Gereksinimler
*   [.NET 10.0 SDK](https://dotnet.microsoft.com/download)'in bilgisayarınızda yüklü olması gerekmektedir.

### Seçenek 1: Terminal (CLI) ile Başlatma

1. Bir komut satırı (Terminal / PowerShell / CMD) açın.
2. Projenin bulunduğu ana dizine gidin:
   ```bash
   cd C:\Users\tubad\source\repos\HospitalGame
   ```
3. Projeyi başlatmak için aşağıdaki komutu çalıştırın:
   ```bash
   dotnet run --project HospitalGame
   ```
4. Tarayıcınızda terminalde gösterilen adresi (örneğin `http://localhost:5000` veya `https://localhost:5001`) açarak oyunu oynamaya başlayabilirsiniz.

### Seçenek 2: Visual Studio ile Başlatma

1. `C:\Users\tubad\source\repos\HospitalGame` klasöründe bulunan **`HospitalGame.slnx`** veya **`HospitalGame.csproj`** dosyasını Visual Studio 2022 ile açın.
2. Üst menüden **HospitalGame** profilini seçip **Hata Ayıklamayı Başlat (F5)** veya **Hata Ayıklamadan Başlat (Ctrl+F5)** düğmesine basın.
3. Oyun tarayıcınızda otomatik olarak açılacaktır.

---

## 📁 Proje Yapısı

```text
HospitalGame/
├── Controllers/         # MVC Controller dosyaları (Sayfa yönlendirmeleri)
├── Models/              # MVC Model yapıları
├── Views/               # HTML/Razor arayüz dosyaları
│   ├── Home/
│   │   ├── Index.cshtml # Ana Menü Sayfası
│   │   └── Oyun.cshtml  # 3D Oyun Ekranı ve Three.js kodları
├── wwwroot/             # Statik dosyalar (JS, CSS, Görseller)
│   ├── css/             # Stil dosyaları (menu.css, story.css vb.)
│   ├── js/              # Oyun senaryo ve etkileşim mantığı (story.js)
│   └── images/          # Oyun içi kaplamalar ve görseller
└── HospitalGame.csproj  # .NET Proje Yapılandırma Dosyası
```
