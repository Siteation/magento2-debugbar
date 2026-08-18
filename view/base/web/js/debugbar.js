const kn = window.Alpine;
var An = !1, On = !1, ue = [], Mn = -1, Ht = !1, Gn = !1;
function ha(e) {
  ma(e);
}
function ba() {
  Gn = !0;
}
function ga() {
  Gn = !1, is();
}
function ma(e) {
  ue.includes(e) || (ue.push(e), e._x_schedulerPriority !== void 0 && (Ht = !0)), is();
}
function _a(e) {
  let t = ue.indexOf(e);
  t !== -1 && t > Mn && ue.splice(t, 1);
}
function is() {
  if (!On && !An) {
    if (Gn)
      return;
    An = !0, queueMicrotask(ya);
  }
}
function ya() {
  An = !1, On = !0;
  for (let e = 0; e < ue.length; e++)
    Ht && va(e), ue[e](), Mn = e;
  ue.length = 0, Mn = -1, Ht = !1, On = !1;
}
function va(e) {
  let t = /* @__PURE__ */ new Map(), n = ue.slice(e).sort((i, s) => xa(i, s, t));
  for (let i = 0; i < n.length; i++)
    ue[e + i] = n[i];
  Ht = !1;
}
function xa(e, t, n) {
  return hn(e) ? hn(t) ? $i(e._x_schedulerPriority.el, n) - $i(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : hn(t) ? 1 : 0;
}
function hn(e) {
  return e._x_schedulerPriority !== void 0;
}
function $i(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, i = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(i, n), n;
}
var Xe, De, Ye, ss, wa = 0, Tn = !0;
function Ea(e) {
  Tn = !1, e(), Tn = !0;
}
function Sa(e) {
  Xe = e.reactive, Ye = e.release, De = (t) => e.effect(t, { scheduler: (n) => {
    Tn ? ha(n) : n();
  } }), ss = e.raw;
}
function Pi(e) {
  De = e;
}
function ka(e) {
  let t = () => {
  };
  return [(i, s) => {
    let r = s?.priority === "structural" ? wa++ : void 0, a = De(i);
    return r !== void 0 && a !== void 0 && (a._x_schedulerPriority = { el: e, order: r }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(a), t = () => {
      a !== void 0 && (e._x_effects.delete(a), Ye(a));
    }, a;
  }, () => {
    t();
  }];
}
function rs(e, t) {
  let n = !0, i, s, r = De(() => {
    let a = e(), o = JSON.stringify(a);
    if (!n && (typeof a == "object" || a !== i)) {
      let c = typeof i == "object" ? JSON.parse(s) : i;
      queueMicrotask(() => {
        t(a, c);
      });
    }
    i = a, s = o, n = !1;
  });
  return () => Ye(r);
}
async function Aa(e) {
  ba();
  try {
    await e(), await Promise.resolve();
  } finally {
    ga();
  }
}
var as = [], os = [], ls = [];
function Oa(e) {
  ls.push(e);
}
function Vn(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, os.push(t));
}
function cs(e) {
  as.push(e);
}
function ds(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function us(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((s) => s()), delete e._x_attributeCleanups[n]);
  });
}
function Ma(e) {
  for (e._x_effects?.forEach(_a); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var Jn = new MutationObserver(Qn), Zn = !1;
function Xn() {
  Jn.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), Zn = !0;
}
function ps() {
  Ta(), Jn.disconnect(), Zn = !1;
}
var it = [];
function Ta() {
  let e = Jn.takeRecords();
  it.push(() => e.length > 0 && Qn(e));
  let t = it.length;
  queueMicrotask(() => {
    if (it.length === t)
      for (; it.length > 0; )
        it.shift()();
  });
}
function q(e) {
  if (!Zn)
    return e();
  ps();
  let t = e();
  return Xn(), t;
}
var Yn = !1, Ut = [];
function Ra() {
  Yn = !0;
}
function Na() {
  Yn = !1, Qn(Ut), Ut = [];
}
function Qn(e) {
  if (Yn) {
    Ut = Ut.concat(e);
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
      let a = e[r].target, o = e[r].attributeName, c = e[r].oldValue, d = () => {
        i.has(a) || i.set(a, []), i.get(a).push({ name: o, value: a.getAttribute(o) });
      }, f = () => {
        s.has(a) || s.set(a, []), s.get(a).push(o);
      };
      a.hasAttribute(o) && c === null ? d() : a.hasAttribute(o) ? (f(), d()) : f();
    }
  s.forEach((r, a) => {
    us(a, r);
  }), i.forEach((r, a) => {
    as.forEach((o) => o(a, r));
  });
  for (let r of n)
    t.some((a) => a.contains(r)) || os.forEach((a) => a(r));
  for (let r of t)
    r.isConnected && ls.forEach((a) => a(r));
  t = null, n = null, i = null, s = null;
}
function fs(e) {
  return Ne(Re(e));
}
function xt(e, t, n) {
  return e._x_dataStack = [t, ...Re(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function Re(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? Re(e.host) : e.parentNode ? Re(e.parentNode) : [];
}
function Ne(e) {
  return new Proxy({ objects: e }, Ca);
}
function hs(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : hs(Object.getPrototypeOf(e), t);
}
var Ca = {
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
    return t == "toJSON" ? Ia : Reflect.get(
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
      if (s = hs(a, t), s)
        break;
    s || (s = e[e.length - 1]);
    const r = Object.getOwnPropertyDescriptor(s, t);
    return r?.set && r?.get ? r.set.call(i, n) || !0 : Reflect.set(s, t, n);
  }
};
function Ia() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function ei(e, t = () => {
}) {
  let n = (s) => typeof s == "object" && !Array.isArray(s) && s !== null, i = (s, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(s)).forEach(([a, { value: o, enumerable: c }]) => {
      if (c === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let d = r === "" ? a : `${r}.${a}`;
      typeof o == "object" && o !== null && o._x_interceptor ? s[a] = o.initialize(e, d, a, t) : n(o) && o !== s && !(o instanceof Element) && i(o, d);
    });
  };
  return i(e);
}
function bs(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, s, r, a) {
      return e(this.initialValue, () => $a(i, s), (o) => Rn(i, s, o), s, r, a);
    }
  };
  return t(n), (i) => {
    if (typeof i == "object" && i !== null && i._x_interceptor) {
      let s = n.initialize.bind(n);
      n.initialize = (r, a, o, c) => {
        let d = i.initialize(r, a, o, c);
        return n.initialValue = d, s(r, a, o, c);
      };
    } else
      n.initialValue = i;
    return n;
  };
}
function $a(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function Rn(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Rn(e[t[0]], t.slice(1), n);
  }
}
var gs = {};
function ie(e, t) {
  gs[e] = t;
}
function ft(e, t) {
  let n = Pa(t);
  return Object.entries(gs).forEach(([i, s]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return s(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function Pa(e) {
  let [t, n] = Es(e), i = { interceptor: bs, ...t };
  return Vn(e, n), i;
}
function La(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (s) {
    ht(s, e, t);
  }
}
function ht(...e) {
  return ms(...e);
}
var ms = qa;
function Da(e) {
  ms = e;
}
function qa(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var Je = !0;
function _s(e) {
  let t = Je;
  Je = !1;
  let n = e();
  return Je = t, n;
}
function Me(e, t, n = {}) {
  let i;
  return J(e, t)((s) => i = s, n), i;
}
function J(...e) {
  return ys(...e);
}
var ys = () => {
};
function Ba(e) {
  ys = e;
}
var vs;
function ja(e) {
  vs = e;
}
function Fa(e, t) {
  let n = {};
  ft(n, e);
  let i = [n, ...Re(e)], s = typeof t == "function" ? Ha(i, t) : Wa(i, t, e);
  return La.bind(null, e, t, s);
}
function Ha(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: s = [], context: r } = {}) => {
    if (!Je) {
      bt(n, t, Ne([i, ...e]), s);
      return;
    }
    let a = t.apply(Ne([i, ...e]), s);
    bt(n, a);
  };
}
var bn = {};
function Ua(e, t) {
  if (bn[e])
    return bn[e];
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
      return ht(a, t, e), Promise.resolve();
    }
  })();
  return bn[e] = r, r;
}
function Wa(e, t, n) {
  let i = Ua(t, n);
  return (s = () => {
  }, { scope: r = {}, params: a = [], context: o } = {}) => {
    i.result = void 0, i.finished = !1;
    let c = Ne([r, ...e]);
    if (typeof i == "function") {
      let d = i.call(o, i, c).catch((f) => ht(f, n, t));
      i.finished ? (bt(s, i.result, c, a, n), i.result = void 0) : d.then((f) => {
        bt(s, f, c, a, n);
      }).catch((f) => ht(f, n, t)).finally(() => i.result = void 0);
    }
  };
}
function bt(e, t, n, i, s) {
  if (Je && typeof t == "function") {
    let r = t.apply(n, i);
    r instanceof Promise ? r.then((a) => bt(e, a, n, i)).catch((a) => ht(a, s, t)) : e(r);
  } else typeof t == "object" && t instanceof Promise ? t.then((r) => e(r)) : e(t);
}
function Ka(...e) {
  return vs(...e);
}
function za(e, t, n = {}) {
  let i = {};
  ft(i, e);
  let s = [i, ...Re(e)], r = Ne([n.scope ?? {}, ...s]), a = n.params ?? [];
  if (t.includes("await")) {
    let o = Object.getPrototypeOf(async function() {
    }).constructor, c = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t;
    return new o(
      ["scope"],
      `with (scope) { let __result = ${c}; return __result }`
    ).call(n.context, r);
  } else {
    let o = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(()=>{ ${t} })()` : t, d = new Function(
      ["scope"],
      `with (scope) { let __result = ${o}; return __result }`
    ).call(n.context, r);
    return typeof d == "function" && Je ? d.apply(r, a) : d;
  }
}
var ti = "x-";
function Qe(e = "") {
  return ti + e;
}
function Ga(e) {
  ti = e;
}
var Wt = {};
function j(e, t) {
  return Wt[e] = t, {
    before(n) {
      if (!Wt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = Oe.indexOf(n);
      Oe.splice(i >= 0 ? i : Oe.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Va(e) {
  return Object.keys(Wt).includes(e);
}
function ni(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let r = Object.entries(e._x_virtualDirectives).map(([o, c]) => ({ name: o, value: c })), a = xs(r);
    r = r.map((o) => a.find((c) => c.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(r);
  }
  let i = {};
  return t.map(As((r, a) => i[r] = a)).filter(Ms).map(Xa(i, n)).sort(Ya).map((r) => Za(e, r));
}
function xs(e) {
  return Array.from(e).map(As()).filter((t) => !Ms(t));
}
var Nn = !1, ot = /* @__PURE__ */ new Map(), ws = /* @__PURE__ */ Symbol();
function Ja(e) {
  Nn = !0;
  let t = /* @__PURE__ */ Symbol();
  ws = t, ot.set(t, []);
  let n = () => {
    for (; ot.get(t).length; )
      ot.get(t).shift()();
    ot.delete(t);
  }, i = () => {
    Nn = !1, n();
  };
  e(n), i();
}
function Es(e) {
  let t = [], n = (o) => t.push(o), [i, s] = ka(e);
  return t.push(s), [{
    Alpine: et,
    effect: i,
    cleanup: n,
    evaluateLater: J.bind(J, e),
    evaluate: Me.bind(Me, e)
  }, () => t.forEach((o) => o())];
}
function Za(e, t) {
  let n = () => {
  }, i = Wt[t.type] || n, [s, r] = Es(e);
  ds(e, t.original, r);
  let a = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, s), i = i.bind(i, e, t, s), Nn ? ot.get(ws).push(i) : i());
  };
  return a.runCleanups = r, a;
}
var Ss = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), ks = (e) => e;
function As(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: s } = Os.reduce((r, a) => a(r), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: s };
  };
}
var Os = [];
function ii(e) {
  Os.push(e);
}
function Ms({ name: e }) {
  return Ts().test(e);
}
var Ts = () => new RegExp(`^${ti}([^:^.]+)\\b`);
function Xa(e, t) {
  return ({ name: n, value: i }) => {
    n === i && (i = "");
    let s = n.match(Ts()), r = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: s ? s[1] : null,
      value: r ? r[1] : null,
      modifiers: a.map((c) => c.replace(".", "")),
      expression: i,
      original: o
    };
  };
}
var Cn = "DEFAULT", Oe = [
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
  Cn,
  "teleport"
];
function Ya(e, t) {
  let n = Oe.indexOf(e.type) === -1 ? Cn : e.type, i = Oe.indexOf(t.type) === -1 ? Cn : t.type;
  return Oe.indexOf(n) - Oe.indexOf(i);
}
function lt(e, t, n = {}, i = {}) {
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
function Ce(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((s) => Ce(s, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let i = e.firstElementChild;
  for (; i; )
    Ce(i, t), i = i.nextElementSibling;
}
function oe(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Li = !1;
function Qa() {
  Li && oe("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Li = !0, document.body || oe("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), lt(document, "alpine:init"), lt(document, "alpine:initializing"), Xn(), Oa((t) => fe(t, Ce)), Vn((t) => qe(t)), cs((t, n) => {
    ni(t, n).forEach((i) => i());
  });
  let e = (t) => !Zt(t.parentElement, !0);
  Array.from(document.querySelectorAll(Cs().join(","))).filter(e).forEach((t) => {
    fe(t);
  }), lt(document, "alpine:initialized"), setTimeout(() => {
    io();
  });
}
var si = [], Rs = [];
function Ns() {
  return si.map((e) => e());
}
function Cs() {
  return si.concat(Rs).map((e) => e());
}
function Is(e) {
  si.push(e);
}
function $s(e) {
  Rs.push(e);
}
function Zt(e, t = !1) {
  return pe(e, (n) => {
    if ((t ? Cs() : Ns()).some((s) => n.matches(s)))
      return !0;
  });
}
function pe(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack)
      return pe(e._x_teleportBack, t);
    if (e.parentNode instanceof ShadowRoot)
      return pe(e.parentNode.host, t);
    if (e.parentElement)
      return pe(e.parentElement, t);
  }
}
function eo(e) {
  return Ns().some((t) => e.matches(t));
}
var Ps = [];
function to(e) {
  Ps.push(e);
}
var no = 1;
function fe(e, t = Ce, n = () => {
}) {
  pe(e, (i) => i._x_ignore) || Ja(() => {
    t(e, (i, s) => {
      i._x_marker || (n(i, s), Ps.forEach((r) => r(i, s)), ni(i, i.attributes).forEach((r) => r()), i._x_ignore || (i._x_marker = no++), i._x_ignore && s());
    });
  });
}
function qe(e, t = Ce) {
  t(e, (n) => {
    Ma(n), us(n), delete n._x_marker;
  });
}
function io() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    Va(n) || i.some((s) => {
      if (document.querySelector(s))
        return oe(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var In = [], ri = !1;
function ai(e = () => {
}) {
  return queueMicrotask(() => {
    ri || setTimeout(() => {
      $n();
    });
  }), new Promise((t) => {
    In.push(() => {
      e(), t();
    });
  });
}
function $n() {
  for (ri = !1; In.length; )
    In.shift()();
}
function so() {
  ri = !0;
}
function oi(e, t) {
  return Array.isArray(t) ? Di(e, t.join(" ")) : typeof t == "object" && t !== null ? ro(e, t) : typeof t == "function" ? oi(e, t()) : Di(e, t);
}
function Pn(e) {
  return e.split(/\s/).filter(Boolean);
}
function Di(e, t) {
  let n = (s) => Pn(s).filter((r) => !e.classList.contains(r)).filter(Boolean), i = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function ro(e, t) {
  let n = Object.entries(t).flatMap(([a, o]) => o ? Pn(a) : !1).filter(Boolean), i = Object.entries(t).flatMap(([a, o]) => o ? !1 : Pn(a)).filter(Boolean), s = [], r = [];
  return i.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), r.push(a));
  }), n.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    r.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function Xt(e, t) {
  return typeof t == "object" && t !== null ? ao(e, t) : oo(e, t);
}
function ao(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, s]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = lo(i)), e.style.setProperty(i, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    Xt(e, n);
  };
}
function oo(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function lo(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Ln(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
j("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: s }) => {
  typeof i == "function" && (i = s(i)), i !== !1 && (!i || typeof i == "boolean" ? uo(e, n, t) : co(e, i, t));
});
function co(e, t, n) {
  Ls(e, oi, ""), {
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
function uo(e, t, n) {
  Ls(e, Xt);
  let i = !t.includes("in") && !t.includes("out") && !n, s = i || t.includes("in") || ["enter"].includes(n), r = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((P, z) => z < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((P, z) => z > t.indexOf("out")));
  let a = !t.includes("opacity") && !t.includes("scale"), o = a || t.includes("opacity"), c = a || t.includes("scale"), d = o ? 0 : 1, f = c ? st(t, "scale", 95) / 100 : 1, m = st(t, "delay", 0) / 1e3, A = st(t, "origin", "center"), M = "opacity, transform", K = st(t, "duration", 150) / 1e3, _ = st(t, "duration", 75) / 1e3, $ = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (e._x_transition.enter.during = {
    transformOrigin: A,
    transitionDelay: `${m}s`,
    transitionProperty: M,
    transitionDuration: `${K}s`,
    transitionTimingFunction: $
  }, e._x_transition.enter.start = {
    opacity: d,
    transform: `scale(${f})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), r && (e._x_transition.leave.during = {
    transformOrigin: A,
    transitionDelay: `${m}s`,
    transitionProperty: M,
    transitionDuration: `${_}s`,
    transitionTimingFunction: $
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: d,
    transform: `scale(${f})`
  });
}
function Ls(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, s = () => {
    }) {
      Dn(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, s);
    },
    out(i = () => {
    }, s = () => {
    }) {
      Dn(e, t, {
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
    let a = Ds(e);
    a ? (a._x_hideChildren || (a._x_hideChildren = []), a._x_hideChildren.push(e)) : s(() => {
      let o = (c) => {
        let d = Promise.all([
          c._x_hidePromise,
          ...(c._x_hideChildren || []).map(o)
        ]).then(([f]) => f?.());
        return delete c._x_hidePromise, delete c._x_hideChildren, d;
      };
      o(e).catch((c) => {
        if (!c.isFromCancelledTransition)
          throw c;
      });
    });
  });
};
function Ds(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Ds(t);
}
function Dn(e, t, { during: n, start: i, end: s } = {}, r = () => {
}, a = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(s).length === 0) {
    r(), a();
    return;
  }
  let o, c, d;
  po(e, {
    start() {
      o = t(e, i);
    },
    during() {
      c = t(e, n);
    },
    before: r,
    end() {
      o(), d = t(e, s);
    },
    after: a,
    cleanup() {
      c(), d();
    }
  });
}
function po(e, t) {
  let n, i, s, r = Ln(() => {
    q(() => {
      n = !0, i || t.before(), s || (t.end(), $n()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(a) {
      this.beforeCancels.push(a);
    },
    cancel: Ln(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      r();
    }),
    finish: r
  }, q(() => {
    t.start(), t.during();
  }), so(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), q(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (q(() => {
        t.end();
      }), $n(), setTimeout(e._x_transitioning.finish, a + o), s = !0);
    });
  });
}
function st(e, t, n) {
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
var ye = !1;
function ve(e, t = () => {
}) {
  return (...n) => ye ? t(...n) : e(...n);
}
function fo(e) {
  return (...t) => ye && e(...t);
}
var qs = [];
function Yt(e) {
  qs.push(e);
}
function ho(e, t) {
  qs.forEach((n) => n(e, t)), ye = !0, Bs(() => {
    fe(t, (n, i) => {
      i(n, () => {
      });
    });
  }), ye = !1;
}
var qn = !1;
function bo(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), ye = !0, qn = !0, Bs(() => {
    go(t);
  }), ye = !1, qn = !1;
}
function go(e) {
  let t = !1;
  fe(e, (i, s) => {
    Ce(i, (r, a) => {
      if (t && eo(r))
        return a();
      t = !0, s(r, a);
    });
  });
}
function Bs(e) {
  let t = De;
  Pi((n, i) => {
    let s = t(n);
    return Ye(s), () => {
    };
  }), e(), Pi(t);
}
function js(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Xe({})), e._x_bindings[t] = n, t = i.includes("camel") ? So(t) : t, t) {
    case "value":
      mo(e, n);
      break;
    case "style":
      yo(e, n);
      break;
    case "class":
      _o(e, n);
      break;
    case "selected":
    case "checked":
      vo(e, t, n);
      break;
    default:
      li(e, t, n);
      break;
  }
}
function mo(e, t) {
  if (ci(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (Kt(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => ko(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Eo(e, t);
  else if (e.tagName === "OPTION")
    li(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function _o(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = oi(e, t);
}
function yo(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = Xt(e, t);
}
function vo(e, t, n) {
  li(e, t, n), wo(e, t, n);
}
function li(e, t, n) {
  [null, void 0, !1].includes(n) && Oo(t) ? e.removeAttribute(t) : (Fs(t) && (n = t), Mo(n) && (n = JSON.stringify(n)), xo(e, t, n));
}
function xo(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function wo(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Eo(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function So(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function ko(e, t) {
  return e == t;
}
function Bt(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Ao = /* @__PURE__ */ new Set([
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
function Fs(e) {
  return Ao.has(e);
}
function Oo(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Mo(e) {
  return typeof e == "object" && e !== null;
}
function To(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Hs(e, t, n);
}
function Ro(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = i, _s(() => Me(e, s.expression));
  }
  return Hs(e, t, n);
}
function Hs(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : Fs(t) ? !![t, "true"].includes(i) : i;
}
function Kt(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function ci(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Us(e, t) {
  let n;
  return function() {
    const i = this, s = arguments, r = function() {
      n = null, e.apply(i, s);
    };
    clearTimeout(n), n = setTimeout(r, t);
  };
}
function Ws(e, t) {
  let n;
  return function() {
    let i = this, s = arguments;
    n || (e.apply(i, s), n = !0, setTimeout(() => n = !1, t));
  };
}
function Ks({ get: e, set: t }, { get: n, set: i }) {
  let s = !0, r, a = De(() => {
    let o = e(), c = n();
    if (s)
      i(gn(o)), s = !1;
    else {
      let d = JSON.stringify(o), f = JSON.stringify(c);
      d !== r ? i(gn(o)) : d !== f && t(gn(c));
    }
    r = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    Ye(a);
  };
}
function gn(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function No(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(et));
}
var de = {}, qi = !1;
function Co(e, t) {
  if (qi || (de = Xe(de), qi = !0), t === void 0)
    return de[e];
  de[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? de[e] = t.initialize(de, e, e, () => {
  }) : ei(de[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && de[e].init();
}
function Io() {
  return de;
}
var zs = {};
function $o(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? Gs(e, n()) : (zs[e] = n, () => {
  });
}
function Po(e) {
  return Object.entries(zs).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function Gs(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let s = Object.entries(t).map(([a, o]) => ({ name: a, value: o })), r = xs(s);
  return s = s.map((a) => r.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), ni(e, s, n).map((a) => {
    i.push(a.runCleanups), a();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var Vs = {};
function Lo(e, t) {
  Vs[e] = t;
}
function Do(e, t) {
  return Object.entries(Vs).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...s) => i.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var qo = {
  get reactive() {
    return Xe;
  },
  get release() {
    return Ye;
  },
  get effect() {
    return De;
  },
  get raw() {
    return ss;
  },
  get transaction() {
    return Aa;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Na,
  dontAutoEvaluateFunctions: _s,
  disableEffectScheduling: Ea,
  startObservingMutations: Xn,
  stopObservingMutations: ps,
  setReactivityEngine: Sa,
  onAttributeRemoved: ds,
  onAttributesAdded: cs,
  closestDataStack: Re,
  skipDuringClone: ve,
  onlyDuringClone: fo,
  addRootSelector: Is,
  addInitSelector: $s,
  setErrorHandler: Da,
  interceptClone: Yt,
  addScopeToNode: xt,
  deferMutations: Ra,
  mapAttributes: ii,
  evaluateLater: J,
  interceptInit: to,
  initInterceptors: ei,
  injectMagics: ft,
  setEvaluator: Ba,
  setRawEvaluator: ja,
  mergeProxies: Ne,
  extractProp: Ro,
  findClosest: pe,
  onElRemoved: Vn,
  closestRoot: Zt,
  destroyTree: qe,
  interceptor: bs,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Dn,
  // INTERNAL
  setStyles: Xt,
  // INTERNAL
  mutateDom: q,
  directive: j,
  entangle: Ks,
  throttle: Ws,
  debounce: Us,
  evaluate: Me,
  evaluateRaw: Ka,
  initTree: fe,
  nextTick: ai,
  prefixed: Qe,
  prefix: Ga,
  plugin: No,
  magic: ie,
  store: Co,
  start: Qa,
  clone: bo,
  // INTERNAL
  cloneNode: ho,
  // INTERNAL
  bound: To,
  $data: fs,
  watch: rs,
  walk: Ce,
  data: Lo,
  bind: $o
}, et = qo;
function Bo(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var gt = Object.assign, jo = Object.prototype.hasOwnProperty, Bn = (e, t) => jo.call(e, t), mt = Array.isArray, ct = (e) => Js(e) === "[object Map]", Fo = (e) => typeof e == "string", wt = (e) => typeof e == "symbol", _t = (e) => e !== null && typeof e == "object", Ho = Object.prototype.toString, Js = (e) => Ho.call(e), Zs = (e) => Js(e).slice(8, -1), di = (e) => Fo(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Uo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Wo = Uo((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ae = (e, t) => !Object.is(e, t);
function Ie(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var R, mn = /* @__PURE__ */ new WeakSet(), Bi = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, mn.has(this) && (mn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ko(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ji(this), Ys(this);
    const e = R, t = ne;
    R = this, ne = !0;
    try {
      return this.fn();
    } finally {
      R !== this && Ie(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Qs(this), R = e, ne = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        fi(e);
      this.deps = this.depsTail = void 0, ji(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? mn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    jn(this) && this.run();
  }
  get dirty() {
    return jn(this);
  }
}, Xs = 0, dt, ut;
function Ko(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = ut, ut = e;
    return;
  }
  e.next = dt, dt = e;
}
function ui() {
  Xs++;
}
function pi() {
  if (--Xs > 0)
    return;
  if (ut) {
    let t = ut;
    for (ut = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; dt; ) {
    let t = dt;
    for (dt = void 0; t; ) {
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
function Ys(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Qs(e) {
  let t, n = e.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), fi(i), Go(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  e.deps = t, e.depsTail = n;
}
function jn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (zo(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function zo(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === zt) || (e.globalVersion = zt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !jn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = R, i = ne;
  R = e, ne = !0;
  try {
    Ys(e);
    const s = e.fn(e._value);
    (t.version === 0 || Ae(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    R = n, ne = i, Qs(e), e.flags &= -3;
  }
}
function fi(e, t = !1) {
  const { dep: n, prevSub: i, nextSub: s } = e;
  if (i && (i.nextSub = s, e.prevSub = void 0), s && (s.prevSub = i, e.nextSub = void 0), n.subsHead === e && (n.subsHead = s), n.subs === e && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      fi(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Go(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function Vo(e, t) {
  e.effect instanceof Bi && (e = e.effect.fn);
  const n = new Bi(e);
  t && gt(n, t);
  try {
    n.run();
  } catch (s) {
    throw n.stop(), s;
  }
  const i = n.run.bind(n);
  return i.effect = n, i;
}
function Jo(e) {
  e.effect.stop();
}
var ne = !0, er = [];
function Zo() {
  er.push(ne), ne = !1;
}
function Xo() {
  const e = er.pop();
  ne = e === void 0 ? !0 : e;
}
function ji(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = R;
    R = void 0;
    try {
      t();
    } finally {
      R = n;
    }
  }
}
var zt = 0, Yo = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, Qo = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!R || !ne || R === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== R)
      t = this.activeLink = new Yo(R, this), R.deps ? (t.prevDep = R.depsTail, R.depsTail.nextDep = t, R.depsTail = t) : R.deps = R.depsTail = t, tr(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = R.depsTail, t.nextDep = void 0, R.depsTail.nextDep = t, R.depsTail = t, R.deps === t && (R.deps = n);
    }
    return R.onTrack && R.onTrack(
      gt(
        {
          effect: R
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, zt++, this.notify(e);
  }
  notify(e) {
    ui();
    try {
      for (let t = this.subsHead; t; t = t.nextSub)
        t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(
          gt(
            {
              effect: t.sub
            },
            e
          )
        );
      for (let t = this.subs; t; t = t.prevSub)
        t.sub.notify() && t.sub.dep.notify();
    } finally {
      pi();
    }
  }
};
function tr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        tr(i);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var Fn = /* @__PURE__ */ new WeakMap(), Te = /* @__PURE__ */ Symbol(
  "Object iterate"
), Hn = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), yt = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function X(e, t, n) {
  if (ne && R) {
    let i = Fn.get(e);
    i || Fn.set(e, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new Qo()), s.map = i, s.key = n), s.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function _e(e, t, n, i, s, r) {
  const a = Fn.get(e);
  if (!a) {
    zt++;
    return;
  }
  const o = (c) => {
    c && c.trigger({
      target: e,
      type: t,
      key: n,
      newValue: i,
      oldValue: s,
      oldTarget: r
    });
  };
  if (ui(), t === "clear")
    a.forEach(o);
  else {
    const c = mt(e), d = c && di(n);
    if (c && n === "length") {
      const f = Number(i);
      a.forEach((m, A) => {
        (A === "length" || A === yt || !wt(A) && A >= f) && o(m);
      });
    } else
      switch ((n !== void 0 || a.has(void 0)) && o(a.get(n)), d && o(a.get(yt)), t) {
        case "add":
          c ? d && o(a.get("length")) : (o(a.get(Te)), ct(e) && o(a.get(Hn)));
          break;
        case "delete":
          c || (o(a.get(Te)), ct(e) && o(a.get(Hn)));
          break;
        case "set":
          ct(e) && o(a.get(Te));
          break;
      }
  }
  pi();
}
function ze(e) {
  const t = N(e);
  return t === e ? t : (X(t, "iterate", yt), Pe(e) ? t : t.map(Le));
}
function hi(e) {
  return X(e = N(e), "iterate", yt), e;
}
function ae(e, t) {
  return $e(e) ? lr(e) ? vt(Le(t)) : vt(t) : Le(t);
}
var el = {
  __proto__: null,
  [Symbol.iterator]() {
    return _n(this, Symbol.iterator, (e) => ae(this, e));
  },
  concat(...e) {
    return ze(this).concat(
      ...e.map((t) => mt(t) ? ze(t) : t)
    );
  },
  entries() {
    return _n(this, "entries", (e) => (e[1] = ae(this, e[1]), e));
  },
  every(e, t) {
    return ce(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return ce(
      this,
      "filter",
      e,
      t,
      (n) => n.map((i) => ae(this, i)),
      arguments
    );
  },
  find(e, t) {
    return ce(
      this,
      "find",
      e,
      t,
      (n) => ae(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return ce(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return ce(
      this,
      "findLast",
      e,
      t,
      (n) => ae(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return ce(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return ce(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return yn(this, "includes", e);
  },
  indexOf(...e) {
    return yn(this, "indexOf", e);
  },
  join(e) {
    return ze(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return yn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return ce(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return rt(this, "pop");
  },
  push(...e) {
    return rt(this, "push", e);
  },
  reduce(e, ...t) {
    return Fi(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Fi(this, "reduceRight", e, t);
  },
  shift() {
    return rt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return ce(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return rt(this, "splice", e);
  },
  toReversed() {
    return ze(this).toReversed();
  },
  toSorted(e) {
    return ze(this).toSorted(e);
  },
  toSpliced(...e) {
    return ze(this).toSpliced(...e);
  },
  unshift(...e) {
    return rt(this, "unshift", e);
  },
  values() {
    return _n(this, "values", (e) => ae(this, e));
  }
};
function _n(e, t, n) {
  const i = hi(e), s = i[t]();
  return i !== e && !Pe(e) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.done || (r.value = n(r.value)), r;
  }), s;
}
var tl = Array.prototype;
function ce(e, t, n, i, s, r) {
  const a = hi(e), o = a !== e && !Pe(e), c = a[t];
  if (c !== tl[t]) {
    const m = c.apply(e, r);
    return o ? Le(m) : m;
  }
  let d = n;
  a !== e && (o ? d = function(m, A) {
    return n.call(this, ae(e, m), A, e);
  } : n.length > 2 && (d = function(m, A) {
    return n.call(this, m, A, e);
  }));
  const f = c.call(a, d, i);
  return o && s ? s(f) : f;
}
function Fi(e, t, n, i) {
  const s = hi(e), r = s !== e && !Pe(e);
  let a = n, o = !1;
  s !== e && (r ? (o = i.length === 0, a = function(d, f, m) {
    return o && (o = !1, d = ae(e, d)), n.call(this, d, ae(e, f), m, e);
  }) : n.length > 3 && (a = function(d, f, m) {
    return n.call(this, d, f, m, e);
  }));
  const c = s[t](a, ...i);
  return o ? ae(e, c) : c;
}
function yn(e, t, n) {
  const i = N(e);
  X(i, "iterate", yt);
  const s = i[t](...n);
  return (s === -1 || s === !1) && bl(n[0]) ? (n[0] = N(n[0]), i[t](...n)) : s;
}
function rt(e, t, n = []) {
  Zo(), ui();
  const i = N(e)[t].apply(e, n);
  return pi(), Xo(), i;
}
var nl = /* @__PURE__ */ Bo("__proto__,__v_isRef,__isVue"), nr = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(wt)
);
function il(e) {
  wt(e) || (e = String(e));
  const t = N(this);
  return X(t, "has", e), t.hasOwnProperty(e);
}
var ir = class {
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
      return n === (i ? s ? fl : ar : s ? pl : rr).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const r = mt(e);
    if (!i) {
      let o;
      if (r && (o = el[t]))
        return o;
      if (t === "hasOwnProperty")
        return il;
    }
    const a = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      pt(e) ? e : n
    );
    if ((wt(t) ? nr.has(t) : nl(t)) || (i || X(e, "get", t), s))
      return a;
    if (pt(a)) {
      const o = r && di(t) ? a : a.value;
      return i && _t(o) ? Un(o) : o;
    }
    return _t(a) ? i ? Un(a) : bi(a) : a;
  }
}, sl = class extends ir {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, i) {
    let s = e[t];
    const r = mt(e) && di(t);
    if (!this._isShallow) {
      const c = $e(s);
      if (!Pe(n) && !$e(n) && (s = N(s), n = N(n)), !r && pt(s) && !pt(n))
        return c ? (Ie(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (s.value = n, !0);
    }
    const a = r ? Number(t) < e.length : Bn(e, t), o = Reflect.set(
      e,
      t,
      n,
      pt(e) ? e : i
    );
    return e === N(i) && o && (a ? Ae(n, s) && _e(e, "set", t, n, s) : _e(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = Bn(e, t), i = e[t], s = Reflect.deleteProperty(e, t);
    return s && n && _e(e, "delete", t, void 0, i), s;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!wt(t) || !nr.has(t)) && X(e, "has", t), n;
  }
  ownKeys(e) {
    return X(
      e,
      "iterate",
      mt(e) ? "length" : Te
    ), Reflect.ownKeys(e);
  }
}, rl = class extends ir {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, t) {
    return Ie(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, t) {
    return Ie(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, al = /* @__PURE__ */ new sl(), ol = /* @__PURE__ */ new rl(), $t = (e) => Reflect.getPrototypeOf(e);
function ll(e, t, n) {
  return function(...i) {
    const s = this.__v_raw, r = N(s), a = ct(r), o = e === "entries" || e === Symbol.iterator && a, c = e === "keys" && a, d = s[e](...i), f = t ? vt : Le;
    return !t && X(
      r,
      "iterate",
      c ? Hn : Te
    ), gt(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: m, done: A } = d.next();
          return A ? { value: m, done: A } : {
            value: o ? [f(m[0]), f(m[1])] : f(m),
            done: A
          };
        }
      }
    );
  };
}
function Pt(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      Ie(
        `${Wo(e)} operation ${n}failed: target is readonly.`,
        N(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function cl(e, t) {
  const n = {
    get(s) {
      const r = this.__v_raw, a = N(r), o = N(s);
      e || (Ae(s, o) && X(a, "get", s), X(a, "get", o));
      const { has: c } = $t(a), d = e ? vt : Le;
      if (c.call(a, s))
        return d(r.get(s));
      if (c.call(a, o))
        return d(r.get(o));
      r !== a && r.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && X(N(s), "iterate", Te), s.size;
    },
    has(s) {
      const r = this.__v_raw, a = N(r), o = N(s);
      return e || (Ae(s, o) && X(a, "has", s), X(a, "has", o)), s === o ? r.has(s) : r.has(s) || r.has(o);
    },
    forEach(s, r) {
      const a = this, o = a.__v_raw, c = N(o), d = e ? vt : Le;
      return !e && X(c, "iterate", Te), o.forEach((f, m) => s.call(r, d(f), d(m), a));
    }
  };
  return gt(
    n,
    e ? {
      add: Pt("add"),
      set: Pt("set"),
      delete: Pt("delete"),
      clear: Pt("clear")
    } : {
      add(s) {
        const r = N(this), a = $t(r), o = N(s), c = !Pe(s) && !$e(s) ? o : s;
        return a.has.call(r, c) || Ae(s, c) && a.has.call(r, s) || Ae(o, c) && a.has.call(r, o) || (r.add(c), _e(r, "add", c, c)), this;
      },
      set(s, r) {
        !Pe(r) && !$e(r) && (r = N(r));
        const a = N(this), { has: o, get: c } = $t(a);
        let d = o.call(a, s);
        d ? Hi(a, o, s) : (s = N(s), d = o.call(a, s));
        const f = c.call(a, s);
        return a.set(s, r), d ? Ae(r, f) && _e(a, "set", s, r, f) : _e(a, "add", s, r), this;
      },
      delete(s) {
        const r = N(this), { has: a, get: o } = $t(r);
        let c = a.call(r, s);
        c ? Hi(r, a, s) : (s = N(s), c = a.call(r, s));
        const d = o ? o.call(r, s) : void 0, f = r.delete(s);
        return c && _e(r, "delete", s, void 0, d), f;
      },
      clear() {
        const s = N(this), r = s.size !== 0, a = ct(s) ? new Map(s) : new Set(s), o = s.clear();
        return r && _e(
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
    n[s] = ll(s, e);
  }), n;
}
function sr(e, t) {
  const n = cl(e);
  return (i, s, r) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? i : Reflect.get(
    Bn(n, s) && s in i ? n : i,
    s,
    r
  );
}
var dl = {
  get: /* @__PURE__ */ sr(!1)
}, ul = {
  get: /* @__PURE__ */ sr(!0)
};
function Hi(e, t, n) {
  const i = N(n);
  if (i !== n && t.call(e, i)) {
    const s = Zs(e);
    Ie(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var rr = /* @__PURE__ */ new WeakMap(), pl = /* @__PURE__ */ new WeakMap(), ar = /* @__PURE__ */ new WeakMap(), fl = /* @__PURE__ */ new WeakMap();
function hl(e) {
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
function bi(e) {
  return /* @__PURE__ */ $e(e) ? e : or(
    e,
    !1,
    al,
    dl,
    rr
  );
}
function Un(e) {
  return or(
    e,
    !0,
    ol,
    ul,
    ar
  );
}
function or(e, t, n, i, s) {
  if (!_t(e))
    return Ie(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = s.get(e);
  if (r)
    return r;
  const a = hl(Zs(e));
  if (a === 0)
    return e;
  const o = new Proxy(
    e,
    a === 2 ? i : n
  );
  return s.set(e, o), o;
}
function lr(e) {
  return /* @__PURE__ */ $e(e) ? /* @__PURE__ */ lr(e.__v_raw) : !!(e && e.__v_isReactive);
}
function $e(e) {
  return !!(e && e.__v_isReadonly);
}
function Pe(e) {
  return !!(e && e.__v_isShallow);
}
function bl(e) {
  return e ? !!e.__v_raw : !1;
}
function N(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ N(t) : e;
}
var Le = (e) => _t(e) ? /* @__PURE__ */ bi(e) : e, vt = (e) => _t(e) ? /* @__PURE__ */ Un(e) : e;
function pt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
ie("nextTick", () => ai);
ie("dispatch", (e) => lt.bind(lt, e));
ie("watch", (e, { evaluateLater: t, cleanup: n }) => (i, s) => {
  let r = t(i), o = rs(() => {
    let c;
    return r((d) => c = d), c;
  }, s);
  n(o);
});
ie("store", Io);
ie("data", (e) => fs(e));
ie("root", (e) => Zt(e));
ie("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Ne(gl(e))), e._x_refs_proxy));
function gl(e) {
  let t = [];
  return pe(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var vn = {};
function cr(e) {
  return vn[e] || (vn[e] = 0), ++vn[e];
}
function ml(e, t) {
  return pe(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function _l(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = cr(t));
}
ie("id", (e, { cleanup: t }) => (n, i = null) => {
  let s = `${n}${i ? `-${i}` : ""}`;
  return yl(e, s, t, () => {
    let r = ml(e, n), a = r ? r._x_ids[n] : cr(n);
    return i ? `${n}-${a}-${i}` : `${n}-${a}`;
  });
});
Yt((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function yl(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = i();
  return e._x_id[t] = s, n(() => {
    delete e._x_id[t];
  }), s;
}
ie("el", (e) => e);
dr("Focus", "focus", "focus");
dr("Persist", "persist", "persist");
function dr(e, t, n) {
  ie(t, (i) => oe(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
j("modelable", (e, { expression: t }, { effect: n, evaluateLater: i, cleanup: s }) => {
  let r = i(t), a = () => {
    let f;
    return r((m) => f = m), f;
  }, o = i(`${t} = __placeholder`), c = (f) => o(() => {
  }, { scope: { __placeholder: f } }), d = a();
  c(d), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let f = e._x_model.get, m = e._x_model.setWithModifiers, A = Ks(
      {
        get() {
          return f();
        },
        set(M) {
          m(M);
        }
      },
      {
        get() {
          return a();
        },
        set(M) {
          c(M);
        }
      }
    );
    s(A);
  });
});
j("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && oe("x-teleport can only be used on a <template> tag", e);
  let s = Ui(n), r = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = r, r._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    r.addEventListener(o, (c) => {
      c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
    });
  }), xt(r, {}, e);
  let a = (o, c, d) => {
    d.includes("prepend") ? c.parentNode.insertBefore(o, c) : d.includes("append") ? c.parentNode.insertBefore(o, c.nextSibling) : c.appendChild(o);
  };
  q(() => {
    ve(() => {
      a(r, s, t), fe(r);
    })();
  }), e._x_teleportPutBack = () => {
    let o = Ui(n);
    q(() => {
      a(e._x_teleport, o, t);
    });
  }, i(
    () => q(() => {
      r.remove(), qe(r);
    })
  );
});
var vl = document.createElement("div");
function Ui(e) {
  let t = ve(() => document.querySelector(e), () => vl)();
  return t || oe(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var ur = () => {
};
ur.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
j("ignore", ur);
j("effect", ve((e, { expression: t }, { effect: n }) => {
  n(J(e, t));
}));
function Ve(e, t, n, i) {
  let s = e, r = (c) => i(c), a = {}, o = (c, d) => (f) => d(c, f);
  return n.includes("dot") && (t = xl(t)), n.includes("camel") && (t = wl(t)), n.includes("capture") && (a.capture = !0), n.includes("window") && (s = window), n.includes("document") && (s = document), n.includes("passive") && (a.passive = n[n.indexOf("passive") + 1] !== "false"), r = pr(n, r), n.includes("prevent") && (r = o(r, (c, d) => {
    d.preventDefault(), c(d);
  })), n.includes("stop") && (r = o(r, (c, d) => {
    d.stopPropagation(), c(d);
  })), n.includes("once") && (r = o(r, (c, d) => {
    c(d), s.removeEventListener(t, r, a);
  })), (n.includes("away") || n.includes("outside")) && (s = document, r = o(r, (c, d) => {
    e.contains(d.target) || d.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && c(d));
  })), n.includes("self") && (r = o(r, (c, d) => {
    d.target === e && c(d);
  })), t === "submit" && (r = o(r, (c, d) => {
    d.target._x_pendingModelUpdates && d.target._x_pendingModelUpdates.forEach((f) => f()), c(d);
  })), (Sl(t) || fr(t)) && (r = o(r, (c, d) => {
    kl(d, n) || c(d);
  })), s.addEventListener(t, r, a), () => {
    s.removeEventListener(t, r, a);
  };
}
function pr(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", i = Gt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Us(t, i);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", i = Gt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Ws(t, i);
  }
  return t;
}
function xl(e) {
  return e.replace(/-/g, ".");
}
function wl(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Gt(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function El(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Sl(e) {
  return ["keydown", "keyup"].includes(e);
}
function fr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function kl(e, t) {
  let n = t.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(r));
  if (n.includes("debounce")) {
    let r = n.indexOf("debounce");
    n.splice(r, Gt((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let r = n.indexOf("throttle");
    n.splice(r, Gt((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Wi(e.key).includes(n[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => n.includes(r));
  return n = n.filter((r) => !s.includes(r)), !(s.length > 0 && s.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), e[`${a}Key`])).length === s.length && (fr(e.type) || Wi(e.key).includes(n[0])));
}
function Wi(e) {
  if (!e)
    return [];
  e = El(e);
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
j("model", (e, { modifiers: t, expression: n }, { effect: i, cleanup: s }) => {
  let r = e;
  t.includes("parent") && (r = pe(e, (_) => _ !== e));
  let a = J(r, n), o;
  typeof n == "string" ? o = J(r, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = J(r, `${n()} = __placeholder`) : o = () => {
  };
  let c = () => {
    let _;
    return a(($) => _ = $), Ki(_) ? _.get() : _;
  }, d = (_) => {
    let $;
    a((P) => $ = P), Ki($) ? $.set(_) : o(() => {
    }, {
      scope: { __placeholder: _ }
    });
  };
  typeof n == "string" && e.type === "radio" && q(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let f = t.includes("change") || t.includes("lazy"), m = t.includes("blur"), A = t.includes("enter"), M = f || m || A, K;
  if (ye)
    K = () => {
    };
  else if (M) {
    let _ = [], $ = (P) => d(Lt(e, t, P, c()));
    if (f && _.push(Ve(e, "change", t, $)), m && (_.push(Ve(e, "blur", t, $)), e.form)) {
      let P = e.form, z = () => $({ target: e });
      P._x_pendingModelUpdates || (P._x_pendingModelUpdates = []), P._x_pendingModelUpdates.push(z), s(() => {
        P._x_pendingModelUpdates && P._x_pendingModelUpdates.splice(P._x_pendingModelUpdates.indexOf(z), 1);
      });
    }
    A && _.push(Ve(e, "keydown", t, (P) => {
      P.key === "Enter" && $(P);
    })), K = () => _.forEach((P) => P());
  } else {
    let _ = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    K = Ve(e, _, t, ($) => {
      d(Lt(e, t, $, c()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(c()) || Kt(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    Lt(e, t, { target: e }, c())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = K, s(() => e._x_removeModelListeners.default()), e.form) {
    let _ = Ve(e.form, "reset", [], ($) => {
      ai(() => e._x_model && e._x_model.set(Lt(e, t, { target: e }, c())));
    });
    s(() => _());
  }
  if (e._x_model = {
    get() {
      return c();
    },
    set(_) {
      d(_);
    },
    setWithModifiers: pr(t, d)
  }, e._x_forceModelUpdate = (_) => {
    _ === void 0 && typeof n == "string" && n.match(/\./) && (_ = ""), q(() => {
      Kt(e) ? Array.isArray(_) ? e.checked = _.some(($) => $ == e.value) : e.checked = !!_ : ci(e) ? typeof _ == "boolean" ? e.checked = Bt(e.value) === _ : e.checked = e.value == _ : js(e, "value", _);
    });
  }, e.tagName === "SELECT") {
    let _ = new MutationObserver(() => {
      e._x_forceModelUpdate(c());
    });
    _.observe(e, { childList: !0 }), s(() => _.disconnect());
  }
  i(() => {
    let _ = c();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(_);
  });
});
function Lt(e, t, n, i) {
  return q(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Kt(e))
      if (Array.isArray(i)) {
        let s = null;
        return t.includes("number") ? s = xn(n.target.value) : t.includes("boolean") ? s = Bt(n.target.value) : s = n.target.value, n.target.checked ? i.includes(s) ? i : i.concat([s]) : i.filter((r) => !Al(r, s));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return xn(r);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return Bt(r);
        }) : Array.from(n.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return ci(e) ? n.target.checked ? s = n.target.value : s = i : s = n.target.value, t.includes("number") ? xn(s) : t.includes("boolean") ? Bt(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function xn(e) {
  let t = e ? parseFloat(e) : null;
  return Ol(t) ? t : e;
}
function Al(e, t) {
  return e == t;
}
function Ol(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ki(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
j("cloak", (e) => queueMicrotask(() => q(() => e.removeAttribute(Qe("cloak")))));
$s(() => `[${Qe("init")}]`);
j("init", ve((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
j("text", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let s = i(t);
  n(() => {
    s((r) => {
      q(() => {
        e.textContent = r;
      });
    });
  });
});
j("html", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let s = i(t);
  n(() => {
    s((r) => {
      q(() => {
        Array.from(e.children).forEach((a) => qe(a)), e.innerHTML = r ?? "", e._x_ignoreSelf = !0, fe(e), delete e._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
ii(Ss(":", ks(Qe("bind:"))));
var hr = (e, { value: t, modifiers: n, expression: i, original: s }, { effect: r, cleanup: a }) => {
  if (!t) {
    let c = {};
    Po(c), J(e, i)((f) => {
      Gs(e, f, s);
    }, { scope: c });
    return;
  }
  if (t === "key")
    return Ml(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = J(e, i);
  r(() => o((c) => {
    c === void 0 && typeof i == "string" && i.match(/\./) && (c = ""), q(() => js(e, t, c, n));
  })), a(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
hr.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
j("bind", hr);
function Ml(e, t) {
  e._x_keyExpression = t;
}
Is(() => `[${Qe("data")}]`);
var ke = /* @__PURE__ */ Symbol();
j("data", (e, { expression: t }, { cleanup: n }) => {
  if (Rl(e))
    return;
  let i = e[ke];
  if (i?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let s = {};
  ft(s, e);
  let r = {};
  Do(r, s);
  let a = Me(e, t, { scope: r });
  (a === void 0 || a === !0) && (a = {}), ft(a, e);
  let o;
  if (i?.reactiveData) {
    o = i.reactiveData, Tl(o, a);
    let d = { expression: t };
    e[ke] = d, queueMicrotask(() => {
      e[ke] === d && delete e[ke];
    });
  } else
    o = Xe(a);
  ei(o, n);
  let c = xt(e, o);
  o.init && Me(e, o.init), n(() => {
    o.destroy && Me(e, o.destroy), c();
    let d = { reactiveData: o };
    e[ke] = d, queueMicrotask(() => {
      e[ke] === d && delete e[ke];
    });
  });
});
function Tl(e, t) {
  Object.keys(t).forEach((n) => {
    let i = Object.getOwnPropertyDescriptor(t, n), s = Object.getOwnPropertyDescriptor(e, n);
    i.get || i.set || s?.get || s?.set ? (s && delete e[n], s || (e[n] = void 0), i.get || i.set ? Object.defineProperty(e, n, i) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
Yt((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Rl(e) {
  return ye ? qn ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
j("show", (e, { modifiers: t, expression: n }, { effect: i }) => {
  let s = J(e, n);
  e._x_doHide || (e._x_doHide = () => {
    q(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    q(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let r = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, a = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, o = () => setTimeout(a), c = Ln(
    (m) => m ? a() : r(),
    (m) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, m, a, r) : m ? o() : r();
    }
  ), d, f = !0;
  i(() => s((m) => {
    !f && m === d || (t.includes("immediate") && (m ? o() : r()), c(m), d = m, f = !1);
  }));
});
j("for", ve((e, { expression: t }, { effect: n, cleanup: i }) => {
  let s = Il(t), r = J(e, s.items), a = J(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => Cl(e, s, r, a), { priority: "structural" }), i(() => {
    e._x_lookup.forEach(
      (o) => q(() => {
        qe(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function Nl(e) {
  return (t) => {
    Object.entries(t).forEach(([n, i]) => {
      e[n] = i;
    });
  };
}
function Cl(e, t, n, i) {
  n((s) => {
    Pl(s) && (s = Array.from({ length: s }, (d, f) => f + 1)), s == null && (s = []), s instanceof Set && (s = Array.from(s)), s instanceof Map && (s = Array.from(s));
    let r = e._x_lookup, a = /* @__PURE__ */ new Map();
    e._x_lookup = a;
    let o = Ll(s), c = Object.entries(s).map(([d, f]) => {
      o || (d = parseInt(d));
      let m = $l(t, f, d, s), A;
      return i((M) => {
        typeof M == "object" && oe("x-for key cannot be an object, it must be a string or an integer", e), r.has(M) && (a.set(M, r.get(M)), r.delete(M)), A = M;
      }, { scope: { index: d, ...m } }), [A, m];
    });
    q(() => {
      r.forEach((m) => {
        qe(m), m.remove();
      });
      let d = /* @__PURE__ */ new Set(), f = e;
      c.forEach(([m, A]) => {
        if (a.has(m)) {
          let _ = a.get(m);
          _._x_refreshXForScope(A), f.nextElementSibling !== _ && (f.nextElementSibling && _.replaceWith(f.nextElementSibling), f.after(_)), f = _, _._x_currentIfEl && (_.nextElementSibling !== _._x_currentIfEl && f.after(_._x_currentIfEl), f = _._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && oe("x-for templates require a single root element, additional elements will be ignored.", e);
        let M = document.importNode(e.content, !0).firstElementChild, K = Xe(A);
        xt(M, K, e), M._x_refreshXForScope = Nl(K), a.set(m, M), d.add(M), f.after(M), f = M;
      }), d.forEach((m) => fe(m)), f !== e ? e._x_lastRenderedEl = f : delete e._x_lastRenderedEl;
    });
  });
}
function Il(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = e.match(i);
  if (!s)
    return;
  let r = {};
  r.items = s[2].trim();
  let a = s[1].replace(n, "").trim(), o = a.match(t);
  return o ? (r.item = a.replace(t, "").trim(), r.index = o[1].trim(), o[2] && (r.collection = o[2].trim())) : r.item = a, r;
}
function $l(e, t, n, i) {
  let s = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    s[a] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    s[a] = t[a];
  }) : s[e.item] = t, e.index && (s[e.index] = n), e.collection && (s[e.collection] = i), s;
}
function Pl(e) {
  return typeof e != "object" && !isNaN(e);
}
function Ll(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function br() {
}
br.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = Zt(e);
  i && (i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]));
};
j("ref", br);
j("if", ve((e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && oe("x-if can only be used on a <template> tag", e);
  let s = J(e, t), r = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return xt(o, {}, e), q(() => {
      e.after(o), fe(o);
    }), e._x_currentIfEl = o, e._x_lastRenderedEl = o, e._x_undoIf = () => {
      q(() => {
        qe(o), o.remove();
      }), delete e._x_currentIfEl, delete e._x_lastRenderedEl;
    }, o;
  }, a = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => s((o) => {
    o ? r() : a();
  }), { priority: "structural" }), i(() => e._x_undoIf && e._x_undoIf());
}));
j("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((s) => _l(e, s));
});
Yt((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
ii(Ss("@", ks(Qe("on:"))));
j("on", ve((e, { value: t, modifiers: n, expression: i }, { cleanup: s }) => {
  let r = i ? J(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let a = Ve(e, t, n, (o) => {
    r(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  s(() => a());
}));
Qt("Collapse", "collapse", "collapse");
Qt("Intersect", "intersect", "intersect");
Qt("Focus", "trap", "focus");
Qt("Mask", "mask", "mask");
function Qt(e, t, n) {
  j(t, (i) => oe(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
et.setEvaluator(Fa);
et.setRawEvaluator(za);
et.setReactivityEngine({
  reactive: bi,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = Vo(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: Jo,
  raw: N
});
var Dl = et, jt = Dl;
function ql(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const Vt = "__siteationDebugBarHostLock";
function Bl(e) {
  if (!e || window[Vt]) return;
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
  window[Vt] = i;
}
function jl() {
  const e = window[Vt];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[Vt]);
}
function zi(e, t) {
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(t.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((a) => a.offsetParent !== null);
  if (n.length === 0) return;
  const i = n[0], s = n[n.length - 1], r = t.getRootNode().activeElement;
  e.shiftKey && r === i ? (e.preventDefault(), s.focus()) : !e.shiftKey && r === s && (e.preventDefault(), i.focus());
}
const Wn = [
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
    lead: "The components on the page right now, their state, and what has not started.",
    graded: !1
  },
  {
    id: "history",
    label: "History",
    lead: "Every request still on disk, so an earlier one is one click away.",
    graded: !1
  }
];
function gr(e, t) {
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
    case "history":
      return t.history.length || null;
    default:
      return null;
  }
}
const Fl = {
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
function Z(e, t = "") {
  return `<svg class="ndb-icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${Fl[e] || ""}</svg>`;
}
function Hl(e) {
  return [...Ul(e), ...Wl(e), ...Kl(e)];
}
function Ul(e) {
  return Wn.map((t) => {
    const n = gr(t.id, e);
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
function Wl(e) {
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
function Kl(e) {
  return [
    {
      id: "copy",
      group: "Window",
      label: "Copy this request for an AI",
      hint: "markdown",
      keywords: "copy clipboard ai assistant chatgpt claude markdown report share",
      kind: "copy",
      arg: ""
    },
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
function zl(e, t) {
  const n = String(t || "").trim().toLowerCase(), i = n ? e.filter((s) => `${s.group} ${s.label} ${s.keywords}`.toLowerCase().includes(n)) : e;
  return i.map((s, r) => ({
    ...s,
    leads: r === 0 || i[r - 1].group !== s.group
  }));
}
function Gl() {
  return `
<div class="ndb-palette" data-ndb-bind:class="paletteOpen && 'is-open'"
     data-ndb-on:keydown="paletteKeys($event)">
  <div class="ndb-palette-backdrop" data-ndb-on:click="closePalette()"></div>

  <div class="ndb-palette-box" data-ndb-ref="palette"
       role="dialog" aria-modal="true" aria-label="Commands">
    <div class="ndb-palette-field">
      ${Z("search")}
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
const Ze = "full", mr = "masked", Be = "none", Vl = "[redacted]", Jl = "[masked]", Zl = "[maximum depth reached]", Xl = "[circular]", Yl = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, Ql = 5, Ft = 100, Gi = 400;
function ec(e) {
  return [Ze, mr, Be].includes(e) ? e : Ze;
}
function tc(e) {
  return Yl.test(String(e));
}
function _r(e, t = Ze) {
  if (t !== Be)
    return gi(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function Kn(e, t = Ze) {
  return t === Be ? "" : t === mr ? e === "" ? "" : Jl : e.length <= Gi ? e : `${e.slice(0, Gi)}...`;
}
function nc(e, t = Ze) {
  if (t === Be) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return Kn(n, Ze);
}
function gi(e, t, n, i) {
  if (e == null) return e;
  const s = typeof e;
  return s === "string" ? Kn(e, t) : s === "number" || s === "boolean" ? e : s === "function" ? `ƒ ${e.name || "anonymous"}()` : s === "symbol" ? e.toString() : s === "bigint" ? `${e}n` : s !== "object" ? s : e instanceof Node ? rc(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${Kn(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= Ql ? Zl : i.has(e) ? Xl : (i.add(e), Array.isArray(e) ? ic(e, t, n, i) : sc(e, t, n, i));
}
function ic(e, t, n, i) {
  const s = e.slice(0, Ft).map((r) => gi(r, t, n + 1, i));
  return e.length > Ft && s.push(`[${e.length - Ft} more]`), s;
}
function sc(e, t, n, i) {
  const s = mi(e), r = {};
  let a = 0;
  for (const o of s) {
    if (a >= Ft) {
      r.__truncated__ = s.length - a;
      break;
    }
    if (tc(o)) {
      r[o] = Vl, a++;
      continue;
    }
    try {
      r[o] = gi(e[o], t, n + 1, i);
    } catch (c) {
      r[o] = `[unreadable: ${c && c.message ? c.message : "threw"}]`;
    }
    a++;
  }
  return r;
}
function mi(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function rc(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
function ac(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var wn, Vi;
function oc() {
  if (Vi) return wn;
  Vi = 1;
  function e(l) {
    return l instanceof Map ? l.clear = l.delete = l.set = function() {
      throw new Error("map is read-only");
    } : l instanceof Set && (l.add = l.clear = l.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(l), Object.getOwnPropertyNames(l).forEach((u) => {
      const h = l[u], E = typeof h;
      (E === "object" || E === "function") && !Object.isFrozen(h) && e(h);
    }), l;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(u) {
      u.data === void 0 && (u.data = {}), this.data = u.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(l) {
    return l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(l, ...u) {
    const h = /* @__PURE__ */ Object.create(null);
    for (const E in l)
      h[E] = l[E];
    return u.forEach(function(E) {
      for (const L in E)
        h[L] = E[L];
    }), /** @type {T} */
    h;
  }
  const s = "</span>", r = (l) => !!l.scope, a = (l, { prefix: u }) => {
    if (l.startsWith("language:"))
      return l.replace("language:", "language-");
    if (l.includes(".")) {
      const h = l.split(".");
      return [
        `${u}${h.shift()}`,
        ...h.map((E, L) => `${E}${"_".repeat(L + 1)}`)
      ].join(" ");
    }
    return `${u}${l}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(u, h) {
      this.buffer = "", this.classPrefix = h.classPrefix, u.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(u) {
      this.buffer += n(u);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(u) {
      if (!r(u)) return;
      const h = a(
        u.scope,
        { prefix: this.classPrefix }
      );
      this.span(h);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(u) {
      r(u) && (this.buffer += s);
    }
    /**
     * returns the accumulated buffer
    */
    value() {
      return this.buffer;
    }
    // helpers
    /**
     * Builds a span element
     *
     * @param {string} className */
    span(u) {
      this.buffer += `<span class="${u}">`;
    }
  }
  const c = (l = {}) => {
    const u = { children: [] };
    return Object.assign(u, l), u;
  };
  class d {
    constructor() {
      this.rootNode = c(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    /** @param {Node} node */
    add(u) {
      this.top.children.push(u);
    }
    /** @param {string} scope */
    openNode(u) {
      const h = c({ scope: u });
      this.add(h), this.stack.push(h);
    }
    closeNode() {
      if (this.stack.length > 1)
        return this.stack.pop();
    }
    closeAllNodes() {
      for (; this.closeNode(); ) ;
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4);
    }
    /**
     * @typedef { import("./html_renderer").Renderer } Renderer
     * @param {Renderer} builder
     */
    walk(u) {
      return this.constructor._walk(u, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(u, h) {
      return typeof h == "string" ? u.addText(h) : h.children && (u.openNode(h), h.children.forEach((E) => this._walk(u, E)), u.closeNode(h)), u;
    }
    /**
     * @param {Node} node
     */
    static _collapse(u) {
      typeof u != "string" && u.children && (u.children.every((h) => typeof h == "string") ? u.children = [u.children.join("")] : u.children.forEach((h) => {
        d._collapse(h);
      }));
    }
  }
  class f extends d {
    /**
     * @param {*} options
     */
    constructor(u) {
      super(), this.options = u;
    }
    /**
     * @param {string} text
     */
    addText(u) {
      u !== "" && this.add(u);
    }
    /** @param {string} scope */
    startScope(u) {
      this.openNode(u);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(u, h) {
      const E = u.root;
      h && (E.scope = `language:${h}`), this.add(E);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function m(l) {
    return l ? typeof l == "string" ? l : l.source : null;
  }
  function A(l) {
    return _("(?=", l, ")");
  }
  function M(l) {
    return _("(?:", l, ")*");
  }
  function K(l) {
    return _("(?:", l, ")?");
  }
  function _(...l) {
    return l.map((h) => m(h)).join("");
  }
  function $(l) {
    const u = l[l.length - 1];
    return typeof u == "object" && u.constructor === Object ? (l.splice(l.length - 1, 1), u) : {};
  }
  function P(...l) {
    return "(" + ($(l).capture ? "" : "?:") + l.map((E) => m(E)).join("|") + ")";
  }
  function z(l) {
    return new RegExp(l.toString() + "|").exec("").length - 1;
  }
  function je(l, u) {
    const h = l && l.exec(u);
    return h && h.index === 0;
  }
  const Fe = new RegExp(P(
    /\[(?:[^\\\]]|\\.)*\]/,
    // a character class, inside which ( and \ lose their meaning
    /\(\?<(?![=!])[^>]+>/,
    // a named capture group `(?<name>` (not a lookbehind `(?<=` / `(?<!`)
    /\(\?'[^']+'/,
    // a named capture group `(?'name'`
    /\(\??/,
    // an opening parenthesis, capturing or non-capturing / lookahead
    /\\([1-9][0-9]*)/,
    // a backreference like `\1`
    /\\./
    // any other escape sequence
  ));
  function V(l, { joinWith: u }) {
    let h = 0;
    return l.map((E) => {
      h += 1;
      const L = h;
      let D = m(E), y = "";
      for (; D.length > 0; ) {
        const g = Fe.exec(D);
        if (!g) {
          y += D;
          break;
        }
        y += D.substring(0, g.index), D = D.substring(g.index + g[0].length), g[0][0] === "\\" && g[1] ? y += "\\" + String(Number(g[1]) + L) : (y += g[0], (g[0] === "(" || /^\(\?[<']/.test(g[0])) && h++);
      }
      return y;
    }).map((E) => `(${E})`).join(u);
  }
  const Y = /\b\B/, He = "[a-zA-Z]\\w*", he = "[a-zA-Z_]\\w*", ee = "\\b\\d+(\\.\\d+)?", Et = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", St = "\\b(0b[01]+)", nn = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", sn = (l = {}) => {
    const u = /^#![ ]*\//;
    return l.binary && (l.begin = _(
      u,
      /.*\b/,
      l.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: u,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (h, E) => {
        h.index !== 0 && E.ignoreMatch();
      }
    }, l);
  }, xe = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, rn = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [xe]
  }, kt = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [xe]
  }, an = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, U = function(l, u, h = {}) {
    const E = i(
      {
        scope: "comment",
        begin: l,
        end: u,
        contains: []
      },
      h
    );
    E.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const L = P(
      // list of common 1 and 2 letter words in English
      "I",
      "a",
      "is",
      "so",
      "us",
      "to",
      "at",
      "if",
      "in",
      "it",
      "on",
      // note: this is not an exhaustive list of contractions, just popular ones
      /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
      // contractions - can't we'd they're let's, etc
      /[A-Za-z]+[-][a-z]+/,
      // `no-way`, etc.
      /[A-Za-z][a-z]{2,}/
      // allow capitalized words at beginning of sentences
    );
    return E.contains.push(
      {
        // TODO: how to include ", (, ) without breaking grammars that use these for
        // comment delimiters?
        // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
        // ---
        // this tries to find sequences of 3 english words in a row (without any
        // "programming" type syntax) this gives us a strong signal that we've
        // TRULY found a comment - vs perhaps scanning with the wrong language.
        // It's possible to find something that LOOKS like the start of the
        // comment - but then if there is no readable text - good chance it is a
        // false match and not a comment.
        //
        // for a visual example please see:
        // https://github.com/highlightjs/highlight.js/issues/2827
        begin: _(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          L,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), E;
  }, be = U("//", "$"), we = U("/\\*", "\\*/"), Ue = U("#", "$"), tt = {
    scope: "number",
    begin: ee,
    relevance: 0
  }, At = {
    scope: "number",
    begin: Et,
    relevance: 0
  }, kr = {
    scope: "number",
    begin: St,
    relevance: 0
  }, Ar = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      xe,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [xe]
      }
    ]
  }, Or = {
    scope: "title",
    begin: He,
    relevance: 0
  }, Mr = {
    scope: "title",
    begin: he,
    relevance: 0
  }, Tr = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + he,
    relevance: 0
  };
  var Ot = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: rn,
    BACKSLASH_ESCAPE: xe,
    BINARY_NUMBER_MODE: kr,
    BINARY_NUMBER_RE: St,
    COMMENT: U,
    C_BLOCK_COMMENT_MODE: we,
    C_LINE_COMMENT_MODE: be,
    C_NUMBER_MODE: At,
    C_NUMBER_RE: Et,
    END_SAME_AS_BEGIN: function(l) {
      return Object.assign(
        l,
        {
          /** @type {ModeCallback} */
          "on:begin": (u, h) => {
            h.data._beginMatch = u[1];
          },
          /** @type {ModeCallback} */
          "on:end": (u, h) => {
            h.data._beginMatch !== u[1] && h.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: Ue,
    IDENT_RE: He,
    MATCH_NOTHING_RE: Y,
    METHOD_GUARD: Tr,
    NUMBER_MODE: tt,
    NUMBER_RE: ee,
    PHRASAL_WORDS_MODE: an,
    QUOTE_STRING_MODE: kt,
    REGEXP_MODE: Ar,
    RE_STARTERS_RE: nn,
    SHEBANG: sn,
    TITLE_MODE: Or,
    UNDERSCORE_IDENT_RE: he,
    UNDERSCORE_TITLE_MODE: Mr
  });
  function Rr(l, u) {
    l.input[l.index - 1] === "." && u.ignoreMatch();
  }
  function Nr(l, u) {
    l.className !== void 0 && (l.scope = l.className, delete l.className);
  }
  function Cr(l, u) {
    u && l.beginKeywords && (l.begin = "\\b(" + l.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", l.__beforeBegin = Rr, l.keywords = l.keywords || l.beginKeywords, delete l.beginKeywords, l.relevance === void 0 && (l.relevance = 0));
  }
  function Ir(l, u) {
    Array.isArray(l.illegal) && (l.illegal = P(...l.illegal));
  }
  function $r(l, u) {
    if (l.match) {
      if (l.begin || l.end) throw new Error("begin & end are not supported with match");
      l.begin = l.match, delete l.match;
    }
  }
  function Pr(l, u) {
    l.relevance === void 0 && (l.relevance = 1);
  }
  const Lr = (l, u) => {
    if (!l.beforeMatch) return;
    if (l.starts) throw new Error("beforeMatch cannot be used with starts");
    const h = Object.assign({}, l);
    Object.keys(l).forEach((E) => {
      delete l[E];
    }), l.keywords = h.keywords, l.begin = _(h.beforeMatch, A(h.begin)), l.starts = {
      relevance: 0,
      contains: [
        Object.assign(h, { endsParent: !0 })
      ]
    }, l.relevance = 0, delete h.beforeMatch;
  }, Dr = [
    "of",
    "and",
    "for",
    "in",
    "not",
    "or",
    "if",
    "then",
    "parent",
    // common variable name
    "list",
    // common variable name
    "value"
    // common variable name
  ], qr = "keyword";
  function _i(l, u, h = qr) {
    const E = /* @__PURE__ */ Object.create(null);
    return typeof l == "string" ? L(h, l.split(" ")) : Array.isArray(l) ? L(h, l) : Object.keys(l).forEach(function(D) {
      Object.assign(
        E,
        _i(l[D], u, D)
      );
    }), E;
    function L(D, y) {
      u && (y = y.map((g) => g.toLowerCase())), y.forEach(function(g) {
        const w = g.split("|");
        E[w[0]] = [D, Br(w[0], w[1])];
      });
    }
  }
  function Br(l, u) {
    return u ? Number(u) : jr(l) ? 0 : 1;
  }
  function jr(l) {
    return Dr.includes(l.toLowerCase());
  }
  const yi = {}, Ee = (l) => {
    console.error(l);
  }, vi = (l, ...u) => {
    console.log(`WARN: ${l}`, ...u);
  }, We = (l, u) => {
    yi[`${l}/${u}`] || (console.log(`Deprecated as of ${l}. ${u}`), yi[`${l}/${u}`] = !0);
  }, Mt = new Error();
  function xi(l, u, { key: h }) {
    let E = 0;
    const L = l[h], D = {}, y = {};
    for (let g = 1; g <= u.length; g++)
      y[g + E] = L[g], D[g + E] = !0, E += z(u[g - 1]);
    l[h] = y, l[h]._emit = D, l[h]._multi = !0;
  }
  function Fr(l) {
    if (Array.isArray(l.begin)) {
      if (l.skip || l.excludeBegin || l.returnBegin)
        throw Ee("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Mt;
      if (typeof l.beginScope != "object" || l.beginScope === null)
        throw Ee("beginScope must be object"), Mt;
      xi(l, l.begin, { key: "beginScope" }), l.begin = V(l.begin, { joinWith: "" });
    }
  }
  function Hr(l) {
    if (Array.isArray(l.end)) {
      if (l.skip || l.excludeEnd || l.returnEnd)
        throw Ee("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Mt;
      if (typeof l.endScope != "object" || l.endScope === null)
        throw Ee("endScope must be object"), Mt;
      xi(l, l.end, { key: "endScope" }), l.end = V(l.end, { joinWith: "" });
    }
  }
  function Ur(l) {
    l.scope && typeof l.scope == "object" && l.scope !== null && (l.beginScope = l.scope, delete l.scope);
  }
  function Wr(l) {
    Ur(l), typeof l.beginScope == "string" && (l.beginScope = { _wrap: l.beginScope }), typeof l.endScope == "string" && (l.endScope = { _wrap: l.endScope }), Fr(l), Hr(l);
  }
  function Kr(l) {
    function u(y, g) {
      return new RegExp(
        m(y),
        "m" + (l.case_insensitive ? "i" : "") + (l.unicodeRegex ? "u" : "") + (g ? "g" : "")
      );
    }
    class h {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(g, w) {
        w.position = this.position++, this.matchIndexes[this.matchAt] = w, this.regexes.push([w, g]), this.matchAt += z(g) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const g = this.regexes.map((w) => w[1]);
        this.matcherRe = u(V(g, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(g) {
        this.matcherRe.lastIndex = this.lastIndex;
        const w = this.matcherRe.exec(g);
        if (!w)
          return null;
        const H = w.findIndex((nt, ln) => ln > 0 && nt !== void 0), B = this.matchIndexes[H];
        return w.splice(0, H), Object.assign(w, B);
      }
    }
    class E {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(g) {
        if (this.multiRegexes[g]) return this.multiRegexes[g];
        const w = new h();
        return this.rules.slice(g).forEach(([H, B]) => w.addRule(H, B)), w.compile(), this.multiRegexes[g] = w, w;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(g, w) {
        this.rules.push([g, w]), w.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(g) {
        const w = this.getMatcher(this.regexIndex);
        w.lastIndex = this.lastIndex;
        let H = w.exec(g);
        if (this.resumingScanAtSamePosition() && !(H && H.index === this.lastIndex)) {
          const B = this.getMatcher(0);
          B.lastIndex = this.lastIndex + 1, H = B.exec(g);
        }
        return H && (this.regexIndex += H.position + 1, this.regexIndex === this.count && this.considerAll()), H;
      }
    }
    function L(y) {
      const g = new E();
      return y.contains.forEach((w) => g.addRule(w.begin, { rule: w, type: "begin" })), y.terminatorEnd && g.addRule(y.terminatorEnd, { type: "end" }), y.illegal && g.addRule(y.illegal, { type: "illegal" }), g;
    }
    function D(y, g) {
      const w = (
        /** @type CompiledMode */
        y
      );
      if (y.isCompiled) return w;
      [
        Nr,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        $r,
        Wr,
        Lr
      ].forEach((B) => B(y, g)), l.compilerExtensions.forEach((B) => B(y, g)), y.__beforeBegin = null, [
        Cr,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ir,
        // default to 1 relevance if not specified
        Pr
      ].forEach((B) => B(y, g)), y.isCompiled = !0;
      let H = null;
      return typeof y.keywords == "object" && y.keywords.$pattern && (y.keywords = Object.assign({}, y.keywords), H = y.keywords.$pattern, delete y.keywords.$pattern), H = H || /\w+/, y.keywords && (y.keywords = _i(y.keywords, l.case_insensitive)), w.keywordPatternRe = u(H, !0), g && (y.begin || (y.begin = /\B|\b/), w.beginRe = u(w.begin), !y.end && !y.endsWithParent && (y.end = /\B|\b/), y.end && (w.endRe = u(w.end)), w.terminatorEnd = m(w.end) || "", y.endsWithParent && g.terminatorEnd && (w.terminatorEnd += (y.end ? "|" : "") + g.terminatorEnd)), y.illegal && (w.illegalRe = u(
        /** @type {RegExp | string} */
        y.illegal
      )), y.contains || (y.contains = []), y.contains = [].concat(...y.contains.map(function(B) {
        return zr(B === "self" ? y : B);
      })), y.contains.forEach(function(B) {
        D(
          /** @type Mode */
          B,
          w
        );
      }), y.starts && D(y.starts, g), w.matcher = L(w), w;
    }
    if (l.compilerExtensions || (l.compilerExtensions = []), l.contains && l.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return l.classNameAliases = i(l.classNameAliases || {}), D(
      /** @type Mode */
      l
    );
  }
  function wi(l) {
    return l ? l.endsWithParent || wi(l.starts) : !1;
  }
  function zr(l) {
    return l.variants && !l.cachedVariants && (l.cachedVariants = l.variants.map(function(u) {
      return i(l, { variants: null }, u);
    })), l.cachedVariants ? l.cachedVariants : wi(l) ? i(l, { starts: l.starts ? i(l.starts) : null }) : Object.isFrozen(l) ? i(l) : l;
  }
  var Gr = "11.12.0";
  class Vr extends Error {
    constructor(u, h) {
      super(u), this.name = "HTMLInjectionError", this.html = h;
    }
  }
  const on = n, Ei = i, Si = /* @__PURE__ */ Symbol("nomatch"), Jr = 7, ki = function(l) {
    const u = /* @__PURE__ */ Object.create(null), h = /* @__PURE__ */ Object.create(null), E = [];
    let L = !0;
    const D = "Could not find the language '{}', did you forget to load/include a language module?", y = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let g = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: f
    };
    function w(p) {
      return g.noHighlightRe.test(p);
    }
    function H(p) {
      let x = p.className + " ";
      x += p.parentNode ? p.parentNode.className : "";
      const O = g.languageDetectRe.exec(x);
      if (O) {
        const C = ge(O[1]);
        return C || (vi(D.replace("{}", O[1])), vi("Falling back to no-highlight mode for this block.", p)), C ? O[1] : "no-highlight";
      }
      return x.split(/\s+/).find((C) => w(C) || ge(C));
    }
    function B(p, x, O) {
      let C = "", F = "";
      typeof x == "object" ? (C = p, O = x.ignoreIllegals, F = x.language) : (We("10.7.0", "highlight(lang, code, ...args) has been deprecated."), We("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), F = p, C = x), O === void 0 && (O = !0);
      const te = {
        code: C,
        language: F
      };
      Rt("before:highlight", te);
      const me = te.result ? te.result : nt(te.language, te.code, O);
      return me.code = te.code, Rt("after:highlight", me), me;
    }
    function nt(p, x, O, C) {
      const F = /* @__PURE__ */ Object.create(null);
      function te(b, v) {
        return b.keywords[v];
      }
      function me() {
        if (!S.keywords) {
          W.addText(I);
          return;
        }
        let b = 0;
        S.keywordPatternRe.lastIndex = 0;
        let v = S.keywordPatternRe.exec(I), k = "";
        for (; v; ) {
          k += I.substring(b, v.index);
          const T = re.case_insensitive ? v[0].toLowerCase() : v[0], G = te(S, T);
          if (G) {
            const [le, pa] = G;
            if (W.addText(k), k = "", F[T] = (F[T] || 0) + 1, F[T] <= Jr && (It += pa), le.startsWith("_"))
              k += v[0];
            else {
              const fa = re.classNameAliases[le] || le;
              se(v[0], fa);
            }
          } else
            k += v[0];
          b = S.keywordPatternRe.lastIndex, v = S.keywordPatternRe.exec(I);
        }
        k += I.substring(b), W.addText(k);
      }
      function Nt() {
        if (I === "") return;
        let b = null;
        if (typeof S.subLanguage == "string") {
          if (!u[S.subLanguage]) {
            W.addText(I);
            return;
          }
          b = nt(S.subLanguage, I, !0, Ii[S.subLanguage]), Ii[S.subLanguage] = /** @type {CompiledMode} */
          b._top;
        } else
          b = cn(I, S.subLanguage.length ? S.subLanguage : null);
        S.relevance > 0 && (It += b.relevance), W.__addSublanguage(b._emitter, b.language);
      }
      function Q() {
        S.subLanguage != null ? Nt() : me(), I = "";
      }
      function se(b, v) {
        b !== "" && (W.startScope(v), W.addText(b), W.endScope());
      }
      function Ti(b, v) {
        let k = 1;
        const T = v.length - 1;
        for (; k <= T; ) {
          if (!b._emit[k]) {
            k++;
            continue;
          }
          const G = re.classNameAliases[b[k]] || b[k], le = v[k];
          G ? se(le, G) : (I = le, me(), I = ""), k++;
        }
      }
      function Ri(b, v) {
        return b.scope && typeof b.scope == "string" && W.openNode(re.classNameAliases[b.scope] || b.scope), b.beginScope && (b.beginScope._wrap ? (se(I, re.classNameAliases[b.beginScope._wrap] || b.beginScope._wrap), I = "") : b.beginScope._multi && (Ti(b.beginScope, v), I = "")), S = Object.create(b, { parent: { value: S } }), S;
      }
      function Ni(b, v, k) {
        let T = je(b.endRe, k);
        if (T) {
          if (b["on:end"]) {
            const G = new t(b);
            b["on:end"](v, G), G.isMatchIgnored && (T = !1);
          }
          if (T) {
            for (; b.endsParent && b.parent; )
              b = b.parent;
            return b;
          }
        }
        if (b.endsWithParent)
          return Ni(b.parent, v, k);
      }
      function oa(b) {
        return S.matcher.regexIndex === 0 ? (I += b[0], 1) : (fn = !0, 0);
      }
      function la(b) {
        const v = b[0], k = b.rule, T = new t(k), G = [k.__beforeBegin, k["on:begin"]];
        for (const le of G)
          if (le && (le(b, T), T.isMatchIgnored))
            return oa(v);
        return k.skip ? I += v : (k.excludeBegin && (I += v), Q(), !k.returnBegin && !k.excludeBegin && (I = v)), Ri(k, b), k.returnBegin ? 0 : v.length;
      }
      function ca(b) {
        const v = b[0], k = x.substring(b.index), T = Ni(S, b, k);
        if (!T)
          return Si;
        const G = S;
        S.endScope && S.endScope._wrap ? (Q(), se(v, S.endScope._wrap)) : S.endScope && S.endScope._multi ? (Q(), Ti(S.endScope, b)) : G.skip ? I += v : (G.returnEnd || G.excludeEnd || (I += v), Q(), G.excludeEnd && (I = v));
        do
          S.scope && W.closeNode(), !S.skip && !S.subLanguage && (It += S.relevance), S = S.parent;
        while (S !== T.parent);
        return T.starts && Ri(T.starts, b), G.returnEnd ? 0 : v.length;
      }
      function da() {
        const b = [];
        for (let v = S; v !== re; v = v.parent)
          v.scope && b.unshift(v.scope);
        b.forEach((v) => W.openNode(v));
      }
      let Ct = {};
      function Ci(b, v) {
        const k = v && v[0];
        if (I += b, k == null)
          return Q(), 0;
        if (Ct.type === "begin" && v.type === "end" && Ct.index === v.index && k === "") {
          if (I += x.slice(v.index, v.index + 1), !L) {
            const T = new Error(`0 width match regex (${p})`);
            throw T.languageName = p, T.badRule = Ct.rule, T;
          }
          return 1;
        }
        if (Ct = v, v.type === "begin")
          return la(v);
        if (v.type === "illegal" && !O) {
          const T = new Error('Illegal lexeme "' + k + '" for mode "' + (S.scope || "<unnamed>") + '"');
          throw T.mode = S, T;
        } else if (v.type === "end") {
          const T = ca(v);
          if (T !== Si)
            return T;
        }
        if (v.type === "illegal" && k === "")
          return v.index === x.length || (I += `
`), 1;
        if (pn > 1e5 && pn > v.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return I += k, k.length;
      }
      const re = ge(p);
      if (!re)
        throw Ee(D.replace("{}", p)), new Error('Unknown language: "' + p + '"');
      const ua = Kr(re);
      let un = "", S = C || ua;
      const Ii = {}, W = new g.__emitter(g);
      da();
      let I = "", It = 0, Se = 0, pn = 0, fn = !1;
      try {
        if (re.__emitTokens)
          re.__emitTokens(x, W);
        else {
          for (S.matcher.considerAll(); ; ) {
            pn++, fn ? fn = !1 : S.matcher.considerAll(), S.matcher.lastIndex = Se;
            const b = S.matcher.exec(x);
            if (!b) break;
            const v = x.substring(Se, b.index), k = Ci(v, b);
            Se = b.index + k;
          }
          Ci(x.substring(Se));
        }
        return W.finalize(), un = W.toHTML(), {
          language: p,
          value: un,
          relevance: It,
          illegal: !1,
          _emitter: W,
          _top: S
        };
      } catch (b) {
        if (b.message && b.message.includes("Illegal"))
          return {
            language: p,
            value: on(x),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: b.message,
              index: Se,
              context: x.slice(Se - 100, Se + 100),
              mode: b.mode,
              resultSoFar: un
            },
            _emitter: W
          };
        if (L)
          return {
            language: p,
            value: on(x),
            illegal: !1,
            relevance: 0,
            errorRaised: b,
            _emitter: W,
            _top: S
          };
        throw b;
      }
    }
    function ln(p) {
      const x = {
        value: on(p),
        illegal: !1,
        relevance: 0,
        _top: y,
        _emitter: new g.__emitter(g)
      };
      return x._emitter.addText(p), x;
    }
    function cn(p, x) {
      x = x || g.languages || Object.keys(u);
      const O = ln(p), C = x.filter(ge).filter(Mi).map(
        (Q) => nt(Q, p, !1)
      );
      C.unshift(O);
      const F = C.sort((Q, se) => {
        if (Q.relevance !== se.relevance) return se.relevance - Q.relevance;
        if (Q.language && se.language) {
          if (ge(Q.language).supersetOf === se.language)
            return 1;
          if (ge(se.language).supersetOf === Q.language)
            return -1;
        }
        return 0;
      }), [te, me] = F, Nt = te;
      return Nt.secondBest = me, Nt;
    }
    function Zr(p, x, O) {
      const C = x && h[x] || O;
      p.classList.add("hljs"), p.classList.add(`language-${C}`);
    }
    function dn(p) {
      let x = null;
      const O = H(p);
      if (w(O)) return;
      if (Rt(
        "before:highlightElement",
        { el: p, language: O }
      ), p.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", p);
        return;
      }
      if (p.children.length > 0 && (g.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(p)), g.throwUnescapedHTML))
        throw new Vr(
          "One of your code blocks includes unescaped HTML.",
          p.innerHTML
        );
      x = p;
      const C = x.textContent, F = O ? B(C, { language: O, ignoreIllegals: !0 }) : cn(C);
      p.innerHTML = F.value, p.dataset.highlighted = "yes", Zr(p, O, F.language), p.result = {
        language: F.language,
        // TODO: remove with version 11.0
        re: F.relevance,
        relevance: F.relevance
      }, F.secondBest && (p.secondBest = {
        language: F.secondBest.language,
        relevance: F.secondBest.relevance
      }), Rt("after:highlightElement", { el: p, result: F, text: C });
    }
    function Xr(p) {
      g = Ei(g, p);
    }
    const Yr = () => {
      Tt(), We("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Qr() {
      Tt(), We("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Ai = !1;
    function Tt() {
      function p() {
        Tt();
      }
      if (document.readyState === "loading") {
        Ai || window.addEventListener("DOMContentLoaded", p, !1), Ai = !0;
        return;
      }
      document.querySelectorAll(g.cssSelector).forEach(dn);
    }
    function ea(p, x) {
      let O = null;
      try {
        O = x(l);
      } catch (C) {
        if (Ee("Language definition for '{}' could not be registered.".replace("{}", p)), L)
          Ee(C);
        else
          throw C;
        O = y;
      }
      O.name || (O.name = p), u[p] = O, O.rawDefinition = x.bind(null, l), O.aliases && Oi(O.aliases, { languageName: p });
    }
    function ta(p) {
      delete u[p];
      for (const x of Object.keys(h))
        h[x] === p && delete h[x];
    }
    function na() {
      return Object.keys(u);
    }
    function ge(p) {
      return p = (p || "").toLowerCase(), u[p] || u[h[p]];
    }
    function Oi(p, { languageName: x }) {
      typeof p == "string" && (p = [p]), p.forEach((O) => {
        h[O.toLowerCase()] = x;
      });
    }
    function Mi(p) {
      const x = ge(p);
      return x && !x.disableAutodetect;
    }
    function ia(p) {
      p["before:highlightBlock"] && !p["before:highlightElement"] && (p["before:highlightElement"] = (x) => {
        p["before:highlightBlock"](
          Object.assign({ block: x.el }, x)
        );
      }), p["after:highlightBlock"] && !p["after:highlightElement"] && (p["after:highlightElement"] = (x) => {
        p["after:highlightBlock"](
          Object.assign({ block: x.el }, x)
        );
      });
    }
    function sa(p) {
      ia(p), E.push(p);
    }
    function ra(p) {
      const x = E.indexOf(p);
      x !== -1 && E.splice(x, 1);
    }
    function Rt(p, x) {
      const O = p;
      E.forEach(function(C) {
        C[O] && C[O](x);
      });
    }
    function aa(p) {
      return We("10.7.0", "highlightBlock will be removed entirely in v12.0"), We("10.7.0", "Please use highlightElement now."), dn(p);
    }
    Object.assign(l, {
      highlight: B,
      highlightAuto: cn,
      highlightAll: Tt,
      highlightElement: dn,
      // TODO: Remove with v12 API
      highlightBlock: aa,
      configure: Xr,
      initHighlighting: Yr,
      initHighlightingOnLoad: Qr,
      registerLanguage: ea,
      unregisterLanguage: ta,
      listLanguages: na,
      getLanguage: ge,
      registerAliases: Oi,
      autoDetection: Mi,
      inherit: Ei,
      addPlugin: sa,
      removePlugin: ra
    }), l.debugMode = function() {
      L = !1;
    }, l.safeMode = function() {
      L = !0;
    }, l.versionString = Gr, l.regex = {
      concat: _,
      lookahead: A,
      either: P,
      optional: K,
      anyNumberOfTimes: M
    };
    for (const p in Ot)
      typeof Ot[p] == "object" && e(Ot[p]);
    return Object.assign(l, Ot), l;
  }, Ke = ki({});
  return Ke.newInstance = () => ki({}), wn = Ke, Ke.HighlightJS = Ke, Ke.default = Ke, wn;
}
var lc = /* @__PURE__ */ oc();
const en = /* @__PURE__ */ ac(lc), Ji = "[A-Za-z$_][0-9A-Za-z$_]*", cc = [
  "as",
  // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends",
  // It's reached stage 3, which is "recommended for implementation":
  "using"
], dc = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], yr = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
], vr = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], xr = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
], uc = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "self",
  "global"
  // Node.js
], pc = [].concat(
  xr,
  yr,
  vr
);
function fc(e) {
  const t = e.regex, n = (U, { after: be }) => {
    const we = "</" + U[0].slice(1);
    return U.input.indexOf(we, be) !== -1;
  }, i = Ji, s = {
    begin: "<>",
    end: "</>"
  }, r = /<[A-Za-z0-9\\._:-]+\s*\/>/, a = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (U, be) => {
      const we = U[0].length + U.index, Ue = U.input[we];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        Ue === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        Ue === ","
      ) {
        be.ignoreMatch();
        return;
      }
      Ue === ">" && (n(U, { after: we }) || be.ignoreMatch());
      let tt;
      const At = U.input.substring(we);
      if (tt = At.match(/^\s*=/)) {
        be.ignoreMatch();
        return;
      }
      if ((tt = At.match(/^\s+extends\s+/)) && tt.index === 0) {
        be.ignoreMatch();
        return;
      }
    }
  }, o = {
    $pattern: Ji,
    keyword: cc,
    literal: dc,
    built_in: pc,
    "variable.language": uc
  }, c = "[0-9](_?[0-9])*", d = `\\.(${c})`, f = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", m = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${f})((${d})|\\.)?|(${d}))[eE][+-]?(${c})\\b` },
      { begin: `\\b(${f})\\b((${d})\\b|\\.)?|(${d})\\b` },
      // DecimalBigIntegerLiteral
      { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  }, A = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: o,
    contains: []
    // defined later
  }, M = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        A
      ],
      subLanguage: "xml"
    }
  }, K = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        A
      ],
      subLanguage: "css"
    }
  }, _ = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        A
      ],
      subLanguage: "graphql"
    }
  }, $ = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      e.BACKSLASH_ESCAPE,
      A
    ]
  }, z = {
    className: "comment",
    variants: [
      e.COMMENT(
        /\/\*\*(?!\/)/,
        "\\*/",
        {
          relevance: 0,
          contains: [
            {
              begin: "(?=@[A-Za-z]+)",
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                },
                {
                  className: "type",
                  begin: "\\{",
                  end: "\\}",
                  excludeEnd: !0,
                  excludeBegin: !0,
                  relevance: 0
                },
                {
                  className: "variable",
                  begin: i + "(?=\\s*(-)|$)",
                  endsParent: !0,
                  relevance: 0
                },
                // eat spaces (not newlines) so we can find
                // types or variables
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      ),
      e.C_BLOCK_COMMENT_MODE,
      e.C_LINE_COMMENT_MODE
    ]
  }, je = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    M,
    K,
    _,
    $,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    m
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  A.contains = je.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: o,
    contains: [
      "self"
    ].concat(je)
  });
  const Fe = [].concat(z, A.contains), V = Fe.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: o,
      contains: ["self"].concat(Fe)
    }
  ]), Y = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: o,
    contains: V
  }, He = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          i,
          /\s+/,
          /extends/,
          /\s+/,
          t.concat(i, "(", t.concat(/\./, i), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          i
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, he = {
    relevance: 0,
    match: t.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...yr,
        ...vr
      ]
    }
  }, ee = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, Et = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          i,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [Y],
    illegal: /%/
  }, St = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function nn(U) {
    return t.concat("(?!", U.join("|"), ")");
  }
  const sn = {
    match: t.concat(
      /\b/,
      nn([
        ...xr,
        "super",
        "import",
        "await"
      ].map((U) => `${U}\\s*\\(`)),
      i,
      t.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, xe = {
    begin: t.concat(/\./, t.lookahead(
      t.concat(i, /(?![0-9A-Za-z$_(])/)
    )),
    end: i,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, rn = {
    match: [
      /get|set/,
      /\s+/,
      i,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      Y
    ]
  }, kt = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", an = {
    match: [
      /const|var|let/,
      /\s+/,
      i,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      t.lookahead(kt)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      Y
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: o,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: V, CLASS_REFERENCE: he },
    illegal: /#(?![$_A-Za-z])/,
    contains: [
      e.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      ee,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      M,
      K,
      _,
      $,
      z,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      m,
      he,
      {
        scope: "attr",
        match: i + t.lookahead(":"),
        relevance: 0
      },
      an,
      {
        // "value" container
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          z,
          e.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: kt,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: e.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: !0
                  },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: o,
                    contains: V
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: s.begin, end: s.end },
              { match: r },
              {
                begin: a.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": a.isTrulyOpeningTag,
                end: a.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: a.begin,
                end: a.end,
                skip: !0,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      Et,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: !0,
        label: "func.def",
        contains: [
          Y,
          e.inherit(e.TITLE_MODE, { begin: i, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      xe,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + i,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [Y]
      },
      sn,
      St,
      He,
      rn,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const hc = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity", bc = {
  scope: "number",
  match: hc,
  relevance: 0
};
function gc(e) {
  const t = {
    className: "attr",
    begin: /(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,
    relevance: 1.01
  }, n = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, i = [
    "true",
    "false",
    "null"
  ], s = {
    scope: "literal",
    beginKeywords: i.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc", "json5"],
    keywords: {
      literal: i
    },
    contains: [
      t,
      n,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      s,
      bc,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function mc(e) {
  const t = e.regex, n = e.COMMENT("--", "$"), i = {
    scope: "string",
    variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [{ match: /''/ }]
      }
    ]
  }, s = {
    begin: /"/,
    end: /"/,
    contains: [{ match: /""/ }]
  }, r = [
    "true",
    "false",
    // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
    // "null",
    "unknown"
  ], a = [
    "double precision",
    "large object",
    "with timezone",
    "without timezone"
  ], o = [
    "bigint",
    "binary",
    "blob",
    "boolean",
    "char",
    "character",
    "clob",
    "date",
    "dec",
    "decfloat",
    "decimal",
    "float",
    "int",
    "integer",
    "interval",
    "nchar",
    "nclob",
    "national",
    "numeric",
    "real",
    "row",
    "smallint",
    "time",
    "timestamp",
    "varchar",
    "varying",
    // modifier (character varying)
    "varbinary"
  ], c = [
    "add",
    "asc",
    "collation",
    "desc",
    "final",
    "first",
    "last",
    "view"
  ], d = [
    "abs",
    "acos",
    "all",
    "allocate",
    "alter",
    "and",
    "any",
    "are",
    "array",
    "array_agg",
    "array_max_cardinality",
    "as",
    "asensitive",
    "asin",
    "asymmetric",
    "at",
    "atan",
    "atomic",
    "authorization",
    "avg",
    "begin",
    "begin_frame",
    "begin_partition",
    "between",
    "bigint",
    "binary",
    "blob",
    "boolean",
    "both",
    "by",
    "call",
    "called",
    "cardinality",
    "cascaded",
    "case",
    "cast",
    "ceil",
    "ceiling",
    "char",
    "char_length",
    "character",
    "character_length",
    "check",
    "classifier",
    "clob",
    "close",
    "coalesce",
    "collate",
    "collect",
    "column",
    "commit",
    "condition",
    "connect",
    "constraint",
    "contains",
    "convert",
    "copy",
    "corr",
    "corresponding",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "create",
    "cross",
    "cube",
    "cume_dist",
    "current",
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_row",
    "current_schema",
    "current_time",
    "current_timestamp",
    "current_path",
    "current_role",
    "current_transform_group_for_type",
    "current_user",
    "cursor",
    "cycle",
    "date",
    "day",
    "deallocate",
    "dec",
    "decimal",
    "decfloat",
    "declare",
    "default",
    "define",
    "delete",
    "dense_rank",
    "deref",
    "describe",
    "deterministic",
    "disconnect",
    "distinct",
    "double",
    "drop",
    "dynamic",
    "each",
    "element",
    "else",
    "empty",
    "end",
    "end_frame",
    "end_partition",
    "end-exec",
    "equals",
    "escape",
    "every",
    "except",
    "exec",
    "execute",
    "exists",
    "exp",
    "external",
    "extract",
    "false",
    "fetch",
    "filter",
    "first_value",
    "float",
    "floor",
    "for",
    "foreign",
    "frame_row",
    "free",
    "from",
    "full",
    "function",
    "fusion",
    "get",
    "global",
    "grant",
    "group",
    "grouping",
    "groups",
    "having",
    "hold",
    "hour",
    "identity",
    "in",
    "indicator",
    "initial",
    "inner",
    "inout",
    "insensitive",
    "insert",
    "int",
    "integer",
    "intersect",
    "intersection",
    "interval",
    "into",
    "is",
    "join",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "language",
    "large",
    "last_value",
    "lateral",
    "lead",
    "leading",
    "left",
    "like",
    "like_regex",
    "listagg",
    "ln",
    "local",
    "localtime",
    "localtimestamp",
    "log",
    "log10",
    "lower",
    "match",
    "match_number",
    "match_recognize",
    "matches",
    "max",
    "member",
    "merge",
    "method",
    "min",
    "minute",
    "mod",
    "modifies",
    "module",
    "month",
    "multiset",
    "national",
    "natural",
    "nchar",
    "nclob",
    "new",
    "no",
    "none",
    "normalize",
    "not",
    "nth_value",
    "ntile",
    "null",
    "nullif",
    "numeric",
    "octet_length",
    "occurrences_regex",
    "of",
    "offset",
    "old",
    "omit",
    "on",
    "one",
    "only",
    "open",
    "or",
    "order",
    "out",
    "outer",
    "over",
    "overlaps",
    "overlay",
    "parameter",
    "partition",
    "pattern",
    "per",
    "percent",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "period",
    "portion",
    "position",
    "position_regex",
    "power",
    "precedes",
    "precision",
    "prepare",
    "primary",
    "procedure",
    "ptf",
    "range",
    "rank",
    "reads",
    "real",
    "recursive",
    "ref",
    "references",
    "referencing",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "release",
    "result",
    "return",
    "returns",
    "revoke",
    "right",
    "rollback",
    "rollup",
    "row",
    "row_number",
    "rows",
    "running",
    "savepoint",
    "scope",
    "scroll",
    "search",
    "second",
    "seek",
    "select",
    "sensitive",
    "session_user",
    "set",
    "show",
    "similar",
    "sin",
    "sinh",
    "skip",
    "smallint",
    "some",
    "specific",
    "specifictype",
    "sql",
    "sqlexception",
    "sqlstate",
    "sqlwarning",
    "sqrt",
    "start",
    "static",
    "stddev_pop",
    "stddev_samp",
    "submultiset",
    "subset",
    "substring",
    "substring_regex",
    "succeeds",
    "sum",
    "symmetric",
    "system",
    "system_time",
    "system_user",
    "table",
    "tablesample",
    "tan",
    "tanh",
    "then",
    "time",
    "timestamp",
    "timezone_hour",
    "timezone_minute",
    "to",
    "trailing",
    "translate",
    "translate_regex",
    "translation",
    "treat",
    "trigger",
    "trim",
    "trim_array",
    "true",
    "truncate",
    "uescape",
    "union",
    "unique",
    "unknown",
    "unnest",
    "update",
    "upper",
    "user",
    "using",
    "value",
    "values",
    "value_of",
    "var_pop",
    "var_samp",
    "varbinary",
    "varchar",
    "varying",
    "versioning",
    "when",
    "whenever",
    "where",
    "width_bucket",
    "window",
    "with",
    "within",
    "without",
    "year"
  ], f = [
    "abs",
    "acos",
    "array_agg",
    "asin",
    "atan",
    "avg",
    "cast",
    "ceil",
    "ceiling",
    "coalesce",
    "corr",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "cume_dist",
    "dense_rank",
    "deref",
    "element",
    "exp",
    "extract",
    "first_value",
    "floor",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "last_value",
    "lead",
    "listagg",
    "ln",
    "log",
    "log10",
    "lower",
    "max",
    "min",
    "mod",
    "nth_value",
    "ntile",
    "nullif",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "position",
    "position_regex",
    "power",
    "rank",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "row_number",
    "sin",
    "sinh",
    "sqrt",
    "stddev_pop",
    "stddev_samp",
    "substring",
    "substring_regex",
    "sum",
    "tan",
    "tanh",
    "translate",
    "translate_regex",
    "treat",
    "trim",
    "trim_array",
    "unnest",
    "upper",
    "value_of",
    "var_pop",
    "var_samp",
    "width_bucket"
  ], m = [
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_schema",
    "current_transform_group_for_type",
    "current_user",
    "session_user",
    "system_time",
    "system_user",
    "current_time",
    "localtime",
    "current_timestamp",
    "localtimestamp"
  ], A = [
    "create table",
    "insert into",
    "primary key",
    "foreign key",
    "not null",
    "alter table",
    "add constraint",
    "grouping sets",
    "on overflow",
    "character set",
    "respect nulls",
    "ignore nulls",
    "nulls first",
    "nulls last",
    "depth first",
    "breadth first"
  ], M = f, K = [
    ...d,
    ...c
  ].filter((V) => !f.includes(V)), _ = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  }, $ = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  }, P = {
    match: t.concat(/\b/, t.either(...M), /\s*\(/),
    relevance: 0,
    keywords: { built_in: M }
  };
  function z(V) {
    return t.concat(
      /\b/,
      t.either(...V.map((Y) => Y.replace(/\s+/, "\\s+"))),
      /\b/
    );
  }
  const je = {
    scope: "keyword",
    match: z(A),
    relevance: 0
  };
  function Fe(V, {
    exceptions: Y,
    when: He
  } = {}) {
    const he = He;
    return Y = Y || [], V.map((ee) => ee.match(/\|\d+$/) || Y.includes(ee) ? ee : he(ee) ? `${ee}|0` : ee);
  }
  return {
    name: "SQL",
    case_insensitive: !0,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: Fe(K, { when: (V) => V.length < 3 }),
      literal: r,
      type: o,
      built_in: m
    },
    contains: [
      {
        scope: "type",
        match: z(a)
      },
      je,
      P,
      _,
      i,
      s,
      e.C_NUMBER_MODE,
      e.C_BLOCK_COMMENT_MODE,
      n,
      $
    ]
  };
}
en.registerLanguage("javascript", fc);
en.registerLanguage("json", gc);
en.registerLanguage("sql", mc);
const Dt = /* @__PURE__ */ new Map(), _c = 400, yc = 2e4;
function Zi(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function vc(e, t) {
  const n = String(e ?? "");
  if (n === "") return "";
  if (n.length > yc) return Zi(n);
  const i = `${t}:${n}`, s = Dt.get(i);
  if (s !== void 0) return s;
  let r;
  try {
    r = en.highlight(n, { language: t, ignoreIllegals: !0 }).value;
  } catch {
    r = Zi(n);
  }
  return Dt.size >= _c && Dt.clear(), Dt.set(i, r), r;
}
const En = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map();
let Xi = 0;
function tn() {
  const e = kn || window.Alpine;
  return !e || typeof e != "object" || e === jt ? null : e;
}
function wr(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function zn(e) {
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
function xc(e) {
  if (typeof e.evaluate != "function") return null;
  const t = zn(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function Yi() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function wc(e) {
  if (typeof e.injectMagics == "function") {
    const t = zn(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = zn(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function Ec(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function Sc(e) {
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
function kc(e) {
  return En.has(e) || (Xi += 1, En.set(e, Xi)), En.get(e);
}
function Er(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function Ac(e) {
  const t = tn();
  if (Jt.clear(), !t) return [];
  const n = wr(t), i = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((r) => {
    const a = kc(r), o = (r.getAttribute(n) || "").trim(), c = (r.getAttribute(i) || "").trim(), d = Er(t, r);
    return Jt.set(a, r), {
      id: a,
      name: Ec(o),
      expression: nc(o, e),
      path: Sc(r),
      initialised: !!r._x_dataStack,
      deferred: r.hasAttribute(i),
      strategy: c || "none",
      keys: e === Be || !d ? 0 : mi(d).length
    };
  });
}
function Qi(e, t) {
  if (t === Be)
    return "The value policy is set to none, so component state is not read.";
  const n = tn(), i = Jt.get(e);
  if (!n || !i) return "This component is no longer on the page.";
  if (!i._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const s = Er(n, i);
  if (!s) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(_r(s, t), null, 2);
  } catch (r) {
    return `Could not read this component: ${r && r.message ? r.message : "threw"}`;
  }
}
function Oc(e) {
  const t = tn();
  if (!t) return [];
  const n = wc(t);
  return n ? Object.keys(n).map((i) => {
    let s = n[i], r = 0;
    if (r = s && typeof s == "object" ? mi(s).length : 0, e === Be)
      return { name: i, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      s = JSON.stringify(_r(s, e), null, 2);
    } catch (a) {
      s = `Could not read this store: ${a && a.message ? a.message : "threw"}`;
    }
    return { name: i, keys: r, value: s };
  }) : [];
}
function Mc() {
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
function Tc() {
  const e = tn();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: xc(e),
    source: Yi(),
    prefix: wr(e)
  } : { present: !1, version: "", csp: null, source: Yi(), prefix: "" };
}
function Rc(e, t) {
  const n = Jt.get(e);
  if (!(!n || !n.style)) {
    if (t) {
      at.has(e) || at.set(e, n.style.outline || ""), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
      return;
    }
    at.has(e) && (n.style.outline = at.get(e), n.style.removeProperty("outline-offset"), at.delete(e));
  }
}
const Nc = 1e3, Sr = "siteation.debugbar.v1", Cc = "__PROFILE_ID__";
function Ic() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function $c() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(Sr) || "{}") };
  } catch {
    return e;
  }
}
function Ge(e, t, n) {
  const i = t.trim().toLowerCase();
  return i ? e.filter((s) => n.some(
    (r) => String(s[r] ?? "").toLowerCase().includes(i)
  )) : e;
}
function Pc() {
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
    history: [],
    historyLoading: !1,
    historyError: "",
    historyLoaded: !1,
    historyTab: "recent",
    baselineId: "",
    comparison: null,
    comparing: !1,
    compareError: "",
    copyState: "",
    copyFallback: "",
    activeId: null,
    pageProfile: {},
    init() {
      this.profile = Ic(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const e = $c();
      this.open = e.open, this.section = e.section, this.placement = e.placement === "top" ? "top" : "bottom", this.maximised = !!e.maximised, this.theme = ["system", "light", "dark"].includes(e.theme) ? e.theme : "system", this.favourites = Array.isArray(e.favourites) ? e.favourites.filter((t) => Wn.some((n) => n.id === t)) : [], this.watchColorScheme(), this.valuePolicy = ec(this.rootElement()?.dataset.valuePolicy), this.refreshAlpine(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), this.$watch("section", (t) => {
        t === "history" && this.loadHistory();
      }), this.open && this.section === "history" && this.loadHistory(), this.$watch("activeId", () => {
        this.comparison = null, this.baselineId = "";
      }), document.addEventListener("keydown", (t) => this.paletteShortcut(t)), this.open && this.$nextTick(() => this.lock()), this.requests = ql((t) => {
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
      return t ? t.replace(Cc, encodeURIComponent(e)) : null;
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
    /**
     * @param {boolean} force refetch even if the list is already loaded
     * @returns {Promise<void>}
     */
    async loadHistory(e = !1) {
      if (this.historyLoading || this.historyLoaded && !e) return;
      const t = this.rootElement()?.dataset.historyUrl;
      if (t) {
        this.historyLoading = !0, this.historyError = "";
        try {
          const n = await fetch(t, { headers: { Accept: "application/json" } });
          if (!n.ok) throw new Error(`HTTP ${n.status}`);
          const i = await n.json();
          this.history = Array.isArray(i.profiles) ? i.profiles : [], this.historyLoaded = !0;
        } catch (n) {
          this.historyError = String(n.message || n);
        } finally {
          this.historyLoading = !1;
        }
      }
    },
    /** @returns {string} */
    get copyLabel() {
      return this.copyState === "working" ? "Copying" : this.copyState === "done" ? "Copied" : this.copyState === "failed" ? "Copy it yourself" : this.copyState === "error" ? "Report unavailable" : "Copy for AI";
    },
    /**
     * The profile as markdown, on the clipboard, for an assistant that cannot call the MCP
     * server: a browser tab, a chat window, a colleague. The rendering happens in PHP so
     * there is one definition of the report rather than one per consumer.
     *
     * @returns {Promise<void>}
     */
    async copyReport() {
      const e = this.profileUrlFor(this.activeId || this.profile.id || "");
      if (!e) return;
      this.copyState = "working", this.copyFallback = "";
      let t = "";
      try {
        const n = await fetch(`${e}format/markdown/`, { headers: { Accept: "text/markdown" } });
        if (!n.ok) throw new Error(`HTTP ${n.status}`);
        t = await n.text();
      } catch {
        this.copyState = "error", setTimeout(() => {
          this.copyState = "";
        }, 2500);
        return;
      }
      try {
        await navigator.clipboard.writeText(t), this.copyState = "done", setTimeout(() => {
          this.copyState = "";
        }, 2500);
      } catch {
        this.copyState = "failed", this.copyFallback = t;
      }
    },
    /**
     * The request to compare against, chosen for the reader: the most recent other profile
     * for the same path, because that is what "what did my change cost" means. Failing
     * that, whatever came before this one.
     *
     * @returns {string}
     */
    suggestedBaseline() {
      const e = this.history.filter((i) => i.profile_id !== this.activeId), t = this.request.path;
      return (e.find((i) => i.path === t) || e[0])?.profile_id || "";
    },
    /** @returns {Array<object>} everything except the profile being looked at */
    get baselineChoices() {
      return this.history.filter((e) => e.profile_id !== this.activeId);
    },
    /**
     * @returns {Promise<void>}
     */
    async compareProfiles() {
      const e = this.rootElement()?.dataset.compareUrl, t = this.baselineId || this.suggestedBaseline();
      if (!e || !t || !this.activeId || t === this.activeId) return;
      this.baselineId = t, this.comparing = !0, this.compareError = "";
      const n = `${e}baseline/${encodeURIComponent(t)}/subject/${encodeURIComponent(this.activeId)}/`;
      try {
        const i = await fetch(n, { headers: { Accept: "application/json" } }), s = await i.json();
        if (!i.ok) throw new Error(s.error || `HTTP ${i.status}`);
        this.comparison = s;
      } catch (i) {
        this.comparison = null, this.compareError = String(i.message || i);
      } finally {
        this.comparing = !1;
      }
    },
    /**
     * @param {object} metric
     * @returns {string} the change, signed, in the metric's own unit
     */
    deltaLabel(e) {
      if (!e || e.delta === 0) return "no change";
      const t = e.delta > 0 ? "+" : "-", n = e.unit === "B" ? this.bytes(Math.abs(e.delta)) : `${this.number(Math.abs(e.delta), e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
      return `${t}${n}`;
    },
    /**
     * @param {object} metric
     * @returns {string}
     */
    metricValue(e, t) {
      const n = e[t];
      return n == null ? "none" : e.unit === "B" ? this.bytes(n) : `${this.number(n, e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
    },
    /**
     * Loading one from the history means looking at a different request, so it lands on
     * the overview rather than leaving the reader on a panel about the old one.
     *
     * @param {string} id
     */
    async openFromHistory(e) {
      await this.showProfile(e), this.loadError || (this.section = "overview");
    },
    /**
     * @param {number} seconds a unix timestamp
     * @returns {string}
     */
    ago(e) {
      const t = Math.max(0, Date.now() / 1e3 - Number(e || 0));
      return t < 60 ? `${Math.round(t)}s ago` : t < 3600 ? `${Math.round(t / 60)}m ago` : `${Math.round(t / 3600)}h ago`;
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
      return Ge(e, this.querySearch, ["sql"]);
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const e = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((t) => t.observer_count === 0) : this.itemsOf("events");
      return Ge(e, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return Ge(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      return Ge(this.itemsOf("blocks"), this.blockSearch, ["name", "template", "class"]);
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
      return Ge(e, this.timelineSearch, ["label", "section"]);
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
      return Ge(e, this.alpineSearch, ["name", "expression", "path"]);
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
      return Hl(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return zl(this.commands, this.paletteSearch);
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
      return Wn.map((e) => ({ ...e, count: gr(e.id, this) }));
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
    openInspector() {
      this.open || (this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), jl(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus());
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
      Bl(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(e) {
      if (e.key === "Escape") {
        this.closeInspector();
        return;
      }
      zi(e, this.$refs.sheet);
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
      this.alpineHealth = Tc(), this.alpineComponents = Ac(this.valuePolicy), this.alpineStores = Oc(this.valuePolicy), this.alpineErrors = Mc(), this.alpineExpanded.forEach((e) => {
        this.alpineStates[e] = Qi(e, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, Nc);
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
      this.alpineExpanded = [...this.alpineExpanded, e], this.alpineStates[e] = Qi(e, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(e, t) {
      Rc(e, t);
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
      zi(e, this.$refs.palette);
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
          case "copy":
            this.copyReport();
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
        localStorage.setItem(Sr, JSON.stringify({
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
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(e, t) {
      return vc(e, t);
    },
    /**
     * @param {number} count
     * @param {string} one
     * @param {string} many
     * @returns {string}
     */
    plural(e, t, n) {
      return `${e} ${Number(e) === 1 ? t : n}`;
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
function qt(e) {
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
function es({ sheet: e }) {
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

${e ? "" : `  <div class="ndb-stats">
    <div class="ndb-stat">
      <span class="ndb-env-dot" data-ndb-bind:class="'is-' + modeTone"></span>
      <span>
        <span class="ndb-stat-key">Mode</span>
        <span class="ndb-stat-value" data-ndb-text="request.mode || 'unknown'"></span>
      </span>
    </div>

    <div class="ndb-stat">
      ${Z("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </div>

    <div class="ndb-stat">
      ${Z("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </div>

    <div class="ndb-stat is-secondary">
      ${Z("chip", "is-accent")}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </div>
  </div>`}

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openPalette()"
            title="Search sections and settings">
      ${Z("search")}
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="select('findings')"
            data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
            title="Findings">
      ${Z("alert")}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <span class="ndb-controls-divider"></span>

    ${e ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      <span data-ndb-show="!maximised">${Z("expand")}</span>
      <span data-ndb-show="maximised">${Z("collapse")}</span>
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${Z("minimise")}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${Z("expand")}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="dismiss()"
            title="Hide until the next page load">
      ${Z("close")}
    </button>
  </div>
</div>`;
}
function ts(e, t) {
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
      ${Z("star")}
    </button>
  </div>
</template>`;
}
function Lc() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${ts("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${ts("otherSections", !1)}
</nav>`;
}
function ns(e, t) {
  return `<div class="ndb-subtabs" role="tablist">${t.map((i) => `
  <button type="button" class="ndb-subtab" role="tab"
          data-ndb-bind:aria-selected="${e} === '${i.id}' ? 'true' : 'false'"
          data-ndb-bind:class="${e} === '${i.id}' && 'is-active'"
          data-ndb-on:click="${e} = '${i.id}'">
    <span>${i.label}</span>
    ${i.count ? `<span class="ndb-pill" data-ndb-show="${i.count}" data-ndb-text="${i.count}"></span>` : ""}
  </button>`).join("")}</div>`;
}
const Dc = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme">

  <div class="ndb-dock" data-ndb-show="!open && !dismissed" data-ndb-cloak>
    ${es({ sheet: !1 })}
  </div>

  ${Gl()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${es({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${Z("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${Lc()}

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
           data-ndb-show="currentSection.graded !== false && section !== 'findings'
                          && sectionFindings.length === 0">
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
          <button type="button" class="ndb-chip ndb-summary-copy"
                  data-ndb-bind:class="copyState && 'is-active'"
                  data-ndb-on:click="copyReport()"
                  title="Put this request on the clipboard as markdown, for an assistant"
                  data-ndb-text="copyLabel"></button>
        </div>

        <div class="ndb-note" data-ndb-show="copyFallback">
          <p>This browser would not take the clipboard. Select this and copy it by hand.</p>
          <textarea class="ndb-copy-fallback" readonly rows="6" data-ndb-model="copyFallback"
                    data-ndb-on:focus="$event.target.select()"></textarea>
        </div>

        <p class="ndb-note" data-ndb-show="looksLikeFullPageCacheHit">
          No queries and no events. This page was almost certainly served from the full
          page cache, so the application never ran.
        </p>

        <ol class="ndb-steps">
          <li class="ndb-step">
            <h3>Received</h3>
            <p>Magento accepted the request and chose an area for it.</p>
            ${qt([
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
            ${qt([
  { label: "Route", value: "request.route || 'unknown'", mono: !0 },
  { label: "Action", value: "request.action || 'unknown'", mono: !0 },
  { label: "Intercepted types", value: "interception.plugin_count || 0" },
  { label: "Observers run", value: "observers.count || 0" }
])}
          </li>

          <li class="ndb-step">
            <h3>Responded</h3>
            <p>What the work cost, and what went back to the browser.</p>
            ${qt([
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
              <code class="ndb-query-sql" data-ndb-html="highlight(query.sql, 'sql')"></code>
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

      <div data-ndb-show="isSection('history')">
        ${ns("historyTab", [
  { id: "recent", label: "Recent", count: "history.length" },
  { id: "compare", label: "Compare" }
])}

        <div data-ndb-show="historyTab === 'recent'">
        <div class="ndb-subhead">
          <div>
            <h3>Recent requests</h3>
            <p>
              <span data-ndb-text="history.length"></span> profiles on disk, newest first.
              The store keeps the last 20, or the last hour.
            </p>
          </div>
          <button type="button" class="ndb-chip" data-ndb-on:click="loadHistory(true)"
                  title="Read the store again">Refresh</button>
        </div>

        <p class="ndb-note" data-ndb-show="historyLoading">Loading the history.</p>
        <p class="ndb-note" data-ndb-show="historyError">
          Could not load the history: <span data-ndb-text="historyError"></span>
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="entry in history" data-ndb-bind:key="entry.profile_id">
            <li>
              <button type="button" class="ndb-history"
                      data-ndb-bind:class="activeId === entry.profile_id && 'is-active'"
                      data-ndb-on:click="openFromHistory(entry.profile_id)">
                <span class="ndb-history-method" data-ndb-text="entry.method || 'GET'"></span>
                <span class="ndb-history-body">
                  <span class="ndb-history-path ndb-mono ndb-truncate"
                        data-ndb-text="entry.path || '/'"></span>
                  <span class="ndb-history-meta">
                    <span data-ndb-text="entry.area"></span>
                    <span data-ndb-text="plural(entry.query_count, 'query', 'queries')"></span>
                    <span data-ndb-show="activeId === entry.profile_id">Showing now</span>
                  </span>
                </span>
                <span class="ndb-tag" data-ndb-show="entry.finding_count"
                      data-ndb-bind:class="entry.worst_severity === 'error' ? 'is-bad' : 'is-warn'"
                      data-ndb-text="plural(entry.finding_count, 'finding', 'findings')"></span>
                <span class="ndb-history-status"
                      data-ndb-bind:class="entry.status >= 400 ? 'is-bad' : 'is-ok'"
                      data-ndb-text="entry.status"></span>
                <span class="ndb-history-timing">
                  <span data-ndb-text="number(entry.duration_ms, 1) + ' ms'"></span>
                  <small class="ndb-dim" data-ndb-text="ago(entry.started_at)"></small>
                </span>
              </button>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="!historyLoading && history.length === 0">
          Nothing stored yet.
        </p>
        </div>

        <div data-ndb-show="historyTab === 'compare'">
          <div class="ndb-subhead">
            <div>
              <h3>What changed</h3>
              <p>
                The request on screen, measured against an earlier one. Query shapes are
                matched by fingerprint, so the same statement with different ids counts
                once.
              </p>
            </div>
          </div>

          <div class="ndb-fields">
            <div class="ndb-field is-search">
              <span class="ndb-field-label">Compare against</span>
              <select class="ndb-search" data-ndb-model="baselineId">
                <template data-ndb-for="choice in baselineChoices"
                          data-ndb-bind:key="choice.profile_id">
                  <option data-ndb-bind:value="choice.profile_id"
                          data-ndb-text="choice.method + ' ' + choice.path + '  ·  '
                            + number(choice.duration_ms, 0) + ' ms  ·  ' + ago(choice.started_at)"></option>
                </template>
              </select>
            </div>

            <div class="ndb-field">
              <span class="ndb-field-label">&nbsp;</span>
              <button type="button" class="ndb-chip is-active"
                      data-ndb-on:click="compareProfiles()">Compare</button>
            </div>
          </div>

          <p class="ndb-note" data-ndb-show="comparing">Comparing.</p>
          <p class="ndb-note" data-ndb-show="compareError">
            Could not compare: <span data-ndb-text="compareError"></span>
          </p>
          <p class="ndb-empty" data-ndb-show="!comparison && !comparing && !compareError">
            Pick a request and compare. Nothing is fetched until you do.
          </p>

          <div data-ndb-show="comparison">
            <div class="ndb-callout is-warn" data-ndb-show="comparison && !comparison.same_path">
              <p class="ndb-callout-title">These are different pages</p>
              <p>Comparing unlike requests measures the difference between the pages, not
                the difference a change made.</p>
            </div>

            <table class="ndb-table ndb-compare">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th class="ndb-num">Before</th>
                  <th class="ndb-num">Now</th>
                  <th class="ndb-num">Change</th>
                </tr>
              </thead>
              <tbody>
                <template data-ndb-for="metric in comparison.metrics"
                          data-ndb-bind:key="metric.key">
                  <tr>
                    <td data-ndb-text="metric.label"></td>
                    <td class="ndb-num ndb-dim" data-ndb-text="metricValue(metric, 'baseline')"></td>
                    <td class="ndb-num" data-ndb-text="metricValue(metric, 'subject')"></td>
                    <td class="ndb-num ndb-delta" data-ndb-bind:class="'is-' + metric.verdict">
                      <span data-ndb-text="deltaLabel(metric)"></span>
                      <small data-ndb-show="metric.percent !== null && metric.delta !== 0"
                             data-ndb-text="(metric.percent > 0 ? '+' : '') + metric.percent + '%'"></small>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>

            <div class="ndb-subhead" data-ndb-show="comparison
                 && (comparison.findings.new.length || comparison.findings.resolved.length)">
              <div>
                <h3>Findings</h3>
                <p>
                  <span data-ndb-text="comparison.findings.unchanged"></span> unchanged.
                </p>
              </div>
            </div>

            <ol class="ndb-list">
              <template data-ndb-for="(finding, index) in comparison.findings.new"
                        data-ndb-bind:key="'new' + index">
                <li class="ndb-finding" data-ndb-bind:class="'is-' + finding.severity">
                  <div class="ndb-finding-head">
                    <span class="ndb-severity" data-ndb-bind:class="'is-' + finding.severity">new</span>
                    <span class="ndb-finding-message" data-ndb-text="finding.message"></span>
                  </div>
                </li>
              </template>
              <template data-ndb-for="(finding, index) in comparison.findings.resolved"
                        data-ndb-bind:key="'gone' + index">
                <li class="ndb-finding">
                  <div class="ndb-finding-head">
                    <span class="ndb-severity is-clear">gone</span>
                    <span class="ndb-finding-message" data-ndb-text="finding.message"></span>
                  </div>
                </li>
              </template>
            </ol>

            <div class="ndb-subhead">
              <div>
                <h3>Query shapes</h3>
                <p>
                  <span data-ndb-text="comparison.queries.shapes_before"></span> before,
                  <span data-ndb-text="comparison.queries.shapes_after"></span> after.
                  <span data-ndb-text="comparison.queries.added_total"></span> added,
                  <span data-ndb-text="comparison.queries.removed_total"></span> gone,
                  <span data-ndb-text="comparison.queries.changed_total"></span> run a
                  different number of times.
                </p>
              </div>
            </div>

            <p class="ndb-empty" data-ndb-show="comparison
               && !comparison.queries.added_total && !comparison.queries.removed_total
               && !comparison.queries.changed_total">
              The same statements ran the same number of times.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="(row, index) in comparison.queries.added"
                        data-ndb-bind:key="'add' + index">
                <li class="ndb-query">
                  <div class="ndb-query-head">
                    <span class="ndb-delta is-worse"
                          data-ndb-text="'+' + row.count"></span>
                    <span class="ndb-query-type">added</span>
                  </div>
                  <code class="ndb-query-sql" data-ndb-html="highlight(row.sql, 'sql')"></code>
                </li>
              </template>

              <template data-ndb-for="(row, index) in comparison.queries.changed"
                        data-ndb-bind:key="'chg' + index">
                <li class="ndb-query">
                  <div class="ndb-query-head">
                    <span class="ndb-delta"
                          data-ndb-bind:class="row.delta > 0 ? 'is-worse' : 'is-better'"
                          data-ndb-text="(row.delta > 0 ? '+' : '') + row.delta"></span>
                    <span class="ndb-query-type"
                          data-ndb-text="row.baseline_count + ' to ' + row.count + ' runs'"></span>
                  </div>
                  <code class="ndb-query-sql" data-ndb-html="highlight(row.sql, 'sql')"></code>
                </li>
              </template>

              <template data-ndb-for="(row, index) in comparison.queries.removed"
                        data-ndb-bind:key="'rem' + index">
                <li class="ndb-query">
                  <div class="ndb-query-head">
                    <span class="ndb-delta is-better" data-ndb-text="row.delta"></span>
                    <span class="ndb-query-type">gone</span>
                  </div>
                  <code class="ndb-query-sql" data-ndb-html="highlight(row.sql, 'sql')"></code>
                </li>
              </template>
            </ol>
          </div>
        </div>
      </div>

      <div data-ndb-show="isSection('alpine')">
        <p class="ndb-note" data-ndb-show="!alpineHealth.present">
          No Alpine on this page. This section reads the page's own instance, so it has
          nothing to show until a theme loads one.
        </p>

        <div data-ndb-show="alpineHealth.present">
          ${ns("alpineTab", [
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
                    ${Z("caret", "ndb-alpine-caret")}
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
                          data-ndb-html="highlight(component.expression, 'javascript')"></code>
                    <pre class="ndb-json" data-ndb-html="highlight(alpineStates[component.id], 'json')"></pre>
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
                    <pre class="ndb-json" data-ndb-html="highlight(store.value, 'json')"></pre>
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
            ${qt([
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
`, qc = "data-ndb-", Bc = "siteation-debugbar";
function jc(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const s = document.createElement("link");
    s.rel = "stylesheet", s.href = n, t.append(s);
  }
  const i = document.createElement("div");
  return i.innerHTML = Dc, t.append(...i.children), t.querySelector(".ndb");
}
const Sn = document.getElementById(Bc);
if (Sn && !Sn.shadowRoot) {
  const e = jc(Sn);
  jt.prefix(qc), jt.data("debugBar", Pc), e && jt.initTree(e), kn && (window.Alpine = kn);
}
