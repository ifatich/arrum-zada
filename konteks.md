# 🕋 Konteks Produk & Keputusan Bisnis: Arrum Zada - Rencana Emas Haji

Dokumen ini mendokumentasikan konteks bisnis, peran aplikasi, keputusan produk, dan batas arsitektur dari aplikasi **Arrum Zada - Simulasi Rencana Emas Haji Pegadaian**.

---

## 1. Peran & Pengguna Aplikasi
* **Pengguna Utama:** Tenaga penjualan (Sales/Marketing Officer) PT Pegadaian dan nasabah potensial.
* **Tujuan Aplikasi:** Alat bantu simulasi finansial terstruktur untuk memproyeksikan target gramasi emas fisik Galeri 24 yang perlu dicicil nasabah agar mencukupi pelunasan porsi dan biaya ibadah haji di masa depan.
* **Prinsip Utama:** **Akurasi, transparansi, dan kejujuran data jauh lebih penting daripada tampilan visual semata.** Aplikasi tidak boleh menyajikan data palsu, tanggal kadaluarsa tanpa penanda, atau janji keuntungan fiktif kepada nasabah.

---

## 2. Keputusan Produk & Finansial (Final)

### A. Skema Tabungan Cicil di Muka
* Istilah **"Tabungan"** tetap dipertahankan di seluruh antarmuka pengguna (UI) sesuai keputusan produk.
* Secara substansi akad perbankan syariah / gadai:
  * "Estimasi Tabungan Emas Cicil per Bulan" merupakan **cicilan di muka** untuk pengadaan emas fisik batangan.
  * Harga emas **dikunci (fixed)** pada tanggal dan waktu akad transaksi dilakukan.
  * Cicilan bernilai tetap setiap bulan sepanjang jangka waktu perencanaan.
  * Perhitungan cicilan bulanan murni mencakup **pokok saja** (`total rupiah / (tahun * 12)`), belum termasuk biaya administrasi, fasilitas pembiayaan, atau mu'nah pemeliharaan barang titipan yang berlaku saat akad.

### B. Jangka Waktu Perencanaan (Tenor)
* Batas jangka waktu perencanaan adalah **1 sampai 30 tahun** (angka bulat/integer).
* **Tenor cicilan = Lama menabung = Waktu hingga emas dicairkan/dijual.**

### C. Integritas Harga Acuan Galeri 24
* Sumber harga acuan wajib berasal dari **harga resmi PT Pegadaian Galeri Dua Empat (Galeri 24)** untuk pecahan batangan 1 gram.
* **Larangan Fallback Fiktif:** Aplikasi dilarang keras menggunakan fallback harga statis fiktif tanpa mencantumkan tanggal asli perolehannya.
* Jika sinkronisasi gagal atau offline:
  * Sistem hanya boleh menyajikan data cache lokal yang sah, dengan tanggal dan waktu pengambilan aslinya (`date` & `fetchedAt`).
  * Jika cache lokal tidak tersedia, aplikasi wajib menampilkan state error transparan dan **menonaktifkan kartu kalkulasi**, bukan menampilkan kalkulasi dengan angka default palsu.
* Badge **"✓ Terkini"** hanya boleh aktif jika tanggal data resmi persis sama dengan tanggal hari ini di zona waktu Indonesia (`Asia/Jakarta`).

### D. Asumsi Pertumbuhan 7% per Tahun & Kepatuhan Redaksi
* Asumsi simulasi 7% per tahun mengacu pada rata-rata kenaikan harga emas batangan sejak tahun 2000.
* **Status Metodologi:** Dataset detail dan formula historis lengkap masih dalam tahap konsolidasi (lihat [`docs/metodologi-asumsi-7-persen.md`](file:///Users/lord/Documents/Bullion%20Token/arrum-zada/docs/metodologi-asumsi-7-persen.md)).
* **Kepatuhan Dewan Pengawas Syariah (DPS):**
  * Seluruh redaksi komersial menggunakan bahasa netral sementara (`TODO: menunggu persetujuan kepatuhan/DPS`).
  * Istilah spekulatif seperti *"Untung"*, *"Gain"*, *"Minimum 10 tahun terakhir"*, atau *"Menjamin"* telah dihapus dan diganti dengan *"Estimasi Selisih Nilai Emas"*, *"Asumsi Simulasi"*, dan *"Bukan Jaminan"*.
  * Disclaimer wajib tampil secara langsung tanpa mengharuskan pengguna scroll ke bagian paling bawah.

---

## 3. Rumus Kalkulasi Inti (Tidak Boleh Diubah)

```typescript
// 1. Total Kebutuhan Dana
totalKebutuhan = pelunasanHaji + persiapanHaji + keperluanLain

// 2. Faktor Kenaikan Asumsi 7% Majemuk
faktorKenaikan = Math.pow(1 + 0.07, tahunInvestasi)

// 3. Estimasi Harga Buyback Masa Depan
estimasiHargaBuybackMasaDepan = Math.round(hargaBuyback * faktorKenaikan)

// 4. Target Rekomendasi Gramasi Emas (Pembulatan ke atas)
gramasiEmas = Math.ceil(totalKebutuhan / estimasiHargaBuybackMasaDepan)

// 5. Modal Emas Hari Ini
nilaiEmasHariIni = Math.round(gramasiEmas * hargaJual)

// 6. Estimasi Tabungan Cicil Bulanan (Pokok)
tabunganPerBulanRp = Math.round(nilaiEmasHariIni / totalBulan)
tabunganPerBulanGram = (gramasiEmas / totalBulan).toFixed(2)

// 7. Nilai Emas saat Keberangkatan
nilaiEmasAkhir = Math.round(gramasiEmas * estimasiHargaBuybackMasaDepan)

// 8. Estimasi Selisih Nilai
selisihPertumbuhanRp = nilaiEmasAkhir - nilaiEmasHariIni
persentasePertumbuhan = Math.round((selisihPertumbuhanRp / nilaiEmasHariIni) * 100)
```