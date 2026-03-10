// ==============================
// DATA & KONSTANTA
// ==============================

const stowageFactor = {
    beras:   0.7,
    gabah:   0.5,
    jagung:  1.61,
    kedelai: 1.61,
    custom:  null
};

const dosisFumigan = {
    phostek:         2,
    deliciagastoxin: 2,
    quickphos:       2,
    shenphos:        2,
    fumiphos:        2,
    custom:          null
};

// ==============================
// HELPER FORMAT
// ==============================

const fmt = (val, desimal = 2) =>
    val.toLocaleString('id-ID', { minimumFractionDigits: desimal, maximumFractionDigits: desimal });

const fmtMl = (val) =>
    fmt(val) + ' ml (' + fmt(val / 1000) + ' liter)';

const fmtFog = (val) =>
    fmt(val) + ' ml (' + fmt(val / 1000) + ' liter)';

// ==============================
// TAB SWITCH
// ==============================

function switchTab(tab) {
    document.getElementById('tab-fumigasi').style.display = tab === 'fumigasi' ? 'block' : 'none';
    document.getElementById('tab-spraying').style.display = tab === 'spraying' ? 'block' : 'none';
    document.getElementById('tab-fogging').style.display  = tab === 'fogging'  ? 'block' : 'none';
    document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// ==============================
// FUMIGASI - EVENT HANDLERS
// ==============================

function onKomoditasChange() {
    const komoditas    = document.getElementById('f-commodity').value;
    const stowageInput = document.getElementById('f-stowage');
    const factor       = stowageFactor[komoditas];

    if (factor !== null) {
        stowageInput.value    = factor;
        stowageInput.readOnly = true;
    } else {
        stowageInput.value    = '';
        stowageInput.readOnly = false;
        stowageInput.focus();
    }

    onBrokenM3Change();
}

function onBrokenM3Change() {
    const brokenM3  = parseFloat(document.getElementById('f-broken-m3').value) || 0;
    const stowage   = parseFloat(document.getElementById('f-stowage').value) || 0;
    const brokenTon = stowage > 0 ? brokenM3 * stowage : 0;
    document.getElementById('f-broken-ton').value = brokenTon.toFixed(2);
}

function onFumiganChange() {
    const fumigan    = document.getElementById('f-fumigan').value;
    const dosisInput = document.getElementById('f-dosis');
    const dosis      = dosisFumigan[fumigan];

    if (dosis !== null) {
        dosisInput.value    = dosis;
        dosisInput.readOnly = true;
    } else {
        dosisInput.value    = '';
        dosisInput.readOnly = false;
        dosisInput.focus();
    }
}

// ==============================
// FUMIGASI - KALKULASI
// ==============================

function hitungFumigasi() {
    const qty          = parseFloat(document.getElementById('f-qty').value) || 0;
    const brokenM3     = parseFloat(document.getElementById('f-broken-m3').value) || 0;
    const stowage      = parseFloat(document.getElementById('f-stowage').value) || 0;
    const dosis        = parseFloat(document.getElementById('f-dosis').value) || 0;
    const komoditiEl   = document.getElementById('f-commodity');
    const komoditiNama = komoditiEl.options[komoditiEl.selectedIndex].text;
    const fumiganEl    = document.getElementById('f-fumigan');
    const fumiganNama  = fumiganEl.options[fumiganEl.selectedIndex].text.trim();

    const brokenTon   = stowage > 0 ? brokenM3 * stowage : 0;
    const totalTon    = qty + brokenTon;
    const totalTablet = totalTon * dosis;

    document.getElementById('f-resultInfo').innerHTML =
        `<span class="info-tag">${komoditiNama}</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${qty} ton</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${fumiganNama}</span>`;

    document.getElementById('f-resTumpukan').textContent  = fmt(qty) + ' ton';
    document.getElementById('f-resBroken').textContent    = fmt(brokenTon) + ' ton';
    document.getElementById('f-resVolTotal').textContent  = fmt(totalTon) + ' ton';
    document.getElementById('f-resDosis').textContent     = dosis + ' tablet/ton';
    document.getElementById('f-resFumigan').textContent   = fmt(totalTablet) + ' tablet';
    document.getElementById('f-resFumiganKg').textContent = fmt(totalTablet) + ' tablet';

    tampilkanHasil('hasil-fumigasi');
}

// ==============================
// SPRAYING - KALKULASI
// ==============================

function kalkulasiSpraying(p, l, t, teras, sisiPanjang, sisiLebar, stapel) {
    const dindingPanjang     = 2 * 2 * (p * t);
    const dindingLebar       = 2 * 2 * (l * t);
    const atap               = 2 * (p * l);
    const terasArea          = sisiPanjang * (p * teras) + sisiLebar * (l * teras);
    const stapelArea         = (stapel * 174) / 150;
    const subtotal           = dindingPanjang + dindingLebar + atap + terasArea + stapelArea;
    const lantaiTidak        = (stapel * 1) / 3.1;
    const total              = subtotal - lantaiTidak;
    const tambahanLingkungan = total * 0.1;
    const totalLingkungan    = total * 1.1;

    return { dindingPanjang, dindingLebar, atap, terasArea, stapelArea, subtotal, lantaiTidak, total, tambahanLingkungan, totalLingkungan };
}

function updateSpraying(r, p, l, t, teras, sisiPanjang, sisiLebar, stapel) {
    document.getElementById('r-dinding-panjang-rumus').textContent = `2 × 2 × (${p} × ${t})`;
    document.getElementById('r-dinding-lebar-rumus').textContent   = `2 × 2 × (${l} × ${t})`;
    document.getElementById('r-atap-rumus').textContent            = `2 × (${p} × ${l})`;
    document.getElementById('r-teras-rumus').textContent           = `${sisiPanjang}×(${p}×${teras}) + ${sisiLebar}×(${l}×${teras})`;
    document.getElementById('r-stapel-rumus').textContent          = `${stapel} × 174 ÷ 150`;
    document.getElementById('r-lantai-rumus').textContent          = `${stapel} × 1 ÷ 3.1`;

    document.getElementById('r-dinding-panjang').textContent = fmt(r.dindingPanjang) + ' m²';
    document.getElementById('r-dinding-lebar').textContent   = fmt(r.dindingLebar) + ' m²';
    document.getElementById('r-atap').textContent            = fmt(r.atap) + ' m²';
    document.getElementById('r-teras').textContent           = fmt(r.terasArea) + ' m²';
    document.getElementById('r-stapel').textContent          = fmt(r.stapelArea) + ' m²';
    document.getElementById('r-subtotal').textContent        = fmt(r.subtotal) + ' m²';
    document.getElementById('r-lantai').textContent          = '− ' + fmt(r.lantaiTidak) + ' m²';
    document.getElementById('r-total').textContent           = fmt(r.total) + ' m²';
}

function hitungSpraying() {
    const p             = parseFloat(document.getElementById('s-panjang').value) || 0;
    const l             = parseFloat(document.getElementById('s-lebar').value) || 0;
    const t             = parseFloat(document.getElementById('s-tinggi').value) || 0;
    const teras         = parseFloat(document.getElementById('s-teras').value) || 0;
    const sisiPanjang   = parseFloat(document.getElementById('s-sisi-panjang').value) || 0;
    const sisiLebar     = parseFloat(document.getElementById('s-sisi-lebar').value) || 0;
    const stapel        = parseFloat(document.getElementById('s-stapel').value) || 0;
    const dosis         = parseFloat(document.getElementById('s-dosis').value) || 0;
    const lingkungan    = document.getElementById('s-lingkungan').checked;
    const komoditiEl    = document.getElementById('s-commodity');
    const komoditi      = komoditiEl.options[komoditiEl.selectedIndex].text;
    const insektisidaEl = document.getElementById('s-insektisida');
    const insektisida   = insektisidaEl.options[insektisidaEl.selectedIndex].text;

    const r         = kalkulasiSpraying(p, l, t, teras, sisiPanjang, sisiLebar, stapel);
    const luasFinal = lingkungan ? r.totalLingkungan : r.total;
    const totalMl   = luasFinal * dosis;

    updateSpraying(r, p, l, t, teras, sisiPanjang, sisiLebar, stapel);

    const rowLingkungan = document.getElementById('r-row-lingkungan');
    const rowFinal      = document.getElementById('r-row-final');
    if (lingkungan) {
        rowLingkungan.style.display = '';
        rowFinal.style.display      = '';
        document.getElementById('r-lingkungan').textContent  = '+ ' + fmt(r.tambahanLingkungan) + ' m²';
        document.getElementById('r-total-final').textContent = fmt(r.totalLingkungan) + ' m²';
    } else {
        rowLingkungan.style.display = 'none';
        rowFinal.style.display      = 'none';
    }

    document.getElementById('s-resultInfo').innerHTML =
        `<span class="info-tag">${komoditi}</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${insektisida}</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${dosis} ml/m²</span>
         ${lingkungan ? '<span class="info-sep">·</span><span class="info-tag" style="background:#e6f9f3;color:#00a878;border-color:#b2f0e0;">+10% Lingkungan</span>' : ''}`;

    document.getElementById('s-resDindingP').textContent   = fmt(r.dindingPanjang) + ' m²';
    document.getElementById('s-resDindingL').textContent   = fmt(r.dindingLebar) + ' m²';
    document.getElementById('s-resAtap').textContent       = fmt(r.atap) + ' m²';
    document.getElementById('s-resTeras').textContent      = fmt(r.terasArea) + ' m²';
    document.getElementById('s-resStapel').textContent     = fmt(r.stapelArea) + ' m²';
    document.getElementById('s-resLantai').textContent     = '− ' + fmt(r.lantaiTidak) + ' m²';
    document.getElementById('s-resTotal').textContent      = fmt(luasFinal) + ' m²';
    document.getElementById('s-resPestisida').textContent  = fmtMl(totalMl);
    document.getElementById('s-resInsektisida').textContent = fmtMl(0.25 * luasFinal);
    document.getElementById('s-resAir').textContent         = fmtMl(29.75 * luasFinal);
    document.getElementById('s-resLarutan').textContent     = fmtMl(30 * luasFinal);

    tampilkanHasil('hasil-spraying');
}

// ==============================
// FOGGING - KALKULASI
// ==============================

function hitungFogging() {
    const p           = parseFloat(document.getElementById('fg-panjang').value) || 0;
    const l           = parseFloat(document.getElementById('fg-lebar').value) || 0;
    const teras       = parseFloat(document.getElementById('fg-teras').value) || 0;
    const sisiPanjang = parseFloat(document.getElementById('fg-sisi-panjang').value) || 0;
    const sisiLebar   = parseFloat(document.getElementById('fg-sisi-lebar').value) || 0;
    const dosis       = parseFloat(document.getElementById('fg-dosis').value) || 0;

    const komoditiEl    = document.getElementById('fg-commodity');
    const komoditi      = komoditiEl.options[komoditiEl.selectedIndex].text;
    const insektisidaEl = document.getElementById('fg-insektisida');
    const insektisida   = insektisidaEl.options[insektisidaEl.selectedIndex].text;

    const lantai    = p * l;
    const terasArea = sisiPanjang * (p * teras) + sisiLebar * (l * teras);
    const total     = lantai + terasArea;
    const totalMl   = total * dosis;

    document.getElementById('fg-r-lantai-rumus').textContent = `${p} × ${l}`;
    document.getElementById('fg-r-teras-rumus').textContent  = `${sisiPanjang}×(${p}×${teras}) + ${sisiLebar}×(${l}×${teras})`;
    document.getElementById('fg-r-lantai').textContent       = fmt(lantai) + ' m²';
    document.getElementById('fg-r-teras').textContent        = fmt(terasArea) + ' m²';
    document.getElementById('fg-r-total').textContent        = fmt(total) + ' m²';

    document.getElementById('fg-resultInfo').innerHTML =
        `<span class="info-tag">${komoditi}</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${insektisida}</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${dosis} ml/m²</span>`;

    document.getElementById('fg-resLantai').textContent      = fmt(lantai) + ' m²';
    document.getElementById('fg-resTeras').textContent       = fmt(terasArea) + ' m²';
    document.getElementById('fg-resTotal').textContent       = fmt(total) + ' m²';
    document.getElementById('fg-resPestisida').textContent   = fmtFog(totalMl);
    document.getElementById('fg-resInsektisida').textContent = fmtFog(totalMl);
    document.getElementById('fg-resAir').textContent         = fmtFog(total - totalMl);
    document.getElementById('fg-resLarutan').textContent     = fmtFog(total * 1);

    tampilkanHasil('hasil-fogging');
}

// ==============================
// HELPER
// ==============================

function tampilkanHasil(id) {
    const el = document.getElementById(id);
    el.classList.add('visible');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetForm(tab) {
    if (tab === 'fumigasi') {
        document.getElementById('f-qty').value        = '';
        document.getElementById('f-broken-m3').value  = '';
        document.getElementById('f-broken-ton').value = '';
        document.getElementById('f-commodity').value  = 'beras';
        document.getElementById('f-fumigan').value    = 'phostek';
        onKomoditasChange();
        onFumiganChange();
        document.getElementById('hasil-fumigasi').classList.remove('visible');
    }
    if (tab === 'spraying') {
        ['s-panjang','s-lebar','s-tinggi','s-teras','s-sisi-panjang',
         's-sisi-lebar','s-stapel'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('s-commodity').value    = 'beras';
        document.getElementById('s-insektisida').value  = 'alfastore';
        document.getElementById('s-lingkungan').checked = false;
        document.getElementById('r-row-lingkungan').style.display = 'none';
        document.getElementById('r-row-final').style.display      = 'none';
        ['r-dinding-panjang','r-dinding-lebar','r-atap','r-teras','r-stapel',
         'r-subtotal','r-lantai','r-total','r-dinding-panjang-rumus',
         'r-dinding-lebar-rumus','r-atap-rumus','r-teras-rumus',
         'r-stapel-rumus','r-lantai-rumus'].forEach(id => document.getElementById(id).textContent = '—');
        document.getElementById('hasil-spraying').classList.remove('visible');
    }
    if (tab === 'fogging') {
        ['fg-panjang','fg-lebar','fg-tinggi','fg-teras',
         'fg-sisi-panjang','fg-sisi-lebar'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('fg-commodity').value   = 'beras';
        document.getElementById('fg-insektisida').value = 'alfastore';
        ['fg-r-lantai','fg-r-teras','fg-r-total',
         'fg-r-lantai-rumus','fg-r-teras-rumus'].forEach(id => document.getElementById(id).textContent = '—');
        document.getElementById('hasil-fogging').classList.remove('visible');
    }
}

document.getElementById('s-lingkungan-label').addEventListener('click', function() {
    const cb    = document.getElementById('s-lingkungan');
    const box   = document.getElementById('s-lingkungan-box');
    const check = document.getElementById('s-lingkungan-check');
    const label = document.getElementById('s-lingkungan-label');

    cb.checked = !cb.checked;

    if (cb.checked) {
        box.style.background    = '#1a6ef5';
        box.style.borderColor   = '#1a6ef5';
        check.style.display     = 'block';
        label.style.borderColor = '#1a6ef5';
        label.style.background  = '#e8f0fe';
    } else {
        box.style.background    = '#fff';
        box.style.borderColor   = '#e2e8f0';
        check.style.display     = 'none';
        label.style.borderColor = '#e2e8f0';
        label.style.background  = '#f8fafc';
    }
});

// ==============================
// INISIALISASI
// ==============================

onKomoditasChange();
onFumiganChange();
