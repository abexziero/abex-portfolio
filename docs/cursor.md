# Cursor butter native

- Sumber bentuk: `F:\cursor.png`, alpha asli dipertahankan dalam SVG; file sumber tidak diubah.
- Aset: [cursor-butter.svg](/F:/aplikasi/porto/public/images/cursor-butter.svg), ukuran native 18×18px.
- Warna butter `#F0CE72`, outline forest `#0D2118`; hotspot klik `(3,3)`.
- Dipasang melalui CSS `cursor: url(...) 3 3, auto/pointer` pada perangkat fine pointer/hover. Tidak ada komponen pengikut pointer, tween, ticker atau listener cursor.
- Touch memakai perilaku bawaan. Input teks, handle resize dan demo crosshair mempertahankan isyarat fungsionalnya. Browser yang menolak aset custom memakai fallback native.
- Seluruh kode, helper perencanaan jalur dan tes pesawat dihapus. Doodle background dan parallax yang sudah disetujui tetap tersedia.
