const Ie = window.Alpine;
var Vt = !1, Jt = !1, R = [], Qt = -1, Ct = !1, fe = !1;
function ur(t) {
  fr(t);
}
function cr() {
  fe = !0;
}
function lr() {
  fe = !1, Ve();
}
function fr(t) {
  R.includes(t) || (R.push(t), t._x_schedulerPriority !== void 0 && (Ct = !0)), Ve();
}
function dr(t) {
  let e = R.indexOf(t);
  e !== -1 && e > Qt && R.splice(e, 1);
}
function Ve() {
  if (!Jt && !Vt) {
    if (fe)
      return;
    Vt = !0, queueMicrotask(pr);
  }
}
function pr() {
  Vt = !1, Jt = !0;
  for (let t = 0; t < R.length; t++)
    Ct && hr(t), R[t](), Qt = t;
  R.length = 0, Qt = -1, Ct = !1, Jt = !1;
}
function hr(t) {
  let e = /* @__PURE__ */ new Map(), n = R.slice(t).sort((r, i) => _r(r, i, e));
  for (let r = 0; r < n.length; r++)
    R[t + r] = n[r];
  Ct = !1;
}
function _r(t, e, n) {
  return Lt(t) ? Lt(e) ? je(t._x_schedulerPriority.el, n) - je(e._x_schedulerPriority.el, n) || t._x_schedulerPriority.order - e._x_schedulerPriority.order : -1 : Lt(e) ? 1 : 0;
}
function Lt(t) {
  return t._x_schedulerPriority !== void 0;
}
function je(t, e) {
  if (e.has(t))
    return e.get(t);
  let n = 0, r = t;
  for (; t; )
    n++, t._x_teleportBack ? t = t._x_teleportBack : typeof ShadowRoot == "function" && t.parentNode instanceof ShadowRoot ? t = t.parentNode.host : t = t.parentElement;
  return e.set(r, n), n;
}
var tt, J, et, Je, br = 0, Yt = !0;
function gr(t) {
  Yt = !1, t(), Yt = !0;
}
function vr(t) {
  tt = t.reactive, et = t.release, J = (e) => t.effect(e, { scheduler: (n) => {
    Yt ? ur(n) : n();
  } }), Je = t.raw;
}
function Ne(t) {
  J = t;
}
function yr(t) {
  let e = () => {
  };
  return [(r, i) => {
    let a = i?.priority === "structural" ? br++ : void 0, s = J(r);
    return a !== void 0 && s !== void 0 && (s._x_schedulerPriority = { el: t, order: a }), t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((o) => o());
    }), t._x_effects.add(s), e = () => {
      s !== void 0 && (t._x_effects.delete(s), et(s));
    }, s;
  }, () => {
    e();
  }];
}
function Qe(t, e) {
  let n = !0, r, i, a = J(() => {
    let s = t(), o = JSON.stringify(s);
    if (!n && (typeof s == "object" || s !== r)) {
      let u = typeof r == "object" ? JSON.parse(i) : r;
      queueMicrotask(() => {
        e(s, u);
      });
    }
    r = s, i = o, n = !1;
  });
  return () => et(a);
}
async function xr(t) {
  cr();
  try {
    await t(), await Promise.resolve();
  } finally {
    lr();
  }
}
var Ye = [], Ge = [], Xe = [];
function mr(t) {
  Xe.push(t);
}
function de(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, Ge.push(e));
}
function Ze(t) {
  Ye.push(t);
}
function tn(t, e, n) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n);
}
function en(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([n, r]) => {
    (e === void 0 || e.includes(n)) && (r.forEach((i) => i()), delete t._x_attributeCleanups[n]);
  });
}
function wr(t) {
  for (t._x_effects?.forEach(dr); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var pe = new MutationObserver(ge), he = !1;
function _e() {
  pe.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), he = !0;
}
function nn() {
  Sr(), pe.disconnect(), he = !1;
}
var it = [];
function Sr() {
  let t = pe.takeRecords();
  it.push(() => t.length > 0 && ge(t));
  let e = it.length;
  queueMicrotask(() => {
    if (it.length === e)
      for (; it.length > 0; )
        it.shift()();
  });
}
function g(t) {
  if (!he)
    return t();
  nn();
  let e = t();
  return _e(), e;
}
var be = !1, Mt = [];
function Ar() {
  be = !0;
}
function Er() {
  be = !1, ge(Mt), Mt = [];
}
function ge(t) {
  if (be) {
    Mt = Mt.concat(t);
    return;
  }
  let e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (let a = 0; a < t.length; a++)
    if (!t[a].target._x_ignoreMutationObserver && (t[a].type === "childList" && (t[a].removedNodes.forEach((s) => {
      s.nodeType === 1 && s._x_marker && n.add(s);
    }), t[a].addedNodes.forEach((s) => {
      if (s.nodeType === 1) {
        if (n.has(s)) {
          n.delete(s);
          return;
        }
        s._x_marker || e.push(s);
      }
    })), t[a].type === "attributes")) {
      let s = t[a].target, o = t[a].attributeName, u = t[a].oldValue, c = () => {
        r.has(s) || r.set(s, []), r.get(s).push({ name: o, value: s.getAttribute(o) });
      }, l = () => {
        i.has(s) || i.set(s, []), i.get(s).push(o);
      };
      s.hasAttribute(o) && u === null ? c() : s.hasAttribute(o) ? (l(), c()) : l();
    }
  i.forEach((a, s) => {
    en(s, a);
  }), r.forEach((a, s) => {
    Ye.forEach((o) => o(s, a));
  });
  for (let a of n)
    e.some((s) => s.contains(a)) || Ge.forEach((s) => s(a));
  for (let a of e)
    a.isConnected && Xe.forEach((s) => s(a));
  e = null, n = null, r = null, i = null;
}
function rn(t) {
  return H(B(t));
}
function mt(t, e, n) {
  return t._x_dataStack = [e, ...B(n || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((r) => r !== e);
  };
}
function B(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? B(t.host) : t.parentNode ? B(t.parentNode) : [];
}
function H(t) {
  return new Proxy({ objects: t }, Or);
}
function sn(t, e) {
  return t === null || t === Object.prototype ? null : Object.prototype.hasOwnProperty.call(t, e) ? t : sn(Object.getPrototypeOf(t), e);
}
var Or = {
  ownKeys({ objects: t }) {
    return Array.from(
      new Set(t.flatMap((e) => Object.keys(e)))
    );
  },
  has({ objects: t }, e) {
    return e == Symbol.unscopables ? !1 : t.some(
      (n) => Object.prototype.hasOwnProperty.call(n, e) || Reflect.has(n, e)
    );
  },
  get({ objects: t }, e, n) {
    return e == "toJSON" ? Cr : Reflect.get(
      t.find(
        (r) => Reflect.has(r, e)
      ) || {},
      e,
      n
    );
  },
  set({ objects: t }, e, n, r) {
    let i;
    for (const s of t)
      if (i = sn(s, e), i)
        break;
    i || (i = t[t.length - 1]);
    const a = Object.getOwnPropertyDescriptor(i, e);
    return a?.set && a?.get ? a.set.call(r, n) || !0 : Reflect.set(i, e, n);
  }
};
function Cr() {
  return Reflect.ownKeys(this).reduce((e, n) => (e[n] = Reflect.get(this, n), e), {});
}
function ve(t, e = () => {
}) {
  let n = (i) => typeof i == "object" && !Array.isArray(i) && i !== null, r = (i, a = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([s, { value: o, enumerable: u }]) => {
      if (u === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let c = a === "" ? s : `${a}.${s}`;
      typeof o == "object" && o !== null && o._x_interceptor ? i[s] = o.initialize(t, c, s, e) : n(o) && o !== i && !(o instanceof Element) && r(o, c);
    });
  };
  return r(t);
}
function an(t, e = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(r, i, a, s) {
      return t(this.initialValue, () => Mr(r, i), (o) => Gt(r, i, o), i, a, s);
    }
  };
  return e(n), (r) => {
    if (typeof r == "object" && r !== null && r._x_interceptor) {
      let i = n.initialize.bind(n);
      n.initialize = (a, s, o, u) => {
        let c = r.initialize(a, s, o, u);
        return n.initialValue = c, i(a, s, o, u);
      };
    } else
      n.initialValue = r;
    return n;
  };
}
function Mr(t, e) {
  return e.split(".").reduce((n, r) => n[r], t);
}
function Gt(t, e, n) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = n;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), Gt(t[e[0]], e.slice(1), n);
  }
}
var on = {};
function A(t, e) {
  on[t] = e;
}
function pt(t, e) {
  let n = Tr(e);
  return Object.entries(on).forEach(([r, i]) => {
    Object.defineProperty(t, `$${r}`, {
      get() {
        return i(e, n);
      },
      enumerable: !1
    });
  }), t;
}
function Tr(t) {
  let [e, n] = hn(t), r = { interceptor: an, ...e };
  return de(t, n), r;
}
function Rr(t, e, n, ...r) {
  try {
    return n(...r);
  } catch (i) {
    ht(i, t, e);
  }
}
function ht(...t) {
  return un(...t);
}
var un = Dr;
function Pr(t) {
  un = t;
}
function Dr(t, e, n = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: n }
  ), console.warn(`Alpine Expression Error: ${t.message}

${n ? 'Expression: "' + n + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var Z = !0;
function cn(t) {
  let e = Z;
  Z = !1;
  let n = t();
  return Z = e, n;
}
function k(t, e, n = {}) {
  let r;
  return m(t, e)((i) => r = i, n), r;
}
function m(...t) {
  return ln(...t);
}
var ln = () => {
};
function qr(t) {
  ln = t;
}
var fn;
function Ir(t) {
  fn = t;
}
function jr(t, e) {
  let n = {};
  pt(n, t);
  let r = [n, ...B(t)], i = typeof e == "function" ? Nr(r, e) : $r(r, e, t);
  return Rr.bind(null, t, e, i);
}
function Nr(t, e) {
  return (n = () => {
  }, { scope: r = {}, params: i = [], context: a } = {}) => {
    if (!Z) {
      _t(n, e, H([r, ...t]), i);
      return;
    }
    let s = e.apply(H([r, ...t]), i);
    _t(n, s);
  };
}
var $t = {};
function Lr(t, e) {
  if ($t[t])
    return $t[t];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, r = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t, a = (() => {
    try {
      let s = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${r} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(s, "name", {
        value: `[Alpine] ${t}`
      }), s;
    } catch (s) {
      return ht(s, e, t), Promise.resolve();
    }
  })();
  return $t[t] = a, a;
}
function $r(t, e, n) {
  let r = Lr(e, n);
  return (i = () => {
  }, { scope: a = {}, params: s = [], context: o } = {}) => {
    r.result = void 0, r.finished = !1;
    let u = H([a, ...t]);
    if (typeof r == "function") {
      let c = r.call(o, r, u).catch((l) => ht(l, n, e));
      r.finished ? (_t(i, r.result, u, s, n), r.result = void 0) : c.then((l) => {
        _t(i, l, u, s, n);
      }).catch((l) => ht(l, n, e)).finally(() => r.result = void 0);
    }
  };
}
function _t(t, e, n, r, i) {
  if (Z && typeof e == "function") {
    let a = e.apply(n, r);
    a instanceof Promise ? a.then((s) => _t(t, s, n, r)).catch((s) => ht(s, i, e)) : t(a);
  } else typeof e == "object" && e instanceof Promise ? e.then((a) => t(a)) : t(e);
}
function kr(...t) {
  return fn(...t);
}
function Fr(t, e, n = {}) {
  let r = {};
  pt(r, t);
  let i = [r, ...B(t)], a = H([n.scope ?? {}, ...i]), s = n.params ?? [];
  if (e.includes("await")) {
    let o = Object.getPrototypeOf(async function() {
    }).constructor, u = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e;
    return new o(
      ["scope"],
      `with (scope) { let __result = ${u}; return __result }`
    ).call(n.context, a);
  } else {
    let o = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(()=>{ ${e} })()` : e, c = new Function(
      ["scope"],
      `with (scope) { let __result = ${o}; return __result }`
    ).call(n.context, a);
    return typeof c == "function" && Z ? c.apply(a, s) : c;
  }
}
var ye = "x-";
function nt(t = "") {
  return ye + t;
}
function Br(t) {
  ye = t;
}
var Tt = {};
function v(t, e) {
  return Tt[t] = e, {
    before(n) {
      if (!Tt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const r = $.indexOf(n);
      $.splice(r >= 0 ? r : $.indexOf("DEFAULT"), 0, t);
    }
  };
}
function Hr(t) {
  return Object.keys(Tt).includes(t);
}
function xe(t, e, n) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let a = Object.entries(t._x_virtualDirectives).map(([o, u]) => ({ name: o, value: u })), s = dn(a);
    a = a.map((o) => s.find((u) => u.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), e = e.concat(a);
  }
  let r = {};
  return e.map(gn((a, s) => r[a] = s)).filter(yn).map(zr(r, n)).sort(Ur).map((a) => Wr(t, a));
}
function dn(t) {
  return Array.from(t).map(gn()).filter((e) => !yn(e));
}
var Xt = !1, ot = /* @__PURE__ */ new Map(), pn = /* @__PURE__ */ Symbol();
function Kr(t) {
  Xt = !0;
  let e = /* @__PURE__ */ Symbol();
  pn = e, ot.set(e, []);
  let n = () => {
    for (; ot.get(e).length; )
      ot.get(e).shift()();
    ot.delete(e);
  }, r = () => {
    Xt = !1, n();
  };
  t(n), r();
}
function hn(t) {
  let e = [], n = (o) => e.push(o), [r, i] = yr(t);
  return e.push(i), [{
    Alpine: rt,
    effect: r,
    cleanup: n,
    evaluateLater: m.bind(m, t),
    evaluate: k.bind(k, t)
  }, () => e.forEach((o) => o())];
}
function Wr(t, e) {
  let n = () => {
  }, r = Tt[e.type] || n, [i, a] = hn(t);
  tn(t, e.original, a);
  let s = () => {
    t._x_ignore || t._x_ignoreSelf || (r.inline && r.inline(t, e, i), r = r.bind(r, t, e, i), Xt ? ot.get(pn).push(r) : r());
  };
  return s.runCleanups = a, s;
}
var _n = (t, e) => ({ name: n, value: r }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: r }), bn = (t) => t;
function gn(t = () => {
}) {
  return ({ name: e, value: n }) => {
    let { name: r, value: i } = vn.reduce((a, s) => s(a), { name: e, value: n });
    return r !== e && t(r, e), { name: r, value: i };
  };
}
var vn = [];
function me(t) {
  vn.push(t);
}
function yn({ name: t }) {
  return xn().test(t);
}
var xn = () => new RegExp(`^${ye}([^:^.]+)\\b`);
function zr(t, e) {
  return ({ name: n, value: r }) => {
    n === r && (r = "");
    let i = n.match(xn()), a = n.match(/:([a-zA-Z0-9\-_:]+)/), s = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = e || t[n] || n;
    return {
      type: i ? i[1] : null,
      value: a ? a[1] : null,
      modifiers: s.map((u) => u.replace(".", "")),
      expression: r,
      original: o
    };
  };
}
var Zt = "DEFAULT", $ = [
  "ignore",
  "ref",
  "id",
  "data",
  "anchor",
  "bind",
  "init",
  "for",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  Zt,
  "teleport"
];
function Ur(t, e) {
  let n = $.indexOf(t.type) === -1 ? Zt : t.type, r = $.indexOf(e.type) === -1 ? Zt : e.type;
  return $.indexOf(n) - $.indexOf(r);
}
function ut(t, e, n = {}, r = {}) {
  return t.dispatchEvent(
    new CustomEvent(e, {
      detail: n,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0,
      // Allows overriding the default event options.
      ...r
    })
  );
}
function K(t, e) {
  if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
    Array.from(t.children).forEach((i) => K(i, e));
    return;
  }
  let n = !1;
  if (e(t, () => n = !0), n)
    return;
  let r = t.firstElementChild;
  for (; r; )
    K(r, e), r = r.nextElementSibling;
}
function O(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var Le = !1;
function Vr() {
  Le && O("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Le = !0, document.body || O("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), ut(document, "alpine:init"), ut(document, "alpine:initializing"), _e(), mr((e) => D(e, K)), de((e) => Q(e)), Ze((e, n) => {
    xe(e, n).forEach((r) => r());
  });
  let t = (e) => !qt(e.parentElement, !0);
  Array.from(document.querySelectorAll(Sn().join(","))).filter(t).forEach((e) => {
    D(e);
  }), ut(document, "alpine:initialized"), setTimeout(() => {
    Gr();
  });
}
var we = [], mn = [];
function wn() {
  return we.map((t) => t());
}
function Sn() {
  return we.concat(mn).map((t) => t());
}
function An(t) {
  we.push(t);
}
function En(t) {
  mn.push(t);
}
function qt(t, e = !1) {
  return P(t, (n) => {
    if ((e ? Sn() : wn()).some((i) => n.matches(i)))
      return !0;
  });
}
function P(t, e) {
  if (t) {
    if (e(t))
      return t;
    if (t._x_teleportBack)
      return P(t._x_teleportBack, e);
    if (t.parentNode instanceof ShadowRoot)
      return P(t.parentNode.host, e);
    if (t.parentElement)
      return P(t.parentElement, e);
  }
}
function Jr(t) {
  return wn().some((e) => t.matches(e));
}
var On = [];
function Qr(t) {
  On.push(t);
}
var Yr = 1;
function D(t, e = K, n = () => {
}) {
  P(t, (r) => r._x_ignore) || Kr(() => {
    e(t, (r, i) => {
      r._x_marker || (n(r, i), On.forEach((a) => a(r, i)), xe(r, r.attributes).forEach((a) => a()), r._x_ignore || (r._x_marker = Yr++), r._x_ignore && i());
    });
  });
}
function Q(t, e = K) {
  e(t, (n) => {
    wr(n), en(n), delete n._x_marker;
  });
}
function Gr() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, n, r]) => {
    Hr(n) || r.some((i) => {
      if (document.querySelector(i))
        return O(`found "${i}", but missing ${e} plugin`), !0;
    });
  });
}
var te = [], Se = !1;
function Ae(t = () => {
}) {
  return queueMicrotask(() => {
    Se || setTimeout(() => {
      ee();
    });
  }), new Promise((e) => {
    te.push(() => {
      t(), e();
    });
  });
}
function ee() {
  for (Se = !1; te.length; )
    te.shift()();
}
function Xr() {
  Se = !0;
}
function Ee(t, e) {
  return Array.isArray(e) ? $e(t, e.join(" ")) : typeof e == "object" && e !== null ? Zr(t, e) : typeof e == "function" ? Ee(t, e()) : $e(t, e);
}
function ne(t) {
  return t.split(/\s/).filter(Boolean);
}
function $e(t, e) {
  let n = (i) => ne(i).filter((a) => !t.classList.contains(a)).filter(Boolean), r = (i) => (t.classList.add(...i), () => {
    t.classList.remove(...i);
  });
  return e = e === !0 ? e = "" : e || "", r(n(e));
}
function Zr(t, e) {
  let n = Object.entries(e).flatMap(([s, o]) => o ? ne(s) : !1).filter(Boolean), r = Object.entries(e).flatMap(([s, o]) => o ? !1 : ne(s)).filter(Boolean), i = [], a = [];
  return r.forEach((s) => {
    t.classList.contains(s) && (t.classList.remove(s), a.push(s));
  }), n.forEach((s) => {
    t.classList.contains(s) || (t.classList.add(s), i.push(s));
  }), () => {
    a.forEach((s) => t.classList.add(s)), i.forEach((s) => t.classList.remove(s));
  };
}
function It(t, e) {
  return typeof e == "object" && e !== null ? ti(t, e) : ei(t, e);
}
function ti(t, e) {
  let n = {};
  return Object.entries(e).forEach(([r, i]) => {
    n[r] = t.style[r], r.startsWith("--") || (r = ni(r)), t.style.setProperty(r, i);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    It(t, n);
  };
}
function ei(t, e) {
  let n = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", n || "");
  };
}
function ni(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function re(t, e = () => {
}) {
  let n = !1;
  return function() {
    n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments));
  };
}
v("transition", (t, { value: e, modifiers: n, expression: r }, { evaluate: i }) => {
  typeof r == "function" && (r = i(r)), r !== !1 && (!r || typeof r == "boolean" ? ii(t, n, e) : ri(t, r, e));
});
function ri(t, e, n) {
  Cn(t, Ee, ""), {
    enter: (i) => {
      t._x_transition.enter.during = i;
    },
    "enter-start": (i) => {
      t._x_transition.enter.start = i;
    },
    "enter-end": (i) => {
      t._x_transition.enter.end = i;
    },
    leave: (i) => {
      t._x_transition.leave.during = i;
    },
    "leave-start": (i) => {
      t._x_transition.leave.start = i;
    },
    "leave-end": (i) => {
      t._x_transition.leave.end = i;
    }
  }[n](e);
}
function ii(t, e, n) {
  Cn(t, It);
  let r = !e.includes("in") && !e.includes("out") && !n, i = r || e.includes("in") || ["enter"].includes(n), a = r || e.includes("out") || ["leave"].includes(n);
  e.includes("in") && !r && (e = e.filter((x, Y) => Y < e.indexOf("out"))), e.includes("out") && !r && (e = e.filter((x, Y) => Y > e.indexOf("out")));
  let s = !e.includes("opacity") && !e.includes("scale"), o = s || e.includes("opacity"), u = s || e.includes("scale"), c = o ? 0 : 1, l = u ? st(e, "scale", 95) / 100 : 1, f = st(e, "delay", 0) / 1e3, _ = st(e, "origin", "center"), b = "opacity, transform", C = st(e, "duration", 150) / 1e3, d = st(e, "duration", 75) / 1e3, y = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  i && (t._x_transition.enter.during = {
    transformOrigin: _,
    transitionDelay: `${f}s`,
    transitionProperty: b,
    transitionDuration: `${C}s`,
    transitionTimingFunction: y
  }, t._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${l})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), a && (t._x_transition.leave.during = {
    transformOrigin: _,
    transitionDelay: `${f}s`,
    transitionProperty: b,
    transitionDuration: `${d}s`,
    transitionTimingFunction: y
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${l})`
  });
}
function Cn(t, e, n = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(r = () => {
    }, i = () => {
    }) {
      ie(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, r, i);
    },
    out(r = () => {
    }, i = () => {
    }) {
      ie(t, e, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, r, i);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(t, e, n, r) {
  const i = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let a = () => i(n);
  if (e) {
    t._x_transition && (t._x_transition.enter || t._x_transition.leave) ? t._x_transition.enter && (Object.entries(t._x_transition.enter.during).length || Object.entries(t._x_transition.enter.start).length || Object.entries(t._x_transition.enter.end).length) ? t._x_transition.in(n) : a() : t._x_transition ? t._x_transition.in(n) : a();
    return;
  }
  t._x_hidePromise = t._x_transition ? new Promise((s, o) => {
    t._x_transition.out(() => {
    }, () => s(r)), t._x_transitioning && t._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(r), queueMicrotask(() => {
    let s = Mn(t);
    s ? (s._x_hideChildren || (s._x_hideChildren = []), s._x_hideChildren.push(t)) : i(() => {
      let o = (u) => {
        let c = Promise.all([
          u._x_hidePromise,
          ...(u._x_hideChildren || []).map(o)
        ]).then(([l]) => l?.());
        return delete u._x_hidePromise, delete u._x_hideChildren, c;
      };
      o(t).catch((u) => {
        if (!u.isFromCancelledTransition)
          throw u;
      });
    });
  });
};
function Mn(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : Mn(e);
}
function ie(t, e, { during: n, start: r, end: i } = {}, a = () => {
}, s = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(r).length === 0 && Object.keys(i).length === 0) {
    a(), s();
    return;
  }
  let o, u, c;
  si(t, {
    start() {
      o = e(t, r);
    },
    during() {
      u = e(t, n);
    },
    before: a,
    end() {
      o(), c = e(t, i);
    },
    after: s,
    cleanup() {
      u(), c();
    }
  });
}
function si(t, e) {
  let n, r, i, a = re(() => {
    g(() => {
      n = !0, r || e.before(), i || (e.end(), ee()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(s) {
      this.beforeCancels.push(s);
    },
    cancel: re(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      a();
    }),
    finish: a
  }, g(() => {
    e.start(), e.during();
  }), Xr(), requestAnimationFrame(() => {
    if (n)
      return;
    let s = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    s === 0 && (s = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), g(() => {
      e.before();
    }), r = !0, requestAnimationFrame(() => {
      n || (g(() => {
        e.end();
      }), ee(), setTimeout(t._x_transitioning.finish, s + o), i = !0);
    });
  });
}
function st(t, e, n) {
  if (t.indexOf(e) === -1)
    return n;
  const r = t[t.indexOf(e) + 1];
  if (!r || e === "scale" && isNaN(r))
    return n;
  if (e === "duration" || e === "delay") {
    let i = r.match(/([0-9]+)ms/);
    if (i)
      return i[1];
  }
  return e === "origin" && ["top", "right", "left", "center", "bottom"].includes(t[t.indexOf(e) + 2]) ? [r, t[t.indexOf(e) + 2]].join(" ") : r;
}
var I = !1;
function j(t, e = () => {
}) {
  return (...n) => I ? e(...n) : t(...n);
}
function ai(t) {
  return (...e) => I && t(...e);
}
var Tn = [];
function jt(t) {
  Tn.push(t);
}
function oi(t, e) {
  Tn.forEach((n) => n(t, e)), I = !0, Rn(() => {
    D(e, (n, r) => {
      r(n, () => {
      });
    });
  }), I = !1;
}
var se = !1;
function ui(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), I = !0, se = !0, Rn(() => {
    ci(e);
  }), I = !1, se = !1;
}
function ci(t) {
  let e = !1;
  D(t, (r, i) => {
    K(r, (a, s) => {
      if (e && Jr(a))
        return s();
      e = !0, i(a, s);
    });
  });
}
function Rn(t) {
  let e = J;
  Ne((n, r) => {
    let i = e(n);
    return et(i), () => {
    };
  }), t(), Ne(e);
}
function Pn(t, e, n, r = []) {
  switch (t._x_bindings || (t._x_bindings = tt({})), t._x_bindings[e] = n, e = r.includes("camel") ? gi(e) : e, e) {
    case "value":
      li(t, n);
      break;
    case "style":
      di(t, n);
      break;
    case "class":
      fi(t, n);
      break;
    case "selected":
    case "checked":
      pi(t, e, n);
      break;
    default:
      Oe(t, e, n);
      break;
  }
}
function li(t, e) {
  if (Ce(t))
    t.attributes.value === void 0 && (t.value = e);
  else if (Rt(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((n) => vi(n, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    bi(t, e);
  else if (t.tagName === "OPTION")
    Oe(t, "value", e);
  else {
    if (t.value === e && (typeof e != "object" || e === null))
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function fi(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = Ee(t, e);
}
function di(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = It(t, e);
}
function pi(t, e, n) {
  Oe(t, e, n), _i(t, e, n);
}
function Oe(t, e, n) {
  [null, void 0, !1].includes(n) && xi(e) ? t.removeAttribute(e) : (Dn(e) && (n = e), mi(n) && (n = JSON.stringify(n)), hi(t, e, n));
}
function hi(t, e, n) {
  t.getAttribute(e) != n && t.setAttribute(e, n);
}
function _i(t, e, n) {
  t[e] !== n && (t[e] = n);
}
function bi(t, e) {
  const n = [].concat(e).map((r) => r + "");
  Array.from(t.options).forEach((r) => {
    r.selected = n.includes(r.value);
  });
}
function gi(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function vi(t, e) {
  return t == e;
}
function Ot(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var yi = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootdelegatesfocus",
  "shadowrootserializable"
]);
function Dn(t) {
  return yi.has(t);
}
function xi(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function mi(t) {
  return typeof t == "object" && t !== null;
}
function wi(t, e, n) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : qn(t, e, n);
}
function Si(t, e, n, r = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let i = t._x_inlineBindings[e];
    return i.extract = r, cn(() => k(t, i.expression));
  }
  return qn(t, e, n);
}
function qn(t, e, n) {
  let r = t.getAttribute(e);
  return r === null ? typeof n == "function" ? n() : n : r === "" ? !0 : Dn(e) ? !![e, "true"].includes(r) : r;
}
function Rt(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function Ce(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function In(t, e) {
  let n;
  return function() {
    const r = this, i = arguments, a = function() {
      n = null, t.apply(r, i);
    };
    clearTimeout(n), n = setTimeout(a, e);
  };
}
function jn(t, e) {
  let n;
  return function() {
    let r = this, i = arguments;
    n || (t.apply(r, i), n = !0, setTimeout(() => n = !1, e));
  };
}
function Nn({ get: t, set: e }, { get: n, set: r }) {
  let i = !0, a, s = J(() => {
    let o = t(), u = n();
    if (i)
      r(kt(o)), i = !1;
    else {
      let c = JSON.stringify(o), l = JSON.stringify(u);
      c !== a ? r(kt(o)) : c !== l && e(kt(u));
    }
    a = JSON.stringify(t()), JSON.stringify(n());
  });
  return () => {
    et(s);
  };
}
function kt(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function Ai(t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => n(rt));
}
var T = {}, ke = !1;
function Ei(t, e) {
  if (ke || (T = tt(T), ke = !0), e === void 0)
    return T[t];
  T[t] = e, typeof e == "object" && e !== null && e._x_interceptor ? T[t] = e.initialize(T, t, t, () => {
  }) : ve(T[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && T[t].init();
}
function Oi() {
  return T;
}
var Ln = {};
function Ci(t, e) {
  let n = typeof e != "function" ? () => e : e;
  return t instanceof Element ? $n(t, n()) : (Ln[t] = n, () => {
  });
}
function Mi(t) {
  return Object.entries(Ln).forEach(([e, n]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...r) => n(...r);
      }
    });
  }), t;
}
function $n(t, e, n) {
  let r = [];
  for (; r.length; )
    r.pop()();
  let i = Object.entries(e).map(([s, o]) => ({ name: s, value: o })), a = dn(i);
  return i = i.map((s) => a.find((o) => o.name === s.name) ? {
    name: `x-bind:${s.name}`,
    value: `"${s.value}"`
  } : s), xe(t, i, n).map((s) => {
    r.push(s.runCleanups), s();
  }), () => {
    for (; r.length; )
      r.pop()();
  };
}
var kn = {};
function Ti(t, e) {
  kn[t] = e;
}
function Ri(t, e) {
  return Object.entries(kn).forEach(([n, r]) => {
    Object.defineProperty(t, n, {
      get() {
        return (...i) => r.bind(e)(...i);
      },
      enumerable: !1
    });
  }), t;
}
var Pi = {
  get reactive() {
    return tt;
  },
  get release() {
    return et;
  },
  get effect() {
    return J;
  },
  get raw() {
    return Je;
  },
  get transaction() {
    return xr;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Er,
  dontAutoEvaluateFunctions: cn,
  disableEffectScheduling: gr,
  startObservingMutations: _e,
  stopObservingMutations: nn,
  setReactivityEngine: vr,
  onAttributeRemoved: tn,
  onAttributesAdded: Ze,
  closestDataStack: B,
  skipDuringClone: j,
  onlyDuringClone: ai,
  addRootSelector: An,
  addInitSelector: En,
  setErrorHandler: Pr,
  interceptClone: jt,
  addScopeToNode: mt,
  deferMutations: Ar,
  mapAttributes: me,
  evaluateLater: m,
  interceptInit: Qr,
  initInterceptors: ve,
  injectMagics: pt,
  setEvaluator: qr,
  setRawEvaluator: Ir,
  mergeProxies: H,
  extractProp: Si,
  findClosest: P,
  onElRemoved: de,
  closestRoot: qt,
  destroyTree: Q,
  interceptor: an,
  // INTERNAL: not public API and is subject to change without major release.
  transition: ie,
  // INTERNAL
  setStyles: It,
  // INTERNAL
  mutateDom: g,
  directive: v,
  entangle: Nn,
  throttle: jn,
  debounce: In,
  evaluate: k,
  evaluateRaw: kr,
  initTree: D,
  nextTick: Ae,
  prefixed: nt,
  prefix: Br,
  plugin: Ai,
  magic: A,
  store: Ei,
  start: Vr,
  clone: ui,
  // INTERNAL
  cloneNode: oi,
  // INTERNAL
  bound: wi,
  $data: rn,
  watch: Qe,
  walk: K,
  data: Ti,
  bind: Ci
}, rt = Pi;
function Di(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(","))
    e[n] = 1;
  return (n) => n in e;
}
var bt = Object.assign, qi = Object.prototype.hasOwnProperty, ae = (t, e) => qi.call(t, e), gt = Array.isArray, ct = (t) => Fn(t) === "[object Map]", Ii = (t) => typeof t == "string", wt = (t) => typeof t == "symbol", vt = (t) => t !== null && typeof t == "object", ji = Object.prototype.toString, Fn = (t) => ji.call(t), Bn = (t) => Fn(t).slice(8, -1), Me = (t) => Ii(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Ni = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, Li = Ni((t) => t.charAt(0).toUpperCase() + t.slice(1)), L = (t, e) => !Object.is(t, e);
function W(t, ...e) {
  console.warn(`[Vue warn] ${t}`, ...e);
}
var p, Ft = /* @__PURE__ */ new WeakSet(), Fe = class {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Ft.has(this) && (Ft.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || $i(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Be(this), Kn(this);
    const t = p, e = S;
    p = this, S = !0;
    try {
      return this.fn();
    } finally {
      p !== this && W(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Wn(this), p = t, S = e, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Pe(t);
      this.deps = this.depsTail = void 0, Be(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Ft.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    oe(this) && this.run();
  }
  get dirty() {
    return oe(this);
  }
}, Hn = 0, lt, ft;
function $i(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = ft, ft = t;
    return;
  }
  t.next = lt, lt = t;
}
function Te() {
  Hn++;
}
function Re() {
  if (--Hn > 0)
    return;
  if (ft) {
    let e = ft;
    for (ft = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; lt; ) {
    let e = lt;
    for (lt = void 0; e; ) {
      const n = e.next;
      if (e.next = void 0, e.flags &= -9, e.flags & 1)
        try {
          e.trigger();
        } catch (r) {
          t || (t = r);
        }
      e = n;
    }
  }
  if (t)
    throw t;
}
function Kn(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function Wn(t) {
  let e, n = t.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), Pe(r), Fi(r)) : e = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  t.deps = e, t.depsTail = n;
}
function oe(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (ki(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function ki(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === Pt) || (t.globalVersion = Pt, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !oe(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = p, r = S;
  p = t, S = !0;
  try {
    Kn(t);
    const i = t.fn(t._value);
    (e.version === 0 || L(i, t._value)) && (t.flags |= 128, t._value = i, e.version++);
  } catch (i) {
    throw e.version++, i;
  } finally {
    p = n, S = r, Wn(t), t.flags &= -3;
  }
}
function Pe(t, e = !1) {
  const { dep: n, prevSub: r, nextSub: i } = t;
  if (r && (r.nextSub = i, t.prevSub = void 0), i && (i.prevSub = r, t.nextSub = void 0), n.subsHead === t && (n.subsHead = i), n.subs === t && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let a = n.computed.deps; a; a = a.nextDep)
      Pe(a, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Fi(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
function Bi(t, e) {
  t.effect instanceof Fe && (t = t.effect.fn);
  const n = new Fe(t);
  e && bt(n, e);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const r = n.run.bind(n);
  return r.effect = n, r;
}
function Hi(t) {
  t.effect.stop();
}
var S = !0, zn = [];
function Ki() {
  zn.push(S), S = !1;
}
function Wi() {
  const t = zn.pop();
  S = t === void 0 ? !0 : t;
}
function Be(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = p;
    p = void 0;
    try {
      e();
    } finally {
      p = n;
    }
  }
}
var Pt = 0, zi = class {
  constructor(t, e) {
    this.sub = t, this.dep = e, this.version = e.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, Ui = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!p || !S || p === this.computed)
      return;
    let e = this.activeLink;
    if (e === void 0 || e.sub !== p)
      e = this.activeLink = new zi(p, this), p.deps ? (e.prevDep = p.depsTail, p.depsTail.nextDep = e, p.depsTail = e) : p.deps = p.depsTail = e, Un(e);
    else if (e.version === -1 && (e.version = this.version, e.nextDep)) {
      const n = e.nextDep;
      n.prevDep = e.prevDep, e.prevDep && (e.prevDep.nextDep = n), e.prevDep = p.depsTail, e.nextDep = void 0, p.depsTail.nextDep = e, p.depsTail = e, p.deps === e && (p.deps = n);
    }
    return p.onTrack && p.onTrack(
      bt(
        {
          effect: p
        },
        t
      )
    ), e;
  }
  trigger(t) {
    this.version++, Pt++, this.notify(t);
  }
  notify(t) {
    Te();
    try {
      for (let e = this.subsHead; e; e = e.nextSub)
        e.sub.onTrigger && !(e.sub.flags & 8) && e.sub.onTrigger(
          bt(
            {
              effect: e.sub
            },
            t
          )
        );
      for (let e = this.subs; e; e = e.prevSub)
        e.sub.notify() && e.sub.dep.notify();
    } finally {
      Re();
    }
  }
};
function Un(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let r = e.deps; r; r = r.nextDep)
        Un(r);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subsHead === void 0 && (t.dep.subsHead = t), t.dep.subs = t;
  }
}
var ue = /* @__PURE__ */ new WeakMap(), F = /* @__PURE__ */ Symbol(
  "Object iterate"
), ce = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), yt = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function w(t, e, n) {
  if (S && p) {
    let r = ue.get(t);
    r || ue.set(t, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Ui()), i.map = r, i.key = n), i.track({
      target: t,
      type: e,
      key: n
    });
  }
}
function q(t, e, n, r, i, a) {
  const s = ue.get(t);
  if (!s) {
    Pt++;
    return;
  }
  const o = (u) => {
    u && u.trigger({
      target: t,
      type: e,
      key: n,
      newValue: r,
      oldValue: i,
      oldTarget: a
    });
  };
  if (Te(), e === "clear")
    s.forEach(o);
  else {
    const u = gt(t), c = u && Me(n);
    if (u && n === "length") {
      const l = Number(r);
      s.forEach((f, _) => {
        (_ === "length" || _ === yt || !wt(_) && _ >= l) && o(f);
      });
    } else
      switch ((n !== void 0 || s.has(void 0)) && o(s.get(n)), c && o(s.get(yt)), e) {
        case "add":
          u ? c && o(s.get("length")) : (o(s.get(F)), ct(t) && o(s.get(ce)));
          break;
        case "delete":
          u || (o(s.get(F)), ct(t) && o(s.get(ce)));
          break;
        case "set":
          ct(t) && o(s.get(F));
          break;
      }
  }
  Re();
}
function G(t) {
  const e = h(t);
  return e === t ? e : (w(e, "iterate", yt), U(t) ? e : e.map(V));
}
function De(t) {
  return w(t = h(t), "iterate", yt), t;
}
function E(t, e) {
  return z(t) ? Zn(t) ? xt(V(e)) : xt(e) : V(e);
}
var Vi = {
  __proto__: null,
  [Symbol.iterator]() {
    return Bt(this, Symbol.iterator, (t) => E(this, t));
  },
  concat(...t) {
    return G(this).concat(
      ...t.map((e) => gt(e) ? G(e) : e)
    );
  },
  entries() {
    return Bt(this, "entries", (t) => (t[1] = E(this, t[1]), t));
  },
  every(t, e) {
    return M(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return M(
      this,
      "filter",
      t,
      e,
      (n) => n.map((r) => E(this, r)),
      arguments
    );
  },
  find(t, e) {
    return M(
      this,
      "find",
      t,
      e,
      (n) => E(this, n),
      arguments
    );
  },
  findIndex(t, e) {
    return M(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return M(
      this,
      "findLast",
      t,
      e,
      (n) => E(this, n),
      arguments
    );
  },
  findLastIndex(t, e) {
    return M(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return M(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return Ht(this, "includes", t);
  },
  indexOf(...t) {
    return Ht(this, "indexOf", t);
  },
  join(t) {
    return G(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Ht(this, "lastIndexOf", t);
  },
  map(t, e) {
    return M(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return at(this, "pop");
  },
  push(...t) {
    return at(this, "push", t);
  },
  reduce(t, ...e) {
    return He(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return He(this, "reduceRight", t, e);
  },
  shift() {
    return at(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return M(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return at(this, "splice", t);
  },
  toReversed() {
    return G(this).toReversed();
  },
  toSorted(t) {
    return G(this).toSorted(t);
  },
  toSpliced(...t) {
    return G(this).toSpliced(...t);
  },
  unshift(...t) {
    return at(this, "unshift", t);
  },
  values() {
    return Bt(this, "values", (t) => E(this, t));
  }
};
function Bt(t, e, n) {
  const r = De(t), i = r[e]();
  return r !== t && !U(t) && (i._next = i.next, i.next = () => {
    const a = i._next();
    return a.done || (a.value = n(a.value)), a;
  }), i;
}
var Ji = Array.prototype;
function M(t, e, n, r, i, a) {
  const s = De(t), o = s !== t && !U(t), u = s[e];
  if (u !== Ji[e]) {
    const f = u.apply(t, a);
    return o ? V(f) : f;
  }
  let c = n;
  s !== t && (o ? c = function(f, _) {
    return n.call(this, E(t, f), _, t);
  } : n.length > 2 && (c = function(f, _) {
    return n.call(this, f, _, t);
  }));
  const l = u.call(s, c, r);
  return o && i ? i(l) : l;
}
function He(t, e, n, r) {
  const i = De(t), a = i !== t && !U(t);
  let s = n, o = !1;
  i !== t && (a ? (o = r.length === 0, s = function(c, l, f) {
    return o && (o = !1, c = E(t, c)), n.call(this, c, E(t, l), f, t);
  }) : n.length > 3 && (s = function(c, l, f) {
    return n.call(this, c, l, f, t);
  }));
  const u = i[e](s, ...r);
  return o ? E(t, u) : u;
}
function Ht(t, e, n) {
  const r = h(t);
  w(r, "iterate", yt);
  const i = r[e](...n);
  return (i === -1 || i === !1) && us(n[0]) ? (n[0] = h(n[0]), r[e](...n)) : i;
}
function at(t, e, n = []) {
  Ki(), Te();
  const r = h(t)[e].apply(t, n);
  return Re(), Wi(), r;
}
var Qi = /* @__PURE__ */ Di("__proto__,__v_isRef,__isVue"), Vn = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(wt)
);
function Yi(t) {
  wt(t) || (t = String(t));
  const e = h(this);
  return w(e, "has", t), e.hasOwnProperty(t);
}
var Jn = class {
  constructor(t = !1, e = !1) {
    this._isReadonly = t, this._isShallow = e;
  }
  get(t, e, n) {
    if (e === "__v_skip")
      return t.__v_skip;
    const r = this._isReadonly, i = this._isShallow;
    if (e === "__v_isReactive")
      return !r;
    if (e === "__v_isReadonly")
      return r;
    if (e === "__v_isShallow")
      return i;
    if (e === "__v_raw")
      return n === (r ? i ? as : Gn : i ? ss : Yn).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const a = gt(t);
    if (!r) {
      let o;
      if (a && (o = Vi[e]))
        return o;
      if (e === "hasOwnProperty")
        return Yi;
    }
    const s = Reflect.get(
      t,
      e,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      dt(t) ? t : n
    );
    if ((wt(e) ? Vn.has(e) : Qi(e)) || (r || w(t, "get", e), i))
      return s;
    if (dt(s)) {
      const o = a && Me(e) ? s : s.value;
      return r && vt(o) ? le(o) : o;
    }
    return vt(s) ? r ? le(s) : qe(s) : s;
  }
}, Gi = class extends Jn {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, e, n, r) {
    let i = t[e];
    const a = gt(t) && Me(e);
    if (!this._isShallow) {
      const u = z(i);
      if (!U(n) && !z(n) && (i = h(i), n = h(n)), !a && dt(i) && !dt(n))
        return u ? (W(
          `Set operation on key "${String(e)}" failed: target is readonly.`,
          t[e]
        ), !0) : (i.value = n, !0);
    }
    const s = a ? Number(e) < t.length : ae(t, e), o = Reflect.set(
      t,
      e,
      n,
      dt(t) ? t : r
    );
    return t === h(r) && o && (s ? L(n, i) && q(t, "set", e, n, i) : q(t, "add", e, n)), o;
  }
  deleteProperty(t, e) {
    const n = ae(t, e), r = t[e], i = Reflect.deleteProperty(t, e);
    return i && n && q(t, "delete", e, void 0, r), i;
  }
  has(t, e) {
    const n = Reflect.has(t, e);
    return (!wt(e) || !Vn.has(e)) && w(t, "has", e), n;
  }
  ownKeys(t) {
    return w(
      t,
      "iterate",
      gt(t) ? "length" : F
    ), Reflect.ownKeys(t);
  }
}, Xi = class extends Jn {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, e) {
    return W(
      `Set operation on key "${String(e)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, e) {
    return W(
      `Delete operation on key "${String(e)}" failed: target is readonly.`,
      t
    ), !0;
  }
}, Zi = /* @__PURE__ */ new Gi(), ts = /* @__PURE__ */ new Xi(), St = (t) => Reflect.getPrototypeOf(t);
function es(t, e, n) {
  return function(...r) {
    const i = this.__v_raw, a = h(i), s = ct(a), o = t === "entries" || t === Symbol.iterator && s, u = t === "keys" && s, c = i[t](...r), l = e ? xt : V;
    return !e && w(
      a,
      "iterate",
      u ? ce : F
    ), bt(
      // inheriting all iterator properties
      Object.create(c),
      {
        // iterator protocol
        next() {
          const { value: f, done: _ } = c.next();
          return _ ? { value: f, done: _ } : {
            value: o ? [l(f[0]), l(f[1])] : l(f),
            done: _
          };
        }
      }
    );
  };
}
function At(t) {
  return function(...e) {
    {
      const n = e[0] ? `on key "${e[0]}" ` : "";
      W(
        `${Li(t)} operation ${n}failed: target is readonly.`,
        h(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function ns(t, e) {
  const n = {
    get(i) {
      const a = this.__v_raw, s = h(a), o = h(i);
      t || (L(i, o) && w(s, "get", i), w(s, "get", o));
      const { has: u } = St(s), c = t ? xt : V;
      if (u.call(s, i))
        return c(a.get(i));
      if (u.call(s, o))
        return c(a.get(o));
      a !== s && a.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !t && w(h(i), "iterate", F), i.size;
    },
    has(i) {
      const a = this.__v_raw, s = h(a), o = h(i);
      return t || (L(i, o) && w(s, "has", i), w(s, "has", o)), i === o ? a.has(i) : a.has(i) || a.has(o);
    },
    forEach(i, a) {
      const s = this, o = s.__v_raw, u = h(o), c = t ? xt : V;
      return !t && w(u, "iterate", F), o.forEach((l, f) => i.call(a, c(l), c(f), s));
    }
  };
  return bt(
    n,
    t ? {
      add: At("add"),
      set: At("set"),
      delete: At("delete"),
      clear: At("clear")
    } : {
      add(i) {
        const a = h(this), s = St(a), o = h(i), u = !U(i) && !z(i) ? o : i;
        return s.has.call(a, u) || L(i, u) && s.has.call(a, i) || L(o, u) && s.has.call(a, o) || (a.add(u), q(a, "add", u, u)), this;
      },
      set(i, a) {
        !U(a) && !z(a) && (a = h(a));
        const s = h(this), { has: o, get: u } = St(s);
        let c = o.call(s, i);
        c ? Ke(s, o, i) : (i = h(i), c = o.call(s, i));
        const l = u.call(s, i);
        return s.set(i, a), c ? L(a, l) && q(s, "set", i, a, l) : q(s, "add", i, a), this;
      },
      delete(i) {
        const a = h(this), { has: s, get: o } = St(a);
        let u = s.call(a, i);
        u ? Ke(a, s, i) : (i = h(i), u = s.call(a, i));
        const c = o ? o.call(a, i) : void 0, l = a.delete(i);
        return u && q(a, "delete", i, void 0, c), l;
      },
      clear() {
        const i = h(this), a = i.size !== 0, s = ct(i) ? new Map(i) : new Set(i), o = i.clear();
        return a && q(
          i,
          "clear",
          void 0,
          void 0,
          s
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = es(i, t);
  }), n;
}
function Qn(t, e) {
  const n = ns(t);
  return (r, i, a) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? r : Reflect.get(
    ae(n, i) && i in r ? n : r,
    i,
    a
  );
}
var rs = {
  get: /* @__PURE__ */ Qn(!1)
}, is = {
  get: /* @__PURE__ */ Qn(!0)
};
function Ke(t, e, n) {
  const r = h(n);
  if (r !== n && e.call(t, r)) {
    const i = Bn(t);
    W(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var Yn = /* @__PURE__ */ new WeakMap(), ss = /* @__PURE__ */ new WeakMap(), Gn = /* @__PURE__ */ new WeakMap(), as = /* @__PURE__ */ new WeakMap();
function os(t) {
  switch (t) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function qe(t) {
  return /* @__PURE__ */ z(t) ? t : Xn(
    t,
    !1,
    Zi,
    rs,
    Yn
  );
}
function le(t) {
  return Xn(
    t,
    !0,
    ts,
    is,
    Gn
  );
}
function Xn(t, e, n, r, i) {
  if (!vt(t))
    return W(
      `value cannot be made ${e ? "readonly" : "reactive"}: ${String(
        t
      )}`
    ), t;
  if (t.__v_raw && !(e && t.__v_isReactive) || t.__v_skip || !Object.isExtensible(t))
    return t;
  const a = i.get(t);
  if (a)
    return a;
  const s = os(Bn(t));
  if (s === 0)
    return t;
  const o = new Proxy(
    t,
    s === 2 ? r : n
  );
  return i.set(t, o), o;
}
function Zn(t) {
  return /* @__PURE__ */ z(t) ? /* @__PURE__ */ Zn(t.__v_raw) : !!(t && t.__v_isReactive);
}
function z(t) {
  return !!(t && t.__v_isReadonly);
}
function U(t) {
  return !!(t && t.__v_isShallow);
}
function us(t) {
  return t ? !!t.__v_raw : !1;
}
function h(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ h(e) : t;
}
var V = (t) => vt(t) ? /* @__PURE__ */ qe(t) : t, xt = (t) => vt(t) ? /* @__PURE__ */ le(t) : t;
function dt(t) {
  return t ? t.__v_isRef === !0 : !1;
}
A("nextTick", () => Ae);
A("dispatch", (t) => ut.bind(ut, t));
A("watch", (t, { evaluateLater: e, cleanup: n }) => (r, i) => {
  let a = e(r), o = Qe(() => {
    let u;
    return a((c) => u = c), u;
  }, i);
  n(o);
});
A("store", Oi);
A("data", (t) => rn(t));
A("root", (t) => qt(t));
A("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = H(cs(t))), t._x_refs_proxy));
function cs(t) {
  let e = [];
  return P(t, (n) => {
    n._x_refs && e.push(n._x_refs);
  }), e;
}
var Kt = {};
function tr(t) {
  return Kt[t] || (Kt[t] = 0), ++Kt[t];
}
function ls(t, e) {
  return P(t, (n) => {
    if (n._x_ids && n._x_ids[e])
      return !0;
  });
}
function fs(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = tr(e));
}
A("id", (t, { cleanup: e }) => (n, r = null) => {
  let i = `${n}${r ? `-${r}` : ""}`;
  return ds(t, i, e, () => {
    let a = ls(t, n), s = a ? a._x_ids[n] : tr(n);
    return r ? `${n}-${s}-${r}` : `${n}-${s}`;
  });
});
jt((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function ds(t, e, n, r) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let i = r();
  return t._x_id[e] = i, n(() => {
    delete t._x_id[e];
  }), i;
}
A("el", (t) => t);
er("Focus", "focus", "focus");
er("Persist", "persist", "persist");
function er(t, e, n) {
  A(e, (r) => O(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
v("modelable", (t, { expression: e }, { effect: n, evaluateLater: r, cleanup: i }) => {
  let a = r(e), s = () => {
    let l;
    return a((f) => l = f), l;
  }, o = r(`${e} = __placeholder`), u = (l) => o(() => {
  }, { scope: { __placeholder: l } }), c = s();
  u(c), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let l = t._x_model.get, f = t._x_model.setWithModifiers, _ = Nn(
      {
        get() {
          return l();
        },
        set(b) {
          f(b);
        }
      },
      {
        get() {
          return s();
        },
        set(b) {
          u(b);
        }
      }
    );
    i(_);
  });
});
v("teleport", (t, { modifiers: e, expression: n }, { cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && O("x-teleport can only be used on a <template> tag", t);
  let i = We(n), a = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = a, a._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), a.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((o) => {
    a.addEventListener(o, (u) => {
      u.stopPropagation(), t.dispatchEvent(new u.constructor(u.type, u));
    });
  }), mt(a, {}, t);
  let s = (o, u, c) => {
    c.includes("prepend") ? u.parentNode.insertBefore(o, u) : c.includes("append") ? u.parentNode.insertBefore(o, u.nextSibling) : u.appendChild(o);
  };
  g(() => {
    j(() => {
      s(a, i, e), D(a);
    })();
  }), t._x_teleportPutBack = () => {
    let o = We(n);
    g(() => {
      s(t._x_teleport, o, e);
    });
  }, r(
    () => g(() => {
      a.remove(), Q(a);
    })
  );
});
var ps = document.createElement("div");
function We(t) {
  let e = j(() => document.querySelector(t), () => ps)();
  return e || O(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var nr = () => {
};
nr.inline = (t, { modifiers: e }, { cleanup: n }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
v("ignore", nr);
v("effect", j((t, { expression: e }, { effect: n }) => {
  n(m(t, e));
}));
function X(t, e, n, r) {
  let i = t, a = (u) => r(u), s = {}, o = (u, c) => (l) => c(u, l);
  return n.includes("dot") && (e = hs(e)), n.includes("camel") && (e = _s(e)), n.includes("capture") && (s.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("passive") && (s.passive = n[n.indexOf("passive") + 1] !== "false"), a = rr(n, a), n.includes("prevent") && (a = o(a, (u, c) => {
    c.preventDefault(), u(c);
  })), n.includes("stop") && (a = o(a, (u, c) => {
    c.stopPropagation(), u(c);
  })), n.includes("once") && (a = o(a, (u, c) => {
    u(c), i.removeEventListener(e, a, s);
  })), (n.includes("away") || n.includes("outside")) && (i = document, a = o(a, (u, c) => {
    t.contains(c.target) || c.target.isConnected !== !1 && (t.offsetWidth < 1 && t.offsetHeight < 1 || t._x_isShown !== !1 && u(c));
  })), n.includes("self") && (a = o(a, (u, c) => {
    c.target === t && u(c);
  })), e === "submit" && (a = o(a, (u, c) => {
    c.target._x_pendingModelUpdates && c.target._x_pendingModelUpdates.forEach((l) => l()), u(c);
  })), (gs(e) || ir(e)) && (a = o(a, (u, c) => {
    vs(c, n) || u(c);
  })), i.addEventListener(e, a, s), () => {
    i.removeEventListener(e, a, s);
  };
}
function rr(t, e) {
  if (t.includes("debounce")) {
    let n = t[t.indexOf("debounce") + 1] || "invalid-wait", r = Dt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = In(e, r);
  }
  if (t.includes("throttle")) {
    let n = t[t.indexOf("throttle") + 1] || "invalid-wait", r = Dt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = jn(e, r);
  }
  return e;
}
function hs(t) {
  return t.replace(/-/g, ".");
}
function _s(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function Dt(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function bs(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function gs(t) {
  return ["keydown", "keyup"].includes(t);
}
function ir(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function vs(t, e) {
  let n = e.filter((a) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(a));
  if (n.includes("debounce")) {
    let a = n.indexOf("debounce");
    n.splice(a, Dt((n[a + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let a = n.indexOf("throttle");
    n.splice(a, Dt((n[a + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && ze(t.key).includes(n[0]))
    return !1;
  const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((a) => n.includes(a));
  return n = n.filter((a) => !i.includes(a)), !(i.length > 0 && i.filter((s) => ((s === "cmd" || s === "super") && (s = "meta"), t[`${s}Key`])).length === i.length && (ir(t.type) || ze(t.key).includes(n[0])));
}
function ze(t) {
  if (!t)
    return [];
  t = bs(t);
  let e = {
    ctrl: "control",
    slash: "/",
    space: " ",
    spacebar: " ",
    cmd: "meta",
    esc: "escape",
    up: "arrow-up",
    down: "arrow-down",
    left: "arrow-left",
    right: "arrow-right",
    period: ".",
    comma: ",",
    equal: "=",
    minus: "-",
    underscore: "_"
  };
  return e[t] = t, Object.keys(e).map((n) => {
    if (e[n] === t)
      return n;
  }).filter((n) => n);
}
v("model", (t, { modifiers: e, expression: n }, { effect: r, cleanup: i }) => {
  let a = t;
  e.includes("parent") && (a = P(t, (d) => d !== t));
  let s = m(a, n), o;
  typeof n == "string" ? o = m(a, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = m(a, `${n()} = __placeholder`) : o = () => {
  };
  let u = () => {
    let d;
    return s((y) => d = y), Ue(d) ? d.get() : d;
  }, c = (d) => {
    let y;
    s((x) => y = x), Ue(y) ? y.set(d) : o(() => {
    }, {
      scope: { __placeholder: d }
    });
  };
  typeof n == "string" && t.type === "radio" && g(() => {
    t.hasAttribute("name") || t.setAttribute("name", n);
  });
  let l = e.includes("change") || e.includes("lazy"), f = e.includes("blur"), _ = e.includes("enter"), b = l || f || _, C;
  if (I)
    C = () => {
    };
  else if (b) {
    let d = [], y = (x) => c(Et(t, e, x, u()));
    if (l && d.push(X(t, "change", e, y)), f && (d.push(X(t, "blur", e, y)), t.form)) {
      let x = t.form, Y = () => y({ target: t });
      x._x_pendingModelUpdates || (x._x_pendingModelUpdates = []), x._x_pendingModelUpdates.push(Y), i(() => {
        x._x_pendingModelUpdates && x._x_pendingModelUpdates.splice(x._x_pendingModelUpdates.indexOf(Y), 1);
      });
    }
    _ && d.push(X(t, "keydown", e, (x) => {
      x.key === "Enter" && y(x);
    })), C = () => d.forEach((x) => x());
  } else {
    let d = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) ? "change" : "input";
    C = X(t, d, e, (y) => {
      c(Et(t, e, y, u()));
    });
  }
  if (e.includes("fill") && ([void 0, null, ""].includes(u()) || Rt(t) && Array.isArray(u()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    Et(t, e, { target: t }, u())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = C, i(() => t._x_removeModelListeners.default()), t.form) {
    let d = X(t.form, "reset", [], (y) => {
      Ae(() => t._x_model && t._x_model.set(Et(t, e, { target: t }, u())));
    });
    i(() => d());
  }
  if (t._x_model = {
    get() {
      return u();
    },
    set(d) {
      c(d);
    },
    setWithModifiers: rr(e, c)
  }, t._x_forceModelUpdate = (d) => {
    d === void 0 && typeof n == "string" && n.match(/\./) && (d = ""), g(() => {
      Rt(t) ? Array.isArray(d) ? t.checked = d.some((y) => y == t.value) : t.checked = !!d : Ce(t) ? typeof d == "boolean" ? t.checked = Ot(t.value) === d : t.checked = t.value == d : Pn(t, "value", d);
    });
  }, t.tagName === "SELECT") {
    let d = new MutationObserver(() => {
      t._x_forceModelUpdate(u());
    });
    d.observe(t, { childList: !0 }), i(() => d.disconnect());
  }
  r(() => {
    let d = u();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(d);
  });
});
function Et(t, e, n, r) {
  return g(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Rt(t))
      if (Array.isArray(r)) {
        let i = null;
        return e.includes("number") ? i = Wt(n.target.value) : e.includes("boolean") ? i = Ot(n.target.value) : i = n.target.value, n.target.checked ? r.includes(i) ? r : r.concat([i]) : r.filter((a) => !ys(a, i));
      } else
        return n.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(n.target.selectedOptions).map((i) => {
          let a = i.value || i.text;
          return Wt(a);
        }) : e.includes("boolean") ? Array.from(n.target.selectedOptions).map((i) => {
          let a = i.value || i.text;
          return Ot(a);
        }) : Array.from(n.target.selectedOptions).map((i) => i.value || i.text);
      {
        let i;
        return Ce(t) ? n.target.checked ? i = n.target.value : i = r : i = n.target.value, e.includes("number") ? Wt(i) : e.includes("boolean") ? Ot(i) : e.includes("trim") ? i.trim() : i;
      }
    }
  });
}
function Wt(t) {
  let e = t ? parseFloat(t) : null;
  return xs(e) ? e : t;
}
function ys(t, e) {
  return t == e;
}
function xs(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Ue(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
v("cloak", (t) => queueMicrotask(() => g(() => t.removeAttribute(nt("cloak")))));
En(() => `[${nt("init")}]`);
v("init", j((t, { expression: e }, { evaluate: n }) => typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)));
v("text", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
  let i = r(e);
  n(() => {
    i((a) => {
      g(() => {
        t.textContent = a;
      });
    });
  });
});
v("html", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
  let i = r(e);
  n(() => {
    i((a) => {
      g(() => {
        Array.from(t.children).forEach((s) => Q(s)), t.innerHTML = a ?? "", t._x_ignoreSelf = !0, D(t), delete t._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
me(_n(":", bn(nt("bind:"))));
var sr = (t, { value: e, modifiers: n, expression: r, original: i }, { effect: a, cleanup: s }) => {
  if (!e) {
    let u = {};
    Mi(u), m(t, r)((l) => {
      $n(t, l, i);
    }, { scope: u });
    return;
  }
  if (e === "key")
    return ms(t, r);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let o = m(t, r);
  a(() => o((u) => {
    u === void 0 && typeof r == "string" && r.match(/\./) && (u = ""), g(() => Pn(t, e, u, n));
  })), s(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
sr.inline = (t, { value: e, modifiers: n, expression: r }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: r, extract: !1 });
};
v("bind", sr);
function ms(t, e) {
  t._x_keyExpression = e;
}
An(() => `[${nt("data")}]`);
var N = /* @__PURE__ */ Symbol();
v("data", (t, { expression: e }, { cleanup: n }) => {
  if (Ss(t))
    return;
  let r = t[N];
  if (r?.expression === e)
    return;
  e = e === "" ? "{}" : e;
  let i = {};
  pt(i, t);
  let a = {};
  Ri(a, i);
  let s = k(t, e, { scope: a });
  (s === void 0 || s === !0) && (s = {}), pt(s, t);
  let o;
  if (r?.reactiveData) {
    o = r.reactiveData, ws(o, s);
    let c = { expression: e };
    t[N] = c, queueMicrotask(() => {
      t[N] === c && delete t[N];
    });
  } else
    o = tt(s);
  ve(o, n);
  let u = mt(t, o);
  o.init && k(t, o.init), n(() => {
    o.destroy && k(t, o.destroy), u();
    let c = { reactiveData: o };
    t[N] = c, queueMicrotask(() => {
      t[N] === c && delete t[N];
    });
  });
});
function ws(t, e) {
  Object.keys(e).forEach((n) => {
    let r = Object.getOwnPropertyDescriptor(e, n), i = Object.getOwnPropertyDescriptor(t, n);
    r.get || r.set || i?.get || i?.set ? (i && delete t[n], i || (t[n] = void 0), r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]) : t[n] = e[n];
  }), Object.keys(t).filter((n) => !Object.prototype.hasOwnProperty.call(e, n)).forEach((n) => delete t[n]);
}
jt((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function Ss(t) {
  return I ? se ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
v("show", (t, { modifiers: e, expression: n }, { effect: r }) => {
  let i = m(t, n);
  t._x_doHide || (t._x_doHide = () => {
    g(() => {
      t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
    });
  }), t._x_doShow || (t._x_doShow = () => {
    g(() => {
      t.style.length === 1 && t.style.display === "none" ? t.removeAttribute("style") : t.style.removeProperty("display");
    });
  });
  let a = () => {
    t._x_doHide(), t._x_isShown = !1;
  }, s = () => {
    t._x_doShow(), t._x_isShown = !0;
  }, o = () => setTimeout(s), u = re(
    (f) => f ? s() : a(),
    (f) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, f, s, a) : f ? o() : a();
    }
  ), c, l = !0;
  r(() => i((f) => {
    !l && f === c || (e.includes("immediate") && (f ? o() : a()), u(f), c = f, l = !1);
  }));
});
v("for", j((t, { expression: e }, { effect: n, cleanup: r }) => {
  let i = Os(e), a = m(t, i.items), s = m(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_lookup = /* @__PURE__ */ new Map(), n(() => Es(t, i, a, s), { priority: "structural" }), r(() => {
    t._x_lookup.forEach(
      (o) => g(() => {
        Q(o), o.remove();
      })
    ), delete t._x_lookup, delete t._x_lastRenderedEl;
  });
}));
function As(t) {
  return (e) => {
    Object.entries(e).forEach(([n, r]) => {
      t[n] = r;
    });
  };
}
function Es(t, e, n, r) {
  n((i) => {
    Ms(i) && (i = Array.from({ length: i }, (c, l) => l + 1)), i == null && (i = []), i instanceof Set && (i = Array.from(i)), i instanceof Map && (i = Array.from(i));
    let a = t._x_lookup, s = /* @__PURE__ */ new Map();
    t._x_lookup = s;
    let o = Ts(i), u = Object.entries(i).map(([c, l]) => {
      o || (c = parseInt(c));
      let f = Cs(e, l, c, i), _;
      return r((b) => {
        typeof b == "object" && O("x-for key cannot be an object, it must be a string or an integer", t), a.has(b) && (s.set(b, a.get(b)), a.delete(b)), _ = b;
      }, { scope: { index: c, ...f } }), [_, f];
    });
    g(() => {
      a.forEach((f) => {
        Q(f), f.remove();
      });
      let c = /* @__PURE__ */ new Set(), l = t;
      u.forEach(([f, _]) => {
        if (s.has(f)) {
          let d = s.get(f);
          d._x_refreshXForScope(_), l.nextElementSibling !== d && (l.nextElementSibling && d.replaceWith(l.nextElementSibling), l.after(d)), l = d, d._x_currentIfEl && (d.nextElementSibling !== d._x_currentIfEl && l.after(d._x_currentIfEl), l = d._x_currentIfEl);
          return;
        }
        t.content.children.length > 1 && O("x-for templates require a single root element, additional elements will be ignored.", t);
        let b = document.importNode(t.content, !0).firstElementChild, C = tt(_);
        mt(b, C, t), b._x_refreshXForScope = As(C), s.set(f, b), c.add(b), l.after(b), l = b;
      }), c.forEach((f) => D(f)), l !== t ? t._x_lastRenderedEl = l : delete t._x_lastRenderedEl;
    });
  });
}
function Os(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, r = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, i = t.match(r);
  if (!i)
    return;
  let a = {};
  a.items = i[2].trim();
  let s = i[1].replace(n, "").trim(), o = s.match(e);
  return o ? (a.item = s.replace(e, "").trim(), a.index = o[1].trim(), o[2] && (a.collection = o[2].trim())) : a.item = s, a;
}
function Cs(t, e, n, r) {
  let i = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((s) => s.trim()).forEach((s, o) => {
    i[s] = e[o];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((s) => s.trim()).forEach((s) => {
    i[s] = e[s];
  }) : i[t.item] = e, t.index && (i[t.index] = n), t.collection && (i[t.collection] = r), i;
}
function Ms(t) {
  return typeof t != "object" && !isNaN(t);
}
function Ts(t) {
  return typeof t == "object" && !Array.isArray(t);
}
function ar() {
}
ar.inline = (t, { expression: e }, { cleanup: n }) => {
  let r = qt(t);
  r && (r._x_refs || (r._x_refs = {}), r._x_refs[e] = t, n(() => delete r._x_refs[e]));
};
v("ref", ar);
v("if", j((t, { expression: e }, { effect: n, cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && O("x-if can only be used on a <template> tag", t);
  let i = m(t, e), a = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let o = t.content.cloneNode(!0).firstElementChild;
    return mt(o, {}, t), g(() => {
      t.after(o), D(o);
    }), t._x_currentIfEl = o, t._x_lastRenderedEl = o, t._x_undoIf = () => {
      g(() => {
        Q(o), o.remove();
      }), delete t._x_currentIfEl, delete t._x_lastRenderedEl;
    }, o;
  }, s = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  n(() => i((o) => {
    o ? a() : s();
  }), { priority: "structural" }), r(() => t._x_undoIf && t._x_undoIf());
}));
v("id", (t, { expression: e }, { evaluate: n }) => {
  n(e).forEach((i) => fs(t, i));
});
jt((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
me(_n("@", bn(nt("on:"))));
v("on", j((t, { value: e, modifiers: n, expression: r }, { cleanup: i }) => {
  let a = r ? m(t, r) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let s = X(t, e, n, (o) => {
    a(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  i(() => s());
}));
Nt("Collapse", "collapse", "collapse");
Nt("Intersect", "intersect", "intersect");
Nt("Focus", "trap", "focus");
Nt("Mask", "mask", "mask");
function Nt(t, e, n) {
  v(e, (r) => O(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
rt.setEvaluator(jr);
rt.setRawEvaluator(Fr);
rt.setReactivityEngine({
  reactive: qe,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (t, e = {}) => {
    let n;
    return n = Bi(t, {
      scheduler: () => {
        n && (e.scheduler ? e.scheduler(n) : n());
      }
    }), n;
  },
  release: Hi,
  raw: h
});
var Rs = rt, zt = Rs;
const or = "siteation.debugbar.v1";
function Ps() {
  const t = document.getElementById("siteation-debugbar-profile");
  if (!t) return {};
  try {
    return JSON.parse(t.textContent || "{}");
  } catch {
    return {};
  }
}
function Ds() {
  try {
    return { open: !1, section: "overview", ...JSON.parse(localStorage.getItem(or) || "{}") };
  } catch {
    return { open: !1, section: "overview" };
  }
}
function qs() {
  return {
    profile: {},
    open: !1,
    section: "overview",
    queryFilter: "all",
    querySearch: "",
    init() {
      this.profile = Ps();
      const t = Ds();
      this.open = t.open, this.section = t.section;
    },
    /** @returns {object} */
    get request() {
      return this.profile.sections?.request?.summary || {};
    },
    /** @returns {object} */
    get queries() {
      return this.profile.sections?.queries?.summary || {};
    },
    /** @returns {object} */
    get metrics() {
      return this.profile.metrics || {};
    },
    /** @returns {Array<object>} */
    get queryItems() {
      return this.profile.sections?.queries?.payload?.items || [];
    },
    /** @returns {Array<object>} */
    get visibleQueries() {
      const t = this.querySearch.trim().toLowerCase();
      return this.queryItems.filter((e) => !(this.queryFilter === "slow" && !e.slow || t && !String(e.sql).toLowerCase().includes(t)));
    },
    /** @returns {boolean} */
    get hasProfile() {
      return !!this.profile.id;
    },
    /** @returns {string} */
    get statusTone() {
      const t = Number(this.request.status || 0);
      return t >= 500 ? "bad" : t >= 400 ? "warn" : "ok";
    },
    /** @returns {string} */
    get durationTone() {
      return Number(this.metrics.duration_ms || 0) >= 1e3 ? "warn" : "ok";
    },
    /** @returns {string} */
    get queryTone() {
      return Number(this.queries.slow_count || 0) > 0 ? "warn" : "ok";
    },
    toggle() {
      this.open = !this.open, this.persist();
    },
    select(t) {
      this.section = t, this.open = !0, this.persist();
    },
    /**
     * @param {string} section
     * @returns {boolean}
     */
    isSection(t) {
      return this.section === t;
    },
    persist() {
      try {
        localStorage.setItem(or, JSON.stringify({ open: this.open, section: this.section }));
      } catch {
      }
    },
    /**
     * @param {number} value
     * @param {number} decimals
     * @returns {string}
     */
    number(t, e = 0) {
      return Number(t || 0).toFixed(e);
    }
  };
}
const Is = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak>

  <section class="ndb-panel" data-ndb-show="open" data-ndb-cloak>
    <nav class="ndb-tabs">
      <button type="button" class="ndb-tab" data-ndb-on:click="select('overview')"
              data-ndb-bind:class="isSection('overview') && 'is-active'">Overview</button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('queries')"
              data-ndb-bind:class="isSection('queries') && 'is-active'">
        Queries <span class="ndb-pill" data-ndb-text="queries.count || 0"></span>
      </button>
    </nav>

    <div class="ndb-panel-body">

      <div data-ndb-show="isSection('overview')">
        <dl class="ndb-facts">
          <div><dt>Method</dt><dd data-ndb-text="request.method"></dd></div>
          <div><dt>Path</dt><dd class="ndb-mono" data-ndb-text="request.path"></dd></div>
          <div><dt>Route</dt><dd data-ndb-text="request.route || 'unknown'"></dd></div>
          <div><dt>Action</dt><dd class="ndb-mono" data-ndb-text="request.action || 'unknown'"></dd></div>
          <div><dt>Area</dt><dd data-ndb-text="request.area"></dd></div>
          <div><dt>Status</dt><dd data-ndb-text="request.status"></dd></div>
          <div><dt>Duration</dt><dd><span data-ndb-text="number(metrics.duration_ms, 1)"></span> ms</dd></div>
          <div><dt>Memory peak</dt><dd><span data-ndb-text="number(metrics.memory_peak_mb, 1)"></span> MB</dd></div>
          <div><dt>Queries</dt><dd>
            <span data-ndb-text="queries.count || 0"></span> in
            <span data-ndb-text="number(queries.duration_ms, 1)"></span> ms
          </dd></div>
          <div><dt>Profile</dt><dd class="ndb-mono ndb-dim" data-ndb-text="profile.id"></dd></div>
        </dl>
      </div>

      <div data-ndb-show="isSection('queries')" class="ndb-queries">
        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="queryFilter = 'all'"
                  data-ndb-bind:class="queryFilter === 'all' && 'is-active'">All</button>
          <button type="button" class="ndb-chip" data-ndb-on:click="queryFilter = 'slow'"
                  data-ndb-bind:class="queryFilter === 'slow' && 'is-active'">
            Slow <span class="ndb-pill" data-ndb-text="queries.slow_count || 0"></span>
          </button>
          <input class="ndb-search" type="search" placeholder="Filter SQL"
                 data-ndb-model="querySearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleQueries.length"></span> shown
          </span>
        </div>

        <p class="ndb-note" data-ndb-show="queries.truncated">
          Collector limit reached. <span data-ndb-text="queries.dropped_count"></span>
          of <span data-ndb-text="queries.count"></span> queries were not retained.
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="(query, index) in visibleQueries" data-ndb-bind:key="index">
            <li class="ndb-query" data-ndb-bind:class="query.slow && 'is-slow'">
              <div class="ndb-query-head">
                <span class="ndb-query-time" data-ndb-text="number(query.duration_ms, 2) + ' ms'"></span>
                <span class="ndb-query-type" data-ndb-text="query.type"></span>
              </div>
              <code class="ndb-query-sql" data-ndb-text="query.sql"></code>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="visibleQueries.length === 0">No queries match.</p>
      </div>

    </div>
  </section>

  <div class="ndb-strip">
    <button type="button" class="ndb-brand" data-ndb-on:click="toggle()"
            data-ndb-bind:aria-expanded="open ? 'true' : 'false'">
      <span class="ndb-logo">S</span>
      <span class="ndb-caret" data-ndb-bind:class="open && 'is-open'"></span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key" data-ndb-text="request.method"></span>
      <span class="ndb-metric-value ndb-mono ndb-truncate" data-ndb-text="request.path"></span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key">Status</span>
      <span class="ndb-metric-value" data-ndb-bind:class="'is-' + statusTone"
            data-ndb-text="request.status"></span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key">Time</span>
      <span class="ndb-metric-value" data-ndb-bind:class="'is-' + durationTone">
        <span data-ndb-text="number(metrics.duration_ms, 0)"></span> ms
      </span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('queries')">
      <span class="ndb-metric-key">Queries</span>
      <span class="ndb-metric-value" data-ndb-bind:class="'is-' + queryTone">
        <span data-ndb-text="queries.count || 0"></span>
        <span class="ndb-dim">/ <span data-ndb-text="number(queries.duration_ms, 0)"></span> ms</span>
      </span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key">Memory</span>
      <span class="ndb-metric-value">
        <span data-ndb-text="number(metrics.memory_peak_mb, 1)"></span> MB
      </span>
    </button>
  </div>

</div>
`, js = "data-ndb-", Ns = "siteation-debugbar";
function Ls(t) {
  const e = t.attachShadow({ mode: "open" }), n = t.dataset.css;
  if (n) {
    const i = document.createElement("link");
    i.rel = "stylesheet", i.href = n, e.append(i);
  }
  const r = document.createElement("div");
  return r.innerHTML = Is, e.append(...r.children), e.querySelector(".ndb");
}
const Ut = document.getElementById(Ns);
if (Ut && !Ut.shadowRoot) {
  const t = Ls(Ut);
  zt.prefix(js), zt.data("debugBar", qs), t && zt.initTree(t), Ie && (window.Alpine = Ie);
}
