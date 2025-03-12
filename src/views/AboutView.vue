<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Deskripsi</h1>
    <p class="text-gray-700 leading-relaxed">
      Buatlah halaman web yang menyerupai <span class="font-semibold">Windows Explorer</span>. Halaman ini dibagi secara
      horizontal menjadi dua panel:
    </p>

    <ul class="list-disc pl-6 mt-2 space-y-2">
      <li><span class="font-semibold">Panel kiri</span> berisi struktur folder.</li>
      <li><span class="font-semibold">Panel kanan</span> menampilkan subfolder langsung dari folder yang dipilih pada
        panel kiri.</li>
    </ul>

    <p class="text-gray-700 mt-4">
      Saat halaman dimuat, frontend akan meminta data dari backend dan menampilkan struktur folder lengkap di panel kiri,
      sementara panel kanan tidak menampilkan apa pun.
    </p>

    <ul class="list-disc pl-6 mt-2 space-y-2">
      <li>Folder dapat memiliki subfolder tanpa batas, termasuk tingkat kedalaman yang tidak terbatas.</li>
      <li>Saat pengguna mengklik salah satu folder di panel kiri, panel kanan akan menampilkan daftar subfolder langsung
        dari folder yang dipilih.</li>
    </ul>

  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
