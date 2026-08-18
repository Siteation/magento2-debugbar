const Ie = window.Alpine;
var Jt = !1, Qt = !1, M = [], Yt = -1, Ct = !1, fe = !1;
function dr(t) {
  fr(t);
}
function ur() {
  fe = !0;
}
function lr() {
  fe = !1, Je();
}
function fr(t) {
  M.includes(t) || (M.push(t), t._x_schedulerPriority !== void 0 && (Ct = !0)), Je();
}
function pr(t) {
  let e = M.indexOf(t);
  e !== -1 && e > Yt && M.splice(e, 1);
}
function Je() {
  if (!Qt && !Jt) {
    if (fe)
      return;
    Jt = !0, queueMicrotask(br);
  }
}
function br() {
  Jt = !1, Qt = !0;
  for (let t = 0; t < M.length; t++)
    Ct && hr(t), M[t](), Yt = t;
  M.length = 0, Yt = -1, Ct = !1, Qt = !1;
}
function hr(t) {
  let e = /* @__PURE__ */ new Map(), n = M.slice(t).sort((r, i) => _r(r, i, e));
  for (let r = 0; r < n.length; r++)
    M[t + r] = n[r];
  Ct = !1;
}
function _r(t, e, n) {
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
var tt, J, et, Qe, vr = 0, Gt = !0;
function gr(t) {
  Gt = !1, t(), Gt = !0;
}
function mr(t) {
  tt = t.reactive, et = t.release, J = (e) => t.effect(e, { scheduler: (n) => {
    Gt ? dr(n) : n();
  } }), Qe = t.raw;
}
function Le(t) {
  J = t;
}
function xr(t) {
  let e = () => {
  };
  return [(r, i) => {
    let a = i?.priority === "structural" ? vr++ : void 0, s = J(r);
    return a !== void 0 && s !== void 0 && (s._x_schedulerPriority = { el: t, order: a }), t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((o) => o());
    }), t._x_effects.add(s), e = () => {
      s !== void 0 && (t._x_effects.delete(s), et(s));
    }, s;
  }, () => {
    e();
  }];
}
function Ye(t, e) {
  let n = !0, r, i, a = J(() => {
    let s = t(), o = JSON.stringify(s);
    if (!n && (typeof s == "object" || s !== r)) {
      let c = typeof r == "object" ? JSON.parse(i) : r;
      queueMicrotask(() => {
        e(s, c);
      });
    }
    r = s, i = o, n = !1;
  });
  return () => et(a);
}
async function yr(t) {
  ur();
  try {
    await t(), await Promise.resolve();
  } finally {
    lr();
  }
}
var Ge = [], Xe = [], Ze = [];
function wr(t) {
  Ze.push(t);
}
function pe(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, Xe.push(e));
}
function tn(t) {
  Ge.push(t);
}
function en(t, e, n) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n);
}
function nn(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([n, r]) => {
    (e === void 0 || e.includes(n)) && (r.forEach((i) => i()), delete t._x_attributeCleanups[n]);
  });
}
function Sr(t) {
  for (t._x_effects?.forEach(pr); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var be = new MutationObserver(ge), he = !1;
function _e() {
  be.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), he = !0;
}
function rn() {
  Or(), be.disconnect(), he = !1;
}
var it = [];
function Or() {
  let t = be.takeRecords();
  it.push(() => t.length > 0 && ge(t));
  let e = it.length;
  queueMicrotask(() => {
    if (it.length === e)
      for (; it.length > 0; )
        it.shift()();
  });
}
function v(t) {
  if (!he)
    return t();
  rn();
  let e = t();
  return _e(), e;
}
var ve = !1, Tt = [];
function Er() {
  ve = !0;
}
function Ar() {
  ve = !1, ge(Tt), Tt = [];
}
function ge(t) {
  if (ve) {
    Tt = Tt.concat(t);
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
      let s = t[a].target, o = t[a].attributeName, c = t[a].oldValue, d = () => {
        r.has(s) || r.set(s, []), r.get(s).push({ name: o, value: s.getAttribute(o) });
      }, u = () => {
        i.has(s) || i.set(s, []), i.get(s).push(o);
      };
      s.hasAttribute(o) && c === null ? d() : s.hasAttribute(o) ? (u(), d()) : u();
    }
  i.forEach((a, s) => {
    nn(s, a);
  }), r.forEach((a, s) => {
    Ge.forEach((o) => o(s, a));
  });
  for (let a of n)
    e.some((s) => s.contains(a)) || Xe.forEach((s) => s(a));
  for (let a of e)
    a.isConnected && Ze.forEach((s) => s(a));
  e = null, n = null, r = null, i = null;
}
function sn(t) {
  return H(B(t));
}
function yt(t, e, n) {
  return t._x_dataStack = [e, ...B(n || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((r) => r !== e);
  };
}
function B(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? B(t.host) : t.parentNode ? B(t.parentNode) : [];
}
function H(t) {
  return new Proxy({ objects: t }, kr);
}
function an(t, e) {
  return t === null || t === Object.prototype ? null : Object.prototype.hasOwnProperty.call(t, e) ? t : an(Object.getPrototypeOf(t), e);
}
var kr = {
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
      if (i = an(s, e), i)
        break;
    i || (i = t[t.length - 1]);
    const a = Object.getOwnPropertyDescriptor(i, e);
    return a?.set && a?.get ? a.set.call(r, n) || !0 : Reflect.set(i, e, n);
  }
};
function Cr() {
  return Reflect.ownKeys(this).reduce((e, n) => (e[n] = Reflect.get(this, n), e), {});
}
function me(t, e = () => {
}) {
  let n = (i) => typeof i == "object" && !Array.isArray(i) && i !== null, r = (i, a = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([s, { value: o, enumerable: c }]) => {
      if (c === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let d = a === "" ? s : `${a}.${s}`;
      typeof o == "object" && o !== null && o._x_interceptor ? i[s] = o.initialize(t, d, s, e) : n(o) && o !== i && !(o instanceof Element) && r(o, d);
    });
  };
  return r(t);
}
function on(t, e = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(r, i, a, s) {
      return t(this.initialValue, () => Tr(r, i), (o) => Xt(r, i, o), i, a, s);
    }
  };
  return e(n), (r) => {
    if (typeof r == "object" && r !== null && r._x_interceptor) {
      let i = n.initialize.bind(n);
      n.initialize = (a, s, o, c) => {
        let d = r.initialize(a, s, o, c);
        return n.initialValue = d, i(a, s, o, c);
      };
    } else
      n.initialValue = r;
    return n;
  };
}
function Tr(t, e) {
  return e.split(".").reduce((n, r) => n[r], t);
}
function Xt(t, e, n) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = n;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), Xt(t[e[0]], e.slice(1), n);
  }
}
var cn = {};
function O(t, e) {
  cn[t] = e;
}
function pt(t, e) {
  let n = Mr(e);
  return Object.entries(cn).forEach(([r, i]) => {
    Object.defineProperty(t, `$${r}`, {
      get() {
        return i(e, n);
      },
      enumerable: !1
    });
  }), t;
}
function Mr(t) {
  let [e, n] = hn(t), r = { interceptor: on, ...e };
  return pe(t, n), r;
}
function Rr(t, e, n, ...r) {
  try {
    return n(...r);
  } catch (i) {
    bt(i, t, e);
  }
}
function bt(...t) {
  return dn(...t);
}
var dn = qr;
function Pr(t) {
  dn = t;
}
function qr(t, e, n = void 0) {
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
function un(t) {
  let e = Z;
  Z = !1;
  let n = t();
  return Z = e, n;
}
function $(t, e, n = {}) {
  let r;
  return y(t, e)((i) => r = i, n), r;
}
function y(...t) {
  return ln(...t);
}
var ln = () => {
};
function Dr(t) {
  ln = t;
}
var fn;
function Ir(t) {
  fn = t;
}
function Nr(t, e) {
  let n = {};
  pt(n, t);
  let r = [n, ...B(t)], i = typeof e == "function" ? Lr(r, e) : $r(r, e, t);
  return Rr.bind(null, t, e, i);
}
function Lr(t, e) {
  return (n = () => {
  }, { scope: r = {}, params: i = [], context: a } = {}) => {
    if (!Z) {
      ht(n, e, H([r, ...t]), i);
      return;
    }
    let s = e.apply(H([r, ...t]), i);
    ht(n, s);
  };
}
var $t = {};
function jr(t, e) {
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
      return bt(s, e, t), Promise.resolve();
    }
  })();
  return $t[t] = a, a;
}
function $r(t, e, n) {
  let r = jr(e, n);
  return (i = () => {
  }, { scope: a = {}, params: s = [], context: o } = {}) => {
    r.result = void 0, r.finished = !1;
    let c = H([a, ...t]);
    if (typeof r == "function") {
      let d = r.call(o, r, c).catch((u) => bt(u, n, e));
      r.finished ? (ht(i, r.result, c, s, n), r.result = void 0) : d.then((u) => {
        ht(i, u, c, s, n);
      }).catch((u) => bt(u, n, e)).finally(() => r.result = void 0);
    }
  };
}
function ht(t, e, n, r, i) {
  if (Z && typeof e == "function") {
    let a = e.apply(n, r);
    a instanceof Promise ? a.then((s) => ht(t, s, n, r)).catch((s) => bt(s, i, e)) : t(a);
  } else typeof e == "object" && e instanceof Promise ? e.then((a) => t(a)) : t(e);
}
function Fr(...t) {
  return fn(...t);
}
function Br(t, e, n = {}) {
  let r = {};
  pt(r, t);
  let i = [r, ...B(t)], a = H([n.scope ?? {}, ...i]), s = n.params ?? [];
  if (e.includes("await")) {
    let o = Object.getPrototypeOf(async function() {
    }).constructor, c = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e;
    return new o(
      ["scope"],
      `with (scope) { let __result = ${c}; return __result }`
    ).call(n.context, a);
  } else {
    let o = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(()=>{ ${e} })()` : e, d = new Function(
      ["scope"],
      `with (scope) { let __result = ${o}; return __result }`
    ).call(n.context, a);
    return typeof d == "function" && Z ? d.apply(a, s) : d;
  }
}
var xe = "x-";
function nt(t = "") {
  return xe + t;
}
function Hr(t) {
  xe = t;
}
var Mt = {};
function g(t, e) {
  return Mt[t] = e, {
    before(n) {
      if (!Mt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const r = j.indexOf(n);
      j.splice(r >= 0 ? r : j.indexOf("DEFAULT"), 0, t);
    }
  };
}
function Kr(t) {
  return Object.keys(Mt).includes(t);
}
function ye(t, e, n) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let a = Object.entries(t._x_virtualDirectives).map(([o, c]) => ({ name: o, value: c })), s = pn(a);
    a = a.map((o) => s.find((c) => c.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), e = e.concat(a);
  }
  let r = {};
  return e.map(gn((a, s) => r[a] = s)).filter(xn).map(Ur(r, n)).sort(Vr).map((a) => zr(t, a));
}
function pn(t) {
  return Array.from(t).map(gn()).filter((e) => !xn(e));
}
var Zt = !1, ot = /* @__PURE__ */ new Map(), bn = /* @__PURE__ */ Symbol();
function Wr(t) {
  Zt = !0;
  let e = /* @__PURE__ */ Symbol();
  bn = e, ot.set(e, []);
  let n = () => {
    for (; ot.get(e).length; )
      ot.get(e).shift()();
    ot.delete(e);
  }, r = () => {
    Zt = !1, n();
  };
  t(n), r();
}
function hn(t) {
  let e = [], n = (o) => e.push(o), [r, i] = xr(t);
  return e.push(i), [{
    Alpine: rt,
    effect: r,
    cleanup: n,
    evaluateLater: y.bind(y, t),
    evaluate: $.bind($, t)
  }, () => e.forEach((o) => o())];
}
function zr(t, e) {
  let n = () => {
  }, r = Mt[e.type] || n, [i, a] = hn(t);
  en(t, e.original, a);
  let s = () => {
    t._x_ignore || t._x_ignoreSelf || (r.inline && r.inline(t, e, i), r = r.bind(r, t, e, i), Zt ? ot.get(bn).push(r) : r());
  };
  return s.runCleanups = a, s;
}
var _n = (t, e) => ({ name: n, value: r }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: r }), vn = (t) => t;
function gn(t = () => {
}) {
  return ({ name: e, value: n }) => {
    let { name: r, value: i } = mn.reduce((a, s) => s(a), { name: e, value: n });
    return r !== e && t(r, e), { name: r, value: i };
  };
}
var mn = [];
function we(t) {
  mn.push(t);
}
function xn({ name: t }) {
  return yn().test(t);
}
var yn = () => new RegExp(`^${xe}([^:^.]+)\\b`);
function Ur(t, e) {
  return ({ name: n, value: r }) => {
    n === r && (r = "");
    let i = n.match(yn()), a = n.match(/:([a-zA-Z0-9\-_:]+)/), s = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = e || t[n] || n;
    return {
      type: i ? i[1] : null,
      value: a ? a[1] : null,
      modifiers: s.map((c) => c.replace(".", "")),
      expression: r,
      original: o
    };
  };
}
var te = "DEFAULT", j = [
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
  te,
  "teleport"
];
function Vr(t, e) {
  let n = j.indexOf(t.type) === -1 ? te : t.type, r = j.indexOf(e.type) === -1 ? te : e.type;
  return j.indexOf(n) - j.indexOf(r);
}
function ct(t, e, n = {}, r = {}) {
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
function A(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var je = !1;
function Jr() {
  je && A("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), je = !0, document.body || A("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), ct(document, "alpine:init"), ct(document, "alpine:initializing"), _e(), wr((e) => P(e, K)), pe((e) => Q(e)), tn((e, n) => {
    ye(e, n).forEach((r) => r());
  });
  let t = (e) => !Dt(e.parentElement, !0);
  Array.from(document.querySelectorAll(On().join(","))).filter(t).forEach((e) => {
    P(e);
  }), ct(document, "alpine:initialized"), setTimeout(() => {
    Xr();
  });
}
var Se = [], wn = [];
function Sn() {
  return Se.map((t) => t());
}
function On() {
  return Se.concat(wn).map((t) => t());
}
function En(t) {
  Se.push(t);
}
function An(t) {
  wn.push(t);
}
function Dt(t, e = !1) {
  return R(t, (n) => {
    if ((e ? On() : Sn()).some((i) => n.matches(i)))
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
function Qr(t) {
  return Sn().some((e) => t.matches(e));
}
var kn = [];
function Yr(t) {
  kn.push(t);
}
var Gr = 1;
function P(t, e = K, n = () => {
}) {
  R(t, (r) => r._x_ignore) || Wr(() => {
    e(t, (r, i) => {
      r._x_marker || (n(r, i), kn.forEach((a) => a(r, i)), ye(r, r.attributes).forEach((a) => a()), r._x_ignore || (r._x_marker = Gr++), r._x_ignore && i());
    });
  });
}
function Q(t, e = K) {
  e(t, (n) => {
    Sr(n), nn(n), delete n._x_marker;
  });
}
function Xr() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, n, r]) => {
    Kr(n) || r.some((i) => {
      if (document.querySelector(i))
        return A(`found "${i}", but missing ${e} plugin`), !0;
    });
  });
}
var ee = [], Oe = !1;
function Ee(t = () => {
}) {
  return queueMicrotask(() => {
    Oe || setTimeout(() => {
      ne();
    });
  }), new Promise((e) => {
    ee.push(() => {
      t(), e();
    });
  });
}
function ne() {
  for (Oe = !1; ee.length; )
    ee.shift()();
}
function Zr() {
  Oe = !0;
}
function Ae(t, e) {
  return Array.isArray(e) ? $e(t, e.join(" ")) : typeof e == "object" && e !== null ? ti(t, e) : typeof e == "function" ? Ae(t, e()) : $e(t, e);
}
function re(t) {
  return t.split(/\s/).filter(Boolean);
}
function $e(t, e) {
  let n = (i) => re(i).filter((a) => !t.classList.contains(a)).filter(Boolean), r = (i) => (t.classList.add(...i), () => {
    t.classList.remove(...i);
  });
  return e = e === !0 ? e = "" : e || "", r(n(e));
}
function ti(t, e) {
  let n = Object.entries(e).flatMap(([s, o]) => o ? re(s) : !1).filter(Boolean), r = Object.entries(e).flatMap(([s, o]) => o ? !1 : re(s)).filter(Boolean), i = [], a = [];
  return r.forEach((s) => {
    t.classList.contains(s) && (t.classList.remove(s), a.push(s));
  }), n.forEach((s) => {
    t.classList.contains(s) || (t.classList.add(s), i.push(s));
  }), () => {
    a.forEach((s) => t.classList.add(s)), i.forEach((s) => t.classList.remove(s));
  };
}
function It(t, e) {
  return typeof e == "object" && e !== null ? ei(t, e) : ni(t, e);
}
function ei(t, e) {
  let n = {};
  return Object.entries(e).forEach(([r, i]) => {
    n[r] = t.style[r], r.startsWith("--") || (r = ri(r)), t.style.setProperty(r, i);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    It(t, n);
  };
}
function ni(t, e) {
  let n = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", n || "");
  };
}
function ri(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ie(t, e = () => {
}) {
  let n = !1;
  return function() {
    n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments));
  };
}
g("transition", (t, { value: e, modifiers: n, expression: r }, { evaluate: i }) => {
  typeof r == "function" && (r = i(r)), r !== !1 && (!r || typeof r == "boolean" ? si(t, n, e) : ii(t, r, e));
});
function ii(t, e, n) {
  Cn(t, Ae, ""), {
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
function si(t, e, n) {
  Cn(t, It);
  let r = !e.includes("in") && !e.includes("out") && !n, i = r || e.includes("in") || ["enter"].includes(n), a = r || e.includes("out") || ["leave"].includes(n);
  e.includes("in") && !r && (e = e.filter((x, Y) => Y < e.indexOf("out"))), e.includes("out") && !r && (e = e.filter((x, Y) => Y > e.indexOf("out")));
  let s = !e.includes("opacity") && !e.includes("scale"), o = s || e.includes("opacity"), c = s || e.includes("scale"), d = o ? 0 : 1, u = c ? st(e, "scale", 95) / 100 : 1, l = st(e, "delay", 0) / 1e3, h = st(e, "origin", "center"), _ = "opacity, transform", k = st(e, "duration", 150) / 1e3, f = st(e, "duration", 75) / 1e3, m = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  i && (t._x_transition.enter.during = {
    transformOrigin: h,
    transitionDelay: `${l}s`,
    transitionProperty: _,
    transitionDuration: `${k}s`,
    transitionTimingFunction: m
  }, t._x_transition.enter.start = {
    opacity: d,
    transform: `scale(${u})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), a && (t._x_transition.leave.during = {
    transformOrigin: h,
    transitionDelay: `${l}s`,
    transitionProperty: _,
    transitionDuration: `${f}s`,
    transitionTimingFunction: m
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: d,
    transform: `scale(${u})`
  });
}
function Cn(t, e, n = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(r = () => {
    }, i = () => {
    }) {
      se(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, r, i);
    },
    out(r = () => {
    }, i = () => {
    }) {
      se(t, e, {
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
    let s = Tn(t);
    s ? (s._x_hideChildren || (s._x_hideChildren = []), s._x_hideChildren.push(t)) : i(() => {
      let o = (c) => {
        let d = Promise.all([
          c._x_hidePromise,
          ...(c._x_hideChildren || []).map(o)
        ]).then(([u]) => u?.());
        return delete c._x_hidePromise, delete c._x_hideChildren, d;
      };
      o(t).catch((c) => {
        if (!c.isFromCancelledTransition)
          throw c;
      });
    });
  });
};
function Tn(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : Tn(e);
}
function se(t, e, { during: n, start: r, end: i } = {}, a = () => {
}, s = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(r).length === 0 && Object.keys(i).length === 0) {
    a(), s();
    return;
  }
  let o, c, d;
  ai(t, {
    start() {
      o = e(t, r);
    },
    during() {
      c = e(t, n);
    },
    before: a,
    end() {
      o(), d = e(t, i);
    },
    after: s,
    cleanup() {
      c(), d();
    }
  });
}
function ai(t, e) {
  let n, r, i, a = ie(() => {
    v(() => {
      n = !0, r || e.before(), i || (e.end(), ne()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(s) {
      this.beforeCancels.push(s);
    },
    cancel: ie(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      a();
    }),
    finish: a
  }, v(() => {
    e.start(), e.during();
  }), Zr(), requestAnimationFrame(() => {
    if (n)
      return;
    let s = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    s === 0 && (s = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), v(() => {
      e.before();
    }), r = !0, requestAnimationFrame(() => {
      n || (v(() => {
        e.end();
      }), ne(), setTimeout(t._x_transitioning.finish, s + o), i = !0);
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
var D = !1;
function I(t, e = () => {
}) {
  return (...n) => D ? e(...n) : t(...n);
}
function oi(t) {
  return (...e) => D && t(...e);
}
var Mn = [];
function Nt(t) {
  Mn.push(t);
}
function ci(t, e) {
  Mn.forEach((n) => n(t, e)), D = !0, Rn(() => {
    P(e, (n, r) => {
      r(n, () => {
      });
    });
  }), D = !1;
}
var ae = !1;
function di(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), D = !0, ae = !0, Rn(() => {
    ui(e);
  }), D = !1, ae = !1;
}
function ui(t) {
  let e = !1;
  P(t, (r, i) => {
    K(r, (a, s) => {
      if (e && Qr(a))
        return s();
      e = !0, i(a, s);
    });
  });
}
function Rn(t) {
  let e = J;
  Le((n, r) => {
    let i = e(n);
    return et(i), () => {
    };
  }), t(), Le(e);
}
function Pn(t, e, n, r = []) {
  switch (t._x_bindings || (t._x_bindings = tt({})), t._x_bindings[e] = n, e = r.includes("camel") ? gi(e) : e, e) {
    case "value":
      li(t, n);
      break;
    case "style":
      pi(t, n);
      break;
    case "class":
      fi(t, n);
      break;
    case "selected":
    case "checked":
      bi(t, e, n);
      break;
    default:
      ke(t, e, n);
      break;
  }
}
function li(t, e) {
  if (Ce(t))
    t.attributes.value === void 0 && (t.value = e);
  else if (Rt(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((n) => mi(n, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    vi(t, e);
  else if (t.tagName === "OPTION")
    ke(t, "value", e);
  else {
    if (t.value === e && (typeof e != "object" || e === null))
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function fi(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = Ae(t, e);
}
function pi(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = It(t, e);
}
function bi(t, e, n) {
  ke(t, e, n), _i(t, e, n);
}
function ke(t, e, n) {
  [null, void 0, !1].includes(n) && yi(e) ? t.removeAttribute(e) : (qn(e) && (n = e), wi(n) && (n = JSON.stringify(n)), hi(t, e, n));
}
function hi(t, e, n) {
  t.getAttribute(e) != n && t.setAttribute(e, n);
}
function _i(t, e, n) {
  t[e] !== n && (t[e] = n);
}
function vi(t, e) {
  const n = [].concat(e).map((r) => r + "");
  Array.from(t.options).forEach((r) => {
    r.selected = n.includes(r.value);
  });
}
function gi(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function mi(t, e) {
  return t == e;
}
function kt(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var xi = /* @__PURE__ */ new Set([
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
function qn(t) {
  return xi.has(t);
}
function yi(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function wi(t) {
  return typeof t == "object" && t !== null;
}
function Si(t, e, n) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : Dn(t, e, n);
}
function Oi(t, e, n, r = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let i = t._x_inlineBindings[e];
    return i.extract = r, un(() => $(t, i.expression));
  }
  return Dn(t, e, n);
}
function Dn(t, e, n) {
  let r = t.getAttribute(e);
  return r === null ? typeof n == "function" ? n() : n : r === "" ? !0 : qn(e) ? !![e, "true"].includes(r) : r;
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
function Nn(t, e) {
  let n;
  return function() {
    let r = this, i = arguments;
    n || (t.apply(r, i), n = !0, setTimeout(() => n = !1, e));
  };
}
function Ln({ get: t, set: e }, { get: n, set: r }) {
  let i = !0, a, s = J(() => {
    let o = t(), c = n();
    if (i)
      r(Ft(o)), i = !1;
    else {
      let d = JSON.stringify(o), u = JSON.stringify(c);
      d !== a ? r(Ft(o)) : d !== u && e(Ft(c));
    }
    a = JSON.stringify(t()), JSON.stringify(n());
  });
  return () => {
    et(s);
  };
}
function Ft(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function Ei(t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => n(rt));
}
var T = {}, Fe = !1;
function Ai(t, e) {
  if (Fe || (T = tt(T), Fe = !0), e === void 0)
    return T[t];
  T[t] = e, typeof e == "object" && e !== null && e._x_interceptor ? T[t] = e.initialize(T, t, t, () => {
  }) : me(T[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && T[t].init();
}
function ki() {
  return T;
}
var jn = {};
function Ci(t, e) {
  let n = typeof e != "function" ? () => e : e;
  return t instanceof Element ? $n(t, n()) : (jn[t] = n, () => {
  });
}
function Ti(t) {
  return Object.entries(jn).forEach(([e, n]) => {
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
  let i = Object.entries(e).map(([s, o]) => ({ name: s, value: o })), a = pn(i);
  return i = i.map((s) => a.find((o) => o.name === s.name) ? {
    name: `x-bind:${s.name}`,
    value: `"${s.value}"`
  } : s), ye(t, i, n).map((s) => {
    r.push(s.runCleanups), s();
  }), () => {
    for (; r.length; )
      r.pop()();
  };
}
var Fn = {};
function Mi(t, e) {
  Fn[t] = e;
}
function Ri(t, e) {
  return Object.entries(Fn).forEach(([n, r]) => {
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
    return Qe;
  },
  get transaction() {
    return yr;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Ar,
  dontAutoEvaluateFunctions: un,
  disableEffectScheduling: gr,
  startObservingMutations: _e,
  stopObservingMutations: rn,
  setReactivityEngine: mr,
  onAttributeRemoved: en,
  onAttributesAdded: tn,
  closestDataStack: B,
  skipDuringClone: I,
  onlyDuringClone: oi,
  addRootSelector: En,
  addInitSelector: An,
  setErrorHandler: Pr,
  interceptClone: Nt,
  addScopeToNode: yt,
  deferMutations: Er,
  mapAttributes: we,
  evaluateLater: y,
  interceptInit: Yr,
  initInterceptors: me,
  injectMagics: pt,
  setEvaluator: Dr,
  setRawEvaluator: Ir,
  mergeProxies: H,
  extractProp: Oi,
  findClosest: R,
  onElRemoved: pe,
  closestRoot: Dt,
  destroyTree: Q,
  interceptor: on,
  // INTERNAL: not public API and is subject to change without major release.
  transition: se,
  // INTERNAL
  setStyles: It,
  // INTERNAL
  mutateDom: v,
  directive: g,
  entangle: Ln,
  throttle: Nn,
  debounce: In,
  evaluate: $,
  evaluateRaw: Fr,
  initTree: P,
  nextTick: Ee,
  prefixed: nt,
  prefix: Hr,
  plugin: Ei,
  magic: O,
  store: Ai,
  start: Jr,
  clone: di,
  // INTERNAL
  cloneNode: ci,
  // INTERNAL
  bound: Si,
  $data: sn,
  watch: Ye,
  walk: K,
  data: Mi,
  bind: Ci
}, rt = Pi;
function qi(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(","))
    e[n] = 1;
  return (n) => n in e;
}
var _t = Object.assign, Di = Object.prototype.hasOwnProperty, oe = (t, e) => Di.call(t, e), vt = Array.isArray, dt = (t) => Bn(t) === "[object Map]", Ii = (t) => typeof t == "string", wt = (t) => typeof t == "symbol", gt = (t) => t !== null && typeof t == "object", Ni = Object.prototype.toString, Bn = (t) => Ni.call(t), Hn = (t) => Bn(t).slice(8, -1), Te = (t) => Ii(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Li = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, ji = Li((t) => t.charAt(0).toUpperCase() + t.slice(1)), L = (t, e) => !Object.is(t, e);
function W(t, ...e) {
  console.warn(`[Vue warn] ${t}`, ...e);
}
var p, Bt = /* @__PURE__ */ new WeakSet(), Be = class {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Bt.has(this) && (Bt.delete(this), this.trigger()));
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
    this.flags |= 2, He(this), Wn(this);
    const t = p, e = S;
    p = this, S = !0;
    try {
      return this.fn();
    } finally {
      p !== this && W(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), zn(this), p = t, S = e, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Pe(t);
      this.deps = this.depsTail = void 0, He(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Bt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ce(this) && this.run();
  }
  get dirty() {
    return ce(this);
  }
}, Kn = 0, ut, lt;
function $i(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = lt, lt = t;
    return;
  }
  t.next = ut, ut = t;
}
function Me() {
  Kn++;
}
function Re() {
  if (--Kn > 0)
    return;
  if (lt) {
    let e = lt;
    for (lt = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; ut; ) {
    let e = ut;
    for (ut = void 0; e; ) {
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
function Wn(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function zn(t) {
  let e, n = t.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), Pe(r), Bi(r)) : e = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  t.deps = e, t.depsTail = n;
}
function ce(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (Fi(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function Fi(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === Pt) || (t.globalVersion = Pt, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !ce(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = p, r = S;
  p = t, S = !0;
  try {
    Wn(t);
    const i = t.fn(t._value);
    (e.version === 0 || L(i, t._value)) && (t.flags |= 128, t._value = i, e.version++);
  } catch (i) {
    throw e.version++, i;
  } finally {
    p = n, S = r, zn(t), t.flags &= -3;
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
function Bi(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
function Hi(t, e) {
  t.effect instanceof Be && (t = t.effect.fn);
  const n = new Be(t);
  e && _t(n, e);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const r = n.run.bind(n);
  return r.effect = n, r;
}
function Ki(t) {
  t.effect.stop();
}
var S = !0, Un = [];
function Wi() {
  Un.push(S), S = !1;
}
function zi() {
  const t = Un.pop();
  S = t === void 0 ? !0 : t;
}
function He(t) {
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
var Pt = 0, Ui = class {
  constructor(t, e) {
    this.sub = t, this.dep = e, this.version = e.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, Vi = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!p || !S || p === this.computed)
      return;
    let e = this.activeLink;
    if (e === void 0 || e.sub !== p)
      e = this.activeLink = new Ui(p, this), p.deps ? (e.prevDep = p.depsTail, p.depsTail.nextDep = e, p.depsTail = e) : p.deps = p.depsTail = e, Vn(e);
    else if (e.version === -1 && (e.version = this.version, e.nextDep)) {
      const n = e.nextDep;
      n.prevDep = e.prevDep, e.prevDep && (e.prevDep.nextDep = n), e.prevDep = p.depsTail, e.nextDep = void 0, p.depsTail.nextDep = e, p.depsTail = e, p.deps === e && (p.deps = n);
    }
    return p.onTrack && p.onTrack(
      _t(
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
    Me();
    try {
      for (let e = this.subsHead; e; e = e.nextSub)
        e.sub.onTrigger && !(e.sub.flags & 8) && e.sub.onTrigger(
          _t(
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
function Vn(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let r = e.deps; r; r = r.nextDep)
        Vn(r);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subsHead === void 0 && (t.dep.subsHead = t), t.dep.subs = t;
  }
}
var de = /* @__PURE__ */ new WeakMap(), F = /* @__PURE__ */ Symbol(
  "Object iterate"
), ue = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), mt = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function w(t, e, n) {
  if (S && p) {
    let r = de.get(t);
    r || de.set(t, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Vi()), i.map = r, i.key = n), i.track({
      target: t,
      type: e,
      key: n
    });
  }
}
function q(t, e, n, r, i, a) {
  const s = de.get(t);
  if (!s) {
    Pt++;
    return;
  }
  const o = (c) => {
    c && c.trigger({
      target: t,
      type: e,
      key: n,
      newValue: r,
      oldValue: i,
      oldTarget: a
    });
  };
  if (Me(), e === "clear")
    s.forEach(o);
  else {
    const c = vt(t), d = c && Te(n);
    if (c && n === "length") {
      const u = Number(r);
      s.forEach((l, h) => {
        (h === "length" || h === mt || !wt(h) && h >= u) && o(l);
      });
    } else
      switch ((n !== void 0 || s.has(void 0)) && o(s.get(n)), d && o(s.get(mt)), e) {
        case "add":
          c ? d && o(s.get("length")) : (o(s.get(F)), dt(t) && o(s.get(ue)));
          break;
        case "delete":
          c || (o(s.get(F)), dt(t) && o(s.get(ue)));
          break;
        case "set":
          dt(t) && o(s.get(F));
          break;
      }
  }
  Re();
}
function G(t) {
  const e = b(t);
  return e === t ? e : (w(e, "iterate", mt), U(t) ? e : e.map(V));
}
function qe(t) {
  return w(t = b(t), "iterate", mt), t;
}
function E(t, e) {
  return z(t) ? tr(t) ? xt(V(e)) : xt(e) : V(e);
}
var Ji = {
  __proto__: null,
  [Symbol.iterator]() {
    return Ht(this, Symbol.iterator, (t) => E(this, t));
  },
  concat(...t) {
    return G(this).concat(
      ...t.map((e) => vt(e) ? G(e) : e)
    );
  },
  entries() {
    return Ht(this, "entries", (t) => (t[1] = E(this, t[1]), t));
  },
  every(t, e) {
    return C(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return C(
      this,
      "filter",
      t,
      e,
      (n) => n.map((r) => E(this, r)),
      arguments
    );
  },
  find(t, e) {
    return C(
      this,
      "find",
      t,
      e,
      (n) => E(this, n),
      arguments
    );
  },
  findIndex(t, e) {
    return C(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return C(
      this,
      "findLast",
      t,
      e,
      (n) => E(this, n),
      arguments
    );
  },
  findLastIndex(t, e) {
    return C(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return C(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return Kt(this, "includes", t);
  },
  indexOf(...t) {
    return Kt(this, "indexOf", t);
  },
  join(t) {
    return G(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Kt(this, "lastIndexOf", t);
  },
  map(t, e) {
    return C(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return at(this, "pop");
  },
  push(...t) {
    return at(this, "push", t);
  },
  reduce(t, ...e) {
    return Ke(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Ke(this, "reduceRight", t, e);
  },
  shift() {
    return at(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return C(this, "some", t, e, void 0, arguments);
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
    return Ht(this, "values", (t) => E(this, t));
  }
};
function Ht(t, e, n) {
  const r = qe(t), i = r[e]();
  return r !== t && !U(t) && (i._next = i.next, i.next = () => {
    const a = i._next();
    return a.done || (a.value = n(a.value)), a;
  }), i;
}
var Qi = Array.prototype;
function C(t, e, n, r, i, a) {
  const s = qe(t), o = s !== t && !U(t), c = s[e];
  if (c !== Qi[e]) {
    const l = c.apply(t, a);
    return o ? V(l) : l;
  }
  let d = n;
  s !== t && (o ? d = function(l, h) {
    return n.call(this, E(t, l), h, t);
  } : n.length > 2 && (d = function(l, h) {
    return n.call(this, l, h, t);
  }));
  const u = c.call(s, d, r);
  return o && i ? i(u) : u;
}
function Ke(t, e, n, r) {
  const i = qe(t), a = i !== t && !U(t);
  let s = n, o = !1;
  i !== t && (a ? (o = r.length === 0, s = function(d, u, l) {
    return o && (o = !1, d = E(t, d)), n.call(this, d, E(t, u), l, t);
  }) : n.length > 3 && (s = function(d, u, l) {
    return n.call(this, d, u, l, t);
  }));
  const c = i[e](s, ...r);
  return o ? E(t, c) : c;
}
function Kt(t, e, n) {
  const r = b(t);
  w(r, "iterate", mt);
  const i = r[e](...n);
  return (i === -1 || i === !1) && ds(n[0]) ? (n[0] = b(n[0]), r[e](...n)) : i;
}
function at(t, e, n = []) {
  Wi(), Me();
  const r = b(t)[e].apply(t, n);
  return Re(), zi(), r;
}
var Yi = /* @__PURE__ */ qi("__proto__,__v_isRef,__isVue"), Jn = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(wt)
);
function Gi(t) {
  wt(t) || (t = String(t));
  const e = b(this);
  return w(e, "has", t), e.hasOwnProperty(t);
}
var Qn = class {
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
      return n === (r ? i ? os : Xn : i ? as : Gn).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const a = vt(t);
    if (!r) {
      let o;
      if (a && (o = Ji[e]))
        return o;
      if (e === "hasOwnProperty")
        return Gi;
    }
    const s = Reflect.get(
      t,
      e,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      ft(t) ? t : n
    );
    if ((wt(e) ? Jn.has(e) : Yi(e)) || (r || w(t, "get", e), i))
      return s;
    if (ft(s)) {
      const o = a && Te(e) ? s : s.value;
      return r && gt(o) ? le(o) : o;
    }
    return gt(s) ? r ? le(s) : De(s) : s;
  }
}, Xi = class extends Qn {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, e, n, r) {
    let i = t[e];
    const a = vt(t) && Te(e);
    if (!this._isShallow) {
      const c = z(i);
      if (!U(n) && !z(n) && (i = b(i), n = b(n)), !a && ft(i) && !ft(n))
        return c ? (W(
          `Set operation on key "${String(e)}" failed: target is readonly.`,
          t[e]
        ), !0) : (i.value = n, !0);
    }
    const s = a ? Number(e) < t.length : oe(t, e), o = Reflect.set(
      t,
      e,
      n,
      ft(t) ? t : r
    );
    return t === b(r) && o && (s ? L(n, i) && q(t, "set", e, n, i) : q(t, "add", e, n)), o;
  }
  deleteProperty(t, e) {
    const n = oe(t, e), r = t[e], i = Reflect.deleteProperty(t, e);
    return i && n && q(t, "delete", e, void 0, r), i;
  }
  has(t, e) {
    const n = Reflect.has(t, e);
    return (!wt(e) || !Jn.has(e)) && w(t, "has", e), n;
  }
  ownKeys(t) {
    return w(
      t,
      "iterate",
      vt(t) ? "length" : F
    ), Reflect.ownKeys(t);
  }
}, Zi = class extends Qn {
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
}, ts = /* @__PURE__ */ new Xi(), es = /* @__PURE__ */ new Zi(), St = (t) => Reflect.getPrototypeOf(t);
function ns(t, e, n) {
  return function(...r) {
    const i = this.__v_raw, a = b(i), s = dt(a), o = t === "entries" || t === Symbol.iterator && s, c = t === "keys" && s, d = i[t](...r), u = e ? xt : V;
    return !e && w(
      a,
      "iterate",
      c ? ue : F
    ), _t(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: l, done: h } = d.next();
          return h ? { value: l, done: h } : {
            value: o ? [u(l[0]), u(l[1])] : u(l),
            done: h
          };
        }
      }
    );
  };
}
function Ot(t) {
  return function(...e) {
    {
      const n = e[0] ? `on key "${e[0]}" ` : "";
      W(
        `${ji(t)} operation ${n}failed: target is readonly.`,
        b(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function rs(t, e) {
  const n = {
    get(i) {
      const a = this.__v_raw, s = b(a), o = b(i);
      t || (L(i, o) && w(s, "get", i), w(s, "get", o));
      const { has: c } = St(s), d = t ? xt : V;
      if (c.call(s, i))
        return d(a.get(i));
      if (c.call(s, o))
        return d(a.get(o));
      a !== s && a.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !t && w(b(i), "iterate", F), i.size;
    },
    has(i) {
      const a = this.__v_raw, s = b(a), o = b(i);
      return t || (L(i, o) && w(s, "has", i), w(s, "has", o)), i === o ? a.has(i) : a.has(i) || a.has(o);
    },
    forEach(i, a) {
      const s = this, o = s.__v_raw, c = b(o), d = t ? xt : V;
      return !t && w(c, "iterate", F), o.forEach((u, l) => i.call(a, d(u), d(l), s));
    }
  };
  return _t(
    n,
    t ? {
      add: Ot("add"),
      set: Ot("set"),
      delete: Ot("delete"),
      clear: Ot("clear")
    } : {
      add(i) {
        const a = b(this), s = St(a), o = b(i), c = !U(i) && !z(i) ? o : i;
        return s.has.call(a, c) || L(i, c) && s.has.call(a, i) || L(o, c) && s.has.call(a, o) || (a.add(c), q(a, "add", c, c)), this;
      },
      set(i, a) {
        !U(a) && !z(a) && (a = b(a));
        const s = b(this), { has: o, get: c } = St(s);
        let d = o.call(s, i);
        d ? We(s, o, i) : (i = b(i), d = o.call(s, i));
        const u = c.call(s, i);
        return s.set(i, a), d ? L(a, u) && q(s, "set", i, a, u) : q(s, "add", i, a), this;
      },
      delete(i) {
        const a = b(this), { has: s, get: o } = St(a);
        let c = s.call(a, i);
        c ? We(a, s, i) : (i = b(i), c = s.call(a, i));
        const d = o ? o.call(a, i) : void 0, u = a.delete(i);
        return c && q(a, "delete", i, void 0, d), u;
      },
      clear() {
        const i = b(this), a = i.size !== 0, s = dt(i) ? new Map(i) : new Set(i), o = i.clear();
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
    n[i] = ns(i, t);
  }), n;
}
function Yn(t, e) {
  const n = rs(t);
  return (r, i, a) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? r : Reflect.get(
    oe(n, i) && i in r ? n : r,
    i,
    a
  );
}
var is = {
  get: /* @__PURE__ */ Yn(!1)
}, ss = {
  get: /* @__PURE__ */ Yn(!0)
};
function We(t, e, n) {
  const r = b(n);
  if (r !== n && e.call(t, r)) {
    const i = Hn(t);
    W(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var Gn = /* @__PURE__ */ new WeakMap(), as = /* @__PURE__ */ new WeakMap(), Xn = /* @__PURE__ */ new WeakMap(), os = /* @__PURE__ */ new WeakMap();
function cs(t) {
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
  return /* @__PURE__ */ z(t) ? t : Zn(
    t,
    !1,
    ts,
    is,
    Gn
  );
}
function le(t) {
  return Zn(
    t,
    !0,
    es,
    ss,
    Xn
  );
}
function Zn(t, e, n, r, i) {
  if (!gt(t))
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
  const s = cs(Hn(t));
  if (s === 0)
    return t;
  const o = new Proxy(
    t,
    s === 2 ? r : n
  );
  return i.set(t, o), o;
}
function tr(t) {
  return /* @__PURE__ */ z(t) ? /* @__PURE__ */ tr(t.__v_raw) : !!(t && t.__v_isReactive);
}
function z(t) {
  return !!(t && t.__v_isReadonly);
}
function U(t) {
  return !!(t && t.__v_isShallow);
}
function ds(t) {
  return t ? !!t.__v_raw : !1;
}
function b(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ b(e) : t;
}
var V = (t) => gt(t) ? /* @__PURE__ */ De(t) : t, xt = (t) => gt(t) ? /* @__PURE__ */ le(t) : t;
function ft(t) {
  return t ? t.__v_isRef === !0 : !1;
}
O("nextTick", () => Ee);
O("dispatch", (t) => ct.bind(ct, t));
O("watch", (t, { evaluateLater: e, cleanup: n }) => (r, i) => {
  let a = e(r), o = Ye(() => {
    let c;
    return a((d) => c = d), c;
  }, i);
  n(o);
});
O("store", ki);
O("data", (t) => sn(t));
O("root", (t) => Dt(t));
O("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = H(us(t))), t._x_refs_proxy));
function us(t) {
  let e = [];
  return R(t, (n) => {
    n._x_refs && e.push(n._x_refs);
  }), e;
}
var Wt = {};
function er(t) {
  return Wt[t] || (Wt[t] = 0), ++Wt[t];
}
function ls(t, e) {
  return R(t, (n) => {
    if (n._x_ids && n._x_ids[e])
      return !0;
  });
}
function fs(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = er(e));
}
O("id", (t, { cleanup: e }) => (n, r = null) => {
  let i = `${n}${r ? `-${r}` : ""}`;
  return ps(t, i, e, () => {
    let a = ls(t, n), s = a ? a._x_ids[n] : er(n);
    return r ? `${n}-${s}-${r}` : `${n}-${s}`;
  });
});
Nt((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function ps(t, e, n, r) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let i = r();
  return t._x_id[e] = i, n(() => {
    delete t._x_id[e];
  }), i;
}
O("el", (t) => t);
nr("Focus", "focus", "focus");
nr("Persist", "persist", "persist");
function nr(t, e, n) {
  O(e, (r) => A(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
g("modelable", (t, { expression: e }, { effect: n, evaluateLater: r, cleanup: i }) => {
  let a = r(e), s = () => {
    let u;
    return a((l) => u = l), u;
  }, o = r(`${e} = __placeholder`), c = (u) => o(() => {
  }, { scope: { __placeholder: u } }), d = s();
  c(d), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let u = t._x_model.get, l = t._x_model.setWithModifiers, h = Ln(
      {
        get() {
          return u();
        },
        set(_) {
          l(_);
        }
      },
      {
        get() {
          return s();
        },
        set(_) {
          c(_);
        }
      }
    );
    i(h);
  });
});
g("teleport", (t, { modifiers: e, expression: n }, { cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && A("x-teleport can only be used on a <template> tag", t);
  let i = ze(n), a = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = a, a._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), a.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((o) => {
    a.addEventListener(o, (c) => {
      c.stopPropagation(), t.dispatchEvent(new c.constructor(c.type, c));
    });
  }), yt(a, {}, t);
  let s = (o, c, d) => {
    d.includes("prepend") ? c.parentNode.insertBefore(o, c) : d.includes("append") ? c.parentNode.insertBefore(o, c.nextSibling) : c.appendChild(o);
  };
  v(() => {
    I(() => {
      s(a, i, e), P(a);
    })();
  }), t._x_teleportPutBack = () => {
    let o = ze(n);
    v(() => {
      s(t._x_teleport, o, e);
    });
  }, r(
    () => v(() => {
      a.remove(), Q(a);
    })
  );
});
var bs = document.createElement("div");
function ze(t) {
  let e = I(() => document.querySelector(t), () => bs)();
  return e || A(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var rr = () => {
};
rr.inline = (t, { modifiers: e }, { cleanup: n }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
g("ignore", rr);
g("effect", I((t, { expression: e }, { effect: n }) => {
  n(y(t, e));
}));
function X(t, e, n, r) {
  let i = t, a = (c) => r(c), s = {}, o = (c, d) => (u) => d(c, u);
  return n.includes("dot") && (e = hs(e)), n.includes("camel") && (e = _s(e)), n.includes("capture") && (s.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("passive") && (s.passive = n[n.indexOf("passive") + 1] !== "false"), a = ir(n, a), n.includes("prevent") && (a = o(a, (c, d) => {
    d.preventDefault(), c(d);
  })), n.includes("stop") && (a = o(a, (c, d) => {
    d.stopPropagation(), c(d);
  })), n.includes("once") && (a = o(a, (c, d) => {
    c(d), i.removeEventListener(e, a, s);
  })), (n.includes("away") || n.includes("outside")) && (i = document, a = o(a, (c, d) => {
    t.contains(d.target) || d.target.isConnected !== !1 && (t.offsetWidth < 1 && t.offsetHeight < 1 || t._x_isShown !== !1 && c(d));
  })), n.includes("self") && (a = o(a, (c, d) => {
    d.target === t && c(d);
  })), e === "submit" && (a = o(a, (c, d) => {
    d.target._x_pendingModelUpdates && d.target._x_pendingModelUpdates.forEach((u) => u()), c(d);
  })), (gs(e) || sr(e)) && (a = o(a, (c, d) => {
    ms(d, n) || c(d);
  })), i.addEventListener(e, a, s), () => {
    i.removeEventListener(e, a, s);
  };
}
function ir(t, e) {
  if (t.includes("debounce")) {
    let n = t[t.indexOf("debounce") + 1] || "invalid-wait", r = qt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = In(e, r);
  }
  if (t.includes("throttle")) {
    let n = t[t.indexOf("throttle") + 1] || "invalid-wait", r = qt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = Nn(e, r);
  }
  return e;
}
function hs(t) {
  return t.replace(/-/g, ".");
}
function _s(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function qt(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function vs(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function gs(t) {
  return ["keydown", "keyup"].includes(t);
}
function sr(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function ms(t, e) {
  let n = e.filter((a) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(a));
  if (n.includes("debounce")) {
    let a = n.indexOf("debounce");
    n.splice(a, qt((n[a + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let a = n.indexOf("throttle");
    n.splice(a, qt((n[a + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Ue(t.key).includes(n[0]))
    return !1;
  const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((a) => n.includes(a));
  return n = n.filter((a) => !i.includes(a)), !(i.length > 0 && i.filter((s) => ((s === "cmd" || s === "super") && (s = "meta"), t[`${s}Key`])).length === i.length && (sr(t.type) || Ue(t.key).includes(n[0])));
}
function Ue(t) {
  if (!t)
    return [];
  t = vs(t);
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
g("model", (t, { modifiers: e, expression: n }, { effect: r, cleanup: i }) => {
  let a = t;
  e.includes("parent") && (a = R(t, (f) => f !== t));
  let s = y(a, n), o;
  typeof n == "string" ? o = y(a, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = y(a, `${n()} = __placeholder`) : o = () => {
  };
  let c = () => {
    let f;
    return s((m) => f = m), Ve(f) ? f.get() : f;
  }, d = (f) => {
    let m;
    s((x) => m = x), Ve(m) ? m.set(f) : o(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && t.type === "radio" && v(() => {
    t.hasAttribute("name") || t.setAttribute("name", n);
  });
  let u = e.includes("change") || e.includes("lazy"), l = e.includes("blur"), h = e.includes("enter"), _ = u || l || h, k;
  if (D)
    k = () => {
    };
  else if (_) {
    let f = [], m = (x) => d(Et(t, e, x, c()));
    if (u && f.push(X(t, "change", e, m)), l && (f.push(X(t, "blur", e, m)), t.form)) {
      let x = t.form, Y = () => m({ target: t });
      x._x_pendingModelUpdates || (x._x_pendingModelUpdates = []), x._x_pendingModelUpdates.push(Y), i(() => {
        x._x_pendingModelUpdates && x._x_pendingModelUpdates.splice(x._x_pendingModelUpdates.indexOf(Y), 1);
      });
    }
    h && f.push(X(t, "keydown", e, (x) => {
      x.key === "Enter" && m(x);
    })), k = () => f.forEach((x) => x());
  } else {
    let f = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) ? "change" : "input";
    k = X(t, f, e, (m) => {
      d(Et(t, e, m, c()));
    });
  }
  if (e.includes("fill") && ([void 0, null, ""].includes(c()) || Rt(t) && Array.isArray(c()) || t.tagName.toLowerCase() === "select" && t.multiple) && d(
    Et(t, e, { target: t }, c())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = k, i(() => t._x_removeModelListeners.default()), t.form) {
    let f = X(t.form, "reset", [], (m) => {
      Ee(() => t._x_model && t._x_model.set(Et(t, e, { target: t }, c())));
    });
    i(() => f());
  }
  if (t._x_model = {
    get() {
      return c();
    },
    set(f) {
      d(f);
    },
    setWithModifiers: ir(e, d)
  }, t._x_forceModelUpdate = (f) => {
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), v(() => {
      Rt(t) ? Array.isArray(f) ? t.checked = f.some((m) => m == t.value) : t.checked = !!f : Ce(t) ? typeof f == "boolean" ? t.checked = kt(t.value) === f : t.checked = t.value == f : Pn(t, "value", f);
    });
  }, t.tagName === "SELECT") {
    let f = new MutationObserver(() => {
      t._x_forceModelUpdate(c());
    });
    f.observe(t, { childList: !0 }), i(() => f.disconnect());
  }
  r(() => {
    let f = c();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function Et(t, e, n, r) {
  return v(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Rt(t))
      if (Array.isArray(r)) {
        let i = null;
        return e.includes("number") ? i = zt(n.target.value) : e.includes("boolean") ? i = kt(n.target.value) : i = n.target.value, n.target.checked ? r.includes(i) ? r : r.concat([i]) : r.filter((a) => !xs(a, i));
      } else
        return n.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(n.target.selectedOptions).map((i) => {
          let a = i.value || i.text;
          return zt(a);
        }) : e.includes("boolean") ? Array.from(n.target.selectedOptions).map((i) => {
          let a = i.value || i.text;
          return kt(a);
        }) : Array.from(n.target.selectedOptions).map((i) => i.value || i.text);
      {
        let i;
        return Ce(t) ? n.target.checked ? i = n.target.value : i = r : i = n.target.value, e.includes("number") ? zt(i) : e.includes("boolean") ? kt(i) : e.includes("trim") ? i.trim() : i;
      }
    }
  });
}
function zt(t) {
  let e = t ? parseFloat(t) : null;
  return ys(e) ? e : t;
}
function xs(t, e) {
  return t == e;
}
function ys(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Ve(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
g("cloak", (t) => queueMicrotask(() => v(() => t.removeAttribute(nt("cloak")))));
An(() => `[${nt("init")}]`);
g("init", I((t, { expression: e }, { evaluate: n }) => typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)));
g("text", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
  let i = r(e);
  n(() => {
    i((a) => {
      v(() => {
        t.textContent = a;
      });
    });
  });
});
g("html", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
  let i = r(e);
  n(() => {
    i((a) => {
      v(() => {
        Array.from(t.children).forEach((s) => Q(s)), t.innerHTML = a ?? "", t._x_ignoreSelf = !0, P(t), delete t._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
we(_n(":", vn(nt("bind:"))));
var ar = (t, { value: e, modifiers: n, expression: r, original: i }, { effect: a, cleanup: s }) => {
  if (!e) {
    let c = {};
    Ti(c), y(t, r)((u) => {
      $n(t, u, i);
    }, { scope: c });
    return;
  }
  if (e === "key")
    return ws(t, r);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let o = y(t, r);
  a(() => o((c) => {
    c === void 0 && typeof r == "string" && r.match(/\./) && (c = ""), v(() => Pn(t, e, c, n));
  })), s(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
ar.inline = (t, { value: e, modifiers: n, expression: r }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: r, extract: !1 });
};
g("bind", ar);
function ws(t, e) {
  t._x_keyExpression = e;
}
En(() => `[${nt("data")}]`);
var N = /* @__PURE__ */ Symbol();
g("data", (t, { expression: e }, { cleanup: n }) => {
  if (Os(t))
    return;
  let r = t[N];
  if (r?.expression === e)
    return;
  e = e === "" ? "{}" : e;
  let i = {};
  pt(i, t);
  let a = {};
  Ri(a, i);
  let s = $(t, e, { scope: a });
  (s === void 0 || s === !0) && (s = {}), pt(s, t);
  let o;
  if (r?.reactiveData) {
    o = r.reactiveData, Ss(o, s);
    let d = { expression: e };
    t[N] = d, queueMicrotask(() => {
      t[N] === d && delete t[N];
    });
  } else
    o = tt(s);
  me(o, n);
  let c = yt(t, o);
  o.init && $(t, o.init), n(() => {
    o.destroy && $(t, o.destroy), c();
    let d = { reactiveData: o };
    t[N] = d, queueMicrotask(() => {
      t[N] === d && delete t[N];
    });
  });
});
function Ss(t, e) {
  Object.keys(e).forEach((n) => {
    let r = Object.getOwnPropertyDescriptor(e, n), i = Object.getOwnPropertyDescriptor(t, n);
    r.get || r.set || i?.get || i?.set ? (i && delete t[n], i || (t[n] = void 0), r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]) : t[n] = e[n];
  }), Object.keys(t).filter((n) => !Object.prototype.hasOwnProperty.call(e, n)).forEach((n) => delete t[n]);
}
Nt((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function Os(t) {
  return D ? ae ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
g("show", (t, { modifiers: e, expression: n }, { effect: r }) => {
  let i = y(t, n);
  t._x_doHide || (t._x_doHide = () => {
    v(() => {
      t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
    });
  }), t._x_doShow || (t._x_doShow = () => {
    v(() => {
      t.style.length === 1 && t.style.display === "none" ? t.removeAttribute("style") : t.style.removeProperty("display");
    });
  });
  let a = () => {
    t._x_doHide(), t._x_isShown = !1;
  }, s = () => {
    t._x_doShow(), t._x_isShown = !0;
  }, o = () => setTimeout(s), c = ie(
    (l) => l ? s() : a(),
    (l) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, l, s, a) : l ? o() : a();
    }
  ), d, u = !0;
  r(() => i((l) => {
    !u && l === d || (e.includes("immediate") && (l ? o() : a()), c(l), d = l, u = !1);
  }));
});
g("for", I((t, { expression: e }, { effect: n, cleanup: r }) => {
  let i = ks(e), a = y(t, i.items), s = y(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_lookup = /* @__PURE__ */ new Map(), n(() => As(t, i, a, s), { priority: "structural" }), r(() => {
    t._x_lookup.forEach(
      (o) => v(() => {
        Q(o), o.remove();
      })
    ), delete t._x_lookup, delete t._x_lastRenderedEl;
  });
}));
function Es(t) {
  return (e) => {
    Object.entries(e).forEach(([n, r]) => {
      t[n] = r;
    });
  };
}
function As(t, e, n, r) {
  n((i) => {
    Ts(i) && (i = Array.from({ length: i }, (d, u) => u + 1)), i == null && (i = []), i instanceof Set && (i = Array.from(i)), i instanceof Map && (i = Array.from(i));
    let a = t._x_lookup, s = /* @__PURE__ */ new Map();
    t._x_lookup = s;
    let o = Ms(i), c = Object.entries(i).map(([d, u]) => {
      o || (d = parseInt(d));
      let l = Cs(e, u, d, i), h;
      return r((_) => {
        typeof _ == "object" && A("x-for key cannot be an object, it must be a string or an integer", t), a.has(_) && (s.set(_, a.get(_)), a.delete(_)), h = _;
      }, { scope: { index: d, ...l } }), [h, l];
    });
    v(() => {
      a.forEach((l) => {
        Q(l), l.remove();
      });
      let d = /* @__PURE__ */ new Set(), u = t;
      c.forEach(([l, h]) => {
        if (s.has(l)) {
          let f = s.get(l);
          f._x_refreshXForScope(h), u.nextElementSibling !== f && (u.nextElementSibling && f.replaceWith(u.nextElementSibling), u.after(f)), u = f, f._x_currentIfEl && (f.nextElementSibling !== f._x_currentIfEl && u.after(f._x_currentIfEl), u = f._x_currentIfEl);
          return;
        }
        t.content.children.length > 1 && A("x-for templates require a single root element, additional elements will be ignored.", t);
        let _ = document.importNode(t.content, !0).firstElementChild, k = tt(h);
        yt(_, k, t), _._x_refreshXForScope = Es(k), s.set(l, _), d.add(_), u.after(_), u = _;
      }), d.forEach((l) => P(l)), u !== t ? t._x_lastRenderedEl = u : delete t._x_lastRenderedEl;
    });
  });
}
function ks(t) {
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
function Ts(t) {
  return typeof t != "object" && !isNaN(t);
}
function Ms(t) {
  return typeof t == "object" && !Array.isArray(t);
}
function or() {
}
or.inline = (t, { expression: e }, { cleanup: n }) => {
  let r = Dt(t);
  r && (r._x_refs || (r._x_refs = {}), r._x_refs[e] = t, n(() => delete r._x_refs[e]));
};
g("ref", or);
g("if", I((t, { expression: e }, { effect: n, cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && A("x-if can only be used on a <template> tag", t);
  let i = y(t, e), a = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let o = t.content.cloneNode(!0).firstElementChild;
    return yt(o, {}, t), v(() => {
      t.after(o), P(o);
    }), t._x_currentIfEl = o, t._x_lastRenderedEl = o, t._x_undoIf = () => {
      v(() => {
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
g("id", (t, { expression: e }, { evaluate: n }) => {
  n(e).forEach((i) => fs(t, i));
});
Nt((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
we(_n("@", vn(nt("on:"))));
g("on", I((t, { value: e, modifiers: n, expression: r }, { cleanup: i }) => {
  let a = r ? y(t, r) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let s = X(t, e, n, (o) => {
    a(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  i(() => s());
}));
Lt("Collapse", "collapse", "collapse");
Lt("Intersect", "intersect", "intersect");
Lt("Focus", "trap", "focus");
Lt("Mask", "mask", "mask");
function Lt(t, e, n) {
  g(e, (r) => A(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
rt.setEvaluator(Nr);
rt.setRawEvaluator(Br);
rt.setReactivityEngine({
  reactive: De,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (t, e = {}) => {
    let n;
    return n = Hi(t, {
      scheduler: () => {
        n && (e.scheduler ? e.scheduler(n) : n());
      }
    }), n;
  },
  release: Ki,
  raw: b
});
var Rs = rt, Ut = Rs;
const cr = "siteation.debugbar.v1";
function Ps() {
  const t = document.getElementById("siteation-debugbar-profile");
  if (!t) return {};
  try {
    return JSON.parse(t.textContent || "{}");
  } catch {
    return {};
  }
}
function qs() {
  const t = { open: !1, section: "overview" };
  try {
    return { ...t, ...JSON.parse(localStorage.getItem(cr) || "{}") };
  } catch {
    return t;
  }
}
function At(t, e, n) {
  const r = e.trim().toLowerCase();
  return r ? t.filter((i) => n.some(
    (a) => String(i[a] ?? "").toLowerCase().includes(r)
  )) : t;
}
function Ds() {
  return {
    profile: {},
    open: !1,
    section: "overview",
    queryFilter: "all",
    querySearch: "",
    eventFilter: "all",
    eventSearch: "",
    observerSearch: "",
    blockSearch: "",
    pluginSearch: "",
    init() {
      this.profile = Ps();
      const t = qs();
      this.open = t.open, this.section = t.section;
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
      return this.profile.sections?.[t]?.payload?.items || [];
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
    get metrics() {
      return this.profile.metrics || {};
    },
    /** @returns {Array<object>} */
    get visibleQueries() {
      const t = this.queryFilter === "slow" ? this.itemsOf("queries").filter((e) => e.slow) : this.itemsOf("queries");
      return At(t, this.querySearch, ["sql"]);
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const t = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((e) => e.observer_count === 0) : this.itemsOf("events");
      return At(t, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return At(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      return At(this.itemsOf("blocks"), this.blockSearch, ["name", "template", "class"]);
    },
    /** @returns {Array<object>} */
    get visiblePlugins() {
      const t = this.pluginSearch.trim().toLowerCase();
      return t ? this.itemsOf("interception").filter((e) => e.type.toLowerCase().includes(t) || e.plugins.some((n) => n.code.toLowerCase().includes(t) || n.class.toLowerCase().includes(t))) : this.itemsOf("interception");
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
    toggle() {
      this.open = !this.open, this.persist();
    },
    /** @param {string} section */
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
        localStorage.setItem(
          cr,
          JSON.stringify({ open: this.open, section: this.section })
        );
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

    <button type="button" class="ndb-metric" data-ndb-on:click="select('observers')">
      <span class="ndb-metric-key">Observers</span>
      <span class="ndb-metric-value">
        <span data-ndb-text="observers.count || 0"></span>
        <span class="ndb-dim">/ <span data-ndb-text="number(observers.duration_ms, 0)"></span> ms</span>
      </span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('blocks')">
      <span class="ndb-metric-key">Blocks</span>
      <span class="ndb-metric-value">
        <span data-ndb-text="blocks.unique_count || 0"></span>
        <span class="ndb-dim">/ <span data-ndb-text="number(blocks.duration_ms, 0)"></span> ms</span>
      </span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('cache')">
      <span class="ndb-metric-key">Cache</span>
      <span class="ndb-metric-value" data-ndb-bind:class="'is-' + cacheTone"
            data-ndb-text="cache.hit_rate === null ? '-' : number(cache.hit_rate, 0) + '%'"></span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key">Memory</span>
      <span class="ndb-metric-value">
        <span data-ndb-text="number(metrics.memory_peak_mb, 1)"></span> MB
      </span>
    </button>
  </div>

</div>
`, Ns = "data-ndb-", Ls = "siteation-debugbar";
function js(t) {
  const e = t.attachShadow({ mode: "open" }), n = t.dataset.css;
  if (n) {
    const i = document.createElement("link");
    i.rel = "stylesheet", i.href = n, e.append(i);
  }
  const r = document.createElement("div");
  return r.innerHTML = Is, e.append(...r.children), e.querySelector(".ndb");
}
const Vt = document.getElementById(Ls);
if (Vt && !Vt.shadowRoot) {
  const t = js(Vt);
  Ut.prefix(Ns), Ut.data("debugBar", Ds), t && Ut.initTree(t), Ie && (window.Alpine = Ie);
}
