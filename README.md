# Perkenalan

Doku membantu Anda mengembangkan bisnis dengan membuat Anda fokus pada pekerjaan yang pentin. Doku menyediakan satu ekosistem pembayaran untuk semua, menerima pembayaran, mencairkan dana Anda, dan apa pun yang Anda pikirkan tentang pembayaran.

## Doku Payment Gateway NodeJS

Penggunaan API Doku Checkout untuk post payment url dan get payment berdasarkan nomor invoice menggunakan NodeJS

## Depedencies

- **axios**
- **crypto**
- **bson**

## Cara Penggunaan

Untuk menggunakan project ini, ikuti langkah - langkah berikut:

1. **Clone Repository**

```bash
  git clone https://github.com/ajisnts07/doku-nodejs.git
```

2. **Masuk Ke Folder**
   Masuk ke direktori project yang telah di-clone sebelumnya

```bash
  cd ./doku-nodejs
```

3. **Install Dependencies**
   Jalankan perintah berikut untuk menginstall semua dependencies yang diperlukan

```bash
  npm install
```

4. **Jalankan Post Payment**
   Silahkan ganti client_id, secret_key dan jsonBody (terkait detail order) terlebih dahulu

```bash
  node postPayment
```

5. **Jalankan Get Payment**
   Silahkan ganti client_id, secret_key dan invoice_number terlebih dahulu

```bash
  node getPayment
```
