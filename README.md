# INFOKES FE

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```

To run:
```bash
bun run dev
```

====================
# Spesifikasi Teknis
## Frontend
- Menggunakan API dari backend untuk menampilkan halaman.
- Harus menggunakan Vue 3 dengan Composition API.
- Bisa menggunakan pustaka apa pun, kecuali pustaka yang khusus untuk menampilkan struktur folder atau yang serupa.
- Struktur folder harus dibuat dari nol (custom-made).
- Bisa menggunakan NodeJS atau Bun, tetapi kami lebih menyukai Bun.

## Apa yang Akan Kami Nilai?
- Seberapa bersih dan jelas kode yang Anda tulis.
- Struktur data yang Anda pilih.
- Algoritma yang digunakan.
- Penerapan best practices.

## Poin Bonus (Opsional)
- Menampilkan file di panel kanan.
- Membuat folder di panel kiri bisa dibuka/tutup (seperti Windows Explorer atau file explorer di IDE).
- Membuat aplikasi lebih scalable (misalnya bisa menangani jutaan data dan ribuan pengguna bersamaan).
- Menerapkan fungsi pencarian (search function).
- Menggunakan komponen UI.
- Menggunakan arsitektur hexagonal atau clean architecture.
- Menggunakan service dan repository layer.
- Menerapkan prinsip SOLID.
- Menulis unit test.
- Menulis unit test untuk komponen UI.
- Menulis integration test.
- Menulis E2E test.
- Menggunakan standar REST API (versioning, method, naming).
- Menggunakan runtime Bun daripada NodeJS.
- Menggunakan Elysia.
- Menggunakan monorepo.
- Menggunakan ORM.