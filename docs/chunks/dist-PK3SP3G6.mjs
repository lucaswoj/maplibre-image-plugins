// node_modules/modern-palette/dist/index.mjs
var W = typeof window < "u";
var u = (1 << 16) - 1;
var _ = u * u;
var $ = (1 << 9) - 1;
var C = [
  0,
  20,
  40,
  60,
  80,
  99,
  119,
  139,
  159,
  179,
  199,
  219,
  241,
  264,
  288,
  313,
  340,
  367,
  396,
  427,
  458,
  491,
  526,
  562,
  599,
  637,
  677,
  718,
  761,
  805,
  851,
  898,
  947,
  997,
  1048,
  1101,
  1156,
  1212,
  1270,
  1330,
  1391,
  1453,
  1517,
  1583,
  1651,
  1720,
  1790,
  1863,
  1937,
  2013,
  2090,
  2170,
  2250,
  2333,
  2418,
  2504,
  2592,
  2681,
  2773,
  2866,
  2961,
  3058,
  3157,
  3258,
  3360,
  3464,
  3570,
  3678,
  3788,
  3900,
  4014,
  4129,
  4247,
  4366,
  4488,
  4611,
  4736,
  4864,
  4993,
  5124,
  5257,
  5392,
  5530,
  5669,
  5810,
  5953,
  6099,
  6246,
  6395,
  6547,
  6700,
  6856,
  7014,
  7174,
  7335,
  7500,
  7666,
  7834,
  8004,
  8177,
  8352,
  8528,
  8708,
  8889,
  9072,
  9258,
  9445,
  9635,
  9828,
  10022,
  10219,
  10417,
  10619,
  10822,
  11028,
  11235,
  11446,
  11658,
  11873,
  12090,
  12309,
  12530,
  12754,
  12980,
  13209,
  13440,
  13673,
  13909,
  14146,
  14387,
  14629,
  14874,
  15122,
  15371,
  15623,
  15878,
  16135,
  16394,
  16656,
  16920,
  17187,
  17456,
  17727,
  18001,
  18277,
  18556,
  18837,
  19121,
  19407,
  19696,
  19987,
  20281,
  20577,
  20876,
  21177,
  21481,
  21787,
  22096,
  22407,
  22721,
  23038,
  23357,
  23678,
  24002,
  24329,
  24658,
  24990,
  25325,
  25662,
  26001,
  26344,
  26688,
  27036,
  27386,
  27739,
  28094,
  28452,
  28813,
  29176,
  29542,
  29911,
  30282,
  30656,
  31033,
  31412,
  31794,
  32179,
  32567,
  32957,
  33350,
  33745,
  34143,
  34544,
  34948,
  35355,
  35764,
  36176,
  36591,
  37008,
  37429,
  37852,
  38278,
  38706,
  39138,
  39572,
  40009,
  40449,
  40891,
  41337,
  41785,
  42236,
  42690,
  43147,
  43606,
  44069,
  44534,
  45002,
  45473,
  45947,
  46423,
  46903,
  47385,
  47871,
  48359,
  48850,
  49344,
  49841,
  50341,
  50844,
  51349,
  51858,
  52369,
  52884,
  53401,
  53921,
  54445,
  54971,
  55500,
  56032,
  56567,
  57105,
  57646,
  58190,
  58737,
  59287,
  59840,
  60396,
  60955,
  61517,
  62082,
  62650,
  63221,
  63795,
  64372,
  64952,
  65535
];
var N = [
  0,
  6,
  13,
  18,
  22,
  25,
  28,
  31,
  34,
  36,
  38,
  40,
  42,
  44,
  46,
  48,
  50,
  51,
  53,
  54,
  56,
  57,
  59,
  60,
  61,
  62,
  64,
  65,
  66,
  67,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  82,
  83,
  84,
  85,
  86,
  86,
  87,
  88,
  89,
  90,
  91,
  91,
  92,
  93,
  94,
  95,
  95,
  96,
  97,
  98,
  98,
  99,
  100,
  101,
  101,
  102,
  103,
  103,
  104,
  105,
  106,
  106,
  107,
  108,
  108,
  109,
  110,
  110,
  111,
  111,
  112,
  113,
  113,
  114,
  115,
  115,
  116,
  116,
  117,
  118,
  118,
  119,
  119,
  120,
  121,
  121,
  122,
  122,
  123,
  123,
  124,
  125,
  125,
  126,
  126,
  127,
  127,
  128,
  128,
  129,
  129,
  130,
  130,
  131,
  132,
  132,
  133,
  133,
  134,
  134,
  135,
  135,
  136,
  136,
  137,
  137,
  138,
  138,
  139,
  139,
  140,
  140,
  140,
  141,
  141,
  142,
  142,
  143,
  143,
  144,
  144,
  145,
  145,
  146,
  146,
  147,
  147,
  147,
  148,
  148,
  149,
  149,
  150,
  150,
  151,
  151,
  151,
  152,
  152,
  153,
  153,
  154,
  154,
  154,
  155,
  155,
  156,
  156,
  156,
  157,
  157,
  158,
  158,
  159,
  159,
  159,
  160,
  160,
  161,
  161,
  161,
  162,
  162,
  163,
  163,
  163,
  164,
  164,
  165,
  165,
  165,
  166,
  166,
  166,
  167,
  167,
  168,
  168,
  168,
  169,
  169,
  169,
  170,
  170,
  171,
  171,
  171,
  172,
  172,
  172,
  173,
  173,
  174,
  174,
  174,
  175,
  175,
  175,
  176,
  176,
  176,
  177,
  177,
  177,
  178,
  178,
  179,
  179,
  179,
  180,
  180,
  180,
  181,
  181,
  181,
  182,
  182,
  182,
  183,
  183,
  183,
  184,
  184,
  184,
  185,
  185,
  185,
  186,
  186,
  186,
  187,
  187,
  187,
  188,
  188,
  188,
  189,
  189,
  189,
  190,
  190,
  190,
  191,
  191,
  191,
  192,
  192,
  192,
  193,
  193,
  193,
  193,
  194,
  194,
  194,
  195,
  195,
  195,
  196,
  196,
  196,
  197,
  197,
  197,
  198,
  198,
  198,
  198,
  199,
  199,
  199,
  200,
  200,
  200,
  201,
  201,
  201,
  201,
  202,
  202,
  202,
  203,
  203,
  203,
  204,
  204,
  204,
  204,
  205,
  205,
  205,
  206,
  206,
  206,
  206,
  207,
  207,
  207,
  208,
  208,
  208,
  208,
  209,
  209,
  209,
  210,
  210,
  210,
  210,
  211,
  211,
  211,
  212,
  212,
  212,
  212,
  213,
  213,
  213,
  214,
  214,
  214,
  214,
  215,
  215,
  215,
  215,
  216,
  216,
  216,
  217,
  217,
  217,
  217,
  218,
  218,
  218,
  218,
  219,
  219,
  219,
  220,
  220,
  220,
  220,
  221,
  221,
  221,
  221,
  222,
  222,
  222,
  222,
  223,
  223,
  223,
  224,
  224,
  224,
  224,
  225,
  225,
  225,
  225,
  226,
  226,
  226,
  226,
  227,
  227,
  227,
  227,
  228,
  228,
  228,
  228,
  229,
  229,
  229,
  229,
  230,
  230,
  230,
  230,
  231,
  231,
  231,
  231,
  232,
  232,
  232,
  232,
  233,
  233,
  233,
  233,
  234,
  234,
  234,
  234,
  235,
  235,
  235,
  235,
  236,
  236,
  236,
  236,
  237,
  237,
  237,
  237,
  238,
  238,
  238,
  238,
  239,
  239,
  239,
  239,
  239,
  240,
  240,
  240,
  240,
  241,
  241,
  241,
  241,
  242,
  242,
  242,
  242,
  243,
  243,
  243,
  243,
  243,
  244,
  244,
  244,
  244,
  245,
  245,
  245,
  245,
  246,
  246,
  246,
  246,
  246,
  247,
  247,
  247,
  247,
  248,
  248,
  248,
  248,
  249,
  249,
  249,
  249,
  249,
  250,
  250,
  250,
  250,
  251,
  251,
  251,
  251,
  251,
  252,
  252,
  252,
  252,
  253,
  253,
  253,
  253,
  253,
  254,
  254,
  254,
  254,
  255,
  255,
  255
];
function y(l) {
  let t;
  if (l <= 0)
    return 0;
  if (l >= u)
    return u;
  t = l * (l * (l + -144107) / u + 132114) / u + 14379;
  for (let e = 0; e < 2; e++) {
    const n = t * t * t, r = l + (2 * n + _ / 2) / _;
    t = (t * (2 * l + (n + _ / 2) / _) + r / 2) / r;
  }
  return t;
}
function b(l, t) {
  return (l ^ t) < 0 ? (l - t / 2) / t : (l + t / 2) / t;
}
function P(l, t, e, n, r = true, s = [255, 255, 255]) {
  if (!r) {
    n /= 255;
    const i = 1 - n;
    l = l * n + i * s[0] & 255, t = t * n + i * s[1] & 255, e = e * n + i * s[2] & 255;
  }
  return { r: l, g: t, b: e };
}
function S(l, t, e) {
  return l << 16 | t << 8 | e;
}
function M(l, t, e) {
  l = C[l], t = C[t], e = C[e];
  const n = (27015 * l + 35149 * t + 3372 * e + u / 2) / u, r = (13887 * l + 44610 * t + 7038 * e + u / 2) / u, s = (5787 * l + 18462 * t + 41286 * e + u / 2) / u, i = y(n), a = y(r), h = y(s);
  return {
    l: b(13792 * i + 52010 * a - 267 * h, u),
    a: b(129628 * i - 159158 * a + 29530 * h, u),
    b: b(1698 * i + 51299 * a - 52997 * h, u)
  };
}
function I(l) {
  if (l <= 0)
    return 0;
  if (l >= u)
    return 255;
  {
    const t = l * $, e = ~~(t / u), n = t % u, r = N[e], s = N[e + 1];
    return (n * (s - r) + u / 2) / u + r;
  }
}
function q(l) {
  const t = l.l + b(25974 * l.a, u) + b(14143 * l.b, u), e = l.l + b(-6918 * l.a, u) + b(-4185 * l.b, u), n = l.l + b(-5864 * l.a, u) + b(-84638 * l.b, u), r = t ** 3 / _, s = e ** 3 / _, i = n ** 3 / _, a = ~~I((267169 * r + -216771 * s + 15137 * i + u / 2) / u), h = ~~I((-83127 * r + 171030 * s + -22368 * i + u / 2) / u), o = ~~I((-275 * r + -46099 * s + 111909 * i + u / 2) / u);
  return { r: a, g: h, b: o };
}
function U(l) {
  return new Promise((t) => {
    const e = new Image();
    e.decoding = "sync", e.loading = "eager", e.crossOrigin = "anonymous", e.onload = () => t(e), e.onerror = () => t(e), e.src = l;
  });
}
var v = class _v {
  constructor() {
    this.readable = new ReadableStream({
      start: (t) => this._rsControler = t
    }), this.writable = new WritableStream({
      write: async (t) => {
        let e;
        switch (typeof t) {
          case "string": {
            const n = await U(t), r = _v.ctx2d, s = r.canvas;
            r.clearRect(0, 0, s.width, s.height), s.width = n.width, s.height = n.height, r.drawImage(n, 0, 0, s.width, s.height), e = r.getImageData(0, 0, s.width, s.height).data;
            break;
          }
          default:
            if (ArrayBuffer.isView(t))
              e = new Uint8ClampedArray(t.buffer);
            else if (t instanceof ArrayBuffer)
              e = new Uint8ClampedArray(t);
            else if (Array.isArray(t))
              if (Array.isArray(t[0])) {
                const n = [];
                for (let r = t.length, s = 0; s < r; s++)
                  n.push(
                    t[s][0] ?? 0,
                    t[s][1] ?? 0,
                    t[s][2] ?? 0,
                    t[s][3] ?? 255
                  );
                e = new Uint8ClampedArray(n);
              } else
                e = new Uint8ClampedArray(t);
            else {
              const n = _v.ctx2d, r = n.canvas;
              n.clearRect(0, 0, r.width, r.height), r.width = typeof t.width == "number" ? t.width : t.width.baseVal.value, r.height = typeof t.height == "number" ? t.height : t.height.baseVal.value, n.drawImage(t, 0, 0, r.width, r.height), e = n.getImageData(0, 0, r.width, r.height).data;
            }
            break;
        }
        this._rsControler.enqueue(e);
      },
      close: () => {
        this._rsControler.close();
      }
    });
  }
  static get ctx2d() {
    if (!this._ctx2d) {
      if (!W)
        throw new Error("Failed to get ImageToPixels.ctx2d, not in browser.");
      const t = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      if (!t)
        throw new Error("Failed to get ImageToPixels.ctx2d, getContext('2d') return null.");
      this._ctx2d = t;
    }
    return this._ctx2d;
  }
};
var A = class _A {
  constructor(t) {
    this.maxColors = t, this.readable = new ReadableStream({
      start: (e) => this._rsControler = e
    }), this.writable = new WritableStream({
      write: (e) => {
        this._rsControler.enqueue(
          this._boxesToQuantizedColors(
            this._colorsToBoxes(e)
          )
        );
      },
      close: () => {
        this._rsControler.close();
      }
    });
  }
  static createSorter(t) {
    const e = t[0], n = t[1], r = t[2];
    return (s, i) => s.lab[e] - i.lab[e] || s.lab[n] - i.lab[n] || s.lab[r] - i.lab[r];
  }
  _colorsToBoxes(t) {
    let e = {
      start: 0,
      end: t.length - 1,
      sorted: null,
      count: 0,
      score: 0,
      weight: 0,
      sort: "lab",
      avg: { l: 0, a: 0, b: 0 }
    };
    const n = [e];
    let r = 1;
    const s = (o, m, c) => o >= m ? m >= c ? "lab" : o >= c ? "lba" : "bla" : o >= c ? "alb" : m >= c ? "abl" : "bal", i = (o) => {
      const { start: m, end: c } = o;
      o.count = c - m + 1, o.weight = 0;
      const f = { l: 0, a: 0, b: 0 };
      for (let p = m; p <= c; p++) {
        const d = t[p];
        f.l += d.lab.l * d.count, f.a += d.lab.a * d.count, f.b += d.lab.b * d.count, o.weight += d.count;
      }
      o.avg.l = f.l / o.weight, o.avg.a = f.a / o.weight, o.avg.b = f.b / o.weight;
      const w = { l: 0, a: 0, b: 0 };
      for (let p = m; p <= c; p++) {
        const d = t[p];
        w.l += (d.lab.l - o.avg.l) ** 2 * d.count, w.a += (d.lab.a - o.avg.a) ** 2 * d.count, w.b += (d.lab.b - o.avg.b) ** 2 * d.count;
      }
      o.sort = s(w.l, w.a, w.b), o.score = Math.max(w.l, w.a, w.b);
    }, a = (o, m) => {
      const c = {
        start: m + 1,
        end: o.end,
        sorted: o.sorted,
        count: 0,
        score: 0,
        weight: 0,
        sort: "lab",
        avg: { l: 0, a: 0, b: 0 }
      };
      i(c), o.end -= c.count, i(o), n.push(c), r++;
    }, h = () => {
      let o = -1, m = -1;
      if (r === this.maxColors)
        return -1;
      for (let c = 0; c < r; c++) {
        const f = n[c];
        f.count >= 2 && f.score > m && (o = c, m = f.score);
      }
      return o;
    };
    for (i(e); e && e.count > 1; ) {
      const { start: o, end: m, sort: c, sorted: f } = e;
      if (c !== f) {
        const R = t.slice(o, m + 1).sort(_A.createSorter(c));
        for (let E = R.length, x = 0; x < E; x++)
          t[o + x] = R[x];
        e.sorted = c;
      }
      const p = e.weight + 1 >> 1;
      let d = o, g = 0;
      for (; d < m - 1 && (g += t[d].count, !(g > p)); d++)
        ;
      a(e, d);
      const T = h();
      e = T >= 0 ? n[T] : null;
    }
    return n;
  }
  _boxesToQuantizedColors(t) {
    const e = t.reduce((n, r) => n + r.weight, 0);
    return t.map((n) => {
      const { r, g: s, b: i } = q(n.avg);
      return {
        rgbInt: S(r, s, i),
        rgb: { r, g: s, b: i },
        hex: `#${r.toString(16).padStart(2, "0")}${s.toString(16).padStart(2, "0")}${i.toString(16).padStart(2, "0")}`,
        lab: n.avg,
        count: n.weight,
        percentage: n.weight / e
      };
    }).sort((n, r) => n.rgbInt - r.rgbInt);
  }
};
var B = class {
  constructor(t, e, n) {
    this.statsMode = t, this.premultipliedAlpha = e, this.tint = n, this._colors = [], this._cache = /* @__PURE__ */ new Map(), this.readable = new ReadableStream({
      start: (r) => this._rsControler = r
    }), this.writable = new WritableStream({
      write: (r) => {
        for (let s = r.length, i = 0; i < s; i += 4) {
          let a = r[i], h = r[i + 1], o = r[i + 2];
          const m = r[i + 3];
          if (this.statsMode === "diff" && this._previousPixels && a === this._previousPixels[i] && h === this._previousPixels[i + 1] && o === this._previousPixels[i + 2] && m === this._previousPixels[i + 3])
            continue;
          ({ r: a, g: h, b: o } = P(a, h, o, m, this.premultipliedAlpha, this.tint));
          const c = S(a, h, o), f = {
            rgbInt: c,
            lab: M(a, h, o),
            count: 1
          }, w = c % 32768;
          let p = this._cache.get(w);
          p || this._cache.set(w, p = /* @__PURE__ */ new Map());
          let d = p.get(c);
          if (d !== void 0) {
            this._colors[d].count++;
            continue;
          }
          d = this._colors.push(f) - 1, p.set(c, d);
        }
        this.statsMode === "diff" && (this._previousPixels = r);
      },
      close: () => {
        this._rsControler.enqueue(this._colors.slice()), this._rsControler.close(), this._colors.length = 0, this._cache.clear(), this._previousPixels = void 0;
      }
    });
  }
};
var F = class {
  constructor(t = [], e = false, n = [255, 255, 255]) {
    this._premultipliedAlpha = e, this._tint = n, this._cache = /* @__PURE__ */ new Map(), this._colorMap = [], t.length && this.setup(t);
  }
  setup(t) {
    t = t.sort((i, a) => i.rgbInt - a.rgbInt), this._cache.clear();
    const e = [], n = /* @__PURE__ */ new Map();
    for (let i = -1, a = t.length, h = 0; h < a; h++) {
      const { rgbInt: o } = t[h];
      if (o === i) {
        n.set(h, true);
        continue;
      }
      i = o;
    }
    s({
      min: [-65535, -65535, -65535],
      max: [65535, 65535, 65535]
    }), this._colorMap = e;
    function r(i) {
      const a = {
        min: [65535, 65535, 65535],
        max: [-65535, -65535, -65535]
      }, h = [];
      for (let p = t.length, d = 0; d < p; d++) {
        const { lab: g } = t[d];
        n.has(d) || g.l < i.min[0] || g.a < i.min[1] || g.b < i.min[2] || g.l > i.max[0] || g.a > i.max[1] || g.b > i.max[2] || (g.l < a.min[0] && (a.min[0] = g.l), g.a < a.min[1] && (a.min[1] = g.a), g.b < a.min[2] && (a.min[2] = g.b), g.l > a.max[0] && (a.max[0] = g.l), g.a > a.max[1] && (a.max[1] = g.a), g.b > a.max[2] && (a.max[2] = g.b), h.push({
          lab: g,
          index: d
        }));
      }
      let o = "l", m = 0;
      if (!h.length)
        return { index: -1, longest: o, longestIndex: m };
      const c = a.max[0] - a.min[0], f = a.max[1] - a.min[1], w = a.max[2] - a.min[2];
      return w >= c && w >= f && (o = "b", m = 2), f >= c && f >= w && (o = "a", m = 1), c >= f && c >= w && (o = "l", m = 0), {
        index: h.sort((p, d) => p.lab[o] - d.lab[o])[h.length >> 1].index,
        longest: o,
        longestIndex: m
      };
    }
    function s(i) {
      const { index: a, longest: h, longestIndex: o } = r(i);
      if (a < 0)
        return -1;
      n.set(a, true);
      const { lab: m } = t[a], c = {
        left: 0,
        right: 0,
        longest: h,
        lab: m,
        index: a
      }, f = e.push(c) - 1, w = { max: [...i.max], min: [...i.min] }, p = { max: [...i.max], min: [...i.min] };
      w.max[o] = m[h], p.min[o] = Math.min(m[h] + 1, 65535);
      const d = s(w);
      let g = -1;
      return p.min[o] <= p.max[o] && (g = s(p)), c.left = d, c.right = g, f;
    }
  }
  _colormapNearestNode(t, e, n) {
    const { left: r, right: s, longest: i, lab: a, index: h } = this._colorMap[t], o = Math.min(
      (e.l - a.l) ** 2 + (e.a - a.a) ** 2 + (e.b - a.b) ** 2,
      4294967295 - 1
    );
    o < n.dist && (n.index = h, n.dist = o);
    let m, c;
    if (r !== -1 || s !== -1) {
      const f = e[i] - a[i];
      f <= 0 ? (m = r, c = s) : (m = s, c = r), m !== -1 && this._colormapNearestNode(m, e, n), c !== -1 && f ** 2 < n.dist && this._colormapNearestNode(c, e, n);
    }
  }
  findNearestIndex(t, e, n, r = 255) {
    ({ r: t, g: e, b: n } = P(t, e, n, r, this._premultipliedAlpha, this._tint));
    const s = S(t, e, n), i = s % 32768;
    let a = this._cache.get(i);
    a || this._cache.set(i, a = /* @__PURE__ */ new Map());
    let h = a.get(s);
    if (h !== void 0)
      return h;
    const o = {
      dist: Number.MAX_SAFE_INTEGER,
      index: -1
    };
    return this._colormapNearestNode(0, M(t, e, n), o), h = o.index, a.set(s, h), h;
  }
};
var O = class {
  constructor(t = {}) {
    this.colors = [], this.config = this._resolveOptions(t), this._stream = this._createStream();
  }
  _resolveOptions(t) {
    const {
      maxColors: e = 256,
      statsMode: n = "full",
      algorithm: r = "median-cut",
      premultipliedAlpha: s = false,
      tint: i = [255, 255, 255],
      samples: a = []
    } = t;
    return {
      maxColors: e,
      statsMode: n,
      algorithm: r,
      premultipliedAlpha: s,
      tint: i,
      samples: a
    };
  }
  _createStream() {
    let t;
    switch (this.config.algorithm) {
      case "median-cut":
      default:
        t = new A(this.config.maxColors);
        break;
    }
    return new ReadableStream({
      start: (e) => {
        this._streamControler = e, this.config.samples.forEach((n) => e.enqueue(n));
      }
    }).pipeThrough(new v()).pipeThrough(new B(this.config.statsMode, this.config.premultipliedAlpha, this.config.tint)).pipeThrough(t);
  }
  addSample(t) {
    this._streamControler.enqueue(t);
  }
  generate() {
    return new Promise((t) => {
      this._streamControler.close(), this._stream.pipeTo(new WritableStream({
        write: (e) => {
          this.colors = e, this.finder = new F(e, this.config.premultipliedAlpha, this.config.tint), this._stream = this._createStream(), t(e);
        }
      }));
    });
  }
  match(t) {
    var s;
    let e;
    if (typeof t == "number")
      e = [
        t >> 24 & 255,
        t >> 16 & 255,
        t >> 8 & 255,
        t & 255
      ];
    else if (typeof t == "string") {
      const i = t.replace(/^#/, "");
      e = [
        `${i[0]}${i[1]}`,
        `${i[2]}${i[3]}`,
        `${i[4]}${i[5]}`
      ].map((a) => parseInt(a, 16));
    } else if (Array.isArray(t))
      e = t;
    else
      throw new TypeError("Unsupported color format");
    const n = (s = this.finder) == null ? void 0 : s.findNearestIndex(e[0], e[1], e[2], e[3]);
    if (n === void 0 || n < 0)
      return;
    const r = this.colors[n];
    if (r)
      return {
        color: r,
        index: n
      };
  }
  toColors() {
    return this.colors.slice();
  }
  toHexColors() {
    return this.colors.map((t) => t.hex);
  }
  toRgbColors() {
    return this.colors.map((t) => t.rgb);
  }
  toRgbIntColors() {
    return this.colors.map((t) => t.rgbInt);
  }
  toLabColors() {
    return this.colors.map((t) => t.lab);
  }
  toUint8Array(t = this.colors.length * 4) {
    var r;
    let e;
    const n = new Uint8ClampedArray(t);
    for (let s = 0; s < t; s++) {
      const i = s * 4, a = ((r = this.colors[s]) == null ? void 0 : r.rgb) ?? e;
      a && (n[i] = a.r, n[i + 1] = a.g, n[i + 2] = a.b, n[i + 3] = 255, e = a);
    }
    return n;
  }
  clear() {
    this.colors.length = 0, this._stream = this._createStream();
  }
};

// node_modules/modern-gif/dist/index.mjs
var SIGNATURE = "GIF";
var VERSIONS = ["87a", "89a"];
var IMAGE_DESCRIPTOR = 44;
var EXTENSION = 33;
var EXTENSION_APPLICATION = 255;
var EXTENSION_APPLICATION_BLOCK_SIZE = 11;
var EXTENSION_COMMENT = 254;
var EXTENSION_GRAPHIC_CONTROL = 249;
var EXTENSION_GRAPHIC_CONTROL_BLOCK_SIZE = 4;
var EXTENSION_PLAIN_TEXT = 1;
var EXTENSION_PLAIN_TEXT_BLOCK_SIZE = 1;
var TRAILER = 59;
function mergeBuffers(buffers) {
  const container = new Uint8Array(
    buffers.reduce((total, array) => total + array.byteLength, 0)
  );
  buffers.reduce((offset, array) => {
    container.set(array, offset);
    return offset + array.byteLength;
  }, 0);
  return container;
}
function resovleSource(source, output, options) {
  let buffer;
  if (ArrayBuffer.isView(source)) {
    buffer = source.buffer;
  } else if (source instanceof ArrayBuffer) {
    buffer = source;
  } else {
    const canvas = document.createElement("canvas");
    const { width, height } = options || {};
    const context2d = canvas.getContext("2d");
    if (!context2d) {
      throw new Error("Failed to create canvas context2d");
    }
    canvas.width = width ?? ("width" in source ? typeof source.width === "number" ? source.width : source.width.baseVal.value : 0);
    canvas.height = height ?? ("height" in source ? typeof source.height === "number" ? source.height : source.height.baseVal.value : 0);
    context2d.drawImage(source, 0, 0, canvas.width, canvas.height);
    buffer = context2d.getImageData(0, 0, canvas.width, canvas.height).data.buffer;
  }
  switch (output) {
    case "uint8Array":
      return new Uint8Array(buffer);
    case "uint8ClampedArray":
      return new Uint8ClampedArray(buffer);
    case "dataView":
      return new DataView(buffer);
    default:
      throw new Error("Unsupported output format");
  }
}
function createImage(url) {
  const img = new Image();
  img.decoding = "sync";
  img.loading = "eager";
  img.crossOrigin = "anonymous";
  img.src = url;
  return img;
}
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = createImage(url);
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}
var Reader = class {
  _view;
  offset = 0;
  constructor(source) {
    this._view = resovleSource(source, "dataView");
  }
  readByte() {
    return this._view.getUint8(this.offset++);
  }
  readBytes(length) {
    return Array.from({ length }).map(() => this.readByte());
  }
  readString(length) {
    return String.fromCharCode(...this.readBytes(length));
  }
  readUnsigned() {
    return [this._view.getUint16(this.offset, true), this.offset += 2][0];
  }
  readBits() {
    return this._view.getUint8(this.offset++).toString(2).padStart(8, "0").split("").map(Number);
  }
  readColorTable(length) {
    return Array.from({ length }, () => Array.from(this.readBytes(3)));
  }
  readSubBlock() {
    const block = [];
    while (true) {
      const val = this.readByte();
      if (val === 0 && this._view.getUint8(this.offset) !== 0)
        break;
      block.push(val);
    }
    return block;
  }
};
function decode(source) {
  const gif = {};
  const reader = new Reader(source);
  const createFrame = () => ({ index: 0, delay: 100, disposal: 0 });
  const signature = reader.readString(3);
  const version = reader.readString(3);
  if (signature !== SIGNATURE || !VERSIONS.includes(version)) {
    throw new Error("This is not a 87a/89a GIF data.");
  }
  gif.version = version;
  gif.width = reader.readUnsigned();
  gif.height = reader.readUnsigned();
  const bits = reader.readBits();
  gif.globalColorTable = Boolean(bits[0]);
  gif.colorResoluTion = Number.parseInt(bits.slice(1, 4).join(""), 2) + 1;
  gif.colorTableSorted = Boolean(bits[4]);
  const colorTableSize = Number.parseInt(bits.slice(5, 8).join(""), 2);
  gif.colorTableSize = 2 ** (colorTableSize + 1);
  gif.backgroundColorIndex = reader.readByte();
  gif.pixelAspectRatio = reader.readByte();
  if (gif.globalColorTable) {
    if (gif.colorTableSize) {
      gif.colorTable = reader.readColorTable(gif.colorTableSize);
    } else {
      reader.readSubBlock();
    }
  }
  gif.frames = [];
  let frame = createFrame();
  const flags = [];
  const extensionFlags = [];
  while (true) {
    const flag = reader.readByte();
    flags.push(flag);
    if (flag === IMAGE_DESCRIPTOR) {
      frame.left = reader.readUnsigned();
      frame.top = reader.readUnsigned();
      frame.width = reader.readUnsigned();
      frame.height = reader.readUnsigned();
      const bits2 = reader.readBits();
      frame.localColorTable = Boolean(bits2[0]);
      frame.interlaced = Boolean(bits2[1]);
      frame.colorTableSorted = Boolean(bits2[2]);
      frame.reserved = Number.parseInt(bits2.slice(3, 5).join(""), 2);
      const colorTableSize2 = Number.parseInt(bits2.slice(5, 8).join(""), 2);
      frame.colorTableSize = 2 ** (colorTableSize2 + 1);
      if (frame.localColorTable) {
        frame.colorTable = reader.readColorTable(frame.colorTableSize);
      }
      frame.lzwMinCodeSize = reader.readByte();
      frame.dataPositions = [];
      while (true) {
        const length = reader.readByte();
        if (length === 0)
          break;
        const offset = reader.offset;
        frame.dataPositions.push([offset, length]);
        reader.offset = offset + length;
      }
      gif.frames.push(frame);
      frame = createFrame();
      frame.index = gif.frames.length;
      continue;
    }
    if (flag === EXTENSION) {
      const extensionFlag = reader.readByte();
      extensionFlags.push(extensionFlag);
      if (extensionFlag === EXTENSION_APPLICATION) {
        if (reader.readByte() !== EXTENSION_APPLICATION_BLOCK_SIZE)
          continue;
        const application = {
          identifier: reader.readString(8),
          code: reader.readString(3),
          data: []
        };
        if (`${application.identifier}${application.code}` === "NETSCAPE2.0") {
          if (reader.readByte() === 3) {
            gif.looped = Boolean(reader.readByte());
            gif.loopCount = reader.readUnsigned();
          }
        }
        application.data = reader.readSubBlock();
        frame.application = application;
        continue;
      }
      if (extensionFlag === EXTENSION_COMMENT) {
        frame.comment = reader.readSubBlock().map((val) => String.fromCharCode(val)).join("");
        continue;
      }
      if (extensionFlag === EXTENSION_GRAPHIC_CONTROL) {
        if (reader.readByte() !== EXTENSION_GRAPHIC_CONTROL_BLOCK_SIZE)
          continue;
        const bits2 = reader.readBits();
        const graphicControl = {
          // ↓ <Packed Fields>
          reserved: Number.parseInt(bits2.slice(0, 3).join(""), 2),
          disposal: Number.parseInt(bits2.slice(3, 6).join(""), 2),
          userInput: Boolean(bits2[6]),
          transparent: Boolean(bits2[7]),
          // ↑ <Packed Fields>
          delayTime: reader.readUnsigned(),
          transparentIndex: reader.readByte()
        };
        reader.readSubBlock();
        frame.graphicControl = graphicControl;
        frame.disposal = graphicControl.disposal;
        frame.delay = (graphicControl.delayTime || 10) * 10;
        continue;
      }
      if (extensionFlag === EXTENSION_PLAIN_TEXT) {
        if (reader.readByte() !== EXTENSION_PLAIN_TEXT_BLOCK_SIZE)
          continue;
        frame.plainText = {
          left: reader.readUnsigned(),
          top: reader.readUnsigned(),
          width: reader.readUnsigned(),
          height: reader.readUnsigned(),
          cellWidth: reader.readByte(),
          cellHeight: reader.readByte(),
          colorIndex: reader.readByte(),
          backgroundColorIndex: reader.readByte(),
          data: reader.readSubBlock()
        };
        continue;
      }
      console.warn(
        `Unknown extension block: 0x${extensionFlag.toString(16)}`,
        flags.slice(0, flags.length - 1).map((val) => `0x${val.toString(16)}`),
        extensionFlags.slice(0, extensionFlags.length - 1).map((val) => `0x${val.toString(16)}`)
      );
      continue;
    }
    if (flag === TRAILER)
      break;
    console.warn(
      `Unknown block: 0x${flag.toString(16)}`,
      flags.slice(0, flags.length - 1).map((val) => `0x${val.toString(16)}`),
      extensionFlags.slice(0, extensionFlags.length - 1).map((val) => `0x${val.toString(16)}`)
    );
  }
  return gif;
}
function createWorker(options) {
  const callbacks = /* @__PURE__ */ new Map();
  const { workerUrl } = options;
  let { workerNumber = 1 } = options;
  const workers = [...Array.from({ length: workerUrl ? workerNumber : 0 })].map(() => {
    try {
      const worker = new Worker(workerUrl);
      worker.onmessage = onMessage;
      return worker;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }).filter(Boolean);
  workerNumber = workers.length;
  function onMessage(event) {
    const { id, data } = event.data;
    callbacks.get(id)?.(data);
    callbacks.delete(id);
  }
  const getWorker = /* @__PURE__ */ (function() {
    let id = 0;
    return (index) => workers[(index ?? id++) % workerNumber];
  })();
  const call = /* @__PURE__ */ (function() {
    let id = 0;
    return (type, data, transfer, index) => {
      return new Promise((resolve) => {
        const worker = getWorker(index);
        if (!worker)
          return resolve(void 0);
        callbacks.set(id, resolve);
        worker.postMessage({ id: id++, type, data }, { transfer });
      });
    };
  })();
  return {
    call
  };
}
function deinterlace(pixels, width) {
  const newPixels = Array.from({ length: pixels.length });
  const rows = pixels.length / width;
  const offsets = [0, 4, 2, 1];
  const steps = [8, 8, 4, 2];
  let fromRow = 0;
  for (let pass = 0; pass < 4; pass++) {
    for (let toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
      newPixels.splice.apply(
        newPixels,
        [toRow * width, width].concat(
          pixels.slice(fromRow * width, (fromRow + 1) * width)
        )
      );
      fromRow++;
    }
  }
  return newPixels;
}
function lzwDecode(minCodeSize, data, pixelCount) {
  const MAX_STACK_SIZE = 4096;
  const nullCode = -1;
  const npix = pixelCount;
  let available, codeMask, codeSize, inCode, oldCode, code, i;
  const dstPixels = Array.from({ length: pixelCount });
  const prefix = Array.from({ length: MAX_STACK_SIZE });
  const suffix = Array.from({ length: MAX_STACK_SIZE });
  const pixelStack = Array.from({ length: MAX_STACK_SIZE + 1 });
  const dataSize = minCodeSize;
  const clear = 1 << dataSize;
  const endOfInformation = clear + 1;
  available = clear + 2;
  oldCode = nullCode;
  codeSize = dataSize + 1;
  codeMask = (1 << codeSize) - 1;
  for (code = 0; code < clear; code++) {
    prefix[code] = 0;
    suffix[code] = code;
  }
  let datum, bits, first, top, pi, bi;
  datum = bits = first = top = pi = bi = 0;
  for (i = 0; i < npix; ) {
    if (top === 0) {
      if (bits < codeSize) {
        datum += data[bi] << bits;
        bits += 8;
        bi++;
        continue;
      }
      code = datum & codeMask;
      datum >>= codeSize;
      bits -= codeSize;
      if (code > available || code === endOfInformation) {
        break;
      }
      if (code === clear) {
        codeSize = dataSize + 1;
        codeMask = (1 << codeSize) - 1;
        available = clear + 2;
        oldCode = nullCode;
        continue;
      }
      if (oldCode === nullCode) {
        pixelStack[top++] = suffix[code];
        oldCode = code;
        first = code;
        continue;
      }
      inCode = code;
      if (code === available) {
        pixelStack[top++] = first;
        code = oldCode;
      }
      while (code > clear) {
        pixelStack[top++] = suffix[code];
        code = prefix[code];
      }
      first = suffix[code] & 255;
      pixelStack[top++] = first;
      if (available < MAX_STACK_SIZE) {
        prefix[available] = oldCode;
        suffix[available] = first;
        available++;
        if ((available & codeMask) === 0 && available < MAX_STACK_SIZE) {
          codeSize++;
          codeMask += available;
        }
      }
      oldCode = inCode;
    }
    top--;
    dstPixels[pi++] = pixelStack[top];
    i++;
  }
  for (i = pi; i < npix; i++) {
    dstPixels[i] = 0;
  }
  return dstPixels;
}
function decodeFrames(source, options) {
  const array = resovleSource(source, "uint8Array");
  if (options?.workerUrl) {
    return createWorker({ workerUrl: options.workerUrl }).call(
      "frames:decode",
      array,
      [array.buffer]
    );
  }
  const {
    gif = decode(source),
    range
  } = options ?? {};
  const {
    width: globalWidth,
    height: globalHeight,
    colorTable: globalColorTable,
    frames: globalFrames
  } = gif;
  const frames = range ? globalFrames.slice(range[0], range[1] + 1) : globalFrames;
  const hasDisposal3 = frames.some((frame) => frame.disposal === 3);
  let pixels = new Uint8ClampedArray(globalWidth * globalHeight * 4);
  let previousFrame;
  let previousPixels = pixels.slice();
  return frames.map((frame) => {
    const {
      left,
      top,
      width,
      height,
      interlaced,
      localColorTable,
      colorTable,
      lzwMinCodeSize,
      dataPositions,
      graphicControl,
      delay,
      disposal
    } = frame;
    const previousDisposal = previousFrame?.disposal;
    const bottom = top + height;
    const {
      transparent,
      transparentIndex: localTransparentIndex
    } = graphicControl ?? {};
    const palette = localColorTable ? colorTable : globalColorTable;
    const transparentIndex = transparent ? localTransparentIndex : -1;
    const compressedData = mergeBuffers(
      dataPositions.map(
        ([begin, length]) => array.subarray(begin, begin + length)
      )
    );
    let colorIndexes = lzwDecode(lzwMinCodeSize, compressedData, width * height);
    if (interlaced) {
      colorIndexes = deinterlace(colorIndexes, width);
    }
    if (previousDisposal === 3) {
      pixels = previousPixels.slice();
    } else if (previousDisposal === 2) {
      const { left: left2, top: top2, width: width2, height: height2 } = previousFrame;
      const bottom2 = top2 + height2;
      for (let y2 = top2; y2 < bottom2; y2++) {
        const globalOffset = y2 * globalWidth + left2;
        for (let x = 0; x < width2; x++) {
          const index = (globalOffset + x) * 4;
          pixels[index] = pixels[index + 1] = pixels[index + 2] = pixels[index + 3] = 0;
        }
      }
    }
    for (let y2 = top; y2 < bottom; y2++) {
      const globalOffset = y2 * globalWidth + left;
      const localOffset = (y2 - top) * width;
      for (let x = 0; x < width; x++) {
        const colorIndex = colorIndexes[localOffset + x];
        const index = (globalOffset + x) * 4;
        if (colorIndex !== transparentIndex) {
          const [r, g, b2] = palette?.[colorIndex] ?? [0, 0, 0];
          pixels[index] = r;
          pixels[index + 1] = g;
          pixels[index + 2] = b2;
          pixels[index + 3] = 255;
        }
      }
    }
    if (hasDisposal3 && disposal !== 1 && disposal !== 3) {
      previousPixels = pixels.slice();
    }
    previousFrame = frame;
    return {
      width: globalWidth,
      height: globalHeight,
      delay,
      data: pixels.slice()
    };
  });
}
function decodeFrame(source, index, gif) {
  const frames = decodeFrames(source, {
    gif,
    range: [0, Math.max(index, 0)]
  });
  return frames.pop();
}
function decodeUndisposedFrame(source, gif, index) {
  const array = resovleSource(source, "uint8Array");
  const {
    frames,
    colorTable: globalColorTable
  } = gif;
  const frame = frames[index];
  if (!frame) {
    throw new Error(`This index ${index} does not exist in frames`);
  }
  const {
    width,
    height,
    delay,
    interlaced,
    localColorTable,
    colorTable,
    lzwMinCodeSize,
    dataPositions,
    graphicControl
  } = frame;
  const {
    transparent,
    transparentIndex: transparentIndex_
  } = graphicControl ?? {};
  const palette = localColorTable ? colorTable : globalColorTable;
  const transparentIndex = transparent ? transparentIndex_ : -1;
  const compressedData = mergeBuffers(
    dataPositions.map(
      ([begin, length]) => array.subarray(begin, begin + length)
    )
  );
  let colorIndexes = lzwDecode(lzwMinCodeSize, compressedData, width * height);
  if (interlaced) {
    colorIndexes = deinterlace(colorIndexes, width);
  }
  const data = new Uint8ClampedArray(width * height * 4);
  for (let len = colorIndexes.length, i = 0; i < len; i++) {
    const colorIndex = colorIndexes[i];
    if (colorIndex === transparentIndex)
      continue;
    const [r, g, b2] = palette?.[colorIndex] ?? [0, 0, 0];
    const index2 = i * 4;
    data[index2] = r;
    data[index2 + 1] = g;
    data[index2 + 2] = b2;
    data[index2 + 3] = 255;
  }
  return {
    width,
    height,
    delay,
    data
  };
}
var Logger = class _Logger {
  constructor(isDebug = true) {
    this.isDebug = isDebug;
  }
  static prefix = "[modern-gif]";
  time(label) {
    if (!this.isDebug)
      return;
    console.time(`${_Logger.prefix} ${label}`);
  }
  timeEnd(label) {
    if (!this.isDebug)
      return;
    console.timeEnd(`${_Logger.prefix} ${label}`);
  }
  debug(...args) {
    if (!this.isDebug)
      return;
    console.debug(_Logger.prefix, ...args);
  }
  warn(...args) {
    if (!this.isDebug)
      return;
    console.warn(_Logger.prefix, ...args);
  }
};
var CropIndexedFrame = class {
  constructor(_config) {
    this._config = _config;
  }
  _rsControler;
  _frames = [];
  readable = new ReadableStream({
    start: (controler) => this._rsControler = controler
  });
  writable = new WritableStream({
    write: (frame) => {
      this._frames.push(frame);
    },
    close: () => {
      const transparentIndex = this._config.backgroundColorIndex;
      let lastIndexes;
      this._frames.forEach((frame, index) => {
        const {
          width = 1,
          height = 1,
          data: indexes
        } = frame;
        const transparent = frame.transparent || (this._frames[index + 1]?.transparent ?? true);
        let left = 0;
        let top = 0;
        let right = width - 1;
        let bottom = height - 1;
        let prevIndexes;
        if (transparent) {
          while (top < bottom) {
            let isTrans = true;
            for (let x = 0; x < width; x++) {
              if (indexes[width * top + x] !== transparentIndex) {
                isTrans = false;
                break;
              }
            }
            if (!isTrans)
              break;
            top++;
          }
          while (bottom > top) {
            let isTrans = true;
            for (let x = 0; x < width; x++) {
              if (indexes[width * bottom + x] !== transparentIndex) {
                isTrans = false;
                break;
              }
            }
            if (!isTrans)
              break;
            bottom--;
          }
          while (left < right) {
            let isTrans = true;
            for (let y2 = top; y2 < bottom; y2++) {
              if (indexes[width * y2 + left] !== transparentIndex) {
                isTrans = false;
                break;
              }
            }
            if (!isTrans)
              break;
            left++;
          }
          while (right > left) {
            let isTrans = true;
            for (let y2 = top; y2 < bottom; y2++) {
              if (indexes[width * y2 + right] !== transparentIndex) {
                isTrans = false;
                break;
              }
            }
            if (!isTrans)
              break;
            right--;
          }
        } else {
          if (lastIndexes) {
            while (top < bottom) {
              let sameLine = true;
              for (let x = 0; x < width; x++) {
                const index2 = width * top + x;
                if (indexes[index2] !== lastIndexes[index2]) {
                  sameLine = false;
                  break;
                }
              }
              if (!sameLine)
                break;
              top++;
            }
            while (bottom > top) {
              let sameLine = true;
              for (let x = 0; x < width; x++) {
                const index2 = width * bottom + x;
                if (indexes[index2] !== lastIndexes[index2]) {
                  sameLine = false;
                  break;
                }
              }
              if (!sameLine)
                break;
              bottom--;
            }
            if (top === bottom) {
              left = right;
            } else {
              while (left < right) {
                let sameColumn = true;
                for (let y2 = top; y2 <= bottom; y2++) {
                  const index2 = y2 * width + left;
                  if (indexes[index2] !== lastIndexes[index2]) {
                    sameColumn = false;
                    break;
                  }
                }
                if (!sameColumn)
                  break;
                left++;
              }
              while (right > left) {
                let sameColumn = true;
                for (let y2 = top; y2 <= bottom; y2++) {
                  const index2 = y2 * width + right;
                  if (indexes[index2] !== lastIndexes[index2]) {
                    sameColumn = false;
                    break;
                  }
                }
                if (!sameColumn)
                  break;
                right--;
              }
            }
          }
          prevIndexes = lastIndexes;
          lastIndexes = indexes;
        }
        const newWidth = right + 1 - left;
        const newHeight = bottom + 1 - top;
        const croppedIndexes = new Uint8ClampedArray(newWidth * newHeight);
        for (let y2 = 0; y2 < newHeight; y2++) {
          for (let x = 0; x < newWidth; x++) {
            const index2 = y2 * newWidth + x;
            const rawIndex = (top + y2) * width + (left + x);
            if (!transparent && prevIndexes && indexes[rawIndex] === prevIndexes[rawIndex]) {
              croppedIndexes[index2] = transparentIndex;
              continue;
            }
            croppedIndexes[index2] = indexes[rawIndex];
          }
        }
        this._rsControler.enqueue({
          ...frame,
          left,
          top,
          width: newWidth,
          height: newHeight,
          disposal: transparent ? 2 : 1,
          data: croppedIndexes,
          graphicControl: {
            ...frame.graphicControl,
            transparent: true,
            transparentIndex
          }
        });
      });
      this._rsControler.close();
    }
  });
};
var Writer = class {
  constructor(_chunkByteLength = 4096) {
    this._chunkByteLength = _chunkByteLength;
    this._chunks = [this._createChunk()];
  }
  _chunks;
  _chunkIndex = 0;
  _chunkOffset = 0;
  get cursor() {
    return [this._chunkIndex, this._chunkOffset];
  }
  _createChunk() {
    return new DataView(new ArrayBuffer(this._chunkByteLength));
  }
  writeByte(val, cursor) {
    if (cursor) {
      this._chunks[cursor[0]].setUint8(cursor[1], val);
    } else {
      if (this._chunkOffset >= this._chunkByteLength) {
        this._chunks[++this._chunkIndex] = this._createChunk();
        this._chunkOffset = 0;
      }
      this._chunks[this._chunkIndex].setUint8(this._chunkOffset++, val);
    }
  }
  writeBytes(value) {
    value.forEach((val) => this.writeByte(val));
  }
  writeString(value) {
    value.split("").forEach((char) => {
      this.writeByte(char.charCodeAt(0));
    });
  }
  writeUnsigned(value) {
    this.writeBytes([value & 255, value >> 8 & 255]);
  }
  calculateDistance(cursor) {
    return this._chunkIndex * this._chunkByteLength + this._chunkOffset - (cursor[0] * this._chunkByteLength + cursor[1]);
  }
  toUint8Array() {
    this._chunks[this._chunkIndex] = new DataView(this._chunks[this._chunkIndex].buffer.slice(0, this._chunkOffset));
    const data = new Uint8Array(this._chunks.reduce((total, chunk) => total + chunk.byteLength, 0));
    let offset = 0;
    this._chunks.forEach((chunk) => {
      data.set(new Uint8Array(chunk.buffer), offset);
      offset += chunk.byteLength;
    });
    this._chunks = [this._createChunk()];
    this._chunkIndex = 0;
    this._chunkOffset = 0;
    return data;
  }
};
var EncodeGif = class {
  constructor(_config) {
    this._config = _config;
  }
  _rsControler;
  _frames = [];
  readable = new ReadableStream({
    start: (controler) => this._rsControler = controler
  });
  writable = new WritableStream({
    write: (frame) => {
      this._frames.push(frame);
    },
    close: () => {
      const header = this._encodeHeader();
      const body = mergeBuffers(this._frames);
      const output = new Uint8Array(header.length + body.byteLength + 1);
      output.set(header);
      output.set(body, header.byteLength);
      output[output.length - 1] = TRAILER;
      this._rsControler.enqueue(output);
      this._rsControler.close();
      this._frames.length = 0;
    }
  });
  _encodeHeader() {
    const gif = {
      version: "89a",
      looped: true,
      loopCount: 0,
      pixelAspectRatio: 0,
      ...this._config
    };
    if (gif.width <= 0 || gif.width > 65535)
      throw new Error("Width invalid.");
    if (gif.height <= 0 || gif.height > 65535)
      throw new Error("Height invalid.");
    let colorTableSize = 0;
    if (gif.colorTable?.length) {
      let colorTableLength = gif.colorTable.length;
      if (colorTableLength < 2 || colorTableLength > 256 || colorTableLength & colorTableLength - 1) {
        throw new Error("Invalid color table length, must be power of 2 and 2 .. 256.");
      }
      while (colorTableLength >>= 1) ++colorTableSize;
      colorTableLength = 1 << colorTableSize;
      gif.colorTableSize = --colorTableSize;
      if (gif.backgroundColorIndex >= colorTableLength) {
        throw new Error("Background index out of range.");
      }
      if (gif.backgroundColorIndex === 0) {
        throw new Error("Background index explicitly passed as 0.");
      }
    }
    const writer = new Writer();
    writer.writeString(SIGNATURE);
    writer.writeString(gif.version);
    writer.writeUnsigned(gif.width);
    writer.writeUnsigned(gif.height);
    writer.writeByte(Number.parseInt(`${gif.colorTableSize ? 1 : 0}1110${gif.colorTableSize.toString(2).padStart(3, "0")}`, 2));
    writer.writeByte(gif.backgroundColorIndex);
    writer.writeByte(gif.pixelAspectRatio);
    writer.writeBytes(gif.colorTable?.flat() ?? []);
    if (gif.looped) {
      writer.writeByte(EXTENSION);
      writer.writeByte(EXTENSION_APPLICATION);
      writer.writeByte(EXTENSION_APPLICATION_BLOCK_SIZE);
      writer.writeString("NETSCAPE2.0");
      writer.writeByte(3);
      writer.writeByte(1);
      writer.writeUnsigned(gif.loopCount);
      writer.writeByte(0);
    }
    return writer.toUint8Array();
  }
};
function lzwEncode(minCodeSize, data, writer) {
  writer.writeByte(minCodeSize);
  let curSubblock = writer.cursor;
  writer.writeByte(0);
  const clearCode = 1 << minCodeSize;
  const codeMask = clearCode - 1;
  const eoiCode = clearCode + 1;
  let nextCode = eoiCode + 1;
  let curCodeSize = minCodeSize + 1;
  let curShift = 0;
  let cur = 0;
  function emitBytesToBuffer(bitBlockSize) {
    while (curShift >= bitBlockSize) {
      writer.writeByte(cur & 255);
      cur >>= 8;
      curShift -= 8;
      if (writer.calculateDistance(curSubblock) === 256) {
        writer.writeByte(255, curSubblock);
        curSubblock = writer.cursor;
        writer.writeByte(0);
      }
    }
  }
  function emitCode(c) {
    cur |= c << curShift;
    curShift += curCodeSize;
    emitBytesToBuffer(8);
  }
  let ibCode = data[0] & codeMask;
  let codeTable = {};
  let curKey;
  let curCode;
  let k;
  emitCode(clearCode);
  for (let len = data.length, i = 1; i < len; ++i) {
    k = data[i] & codeMask;
    curKey = ibCode << 8 | k;
    curCode = codeTable[curKey];
    if (curCode === void 0) {
      cur |= ibCode << curShift;
      curShift += curCodeSize;
      while (curShift >= 8) {
        writer.writeByte(cur & 255);
        cur >>= 8;
        curShift -= 8;
        if (writer.calculateDistance(curSubblock) === 256) {
          writer.writeByte(255, curSubblock);
          curSubblock = writer.cursor;
          writer.writeByte(0);
        }
      }
      if (nextCode === 4096) {
        emitCode(clearCode);
        nextCode = eoiCode + 1;
        curCodeSize = minCodeSize + 1;
        codeTable = {};
      } else {
        if (nextCode >= 1 << curCodeSize)
          ++curCodeSize;
        codeTable[curKey] = nextCode++;
      }
      ibCode = k;
    } else {
      ibCode = curCode;
    }
  }
  emitCode(ibCode);
  emitCode(eoiCode);
  emitBytesToBuffer(1);
  if (writer.calculateDistance(curSubblock) === 1) {
    writer.writeByte(0, curSubblock);
  } else {
    writer.writeByte(writer.calculateDistance(curSubblock) - 1, curSubblock);
    writer.writeByte(0);
  }
}
var EncodeIndexdFrame = class {
  constructor(_config) {
    this._config = _config;
  }
  _rsControler;
  readable = new ReadableStream({
    start: (controler) => this._rsControler = controler
  });
  writable = new WritableStream({
    write: (frame) => {
      const writer = new Writer();
      const {
        left = 0,
        top = 0,
        width = 0,
        height = 0,
        delay = 100,
        colorTable
      } = frame;
      let {
        disposal = 0
      } = frame;
      const transparent = frame.graphicControl?.transparent;
      let transparentIndex = frame.graphicControl?.transparentIndex ?? 255;
      if (left < 0 || left > 65535)
        throw new Error("Left invalid.");
      if (top < 0 || top > 65535)
        throw new Error("Top invalid.");
      if (width <= 0 || width > 65535)
        throw new Error("Width invalid.");
      if (height <= 0 || height > 65535)
        throw new Error("Height invalid.");
      let minCodeSize = 8;
      let colorTableLength = colorTable ? colorTable.length : 0;
      if (colorTableLength) {
        if (colorTableLength < 2 || colorTableLength > 256 || colorTableLength & colorTableLength - 1) {
          throw new Error("Invalid color table length, must be power of 2 and 2 .. 256.");
        }
        while (colorTableLength >>= 1) ++minCodeSize;
      }
      writer.writeByte(EXTENSION);
      writer.writeByte(EXTENSION_GRAPHIC_CONTROL);
      writer.writeByte(EXTENSION_GRAPHIC_CONTROL_BLOCK_SIZE);
      if (transparent) {
        if (!disposal) {
          disposal = 2;
        }
      } else {
        transparentIndex = 0;
      }
      writer.writeByte(Number.parseInt(`000${Number(disposal & 7).toString(2).padStart(3, "0")}0${transparent ? 1 : 0}`, 2));
      writer.writeUnsigned(delay / 10);
      writer.writeByte(transparentIndex);
      writer.writeByte(0);
      writer.writeByte(IMAGE_DESCRIPTOR);
      writer.writeUnsigned(left);
      writer.writeUnsigned(top);
      writer.writeUnsigned(width);
      writer.writeUnsigned(height);
      if (colorTable?.length) {
        writer.writeByte(Number.parseInt(`10000${(minCodeSize - 1).toString(2).padStart(3, "0")}`, 2));
        writer.writeBytes(colorTable.flat());
      } else {
        writer.writeByte(0);
      }
      lzwEncode(minCodeSize, frame.data, writer);
      this._rsControler.enqueue(writer.toUint8Array());
    },
    close: () => this._rsControler.close()
  });
};
var ditherKernels = {
  "floyd-steinberg": [
    [7 / 16, 1, 0],
    [3 / 16, -1, 1],
    [5 / 16, 0, 1],
    [1 / 16, 1, 1]
  ],
  "atkinson": [
    [1 / 8, 1, 0],
    [1 / 8, 2, 0],
    [1 / 8, -1, 1],
    [1 / 8, 0, 1],
    [1 / 8, 1, 1],
    [1 / 8, 0, 2]
  ],
  "stucki": [
    [8 / 42, 1, 0],
    [4 / 42, 2, 0],
    [2 / 42, -2, 1],
    [4 / 42, -1, 1],
    [8 / 42, 0, 1],
    [4 / 42, 1, 1],
    [2 / 42, 2, 1],
    [1 / 42, -2, 2],
    [2 / 42, -1, 2],
    [4 / 42, 0, 2],
    [2 / 42, 1, 2],
    [1 / 42, 2, 2]
  ]
};
var FrameToIndexedFrame = class {
  constructor(_config, colors) {
    this._config = _config;
    this._finder = new F(colors, _config.premultipliedAlpha, _config.tint);
    this._colors = colors;
  }
  _rsControler;
  _finder;
  _colors;
  readable = new ReadableStream({
    start: (controler) => this._rsControler = controler
  });
  writable = new WritableStream({
    write: (frame) => {
      const transparentIndex = this._config.backgroundColorIndex;
      const pixels = frame.data;
      if (frame.width && frame.height && (this._config.dither || this._config.ditherTransparency)) {
        const pos = (x, y2, c) => (y2 * frame.width + x) * 4 + c;
        if (this._config.dither) {
          const kernel = ditherKernels[this._config.dither];
          for (let y2 = 0; y2 < frame.height; y2++) {
            for (let x = 0; x < frame.width; x++) {
              const p = pos(x, y2, 0);
              const oldRGB = {
                r: pixels[p],
                g: pixels[p + 1],
                b: pixels[p + 2]
              };
              const newRGB = this._colors[this._finder.findNearestIndex(
                oldRGB.r,
                oldRGB.g,
                oldRGB.b,
                this._config.premultipliedAlpha ? pixels[p + 3] : 255
              )].rgb;
              const error = {
                r: oldRGB.r - newRGB.r,
                g: oldRGB.g - newRGB.g,
                b: oldRGB.b - newRGB.b
              };
              pixels[p] = newRGB.r;
              pixels[p + 1] = newRGB.g;
              pixels[p + 2] = newRGB.b;
              for (const [weight, xOffset, yOffset] of kernel) {
                const xCheck = xOffset < 0 ? x + xOffset >= 0 : x + xOffset < frame.width;
                const yCheck = yOffset < 0 ? y2 + yOffset >= 0 : y2 + yOffset < frame.height;
                if (xCheck && yCheck) {
                  const p2 = pos(x + xOffset, y2 + yOffset, 0);
                  pixels[p2] += error.r * weight;
                  pixels[p2 + 1] += error.g * weight;
                  pixels[p2 + 2] += error.b * weight;
                }
              }
            }
          }
        }
        if (this._config.ditherTransparency) {
          const kernel = ditherKernels[this._config.ditherTransparency];
          for (let y2 = 0; y2 < frame.height; y2++) {
            for (let x = 0; x < frame.width; x++) {
              const p = pos(x, y2, 3);
              const oldAlpha = pixels[p];
              const newAlpha = oldAlpha < 128 ? 0 : 255;
              const error = oldAlpha - newAlpha;
              pixels[p] = newAlpha;
              for (const [weight, xOffset, yOffset] of kernel) {
                const xCheck = xOffset < 0 ? x + xOffset >= 0 : x + xOffset < frame.width;
                const yCheck = yOffset < 0 ? y2 + yOffset >= 0 : y2 + yOffset < frame.height;
                if (xCheck && yCheck) {
                  const p2 = pos(x + xOffset, y2 + yOffset, 3);
                  pixels[p2] += error * weight;
                }
              }
            }
          }
        }
      }
      let transparent = false;
      const indexes = new Uint8ClampedArray(pixels.length / 4);
      for (let len = pixels.length, i = 0; i < len; i += 4) {
        if (pixels[i + 3] === 0) {
          indexes[i / 4] = transparentIndex;
          transparent = true;
        } else {
          indexes[i / 4] = this._finder.findNearestIndex(
            pixels[i],
            pixels[i + 1],
            pixels[i + 2],
            pixels[i + 3]
          );
        }
      }
      this._rsControler.enqueue({
        ...frame,
        data: indexes,
        transparent
      });
    },
    close: () => {
      this._rsControler.close();
    }
  });
};
var Encoder = class {
  _logger;
  _palette;
  _config;
  _encodingFrames = [];
  _encodeUUID = 0;
  _worker;
  constructor(options) {
    this._logger = new Logger(Boolean(options.debug));
    this._config = this._resolveOptions(options);
    this._palette = new O({
      maxColors: this._config.maxColors,
      premultipliedAlpha: this._config.premultipliedAlpha,
      tint: this._config.tint
    });
    if (this._config.workerUrl) {
      this._worker = createWorker({ workerUrl: this._config.workerUrl });
      this._worker.call("encoder:init", options);
    } else {
      this._config.frames?.forEach((frame) => this.encode(frame));
    }
  }
  _resolveOptions(options) {
    ["width", "height"].forEach((key) => {
      if (typeof options[key] !== "undefined" && Math.floor(options[key]) !== options[key]) {
        console.warn(`${key} cannot be a floating point number`);
        options[key] = Math.floor(options[key]);
      }
    });
    const {
      colorTableSize = 256,
      backgroundColorIndex = colorTableSize - 1,
      maxColors = colorTableSize - 1,
      premultipliedAlpha = false,
      tint = [255, 255, 255]
    } = options;
    return {
      ...options,
      colorTableSize,
      backgroundColorIndex,
      maxColors,
      premultipliedAlpha,
      tint
    };
  }
  async encode(frame) {
    if (this._worker) {
      let transfer;
      if (ArrayBuffer.isView(frame.data)) {
        transfer = [frame.data.buffer];
      } else if (frame.data instanceof ArrayBuffer) {
        transfer = [frame.data];
      }
      return this._worker.call("encoder:encode", frame, transfer);
    }
    const id = this._encodeUUID;
    this._encodeUUID++;
    const {
      width: frameWidth = this._config.width,
      height: frameHeight = this._config.height
    } = frame;
    let { data } = frame;
    try {
      this._logger.time(`palette:sample-${id}`);
      data = typeof data === "string" ? await loadImage(data) : data;
      data = resovleSource(data, "uint8ClampedArray", {
        width: frameWidth,
        height: frameHeight
      });
      this._encodingFrames.push({
        ...frame,
        width: frameWidth,
        height: frameHeight,
        data
      });
      this._palette.addSample(data);
    } finally {
      this._logger.timeEnd(`palette:sample-${id}`);
    }
  }
  async flush(format) {
    if (this._worker) {
      return this._worker.call("encoder:flush", format);
    }
    this._logger.time("palette:generate");
    const colors = await this._palette.generate();
    this._logger.timeEnd("palette:generate");
    const colorTable = colors.map((color) => [color.rgb.r, color.rgb.g, color.rgb.b]);
    while (colorTable.length < this._config.colorTableSize) {
      colorTable.push([0, 0, 0]);
    }
    this._logger.debug("palette:maxColors", this._config.maxColors);
    this._logger.isDebug && console.debug(
      colors.map(() => "%c ").join(""),
      ...colors.map((color) => `margin: 1px; background: ${color.hex}`)
    );
    this._logger.time("encode");
    const output = await new Promise((resolve) => {
      new ReadableStream({
        start: (controller) => {
          this._encodingFrames.forEach((frame) => {
            controller.enqueue(frame);
          });
          controller.close();
        }
      }).pipeThrough(new FrameToIndexedFrame(this._config, colors)).pipeThrough(new CropIndexedFrame(this._config)).pipeThrough(new EncodeIndexdFrame(this._config)).pipeThrough(new EncodeGif({ ...this._config, colorTable })).pipeTo(new WritableStream({ write: (chunk) => resolve(chunk) }));
    });
    this._logger.timeEnd("encode");
    this._encodingFrames = [];
    this._encodeUUID = 0;
    switch (format) {
      case "blob":
        return new Blob([output.buffer], { type: "image/gif" });
      case "arrayBuffer":
      default:
        return output.buffer;
    }
  }
};
function encode(options) {
  return new Encoder(options).flush(options.format);
}
export {
  Encoder,
  decode,
  decodeFrame,
  decodeFrames,
  decodeUndisposedFrame,
  encode
};
