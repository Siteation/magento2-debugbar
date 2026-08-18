const Fe = window.Alpine;
var Yt = !1, Zt = !1, P = [], Gt = -1, Tt = !1, he = !1;
function fi(t) {
  bi(t);
}
function pi() {
  he = !0;
}
function hi() {
  he = !1, Ze();
}
function bi(t) {
  P.includes(t) || (P.push(t), t._x_schedulerPriority !== void 0 && (Tt = !0)), Ze();
}
function _i(t) {
  let e = P.indexOf(t);
  e !== -1 && e > Gt && P.splice(e, 1);
}
function Ze() {
  if (!Zt && !Yt) {
    if (he)
      return;
    Yt = !0, queueMicrotask(mi);
  }
}
function mi() {
  Yt = !1, Zt = !0;
  for (let t = 0; t < P.length; t++)
    Tt && gi(t), P[t](), Gt = t;
  P.length = 0, Gt = -1, Tt = !1, Zt = !1;
}
function gi(t) {
  let e = /* @__PURE__ */ new Map(), n = P.slice(t).sort((s, i) => vi(s, i, e));
  for (let s = 0; s < n.length; s++)
    P[t + s] = n[s];
  Tt = !1;
}
function vi(t, e, n) {
  return jt(t) ? jt(e) ? Ne(t._x_schedulerPriority.el, n) - Ne(e._x_schedulerPriority.el, n) || t._x_schedulerPriority.order - e._x_schedulerPriority.order : -1 : jt(e) ? 1 : 0;
}
function jt(t) {
  return t._x_schedulerPriority !== void 0;
}
function Ne(t, e) {
  if (e.has(t))
    return e.get(t);
  let n = 0, s = t;
  for (; t; )
    n++, t._x_teleportBack ? t = t._x_teleportBack : typeof ShadowRoot == "function" && t.parentNode instanceof ShadowRoot ? t = t.parentNode.host : t = t.parentElement;
  return e.set(s, n), n;
}
var et, Q, nt, Ge, yi = 0, Xt = !0;
function xi(t) {
  Xt = !1, t(), Xt = !0;
}
function wi(t) {
  et = t.reactive, nt = t.release, Q = (e) => t.effect(e, { scheduler: (n) => {
    Xt ? fi(n) : n();
  } }), Ge = t.raw;
}
function Le(t) {
  Q = t;
}
function Si(t) {
  let e = () => {
  };
  return [(s, i) => {
    let r = i?.priority === "structural" ? yi++ : void 0, a = Q(s);
    return r !== void 0 && a !== void 0 && (a._x_schedulerPriority = { el: t, order: r }), t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((o) => o());
    }), t._x_effects.add(a), e = () => {
      a !== void 0 && (t._x_effects.delete(a), nt(a));
    }, a;
  }, () => {
    e();
  }];
}
function Xe(t, e) {
  let n = !0, s, i, r = Q(() => {
    let a = t(), o = JSON.stringify(a);
    if (!n && (typeof a == "object" || a !== s)) {
      let d = typeof s == "object" ? JSON.parse(i) : s;
      queueMicrotask(() => {
        e(a, d);
      });
    }
    s = a, i = o, n = !1;
  });
  return () => nt(r);
}
async function Ei(t) {
  pi();
  try {
    await t(), await Promise.resolve();
  } finally {
    hi();
  }
}
var tn = [], en = [], nn = [];
function Oi(t) {
  nn.push(t);
}
function be(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, en.push(e));
}
function sn(t) {
  tn.push(t);
}
function rn(t, e, n) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n);
}
function an(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([n, s]) => {
    (e === void 0 || e.includes(n)) && (s.forEach((i) => i()), delete t._x_attributeCleanups[n]);
  });
}
function ki(t) {
  for (t._x_effects?.forEach(_i); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var _e = new MutationObserver(ye), me = !1;
function ge() {
  _e.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), me = !0;
}
function on() {
  Ai(), _e.disconnect(), me = !1;
}
var rt = [];
function Ai() {
  let t = _e.takeRecords();
  rt.push(() => t.length > 0 && ye(t));
  let e = rt.length;
  queueMicrotask(() => {
    if (rt.length === e)
      for (; rt.length > 0; )
        rt.shift()();
  });
}
function m(t) {
  if (!me)
    return t();
  on();
  let e = t();
  return ge(), e;
}
var ve = !1, Ct = [];
function Mi() {
  ve = !0;
}
function Ti() {
  ve = !1, ye(Ct), Ct = [];
}
function ye(t) {
  if (ve) {
    Ct = Ct.concat(t);
    return;
  }
  let e = [], n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (let r = 0; r < t.length; r++)
    if (!t[r].target._x_ignoreMutationObserver && (t[r].type === "childList" && (t[r].removedNodes.forEach((a) => {
      a.nodeType === 1 && a._x_marker && n.add(a);
    }), t[r].addedNodes.forEach((a) => {
      if (a.nodeType === 1) {
        if (n.has(a)) {
          n.delete(a);
          return;
        }
        a._x_marker || e.push(a);
      }
    })), t[r].type === "attributes")) {
      let a = t[r].target, o = t[r].attributeName, d = t[r].oldValue, c = () => {
        s.has(a) || s.set(a, []), s.get(a).push({ name: o, value: a.getAttribute(o) });
      }, l = () => {
        i.has(a) || i.set(a, []), i.get(a).push(o);
      };
      a.hasAttribute(o) && d === null ? c() : a.hasAttribute(o) ? (l(), c()) : l();
    }
  i.forEach((r, a) => {
    an(a, r);
  }), s.forEach((r, a) => {
    tn.forEach((o) => o(a, r));
  });
  for (let r of n)
    e.some((a) => a.contains(r)) || en.forEach((a) => a(r));
  for (let r of e)
    r.isConnected && nn.forEach((a) => a(r));
  e = null, n = null, s = null, i = null;
}
function dn(t) {
  return W(H(t));
}
function St(t, e, n) {
  return t._x_dataStack = [e, ...H(n || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((s) => s !== e);
  };
}
function H(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? H(t.host) : t.parentNode ? H(t.parentNode) : [];
}
function W(t) {
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
        (s) => Reflect.has(s, e)
      ) || {},
      e,
      n
    );
  },
  set({ objects: t }, e, n, s) {
    let i;
    for (const a of t)
      if (i = cn(a, e), i)
        break;
    i || (i = t[t.length - 1]);
    const r = Object.getOwnPropertyDescriptor(i, e);
    return r?.set && r?.get ? r.set.call(s, n) || !0 : Reflect.set(i, e, n);
  }
};
function Pi() {
  return Reflect.ownKeys(this).reduce((e, n) => (e[n] = Reflect.get(this, n), e), {});
}
function xe(t, e = () => {
}) {
  let n = (i) => typeof i == "object" && !Array.isArray(i) && i !== null, s = (i, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([a, { value: o, enumerable: d }]) => {
      if (d === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let c = r === "" ? a : `${r}.${a}`;
      typeof o == "object" && o !== null && o._x_interceptor ? i[a] = o.initialize(t, c, a, e) : n(o) && o !== i && !(o instanceof Element) && s(o, c);
    });
  };
  return s(t);
}
function ln(t, e = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(s, i, r, a) {
      return t(this.initialValue, () => Ri(s, i), (o) => te(s, i, o), i, r, a);
    }
  };
  return e(n), (s) => {
    if (typeof s == "object" && s !== null && s._x_interceptor) {
      let i = n.initialize.bind(n);
      n.initialize = (r, a, o, d) => {
        let c = s.initialize(r, a, o, d);
        return n.initialValue = c, i(r, a, o, d);
      };
    } else
      n.initialValue = s;
    return n;
  };
}
function Ri(t, e) {
  return e.split(".").reduce((n, s) => n[s], t);
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
function bt(t, e) {
  let n = qi(e);
  return Object.entries(un).forEach(([s, i]) => {
    Object.defineProperty(t, `$${s}`, {
      get() {
        return i(e, n);
      },
      enumerable: !1
    });
  }), t;
}
function qi(t) {
  let [e, n] = gn(t), s = { interceptor: ln, ...e };
  return be(t, n), s;
}
function Ii(t, e, n, ...s) {
  try {
    return n(...s);
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
  let s;
  return x(t, e)((i) => s = i, n), s;
}
function x(...t) {
  return hn(...t);
}
var hn = () => {
};
function Fi(t) {
  hn = t;
}
var bn;
function Ni(t) {
  bn = t;
}
function Li(t, e) {
  let n = {};
  bt(n, t);
  let s = [n, ...H(t)], i = typeof e == "function" ? ji(s, e) : Hi(s, e, t);
  return Ii.bind(null, t, e, i);
}
function ji(t, e) {
  return (n = () => {
  }, { scope: s = {}, params: i = [], context: r } = {}) => {
    if (!tt) {
      mt(n, e, W([s, ...t]), i);
      return;
    }
    let a = e.apply(W([s, ...t]), i);
    mt(n, a);
  };
}
var Bt = {};
function Bi(t, e) {
  if (Bt[t])
    return Bt[t];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, s = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t, r = (() => {
    try {
      let a = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${s} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(a, "name", {
        value: `[Alpine] ${t}`
      }), a;
    } catch (a) {
      return _t(a, e, t), Promise.resolve();
    }
  })();
  return Bt[t] = r, r;
}
function Hi(t, e, n) {
  let s = Bi(e, n);
  return (i = () => {
  }, { scope: r = {}, params: a = [], context: o } = {}) => {
    s.result = void 0, s.finished = !1;
    let d = W([r, ...t]);
    if (typeof s == "function") {
      let c = s.call(o, s, d).catch((l) => _t(l, n, e));
      s.finished ? (mt(i, s.result, d, a, n), s.result = void 0) : c.then((l) => {
        mt(i, l, d, a, n);
      }).catch((l) => _t(l, n, e)).finally(() => s.result = void 0);
    }
  };
}
function mt(t, e, n, s, i) {
  if (tt && typeof e == "function") {
    let r = e.apply(n, s);
    r instanceof Promise ? r.then((a) => mt(t, a, n, s)).catch((a) => _t(a, i, e)) : t(r);
  } else typeof e == "object" && e instanceof Promise ? e.then((r) => t(r)) : t(e);
}
function Wi(...t) {
  return bn(...t);
}
function Ki(t, e, n = {}) {
  let s = {};
  bt(s, t);
  let i = [s, ...H(t)], r = W([n.scope ?? {}, ...i]), a = n.params ?? [];
  if (e.includes("await")) {
    let o = Object.getPrototypeOf(async function() {
    }).constructor, d = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e;
    return new o(
      ["scope"],
      `with (scope) { let __result = ${d}; return __result }`
    ).call(n.context, r);
  } else {
    let o = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(()=>{ ${e} })()` : e, c = new Function(
      ["scope"],
      `with (scope) { let __result = ${o}; return __result }`
    ).call(n.context, r);
    return typeof c == "function" && tt ? c.apply(r, a) : c;
  }
}
var we = "x-";
function it(t = "") {
  return we + t;
}
function Ui(t) {
  we = t;
}
var Pt = {};
function g(t, e) {
  return Pt[t] = e, {
    before(n) {
      if (!Pt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const s = L.indexOf(n);
      L.splice(s >= 0 ? s : L.indexOf("DEFAULT"), 0, t);
    }
  };
}
function zi(t) {
  return Object.keys(Pt).includes(t);
}
function Se(t, e, n) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let r = Object.entries(t._x_virtualDirectives).map(([o, d]) => ({ name: o, value: d })), a = _n(r);
    r = r.map((o) => a.find((d) => d.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), e = e.concat(r);
  }
  let s = {};
  return e.map(xn((r, a) => s[r] = a)).filter(Sn).map(Qi(s, n)).sort(Yi).map((r) => Ji(t, r));
}
function _n(t) {
  return Array.from(t).map(xn()).filter((e) => !Sn(e));
}
var ee = !1, ct = /* @__PURE__ */ new Map(), mn = /* @__PURE__ */ Symbol();
function Vi(t) {
  ee = !0;
  let e = /* @__PURE__ */ Symbol();
  mn = e, ct.set(e, []);
  let n = () => {
    for (; ct.get(e).length; )
      ct.get(e).shift()();
    ct.delete(e);
  }, s = () => {
    ee = !1, n();
  };
  t(n), s();
}
function gn(t) {
  let e = [], n = (o) => e.push(o), [s, i] = Si(t);
  return e.push(i), [{
    Alpine: st,
    effect: s,
    cleanup: n,
    evaluateLater: x.bind(x, t),
    evaluate: j.bind(j, t)
  }, () => e.forEach((o) => o())];
}
function Ji(t, e) {
  let n = () => {
  }, s = Pt[e.type] || n, [i, r] = gn(t);
  rn(t, e.original, r);
  let a = () => {
    t._x_ignore || t._x_ignoreSelf || (s.inline && s.inline(t, e, i), s = s.bind(s, t, e, i), ee ? ct.get(mn).push(s) : s());
  };
  return a.runCleanups = r, a;
}
var vn = (t, e) => ({ name: n, value: s }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: s }), yn = (t) => t;
function xn(t = () => {
}) {
  return ({ name: e, value: n }) => {
    let { name: s, value: i } = wn.reduce((r, a) => a(r), { name: e, value: n });
    return s !== e && t(s, e), { name: s, value: i };
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
  return ({ name: n, value: s }) => {
    n === s && (s = "");
    let i = n.match(En()), r = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = e || t[n] || n;
    return {
      type: i ? i[1] : null,
      value: r ? r[1] : null,
      modifiers: a.map((d) => d.replace(".", "")),
      expression: s,
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
  let n = L.indexOf(t.type) === -1 ? ne : t.type, s = L.indexOf(e.type) === -1 ? ne : e.type;
  return L.indexOf(n) - L.indexOf(s);
}
function lt(t, e, n = {}, s = {}) {
  return t.dispatchEvent(
    new CustomEvent(e, {
      detail: n,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0,
      // Allows overriding the default event options.
      ...s
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
  let s = t.firstElementChild;
  for (; s; )
    K(s, e), s = s.nextElementSibling;
}
function A(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var je = !1;
function Zi() {
  je && A("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), je = !0, document.body || A("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), lt(document, "alpine:init"), lt(document, "alpine:initializing"), ge(), Oi((e) => q(e, K)), be((e) => Y(e)), sn((e, n) => {
    Se(e, n).forEach((s) => s());
  });
  let t = (e) => !Dt(e.parentElement, !0);
  Array.from(document.querySelectorAll(An().join(","))).filter(t).forEach((e) => {
    q(e);
  }), lt(document, "alpine:initialized"), setTimeout(() => {
    es();
  });
}
var Oe = [], On = [];
function kn() {
  return Oe.map((t) => t());
}
function An() {
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
    if ((e ? An() : kn()).some((i) => n.matches(i)))
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
function Gi(t) {
  return kn().some((e) => t.matches(e));
}
var Cn = [];
function Xi(t) {
  Cn.push(t);
}
var ts = 1;
function q(t, e = K, n = () => {
}) {
  R(t, (s) => s._x_ignore) || Vi(() => {
    e(t, (s, i) => {
      s._x_marker || (n(s, i), Cn.forEach((r) => r(s, i)), Se(s, s.attributes).forEach((r) => r()), s._x_ignore || (s._x_marker = ts++), s._x_ignore && i());
    });
  });
}
function Y(t, e = K) {
  e(t, (n) => {
    ki(n), an(n), delete n._x_marker;
  });
}
function es() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, n, s]) => {
    zi(n) || s.some((i) => {
      if (document.querySelector(i))
        return A(`found "${i}", but missing ${e} plugin`), !0;
    });
  });
}
var ie = [], ke = !1;
function Ae(t = () => {
}) {
  return queueMicrotask(() => {
    ke || setTimeout(() => {
      se();
    });
  }), new Promise((e) => {
    ie.push(() => {
      t(), e();
    });
  });
}
function se() {
  for (ke = !1; ie.length; )
    ie.shift()();
}
function ns() {
  ke = !0;
}
function Me(t, e) {
  return Array.isArray(e) ? Be(t, e.join(" ")) : typeof e == "object" && e !== null ? is(t, e) : typeof e == "function" ? Me(t, e()) : Be(t, e);
}
function re(t) {
  return t.split(/\s/).filter(Boolean);
}
function Be(t, e) {
  let n = (i) => re(i).filter((r) => !t.classList.contains(r)).filter(Boolean), s = (i) => (t.classList.add(...i), () => {
    t.classList.remove(...i);
  });
  return e = e === !0 ? e = "" : e || "", s(n(e));
}
function is(t, e) {
  let n = Object.entries(e).flatMap(([a, o]) => o ? re(a) : !1).filter(Boolean), s = Object.entries(e).flatMap(([a, o]) => o ? !1 : re(a)).filter(Boolean), i = [], r = [];
  return s.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), r.push(a));
  }), n.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), i.push(a));
  }), () => {
    r.forEach((a) => t.classList.add(a)), i.forEach((a) => t.classList.remove(a));
  };
}
function Ft(t, e) {
  return typeof e == "object" && e !== null ? ss(t, e) : rs(t, e);
}
function ss(t, e) {
  let n = {};
  return Object.entries(e).forEach(([s, i]) => {
    n[s] = t.style[s], s.startsWith("--") || (s = as(s)), t.style.setProperty(s, i);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    Ft(t, n);
  };
}
function rs(t, e) {
  let n = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", n || "");
  };
}
function as(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ae(t, e = () => {
}) {
  let n = !1;
  return function() {
    n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments));
  };
}
g("transition", (t, { value: e, modifiers: n, expression: s }, { evaluate: i }) => {
  typeof s == "function" && (s = i(s)), s !== !1 && (!s || typeof s == "boolean" ? ds(t, n, e) : os(t, s, e));
});
function os(t, e, n) {
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
function ds(t, e, n) {
  Pn(t, Ft);
  let s = !e.includes("in") && !e.includes("out") && !n, i = s || e.includes("in") || ["enter"].includes(n), r = s || e.includes("out") || ["leave"].includes(n);
  e.includes("in") && !s && (e = e.filter((y, Z) => Z < e.indexOf("out"))), e.includes("out") && !s && (e = e.filter((y, Z) => Z > e.indexOf("out")));
  let a = !e.includes("opacity") && !e.includes("scale"), o = a || e.includes("opacity"), d = a || e.includes("scale"), c = o ? 0 : 1, l = d ? at(e, "scale", 95) / 100 : 1, u = at(e, "delay", 0) / 1e3, b = at(e, "origin", "center"), _ = "opacity, transform", M = at(e, "duration", 150) / 1e3, f = at(e, "duration", 75) / 1e3, v = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  i && (t._x_transition.enter.during = {
    transformOrigin: b,
    transitionDelay: `${u}s`,
    transitionProperty: _,
    transitionDuration: `${M}s`,
    transitionTimingFunction: v
  }, t._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${l})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), r && (t._x_transition.leave.during = {
    transformOrigin: b,
    transitionDelay: `${u}s`,
    transitionProperty: _,
    transitionDuration: `${f}s`,
    transitionTimingFunction: v
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
    in(s = () => {
    }, i = () => {
    }) {
      oe(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, s, i);
    },
    out(s = () => {
    }, i = () => {
    }) {
      oe(t, e, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, s, i);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(t, e, n, s) {
  const i = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let r = () => i(n);
  if (e) {
    t._x_transition && (t._x_transition.enter || t._x_transition.leave) ? t._x_transition.enter && (Object.entries(t._x_transition.enter.during).length || Object.entries(t._x_transition.enter.start).length || Object.entries(t._x_transition.enter.end).length) ? t._x_transition.in(n) : r() : t._x_transition ? t._x_transition.in(n) : r();
    return;
  }
  t._x_hidePromise = t._x_transition ? new Promise((a, o) => {
    t._x_transition.out(() => {
    }, () => a(s)), t._x_transitioning && t._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(s), queueMicrotask(() => {
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
function oe(t, e, { during: n, start: s, end: i } = {}, r = () => {
}, a = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(s).length === 0 && Object.keys(i).length === 0) {
    r(), a();
    return;
  }
  let o, d, c;
  cs(t, {
    start() {
      o = e(t, s);
    },
    during() {
      d = e(t, n);
    },
    before: r,
    end() {
      o(), c = e(t, i);
    },
    after: a,
    cleanup() {
      d(), c();
    }
  });
}
function cs(t, e) {
  let n, s, i, r = ae(() => {
    m(() => {
      n = !0, s || e.before(), i || (e.end(), se()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
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
      r();
    }),
    finish: r
  }, m(() => {
    e.start(), e.during();
  }), ns(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), m(() => {
      e.before();
    }), s = !0, requestAnimationFrame(() => {
      n || (m(() => {
        e.end();
      }), se(), setTimeout(t._x_transitioning.finish, a + o), i = !0);
    });
  });
}
function at(t, e, n) {
  if (t.indexOf(e) === -1)
    return n;
  const s = t[t.indexOf(e) + 1];
  if (!s || e === "scale" && isNaN(s))
    return n;
  if (e === "duration" || e === "delay") {
    let i = s.match(/([0-9]+)ms/);
    if (i)
      return i[1];
  }
  return e === "origin" && ["top", "right", "left", "center", "bottom"].includes(t[t.indexOf(e) + 2]) ? [s, t[t.indexOf(e) + 2]].join(" ") : s;
}
var $ = !1;
function D(t, e = () => {
}) {
  return (...n) => $ ? e(...n) : t(...n);
}
function ls(t) {
  return (...e) => $ && t(...e);
}
var qn = [];
function Nt(t) {
  qn.push(t);
}
function us(t, e) {
  qn.forEach((n) => n(t, e)), $ = !0, In(() => {
    q(e, (n, s) => {
      s(n, () => {
      });
    });
  }), $ = !1;
}
var de = !1;
function fs(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), $ = !0, de = !0, In(() => {
    ps(e);
  }), $ = !1, de = !1;
}
function ps(t) {
  let e = !1;
  q(t, (s, i) => {
    K(s, (r, a) => {
      if (e && Gi(r))
        return a();
      e = !0, i(r, a);
    });
  });
}
function In(t) {
  let e = Q;
  Le((n, s) => {
    let i = e(n);
    return nt(i), () => {
    };
  }), t(), Le(e);
}
function $n(t, e, n, s = []) {
  switch (t._x_bindings || (t._x_bindings = et({})), t._x_bindings[e] = n, e = s.includes("camel") ? xs(e) : e, e) {
    case "value":
      hs(t, n);
      break;
    case "style":
      _s(t, n);
      break;
    case "class":
      bs(t, n);
      break;
    case "selected":
    case "checked":
      ms(t, e, n);
      break;
    default:
      Te(t, e, n);
      break;
  }
}
function hs(t, e) {
  if (Ce(t))
    t.attributes.value === void 0 && (t.value = e);
  else if (Rt(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((n) => ws(n, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    ys(t, e);
  else if (t.tagName === "OPTION")
    Te(t, "value", e);
  else {
    if (t.value === e && (typeof e != "object" || e === null))
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function bs(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = Me(t, e);
}
function _s(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = Ft(t, e);
}
function ms(t, e, n) {
  Te(t, e, n), vs(t, e, n);
}
function Te(t, e, n) {
  [null, void 0, !1].includes(n) && Es(e) ? t.removeAttribute(e) : (Dn(e) && (n = e), Os(n) && (n = JSON.stringify(n)), gs(t, e, n));
}
function gs(t, e, n) {
  t.getAttribute(e) != n && t.setAttribute(e, n);
}
function vs(t, e, n) {
  t[e] !== n && (t[e] = n);
}
function ys(t, e) {
  const n = [].concat(e).map((s) => s + "");
  Array.from(t.options).forEach((s) => {
    s.selected = n.includes(s.value);
  });
}
function xs(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function ws(t, e) {
  return t == e;
}
function Mt(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var Ss = /* @__PURE__ */ new Set([
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
  return Ss.has(t);
}
function Es(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function Os(t) {
  return typeof t == "object" && t !== null;
}
function ks(t, e, n) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : Fn(t, e, n);
}
function As(t, e, n, s = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let i = t._x_inlineBindings[e];
    return i.extract = s, pn(() => j(t, i.expression));
  }
  return Fn(t, e, n);
}
function Fn(t, e, n) {
  let s = t.getAttribute(e);
  return s === null ? typeof n == "function" ? n() : n : s === "" ? !0 : Dn(e) ? !![e, "true"].includes(s) : s;
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
    const s = this, i = arguments, r = function() {
      n = null, t.apply(s, i);
    };
    clearTimeout(n), n = setTimeout(r, e);
  };
}
function Ln(t, e) {
  let n;
  return function() {
    let s = this, i = arguments;
    n || (t.apply(s, i), n = !0, setTimeout(() => n = !1, e));
  };
}
function jn({ get: t, set: e }, { get: n, set: s }) {
  let i = !0, r, a = Q(() => {
    let o = t(), d = n();
    if (i)
      s(Ht(o)), i = !1;
    else {
      let c = JSON.stringify(o), l = JSON.stringify(d);
      c !== r ? s(Ht(o)) : c !== l && e(Ht(d));
    }
    r = JSON.stringify(t()), JSON.stringify(n());
  });
  return () => {
    nt(a);
  };
}
function Ht(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function Ms(t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => n(st));
}
var C = {}, He = !1;
function Ts(t, e) {
  if (He || (C = et(C), He = !0), e === void 0)
    return C[t];
  C[t] = e, typeof e == "object" && e !== null && e._x_interceptor ? C[t] = e.initialize(C, t, t, () => {
  }) : xe(C[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && C[t].init();
}
function Cs() {
  return C;
}
var Bn = {};
function Ps(t, e) {
  let n = typeof e != "function" ? () => e : e;
  return t instanceof Element ? Hn(t, n()) : (Bn[t] = n, () => {
  });
}
function Rs(t) {
  return Object.entries(Bn).forEach(([e, n]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...s) => n(...s);
      }
    });
  }), t;
}
function Hn(t, e, n) {
  let s = [];
  for (; s.length; )
    s.pop()();
  let i = Object.entries(e).map(([a, o]) => ({ name: a, value: o })), r = _n(i);
  return i = i.map((a) => r.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), Se(t, i, n).map((a) => {
    s.push(a.runCleanups), a();
  }), () => {
    for (; s.length; )
      s.pop()();
  };
}
var Wn = {};
function qs(t, e) {
  Wn[t] = e;
}
function Is(t, e) {
  return Object.entries(Wn).forEach(([n, s]) => {
    Object.defineProperty(t, n, {
      get() {
        return (...i) => s.bind(e)(...i);
      },
      enumerable: !1
    });
  }), t;
}
var $s = {
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
    return Ge;
  },
  get transaction() {
    return Ei;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Ti,
  dontAutoEvaluateFunctions: pn,
  disableEffectScheduling: xi,
  startObservingMutations: ge,
  stopObservingMutations: on,
  setReactivityEngine: wi,
  onAttributeRemoved: rn,
  onAttributesAdded: sn,
  closestDataStack: H,
  skipDuringClone: D,
  onlyDuringClone: ls,
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
  injectMagics: bt,
  setEvaluator: Fi,
  setRawEvaluator: Ni,
  mergeProxies: W,
  extractProp: As,
  findClosest: R,
  onElRemoved: be,
  closestRoot: Dt,
  destroyTree: Y,
  interceptor: ln,
  // INTERNAL: not public API and is subject to change without major release.
  transition: oe,
  // INTERNAL
  setStyles: Ft,
  // INTERNAL
  mutateDom: m,
  directive: g,
  entangle: jn,
  throttle: Ln,
  debounce: Nn,
  evaluate: j,
  evaluateRaw: Wi,
  initTree: q,
  nextTick: Ae,
  prefixed: it,
  prefix: Ui,
  plugin: Ms,
  magic: O,
  store: Ts,
  start: Zi,
  clone: fs,
  // INTERNAL
  cloneNode: us,
  // INTERNAL
  bound: ks,
  $data: dn,
  watch: Xe,
  walk: K,
  data: qs,
  bind: Ps
}, st = $s;
function Ds(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(","))
    e[n] = 1;
  return (n) => n in e;
}
var gt = Object.assign, Fs = Object.prototype.hasOwnProperty, ce = (t, e) => Fs.call(t, e), vt = Array.isArray, ut = (t) => Kn(t) === "[object Map]", Ns = (t) => typeof t == "string", Et = (t) => typeof t == "symbol", yt = (t) => t !== null && typeof t == "object", Ls = Object.prototype.toString, Kn = (t) => Ls.call(t), Un = (t) => Kn(t).slice(8, -1), Pe = (t) => Ns(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, js = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, Bs = js((t) => t.charAt(0).toUpperCase() + t.slice(1)), N = (t, e) => !Object.is(t, e);
function U(t, ...e) {
  console.warn(`[Vue warn] ${t}`, ...e);
}
var p, Wt = /* @__PURE__ */ new WeakSet(), We = class {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Wt.has(this) && (Wt.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Hs(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ke(this), Vn(this);
    const t = p, e = E;
    p = this, E = !0;
    try {
      return this.fn();
    } finally {
      p !== this && U(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Jn(this), p = t, E = e, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Ie(t);
      this.deps = this.depsTail = void 0, Ke(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Wt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
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
function Hs(t, e = !1) {
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
        } catch (s) {
          t || (t = s);
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
  let e, n = t.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), Ie(s), Ks(s)) : e = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  t.deps = e, t.depsTail = n;
}
function le(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (Ws(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function Ws(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === qt) || (t.globalVersion = qt, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !le(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = p, s = E;
  p = t, E = !0;
  try {
    Vn(t);
    const i = t.fn(t._value);
    (e.version === 0 || N(i, t._value)) && (t.flags |= 128, t._value = i, e.version++);
  } catch (i) {
    throw e.version++, i;
  } finally {
    p = n, E = s, Jn(t), t.flags &= -3;
  }
}
function Ie(t, e = !1) {
  const { dep: n, prevSub: s, nextSub: i } = t;
  if (s && (s.nextSub = i, t.prevSub = void 0), i && (i.prevSub = s, t.nextSub = void 0), n.subsHead === t && (n.subsHead = i), n.subs === t && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Ie(r, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Ks(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
function Us(t, e) {
  t.effect instanceof We && (t = t.effect.fn);
  const n = new We(t);
  e && gt(n, e);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const s = n.run.bind(n);
  return s.effect = n, s;
}
function zs(t) {
  t.effect.stop();
}
var E = !0, Qn = [];
function Vs() {
  Qn.push(E), E = !1;
}
function Js() {
  const t = Qn.pop();
  E = t === void 0 ? !0 : t;
}
function Ke(t) {
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
var qt = 0, Qs = class {
  constructor(t, e) {
    this.sub = t, this.dep = e, this.version = e.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, Ys = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!p || !E || p === this.computed)
      return;
    let e = this.activeLink;
    if (e === void 0 || e.sub !== p)
      e = this.activeLink = new Qs(p, this), p.deps ? (e.prevDep = p.depsTail, p.depsTail.nextDep = e, p.depsTail = e) : p.deps = p.depsTail = e, Yn(e);
    else if (e.version === -1 && (e.version = this.version, e.nextDep)) {
      const n = e.nextDep;
      n.prevDep = e.prevDep, e.prevDep && (e.prevDep.nextDep = n), e.prevDep = p.depsTail, e.nextDep = void 0, p.depsTail.nextDep = e, p.depsTail = e, p.deps === e && (p.deps = n);
    }
    return p.onTrack && p.onTrack(
      gt(
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
          gt(
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
      for (let s = e.deps; s; s = s.nextDep)
        Yn(s);
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
function S(t, e, n) {
  if (E && p) {
    let s = ue.get(t);
    s || ue.set(t, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new Ys()), i.map = s, i.key = n), i.track({
      target: t,
      type: e,
      key: n
    });
  }
}
function I(t, e, n, s, i, r) {
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
      newValue: s,
      oldValue: i,
      oldTarget: r
    });
  };
  if (Re(), e === "clear")
    a.forEach(o);
  else {
    const d = vt(t), c = d && Pe(n);
    if (d && n === "length") {
      const l = Number(s);
      a.forEach((u, b) => {
        (b === "length" || b === xt || !Et(b) && b >= l) && o(u);
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
function G(t) {
  const e = h(t);
  return e === t ? e : (S(e, "iterate", xt), V(t) ? e : e.map(J));
}
function $e(t) {
  return S(t = h(t), "iterate", xt), t;
}
function k(t, e) {
  return z(t) ? ii(t) ? wt(J(e)) : wt(e) : J(e);
}
var Zs = {
  __proto__: null,
  [Symbol.iterator]() {
    return Kt(this, Symbol.iterator, (t) => k(this, t));
  },
  concat(...t) {
    return G(this).concat(
      ...t.map((e) => vt(e) ? G(e) : e)
    );
  },
  entries() {
    return Kt(this, "entries", (t) => (t[1] = k(this, t[1]), t));
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
      (n) => n.map((s) => k(this, s)),
      arguments
    );
  },
  find(t, e) {
    return T(
      this,
      "find",
      t,
      e,
      (n) => k(this, n),
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
      (n) => k(this, n),
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
    return Ut(this, "includes", t);
  },
  indexOf(...t) {
    return Ut(this, "indexOf", t);
  },
  join(t) {
    return G(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Ut(this, "lastIndexOf", t);
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
    return Ue(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Ue(this, "reduceRight", t, e);
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
    return G(this).toReversed();
  },
  toSorted(t) {
    return G(this).toSorted(t);
  },
  toSpliced(...t) {
    return G(this).toSpliced(...t);
  },
  unshift(...t) {
    return ot(this, "unshift", t);
  },
  values() {
    return Kt(this, "values", (t) => k(this, t));
  }
};
function Kt(t, e, n) {
  const s = $e(t), i = s[e]();
  return s !== t && !V(t) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.done || (r.value = n(r.value)), r;
  }), i;
}
var Gs = Array.prototype;
function T(t, e, n, s, i, r) {
  const a = $e(t), o = a !== t && !V(t), d = a[e];
  if (d !== Gs[e]) {
    const u = d.apply(t, r);
    return o ? J(u) : u;
  }
  let c = n;
  a !== t && (o ? c = function(u, b) {
    return n.call(this, k(t, u), b, t);
  } : n.length > 2 && (c = function(u, b) {
    return n.call(this, u, b, t);
  }));
  const l = d.call(a, c, s);
  return o && i ? i(l) : l;
}
function Ue(t, e, n, s) {
  const i = $e(t), r = i !== t && !V(t);
  let a = n, o = !1;
  i !== t && (r ? (o = s.length === 0, a = function(c, l, u) {
    return o && (o = !1, c = k(t, c)), n.call(this, c, k(t, l), u, t);
  }) : n.length > 3 && (a = function(c, l, u) {
    return n.call(this, c, l, u, t);
  }));
  const d = i[e](a, ...s);
  return o ? k(t, d) : d;
}
function Ut(t, e, n) {
  const s = h(t);
  S(s, "iterate", xt);
  const i = s[e](...n);
  return (i === -1 || i === !1) && fr(n[0]) ? (n[0] = h(n[0]), s[e](...n)) : i;
}
function ot(t, e, n = []) {
  Vs(), Re();
  const s = h(t)[e].apply(t, n);
  return qe(), Js(), s;
}
var Xs = /* @__PURE__ */ Ds("__proto__,__v_isRef,__isVue"), Zn = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(Et)
);
function tr(t) {
  Et(t) || (t = String(t));
  const e = h(this);
  return S(e, "has", t), e.hasOwnProperty(t);
}
var Gn = class {
  constructor(t = !1, e = !1) {
    this._isReadonly = t, this._isShallow = e;
  }
  get(t, e, n) {
    if (e === "__v_skip")
      return t.__v_skip;
    const s = this._isReadonly, i = this._isShallow;
    if (e === "__v_isReactive")
      return !s;
    if (e === "__v_isReadonly")
      return s;
    if (e === "__v_isShallow")
      return i;
    if (e === "__v_raw")
      return n === (s ? i ? lr : ei : i ? cr : ti).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const r = vt(t);
    if (!s) {
      let o;
      if (r && (o = Zs[e]))
        return o;
      if (e === "hasOwnProperty")
        return tr;
    }
    const a = Reflect.get(
      t,
      e,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      ht(t) ? t : n
    );
    if ((Et(e) ? Zn.has(e) : Xs(e)) || (s || S(t, "get", e), i))
      return a;
    if (ht(a)) {
      const o = r && Pe(e) ? a : a.value;
      return s && yt(o) ? pe(o) : o;
    }
    return yt(a) ? s ? pe(a) : De(a) : a;
  }
}, er = class extends Gn {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, e, n, s) {
    let i = t[e];
    const r = vt(t) && Pe(e);
    if (!this._isShallow) {
      const d = z(i);
      if (!V(n) && !z(n) && (i = h(i), n = h(n)), !r && ht(i) && !ht(n))
        return d ? (U(
          `Set operation on key "${String(e)}" failed: target is readonly.`,
          t[e]
        ), !0) : (i.value = n, !0);
    }
    const a = r ? Number(e) < t.length : ce(t, e), o = Reflect.set(
      t,
      e,
      n,
      ht(t) ? t : s
    );
    return t === h(s) && o && (a ? N(n, i) && I(t, "set", e, n, i) : I(t, "add", e, n)), o;
  }
  deleteProperty(t, e) {
    const n = ce(t, e), s = t[e], i = Reflect.deleteProperty(t, e);
    return i && n && I(t, "delete", e, void 0, s), i;
  }
  has(t, e) {
    const n = Reflect.has(t, e);
    return (!Et(e) || !Zn.has(e)) && S(t, "has", e), n;
  }
  ownKeys(t) {
    return S(
      t,
      "iterate",
      vt(t) ? "length" : B
    ), Reflect.ownKeys(t);
  }
}, nr = class extends Gn {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, e) {
    return U(
      `Set operation on key "${String(e)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, e) {
    return U(
      `Delete operation on key "${String(e)}" failed: target is readonly.`,
      t
    ), !0;
  }
}, ir = /* @__PURE__ */ new er(), sr = /* @__PURE__ */ new nr(), Ot = (t) => Reflect.getPrototypeOf(t);
function rr(t, e, n) {
  return function(...s) {
    const i = this.__v_raw, r = h(i), a = ut(r), o = t === "entries" || t === Symbol.iterator && a, d = t === "keys" && a, c = i[t](...s), l = e ? wt : J;
    return !e && S(
      r,
      "iterate",
      d ? fe : B
    ), gt(
      // inheriting all iterator properties
      Object.create(c),
      {
        // iterator protocol
        next() {
          const { value: u, done: b } = c.next();
          return b ? { value: u, done: b } : {
            value: o ? [l(u[0]), l(u[1])] : l(u),
            done: b
          };
        }
      }
    );
  };
}
function kt(t) {
  return function(...e) {
    {
      const n = e[0] ? `on key "${e[0]}" ` : "";
      U(
        `${Bs(t)} operation ${n}failed: target is readonly.`,
        h(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function ar(t, e) {
  const n = {
    get(i) {
      const r = this.__v_raw, a = h(r), o = h(i);
      t || (N(i, o) && S(a, "get", i), S(a, "get", o));
      const { has: d } = Ot(a), c = t ? wt : J;
      if (d.call(a, i))
        return c(r.get(i));
      if (d.call(a, o))
        return c(r.get(o));
      r !== a && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !t && S(h(i), "iterate", B), i.size;
    },
    has(i) {
      const r = this.__v_raw, a = h(r), o = h(i);
      return t || (N(i, o) && S(a, "has", i), S(a, "has", o)), i === o ? r.has(i) : r.has(i) || r.has(o);
    },
    forEach(i, r) {
      const a = this, o = a.__v_raw, d = h(o), c = t ? wt : J;
      return !t && S(d, "iterate", B), o.forEach((l, u) => i.call(r, c(l), c(u), a));
    }
  };
  return gt(
    n,
    t ? {
      add: kt("add"),
      set: kt("set"),
      delete: kt("delete"),
      clear: kt("clear")
    } : {
      add(i) {
        const r = h(this), a = Ot(r), o = h(i), d = !V(i) && !z(i) ? o : i;
        return a.has.call(r, d) || N(i, d) && a.has.call(r, i) || N(o, d) && a.has.call(r, o) || (r.add(d), I(r, "add", d, d)), this;
      },
      set(i, r) {
        !V(r) && !z(r) && (r = h(r));
        const a = h(this), { has: o, get: d } = Ot(a);
        let c = o.call(a, i);
        c ? ze(a, o, i) : (i = h(i), c = o.call(a, i));
        const l = d.call(a, i);
        return a.set(i, r), c ? N(r, l) && I(a, "set", i, r, l) : I(a, "add", i, r), this;
      },
      delete(i) {
        const r = h(this), { has: a, get: o } = Ot(r);
        let d = a.call(r, i);
        d ? ze(r, a, i) : (i = h(i), d = a.call(r, i));
        const c = o ? o.call(r, i) : void 0, l = r.delete(i);
        return d && I(r, "delete", i, void 0, c), l;
      },
      clear() {
        const i = h(this), r = i.size !== 0, a = ut(i) ? new Map(i) : new Set(i), o = i.clear();
        return r && I(
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
    n[i] = rr(i, t);
  }), n;
}
function Xn(t, e) {
  const n = ar(t);
  return (s, i, r) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? s : Reflect.get(
    ce(n, i) && i in s ? n : s,
    i,
    r
  );
}
var or = {
  get: /* @__PURE__ */ Xn(!1)
}, dr = {
  get: /* @__PURE__ */ Xn(!0)
};
function ze(t, e, n) {
  const s = h(n);
  if (s !== n && e.call(t, s)) {
    const i = Un(t);
    U(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var ti = /* @__PURE__ */ new WeakMap(), cr = /* @__PURE__ */ new WeakMap(), ei = /* @__PURE__ */ new WeakMap(), lr = /* @__PURE__ */ new WeakMap();
function ur(t) {
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
    ir,
    or,
    ti
  );
}
function pe(t) {
  return ni(
    t,
    !0,
    sr,
    dr,
    ei
  );
}
function ni(t, e, n, s, i) {
  if (!yt(t))
    return U(
      `value cannot be made ${e ? "readonly" : "reactive"}: ${String(
        t
      )}`
    ), t;
  if (t.__v_raw && !(e && t.__v_isReactive) || t.__v_skip || !Object.isExtensible(t))
    return t;
  const r = i.get(t);
  if (r)
    return r;
  const a = ur(Un(t));
  if (a === 0)
    return t;
  const o = new Proxy(
    t,
    a === 2 ? s : n
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
function fr(t) {
  return t ? !!t.__v_raw : !1;
}
function h(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ h(e) : t;
}
var J = (t) => yt(t) ? /* @__PURE__ */ De(t) : t, wt = (t) => yt(t) ? /* @__PURE__ */ pe(t) : t;
function ht(t) {
  return t ? t.__v_isRef === !0 : !1;
}
O("nextTick", () => Ae);
O("dispatch", (t) => lt.bind(lt, t));
O("watch", (t, { evaluateLater: e, cleanup: n }) => (s, i) => {
  let r = e(s), o = Xe(() => {
    let d;
    return r((c) => d = c), d;
  }, i);
  n(o);
});
O("store", Cs);
O("data", (t) => dn(t));
O("root", (t) => Dt(t));
O("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = W(pr(t))), t._x_refs_proxy));
function pr(t) {
  let e = [];
  return R(t, (n) => {
    n._x_refs && e.push(n._x_refs);
  }), e;
}
var zt = {};
function si(t) {
  return zt[t] || (zt[t] = 0), ++zt[t];
}
function hr(t, e) {
  return R(t, (n) => {
    if (n._x_ids && n._x_ids[e])
      return !0;
  });
}
function br(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = si(e));
}
O("id", (t, { cleanup: e }) => (n, s = null) => {
  let i = `${n}${s ? `-${s}` : ""}`;
  return _r(t, i, e, () => {
    let r = hr(t, n), a = r ? r._x_ids[n] : si(n);
    return s ? `${n}-${a}-${s}` : `${n}-${a}`;
  });
});
Nt((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function _r(t, e, n, s) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let i = s();
  return t._x_id[e] = i, n(() => {
    delete t._x_id[e];
  }), i;
}
O("el", (t) => t);
ri("Focus", "focus", "focus");
ri("Persist", "persist", "persist");
function ri(t, e, n) {
  O(e, (s) => A(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, s));
}
g("modelable", (t, { expression: e }, { effect: n, evaluateLater: s, cleanup: i }) => {
  let r = s(e), a = () => {
    let l;
    return r((u) => l = u), l;
  }, o = s(`${e} = __placeholder`), d = (l) => o(() => {
  }, { scope: { __placeholder: l } }), c = a();
  d(c), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let l = t._x_model.get, u = t._x_model.setWithModifiers, b = jn(
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
    i(b);
  });
});
g("teleport", (t, { modifiers: e, expression: n }, { cleanup: s }) => {
  t.tagName.toLowerCase() !== "template" && A("x-teleport can only be used on a <template> tag", t);
  let i = Ve(n), r = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = r, r._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((o) => {
    r.addEventListener(o, (d) => {
      d.stopPropagation(), t.dispatchEvent(new d.constructor(d.type, d));
    });
  }), St(r, {}, t);
  let a = (o, d, c) => {
    c.includes("prepend") ? d.parentNode.insertBefore(o, d) : c.includes("append") ? d.parentNode.insertBefore(o, d.nextSibling) : d.appendChild(o);
  };
  m(() => {
    D(() => {
      a(r, i, e), q(r);
    })();
  }), t._x_teleportPutBack = () => {
    let o = Ve(n);
    m(() => {
      a(t._x_teleport, o, e);
    });
  }, s(
    () => m(() => {
      r.remove(), Y(r);
    })
  );
});
var mr = document.createElement("div");
function Ve(t) {
  let e = D(() => document.querySelector(t), () => mr)();
  return e || A(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var ai = () => {
};
ai.inline = (t, { modifiers: e }, { cleanup: n }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
g("ignore", ai);
g("effect", D((t, { expression: e }, { effect: n }) => {
  n(x(t, e));
}));
function X(t, e, n, s) {
  let i = t, r = (d) => s(d), a = {}, o = (d, c) => (l) => c(d, l);
  return n.includes("dot") && (e = gr(e)), n.includes("camel") && (e = vr(e)), n.includes("capture") && (a.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("passive") && (a.passive = n[n.indexOf("passive") + 1] !== "false"), r = oi(n, r), n.includes("prevent") && (r = o(r, (d, c) => {
    c.preventDefault(), d(c);
  })), n.includes("stop") && (r = o(r, (d, c) => {
    c.stopPropagation(), d(c);
  })), n.includes("once") && (r = o(r, (d, c) => {
    d(c), i.removeEventListener(e, r, a);
  })), (n.includes("away") || n.includes("outside")) && (i = document, r = o(r, (d, c) => {
    t.contains(c.target) || c.target.isConnected !== !1 && (t.offsetWidth < 1 && t.offsetHeight < 1 || t._x_isShown !== !1 && d(c));
  })), n.includes("self") && (r = o(r, (d, c) => {
    c.target === t && d(c);
  })), e === "submit" && (r = o(r, (d, c) => {
    c.target._x_pendingModelUpdates && c.target._x_pendingModelUpdates.forEach((l) => l()), d(c);
  })), (xr(e) || di(e)) && (r = o(r, (d, c) => {
    wr(c, n) || d(c);
  })), i.addEventListener(e, r, a), () => {
    i.removeEventListener(e, r, a);
  };
}
function oi(t, e) {
  if (t.includes("debounce")) {
    let n = t[t.indexOf("debounce") + 1] || "invalid-wait", s = It(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = Nn(e, s);
  }
  if (t.includes("throttle")) {
    let n = t[t.indexOf("throttle") + 1] || "invalid-wait", s = It(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = Ln(e, s);
  }
  return e;
}
function gr(t) {
  return t.replace(/-/g, ".");
}
function vr(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function It(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function yr(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function xr(t) {
  return ["keydown", "keyup"].includes(t);
}
function di(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function wr(t, e) {
  let n = e.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(r));
  if (n.includes("debounce")) {
    let r = n.indexOf("debounce");
    n.splice(r, It((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let r = n.indexOf("throttle");
    n.splice(r, It((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Je(t.key).includes(n[0]))
    return !1;
  const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => n.includes(r));
  return n = n.filter((r) => !i.includes(r)), !(i.length > 0 && i.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), t[`${a}Key`])).length === i.length && (di(t.type) || Je(t.key).includes(n[0])));
}
function Je(t) {
  if (!t)
    return [];
  t = yr(t);
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
g("model", (t, { modifiers: e, expression: n }, { effect: s, cleanup: i }) => {
  let r = t;
  e.includes("parent") && (r = R(t, (f) => f !== t));
  let a = x(r, n), o;
  typeof n == "string" ? o = x(r, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = x(r, `${n()} = __placeholder`) : o = () => {
  };
  let d = () => {
    let f;
    return a((v) => f = v), Qe(f) ? f.get() : f;
  }, c = (f) => {
    let v;
    a((y) => v = y), Qe(v) ? v.set(f) : o(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && t.type === "radio" && m(() => {
    t.hasAttribute("name") || t.setAttribute("name", n);
  });
  let l = e.includes("change") || e.includes("lazy"), u = e.includes("blur"), b = e.includes("enter"), _ = l || u || b, M;
  if ($)
    M = () => {
    };
  else if (_) {
    let f = [], v = (y) => c(At(t, e, y, d()));
    if (l && f.push(X(t, "change", e, v)), u && (f.push(X(t, "blur", e, v)), t.form)) {
      let y = t.form, Z = () => v({ target: t });
      y._x_pendingModelUpdates || (y._x_pendingModelUpdates = []), y._x_pendingModelUpdates.push(Z), i(() => {
        y._x_pendingModelUpdates && y._x_pendingModelUpdates.splice(y._x_pendingModelUpdates.indexOf(Z), 1);
      });
    }
    b && f.push(X(t, "keydown", e, (y) => {
      y.key === "Enter" && v(y);
    })), M = () => f.forEach((y) => y());
  } else {
    let f = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) ? "change" : "input";
    M = X(t, f, e, (v) => {
      c(At(t, e, v, d()));
    });
  }
  if (e.includes("fill") && ([void 0, null, ""].includes(d()) || Rt(t) && Array.isArray(d()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    At(t, e, { target: t }, d())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = M, i(() => t._x_removeModelListeners.default()), t.form) {
    let f = X(t.form, "reset", [], (v) => {
      Ae(() => t._x_model && t._x_model.set(At(t, e, { target: t }, d())));
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
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), m(() => {
      Rt(t) ? Array.isArray(f) ? t.checked = f.some((v) => v == t.value) : t.checked = !!f : Ce(t) ? typeof f == "boolean" ? t.checked = Mt(t.value) === f : t.checked = t.value == f : $n(t, "value", f);
    });
  }, t.tagName === "SELECT") {
    let f = new MutationObserver(() => {
      t._x_forceModelUpdate(d());
    });
    f.observe(t, { childList: !0 }), i(() => f.disconnect());
  }
  s(() => {
    let f = d();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function At(t, e, n, s) {
  return m(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Rt(t))
      if (Array.isArray(s)) {
        let i = null;
        return e.includes("number") ? i = Vt(n.target.value) : e.includes("boolean") ? i = Mt(n.target.value) : i = n.target.value, n.target.checked ? s.includes(i) ? s : s.concat([i]) : s.filter((r) => !Sr(r, i));
      } else
        return n.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(n.target.selectedOptions).map((i) => {
          let r = i.value || i.text;
          return Vt(r);
        }) : e.includes("boolean") ? Array.from(n.target.selectedOptions).map((i) => {
          let r = i.value || i.text;
          return Mt(r);
        }) : Array.from(n.target.selectedOptions).map((i) => i.value || i.text);
      {
        let i;
        return Ce(t) ? n.target.checked ? i = n.target.value : i = s : i = n.target.value, e.includes("number") ? Vt(i) : e.includes("boolean") ? Mt(i) : e.includes("trim") ? i.trim() : i;
      }
    }
  });
}
function Vt(t) {
  let e = t ? parseFloat(t) : null;
  return Er(e) ? e : t;
}
function Sr(t, e) {
  return t == e;
}
function Er(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Qe(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
g("cloak", (t) => queueMicrotask(() => m(() => t.removeAttribute(it("cloak")))));
Tn(() => `[${it("init")}]`);
g("init", D((t, { expression: e }, { evaluate: n }) => typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)));
g("text", (t, { expression: e }, { effect: n, evaluateLater: s }) => {
  let i = s(e);
  n(() => {
    i((r) => {
      m(() => {
        t.textContent = r;
      });
    });
  });
});
g("html", (t, { expression: e }, { effect: n, evaluateLater: s }) => {
  let i = s(e);
  n(() => {
    i((r) => {
      m(() => {
        Array.from(t.children).forEach((a) => Y(a)), t.innerHTML = r ?? "", t._x_ignoreSelf = !0, q(t), delete t._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
Ee(vn(":", yn(it("bind:"))));
var ci = (t, { value: e, modifiers: n, expression: s, original: i }, { effect: r, cleanup: a }) => {
  if (!e) {
    let d = {};
    Rs(d), x(t, s)((l) => {
      Hn(t, l, i);
    }, { scope: d });
    return;
  }
  if (e === "key")
    return Or(t, s);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let o = x(t, s);
  r(() => o((d) => {
    d === void 0 && typeof s == "string" && s.match(/\./) && (d = ""), m(() => $n(t, e, d, n));
  })), a(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
ci.inline = (t, { value: e, modifiers: n, expression: s }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: s, extract: !1 });
};
g("bind", ci);
function Or(t, e) {
  t._x_keyExpression = e;
}
Mn(() => `[${it("data")}]`);
var F = /* @__PURE__ */ Symbol();
g("data", (t, { expression: e }, { cleanup: n }) => {
  if (Ar(t))
    return;
  let s = t[F];
  if (s?.expression === e)
    return;
  e = e === "" ? "{}" : e;
  let i = {};
  bt(i, t);
  let r = {};
  Is(r, i);
  let a = j(t, e, { scope: r });
  (a === void 0 || a === !0) && (a = {}), bt(a, t);
  let o;
  if (s?.reactiveData) {
    o = s.reactiveData, kr(o, a);
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
function kr(t, e) {
  Object.keys(e).forEach((n) => {
    let s = Object.getOwnPropertyDescriptor(e, n), i = Object.getOwnPropertyDescriptor(t, n);
    s.get || s.set || i?.get || i?.set ? (i && delete t[n], i || (t[n] = void 0), s.get || s.set ? Object.defineProperty(t, n, s) : t[n] = e[n]) : t[n] = e[n];
  }), Object.keys(t).filter((n) => !Object.prototype.hasOwnProperty.call(e, n)).forEach((n) => delete t[n]);
}
Nt((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function Ar(t) {
  return $ ? de ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
g("show", (t, { modifiers: e, expression: n }, { effect: s }) => {
  let i = x(t, n);
  t._x_doHide || (t._x_doHide = () => {
    m(() => {
      t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
    });
  }), t._x_doShow || (t._x_doShow = () => {
    m(() => {
      t.style.length === 1 && t.style.display === "none" ? t.removeAttribute("style") : t.style.removeProperty("display");
    });
  });
  let r = () => {
    t._x_doHide(), t._x_isShown = !1;
  }, a = () => {
    t._x_doShow(), t._x_isShown = !0;
  }, o = () => setTimeout(a), d = ae(
    (u) => u ? a() : r(),
    (u) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, u, a, r) : u ? o() : r();
    }
  ), c, l = !0;
  s(() => i((u) => {
    !l && u === c || (e.includes("immediate") && (u ? o() : r()), d(u), c = u, l = !1);
  }));
});
g("for", D((t, { expression: e }, { effect: n, cleanup: s }) => {
  let i = Cr(e), r = x(t, i.items), a = x(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_lookup = /* @__PURE__ */ new Map(), n(() => Tr(t, i, r, a), { priority: "structural" }), s(() => {
    t._x_lookup.forEach(
      (o) => m(() => {
        Y(o), o.remove();
      })
    ), delete t._x_lookup, delete t._x_lastRenderedEl;
  });
}));
function Mr(t) {
  return (e) => {
    Object.entries(e).forEach(([n, s]) => {
      t[n] = s;
    });
  };
}
function Tr(t, e, n, s) {
  n((i) => {
    Rr(i) && (i = Array.from({ length: i }, (c, l) => l + 1)), i == null && (i = []), i instanceof Set && (i = Array.from(i)), i instanceof Map && (i = Array.from(i));
    let r = t._x_lookup, a = /* @__PURE__ */ new Map();
    t._x_lookup = a;
    let o = qr(i), d = Object.entries(i).map(([c, l]) => {
      o || (c = parseInt(c));
      let u = Pr(e, l, c, i), b;
      return s((_) => {
        typeof _ == "object" && A("x-for key cannot be an object, it must be a string or an integer", t), r.has(_) && (a.set(_, r.get(_)), r.delete(_)), b = _;
      }, { scope: { index: c, ...u } }), [b, u];
    });
    m(() => {
      r.forEach((u) => {
        Y(u), u.remove();
      });
      let c = /* @__PURE__ */ new Set(), l = t;
      d.forEach(([u, b]) => {
        if (a.has(u)) {
          let f = a.get(u);
          f._x_refreshXForScope(b), l.nextElementSibling !== f && (l.nextElementSibling && f.replaceWith(l.nextElementSibling), l.after(f)), l = f, f._x_currentIfEl && (f.nextElementSibling !== f._x_currentIfEl && l.after(f._x_currentIfEl), l = f._x_currentIfEl);
          return;
        }
        t.content.children.length > 1 && A("x-for templates require a single root element, additional elements will be ignored.", t);
        let _ = document.importNode(t.content, !0).firstElementChild, M = et(b);
        St(_, M, t), _._x_refreshXForScope = Mr(M), a.set(u, _), c.add(_), l.after(_), l = _;
      }), c.forEach((u) => q(u)), l !== t ? t._x_lastRenderedEl = l : delete t._x_lastRenderedEl;
    });
  });
}
function Cr(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, s = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, i = t.match(s);
  if (!i)
    return;
  let r = {};
  r.items = i[2].trim();
  let a = i[1].replace(n, "").trim(), o = a.match(e);
  return o ? (r.item = a.replace(e, "").trim(), r.index = o[1].trim(), o[2] && (r.collection = o[2].trim())) : r.item = a, r;
}
function Pr(t, e, n, s) {
  let i = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    i[a] = e[o];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    i[a] = e[a];
  }) : i[t.item] = e, t.index && (i[t.index] = n), t.collection && (i[t.collection] = s), i;
}
function Rr(t) {
  return typeof t != "object" && !isNaN(t);
}
function qr(t) {
  return typeof t == "object" && !Array.isArray(t);
}
function li() {
}
li.inline = (t, { expression: e }, { cleanup: n }) => {
  let s = Dt(t);
  s && (s._x_refs || (s._x_refs = {}), s._x_refs[e] = t, n(() => delete s._x_refs[e]));
};
g("ref", li);
g("if", D((t, { expression: e }, { effect: n, cleanup: s }) => {
  t.tagName.toLowerCase() !== "template" && A("x-if can only be used on a <template> tag", t);
  let i = x(t, e), r = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let o = t.content.cloneNode(!0).firstElementChild;
    return St(o, {}, t), m(() => {
      t.after(o), q(o);
    }), t._x_currentIfEl = o, t._x_lastRenderedEl = o, t._x_undoIf = () => {
      m(() => {
        Y(o), o.remove();
      }), delete t._x_currentIfEl, delete t._x_lastRenderedEl;
    }, o;
  }, a = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  n(() => i((o) => {
    o ? r() : a();
  }), { priority: "structural" }), s(() => t._x_undoIf && t._x_undoIf());
}));
g("id", (t, { expression: e }, { evaluate: n }) => {
  n(e).forEach((i) => br(t, i));
});
Nt((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
Ee(vn("@", yn(it("on:"))));
g("on", D((t, { value: e, modifiers: n, expression: s }, { cleanup: i }) => {
  let r = s ? x(t, s) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let a = X(t, e, n, (o) => {
    r(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  i(() => a());
}));
Lt("Collapse", "collapse", "collapse");
Lt("Intersect", "intersect", "intersect");
Lt("Focus", "trap", "focus");
Lt("Mask", "mask", "mask");
function Lt(t, e, n) {
  g(e, (s) => A(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, s));
}
st.setEvaluator(Li);
st.setRawEvaluator(Ki);
st.setReactivityEngine({
  reactive: De,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (t, e = {}) => {
    let n;
    return n = Us(t, {
      scheduler: () => {
        n && (e.scheduler ? e.scheduler(n) : n());
      }
    }), n;
  },
  release: zs,
  raw: h
});
var Ir = st, Jt = Ir;
function $r(t) {
  const e = window.__siteationDebugBar;
  return e ? (e.onRequest = t, e.requests.slice()) : [];
}
const $t = "__siteationDebugBarHostLock";
function Dr(t) {
  if (!t || window[$t]) return;
  const e = document.body, n = Math.max(0, window.innerWidth - document.documentElement.clientWidth), s = {
    overflow: e.style.overflow,
    paddingRight: e.style.paddingRight,
    inert: []
  };
  if (Array.from(e.children).forEach((i) => {
    i === t || i.contains(t) || !(i instanceof HTMLElement) || i.matches("script, style, link") || (s.inert.push([i, i.inert]), i.inert = !0);
  }), e.style.overflow = "hidden", n > 0) {
    const i = Number.parseFloat(window.getComputedStyle(e).paddingRight || "0");
    e.style.paddingRight = `${i + n}px`;
  }
  window[$t] = s;
}
function Fr() {
  const t = window[$t];
  t && (t.inert.forEach(([e, n]) => {
    e.inert = n;
  }), document.body.style.overflow = t.overflow, document.body.style.paddingRight = t.paddingRight, delete window[$t]);
}
function Nr(t, e) {
  if (t.key !== "Tab" || !e) return;
  const n = Array.from(e.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((a) => a.offsetParent !== null);
  if (n.length === 0) return;
  const s = n[0], i = n[n.length - 1], r = e.getRootNode().activeElement;
  t.shiftKey && r === s ? (t.preventDefault(), i.focus()) : !t.shiftKey && r === i && (t.preventDefault(), s.focus());
}
const ui = "siteation.debugbar.v1", Lr = "__PROFILE_ID__";
function jr() {
  const t = document.getElementById("siteation-debugbar-profile");
  if (!t) return {};
  try {
    return JSON.parse(t.textContent || "{}");
  } catch {
    return {};
  }
}
function Br() {
  const t = { open: !1, section: "overview" };
  try {
    return { ...t, ...JSON.parse(localStorage.getItem(ui) || "{}") };
  } catch {
    return t;
  }
}
function dt(t, e, n) {
  const s = e.trim().toLowerCase();
  return s ? t.filter((i) => n.some(
    (r) => String(i[r] ?? "").toLowerCase().includes(s)
  )) : t;
}
function Hr() {
  return {
    profile: {},
    open: !1,
    section: "findings",
    placement: "bottom",
    maximised: !1,
    theme: "system",
    resolvedTheme: "dark",
    stopWatchingScheme: null,
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
      this.profile = jr(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const t = Br();
      this.open = t.open, this.section = t.section, this.placement = t.placement === "top" ? "top" : "bottom", this.maximised = !!t.maximised, this.theme = ["system", "light", "dark"].includes(t.theme) ? t.theme : "system", this.watchColorScheme(), this.open && this.$nextTick(() => this.lock()), this.requests = $r((e) => {
        this.requests.some((n) => n.id === e.id) || (this.requests = [e, ...this.requests].slice(0, 25));
      }).filter((e) => e.id !== this.profile.id), this.open && this.loadPayloads();
    },
    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(t) {
      const e = document.getElementById("siteation-debugbar")?.dataset.profileUrl;
      return e ? e.replace(Lr, encodeURIComponent(t)) : null;
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
          const s = await n.json(), i = {};
          Object.entries(s.sections || {}).forEach(([r, a]) => {
            i[r] = a.payload || {};
          }), this.profile = s, this.payloads = i, this.activeId = t;
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
          const n = await e.json(), s = {};
          Object.entries(n.sections || {}).forEach(([i, r]) => {
            s[i] = r.payload || {};
          }), this.payloads = s;
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
    /**
     * System is the default, so the bar follows the developer's own setting until they
     * say otherwise. The media query stays watched, so changing the OS theme while a page
     * is open takes effect without a reload.
     */
    watchColorScheme() {
      const t = window.matchMedia("(prefers-color-scheme: light)"), e = () => {
        this.resolvedTheme = this.theme === "system" ? t.matches ? "light" : "dark" : this.theme;
      };
      e(), this.stopWatchingScheme?.(), t.addEventListener("change", e), this.stopWatchingScheme = () => t.removeEventListener("change", e);
    },
    cycleTheme() {
      const t = ["system", "light", "dark"];
      this.theme = t[(t.indexOf(this.theme) + 1) % t.length], this.watchColorScheme(), this.persist();
    },
    openInspector() {
      this.open || (this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), Fr(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus());
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
      Dr(document.getElementById("siteation-debugbar")), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(t) {
      if (t.key === "Escape") {
        this.closeInspector();
        return;
      }
      Nr(t, this.$refs.sheet);
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
          maximised: this.maximised,
          theme: this.theme
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
const Wr = {
  database: '<path d="M12 2.5c4.14 0 7.5 1.12 7.5 2.5S16.14 7.5 12 7.5 4.5 6.38 4.5 5 7.86 2.5 12 2.5Z"/><path d="M19.5 5v14c0 1.38-3.36 2.5-7.5 2.5S4.5 20.38 4.5 19V5"/><path d="M19.5 12c0 1.38-3.36 2.5-7.5 2.5S4.5 13.38 4.5 12"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 2.5v3M14 2.5v3M10 18.5v3M14 18.5v3M2.5 10h3M2.5 14h3M18.5 10h3M18.5 14h3"/>',
  bolt: '<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>',
  alert: '<path d="M12 3.5 2.5 20h19L12 3.5Z"/><path d="M12 10v4"/><path d="M12 17.2v.1"/>',
  monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
  dock: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 15h18"/>',
  minimise: '<path d="M5 12h14"/>',
  expand: '<path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5"/>',
  collapse: '<path d="M9 4v5H4M15 20v-5h5M15 4v5h5M9 20v-5H4"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  caret: '<path d="m6 9 6 6 6-6"/>'
};
function w(t, e = "") {
  return `<svg class="ndb-icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${Wr[t] || ""}</svg>`;
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
      ${w("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </button>

    <button type="button" class="ndb-stat" data-ndb-on:click="select('timeline')">
      ${w("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat is-secondary" data-ndb-on:click="select('blocks')">
      ${w("bolt", "is-accent")}
      <span>
        <span class="ndb-stat-key">Blocks</span>
        <span class="ndb-stat-value" data-ndb-text="blocks.unique_count || 0"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat is-secondary" data-ndb-on:click="select('overview')">
      ${w("chip", "is-accent")}
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
      ${w("alert")}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="cycleTheme()"
            data-ndb-bind:title="'Theme: ' + theme + '. Click to change.'">
      <span data-ndb-show="theme === 'system'">${w("monitor")}</span>
      <span data-ndb-show="theme === 'light'">${w("sun")}</span>
      <span data-ndb-show="theme === 'dark'">${w("moon")}</span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="movePlacement()"
            data-ndb-bind:title="placement === 'bottom' ? 'Move to the top' : 'Move to the bottom'">
      ${w("dock")}
    </button>

    <span class="ndb-controls-divider"></span>

    ${t ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      <span data-ndb-show="!maximised">${w("expand")}</span>
      <span data-ndb-show="maximised">${w("collapse")}</span>
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${w("minimise")}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${w("expand")}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="dismiss()"
            title="Hide until the next page load">
      ${w("close")}
    </button>
  </div>
</div>`;
}
const Kr = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme">

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
`, Ur = "data-ndb-", zr = "siteation-debugbar";
function Vr(t) {
  const e = t.attachShadow({ mode: "open" }), n = t.dataset.css;
  if (n) {
    const i = document.createElement("link");
    i.rel = "stylesheet", i.href = n, e.append(i);
  }
  const s = document.createElement("div");
  return s.innerHTML = Kr, e.append(...s.children), e.querySelector(".ndb");
}
const Qt = document.getElementById(zr);
if (Qt && !Qt.shadowRoot) {
  const t = Vr(Qt);
  Jt.prefix(Ur), Jt.data("debugBar", Hr), t && Jt.initTree(t), Fe && (window.Alpine = Fe);
}
