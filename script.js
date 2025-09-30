(function () {
  const form = document.getElementById('ageForm');
  const result = document.getElementById('result');
  const birthInput = document.getElementById('birthdate');

  const fmt = (d) =>
    d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  // Season year: Aug (7) or later -> this year; else previous year
  const getSeasonYear = (refDate = new Date()) =>
    (refDate.getMonth() >= 7 ? refDate.getFullYear() : refDate.getFullYear() - 1);

  // Date ctor with 0-based month
  const D = (y, m, day) => new Date(y, m, day);

  // Build USAWP windows (inclusive): Aug 1 (prev) .. Jul 31
  const buildRanges = (seasonYear) => ([
    { label: 'Splashball', start: D(seasonYear - 8, 7, 1), end: D(seasonYear - 6, 6, 31) },
    { label: '10U', start: D(seasonYear - 10,7, 1), end: D(seasonYear - 8, 6, 31) },
    { label: '12U', start: D(seasonYear - 12,7, 1), end: D(seasonYear - 10,6, 31) },
    { label: '14U', start: D(seasonYear - 14,7, 1), end: D(seasonYear - 12,6, 31) },
    { label: '16U', start: D(seasonYear - 16,7, 1), end: D(seasonYear - 14,6, 31) },
    { label: '18U', start: D(seasonYear - 18,7, 1), end: D(seasonYear - 16,6, 31) },
  ]);

  const findGroup = (birthdate, ranges) => {
    for (const r of ranges) {
      if (birthdate >= r.start && birthdate <= r.end) return r;
    }
    return null;
  };

  const show = (html) => { result.innerHTML = html; };

  function parseBirthdate(raw) {
    if (!raw) return NaN;

    let s = String(raw).trim().toLowerCase();

    // normalize spaces
    s = s.replace(/\s+/g, ' ');

    // fix common month misspellings/variants
    // "agust" -> "august"; allow "sept" -> "september"
    s = s.replace(/\bagust\b/g, 'august')
         .replace(/\bsept\b/g, 'september');

    // remove ordinal suffixes: 1st -> 1, 2nd -> 2, etc.
    s = s.replace(/\b(\d{1,2})(st|nd|rd|th)\b/g, '$1');

    // Try ISO: YYYY-MM-DD
    let m;
    m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) {
      const [_, Y, M, Dd] = m.map(Number);
      return safeDate(Y, M, Dd);
    }

    // Try US numeric: MM/DD/YYYY or MM-DD-YYYY
    m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (m) {
      const [, Mm, Dd, Yy] = m;
      return safeDate(Number(Yy), Number(Mm), Number(Dd));
    }

    // Try "Month D, YYYY" or "Mon D YYYY"
    const months = {
      jan:0, january:0, feb:1, february:1, mar:2, march:2, apr:3, april:3,
      may:4, jun:5, june:5, jul:6, july:6, aug:7, august:7, sep:8, sept:8, september:8,
      oct:9, october:9, nov:10, november:10, dec:11, december:11
    };

    m = s.match(/^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);
    if (m) {
      const mon = months[m[1]];
      const day = Number(m[2]);
      const year = Number(m[3]);
      if (mon !== undefined) return safeDate(year, mon + 1, day);
    }

    // As a last resort, let Date try (may be locale specific). If NaN, fail.
    const fallback = new Date(raw);
    return isNaN(fallback.getTime()) ? NaN : fallback;
  }

  // Construct a date safely using y, m(1-12), d with validation (no timezone drift)
  function safeDate(y, m1, d) {
    if (!Number.isInteger(y) || !Number.isInteger(m1) || !Number.isInteger(d)) return NaN;
    const dt = new Date(y, m1 - 1, d);
    // Validate that JS didn't roll the date (e.g., 2024-02-30 -> Mar 1)
    if (dt.getFullYear() !== y || dt.getMonth() !== m1 - 1 || dt.getDate() !== d) return NaN;
    return dt;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const raw = birthInput.value;
    if (!raw) {
      show('<p>Please enter a birthdate.</p>');
      return;
    }

    const birthdate = parseBirthdate(raw);

    if (!(birthdate instanceof Date) || isNaN(birthdate.getTime())) {
      show('<p>That date looks invalid. Try formats like <em>Aug 1 2012</em>, <em>08/01/2012</em>, or <em>2012-08-01</em>.</p>');
      return;
    }

    const seasonYear = getSeasonYear();
    const ranges = buildRanges(seasonYear);
    const match = findGroup(birthdate, ranges);

    if (!match) {
      show(`
        <div class="result not-eligible">
          <strong>Age Group:</strong> Not Eligible
          <p><em>Season Year:</em> ${seasonYear} (eligibility is based on birthdate as of Aug 1)</p>
        </div>
      `);
      return;
    }

    show(`
      <div class="result ok">
        <strong>Age Group:</strong> ${match.label}<br/>
        <small>
          Season Year: ${seasonYear} &middot;
          Eligible if born ${fmt(match.start)}&nbsp;&ndash;&nbsp;${fmt(match.end)}
        </small>
      </div>
    `);
  });
})();
