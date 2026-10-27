---
description: Kerjakan satu tugas dengan alur yang disiplin (spec, rencana, tes, implementasi, serah terima)
argument-hint: "<ID Jira / FR-xx> <ringkasan tugas>"
---
Kerjakan tugas ini: $ARGUMENTS

Alur:
1. Baca spec yang relevan (FR, BR, R, Q yang disebut) lewat `docs/spec/README.md`. Catat ketidakjelasan.
2. Buat rencana singkat (file yang akan disentuh, perubahan skema DB, tes). Bila menyentuh lebih dari 5 file atau skema database, **tunggu persetujuan saya**.
3. Buat branch `feat/<id>-<slug>`.
4. Tulis tes untuk aturan bisnis lebih dulu (`rules.ts`), lalu implementasi setipis mungkin.
5. Jalankan lint, typecheck, dan test.
6. Tinjau diff sendiri terhadap spec dan Definition of done di `AGENTS.md`. Laporkan penyimpangan.
7. Jalankan `/handoff`.

Di luar lingkup tugas: jangan ubah. Catat sebagai temuan di `HANDOFF.md`.
