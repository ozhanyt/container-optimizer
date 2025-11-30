# Projeyi GitHub ve Vercel'e Yükleme Rehberi

Projeniz yerel olarak Git ile başlatıldı ve ilk kayıt (commit) yapıldı. Şimdi aşağıdaki adımları takip ederek canlıya alabilirsiniz.

## 1. GitHub Deposu (Repository) Oluşturma

1.  [GitHub](https://github.com) hesabınıza giriş yapın.
2.  Sağ üst köşedeki **+** ikonuna tıklayıp **New repository** seçin.
3.  **Repository name** kısmına `container-optimizer` (veya istediğiniz bir isim) yazın.
4.  **Public** veya **Private** seçin (tercihinize göre).
5.  Diğer ayarları (README, .gitignore vb.) **işaretlemeyin** (zaten projemizde var).
6.  **Create repository** butonuna tıklayın.

## 2. Kodu GitHub'a Gönderme

GitHub deposunu oluşturduktan sonra size verilen komutlardan **"…or push an existing repository from the command line"** başlığı altındakileri kullanacağız.

Terminalinizde (bu proje klasöründe) sırasıyla şu komutları çalıştırın:

```bash
git remote add origin https://github.com/KULLANICI_ADINIZ/container-optimizer.git
git branch -M main
git push -u origin main
```

*(Not: `KULLANICI_ADINIZ` yerine kendi GitHub kullanıcı adınızı ve repo ismini yazdığınızdan emin olun. GitHub sayfasındaki komutu kopyalamak en garantisidir.)*

## 3. Vercel'de Proje Oluşturma

1.  [Vercel](https://vercel.com) hesabınıza giriş yapın (GitHub ile giriş yapmanız önerilir).
2.  Dashboard'da **Add New...** > **Project** butonuna tıklayın.
3.  **Import Git Repository** ekranında, az önce oluşturduğunuz `container-optimizer` deposunu bulun ve **Import** butonuna tıklayın.
4.  **Configure Project** ekranında:
    *   **Framework Preset:** `Vite` olarak otomatik seçili olmalıdır. Değilse seçin.
    *   **Root Directory:** `./` (varsayılan) kalabilir.
    *   **Build Command:** `npm run build` (veya `vite build`)
    *   **Output Directory:** `dist`
    *   **Install Command:** `npm install`
5.  **Deploy** butonuna tıklayın.

Vercel, projeyi otomatik olarak derleyip yayınlayacaktır. İşlem bitince size canlı URL'yi verecektir.

## Güncelleme Yapmak İçin

İleride kodda değişiklik yaptığınızda, terminalden şu komutları girmeniz yeterlidir:

```bash
git add .
git commit -m "Yaptığınız değişikliğin özeti"
git push
```

Vercel, GitHub'a her `push` yaptığınızda otomatik olarak yeni versiyonu yayınlar.
