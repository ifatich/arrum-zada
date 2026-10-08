<template>
  <div class="deeplink-tester-page">
    <div class="container">
      <h1>Tester Deeplink (Vue Page)</h1>
      <p class="description">
        Buka halaman ini di browser HP Anda (Safari/Chrome). <br />
        Pastikan aplikasi dalam keadaan <strong>BELUM LOGIN</strong> sebelum
        menekan tombol di bawah untuk melihat responsnya.
      </p>

      <div class="section">
        <h3>🍏 iOS (tring://)</h3>
        <a class="btn-link ios" href="tring://emas/beliEmas">
          Beli Emas <span class="badge">8.7.0</span>
        </a>
        <a class="btn-link ios" href="tring://emas/cicilEmasBatangan">
          Cicil Emas Batangan <span class="badge">8.7.0</span>
        </a>
        <a class="btn-link ios" href="tring://emas/deposito">
          Deposito <span class="badge">8.7.0</span>
        </a>
        <a class="btn-link ios" href="tring://emas/gadaiTE">
          Gadai TE <span class="badge">8.7.0</span>
        </a>
        <a class="btn-link ios" href="tring://emas/bayargadai">
          Bayar Gadai <span class="badge">8.7.0</span>
        </a>

        <a
          class="btn-link ios new-feature"
          href="tring://emas/cicilEmasTabungan"
        >
          Cicil Emas Tabungan <span class="badge new-badge">New 8.8.0</span>
        </a>
        <a class="btn-link ios new-feature" href="tring://promoList">
          Promo List <span class="badge new-badge">New 8.8.0</span>
        </a>
      </div>

      <div class="section">
        <h3>🤖 Android (tringapp://)</h3>
        <a class="btn-link android" href="tringapp://emas/beliEmas">
          Beli Emas <span class="badge">8.7.0</span>
        </a>
        <a class="btn-link android" href="tringapp://emas/cicilEmasBatangan">
          Cicil Emas Batangan <span class="badge">8.7.0</span>
        </a>
        <a class="btn-link android" href="tringapp://emas/deposito">
          Deposito <span class="badge">8.7.0</span>
        </a>
        <a class="btn-link android" href="tringapp://emas/gadaiTE">
          Gadai TE <span class="badge">8.7.0</span>
        </a>
        <a class="btn-link android" href="tringapp://emas/bayargadai">
          Bayar Gadai <span class="badge">8.7.0</span>
        </a>

        <a
          class="btn-link android new-feature-android"
          href="tringapp://emas/cicilEmasTabungan"
        >
          Cicil Emas Tabungan <span class="badge new-badge-android">New 8.8.0</span>
        </a>
        <a class="btn-link android new-feature-android" href="tringapp://promoList">
          Promo List <span class="badge new-badge-android">New 8.8.0</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Tidak memerlukan script khusus untuk sekadar hyperlink
</script>

<style scoped>
.deeplink-tester-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 40px 20px;
  background-color: #f4f4f9;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  text-align: center;
}

h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 12px;
  margin-top: 0;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
  line-height: 1.6;
}

.section {
  margin-bottom: 40px;
  text-align: left;
}

h3 {
  color: #444;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
  margin-top: 0;
}

.btn-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
  padding: 16px 20px;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-link:active {
  opacity: 0.8;
  transform: scale(0.98);
}

.ios {
  background-color: #007aff; /* iOS Blue */
}

.android {
  background-color: #3ddc84; /* Android Green */
  color: #000;
}

.badge {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.3);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: normal;
}

.android .badge {
  background: rgba(0, 0, 0, 0.1);
}

.new-feature {
  margin-top: 24px;
  background-color: #0a5a9c;
}

.new-badge {
  background: rgba(255, 255, 255, 0.4);
  font-weight: 600;
}

.new-feature-android {
  margin-top: 24px;
  background-color: #2eb068;
  color: white;
}

.new-badge-android {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}
</style>
