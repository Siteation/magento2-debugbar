const Fe = window.Alpine;
var Yt = !1, Gt = !1, P = [], Zt = -1, Tt = !1, be = !1;
function fi(t) {
  hi(t);
}
function pi() {
  be = !0;
}
function bi() {
  be = !1, Ge();
}
function hi(t) {
  P.includes(t) || (P.push(t), t._x_schedulerPriority !== void 0 && (Tt = !0)), Ge();
}
function _i(t) {
  let e = P.indexOf(t);
  e !== -1 && e > Zt && P.splice(e, 1);
}
function Ge() {
  if (!Gt && !Yt) {
    if (be)
      return;
    Yt = !0, queueMicrotask(gi);
  }
}
function gi() {
  Yt = !1, Gt = !0;
  for (let t = 0; t < P.length; t++)
    Tt && vi(t), P[t](), Zt = t;
  P.length = 0, Zt = -1, Tt = !1, Gt = !1;
}
function vi(t) {
  let e = /* @__PURE__ */ new Map(), n = P.slice(t).sort((r, i) => mi(r, i, e));
  for (let r = 0; r < n.length; r++)
    P[t + r] = n[r];
  Tt = !1;
}
function mi(t, e, n) {
  return jt(t) ? jt(e) ? Ne(t._x_schedulerPriority.el, n) - Ne(e._x_schedulerPriority.el, n) || t._x_schedulerPriority.order - e._x_schedulerPriority.order : -1 : jt(e) ? 1 : 0;
}
function jt(t) {
  return t._x_schedulerPriority !== void 0;
}
function Ne(t, e) {
  if (e.has(t))
    return e.get(t);
  let n = 0, r = t;
  for (; t; )
    n++, t._x_teleportBack ? t = t._x_teleportBack : typeof ShadowRoot == "function" && t.parentNode instanceof ShadowRoot ? t = t.parentNode.host : t = t.parentElement;
  return e.set(r, n), n;
}
var et, Q, nt, Ze, yi = 0, Xt = !0;
function xi(t) {
  Xt = !1, t(), Xt = !0;
}
function wi(t) {
  et = t.reactive, nt = t.release, Q = (e) => t.effect(e, { scheduler: (n) => {
    Xt ? fi(n) : n();
  } }), Ze = t.raw;
}
function Le(t) {
  Q = t;
}
function Si(t) {
  let e = () => {
  };
  return [(r, i) => {
    let s = i?.priority === "structural" ? yi++ : void 0, a = Q(r);
    return s !== void 0 && a !== void 0 && (a._x_schedulerPriority = { el: t, order: s }), t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((o) => o());
    }), t._x_effects.add(a), e = () => {
      a !== void 0 && (t._x_effects.delete(a), nt(a));
    }, a;
  }, () => {
    e();
  }];
}
function Xe(t, e) {
  let n = !0, r, i, s = Q(() => {
    let a = t(), o = JSON.stringify(a);
    if (!n && (typeof a == "object" || a !== r)) {
      let d = typeof r == "object" ? JSON.parse(i) : r;
      queueMicrotask(() => {
        e(a, d);
      });
    }
    r = a, i = o, n = !1;
  });
  return () => nt(s);
}
async function Ei(t) {
  pi();
  try {
    await t(), await Promise.resolve();
  } finally {
    bi();
  }
}
var tn = [], en = [], nn = [];
function Oi(t) {
  nn.push(t);
}
function he(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, en.push(e));
}
function rn(t) {
  tn.push(t);
}
function sn(t, e, n) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n);
}
function an(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([n, r]) => {
    (e === void 0 || e.includes(n)) && (r.forEach((i) => i()), delete t._x_attributeCleanups[n]);
  });
}
function Ai(t) {
  for (t._x_effects?.forEach(_i); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var _e = new MutationObserver(ye), ge = !1;
function ve() {
  _e.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), ge = !0;
}
function on() {
  ki(), _e.disconnect(), ge = !1;
}
var st = [];
function ki() {
  let t = _e.takeRecords();
  st.push(() => t.length > 0 && ye(t));
  let e = st.length;
  queueMicrotask(() => {
    if (st.length === e)
      for (; st.length > 0; )
        st.shift()();
  });
}
function g(t) {
  if (!ge)
    return t();
  on();
  let e = t();
  return ve(), e;
}
var me = !1, Ct = [];
function Mi() {
  me = !0;
}
function Ti() {
  me = !1, ye(Ct), Ct = [];
}
function ye(t) {
  if (me) {
    Ct = Ct.concat(t);
    return;
  }
  let e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (let s = 0; s < t.length; s++)
    if (!t[s].target._x_ignoreMutationObserver && (t[s].type === "childList" && (t[s].removedNodes.forEach((a) => {
      a.nodeType === 1 && a._x_marker && n.add(a);
    }), t[s].addedNodes.forEach((a) => {
      if (a.nodeType === 1) {
        if (n.has(a)) {
          n.delete(a);
          return;
        }
        a._x_marker || e.push(a);
      }
    })), t[s].type === "attributes")) {
      let a = t[s].target, o = t[s].attributeName, d = t[s].oldValue, c = () => {
        r.has(a) || r.set(a, []), r.get(a).push({ name: o, value: a.getAttribute(o) });
      }, l = () => {
        i.has(a) || i.set(a, []), i.get(a).push(o);
      };
      a.hasAttribute(o) && d === null ? c() : a.hasAttribute(o) ? (l(), c()) : l();
    }
  i.forEach((s, a) => {
    an(a, s);
  }), r.forEach((s, a) => {
    tn.forEach((o) => o(a, s));
  });
  for (let s of n)
    e.some((a) => a.contains(s)) || en.forEach((a) => a(s));
  for (let s of e)
    s.isConnected && nn.forEach((a) => a(s));
  e = null, n = null, r = null, i = null;
}
function dn(t) {
  return K(H(t));
}
function St(t, e, n) {
  return t._x_dataStack = [e, ...H(n || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((r) => r !== e);
  };
}
function H(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? H(t.host) : t.parentNode ? H(t.parentNode) : [];
}
function K(t) {
  return new Proxy({ objects: t }, Ci);
}
function cn(t, e) {
  return t === null || t === Object.prototype ? null : Object.prototype.hasOwnProperty.call(t, e) ? t : cn(Object.getPrototypeOf(t), e);
}
var Ci = {
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
    return e == "toJSON" ? Pi : Reflect.get(
      t.find(
        (r) => Reflect.has(r, e)
      ) || {},
      e,
      n
    );
  },
  set({ objects: t }, e, n, r) {
    let i;
    for (const a of t)
      if (i = cn(a, e), i)
        break;
    i || (i = t[t.length - 1]);
    const s = Object.getOwnPropertyDescriptor(i, e);
    return s?.set && s?.get ? s.set.call(r, n) || !0 : Reflect.set(i, e, n);
  }
};
function Pi() {
  return Reflect.ownKeys(this).reduce((e, n) => (e[n] = Reflect.get(this, n), e), {});
}
function xe(t, e = () => {
}) {
  let n = (i) => typeof i == "object" && !Array.isArray(i) && i !== null, r = (i, s = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([a, { value: o, enumerable: d }]) => {
      if (d === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let c = s === "" ? a : `${s}.${a}`;
      typeof o == "object" && o !== null && o._x_interceptor ? i[a] = o.initialize(t, c, a, e) : n(o) && o !== i && !(o instanceof Element) && r(o, c);
    });
  };
  return r(t);
}
function ln(t, e = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(r, i, s, a) {
      return t(this.initialValue, () => Ri(r, i), (o) => te(r, i, o), i, s, a);
    }
  };
  return e(n), (r) => {
    if (typeof r == "object" && r !== null && r._x_interceptor) {
      let i = n.initialize.bind(n);
      n.initialize = (s, a, o, d) => {
        let c = r.initialize(s, a, o, d);
        return n.initialValue = c, i(s, a, o, d);
      };
    } else
      n.initialValue = r;
    return n;
  };
}
function Ri(t, e) {
  return e.split(".").reduce((n, r) => n[r], t);
}
function te(t, e, n) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = n;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), te(t[e[0]], e.slice(1), n);
  }
}
var un = {};
function O(t, e) {
  un[t] = e;
}
function ht(t, e) {
  let n = qi(e);
  return Object.entries(un).forEach(([r, i]) => {
    Object.defineProperty(t, `$${r}`, {
      get() {
        return i(e, n);
      },
      enumerable: !1
    });
  }), t;
}
function qi(t) {
  let [e, n] = vn(t), r = { interceptor: ln, ...e };
  return he(t, n), r;
}
function Ii(t, e, n, ...r) {
  try {
    return n(...r);
  } catch (i) {
    _t(i, t, e);
  }
}
function _t(...t) {
  return fn(...t);
}
var fn = Di;
function $i(t) {
  fn = t;
}
function Di(t, e, n = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: n }
  ), console.warn(`Alpine Expression Error: ${t.message}

${n ? 'Expression: "' + n + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var tt = !0;
function pn(t) {
  let e = tt;
  tt = !1;
  let n = t();
  return tt = e, n;
}
function j(t, e, n = {}) {
  let r;
  return x(t, e)((i) => r = i, n), r;
}
function x(...t) {
  return bn(...t);
}
var bn = () => {
};
function Fi(t) {
  bn = t;
}
var hn;
function Ni(t) {
  hn = t;
}
function Li(t, e) {
  let n = {};
  ht(n, t);
  let r = [n, ...H(t)], i = typeof e == "function" ? ji(r, e) : Hi(r, e, t);
  return Ii.bind(null, t, e, i);
}
function ji(t, e) {
  return (n = () => {
  }, { scope: r = {}, params: i = [], context: s } = {}) => {
    if (!tt) {
      gt(n, e, K([r, ...t]), i);
      return;
    }
    let a = e.apply(K([r, ...t]), i);
    gt(n, a);
  };
}
var Bt = {};
function Bi(t, e) {
  if (Bt[t])
    return Bt[t];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, r = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t, s = (() => {
    try {
      let a = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${r} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(a, "name", {
        value: `[Alpine] ${t}`
      }), a;
    } catch (a) {
      return _t(a, e, t), Promise.resolve();
    }
  })();
  return Bt[t] = s, s;
}
function Hi(t, e, n) {
  let r = Bi(e, n);
  return (i = () => {
  }, { scope: s = {}, params: a = [], context: o } = {}) => {
    r.result = void 0, r.finished = !1;
    let d = K([s, ...t]);
    if (typeof r == "function") {
      let c = r.call(o, r, d).catch((l) => _t(l, n, e));
      r.finished ? (gt(i, r.result, d, a, n), r.result = void 0) : c.then((l) => {
        gt(i, l, d, a, n);
      }).catch((l) => _t(l, n, e)).finally(() => r.result = void 0);
    }
  };
}
function gt(t, e, n, r, i) {
  if (tt && typeof e == "function") {
    let s = e.apply(n, r);
    s instanceof Promise ? s.then((a) => gt(t, a, n, r)).catch((a) => _t(a, i, e)) : t(s);
  } else typeof e == "object" && e instanceof Promise ? e.then((s) => t(s)) : t(e);
}
function Ki(...t) {
  return hn(...t);
}
function Ui(t, e, n = {}) {
  let r = {};
  ht(r, t);
  let i = [r, ...H(t)], s = K([n.scope ?? {}, ...i]), a = n.params ?? [];
  if (e.includes("await")) {
    let o = Object.getPrototypeOf(async function() {
    }).constructor, d = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e;
    return new o(
      ["scope"],
      `with (scope) { let __result = ${d}; return __result }`
    ).call(n.context, s);
  } else {
    let o = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(()=>{ ${e} })()` : e, c = new Function(
      ["scope"],
      `with (scope) { let __result = ${o}; return __result }`
    ).call(n.context, s);
    return typeof c == "function" && tt ? c.apply(s, a) : c;
  }
}
var we = "x-";
function it(t = "") {
  return we + t;
}
function Wi(t) {
  we = t;
}
var Pt = {};
function v(t, e) {
  return Pt[t] = e, {
    before(n) {
      if (!Pt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const r = L.indexOf(n);
      L.splice(r >= 0 ? r : L.indexOf("DEFAULT"), 0, t);
    }
  };
}
function zi(t) {
  return Object.keys(Pt).includes(t);
}
function Se(t, e, n) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let s = Object.entries(t._x_virtualDirectives).map(([o, d]) => ({ name: o, value: d })), a = _n(s);
    s = s.map((o) => a.find((d) => d.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), e = e.concat(s);
  }
  let r = {};
  return e.map(xn((s, a) => r[s] = a)).filter(Sn).map(Qi(r, n)).sort(Yi).map((s) => Ji(t, s));
}
function _n(t) {
  return Array.from(t).map(xn()).filter((e) => !Sn(e));
}
var ee = !1, ct = /* @__PURE__ */ new Map(), gn = /* @__PURE__ */ Symbol();
function Vi(t) {
  ee = !0;
  let e = /* @__PURE__ */ Symbol();
  gn = e, ct.set(e, []);
  let n = () => {
    for (; ct.get(e).length; )
      ct.get(e).shift()();
    ct.delete(e);
  }, r = () => {
    ee = !1, n();
  };
  t(n), r();
}
function vn(t) {
  let e = [], n = (o) => e.push(o), [r, i] = Si(t);
  return e.push(i), [{
    Alpine: rt,
    effect: r,
    cleanup: n,
    evaluateLater: x.bind(x, t),
    evaluate: j.bind(j, t)
  }, () => e.forEach((o) => o())];
}
function Ji(t, e) {
  let n = () => {
  }, r = Pt[e.type] || n, [i, s] = vn(t);
  sn(t, e.original, s);
  let a = () => {
    t._x_ignore || t._x_ignoreSelf || (r.inline && r.inline(t, e, i), r = r.bind(r, t, e, i), ee ? ct.get(gn).push(r) : r());
  };
  return a.runCleanups = s, a;
}
var mn = (t, e) => ({ name: n, value: r }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: r }), yn = (t) => t;
function xn(t = () => {
}) {
  return ({ name: e, value: n }) => {
    let { name: r, value: i } = wn.reduce((s, a) => a(s), { name: e, value: n });
    return r !== e && t(r, e), { name: r, value: i };
  };
}
var wn = [];
function Ee(t) {
  wn.push(t);
}
function Sn({ name: t }) {
  return En().test(t);
}
var En = () => new RegExp(`^${we}([^:^.]+)\\b`);
function Qi(t, e) {
  return ({ name: n, value: r }) => {
    n === r && (r = "");
    let i = n.match(En()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = e || t[n] || n;
    return {
      type: i ? i[1] : null,
      value: s ? s[1] : null,
      modifiers: a.map((d) => d.replace(".", "")),
      expression: r,
      original: o
    };
  };
}
var ne = "DEFAULT", L = [
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
  ne,
  "teleport"
];
function Yi(t, e) {
  let n = L.indexOf(t.type) === -1 ? ne : t.type, r = L.indexOf(e.type) === -1 ? ne : e.type;
  return L.indexOf(n) - L.indexOf(r);
}
function lt(t, e, n = {}, r = {}) {
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
function U(t, e) {
  if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
    Array.from(t.children).forEach((i) => U(i, e));
    return;
  }
  let n = !1;
  if (e(t, () => n = !0), n)
    return;
  let r = t.firstElementChild;
  for (; r; )
    U(r, e), r = r.nextElementSibling;
}
function k(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var je = !1;
function Gi() {
  je && k("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), je = !0, document.body || k("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), lt(document, "alpine:init"), lt(document, "alpine:initializing"), ve(), Oi((e) => q(e, U)), he((e) => Y(e)), rn((e, n) => {
    Se(e, n).forEach((r) => r());
  });
  let t = (e) => !Dt(e.parentElement, !0);
  Array.from(document.querySelectorAll(kn().join(","))).filter(t).forEach((e) => {
    q(e);
  }), lt(document, "alpine:initialized"), setTimeout(() => {
    er();
  });
}
var Oe = [], On = [];
function An() {
  return Oe.map((t) => t());
}
function kn() {
  return Oe.concat(On).map((t) => t());
}
function Mn(t) {
  Oe.push(t);
}
function Tn(t) {
  On.push(t);
}
function Dt(t, e = !1) {
  return R(t, (n) => {
    if ((e ? kn() : An()).some((i) => n.matches(i)))
      return !0;
  });
}
function R(t, e) {
  if (t) {
    if (e(t))
      return t;
    if (t._x_teleportBack)
      return R(t._x_teleportBack, e);
    if (t.parentNode instanceof ShadowRoot)
      return R(t.parentNode.host, e);
    if (t.parentElement)
      return R(t.parentElement, e);
  }
}
function Zi(t) {
  return An().some((e) => t.matches(e));
}
var Cn = [];
function Xi(t) {
  Cn.push(t);
}
var tr = 1;
function q(t, e = U, n = () => {
}) {
  R(t, (r) => r._x_ignore) || Vi(() => {
    e(t, (r, i) => {
      r._x_marker || (n(r, i), Cn.forEach((s) => s(r, i)), Se(r, r.attributes).forEach((s) => s()), r._x_ignore || (r._x_marker = tr++), r._x_ignore && i());
    });
  });
}
function Y(t, e = U) {
  e(t, (n) => {
    Ai(n), an(n), delete n._x_marker;
  });
}
function er() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, n, r]) => {
    zi(n) || r.some((i) => {
      if (document.querySelector(i))
        return k(`found "${i}", but missing ${e} plugin`), !0;
    });
  });
}
var ie = [], Ae = !1;
function ke(t = () => {
}) {
  return queueMicrotask(() => {
    Ae || setTimeout(() => {
      re();
    });
  }), new Promise((e) => {
    ie.push(() => {
      t(), e();
    });
  });
}
function re() {
  for (Ae = !1; ie.length; )
    ie.shift()();
}
function nr() {
  Ae = !0;
}
function Me(t, e) {
  return Array.isArray(e) ? Be(t, e.join(" ")) : typeof e == "object" && e !== null ? ir(t, e) : typeof e == "function" ? Me(t, e()) : Be(t, e);
}
function se(t) {
  return t.split(/\s/).filter(Boolean);
}
function Be(t, e) {
  let n = (i) => se(i).filter((s) => !t.classList.contains(s)).filter(Boolean), r = (i) => (t.classList.add(...i), () => {
    t.classList.remove(...i);
  });
  return e = e === !0 ? e = "" : e || "", r(n(e));
}
function ir(t, e) {
  let n = Object.entries(e).flatMap(([a, o]) => o ? se(a) : !1).filter(Boolean), r = Object.entries(e).flatMap(([a, o]) => o ? !1 : se(a)).filter(Boolean), i = [], s = [];
  return r.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), s.push(a));
  }), n.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), i.push(a));
  }), () => {
    s.forEach((a) => t.classList.add(a)), i.forEach((a) => t.classList.remove(a));
  };
}
function Ft(t, e) {
  return typeof e == "object" && e !== null ? rr(t, e) : sr(t, e);
}
function rr(t, e) {
  let n = {};
  return Object.entries(e).forEach(([r, i]) => {
    n[r] = t.style[r], r.startsWith("--") || (r = ar(r)), t.style.setProperty(r, i);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    Ft(t, n);
  };
}
function sr(t, e) {
  let n = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", n || "");
  };
}
function ar(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ae(t, e = () => {
}) {
  let n = !1;
  return function() {
    n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments));
  };
}
v("transition", (t, { value: e, modifiers: n, expression: r }, { evaluate: i }) => {
  typeof r == "function" && (r = i(r)), r !== !1 && (!r || typeof r == "boolean" ? dr(t, n, e) : or(t, r, e));
});
function or(t, e, n) {
  Pn(t, Me, ""), {
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
function dr(t, e, n) {
  Pn(t, Ft);
  let r = !e.includes("in") && !e.includes("out") && !n, i = r || e.includes("in") || ["enter"].includes(n), s = r || e.includes("out") || ["leave"].includes(n);
  e.includes("in") && !r && (e = e.filter((y, G) => G < e.indexOf("out"))), e.includes("out") && !r && (e = e.filter((y, G) => G > e.indexOf("out")));
  let a = !e.includes("opacity") && !e.includes("scale"), o = a || e.includes("opacity"), d = a || e.includes("scale"), c = o ? 0 : 1, l = d ? at(e, "scale", 95) / 100 : 1, u = at(e, "delay", 0) / 1e3, h = at(e, "origin", "center"), _ = "opacity, transform", M = at(e, "duration", 150) / 1e3, f = at(e, "duration", 75) / 1e3, m = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  i && (t._x_transition.enter.during = {
    transformOrigin: h,
    transitionDelay: `${u}s`,
    transitionProperty: _,
    transitionDuration: `${M}s`,
    transitionTimingFunction: m
  }, t._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${l})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (t._x_transition.leave.during = {
    transformOrigin: h,
    transitionDelay: `${u}s`,
    transitionProperty: _,
    transitionDuration: `${f}s`,
    transitionTimingFunction: m
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${l})`
  });
}
function Pn(t, e, n = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(r = () => {
    }, i = () => {
    }) {
      oe(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, r, i);
    },
    out(r = () => {
    }, i = () => {
    }) {
      oe(t, e, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, r, i);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(t, e, n, r) {
  const i = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let s = () => i(n);
  if (e) {
    t._x_transition && (t._x_transition.enter || t._x_transition.leave) ? t._x_transition.enter && (Object.entries(t._x_transition.enter.during).length || Object.entries(t._x_transition.enter.start).length || Object.entries(t._x_transition.enter.end).length) ? t._x_transition.in(n) : s() : t._x_transition ? t._x_transition.in(n) : s();
    return;
  }
  t._x_hidePromise = t._x_transition ? new Promise((a, o) => {
    t._x_transition.out(() => {
    }, () => a(r)), t._x_transitioning && t._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(r), queueMicrotask(() => {
    let a = Rn(t);
    a ? (a._x_hideChildren || (a._x_hideChildren = []), a._x_hideChildren.push(t)) : i(() => {
      let o = (d) => {
        let c = Promise.all([
          d._x_hidePromise,
          ...(d._x_hideChildren || []).map(o)
        ]).then(([l]) => l?.());
        return delete d._x_hidePromise, delete d._x_hideChildren, c;
      };
      o(t).catch((d) => {
        if (!d.isFromCancelledTransition)
          throw d;
      });
    });
  });
};
function Rn(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : Rn(e);
}
function oe(t, e, { during: n, start: r, end: i } = {}, s = () => {
}, a = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(r).length === 0 && Object.keys(i).length === 0) {
    s(), a();
    return;
  }
  let o, d, c;
  cr(t, {
    start() {
      o = e(t, r);
    },
    during() {
      d = e(t, n);
    },
    before: s,
    end() {
      o(), c = e(t, i);
    },
    after: a,
    cleanup() {
      d(), c();
    }
  });
}
function cr(t, e) {
  let n, r, i, s = ae(() => {
    g(() => {
      n = !0, r || e.before(), i || (e.end(), re()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(a) {
      this.beforeCancels.push(a);
    },
    cancel: ae(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, g(() => {
    e.start(), e.during();
  }), nr(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), g(() => {
      e.before();
    }), r = !0, requestAnimationFrame(() => {
      n || (g(() => {
        e.end();
      }), re(), setTimeout(t._x_transitioning.finish, a + o), i = !0);
    });
  });
}
function at(t, e, n) {
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
var $ = !1;
function D(t, e = () => {
}) {
  return (...n) => $ ? e(...n) : t(...n);
}
function lr(t) {
  return (...e) => $ && t(...e);
}
var qn = [];
function Nt(t) {
  qn.push(t);
}
function ur(t, e) {
  qn.forEach((n) => n(t, e)), $ = !0, In(() => {
    q(e, (n, r) => {
      r(n, () => {
      });
    });
  }), $ = !1;
}
var de = !1;
function fr(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), $ = !0, de = !0, In(() => {
    pr(e);
  }), $ = !1, de = !1;
}
function pr(t) {
  let e = !1;
  q(t, (r, i) => {
    U(r, (s, a) => {
      if (e && Zi(s))
        return a();
      e = !0, i(s, a);
    });
  });
}
function In(t) {
  let e = Q;
  Le((n, r) => {
    let i = e(n);
    return nt(i), () => {
    };
  }), t(), Le(e);
}
function $n(t, e, n, r = []) {
  switch (t._x_bindings || (t._x_bindings = et({})), t._x_bindings[e] = n, e = r.includes("camel") ? xr(e) : e, e) {
    case "value":
      br(t, n);
      break;
    case "style":
      _r(t, n);
      break;
    case "class":
      hr(t, n);
      break;
    case "selected":
    case "checked":
      gr(t, e, n);
      break;
    default:
      Te(t, e, n);
      break;
  }
}
function br(t, e) {
  if (Ce(t))
    t.attributes.value === void 0 && (t.value = e);
  else if (Rt(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((n) => wr(n, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    yr(t, e);
  else if (t.tagName === "OPTION")
    Te(t, "value", e);
  else {
    if (t.value === e && (typeof e != "object" || e === null))
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function hr(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = Me(t, e);
}
function _r(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = Ft(t, e);
}
function gr(t, e, n) {
  Te(t, e, n), mr(t, e, n);
}
function Te(t, e, n) {
  [null, void 0, !1].includes(n) && Er(e) ? t.removeAttribute(e) : (Dn(e) && (n = e), Or(n) && (n = JSON.stringify(n)), vr(t, e, n));
}
function vr(t, e, n) {
  t.getAttribute(e) != n && t.setAttribute(e, n);
}
function mr(t, e, n) {
  t[e] !== n && (t[e] = n);
}
function yr(t, e) {
  const n = [].concat(e).map((r) => r + "");
  Array.from(t.options).forEach((r) => {
    r.selected = n.includes(r.value);
  });
}
function xr(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function wr(t, e) {
  return t == e;
}
function Mt(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var Sr = /* @__PURE__ */ new Set([
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
  return Sr.has(t);
}
function Er(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function Or(t) {
  return typeof t == "object" && t !== null;
}
function Ar(t, e, n) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : Fn(t, e, n);
}
function kr(t, e, n, r = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let i = t._x_inlineBindings[e];
    return i.extract = r, pn(() => j(t, i.expression));
  }
  return Fn(t, e, n);
}
function Fn(t, e, n) {
  let r = t.getAttribute(e);
  return r === null ? typeof n == "function" ? n() : n : r === "" ? !0 : Dn(e) ? !![e, "true"].includes(r) : r;
}
function Rt(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function Ce(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function Nn(t, e) {
  let n;
  return function() {
    const r = this, i = arguments, s = function() {
      n = null, t.apply(r, i);
    };
    clearTimeout(n), n = setTimeout(s, e);
  };
}
function Ln(t, e) {
  let n;
  return function() {
    let r = this, i = arguments;
    n || (t.apply(r, i), n = !0, setTimeout(() => n = !1, e));
  };
}
function jn({ get: t, set: e }, { get: n, set: r }) {
  let i = !0, s, a = Q(() => {
    let o = t(), d = n();
    if (i)
      r(Ht(o)), i = !1;
    else {
      let c = JSON.stringify(o), l = JSON.stringify(d);
      c !== s ? r(Ht(o)) : c !== l && e(Ht(d));
    }
    s = JSON.stringify(t()), JSON.stringify(n());
  });
  return () => {
    nt(a);
  };
}
function Ht(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function Mr(t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => n(rt));
}
var C = {}, He = !1;
function Tr(t, e) {
  if (He || (C = et(C), He = !0), e === void 0)
    return C[t];
  C[t] = e, typeof e == "object" && e !== null && e._x_interceptor ? C[t] = e.initialize(C, t, t, () => {
  }) : xe(C[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && C[t].init();
}
function Cr() {
  return C;
}
var Bn = {};
function Pr(t, e) {
  let n = typeof e != "function" ? () => e : e;
  return t instanceof Element ? Hn(t, n()) : (Bn[t] = n, () => {
  });
}
function Rr(t) {
  return Object.entries(Bn).forEach(([e, n]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...r) => n(...r);
      }
    });
  }), t;
}
function Hn(t, e, n) {
  let r = [];
  for (; r.length; )
    r.pop()();
  let i = Object.entries(e).map(([a, o]) => ({ name: a, value: o })), s = _n(i);
  return i = i.map((a) => s.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), Se(t, i, n).map((a) => {
    r.push(a.runCleanups), a();
  }), () => {
    for (; r.length; )
      r.pop()();
  };
}
var Kn = {};
function qr(t, e) {
  Kn[t] = e;
}
function Ir(t, e) {
  return Object.entries(Kn).forEach(([n, r]) => {
    Object.defineProperty(t, n, {
      get() {
        return (...i) => r.bind(e)(...i);
      },
      enumerable: !1
    });
  }), t;
}
var $r = {
  get reactive() {
    return et;
  },
  get release() {
    return nt;
  },
  get effect() {
    return Q;
  },
  get raw() {
    return Ze;
  },
  get transaction() {
    return Ei;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Ti,
  dontAutoEvaluateFunctions: pn,
  disableEffectScheduling: xi,
  startObservingMutations: ve,
  stopObservingMutations: on,
  setReactivityEngine: wi,
  onAttributeRemoved: sn,
  onAttributesAdded: rn,
  closestDataStack: H,
  skipDuringClone: D,
  onlyDuringClone: lr,
  addRootSelector: Mn,
  addInitSelector: Tn,
  setErrorHandler: $i,
  interceptClone: Nt,
  addScopeToNode: St,
  deferMutations: Mi,
  mapAttributes: Ee,
  evaluateLater: x,
  interceptInit: Xi,
  initInterceptors: xe,
  injectMagics: ht,
  setEvaluator: Fi,
  setRawEvaluator: Ni,
  mergeProxies: K,
  extractProp: kr,
  findClosest: R,
  onElRemoved: he,
  closestRoot: Dt,
  destroyTree: Y,
  interceptor: ln,
  // INTERNAL: not public API and is subject to change without major release.
  transition: oe,
  // INTERNAL
  setStyles: Ft,
  // INTERNAL
  mutateDom: g,
  directive: v,
  entangle: jn,
  throttle: Ln,
  debounce: Nn,
  evaluate: j,
  evaluateRaw: Ki,
  initTree: q,
  nextTick: ke,
  prefixed: it,
  prefix: Wi,
  plugin: Mr,
  magic: O,
  store: Tr,
  start: Gi,
  clone: fr,
  // INTERNAL
  cloneNode: ur,
  // INTERNAL
  bound: Ar,
  $data: dn,
  watch: Xe,
  walk: U,
  data: qr,
  bind: Pr
}, rt = $r;
function Dr(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(","))
    e[n] = 1;
  return (n) => n in e;
}
var vt = Object.assign, Fr = Object.prototype.hasOwnProperty, ce = (t, e) => Fr.call(t, e), mt = Array.isArray, ut = (t) => Un(t) === "[object Map]", Nr = (t) => typeof t == "string", Et = (t) => typeof t == "symbol", yt = (t) => t !== null && typeof t == "object", Lr = Object.prototype.toString, Un = (t) => Lr.call(t), Wn = (t) => Un(t).slice(8, -1), Pe = (t) => Nr(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, jr = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, Br = jr((t) => t.charAt(0).toUpperCase() + t.slice(1)), N = (t, e) => !Object.is(t, e);
function W(t, ...e) {
  console.warn(`[Vue warn] ${t}`, ...e);
}
var p, Kt = /* @__PURE__ */ new WeakSet(), Ke = class {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Kt.has(this) && (Kt.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Hr(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ue(this), Vn(this);
    const t = p, e = E;
    p = this, E = !0;
    try {
      return this.fn();
    } finally {
      p !== this && W(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Jn(this), p = t, E = e, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Ie(t);
      this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Kt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    le(this) && this.run();
  }
  get dirty() {
    return le(this);
  }
}, zn = 0, ft, pt;
function Hr(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = pt, pt = t;
    return;
  }
  t.next = ft, ft = t;
}
function Re() {
  zn++;
}
function qe() {
  if (--zn > 0)
    return;
  if (pt) {
    let e = pt;
    for (pt = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; ft; ) {
    let e = ft;
    for (ft = void 0; e; ) {
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
function Vn(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function Jn(t) {
  let e, n = t.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), Ie(r), Ur(r)) : e = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  t.deps = e, t.depsTail = n;
}
function le(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (Kr(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function Kr(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === qt) || (t.globalVersion = qt, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !le(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = p, r = E;
  p = t, E = !0;
  try {
    Vn(t);
    const i = t.fn(t._value);
    (e.version === 0 || N(i, t._value)) && (t.flags |= 128, t._value = i, e.version++);
  } catch (i) {
    throw e.version++, i;
  } finally {
    p = n, E = r, Jn(t), t.flags &= -3;
  }
}
function Ie(t, e = !1) {
  const { dep: n, prevSub: r, nextSub: i } = t;
  if (r && (r.nextSub = i, t.prevSub = void 0), i && (i.prevSub = r, t.nextSub = void 0), n.subsHead === t && (n.subsHead = i), n.subs === t && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      Ie(s, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Ur(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
function Wr(t, e) {
  t.effect instanceof Ke && (t = t.effect.fn);
  const n = new Ke(t);
  e && vt(n, e);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const r = n.run.bind(n);
  return r.effect = n, r;
}
function zr(t) {
  t.effect.stop();
}
var E = !0, Qn = [];
function Vr() {
  Qn.push(E), E = !1;
}
function Jr() {
  const t = Qn.pop();
  E = t === void 0 ? !0 : t;
}
function Ue(t) {
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
var qt = 0, Qr = class {
  constructor(t, e) {
    this.sub = t, this.dep = e, this.version = e.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, Yr = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!p || !E || p === this.computed)
      return;
    let e = this.activeLink;
    if (e === void 0 || e.sub !== p)
      e = this.activeLink = new Qr(p, this), p.deps ? (e.prevDep = p.depsTail, p.depsTail.nextDep = e, p.depsTail = e) : p.deps = p.depsTail = e, Yn(e);
    else if (e.version === -1 && (e.version = this.version, e.nextDep)) {
      const n = e.nextDep;
      n.prevDep = e.prevDep, e.prevDep && (e.prevDep.nextDep = n), e.prevDep = p.depsTail, e.nextDep = void 0, p.depsTail.nextDep = e, p.depsTail = e, p.deps === e && (p.deps = n);
    }
    return p.onTrack && p.onTrack(
      vt(
        {
          effect: p
        },
        t
      )
    ), e;
  }
  trigger(t) {
    this.version++, qt++, this.notify(t);
  }
  notify(t) {
    Re();
    try {
      for (let e = this.subsHead; e; e = e.nextSub)
        e.sub.onTrigger && !(e.sub.flags & 8) && e.sub.onTrigger(
          vt(
            {
              effect: e.sub
            },
            t
          )
        );
      for (let e = this.subs; e; e = e.prevSub)
        e.sub.notify() && e.sub.dep.notify();
    } finally {
      qe();
    }
  }
};
function Yn(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let r = e.deps; r; r = r.nextDep)
        Yn(r);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subsHead === void 0 && (t.dep.subsHead = t), t.dep.subs = t;
  }
}
var ue = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ Symbol(
  "Object iterate"
), fe = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), xt = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function w(t, e, n) {
  if (E && p) {
    let r = ue.get(t);
    r || ue.set(t, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Yr()), i.map = r, i.key = n), i.track({
      target: t,
      type: e,
      key: n
    });
  }
}
function I(t, e, n, r, i, s) {
  const a = ue.get(t);
  if (!a) {
    qt++;
    return;
  }
  const o = (d) => {
    d && d.trigger({
      target: t,
      type: e,
      key: n,
      newValue: r,
      oldValue: i,
      oldTarget: s
    });
  };
  if (Re(), e === "clear")
    a.forEach(o);
  else {
    const d = mt(t), c = d && Pe(n);
    if (d && n === "length") {
      const l = Number(r);
      a.forEach((u, h) => {
        (h === "length" || h === xt || !Et(h) && h >= l) && o(u);
      });
    } else
      switch ((n !== void 0 || a.has(void 0)) && o(a.get(n)), c && o(a.get(xt)), e) {
        case "add":
          d ? c && o(a.get("length")) : (o(a.get(B)), ut(t) && o(a.get(fe)));
          break;
        case "delete":
          d || (o(a.get(B)), ut(t) && o(a.get(fe)));
          break;
        case "set":
          ut(t) && o(a.get(B));
          break;
      }
  }
  qe();
}
function Z(t) {
  const e = b(t);
  return e === t ? e : (w(e, "iterate", xt), V(t) ? e : e.map(J));
}
function $e(t) {
  return w(t = b(t), "iterate", xt), t;
}
function A(t, e) {
  return z(t) ? ii(t) ? wt(J(e)) : wt(e) : J(e);
}
var Gr = {
  __proto__: null,
  [Symbol.iterator]() {
    return Ut(this, Symbol.iterator, (t) => A(this, t));
  },
  concat(...t) {
    return Z(this).concat(
      ...t.map((e) => mt(e) ? Z(e) : e)
    );
  },
  entries() {
    return Ut(this, "entries", (t) => (t[1] = A(this, t[1]), t));
  },
  every(t, e) {
    return T(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return T(
      this,
      "filter",
      t,
      e,
      (n) => n.map((r) => A(this, r)),
      arguments
    );
  },
  find(t, e) {
    return T(
      this,
      "find",
      t,
      e,
      (n) => A(this, n),
      arguments
    );
  },
  findIndex(t, e) {
    return T(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return T(
      this,
      "findLast",
      t,
      e,
      (n) => A(this, n),
      arguments
    );
  },
  findLastIndex(t, e) {
    return T(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return T(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return Wt(this, "includes", t);
  },
  indexOf(...t) {
    return Wt(this, "indexOf", t);
  },
  join(t) {
    return Z(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Wt(this, "lastIndexOf", t);
  },
  map(t, e) {
    return T(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return ot(this, "pop");
  },
  push(...t) {
    return ot(this, "push", t);
  },
  reduce(t, ...e) {
    return We(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return We(this, "reduceRight", t, e);
  },
  shift() {
    return ot(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return T(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return ot(this, "splice", t);
  },
  toReversed() {
    return Z(this).toReversed();
  },
  toSorted(t) {
    return Z(this).toSorted(t);
  },
  toSpliced(...t) {
    return Z(this).toSpliced(...t);
  },
  unshift(...t) {
    return ot(this, "unshift", t);
  },
  values() {
    return Ut(this, "values", (t) => A(this, t));
  }
};
function Ut(t, e, n) {
  const r = $e(t), i = r[e]();
  return r !== t && !V(t) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = n(s.value)), s;
  }), i;
}
var Zr = Array.prototype;
function T(t, e, n, r, i, s) {
  const a = $e(t), o = a !== t && !V(t), d = a[e];
  if (d !== Zr[e]) {
    const u = d.apply(t, s);
    return o ? J(u) : u;
  }
  let c = n;
  a !== t && (o ? c = function(u, h) {
    return n.call(this, A(t, u), h, t);
  } : n.length > 2 && (c = function(u, h) {
    return n.call(this, u, h, t);
  }));
  const l = d.call(a, c, r);
  return o && i ? i(l) : l;
}
function We(t, e, n, r) {
  const i = $e(t), s = i !== t && !V(t);
  let a = n, o = !1;
  i !== t && (s ? (o = r.length === 0, a = function(c, l, u) {
    return o && (o = !1, c = A(t, c)), n.call(this, c, A(t, l), u, t);
  }) : n.length > 3 && (a = function(c, l, u) {
    return n.call(this, c, l, u, t);
  }));
  const d = i[e](a, ...r);
  return o ? A(t, d) : d;
}
function Wt(t, e, n) {
  const r = b(t);
  w(r, "iterate", xt);
  const i = r[e](...n);
  return (i === -1 || i === !1) && fs(n[0]) ? (n[0] = b(n[0]), r[e](...n)) : i;
}
function ot(t, e, n = []) {
  Vr(), Re();
  const r = b(t)[e].apply(t, n);
  return qe(), Jr(), r;
}
var Xr = /* @__PURE__ */ Dr("__proto__,__v_isRef,__isVue"), Gn = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(Et)
);
function ts(t) {
  Et(t) || (t = String(t));
  const e = b(this);
  return w(e, "has", t), e.hasOwnProperty(t);
}
var Zn = class {
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
      return n === (r ? i ? ls : ei : i ? cs : ti).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const s = mt(t);
    if (!r) {
      let o;
      if (s && (o = Gr[e]))
        return o;
      if (e === "hasOwnProperty")
        return ts;
    }
    const a = Reflect.get(
      t,
      e,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      bt(t) ? t : n
    );
    if ((Et(e) ? Gn.has(e) : Xr(e)) || (r || w(t, "get", e), i))
      return a;
    if (bt(a)) {
      const o = s && Pe(e) ? a : a.value;
      return r && yt(o) ? pe(o) : o;
    }
    return yt(a) ? r ? pe(a) : De(a) : a;
  }
}, es = class extends Zn {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, e, n, r) {
    let i = t[e];
    const s = mt(t) && Pe(e);
    if (!this._isShallow) {
      const d = z(i);
      if (!V(n) && !z(n) && (i = b(i), n = b(n)), !s && bt(i) && !bt(n))
        return d ? (W(
          `Set operation on key "${String(e)}" failed: target is readonly.`,
          t[e]
        ), !0) : (i.value = n, !0);
    }
    const a = s ? Number(e) < t.length : ce(t, e), o = Reflect.set(
      t,
      e,
      n,
      bt(t) ? t : r
    );
    return t === b(r) && o && (a ? N(n, i) && I(t, "set", e, n, i) : I(t, "add", e, n)), o;
  }
  deleteProperty(t, e) {
    const n = ce(t, e), r = t[e], i = Reflect.deleteProperty(t, e);
    return i && n && I(t, "delete", e, void 0, r), i;
  }
  has(t, e) {
    const n = Reflect.has(t, e);
    return (!Et(e) || !Gn.has(e)) && w(t, "has", e), n;
  }
  ownKeys(t) {
    return w(
      t,
      "iterate",
      mt(t) ? "length" : B
    ), Reflect.ownKeys(t);
  }
}, ns = class extends Zn {
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
}, is = /* @__PURE__ */ new es(), rs = /* @__PURE__ */ new ns(), Ot = (t) => Reflect.getPrototypeOf(t);
function ss(t, e, n) {
  return function(...r) {
    const i = this.__v_raw, s = b(i), a = ut(s), o = t === "entries" || t === Symbol.iterator && a, d = t === "keys" && a, c = i[t](...r), l = e ? wt : J;
    return !e && w(
      s,
      "iterate",
      d ? fe : B
    ), vt(
      // inheriting all iterator properties
      Object.create(c),
      {
        // iterator protocol
        next() {
          const { value: u, done: h } = c.next();
          return h ? { value: u, done: h } : {
            value: o ? [l(u[0]), l(u[1])] : l(u),
            done: h
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
        `${Br(t)} operation ${n}failed: target is readonly.`,
        b(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function as(t, e) {
  const n = {
    get(i) {
      const s = this.__v_raw, a = b(s), o = b(i);
      t || (N(i, o) && w(a, "get", i), w(a, "get", o));
      const { has: d } = Ot(a), c = t ? wt : J;
      if (d.call(a, i))
        return c(s.get(i));
      if (d.call(a, o))
        return c(s.get(o));
      s !== a && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !t && w(b(i), "iterate", B), i.size;
    },
    has(i) {
      const s = this.__v_raw, a = b(s), o = b(i);
      return t || (N(i, o) && w(a, "has", i), w(a, "has", o)), i === o ? s.has(i) : s.has(i) || s.has(o);
    },
    forEach(i, s) {
      const a = this, o = a.__v_raw, d = b(o), c = t ? wt : J;
      return !t && w(d, "iterate", B), o.forEach((l, u) => i.call(s, c(l), c(u), a));
    }
  };
  return vt(
    n,
    t ? {
      add: At("add"),
      set: At("set"),
      delete: At("delete"),
      clear: At("clear")
    } : {
      add(i) {
        const s = b(this), a = Ot(s), o = b(i), d = !V(i) && !z(i) ? o : i;
        return a.has.call(s, d) || N(i, d) && a.has.call(s, i) || N(o, d) && a.has.call(s, o) || (s.add(d), I(s, "add", d, d)), this;
      },
      set(i, s) {
        !V(s) && !z(s) && (s = b(s));
        const a = b(this), { has: o, get: d } = Ot(a);
        let c = o.call(a, i);
        c ? ze(a, o, i) : (i = b(i), c = o.call(a, i));
        const l = d.call(a, i);
        return a.set(i, s), c ? N(s, l) && I(a, "set", i, s, l) : I(a, "add", i, s), this;
      },
      delete(i) {
        const s = b(this), { has: a, get: o } = Ot(s);
        let d = a.call(s, i);
        d ? ze(s, a, i) : (i = b(i), d = a.call(s, i));
        const c = o ? o.call(s, i) : void 0, l = s.delete(i);
        return d && I(s, "delete", i, void 0, c), l;
      },
      clear() {
        const i = b(this), s = i.size !== 0, a = ut(i) ? new Map(i) : new Set(i), o = i.clear();
        return s && I(
          i,
          "clear",
          void 0,
          void 0,
          a
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = ss(i, t);
  }), n;
}
function Xn(t, e) {
  const n = as(t);
  return (r, i, s) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? r : Reflect.get(
    ce(n, i) && i in r ? n : r,
    i,
    s
  );
}
var os = {
  get: /* @__PURE__ */ Xn(!1)
}, ds = {
  get: /* @__PURE__ */ Xn(!0)
};
function ze(t, e, n) {
  const r = b(n);
  if (r !== n && e.call(t, r)) {
    const i = Wn(t);
    W(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var ti = /* @__PURE__ */ new WeakMap(), cs = /* @__PURE__ */ new WeakMap(), ei = /* @__PURE__ */ new WeakMap(), ls = /* @__PURE__ */ new WeakMap();
function us(t) {
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
function De(t) {
  return /* @__PURE__ */ z(t) ? t : ni(
    t,
    !1,
    is,
    os,
    ti
  );
}
function pe(t) {
  return ni(
    t,
    !0,
    rs,
    ds,
    ei
  );
}
function ni(t, e, n, r, i) {
  if (!yt(t))
    return W(
      `value cannot be made ${e ? "readonly" : "reactive"}: ${String(
        t
      )}`
    ), t;
  if (t.__v_raw && !(e && t.__v_isReactive) || t.__v_skip || !Object.isExtensible(t))
    return t;
  const s = i.get(t);
  if (s)
    return s;
  const a = us(Wn(t));
  if (a === 0)
    return t;
  const o = new Proxy(
    t,
    a === 2 ? r : n
  );
  return i.set(t, o), o;
}
function ii(t) {
  return /* @__PURE__ */ z(t) ? /* @__PURE__ */ ii(t.__v_raw) : !!(t && t.__v_isReactive);
}
function z(t) {
  return !!(t && t.__v_isReadonly);
}
function V(t) {
  return !!(t && t.__v_isShallow);
}
function fs(t) {
  return t ? !!t.__v_raw : !1;
}
function b(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ b(e) : t;
}
var J = (t) => yt(t) ? /* @__PURE__ */ De(t) : t, wt = (t) => yt(t) ? /* @__PURE__ */ pe(t) : t;
function bt(t) {
  return t ? t.__v_isRef === !0 : !1;
}
O("nextTick", () => ke);
O("dispatch", (t) => lt.bind(lt, t));
O("watch", (t, { evaluateLater: e, cleanup: n }) => (r, i) => {
  let s = e(r), o = Xe(() => {
    let d;
    return s((c) => d = c), d;
  }, i);
  n(o);
});
O("store", Cr);
O("data", (t) => dn(t));
O("root", (t) => Dt(t));
O("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = K(ps(t))), t._x_refs_proxy));
function ps(t) {
  let e = [];
  return R(t, (n) => {
    n._x_refs && e.push(n._x_refs);
  }), e;
}
var zt = {};
function ri(t) {
  return zt[t] || (zt[t] = 0), ++zt[t];
}
function bs(t, e) {
  return R(t, (n) => {
    if (n._x_ids && n._x_ids[e])
      return !0;
  });
}
function hs(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = ri(e));
}
O("id", (t, { cleanup: e }) => (n, r = null) => {
  let i = `${n}${r ? `-${r}` : ""}`;
  return _s(t, i, e, () => {
    let s = bs(t, n), a = s ? s._x_ids[n] : ri(n);
    return r ? `${n}-${a}-${r}` : `${n}-${a}`;
  });
});
Nt((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function _s(t, e, n, r) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let i = r();
  return t._x_id[e] = i, n(() => {
    delete t._x_id[e];
  }), i;
}
O("el", (t) => t);
si("Focus", "focus", "focus");
si("Persist", "persist", "persist");
function si(t, e, n) {
  O(e, (r) => k(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
v("modelable", (t, { expression: e }, { effect: n, evaluateLater: r, cleanup: i }) => {
  let s = r(e), a = () => {
    let l;
    return s((u) => l = u), l;
  }, o = r(`${e} = __placeholder`), d = (l) => o(() => {
  }, { scope: { __placeholder: l } }), c = a();
  d(c), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let l = t._x_model.get, u = t._x_model.setWithModifiers, h = jn(
      {
        get() {
          return l();
        },
        set(_) {
          u(_);
        }
      },
      {
        get() {
          return a();
        },
        set(_) {
          d(_);
        }
      }
    );
    i(h);
  });
});
v("teleport", (t, { modifiers: e, expression: n }, { cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && k("x-teleport can only be used on a <template> tag", t);
  let i = Ve(n), s = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = s, s._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((o) => {
    s.addEventListener(o, (d) => {
      d.stopPropagation(), t.dispatchEvent(new d.constructor(d.type, d));
    });
  }), St(s, {}, t);
  let a = (o, d, c) => {
    c.includes("prepend") ? d.parentNode.insertBefore(o, d) : c.includes("append") ? d.parentNode.insertBefore(o, d.nextSibling) : d.appendChild(o);
  };
  g(() => {
    D(() => {
      a(s, i, e), q(s);
    })();
  }), t._x_teleportPutBack = () => {
    let o = Ve(n);
    g(() => {
      a(t._x_teleport, o, e);
    });
  }, r(
    () => g(() => {
      s.remove(), Y(s);
    })
  );
});
var gs = document.createElement("div");
function Ve(t) {
  let e = D(() => document.querySelector(t), () => gs)();
  return e || k(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var ai = () => {
};
ai.inline = (t, { modifiers: e }, { cleanup: n }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
v("ignore", ai);
v("effect", D((t, { expression: e }, { effect: n }) => {
  n(x(t, e));
}));
function X(t, e, n, r) {
  let i = t, s = (d) => r(d), a = {}, o = (d, c) => (l) => c(d, l);
  return n.includes("dot") && (e = vs(e)), n.includes("camel") && (e = ms(e)), n.includes("capture") && (a.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("passive") && (a.passive = n[n.indexOf("passive") + 1] !== "false"), s = oi(n, s), n.includes("prevent") && (s = o(s, (d, c) => {
    c.preventDefault(), d(c);
  })), n.includes("stop") && (s = o(s, (d, c) => {
    c.stopPropagation(), d(c);
  })), n.includes("once") && (s = o(s, (d, c) => {
    d(c), i.removeEventListener(e, s, a);
  })), (n.includes("away") || n.includes("outside")) && (i = document, s = o(s, (d, c) => {
    t.contains(c.target) || c.target.isConnected !== !1 && (t.offsetWidth < 1 && t.offsetHeight < 1 || t._x_isShown !== !1 && d(c));
  })), n.includes("self") && (s = o(s, (d, c) => {
    c.target === t && d(c);
  })), e === "submit" && (s = o(s, (d, c) => {
    c.target._x_pendingModelUpdates && c.target._x_pendingModelUpdates.forEach((l) => l()), d(c);
  })), (xs(e) || di(e)) && (s = o(s, (d, c) => {
    ws(c, n) || d(c);
  })), i.addEventListener(e, s, a), () => {
    i.removeEventListener(e, s, a);
  };
}
function oi(t, e) {
  if (t.includes("debounce")) {
    let n = t[t.indexOf("debounce") + 1] || "invalid-wait", r = It(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = Nn(e, r);
  }
  if (t.includes("throttle")) {
    let n = t[t.indexOf("throttle") + 1] || "invalid-wait", r = It(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = Ln(e, r);
  }
  return e;
}
function vs(t) {
  return t.replace(/-/g, ".");
}
function ms(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function It(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function ys(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function xs(t) {
  return ["keydown", "keyup"].includes(t);
}
function di(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function ws(t, e) {
  let n = e.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, It((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, It((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Je(t.key).includes(n[0]))
    return !1;
  const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !i.includes(s)), !(i.length > 0 && i.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), t[`${a}Key`])).length === i.length && (di(t.type) || Je(t.key).includes(n[0])));
}
function Je(t) {
  if (!t)
    return [];
  t = ys(t);
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
  let s = t;
  e.includes("parent") && (s = R(t, (f) => f !== t));
  let a = x(s, n), o;
  typeof n == "string" ? o = x(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = x(s, `${n()} = __placeholder`) : o = () => {
  };
  let d = () => {
    let f;
    return a((m) => f = m), Qe(f) ? f.get() : f;
  }, c = (f) => {
    let m;
    a((y) => m = y), Qe(m) ? m.set(f) : o(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && t.type === "radio" && g(() => {
    t.hasAttribute("name") || t.setAttribute("name", n);
  });
  let l = e.includes("change") || e.includes("lazy"), u = e.includes("blur"), h = e.includes("enter"), _ = l || u || h, M;
  if ($)
    M = () => {
    };
  else if (_) {
    let f = [], m = (y) => c(kt(t, e, y, d()));
    if (l && f.push(X(t, "change", e, m)), u && (f.push(X(t, "blur", e, m)), t.form)) {
      let y = t.form, G = () => m({ target: t });
      y._x_pendingModelUpdates || (y._x_pendingModelUpdates = []), y._x_pendingModelUpdates.push(G), i(() => {
        y._x_pendingModelUpdates && y._x_pendingModelUpdates.splice(y._x_pendingModelUpdates.indexOf(G), 1);
      });
    }
    h && f.push(X(t, "keydown", e, (y) => {
      y.key === "Enter" && m(y);
    })), M = () => f.forEach((y) => y());
  } else {
    let f = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) ? "change" : "input";
    M = X(t, f, e, (m) => {
      c(kt(t, e, m, d()));
    });
  }
  if (e.includes("fill") && ([void 0, null, ""].includes(d()) || Rt(t) && Array.isArray(d()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    kt(t, e, { target: t }, d())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = M, i(() => t._x_removeModelListeners.default()), t.form) {
    let f = X(t.form, "reset", [], (m) => {
      ke(() => t._x_model && t._x_model.set(kt(t, e, { target: t }, d())));
    });
    i(() => f());
  }
  if (t._x_model = {
    get() {
      return d();
    },
    set(f) {
      c(f);
    },
    setWithModifiers: oi(e, c)
  }, t._x_forceModelUpdate = (f) => {
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), g(() => {
      Rt(t) ? Array.isArray(f) ? t.checked = f.some((m) => m == t.value) : t.checked = !!f : Ce(t) ? typeof f == "boolean" ? t.checked = Mt(t.value) === f : t.checked = t.value == f : $n(t, "value", f);
    });
  }, t.tagName === "SELECT") {
    let f = new MutationObserver(() => {
      t._x_forceModelUpdate(d());
    });
    f.observe(t, { childList: !0 }), i(() => f.disconnect());
  }
  r(() => {
    let f = d();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function kt(t, e, n, r) {
  return g(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Rt(t))
      if (Array.isArray(r)) {
        let i = null;
        return e.includes("number") ? i = Vt(n.target.value) : e.includes("boolean") ? i = Mt(n.target.value) : i = n.target.value, n.target.checked ? r.includes(i) ? r : r.concat([i]) : r.filter((s) => !Ss(s, i));
      } else
        return n.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(n.target.selectedOptions).map((i) => {
          let s = i.value || i.text;
          return Vt(s);
        }) : e.includes("boolean") ? Array.from(n.target.selectedOptions).map((i) => {
          let s = i.value || i.text;
          return Mt(s);
        }) : Array.from(n.target.selectedOptions).map((i) => i.value || i.text);
      {
        let i;
        return Ce(t) ? n.target.checked ? i = n.target.value : i = r : i = n.target.value, e.includes("number") ? Vt(i) : e.includes("boolean") ? Mt(i) : e.includes("trim") ? i.trim() : i;
      }
    }
  });
}
function Vt(t) {
  let e = t ? parseFloat(t) : null;
  return Es(e) ? e : t;
}
function Ss(t, e) {
  return t == e;
}
function Es(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Qe(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
v("cloak", (t) => queueMicrotask(() => g(() => t.removeAttribute(it("cloak")))));
Tn(() => `[${it("init")}]`);
v("init", D((t, { expression: e }, { evaluate: n }) => typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)));
v("text", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
  let i = r(e);
  n(() => {
    i((s) => {
      g(() => {
        t.textContent = s;
      });
    });
  });
});
v("html", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
  let i = r(e);
  n(() => {
    i((s) => {
      g(() => {
        Array.from(t.children).forEach((a) => Y(a)), t.innerHTML = s ?? "", t._x_ignoreSelf = !0, q(t), delete t._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
Ee(mn(":", yn(it("bind:"))));
var ci = (t, { value: e, modifiers: n, expression: r, original: i }, { effect: s, cleanup: a }) => {
  if (!e) {
    let d = {};
    Rr(d), x(t, r)((l) => {
      Hn(t, l, i);
    }, { scope: d });
    return;
  }
  if (e === "key")
    return Os(t, r);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let o = x(t, r);
  s(() => o((d) => {
    d === void 0 && typeof r == "string" && r.match(/\./) && (d = ""), g(() => $n(t, e, d, n));
  })), a(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
ci.inline = (t, { value: e, modifiers: n, expression: r }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: r, extract: !1 });
};
v("bind", ci);
function Os(t, e) {
  t._x_keyExpression = e;
}
Mn(() => `[${it("data")}]`);
var F = /* @__PURE__ */ Symbol();
v("data", (t, { expression: e }, { cleanup: n }) => {
  if (ks(t))
    return;
  let r = t[F];
  if (r?.expression === e)
    return;
  e = e === "" ? "{}" : e;
  let i = {};
  ht(i, t);
  let s = {};
  Ir(s, i);
  let a = j(t, e, { scope: s });
  (a === void 0 || a === !0) && (a = {}), ht(a, t);
  let o;
  if (r?.reactiveData) {
    o = r.reactiveData, As(o, a);
    let c = { expression: e };
    t[F] = c, queueMicrotask(() => {
      t[F] === c && delete t[F];
    });
  } else
    o = et(a);
  xe(o, n);
  let d = St(t, o);
  o.init && j(t, o.init), n(() => {
    o.destroy && j(t, o.destroy), d();
    let c = { reactiveData: o };
    t[F] = c, queueMicrotask(() => {
      t[F] === c && delete t[F];
    });
  });
});
function As(t, e) {
  Object.keys(e).forEach((n) => {
    let r = Object.getOwnPropertyDescriptor(e, n), i = Object.getOwnPropertyDescriptor(t, n);
    r.get || r.set || i?.get || i?.set ? (i && delete t[n], i || (t[n] = void 0), r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]) : t[n] = e[n];
  }), Object.keys(t).filter((n) => !Object.prototype.hasOwnProperty.call(e, n)).forEach((n) => delete t[n]);
}
Nt((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function ks(t) {
  return $ ? de ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
v("show", (t, { modifiers: e, expression: n }, { effect: r }) => {
  let i = x(t, n);
  t._x_doHide || (t._x_doHide = () => {
    g(() => {
      t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
    });
  }), t._x_doShow || (t._x_doShow = () => {
    g(() => {
      t.style.length === 1 && t.style.display === "none" ? t.removeAttribute("style") : t.style.removeProperty("display");
    });
  });
  let s = () => {
    t._x_doHide(), t._x_isShown = !1;
  }, a = () => {
    t._x_doShow(), t._x_isShown = !0;
  }, o = () => setTimeout(a), d = ae(
    (u) => u ? a() : s(),
    (u) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, u, a, s) : u ? o() : s();
    }
  ), c, l = !0;
  r(() => i((u) => {
    !l && u === c || (e.includes("immediate") && (u ? o() : s()), d(u), c = u, l = !1);
  }));
});
v("for", D((t, { expression: e }, { effect: n, cleanup: r }) => {
  let i = Cs(e), s = x(t, i.items), a = x(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_lookup = /* @__PURE__ */ new Map(), n(() => Ts(t, i, s, a), { priority: "structural" }), r(() => {
    t._x_lookup.forEach(
      (o) => g(() => {
        Y(o), o.remove();
      })
    ), delete t._x_lookup, delete t._x_lastRenderedEl;
  });
}));
function Ms(t) {
  return (e) => {
    Object.entries(e).forEach(([n, r]) => {
      t[n] = r;
    });
  };
}
function Ts(t, e, n, r) {
  n((i) => {
    Rs(i) && (i = Array.from({ length: i }, (c, l) => l + 1)), i == null && (i = []), i instanceof Set && (i = Array.from(i)), i instanceof Map && (i = Array.from(i));
    let s = t._x_lookup, a = /* @__PURE__ */ new Map();
    t._x_lookup = a;
    let o = qs(i), d = Object.entries(i).map(([c, l]) => {
      o || (c = parseInt(c));
      let u = Ps(e, l, c, i), h;
      return r((_) => {
        typeof _ == "object" && k("x-for key cannot be an object, it must be a string or an integer", t), s.has(_) && (a.set(_, s.get(_)), s.delete(_)), h = _;
      }, { scope: { index: c, ...u } }), [h, u];
    });
    g(() => {
      s.forEach((u) => {
        Y(u), u.remove();
      });
      let c = /* @__PURE__ */ new Set(), l = t;
      d.forEach(([u, h]) => {
        if (a.has(u)) {
          let f = a.get(u);
          f._x_refreshXForScope(h), l.nextElementSibling !== f && (l.nextElementSibling && f.replaceWith(l.nextElementSibling), l.after(f)), l = f, f._x_currentIfEl && (f.nextElementSibling !== f._x_currentIfEl && l.after(f._x_currentIfEl), l = f._x_currentIfEl);
          return;
        }
        t.content.children.length > 1 && k("x-for templates require a single root element, additional elements will be ignored.", t);
        let _ = document.importNode(t.content, !0).firstElementChild, M = et(h);
        St(_, M, t), _._x_refreshXForScope = Ms(M), a.set(u, _), c.add(_), l.after(_), l = _;
      }), c.forEach((u) => q(u)), l !== t ? t._x_lastRenderedEl = l : delete t._x_lastRenderedEl;
    });
  });
}
function Cs(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, r = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, i = t.match(r);
  if (!i)
    return;
  let s = {};
  s.items = i[2].trim();
  let a = i[1].replace(n, "").trim(), o = a.match(e);
  return o ? (s.item = a.replace(e, "").trim(), s.index = o[1].trim(), o[2] && (s.collection = o[2].trim())) : s.item = a, s;
}
function Ps(t, e, n, r) {
  let i = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    i[a] = e[o];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    i[a] = e[a];
  }) : i[t.item] = e, t.index && (i[t.index] = n), t.collection && (i[t.collection] = r), i;
}
function Rs(t) {
  return typeof t != "object" && !isNaN(t);
}
function qs(t) {
  return typeof t == "object" && !Array.isArray(t);
}
function li() {
}
li.inline = (t, { expression: e }, { cleanup: n }) => {
  let r = Dt(t);
  r && (r._x_refs || (r._x_refs = {}), r._x_refs[e] = t, n(() => delete r._x_refs[e]));
};
v("ref", li);
v("if", D((t, { expression: e }, { effect: n, cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && k("x-if can only be used on a <template> tag", t);
  let i = x(t, e), s = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let o = t.content.cloneNode(!0).firstElementChild;
    return St(o, {}, t), g(() => {
      t.after(o), q(o);
    }), t._x_currentIfEl = o, t._x_lastRenderedEl = o, t._x_undoIf = () => {
      g(() => {
        Y(o), o.remove();
      }), delete t._x_currentIfEl, delete t._x_lastRenderedEl;
    }, o;
  }, a = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  n(() => i((o) => {
    o ? s() : a();
  }), { priority: "structural" }), r(() => t._x_undoIf && t._x_undoIf());
}));
v("id", (t, { expression: e }, { evaluate: n }) => {
  n(e).forEach((i) => hs(t, i));
});
Nt((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
Ee(mn("@", yn(it("on:"))));
v("on", D((t, { value: e, modifiers: n, expression: r }, { cleanup: i }) => {
  let s = r ? x(t, r) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let a = X(t, e, n, (o) => {
    s(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  i(() => a());
}));
Lt("Collapse", "collapse", "collapse");
Lt("Intersect", "intersect", "intersect");
Lt("Focus", "trap", "focus");
Lt("Mask", "mask", "mask");
function Lt(t, e, n) {
  v(e, (r) => k(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
rt.setEvaluator(Li);
rt.setRawEvaluator(Ui);
rt.setReactivityEngine({
  reactive: De,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (t, e = {}) => {
    let n;
    return n = Wr(t, {
      scheduler: () => {
        n && (e.scheduler ? e.scheduler(n) : n());
      }
    }), n;
  },
  release: zr,
  raw: b
});
var Is = rt, Jt = Is;
function $s(t) {
  const e = window.__siteationDebugBar;
  return e ? (e.onRequest = t, e.requests.slice()) : [];
}
const $t = "__siteationDebugBarHostLock";
function Ds(t) {
  if (!t || window[$t]) return;
  const e = document.body, n = Math.max(0, window.innerWidth - document.documentElement.clientWidth), r = {
    overflow: e.style.overflow,
    paddingRight: e.style.paddingRight,
    inert: []
  };
  if (Array.from(e.children).forEach((i) => {
    i === t || i.contains(t) || !(i instanceof HTMLElement) || i.matches("script, style, link") || (r.inert.push([i, i.inert]), i.inert = !0);
  }), e.style.overflow = "hidden", n > 0) {
    const i = Number.parseFloat(window.getComputedStyle(e).paddingRight || "0");
    e.style.paddingRight = `${i + n}px`;
  }
  window[$t] = r;
}
function Fs() {
  const t = window[$t];
  t && (t.inert.forEach(([e, n]) => {
    e.inert = n;
  }), document.body.style.overflow = t.overflow, document.body.style.paddingRight = t.paddingRight, delete window[$t]);
}
function Ns(t, e) {
  if (t.key !== "Tab" || !e) return;
  const n = Array.from(e.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((a) => a.offsetParent !== null);
  if (n.length === 0) return;
  const r = n[0], i = n[n.length - 1], s = e.getRootNode().activeElement;
  t.shiftKey && s === r ? (t.preventDefault(), i.focus()) : !t.shiftKey && s === i && (t.preventDefault(), r.focus());
}
const ui = "siteation.debugbar.v1", Ls = "__PROFILE_ID__";
function js() {
  const t = document.getElementById("siteation-debugbar-profile");
  if (!t) return {};
  try {
    return JSON.parse(t.textContent || "{}");
  } catch {
    return {};
  }
}
function Bs() {
  const t = { open: !1, section: "overview" };
  try {
    return { ...t, ...JSON.parse(localStorage.getItem(ui) || "{}") };
  } catch {
    return t;
  }
}
function dt(t, e, n) {
  const r = e.trim().toLowerCase();
  return r ? t.filter((i) => n.some(
    (s) => String(i[s] ?? "").toLowerCase().includes(r)
  )) : t;
}
function Hs() {
  return {
    profile: {},
    open: !1,
    section: "findings",
    placement: "bottom",
    maximised: !1,
    // Deliberately not persisted. Hiding the bar for good with no way back would be a
    // trap, so closing it lasts until the next page load.
    dismissed: !1,
    queryFilter: "all",
    querySearch: "",
    eventFilter: "all",
    eventSearch: "",
    observerSearch: "",
    blockSearch: "",
    pluginSearch: "",
    timelineFilter: "key",
    timelineSearch: "",
    returnFocusTo: null,
    payloads: {},
    loading: !1,
    loadError: "",
    requests: [],
    activeId: null,
    pageProfile: {},
    init() {
      this.profile = js(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const t = Bs();
      this.open = t.open, this.section = t.section, this.placement = t.placement === "top" ? "top" : "bottom", this.maximised = !!t.maximised, this.open && this.$nextTick(() => this.lock()), this.requests = $s((e) => {
        this.requests.some((n) => n.id === e.id) || (this.requests = [e, ...this.requests].slice(0, 25));
      }).filter((e) => e.id !== this.profile.id), this.open && this.loadPayloads();
    },
    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(t) {
      const e = document.getElementById("siteation-debugbar")?.dataset.profileUrl;
      return e ? e.replace(Ls, encodeURIComponent(t)) : null;
    },
    /**
     * Swap the whole bar over to another profile the page has since produced.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async showProfile(t) {
      if (t === this.activeId) return;
      const e = this.profileUrlFor(t);
      if (e) {
        this.loading = !0, this.loadError = "";
        try {
          const n = await fetch(e, { headers: { Accept: "application/json" } });
          if (!n.ok) throw new Error(`HTTP ${n.status}`);
          const r = await n.json(), i = {};
          Object.entries(r.sections || {}).forEach(([s, a]) => {
            i[s] = a.payload || {};
          }), this.profile = r, this.payloads = i, this.activeId = t;
        } catch (n) {
          this.loadError = String(n.message || n);
        } finally {
          this.loading = !1;
        }
      }
    },
    /** Go back to the request that rendered the page. */
    showPageProfile() {
      this.activeId !== this.pageProfile.id && (this.profile = this.pageProfile, this.payloads = {}, this.activeId = this.pageProfile.id || null, this.loadPayloads());
    },
    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(t) {
      try {
        return new URL(t, window.location.origin).pathname;
      } catch {
        return t;
      }
    },
    /**
     * Only summaries travel in the page. The items behind them are fetched once, the
     * first time the bar is opened, because a busy uncached page profiles to several
     * hundred kilobytes and that has no business on every response.
     *
     * @returns {Promise<void>}
     */
    async loadPayloads() {
      if (!this.profile.lazy || this.loading || Object.keys(this.payloads).length) return;
      const t = this.profileUrlFor(this.profile.id || "");
      if (t) {
        this.loading = !0, this.loadError = "";
        try {
          const e = await fetch(t, { headers: { Accept: "application/json" } });
          if (!e.ok) throw new Error(`HTTP ${e.status}`);
          const n = await e.json(), r = {};
          Object.entries(n.sections || {}).forEach(([i, s]) => {
            r[i] = s.payload || {};
          }), this.payloads = r;
        } catch (e) {
          this.loadError = String(e.message || e);
        } finally {
          this.loading = !1;
        }
      }
    },
    /**
     * @param {string} key
     * @returns {object}
     */
    summaryOf(t) {
      return this.profile.sections?.[t]?.summary || {};
    },
    /**
     * @param {string} key
     * @returns {Array<object>}
     */
    itemsOf(t) {
      return this.payloads[t]?.items || this.profile.sections?.[t]?.payload?.items || [];
    },
    /** @returns {Array<object>} */
    get findings() {
      return this.profile.findings || [];
    },
    /** @returns {number} */
    get errorCount() {
      return this.findings.filter((t) => t.severity === "error").length;
    },
    /** @returns {number} */
    get warningCount() {
      return this.findings.filter((t) => t.severity === "warning").length;
    },
    /** @returns {string} */
    get findingsTone() {
      return this.errorCount > 0 ? "bad" : this.warningCount > 0 ? "warn" : "ok";
    },
    /** @returns {object} */
    get request() {
      return this.summaryOf("request");
    },
    /** @returns {object} */
    get queries() {
      return this.summaryOf("queries");
    },
    /** @returns {object} */
    get events() {
      return this.summaryOf("events");
    },
    /** @returns {object} */
    get observers() {
      return this.summaryOf("observers");
    },
    /** @returns {object} */
    get cache() {
      return this.summaryOf("cache");
    },
    /** @returns {object} */
    get blocks() {
      return this.summaryOf("blocks");
    },
    /** @returns {object} */
    get interception() {
      return this.summaryOf("interception");
    },
    /** @returns {object} */
    get timeline() {
      return this.summaryOf("timeline");
    },
    /** @returns {object} */
    get metrics() {
      return this.profile.metrics || {};
    },
    /** @returns {Array<object>} */
    get visibleQueries() {
      const t = this.queryFilter === "slow" ? this.itemsOf("queries").filter((e) => e.slow) : this.itemsOf("queries");
      return dt(t, this.querySearch, ["sql"]);
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const t = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((e) => e.observer_count === 0) : this.itemsOf("events");
      return dt(t, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return dt(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      return dt(this.itemsOf("blocks"), this.blockSearch, ["name", "template", "class"]);
    },
    /**
     * Key activity hides the long tail of fast points, which on a Magento page is most of
     * the list and none of the answer.
     *
     * @returns {Array<object>}
     */
    get visibleTimeline() {
      const t = this.timelineFilter === "key" ? this.itemsOf("timeline").filter(
        (e) => e.kind === "milestone" || Number(e.duration_ms || 0) >= 1
      ) : this.itemsOf("timeline");
      return dt(t, this.timelineSearch, ["label", "section"]);
    },
    /** @returns {Array<object>} */
    get timelineAxis() {
      const t = Number(this.timeline.scale_ms || 0);
      return [0, 0.25, 0.5, 0.75, 1].map((e) => ({
        percent: e * 100,
        label: `${(t * e).toFixed(t < 10 ? 1 : 0)} ms`
      }));
    },
    /** @returns {Array<object>} */
    get visiblePlugins() {
      const t = this.pluginSearch.trim().toLowerCase();
      return t ? this.itemsOf("interception").filter((e) => e.type.toLowerCase().includes(t) || e.plugins.some((n) => n.code.toLowerCase().includes(t) || n.class.toLowerCase().includes(t))) : this.itemsOf("interception");
    },
    /** @returns {string} */
    get statusPhrase() {
      const t = Number(this.request.status || 0);
      return t >= 500 ? "Error" : t >= 400 ? "Refused" : t >= 300 ? "Redirect" : "Success";
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
    /** @returns {string} */
    get cacheTone() {
      const t = this.cache.hit_rate;
      return t == null ? "ok" : t < 50 ? "warn" : "ok";
    },
    /**
     * A cached page never reaches most of the application, so an empty profile is the
     * expected result rather than a sign the bar is broken.
     *
     * @returns {boolean}
     */
    get looksLikeFullPageCacheHit() {
      return Number(this.queries.count || 0) === 0 && Number(this.events.count || 0) === 0;
    },
    openInspector() {
      this.open || (this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), Fs(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus());
    },
    toggle() {
      this.open ? this.closeInspector() : this.openInspector();
    },
    toggleMaximised() {
      this.maximised = !this.maximised, this.persist();
    },
    movePlacement() {
      this.placement = this.placement === "bottom" ? "top" : "bottom", this.persist();
    },
    dismiss() {
      this.closeInspector(), this.dismissed = !0;
    },
    lock() {
      Ds(document.getElementById("siteation-debugbar")), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(t) {
      if (t.key === "Escape") {
        this.closeInspector();
        return;
      }
      Ns(t, this.$refs.sheet);
    },
    /** @param {string} section */
    select(t) {
      this.section = t, this.openInspector(), this.persist();
    },
    /**
     * Findings are only useful if they lead somewhere, so each one carries the section
     * and filter that hold its evidence.
     *
     * @param {object} action
     */
    follow(t) {
      t && (t.filter && t.section === "queries" && (this.queryFilter = t.filter === "repeated" ? "all" : t.filter, this.querySearch = ""), this.select(t.section));
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
        localStorage.setItem(ui, JSON.stringify({
          open: this.open,
          section: this.section,
          placement: this.placement,
          maximised: this.maximised
        }));
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
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(t) {
      return Object.entries(t.methods || {}).map(([e, n]) => `${n} ${e}`).join(", ");
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(t) {
      const e = Number(t || 0);
      return e < 1024 ? `${e} B` : e < 1048576 ? `${(e / 1024).toFixed(1)} kB` : `${(e / 1048576).toFixed(1)} MB`;
    }
  };
}
const Ks = {
  database: '<path d="M12 2.5c4.14 0 7.5 1.12 7.5 2.5S16.14 7.5 12 7.5 4.5 6.38 4.5 5 7.86 2.5 12 2.5Z"/><path d="M19.5 5v14c0 1.38-3.36 2.5-7.5 2.5S4.5 20.38 4.5 19V5"/><path d="M19.5 12c0 1.38-3.36 2.5-7.5 2.5S4.5 13.38 4.5 12"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 2.5v3M14 2.5v3M10 18.5v3M14 18.5v3M2.5 10h3M2.5 14h3M18.5 10h3M18.5 14h3"/>',
  bolt: '<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
  dock: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 15h18"/>',
  minimise: '<path d="M5 12h14"/>',
  expand: '<path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5"/>',
  collapse: '<path d="M9 4v5H4M15 20v-5h5M15 4v5h5M9 20v-5H4"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  caret: '<path d="m6 9 6 6 6-6"/>'
};
function S(t, e = "") {
  return `<svg class="ndb-icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${Ks[t] || ""}</svg>`;
}
function Ye({ sheet: t }) {
  return `
<div class="ndb-header">
  <button type="button" class="ndb-request" data-ndb-on:click="select('overview')"
          data-ndb-bind:title="request.path">
    <span class="ndb-method" data-ndb-text="request.method || 'GET'"></span>
    <span class="ndb-request-body">
      <span class="ndb-path" data-ndb-text="request.path || '/'"></span>
      <span class="ndb-request-meta">
        <span data-ndb-bind:class="'is-' + statusTone" data-ndb-text="request.status"></span>
        <span data-ndb-text="statusPhrase"></span>
        <span class="ndb-dim" data-ndb-text="bytes(request.response_bytes)"></span>
      </span>
    </span>
  </button>

  <div class="ndb-stats">
    <button type="button" class="ndb-stat" data-ndb-on:click="select('overview')">
      <span class="ndb-env-dot" data-ndb-bind:class="'is-' + findingsTone"></span>
      <span>
        <span class="ndb-stat-key">Mode</span>
        <span class="ndb-stat-value" data-ndb-text="request.mode || 'unknown'"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat" data-ndb-on:click="select('queries')">
      ${S("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </button>

    <button type="button" class="ndb-stat" data-ndb-on:click="select('timeline')">
      ${S("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat is-secondary" data-ndb-on:click="select('blocks')">
      ${S("bolt", "is-accent")}
      <span>
        <span class="ndb-stat-key">Blocks</span>
        <span class="ndb-stat-value" data-ndb-text="blocks.unique_count || 0"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat is-secondary" data-ndb-on:click="select('overview')">
      ${S("chip", "is-accent")}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </button>
  </div>

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="select('findings')"
            data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
            title="Findings">
      ${S("search")}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="movePlacement()"
            data-ndb-bind:title="placement === 'bottom' ? 'Move to the top' : 'Move to the bottom'">
      ${S("dock")}
    </button>

    <span class="ndb-controls-divider"></span>

    ${t ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      <span data-ndb-show="!maximised">${S("expand")}</span>
      <span data-ndb-show="maximised">${S("collapse")}</span>
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${S("minimise")}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${S("expand")}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="dismiss()"
            title="Hide until the next page load">
      ${S("close")}
    </button>
  </div>
</div>`;
}
const Us = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement">

  <div class="ndb-dock" data-ndb-show="!open && !dismissed" data-ndb-cloak>
    ${Ye({ sheet: !1 })}
  </div>

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${Ye({ sheet: !0 })}

      <nav class="ndb-tabs">
      <button type="button" class="ndb-tab" data-ndb-on:click="select('findings')"
              data-ndb-bind:class="isSection('findings') && 'is-active'">
        Findings
        <span class="ndb-pill" data-ndb-bind:class="'is-' + findingsTone"
              data-ndb-text="findings.length"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('overview')"
              data-ndb-bind:class="isSection('overview') && 'is-active'">Overview</button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('timeline')"
              data-ndb-bind:class="isSection('timeline') && 'is-active'">
        Timeline <span class="ndb-pill" data-ndb-text="timeline.count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('queries')"
              data-ndb-bind:class="isSection('queries') && 'is-active'">
        Queries <span class="ndb-pill" data-ndb-text="queries.count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('events')"
              data-ndb-bind:class="isSection('events') && 'is-active'">
        Events <span class="ndb-pill" data-ndb-text="events.unique_count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('observers')"
              data-ndb-bind:class="isSection('observers') && 'is-active'">
        Observers <span class="ndb-pill" data-ndb-text="observers.unique_count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('blocks')"
              data-ndb-bind:class="isSection('blocks') && 'is-active'">
        Blocks <span class="ndb-pill" data-ndb-text="blocks.unique_count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('cache')"
              data-ndb-bind:class="isSection('cache') && 'is-active'">
        Cache <span class="ndb-pill" data-ndb-text="cache.count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('plugins')"
              data-ndb-bind:class="isSection('plugins') && 'is-active'">
        Plugins <span class="ndb-pill" data-ndb-text="interception.plugin_count || 0"></span>
      </button>
      </nav>

    <div class="ndb-panel-body">

      <div class="ndb-requests" data-ndb-show="requests.length > 0">
        <span class="ndb-requests-label">Requests</span>
        <button type="button" class="ndb-chip" data-ndb-on:click="showPageProfile()"
                data-ndb-bind:class="activeId === pageProfile.id && 'is-active'">
          Page
        </button>
        <template data-ndb-for="(entry, index) in requests" data-ndb-bind:key="index">
          <button type="button" class="ndb-chip"
                  data-ndb-on:click="showProfile(entry.id)"
                  data-ndb-bind:class="activeId === entry.id && 'is-active'">
            <span data-ndb-text="entry.method"></span>
            <span class="ndb-mono" data-ndb-text="shortUrl(entry.url)"></span>
            <span class="ndb-dim" data-ndb-text="entry.status"></span>
          </button>
        </template>
      </div>

      <p class="ndb-note" data-ndb-show="loading">Loading profile details.</p>
      <p class="ndb-note" data-ndb-show="loadError">
        Could not load profile details: <span data-ndb-text="loadError"></span>
      </p>

      <div data-ndb-show="isSection('findings')">
        <p class="ndb-empty" data-ndb-show="findings.length === 0">
          Nothing worth flagging on this request.
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="(finding, index) in findings" data-ndb-bind:key="index">
            <li class="ndb-finding" data-ndb-bind:class="'is-' + finding.severity">
              <div class="ndb-finding-head">
                <span class="ndb-severity" data-ndb-bind:class="'is-' + finding.severity"
                      data-ndb-text="finding.severity"></span>
                <span class="ndb-finding-message" data-ndb-text="finding.message"></span>
                <code class="ndb-dim ndb-finding-id" data-ndb-text="finding.id"></code>
              </div>
              <p class="ndb-finding-why" data-ndb-text="finding.why"></p>
              <p class="ndb-finding-next">
                <strong>Next</strong> <span data-ndb-text="finding.next"></span>
              </p>
              <p class="ndb-finding-where" data-ndb-show="finding.location">
                <strong>Where</strong> <code data-ndb-text="finding.location"></code>
              </p>
              <button type="button" class="ndb-chip" data-ndb-show="finding.action"
                      data-ndb-on:click="follow(finding.action)"
                      data-ndb-text="finding.action ? finding.action.label : ''"></button>
            </li>
          </template>
        </ol>
      </div>

      <div data-ndb-show="isSection('overview')">
        <p class="ndb-note" data-ndb-show="looksLikeFullPageCacheHit">
          No queries and no events. This page was almost certainly served from the full
          page cache, so the application never ran.
        </p>
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
          <div><dt>Events</dt><dd>
            <span data-ndb-text="events.count || 0"></span> dispatched,
            <span data-ndb-text="events.unique_count || 0"></span> unique
          </dd></div>
          <div><dt>Observers</dt><dd>
            <span data-ndb-text="observers.count || 0"></span> in
            <span data-ndb-text="number(observers.duration_ms, 1)"></span> ms
          </dd></div>
          <div><dt>Blocks</dt><dd>
            <span data-ndb-text="blocks.unique_count || 0"></span> rendered in
            <span data-ndb-text="number(blocks.duration_ms, 1)"></span> ms
          </dd></div>
          <div><dt>Cache</dt><dd>
            <span data-ndb-text="cache.hit_rate === null ? 'no reads' : number(cache.hit_rate, 1) + '% hit rate'"></span>
          </dd></div>
          <div><dt>Profile</dt><dd class="ndb-mono ndb-dim" data-ndb-text="profile.id"></dd></div>
        </dl>
      </div>

      <div data-ndb-show="isSection('timeline')">
        <p class="ndb-section-lead">
          Follow important work in the order it happened across the request.
        </p>

        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="timelineFilter = 'key'"
                  data-ndb-bind:class="timelineFilter === 'key' && 'is-active'">Key activity</button>
          <button type="button" class="ndb-chip" data-ndb-on:click="timelineFilter = 'all'"
                  data-ndb-bind:class="timelineFilter === 'all' && 'is-active'">Everything</button>
          <input class="ndb-search" type="search" placeholder="Filter activity"
                 data-ndb-model="timelineSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleTimeline.length"></span> of
            <span data-ndb-text="timeline.count || 0"></span> across
            <span data-ndb-text="number(timeline.scale_ms, 0)"></span> ms
          </span>
        </div>

        <div class="ndb-wf">
          <div class="ndb-wf-head">
            <span class="ndb-wf-activity">Activity</span>
            <span class="ndb-wf-track">
              <template data-ndb-for="(tick, index) in timelineAxis" data-ndb-bind:key="index">
                <span class="ndb-wf-tick" data-ndb-bind:style="'left:' + tick.percent + '%'"
                      data-ndb-text="tick.label"></span>
              </template>
            </span>
            <span class="ndb-wf-timing">Timing</span>
          </div>

          <template data-ndb-for="(entry, index) in visibleTimeline" data-ndb-bind:key="index">
            <div class="ndb-wf-row" data-ndb-bind:class="'is-' + entry.kind">
              <span class="ndb-wf-activity">
                <span class="ndb-wf-label" data-ndb-text="entry.label"></span>
                <small class="ndb-wf-section" data-ndb-text="entry.section"></small>
              </span>
              <span class="ndb-wf-track">
                <span class="ndb-wf-grid"></span>
                <span class="ndb-wf-bar" data-ndb-show="entry.kind === 'span'"
                      data-ndb-bind:style="'left:' + entry.start_percent + '%;width:' + Math.max(entry.duration_percent, 0.4) + '%'"></span>
                <span class="ndb-wf-dot" data-ndb-show="entry.kind !== 'span'"
                      data-ndb-bind:style="'left:' + entry.at_percent + '%'"></span>
              </span>
              <span class="ndb-wf-timing">
                <span class="ndb-wf-duration"
                      data-ndb-text="entry.duration_ms === null ? number(entry.at_ms, 1) + ' ms' : number(entry.duration_ms, 2) + ' ms'"></span>
                <small class="ndb-dim" data-ndb-show="entry.kind === 'span'"
                       data-ndb-text="number(entry.start_ms, 1) + '–' + number(entry.at_ms, 1) + ' ms'"></small>
              </span>
            </div>
          </template>
        </div>

        <p class="ndb-empty" data-ndb-show="visibleTimeline.length === 0">No activity matches.</p>
      </div>

      <div data-ndb-show="isSection('queries')">
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

      <div data-ndb-show="isSection('events')">
        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="eventFilter = 'all'"
                  data-ndb-bind:class="eventFilter === 'all' && 'is-active'">All</button>
          <button type="button" class="ndb-chip" data-ndb-on:click="eventFilter = 'unobserved'"
                  data-ndb-bind:class="eventFilter === 'unobserved' && 'is-active'">
            Unobserved <span class="ndb-pill" data-ndb-text="events.unobserved_count || 0"></span>
          </button>
          <input class="ndb-search" type="search" placeholder="Filter events"
                 data-ndb-model="eventSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleEvents.length"></span> shown
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Event</th>
              <th class="ndb-num">Dispatched</th>
              <th class="ndb-num">Observers</th>
              <th class="ndb-num">Time</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(event, index) in visibleEvents" data-ndb-bind:key="index">
              <tr>
                <td class="ndb-mono" data-ndb-text="event.name"></td>
                <td class="ndb-num" data-ndb-text="event.count"></td>
                <td class="ndb-num" data-ndb-bind:class="event.observer_count === 0 && 'ndb-dim'"
                    data-ndb-text="event.observer_count"></td>
                <td class="ndb-num" data-ndb-text="number(event.duration_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="visibleEvents.length === 0">No events match.</p>
      </div>

      <div data-ndb-show="isSection('observers')">
        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter observers"
                 data-ndb-model="observerSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleObservers.length"></span> shown
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Observer</th>
              <th>Event</th>
              <th class="ndb-num">Runs</th>
              <th class="ndb-num">Time</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(observer, index) in visibleObservers" data-ndb-bind:key="index">
              <tr>
                <td>
                  <span data-ndb-text="observer.name"></span>
                  <small class="ndb-dim ndb-mono ndb-block" data-ndb-text="observer.instance"></small>
                </td>
                <td class="ndb-mono" data-ndb-text="observer.event"></td>
                <td class="ndb-num" data-ndb-text="observer.count"></td>
                <td class="ndb-num" data-ndb-text="number(observer.duration_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="visibleObservers.length === 0">No observers match.</p>
      </div>

      <div data-ndb-show="isSection('cache')">
        <div class="ndb-controls">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="cache.hits || 0"></span> hits,
            <span data-ndb-text="cache.misses || 0"></span> misses,
            <span data-ndb-text="cache.hit_rate === null ? 'no reads' : number(cache.hit_rate, 1) + '% hit rate'"></span>
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Group</th>
              <th class="ndb-num">Operations</th>
              <th class="ndb-num">Hits</th>
              <th class="ndb-num">Misses</th>
              <th class="ndb-num">Size</th>
              <th class="ndb-num">Time</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(group, index) in cacheItems" data-ndb-bind:key="index">
              <tr>
                <td class="ndb-mono" data-ndb-text="group.group"></td>
                <td class="ndb-num" data-ndb-text="group.count"></td>
                <td class="ndb-num" data-ndb-text="group.hits"></td>
                <td class="ndb-num" data-ndb-bind:class="group.misses > group.hits && 'is-warn'"
                    data-ndb-text="group.misses"></td>
                <td class="ndb-num" data-ndb-text="bytes(group.bytes)"></td>
                <td class="ndb-num" data-ndb-text="number(group.duration_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="cacheItems.length === 0">No cache activity.</p>
      </div>

      <div data-ndb-show="isSection('blocks')">
        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter blocks and templates"
                 data-ndb-model="blockSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleBlocks.length"></span> shown, own time excludes children
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Block</th>
              <th class="ndb-num">Renders</th>
              <th class="ndb-num">Own</th>
              <th class="ndb-num">Total</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(block, index) in visibleBlocks" data-ndb-bind:key="index">
              <tr>
                <td>
                  <span data-ndb-text="block.name"></span>
                  <small class="ndb-dim ndb-mono ndb-block"
                         data-ndb-text="block.template || block.class"></small>
                </td>
                <td class="ndb-num" data-ndb-text="block.count"></td>
                <td class="ndb-num" data-ndb-text="number(block.own_ms, 2) + ' ms'"></td>
                <td class="ndb-num ndb-dim" data-ndb-text="number(block.total_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="visibleBlocks.length === 0">No blocks match.</p>
      </div>

      <div data-ndb-show="isSection('plugins')">
        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter types and plugins"
                 data-ndb-model="pluginSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visiblePlugins.length"></span> intercepted types
          </span>
        </div>

        <p class="ndb-note" data-ndb-show="interception.available === false">
          Magento exposes no public API for the plugin list, so this panel reads internals.
          They moved, and the panel switched itself off rather than break the page.
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="(entry, index) in visiblePlugins" data-ndb-bind:key="index">
            <li class="ndb-intercept">
              <div class="ndb-intercept-type">
                <code data-ndb-text="entry.type"></code>
                <span class="ndb-pill" data-ndb-text="entry.plugin_count"></span>
              </div>
              <ul class="ndb-intercept-plugins">
                <template data-ndb-for="(plugin, pluginIndex) in entry.plugins"
                          data-ndb-bind:key="pluginIndex">
                  <li>
                    <span data-ndb-text="plugin.code"></span>
                    <span class="ndb-dim ndb-mono" data-ndb-text="methodList(plugin)"></span>
                    <small class="ndb-dim ndb-mono ndb-block" data-ndb-text="plugin.class"></small>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="visiblePlugins.length === 0">No plugins match.</p>
      </div>

    </div>
  </div>

</div>
`, Ws = "data-ndb-", zs = "siteation-debugbar";
function Vs(t) {
  const e = t.attachShadow({ mode: "open" }), n = t.dataset.css;
  if (n) {
    const i = document.createElement("link");
    i.rel = "stylesheet", i.href = n, e.append(i);
  }
  const r = document.createElement("div");
  return r.innerHTML = Us, e.append(...r.children), e.querySelector(".ndb");
}
const Qt = document.getElementById(zs);
if (Qt && !Qt.shadowRoot) {
  const t = Vs(Qt);
  Jt.prefix(Ws), Jt.data("debugBar", Hs), t && Jt.initTree(t), Fe && (window.Alpine = Fe);
}
