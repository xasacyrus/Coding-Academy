(function () {
  // ===== Data gallery =====
  var kegiatan = [
    { judul: 'Bootcamp Web Dasar', waktu: 'Setiap Sabtu, 4 minggu', foto: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
      alt: 'Ilustrasi peserta belajar HTML dan CSS di depan layar kode',
      desk: 'Peserta membangun halaman web pertama mereka dengan HTML, CSS, dan JavaScript. Setiap pertemuan ditutup dengan praktik membuat satu komponen halaman.' },
    { judul: 'Workshop Python untuk Pemula', waktu: '1 hari penuh', foto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      alt: 'Ilustrasi workshop Python dengan mentor menjelaskan di layar',
      desk: 'Mengenal variabel, perulangan, dan fungsi lewat latihan kecil, lalu membuat program kalkulator sederhana.' },
    { judul: 'Hackathon Akhir Pekan', waktu: '2 hari, tim 3 orang', foto: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      alt: 'Ilustrasi tim hackathon berdiskusi di depan laptop',
      desk: 'Tim kecil membuat prototipe aplikasi dalam 24 jam, lalu mempresentasikannya kepada juri dari komunitas developer.' },
    { judul: 'Kelas Pemrograman Mobile dengan Flutter', waktu: '6 pertemuan', foto: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
      alt: 'Ilustrasi peserta membuat aplikasi mobile dengan Flutter',
      desk: 'Dari menyusun tampilan sampai menjalankan aplikasi di ponsel sendiri. Peserta menyelesaikan satu aplikasi pencatat tugas.' },
    { judul: 'Code Review Bersama Mentor', waktu: 'Tiap akhir bulan', foto: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
      alt: 'Ilustrasi mentor memberi komentar pada kode peserta',
      desk: 'Mentor membaca kode peserta, memberi masukan tentang kerapian dan keamanan, lalu mendiskusikan perbaikannya bersama.' },
    { judul: 'Demo Day Proyek Akhir', waktu: 'Penutupan batch', foto: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
      alt: 'Ilustrasi peserta mempresentasikan proyek akhir di depan papan presentasi',
      desk: 'Setiap peserta memamerkan proyek akhir kepada keluarga, teman, dan mitra industri, lalu menerima sertifikat kelulusan.' }
  ];

  var grid = document.getElementById('galleryGrid');
  kegiatan.forEach(function (k) {
    var art = document.createElement('article');
    art.className = 'card';
    var img = document.createElement('img');
    img.className = 'thumb'; img.src = k.foto; img.alt = k.alt; img.loading = 'lazy';
    var body = document.createElement('div'); body.className = 'body';
    var h = document.createElement('h3'); h.textContent = k.judul;
    var m = document.createElement('div'); m.className = 'meta'; m.textContent = k.waktu;
    var p = document.createElement('p'); p.textContent = k.desk;
    body.appendChild(h); body.appendChild(m); body.appendChild(p);
    art.appendChild(img); art.appendChild(body);
    grid.appendChild(art);
  });

  // ===== Efek ketik di editor (satu momen saat halaman dibuka) =====
  var typedEl = document.getElementById('typed');
  var baris = [
    '<span class="c">// hari pertama di Coding Academy</span>',
    '<span class="k">function</span> sapa(nama) {',
    '  <span class="k">return</span> <span class="s">"Halo, "</span> + nama + <span class="s">"!"</span>;',
    '}',
    '',
    'console.log(sapa(<span class="s">"calon developer"</span>));'
  ];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var teksPenuh = baris.join('\n');
  function render(htmlText, caret) {
    typedEl.innerHTML = htmlText + (caret ? '<span class="caret"></span>' : '');
  }
  if (reduce) {
    render(teksPenuh, true);
  } else {
    // Ketik per karakter dengan menjaga tag HTML tetap utuh
    var i = 0;
    (function tick() {
      if (i >= teksPenuh.length) { render(teksPenuh, true); return; }
      if (teksPenuh[i] === '<') { i = teksPenuh.indexOf('>', i) + 1; }
      else if (teksPenuh[i] === '&') { i = teksPenuh.indexOf(';', i) + 1; }
      else { i++; }
      var potong = teksPenuh.slice(0, i);
      // tutup tag span yang masih terbuka
      var terbuka = (potong.match(/<span/g) || []).length - (potong.match(/<\/span>/g) || []).length;
      for (var t = 0; t < terbuka; t++) potong += '</span>';
      render(potong, true);
      setTimeout(tick, 28);
    })();
  }

  // ===== Navigasi tampilan =====
  var tabs = { gallery: document.getElementById('tab-gallery'), daftar: document.getElementById('tab-daftar') };
  var views = { gallery: document.getElementById('view-gallery'), daftar: document.getElementById('view-daftar') };
  function show(name) {
    Object.keys(views).forEach(function (k) {
      views[k].hidden = (k !== name);
      tabs[k].setAttribute('aria-selected', k === name ? 'true' : 'false');
    });
    window.scrollTo(0, 0);
  }
  tabs.gallery.addEventListener('click', function () { show('gallery'); });
  tabs.daftar.addEventListener('click', function () { show('daftar'); });
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-go')); });
  });

  // ===== Form pendaftaran =====
  var form = document.getElementById('formDaftar');
  var result = document.getElementById('result');
  var resultList = document.getElementById('resultList');
  var overlay = document.getElementById('overlay');
  var btnYa = document.getElementById('btnYa');
  var btnTidak = document.getElementById('btnTidak');
  var pending = null;
  var lastFocus = null;

  function setError(name, msg) {
    var f = form.querySelector('.field[data-for="' + name + '"]');
    f.classList.toggle('invalid', !!msg);
    f.querySelector('.error').textContent = msg || '';
  }

  function ambilData() {
    var g = form.querySelector('input[name="gender"]:checked');
    return {
      nik: form.nik.value.trim(),
      nama: form.nama.value.trim(),
      gender: g ? g.value : '',
      hp: form.hp.value.trim().replace(/[\s-]/g, ''),
      alamat: form.alamat.value.trim(),
      bahasa: form.bahasa.value
    };
  }

  function validasi(d) {
    var ok = true, pertama = null;
    function cek(name, kondisi, pesan, el) {
      if (kondisi) { setError(name, pesan); if (!pertama) pertama = el; ok = false; }
      else setError(name, '');
    }
    cek('nik', !/^\d{16}$/.test(d.nik), d.nik ? 'NIK harus berisi tepat 16 digit angka.' : 'NIK wajib diisi.', form.nik);
    cek('nama', d.nama.length < 3, d.nama ? 'Nama lengkap minimal 3 huruf.' : 'Nama lengkap wajib diisi.', form.nama);
    cek('gender', !d.gender, 'Pilih jenis kelamin.', form.querySelector('input[name="gender"]'));
    cek('hp', !/^(\+62|62|0)8\d{7,11}$/.test(d.hp), d.hp ? 'Format No HP tidak sesuai. Contoh: 081234567890.' : 'No HP wajib diisi.', form.hp);
    cek('alamat', d.alamat.length < 10, d.alamat ? 'Alamat terlalu singkat. Tulis jalan, kelurahan, dan kota.' : 'Alamat wajib diisi.', form.alamat);
    cek('bahasa', !d.bahasa, 'Pilih bahasa pemrograman yang diminati.', form.bahasa);
    if (pertama) pertama.focus();
    return ok;
  }

  // NIK hanya angka
  form.nik.addEventListener('input', function () { form.nik.value = form.nik.value.replace(/\D/g, '').slice(0, 16); });

  function bukaDialog() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    btnYa.focus();
  }
  function tutupDialog() {
    overlay.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = ambilData();
    if (!validasi(d)) return;
    pending = d;
    bukaDialog();
  });

  btnTidak.addEventListener('click', function () { pending = null; tutupDialog(); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) { pending = null; tutupDialog(); } });
  document.addEventListener('keydown', function (e) {
    if (overlay.hidden) return;
    if (e.key === 'Escape') { pending = null; tutupDialog(); }
    if (e.key === 'Tab') {
      var a = [btnTidak, btnYa], idx = a.indexOf(document.activeElement);
      e.preventDefault();
      a[(idx + (e.shiftKey ? -1 : 1) + a.length) % a.length].focus();
    }
  });

  btnYa.addEventListener('click', function () {
    if (!pending) return;
    var d = pending; pending = null;
    overlay.hidden = true;
    var baris = [
      ['NIK', d.nik],
      ['Nama lengkap', d.nama],
      ['Jenis kelamin', d.gender],
      ['No HP', d.hp],
      ['Alamat', d.alamat],
      ['Bahasa pemrograman', d.bahasa]
    ];
    resultList.innerHTML = '';
    baris.forEach(function (r) {
      var dt = document.createElement('dt'); dt.textContent = r[0];
      var dd = document.createElement('dd'); dd.textContent = r[1];
      resultList.appendChild(dt); resultList.appendChild(dd);
    });
    form.hidden = true;
    result.hidden = false;
    result.querySelector('.ok').setAttribute('tabindex', '-1');
    result.querySelector('.ok').focus();
  });

  function formBaru() {
    form.reset();
    ['nik', 'nama', 'gender', 'hp', 'alamat', 'bahasa'].forEach(function (n) { setError(n, ''); });
    result.hidden = true;
    form.hidden = false;
    form.nik.focus();
  }
  document.getElementById('btnBaru').addEventListener('click', formBaru);
  document.getElementById('btnReset').addEventListener('click', function () {
    setTimeout(function () { ['nik', 'nama', 'gender', 'hp', 'alamat', 'bahasa'].forEach(function (n) { setError(n, ''); }); }, 0);
  });
})();