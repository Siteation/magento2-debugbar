const De = window.Alpine;
var Yt = !1, Zt = !1, P = [], Gt = -1, Tt = !1, he = !1;
function hi(t) {
  vi(t);
}
function bi() {
  he = !0;
}
function gi() {
  he = !1, Xe();
}
function vi(t) {
  P.includes(t) || (P.push(t), t._x_schedulerPriority !== void 0 && (Tt = !0)), Xe();
}
function mi(t) {
  let e = P.indexOf(t);
  e !== -1 && e > Gt && P.splice(e, 1);
}
function Xe() {
  if (!Zt && !Yt) {
    if (he)
      return;
    Yt = !0, queueMicrotask(_i);
  }
}
function _i() {
  Yt = !1, Zt = !0;
  for (let t = 0; t < P.length; t++)
    Tt && yi(t), P[t](), Gt = t;
  P.length = 0, Gt = -1, Tt = !1, Zt = !1;
}
function yi(t) {
  let e = /* @__PURE__ */ new Map(), n = P.slice(t).sort((r, i) => xi(r, i, e));
  for (let r = 0; r < n.length; r++)
    P[t + r] = n[r];
  Tt = !1;
}
function xi(t, e, n) {
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
var et, Q, nt, tn, wi = 0, Xt = !0;
function Si(t) {
  Xt = !1, t(), Xt = !0;
}
function Ei(t) {
  et = t.reactive, nt = t.release, Q = (e) => t.effect(e, { scheduler: (n) => {
    Xt ? hi(n) : n();
  } }), tn = t.raw;
}
function Le(t) {
  Q = t;
}
function Oi(t) {
  let e = () => {
  };
  return [(r, i) => {
    let s = i?.priority === "structural" ? wi++ : void 0, a = Q(r);
    return s !== void 0 && a !== void 0 && (a._x_schedulerPriority = { el: t, order: s }), t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((o) => o());
    }), t._x_effects.add(a), e = () => {
      a !== void 0 && (t._x_effects.delete(a), nt(a));
    }, a;
  }, () => {
    e();
  }];
}
function en(t, e) {
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
async function ki(t) {
  bi();
  try {
    await t(), await Promise.resolve();
  } finally {
    gi();
  }
}
var nn = [], rn = [], sn = [];
function Ai(t) {
  sn.push(t);
}
function be(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, rn.push(e));
}
function an(t) {
  nn.push(t);
}
function on(t, e, n) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n);
}
function dn(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([n, r]) => {
    (e === void 0 || e.includes(n)) && (r.forEach((i) => i()), delete t._x_attributeCleanups[n]);
  });
}
function Mi(t) {
  for (t._x_effects?.forEach(mi); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var ge = new MutationObserver(ye), ve = !1;
function me() {
  ge.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), ve = !0;
}
function cn() {
  Ti(), ge.disconnect(), ve = !1;
}
var st = [];
function Ti() {
  let t = ge.takeRecords();
  st.push(() => t.length > 0 && ye(t));
  let e = st.length;
  queueMicrotask(() => {
    if (st.length === e)
      for (; st.length > 0; )
        st.shift()();
  });
}
function v(t) {
  if (!ve)
    return t();
  cn();
  let e = t();
  return me(), e;
}
var _e = !1, Ct = [];
function Ci() {
  _e = !0;
}
function Pi() {
  _e = !1, ye(Ct), Ct = [];
}
function ye(t) {
  if (_e) {
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
    dn(a, s);
  }), r.forEach((s, a) => {
    nn.forEach((o) => o(a, s));
  });
  for (let s of n)
    e.some((a) => a.contains(s)) || rn.forEach((a) => a(s));
  for (let s of e)
    s.isConnected && sn.forEach((a) => a(s));
  e = null, n = null, r = null, i = null;
}
function ln(t) {
  return W(H(t));
}
function St(t, e, n) {
  return t._x_dataStack = [e, ...H(n || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((r) => r !== e);
  };
}
function H(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? H(t.host) : t.parentNode ? H(t.parentNode) : [];
}
function W(t) {
  return new Proxy({ objects: t }, Ri);
}
function un(t, e) {
  return t === null || t === Object.prototype ? null : Object.prototype.hasOwnProperty.call(t, e) ? t : un(Object.getPrototypeOf(t), e);
}
var Ri = {
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
    return e == "toJSON" ? qi : Reflect.get(
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
      if (i = un(a, e), i)
        break;
    i || (i = t[t.length - 1]);
    const s = Object.getOwnPropertyDescriptor(i, e);
    return s?.set && s?.get ? s.set.call(r, n) || !0 : Reflect.set(i, e, n);
  }
};
function qi() {
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
function fn(t, e = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(r, i, s, a) {
      return t(this.initialValue, () => Ii(r, i), (o) => te(r, i, o), i, s, a);
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
function Ii(t, e) {
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
var pn = {};
function O(t, e) {
  pn[t] = e;
}
function bt(t, e) {
  let n = $i(e);
  return Object.entries(pn).forEach(([r, i]) => {
    Object.defineProperty(t, `$${r}`, {
      get() {
        return i(e, n);
      },
      enumerable: !1
    });
  }), t;
}
function $i(t) {
  let [e, n] = yn(t), r = { interceptor: fn, ...e };
  return be(t, n), r;
}
function Fi(t, e, n, ...r) {
  try {
    return n(...r);
  } catch (i) {
    gt(i, t, e);
  }
}
function gt(...t) {
  return hn(...t);
}
var hn = Ni;
function Di(t) {
  hn = t;
}
function Ni(t, e, n = void 0) {
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
function bn(t) {
  let e = tt;
  tt = !1;
  let n = t();
  return tt = e, n;
}
function j(t, e, n = {}) {
  let r;
  return w(t, e)((i) => r = i, n), r;
}
function w(...t) {
  return gn(...t);
}
var gn = () => {
};
function Li(t) {
  gn = t;
}
var vn;
function ji(t) {
  vn = t;
}
function Bi(t, e) {
  let n = {};
  bt(n, t);
  let r = [n, ...H(t)], i = typeof e == "function" ? Hi(r, e) : Ki(r, e, t);
  return Fi.bind(null, t, e, i);
}
function Hi(t, e) {
  return (n = () => {
  }, { scope: r = {}, params: i = [], context: s } = {}) => {
    if (!tt) {
      vt(n, e, W([r, ...t]), i);
      return;
    }
    let a = e.apply(W([r, ...t]), i);
    vt(n, a);
  };
}
var Bt = {};
function Wi(t, e) {
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
      return gt(a, e, t), Promise.resolve();
    }
  })();
  return Bt[t] = s, s;
}
function Ki(t, e, n) {
  let r = Wi(e, n);
  return (i = () => {
  }, { scope: s = {}, params: a = [], context: o } = {}) => {
    r.result = void 0, r.finished = !1;
    let d = W([s, ...t]);
    if (typeof r == "function") {
      let c = r.call(o, r, d).catch((l) => gt(l, n, e));
      r.finished ? (vt(i, r.result, d, a, n), r.result = void 0) : c.then((l) => {
        vt(i, l, d, a, n);
      }).catch((l) => gt(l, n, e)).finally(() => r.result = void 0);
    }
  };
}
function vt(t, e, n, r, i) {
  if (tt && typeof e == "function") {
    let s = e.apply(n, r);
    s instanceof Promise ? s.then((a) => vt(t, a, n, r)).catch((a) => gt(a, i, e)) : t(s);
  } else typeof e == "object" && e instanceof Promise ? e.then((s) => t(s)) : t(e);
}
function Ui(...t) {
  return vn(...t);
}
function zi(t, e, n = {}) {
  let r = {};
  bt(r, t);
  let i = [r, ...H(t)], s = W([n.scope ?? {}, ...i]), a = n.params ?? [];
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
function Vi(t) {
  we = t;
}
var Pt = {};
function m(t, e) {
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
function Ji(t) {
  return Object.keys(Pt).includes(t);
}
function Se(t, e, n) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let s = Object.entries(t._x_virtualDirectives).map(([o, d]) => ({ name: o, value: d })), a = mn(s);
    s = s.map((o) => a.find((d) => d.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), e = e.concat(s);
  }
  let r = {};
  return e.map(Sn((s, a) => r[s] = a)).filter(On).map(Zi(r, n)).sort(Gi).map((s) => Yi(t, s));
}
function mn(t) {
  return Array.from(t).map(Sn()).filter((e) => !On(e));
}
var ee = !1, ct = /* @__PURE__ */ new Map(), _n = /* @__PURE__ */ Symbol();
function Qi(t) {
  ee = !0;
  let e = /* @__PURE__ */ Symbol();
  _n = e, ct.set(e, []);
  let n = () => {
    for (; ct.get(e).length; )
      ct.get(e).shift()();
    ct.delete(e);
  }, r = () => {
    ee = !1, n();
  };
  t(n), r();
}
function yn(t) {
  let e = [], n = (o) => e.push(o), [r, i] = Oi(t);
  return e.push(i), [{
    Alpine: rt,
    effect: r,
    cleanup: n,
    evaluateLater: w.bind(w, t),
    evaluate: j.bind(j, t)
  }, () => e.forEach((o) => o())];
}
function Yi(t, e) {
  let n = () => {
  }, r = Pt[e.type] || n, [i, s] = yn(t);
  on(t, e.original, s);
  let a = () => {
    t._x_ignore || t._x_ignoreSelf || (r.inline && r.inline(t, e, i), r = r.bind(r, t, e, i), ee ? ct.get(_n).push(r) : r());
  };
  return a.runCleanups = s, a;
}
var xn = (t, e) => ({ name: n, value: r }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: r }), wn = (t) => t;
function Sn(t = () => {
}) {
  return ({ name: e, value: n }) => {
    let { name: r, value: i } = En.reduce((s, a) => a(s), { name: e, value: n });
    return r !== e && t(r, e), { name: r, value: i };
  };
}
var En = [];
function Ee(t) {
  En.push(t);
}
function On({ name: t }) {
  return kn().test(t);
}
var kn = () => new RegExp(`^${we}([^:^.]+)\\b`);
function Zi(t, e) {
  return ({ name: n, value: r }) => {
    n === r && (r = "");
    let i = n.match(kn()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = e || t[n] || n;
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
function Gi(t, e) {
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
function Xi() {
  je && A("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), je = !0, document.body || A("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), lt(document, "alpine:init"), lt(document, "alpine:initializing"), me(), Ai((e) => q(e, K)), be((e) => Y(e)), an((e, n) => {
    Se(e, n).forEach((r) => r());
  });
  let t = (e) => !Ft(e.parentElement, !0);
  Array.from(document.querySelectorAll(Tn().join(","))).filter(t).forEach((e) => {
    q(e);
  }), lt(document, "alpine:initialized"), setTimeout(() => {
    ir();
  });
}
var Oe = [], An = [];
function Mn() {
  return Oe.map((t) => t());
}
function Tn() {
  return Oe.concat(An).map((t) => t());
}
function Cn(t) {
  Oe.push(t);
}
function Pn(t) {
  An.push(t);
}
function Ft(t, e = !1) {
  return R(t, (n) => {
    if ((e ? Tn() : Mn()).some((i) => n.matches(i)))
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
function tr(t) {
  return Mn().some((e) => t.matches(e));
}
var Rn = [];
function er(t) {
  Rn.push(t);
}
var nr = 1;
function q(t, e = K, n = () => {
}) {
  R(t, (r) => r._x_ignore) || Qi(() => {
    e(t, (r, i) => {
      r._x_marker || (n(r, i), Rn.forEach((s) => s(r, i)), Se(r, r.attributes).forEach((s) => s()), r._x_ignore || (r._x_marker = nr++), r._x_ignore && i());
    });
  });
}
function Y(t, e = K) {
  e(t, (n) => {
    Mi(n), dn(n), delete n._x_marker;
  });
}
function ir() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, n, r]) => {
    Ji(n) || r.some((i) => {
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
      re();
    });
  }), new Promise((e) => {
    ie.push(() => {
      t(), e();
    });
  });
}
function re() {
  for (ke = !1; ie.length; )
    ie.shift()();
}
function rr() {
  ke = !0;
}
function Me(t, e) {
  return Array.isArray(e) ? Be(t, e.join(" ")) : typeof e == "object" && e !== null ? sr(t, e) : typeof e == "function" ? Me(t, e()) : Be(t, e);
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
function sr(t, e) {
  let n = Object.entries(e).flatMap(([a, o]) => o ? se(a) : !1).filter(Boolean), r = Object.entries(e).flatMap(([a, o]) => o ? !1 : se(a)).filter(Boolean), i = [], s = [];
  return r.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), s.push(a));
  }), n.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), i.push(a));
  }), () => {
    s.forEach((a) => t.classList.add(a)), i.forEach((a) => t.classList.remove(a));
  };
}
function Dt(t, e) {
  return typeof e == "object" && e !== null ? ar(t, e) : or(t, e);
}
function ar(t, e) {
  let n = {};
  return Object.entries(e).forEach(([r, i]) => {
    n[r] = t.style[r], r.startsWith("--") || (r = dr(r)), t.style.setProperty(r, i);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    Dt(t, n);
  };
}
function or(t, e) {
  let n = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", n || "");
  };
}
function dr(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ae(t, e = () => {
}) {
  let n = !1;
  return function() {
    n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments));
  };
}
m("transition", (t, { value: e, modifiers: n, expression: r }, { evaluate: i }) => {
  typeof r == "function" && (r = i(r)), r !== !1 && (!r || typeof r == "boolean" ? lr(t, n, e) : cr(t, r, e));
});
function cr(t, e, n) {
  qn(t, Me, ""), {
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
function lr(t, e, n) {
  qn(t, Dt);
  let r = !e.includes("in") && !e.includes("out") && !n, i = r || e.includes("in") || ["enter"].includes(n), s = r || e.includes("out") || ["leave"].includes(n);
  e.includes("in") && !r && (e = e.filter((y, Z) => Z < e.indexOf("out"))), e.includes("out") && !r && (e = e.filter((y, Z) => Z > e.indexOf("out")));
  let a = !e.includes("opacity") && !e.includes("scale"), o = a || e.includes("opacity"), d = a || e.includes("scale"), c = o ? 0 : 1, l = d ? at(e, "scale", 95) / 100 : 1, u = at(e, "delay", 0) / 1e3, b = at(e, "origin", "center"), g = "opacity, transform", M = at(e, "duration", 150) / 1e3, f = at(e, "duration", 75) / 1e3, _ = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  i && (t._x_transition.enter.during = {
    transformOrigin: b,
    transitionDelay: `${u}s`,
    transitionProperty: g,
    transitionDuration: `${M}s`,
    transitionTimingFunction: _
  }, t._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${l})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (t._x_transition.leave.during = {
    transformOrigin: b,
    transitionDelay: `${u}s`,
    transitionProperty: g,
    transitionDuration: `${f}s`,
    transitionTimingFunction: _
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${l})`
  });
}
function qn(t, e, n = {}) {
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
    let a = In(t);
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
function In(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : In(e);
}
function oe(t, e, { during: n, start: r, end: i } = {}, s = () => {
}, a = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(r).length === 0 && Object.keys(i).length === 0) {
    s(), a();
    return;
  }
  let o, d, c;
  ur(t, {
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
function ur(t, e) {
  let n, r, i, s = ae(() => {
    v(() => {
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
  }, v(() => {
    e.start(), e.during();
  }), rr(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), v(() => {
      e.before();
    }), r = !0, requestAnimationFrame(() => {
      n || (v(() => {
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
function F(t, e = () => {
}) {
  return (...n) => $ ? e(...n) : t(...n);
}
function fr(t) {
  return (...e) => $ && t(...e);
}
var $n = [];
function Nt(t) {
  $n.push(t);
}
function pr(t, e) {
  $n.forEach((n) => n(t, e)), $ = !0, Fn(() => {
    q(e, (n, r) => {
      r(n, () => {
      });
    });
  }), $ = !1;
}
var de = !1;
function hr(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), $ = !0, de = !0, Fn(() => {
    br(e);
  }), $ = !1, de = !1;
}
function br(t) {
  let e = !1;
  q(t, (r, i) => {
    K(r, (s, a) => {
      if (e && tr(s))
        return a();
      e = !0, i(s, a);
    });
  });
}
function Fn(t) {
  let e = Q;
  Le((n, r) => {
    let i = e(n);
    return nt(i), () => {
    };
  }), t(), Le(e);
}
function Dn(t, e, n, r = []) {
  switch (t._x_bindings || (t._x_bindings = et({})), t._x_bindings[e] = n, e = r.includes("camel") ? Sr(e) : e, e) {
    case "value":
      gr(t, n);
      break;
    case "style":
      mr(t, n);
      break;
    case "class":
      vr(t, n);
      break;
    case "selected":
    case "checked":
      _r(t, e, n);
      break;
    default:
      Te(t, e, n);
      break;
  }
}
function gr(t, e) {
  if (Ce(t))
    t.attributes.value === void 0 && (t.value = e);
  else if (Rt(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((n) => Er(n, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    wr(t, e);
  else if (t.tagName === "OPTION")
    Te(t, "value", e);
  else {
    if (t.value === e && (typeof e != "object" || e === null))
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function vr(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = Me(t, e);
}
function mr(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = Dt(t, e);
}
function _r(t, e, n) {
  Te(t, e, n), xr(t, e, n);
}
function Te(t, e, n) {
  [null, void 0, !1].includes(n) && kr(e) ? t.removeAttribute(e) : (Nn(e) && (n = e), Ar(n) && (n = JSON.stringify(n)), yr(t, e, n));
}
function yr(t, e, n) {
  t.getAttribute(e) != n && t.setAttribute(e, n);
}
function xr(t, e, n) {
  t[e] !== n && (t[e] = n);
}
function wr(t, e) {
  const n = [].concat(e).map((r) => r + "");
  Array.from(t.options).forEach((r) => {
    r.selected = n.includes(r.value);
  });
}
function Sr(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function Er(t, e) {
  return t == e;
}
function Mt(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var Or = /* @__PURE__ */ new Set([
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
function Nn(t) {
  return Or.has(t);
}
function kr(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function Ar(t) {
  return typeof t == "object" && t !== null;
}
function Mr(t, e, n) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : Ln(t, e, n);
}
function Tr(t, e, n, r = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let i = t._x_inlineBindings[e];
    return i.extract = r, bn(() => j(t, i.expression));
  }
  return Ln(t, e, n);
}
function Ln(t, e, n) {
  let r = t.getAttribute(e);
  return r === null ? typeof n == "function" ? n() : n : r === "" ? !0 : Nn(e) ? !![e, "true"].includes(r) : r;
}
function Rt(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function Ce(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function jn(t, e) {
  let n;
  return function() {
    const r = this, i = arguments, s = function() {
      n = null, t.apply(r, i);
    };
    clearTimeout(n), n = setTimeout(s, e);
  };
}
function Bn(t, e) {
  let n;
  return function() {
    let r = this, i = arguments;
    n || (t.apply(r, i), n = !0, setTimeout(() => n = !1, e));
  };
}
function Hn({ get: t, set: e }, { get: n, set: r }) {
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
function Cr(t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => n(rt));
}
var C = {}, He = !1;
function Pr(t, e) {
  if (He || (C = et(C), He = !0), e === void 0)
    return C[t];
  C[t] = e, typeof e == "object" && e !== null && e._x_interceptor ? C[t] = e.initialize(C, t, t, () => {
  }) : xe(C[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && C[t].init();
}
function Rr() {
  return C;
}
var Wn = {};
function qr(t, e) {
  let n = typeof e != "function" ? () => e : e;
  return t instanceof Element ? Kn(t, n()) : (Wn[t] = n, () => {
  });
}
function Ir(t) {
  return Object.entries(Wn).forEach(([e, n]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...r) => n(...r);
      }
    });
  }), t;
}
function Kn(t, e, n) {
  let r = [];
  for (; r.length; )
    r.pop()();
  let i = Object.entries(e).map(([a, o]) => ({ name: a, value: o })), s = mn(i);
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
var Un = {};
function $r(t, e) {
  Un[t] = e;
}
function Fr(t, e) {
  return Object.entries(Un).forEach(([n, r]) => {
    Object.defineProperty(t, n, {
      get() {
        return (...i) => r.bind(e)(...i);
      },
      enumerable: !1
    });
  }), t;
}
var Dr = {
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
    return tn;
  },
  get transaction() {
    return ki;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Pi,
  dontAutoEvaluateFunctions: bn,
  disableEffectScheduling: Si,
  startObservingMutations: me,
  stopObservingMutations: cn,
  setReactivityEngine: Ei,
  onAttributeRemoved: on,
  onAttributesAdded: an,
  closestDataStack: H,
  skipDuringClone: F,
  onlyDuringClone: fr,
  addRootSelector: Cn,
  addInitSelector: Pn,
  setErrorHandler: Di,
  interceptClone: Nt,
  addScopeToNode: St,
  deferMutations: Ci,
  mapAttributes: Ee,
  evaluateLater: w,
  interceptInit: er,
  initInterceptors: xe,
  injectMagics: bt,
  setEvaluator: Li,
  setRawEvaluator: ji,
  mergeProxies: W,
  extractProp: Tr,
  findClosest: R,
  onElRemoved: be,
  closestRoot: Ft,
  destroyTree: Y,
  interceptor: fn,
  // INTERNAL: not public API and is subject to change without major release.
  transition: oe,
  // INTERNAL
  setStyles: Dt,
  // INTERNAL
  mutateDom: v,
  directive: m,
  entangle: Hn,
  throttle: Bn,
  debounce: jn,
  evaluate: j,
  evaluateRaw: Ui,
  initTree: q,
  nextTick: Ae,
  prefixed: it,
  prefix: Vi,
  plugin: Cr,
  magic: O,
  store: Pr,
  start: Xi,
  clone: hr,
  // INTERNAL
  cloneNode: pr,
  // INTERNAL
  bound: Mr,
  $data: ln,
  watch: en,
  walk: K,
  data: $r,
  bind: qr
}, rt = Dr;
function Nr(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(","))
    e[n] = 1;
  return (n) => n in e;
}
var mt = Object.assign, Lr = Object.prototype.hasOwnProperty, ce = (t, e) => Lr.call(t, e), _t = Array.isArray, ut = (t) => zn(t) === "[object Map]", jr = (t) => typeof t == "string", Et = (t) => typeof t == "symbol", yt = (t) => t !== null && typeof t == "object", Br = Object.prototype.toString, zn = (t) => Br.call(t), Vn = (t) => zn(t).slice(8, -1), Pe = (t) => jr(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Hr = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, Wr = Hr((t) => t.charAt(0).toUpperCase() + t.slice(1)), N = (t, e) => !Object.is(t, e);
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
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Kr(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ke(this), Qn(this);
    const t = p, e = E;
    p = this, E = !0;
    try {
      return this.fn();
    } finally {
      p !== this && U(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Yn(this), p = t, E = e, this.flags &= -3;
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
}, Jn = 0, ft, pt;
function Kr(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = pt, pt = t;
    return;
  }
  t.next = ft, ft = t;
}
function Re() {
  Jn++;
}
function qe() {
  if (--Jn > 0)
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
function Qn(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function Yn(t) {
  let e, n = t.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), Ie(r), zr(r)) : e = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  t.deps = e, t.depsTail = n;
}
function le(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (Ur(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function Ur(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === qt) || (t.globalVersion = qt, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !le(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = p, r = E;
  p = t, E = !0;
  try {
    Qn(t);
    const i = t.fn(t._value);
    (e.version === 0 || N(i, t._value)) && (t.flags |= 128, t._value = i, e.version++);
  } catch (i) {
    throw e.version++, i;
  } finally {
    p = n, E = r, Yn(t), t.flags &= -3;
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
function zr(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
function Vr(t, e) {
  t.effect instanceof We && (t = t.effect.fn);
  const n = new We(t);
  e && mt(n, e);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const r = n.run.bind(n);
  return r.effect = n, r;
}
function Jr(t) {
  t.effect.stop();
}
var E = !0, Zn = [];
function Qr() {
  Zn.push(E), E = !1;
}
function Yr() {
  const t = Zn.pop();
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
var qt = 0, Zr = class {
  constructor(t, e) {
    this.sub = t, this.dep = e, this.version = e.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, Gr = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!p || !E || p === this.computed)
      return;
    let e = this.activeLink;
    if (e === void 0 || e.sub !== p)
      e = this.activeLink = new Zr(p, this), p.deps ? (e.prevDep = p.depsTail, p.depsTail.nextDep = e, p.depsTail = e) : p.deps = p.depsTail = e, Gn(e);
    else if (e.version === -1 && (e.version = this.version, e.nextDep)) {
      const n = e.nextDep;
      n.prevDep = e.prevDep, e.prevDep && (e.prevDep.nextDep = n), e.prevDep = p.depsTail, e.nextDep = void 0, p.depsTail.nextDep = e, p.depsTail = e, p.deps === e && (p.deps = n);
    }
    return p.onTrack && p.onTrack(
      mt(
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
          mt(
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
function Gn(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let r = e.deps; r; r = r.nextDep)
        Gn(r);
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
    let r = ue.get(t);
    r || ue.set(t, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Gr()), i.map = r, i.key = n), i.track({
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
    const d = _t(t), c = d && Pe(n);
    if (d && n === "length") {
      const l = Number(r);
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
  return z(t) ? si(t) ? wt(J(e)) : wt(e) : J(e);
}
var Xr = {
  __proto__: null,
  [Symbol.iterator]() {
    return Kt(this, Symbol.iterator, (t) => k(this, t));
  },
  concat(...t) {
    return G(this).concat(
      ...t.map((e) => _t(e) ? G(e) : e)
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
      (n) => n.map((r) => k(this, r)),
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
  const r = $e(t), i = r[e]();
  return r !== t && !V(t) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = n(s.value)), s;
  }), i;
}
var ts = Array.prototype;
function T(t, e, n, r, i, s) {
  const a = $e(t), o = a !== t && !V(t), d = a[e];
  if (d !== ts[e]) {
    const u = d.apply(t, s);
    return o ? J(u) : u;
  }
  let c = n;
  a !== t && (o ? c = function(u, b) {
    return n.call(this, k(t, u), b, t);
  } : n.length > 2 && (c = function(u, b) {
    return n.call(this, u, b, t);
  }));
  const l = d.call(a, c, r);
  return o && i ? i(l) : l;
}
function Ue(t, e, n, r) {
  const i = $e(t), s = i !== t && !V(t);
  let a = n, o = !1;
  i !== t && (s ? (o = r.length === 0, a = function(c, l, u) {
    return o && (o = !1, c = k(t, c)), n.call(this, c, k(t, l), u, t);
  }) : n.length > 3 && (a = function(c, l, u) {
    return n.call(this, c, l, u, t);
  }));
  const d = i[e](a, ...r);
  return o ? k(t, d) : d;
}
function Ut(t, e, n) {
  const r = h(t);
  S(r, "iterate", xt);
  const i = r[e](...n);
  return (i === -1 || i === !1) && hs(n[0]) ? (n[0] = h(n[0]), r[e](...n)) : i;
}
function ot(t, e, n = []) {
  Qr(), Re();
  const r = h(t)[e].apply(t, n);
  return qe(), Yr(), r;
}
var es = /* @__PURE__ */ Nr("__proto__,__v_isRef,__isVue"), Xn = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(Et)
);
function ns(t) {
  Et(t) || (t = String(t));
  const e = h(this);
  return S(e, "has", t), e.hasOwnProperty(t);
}
var ti = class {
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
      return n === (r ? i ? fs : ii : i ? us : ni).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const s = _t(t);
    if (!r) {
      let o;
      if (s && (o = Xr[e]))
        return o;
      if (e === "hasOwnProperty")
        return ns;
    }
    const a = Reflect.get(
      t,
      e,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      ht(t) ? t : n
    );
    if ((Et(e) ? Xn.has(e) : es(e)) || (r || S(t, "get", e), i))
      return a;
    if (ht(a)) {
      const o = s && Pe(e) ? a : a.value;
      return r && yt(o) ? pe(o) : o;
    }
    return yt(a) ? r ? pe(a) : Fe(a) : a;
  }
}, is = class extends ti {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, e, n, r) {
    let i = t[e];
    const s = _t(t) && Pe(e);
    if (!this._isShallow) {
      const d = z(i);
      if (!V(n) && !z(n) && (i = h(i), n = h(n)), !s && ht(i) && !ht(n))
        return d ? (U(
          `Set operation on key "${String(e)}" failed: target is readonly.`,
          t[e]
        ), !0) : (i.value = n, !0);
    }
    const a = s ? Number(e) < t.length : ce(t, e), o = Reflect.set(
      t,
      e,
      n,
      ht(t) ? t : r
    );
    return t === h(r) && o && (a ? N(n, i) && I(t, "set", e, n, i) : I(t, "add", e, n)), o;
  }
  deleteProperty(t, e) {
    const n = ce(t, e), r = t[e], i = Reflect.deleteProperty(t, e);
    return i && n && I(t, "delete", e, void 0, r), i;
  }
  has(t, e) {
    const n = Reflect.has(t, e);
    return (!Et(e) || !Xn.has(e)) && S(t, "has", e), n;
  }
  ownKeys(t) {
    return S(
      t,
      "iterate",
      _t(t) ? "length" : B
    ), Reflect.ownKeys(t);
  }
}, rs = class extends ti {
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
}, ss = /* @__PURE__ */ new is(), as = /* @__PURE__ */ new rs(), Ot = (t) => Reflect.getPrototypeOf(t);
function os(t, e, n) {
  return function(...r) {
    const i = this.__v_raw, s = h(i), a = ut(s), o = t === "entries" || t === Symbol.iterator && a, d = t === "keys" && a, c = i[t](...r), l = e ? wt : J;
    return !e && S(
      s,
      "iterate",
      d ? fe : B
    ), mt(
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
        `${Wr(t)} operation ${n}failed: target is readonly.`,
        h(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function ds(t, e) {
  const n = {
    get(i) {
      const s = this.__v_raw, a = h(s), o = h(i);
      t || (N(i, o) && S(a, "get", i), S(a, "get", o));
      const { has: d } = Ot(a), c = t ? wt : J;
      if (d.call(a, i))
        return c(s.get(i));
      if (d.call(a, o))
        return c(s.get(o));
      s !== a && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !t && S(h(i), "iterate", B), i.size;
    },
    has(i) {
      const s = this.__v_raw, a = h(s), o = h(i);
      return t || (N(i, o) && S(a, "has", i), S(a, "has", o)), i === o ? s.has(i) : s.has(i) || s.has(o);
    },
    forEach(i, s) {
      const a = this, o = a.__v_raw, d = h(o), c = t ? wt : J;
      return !t && S(d, "iterate", B), o.forEach((l, u) => i.call(s, c(l), c(u), a));
    }
  };
  return mt(
    n,
    t ? {
      add: kt("add"),
      set: kt("set"),
      delete: kt("delete"),
      clear: kt("clear")
    } : {
      add(i) {
        const s = h(this), a = Ot(s), o = h(i), d = !V(i) && !z(i) ? o : i;
        return a.has.call(s, d) || N(i, d) && a.has.call(s, i) || N(o, d) && a.has.call(s, o) || (s.add(d), I(s, "add", d, d)), this;
      },
      set(i, s) {
        !V(s) && !z(s) && (s = h(s));
        const a = h(this), { has: o, get: d } = Ot(a);
        let c = o.call(a, i);
        c ? ze(a, o, i) : (i = h(i), c = o.call(a, i));
        const l = d.call(a, i);
        return a.set(i, s), c ? N(s, l) && I(a, "set", i, s, l) : I(a, "add", i, s), this;
      },
      delete(i) {
        const s = h(this), { has: a, get: o } = Ot(s);
        let d = a.call(s, i);
        d ? ze(s, a, i) : (i = h(i), d = a.call(s, i));
        const c = o ? o.call(s, i) : void 0, l = s.delete(i);
        return d && I(s, "delete", i, void 0, c), l;
      },
      clear() {
        const i = h(this), s = i.size !== 0, a = ut(i) ? new Map(i) : new Set(i), o = i.clear();
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
    n[i] = os(i, t);
  }), n;
}
function ei(t, e) {
  const n = ds(t);
  return (r, i, s) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? r : Reflect.get(
    ce(n, i) && i in r ? n : r,
    i,
    s
  );
}
var cs = {
  get: /* @__PURE__ */ ei(!1)
}, ls = {
  get: /* @__PURE__ */ ei(!0)
};
function ze(t, e, n) {
  const r = h(n);
  if (r !== n && e.call(t, r)) {
    const i = Vn(t);
    U(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var ni = /* @__PURE__ */ new WeakMap(), us = /* @__PURE__ */ new WeakMap(), ii = /* @__PURE__ */ new WeakMap(), fs = /* @__PURE__ */ new WeakMap();
function ps(t) {
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
function Fe(t) {
  return /* @__PURE__ */ z(t) ? t : ri(
    t,
    !1,
    ss,
    cs,
    ni
  );
}
function pe(t) {
  return ri(
    t,
    !0,
    as,
    ls,
    ii
  );
}
function ri(t, e, n, r, i) {
  if (!yt(t))
    return U(
      `value cannot be made ${e ? "readonly" : "reactive"}: ${String(
        t
      )}`
    ), t;
  if (t.__v_raw && !(e && t.__v_isReactive) || t.__v_skip || !Object.isExtensible(t))
    return t;
  const s = i.get(t);
  if (s)
    return s;
  const a = ps(Vn(t));
  if (a === 0)
    return t;
  const o = new Proxy(
    t,
    a === 2 ? r : n
  );
  return i.set(t, o), o;
}
function si(t) {
  return /* @__PURE__ */ z(t) ? /* @__PURE__ */ si(t.__v_raw) : !!(t && t.__v_isReactive);
}
function z(t) {
  return !!(t && t.__v_isReadonly);
}
function V(t) {
  return !!(t && t.__v_isShallow);
}
function hs(t) {
  return t ? !!t.__v_raw : !1;
}
function h(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ h(e) : t;
}
var J = (t) => yt(t) ? /* @__PURE__ */ Fe(t) : t, wt = (t) => yt(t) ? /* @__PURE__ */ pe(t) : t;
function ht(t) {
  return t ? t.__v_isRef === !0 : !1;
}
O("nextTick", () => Ae);
O("dispatch", (t) => lt.bind(lt, t));
O("watch", (t, { evaluateLater: e, cleanup: n }) => (r, i) => {
  let s = e(r), o = en(() => {
    let d;
    return s((c) => d = c), d;
  }, i);
  n(o);
});
O("store", Rr);
O("data", (t) => ln(t));
O("root", (t) => Ft(t));
O("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = W(bs(t))), t._x_refs_proxy));
function bs(t) {
  let e = [];
  return R(t, (n) => {
    n._x_refs && e.push(n._x_refs);
  }), e;
}
var zt = {};
function ai(t) {
  return zt[t] || (zt[t] = 0), ++zt[t];
}
function gs(t, e) {
  return R(t, (n) => {
    if (n._x_ids && n._x_ids[e])
      return !0;
  });
}
function vs(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = ai(e));
}
O("id", (t, { cleanup: e }) => (n, r = null) => {
  let i = `${n}${r ? `-${r}` : ""}`;
  return ms(t, i, e, () => {
    let s = gs(t, n), a = s ? s._x_ids[n] : ai(n);
    return r ? `${n}-${a}-${r}` : `${n}-${a}`;
  });
});
Nt((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function ms(t, e, n, r) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let i = r();
  return t._x_id[e] = i, n(() => {
    delete t._x_id[e];
  }), i;
}
O("el", (t) => t);
oi("Focus", "focus", "focus");
oi("Persist", "persist", "persist");
function oi(t, e, n) {
  O(e, (r) => A(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
m("modelable", (t, { expression: e }, { effect: n, evaluateLater: r, cleanup: i }) => {
  let s = r(e), a = () => {
    let l;
    return s((u) => l = u), l;
  }, o = r(`${e} = __placeholder`), d = (l) => o(() => {
  }, { scope: { __placeholder: l } }), c = a();
  d(c), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let l = t._x_model.get, u = t._x_model.setWithModifiers, b = Hn(
      {
        get() {
          return l();
        },
        set(g) {
          u(g);
        }
      },
      {
        get() {
          return a();
        },
        set(g) {
          d(g);
        }
      }
    );
    i(b);
  });
});
m("teleport", (t, { modifiers: e, expression: n }, { cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && A("x-teleport can only be used on a <template> tag", t);
  let i = Ve(n), s = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = s, s._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((o) => {
    s.addEventListener(o, (d) => {
      d.stopPropagation(), t.dispatchEvent(new d.constructor(d.type, d));
    });
  }), St(s, {}, t);
  let a = (o, d, c) => {
    c.includes("prepend") ? d.parentNode.insertBefore(o, d) : c.includes("append") ? d.parentNode.insertBefore(o, d.nextSibling) : d.appendChild(o);
  };
  v(() => {
    F(() => {
      a(s, i, e), q(s);
    })();
  }), t._x_teleportPutBack = () => {
    let o = Ve(n);
    v(() => {
      a(t._x_teleport, o, e);
    });
  }, r(
    () => v(() => {
      s.remove(), Y(s);
    })
  );
});
var _s = document.createElement("div");
function Ve(t) {
  let e = F(() => document.querySelector(t), () => _s)();
  return e || A(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var di = () => {
};
di.inline = (t, { modifiers: e }, { cleanup: n }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
m("ignore", di);
m("effect", F((t, { expression: e }, { effect: n }) => {
  n(w(t, e));
}));
function X(t, e, n, r) {
  let i = t, s = (d) => r(d), a = {}, o = (d, c) => (l) => c(d, l);
  return n.includes("dot") && (e = ys(e)), n.includes("camel") && (e = xs(e)), n.includes("capture") && (a.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("passive") && (a.passive = n[n.indexOf("passive") + 1] !== "false"), s = ci(n, s), n.includes("prevent") && (s = o(s, (d, c) => {
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
  })), (Ss(e) || li(e)) && (s = o(s, (d, c) => {
    Es(c, n) || d(c);
  })), i.addEventListener(e, s, a), () => {
    i.removeEventListener(e, s, a);
  };
}
function ci(t, e) {
  if (t.includes("debounce")) {
    let n = t[t.indexOf("debounce") + 1] || "invalid-wait", r = It(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = jn(e, r);
  }
  if (t.includes("throttle")) {
    let n = t[t.indexOf("throttle") + 1] || "invalid-wait", r = It(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = Bn(e, r);
  }
  return e;
}
function ys(t) {
  return t.replace(/-/g, ".");
}
function xs(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function It(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function ws(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Ss(t) {
  return ["keydown", "keyup"].includes(t);
}
function li(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function Es(t, e) {
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
  return n = n.filter((s) => !i.includes(s)), !(i.length > 0 && i.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), t[`${a}Key`])).length === i.length && (li(t.type) || Je(t.key).includes(n[0])));
}
function Je(t) {
  if (!t)
    return [];
  t = ws(t);
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
m("model", (t, { modifiers: e, expression: n }, { effect: r, cleanup: i }) => {
  let s = t;
  e.includes("parent") && (s = R(t, (f) => f !== t));
  let a = w(s, n), o;
  typeof n == "string" ? o = w(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = w(s, `${n()} = __placeholder`) : o = () => {
  };
  let d = () => {
    let f;
    return a((_) => f = _), Qe(f) ? f.get() : f;
  }, c = (f) => {
    let _;
    a((y) => _ = y), Qe(_) ? _.set(f) : o(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && t.type === "radio" && v(() => {
    t.hasAttribute("name") || t.setAttribute("name", n);
  });
  let l = e.includes("change") || e.includes("lazy"), u = e.includes("blur"), b = e.includes("enter"), g = l || u || b, M;
  if ($)
    M = () => {
    };
  else if (g) {
    let f = [], _ = (y) => c(At(t, e, y, d()));
    if (l && f.push(X(t, "change", e, _)), u && (f.push(X(t, "blur", e, _)), t.form)) {
      let y = t.form, Z = () => _({ target: t });
      y._x_pendingModelUpdates || (y._x_pendingModelUpdates = []), y._x_pendingModelUpdates.push(Z), i(() => {
        y._x_pendingModelUpdates && y._x_pendingModelUpdates.splice(y._x_pendingModelUpdates.indexOf(Z), 1);
      });
    }
    b && f.push(X(t, "keydown", e, (y) => {
      y.key === "Enter" && _(y);
    })), M = () => f.forEach((y) => y());
  } else {
    let f = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) ? "change" : "input";
    M = X(t, f, e, (_) => {
      c(At(t, e, _, d()));
    });
  }
  if (e.includes("fill") && ([void 0, null, ""].includes(d()) || Rt(t) && Array.isArray(d()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    At(t, e, { target: t }, d())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = M, i(() => t._x_removeModelListeners.default()), t.form) {
    let f = X(t.form, "reset", [], (_) => {
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
    setWithModifiers: ci(e, c)
  }, t._x_forceModelUpdate = (f) => {
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), v(() => {
      Rt(t) ? Array.isArray(f) ? t.checked = f.some((_) => _ == t.value) : t.checked = !!f : Ce(t) ? typeof f == "boolean" ? t.checked = Mt(t.value) === f : t.checked = t.value == f : Dn(t, "value", f);
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
function At(t, e, n, r) {
  return v(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Rt(t))
      if (Array.isArray(r)) {
        let i = null;
        return e.includes("number") ? i = Vt(n.target.value) : e.includes("boolean") ? i = Mt(n.target.value) : i = n.target.value, n.target.checked ? r.includes(i) ? r : r.concat([i]) : r.filter((s) => !Os(s, i));
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
  return ks(e) ? e : t;
}
function Os(t, e) {
  return t == e;
}
function ks(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Qe(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
m("cloak", (t) => queueMicrotask(() => v(() => t.removeAttribute(it("cloak")))));
Pn(() => `[${it("init")}]`);
m("init", F((t, { expression: e }, { evaluate: n }) => typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)));
m("text", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
  let i = r(e);
  n(() => {
    i((s) => {
      v(() => {
        t.textContent = s;
      });
    });
  });
});
m("html", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
  let i = r(e);
  n(() => {
    i((s) => {
      v(() => {
        Array.from(t.children).forEach((a) => Y(a)), t.innerHTML = s ?? "", t._x_ignoreSelf = !0, q(t), delete t._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
Ee(xn(":", wn(it("bind:"))));
var ui = (t, { value: e, modifiers: n, expression: r, original: i }, { effect: s, cleanup: a }) => {
  if (!e) {
    let d = {};
    Ir(d), w(t, r)((l) => {
      Kn(t, l, i);
    }, { scope: d });
    return;
  }
  if (e === "key")
    return As(t, r);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let o = w(t, r);
  s(() => o((d) => {
    d === void 0 && typeof r == "string" && r.match(/\./) && (d = ""), v(() => Dn(t, e, d, n));
  })), a(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
ui.inline = (t, { value: e, modifiers: n, expression: r }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: r, extract: !1 });
};
m("bind", ui);
function As(t, e) {
  t._x_keyExpression = e;
}
Cn(() => `[${it("data")}]`);
var D = /* @__PURE__ */ Symbol();
m("data", (t, { expression: e }, { cleanup: n }) => {
  if (Ts(t))
    return;
  let r = t[D];
  if (r?.expression === e)
    return;
  e = e === "" ? "{}" : e;
  let i = {};
  bt(i, t);
  let s = {};
  Fr(s, i);
  let a = j(t, e, { scope: s });
  (a === void 0 || a === !0) && (a = {}), bt(a, t);
  let o;
  if (r?.reactiveData) {
    o = r.reactiveData, Ms(o, a);
    let c = { expression: e };
    t[D] = c, queueMicrotask(() => {
      t[D] === c && delete t[D];
    });
  } else
    o = et(a);
  xe(o, n);
  let d = St(t, o);
  o.init && j(t, o.init), n(() => {
    o.destroy && j(t, o.destroy), d();
    let c = { reactiveData: o };
    t[D] = c, queueMicrotask(() => {
      t[D] === c && delete t[D];
    });
  });
});
function Ms(t, e) {
  Object.keys(e).forEach((n) => {
    let r = Object.getOwnPropertyDescriptor(e, n), i = Object.getOwnPropertyDescriptor(t, n);
    r.get || r.set || i?.get || i?.set ? (i && delete t[n], i || (t[n] = void 0), r.get || r.set ? Object.defineProperty(t, n, r) : t[n] = e[n]) : t[n] = e[n];
  }), Object.keys(t).filter((n) => !Object.prototype.hasOwnProperty.call(e, n)).forEach((n) => delete t[n]);
}
Nt((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function Ts(t) {
  return $ ? de ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
m("show", (t, { modifiers: e, expression: n }, { effect: r }) => {
  let i = w(t, n);
  t._x_doHide || (t._x_doHide = () => {
    v(() => {
      t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
    });
  }), t._x_doShow || (t._x_doShow = () => {
    v(() => {
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
m("for", F((t, { expression: e }, { effect: n, cleanup: r }) => {
  let i = Rs(e), s = w(t, i.items), a = w(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_lookup = /* @__PURE__ */ new Map(), n(() => Ps(t, i, s, a), { priority: "structural" }), r(() => {
    t._x_lookup.forEach(
      (o) => v(() => {
        Y(o), o.remove();
      })
    ), delete t._x_lookup, delete t._x_lastRenderedEl;
  });
}));
function Cs(t) {
  return (e) => {
    Object.entries(e).forEach(([n, r]) => {
      t[n] = r;
    });
  };
}
function Ps(t, e, n, r) {
  n((i) => {
    Is(i) && (i = Array.from({ length: i }, (c, l) => l + 1)), i == null && (i = []), i instanceof Set && (i = Array.from(i)), i instanceof Map && (i = Array.from(i));
    let s = t._x_lookup, a = /* @__PURE__ */ new Map();
    t._x_lookup = a;
    let o = $s(i), d = Object.entries(i).map(([c, l]) => {
      o || (c = parseInt(c));
      let u = qs(e, l, c, i), b;
      return r((g) => {
        typeof g == "object" && A("x-for key cannot be an object, it must be a string or an integer", t), s.has(g) && (a.set(g, s.get(g)), s.delete(g)), b = g;
      }, { scope: { index: c, ...u } }), [b, u];
    });
    v(() => {
      s.forEach((u) => {
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
        let g = document.importNode(t.content, !0).firstElementChild, M = et(b);
        St(g, M, t), g._x_refreshXForScope = Cs(M), a.set(u, g), c.add(g), l.after(g), l = g;
      }), c.forEach((u) => q(u)), l !== t ? t._x_lastRenderedEl = l : delete t._x_lastRenderedEl;
    });
  });
}
function Rs(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, r = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, i = t.match(r);
  if (!i)
    return;
  let s = {};
  s.items = i[2].trim();
  let a = i[1].replace(n, "").trim(), o = a.match(e);
  return o ? (s.item = a.replace(e, "").trim(), s.index = o[1].trim(), o[2] && (s.collection = o[2].trim())) : s.item = a, s;
}
function qs(t, e, n, r) {
  let i = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    i[a] = e[o];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    i[a] = e[a];
  }) : i[t.item] = e, t.index && (i[t.index] = n), t.collection && (i[t.collection] = r), i;
}
function Is(t) {
  return typeof t != "object" && !isNaN(t);
}
function $s(t) {
  return typeof t == "object" && !Array.isArray(t);
}
function fi() {
}
fi.inline = (t, { expression: e }, { cleanup: n }) => {
  let r = Ft(t);
  r && (r._x_refs || (r._x_refs = {}), r._x_refs[e] = t, n(() => delete r._x_refs[e]));
};
m("ref", fi);
m("if", F((t, { expression: e }, { effect: n, cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && A("x-if can only be used on a <template> tag", t);
  let i = w(t, e), s = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let o = t.content.cloneNode(!0).firstElementChild;
    return St(o, {}, t), v(() => {
      t.after(o), q(o);
    }), t._x_currentIfEl = o, t._x_lastRenderedEl = o, t._x_undoIf = () => {
      v(() => {
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
m("id", (t, { expression: e }, { evaluate: n }) => {
  n(e).forEach((i) => vs(t, i));
});
Nt((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
Ee(xn("@", wn(it("on:"))));
m("on", F((t, { value: e, modifiers: n, expression: r }, { cleanup: i }) => {
  let s = r ? w(t, r) : () => {
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
  m(e, (r) => A(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
rt.setEvaluator(Bi);
rt.setRawEvaluator(zi);
rt.setReactivityEngine({
  reactive: Fe,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (t, e = {}) => {
    let n;
    return n = Vr(t, {
      scheduler: () => {
        n && (e.scheduler ? e.scheduler(n) : n());
      }
    }), n;
  },
  release: Jr,
  raw: h
});
var Fs = rt, Jt = Fs;
function Ds(t) {
  const e = window.__siteationDebugBar;
  return e ? (e.onRequest = t, e.requests.slice()) : [];
}
const $t = "__siteationDebugBarHostLock";
function Ns(t) {
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
function Ls() {
  const t = window[$t];
  t && (t.inert.forEach(([e, n]) => {
    e.inert = n;
  }), document.body.style.overflow = t.overflow, document.body.style.paddingRight = t.paddingRight, delete window[$t]);
}
function js(t, e) {
  if (t.key !== "Tab" || !e) return;
  const n = Array.from(e.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((a) => a.offsetParent !== null);
  if (n.length === 0) return;
  const r = n[0], i = n[n.length - 1], s = e.getRootNode().activeElement;
  t.shiftKey && s === r ? (t.preventDefault(), i.focus()) : !t.shiftKey && s === i && (t.preventDefault(), r.focus());
}
const Ye = [
  {
    id: "findings",
    label: "Findings",
    lead: "What is worth your attention on this request, worst first."
  },
  {
    id: "overview",
    label: "Overview",
    lead: "What was asked for, what came back, and what it cost."
  },
  {
    id: "timeline",
    label: "Timeline",
    lead: "Follow important work in the order it happened across the request."
  },
  {
    id: "queries",
    label: "Queries",
    lead: "Every database query, timed, with the application frame it came from."
  },
  {
    id: "blocks",
    label: "Blocks",
    lead: "Block render times. Own time excludes anything a block renders inside it."
  },
  {
    id: "observers",
    label: "Observers",
    lead: "Every observer that actually ran, grouped by event and ranked by cost."
  },
  {
    id: "events",
    label: "Events",
    lead: "Every dispatched event, including the ones nothing is listening to."
  },
  {
    id: "cache",
    label: "Cache",
    lead: "Reads and writes grouped by key prefix, with the hit rate for each."
  },
  {
    id: "plugins",
    label: "Plugins",
    lead: "Which interceptors were built for this request, and on what."
  }
];
function Bs(t, e) {
  switch (t) {
    case "findings":
      return e.findings.length || null;
    case "overview":
      return null;
    case "timeline":
      return e.timeline.count || null;
    case "queries":
      return e.queries.count || null;
    case "blocks":
      return e.blocks.unique_count || null;
    case "observers":
      return e.observers.unique_count || null;
    case "events":
      return e.events.unique_count || null;
    case "cache":
      return e.cache.count || null;
    case "plugins":
      return e.interception.plugin_count || null;
    default:
      return null;
  }
}
const pi = "siteation.debugbar.v1", Hs = "__PROFILE_ID__";
function Ws() {
  const t = document.getElementById("siteation-debugbar-profile");
  if (!t) return {};
  try {
    return JSON.parse(t.textContent || "{}");
  } catch {
    return {};
  }
}
function Ks() {
  const t = { open: !1, section: "overview" };
  try {
    return { ...t, ...JSON.parse(localStorage.getItem(pi) || "{}") };
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
function Us() {
  return {
    profile: {},
    open: !1,
    section: "findings",
    placement: "bottom",
    maximised: !1,
    theme: "system",
    resolvedTheme: "dark",
    stopWatchingScheme: null,
    favourites: [],
    draggingId: null,
    dropTargetId: null,
    navOpen: !1,
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
      this.profile = Ws(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const t = Ks();
      this.open = t.open, this.section = t.section, this.placement = t.placement === "top" ? "top" : "bottom", this.maximised = !!t.maximised, this.theme = ["system", "light", "dark"].includes(t.theme) ? t.theme : "system", this.favourites = Array.isArray(t.favourites) ? t.favourites.filter((e) => Ye.some((n) => n.id === e)) : [], this.watchColorScheme(), this.open && this.$nextTick(() => this.lock()), this.requests = Ds((e) => {
        this.requests.some((n) => n.id === e.id) || (this.requests = [e, ...this.requests].slice(0, 25));
      }).filter((e) => e.id !== this.profile.id), this.open && this.loadPayloads();
    },
    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(t) {
      const e = document.getElementById("siteation-debugbar")?.dataset.profileUrl;
      return e ? e.replace(Hs, encodeURIComponent(t)) : null;
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
    /** @returns {Array<object>} every section with its count resolved */
    get sections() {
      return Ye.map((t) => ({ ...t, count: Bs(t.id, this) }));
    },
    /** @returns {Array<object>} pinned sections, in the order they were arranged */
    get favouriteSections() {
      return this.favourites.map((t) => this.sections.find((e) => e.id === t)).filter(Boolean);
    },
    /** @returns {Array<object>} */
    get otherSections() {
      return this.sections.filter((t) => !this.favourites.includes(t.id));
    },
    /** @returns {object} */
    get currentSection() {
      return this.sections.find((t) => t.id === this.section) || this.sections[0];
    },
    /**
     * A section shows its own findings at the top, so the evidence and the conclusion sit
     * together rather than in two different places.
     *
     * @returns {Array<object>}
     */
    get sectionFindings() {
      return this.section === "findings" ? [] : this.findings.filter((t) => t.section === this.section);
    },
    /** @param {string} id */
    isFavourite(t) {
      return this.favourites.includes(t);
    },
    /** @param {string} id */
    toggleFavourite(t) {
      this.favourites = this.isFavourite(t) ? this.favourites.filter((e) => e !== t) : [...this.favourites, t], this.persist();
    },
    /** @param {string} id */
    startDrag(t) {
      this.draggingId = t;
    },
    /** @param {string} id */
    dragOver(t) {
      this.draggingId && t !== this.draggingId && (this.dropTargetId = t);
    },
    /** @param {string} id */
    drop(t) {
      const e = this.favourites.indexOf(this.draggingId), n = this.favourites.indexOf(t);
      if (e > -1 && n > -1 && e !== n) {
        const r = [...this.favourites];
        r.splice(n, 0, r.splice(e, 1)[0]), this.favourites = r, this.persist();
      }
      this.endDrag();
    },
    endDrag() {
      this.draggingId = null, this.dropTargetId = null;
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
      this.open && (this.open = !1, this.persist(), Ls(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus());
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
      Ns(document.getElementById("siteation-debugbar")), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(t) {
      if (t.key === "Escape") {
        this.closeInspector();
        return;
      }
      js(t, this.$refs.sheet);
    },
    /** @param {string} section */
    select(t) {
      this.section = t, this.navOpen = !1, this.openInspector(), this.persist();
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
        localStorage.setItem(pi, JSON.stringify({
          open: this.open,
          section: this.section,
          placement: this.placement,
          maximised: this.maximised,
          theme: this.theme,
          favourites: this.favourites
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
const zs = {
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
  star: '<path d="m12 3.5 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17.3 6.7 20.1l1.1-6L3.4 9.9l6-.8L12 3.5Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  caret: '<path d="m6 9 6 6 6-6"/>'
};
function x(t, e = "") {
  return `<svg class="ndb-icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${zs[t] || ""}</svg>`;
}
function Ze({ sheet: t }) {
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
      ${x("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </button>

    <button type="button" class="ndb-stat" data-ndb-on:click="select('timeline')">
      ${x("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat is-secondary" data-ndb-on:click="select('blocks')">
      ${x("bolt", "is-accent")}
      <span>
        <span class="ndb-stat-key">Blocks</span>
        <span class="ndb-stat-value" data-ndb-text="blocks.unique_count || 0"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat is-secondary" data-ndb-on:click="select('overview')">
      ${x("chip", "is-accent")}
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
      ${x("alert")}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="cycleTheme()"
            data-ndb-bind:title="'Theme: ' + theme + '. Click to change.'">
      <span data-ndb-show="theme === 'system'">${x("monitor")}</span>
      <span data-ndb-show="theme === 'light'">${x("sun")}</span>
      <span data-ndb-show="theme === 'dark'">${x("moon")}</span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="movePlacement()"
            data-ndb-bind:title="placement === 'bottom' ? 'Move to the top' : 'Move to the bottom'">
      ${x("dock")}
    </button>

    <span class="ndb-controls-divider"></span>

    ${t ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      <span data-ndb-show="!maximised">${x("expand")}</span>
      <span data-ndb-show="maximised">${x("collapse")}</span>
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${x("minimise")}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${x("expand")}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="dismiss()"
            title="Hide until the next page load">
      ${x("close")}
    </button>
  </div>
</div>`;
}
function Ge(t, e) {
  return `
<template data-ndb-for="section in ${t}" data-ndb-bind:key="section.id">
  <div class="ndb-nav-row"
       data-ndb-bind:class="dropTargetId === section.id && 'is-drop-target'"
       ${e ? `
       draggable="true"
       data-ndb-on:dragstart="startDrag(section.id)"
       data-ndb-on:dragover.prevent="dragOver(section.id)"
       data-ndb-on:drop.prevent="drop(section.id)"
       data-ndb-on:dragend="endDrag()"` : ""}>
    <button type="button" class="ndb-nav-item"
            data-ndb-bind:class="isSection(section.id) && 'is-active'"
            data-ndb-on:click="select(section.id)">
      <span class="ndb-nav-label" data-ndb-text="section.label"></span>
      <span class="ndb-nav-count" data-ndb-show="section.count"
            data-ndb-text="section.count"></span>
    </button>
    <button type="button" class="ndb-nav-pin"
            data-ndb-bind:class="isFavourite(section.id) && 'is-on'"
            data-ndb-on:click="toggleFavourite(section.id)"
            data-ndb-bind:title="isFavourite(section.id) ? 'Unpin' : 'Pin to favourites'">
      ${x("star")}
    </button>
  </div>
</template>`;
}
function Vs() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${Ge("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${Ge("otherSections", !1)}
</nav>`;
}
const Js = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme">

  <div class="ndb-dock" data-ndb-show="!open && !dismissed" data-ndb-cloak>
    ${Ze({ sheet: !1 })}
  </div>

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${Ze({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${x("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${Vs()}

        <div class="ndb-nav-scrim" data-ndb-show="navOpen"
             data-ndb-on:click="navOpen = false"></div>

    <div class="ndb-panel-body">

      <header class="ndb-section-head">
        <h2 data-ndb-text="currentSection.label"></h2>
        <p data-ndb-text="currentSection.lead"></p>
      </header>

      <div class="ndb-callout is-warn" data-ndb-show="sectionFindings.length > 0">
        <template data-ndb-for="(finding, index) in sectionFindings" data-ndb-bind:key="index">
          <p>
            <strong data-ndb-text="finding.message"></strong>
            <span data-ndb-text="finding.why"></span>
          </p>
        </template>
      </div>

      <div class="ndb-callout is-clear"
           data-ndb-show="section !== 'findings' && sectionFindings.length === 0">
        <p><strong>No clear problem found.</strong>
          Nothing in this section matched a rule.</p>
      </div>


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
  </div>

</div>
`, Qs = "data-ndb-", Ys = "siteation-debugbar";
function Zs(t) {
  const e = t.attachShadow({ mode: "open" }), n = t.dataset.css;
  if (n) {
    const i = document.createElement("link");
    i.rel = "stylesheet", i.href = n, e.append(i);
  }
  const r = document.createElement("div");
  return r.innerHTML = Js, e.append(...r.children), e.querySelector(".ndb");
}
const Qt = document.getElementById(Ys);
if (Qt && !Qt.shadowRoot) {
  const t = Zs(Qt);
  Jt.prefix(Qs), Jt.data("debugBar", Us), t && Jt.initTree(t), De && (window.Alpine = De);
}
