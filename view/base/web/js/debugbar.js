const Mn = window.Alpine;
var Nn = !1, Cn = !1, pe = [], Rn = -1, Ft = !1, Yn = !1;
function Ia(e) {
  Da(e);
}
function Pa() {
  Yn = !0;
}
function $a() {
  Yn = !1, ys();
}
function Da(e) {
  pe.includes(e) || (pe.push(e), e._x_schedulerPriority !== void 0 && (Ft = !0)), ys();
}
function La(e) {
  let t = pe.indexOf(e);
  t !== -1 && t > Rn && pe.splice(t, 1);
}
function ys() {
  if (!Cn && !Nn) {
    if (Yn)
      return;
    Nn = !0, queueMicrotask(qa);
  }
}
function qa() {
  Nn = !1, Cn = !0;
  for (let e = 0; e < pe.length; e++)
    Ft && Ua(e), pe[e](), Rn = e;
  pe.length = 0, Rn = -1, Ft = !1, Cn = !1;
}
function Ua(e) {
  let t = /* @__PURE__ */ new Map(), n = pe.slice(e).sort((i, s) => ja(i, s, t));
  for (let i = 0; i < n.length; i++)
    pe[e + i] = n[i];
  Ft = !1;
}
function ja(e, t, n) {
  return yn(e) ? yn(t) ? Wi(e._x_schedulerPriority.el, n) - Wi(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : yn(t) ? 1 : 0;
}
function yn(e) {
  return e._x_schedulerPriority !== void 0;
}
function Wi(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, i = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(i, n), n;
}
var Qe, Ue, et, vs, Ba = 0, In = !0;
function Fa(e) {
  In = !1, e(), In = !0;
}
function Ha(e) {
  Qe = e.reactive, et = e.release, Ue = (t) => e.effect(t, { scheduler: (n) => {
    In ? Ia(n) : n();
  } }), vs = e.raw;
}
function Ki(e) {
  Ue = e;
}
function Wa(e) {
  let t = () => {
  };
  return [(i, s) => {
    let r = s?.priority === "structural" ? Ba++ : void 0, a = Ue(i);
    return r !== void 0 && a !== void 0 && (a._x_schedulerPriority = { el: e, order: r }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(a), t = () => {
      a !== void 0 && (e._x_effects.delete(a), et(a));
    }, a;
  }, () => {
    t();
  }];
}
function _s(e, t) {
  let n = !0, i, s, r = Ue(() => {
    let a = e(), o = JSON.stringify(a);
    if (!n && (typeof a == "object" || a !== i)) {
      let c = typeof i == "object" ? JSON.parse(s) : i;
      queueMicrotask(() => {
        t(a, c);
      });
    }
    i = a, s = o, n = !1;
  });
  return () => et(r);
}
async function Ka(e) {
  Pa();
  try {
    await e(), await Promise.resolve();
  } finally {
    $a();
  }
}
var ws = [], xs = [], Es = [];
function za(e) {
  Es.push(e);
}
function Qn(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, xs.push(t));
}
function ks(e) {
  ws.push(e);
}
function Ss(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function As(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((s) => s()), delete e._x_attributeCleanups[n]);
  });
}
function Ga(e) {
  for (e._x_effects?.forEach(La); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var ei = new MutationObserver(si), ti = !1;
function ni() {
  ei.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), ti = !0;
}
function Os() {
  Va(), ei.disconnect(), ti = !1;
}
var rt = [];
function Va() {
  let e = ei.takeRecords();
  rt.push(() => e.length > 0 && si(e));
  let t = rt.length;
  queueMicrotask(() => {
    if (rt.length === t)
      for (; rt.length > 0; )
        rt.shift()();
  });
}
function j(e) {
  if (!ti)
    return e();
  Os();
  let t = e();
  return ni(), t;
}
var ii = !1, Ht = [];
function Ja() {
  ii = !0;
}
function Za() {
  ii = !1, si(Ht), Ht = [];
}
function si(e) {
  if (ii) {
    Ht = Ht.concat(e);
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
      }, p = () => {
        s.has(a) || s.set(a, []), s.get(a).push(o);
      };
      a.hasAttribute(o) && c === null ? d() : a.hasAttribute(o) ? (p(), d()) : p();
    }
  s.forEach((r, a) => {
    As(a, r);
  }), i.forEach((r, a) => {
    ws.forEach((o) => o(a, r));
  });
  for (let r of n)
    t.some((a) => a.contains(r)) || xs.forEach((a) => a(r));
  for (let r of t)
    r.isConnected && Es.forEach((a) => a(r));
  t = null, n = null, i = null, s = null;
}
function Ts(e) {
  return Ie(Xe(e));
}
function xt(e, t, n) {
  return e._x_dataStack = [t, ...Xe(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function Xe(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? Xe(e.host) : e.parentNode ? Xe(e.parentNode) : [];
}
function Ie(e) {
  return new Proxy({ objects: e }, Xa);
}
function Ms(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : Ms(Object.getPrototypeOf(e), t);
}
var Xa = {
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
    return t == "toJSON" ? Ya : Reflect.get(
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
      if (s = Ms(a, t), s)
        break;
    s || (s = e[e.length - 1]);
    const r = Object.getOwnPropertyDescriptor(s, t);
    return r?.set && r?.get ? r.set.call(i, n) || !0 : Reflect.set(s, t, n);
  }
};
function Ya() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function ri(e, t = () => {
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
function Ns(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, s, r, a) {
      return e(this.initialValue, () => Qa(i, s), (o) => Pn(i, s, o), s, r, a);
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
function Qa(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function Pn(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Pn(e[t[0]], t.slice(1), n);
  }
}
var Cs = {};
function se(e, t) {
  Cs[e] = t;
}
function Wt(e, t) {
  let n = eo(t);
  return Object.entries(Cs).forEach(([i, s]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return s(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function eo(e) {
  let [t, n] = qs(e), i = { interceptor: Ns, ...t };
  return Qn(e, n), i;
}
function to(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (s) {
    ai(s, e, t);
  }
}
function ai(...e) {
  return Rs(...e);
}
var Rs = io;
function no(e) {
  Rs = e;
}
function io(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var Ne = !0;
function Is(e) {
  let t = Ne;
  Ne = !1;
  let n = e();
  return Ne = t, n;
}
function Ce(e, t, n = {}) {
  let i;
  return X(e, t)((s) => i = s, n), i;
}
function X(...e) {
  return Ps(...e);
}
var Ps = () => {
};
function so(e) {
  Ps = e;
}
var $s;
function ro(e) {
  $s = e;
}
function ao(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: s = [], context: r } = {}) => {
    if (!Ne) {
      $n(n, t, Ie([i, ...e]), s);
      return;
    }
    let a = t.apply(Ie([i, ...e]), s);
    $n(n, a);
  };
}
function $n(e, t, n, i, s) {
  if (Ne && typeof t == "function") {
    let r = t.apply(n, i);
    r instanceof Promise ? r.then((a) => $n(e, a, n, i)).catch((a) => ai(a, s, t)) : e(r);
  } else typeof t == "object" && t instanceof Promise ? t.then((r) => e(r)) : e(t);
}
function oo(...e) {
  return $s(...e);
}
var oi = "x-";
function tt(e = "") {
  return oi + e;
}
function lo(e) {
  oi = e;
}
var Kt = {};
function B(e, t) {
  return Kt[e] = t, {
    before(n) {
      if (!Kt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = Me.indexOf(n);
      Me.splice(i >= 0 ? i : Me.indexOf("DEFAULT"), 0, e);
    }
  };
}
function co(e) {
  return Object.keys(Kt).includes(e);
}
function li(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let r = Object.entries(e._x_virtualDirectives).map(([o, c]) => ({ name: o, value: c })), a = Ds(r);
    r = r.map((o) => a.find((c) => c.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(r);
  }
  let i = {};
  return t.map(Bs((r, a) => i[r] = a)).filter(Hs).map(ho(i, n)).sort(fo).map((r) => po(e, r));
}
function Ds(e) {
  return Array.from(e).map(Bs()).filter((t) => !Hs(t));
}
var Dn = !1, dt = /* @__PURE__ */ new Map(), Ls = /* @__PURE__ */ Symbol();
function uo(e) {
  Dn = !0;
  let t = /* @__PURE__ */ Symbol();
  Ls = t, dt.set(t, []);
  let n = () => {
    for (; dt.get(t).length; )
      dt.get(t).shift()();
    dt.delete(t);
  }, i = () => {
    Dn = !1, n();
  };
  e(n), i();
}
function qs(e) {
  let t = [], n = (o) => t.push(o), [i, s] = Wa(e);
  return t.push(s), [{
    Alpine: nt,
    effect: i,
    cleanup: n,
    evaluateLater: X.bind(X, e),
    evaluate: Ce.bind(Ce, e)
  }, () => t.forEach((o) => o())];
}
function po(e, t) {
  let n = () => {
  }, i = Kt[t.type] || n, [s, r] = qs(e);
  Ss(e, t.original, r);
  let a = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, s), i = i.bind(i, e, t, s), Dn ? dt.get(Ls).push(i) : i());
  };
  return a.runCleanups = r, a;
}
var Us = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), js = (e) => e;
function Bs(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: s } = Fs.reduce((r, a) => a(r), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: s };
  };
}
var Fs = [];
function ci(e) {
  Fs.push(e);
}
function Hs({ name: e }) {
  return Ws().test(e);
}
var Ws = () => new RegExp(`^${oi}([^:^.]+)\\b`);
function ho(e, t) {
  return ({ name: n, value: i }) => {
    n === i && (i = "");
    let s = n.match(Ws()), r = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: s ? s[1] : null,
      value: r ? r[1] : null,
      modifiers: a.map((c) => c.replace(".", "")),
      expression: i,
      original: o
    };
  };
}
var Ln = "DEFAULT", Me = [
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
  Ln,
  "teleport"
];
function fo(e, t) {
  let n = Me.indexOf(e.type) === -1 ? Ln : e.type, i = Me.indexOf(t.type) === -1 ? Ln : t.type;
  return Me.indexOf(n) - Me.indexOf(i);
}
function ut(e, t, n = {}, i = {}) {
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
function Pe(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((s) => Pe(s, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let i = e.firstElementChild;
  for (; i; )
    Pe(i, t), i = i.nextElementSibling;
}
function le(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var zi = !1;
function bo() {
  zi && le("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), zi = !0, document.body || le("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), ut(document, "alpine:init"), ut(document, "alpine:initializing"), ni(), za((t) => fe(t, Pe)), Qn((t) => je(t)), ks((t, n) => {
    li(t, n).forEach((i) => i());
  });
  let e = (t) => !Qt(t.parentElement, !0);
  Array.from(document.querySelectorAll(Gs().join(","))).filter(e).forEach((t) => {
    fe(t);
  }), ut(document, "alpine:initialized"), setTimeout(() => {
    vo();
  });
}
var di = [], Ks = [];
function zs() {
  return di.map((e) => e());
}
function Gs() {
  return di.concat(Ks).map((e) => e());
}
function Vs(e) {
  di.push(e);
}
function Js(e) {
  Ks.push(e);
}
function Qt(e, t = !1) {
  return he(e, (n) => {
    if ((t ? Gs() : zs()).some((s) => n.matches(s)))
      return !0;
  });
}
function he(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack)
      return he(e._x_teleportBack, t);
    if (e.parentNode instanceof ShadowRoot)
      return he(e.parentNode.host, t);
    if (e.parentElement)
      return he(e.parentElement, t);
  }
}
function go(e) {
  return zs().some((t) => e.matches(t));
}
var Zs = [];
function mo(e) {
  Zs.push(e);
}
var yo = 1;
function fe(e, t = Pe, n = () => {
}) {
  he(e, (i) => i._x_ignore) || uo(() => {
    t(e, (i, s) => {
      i._x_marker || (n(i, s), Zs.forEach((r) => r(i, s)), li(i, i.attributes).forEach((r) => r()), i._x_ignore || (i._x_marker = yo++), i._x_ignore && s());
    });
  });
}
function je(e, t = Pe) {
  t(e, (n) => {
    Ga(n), As(n), delete n._x_marker;
  });
}
function vo() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    co(n) || i.some((s) => {
      if (document.querySelector(s))
        return le(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var qn = [], ui = !1;
function pi(e = () => {
}) {
  return queueMicrotask(() => {
    ui || setTimeout(() => {
      Un();
    });
  }), new Promise((t) => {
    qn.push(() => {
      e(), t();
    });
  });
}
function Un() {
  for (ui = !1; qn.length; )
    qn.shift()();
}
function _o() {
  ui = !0;
}
function hi(e, t) {
  return Array.isArray(t) ? Gi(e, t.join(" ")) : typeof t == "object" && t !== null ? wo(e, t) : typeof t == "function" ? hi(e, t()) : Gi(e, t);
}
function jn(e) {
  return e.split(/\s/).filter(Boolean);
}
function Gi(e, t) {
  let n = (s) => jn(s).filter((r) => !e.classList.contains(r)).filter(Boolean), i = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function wo(e, t) {
  let n = Object.entries(t).flatMap(([a, o]) => o ? jn(a) : !1).filter(Boolean), i = Object.entries(t).flatMap(([a, o]) => o ? !1 : jn(a)).filter(Boolean), s = [], r = [];
  return i.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), r.push(a));
  }), n.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    r.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function en(e, t) {
  return typeof t == "object" && t !== null ? xo(e, t) : Eo(e, t);
}
function xo(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, s]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = ko(i)), e.style.setProperty(i, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    en(e, n);
  };
}
function Eo(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function ko(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Bn(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
B("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: s }) => {
  typeof i == "function" && (i = s(i)), i !== !1 && (!i || typeof i == "boolean" ? Ao(e, n, t) : So(e, i, t));
});
function So(e, t, n) {
  Xs(e, hi, ""), {
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
function Ao(e, t, n) {
  Xs(e, en);
  let i = !t.includes("in") && !t.includes("out") && !n, s = i || t.includes("in") || ["enter"].includes(n), r = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((k, P) => P < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((k, P) => P > t.indexOf("out")));
  let a = !t.includes("opacity") && !t.includes("scale"), o = a || t.includes("opacity"), c = a || t.includes("scale"), d = o ? 0 : 1, p = c ? at(t, "scale", 95) / 100 : 1, m = at(t, "delay", 0) / 1e3, E = at(t, "origin", "center"), N = "opacity, transform", L = at(t, "duration", 150) / 1e3, v = at(t, "duration", 75) / 1e3, g = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (e._x_transition.enter.during = {
    transformOrigin: E,
    transitionDelay: `${m}s`,
    transitionProperty: N,
    transitionDuration: `${L}s`,
    transitionTimingFunction: g
  }, e._x_transition.enter.start = {
    opacity: d,
    transform: `scale(${p})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), r && (e._x_transition.leave.during = {
    transformOrigin: E,
    transitionDelay: `${m}s`,
    transitionProperty: N,
    transitionDuration: `${v}s`,
    transitionTimingFunction: g
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: d,
    transform: `scale(${p})`
  });
}
function Xs(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, s = () => {
    }) {
      Fn(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, s);
    },
    out(i = () => {
    }, s = () => {
    }) {
      Fn(e, t, {
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
    let a = Ys(e);
    a ? (a._x_hideChildren || (a._x_hideChildren = []), a._x_hideChildren.push(e)) : s(() => {
      let o = (c) => {
        let d = Promise.all([
          c._x_hidePromise,
          ...(c._x_hideChildren || []).map(o)
        ]).then(([p]) => p?.());
        return delete c._x_hidePromise, delete c._x_hideChildren, d;
      };
      o(e).catch((c) => {
        if (!c.isFromCancelledTransition)
          throw c;
      });
    });
  });
};
function Ys(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Ys(t);
}
function Fn(e, t, { during: n, start: i, end: s } = {}, r = () => {
}, a = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(s).length === 0) {
    r(), a();
    return;
  }
  let o, c, d;
  Oo(e, {
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
function Oo(e, t) {
  let n, i, s, r = Bn(() => {
    j(() => {
      n = !0, i || t.before(), s || (t.end(), Un()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(a) {
      this.beforeCancels.push(a);
    },
    cancel: Bn(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      r();
    }),
    finish: r
  }, j(() => {
    t.start(), t.during();
  }), _o(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), j(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (j(() => {
        t.end();
      }), Un(), setTimeout(e._x_transitioning.finish, a + o), s = !0);
    });
  });
}
function at(e, t, n) {
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
var we = !1;
function xe(e, t = () => {
}) {
  return (...n) => we ? t(...n) : e(...n);
}
function To(e) {
  return (...t) => we && e(...t);
}
var Qs = [];
function tn(e) {
  Qs.push(e);
}
function Mo(e, t) {
  Qs.forEach((n) => n(e, t)), we = !0, er(() => {
    fe(t, (n, i) => {
      i(n, () => {
      });
    });
  }), we = !1;
}
var Hn = !1;
function No(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), we = !0, Hn = !0, er(() => {
    Co(t);
  }), we = !1, Hn = !1;
}
function Co(e) {
  let t = !1;
  fe(e, (i, s) => {
    Pe(i, (r, a) => {
      if (t && go(r))
        return a();
      t = !0, s(r, a);
    });
  });
}
function er(e) {
  let t = Ue;
  Ki((n, i) => {
    let s = t(n);
    return et(s), () => {
    };
  }), e(), Ki(t);
}
function tr(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Qe({})), e._x_bindings[t] = n, t = i.includes("camel") ? Uo(t) : t, t) {
    case "value":
      Ro(e, n);
      break;
    case "style":
      Po(e, n);
      break;
    case "class":
      Io(e, n);
      break;
    case "selected":
    case "checked":
      $o(e, t, n);
      break;
    default:
      fi(e, t, n);
      break;
  }
}
function Ro(e, t) {
  if (bi(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (zt(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => jo(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    qo(e, t);
  else if (e.tagName === "OPTION")
    fi(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Io(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = hi(e, t);
}
function Po(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = en(e, t);
}
function $o(e, t, n) {
  fi(e, t, n), Lo(e, t, n);
}
function fi(e, t, n) {
  [null, void 0, !1].includes(n) && Fo(t) ? e.removeAttribute(t) : (nr(t) && (n = t), Ho(n) && (n = JSON.stringify(n)), Do(e, t, n));
}
function Do(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function Lo(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function qo(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Uo(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function jo(e, t) {
  return e == t;
}
function jt(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Bo = /* @__PURE__ */ new Set([
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
function nr(e) {
  return Bo.has(e);
}
function Fo(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Ho(e) {
  return typeof e == "object" && e !== null;
}
function Wo(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : ir(e, t, n);
}
function Ko(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = i, Is(() => Ce(e, s.expression));
  }
  return ir(e, t, n);
}
function ir(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : nr(t) ? !![t, "true"].includes(i) : i;
}
function zt(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function bi(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function sr(e, t) {
  let n;
  return function() {
    const i = this, s = arguments, r = function() {
      n = null, e.apply(i, s);
    };
    clearTimeout(n), n = setTimeout(r, t);
  };
}
function rr(e, t) {
  let n;
  return function() {
    let i = this, s = arguments;
    n || (e.apply(i, s), n = !0, setTimeout(() => n = !1, t));
  };
}
function ar({ get: e, set: t }, { get: n, set: i }) {
  let s = !0, r, a = Ue(() => {
    let o = e(), c = n();
    if (s)
      i(vn(o)), s = !1;
    else {
      let d = JSON.stringify(o), p = JSON.stringify(c);
      d !== r ? i(vn(o)) : d !== p && t(vn(c));
    }
    r = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    et(a);
  };
}
function vn(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function zo(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(nt));
}
var ue = {}, Vi = !1;
function Go(e, t) {
  if (Vi || (ue = Qe(ue), Vi = !0), t === void 0)
    return ue[e];
  ue[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? ue[e] = t.initialize(ue, e, e, () => {
  }) : ri(ue[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ue[e].init();
}
function Vo() {
  return ue;
}
var or = {};
function Jo(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? lr(e, n()) : (or[e] = n, () => {
  });
}
function Zo(e) {
  return Object.entries(or).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function lr(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let s = Object.entries(t).map(([a, o]) => ({ name: a, value: o })), r = Ds(s);
  return s = s.map((a) => r.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), li(e, s, n).map((a) => {
    i.push(a.runCleanups), a();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var cr = {};
function Xo(e, t) {
  cr[e] = t;
}
function Yo(e, t) {
  return Object.entries(cr).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...s) => i.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var Qo = {
  get reactive() {
    return Qe;
  },
  get release() {
    return et;
  },
  get effect() {
    return Ue;
  },
  get raw() {
    return vs;
  },
  get transaction() {
    return Ka;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Za,
  dontAutoEvaluateFunctions: Is,
  disableEffectScheduling: Fa,
  startObservingMutations: ni,
  stopObservingMutations: Os,
  setReactivityEngine: Ha,
  onAttributeRemoved: Ss,
  onAttributesAdded: ks,
  closestDataStack: Xe,
  skipDuringClone: xe,
  onlyDuringClone: To,
  addRootSelector: Vs,
  addInitSelector: Js,
  setErrorHandler: no,
  interceptClone: tn,
  addScopeToNode: xt,
  deferMutations: Ja,
  mapAttributes: ci,
  evaluateLater: X,
  interceptInit: mo,
  initInterceptors: ri,
  injectMagics: Wt,
  setEvaluator: so,
  setRawEvaluator: ro,
  mergeProxies: Ie,
  extractProp: Ko,
  findClosest: he,
  onElRemoved: Qn,
  closestRoot: Qt,
  destroyTree: je,
  interceptor: Ns,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Fn,
  // INTERNAL
  setStyles: en,
  // INTERNAL
  mutateDom: j,
  directive: B,
  entangle: ar,
  throttle: rr,
  debounce: sr,
  evaluate: Ce,
  evaluateRaw: oo,
  initTree: fe,
  nextTick: pi,
  prefixed: tt,
  prefix: lo,
  plugin: zo,
  magic: se,
  store: Go,
  start: bo,
  clone: No,
  // INTERNAL
  cloneNode: Mo,
  // INTERNAL
  bound: Wo,
  $data: Ts,
  watch: _s,
  walk: Pe,
  data: Xo,
  bind: Jo
}, nt = Qo, Ji = /* @__PURE__ */ new WeakMap(), dr = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((e) => {
  e === "styleMedia" || e === "sharedStorage" || dr.add(globalThis[e]);
});
var K = class {
  constructor(e, t, n, i) {
    this.type = e, this.value = t, this.start = n, this.end = i;
  }
}, el = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new K("EOF", null, this.position, this.position)), this.tokens;
  }
  skipWhitespace() {
    for (; this.position < this.input.length && /\s/.test(this.input[this.position]); )
      this.position++;
  }
  skipLineComment() {
    for (; this.position < this.input.length && this.input[this.position] !== `
`; )
      this.position++;
  }
  isDigit(e) {
    return /[0-9]/.test(e);
  }
  isAlpha(e) {
    return /[a-zA-Z]/.test(e);
  }
  isAlphaNumeric(e) {
    return /[a-zA-Z0-9_$]/.test(e);
  }
  peek(e = 1) {
    return this.input[this.position + e] || "";
  }
  readNumber() {
    const e = this.position;
    let t = !1;
    for (; this.position < this.input.length; ) {
      const i = this.input[this.position];
      if (this.isDigit(i))
        this.position++;
      else if (i === "." && !t)
        t = !0, this.position++;
      else
        break;
    }
    const n = this.input.slice(e, this.position);
    this.tokens.push(new K("NUMBER", parseFloat(n), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new K("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new K("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new K("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new K("KEYWORD", t, e, this.position)) : this.tokens.push(new K("IDENTIFIER", t, e, this.position));
  }
  readString() {
    const e = this.position, t = this.input[this.position];
    this.position++;
    let n = "", i = !1;
    for (; this.position < this.input.length; ) {
      const s = this.input[this.position];
      if (i) {
        switch (s) {
          case "n":
            n += `
`;
            break;
          case "t":
            n += "	";
            break;
          case "r":
            n += "\r";
            break;
          case "\\":
            n += "\\";
            break;
          case t:
            n += t;
            break;
          default:
            n += s;
        }
        i = !1;
      } else if (s === "\\")
        i = !0;
      else if (s === t) {
        this.position++, this.tokens.push(new K("STRING", n, e, this.position));
        return;
      } else
        n += s;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${e}`);
  }
  readOperatorOrPunctuation() {
    const e = this.position, t = this.input[this.position], n = this.peek(), i = this.peek(2);
    if (t === "=" && n === "=" && i === "=")
      this.position += 3, this.tokens.push(new K("OPERATOR", "===", e, this.position));
    else if (t === "!" && n === "=" && i === "=")
      this.position += 3, this.tokens.push(new K("OPERATOR", "!==", e, this.position));
    else if (t === "=" && n === "=")
      this.position += 2, this.tokens.push(new K("OPERATOR", "==", e, this.position));
    else if (t === "!" && n === "=")
      this.position += 2, this.tokens.push(new K("OPERATOR", "!=", e, this.position));
    else if (t === "<" && n === "=")
      this.position += 2, this.tokens.push(new K("OPERATOR", "<=", e, this.position));
    else if (t === ">" && n === "=")
      this.position += 2, this.tokens.push(new K("OPERATOR", ">=", e, this.position));
    else if (t === "&" && n === "&")
      this.position += 2, this.tokens.push(new K("OPERATOR", "&&", e, this.position));
    else if (t === "|" && n === "|")
      this.position += 2, this.tokens.push(new K("OPERATOR", "||", e, this.position));
    else if (t === "+" && n === "+")
      this.position += 2, this.tokens.push(new K("OPERATOR", "++", e, this.position));
    else if (t === "-" && n === "-")
      this.position += 2, this.tokens.push(new K("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const s = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new K(s, t, e, this.position));
    }
  }
}, tl = class {
  constructor(e) {
    this.tokens = e, this.position = 0;
  }
  parse() {
    if (this.isAtEnd())
      throw new Error("Empty expression");
    const e = this.parseExpression();
    if (this.match("PUNCTUATION", ";"), !this.isAtEnd())
      throw new Error(`Unexpected token: ${this.current().value}`);
    return e;
  }
  parseExpression() {
    return this.parseAssignment();
  }
  parseAssignment() {
    const e = this.parseTernary();
    if (this.match("OPERATOR", "=")) {
      const t = this.parseAssignment();
      if (e.type === "Identifier" || e.type === "MemberExpression")
        return {
          type: "AssignmentExpression",
          left: e,
          operator: "=",
          right: t
        };
      throw new Error("Invalid assignment target");
    }
    return e;
  }
  parseTernary() {
    const e = this.parseLogicalOr();
    if (this.match("PUNCTUATION", "?")) {
      const t = this.parseExpression();
      this.consume("PUNCTUATION", ":");
      const n = this.parseExpression();
      return {
        type: "ConditionalExpression",
        test: e,
        consequent: t,
        alternate: n
      };
    }
    return e;
  }
  parseLogicalOr() {
    let e = this.parseLogicalAnd();
    for (; this.match("OPERATOR", "||"); ) {
      const t = this.previous().value, n = this.parseLogicalAnd();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseLogicalAnd() {
    let e = this.parseEquality();
    for (; this.match("OPERATOR", "&&"); ) {
      const t = this.previous().value, n = this.parseEquality();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseEquality() {
    let e = this.parseRelational();
    for (; this.match("OPERATOR", "==", "!=", "===", "!=="); ) {
      const t = this.previous().value, n = this.parseRelational();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseRelational() {
    let e = this.parseAdditive();
    for (; this.match("OPERATOR", "<", ">", "<=", ">="); ) {
      const t = this.previous().value, n = this.parseAdditive();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseAdditive() {
    let e = this.parseMultiplicative();
    for (; this.match("OPERATOR", "+", "-"); ) {
      const t = this.previous().value, n = this.parseMultiplicative();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseMultiplicative() {
    let e = this.parseUnary();
    for (; this.match("OPERATOR", "*", "/", "%"); ) {
      const t = this.previous().value, n = this.parseUnary();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseUnary() {
    if (this.match("OPERATOR", "++", "--")) {
      const e = this.previous().value, t = this.parseUnary();
      return {
        type: "UpdateExpression",
        operator: e,
        argument: t,
        prefix: !0
      };
    }
    if (this.match("OPERATOR", "!", "-", "+")) {
      const e = this.previous().value, t = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator: e,
        argument: t,
        prefix: !0
      };
    }
    return this.parsePostfix();
  }
  parsePostfix() {
    let e = this.parseMember();
    return this.match("OPERATOR", "++", "--") ? {
      type: "UpdateExpression",
      operator: this.previous().value,
      argument: e,
      prefix: !1
    } : e;
  }
  parseMember() {
    let e = this.parsePrimary();
    for (; ; )
      if (this.match("PUNCTUATION", ".")) {
        const t = this.consume("IDENTIFIER");
        e = {
          type: "MemberExpression",
          object: e,
          property: { type: "Identifier", name: t.value },
          computed: !1
        };
      } else if (this.match("PUNCTUATION", "[")) {
        const t = this.parseExpression();
        this.consume("PUNCTUATION", "]"), e = {
          type: "MemberExpression",
          object: e,
          property: t,
          computed: !0
        };
      } else if (this.match("PUNCTUATION", "(")) {
        const t = this.parseArguments();
        e = {
          type: "CallExpression",
          callee: e,
          arguments: t
        };
      } else
        break;
    return e;
  }
  parseArguments() {
    const e = [];
    if (!this.check("PUNCTUATION", ")"))
      do
        e.push(this.parseExpression());
      while (this.match("PUNCTUATION", ","));
    return this.consume("PUNCTUATION", ")"), e;
  }
  parsePrimary() {
    if (this.match("NUMBER"))
      return { type: "Literal", value: this.previous().value };
    if (this.match("STRING"))
      return { type: "Literal", value: this.previous().value };
    if (this.match("BOOLEAN"))
      return { type: "Literal", value: this.previous().value };
    if (this.match("NULL"))
      return { type: "Literal", value: null };
    if (this.match("UNDEFINED"))
      return { type: "Literal", value: void 0 };
    if (this.match("IDENTIFIER"))
      return { type: "Identifier", name: this.previous().value };
    if (this.match("PUNCTUATION", "(")) {
      const e = this.parseExpression();
      return this.consume("PUNCTUATION", ")"), e;
    }
    if (this.match("PUNCTUATION", "["))
      return this.parseArrayLiteral();
    if (this.match("PUNCTUATION", "{"))
      return this.parseObjectLiteral();
    throw new Error(`Unexpected token: ${this.current().type} "${this.current().value}"`);
  }
  parseArrayLiteral() {
    const e = [];
    for (; !this.check("PUNCTUATION", "]") && !this.isAtEnd() && (e.push(this.parseExpression()), this.match("PUNCTUATION", ",")); )
      if (this.check("PUNCTUATION", "]"))
        break;
    return this.consume("PUNCTUATION", "]"), {
      type: "ArrayExpression",
      elements: e
    };
  }
  parseObjectLiteral() {
    const e = [];
    for (; !this.check("PUNCTUATION", "}") && !this.isAtEnd(); ) {
      let t, n = !1;
      if (this.match("STRING"))
        t = { type: "Literal", value: this.previous().value };
      else if (this.match("IDENTIFIER"))
        t = { type: "Identifier", name: this.previous().value };
      else if (this.match("PUNCTUATION", "["))
        t = this.parseExpression(), n = !0, this.consume("PUNCTUATION", "]");
      else
        throw new Error("Expected property key");
      this.consume("PUNCTUATION", ":");
      const i = this.parseExpression();
      if (e.push({
        type: "Property",
        key: t,
        value: i,
        computed: n,
        shorthand: !1
      }), this.match("PUNCTUATION", ",")) {
        if (this.check("PUNCTUATION", "}"))
          break;
      } else
        break;
    }
    return this.consume("PUNCTUATION", "}"), {
      type: "ObjectExpression",
      properties: e
    };
  }
  match(...e) {
    for (let t = 0; t < e.length; t++) {
      const n = e[t];
      if (t === 0 && e.length > 1) {
        const i = n;
        for (let s = 1; s < e.length; s++)
          if (this.check(i, e[s]))
            return this.advance(), !0;
        return !1;
      } else if (e.length === 1)
        return this.checkType(n) ? (this.advance(), !0) : !1;
    }
    return !1;
  }
  check(e, t) {
    return this.isAtEnd() ? !1 : t !== void 0 ? this.current().type === e && this.current().value === t : this.current().type === e;
  }
  checkType(e) {
    return this.isAtEnd() ? !1 : this.current().type === e;
  }
  advance() {
    return this.isAtEnd() || this.position++, this.previous();
  }
  isAtEnd() {
    return this.current().type === "EOF";
  }
  current() {
    return this.tokens[this.position];
  }
  previous() {
    return this.tokens[this.position - 1];
  }
  consume(e, t) {
    if (t !== void 0) {
      if (this.check(e, t))
        return this.advance();
      throw new Error(`Expected ${e} "${t}" but got ${this.current().type} "${this.current().value}"`);
    }
    if (this.check(e))
      return this.advance();
    throw new Error(`Expected ${e} but got ${this.current().type} "${this.current().value}"`);
  }
}, nl = class {
  evaluate({ node: e, scope: t = {}, context: n = null, forceBindingRootScopeToFunctions: i = !0 }) {
    switch (e.type) {
      case "Literal":
        return e.value;
      case "Identifier":
        if (e.name in t) {
          const g = t[e.name];
          return this.checkForDangerousValues(g), typeof g == "function" ? g.bind(t) : g;
        }
        throw new Error(`Undefined variable: ${e.name}`);
      case "MemberExpression":
        const s = this.evaluate({ node: e.object, scope: t, context: n, forceBindingRootScopeToFunctions: i });
        if (s == null)
          throw new Error("Cannot read property of null or undefined");
        let r;
        e.computed ? r = this.evaluate({ node: e.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : r = e.property.name, this.checkForDangerousKeywords(r);
        let a = s[r];
        return this.checkForDangerousValues(a), typeof a == "function" ? i ? a.bind(t) : a.bind(s) : a;
      case "CallExpression":
        const o = e.arguments.map((g) => this.evaluate({ node: g, scope: t, context: n, forceBindingRootScopeToFunctions: i }));
        let c;
        if (e.callee.type === "MemberExpression") {
          const g = this.evaluate({ node: e.callee.object, scope: t, context: n, forceBindingRootScopeToFunctions: i });
          let k;
          e.callee.computed ? k = this.evaluate({ node: e.callee.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : k = e.callee.property.name, this.checkForDangerousKeywords(k);
          let P = g[k];
          if (typeof P != "function")
            throw new Error("Value is not a function");
          c = P.apply(g, o);
        } else if (e.callee.type === "Identifier") {
          const g = e.callee.name;
          let k;
          if (g in t)
            k = t[g];
          else
            throw new Error(`Undefined variable: ${g}`);
          if (typeof k != "function")
            throw new Error("Value is not a function");
          const P = n !== null ? n : t;
          c = k.apply(P, o);
        } else {
          const g = this.evaluate({ node: e.callee, scope: t, context: n, forceBindingRootScopeToFunctions: i });
          if (typeof g != "function")
            throw new Error("Value is not a function");
          c = g.apply(n, o);
        }
        return this.checkForDangerousValues(c), c;
      case "UnaryExpression":
        const d = this.evaluate({ node: e.argument, scope: t, context: n, forceBindingRootScopeToFunctions: i });
        switch (e.operator) {
          case "!":
            return !d;
          case "-":
            return -d;
          case "+":
            return +d;
          default:
            throw new Error(`Unknown unary operator: ${e.operator}`);
        }
      case "UpdateExpression":
        if (e.argument.type === "Identifier") {
          const g = e.argument.name;
          if (!(g in t))
            throw new Error(`Undefined variable: ${g}`);
          const k = t[g];
          return e.operator === "++" ? t[g] = k + 1 : e.operator === "--" && (t[g] = k - 1), e.prefix ? t[g] : k;
        } else if (e.argument.type === "MemberExpression") {
          const g = this.evaluate({ node: e.argument.object, scope: t, context: n, forceBindingRootScopeToFunctions: i }), k = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : e.argument.property.name;
          if (this.isDOMObject(g))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          this.checkForDangerousKeywords(k);
          const P = g[k];
          return e.operator === "++" ? g[k] = P + 1 : e.operator === "--" && (g[k] = P - 1), e.prefix ? g[k] : P;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const p = this.evaluate({ node: e.left, scope: t, context: n, forceBindingRootScopeToFunctions: i }), m = () => this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: i });
        if (e.operator === "&&")
          return p && m();
        if (e.operator === "||")
          return p || m();
        const E = m();
        switch (e.operator) {
          case "+":
            return p + E;
          case "-":
            return p - E;
          case "*":
            return p * E;
          case "/":
            return p / E;
          case "%":
            return p % E;
          case "==":
            return p == E;
          case "!=":
            return p != E;
          case "===":
            return p === E;
          case "!==":
            return p !== E;
          case "<":
            return p < E;
          case ">":
            return p > E;
          case "<=":
            return p <= E;
          case ">=":
            return p >= E;
          default:
            throw new Error(`Unknown binary operator: ${e.operator}`);
        }
      case "ConditionalExpression":
        return this.evaluate({ node: e.test, scope: t, context: n, forceBindingRootScopeToFunctions: i }) ? this.evaluate({ node: e.consequent, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : this.evaluate({ node: e.alternate, scope: t, context: n, forceBindingRootScopeToFunctions: i });
      case "AssignmentExpression":
        const L = this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: i });
        if (e.left.type === "Identifier")
          return t[e.left.name] = L, L;
        if (e.left.type === "MemberExpression") {
          const g = this.evaluate({ node: e.left.object, scope: t, context: n, forceBindingRootScopeToFunctions: i }), k = e.left.computed ? this.evaluate({ node: e.left.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : e.left.property.name;
          if (this.isDOMObject(g))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          return this.checkForDangerousKeywords(k), g[k] = L, L;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((g) => this.evaluate({ node: g, scope: t, context: n, forceBindingRootScopeToFunctions: i }));
      case "ObjectExpression":
        const v = {};
        for (const g of e.properties) {
          const k = g.computed ? this.evaluate({ node: g.key, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : g.key.type === "Identifier" ? g.key.name : this.evaluate({ node: g.key, scope: t, context: n, forceBindingRootScopeToFunctions: i }), P = this.evaluate({ node: g.value, scope: t, context: n, forceBindingRootScopeToFunctions: i });
          v[k] = P;
        }
        return v;
      default:
        throw new Error(`Unknown node type: ${e.type}`);
    }
  }
  isDOMObject(e) {
    return e instanceof Node || typeof CSSStyleDeclaration < "u" && e instanceof CSSStyleDeclaration || typeof DOMStringMap < "u" && e instanceof DOMStringMap || typeof DOMTokenList < "u" && e instanceof DOMTokenList || typeof NamedNodeMap < "u" && e instanceof NamedNodeMap;
  }
  checkForDangerousKeywords(e) {
    if ([
      "constructor",
      "prototype",
      "__proto__",
      "__defineGetter__",
      "__defineSetter__",
      "insertAdjacentHTML",
      "setAttribute",
      "setAttributeNS",
      "setAttributeNode",
      "setAttributeNodeNS"
    ].includes(e))
      throw new Error(`Accessing "${e}" is prohibited in the CSP build`);
  }
  checkForDangerousValues(e) {
    if (e !== null && !(typeof e != "object" && typeof e != "function") && !Ji.has(e)) {
      if (e instanceof HTMLIFrameElement || e instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if (dr.has(e))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return Ji.set(e, !0), !0;
    }
  }
};
function ur(e) {
  try {
    const n = new el(e).tokenize(), s = new tl(n).parse(), r = new nl();
    return function(a = {}) {
      const { scope: o = {}, context: c = null, forceBindingRootScopeToFunctions: d = !1 } = a;
      return r.evaluate({ node: s, scope: o, context: c, forceBindingRootScopeToFunctions: d });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function il(e, t, n = {}) {
  let i = pr(e), s = Ie([n.scope ?? {}, ...i]), r = n.params ?? [], o = ur(t)({
    scope: s,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && Ne ? o.apply(s, r) : o;
}
function sl(e, t) {
  let n = pr(e);
  if (typeof t == "function")
    return ao(n, t);
  let i = rl(e, t, n);
  return to.bind(null, e, t, i);
}
function pr(e) {
  let t = {};
  return Wt(t, e), [t, ...Xe(e)];
}
function rl(e, t, n) {
  if (e instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (e instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (i = () => {
  }, { scope: s = {}, params: r = [] } = {}) => {
    let a = Ie([s, ...n]), c = ur(t)({
      scope: a,
      forceBindingRootScopeToFunctions: !0
    });
    if (Ne && typeof c == "function") {
      let d = c.apply(c, r);
      d instanceof Promise ? d.then((p) => i(p)) : i(d);
    } else typeof c == "object" && c instanceof Promise ? c.then((d) => i(d)) : i(c);
  };
}
function al(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var mt = Object.assign, ol = Object.prototype.hasOwnProperty, Wn = (e, t) => ol.call(e, t), yt = Array.isArray, pt = (e) => hr(e) === "[object Map]", ll = (e) => typeof e == "string", Et = (e) => typeof e == "symbol", vt = (e) => e !== null && typeof e == "object", cl = Object.prototype.toString, hr = (e) => cl.call(e), fr = (e) => hr(e).slice(8, -1), gi = (e) => ll(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, dl = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, ul = dl((e) => e.charAt(0).toUpperCase() + e.slice(1)), Te = (e, t) => !Object.is(e, t);
function $e(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var R, _n = /* @__PURE__ */ new WeakSet(), Zi = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, _n.has(this) && (_n.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || pl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Xi(this), gr(this);
    const e = R, t = ie;
    R = this, ie = !0;
    try {
      return this.fn();
    } finally {
      R !== this && $e(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), mr(this), R = e, ie = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        vi(e);
      this.deps = this.depsTail = void 0, Xi(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? _n.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Kn(this) && this.run();
  }
  get dirty() {
    return Kn(this);
  }
}, br = 0, ht, ft;
function pl(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = ft, ft = e;
    return;
  }
  e.next = ht, ht = e;
}
function mi() {
  br++;
}
function yi() {
  if (--br > 0)
    return;
  if (ft) {
    let t = ft;
    for (ft = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; ht; ) {
    let t = ht;
    for (ht = void 0; t; ) {
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
function gr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function mr(e) {
  let t, n = e.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), vi(i), fl(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  e.deps = t, e.depsTail = n;
}
function Kn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (hl(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function hl(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Gt) || (e.globalVersion = Gt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Kn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = R, i = ie;
  R = e, ie = !0;
  try {
    gr(e);
    const s = e.fn(e._value);
    (t.version === 0 || Te(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    R = n, ie = i, mr(e), e.flags &= -3;
  }
}
function vi(e, t = !1) {
  const { dep: n, prevSub: i, nextSub: s } = e;
  if (i && (i.nextSub = s, e.prevSub = void 0), s && (s.prevSub = i, e.nextSub = void 0), n.subsHead === e && (n.subsHead = s), n.subs === e && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      vi(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function fl(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function bl(e, t) {
  e.effect instanceof Zi && (e = e.effect.fn);
  const n = new Zi(e);
  t && mt(n, t);
  try {
    n.run();
  } catch (s) {
    throw n.stop(), s;
  }
  const i = n.run.bind(n);
  return i.effect = n, i;
}
function gl(e) {
  e.effect.stop();
}
var ie = !0, yr = [];
function ml() {
  yr.push(ie), ie = !1;
}
function yl() {
  const e = yr.pop();
  ie = e === void 0 ? !0 : e;
}
function Xi(e) {
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
var Gt = 0, vl = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, _l = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!R || !ie || R === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== R)
      t = this.activeLink = new vl(R, this), R.deps ? (t.prevDep = R.depsTail, R.depsTail.nextDep = t, R.depsTail = t) : R.deps = R.depsTail = t, vr(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = R.depsTail, t.nextDep = void 0, R.depsTail.nextDep = t, R.depsTail = t, R.deps === t && (R.deps = n);
    }
    return R.onTrack && R.onTrack(
      mt(
        {
          effect: R
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, Gt++, this.notify(e);
  }
  notify(e) {
    mi();
    try {
      for (let t = this.subsHead; t; t = t.nextSub)
        t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(
          mt(
            {
              effect: t.sub
            },
            e
          )
        );
      for (let t = this.subs; t; t = t.prevSub)
        t.sub.notify() && t.sub.dep.notify();
    } finally {
      yi();
    }
  }
};
function vr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        vr(i);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var zn = /* @__PURE__ */ new WeakMap(), Re = /* @__PURE__ */ Symbol(
  "Object iterate"
), Gn = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), _t = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function Y(e, t, n) {
  if (ie && R) {
    let i = zn.get(e);
    i || zn.set(e, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new _l()), s.map = i, s.key = n), s.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function _e(e, t, n, i, s, r) {
  const a = zn.get(e);
  if (!a) {
    Gt++;
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
  if (mi(), t === "clear")
    a.forEach(o);
  else {
    const c = yt(e), d = c && gi(n);
    if (c && n === "length") {
      const p = Number(i);
      a.forEach((m, E) => {
        (E === "length" || E === _t || !Et(E) && E >= p) && o(m);
      });
    } else
      switch ((n !== void 0 || a.has(void 0)) && o(a.get(n)), d && o(a.get(_t)), t) {
        case "add":
          c ? d && o(a.get("length")) : (o(a.get(Re)), pt(e) && o(a.get(Gn)));
          break;
        case "delete":
          c || (o(a.get(Re)), pt(e) && o(a.get(Gn)));
          break;
        case "set":
          pt(e) && o(a.get(Re));
          break;
      }
  }
  yi();
}
function Ge(e) {
  const t = I(e);
  return t === e ? t : (Y(t, "iterate", _t), Le(e) ? t : t.map(qe));
}
function _i(e) {
  return Y(e = I(e), "iterate", _t), e;
}
function oe(e, t) {
  return De(e) ? Ar(e) ? wt(qe(t)) : wt(t) : qe(t);
}
var wl = {
  __proto__: null,
  [Symbol.iterator]() {
    return wn(this, Symbol.iterator, (e) => oe(this, e));
  },
  concat(...e) {
    return Ge(this).concat(
      ...e.map((t) => yt(t) ? Ge(t) : t)
    );
  },
  entries() {
    return wn(this, "entries", (e) => (e[1] = oe(this, e[1]), e));
  },
  every(e, t) {
    return de(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return de(
      this,
      "filter",
      e,
      t,
      (n) => n.map((i) => oe(this, i)),
      arguments
    );
  },
  find(e, t) {
    return de(
      this,
      "find",
      e,
      t,
      (n) => oe(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return de(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return de(
      this,
      "findLast",
      e,
      t,
      (n) => oe(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return de(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return de(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return xn(this, "includes", e);
  },
  indexOf(...e) {
    return xn(this, "indexOf", e);
  },
  join(e) {
    return Ge(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return xn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return de(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return ot(this, "pop");
  },
  push(...e) {
    return ot(this, "push", e);
  },
  reduce(e, ...t) {
    return Yi(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Yi(this, "reduceRight", e, t);
  },
  shift() {
    return ot(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return de(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return ot(this, "splice", e);
  },
  toReversed() {
    return Ge(this).toReversed();
  },
  toSorted(e) {
    return Ge(this).toSorted(e);
  },
  toSpliced(...e) {
    return Ge(this).toSpliced(...e);
  },
  unshift(...e) {
    return ot(this, "unshift", e);
  },
  values() {
    return wn(this, "values", (e) => oe(this, e));
  }
};
function wn(e, t, n) {
  const i = _i(e), s = i[t]();
  return i !== e && !Le(e) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.done || (r.value = n(r.value)), r;
  }), s;
}
var xl = Array.prototype;
function de(e, t, n, i, s, r) {
  const a = _i(e), o = a !== e && !Le(e), c = a[t];
  if (c !== xl[t]) {
    const m = c.apply(e, r);
    return o ? qe(m) : m;
  }
  let d = n;
  a !== e && (o ? d = function(m, E) {
    return n.call(this, oe(e, m), E, e);
  } : n.length > 2 && (d = function(m, E) {
    return n.call(this, m, E, e);
  }));
  const p = c.call(a, d, i);
  return o && s ? s(p) : p;
}
function Yi(e, t, n, i) {
  const s = _i(e), r = s !== e && !Le(e);
  let a = n, o = !1;
  s !== e && (r ? (o = i.length === 0, a = function(d, p, m) {
    return o && (o = !1, d = oe(e, d)), n.call(this, d, oe(e, p), m, e);
  }) : n.length > 3 && (a = function(d, p, m) {
    return n.call(this, d, p, m, e);
  }));
  const c = s[t](a, ...i);
  return o ? oe(e, c) : c;
}
function xn(e, t, n) {
  const i = I(e);
  Y(i, "iterate", _t);
  const s = i[t](...n);
  return (s === -1 || s === !1) && Dl(n[0]) ? (n[0] = I(n[0]), i[t](...n)) : s;
}
function ot(e, t, n = []) {
  ml(), mi();
  const i = I(e)[t].apply(e, n);
  return yi(), yl(), i;
}
var El = /* @__PURE__ */ al("__proto__,__v_isRef,__isVue"), _r = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Et)
);
function kl(e) {
  Et(e) || (e = String(e));
  const t = I(this);
  return Y(t, "has", e), t.hasOwnProperty(e);
}
var wr = class {
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
      return n === (i ? s ? Pl : kr : s ? Il : Er).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const r = yt(e);
    if (!i) {
      let o;
      if (r && (o = wl[t]))
        return o;
      if (t === "hasOwnProperty")
        return kl;
    }
    const a = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      bt(e) ? e : n
    );
    if ((Et(t) ? _r.has(t) : El(t)) || (i || Y(e, "get", t), s))
      return a;
    if (bt(a)) {
      const o = r && gi(t) ? a : a.value;
      return i && vt(o) ? Vn(o) : o;
    }
    return vt(a) ? i ? Vn(a) : wi(a) : a;
  }
}, Sl = class extends wr {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, i) {
    let s = e[t];
    const r = yt(e) && gi(t);
    if (!this._isShallow) {
      const c = De(s);
      if (!Le(n) && !De(n) && (s = I(s), n = I(n)), !r && bt(s) && !bt(n))
        return c ? ($e(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (s.value = n, !0);
    }
    const a = r ? Number(t) < e.length : Wn(e, t), o = Reflect.set(
      e,
      t,
      n,
      bt(e) ? e : i
    );
    return e === I(i) && o && (a ? Te(n, s) && _e(e, "set", t, n, s) : _e(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = Wn(e, t), i = e[t], s = Reflect.deleteProperty(e, t);
    return s && n && _e(e, "delete", t, void 0, i), s;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!Et(t) || !_r.has(t)) && Y(e, "has", t), n;
  }
  ownKeys(e) {
    return Y(
      e,
      "iterate",
      yt(e) ? "length" : Re
    ), Reflect.ownKeys(e);
  }
}, Al = class extends wr {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, t) {
    return $e(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, t) {
    return $e(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, Ol = /* @__PURE__ */ new Sl(), Tl = /* @__PURE__ */ new Al(), $t = (e) => Reflect.getPrototypeOf(e);
function Ml(e, t, n) {
  return function(...i) {
    const s = this.__v_raw, r = I(s), a = pt(r), o = e === "entries" || e === Symbol.iterator && a, c = e === "keys" && a, d = s[e](...i), p = t ? wt : qe;
    return !t && Y(
      r,
      "iterate",
      c ? Gn : Re
    ), mt(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: m, done: E } = d.next();
          return E ? { value: m, done: E } : {
            value: o ? [p(m[0]), p(m[1])] : p(m),
            done: E
          };
        }
      }
    );
  };
}
function Dt(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      $e(
        `${ul(e)} operation ${n}failed: target is readonly.`,
        I(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Nl(e, t) {
  const n = {
    get(s) {
      const r = this.__v_raw, a = I(r), o = I(s);
      e || (Te(s, o) && Y(a, "get", s), Y(a, "get", o));
      const { has: c } = $t(a), d = e ? wt : qe;
      if (c.call(a, s))
        return d(r.get(s));
      if (c.call(a, o))
        return d(r.get(o));
      r !== a && r.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && Y(I(s), "iterate", Re), s.size;
    },
    has(s) {
      const r = this.__v_raw, a = I(r), o = I(s);
      return e || (Te(s, o) && Y(a, "has", s), Y(a, "has", o)), s === o ? r.has(s) : r.has(s) || r.has(o);
    },
    forEach(s, r) {
      const a = this, o = a.__v_raw, c = I(o), d = e ? wt : qe;
      return !e && Y(c, "iterate", Re), o.forEach((p, m) => s.call(r, d(p), d(m), a));
    }
  };
  return mt(
    n,
    e ? {
      add: Dt("add"),
      set: Dt("set"),
      delete: Dt("delete"),
      clear: Dt("clear")
    } : {
      add(s) {
        const r = I(this), a = $t(r), o = I(s), c = !Le(s) && !De(s) ? o : s;
        return a.has.call(r, c) || Te(s, c) && a.has.call(r, s) || Te(o, c) && a.has.call(r, o) || (r.add(c), _e(r, "add", c, c)), this;
      },
      set(s, r) {
        !Le(r) && !De(r) && (r = I(r));
        const a = I(this), { has: o, get: c } = $t(a);
        let d = o.call(a, s);
        d ? Qi(a, o, s) : (s = I(s), d = o.call(a, s));
        const p = c.call(a, s);
        return a.set(s, r), d ? Te(r, p) && _e(a, "set", s, r, p) : _e(a, "add", s, r), this;
      },
      delete(s) {
        const r = I(this), { has: a, get: o } = $t(r);
        let c = a.call(r, s);
        c ? Qi(r, a, s) : (s = I(s), c = a.call(r, s));
        const d = o ? o.call(r, s) : void 0, p = r.delete(s);
        return c && _e(r, "delete", s, void 0, d), p;
      },
      clear() {
        const s = I(this), r = s.size !== 0, a = pt(s) ? new Map(s) : new Set(s), o = s.clear();
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
    n[s] = Ml(s, e);
  }), n;
}
function xr(e, t) {
  const n = Nl(e);
  return (i, s, r) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? i : Reflect.get(
    Wn(n, s) && s in i ? n : i,
    s,
    r
  );
}
var Cl = {
  get: /* @__PURE__ */ xr(!1)
}, Rl = {
  get: /* @__PURE__ */ xr(!0)
};
function Qi(e, t, n) {
  const i = I(n);
  if (i !== n && t.call(e, i)) {
    const s = fr(e);
    $e(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var Er = /* @__PURE__ */ new WeakMap(), Il = /* @__PURE__ */ new WeakMap(), kr = /* @__PURE__ */ new WeakMap(), Pl = /* @__PURE__ */ new WeakMap();
function $l(e) {
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
function wi(e) {
  return /* @__PURE__ */ De(e) ? e : Sr(
    e,
    !1,
    Ol,
    Cl,
    Er
  );
}
function Vn(e) {
  return Sr(
    e,
    !0,
    Tl,
    Rl,
    kr
  );
}
function Sr(e, t, n, i, s) {
  if (!vt(e))
    return $e(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = s.get(e);
  if (r)
    return r;
  const a = $l(fr(e));
  if (a === 0)
    return e;
  const o = new Proxy(
    e,
    a === 2 ? i : n
  );
  return s.set(e, o), o;
}
function Ar(e) {
  return /* @__PURE__ */ De(e) ? /* @__PURE__ */ Ar(e.__v_raw) : !!(e && e.__v_isReactive);
}
function De(e) {
  return !!(e && e.__v_isReadonly);
}
function Le(e) {
  return !!(e && e.__v_isShallow);
}
function Dl(e) {
  return e ? !!e.__v_raw : !1;
}
function I(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ I(t) : e;
}
var qe = (e) => vt(e) ? /* @__PURE__ */ wi(e) : e, wt = (e) => vt(e) ? /* @__PURE__ */ Vn(e) : e;
function bt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
se("nextTick", () => pi);
se("dispatch", (e) => ut.bind(ut, e));
se("watch", (e, { evaluateLater: t, cleanup: n }) => (i, s) => {
  let r = t(i), o = _s(() => {
    let c;
    return r((d) => c = d), c;
  }, s);
  n(o);
});
se("store", Vo);
se("data", (e) => Ts(e));
se("root", (e) => Qt(e));
se("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Ie(Ll(e))), e._x_refs_proxy));
function Ll(e) {
  let t = [];
  return he(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var En = {};
function Or(e) {
  return En[e] || (En[e] = 0), ++En[e];
}
function ql(e, t) {
  return he(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Ul(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Or(t));
}
se("id", (e, { cleanup: t }) => (n, i = null) => {
  let s = `${n}${i ? `-${i}` : ""}`;
  return jl(e, s, t, () => {
    let r = ql(e, n), a = r ? r._x_ids[n] : Or(n);
    return i ? `${n}-${a}-${i}` : `${n}-${a}`;
  });
});
tn((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function jl(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = i();
  return e._x_id[t] = s, n(() => {
    delete e._x_id[t];
  }), s;
}
se("el", (e) => e);
Tr("Focus", "focus", "focus");
Tr("Persist", "persist", "persist");
function Tr(e, t, n) {
  se(t, (i) => le(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
B("modelable", (e, { expression: t }, { effect: n, evaluateLater: i, cleanup: s }) => {
  let r = i(t), a = () => {
    let p;
    return r((m) => p = m), p;
  }, o = i(`${t} = __placeholder`), c = (p) => o(() => {
  }, { scope: { __placeholder: p } }), d = a();
  c(d), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let p = e._x_model.get, m = e._x_model.setWithModifiers, E = ar(
      {
        get() {
          return p();
        },
        set(N) {
          m(N);
        }
      },
      {
        get() {
          return a();
        },
        set(N) {
          c(N);
        }
      }
    );
    s(E);
  });
});
B("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && le("x-teleport can only be used on a <template> tag", e);
  let s = es(n), r = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = r, r._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    r.addEventListener(o, (c) => {
      c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
    });
  }), xt(r, {}, e);
  let a = (o, c, d) => {
    d.includes("prepend") ? c.parentNode.insertBefore(o, c) : d.includes("append") ? c.parentNode.insertBefore(o, c.nextSibling) : c.appendChild(o);
  };
  j(() => {
    xe(() => {
      a(r, s, t), fe(r);
    })();
  }), e._x_teleportPutBack = () => {
    let o = es(n);
    j(() => {
      a(e._x_teleport, o, t);
    });
  }, i(
    () => j(() => {
      r.remove(), je(r);
    })
  );
});
var Bl = document.createElement("div");
function es(e) {
  let t = xe(() => document.querySelector(e), () => Bl)();
  return t || le(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Mr = () => {
};
Mr.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
B("ignore", Mr);
B("effect", xe((e, { expression: t }, { effect: n }) => {
  n(X(e, t));
}));
function Ze(e, t, n, i) {
  let s = e, r = (c) => i(c), a = {}, o = (c, d) => (p) => d(c, p);
  return n.includes("dot") && (t = Fl(t)), n.includes("camel") && (t = Hl(t)), n.includes("capture") && (a.capture = !0), n.includes("window") && (s = window), n.includes("document") && (s = document), n.includes("passive") && (a.passive = n[n.indexOf("passive") + 1] !== "false"), r = Nr(n, r), n.includes("prevent") && (r = o(r, (c, d) => {
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
    d.target._x_pendingModelUpdates && d.target._x_pendingModelUpdates.forEach((p) => p()), c(d);
  })), (Kl(t) || Cr(t)) && (r = o(r, (c, d) => {
    zl(d, n) || c(d);
  })), s.addEventListener(t, r, a), () => {
    s.removeEventListener(t, r, a);
  };
}
function Nr(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", i = Vt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = sr(t, i);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", i = Vt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = rr(t, i);
  }
  return t;
}
function Fl(e) {
  return e.replace(/-/g, ".");
}
function Hl(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Vt(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Wl(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Kl(e) {
  return ["keydown", "keyup"].includes(e);
}
function Cr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function zl(e, t) {
  let n = t.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(r));
  if (n.includes("debounce")) {
    let r = n.indexOf("debounce");
    n.splice(r, Vt((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let r = n.indexOf("throttle");
    n.splice(r, Vt((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && ts(e.key).includes(n[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => n.includes(r));
  return n = n.filter((r) => !s.includes(r)), !(s.length > 0 && s.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), e[`${a}Key`])).length === s.length && (Cr(e.type) || ts(e.key).includes(n[0])));
}
function ts(e) {
  if (!e)
    return [];
  e = Wl(e);
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
B("model", (e, { modifiers: t, expression: n }, { effect: i, cleanup: s }) => {
  let r = e;
  t.includes("parent") && (r = he(e, (v) => v !== e));
  let a = X(r, n), o;
  typeof n == "string" ? o = X(r, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = X(r, `${n()} = __placeholder`) : o = () => {
  };
  let c = () => {
    let v;
    return a((g) => v = g), ns(v) ? v.get() : v;
  }, d = (v) => {
    let g;
    a((k) => g = k), ns(g) ? g.set(v) : o(() => {
    }, {
      scope: { __placeholder: v }
    });
  };
  typeof n == "string" && e.type === "radio" && j(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let p = t.includes("change") || t.includes("lazy"), m = t.includes("blur"), E = t.includes("enter"), N = p || m || E, L;
  if (we)
    L = () => {
    };
  else if (N) {
    let v = [], g = (k) => d(Lt(e, t, k, c()));
    if (p && v.push(Ze(e, "change", t, g)), m && (v.push(Ze(e, "blur", t, g)), e.form)) {
      let k = e.form, P = () => g({ target: e });
      k._x_pendingModelUpdates || (k._x_pendingModelUpdates = []), k._x_pendingModelUpdates.push(P), s(() => {
        k._x_pendingModelUpdates && k._x_pendingModelUpdates.splice(k._x_pendingModelUpdates.indexOf(P), 1);
      });
    }
    E && v.push(Ze(e, "keydown", t, (k) => {
      k.key === "Enter" && g(k);
    })), L = () => v.forEach((k) => k());
  } else {
    let v = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    L = Ze(e, v, t, (g) => {
      d(Lt(e, t, g, c()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(c()) || zt(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    Lt(e, t, { target: e }, c())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = L, s(() => e._x_removeModelListeners.default()), e.form) {
    let v = Ze(e.form, "reset", [], (g) => {
      pi(() => e._x_model && e._x_model.set(Lt(e, t, { target: e }, c())));
    });
    s(() => v());
  }
  if (e._x_model = {
    get() {
      return c();
    },
    set(v) {
      d(v);
    },
    setWithModifiers: Nr(t, d)
  }, e._x_forceModelUpdate = (v) => {
    v === void 0 && typeof n == "string" && n.match(/\./) && (v = ""), j(() => {
      zt(e) ? Array.isArray(v) ? e.checked = v.some((g) => g == e.value) : e.checked = !!v : bi(e) ? typeof v == "boolean" ? e.checked = jt(e.value) === v : e.checked = e.value == v : tr(e, "value", v);
    });
  }, e.tagName === "SELECT") {
    let v = new MutationObserver(() => {
      e._x_forceModelUpdate(c());
    });
    v.observe(e, { childList: !0 }), s(() => v.disconnect());
  }
  i(() => {
    let v = c();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(v);
  });
});
function Lt(e, t, n, i) {
  return j(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (zt(e))
      if (Array.isArray(i)) {
        let s = null;
        return t.includes("number") ? s = kn(n.target.value) : t.includes("boolean") ? s = jt(n.target.value) : s = n.target.value, n.target.checked ? i.includes(s) ? i : i.concat([s]) : i.filter((r) => !Gl(r, s));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return kn(r);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return jt(r);
        }) : Array.from(n.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return bi(e) ? n.target.checked ? s = n.target.value : s = i : s = n.target.value, t.includes("number") ? kn(s) : t.includes("boolean") ? jt(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function kn(e) {
  let t = e ? parseFloat(e) : null;
  return Vl(t) ? t : e;
}
function Gl(e, t) {
  return e == t;
}
function Vl(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function ns(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
B("cloak", (e) => queueMicrotask(() => j(() => e.removeAttribute(tt("cloak")))));
Js(() => `[${tt("init")}]`);
B("init", xe((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
B("text", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let s = i(t);
  n(() => {
    s((r) => {
      j(() => {
        e.textContent = r;
      });
    });
  });
});
B("html", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let s = i(t);
  n(() => {
    s((r) => {
      j(() => {
        Array.from(e.children).forEach((a) => je(a)), e.innerHTML = r ?? "", e._x_ignoreSelf = !0, fe(e), delete e._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
ci(Us(":", js(tt("bind:"))));
var Rr = (e, { value: t, modifiers: n, expression: i, original: s }, { effect: r, cleanup: a }) => {
  if (!t) {
    let c = {};
    Zo(c), X(e, i)((p) => {
      lr(e, p, s);
    }, { scope: c });
    return;
  }
  if (t === "key")
    return Jl(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = X(e, i);
  r(() => o((c) => {
    c === void 0 && typeof i == "string" && i.match(/\./) && (c = ""), j(() => tr(e, t, c, n));
  })), a(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Rr.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
B("bind", Rr);
function Jl(e, t) {
  e._x_keyExpression = t;
}
Vs(() => `[${tt("data")}]`);
var Oe = /* @__PURE__ */ Symbol();
B("data", (e, { expression: t }, { cleanup: n }) => {
  if (Xl(e))
    return;
  let i = e[Oe];
  if (i?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let s = {};
  Wt(s, e);
  let r = {};
  Yo(r, s);
  let a = Ce(e, t, { scope: r });
  (a === void 0 || a === !0) && (a = {}), Wt(a, e);
  let o;
  if (i?.reactiveData) {
    o = i.reactiveData, Zl(o, a);
    let d = { expression: t };
    e[Oe] = d, queueMicrotask(() => {
      e[Oe] === d && delete e[Oe];
    });
  } else
    o = Qe(a);
  ri(o, n);
  let c = xt(e, o);
  o.init && Ce(e, o.init), n(() => {
    o.destroy && Ce(e, o.destroy), c();
    let d = { reactiveData: o };
    e[Oe] = d, queueMicrotask(() => {
      e[Oe] === d && delete e[Oe];
    });
  });
});
function Zl(e, t) {
  Object.keys(t).forEach((n) => {
    let i = Object.getOwnPropertyDescriptor(t, n), s = Object.getOwnPropertyDescriptor(e, n);
    i.get || i.set || s?.get || s?.set ? (s && delete e[n], s || (e[n] = void 0), i.get || i.set ? Object.defineProperty(e, n, i) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
tn((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Xl(e) {
  return we ? Hn ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
B("show", (e, { modifiers: t, expression: n }, { effect: i }) => {
  let s = X(e, n);
  e._x_doHide || (e._x_doHide = () => {
    j(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    j(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let r = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, a = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, o = () => setTimeout(a), c = Bn(
    (m) => m ? a() : r(),
    (m) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, m, a, r) : m ? o() : r();
    }
  ), d, p = !0;
  i(() => s((m) => {
    !p && m === d || (t.includes("immediate") && (m ? o() : r()), c(m), d = m, p = !1);
  }));
});
B("for", xe((e, { expression: t }, { effect: n, cleanup: i }) => {
  let s = ec(t), r = X(e, s.items), a = X(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => Ql(e, s, r, a), { priority: "structural" }), i(() => {
    e._x_lookup.forEach(
      (o) => j(() => {
        je(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function Yl(e) {
  return (t) => {
    Object.entries(t).forEach(([n, i]) => {
      e[n] = i;
    });
  };
}
function Ql(e, t, n, i) {
  n((s) => {
    nc(s) && (s = Array.from({ length: s }, (d, p) => p + 1)), s == null && (s = []), s instanceof Set && (s = Array.from(s)), s instanceof Map && (s = Array.from(s));
    let r = e._x_lookup, a = /* @__PURE__ */ new Map();
    e._x_lookup = a;
    let o = ic(s), c = Object.entries(s).map(([d, p]) => {
      o || (d = parseInt(d));
      let m = tc(t, p, d, s), E;
      return i((N) => {
        typeof N == "object" && le("x-for key cannot be an object, it must be a string or an integer", e), r.has(N) && (a.set(N, r.get(N)), r.delete(N)), E = N;
      }, { scope: { index: d, ...m } }), [E, m];
    });
    j(() => {
      r.forEach((m) => {
        je(m), m.remove();
      });
      let d = /* @__PURE__ */ new Set(), p = e;
      c.forEach(([m, E]) => {
        if (a.has(m)) {
          let v = a.get(m);
          v._x_refreshXForScope(E), p.nextElementSibling !== v && (p.nextElementSibling && v.replaceWith(p.nextElementSibling), p.after(v)), p = v, v._x_currentIfEl && (v.nextElementSibling !== v._x_currentIfEl && p.after(v._x_currentIfEl), p = v._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && le("x-for templates require a single root element, additional elements will be ignored.", e);
        let N = document.importNode(e.content, !0).firstElementChild, L = Qe(E);
        xt(N, L, e), N._x_refreshXForScope = Yl(L), a.set(m, N), d.add(N), p.after(N), p = N;
      }), d.forEach((m) => fe(m)), p !== e ? e._x_lastRenderedEl = p : delete e._x_lastRenderedEl;
    });
  });
}
function ec(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = e.match(i);
  if (!s)
    return;
  let r = {};
  r.items = s[2].trim();
  let a = s[1].replace(n, "").trim(), o = a.match(t);
  return o ? (r.item = a.replace(t, "").trim(), r.index = o[1].trim(), o[2] && (r.collection = o[2].trim())) : r.item = a, r;
}
function tc(e, t, n, i) {
  let s = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    s[a] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    s[a] = t[a];
  }) : s[e.item] = t, e.index && (s[e.index] = n), e.collection && (s[e.collection] = i), s;
}
function nc(e) {
  return typeof e != "object" && !isNaN(e);
}
function ic(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function Ir() {
}
Ir.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = Qt(e);
  i && (i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]));
};
B("ref", Ir);
B("if", xe((e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && le("x-if can only be used on a <template> tag", e);
  let s = X(e, t), r = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return xt(o, {}, e), j(() => {
      e.after(o), fe(o);
    }), e._x_currentIfEl = o, e._x_lastRenderedEl = o, e._x_undoIf = () => {
      j(() => {
        je(o), o.remove();
      }), delete e._x_currentIfEl, delete e._x_lastRenderedEl;
    }, o;
  }, a = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => s((o) => {
    o ? r() : a();
  }), { priority: "structural" }), i(() => e._x_undoIf && e._x_undoIf());
}));
B("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((s) => Ul(e, s));
});
tn((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
ci(Us("@", js(tt("on:"))));
B("on", xe((e, { value: t, modifiers: n, expression: i }, { cleanup: s }) => {
  let r = i ? X(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let a = Ze(e, t, n, (o) => {
    r(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  s(() => a());
}));
nn("Collapse", "collapse", "collapse");
nn("Intersect", "intersect", "intersect");
nn("Focus", "trap", "focus");
nn("Mask", "mask", "mask");
function nn(e, t, n) {
  B(t, (i) => le(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
B("html", (e, { expression: t }) => {
  ai(new Error("Using the x-html directive is prohibited in the CSP build"), e);
});
nt.setEvaluator(sl);
nt.setRawEvaluator(il);
nt.setReactivityEngine({
  reactive: wi,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = bl(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: gl,
  raw: I
});
var sc = nt, gt = sc;
function rc(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const Jt = "__siteationDebugBarHostLock";
function ac(e) {
  if (!e || window[Jt]) return;
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
  window[Jt] = i;
}
function oc() {
  const e = window[Jt];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[Jt]);
}
function is(e, t) {
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(t.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((a) => a.offsetParent !== null);
  if (n.length === 0) return;
  const i = n[0], s = n[n.length - 1], r = t.getRootNode().activeElement;
  e.shiftKey && r === i ? (e.preventDefault(), s.focus()) : !e.shiftKey && r === s && (e.preventDefault(), i.focus());
}
const Ve = 12;
function lc(e) {
  return !!(e && typeof e == "object" && Number.isFinite(e.left) && Number.isFinite(e.top));
}
function Sn(e, t, n) {
  const i = Math.max(Ve, n.width - t.width - Ve), s = Math.max(Ve, n.height - t.height - Ve);
  return {
    left: Math.min(Math.max(e.left, Ve), i),
    top: Math.min(Math.max(e.top, Ve), s)
  };
}
function cc(e, t, n) {
  return e.top + t.height / 2 < n / 2 ? "top" : "bottom";
}
function dc(e) {
  const t = String(e || "").split(",").map((n) => n.trim()).filter(Boolean);
  return t.length === 0 ? Zt : Zt.filter((n) => uc.includes(n.id) || t.includes(n.id));
}
const uc = ["findings", "overview"], Zt = [
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
    lead: "Follow important work in the order it happened across the request.",
    graded: !1
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
    lead: "Every dispatched event, including the ones nothing is listening to.",
    graded: !1
  },
  {
    id: "cache",
    label: "Cache",
    lead: "Reads and writes grouped by key prefix, with the hit rate for each."
  },
  {
    id: "plugins",
    label: "Plugins",
    lead: "Which interceptors were built for this request, and on what.",
    graded: !1
  },
  {
    id: "alpine",
    label: "Alpine",
    lead: "The components on the page right now, their state, and what has not started.",
    graded: !1
  },
  {
    id: "magewire",
    label: "Magewire",
    lead: "The components on the page right now, their state, and what each update cost.",
    graded: !1
  },
  {
    id: "history",
    label: "History",
    lead: "Every request still on disk, so an earlier one is one click away.",
    graded: !1
  }
];
function Pr(e, t) {
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
    case "magewire":
      return t.magewireComponents.length || null;
    case "history":
      return t.history.length || null;
    default:
      return null;
  }
}
const pc = {
  database: '<path d="M12 2.5c4.14 0 7.5 1.12 7.5 2.5S16.14 7.5 12 7.5 4.5 6.38 4.5 5 7.86 2.5 12 2.5Z"/><path d="M19.5 5v14c0 1.38-3.36 2.5-7.5 2.5S4.5 20.38 4.5 19V5"/><path d="M19.5 12c0 1.38-3.36 2.5-7.5 2.5S4.5 13.38 4.5 12"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 2.5v3M14 2.5v3M10 18.5v3M14 18.5v3M2.5 10h3M2.5 14h3M18.5 10h3M18.5 14h3"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>',
  alert: '<path d="M12 3.5 2.5 20h19L12 3.5Z"/><path d="M12 10v4"/><path d="M12 17.2v.1"/>',
  monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
  minimise: '<path d="M5 12h14"/>',
  expand: '<path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5"/>',
  collapse: '<path d="M9 4v5H4M15 20v-5h5M15 4v5h5M9 20v-5H4"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  star: '<path d="m12 3.5 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17.3 6.7 20.1l1.1-6L3.4 9.9l6-.8L12 3.5Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  caret: '<path d="m6 9 6 6 6-6"/>',
  pulse: '<path d="M3 12h3.5l2.5-6 4 12 2.5-6H21"/>',
  grip: '<circle cx="9" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.5" fill="currentColor" stroke="none"/>'
};
function H(e, t = "") {
  return `<svg class="ndb-icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${pc[e] || ""}</svg>`;
}
function hc(e) {
  return [...fc(e), ...bc(e), ...gc(e)];
}
function fc(e) {
  return Zt.map((t) => {
    const n = Pr(t.id, e);
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
function bc(e) {
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
function gc(e) {
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
      id: "collapse",
      group: "Window",
      label: e.collapsed ? "Show the bar again" : "Collapse the bar to a bubble",
      hint: "",
      keywords: "collapse bubble corner minimise restore show out of the way",
      kind: "collapse",
      arg: ""
    },
    {
      id: "dismiss",
      group: "Window",
      label: "Hide the bar until the next page load",
      hint: "nothing on screen",
      keywords: "hide dismiss close screenshot",
      kind: "dismiss",
      arg: ""
    }
  ];
}
function mc(e, t) {
  const n = String(t || "").trim().toLowerCase(), i = n ? e.filter((s) => `${s.group} ${s.label} ${s.keywords}`.toLowerCase().includes(n)) : e;
  return i.map((s, r) => ({
    ...s,
    leads: r === 0 || i[r - 1].group !== s.group
  }));
}
function yc() {
  return `
<div class="ndb-palette" data-ndb-bind:class="paletteOpen && 'is-open'"
     data-ndb-on:keydown="paletteKeys($event)">
  <div class="ndb-palette-backdrop" data-ndb-on:click="closePalette()"></div>

  <div class="ndb-palette-box" data-ndb-ref="palette"
       role="dialog" aria-modal="true" aria-label="Commands">
    <div class="ndb-palette-field">
      ${H("search")}
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
const Ye = "full", $r = "masked", be = "none", vc = "[redacted]", _c = "[masked]", wc = "[maximum depth reached]", xc = "[circular]", Ec = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, kc = 5, Bt = 100, ss = 400;
function Sc(e) {
  return [Ye, $r, be].includes(e) ? e : Ye;
}
function Ac(e) {
  return Ec.test(String(e));
}
function xi(e, t = Ye) {
  if (t !== be)
    return Ei(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function Xt(e, t = Ye) {
  return t === be ? "" : t === $r ? e === "" ? "" : _c : e.length <= ss ? e : `${e.slice(0, ss)}...`;
}
function Dr(e, t = Ye) {
  if (t === be) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return Xt(n, Ye);
}
function Ei(e, t, n, i) {
  if (e == null) return e;
  const s = typeof e;
  return s === "string" ? Xt(e, t) : s === "number" || s === "boolean" ? e : s === "function" ? `ƒ ${e.name || "anonymous"}()` : s === "symbol" ? e.toString() : s === "bigint" ? `${e}n` : s !== "object" ? s : e instanceof Node ? Mc(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${Xt(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= kc ? wc : i.has(e) ? xc : (i.add(e), Array.isArray(e) ? Oc(e, t, n, i) : Tc(e, t, n, i));
}
function Oc(e, t, n, i) {
  const s = e.slice(0, Bt).map((r) => Ei(r, t, n + 1, i));
  return e.length > Bt && s.push(`[${e.length - Bt} more]`), s;
}
function Tc(e, t, n, i) {
  const s = sn(e), r = /* @__PURE__ */ Object.create(null);
  let a = 0;
  for (const o of s) {
    if (a >= Bt) {
      r.__truncated__ = s.length - a;
      break;
    }
    if (Ac(o)) {
      r[o] = vc, a++;
      continue;
    }
    try {
      r[o] = Ei(e[o], t, n + 1, i);
    } catch (c) {
      r[o] = `[unreadable: ${c && c.message ? c.message : "threw"}]`;
    }
    a++;
  }
  return r;
}
function sn(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function Mc(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
function Nc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var An, rs;
function Cc() {
  if (rs) return An;
  rs = 1;
  function e(l) {
    return l instanceof Map ? l.clear = l.delete = l.set = function() {
      throw new Error("map is read-only");
    } : l instanceof Set && (l.add = l.clear = l.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(l), Object.getOwnPropertyNames(l).forEach((u) => {
      const f = l[u], A = typeof f;
      (A === "object" || A === "function") && !Object.isFrozen(f) && e(f);
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
    const f = /* @__PURE__ */ Object.create(null);
    for (const A in l)
      f[A] = l[A];
    return u.forEach(function(A) {
      for (const q in A)
        f[q] = A[q];
    }), /** @type {T} */
    f;
  }
  const s = "</span>", r = (l) => !!l.scope, a = (l, { prefix: u }) => {
    if (l.startsWith("language:"))
      return l.replace("language:", "language-");
    if (l.includes(".")) {
      const f = l.split(".");
      return [
        `${u}${f.shift()}`,
        ...f.map((A, q) => `${A}${"_".repeat(q + 1)}`)
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
    constructor(u, f) {
      this.buffer = "", this.classPrefix = f.classPrefix, u.walk(this);
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
      const f = a(
        u.scope,
        { prefix: this.classPrefix }
      );
      this.span(f);
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
      const f = c({ scope: u });
      this.add(f), this.stack.push(f);
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
    static _walk(u, f) {
      return typeof f == "string" ? u.addText(f) : f.children && (u.openNode(f), f.children.forEach((A) => this._walk(u, A)), u.closeNode(f)), u;
    }
    /**
     * @param {Node} node
     */
    static _collapse(u) {
      typeof u != "string" && u.children && (u.children.every((f) => typeof f == "string") ? u.children = [u.children.join("")] : u.children.forEach((f) => {
        d._collapse(f);
      }));
    }
  }
  class p extends d {
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
    __addSublanguage(u, f) {
      const A = u.root;
      f && (A.scope = `language:${f}`), this.add(A);
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
  function E(l) {
    return v("(?=", l, ")");
  }
  function N(l) {
    return v("(?:", l, ")*");
  }
  function L(l) {
    return v("(?:", l, ")?");
  }
  function v(...l) {
    return l.map((f) => m(f)).join("");
  }
  function g(l) {
    const u = l[l.length - 1];
    return typeof u == "object" && u.constructor === Object ? (l.splice(l.length - 1, 1), u) : {};
  }
  function k(...l) {
    return "(" + (g(l).capture ? "" : "?:") + l.map((A) => m(A)).join("|") + ")";
  }
  function P(l) {
    return new RegExp(l.toString() + "|").exec("").length - 1;
  }
  function Be(l, u) {
    const f = l && l.exec(u);
    return f && f.index === 0;
  }
  const Fe = new RegExp(k(
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
  function Z(l, { joinWith: u }) {
    let f = 0;
    return l.map((A) => {
      f += 1;
      const q = f;
      let U = m(A), _ = "";
      for (; U.length > 0; ) {
        const y = Fe.exec(U);
        if (!y) {
          _ += U;
          break;
        }
        _ += U.substring(0, y.index), U = U.substring(y.index + y[0].length), y[0][0] === "\\" && y[1] ? _ += "\\" + String(Number(y[1]) + q) : (_ += y[0], (y[0] === "(" || /^\(\?[<']/.test(y[0])) && f++);
      }
      return _;
    }).map((A) => `(${A})`).join(u);
  }
  const Q = /\b\B/, He = "[a-zA-Z]\\w*", ge = "[a-zA-Z_]\\w*", te = "\\b\\d+(\\.\\d+)?", kt = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", St = "\\b(0b[01]+)", on = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", ln = (l = {}) => {
    const u = /^#![ ]*\//;
    return l.binary && (l.begin = v(
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
      "on:begin": (f, A) => {
        f.index !== 0 && A.ignoreMatch();
      }
    }, l);
  }, Ee = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, cn = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [Ee]
  }, At = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [Ee]
  }, dn = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, G = function(l, u, f = {}) {
    const A = i(
      {
        scope: "comment",
        begin: l,
        end: u,
        contains: []
      },
      f
    );
    A.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const q = k(
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
    return A.contains.push(
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
        begin: v(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          q,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), A;
  }, me = G("//", "$"), ke = G("/\\*", "\\*/"), We = G("#", "$"), it = {
    scope: "number",
    begin: te,
    relevance: 0
  }, Ot = {
    scope: "number",
    begin: kt,
    relevance: 0
  }, Wr = {
    scope: "number",
    begin: St,
    relevance: 0
  }, Kr = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      Ee,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Ee]
      }
    ]
  }, zr = {
    scope: "title",
    begin: He,
    relevance: 0
  }, Gr = {
    scope: "title",
    begin: ge,
    relevance: 0
  }, Vr = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + ge,
    relevance: 0
  };
  var Tt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: cn,
    BACKSLASH_ESCAPE: Ee,
    BINARY_NUMBER_MODE: Wr,
    BINARY_NUMBER_RE: St,
    COMMENT: G,
    C_BLOCK_COMMENT_MODE: ke,
    C_LINE_COMMENT_MODE: me,
    C_NUMBER_MODE: Ot,
    C_NUMBER_RE: kt,
    END_SAME_AS_BEGIN: function(l) {
      return Object.assign(
        l,
        {
          /** @type {ModeCallback} */
          "on:begin": (u, f) => {
            f.data._beginMatch = u[1];
          },
          /** @type {ModeCallback} */
          "on:end": (u, f) => {
            f.data._beginMatch !== u[1] && f.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: We,
    IDENT_RE: He,
    MATCH_NOTHING_RE: Q,
    METHOD_GUARD: Vr,
    NUMBER_MODE: it,
    NUMBER_RE: te,
    PHRASAL_WORDS_MODE: dn,
    QUOTE_STRING_MODE: At,
    REGEXP_MODE: Kr,
    RE_STARTERS_RE: on,
    SHEBANG: ln,
    TITLE_MODE: zr,
    UNDERSCORE_IDENT_RE: ge,
    UNDERSCORE_TITLE_MODE: Gr
  });
  function Jr(l, u) {
    l.input[l.index - 1] === "." && u.ignoreMatch();
  }
  function Zr(l, u) {
    l.className !== void 0 && (l.scope = l.className, delete l.className);
  }
  function Xr(l, u) {
    u && l.beginKeywords && (l.begin = "\\b(" + l.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", l.__beforeBegin = Jr, l.keywords = l.keywords || l.beginKeywords, delete l.beginKeywords, l.relevance === void 0 && (l.relevance = 0));
  }
  function Yr(l, u) {
    Array.isArray(l.illegal) && (l.illegal = k(...l.illegal));
  }
  function Qr(l, u) {
    if (l.match) {
      if (l.begin || l.end) throw new Error("begin & end are not supported with match");
      l.begin = l.match, delete l.match;
    }
  }
  function ea(l, u) {
    l.relevance === void 0 && (l.relevance = 1);
  }
  const ta = (l, u) => {
    if (!l.beforeMatch) return;
    if (l.starts) throw new Error("beforeMatch cannot be used with starts");
    const f = Object.assign({}, l);
    Object.keys(l).forEach((A) => {
      delete l[A];
    }), l.keywords = f.keywords, l.begin = v(f.beforeMatch, E(f.begin)), l.starts = {
      relevance: 0,
      contains: [
        Object.assign(f, { endsParent: !0 })
      ]
    }, l.relevance = 0, delete f.beforeMatch;
  }, na = [
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
  ], ia = "keyword";
  function Ti(l, u, f = ia) {
    const A = /* @__PURE__ */ Object.create(null);
    return typeof l == "string" ? q(f, l.split(" ")) : Array.isArray(l) ? q(f, l) : Object.keys(l).forEach(function(U) {
      Object.assign(
        A,
        Ti(l[U], u, U)
      );
    }), A;
    function q(U, _) {
      u && (_ = _.map((y) => y.toLowerCase())), _.forEach(function(y) {
        const S = y.split("|");
        A[S[0]] = [U, sa(S[0], S[1])];
      });
    }
  }
  function sa(l, u) {
    return u ? Number(u) : ra(l) ? 0 : 1;
  }
  function ra(l) {
    return na.includes(l.toLowerCase());
  }
  const Mi = {}, Se = (l) => {
    console.error(l);
  }, Ni = (l, ...u) => {
    console.log(`WARN: ${l}`, ...u);
  }, Ke = (l, u) => {
    Mi[`${l}/${u}`] || (console.log(`Deprecated as of ${l}. ${u}`), Mi[`${l}/${u}`] = !0);
  }, Mt = new Error();
  function Ci(l, u, { key: f }) {
    let A = 0;
    const q = l[f], U = {}, _ = {};
    for (let y = 1; y <= u.length; y++)
      _[y + A] = q[y], U[y + A] = !0, A += P(u[y - 1]);
    l[f] = _, l[f]._emit = U, l[f]._multi = !0;
  }
  function aa(l) {
    if (Array.isArray(l.begin)) {
      if (l.skip || l.excludeBegin || l.returnBegin)
        throw Se("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Mt;
      if (typeof l.beginScope != "object" || l.beginScope === null)
        throw Se("beginScope must be object"), Mt;
      Ci(l, l.begin, { key: "beginScope" }), l.begin = Z(l.begin, { joinWith: "" });
    }
  }
  function oa(l) {
    if (Array.isArray(l.end)) {
      if (l.skip || l.excludeEnd || l.returnEnd)
        throw Se("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Mt;
      if (typeof l.endScope != "object" || l.endScope === null)
        throw Se("endScope must be object"), Mt;
      Ci(l, l.end, { key: "endScope" }), l.end = Z(l.end, { joinWith: "" });
    }
  }
  function la(l) {
    l.scope && typeof l.scope == "object" && l.scope !== null && (l.beginScope = l.scope, delete l.scope);
  }
  function ca(l) {
    la(l), typeof l.beginScope == "string" && (l.beginScope = { _wrap: l.beginScope }), typeof l.endScope == "string" && (l.endScope = { _wrap: l.endScope }), aa(l), oa(l);
  }
  function da(l) {
    function u(_, y) {
      return new RegExp(
        m(_),
        "m" + (l.case_insensitive ? "i" : "") + (l.unicodeRegex ? "u" : "") + (y ? "g" : "")
      );
    }
    class f {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(y, S) {
        S.position = this.position++, this.matchIndexes[this.matchAt] = S, this.regexes.push([S, y]), this.matchAt += P(y) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const y = this.regexes.map((S) => S[1]);
        this.matcherRe = u(Z(y, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(y) {
        this.matcherRe.lastIndex = this.lastIndex;
        const S = this.matcherRe.exec(y);
        if (!S)
          return null;
        const z = S.findIndex((st, pn) => pn > 0 && st !== void 0), F = this.matchIndexes[z];
        return S.splice(0, z), Object.assign(S, F);
      }
    }
    class A {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(y) {
        if (this.multiRegexes[y]) return this.multiRegexes[y];
        const S = new f();
        return this.rules.slice(y).forEach(([z, F]) => S.addRule(z, F)), S.compile(), this.multiRegexes[y] = S, S;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(y, S) {
        this.rules.push([y, S]), S.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(y) {
        const S = this.getMatcher(this.regexIndex);
        S.lastIndex = this.lastIndex;
        let z = S.exec(y);
        if (this.resumingScanAtSamePosition() && !(z && z.index === this.lastIndex)) {
          const F = this.getMatcher(0);
          F.lastIndex = this.lastIndex + 1, z = F.exec(y);
        }
        return z && (this.regexIndex += z.position + 1, this.regexIndex === this.count && this.considerAll()), z;
      }
    }
    function q(_) {
      const y = new A();
      return _.contains.forEach((S) => y.addRule(S.begin, { rule: S, type: "begin" })), _.terminatorEnd && y.addRule(_.terminatorEnd, { type: "end" }), _.illegal && y.addRule(_.illegal, { type: "illegal" }), y;
    }
    function U(_, y) {
      const S = (
        /** @type CompiledMode */
        _
      );
      if (_.isCompiled) return S;
      [
        Zr,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Qr,
        ca,
        ta
      ].forEach((F) => F(_, y)), l.compilerExtensions.forEach((F) => F(_, y)), _.__beforeBegin = null, [
        Xr,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Yr,
        // default to 1 relevance if not specified
        ea
      ].forEach((F) => F(_, y)), _.isCompiled = !0;
      let z = null;
      return typeof _.keywords == "object" && _.keywords.$pattern && (_.keywords = Object.assign({}, _.keywords), z = _.keywords.$pattern, delete _.keywords.$pattern), z = z || /\w+/, _.keywords && (_.keywords = Ti(_.keywords, l.case_insensitive)), S.keywordPatternRe = u(z, !0), y && (_.begin || (_.begin = /\B|\b/), S.beginRe = u(S.begin), !_.end && !_.endsWithParent && (_.end = /\B|\b/), _.end && (S.endRe = u(S.end)), S.terminatorEnd = m(S.end) || "", _.endsWithParent && y.terminatorEnd && (S.terminatorEnd += (_.end ? "|" : "") + y.terminatorEnd)), _.illegal && (S.illegalRe = u(
        /** @type {RegExp | string} */
        _.illegal
      )), _.contains || (_.contains = []), _.contains = [].concat(..._.contains.map(function(F) {
        return ua(F === "self" ? _ : F);
      })), _.contains.forEach(function(F) {
        U(
          /** @type Mode */
          F,
          S
        );
      }), _.starts && U(_.starts, y), S.matcher = q(S), S;
    }
    if (l.compilerExtensions || (l.compilerExtensions = []), l.contains && l.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return l.classNameAliases = i(l.classNameAliases || {}), U(
      /** @type Mode */
      l
    );
  }
  function Ri(l) {
    return l ? l.endsWithParent || Ri(l.starts) : !1;
  }
  function ua(l) {
    return l.variants && !l.cachedVariants && (l.cachedVariants = l.variants.map(function(u) {
      return i(l, { variants: null }, u);
    })), l.cachedVariants ? l.cachedVariants : Ri(l) ? i(l, { starts: l.starts ? i(l.starts) : null }) : Object.isFrozen(l) ? i(l) : l;
  }
  var pa = "11.12.0";
  class ha extends Error {
    constructor(u, f) {
      super(u), this.name = "HTMLInjectionError", this.html = f;
    }
  }
  const un = n, Ii = i, Pi = /* @__PURE__ */ Symbol("nomatch"), fa = 7, $i = function(l) {
    const u = /* @__PURE__ */ Object.create(null), f = /* @__PURE__ */ Object.create(null), A = [];
    let q = !0;
    const U = "Could not find the language '{}', did you forget to load/include a language module?", _ = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let y = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: p
    };
    function S(h) {
      return y.noHighlightRe.test(h);
    }
    function z(h) {
      let x = h.className + " ";
      x += h.parentNode ? h.parentNode.className : "";
      const M = y.languageDetectRe.exec(x);
      if (M) {
        const $ = ye(M[1]);
        return $ || (Ni(U.replace("{}", M[1])), Ni("Falling back to no-highlight mode for this block.", h)), $ ? M[1] : "no-highlight";
      }
      return x.split(/\s+/).find(($) => S($) || ye($));
    }
    function F(h, x, M) {
      let $ = "", W = "";
      typeof x == "object" ? ($ = h, M = x.ignoreIllegals, W = x.language) : (Ke("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ke("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), W = h, $ = x), M === void 0 && (M = !0);
      const ne = {
        code: $,
        language: W
      };
      Ct("before:highlight", ne);
      const ve = ne.result ? ne.result : st(ne.language, ne.code, M);
      return ve.code = ne.code, Ct("after:highlight", ve), ve;
    }
    function st(h, x, M, $) {
      const W = /* @__PURE__ */ Object.create(null);
      function ne(b, w) {
        return b.keywords[w];
      }
      function ve() {
        if (!O.keywords) {
          V.addText(D);
          return;
        }
        let b = 0;
        O.keywordPatternRe.lastIndex = 0;
        let w = O.keywordPatternRe.exec(D), T = "";
        for (; w; ) {
          T += D.substring(b, w.index);
          const C = ae.case_insensitive ? w[0].toLowerCase() : w[0], J = ne(O, C);
          if (J) {
            const [ce, Ca] = J;
            if (V.addText(T), T = "", W[C] = (W[C] || 0) + 1, W[C] <= fa && (Pt += Ca), ce.startsWith("_"))
              T += w[0];
            else {
              const Ra = ae.classNameAliases[ce] || ce;
              re(w[0], Ra);
            }
          } else
            T += w[0];
          b = O.keywordPatternRe.lastIndex, w = O.keywordPatternRe.exec(D);
        }
        T += D.substring(b), V.addText(T);
      }
      function Rt() {
        if (D === "") return;
        let b = null;
        if (typeof O.subLanguage == "string") {
          if (!u[O.subLanguage]) {
            V.addText(D);
            return;
          }
          b = st(O.subLanguage, D, !0, Hi[O.subLanguage]), Hi[O.subLanguage] = /** @type {CompiledMode} */
          b._top;
        } else
          b = hn(D, O.subLanguage.length ? O.subLanguage : null);
        O.relevance > 0 && (Pt += b.relevance), V.__addSublanguage(b._emitter, b.language);
      }
      function ee() {
        O.subLanguage != null ? Rt() : ve(), D = "";
      }
      function re(b, w) {
        b !== "" && (V.startScope(w), V.addText(b), V.endScope());
      }
      function Ui(b, w) {
        let T = 1;
        const C = w.length - 1;
        for (; T <= C; ) {
          if (!b._emit[T]) {
            T++;
            continue;
          }
          const J = ae.classNameAliases[b[T]] || b[T], ce = w[T];
          J ? re(ce, J) : (D = ce, ve(), D = ""), T++;
        }
      }
      function ji(b, w) {
        return b.scope && typeof b.scope == "string" && V.openNode(ae.classNameAliases[b.scope] || b.scope), b.beginScope && (b.beginScope._wrap ? (re(D, ae.classNameAliases[b.beginScope._wrap] || b.beginScope._wrap), D = "") : b.beginScope._multi && (Ui(b.beginScope, w), D = "")), O = Object.create(b, { parent: { value: O } }), O;
      }
      function Bi(b, w, T) {
        let C = Be(b.endRe, T);
        if (C) {
          if (b["on:end"]) {
            const J = new t(b);
            b["on:end"](w, J), J.isMatchIgnored && (C = !1);
          }
          if (C) {
            for (; b.endsParent && b.parent; )
              b = b.parent;
            return b;
          }
        }
        if (b.endsWithParent)
          return Bi(b.parent, w, T);
      }
      function Aa(b) {
        return O.matcher.regexIndex === 0 ? (D += b[0], 1) : (mn = !0, 0);
      }
      function Oa(b) {
        const w = b[0], T = b.rule, C = new t(T), J = [T.__beforeBegin, T["on:begin"]];
        for (const ce of J)
          if (ce && (ce(b, C), C.isMatchIgnored))
            return Aa(w);
        return T.skip ? D += w : (T.excludeBegin && (D += w), ee(), !T.returnBegin && !T.excludeBegin && (D = w)), ji(T, b), T.returnBegin ? 0 : w.length;
      }
      function Ta(b) {
        const w = b[0], T = x.substring(b.index), C = Bi(O, b, T);
        if (!C)
          return Pi;
        const J = O;
        O.endScope && O.endScope._wrap ? (ee(), re(w, O.endScope._wrap)) : O.endScope && O.endScope._multi ? (ee(), Ui(O.endScope, b)) : J.skip ? D += w : (J.returnEnd || J.excludeEnd || (D += w), ee(), J.excludeEnd && (D = w));
        do
          O.scope && V.closeNode(), !O.skip && !O.subLanguage && (Pt += O.relevance), O = O.parent;
        while (O !== C.parent);
        return C.starts && ji(C.starts, b), J.returnEnd ? 0 : w.length;
      }
      function Ma() {
        const b = [];
        for (let w = O; w !== ae; w = w.parent)
          w.scope && b.unshift(w.scope);
        b.forEach((w) => V.openNode(w));
      }
      let It = {};
      function Fi(b, w) {
        const T = w && w[0];
        if (D += b, T == null)
          return ee(), 0;
        if (It.type === "begin" && w.type === "end" && It.index === w.index && T === "") {
          if (D += x.slice(w.index, w.index + 1), !q) {
            const C = new Error(`0 width match regex (${h})`);
            throw C.languageName = h, C.badRule = It.rule, C;
          }
          return 1;
        }
        if (It = w, w.type === "begin")
          return Oa(w);
        if (w.type === "illegal" && !M) {
          const C = new Error('Illegal lexeme "' + T + '" for mode "' + (O.scope || "<unnamed>") + '"');
          throw C.mode = O, C;
        } else if (w.type === "end") {
          const C = Ta(w);
          if (C !== Pi)
            return C;
        }
        if (w.type === "illegal" && T === "")
          return w.index === x.length || (D += `
`), 1;
        if (gn > 1e5 && gn > w.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return D += T, T.length;
      }
      const ae = ye(h);
      if (!ae)
        throw Se(U.replace("{}", h)), new Error('Unknown language: "' + h + '"');
      const Na = da(ae);
      let bn = "", O = $ || Na;
      const Hi = {}, V = new y.__emitter(y);
      Ma();
      let D = "", Pt = 0, Ae = 0, gn = 0, mn = !1;
      try {
        if (ae.__emitTokens)
          ae.__emitTokens(x, V);
        else {
          for (O.matcher.considerAll(); ; ) {
            gn++, mn ? mn = !1 : O.matcher.considerAll(), O.matcher.lastIndex = Ae;
            const b = O.matcher.exec(x);
            if (!b) break;
            const w = x.substring(Ae, b.index), T = Fi(w, b);
            Ae = b.index + T;
          }
          Fi(x.substring(Ae));
        }
        return V.finalize(), bn = V.toHTML(), {
          language: h,
          value: bn,
          relevance: Pt,
          illegal: !1,
          _emitter: V,
          _top: O
        };
      } catch (b) {
        if (b.message && b.message.includes("Illegal"))
          return {
            language: h,
            value: un(x),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: b.message,
              index: Ae,
              context: x.slice(Ae - 100, Ae + 100),
              mode: b.mode,
              resultSoFar: bn
            },
            _emitter: V
          };
        if (q)
          return {
            language: h,
            value: un(x),
            illegal: !1,
            relevance: 0,
            errorRaised: b,
            _emitter: V,
            _top: O
          };
        throw b;
      }
    }
    function pn(h) {
      const x = {
        value: un(h),
        illegal: !1,
        relevance: 0,
        _top: _,
        _emitter: new y.__emitter(y)
      };
      return x._emitter.addText(h), x;
    }
    function hn(h, x) {
      x = x || y.languages || Object.keys(u);
      const M = pn(h), $ = x.filter(ye).filter(qi).map(
        (ee) => st(ee, h, !1)
      );
      $.unshift(M);
      const W = $.sort((ee, re) => {
        if (ee.relevance !== re.relevance) return re.relevance - ee.relevance;
        if (ee.language && re.language) {
          if (ye(ee.language).supersetOf === re.language)
            return 1;
          if (ye(re.language).supersetOf === ee.language)
            return -1;
        }
        return 0;
      }), [ne, ve] = W, Rt = ne;
      return Rt.secondBest = ve, Rt;
    }
    function ba(h, x, M) {
      const $ = x && f[x] || M;
      h.classList.add("hljs"), h.classList.add(`language-${$}`);
    }
    function fn(h) {
      let x = null;
      const M = z(h);
      if (S(M)) return;
      if (Ct(
        "before:highlightElement",
        { el: h, language: M }
      ), h.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", h);
        return;
      }
      if (h.children.length > 0 && (y.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(h)), y.throwUnescapedHTML))
        throw new ha(
          "One of your code blocks includes unescaped HTML.",
          h.innerHTML
        );
      x = h;
      const $ = x.textContent, W = M ? F($, { language: M, ignoreIllegals: !0 }) : hn($);
      h.innerHTML = W.value, h.dataset.highlighted = "yes", ba(h, M, W.language), h.result = {
        language: W.language,
        // TODO: remove with version 11.0
        re: W.relevance,
        relevance: W.relevance
      }, W.secondBest && (h.secondBest = {
        language: W.secondBest.language,
        relevance: W.secondBest.relevance
      }), Ct("after:highlightElement", { el: h, result: W, text: $ });
    }
    function ga(h) {
      y = Ii(y, h);
    }
    const ma = () => {
      Nt(), Ke("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function ya() {
      Nt(), Ke("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Di = !1;
    function Nt() {
      function h() {
        Nt();
      }
      if (document.readyState === "loading") {
        Di || window.addEventListener("DOMContentLoaded", h, !1), Di = !0;
        return;
      }
      document.querySelectorAll(y.cssSelector).forEach(fn);
    }
    function va(h, x) {
      let M = null;
      try {
        M = x(l);
      } catch ($) {
        if (Se("Language definition for '{}' could not be registered.".replace("{}", h)), q)
          Se($);
        else
          throw $;
        M = _;
      }
      M.name || (M.name = h), u[h] = M, M.rawDefinition = x.bind(null, l), M.aliases && Li(M.aliases, { languageName: h });
    }
    function _a(h) {
      delete u[h];
      for (const x of Object.keys(f))
        f[x] === h && delete f[x];
    }
    function wa() {
      return Object.keys(u);
    }
    function ye(h) {
      return h = (h || "").toLowerCase(), u[h] || u[f[h]];
    }
    function Li(h, { languageName: x }) {
      typeof h == "string" && (h = [h]), h.forEach((M) => {
        f[M.toLowerCase()] = x;
      });
    }
    function qi(h) {
      const x = ye(h);
      return x && !x.disableAutodetect;
    }
    function xa(h) {
      h["before:highlightBlock"] && !h["before:highlightElement"] && (h["before:highlightElement"] = (x) => {
        h["before:highlightBlock"](
          Object.assign({ block: x.el }, x)
        );
      }), h["after:highlightBlock"] && !h["after:highlightElement"] && (h["after:highlightElement"] = (x) => {
        h["after:highlightBlock"](
          Object.assign({ block: x.el }, x)
        );
      });
    }
    function Ea(h) {
      xa(h), A.push(h);
    }
    function ka(h) {
      const x = A.indexOf(h);
      x !== -1 && A.splice(x, 1);
    }
    function Ct(h, x) {
      const M = h;
      A.forEach(function($) {
        $[M] && $[M](x);
      });
    }
    function Sa(h) {
      return Ke("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ke("10.7.0", "Please use highlightElement now."), fn(h);
    }
    Object.assign(l, {
      highlight: F,
      highlightAuto: hn,
      highlightAll: Nt,
      highlightElement: fn,
      // TODO: Remove with v12 API
      highlightBlock: Sa,
      configure: ga,
      initHighlighting: ma,
      initHighlightingOnLoad: ya,
      registerLanguage: va,
      unregisterLanguage: _a,
      listLanguages: wa,
      getLanguage: ye,
      registerAliases: Li,
      autoDetection: qi,
      inherit: Ii,
      addPlugin: Ea,
      removePlugin: ka
    }), l.debugMode = function() {
      q = !1;
    }, l.safeMode = function() {
      q = !0;
    }, l.versionString = pa, l.regex = {
      concat: v,
      lookahead: E,
      either: k,
      optional: L,
      anyNumberOfTimes: N
    };
    for (const h in Tt)
      typeof Tt[h] == "object" && e(Tt[h]);
    return Object.assign(l, Tt), l;
  }, ze = $i({});
  return ze.newInstance = () => $i({}), An = ze, ze.HighlightJS = ze, ze.default = ze, An;
}
var Rc = /* @__PURE__ */ Cc();
const rn = /* @__PURE__ */ Nc(Rc), as = "[A-Za-z$_][0-9A-Za-z$_]*", Ic = [
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
], Pc = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], Lr = [
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
], qr = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], Ur = [
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
], $c = [
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
], Dc = [].concat(
  Ur,
  Lr,
  qr
);
function Lc(e) {
  const t = e.regex, n = (G, { after: me }) => {
    const ke = "</" + G[0].slice(1);
    return G.input.indexOf(ke, me) !== -1;
  }, i = as, s = {
    begin: "<>",
    end: "</>"
  }, r = /<[A-Za-z0-9\\._:-]+\s*\/>/, a = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (G, me) => {
      const ke = G[0].length + G.index, We = G.input[ke];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        We === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        We === ","
      ) {
        me.ignoreMatch();
        return;
      }
      We === ">" && (n(G, { after: ke }) || me.ignoreMatch());
      let it;
      const Ot = G.input.substring(ke);
      if (it = Ot.match(/^\s*=/)) {
        me.ignoreMatch();
        return;
      }
      if ((it = Ot.match(/^\s+extends\s+/)) && it.index === 0) {
        me.ignoreMatch();
        return;
      }
    }
  }, o = {
    $pattern: as,
    keyword: Ic,
    literal: Pc,
    built_in: Dc,
    "variable.language": $c
  }, c = "[0-9](_?[0-9])*", d = `\\.(${c})`, p = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", m = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${p})((${d})|\\.)?|(${d}))[eE][+-]?(${c})\\b` },
      { begin: `\\b(${p})\\b((${d})\\b|\\.)?|(${d})\\b` },
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
  }, E = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: o,
    contains: []
    // defined later
  }, N = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        E
      ],
      subLanguage: "xml"
    }
  }, L = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        E
      ],
      subLanguage: "css"
    }
  }, v = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        E
      ],
      subLanguage: "graphql"
    }
  }, g = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      e.BACKSLASH_ESCAPE,
      E
    ]
  }, P = {
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
  }, Be = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    N,
    L,
    v,
    g,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    m
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  E.contains = Be.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: o,
    contains: [
      "self"
    ].concat(Be)
  });
  const Fe = [].concat(P, E.contains), Z = Fe.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: o,
      contains: ["self"].concat(Fe)
    }
  ]), Q = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: o,
    contains: Z
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
  }, ge = {
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
        ...Lr,
        ...qr
      ]
    }
  }, te = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, kt = {
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
    contains: [Q],
    illegal: /%/
  }, St = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function on(G) {
    return t.concat("(?!", G.join("|"), ")");
  }
  const ln = {
    match: t.concat(
      /\b/,
      on([
        ...Ur,
        "super",
        "import",
        "await"
      ].map((G) => `${G}\\s*\\(`)),
      i,
      t.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, Ee = {
    begin: t.concat(/\./, t.lookahead(
      t.concat(i, /(?![0-9A-Za-z$_(])/)
    )),
    end: i,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, cn = {
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
      Q
    ]
  }, At = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", dn = {
    match: [
      /const|var|let/,
      /\s+/,
      i,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      t.lookahead(At)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      Q
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: o,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: Z, CLASS_REFERENCE: ge },
    illegal: /#(?![$_A-Za-z])/,
    contains: [
      e.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      te,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      N,
      L,
      v,
      g,
      P,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      m,
      ge,
      {
        scope: "attr",
        match: i + t.lookahead(":"),
        relevance: 0
      },
      dn,
      {
        // "value" container
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          P,
          e.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: At,
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
                    contains: Z
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
      kt,
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
          Q,
          e.inherit(e.TITLE_MODE, { begin: i, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      Ee,
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
        contains: [Q]
      },
      ln,
      St,
      He,
      cn,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const qc = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity", Uc = {
  scope: "number",
  match: qc,
  relevance: 0
};
function jc(e) {
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
      Uc,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function Bc(e) {
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
  ], p = [
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
  ], E = [
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
  ], N = p, L = [
    ...d,
    ...c
  ].filter((Z) => !p.includes(Z)), v = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  }, g = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  }, k = {
    match: t.concat(/\b/, t.either(...N), /\s*\(/),
    relevance: 0,
    keywords: { built_in: N }
  };
  function P(Z) {
    return t.concat(
      /\b/,
      t.either(...Z.map((Q) => Q.replace(/\s+/, "\\s+"))),
      /\b/
    );
  }
  const Be = {
    scope: "keyword",
    match: P(E),
    relevance: 0
  };
  function Fe(Z, {
    exceptions: Q,
    when: He
  } = {}) {
    const ge = He;
    return Q = Q || [], Z.map((te) => te.match(/\|\d+$/) || Q.includes(te) ? te : ge(te) ? `${te}|0` : te);
  }
  return {
    name: "SQL",
    case_insensitive: !0,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: Fe(L, { when: (Z) => Z.length < 3 }),
      literal: r,
      type: o,
      built_in: m
    },
    contains: [
      {
        scope: "type",
        match: P(a)
      },
      Be,
      k,
      v,
      i,
      s,
      e.C_NUMBER_MODE,
      e.C_BLOCK_COMMENT_MODE,
      n,
      g
    ]
  };
}
rn.registerLanguage("javascript", Lc);
rn.registerLanguage("json", jc);
rn.registerLanguage("sql", Bc);
const qt = /* @__PURE__ */ new Map(), Fc = 400, Hc = 2e4;
function os(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Wc(e, t) {
  const n = String(e ?? "");
  if (n === "") return "";
  if (n.length > Hc) return os(n);
  const i = `${t}:${n}`, s = qt.get(i);
  if (s !== void 0) return s;
  let r;
  try {
    r = rn.highlight(n, { language: t, ignoreIllegals: !0 }).value;
  } catch {
    r = os(n);
  }
  return qt.size >= Fc && qt.clear(), qt.set(i, r), r;
}
async function Jn(e) {
  const t = await fetch(e, { headers: { Accept: "application/json" } }), n = await t.json().catch(() => null);
  if (!t.ok) throw new Error(n && n.error || `HTTP ${t.status}`);
  if (n === null) throw new Error("The response was not JSON.");
  return n;
}
async function ls(e) {
  const t = await Jn(e), n = {};
  return Object.entries(t.sections || {}).forEach(([i, s]) => {
    n[i] = s.payload || {};
  }), { profile: t, payloads: n };
}
function ki(e, t = 0) {
  return Number(e || 0).toFixed(t);
}
function Si(e) {
  const t = Number(e || 0);
  return t < 1024 ? `${t} B` : t < 1048576 ? `${(t / 1024).toFixed(1)} kB` : `${(t / 1048576).toFixed(1)} MB`;
}
function Kc(e, t, n) {
  return `${e} ${Number(e) === 1 ? t : n}`;
}
function zc(e, t = Date.now() / 1e3) {
  const n = Math.max(0, t - Number(e || 0));
  return n < 60 ? `${Math.round(n)}s ago` : n < 3600 ? `${Math.round(n / 60)}m ago` : `${Math.round(n / 3600)}h ago`;
}
function Gc(e, t) {
  let n = e;
  try {
    n = new URL(e, t).pathname;
  } catch {
    return e;
  }
  if (n.length <= 42) return n;
  const i = n.split("/").filter(Boolean);
  return i.length > 2 ? `…/${i.slice(-2).join("/")}` : n;
}
function Vc(e) {
  const t = e && e.magewire;
  return t && t.component ? `${t.component} ${t.action || ""}`.trim() : e && e.path || "/";
}
function Jc(e) {
  if (!e || e.delta === null || e.delta === void 0) return "not comparable";
  if (e.delta === 0) return "no change";
  const t = e.delta > 0 ? "+" : "-", n = e.unit === "B" ? Si(Math.abs(e.delta)) : `${ki(Math.abs(e.delta), e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
  return `${t}${n}`;
}
function Zc(e, t) {
  const n = e[t];
  return n == null ? "none" : e.unit === "B" ? Si(n) : `${ki(n, e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
}
function Xc(e) {
  return Object.entries(e.methods || {}).map(([t, n]) => `${n} ${t}`).join(", ");
}
function jr(e, t, n, i) {
  if (!e || !n || !/^[a-z][a-z0-9+.-]*:\/\//i.test(e) || /^(javascript|data|vbscript):/i.test(e))
    return "";
  const s = n.startsWith("/") ? n : `${t}/${n}`;
  return e.replace("%f", () => encodeURI(s)).replace("%l", () => String(i || 1));
}
function Yc(e, t, n) {
  const i = String(n || "").match(/^(.+\.php):(\d+)$/);
  return i ? jr(e, t, i[1], Number(i[2])) : "";
}
const Zn = /* @__PURE__ */ new Map(), Ut = /* @__PURE__ */ new Map();
function Ai() {
  const e = window.Magewire || window.magewire;
  return e && typeof e == "object" ? e : null;
}
function Oi() {
  const e = Ai();
  try {
    return Object.values(e?.components?.componentsById ?? {});
  } catch {
    return [];
  }
}
function Qc(e) {
  try {
    return JSON.stringify(e ?? {}).length;
  } catch {
    return 0;
  }
}
function ed(e) {
  return Zn.clear(), Oi().map((t) => {
    const n = t.fingerprint ?? {}, i = t.serverMemo ?? {}, s = String(n.id ?? "");
    return t.el && Zn.set(s, t.el), {
      id: s,
      name: String(n.name ?? "unknown"),
      resolver: String(n.resolver ?? "unknown"),
      handle: String(n.handle ?? ""),
      keys: e === be ? 0 : sn(i.data ?? {}).length,
      memo_bytes: Qc(i),
      listeners: (t.effects?.listeners ?? []).length,
      children: Object.keys(i.children ?? {}).length,
      path: t.el ? td(t.el) : ""
    };
  });
}
function td(e) {
  const t = e.tagName ? e.tagName.toLowerCase() : "?";
  return e.id ? `${t}#${e.id}` : t;
}
function cs(e, t) {
  if (t === be)
    return "The value policy is set to none, so component state is not read.";
  const n = Oi().find((i) => String(i.fingerprint?.id) === String(e));
  if (!n) return "This component is no longer on the page.";
  try {
    return JSON.stringify(xi(n.serverMemo?.data ?? {}, t), null, 2);
  } catch (i) {
    return `Could not read this component: ${i && i.message ? i.message : "threw"}`;
  }
}
function nd() {
  return {
    present: Ai() !== null,
    components: Oi().length,
    // Already the route, not the base: Magewire publishes it as /magewire/post and the
    // client appends the action itself.
    endpoint: String(window.livewire_app_url || "")
  };
}
function ds(e) {
  const t = Ai();
  if (!t || typeof t.hook != "function") return !1;
  const n = /* @__PURE__ */ new Map(), i = (r) => String(r?.fingerprint?.name ?? "unknown"), s = (r) => String(r?.component?.fingerprint?.id ?? "");
  try {
    t.hook("message.sent", (r, a) => {
      n.set(s(r), { at: performance.now(), name: i(a) });
    }), t.hook("message.processed", (r, a) => {
      const o = n.get(s(r));
      n.delete(s(r)), e({
        component: i(a),
        action: us(r),
        duration_ms: o ? Math.round((performance.now() - o.at) * 10) / 10 : null,
        failed: !1
      });
    }), t.hook("message.failed", (r, a) => {
      n.delete(s(r)), e({
        component: i(a),
        action: us(r),
        duration_ms: null,
        failed: !0
      });
    });
  } catch {
    return !1;
  }
  return !0;
}
function us(e) {
  const t = (e?.updateQueue ?? [])[0];
  if (!t) return "refresh";
  const n = t.payload ?? {}, i = (...s) => s.map((r) => n[r] ?? t[r]).find(Boolean) ?? "unknown";
  return t.type === "callMethod" ? `${i("method")}()` : t.type === "syncInput" ? `set ${i("name")}` : t.type === "fireEvent" ? `on ${i("event")}` : String(t.type || "update");
}
function id(e, t) {
  const n = Zn.get(String(e));
  if (!n || !n.style) return;
  if (t) {
    Ut.has(String(e)) || Ut.set(String(e), {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  const i = Ut.get(String(e));
  i && (n.style.outline = i.outline, n.style.outlineOffset = i.offset, Ut.delete(String(e)));
}
const On = /* @__PURE__ */ new WeakMap(), Yt = /* @__PURE__ */ new Map(), lt = /* @__PURE__ */ new Map();
let ps = 0;
function an() {
  const e = Mn || window.Alpine;
  return !e || typeof e != "object" || e === gt ? null : e;
}
function Br(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function Xn(e) {
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
function sd(e) {
  if (typeof e.evaluate != "function") return null;
  const t = Xn(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function hs() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function rd(e) {
  if (typeof e.injectMagics == "function") {
    const t = Xn(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = Xn(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function ad(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function od(e) {
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
function ld(e) {
  return On.has(e) || (ps += 1, On.set(e, ps)), On.get(e);
}
function Fr(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function cd(e) {
  const t = an();
  if (Yt.clear(), !t) return [];
  const n = Br(t), i = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((r) => {
    const a = ld(r), o = (r.getAttribute(n) || "").trim(), c = (r.getAttribute(i) || "").trim(), d = Fr(t, r);
    return Yt.set(a, r), {
      id: a,
      name: ad(o),
      expression: Dr(o, e),
      path: od(r),
      initialised: !!r._x_dataStack,
      deferred: r.hasAttribute(i),
      strategy: c || "none",
      keys: e === be || !d ? 0 : sn(d).length
    };
  });
}
function fs(e, t) {
  if (t === be)
    return "The value policy is set to none, so component state is not read.";
  const n = an(), i = Yt.get(e);
  if (!n || !i) return "This component is no longer on the page.";
  if (!i._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const s = Fr(n, i);
  if (!s) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(xi(s, t), null, 2);
  } catch (r) {
    return `Could not read this component: ${r && r.message ? r.message : "threw"}`;
  }
}
function dd(e) {
  const t = an();
  if (!t) return [];
  const n = rd(t);
  return n ? Object.keys(n).map((i) => {
    let s = n[i], r = 0;
    if (r = s && typeof s == "object" ? sn(s).length : 0, e === be)
      return { name: i, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      s = JSON.stringify(xi(s, e), null, 2);
    } catch (a) {
      s = `Could not read this store: ${a && a.message ? a.message : "threw"}`;
    }
    return { name: i, keys: r, value: s };
  }) : [];
}
function ud(e) {
  const t = window.__siteationDebugBar;
  return !t || !Array.isArray(t.alpineErrors) ? [] : t.alpineErrors.map((n) => {
    const i = String(n.message || ""), s = i.match(/Expression: "([\s\S]*?)"/);
    return {
      // An expression that threw is still a server rendered expression, and a message that
      // names the value it choked on is still that value. The rest of this section applies
      // the policy to exactly these two things; this was the one reader that did not.
      message: Xt(i.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""), e),
      expression: s ? Dr(s[1], e) : "",
      element: String(n.element || ""),
      during_init: !!n.during_init
    };
  });
}
function pd() {
  const e = an();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: sd(e),
    source: hs(),
    prefix: Br(e)
  } : { present: !1, version: "", csp: null, source: hs(), prefix: "" };
}
function hd(e, t) {
  const n = Yt.get(e);
  if (!n || !n.style) return;
  if (t) {
    lt.has(e) || lt.set(e, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  if (!lt.has(e)) return;
  const i = lt.get(e);
  n.style.outline = i.outline, n.style.outlineOffset = i.offset, lt.delete(e);
}
const fd = 1e3, Hr = "siteation.debugbar.v1", bd = "__PROFILE_ID__";
function gd() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function md() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(Hr) || "{}") };
  } catch {
    return e;
  }
}
function Je(e, t, n) {
  const i = t.trim().toLowerCase();
  return i ? e.filter((s) => n.some(
    (r) => String(s[r] ?? "").toLowerCase().includes(i)
  )) : e;
}
function yd() {
  return {
    profile: {},
    open: !1,
    section: "findings",
    placement: "bottom",
    dockPosition: null,
    dockDrag: null,
    draggingDock: !1,
    maximised: !1,
    theme: "system",
    resolvedTheme: "dark",
    stopWatchingScheme: null,
    favourites: [],
    draggingId: null,
    dropTargetId: null,
    navOpen: !1,
    // Out of the way, not gone: the bubble is still on the page, so this is a preference
    // and survives navigation.
    collapsed: !1,
    // Deliberately not persisted. Nothing is left on screen to bring the bar back, and the
    // only way back is a reload, which reprofiles the page and throws away the request
    // being looked at.
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
    magewireTab: "components",
    magewireHealth: { present: !1, components: 0, endpoint: "" },
    /** @type {Array<object>} */
    magewireComponents: [],
    /** @type {Array<object>} */
    magewireMessages: [],
    /** @type {Array<string>} */
    magewireExpanded: [],
    /** @type {Record<string, string>} */
    magewireStates: {},
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
    editorTemplate: "",
    editorRoot: "",
    activeId: null,
    pageProfile: {},
    init() {
      this.profile = gd(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const e = md();
      this.collapsed = !!e.collapsed, this.open = e.open && !this.collapsed, this.section = e.section, this.placement = e.placement === "top" ? "top" : "bottom", this.dockPosition = lc(e.dockPosition) ? e.dockPosition : null, this.maximised = !!e.maximised, this.theme = ["system", "light", "dark"].includes(e.theme) ? e.theme : "system", this.favourites = Array.isArray(e.favourites) ? e.favourites.filter((t) => Zt.some((n) => n.id === t)) : [], this.watchColorScheme(), this.valuePolicy = Sc(this.rootElement()?.dataset.valuePolicy), this.editorTemplate = this.rootElement()?.dataset.editor || "", this.editorRoot = this.rootElement()?.dataset.editorRoot || "", this.refreshAlpine(), this.refreshMagewire(), this.listenToMagewire(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), this.$watch("section", (t) => {
        t === "history" && this.loadHistory();
      }), this.open && this.section === "history" && this.loadHistory(), this.$watch("activeId", () => {
        this.comparison = null, this.baselineId = "";
      }), document.addEventListener("keydown", (t) => this.paletteShortcut(t)), this.open && this.$nextTick(() => this.lock()), this.requests = rc((t) => {
        this.requests.some((n) => n.id === t.id) || (this.requests = [t, ...this.requests].slice(0, 25));
      }).filter((t) => t.id !== this.profile.id), this.open && this.loadPayloads(), this.scheduleDockConstraint();
    },
    /** @returns {HTMLElement|null} the host element, which carries the bar's settings */
    rootElement() {
      return this.$root.getRootNode().host ?? null;
    },
    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(e) {
      const t = this.rootElement()?.dataset.profileUrl;
      return t ? t.replace(bd, encodeURIComponent(e)) : null;
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
          const { profile: n, payloads: i } = await ls(t);
          this.profile = n, this.payloads = i, this.activeId = e;
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
          const n = await Jn(t);
          this.history = Array.isArray(n.profiles) ? n.profiles : [], this.historyLoaded = !0;
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
        this.comparison = await Jn(n);
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
      return Jc(e);
    },
    /**
     * @param {object} metric
     * @param {'baseline'|'subject'} side which profile's value the cell shows
     * @returns {string}
     */
    metricValue(e, t) {
      return Zc(e, t);
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
      return zc(e);
    },
    /** Go back to the request that rendered the page. */
    showPageProfile() {
      this.activeId !== this.pageProfile.id && (this.profile = this.pageProfile, this.payloads = {}, this.activeId = this.pageProfile.id || null, this.loadPayloads());
    },
    /**
     * Where a waterfall span sits and how wide it is.
     *
     * Arithmetic belongs here rather than in the attribute: the bar renders through Alpine's
     * CSP evaluator, which resolves names from the component and knows nothing about globals
     * like Math.
     *
     * @param {object} entry
     * @returns {string}
     */
    waterfallBar(e) {
      const t = Math.max(Number(e.duration_percent) || 0, 0.4);
      return `left:${e.start_percent}%;width:${t}%`;
    },
    /**
     * @param {object} summary a request summary, or a history entry
     * @returns {string}
     */
    requestLabel(e) {
      return Vc(e);
    },
    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(e) {
      return Gc(e, window.location.origin);
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
          this.payloads = (await ls(e)).payloads;
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
      const e = this.itemsOf("queries").filter((t) => this.queryFilter === "slow" ? t.slow : this.queryFilter === "repeated" ? Number(t.repeat_count || 1) > 1 : !0);
      return Je(e, this.querySearch, ["sql"]);
    },
    /** @returns {number} how many statements ran a shape that ran more than once */
    get repeatedCount() {
      return this.itemsOf("queries").filter((e) => Number(e.repeat_count || 1) > 1).length;
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const e = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((t) => t.observer_count === 0) : this.itemsOf("events");
      return Je(e, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return Je(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      return Je(this.itemsOf("blocks"), this.blockSearch, ["name", "template", "class"]);
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
      return Je(e, this.timelineSearch, ["label", "section"]);
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
      return Je(e, this.alpineSearch, ["name", "expression", "path"]);
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
      return hc(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return mc(this.commands, this.paletteSearch);
    },
    /** @returns {boolean} whether the page should be re-read on a timer */
    get alpineLiveWanted() {
      return this.open && !this.dismissed && this.alpineLive && this.section === "alpine";
    },
    /** @returns {string} */
    get statusPhrase() {
      const e = Number(this.request.status || 0);
      return this.request.completed === !1 ? "Threw" : e >= 500 ? "Error" : e >= 400 ? "Refused" : e >= 300 ? "Redirect" : "Success";
    },
    /** @returns {string} */
    get statusTone() {
      const e = Number(this.request.status || 0);
      return this.request.completed === !1 || e >= 500 ? "bad" : e >= 400 ? "warn" : "ok";
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
      return this.request.completed === !1 ? `Stopped after ${t}, nothing was sent` : e >= 500 ? `Failed after ${t}` : e >= 400 ? `Refused after ${t}` : e >= 300 ? `Redirected after ${t}` : `Completed successfully in ${t}`;
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
      return dc(this.rootElement()?.dataset.sections).map((e) => ({ ...e, count: Pr(e.id, this) }));
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
    /**
     * System, light, dark, and round again.
     *
     * The palette names all three, which is what you want when you know where you are
     * going. This is for the other case: it is dark, it should not be, and one click is
     * the whole thought.
     */
    cycleTheme() {
      const e = ["system", "light", "dark"];
      this.setTheme(e[(e.indexOf(this.theme) + 1) % e.length]);
    },
    /** @param {string} theme */
    setTheme(e) {
      this.theme = ["system", "light", "dark"].includes(e) ? e : "system", this.watchColorScheme(), this.persist();
    },
    /**
     * The whole collapsed bar is the button. Aiming for the expand icon to see a request
     * you are already looking at is a target the size of a thumbnail on a surface the
     * width of the page.
     *
     * Its own controls keep their meaning: a click that landed on one has already done
     * something, and so has a click that ended a text selection.
     *
     * The expand icon stays, because a div that reacts to a click is not reachable by
     * keyboard and does not announce itself.
     *
     * @param {MouseEvent} event
     */
    openFromBar(e) {
      if (e.target.closest("button")) return;
      const t = this.$root.getRootNode(), n = typeof t.getSelection == "function" ? t.getSelection() : document.getSelection();
      n && !n.isCollapsed || this.openInspector();
    },
    /** @returns {Record<string, string>} inline positioning only after the dock has moved */
    get dockStyle() {
      return {
        left: this.dockPosition ? `${this.dockPosition.left}px` : "",
        top: this.dockPosition ? `${this.dockPosition.top}px` : "",
        right: this.dockPosition ? "auto" : "",
        bottom: this.dockPosition ? "auto" : "",
        transform: this.dockPosition ? "none" : ""
      };
    },
    /**
     * Begin a pointer drag from the grip. Pointer capture keeps the drag alive after the
     * pointer leaves the small handle or the shadow root.
     *
     * @param {PointerEvent} event
     */
    startDockDrag(e) {
      if (e.button !== 0 || !e.isPrimary) return;
      const t = this.$refs.dock;
      if (!t) return;
      const n = t.getBoundingClientRect();
      this.dockDrag = {
        pointerId: e.pointerId,
        pointerX: e.clientX,
        pointerY: e.clientY,
        left: n.left,
        top: n.top,
        width: n.width,
        height: n.height
      }, this.draggingDock = !0, e.currentTarget.setPointerCapture(e.pointerId), e.preventDefault();
    },
    /** @param {PointerEvent} event */
    moveDockDrag(e) {
      const t = this.dockDrag;
      !t || t.pointerId !== e.pointerId || (this.dockPosition = Sn(
        {
          left: t.left + e.clientX - t.pointerX,
          top: t.top + e.clientY - t.pointerY
        },
        t,
        { width: window.innerWidth, height: window.innerHeight }
      ), e.preventDefault());
    },
    /** @param {PointerEvent} event */
    endDockDrag(e) {
      !this.dockDrag || this.dockDrag.pointerId !== e.pointerId || (this.moveDockDrag(e), this.draggingDock = !1, this.dockDrag = null, this.updatePlacementFromDock(), this.persist());
    },
    /**
     * A button labelled "Move" must work without a pointing device too.
     *
     * @param {KeyboardEvent} event
     */
    moveDockWithKeyboard(e) {
      const t = {
        ArrowLeft: [-10, 0],
        ArrowRight: [10, 0],
        ArrowUp: [0, -10],
        ArrowDown: [0, 10]
      }[e.key];
      if (!t) return;
      const n = this.$refs.dock;
      if (!n) return;
      const i = n.getBoundingClientRect();
      this.dockPosition = Sn(
        { left: i.left + t[0], top: i.top + t[1] },
        i,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), this.persist(), e.preventDefault();
    },
    /**
     * x-show reveals the dock on a timer after its first display. Measure on the following
     * frame, when its width and height exist again, rather than clamping a zero-sized box.
     */
    scheduleDockConstraint() {
      this.$nextTick(() => requestAnimationFrame(() => this.constrainDock()));
    },
    /** Keep a restored or resized dock reachable. */
    constrainDock() {
      const e = this.$refs.dock;
      if (!this.dockPosition || !e || this.open || this.collapsed || this.dismissed) return;
      const t = e.getBoundingClientRect();
      if (t.width === 0 || t.height === 0) return;
      const n = this.dockPosition, i = this.placement;
      this.dockPosition = Sn(
        this.dockPosition,
        t,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), (n.left !== this.dockPosition.left || n.top !== this.dockPosition.top || i !== this.placement) && this.persist();
    },
    /** Keep the edge-bound inspector and bubble near the freely positioned dock. */
    updatePlacementFromDock() {
      const e = this.$refs.dock;
      !this.dockPosition || !e || (this.placement = cc(
        this.dockPosition,
        e.getBoundingClientRect(),
        window.innerHeight
      ));
    },
    openInspector() {
      this.open || (this.collapsed = !1, this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), oc(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus(), this.scheduleDockConstraint());
    },
    toggle() {
      this.open ? this.closeInspector() : this.openInspector();
    },
    toggleMaximised() {
      this.maximised = !this.maximised, this.persist();
    },
    movePlacement() {
      this.placement = this.placement === "bottom" ? "top" : "bottom", this.dockPosition = null, this.persist();
    },
    /**
     * Collapse the bar to its bubble.
     *
     * The X used to hide the bar until the next page load, and a reload is the thing this
     * bar cannot afford: it profiles the page again, so getting the bar back destroyed the
     * request being investigated. Anyone who closed the bar to click what was under it had
     * no way back to what they were reading.
     *
     * The bubble is not destructive, so unlike dismiss() it is remembered. Available but
     * out of the way is a preference, not a decision about one page.
     */
    collapse() {
      this.closeInspector(), this.collapsed = !0, this.persist();
    },
    expand() {
      this.collapsed = !1, this.persist(), this.scheduleDockConstraint();
    },
    toggleCollapsed() {
      this.collapsed ? this.expand() : this.collapse();
    },
    /**
     * Take the bar off the page entirely, for a screenshot or a sticky footer.
     *
     * This is the one that leaves nothing behind, which is why it is only in the palette
     * and why it is not remembered.
     */
    dismiss() {
      this.closeInspector(), this.dismissed = !0;
    },
    lock() {
      ac(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(e) {
      if (e.key === "Escape") {
        this.closeInspector();
        return;
      }
      is(e, this.$refs.sheet);
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
      e && (e.filter && e.section === "queries" && (this.queryFilter = e.filter, this.querySearch = ""), this.select(e.section));
    },
    /**
     * The one section whose data is not in the profile, so it is read again rather than
     * waited for.
     */
    /**
     * The component list is read from the page, so it is asked for rather than watched: a
     * Magewire update replaces components, and a list from before it is a list of ghosts.
     */
    refreshMagewire() {
      this.magewireHealth = nd(), this.magewireComponents = ed(this.valuePolicy), this.magewireExpanded.forEach((e) => {
        this.magewireStates[e] = cs(e, this.valuePolicy);
      });
    },
    /**
     * Magewire loads before Alpine and the bar loads after both, so its global is normally
     * there already. Normally is not always: a page that defers it, or one where the bar
     * boots first, would otherwise have no hooks at all and a permanently empty list.
     */
    listenToMagewire() {
      const e = (t) => {
        this.magewireMessages = [t, ...this.magewireMessages].slice(0, 25), this.refreshMagewire();
      };
      ds(e) || document.addEventListener("magewire:load", () => {
        ds(e), this.refreshMagewire();
      }, { once: !0, passive: !0 });
    },
    /** @param {string} id */
    toggleMagewireComponent(e) {
      if (this.magewireExpanded.includes(e)) {
        this.magewireExpanded = this.magewireExpanded.filter((t) => t !== e), delete this.magewireStates[e];
        return;
      }
      this.magewireExpanded = [...this.magewireExpanded, e], this.magewireStates[e] = cs(e, this.valuePolicy);
    },
    /** @param {string} id */
    isMagewireExpanded(e) {
      return this.magewireExpanded.includes(e);
    },
    /**
     * @param {string} id
     * @param {boolean} on
     */
    highlightMagewire(e, t) {
      id(e, t);
    },
    refreshAlpine() {
      this.alpineHealth = pd(), this.alpineComponents = cd(this.valuePolicy), this.alpineStores = dd(this.valuePolicy), this.alpineErrors = ud(this.valuePolicy), this.alpineExpanded.forEach((e) => {
        this.alpineStates[e] = fs(e, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, fd);
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
      this.alpineExpanded = [...this.alpineExpanded, e], this.alpineStates[e] = fs(e, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(e, t) {
      hd(e, t);
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
      this.dismissed || e.code !== "KeyP" || !e.shiftKey || !(e.metaKey || e.ctrlKey) || (e.preventDefault(), this.togglePalette());
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
      is(e, this.$refs.palette);
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
          case "collapse":
            this.toggleCollapsed();
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
    /**
     * Whether the store collects a section at all, which is not the same as it being empty.
     *
     * @param {string} id
     * @returns {boolean}
     */
    collects(e) {
      return this.sections.some((t) => t.id === e);
    },
    isSection(e) {
      return this.currentSection.id === e;
    },
    persist() {
      try {
        localStorage.setItem(Hr, JSON.stringify({
          open: this.open,
          collapsed: this.collapsed,
          section: this.section,
          placement: this.placement,
          dockPosition: this.dockPosition,
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
      return ki(e, t);
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(e) {
      return Xc(e);
    },
    /**
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(e, t) {
      return Wc(e, t);
    },
    /**
     * @param {string} file
     * @param {number} line
     * @returns {string}
     */
    editorUrl(e, t) {
      return jr(this.editorTemplate, this.editorRoot, e, t);
    },
    /**
     * @param {string} location
     * @returns {string}
     */
    locationUrl(e) {
      return Yc(this.editorTemplate, this.editorRoot, e);
    },
    /**
     * The frame a query came from. The resolver drops framework and generated code, so the
     * first frame left is the application's own.
     *
     * @param {object} query
     * @returns {object|null}
     */
    callSite(e) {
      const t = e?.callsite?.[0];
      return t && t.file ? t : null;
    },
    /**
     * @param {number} count
     * @param {string} one
     * @param {string} many
     * @returns {string}
     */
    plural(e, t, n) {
      return Kc(e, t, n);
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(e) {
      return Si(e);
    }
  };
}
function ct(e) {
  return `<dl class="ndb-facts">${e.map((n) => {
    const i = ["ndb-fact-value", n.mono ? "ndb-mono" : ""].filter(Boolean).join(" "), s = n.tone ? ` data-ndb-bind:class="'is-' + (${n.tone})"` : "", r = n.raw ? `<dd class="${i}"${s}>${n.value}</dd>` : `<dd class="${i}"${s} data-ndb-text="${n.value}"></dd>`, a = n.when ? ` data-ndb-if="${n.when}"` : "", o = `
  <div class="ndb-fact">
    <dt>${n.label}</dt>
    ${r}
  </div>`;
    return n.when ? `
  <template${a}>${o}
  </template>` : o;
  }).join("")}
</dl>`;
}
function bs({ sheet: e }) {
  return `
<div class="ndb-header">
${e ? "" : `  <button type="button" class="ndb-icon-button ndb-drag-handle"
          data-ndb-on:pointerdown="startDockDrag($event)"
          data-ndb-on:pointermove="moveDockDrag($event)"
          data-ndb-on:pointerup="endDockDrag($event)"
          data-ndb-on:pointercancel="endDockDrag($event)"
          data-ndb-on:keydown="moveDockWithKeyboard($event)"
          aria-label="Move debug bar"
          title="Drag to move the debug bar; arrow keys move it 10 pixels">
    ${H("grip")}
  </button>

`}
  <button type="button" class="ndb-request" data-ndb-on:click="select('overview')"
          data-ndb-bind:title="request.path">
    <span class="ndb-method" data-ndb-text="request.method || 'GET'"></span>
    <span class="ndb-request-body">
      <span class="ndb-path" data-ndb-text="requestLabel(request)"></span>
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
      ${H("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + queryTone">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </div>

    <div class="ndb-stat">
      ${H("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </div>

    <div class="ndb-stat is-secondary">
      ${H("chip", "is-accent")}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </div>
  </div>`}

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openPalette()"
            title="Search sections and settings">
      ${H("search")}
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="cycleTheme()"
            data-ndb-bind:title="'Theme: ' + theme + '. Click for the next one.'">
      <span data-ndb-show="theme === 'system'">${H("monitor")}</span>
      <span data-ndb-show="theme === 'light'">${H("sun")}</span>
      <span data-ndb-show="theme === 'dark'">${H("moon")}</span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="select('findings')"
            data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
            title="Findings">
      ${H("alert")}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <span class="ndb-controls-divider"></span>

    ${e ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      <span data-ndb-show="!maximised">${H("expand")}</span>
      <span data-ndb-show="maximised">${H("collapse")}</span>
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${H("minimise")}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button is-open" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${H("expand")}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="collapse()"
            title="Collapse to a bubble">
      ${H("close")}
    </button>
  </div>
</div>`;
}
function gs(e, t) {
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
      ${H("star")}
    </button>
  </div>
</template>`;
}
function vd() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${gs("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${gs("otherSections", !1)}
</nav>`;
}
function Tn(e, t) {
  return `<div class="ndb-subtabs" role="tablist">${t.map((i) => `
  <button type="button" class="ndb-subtab" role="tab"
          data-ndb-bind:aria-selected="${e} === '${i.id}' ? 'true' : 'false'"
          data-ndb-bind:class="${e} === '${i.id}' && 'is-active'"
          data-ndb-on:click="${e} = '${i.id}'">
    <span>${i.label}</span>
    ${i.count ? `<span class="ndb-pill"${i.tone ? ` data-ndb-bind:class="'is-' + (${i.tone})"` : ""}
            ${i.always ? "" : `data-ndb-show="${i.count}"`}
            data-ndb-text="${i.count}"></span>` : ""}
  </button>`).join("")}</div>`;
}
const _d = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme"
     data-ndb-on:resize.window="constrainDock()">

  <div class="ndb-dock" data-ndb-ref="dock"
       data-ndb-show="!open && !dismissed && !collapsed" data-ndb-cloak
       data-ndb-bind:class="draggingDock && 'is-dragging'"
       data-ndb-bind:style="dockStyle"
       title="Open the inspector" data-ndb-on:click="openFromBar($event)">
    ${bs({ sheet: !1 })}
  </div>

  <button type="button" class="ndb-bubble" data-ndb-show="collapsed && !dismissed" data-ndb-cloak
          data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
          data-ndb-on:click="expand()"
          aria-label="Show the debug bar" title="Show the debug bar">
    ${H("pulse")}
    <span class="ndb-badge" data-ndb-show="findings.length > 0"
          data-ndb-text="findings.length"></span>
  </button>

  ${yc()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${bs({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${H("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${vd()}

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
                  data-ndb-bind:class="activeId === entry.id && 'is-active'"
                  data-ndb-bind:title="entry.method + ' ' + entry.url">
            <span data-ndb-text="entry.method"></span>
            <span class="ndb-mono ndb-truncate"
                  data-ndb-text="entry.label || shortUrl(entry.url)"></span>
            <span class="ndb-dim" data-ndb-text="entry.status"></span>
          </button>
        </template>
      </div>

      <p class="ndb-note" data-ndb-show="loading">Loading profile details.</p>
      <p class="ndb-note" data-ndb-show="loadError">
        Could not load profile details: <span data-ndb-text="loadError"></span>
      </p>

      <template data-ndb-if="isSection('findings')">
      <div>
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
                <strong>Where</strong>
                <a class="ndb-callsite-link" data-ndb-show="locationUrl(finding.location)"
                   data-ndb-bind:href="locationUrl(finding.location)"
                   data-ndb-text="finding.location" title="Open at this line"></a>
                <code data-ndb-show="!locationUrl(finding.location)"
                      data-ndb-text="finding.location"></code>
              </p>
              <template data-ndb-if="finding.evidence && finding.evidence.groups">
                <ol class="ndb-evidence">
                  <template data-ndb-for="(group, groupIndex) in finding.evidence.groups"
                            data-ndb-bind:key="groupIndex">
                    <li>
                      <span class="ndb-tag is-warn"
                            data-ndb-text="'ran ' + group.count + ' times'"></span>
                      <span class="ndb-dim"
                            data-ndb-text="number(group.duration_ms, 2) + ' ms'"></span>
                      <code class="ndb-query-sql" data-ndb-code="highlight(group.sql, 'sql')"></code>
                    </li>
                  </template>
                </ol>
              </template>

              <template data-ndb-if="finding.evidence && finding.evidence.sql
                                     && !finding.evidence.groups">
                <ol class="ndb-evidence">
                  <li>
                    <span class="ndb-tag is-warn"
                          data-ndb-text="'ran ' + finding.evidence.count + ' times'"></span>
                    <code class="ndb-query-sql"
                          data-ndb-code="highlight(finding.evidence.sql, 'sql')"></code>
                  </li>
                </ol>
              </template>

              <button type="button" class="ndb-chip" data-ndb-show="finding.action"
                      data-ndb-on:click="follow(finding.action)"
                      data-ndb-text="finding.action ? finding.action.label : ''"></button>
            </li>
          </template>
        </ol>
      </div>
      </template>

      <template data-ndb-if="isSection('overview')">
      <div>
        <div class="ndb-summary">
          <span class="ndb-method" data-ndb-text="request.method || 'GET'"></span>
          <code class="ndb-summary-path" data-ndb-text="requestLabel(request)"></code>
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
            ${ct([
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
            ${ct([
  { label: "Route", value: "request.route || 'unknown'", mono: !0 },
  { label: "Action", value: "request.action || 'unknown'", mono: !0 },
  {
    label: "Intercepted types",
    value: "interception.plugin_count || 0",
    when: "collects('plugins')"
  },
  {
    label: "Observers run",
    value: "observers.count || 0",
    when: "collects('observers')"
  }
])}
          </li>

          <!--
            Only where the request was one. The controller and the path above are the same
            on every Magewire update, so this is the part that says which it was.
          -->
          <template data-ndb-if="request.magewire">
          <li class="ndb-step">
            <h3>Magewire</h3>
            <p>Which component was asked to do what, over the URL they all share.</p>
            ${ct([
  { label: "Component", value: "request.magewire.component", mono: !0 },
  { label: "Action", value: "request.magewire.action || 'none'", mono: !0 },
  { label: "Resolver", value: "request.magewire.resolver || 'unknown'" },
  { label: "Updates", value: "plural(request.magewire.update_count, 'update', 'updates')" }
])}
          </li>
          </template>

          <li class="ndb-step">
            <h3>Responded</h3>
            <p>What the work cost, and what went back to the browser.</p>
            ${ct([
  { label: "Status", value: "request.status", tone: "statusTone" },
  { label: "Response size", value: "bytes(request.response_bytes)" },
  { label: "Duration", value: "number(metrics.duration_ms, 2) + ' ms'", tone: "durationTone" },
  { label: "Memory peak", value: "number(metrics.memory_peak_mb, 1) + ' MB'" },
  {
    label: "Queries",
    when: "collects('queries')",
    raw: !0,
    value: `<span data-ndb-text="queries.count || 0"></span> <small data-ndb-text="'in ' + number(queries.duration_ms, 1) + ' ms'"></small>`
  },
  {
    label: "Blocks",
    when: "collects('blocks')",
    raw: !0,
    value: `<span data-ndb-text="blocks.unique_count || 0"></span> <small data-ndb-text="'in ' + number(blocks.duration_ms, 1) + ' ms'"></small>`
  },
  {
    label: "Events",
    when: "collects('events')",
    raw: !0,
    value: `<span data-ndb-text="events.count || 0"></span> <small data-ndb-text="events.unique_count + ' unique'"></small>`
  },
  {
    label: "Cache",
    when: "collects('cache')",
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
      </template>

      <template data-ndb-if="isSection('timeline')">
      <div>
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
                      data-ndb-bind:style="waterfallBar(entry)"></span>
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
      </template>

      <template data-ndb-if="isSection('queries')">
      <div>
        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="queryFilter = 'all'"
                  data-ndb-bind:class="queryFilter === 'all' && 'is-active'">All</button>
          <button type="button" class="ndb-chip" data-ndb-on:click="queryFilter = 'slow'"
                  data-ndb-bind:class="queryFilter === 'slow' && 'is-active'">
            Slow <span class="ndb-pill" data-ndb-text="queries.slow_count || 0"></span>
          </button>
          <button type="button" class="ndb-chip" data-ndb-show="repeatedCount"
                  data-ndb-on:click="queryFilter = 'repeated'"
                  data-ndb-bind:class="queryFilter === 'repeated' && 'is-active'"
                  title="Statements whose shape ran more than once. Findings are stricter and
                         only speak up at three.">
            Repeated <span class="ndb-pill" data-ndb-text="repeatedCount"></span>
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
                <span class="ndb-tag" data-ndb-show="query.repeat_count > 1"
                      data-ndb-bind:class="query.repeat_count >= 3 && 'is-warn'"
                      data-ndb-text="'ran ' + query.repeat_count + ' times'"></span>
              </div>
              <code class="ndb-query-sql" data-ndb-code="highlight(query.sql, 'sql')"></code>

              <p class="ndb-callsite" data-ndb-show="callSite(query)">
                <template data-ndb-if="callSite(query)">
                  <span>
                    <a class="ndb-callsite-link" data-ndb-show="editorTemplate"
                       data-ndb-bind:href="editorUrl(callSite(query).file, callSite(query).line)"
                       data-ndb-text="callSite(query).file + ':' + callSite(query).line"
                       title="Open at this line"></a>
                    <span class="ndb-mono" data-ndb-show="!editorTemplate"
                          data-ndb-text="callSite(query).file + ':' + callSite(query).line"></span>
                    <span class="ndb-dim" data-ndb-text="callSite(query).call"></span>
                  </span>
                </template>
              </p>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="visibleQueries.length === 0">No queries match.</p>
      </div>
      </template>

      <template data-ndb-if="isSection('events')">
      <div>
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
      </template>

      <template data-ndb-if="isSection('observers')">
      <div>
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
      </template>

      <template data-ndb-if="isSection('cache')">
      <div>
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
      </template>

      <template data-ndb-if="isSection('blocks')">
      <div>
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
      </template>

      <template data-ndb-if="isSection('plugins')">
      <div>
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
      </template>

      <template data-ndb-if="isSection('magewire')">
      <div>
        <p class="ndb-note" data-ndb-show="!magewireHealth.present">
          No Magewire on this page. This section reads the page's own instance, and Magewire
          only loads where a component is in the layout.
        </p>

        <div data-ndb-show="magewireHealth.present">
          ${Tn("magewireTab", [
  { id: "components", label: "Components", count: "magewireComponents.length" },
  { id: "updates", label: "Updates", count: "magewireMessages.length" }
])}

          <div data-ndb-show="magewireTab === 'components'">
            <p class="ndb-empty" data-ndb-show="magewireComponents.length === 0">
              Magewire is on the page but no component has been mounted.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="component in magewireComponents"
                        data-ndb-bind:key="component.id">
                <li class="ndb-alpine">
                  <button type="button" class="ndb-alpine-head"
                          data-ndb-on:click="toggleMagewireComponent(component.id)"
                          data-ndb-on:mouseenter="highlightMagewire(component.id, true)"
                          data-ndb-on:mouseleave="highlightMagewire(component.id, false)"
                          data-ndb-on:focus="highlightMagewire(component.id, true)"
                          data-ndb-on:blur="highlightMagewire(component.id, false)">
                    ${H("caret", "ndb-alpine-caret")}
                    <span class="ndb-alpine-name" data-ndb-text="component.name"></span>
                    <span class="ndb-tag" data-ndb-show="component.children"
                          data-ndb-text="plural(component.children, 'child', 'children')"></span>
                    <span class="ndb-alpine-path ndb-dim ndb-truncate"
                          data-ndb-text="component.resolver
                            + ' · ' + plural(component.keys, 'property', 'properties')
                            + ' · ' + plural(component.listeners, 'listener', 'listeners')"></span>
                    <span class="ndb-pill"
                          data-ndb-bind:class="component.memo_bytes > 20480 && 'is-warn'"
                          data-ndb-text="bytes(component.memo_bytes)"></span>
                  </button>

                  <div class="ndb-alpine-body" data-ndb-show="isMagewireExpanded(component.id)">
                    <pre class="ndb-json"
                         data-ndb-code="highlight(magewireStates[component.id], 'json')"></pre>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-note">
              The size beside a component is the state it posts back and returns on every
              update. A collection on a public property is the usual reason it is large.
            </p>
          </div>

          <div data-ndb-show="magewireTab === 'updates'">
            <p class="ndb-empty" data-ndb-show="magewireMessages.length === 0">
              Nothing yet. Interact with a component and its round trip appears here.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="(message, index) in magewireMessages"
                        data-ndb-bind:key="index">
                <li class="ndb-alpine">
                  <div class="ndb-alpine-head is-static">
                    <span class="ndb-alpine-name"
                          data-ndb-text="message.component + ' ' + message.action"></span>
                    <span class="ndb-tag is-bad" data-ndb-show="message.failed">failed</span>
                    <span class="ndb-alpine-path ndb-dim ndb-truncate"
                          data-ndb-show="!message.failed">round trip, browser to browser</span>
                    <span class="ndb-pill" data-ndb-show="message.duration_ms !== null"
                          data-ndb-text="number(message.duration_ms, 1) + ' ms'"></span>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-note">
              Measured in the browser, so this is the network and the DOM morph as well as
              the server. The profile for the same update, in the request list above, is the
              server's share of it.
            </p>
          </div>
        </div>
      </div>
      </template>

      <template data-ndb-if="isSection('history')">
      <div>
        ${Tn("historyTab", [
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
                        data-ndb-text="requestLabel(entry)"></span>
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
                      data-ndb-bind:class="!entry.status || entry.status >= 400 ? 'is-bad' : 'is-ok'"
                      data-ndb-text="entry.status || 'threw'"></span>
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

          <template data-ndb-if="comparison">
          <div>
            <div class="ndb-callout is-warn" data-ndb-show="!comparison.same_path">
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

            <div class="ndb-subhead" data-ndb-show="comparison.findings.added.length
                 || comparison.findings.resolved.length">
              <div>
                <h3>Findings</h3>
                <p>
                  <span data-ndb-text="comparison.findings.unchanged"></span> unchanged.
                </p>
              </div>
            </div>

            <ol class="ndb-list">
              <template data-ndb-for="(finding, index) in comparison.findings.added"
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

            <p class="ndb-empty" data-ndb-show="!comparison.queries.added_total
               && !comparison.queries.removed_total && !comparison.queries.changed_total">
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
                  <code class="ndb-query-sql" data-ndb-code="highlight(row.sql, 'sql')"></code>
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
                  <code class="ndb-query-sql" data-ndb-code="highlight(row.sql, 'sql')"></code>
                </li>
              </template>

              <template data-ndb-for="(row, index) in comparison.queries.removed"
                        data-ndb-bind:key="'rem' + index">
                <li class="ndb-query">
                  <div class="ndb-query-head">
                    <span class="ndb-delta is-better" data-ndb-text="row.delta"></span>
                    <span class="ndb-query-type">gone</span>
                  </div>
                  <code class="ndb-query-sql" data-ndb-code="highlight(row.sql, 'sql')"></code>
                </li>
              </template>
            </ol>
          </div>
          </template>
        </div>
      </div>
      </template>

      <template data-ndb-if="isSection('alpine')">
      <div>
        <p class="ndb-note" data-ndb-show="!alpineHealth.present">
          No Alpine on this page. This section reads the page's own instance, so it has
          nothing to show until a theme loads one.
        </p>

        <div data-ndb-show="alpineHealth.present">
          ${Tn("alpineTab", [
  { id: "components", label: "Components", count: "alpineComponents.length" },
  { id: "stores", label: "Stores", count: "alpineStores.length" },
  { id: "deferred", label: "Deferred", count: "alpineDeferredCount" },
  {
    id: "health",
    label: "Health",
    // A tick rather than a green zero: the tab says it checked, without colouring
    // a normal value the way every other count here would be.
    count: "alpineErrors.length || '✓'",
    tone: "alpineErrors.length ? 'bad' : 'ok'",
    always: !0
  }
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
                    ${H("caret", "ndb-alpine-caret")}
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
                          data-ndb-code="highlight(component.expression, 'javascript')"></code>
                    <pre class="ndb-json" data-ndb-code="highlight(alpineStates[component.id], 'json')"></pre>
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
                    <pre class="ndb-json" data-ndb-code="highlight(store.value, 'json')"></pre>
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
            ${ct([
  { label: "Version", value: "alpineHealth.version" },
  { label: "Build", value: "alpineBuild" },
  { label: "Prefix", value: "alpineHealth.prefix", mono: !0 },
  { label: "Loaded from", value: "alpineHealth.source || 'not a separate file'", mono: !0 },
  { label: "Components", value: "alpineComponents.length" },
  { label: "Not started", value: "alpinePendingCount" },
  { label: "Deferred", value: "alpineDeferredCount" },
  { label: "Stores", value: "alpineStores.length" }
])}

            <div class="ndb-callout is-bad" data-ndb-show="alpineErrors.length > 0">
              <p class="ndb-callout-title"
                 data-ndb-text="plural(alpineErrors.length, 'expression error', 'expression errors')"></p>
              <p>Something on this page threw while Alpine was evaluating it. A binding that
                throws renders as an empty element and says nothing, so this is the only
                place it shows.</p>
            </div>

            <div class="ndb-callout is-clear" data-ndb-show="alpineErrors.length === 0">
              <p class="ndb-callout-title">No expression errors</p>
              <p>Nothing threw while Alpine was evaluating this page.</p>
            </div>

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
      </template>

      </div>
      </div>
    </div>
  </div>

</div>
`, wd = "data-ndb-", ms = "siteation-debugbar";
function xd(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const s = document.createElement("link");
    s.rel = "stylesheet", s.href = n, t.append(s);
  }
  const i = document.createElement("div");
  return i.innerHTML = _d, t.append(...i.children), t.querySelector(".ndb");
}
class Ed extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const t = xd(this);
    t && gt.initTree(t);
  }
}
customElements.get(ms) || (gt.prefix(wd), gt.data("debugBar", yd), gt.directive("code", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  const s = i(t);
  n(() => s((r) => {
    e.innerHTML = typeof r == "string" ? r : "";
  }));
}), customElements.define(ms, Ed));
Mn && (window.Alpine = Mn);
