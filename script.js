(function () {
  var D = window.TEST_BATTING_DATA;
  var P = D.map(function (a) {
    return { name: a[0], country: a[1], span: a[2], mat: a[3], inn: a[4], no: a[5], runs: a[6],
             hs: a[7], hsn: a[8], avg: a[9], h: a[10], f: a[11], d: a[12], cy: a[13], cat: a[14], dec: a[15] };
  });
  var NAMES = { ENG: 'England', AUS: 'Australia', INDIA: 'India', WI: 'West Indies', SA: 'South Africa', PAK: 'Pakistan',
                NZ: 'New Zealand', SL: 'Sri Lanka', BDESH: 'Bangladesh', ZIM: 'Zimbabwe', AFG: 'Afghanistan', IRE: 'Ireland' };
  var fi = function (n) { return Number(n).toLocaleString('en-US'); };
  var f1 = function (n) { return Number(n).toFixed(1); };
  var f2 = function (n) { return Number(n).toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  P.forEach(function (p) {
    p.cn = NAMES[p.country] || p.country;
    p.q = p.runs >= 1000;
    p.rpm = p.runs / p.mat;
    p.conv = (p.h + p.f) > 0 ? p.h / (p.h + p.f) * 100 : null;
    p.start = parseInt(p.span, 10);
  });

  /* ---------- country and decade totals ---------- */
  var byC = {}, byD = {}, byCat = {};
  P.forEach(function (p) {
    var c = byC[p.cn] || (byC[p.cn] = { label: p.cn, players: 0, mat: 0, runs: 0, h: 0, q: 0, sum: 0 });
    c.players++; c.mat += p.mat; c.runs += p.runs; c.h += p.h; if (p.q) { c.q++; c.sum += p.avg; }
    var k = p.dec + 's';
    var d = byD[k] || (byD[k] = { label: k, dec: p.dec, players: 0, runs: 0, h: 0, q: 0, sum: 0 });
    d.players++; d.runs += p.runs; d.h += p.h; if (p.q) { d.q++; d.sum += p.avg; }
    var g = byCat[p.cat] || (byCat[p.cat] = { label: p.cat, players: 0, runs: 0, h: 0 });
    g.players++; g.runs += p.runs; g.h += p.h;
  });
  var countries = Object.keys(byC).map(function (k) { var c = byC[k]; c.mean = c.q ? c.sum / c.q : null; c.rpp = c.runs / c.players; return c; });
  var decades = Object.keys(byD).map(function (k) { var d = byD[k]; d.mean = d.q ? d.sum / d.q : null; return d; });
  var CATS = [['Legend', '8,000+ runs'], ['Great', '5,000 to 7,999'], ['Established', '2,000 to 4,999'], ['Regular', '500 to 1,999'], ['Fringe', 'under 500']];
  var cats = CATS.map(function (c) { var g = byCat[c[0]]; g.rule = c[1]; return g; });
  var COLOR_SLOT = {};
  countries.slice().sort(function (a, b) { return b.runs - a.runs; }).forEach(function (c, i) { COLOR_SLOT[c.label] = i; });
  var totalRuns = P.reduce(function (s, p) { return s + p.runs; }, 0);
  var totalH = P.reduce(function (s, p) { return s + p.h; }, 0);
  var firstYear = Math.min.apply(null, P.map(function (p) { return p.start; }));
  var lastYear = Math.max.apply(null, P.map(function (p) { return parseInt(p.span.split('-')[1], 10); }));
  var qCount = P.filter(function (p) { return p.q; }).length;

  document.getElementById('facts').innerHTML =
    [['Players', fi(P.length)], ['Runs', fi(totalRuns)], ['Hundreds', fi(totalH)], ['Careers', firstYear + '–' + lastYear]]
      .map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>'; }).join('');

  /* ---------- table column kits ---------- */
  var PC = {
    name:   { label: 'Player', cls: 'nm', get: function (p) { return p.name; } },
    country:{ label: 'Country', get: function (p) { return p.cn; } },
    span:   { label: 'Span', get: function (p) { return p.span; } },
    mat:    { label: 'Mat', num: 1, get: function (p) { return fi(p.mat); } },
    inn:    { label: 'Inn', num: 1, get: function (p) { return fi(p.inn); } },
    runs:   { label: 'Runs', num: 1, get: function (p) { return fi(p.runs); } },
    hs:     { label: 'HS', num: 1, get: function (p) { return p.hs || '–'; } },
    avg:    { label: 'Avg', num: 1, get: function (p) { return p.avg == null ? '–' : f2(p.avg); } },
    h:      { label: '100s', num: 1, get: function (p) { return fi(p.h); } },
    f:      { label: '50s', num: 1, get: function (p) { return fi(p.f); } },
    d:      { label: 'Ducks', num: 1, get: function (p) { return fi(p.d); } },
    conv:   { label: 'Conversion %', num: 1, get: function (p) { return p.conv == null ? '–' : f1(p.conv); } },
    rpm:    { label: 'Runs / Mat', num: 1, get: function (p) { return f2(p.rpm); } },
    cy:     { label: 'Career yrs', num: 1, get: function (p) { return fi(p.cy); } },
    no:     { label: 'Not outs', num: 1, get: function (p) { return fi(p.no); } }
  };
  var BASE = ['name', 'country', 'span', 'mat', 'inn', 'runs', 'hs', 'avg', 'h', 'f', 'd'];

  /* ---------- sorting options ---------- */
  var METRICS = {};
  var ORDER = [];
  function add(grp, m) { m.grp = grp; METRICS[m.id] = m; ORDER.push(m.id); }

  function playerMetric(id, label, note, o) {
    add('Players', {
      id: id, label: label, note: note, unit: 'players',
      build: function (n) {
        var elig = P.filter(o.filter || function () { return true; });
        elig.sort(function (a, b) { return (o.val(b) - o.val(a)) || (b.runs - a.runs); });
        var shown = elig.slice(0, n);
        var keys = BASE.slice();
        if (BASE.indexOf(o.col) < 0) keys.push(o.col);
        var counts = {};
        shown.forEach(function (p) { counts[p.cn] = (counts[p.cn] || 0) + 1; });
        return {
          eligible: elig.length, shown: shown.length,
          items: shown.map(function (p) {
            return { label: p.name, value: o.val(p), disp: o.disp ? o.disp(p) : fi(o.val(p)),
                     tip: p.name + ' (' + p.cn + ')\n' + o.tipLabel + ': ' + (o.disp ? o.disp(p) : o.val(p)) + '\n' + p.span + ' · ' + p.mat + ' Tests · ' + fi(p.runs) + ' runs' };
          }),
          barTitle: 'Top ' + shown.length + ' by ' + o.tipLabel.toLowerCase(), barSub: 'Bars start at zero',
          table: { cols: keys.map(function (k) { return PC[k]; }), hl: o.col, rows: shown, keyOf: function (c) { return keys.indexOf(o.col) >= 0 && PC[o.col] === c; } },
          pie: { title: 'Countries in this top ' + shown.length, sub: 'Number of players from each country', unit: 'players', entity: 'country',
                 items: Object.keys(counts).map(function (k) { return { name: k, value: counts[k] }; }) }
        };
      }
    });
  }
  var Q = function (p) { return p.runs >= 1000; };
  playerMetric('runs', 'Most runs', 'Career Test runs, all 3,001 players.', { col: 'runs', val: function (p) { return p.runs; }, tipLabel: 'Runs' });
  playerMetric('avg', 'Highest batting average', 'Players with 1,000 or more career runs.', { col: 'avg', filter: Q, val: function (p) { return p.avg; }, disp: function (p) { return f2(p.avg); }, tipLabel: 'Average' });
  playerMetric('h', 'Most hundreds', 'Career centuries, all players.', { col: 'h', val: function (p) { return p.h; }, tipLabel: 'Hundreds' });
  playerMetric('f', 'Most fifties', 'Career half centuries, all players.', { col: 'f', val: function (p) { return p.f; }, tipLabel: 'Fifties' });
  playerMetric('mat', 'Most Tests played', 'Matches played, all players.', { col: 'mat', val: function (p) { return p.mat; }, tipLabel: 'Matches' });
  playerMetric('inn', 'Most innings batted', 'Innings batted, all players.', { col: 'inn', val: function (p) { return p.inn; }, tipLabel: 'Innings' });
  playerMetric('hs', 'Highest individual score', 'Best single innings. A star means not out.', { col: 'hs', filter: function (p) { return p.hsn != null; }, val: function (p) { return p.hsn; }, disp: function (p) { return p.hs; }, tipLabel: 'Highest score' });
  playerMetric('d', 'Most ducks', 'Innings ended on zero, all players.', { col: 'd', val: function (p) { return p.d; }, tipLabel: 'Ducks' });
  playerMetric('no', 'Most not outs', 'Innings finished not out, all players.', { col: 'no', val: function (p) { return p.no; }, tipLabel: 'Not outs' });
  playerMetric('conv', 'Best century conversion', 'Hundreds as a share of all 50+ scores (hundreds ÷ hundreds + fifties). Players with 1,000+ runs and at least 10 hundreds.', { col: 'conv', filter: function (p) { return p.q && p.h >= 10; }, val: function (p) { return p.conv; }, disp: function (p) { return f1(p.conv) + '%'; }, tipLabel: 'Conversion' });
  playerMetric('rpm', 'Highest runs per match', 'Runs divided by Tests played. Players with 1,000 or more career runs.', { col: 'rpm', filter: Q, val: function (p) { return p.rpm; }, disp: function (p) { return f2(p.rpm); }, tipLabel: 'Runs per match' });
  playerMetric('cy', 'Longest career', 'Years between first and last Test. Ties are ordered by runs.', { col: 'cy', val: function (p) { return p.cy; }, disp: function (p) { return p.cy + ' yrs'; }, tipLabel: 'Career length' });

  function groupMetric(grp, id, label, note, o) {
    add(grp, {
      id: id, label: label, note: note, unit: o.unit,
      build: function (n) {
        var elig = o.list.filter(o.filter || function () { return true; });
        elig.sort(o.order || function (a, b) { return o.val(b) - o.val(a); });
        var shown = elig.slice(0, n);
        return {
          eligible: elig.length, shown: shown.length,
          items: shown.map(function (r) { return { label: r.label, value: o.val(r), disp: o.disp(r), tip: r.label + '\n' + o.tipLabel + ': ' + o.disp(r) }; }),
          barTitle: o.tipLabel + ' by ' + o.by, barSub: 'Bars start at zero',
          table: { cols: o.cols, hl: o.hl, rows: shown, keyOf: function (c) { return c === o.hlCol; } },
          pie: { title: o.pie.title, sub: o.pie.sub, unit: o.pie.unit, entity: o.pie.entity,
                 items: elig.map(function (r) { return { name: r.label, value: o.pie.val(r) }; }).filter(function (x) { return x.value > 0; }) }
        };
      }
    });
  }
  var G = function (label, get, num, cls) { return { label: label, get: get, num: num, cls: cls }; };
  var cName = G('Country', function (r) { return r.label; }, 0, 'nm');
  var cPlayers = G('Players', function (r) { return fi(r.players); }, 1);
  var cMat = G('Tests played', function (r) { return fi(r.mat); }, 1);
  var cRuns = G('Runs', function (r) { return fi(r.runs); }, 1);
  var cH = G('Hundreds', function (r) { return fi(r.h); }, 1);
  var cQ = G('1,000+ run batters', function (r) { return fi(r.q); }, 1);
  var cMean = G('Mean average', function (r) { return r.mean == null ? '–' : f2(r.mean); }, 1);
  var cRpp = G('Runs / player', function (r) { return fi(Math.round(r.rpp)); }, 1);
  var countryCols = [cName, cPlayers, cMat, cRuns, cH, cQ, cMean, cRpp];
  var cEntity = 'country';
  groupMetric('Countries', 'c_runs', 'Country: total runs', 'Every run scored by each country\'s players.', { list: countries, val: function (r) { return r.runs; }, disp: function (r) { return fi(r.runs); }, tipLabel: 'Total runs', by: 'country', unit: 'countries', cols: countryCols, hlCol: cRuns, pie: { title: 'Share of all runs', sub: 'Each country\'s part of the dataset\'s total runs', unit: 'runs', entity: cEntity, val: function (r) { return r.runs; } } });
  groupMetric('Countries', 'c_h', 'Country: total hundreds', 'Centuries scored by each country\'s players.', { list: countries, val: function (r) { return r.h; }, disp: function (r) { return fi(r.h); }, tipLabel: 'Total hundreds', by: 'country', unit: 'countries', cols: countryCols, hlCol: cH, pie: { title: 'Share of all hundreds', sub: 'Each country\'s part of all centuries', unit: 'hundreds', entity: cEntity, val: function (r) { return r.h; } } });
  groupMetric('Countries', 'c_players', 'Country: number of players', 'Players who have played Tests for each country.', { list: countries, val: function (r) { return r.players; }, disp: function (r) { return fi(r.players); }, tipLabel: 'Players', by: 'country', unit: 'countries', cols: countryCols, hlCol: cPlayers, pie: { title: 'Share of all players', sub: 'Each country\'s part of the 3,001 players', unit: 'players', entity: cEntity, val: function (r) { return r.players; } } });
  groupMetric('Countries', 'c_avg', 'Country: mean batting average', 'Mean of the averages of players with 1,000+ runs. Countries with at least 10 such players.', { list: countries, filter: function (r) { return r.q >= 10; }, val: function (r) { return r.mean; }, disp: function (r) { return f2(r.mean); }, tipLabel: 'Mean average', by: 'country', unit: 'countries', cols: countryCols, hlCol: cMean, pie: { title: '1,000+ run batters', sub: 'How many qualifying players each country has', unit: 'batters', entity: cEntity, val: function (r) { return r.q; } } });
  groupMetric('Countries', 'c_rpp', 'Country: runs per player', 'Total runs divided by players used. Countries with at least 50 players.', { list: countries, filter: function (r) { return r.players >= 50; }, val: function (r) { return r.rpp; }, disp: function (r) { return fi(Math.round(r.rpp)); }, tipLabel: 'Runs per player', by: 'country', unit: 'countries', cols: countryCols, hlCol: cRpp, pie: { title: 'Players per country', sub: 'Size of each country\'s player pool', unit: 'players', entity: cEntity, val: function (r) { return r.players; } } });

  var dName = G('Debut decade', function (r) { return r.label; }, 0, 'nm');
  var dPlayers = G('Players debuting', function (r) { return fi(r.players); }, 1);
  var dQ = G('1,000+ run batters', function (r) { return fi(r.q); }, 1);
  var dMean = G('Mean average', function (r) { return r.mean == null ? '–' : f2(r.mean); }, 1);
  var dRuns = G('Runs', function (r) { return fi(r.runs); }, 1);
  var dH = G('Hundreds', function (r) { return fi(r.h); }, 1);
  var decadeCols = [dName, dPlayers, dQ, dMean, dRuns, dH];
  groupMetric('Eras and categories', 'd_avg', 'Debut decade: mean batting average', 'Mean average of players with 1,000+ runs, grouped by the decade of their first Test. Decades with at least 10 such players.', { list: decades, filter: function (r) { return r.q >= 10; }, val: function (r) { return r.mean; }, disp: function (r) { return f2(r.mean); }, tipLabel: 'Mean average', by: 'debut decade', unit: 'decades', cols: decadeCols, hlCol: dMean, pie: { title: '1,000+ run batters', sub: 'How many qualifying players debuted in each decade', unit: 'batters', entity: 'decade', val: function (r) { return r.q; } } });
  groupMetric('Eras and categories', 'd_players', 'Debut decade: players debuting', 'How many players made their Test debut in each decade.', { list: decades, val: function (r) { return r.players; }, disp: function (r) { return fi(r.players); }, tipLabel: 'Players debuting', by: 'debut decade', unit: 'decades', cols: decadeCols, hlCol: dPlayers, pie: { title: 'Debuts by decade', sub: 'Share of all 3,001 players', unit: 'players', entity: 'decade', val: function (r) { return r.players; } } });
  var kName = G('Category', function (r) { return r.label; }, 0, 'nm');
  var kRule = G('Career runs', function (r) { return r.rule; }, 0);
  var kPlayers = G('Players', function (r) { return fi(r.players); }, 1);
  var kShare = G('% of players', function (r) { return f1(r.players / P.length * 100) + '%'; }, 1);
  var kRuns = G('Total runs', function (r) { return fi(r.runs); }, 1);
  var kH = G('Hundreds', function (r) { return fi(r.h); }, 1);
  groupMetric('Eras and categories', 'cat', 'Player category: number of players', 'Players grouped by career runs: Legend, Great, Established, Regular and Fringe.', { list: cats, val: function (r) { return r.players; }, disp: function (r) { return fi(r.players); }, tipLabel: 'Players', by: 'category', unit: 'categories', cols: [kName, kRule, kPlayers, kShare, kRuns, kH], hlCol: kPlayers, pie: { title: 'Share of players', sub: 'Most players have fewer than 500 career runs', unit: 'players', entity: 'category', val: function (r) { return r.players; } } });

  /* ---------- dropdown ---------- */
  var sel = document.getElementById('sort');
  var lastGrp = null, og = null;
  ORDER.forEach(function (id) {
    var m = METRICS[id];
    if (m.grp !== lastGrp) { og = document.createElement('optgroup'); og.label = m.grp; sel.appendChild(og); lastGrp = m.grp; }
    var o = document.createElement('option'); o.value = id; o.textContent = m.label; og.appendChild(o);
  });
  var topSel = document.getElementById('topn');

  /* ---------- renderers ---------- */
  function renderBars(items) {
    var max = Math.max.apply(null, items.map(function (i) { return i.value; })) || 1;
    document.getElementById('bars').innerHTML = items.map(function (it, i) {
      var w = Math.max(0, it.value / max * 100);
      return '<div class="brow" data-tip="' + esc(it.tip) + '"><span class="rk">' + (i + 1) + '</span><span class="nm" title="' + esc(it.label) + '">' + esc(it.label) +
             '</span><span class="tr"><span class="fl" style="display:block;width:' + w.toFixed(2) + '%"></span></span><span class="vl">' + esc(it.disp) + '</span></div>';
    }).join('');
  }
  function colorFor(name, idx, entity) {
    if (name === 'Other') return 'var(--other)';
    if (entity === 'country' && COLOR_SLOT[name] != null && COLOR_SLOT[name] < 8) return 'var(--s' + (COLOR_SLOT[name] + 1) + ')';
    return 'var(--s' + (idx + 1) + ')';
  }
  function renderPie(p) {
    var items = p.items.slice().sort(function (a, b) { return b.value - a.value; });
    if (items.length > 8) {
      var rest = items.slice(7).reduce(function (s, x) { return s + x.value; }, 0);
      items = items.slice(0, 7); items.push({ name: 'Other', value: rest });
    }
    var total = items.reduce(function (s, x) { return s + x.value; }, 0) || 1;
    var cx = 110, cy = 110, r = 104, ang = -Math.PI / 2, svg = '';
    var used = {};
    items.forEach(function (it, i) {
      it.pct = it.value / total * 100;
      var col = colorFor(it.name, i, p.entity);
      it.col = col;
      var tip = esc(it.name + '\n' + fi(it.value) + ' ' + p.unit + ' · ' + f1(it.pct) + '%');
      if (items.length === 1) {
        svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + col + '" data-tip="' + tip + '"></circle>';
        return;
      }
      var a2 = ang + it.value / total * Math.PI * 2;
      var x1 = cx + r * Math.cos(ang), y1 = cy + r * Math.sin(ang), x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      svg += '<path d="M' + cx + ' ' + cy + ' L' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A' + r + ' ' + r + ' 0 ' + (a2 - ang > Math.PI ? 1 : 0) + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z" fill="' + col + '" data-tip="' + tip + '"></path>';
      ang = a2;
    });
    document.getElementById('pie').innerHTML = '<svg viewBox="0 0 220 220" role="img" aria-label="' + esc(p.title) + '">' + svg + '</svg>';
    document.getElementById('legend').innerHTML = items.map(function (it) {
      return '<li data-tip="' + esc(it.name + '\n' + fi(it.value) + ' ' + p.unit + ' · ' + f1(it.pct) + '%') + '"><span class="sw" style="background:' + it.col + '"></span><span class="ln">' + esc(it.name) + '</span><span class="lv">' + fi(it.value) + '</span><span class="lp">' + f1(it.pct) + '%</span></li>';
    }).join('');
  }
  function renderTable(t) {
    var head = '<th class="num">#</th>' + t.cols.map(function (c) {
      return '<th class="' + (c.num ? 'num' : '') + (t.keyOf(c) ? ' hl' : '') + '">' + esc(c.label) + '</th>';
    }).join('');
    var body = t.rows.map(function (r, i) {
      return '<tr><td class="rk">' + (i + 1) + '</td>' + t.cols.map(function (c) {
        return '<td class="' + [c.num ? 'num' : '', c.cls || '', t.keyOf(c) ? 'hl' : ''].join(' ').trim() + '">' + esc(c.get(r)) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    document.getElementById('tbl').innerHTML = '<thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody>';
  }
  function render() {
    var m = METRICS[sel.value];
    var v = m.build(parseInt(topSel.value, 10));
    document.getElementById('vh').textContent = m.label;
    document.getElementById('vn').textContent = m.note + ' Showing ' + v.shown + ' of ' + fi(v.eligible) + ' ' + m.unit + ', sorted high to low.';
    document.getElementById('barT').textContent = v.barTitle;
    document.getElementById('barS').textContent = v.barSub;
    document.getElementById('pieT').textContent = v.pie.title;
    document.getElementById('pieS').textContent = v.pie.sub;
    document.getElementById('tblT').textContent = 'Sorted table';
    document.getElementById('tblS').textContent = 'Highlighted column is the one used for sorting. Scroll sideways on a small screen.';
    renderBars(v.items); renderPie(v.pie); renderTable(v.table);
  }
  sel.addEventListener('change', render);
  topSel.addEventListener('change', render);
  var h = (location.hash || '').replace('#', '');
  if (METRICS[h]) sel.value = h; else sel.value = 'runs';
  render();

  /* ---------- tooltip ---------- */
  var tip = document.getElementById('tip');
  function showTip(e) {
    var t = e.target.closest && e.target.closest('[data-tip]');
    if (!t) { tip.hidden = true; return; }
    tip.textContent = t.getAttribute('data-tip');
    tip.hidden = false;
    var w = tip.offsetWidth, hgt = tip.offsetHeight;
    var x = Math.min(e.clientX + 14, window.innerWidth - w - 8);
    var y = e.clientY + 16; if (y + hgt > window.innerHeight - 8) y = e.clientY - hgt - 12;
    tip.style.left = Math.max(8, x) + 'px'; tip.style.top = Math.max(8, y) + 'px';
  }
  document.addEventListener('pointermove', showTip);
  document.addEventListener('pointerdown', showTip);
  document.addEventListener('pointerleave', function () { tip.hidden = true; });
  window.addEventListener('scroll', function () { tip.hidden = true; }, { passive: true });
})();
