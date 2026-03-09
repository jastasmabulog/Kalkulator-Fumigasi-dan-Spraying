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
    phostek:  2,
    delicia:  2,
    fumiphos: 2,
    custom:   null
};

// ==============================
// TAB SWITCH
// ==============================

function switchTab(tab) {
    document.getElementById('tab-fumigasi').style.display = tab === 'fumigasi' ? 'block' : 'none';
    document.getElementById('tab-spraying').style.display = tab === 'spraying' ? 'block' : 'none';
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
    document.getElementById('f-broken-ton').value = brokenTon.toFixed(3);
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

function konversiBrokenSpace(brokenM3, stowage) {
    if (stowage <= 0) return 0;
    return brokenM3 * stowage;
}

function hitungFumigasi() {
    const qty          = parseFloat(document.getElementById('f-qty').value) || 0;
    const brokenM3     = parseFloat(document.getElementById('f-broken-m3').value) || 0;
    const stowage      = parseFloat(document.getElementById('f-stowage').value) || 0;
    const dosis        = parseFloat(document.getElementById('f-dosis').value) || 0;
    const komoditiEl   = document.getElementById('f-commodity');
    const komoditiNama = komoditiEl.options[komoditiEl.selectedIndex].text;
    const fumiganEl    = document.getElementById('f-fumigan');
    const fumiganNama  = fumiganEl.options[fumiganEl.selectedIndex].text.trim();

    const brokenTon   = konversiBrokenSpace(brokenM3, stowage);
    const totalTon    = qty + brokenTon;
    const totalTablet = totalTon * dosis;

    document.getElementById('f-resultInfo').innerHTML =
        `<span class="info-tag">${komoditiNama}</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${qty} ton</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${fumiganNama}</span>`;

    document.getElementById('f-resTumpukan').textContent  = qty.toFixed(2) + ' ton';
    document.getElementById('f-resBroken').textContent    = brokenTon.toFixed(3) + ' ton';
    document.getElementById('f-resVolTotal').textContent  = totalTon.toFixed(3) + ' ton';
    document.getElementById('f-resDosis').textContent     = dosis + ' tablet/ton';
    document.getElementById('f-resFumigan').textContent   = totalTablet.toLocaleString('id-ID', { minimumFractionDigits: 0 }) + ' tablet';
    document.getElementById('f-resFumiganKg').textContent = totalTablet.toFixed(0) + ' tablet';

    tampilkanHasil('hasil-fumigasi');
}

// ==============================
// SPRAYING - KALKULASI AREA
// ==============================

function kalkulasiSpraying(p, l, t, teras, stapel, lantai) {
    const dindingPanjang = 2 * 2 * (p * t);
    const dindingLebar   = 2 * 2 * (l * t);
    const atap           = 2 * (p * l);
    const terasArea      = 2 * (p * teras) + 2 * (l * teras);
    const stapelArea     = (stapel * 174) / 150;
    const subtotal       = dindingPanjang + dindingLebar + atap + terasArea + stapelArea;
    const lantaiTidak    = (lantai * 1) / 3.1;
    const total          = subtotal - lantaiTidak;

    return { dindingPanjang, dindingLebar, atap, terasArea, stapelArea, subtotal, lantaiTidak, total };
}

function updateSpraying() {
    const p      = parseFloat(document.getElementById('s-panjang').value) || 0;
    const l      = parseFloat(document.getElementById('s-lebar').value) || 0;
    const t      = parseFloat(document.getElementById('s-tinggi').value) || 0;
    const teras  = parseFloat(document.getElementById('s-teras').value) || 0;
    const stapel = parseFloat(document.getElementById('s-stapel').value) || 0;
    const lantai = parseFloat(document.getElementById('s-lantai').value) || 0;

    const r = kalkulasiSpraying(p, l, t, teras, stapel, lantai);

    document.getElementById('r-dinding-panjang-rumus').textContent = `2 × 2 × (${p} × ${t})`;
    document.getElementById('r-dinding-lebar-rumus').textContent   = `2 × 2 × (${l} × ${t})`;
    document.getElementById('r-atap-rumus').textContent            = `2 × (${p} × ${l})`;
    document.getElementById('r-teras-rumus').textContent           = `2×(${p}×${teras}) + 2×(${l}×${teras})`;
    document.getElementById('r-stapel-rumus').textContent          = `${stapel} × 174 ÷ 150`;
    document.getElementById('r-lantai-rumus').textContent          = `${lantai} × 1 ÷ 3.1`;

    document.getElementById('r-dinding-panjang').textContent = r.dindingPanjang.toFixed(2) + ' m²';
    document.getElementById('r-dinding-lebar').textContent   = r.dindingLebar.toFixed(2) + ' m²';
    document.getElementById('r-atap').textContent            = r.atap.toFixed(2) + ' m²';
    document.getElementById('r-teras').textContent           = r.terasArea.toFixed(2) + ' m²';
    document.getElementById('r-stapel').textContent          = r.stapelArea.toFixed(2) + ' m²';
    document.getElementById('r-subtotal').textContent        = r.subtotal.toFixed(2) + ' m²';
    document.getElementById('r-lantai').textContent          = '− ' + r.lantaiTidak.toFixed(2) + ' m²';
    document.getElementById('r-total').textContent           = r.total.toFixed(2) + ' m²';
}

function hitungSpraying() {
    const p              = parseFloat(document.getElementById('s-panjang').value) || 0;
    const l              = parseFloat(document.getElementById('s-lebar').value) || 0;
    const t              = parseFloat(document.getElementById('s-tinggi').value) || 0;
    const teras          = parseFloat(document.getElementById('s-teras').value) || 0;
    const stapel         = parseFloat(document.getElementById('s-stapel').value) || 0;
    const lantai         = parseFloat(document.getElementById('s-lantai').value) || 0;
    const dosis          = parseFloat(document.getElementById('s-dosis').value) || 0;
    const komoditiEl     = document.getElementById('s-commodity');
    const komoditi       = komoditiEl.options[komoditiEl.selectedIndex].text;
    const insektisidaEl  = document.getElementById('s-insektisida');
    const insektisida    = insektisidaEl.options[insektisidaEl.selectedIndex].text;

    const r          = kalkulasiSpraying(p, l, t, teras, stapel, lantai);
    const totalMl    = r.total * dosis;
    const totalLiter = totalMl / 1000;

    updateSpraying();

    document.getElementById('s-resultInfo').innerHTML =
        `<span class="info-tag">${komoditi}</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${insektisida}</span>
         <span class="info-sep">·</span>
         <span class="info-tag">${dosis} ml/m²</span>`;

    document.getElementById('s-resDindingP').textContent = r.dindingPanjang.toFixed(2) + ' m²';
    document.getElementById('s-resDindingL').textContent = r.dindingLebar.toFixed(2) + ' m²';
    document.getElementById('s-resAtap').textContent     = r.atap.toFixed(2) + ' m²';
    document.getElementById('s-resTeras').textContent    = r.terasArea.toFixed(2) + ' m²';
    document.getElementById('s-resStapel').textContent   = r.stapelArea.toFixed(2) + ' m²';
    document.getElementById('s-resLantai').textContent   = '− ' + r.lantaiTidak.toFixed(2) + ' m²';
    document.getElementById('s-resTotal').textContent    = r.total.toFixed(2) + ' m²';
    document.getElementById('s-resPestisida').textContent =
        totalMl.toLocaleString('id-ID', { minimumFractionDigits: 2 }) + ' ml' +
        (totalLiter >= 1 ? ` (${totalLiter.toFixed(2)} liter)` : '');

    tampilkanHasil('hasil-spraying');
}

// ==============================
// HELPER
// ==============================

function tampilkanHasil(id) {
    const el = document.getElementById(id);
    el.classList.add('visible');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==============================
// INISIALISASI
// ==============================

onKomoditasChange();
onFumiganChange();