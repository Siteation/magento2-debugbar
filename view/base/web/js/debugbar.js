const st = window.Alpine;
var rt = !1, at = !1, M = [], ot = -1, qe = !1, At = !1;
function Ni(e) {
  Fi(e);
}
function Li() {
  At = !0;
}
function Di() {
  At = !1, gn();
}
function Fi(e) {
  M.includes(e) || (M.push(e), e._x_schedulerPriority !== void 0 && (qe = !0)), gn();
}
function ji(e) {
  let t = M.indexOf(e);
  t !== -1 && t > ot && M.splice(t, 1);
}
function gn() {
  if (!at && !rt) {
    if (At)
      return;
    rt = !0, queueMicrotask(Bi);
  }
}
function Bi() {
  rt = !1, at = !0;
  for (let e = 0; e < M.length; e++)
    qe && Hi(e), M[e](), ot = e;
  M.length = 0, ot = -1, qe = !1, at = !1;
}
function Hi(e) {
  let t = /* @__PURE__ */ new Map(), n = M.slice(e).sort((i, s) => Wi(i, s, t));
  for (let i = 0; i < n.length; i++)
    M[e + i] = n[i];
  qe = !1;
}
function Wi(e, t, n) {
  return Je(e) ? Je(t) ? Qt(e._x_schedulerPriority.el, n) - Qt(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : Je(t) ? 1 : 0;
}
function Je(e) {
  return e._x_schedulerPriority !== void 0;
}
function Qt(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, i = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(i, n), n;
}
var se, Y, re, vn, Ki = 0, lt = !0;
function Ui(e) {
  lt = !1, e(), lt = !0;
}
function zi(e) {
  se = e.reactive, re = e.release, Y = (t) => e.effect(t, { scheduler: (n) => {
    lt ? Ni(n) : n();
  } }), vn = e.raw;
}
function Zt(e) {
  Y = e;
}
function Vi(e) {
  let t = () => {
  };
  return [(i, s) => {
    let r = s?.priority === "structural" ? Ki++ : void 0, a = Y(i);
    return r !== void 0 && a !== void 0 && (a._x_schedulerPriority = { el: e, order: r }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(a), t = () => {
      a !== void 0 && (e._x_effects.delete(a), re(a));
    }, a;
  }, () => {
    t();
  }];
}
function _n(e, t) {
  let n = !0, i, s, r = Y(() => {
    let a = e(), o = JSON.stringify(a);
    if (!n && (typeof a == "object" || a !== i)) {
      let l = typeof i == "object" ? JSON.parse(s) : i;
      queueMicrotask(() => {
        t(a, l);
      });
    }
    i = a, s = o, n = !1;
  });
  return () => re(r);
}
async function Ji(e) {
  Li();
  try {
    await e(), await Promise.resolve();
  } finally {
    Di();
  }
}
var yn = [], xn = [], wn = [];
function Yi(e) {
  wn.push(e);
}
function Ot(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, xn.push(t));
}
function Sn(e) {
  yn.push(e);
}
function kn(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function En(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((s) => s()), delete e._x_attributeCleanups[n]);
  });
}
function Gi(e) {
  for (e._x_effects?.forEach(ji); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var Tt = new MutationObserver(Pt), $t = !1;
function Ct() {
  Tt.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), $t = !0;
}
function An() {
  Qi(), Tt.disconnect(), $t = !1;
}
var le = [];
function Qi() {
  let e = Tt.takeRecords();
  le.push(() => e.length > 0 && Pt(e));
  let t = le.length;
  queueMicrotask(() => {
    if (le.length === t)
      for (; le.length > 0; )
        le.shift()();
  });
}
function g(e) {
  if (!$t)
    return e();
  An();
  let t = e();
  return Ct(), t;
}
var Mt = !1, Ne = [];
function Zi() {
  Mt = !0;
}
function Xi() {
  Mt = !1, Pt(Ne), Ne = [];
}
function Pt(e) {
  if (Mt) {
    Ne = Ne.concat(e);
    return;
  }
  let t = [], n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (let r = 0; r < e.length; r++)
    if (!e[r].target._x_ignoreMutationObserver && (e[r].type === "childList" && (e[r].removedNodes.forEach((a) => {
      a.nodeType === 1 && a._x_marker && n.add(a);
    }), e[r].addedNodes.forEach((a) => {
      if (a.nodeType === 1) {
        if (n.has(a)) {
          n.delete(a);
          return;
        }
        a._x_marker || t.push(a);
      }
    })), e[r].type === "attributes")) {
      let a = e[r].target, o = e[r].attributeName, l = e[r].oldValue, d = () => {
        i.has(a) || i.set(a, []), i.get(a).push({ name: o, value: a.getAttribute(o) });
      }, c = () => {
        s.has(a) || s.set(a, []), s.get(a).push(o);
      };
      a.hasAttribute(o) && l === null ? d() : a.hasAttribute(o) ? (c(), d()) : c();
    }
  s.forEach((r, a) => {
    En(a, r);
  }), i.forEach((r, a) => {
    yn.forEach((o) => o(a, r));
  });
  for (let r of n)
    t.some((a) => a.contains(r)) || xn.forEach((a) => a(r));
  for (let r of t)
    r.isConnected && wn.forEach((a) => a(r));
  t = null, n = null, i = null, s = null;
}
function On(e) {
  return W(H(e));
}
function Ae(e, t, n) {
  return e._x_dataStack = [t, ...H(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function H(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? H(e.host) : e.parentNode ? H(e.parentNode) : [];
}
function W(e) {
  return new Proxy({ objects: e }, es);
}
function Tn(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : Tn(Object.getPrototypeOf(e), t);
}
var es = {
  ownKeys({ objects: e }) {
    return Array.from(
      new Set(e.flatMap((t) => Object.keys(t)))
    );
  },
  has({ objects: e }, t) {
    return t == Symbol.unscopables ? !1 : e.some(
      (n) => Object.prototype.hasOwnProperty.call(n, t) || Reflect.has(n, t)
    );
  },
  get({ objects: e }, t, n) {
    return t == "toJSON" ? ts : Reflect.get(
      e.find(
        (i) => Reflect.has(i, t)
      ) || {},
      t,
      n
    );
  },
  set({ objects: e }, t, n, i) {
    let s;
    for (const a of e)
      if (s = Tn(a, t), s)
        break;
    s || (s = e[e.length - 1]);
    const r = Object.getOwnPropertyDescriptor(s, t);
    return r?.set && r?.get ? r.set.call(i, n) || !0 : Reflect.set(s, t, n);
  }
};
function ts() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function Rt(e, t = () => {
}) {
  let n = (s) => typeof s == "object" && !Array.isArray(s) && s !== null, i = (s, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(s)).forEach(([a, { value: o, enumerable: l }]) => {
      if (l === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let d = r === "" ? a : `${r}.${a}`;
      typeof o == "object" && o !== null && o._x_interceptor ? s[a] = o.initialize(e, d, a, t) : n(o) && o !== s && !(o instanceof Element) && i(o, d);
    });
  };
  return i(e);
}
function $n(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, s, r, a) {
      return e(this.initialValue, () => ns(i, s), (o) => dt(i, s, o), s, r, a);
    }
  };
  return t(n), (i) => {
    if (typeof i == "object" && i !== null && i._x_interceptor) {
      let s = n.initialize.bind(n);
      n.initialize = (r, a, o, l) => {
        let d = i.initialize(r, a, o, l);
        return n.initialValue = d, s(r, a, o, l);
      };
    } else
      n.initialValue = i;
    return n;
  };
}
function ns(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function dt(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), dt(e[t[0]], t.slice(1), n);
  }
}
var Cn = {};
function E(e, t) {
  Cn[e] = t;
}
function ve(e, t) {
  let n = is(t);
  return Object.entries(Cn).forEach(([i, s]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return s(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function is(e) {
  let [t, n] = Ln(e), i = { interceptor: $n, ...t };
  return Ot(e, n), i;
}
function ss(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (s) {
    _e(s, e, t);
  }
}
function _e(...e) {
  return Mn(...e);
}
var Mn = as;
function rs(e) {
  Mn = e;
}
function as(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var ne = !0;
function Pn(e) {
  let t = ne;
  ne = !1;
  let n = e();
  return ne = t, n;
}
function j(e, t, n = {}) {
  let i;
  return w(e, t)((s) => i = s, n), i;
}
function w(...e) {
  return Rn(...e);
}
var Rn = () => {
};
function os(e) {
  Rn = e;
}
var In;
function ls(e) {
  In = e;
}
function ds(e, t) {
  let n = {};
  ve(n, e);
  let i = [n, ...H(e)], s = typeof t == "function" ? cs(i, t) : fs(i, t, e);
  return ss.bind(null, e, t, s);
}
function cs(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: s = [], context: r } = {}) => {
    if (!ne) {
      ye(n, t, W([i, ...e]), s);
      return;
    }
    let a = t.apply(W([i, ...e]), s);
    ye(n, a);
  };
}
var Ye = {};
function us(e, t) {
  if (Ye[e])
    return Ye[e];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, i = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, r = (() => {
    try {
      let a = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${i} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(a, "name", {
        value: `[Alpine] ${e}`
      }), a;
    } catch (a) {
      return _e(a, t, e), Promise.resolve();
    }
  })();
  return Ye[e] = r, r;
}
function fs(e, t, n) {
  let i = us(t, n);
  return (s = () => {
  }, { scope: r = {}, params: a = [], context: o } = {}) => {
    i.result = void 0, i.finished = !1;
    let l = W([r, ...e]);
    if (typeof i == "function") {
      let d = i.call(o, i, l).catch((c) => _e(c, n, t));
      i.finished ? (ye(s, i.result, l, a, n), i.result = void 0) : d.then((c) => {
        ye(s, c, l, a, n);
      }).catch((c) => _e(c, n, t)).finally(() => i.result = void 0);
    }
  };
}
function ye(e, t, n, i, s) {
  if (ne && typeof t == "function") {
    let r = t.apply(n, i);
    r instanceof Promise ? r.then((a) => ye(e, a, n, i)).catch((a) => _e(a, s, t)) : e(r);
  } else typeof t == "object" && t instanceof Promise ? t.then((r) => e(r)) : e(t);
}
function ps(...e) {
  return In(...e);
}
function hs(e, t, n = {}) {
  let i = {};
  ve(i, e);
  let s = [i, ...H(e)], r = W([n.scope ?? {}, ...s]), a = n.params ?? [];
  if (t.includes("await")) {
    let o = Object.getPrototypeOf(async function() {
    }).constructor, l = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t;
    return new o(
      ["scope"],
      `with (scope) { let __result = ${l}; return __result }`
    ).call(n.context, r);
  } else {
    let o = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(()=>{ ${t} })()` : t, d = new Function(
      ["scope"],
      `with (scope) { let __result = ${o}; return __result }`
    ).call(n.context, r);
    return typeof d == "function" && ne ? d.apply(r, a) : d;
  }
}
var It = "x-";
function ae(e = "") {
  return It + e;
}
function bs(e) {
  It = e;
}
var Le = {};
function v(e, t) {
  return Le[e] = t, {
    before(n) {
      if (!Le[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = F.indexOf(n);
      F.splice(i >= 0 ? i : F.indexOf("DEFAULT"), 0, e);
    }
  };
}
function ms(e) {
  return Object.keys(Le).includes(e);
}
function qt(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let r = Object.entries(e._x_virtualDirectives).map(([o, l]) => ({ name: o, value: l })), a = qn(r);
    r = r.map((o) => a.find((l) => l.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(r);
  }
  let i = {};
  return t.map(jn((r, a) => i[r] = a)).filter(Hn).map(_s(i, n)).sort(ys).map((r) => vs(e, r));
}
function qn(e) {
  return Array.from(e).map(jn()).filter((t) => !Hn(t));
}
var ct = !1, fe = /* @__PURE__ */ new Map(), Nn = /* @__PURE__ */ Symbol();
function gs(e) {
  ct = !0;
  let t = /* @__PURE__ */ Symbol();
  Nn = t, fe.set(t, []);
  let n = () => {
    for (; fe.get(t).length; )
      fe.get(t).shift()();
    fe.delete(t);
  }, i = () => {
    ct = !1, n();
  };
  e(n), i();
}
function Ln(e) {
  let t = [], n = (o) => t.push(o), [i, s] = Vi(e);
  return t.push(s), [{
    Alpine: oe,
    effect: i,
    cleanup: n,
    evaluateLater: w.bind(w, e),
    evaluate: j.bind(j, e)
  }, () => t.forEach((o) => o())];
}
function vs(e, t) {
  let n = () => {
  }, i = Le[t.type] || n, [s, r] = Ln(e);
  kn(e, t.original, r);
  let a = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, s), i = i.bind(i, e, t, s), ct ? fe.get(Nn).push(i) : i());
  };
  return a.runCleanups = r, a;
}
var Dn = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), Fn = (e) => e;
function jn(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: s } = Bn.reduce((r, a) => a(r), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: s };
  };
}
var Bn = [];
function Nt(e) {
  Bn.push(e);
}
function Hn({ name: e }) {
  return Wn().test(e);
}
var Wn = () => new RegExp(`^${It}([^:^.]+)\\b`);
function _s(e, t) {
  return ({ name: n, value: i }) => {
    n === i && (i = "");
    let s = n.match(Wn()), r = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: s ? s[1] : null,
      value: r ? r[1] : null,
      modifiers: a.map((l) => l.replace(".", "")),
      expression: i,
      original: o
    };
  };
}
var ut = "DEFAULT", F = [
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
  ut,
  "teleport"
];
function ys(e, t) {
  let n = F.indexOf(e.type) === -1 ? ut : e.type, i = F.indexOf(t.type) === -1 ? ut : t.type;
  return F.indexOf(n) - F.indexOf(i);
}
function pe(e, t, n = {}, i = {}) {
  return e.dispatchEvent(
    new CustomEvent(t, {
      detail: n,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0,
      // Allows overriding the default event options.
      ...i
    })
  );
}
function K(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((s) => K(s, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let i = e.firstElementChild;
  for (; i; )
    K(i, t), i = i.nextElementSibling;
}
function O(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Xt = !1;
function xs() {
  Xt && O("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Xt = !0, document.body || O("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), pe(document, "alpine:init"), pe(document, "alpine:initializing"), Ct(), Yi((t) => R(t, K)), Ot((t) => G(t)), Sn((t, n) => {
    qt(t, n).forEach((i) => i());
  });
  let e = (t) => !We(t.parentElement, !0);
  Array.from(document.querySelectorAll(zn().join(","))).filter(e).forEach((t) => {
    R(t);
  }), pe(document, "alpine:initialized"), setTimeout(() => {
    Es();
  });
}
var Lt = [], Kn = [];
function Un() {
  return Lt.map((e) => e());
}
function zn() {
  return Lt.concat(Kn).map((e) => e());
}
function Vn(e) {
  Lt.push(e);
}
function Jn(e) {
  Kn.push(e);
}
function We(e, t = !1) {
  return P(e, (n) => {
    if ((t ? zn() : Un()).some((s) => n.matches(s)))
      return !0;
  });
}
function P(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack)
      return P(e._x_teleportBack, t);
    if (e.parentNode instanceof ShadowRoot)
      return P(e.parentNode.host, t);
    if (e.parentElement)
      return P(e.parentElement, t);
  }
}
function ws(e) {
  return Un().some((t) => e.matches(t));
}
var Yn = [];
function Ss(e) {
  Yn.push(e);
}
var ks = 1;
function R(e, t = K, n = () => {
}) {
  P(e, (i) => i._x_ignore) || gs(() => {
    t(e, (i, s) => {
      i._x_marker || (n(i, s), Yn.forEach((r) => r(i, s)), qt(i, i.attributes).forEach((r) => r()), i._x_ignore || (i._x_marker = ks++), i._x_ignore && s());
    });
  });
}
function G(e, t = K) {
  t(e, (n) => {
    Gi(n), En(n), delete n._x_marker;
  });
}
function Es() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    ms(n) || i.some((s) => {
      if (document.querySelector(s))
        return O(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var ft = [], Dt = !1;
function Ft(e = () => {
}) {
  return queueMicrotask(() => {
    Dt || setTimeout(() => {
      pt();
    });
  }), new Promise((t) => {
    ft.push(() => {
      e(), t();
    });
  });
}
function pt() {
  for (Dt = !1; ft.length; )
    ft.shift()();
}
function As() {
  Dt = !0;
}
function jt(e, t) {
  return Array.isArray(t) ? en(e, t.join(" ")) : typeof t == "object" && t !== null ? Os(e, t) : typeof t == "function" ? jt(e, t()) : en(e, t);
}
function ht(e) {
  return e.split(/\s/).filter(Boolean);
}
function en(e, t) {
  let n = (s) => ht(s).filter((r) => !e.classList.contains(r)).filter(Boolean), i = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function Os(e, t) {
  let n = Object.entries(t).flatMap(([a, o]) => o ? ht(a) : !1).filter(Boolean), i = Object.entries(t).flatMap(([a, o]) => o ? !1 : ht(a)).filter(Boolean), s = [], r = [];
  return i.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), r.push(a));
  }), n.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    r.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function Ke(e, t) {
  return typeof t == "object" && t !== null ? Ts(e, t) : $s(e, t);
}
function Ts(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, s]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = Cs(i)), e.style.setProperty(i, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    Ke(e, n);
  };
}
function $s(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Cs(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function bt(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
v("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: s }) => {
  typeof i == "function" && (i = s(i)), i !== !1 && (!i || typeof i == "boolean" ? Ps(e, n, t) : Ms(e, i, t));
});
function Ms(e, t, n) {
  Gn(e, jt, ""), {
    enter: (s) => {
      e._x_transition.enter.during = s;
    },
    "enter-start": (s) => {
      e._x_transition.enter.start = s;
    },
    "enter-end": (s) => {
      e._x_transition.enter.end = s;
    },
    leave: (s) => {
      e._x_transition.leave.during = s;
    },
    "leave-start": (s) => {
      e._x_transition.leave.start = s;
    },
    "leave-end": (s) => {
      e._x_transition.leave.end = s;
    }
  }[n](t);
}
function Ps(e, t, n) {
  Gn(e, Ke);
  let i = !t.includes("in") && !t.includes("out") && !n, s = i || t.includes("in") || ["enter"].includes(n), r = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((y, Z) => Z < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((y, Z) => Z > t.indexOf("out")));
  let a = !t.includes("opacity") && !t.includes("scale"), o = a || t.includes("opacity"), l = a || t.includes("scale"), d = o ? 0 : 1, c = l ? de(t, "scale", 95) / 100 : 1, u = de(t, "delay", 0) / 1e3, b = de(t, "origin", "center"), m = "opacity, transform", T = de(t, "duration", 150) / 1e3, f = de(t, "duration", 75) / 1e3, _ = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (e._x_transition.enter.during = {
    transformOrigin: b,
    transitionDelay: `${u}s`,
    transitionProperty: m,
    transitionDuration: `${T}s`,
    transitionTimingFunction: _
  }, e._x_transition.enter.start = {
    opacity: d,
    transform: `scale(${c})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), r && (e._x_transition.leave.during = {
    transformOrigin: b,
    transitionDelay: `${u}s`,
    transitionProperty: m,
    transitionDuration: `${f}s`,
    transitionTimingFunction: _
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: d,
    transform: `scale(${c})`
  });
}
function Gn(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, s = () => {
    }) {
      mt(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, s);
    },
    out(i = () => {
    }, s = () => {
    }) {
      mt(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, i, s);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, n, i) {
  const s = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let r = () => s(n);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(n) : r() : e._x_transition ? e._x_transition.in(n) : r();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((a, o) => {
    e._x_transition.out(() => {
    }, () => a(i)), e._x_transitioning && e._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(i), queueMicrotask(() => {
    let a = Qn(e);
    a ? (a._x_hideChildren || (a._x_hideChildren = []), a._x_hideChildren.push(e)) : s(() => {
      let o = (l) => {
        let d = Promise.all([
          l._x_hidePromise,
          ...(l._x_hideChildren || []).map(o)
        ]).then(([c]) => c?.());
        return delete l._x_hidePromise, delete l._x_hideChildren, d;
      };
      o(e).catch((l) => {
        if (!l.isFromCancelledTransition)
          throw l;
      });
    });
  });
};
function Qn(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Qn(t);
}
function mt(e, t, { during: n, start: i, end: s } = {}, r = () => {
}, a = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(s).length === 0) {
    r(), a();
    return;
  }
  let o, l, d;
  Rs(e, {
    start() {
      o = t(e, i);
    },
    during() {
      l = t(e, n);
    },
    before: r,
    end() {
      o(), d = t(e, s);
    },
    after: a,
    cleanup() {
      l(), d();
    }
  });
}
function Rs(e, t) {
  let n, i, s, r = bt(() => {
    g(() => {
      n = !0, i || t.before(), s || (t.end(), pt()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(a) {
      this.beforeCancels.push(a);
    },
    cancel: bt(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      r();
    }),
    finish: r
  }, g(() => {
    t.start(), t.during();
  }), As(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), g(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (g(() => {
        t.end();
      }), pt(), setTimeout(e._x_transitioning.finish, a + o), s = !0);
    });
  });
}
function de(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const i = e[e.indexOf(t) + 1];
  if (!i || t === "scale" && isNaN(i))
    return n;
  if (t === "duration" || t === "delay") {
    let s = i.match(/([0-9]+)ms/);
    if (s)
      return s[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [i, e[e.indexOf(t) + 2]].join(" ") : i;
}
var q = !1;
function N(e, t = () => {
}) {
  return (...n) => q ? t(...n) : e(...n);
}
function Is(e) {
  return (...t) => q && e(...t);
}
var Zn = [];
function Ue(e) {
  Zn.push(e);
}
function qs(e, t) {
  Zn.forEach((n) => n(e, t)), q = !0, Xn(() => {
    R(t, (n, i) => {
      i(n, () => {
      });
    });
  }), q = !1;
}
var gt = !1;
function Ns(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), q = !0, gt = !0, Xn(() => {
    Ls(t);
  }), q = !1, gt = !1;
}
function Ls(e) {
  let t = !1;
  R(e, (i, s) => {
    K(i, (r, a) => {
      if (t && ws(r))
        return a();
      t = !0, s(r, a);
    });
  });
}
function Xn(e) {
  let t = Y;
  Zt((n, i) => {
    let s = t(n);
    return re(s), () => {
    };
  }), e(), Zt(t);
}
function ei(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = se({})), e._x_bindings[t] = n, t = i.includes("camel") ? Us(t) : t, t) {
    case "value":
      Ds(e, n);
      break;
    case "style":
      js(e, n);
      break;
    case "class":
      Fs(e, n);
      break;
    case "selected":
    case "checked":
      Bs(e, t, n);
      break;
    default:
      Bt(e, t, n);
      break;
  }
}
function Ds(e, t) {
  if (Ht(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (De(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => zs(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Ks(e, t);
  else if (e.tagName === "OPTION")
    Bt(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Fs(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = jt(e, t);
}
function js(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = Ke(e, t);
}
function Bs(e, t, n) {
  Bt(e, t, n), Ws(e, t, n);
}
function Bt(e, t, n) {
  [null, void 0, !1].includes(n) && Js(t) ? e.removeAttribute(t) : (ti(t) && (n = t), Ys(n) && (n = JSON.stringify(n)), Hs(e, t, n));
}
function Hs(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function Ws(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Ks(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Us(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function zs(e, t) {
  return e == t;
}
function Pe(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Vs = /* @__PURE__ */ new Set([
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
function ti(e) {
  return Vs.has(e);
}
function Js(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Ys(e) {
  return typeof e == "object" && e !== null;
}
function Gs(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : ni(e, t, n);
}
function Qs(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = i, Pn(() => j(e, s.expression));
  }
  return ni(e, t, n);
}
function ni(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : ti(t) ? !![t, "true"].includes(i) : i;
}
function De(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Ht(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function ii(e, t) {
  let n;
  return function() {
    const i = this, s = arguments, r = function() {
      n = null, e.apply(i, s);
    };
    clearTimeout(n), n = setTimeout(r, t);
  };
}
function si(e, t) {
  let n;
  return function() {
    let i = this, s = arguments;
    n || (e.apply(i, s), n = !0, setTimeout(() => n = !1, t));
  };
}
function ri({ get: e, set: t }, { get: n, set: i }) {
  let s = !0, r, a = Y(() => {
    let o = e(), l = n();
    if (s)
      i(Ge(o)), s = !1;
    else {
      let d = JSON.stringify(o), c = JSON.stringify(l);
      d !== r ? i(Ge(o)) : d !== c && t(Ge(l));
    }
    r = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    re(a);
  };
}
function Ge(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Zs(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(oe));
}
var C = {}, tn = !1;
function Xs(e, t) {
  if (tn || (C = se(C), tn = !0), t === void 0)
    return C[e];
  C[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? C[e] = t.initialize(C, e, e, () => {
  }) : Rt(C[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && C[e].init();
}
function er() {
  return C;
}
var ai = {};
function tr(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? oi(e, n()) : (ai[e] = n, () => {
  });
}
function nr(e) {
  return Object.entries(ai).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function oi(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let s = Object.entries(t).map(([a, o]) => ({ name: a, value: o })), r = qn(s);
  return s = s.map((a) => r.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), qt(e, s, n).map((a) => {
    i.push(a.runCleanups), a();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var li = {};
function ir(e, t) {
  li[e] = t;
}
function sr(e, t) {
  return Object.entries(li).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...s) => i.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var rr = {
  get reactive() {
    return se;
  },
  get release() {
    return re;
  },
  get effect() {
    return Y;
  },
  get raw() {
    return vn;
  },
  get transaction() {
    return Ji;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Xi,
  dontAutoEvaluateFunctions: Pn,
  disableEffectScheduling: Ui,
  startObservingMutations: Ct,
  stopObservingMutations: An,
  setReactivityEngine: zi,
  onAttributeRemoved: kn,
  onAttributesAdded: Sn,
  closestDataStack: H,
  skipDuringClone: N,
  onlyDuringClone: Is,
  addRootSelector: Vn,
  addInitSelector: Jn,
  setErrorHandler: rs,
  interceptClone: Ue,
  addScopeToNode: Ae,
  deferMutations: Zi,
  mapAttributes: Nt,
  evaluateLater: w,
  interceptInit: Ss,
  initInterceptors: Rt,
  injectMagics: ve,
  setEvaluator: os,
  setRawEvaluator: ls,
  mergeProxies: W,
  extractProp: Qs,
  findClosest: P,
  onElRemoved: Ot,
  closestRoot: We,
  destroyTree: G,
  interceptor: $n,
  // INTERNAL: not public API and is subject to change without major release.
  transition: mt,
  // INTERNAL
  setStyles: Ke,
  // INTERNAL
  mutateDom: g,
  directive: v,
  entangle: ri,
  throttle: si,
  debounce: ii,
  evaluate: j,
  evaluateRaw: ps,
  initTree: R,
  nextTick: Ft,
  prefixed: ae,
  prefix: bs,
  plugin: Zs,
  magic: E,
  store: Xs,
  start: xs,
  clone: Ns,
  // INTERNAL
  cloneNode: qs,
  // INTERNAL
  bound: Gs,
  $data: On,
  watch: _n,
  walk: K,
  data: ir,
  bind: tr
}, oe = rr;
function ar(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var xe = Object.assign, or = Object.prototype.hasOwnProperty, vt = (e, t) => or.call(e, t), we = Array.isArray, he = (e) => di(e) === "[object Map]", lr = (e) => typeof e == "string", Oe = (e) => typeof e == "symbol", Se = (e) => e !== null && typeof e == "object", dr = Object.prototype.toString, di = (e) => dr.call(e), ci = (e) => di(e).slice(8, -1), Wt = (e) => lr(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, cr = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, ur = cr((e) => e.charAt(0).toUpperCase() + e.slice(1)), D = (e, t) => !Object.is(e, t);
function U(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var p, Qe = /* @__PURE__ */ new WeakSet(), nn = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Qe.has(this) && (Qe.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || fr(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, sn(this), fi(this);
    const e = p, t = k;
    p = this, k = !0;
    try {
      return this.fn();
    } finally {
      p !== this && U(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), pi(this), p = e, k = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        zt(e);
      this.deps = this.depsTail = void 0, sn(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Qe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    _t(this) && this.run();
  }
  get dirty() {
    return _t(this);
  }
}, ui = 0, be, me;
function fr(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = me, me = e;
    return;
  }
  e.next = be, be = e;
}
function Kt() {
  ui++;
}
function Ut() {
  if (--ui > 0)
    return;
  if (me) {
    let t = me;
    for (me = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; be; ) {
    let t = be;
    for (be = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (i) {
          e || (e = i);
        }
      t = n;
    }
  }
  if (e)
    throw e;
}
function fi(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function pi(e) {
  let t, n = e.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), zt(i), hr(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  e.deps = t, e.depsTail = n;
}
function _t(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (pr(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function pr(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Fe) || (e.globalVersion = Fe, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !_t(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = p, i = k;
  p = e, k = !0;
  try {
    fi(e);
    const s = e.fn(e._value);
    (t.version === 0 || D(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    p = n, k = i, pi(e), e.flags &= -3;
  }
}
function zt(e, t = !1) {
  const { dep: n, prevSub: i, nextSub: s } = e;
  if (i && (i.nextSub = s, e.prevSub = void 0), s && (s.prevSub = i, e.nextSub = void 0), n.subsHead === e && (n.subsHead = s), n.subs === e && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      zt(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function hr(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function br(e, t) {
  e.effect instanceof nn && (e = e.effect.fn);
  const n = new nn(e);
  t && xe(n, t);
  try {
    n.run();
  } catch (s) {
    throw n.stop(), s;
  }
  const i = n.run.bind(n);
  return i.effect = n, i;
}
function mr(e) {
  e.effect.stop();
}
var k = !0, hi = [];
function gr() {
  hi.push(k), k = !1;
}
function vr() {
  const e = hi.pop();
  k = e === void 0 ? !0 : e;
}
function sn(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = p;
    p = void 0;
    try {
      t();
    } finally {
      p = n;
    }
  }
}
var Fe = 0, _r = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, yr = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!p || !k || p === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== p)
      t = this.activeLink = new _r(p, this), p.deps ? (t.prevDep = p.depsTail, p.depsTail.nextDep = t, p.depsTail = t) : p.deps = p.depsTail = t, bi(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = p.depsTail, t.nextDep = void 0, p.depsTail.nextDep = t, p.depsTail = t, p.deps === t && (p.deps = n);
    }
    return p.onTrack && p.onTrack(
      xe(
        {
          effect: p
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, Fe++, this.notify(e);
  }
  notify(e) {
    Kt();
    try {
      for (let t = this.subsHead; t; t = t.nextSub)
        t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(
          xe(
            {
              effect: t.sub
            },
            e
          )
        );
      for (let t = this.subs; t; t = t.prevSub)
        t.sub.notify() && t.sub.dep.notify();
    } finally {
      Ut();
    }
  }
};
function bi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        bi(i);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var yt = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ Symbol(
  "Object iterate"
), xt = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), ke = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function S(e, t, n) {
  if (k && p) {
    let i = yt.get(e);
    i || yt.set(e, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new yr()), s.map = i, s.key = n), s.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function I(e, t, n, i, s, r) {
  const a = yt.get(e);
  if (!a) {
    Fe++;
    return;
  }
  const o = (l) => {
    l && l.trigger({
      target: e,
      type: t,
      key: n,
      newValue: i,
      oldValue: s,
      oldTarget: r
    });
  };
  if (Kt(), t === "clear")
    a.forEach(o);
  else {
    const l = we(e), d = l && Wt(n);
    if (l && n === "length") {
      const c = Number(i);
      a.forEach((u, b) => {
        (b === "length" || b === ke || !Oe(b) && b >= c) && o(u);
      });
    } else
      switch ((n !== void 0 || a.has(void 0)) && o(a.get(n)), d && o(a.get(ke)), t) {
        case "add":
          l ? d && o(a.get("length")) : (o(a.get(B)), he(e) && o(a.get(xt)));
          break;
        case "delete":
          l || (o(a.get(B)), he(e) && o(a.get(xt)));
          break;
        case "set":
          he(e) && o(a.get(B));
          break;
      }
  }
  Ut();
}
function X(e) {
  const t = h(e);
  return t === e ? t : (S(t, "iterate", ke), V(e) ? t : t.map(J));
}
function Vt(e) {
  return S(e = h(e), "iterate", ke), e;
}
function A(e, t) {
  return z(e) ? wi(e) ? Ee(J(t)) : Ee(t) : J(t);
}
var xr = {
  __proto__: null,
  [Symbol.iterator]() {
    return Ze(this, Symbol.iterator, (e) => A(this, e));
  },
  concat(...e) {
    return X(this).concat(
      ...e.map((t) => we(t) ? X(t) : t)
    );
  },
  entries() {
    return Ze(this, "entries", (e) => (e[1] = A(this, e[1]), e));
  },
  every(e, t) {
    return $(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return $(
      this,
      "filter",
      e,
      t,
      (n) => n.map((i) => A(this, i)),
      arguments
    );
  },
  find(e, t) {
    return $(
      this,
      "find",
      e,
      t,
      (n) => A(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return $(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return $(
      this,
      "findLast",
      e,
      t,
      (n) => A(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return $(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return $(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Xe(this, "includes", e);
  },
  indexOf(...e) {
    return Xe(this, "indexOf", e);
  },
  join(e) {
    return X(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Xe(this, "lastIndexOf", e);
  },
  map(e, t) {
    return $(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return ce(this, "pop");
  },
  push(...e) {
    return ce(this, "push", e);
  },
  reduce(e, ...t) {
    return rn(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return rn(this, "reduceRight", e, t);
  },
  shift() {
    return ce(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return $(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return ce(this, "splice", e);
  },
  toReversed() {
    return X(this).toReversed();
  },
  toSorted(e) {
    return X(this).toSorted(e);
  },
  toSpliced(...e) {
    return X(this).toSpliced(...e);
  },
  unshift(...e) {
    return ce(this, "unshift", e);
  },
  values() {
    return Ze(this, "values", (e) => A(this, e));
  }
};
function Ze(e, t, n) {
  const i = Vt(e), s = i[t]();
  return i !== e && !V(e) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.done || (r.value = n(r.value)), r;
  }), s;
}
var wr = Array.prototype;
function $(e, t, n, i, s, r) {
  const a = Vt(e), o = a !== e && !V(e), l = a[t];
  if (l !== wr[t]) {
    const u = l.apply(e, r);
    return o ? J(u) : u;
  }
  let d = n;
  a !== e && (o ? d = function(u, b) {
    return n.call(this, A(e, u), b, e);
  } : n.length > 2 && (d = function(u, b) {
    return n.call(this, u, b, e);
  }));
  const c = l.call(a, d, i);
  return o && s ? s(c) : c;
}
function rn(e, t, n, i) {
  const s = Vt(e), r = s !== e && !V(e);
  let a = n, o = !1;
  s !== e && (r ? (o = i.length === 0, a = function(d, c, u) {
    return o && (o = !1, d = A(e, d)), n.call(this, d, A(e, c), u, e);
  }) : n.length > 3 && (a = function(d, c, u) {
    return n.call(this, d, c, u, e);
  }));
  const l = s[t](a, ...i);
  return o ? A(e, l) : l;
}
function Xe(e, t, n) {
  const i = h(e);
  S(i, "iterate", ke);
  const s = i[t](...n);
  return (s === -1 || s === !1) && Nr(n[0]) ? (n[0] = h(n[0]), i[t](...n)) : s;
}
function ce(e, t, n = []) {
  gr(), Kt();
  const i = h(e)[t].apply(e, n);
  return Ut(), vr(), i;
}
var Sr = /* @__PURE__ */ ar("__proto__,__v_isRef,__isVue"), mi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Oe)
);
function kr(e) {
  Oe(e) || (e = String(e));
  const t = h(this);
  return S(t, "has", e), t.hasOwnProperty(e);
}
var gi = class {
  constructor(e = !1, t = !1) {
    this._isReadonly = e, this._isShallow = t;
  }
  get(e, t, n) {
    if (t === "__v_skip")
      return e.__v_skip;
    const i = this._isReadonly, s = this._isShallow;
    if (t === "__v_isReactive")
      return !i;
    if (t === "__v_isReadonly")
      return i;
    if (t === "__v_isShallow")
      return s;
    if (t === "__v_raw")
      return n === (i ? s ? Ir : yi : s ? Rr : _i).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const r = we(e);
    if (!i) {
      let o;
      if (r && (o = xr[t]))
        return o;
      if (t === "hasOwnProperty")
        return kr;
    }
    const a = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      ge(e) ? e : n
    );
    if ((Oe(t) ? mi.has(t) : Sr(t)) || (i || S(e, "get", t), s))
      return a;
    if (ge(a)) {
      const o = r && Wt(t) ? a : a.value;
      return i && Se(o) ? wt(o) : o;
    }
    return Se(a) ? i ? wt(a) : Jt(a) : a;
  }
}, Er = class extends gi {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, i) {
    let s = e[t];
    const r = we(e) && Wt(t);
    if (!this._isShallow) {
      const l = z(s);
      if (!V(n) && !z(n) && (s = h(s), n = h(n)), !r && ge(s) && !ge(n))
        return l ? (U(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (s.value = n, !0);
    }
    const a = r ? Number(t) < e.length : vt(e, t), o = Reflect.set(
      e,
      t,
      n,
      ge(e) ? e : i
    );
    return e === h(i) && o && (a ? D(n, s) && I(e, "set", t, n, s) : I(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = vt(e, t), i = e[t], s = Reflect.deleteProperty(e, t);
    return s && n && I(e, "delete", t, void 0, i), s;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!Oe(t) || !mi.has(t)) && S(e, "has", t), n;
  }
  ownKeys(e) {
    return S(
      e,
      "iterate",
      we(e) ? "length" : B
    ), Reflect.ownKeys(e);
  }
}, Ar = class extends gi {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, t) {
    return U(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, t) {
    return U(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, Or = /* @__PURE__ */ new Er(), Tr = /* @__PURE__ */ new Ar(), Te = (e) => Reflect.getPrototypeOf(e);
function $r(e, t, n) {
  return function(...i) {
    const s = this.__v_raw, r = h(s), a = he(r), o = e === "entries" || e === Symbol.iterator && a, l = e === "keys" && a, d = s[e](...i), c = t ? Ee : J;
    return !t && S(
      r,
      "iterate",
      l ? xt : B
    ), xe(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: u, done: b } = d.next();
          return b ? { value: u, done: b } : {
            value: o ? [c(u[0]), c(u[1])] : c(u),
            done: b
          };
        }
      }
    );
  };
}
function $e(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      U(
        `${ur(e)} operation ${n}failed: target is readonly.`,
        h(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Cr(e, t) {
  const n = {
    get(s) {
      const r = this.__v_raw, a = h(r), o = h(s);
      e || (D(s, o) && S(a, "get", s), S(a, "get", o));
      const { has: l } = Te(a), d = e ? Ee : J;
      if (l.call(a, s))
        return d(r.get(s));
      if (l.call(a, o))
        return d(r.get(o));
      r !== a && r.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && S(h(s), "iterate", B), s.size;
    },
    has(s) {
      const r = this.__v_raw, a = h(r), o = h(s);
      return e || (D(s, o) && S(a, "has", s), S(a, "has", o)), s === o ? r.has(s) : r.has(s) || r.has(o);
    },
    forEach(s, r) {
      const a = this, o = a.__v_raw, l = h(o), d = e ? Ee : J;
      return !e && S(l, "iterate", B), o.forEach((c, u) => s.call(r, d(c), d(u), a));
    }
  };
  return xe(
    n,
    e ? {
      add: $e("add"),
      set: $e("set"),
      delete: $e("delete"),
      clear: $e("clear")
    } : {
      add(s) {
        const r = h(this), a = Te(r), o = h(s), l = !V(s) && !z(s) ? o : s;
        return a.has.call(r, l) || D(s, l) && a.has.call(r, s) || D(o, l) && a.has.call(r, o) || (r.add(l), I(r, "add", l, l)), this;
      },
      set(s, r) {
        !V(r) && !z(r) && (r = h(r));
        const a = h(this), { has: o, get: l } = Te(a);
        let d = o.call(a, s);
        d ? an(a, o, s) : (s = h(s), d = o.call(a, s));
        const c = l.call(a, s);
        return a.set(s, r), d ? D(r, c) && I(a, "set", s, r, c) : I(a, "add", s, r), this;
      },
      delete(s) {
        const r = h(this), { has: a, get: o } = Te(r);
        let l = a.call(r, s);
        l ? an(r, a, s) : (s = h(s), l = a.call(r, s));
        const d = o ? o.call(r, s) : void 0, c = r.delete(s);
        return l && I(r, "delete", s, void 0, d), c;
      },
      clear() {
        const s = h(this), r = s.size !== 0, a = he(s) ? new Map(s) : new Set(s), o = s.clear();
        return r && I(
          s,
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
  ].forEach((s) => {
    n[s] = $r(s, e);
  }), n;
}
function vi(e, t) {
  const n = Cr(e);
  return (i, s, r) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? i : Reflect.get(
    vt(n, s) && s in i ? n : i,
    s,
    r
  );
}
var Mr = {
  get: /* @__PURE__ */ vi(!1)
}, Pr = {
  get: /* @__PURE__ */ vi(!0)
};
function an(e, t, n) {
  const i = h(n);
  if (i !== n && t.call(e, i)) {
    const s = ci(e);
    U(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var _i = /* @__PURE__ */ new WeakMap(), Rr = /* @__PURE__ */ new WeakMap(), yi = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new WeakMap();
function qr(e) {
  switch (e) {
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
function Jt(e) {
  return /* @__PURE__ */ z(e) ? e : xi(
    e,
    !1,
    Or,
    Mr,
    _i
  );
}
function wt(e) {
  return xi(
    e,
    !0,
    Tr,
    Pr,
    yi
  );
}
function xi(e, t, n, i, s) {
  if (!Se(e))
    return U(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = s.get(e);
  if (r)
    return r;
  const a = qr(ci(e));
  if (a === 0)
    return e;
  const o = new Proxy(
    e,
    a === 2 ? i : n
  );
  return s.set(e, o), o;
}
function wi(e) {
  return /* @__PURE__ */ z(e) ? /* @__PURE__ */ wi(e.__v_raw) : !!(e && e.__v_isReactive);
}
function z(e) {
  return !!(e && e.__v_isReadonly);
}
function V(e) {
  return !!(e && e.__v_isShallow);
}
function Nr(e) {
  return e ? !!e.__v_raw : !1;
}
function h(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ h(t) : e;
}
var J = (e) => Se(e) ? /* @__PURE__ */ Jt(e) : e, Ee = (e) => Se(e) ? /* @__PURE__ */ wt(e) : e;
function ge(e) {
  return e ? e.__v_isRef === !0 : !1;
}
E("nextTick", () => Ft);
E("dispatch", (e) => pe.bind(pe, e));
E("watch", (e, { evaluateLater: t, cleanup: n }) => (i, s) => {
  let r = t(i), o = _n(() => {
    let l;
    return r((d) => l = d), l;
  }, s);
  n(o);
});
E("store", er);
E("data", (e) => On(e));
E("root", (e) => We(e));
E("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = W(Lr(e))), e._x_refs_proxy));
function Lr(e) {
  let t = [];
  return P(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var et = {};
function Si(e) {
  return et[e] || (et[e] = 0), ++et[e];
}
function Dr(e, t) {
  return P(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Fr(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Si(t));
}
E("id", (e, { cleanup: t }) => (n, i = null) => {
  let s = `${n}${i ? `-${i}` : ""}`;
  return jr(e, s, t, () => {
    let r = Dr(e, n), a = r ? r._x_ids[n] : Si(n);
    return i ? `${n}-${a}-${i}` : `${n}-${a}`;
  });
});
Ue((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function jr(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = i();
  return e._x_id[t] = s, n(() => {
    delete e._x_id[t];
  }), s;
}
E("el", (e) => e);
ki("Focus", "focus", "focus");
ki("Persist", "persist", "persist");
function ki(e, t, n) {
  E(t, (i) => O(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
v("modelable", (e, { expression: t }, { effect: n, evaluateLater: i, cleanup: s }) => {
  let r = i(t), a = () => {
    let c;
    return r((u) => c = u), c;
  }, o = i(`${t} = __placeholder`), l = (c) => o(() => {
  }, { scope: { __placeholder: c } }), d = a();
  l(d), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let c = e._x_model.get, u = e._x_model.setWithModifiers, b = ri(
      {
        get() {
          return c();
        },
        set(m) {
          u(m);
        }
      },
      {
        get() {
          return a();
        },
        set(m) {
          l(m);
        }
      }
    );
    s(b);
  });
});
v("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && O("x-teleport can only be used on a <template> tag", e);
  let s = on(n), r = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = r, r._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    r.addEventListener(o, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Ae(r, {}, e);
  let a = (o, l, d) => {
    d.includes("prepend") ? l.parentNode.insertBefore(o, l) : d.includes("append") ? l.parentNode.insertBefore(o, l.nextSibling) : l.appendChild(o);
  };
  g(() => {
    N(() => {
      a(r, s, t), R(r);
    })();
  }), e._x_teleportPutBack = () => {
    let o = on(n);
    g(() => {
      a(e._x_teleport, o, t);
    });
  }, i(
    () => g(() => {
      r.remove(), G(r);
    })
  );
});
var Br = document.createElement("div");
function on(e) {
  let t = N(() => document.querySelector(e), () => Br)();
  return t || O(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Ei = () => {
};
Ei.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
v("ignore", Ei);
v("effect", N((e, { expression: t }, { effect: n }) => {
  n(w(e, t));
}));
function te(e, t, n, i) {
  let s = e, r = (l) => i(l), a = {}, o = (l, d) => (c) => d(l, c);
  return n.includes("dot") && (t = Hr(t)), n.includes("camel") && (t = Wr(t)), n.includes("capture") && (a.capture = !0), n.includes("window") && (s = window), n.includes("document") && (s = document), n.includes("passive") && (a.passive = n[n.indexOf("passive") + 1] !== "false"), r = Ai(n, r), n.includes("prevent") && (r = o(r, (l, d) => {
    d.preventDefault(), l(d);
  })), n.includes("stop") && (r = o(r, (l, d) => {
    d.stopPropagation(), l(d);
  })), n.includes("once") && (r = o(r, (l, d) => {
    l(d), s.removeEventListener(t, r, a);
  })), (n.includes("away") || n.includes("outside")) && (s = document, r = o(r, (l, d) => {
    e.contains(d.target) || d.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(d));
  })), n.includes("self") && (r = o(r, (l, d) => {
    d.target === e && l(d);
  })), t === "submit" && (r = o(r, (l, d) => {
    d.target._x_pendingModelUpdates && d.target._x_pendingModelUpdates.forEach((c) => c()), l(d);
  })), (Ur(t) || Oi(t)) && (r = o(r, (l, d) => {
    zr(d, n) || l(d);
  })), s.addEventListener(t, r, a), () => {
    s.removeEventListener(t, r, a);
  };
}
function Ai(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", i = je(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = ii(t, i);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", i = je(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = si(t, i);
  }
  return t;
}
function Hr(e) {
  return e.replace(/-/g, ".");
}
function Wr(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function je(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Kr(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Ur(e) {
  return ["keydown", "keyup"].includes(e);
}
function Oi(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function zr(e, t) {
  let n = t.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(r));
  if (n.includes("debounce")) {
    let r = n.indexOf("debounce");
    n.splice(r, je((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let r = n.indexOf("throttle");
    n.splice(r, je((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && ln(e.key).includes(n[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => n.includes(r));
  return n = n.filter((r) => !s.includes(r)), !(s.length > 0 && s.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), e[`${a}Key`])).length === s.length && (Oi(e.type) || ln(e.key).includes(n[0])));
}
function ln(e) {
  if (!e)
    return [];
  e = Kr(e);
  let t = {
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
  return t[e] = e, Object.keys(t).map((n) => {
    if (t[n] === e)
      return n;
  }).filter((n) => n);
}
v("model", (e, { modifiers: t, expression: n }, { effect: i, cleanup: s }) => {
  let r = e;
  t.includes("parent") && (r = P(e, (f) => f !== e));
  let a = w(r, n), o;
  typeof n == "string" ? o = w(r, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = w(r, `${n()} = __placeholder`) : o = () => {
  };
  let l = () => {
    let f;
    return a((_) => f = _), dn(f) ? f.get() : f;
  }, d = (f) => {
    let _;
    a((y) => _ = y), dn(_) ? _.set(f) : o(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && e.type === "radio" && g(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let c = t.includes("change") || t.includes("lazy"), u = t.includes("blur"), b = t.includes("enter"), m = c || u || b, T;
  if (q)
    T = () => {
    };
  else if (m) {
    let f = [], _ = (y) => d(Ce(e, t, y, l()));
    if (c && f.push(te(e, "change", t, _)), u && (f.push(te(e, "blur", t, _)), e.form)) {
      let y = e.form, Z = () => _({ target: e });
      y._x_pendingModelUpdates || (y._x_pendingModelUpdates = []), y._x_pendingModelUpdates.push(Z), s(() => {
        y._x_pendingModelUpdates && y._x_pendingModelUpdates.splice(y._x_pendingModelUpdates.indexOf(Z), 1);
      });
    }
    b && f.push(te(e, "keydown", t, (y) => {
      y.key === "Enter" && _(y);
    })), T = () => f.forEach((y) => y());
  } else {
    let f = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    T = te(e, f, t, (_) => {
      d(Ce(e, t, _, l()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || De(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    Ce(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = T, s(() => e._x_removeModelListeners.default()), e.form) {
    let f = te(e.form, "reset", [], (_) => {
      Ft(() => e._x_model && e._x_model.set(Ce(e, t, { target: e }, l())));
    });
    s(() => f());
  }
  if (e._x_model = {
    get() {
      return l();
    },
    set(f) {
      d(f);
    },
    setWithModifiers: Ai(t, d)
  }, e._x_forceModelUpdate = (f) => {
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), g(() => {
      De(e) ? Array.isArray(f) ? e.checked = f.some((_) => _ == e.value) : e.checked = !!f : Ht(e) ? typeof f == "boolean" ? e.checked = Pe(e.value) === f : e.checked = e.value == f : ei(e, "value", f);
    });
  }, e.tagName === "SELECT") {
    let f = new MutationObserver(() => {
      e._x_forceModelUpdate(l());
    });
    f.observe(e, { childList: !0 }), s(() => f.disconnect());
  }
  i(() => {
    let f = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(f);
  });
});
function Ce(e, t, n, i) {
  return g(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (De(e))
      if (Array.isArray(i)) {
        let s = null;
        return t.includes("number") ? s = tt(n.target.value) : t.includes("boolean") ? s = Pe(n.target.value) : s = n.target.value, n.target.checked ? i.includes(s) ? i : i.concat([s]) : i.filter((r) => !Vr(r, s));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return tt(r);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return Pe(r);
        }) : Array.from(n.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return Ht(e) ? n.target.checked ? s = n.target.value : s = i : s = n.target.value, t.includes("number") ? tt(s) : t.includes("boolean") ? Pe(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function tt(e) {
  let t = e ? parseFloat(e) : null;
  return Jr(t) ? t : e;
}
function Vr(e, t) {
  return e == t;
}
function Jr(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function dn(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
v("cloak", (e) => queueMicrotask(() => g(() => e.removeAttribute(ae("cloak")))));
Jn(() => `[${ae("init")}]`);
v("init", N((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
v("text", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let s = i(t);
  n(() => {
    s((r) => {
      g(() => {
        e.textContent = r;
      });
    });
  });
});
v("html", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let s = i(t);
  n(() => {
    s((r) => {
      g(() => {
        Array.from(e.children).forEach((a) => G(a)), e.innerHTML = r ?? "", e._x_ignoreSelf = !0, R(e), delete e._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
Nt(Dn(":", Fn(ae("bind:"))));
var Ti = (e, { value: t, modifiers: n, expression: i, original: s }, { effect: r, cleanup: a }) => {
  if (!t) {
    let l = {};
    nr(l), w(e, i)((c) => {
      oi(e, c, s);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return Yr(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = w(e, i);
  r(() => o((l) => {
    l === void 0 && typeof i == "string" && i.match(/\./) && (l = ""), g(() => ei(e, t, l, n));
  })), a(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Ti.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
v("bind", Ti);
function Yr(e, t) {
  e._x_keyExpression = t;
}
Vn(() => `[${ae("data")}]`);
var L = /* @__PURE__ */ Symbol();
v("data", (e, { expression: t }, { cleanup: n }) => {
  if (Qr(e))
    return;
  let i = e[L];
  if (i?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let s = {};
  ve(s, e);
  let r = {};
  sr(r, s);
  let a = j(e, t, { scope: r });
  (a === void 0 || a === !0) && (a = {}), ve(a, e);
  let o;
  if (i?.reactiveData) {
    o = i.reactiveData, Gr(o, a);
    let d = { expression: t };
    e[L] = d, queueMicrotask(() => {
      e[L] === d && delete e[L];
    });
  } else
    o = se(a);
  Rt(o, n);
  let l = Ae(e, o);
  o.init && j(e, o.init), n(() => {
    o.destroy && j(e, o.destroy), l();
    let d = { reactiveData: o };
    e[L] = d, queueMicrotask(() => {
      e[L] === d && delete e[L];
    });
  });
});
function Gr(e, t) {
  Object.keys(t).forEach((n) => {
    let i = Object.getOwnPropertyDescriptor(t, n), s = Object.getOwnPropertyDescriptor(e, n);
    i.get || i.set || s?.get || s?.set ? (s && delete e[n], s || (e[n] = void 0), i.get || i.set ? Object.defineProperty(e, n, i) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
Ue((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Qr(e) {
  return q ? gt ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
v("show", (e, { modifiers: t, expression: n }, { effect: i }) => {
  let s = w(e, n);
  e._x_doHide || (e._x_doHide = () => {
    g(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    g(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let r = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, a = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, o = () => setTimeout(a), l = bt(
    (u) => u ? a() : r(),
    (u) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, u, a, r) : u ? o() : r();
    }
  ), d, c = !0;
  i(() => s((u) => {
    !c && u === d || (t.includes("immediate") && (u ? o() : r()), l(u), d = u, c = !1);
  }));
});
v("for", N((e, { expression: t }, { effect: n, cleanup: i }) => {
  let s = ea(t), r = w(e, s.items), a = w(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => Xr(e, s, r, a), { priority: "structural" }), i(() => {
    e._x_lookup.forEach(
      (o) => g(() => {
        G(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function Zr(e) {
  return (t) => {
    Object.entries(t).forEach(([n, i]) => {
      e[n] = i;
    });
  };
}
function Xr(e, t, n, i) {
  n((s) => {
    na(s) && (s = Array.from({ length: s }, (d, c) => c + 1)), s == null && (s = []), s instanceof Set && (s = Array.from(s)), s instanceof Map && (s = Array.from(s));
    let r = e._x_lookup, a = /* @__PURE__ */ new Map();
    e._x_lookup = a;
    let o = ia(s), l = Object.entries(s).map(([d, c]) => {
      o || (d = parseInt(d));
      let u = ta(t, c, d, s), b;
      return i((m) => {
        typeof m == "object" && O("x-for key cannot be an object, it must be a string or an integer", e), r.has(m) && (a.set(m, r.get(m)), r.delete(m)), b = m;
      }, { scope: { index: d, ...u } }), [b, u];
    });
    g(() => {
      r.forEach((u) => {
        G(u), u.remove();
      });
      let d = /* @__PURE__ */ new Set(), c = e;
      l.forEach(([u, b]) => {
        if (a.has(u)) {
          let f = a.get(u);
          f._x_refreshXForScope(b), c.nextElementSibling !== f && (c.nextElementSibling && f.replaceWith(c.nextElementSibling), c.after(f)), c = f, f._x_currentIfEl && (f.nextElementSibling !== f._x_currentIfEl && c.after(f._x_currentIfEl), c = f._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && O("x-for templates require a single root element, additional elements will be ignored.", e);
        let m = document.importNode(e.content, !0).firstElementChild, T = se(b);
        Ae(m, T, e), m._x_refreshXForScope = Zr(T), a.set(u, m), d.add(m), c.after(m), c = m;
      }), d.forEach((u) => R(u)), c !== e ? e._x_lastRenderedEl = c : delete e._x_lastRenderedEl;
    });
  });
}
function ea(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = e.match(i);
  if (!s)
    return;
  let r = {};
  r.items = s[2].trim();
  let a = s[1].replace(n, "").trim(), o = a.match(t);
  return o ? (r.item = a.replace(t, "").trim(), r.index = o[1].trim(), o[2] && (r.collection = o[2].trim())) : r.item = a, r;
}
function ta(e, t, n, i) {
  let s = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    s[a] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    s[a] = t[a];
  }) : s[e.item] = t, e.index && (s[e.index] = n), e.collection && (s[e.collection] = i), s;
}
function na(e) {
  return typeof e != "object" && !isNaN(e);
}
function ia(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function $i() {
}
$i.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = We(e);
  i && (i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]));
};
v("ref", $i);
v("if", N((e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && O("x-if can only be used on a <template> tag", e);
  let s = w(e, t), r = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return Ae(o, {}, e), g(() => {
      e.after(o), R(o);
    }), e._x_currentIfEl = o, e._x_lastRenderedEl = o, e._x_undoIf = () => {
      g(() => {
        G(o), o.remove();
      }), delete e._x_currentIfEl, delete e._x_lastRenderedEl;
    }, o;
  }, a = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => s((o) => {
    o ? r() : a();
  }), { priority: "structural" }), i(() => e._x_undoIf && e._x_undoIf());
}));
v("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((s) => Fr(e, s));
});
Ue((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Nt(Dn("@", Fn(ae("on:"))));
v("on", N((e, { value: t, modifiers: n, expression: i }, { cleanup: s }) => {
  let r = i ? w(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let a = te(e, t, n, (o) => {
    r(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  s(() => a());
}));
ze("Collapse", "collapse", "collapse");
ze("Intersect", "intersect", "intersect");
ze("Focus", "trap", "focus");
ze("Mask", "mask", "mask");
function ze(e, t, n) {
  v(t, (i) => O(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
oe.setEvaluator(ds);
oe.setRawEvaluator(hs);
oe.setReactivityEngine({
  reactive: Jt,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = br(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: mr,
  raw: h
});
var sa = oe, Re = sa;
function ra(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const Be = "__siteationDebugBarHostLock";
function aa(e) {
  if (!e || window[Be]) return;
  const t = document.body, n = Math.max(0, window.innerWidth - document.documentElement.clientWidth), i = {
    overflow: t.style.overflow,
    paddingRight: t.style.paddingRight,
    inert: []
  };
  if (Array.from(t.children).forEach((s) => {
    s === e || s.contains(e) || !(s instanceof HTMLElement) || s.matches("script, style, link") || (i.inert.push([s, s.inert]), s.inert = !0);
  }), t.style.overflow = "hidden", n > 0) {
    const s = Number.parseFloat(window.getComputedStyle(t).paddingRight || "0");
    t.style.paddingRight = `${s + n}px`;
  }
  window[Be] = i;
}
function oa() {
  const e = window[Be];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[Be]);
}
function cn(e, t) {
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(t.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((a) => a.offsetParent !== null);
  if (n.length === 0) return;
  const i = n[0], s = n[n.length - 1], r = t.getRootNode().activeElement;
  e.shiftKey && r === i ? (e.preventDefault(), s.focus()) : !e.shiftKey && r === s && (e.preventDefault(), i.focus());
}
const St = [
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
  },
  {
    id: "alpine",
    label: "Alpine",
    lead: "The components on the page right now, their state, and what has not started."
  }
];
function Ci(e, t) {
  switch (e) {
    case "findings":
      return t.findings.length || null;
    case "overview":
      return null;
    case "timeline":
      return t.timeline.count || null;
    case "queries":
      return t.queries.count || null;
    case "blocks":
      return t.blocks.unique_count || null;
    case "observers":
      return t.observers.unique_count || null;
    case "events":
      return t.events.unique_count || null;
    case "cache":
      return t.cache.count || null;
    case "plugins":
      return t.interception.plugin_count || null;
    case "alpine":
      return t.alpineComponents.length || null;
    default:
      return null;
  }
}
const la = {
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
function x(e, t = "") {
  return `<svg class="ndb-icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${la[e] || ""}</svg>`;
}
function da(e) {
  return [...ca(e), ...ua(e), ...fa(e)];
}
function ca(e) {
  return St.map((t) => {
    const n = Ci(t.id, e);
    return {
      id: `section:${t.id}`,
      group: "Go to",
      label: t.label,
      hint: e.section === t.id ? "Active section" : n ? String(n) : "",
      keywords: t.id,
      kind: "section",
      arg: t.id
    };
  });
}
function ua(e) {
  const t = [
    { value: "system", label: "Follow the system theme" },
    { value: "light", label: "Use the light theme" },
    { value: "dark", label: "Use the dark theme" }
  ], n = e.currentSection || {};
  return [
    ...t.map((i) => ({
      id: `theme:${i.value}`,
      group: "Appearance",
      label: i.label,
      hint: e.theme === i.value ? "Current" : "",
      keywords: `theme ${i.value}`,
      kind: "theme",
      arg: i.value
    })),
    {
      id: "placement",
      group: "Appearance",
      label: e.placement === "bottom" ? "Move the bar to the top" : "Move the bar to the bottom",
      hint: "",
      keywords: "placement dock top bottom move",
      kind: "placement",
      arg: ""
    },
    {
      id: "favourite",
      group: "Appearance",
      label: e.isFavourite(e.section) ? `Unpin ${n.label} from favourites` : `Pin ${n.label} to favourites`,
      hint: "",
      keywords: "favourite pin star sidebar",
      kind: "favourite",
      arg: e.section
    }
  ];
}
function fa(e) {
  return [
    {
      id: "inspector",
      group: "Window",
      label: e.open ? "Minimise the inspector" : "Open the inspector",
      hint: "",
      keywords: "open close minimise inspector panel",
      kind: "inspector",
      arg: ""
    },
    {
      id: "maximise",
      group: "Window",
      label: e.maximised ? "Restore the inspector" : "Maximise the inspector",
      hint: "",
      keywords: "maximise restore fullscreen size",
      kind: "maximise",
      arg: ""
    },
    {
      id: "dismiss",
      group: "Window",
      label: "Hide the bar until the next page load",
      hint: "",
      keywords: "hide dismiss close",
      kind: "dismiss",
      arg: ""
    }
  ];
}
function pa(e, t) {
  const n = String(t || "").trim().toLowerCase(), i = n ? e.filter((s) => `${s.group} ${s.label} ${s.keywords}`.toLowerCase().includes(n)) : e;
  return i.map((s, r) => ({
    ...s,
    leads: r === 0 || i[r - 1].group !== s.group
  }));
}
function ha() {
  return `
<div class="ndb-palette" data-ndb-bind:class="paletteOpen && 'is-open'"
     data-ndb-on:keydown="paletteKeys($event)">
  <div class="ndb-palette-backdrop" data-ndb-on:click="closePalette()"></div>

  <div class="ndb-palette-box" data-ndb-ref="palette"
       role="dialog" aria-modal="true" aria-label="Commands">
    <div class="ndb-palette-field">
      ${x("search")}
      <input class="ndb-palette-input" type="text" data-ndb-ref="paletteInput"
             data-ndb-model="paletteSearch" autocomplete="off" spellcheck="false"
             placeholder="Search sections and settings" aria-label="Search commands">
    </div>

    <ul class="ndb-palette-list">
      <template data-ndb-for="(command, position) in visibleCommands"
                data-ndb-bind:key="command.id">
        <li>
          <p class="ndb-palette-heading" data-ndb-show="command.leads"
             data-ndb-text="command.group"></p>
          <button type="button" class="ndb-palette-item"
                  data-ndb-bind:class="paletteIndex === position && 'is-active'"
                  data-ndb-on:click="runCommand(command)"
                  data-ndb-on:mousemove="paletteIndex = position">
            <span class="ndb-palette-label" data-ndb-text="command.label"></span>
            <span class="ndb-palette-hint" data-ndb-text="command.hint"></span>
          </button>
        </li>
      </template>
    </ul>

    <p class="ndb-palette-empty" data-ndb-show="visibleCommands.length === 0">
      Nothing matches.
    </p>

    <div class="ndb-palette-foot">
      <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
      <span><kbd>&crarr;</kbd> Select</span>
      <span><kbd>Esc</kbd> Close</span>
    </div>
  </div>
</div>`;
}
const ie = "full", Mi = "masked", Q = "none", ba = "[redacted]", ma = "[masked]", ga = "[maximum depth reached]", va = "[circular]", _a = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, ya = 5, Ie = 100, un = 400;
function xa(e) {
  return [ie, Mi, Q].includes(e) ? e : ie;
}
function wa(e) {
  return _a.test(String(e));
}
function Pi(e, t = ie) {
  if (t !== Q)
    return Yt(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function kt(e, t = ie) {
  return t === Q ? "" : t === Mi ? e === "" ? "" : ma : e.length <= un ? e : `${e.slice(0, un)}...`;
}
function Sa(e, t = ie) {
  if (t === Q) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return kt(n, ie);
}
function Yt(e, t, n, i) {
  if (e == null) return e;
  const s = typeof e;
  return s === "string" ? kt(e, t) : s === "number" || s === "boolean" ? e : s === "function" ? `ƒ ${e.name || "anonymous"}()` : s === "symbol" ? e.toString() : s === "bigint" ? `${e}n` : s !== "object" ? s : e instanceof Node ? Aa(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${kt(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= ya ? ga : i.has(e) ? va : (i.add(e), Array.isArray(e) ? ka(e, t, n, i) : Ea(e, t, n, i));
}
function ka(e, t, n, i) {
  const s = e.slice(0, Ie).map((r) => Yt(r, t, n + 1, i));
  return e.length > Ie && s.push(`[${e.length - Ie} more]`), s;
}
function Ea(e, t, n, i) {
  const s = Gt(e), r = {};
  let a = 0;
  for (const o of s) {
    if (a >= Ie) {
      r.__truncated__ = s.length - a;
      break;
    }
    if (wa(o)) {
      r[o] = ba, a++;
      continue;
    }
    try {
      r[o] = Yt(e[o], t, n + 1, i);
    } catch (l) {
      r[o] = `[unreadable: ${l && l.message ? l.message : "threw"}]`;
    }
    a++;
  }
  return r;
}
function Gt(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function Aa(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
const nt = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map();
let fn = 0;
function Ve() {
  const e = st || window.Alpine;
  return !e || typeof e != "object" || e === Re ? null : e;
}
function Ri(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function Et(e) {
  const t = console.warn;
  try {
    return console.warn = () => {
    }, e();
  } catch {
    return;
  } finally {
    console.warn = t;
  }
}
function Oa(e) {
  if (typeof e.evaluate != "function") return null;
  const t = Et(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function pn() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function Ta(e) {
  if (typeof e.injectMagics == "function") {
    const t = Et(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = Et(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function $a(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function Ca(e) {
  if (e.id) return `#${e.id}`;
  const t = [];
  let n = e;
  for (; n && n !== document.body && t.length < 4; ) {
    const i = n.parentElement, s = n.tagName.toLowerCase();
    if (n.id) {
      t.unshift(`#${n.id}`);
      break;
    }
    if (i) {
      const r = Array.from(i.children).filter((a) => a.tagName === n.tagName);
      t.unshift(r.length > 1 ? `${s}:nth-of-type(${r.indexOf(n) + 1})` : s);
    } else
      t.unshift(s);
    n = i;
  }
  return t.join(" > ");
}
function Ma(e) {
  return nt.has(e) || (fn += 1, nt.set(e, fn)), nt.get(e);
}
function Ii(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function Pa(e) {
  const t = Ve();
  if (He.clear(), !t) return [];
  const n = Ri(t), i = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((r) => {
    const a = Ma(r), o = (r.getAttribute(n) || "").trim(), l = (r.getAttribute(i) || "").trim(), d = Ii(t, r);
    return He.set(a, r), {
      id: a,
      name: $a(o),
      expression: Sa(o, e),
      path: Ca(r),
      initialised: !!r._x_dataStack,
      deferred: r.hasAttribute(i),
      strategy: l || "none",
      keys: e === Q || !d ? 0 : Gt(d).length
    };
  });
}
function hn(e, t) {
  if (t === Q)
    return "The value policy is set to none, so component state is not read.";
  const n = Ve(), i = He.get(e);
  if (!n || !i) return "This component is no longer on the page.";
  if (!i._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const s = Ii(n, i);
  if (!s) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(Pi(s, t), null, 2);
  } catch (r) {
    return `Could not read this component: ${r && r.message ? r.message : "threw"}`;
  }
}
function Ra(e) {
  const t = Ve();
  if (!t) return [];
  const n = Ta(t);
  return n ? Object.keys(n).map((i) => {
    let s = n[i], r = 0;
    if (r = s && typeof s == "object" ? Gt(s).length : 0, e === Q)
      return { name: i, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      s = JSON.stringify(Pi(s, e), null, 2);
    } catch (a) {
      s = `Could not read this store: ${a && a.message ? a.message : "threw"}`;
    }
    return { name: i, keys: r, value: s };
  }) : [];
}
function Ia() {
  const e = window.__siteationDebugBar;
  return !e || !Array.isArray(e.alpineErrors) ? [] : e.alpineErrors.map((t) => {
    const n = String(t.message || ""), i = n.match(/Expression: "([\s\S]*?)"/);
    return {
      message: n.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""),
      expression: i ? i[1] : "",
      element: String(t.element || ""),
      during_init: !!t.during_init
    };
  });
}
function qa() {
  const e = Ve();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: Oa(e),
    source: pn(),
    prefix: Ri(e)
  } : { present: !1, version: "", csp: null, source: pn(), prefix: "" };
}
function Na(e, t) {
  const n = He.get(e);
  if (!(!n || !n.style)) {
    if (t) {
      ue.has(e) || ue.set(e, n.style.outline || ""), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
      return;
    }
    ue.has(e) && (n.style.outline = ue.get(e), n.style.removeProperty("outline-offset"), ue.delete(e));
  }
}
const La = 1e3, qi = "siteation.debugbar.v1", Da = "__PROFILE_ID__";
function Fa() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function ja() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(qi) || "{}") };
  } catch {
    return e;
  }
}
function ee(e, t, n) {
  const i = t.trim().toLowerCase();
  return i ? e.filter((s) => n.some(
    (r) => String(s[r] ?? "").toLowerCase().includes(i)
  )) : e;
}
function Ba() {
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
    alpineTab: "components",
    alpineSearch: "",
    alpineLive: !0,
    alpineComponents: [],
    alpineStores: [],
    alpineHealth: { present: !1, version: "", csp: null, source: "", prefix: "" },
    alpineErrors: [],
    alpineExpanded: [],
    alpineStates: {},
    alpineTimer: null,
    // The Alpine section reads live objects instead of a redacted profile, so it has to
    // apply the policy itself. See Model/Redactor.php for the stored half.
    valuePolicy: "full",
    timelineFilter: "key",
    timelineSearch: "",
    returnFocusTo: null,
    paletteOpen: !1,
    paletteSearch: "",
    paletteIndex: 0,
    paletteReturnFocus: null,
    payloads: {},
    loading: !1,
    loadError: "",
    requests: [],
    activeId: null,
    pageProfile: {},
    init() {
      this.profile = Fa(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const e = ja();
      this.open = e.open, this.section = e.section, this.placement = e.placement === "top" ? "top" : "bottom", this.maximised = !!e.maximised, this.theme = ["system", "light", "dark"].includes(e.theme) ? e.theme : "system", this.favourites = Array.isArray(e.favourites) ? e.favourites.filter((t) => St.some((n) => n.id === t)) : [], this.watchColorScheme(), this.valuePolicy = xa(this.rootElement()?.dataset.valuePolicy), this.refreshAlpine(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), document.addEventListener("keydown", (t) => this.paletteShortcut(t)), this.open && this.$nextTick(() => this.lock()), this.requests = ra((t) => {
        this.requests.some((n) => n.id === t.id) || (this.requests = [t, ...this.requests].slice(0, 25));
      }).filter((t) => t.id !== this.profile.id), this.open && this.loadPayloads();
    },
    /** @returns {HTMLElement|null} the host element, which carries the bar's settings */
    rootElement() {
      return document.getElementById("siteation-debugbar");
    },
    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(e) {
      const t = this.rootElement()?.dataset.profileUrl;
      return t ? t.replace(Da, encodeURIComponent(e)) : null;
    },
    /**
     * Swap the whole bar over to another profile the page has since produced.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async showProfile(e) {
      if (e === this.activeId) return;
      const t = this.profileUrlFor(e);
      if (t) {
        this.loading = !0, this.loadError = "";
        try {
          const n = await fetch(t, { headers: { Accept: "application/json" } });
          if (!n.ok) throw new Error(`HTTP ${n.status}`);
          const i = await n.json(), s = {};
          Object.entries(i.sections || {}).forEach(([r, a]) => {
            s[r] = a.payload || {};
          }), this.profile = i, this.payloads = s, this.activeId = e;
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
    shortUrl(e) {
      try {
        return new URL(e, window.location.origin).pathname;
      } catch {
        return e;
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
      const e = this.profileUrlFor(this.profile.id || "");
      if (e) {
        this.loading = !0, this.loadError = "";
        try {
          const t = await fetch(e, { headers: { Accept: "application/json" } });
          if (!t.ok) throw new Error(`HTTP ${t.status}`);
          const n = await t.json(), i = {};
          Object.entries(n.sections || {}).forEach(([s, r]) => {
            i[s] = r.payload || {};
          }), this.payloads = i;
        } catch (t) {
          this.loadError = String(t.message || t);
        } finally {
          this.loading = !1;
        }
      }
    },
    /**
     * @param {string} key
     * @returns {object}
     */
    summaryOf(e) {
      return this.profile.sections?.[e]?.summary || {};
    },
    /**
     * @param {string} key
     * @returns {Array<object>}
     */
    itemsOf(e) {
      return this.payloads[e]?.items || this.profile.sections?.[e]?.payload?.items || [];
    },
    /** @returns {Array<object>} */
    get findings() {
      return this.profile.findings || [];
    },
    /** @returns {number} */
    get errorCount() {
      return this.findings.filter((e) => e.severity === "error").length;
    },
    /** @returns {number} */
    get warningCount() {
      return this.findings.filter((e) => e.severity === "warning").length;
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
      const e = this.queryFilter === "slow" ? this.itemsOf("queries").filter((t) => t.slow) : this.itemsOf("queries");
      return ee(e, this.querySearch, ["sql"]);
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const e = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((t) => t.observer_count === 0) : this.itemsOf("events");
      return ee(e, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return ee(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      return ee(this.itemsOf("blocks"), this.blockSearch, ["name", "template", "class"]);
    },
    /**
     * Key activity hides the long tail of fast points, which on a Magento page is most of
     * the list and none of the answer.
     *
     * @returns {Array<object>}
     */
    get visibleTimeline() {
      const e = this.timelineFilter === "key" ? this.itemsOf("timeline").filter(
        (t) => t.kind === "milestone" || Number(t.duration_ms || 0) >= 1
      ) : this.itemsOf("timeline");
      return ee(e, this.timelineSearch, ["label", "section"]);
    },
    /** @returns {Array<object>} */
    get timelineAxis() {
      const e = Number(this.timeline.scale_ms || 0);
      return [0, 0.25, 0.5, 0.75, 1].map((t) => ({
        percent: t * 100,
        label: `${(e * t).toFixed(e < 10 ? 1 : 0)} ms`
      }));
    },
    /** @returns {Array<object>} */
    get visiblePlugins() {
      const e = this.pluginSearch.trim().toLowerCase();
      return e ? this.itemsOf("interception").filter((t) => t.type.toLowerCase().includes(e) || t.plugins.some((n) => n.code.toLowerCase().includes(e) || n.class.toLowerCase().includes(e))) : this.itemsOf("interception");
    },
    /** @returns {Array<object>} */
    get visibleAlpineComponents() {
      const e = this.alpineTab === "deferred" ? this.alpineComponents.filter((t) => t.deferred) : this.alpineComponents;
      return ee(e, this.alpineSearch, ["name", "expression", "path"]);
    },
    /** @returns {number} */
    get alpineDeferredCount() {
      return this.alpineComponents.filter((e) => e.deferred).length;
    },
    /**
     * A deferred component that has not run yet is the usual answer to "why is nothing
     * happening", so it is worth counting on its own.
     *
     * @returns {number}
     */
    get alpinePendingCount() {
      return this.alpineComponents.filter((e) => !e.initialised).length;
    },
    /** @returns {string} */
    get alpineBuild() {
      return this.alpineHealth.csp === null ? "could not tell" : this.alpineHealth.csp ? "CSP friendly" : "standard";
    },
    /** @returns {Array<object>} */
    get commands() {
      return da(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return pa(this.commands, this.paletteSearch);
    },
    /** @returns {boolean} whether the page should be re-read on a timer */
    get alpineLiveWanted() {
      return this.open && !this.dismissed && this.alpineLive && this.section === "alpine";
    },
    /** @returns {string} */
    get statusPhrase() {
      const e = Number(this.request.status || 0);
      return e >= 500 ? "Error" : e >= 400 ? "Refused" : e >= 300 ? "Redirect" : "Success";
    },
    /** @returns {string} */
    get statusTone() {
      const e = Number(this.request.status || 0);
      return e >= 500 ? "bad" : e >= 400 ? "warn" : "ok";
    },
    /**
     * Developer mode is where the bar belongs. Default mode still allows it, and is close
     * enough to production to be worth a colour.
     *
     * @returns {string}
     */
    get modeTone() {
      return this.request.mode === "developer" ? "ok" : "warn";
    },
    /**
     * The one line version of what happened, for the top of the overview.
     *
     * @returns {string}
     */
    get outcomePhrase() {
      const e = Number(this.request.status || 0), t = `${this.number(this.metrics.duration_ms, 2)} ms`;
      return e >= 500 ? `Failed after ${t}` : e >= 400 ? `Refused after ${t}` : e >= 300 ? `Redirected after ${t}` : `Completed successfully in ${t}`;
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
      const e = this.cache.hit_rate;
      return e == null ? "ok" : e < 50 ? "warn" : "ok";
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
      return St.map((e) => ({ ...e, count: Ci(e.id, this) }));
    },
    /** @returns {Array<object>} pinned sections, in the order they were arranged */
    get favouriteSections() {
      return this.favourites.map((e) => this.sections.find((t) => t.id === e)).filter(Boolean);
    },
    /** @returns {Array<object>} */
    get otherSections() {
      return this.sections.filter((e) => !this.favourites.includes(e.id));
    },
    /** @returns {object} */
    get currentSection() {
      return this.sections.find((e) => e.id === this.section) || this.sections[0];
    },
    /**
     * A section shows its own findings at the top, so the evidence and the conclusion sit
     * together rather than in two different places.
     *
     * @returns {Array<object>}
     */
    get sectionFindings() {
      return this.section === "findings" ? [] : this.findings.filter((e) => e.section === this.section);
    },
    /** @param {string} id */
    isFavourite(e) {
      return this.favourites.includes(e);
    },
    /** @param {string} id */
    toggleFavourite(e) {
      this.favourites = this.isFavourite(e) ? this.favourites.filter((t) => t !== e) : [...this.favourites, e], this.persist();
    },
    /** @param {string} id */
    startDrag(e) {
      this.draggingId = e;
    },
    /** @param {string} id */
    dragOver(e) {
      this.draggingId && e !== this.draggingId && (this.dropTargetId = e);
    },
    /** @param {string} id */
    drop(e) {
      const t = this.favourites.indexOf(this.draggingId), n = this.favourites.indexOf(e);
      if (t > -1 && n > -1 && t !== n) {
        const i = [...this.favourites];
        i.splice(n, 0, i.splice(t, 1)[0]), this.favourites = i, this.persist();
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
      const e = window.matchMedia("(prefers-color-scheme: light)"), t = () => {
        this.resolvedTheme = this.theme === "system" ? e.matches ? "light" : "dark" : this.theme;
      };
      t(), this.stopWatchingScheme?.(), e.addEventListener("change", t), this.stopWatchingScheme = () => e.removeEventListener("change", t);
    },
    /** @param {string} theme */
    setTheme(e) {
      this.theme = ["system", "light", "dark"].includes(e) ? e : "system", this.watchColorScheme(), this.persist();
    },
    cycleTheme() {
      const e = ["system", "light", "dark"];
      this.setTheme(e[(e.indexOf(this.theme) + 1) % e.length]);
    },
    openInspector() {
      this.open || (this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), oa(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus());
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
      aa(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(e) {
      if (e.key === "Escape") {
        this.closeInspector();
        return;
      }
      cn(e, this.$refs.sheet);
    },
    /** @param {string} section */
    select(e) {
      this.section = e, this.navOpen = !1, this.openInspector(), this.persist();
    },
    /**
     * Findings are only useful if they lead somewhere, so each one carries the section
     * and filter that hold its evidence.
     *
     * @param {object} action
     */
    follow(e) {
      e && (e.filter && e.section === "queries" && (this.queryFilter = e.filter === "repeated" ? "all" : e.filter, this.querySearch = ""), this.select(e.section));
    },
    /**
     * The one section whose data is not in the profile, so it is read again rather than
     * waited for.
     */
    refreshAlpine() {
      this.alpineHealth = qa(), this.alpineComponents = Pa(this.valuePolicy), this.alpineStores = Ra(this.valuePolicy), this.alpineErrors = Ia(), this.alpineExpanded.forEach((e) => {
        this.alpineStates[e] = hn(e, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, La);
        return;
      }
      !this.alpineLiveWanted && this.alpineTimer && (clearInterval(this.alpineTimer), this.alpineTimer = null);
    },
    /**
     * @param {number} id
     * @returns {boolean}
     */
    isAlpineExpanded(e) {
      return this.alpineExpanded.includes(e);
    },
    /**
     * State is read here rather than during the scan, because a page carries dozens of
     * components and walking all of them to fill rows nobody opened is work for nothing.
     *
     * @param {number} id
     */
    toggleAlpineComponent(e) {
      if (this.isAlpineExpanded(e)) {
        this.alpineExpanded = this.alpineExpanded.filter((t) => t !== e), delete this.alpineStates[e];
        return;
      }
      this.alpineExpanded = [...this.alpineExpanded, e], this.alpineStates[e] = hn(e, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(e, t) {
      Na(e, t);
    },
    /**
     * The palette does not lock the host itself. When the inspector is open the page is
     * already inert, and when it is not, locking here would have to be undone in the one
     * case where the command that just ran opened the inspector.
     */
    openPalette() {
      this.paletteOpen || this.dismissed || (this.paletteReturnFocus = this.$root.getRootNode().activeElement, this.paletteSearch = "", this.paletteIndex = 0, this.paletteOpen = !0, this.$nextTick(() => this.$refs.paletteInput?.focus()));
    },
    closePalette() {
      this.paletteOpen && (this.paletteOpen = !1, typeof this.paletteReturnFocus?.focus == "function" && this.paletteReturnFocus.focus(), this.paletteReturnFocus = null);
    },
    togglePalette() {
      this.paletteOpen ? this.closePalette() : this.openPalette();
    },
    /** @param {KeyboardEvent} event */
    paletteShortcut(e) {
      e.code !== "KeyP" || !e.shiftKey || !(e.metaKey || e.ctrlKey) || (e.preventDefault(), this.togglePalette());
    },
    /** @param {KeyboardEvent} event */
    paletteKeys(e) {
      if (e.key === "Escape") {
        e.stopPropagation(), this.closePalette();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault(), this.movePalette(1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault(), this.movePalette(-1);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault(), this.runCommand(this.visibleCommands[this.paletteIndex]);
        return;
      }
      cn(e, this.$refs.palette);
    },
    /** @param {number} step */
    movePalette(e) {
      const t = this.visibleCommands.length;
      t !== 0 && (this.paletteIndex = (this.paletteIndex + e + t) % t, this.$nextTick(() => {
        this.$refs.palette?.querySelector(".ndb-palette-item.is-active")?.scrollIntoView({ block: "nearest" });
      }));
    },
    /**
     * The palette closes first, so focus goes back to whatever opened it before the
     * command moves it somewhere else.
     *
     * @param {object} command
     */
    runCommand(e) {
      if (e)
        switch (this.closePalette(), e.kind) {
          case "section":
            this.select(e.arg);
            break;
          case "theme":
            this.setTheme(e.arg);
            break;
          case "placement":
            this.movePlacement();
            break;
          case "favourite":
            this.toggleFavourite(e.arg);
            break;
          case "inspector":
            this.toggle();
            break;
          case "maximise":
            this.toggleMaximised();
            break;
          case "dismiss":
            this.dismiss();
            break;
        }
    },
    /**
     * @param {string} section
     * @returns {boolean}
     */
    isSection(e) {
      return this.section === e;
    },
    persist() {
      try {
        localStorage.setItem(qi, JSON.stringify({
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
    number(e, t = 0) {
      return Number(e || 0).toFixed(t);
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(e) {
      return Object.entries(e.methods || {}).map(([t, n]) => `${n} ${t}`).join(", ");
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(e) {
      const t = Number(e || 0);
      return t < 1024 ? `${t} B` : t < 1048576 ? `${(t / 1024).toFixed(1)} kB` : `${(t / 1048576).toFixed(1)} MB`;
    }
  };
}
function Me(e) {
  return `<dl class="ndb-facts">${e.map((n) => {
    const i = ["ndb-fact-value", n.mono ? "ndb-mono" : ""].filter(Boolean).join(" "), s = n.tone ? ` data-ndb-bind:class="'is-' + (${n.tone})"` : "", r = n.raw ? `<dd class="${i}"${s}>${n.value}</dd>` : `<dd class="${i}"${s} data-ndb-text="${n.value}"></dd>`;
    return `
  <div class="ndb-fact">
    <dt>${n.label}</dt>
    ${r}
  </div>`;
  }).join("")}
</dl>`;
}
function bn({ sheet: e }) {
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
    <div class="ndb-stat">
      <span class="ndb-env-dot" data-ndb-bind:class="'is-' + modeTone"></span>
      <span>
        <span class="ndb-stat-key">Mode</span>
        <span class="ndb-stat-value" data-ndb-text="request.mode || 'unknown'"></span>
      </span>
    </div>

    <div class="ndb-stat">
      ${x("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </div>

    <div class="ndb-stat">
      ${x("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </div>

    <div class="ndb-stat is-secondary">
      ${x("chip", "is-accent")}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </div>
  </div>

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openPalette()"
            title="Search sections and settings">
      ${x("search")}
    </button>

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

    <span class="ndb-controls-divider"></span>

    ${e ? `
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
function mn(e, t) {
  return `
<template data-ndb-for="item in ${e}" data-ndb-bind:key="item.id">
  <div class="ndb-nav-row"
       data-ndb-bind:class="dropTargetId === item.id && 'is-drop-target'"
       ${t ? `
       draggable="true"
       data-ndb-on:dragstart="startDrag(item.id)"
       data-ndb-on:dragover.prevent="dragOver(item.id)"
       data-ndb-on:drop.prevent="drop(item.id)"
       data-ndb-on:dragend="endDrag()"` : ""}>
    <button type="button" class="ndb-nav-item"
            data-ndb-bind:class="isSection(item.id) && 'is-active'"
            data-ndb-on:click="select(item.id)">
      <span class="ndb-nav-label" data-ndb-text="item.label"></span>
      <span class="ndb-nav-count" data-ndb-show="item.count"
            data-ndb-text="item.count"></span>
    </button>
    <button type="button" class="ndb-nav-pin"
            data-ndb-bind:class="isFavourite(item.id) && 'is-on'"
            data-ndb-on:click="toggleFavourite(item.id)"
            data-ndb-bind:title="isFavourite(item.id) ? 'Unpin' : 'Pin to favourites'">
      ${x("star")}
    </button>
  </div>
</template>`;
}
function Ha() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${mn("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${mn("otherSections", !1)}
</nav>`;
}
function Wa(e, t) {
  return `<div class="ndb-subtabs" role="tablist">${t.map((i) => `
  <button type="button" class="ndb-subtab" role="tab"
          data-ndb-bind:aria-selected="${e} === '${i.id}' ? 'true' : 'false'"
          data-ndb-bind:class="${e} === '${i.id}' && 'is-active'"
          data-ndb-on:click="${e} = '${i.id}'">
    <span>${i.label}</span>
    ${i.count ? `<span class="ndb-pill" data-ndb-show="${i.count}" data-ndb-text="${i.count}"></span>` : ""}
  </button>`).join("")}</div>`;
}
const Ka = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme">

  <div class="ndb-dock" data-ndb-show="!open && !dismissed" data-ndb-cloak>
    ${bn({ sheet: !1 })}
  </div>

  ${ha()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${bn({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${x("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${Ha()}

        <div class="ndb-nav-scrim" data-ndb-show="navOpen"
             data-ndb-on:click="navOpen = false"></div>

    <div class="ndb-panel-body">

      <header class="ndb-section-head">
        <h2 data-ndb-text="currentSection.label"></h2>
        <p data-ndb-text="currentSection.lead"></p>
      </header>

      <div class="ndb-callout is-warn" data-ndb-show="sectionFindings.length > 0">
        <template data-ndb-for="(finding, index) in sectionFindings" data-ndb-bind:key="index">
          <div>
            <p class="ndb-callout-title" data-ndb-text="finding.message"></p>
            <p data-ndb-text="finding.why"></p>
          </div>
        </template>
      </div>

      <div class="ndb-callout is-clear"
           data-ndb-show="section !== 'findings' && sectionFindings.length === 0">
        <p class="ndb-callout-title">No clear problem found</p>
        <p>Nothing in this section matched a rule.</p>
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
        <div class="ndb-summary">
          <span class="ndb-method" data-ndb-text="request.method || 'GET'"></span>
          <code class="ndb-summary-path" data-ndb-text="request.path || '/'"></code>
          <span class="ndb-summary-status" data-ndb-bind:class="'is-' + statusTone">
            <span data-ndb-text="request.status"></span>
            <span data-ndb-text="statusPhrase"></span>
          </span>
          <span class="ndb-summary-note" data-ndb-text="outcomePhrase"></span>
        </div>

        <p class="ndb-note" data-ndb-show="looksLikeFullPageCacheHit">
          No queries and no events. This page was almost certainly served from the full
          page cache, so the application never ran.
        </p>

        <ol class="ndb-steps">
          <li class="ndb-step">
            <h3>Received</h3>
            <p>Magento accepted the request and chose an area for it.</p>
            ${Me([
  { label: "Path", value: "request.path || '/'", mono: !0 },
  { label: "Method", value: "request.method || 'GET'" },
  { label: "Area", value: "request.area" },
  { label: "Kind", value: "request.is_ajax ? 'AJAX' : 'Document'" },
  { label: "Scheme", value: "request.is_secure ? 'https' : 'http'" },
  { label: "Deploy mode", value: "request.mode || 'unknown'", tone: "modeTone" }
])}
          </li>

          <li class="ndb-step">
            <h3>Matched</h3>
            <p>Routing resolved a controller, and the object manager built what it needed.</p>
            ${Me([
  { label: "Route", value: "request.route || 'unknown'", mono: !0 },
  { label: "Action", value: "request.action || 'unknown'", mono: !0 },
  { label: "Intercepted types", value: "interception.plugin_count || 0" },
  { label: "Observers run", value: "observers.count || 0" }
])}
          </li>

          <li class="ndb-step">
            <h3>Responded</h3>
            <p>What the work cost, and what went back to the browser.</p>
            ${Me([
  { label: "Status", value: "request.status", tone: "statusTone" },
  { label: "Response size", value: "bytes(request.response_bytes)" },
  { label: "Duration", value: "number(metrics.duration_ms, 2) + ' ms'", tone: "durationTone" },
  { label: "Memory peak", value: "number(metrics.memory_peak_mb, 1) + ' MB'" },
  {
    label: "Queries",
    raw: !0,
    value: `<span data-ndb-text="queries.count || 0"></span> <small data-ndb-text="'in ' + number(queries.duration_ms, 1) + ' ms'"></small>`
  },
  {
    label: "Blocks",
    raw: !0,
    value: `<span data-ndb-text="blocks.unique_count || 0"></span> <small data-ndb-text="'in ' + number(blocks.duration_ms, 1) + ' ms'"></small>`
  },
  {
    label: "Events",
    raw: !0,
    value: `<span data-ndb-text="events.count || 0"></span> <small data-ndb-text="events.unique_count + ' unique'"></small>`
  },
  {
    label: "Cache",
    value: "cache.hit_rate === null ? 'no reads' : number(cache.hit_rate, 1) + '% hit rate'",
    tone: "cacheTone"
  }
])}
          </li>
        </ol>

        <p class="ndb-profile-id">
          Profile <code class="ndb-mono ndb-dim" data-ndb-text="profile.id"></code>
        </p>
      </div>

      <div data-ndb-show="isSection('timeline')">
        <div class="ndb-subhead">
          <div>
            <h3>Waterfall</h3>
            <p>
              <span data-ndb-text="timeline.count || 0"></span> events across
              <span data-ndb-text="number(timeline.scale_ms, 0)"></span> ms
            </p>
          </div>
          <p class="ndb-legend">
            <span class="ndb-legend-bar"></span> Duration
            <span class="ndb-legend-dot"></span> Event
          </p>
        </div>

        <div class="ndb-fields">
          <div class="ndb-field">
            <span class="ndb-field-label">Show activity</span>
            <div class="ndb-chips">
              <button type="button" class="ndb-chip" data-ndb-on:click="timelineFilter = 'key'"
                      data-ndb-bind:class="timelineFilter === 'key' && 'is-active'">Key activity</button>
              <button type="button" class="ndb-chip" data-ndb-on:click="timelineFilter = 'all'"
                      data-ndb-bind:class="timelineFilter === 'all' && 'is-active'">Everything</button>
            </div>
          </div>

          <div class="ndb-field is-search">
            <span class="ndb-field-label">Search activity</span>
            <input class="ndb-search" type="search" placeholder="Event or section"
                   data-ndb-model="timelineSearch">
          </div>
        </div>

        <p class="ndb-dim ndb-count ndb-shown" data-ndb-show="visibleTimeline.length !== timeline.count">
          <span data-ndb-text="visibleTimeline.length"></span> of
          <span data-ndb-text="timeline.count || 0"></span> shown
        </p>

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

      <div data-ndb-show="isSection('alpine')">
        <p class="ndb-note" data-ndb-show="!alpineHealth.present">
          No Alpine on this page. This section reads the page's own instance, so it has
          nothing to show until a theme loads one.
        </p>

        <div data-ndb-show="alpineHealth.present">
          ${Wa("alpineTab", [
  { id: "components", label: "Components", count: "alpineComponents.length" },
  { id: "stores", label: "Stores", count: "alpineStores.length" },
  { id: "deferred", label: "Deferred", count: "alpineDeferredCount" },
  { id: "health", label: "Health", count: "alpineErrors.length" }
])}

          <p class="ndb-note" data-ndb-show="valuePolicy !== 'full'">
            The value policy is set to <span data-ndb-text="valuePolicy"></span>, so
            component state is treated exactly as a stored profile would be.
          </p>

          <div data-ndb-show="alpineTab === 'components' || alpineTab === 'deferred'">
            <div class="ndb-controls">
              <input class="ndb-search" type="search" placeholder="Filter components"
                     data-ndb-model="alpineSearch">
              <button type="button" class="ndb-chip"
                      data-ndb-bind:class="alpineLive && 'is-active'"
                      data-ndb-on:click="alpineLive = !alpineLive"
                      data-ndb-bind:title="alpineLive ? 'Stop reading the page' : 'Read the page again every second'">
                Live
              </button>
              <button type="button" class="ndb-chip" data-ndb-on:click="refreshAlpine()"
                      title="Read the page now">Refresh</button>
              <span class="ndb-dim ndb-count">
                <span data-ndb-text="visibleAlpineComponents.length"></span> shown,
                <span data-ndb-text="alpinePendingCount"></span> not started
              </span>
            </div>

            <p class="ndb-note" data-ndb-show="alpineTab === 'deferred' && alpineDeferredCount === 0">
              Nothing on this page is deferred. Hyva defers a component with x-defer, and
              until it runs the component has no state at all.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="component in visibleAlpineComponents"
                        data-ndb-bind:key="component.id">
                <li class="ndb-alpine">
                  <button type="button" class="ndb-alpine-head"
                          data-ndb-on:click="toggleAlpineComponent(component.id)"
                          data-ndb-on:mouseenter="highlightAlpine(component.id, true)"
                          data-ndb-on:mouseleave="highlightAlpine(component.id, false)"
                          data-ndb-on:focus="highlightAlpine(component.id, true)"
                          data-ndb-on:blur="highlightAlpine(component.id, false)">
                    ${x("caret", "ndb-alpine-caret")}
                    <span class="ndb-alpine-name" data-ndb-text="component.name"></span>
                    <span class="ndb-tag is-warn" data-ndb-show="!component.initialised">
                      not started
                    </span>
                    <span class="ndb-tag" data-ndb-show="component.deferred"
                          data-ndb-text="'defer: ' + component.strategy"></span>
                    <span class="ndb-alpine-path ndb-mono ndb-dim ndb-truncate"
                          data-ndb-text="component.path"></span>
                    <span class="ndb-pill" data-ndb-show="component.keys"
                          data-ndb-text="component.keys"></span>
                  </button>

                  <div class="ndb-alpine-body" data-ndb-show="isAlpineExpanded(component.id)">
                    <code class="ndb-alpine-expression" data-ndb-show="component.expression"
                          data-ndb-text="component.expression"></code>
                    <pre class="ndb-json" data-ndb-text="alpineStates[component.id]"></pre>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-empty" data-ndb-show="visibleAlpineComponents.length === 0">
              No components match.
            </p>
          </div>

          <div data-ndb-show="alpineTab === 'stores'">
            <div class="ndb-controls">
              <span class="ndb-dim ndb-count">
                <span data-ndb-text="alpineStores.length"></span> registered with
                Alpine.store()
              </span>
            </div>

            <ol class="ndb-list">
              <template data-ndb-for="store in alpineStores" data-ndb-bind:key="store.name">
                <li class="ndb-alpine">
                  <div class="ndb-alpine-head is-static">
                    <span class="ndb-alpine-name" data-ndb-text="store.name"></span>
                    <span class="ndb-pill" data-ndb-show="store.keys"
                          data-ndb-text="store.keys"></span>
                  </div>
                  <div class="ndb-alpine-body">
                    <pre class="ndb-json" data-ndb-text="store.value"></pre>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-empty" data-ndb-show="alpineStores.length === 0">
              No stores. Alpine keeps them in module state with no public getter, so an
              empty list can also mean this version does not let the bar reach them.
            </p>
          </div>

          <div data-ndb-show="alpineTab === 'health'">
            ${Me([
  { label: "Version", value: "alpineHealth.version" },
  { label: "Build", value: "alpineBuild" },
  { label: "Prefix", value: "alpineHealth.prefix", mono: !0 },
  { label: "Loaded from", value: "alpineHealth.source || 'not a separate file'", mono: !0 },
  { label: "Components", value: "alpineComponents.length" },
  { label: "Not started", value: "alpinePendingCount" },
  { label: "Deferred", value: "alpineDeferredCount" },
  { label: "Stores", value: "alpineStores.length" }
])}

            <p class="ndb-empty" data-ndb-show="alpineErrors.length === 0">
              No expression errors on this page.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="(error, index) in alpineErrors"
                        data-ndb-bind:key="index">
                <li class="ndb-finding is-error">
                  <div class="ndb-finding-head">
                    <span class="ndb-severity is-error"
                          data-ndb-text="error.during_init ? 'init' : 'runtime'"></span>
                    <span class="ndb-finding-message" data-ndb-text="error.message"></span>
                  </div>
                  <p class="ndb-finding-where" data-ndb-show="error.expression">
                    <strong>Expression</strong> <code data-ndb-text="error.expression"></code>
                  </p>
                  <p class="ndb-finding-where" data-ndb-show="error.element">
                    <strong>Where</strong> <code data-ndb-text="error.element"></code>
                  </p>
                </li>
              </template>
            </ol>
          </div>
        </div>
      </div>

      </div>
      </div>
    </div>
  </div>

</div>
`, Ua = "data-ndb-", za = "siteation-debugbar";
function Va(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const s = document.createElement("link");
    s.rel = "stylesheet", s.href = n, t.append(s);
  }
  const i = document.createElement("div");
  return i.innerHTML = Ka, t.append(...i.children), t.querySelector(".ndb");
}
const it = document.getElementById(za);
if (it && !it.shadowRoot) {
  const e = Va(it);
  Re.prefix(Ua), Re.data("debugBar", Ba), e && Re.initTree(e), st && (window.Alpine = st);
}
