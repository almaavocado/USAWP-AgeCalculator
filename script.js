// script.js
(function () {
  const form = document.getElementById('ageForm');
  const result = document.getElementById('result');
  const birthInput = document.getElementById('birthdate');

  const fmt = (d) =>
    d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  // Determine the current "season year" (the Aug 1 that defines brackets)
  // If today's month is Aug (7) or later, seasonYear = this year; else last year.
  const getSeasonYear = (refDate = new Date()) =>
    (refDate.getMonth() >= 7 ? refDate.getFullYear() : refDate.getFullYear() - 1);

  // Helper to construct Date safely (months are 0-based: 7 = August, 6 = July)
  const D = (y, m, day) => new Date(y, m, day);

  // Build rolling, 2-year eligibility windows for the given season
  const buildRanges = (seasonYear) => ([
    { label: 'Splashball', start: D(seasonYear - 8, 7, 1),  end: D(seasonYear - 6, 6, 31) },
    { label: '10U', start: D(seasonYear - 10, 7, 1), end: D(seasonYear - 8, 6, 31) },
    { label: '12U', start: D(seasonYear - 12, 7, 1), end: D(seasonYear - 10, 6, 31) },
    { label: '14U', start: D(seasonYear - 14, 7, 1), end: D(seasonYear - 12, 6, 31) },
    { label: '16U', start: D(seasonYear - 16, 7, 1), end: D(seasonYear - 14, 6, 31) },
    { label: '18U', start: D(seasonYear - 18, 7, 1), end: D(seasonYear - 16, 6, 31) },
  ]);

  const findGroup = (birthdate, ranges) => {
    for (const r of ranges) {
      if (birthdate >= r.start && birthdate <= r.end) return r;
    }
    return null;
  };

  const show = (html) => {
    result.innerHTML = html;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const raw = birthInput.value;
    if (!raw) {
      show('<p>Please enter a birthdate.</p>');
      return;
    }

    const birthdate = new Date(raw);
    if (isNaN(birthdate.getTime())) {
      show('<p>That date looks invalid. Please try again.</p>');
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
