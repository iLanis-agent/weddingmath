/* WeddingMath engine - the budget against the guest list. Pure math, no DOM. */
(function (root) {
  'use strict';

  // Weights for every category EXCEPT catering (catering is per-head reality).
  var WEIGHTS = [
    ['Venue', 22], ['Photo + video', 12], ['Attire + beauty', 9], ['Flowers + decor', 9],
    ['Music + entertainment', 8], ['Rings', 5], ['Cake', 4], ['Invites + paper', 3],
    ['Transport', 3], ['Favors + gifts', 2], ['Misc + tips', 6], ['Contingency (the famous 10%)', 17]
  ];

  function num(v, name) {
    var n = typeof v === 'string' ? parseFloat(v) : v;
    if (typeof n !== 'number' || !isFinite(n) || isNaN(n)) throw new Error(name + ' must be a number');
    return n;
  }
  function round2(x) { return Math.round(x * 100) / 100; }

  function weightSum() {
    return WEIGHTS.reduce(function (s, w) { return s + w[1]; }, 0);
  }

  function analyze(o) {
    if (!o || typeof o !== 'object') throw new Error('options required');
    var budget = num(o.budget === undefined ? 30000 : o.budget, 'budget');
    if (budget <= 0 || budget > 5000000) throw new Error('budget must be in (0, 5000000]');
    var guests = num(o.guests === undefined ? 100 : o.guests, 'guests');
    if (guests < 1 || guests > 1000 || Math.round(guests) !== guests) throw new Error('guests must be a whole number in [1, 1000]');
    var perHead = num(o.perHead === undefined ? 95 : o.perHead, 'perHead');
    if (perHead < 0 || perHead > 2000) throw new Error('perHead must be in [0, 2000]');
    var partyHours = num(o.partyHours === undefined ? 5 : o.partyHours, 'partyHours');
    if (partyHours <= 0 || partyHours > 24) throw new Error('partyHours must be in (0, 24]');

    var catering = perHead * guests;
    var cateringShare = catering / budget;
    var remaining = budget - catering;
    var overBy = 0;
    if (remaining < 0) { overBy = -remaining; remaining = 0; }

    var sum = weightSum();
    var rows = [];
    var allocated = 0;
    WEIGHTS.forEach(function (w, i) {
      var amt;
      if (i === WEIGHTS.length - 1) amt = remaining - allocated; // last row absorbs rounding
      else { amt = Math.round(remaining * w[1] / sum); allocated += amt; }
      rows.push({ category: w[0], amount: round2(amt), pct: budget > 0 ? round2(amt / budget * 100) : 0 });
    });

    var allocatedTotal = remaining + catering;
    var costPerGuest = budget / guests;
    var costPerGuestHour = budget / (guests * partyHours);

    var verdict;
    if (cateringShare > 1) verdict = 'over';
    else if (cateringShare > 0.55) verdict = 'catering-heavy';
    else verdict = 'fits';

    return {
      budget: round2(budget),
      guests: guests,
      catering: round2(catering),
      cateringPct: round2(cateringShare * 100),
      remainingForRest: round2(remaining),
      overBy: round2(overBy),
      rows: rows,
      allocatedTotal: round2(allocatedTotal),
      costPerGuest: round2(costPerGuest),
      costPerGuestHour: round2(costPerGuestHour),
      perHeadFits: catering <= budget,
      verdict: verdict,
      maxPerHeadForFit: Math.floor((budget * 0.55) / guests)
    };
  }

  var api = { analyze: analyze, WEIGHTS: WEIGHTS, weightSum: weightSum };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WeddingMathEngine = api;
})(typeof self !== 'undefined' ? self : this);
