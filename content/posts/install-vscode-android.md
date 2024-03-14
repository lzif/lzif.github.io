---
title: "Cara Install VSCode di Handphone"
date: 2024-03-13T11:30:03+00:00
tags: ["howto"]
author: "Gue"
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
# description: "Desc Text."
canonicalURL: "https://canonical.url/to/page"
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
ShowCodeCopyButtons: true
UseHugoToc: true
cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
editPost:
    URL: "https://github.com/lzif/lzif.github.io/content"
    Text: "Saran Perubahan" # edit text
    appendFilePath: true # to append file path to Edit link
markup: md
---

Yo guys! Mau tau ga gimana cara nginstall VSCode di Handphone? Nah, gue bakal kasih tau kalian caranya! Siap-siap nih, karena ini akan bikin coding jadi lebih seru dan keren abis! 😎

Untuk nginstall VSCode di Handphone, kamu bisa pake Termux dan juga kamu bisa menggunakan Code OSS, versi open source dari VSCode. Meskipun memiliki fitur dasar yang sama, Code OSS mungkin tidak sepenuhnya kompatibel dengan ekstensi dan pembaruan fitur VSCode resmi.

## Persiapan Awal

Sebelum mulai, pastikan kalian udah punya Termux dan Termux-X11 yang sudah terinstall di smartphone kalian. Kalau belum punya, buruan download di F-Droid! Berikut link downloadnya:
- [Termux](link_ke_download_termux) - Dipake buat install code-oss (VSCode Open Source)
- [Termux-X11](link_ke_download_termux_x11) - Dipake buat nampilin VSCode nya dalam bentuk GUI(Graphical User Interface)
- [Unexpected Keyboard](hrkrkk) (opsional) Keyboard ini cocok dipake buat ngoding di VScode karena ada beberapa tombol untuk shortcut, seperti "Ctrl" / "Shift".

## Langkah 1: Installasi Paket-paket yang Dibutuhkan

Buka Termux dan jalankan perintah berikut untuk memastikan paket-paket di Termux kalian up to date:
```bash
pkg update && pkg upgrade
```

Setelah itu, install paket-paket yang dibutuhkan dengan perintah berikut:
```bash
pkg install wget git x11-repo tur-repo 
```

## Langkah 2: Download dan Ekstrak Code-OSS

Sekarang, kita bakal download dan ekstrak Code-OSS. Jalankan perintah-perintah berikut satu per satu:
```bash
wget https://github.com/cdr/code-server/releases/download/v3.10.2/code-server-3.10.2-linux-x86_64.tar.gz

tar -xzvf code-server-3.10.2-linux-x86_64.tar.gz
```

## Langkah 3: Persiapkan Konfigurasi Code-OSS

Masuk ke dalam folder Code-OSS yang udah kita ekstrak tadi:
```bash
cd code-server-3.10.2-linux-x86_64
```

## Langkah 4: Jalankan Code-OSS di Termux-X11

Oke, sekarang kita bakal jalanin Code-OSS di Termux-X11. Pastikan Termux-X11 udah terinstall dan jalan di smartphone kalian.

Jalankan Code-OSS dengan perintah:
```bash
./code-server --bind-addr 0.0.0.0:8080
```

Sekarang buka Termux-X11 dan buka browser di dalamnya. Ketikkan `localhost:8080` di address bar. Voila! Code-OSS bakal muncul di layar Termux-X11 kalian!

## Kesimpulan

Itu dia cara nginstall dan ngejalanin Code-OSS di Termux-X11 dengan gampang banget! Sekarang, kalian bisa coding sambil tetep tampil keren di Termux-X11. Jangan lupa, terus eksplorasi dan kembangkan skill koding kalian, guys!
