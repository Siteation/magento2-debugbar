const Sn = window.Alpine;
var kn = !1, On = !1, pe = [], An = -1, jt = !1, Vn = !1;
function Sa(e) {
  Aa(e);
}
function ka() {
  Vn = !0;
}
function Oa() {
  Vn = !1, ls();
}
function Aa(e) {
  pe.includes(e) || (pe.push(e), e._x_schedulerPriority !== void 0 && (jt = !0)), ls();
}
function Ta(e) {
  let t = pe.indexOf(e);
  t !== -1 && t > An && pe.splice(t, 1);
}
function ls() {
  if (!On && !kn) {
    if (Vn)
      return;
    kn = !0, queueMicrotask(Na);
  }
}
function Na() {
  kn = !1, On = !0;
  for (let e = 0; e < pe.length; e++)
    jt && Ma(e), pe[e](), An = e;
  pe.length = 0, An = -1, jt = !1, On = !1;
}
function Ma(e) {
  let t = /* @__PURE__ */ new Map(), n = pe.slice(e).sort((i, s) => Ra(i, s, t));
  for (let i = 0; i < n.length; i++)
    pe[e + i] = n[i];
  jt = !1;
}
function Ra(e, t, n) {
  return fn(e) ? fn(t) ? Di(e._x_schedulerPriority.el, n) - Di(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : fn(t) ? 1 : 0;
}
function fn(e) {
  return e._x_schedulerPriority !== void 0;
}
function Di(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, i = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(i, n), n;
}
var Ye, qe, Qe, cs, Ca = 0, Tn = !0;
function Ia(e) {
  Tn = !1, e(), Tn = !0;
}
function Pa(e) {
  Ye = e.reactive, Qe = e.release, qe = (t) => e.effect(t, { scheduler: (n) => {
    Tn ? Sa(n) : n();
  } }), cs = e.raw;
}
function qi(e) {
  qe = e;
}
function $a(e) {
  let t = () => {
  };
  return [(i, s) => {
    let r = s?.priority === "structural" ? Ca++ : void 0, a = qe(i);
    return r !== void 0 && a !== void 0 && (a._x_schedulerPriority = { el: e, order: r }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(a), t = () => {
      a !== void 0 && (e._x_effects.delete(a), Qe(a));
    }, a;
  }, () => {
    t();
  }];
}
function ds(e, t) {
  let n = !0, i, s, r = qe(() => {
    let a = e(), o = JSON.stringify(a);
    if (!n && (typeof a == "object" || a !== i)) {
      let c = typeof i == "object" ? JSON.parse(s) : i;
      queueMicrotask(() => {
        t(a, c);
      });
    }
    i = a, s = o, n = !1;
  });
  return () => Qe(r);
}
async function La(e) {
  ka();
  try {
    await e(), await Promise.resolve();
  } finally {
    Oa();
  }
}
var us = [], ps = [], hs = [];
function Da(e) {
  hs.push(e);
}
function Gn(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, ps.push(t));
}
function fs(e) {
  us.push(e);
}
function bs(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function gs(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((s) => s()), delete e._x_attributeCleanups[n]);
  });
}
function qa(e) {
  for (e._x_effects?.forEach(Ta); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var Jn = new MutationObserver(Qn), Zn = !1;
function Xn() {
  Jn.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), Zn = !0;
}
function ms() {
  Ua(), Jn.disconnect(), Zn = !1;
}
var st = [];
function Ua() {
  let e = Jn.takeRecords();
  st.push(() => e.length > 0 && Qn(e));
  let t = st.length;
  queueMicrotask(() => {
    if (st.length === t)
      for (; st.length > 0; )
        st.shift()();
  });
}
function j(e) {
  if (!Zn)
    return e();
  ms();
  let t = e();
  return Xn(), t;
}
var Yn = !1, Bt = [];
function ja() {
  Yn = !0;
}
function Ba() {
  Yn = !1, Qn(Bt), Bt = [];
}
function Qn(e) {
  if (Yn) {
    Bt = Bt.concat(e);
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
    gs(a, r);
  }), i.forEach((r, a) => {
    us.forEach((o) => o(a, r));
  });
  for (let r of n)
    t.some((a) => a.contains(r)) || ps.forEach((a) => a(r));
  for (let r of t)
    r.isConnected && hs.forEach((a) => a(r));
  t = null, n = null, i = null, s = null;
}
function ys(e) {
  return Ce(Ze(e));
}
function wt(e, t, n) {
  return e._x_dataStack = [t, ...Ze(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function Ze(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? Ze(e.host) : e.parentNode ? Ze(e.parentNode) : [];
}
function Ce(e) {
  return new Proxy({ objects: e }, Fa);
}
function vs(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : vs(Object.getPrototypeOf(e), t);
}
var Fa = {
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
    return t == "toJSON" ? Ha : Reflect.get(
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
      if (s = vs(a, t), s)
        break;
    s || (s = e[e.length - 1]);
    const r = Object.getOwnPropertyDescriptor(s, t);
    return r?.set && r?.get ? r.set.call(i, n) || !0 : Reflect.set(s, t, n);
  }
};
function Ha() {
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
function _s(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, s, r, a) {
      return e(this.initialValue, () => Wa(i, s), (o) => Nn(i, s, o), s, r, a);
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
function Wa(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function Nn(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Nn(e[t[0]], t.slice(1), n);
  }
}
var ws = {};
function se(e, t) {
  ws[e] = t;
}
function Ft(e, t) {
  let n = za(t);
  return Object.entries(ws).forEach(([i, s]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return s(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function za(e) {
  let [t, n] = Ts(e), i = { interceptor: _s, ...t };
  return Gn(e, n), i;
}
function Ka(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (s) {
    ti(s, e, t);
  }
}
function ti(...e) {
  return xs(...e);
}
var xs = Ga;
function Va(e) {
  xs = e;
}
function Ga(e, t, n = void 0) {
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
function Es(e) {
  let t = Ne;
  Ne = !1;
  let n = e();
  return Ne = t, n;
}
function Me(e, t, n = {}) {
  let i;
  return X(e, t)((s) => i = s, n), i;
}
function X(...e) {
  return Ss(...e);
}
var Ss = () => {
};
function Ja(e) {
  Ss = e;
}
var ks;
function Za(e) {
  ks = e;
}
function Xa(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: s = [], context: r } = {}) => {
    if (!Ne) {
      Mn(n, t, Ce([i, ...e]), s);
      return;
    }
    let a = t.apply(Ce([i, ...e]), s);
    Mn(n, a);
  };
}
function Mn(e, t, n, i, s) {
  if (Ne && typeof t == "function") {
    let r = t.apply(n, i);
    r instanceof Promise ? r.then((a) => Mn(e, a, n, i)).catch((a) => ti(a, s, t)) : e(r);
  } else typeof t == "object" && t instanceof Promise ? t.then((r) => e(r)) : e(t);
}
function Ya(...e) {
  return ks(...e);
}
var ni = "x-";
function et(e = "") {
  return ni + e;
}
function Qa(e) {
  ni = e;
}
var Ht = {};
function B(e, t) {
  return Ht[e] = t, {
    before(n) {
      if (!Ht[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = Te.indexOf(n);
      Te.splice(i >= 0 ? i : Te.indexOf("DEFAULT"), 0, e);
    }
  };
}
function eo(e) {
  return Object.keys(Ht).includes(e);
}
function ii(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let r = Object.entries(e._x_virtualDirectives).map(([o, c]) => ({ name: o, value: c })), a = Os(r);
    r = r.map((o) => a.find((c) => c.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(r);
  }
  let i = {};
  return t.map(Rs((r, a) => i[r] = a)).filter(Is).map(io(i, n)).sort(so).map((r) => no(e, r));
}
function Os(e) {
  return Array.from(e).map(Rs()).filter((t) => !Is(t));
}
var Rn = !1, ct = /* @__PURE__ */ new Map(), As = /* @__PURE__ */ Symbol();
function to(e) {
  Rn = !0;
  let t = /* @__PURE__ */ Symbol();
  As = t, ct.set(t, []);
  let n = () => {
    for (; ct.get(t).length; )
      ct.get(t).shift()();
    ct.delete(t);
  }, i = () => {
    Rn = !1, n();
  };
  e(n), i();
}
function Ts(e) {
  let t = [], n = (o) => t.push(o), [i, s] = $a(e);
  return t.push(s), [{
    Alpine: tt,
    effect: i,
    cleanup: n,
    evaluateLater: X.bind(X, e),
    evaluate: Me.bind(Me, e)
  }, () => t.forEach((o) => o())];
}
function no(e, t) {
  let n = () => {
  }, i = Ht[t.type] || n, [s, r] = Ts(e);
  bs(e, t.original, r);
  let a = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, s), i = i.bind(i, e, t, s), Rn ? ct.get(As).push(i) : i());
  };
  return a.runCleanups = r, a;
}
var Ns = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), Ms = (e) => e;
function Rs(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: s } = Cs.reduce((r, a) => a(r), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: s };
  };
}
var Cs = [];
function si(e) {
  Cs.push(e);
}
function Is({ name: e }) {
  return Ps().test(e);
}
var Ps = () => new RegExp(`^${ni}([^:^.]+)\\b`);
function io(e, t) {
  return ({ name: n, value: i }) => {
    n === i && (i = "");
    let s = n.match(Ps()), r = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: s ? s[1] : null,
      value: r ? r[1] : null,
      modifiers: a.map((c) => c.replace(".", "")),
      expression: i,
      original: o
    };
  };
}
var Cn = "DEFAULT", Te = [
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
function so(e, t) {
  let n = Te.indexOf(e.type) === -1 ? Cn : e.type, i = Te.indexOf(t.type) === -1 ? Cn : t.type;
  return Te.indexOf(n) - Te.indexOf(i);
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
function Ie(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((s) => Ie(s, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let i = e.firstElementChild;
  for (; i; )
    Ie(i, t), i = i.nextElementSibling;
}
function le(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Ui = !1;
function ro() {
  Ui && le("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Ui = !0, document.body || le("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), ut(document, "alpine:init"), ut(document, "alpine:initializing"), Xn(), Da((t) => fe(t, Ie)), Gn((t) => Ue(t)), fs((t, n) => {
    ii(t, n).forEach((i) => i());
  });
  let e = (t) => !Zt(t.parentElement, !0);
  Array.from(document.querySelectorAll(Ds().join(","))).filter(e).forEach((t) => {
    fe(t);
  }), ut(document, "alpine:initialized"), setTimeout(() => {
    co();
  });
}
var ri = [], $s = [];
function Ls() {
  return ri.map((e) => e());
}
function Ds() {
  return ri.concat($s).map((e) => e());
}
function qs(e) {
  ri.push(e);
}
function Us(e) {
  $s.push(e);
}
function Zt(e, t = !1) {
  return he(e, (n) => {
    if ((t ? Ds() : Ls()).some((s) => n.matches(s)))
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
function ao(e) {
  return Ls().some((t) => e.matches(t));
}
var js = [];
function oo(e) {
  js.push(e);
}
var lo = 1;
function fe(e, t = Ie, n = () => {
}) {
  he(e, (i) => i._x_ignore) || to(() => {
    t(e, (i, s) => {
      i._x_marker || (n(i, s), js.forEach((r) => r(i, s)), ii(i, i.attributes).forEach((r) => r()), i._x_ignore || (i._x_marker = lo++), i._x_ignore && s());
    });
  });
}
function Ue(e, t = Ie) {
  t(e, (n) => {
    qa(n), gs(n), delete n._x_marker;
  });
}
function co() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    eo(n) || i.some((s) => {
      if (document.querySelector(s))
        return le(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var In = [], ai = !1;
function oi(e = () => {
}) {
  return queueMicrotask(() => {
    ai || setTimeout(() => {
      Pn();
    });
  }), new Promise((t) => {
    In.push(() => {
      e(), t();
    });
  });
}
function Pn() {
  for (ai = !1; In.length; )
    In.shift()();
}
function uo() {
  ai = !0;
}
function li(e, t) {
  return Array.isArray(t) ? ji(e, t.join(" ")) : typeof t == "object" && t !== null ? po(e, t) : typeof t == "function" ? li(e, t()) : ji(e, t);
}
function $n(e) {
  return e.split(/\s/).filter(Boolean);
}
function ji(e, t) {
  let n = (s) => $n(s).filter((r) => !e.classList.contains(r)).filter(Boolean), i = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function po(e, t) {
  let n = Object.entries(t).flatMap(([a, o]) => o ? $n(a) : !1).filter(Boolean), i = Object.entries(t).flatMap(([a, o]) => o ? !1 : $n(a)).filter(Boolean), s = [], r = [];
  return i.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), r.push(a));
  }), n.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    r.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function Xt(e, t) {
  return typeof t == "object" && t !== null ? ho(e, t) : fo(e, t);
}
function ho(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, s]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = bo(i)), e.style.setProperty(i, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    Xt(e, n);
  };
}
function fo(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function bo(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Ln(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
B("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: s }) => {
  typeof i == "function" && (i = s(i)), i !== !1 && (!i || typeof i == "boolean" ? mo(e, n, t) : go(e, i, t));
});
function go(e, t, n) {
  Bs(e, li, ""), {
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
function mo(e, t, n) {
  Bs(e, Xt);
  let i = !t.includes("in") && !t.includes("out") && !n, s = i || t.includes("in") || ["enter"].includes(n), r = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((S, P) => P < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((S, P) => P > t.indexOf("out")));
  let a = !t.includes("opacity") && !t.includes("scale"), o = a || t.includes("opacity"), c = a || t.includes("scale"), d = o ? 0 : 1, p = c ? rt(t, "scale", 95) / 100 : 1, m = rt(t, "delay", 0) / 1e3, E = rt(t, "origin", "center"), M = "opacity, transform", D = rt(t, "duration", 150) / 1e3, v = rt(t, "duration", 75) / 1e3, g = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (e._x_transition.enter.during = {
    transformOrigin: E,
    transitionDelay: `${m}s`,
    transitionProperty: M,
    transitionDuration: `${D}s`,
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
    transitionProperty: M,
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
function Bs(e, t, n = {}) {
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
    let a = Fs(e);
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
function Fs(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Fs(t);
}
function Dn(e, t, { during: n, start: i, end: s } = {}, r = () => {
}, a = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(s).length === 0) {
    r(), a();
    return;
  }
  let o, c, d;
  yo(e, {
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
function yo(e, t) {
  let n, i, s, r = Ln(() => {
    j(() => {
      n = !0, i || t.before(), s || (t.end(), Pn()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
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
  }, j(() => {
    t.start(), t.during();
  }), uo(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), j(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (j(() => {
        t.end();
      }), Pn(), setTimeout(e._x_transitioning.finish, a + o), s = !0);
    });
  });
}
function rt(e, t, n) {
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
var _e = !1;
function we(e, t = () => {
}) {
  return (...n) => _e ? t(...n) : e(...n);
}
function vo(e) {
  return (...t) => _e && e(...t);
}
var Hs = [];
function Yt(e) {
  Hs.push(e);
}
function _o(e, t) {
  Hs.forEach((n) => n(e, t)), _e = !0, Ws(() => {
    fe(t, (n, i) => {
      i(n, () => {
      });
    });
  }), _e = !1;
}
var qn = !1;
function wo(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), _e = !0, qn = !0, Ws(() => {
    xo(t);
  }), _e = !1, qn = !1;
}
function xo(e) {
  let t = !1;
  fe(e, (i, s) => {
    Ie(i, (r, a) => {
      if (t && ao(r))
        return a();
      t = !0, s(r, a);
    });
  });
}
function Ws(e) {
  let t = qe;
  qi((n, i) => {
    let s = t(n);
    return Qe(s), () => {
    };
  }), e(), qi(t);
}
function zs(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Ye({})), e._x_bindings[t] = n, t = i.includes("camel") ? Mo(t) : t, t) {
    case "value":
      Eo(e, n);
      break;
    case "style":
      ko(e, n);
      break;
    case "class":
      So(e, n);
      break;
    case "selected":
    case "checked":
      Oo(e, t, n);
      break;
    default:
      ci(e, t, n);
      break;
  }
}
function Eo(e, t) {
  if (di(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (Wt(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Ro(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    No(e, t);
  else if (e.tagName === "OPTION")
    ci(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function So(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = li(e, t);
}
function ko(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = Xt(e, t);
}
function Oo(e, t, n) {
  ci(e, t, n), To(e, t, n);
}
function ci(e, t, n) {
  [null, void 0, !1].includes(n) && Io(t) ? e.removeAttribute(t) : (Ks(t) && (n = t), Po(n) && (n = JSON.stringify(n)), Ao(e, t, n));
}
function Ao(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function To(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function No(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Mo(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Ro(e, t) {
  return e == t;
}
function qt(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Co = /* @__PURE__ */ new Set([
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
function Ks(e) {
  return Co.has(e);
}
function Io(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Po(e) {
  return typeof e == "object" && e !== null;
}
function $o(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Vs(e, t, n);
}
function Lo(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = i, Es(() => Me(e, s.expression));
  }
  return Vs(e, t, n);
}
function Vs(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : Ks(t) ? !![t, "true"].includes(i) : i;
}
function Wt(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function di(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Gs(e, t) {
  let n;
  return function() {
    const i = this, s = arguments, r = function() {
      n = null, e.apply(i, s);
    };
    clearTimeout(n), n = setTimeout(r, t);
  };
}
function Js(e, t) {
  let n;
  return function() {
    let i = this, s = arguments;
    n || (e.apply(i, s), n = !0, setTimeout(() => n = !1, t));
  };
}
function Zs({ get: e, set: t }, { get: n, set: i }) {
  let s = !0, r, a = qe(() => {
    let o = e(), c = n();
    if (s)
      i(bn(o)), s = !1;
    else {
      let d = JSON.stringify(o), p = JSON.stringify(c);
      d !== r ? i(bn(o)) : d !== p && t(bn(c));
    }
    r = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    Qe(a);
  };
}
function bn(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Do(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(tt));
}
var ue = {}, Bi = !1;
function qo(e, t) {
  if (Bi || (ue = Ye(ue), Bi = !0), t === void 0)
    return ue[e];
  ue[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? ue[e] = t.initialize(ue, e, e, () => {
  }) : ei(ue[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ue[e].init();
}
function Uo() {
  return ue;
}
var Xs = {};
function jo(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? Ys(e, n()) : (Xs[e] = n, () => {
  });
}
function Bo(e) {
  return Object.entries(Xs).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function Ys(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let s = Object.entries(t).map(([a, o]) => ({ name: a, value: o })), r = Os(s);
  return s = s.map((a) => r.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), ii(e, s, n).map((a) => {
    i.push(a.runCleanups), a();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var Qs = {};
function Fo(e, t) {
  Qs[e] = t;
}
function Ho(e, t) {
  return Object.entries(Qs).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...s) => i.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var Wo = {
  get reactive() {
    return Ye;
  },
  get release() {
    return Qe;
  },
  get effect() {
    return qe;
  },
  get raw() {
    return cs;
  },
  get transaction() {
    return La;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Ba,
  dontAutoEvaluateFunctions: Es,
  disableEffectScheduling: Ia,
  startObservingMutations: Xn,
  stopObservingMutations: ms,
  setReactivityEngine: Pa,
  onAttributeRemoved: bs,
  onAttributesAdded: fs,
  closestDataStack: Ze,
  skipDuringClone: we,
  onlyDuringClone: vo,
  addRootSelector: qs,
  addInitSelector: Us,
  setErrorHandler: Va,
  interceptClone: Yt,
  addScopeToNode: wt,
  deferMutations: ja,
  mapAttributes: si,
  evaluateLater: X,
  interceptInit: oo,
  initInterceptors: ei,
  injectMagics: Ft,
  setEvaluator: Ja,
  setRawEvaluator: Za,
  mergeProxies: Ce,
  extractProp: Lo,
  findClosest: he,
  onElRemoved: Gn,
  closestRoot: Zt,
  destroyTree: Ue,
  interceptor: _s,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Dn,
  // INTERNAL
  setStyles: Xt,
  // INTERNAL
  mutateDom: j,
  directive: B,
  entangle: Zs,
  throttle: Js,
  debounce: Gs,
  evaluate: Me,
  evaluateRaw: Ya,
  initTree: fe,
  nextTick: oi,
  prefixed: et,
  prefix: Qa,
  plugin: Do,
  magic: se,
  store: qo,
  start: ro,
  clone: wo,
  // INTERNAL
  cloneNode: _o,
  // INTERNAL
  bound: $o,
  $data: ys,
  watch: ds,
  walk: Ie,
  data: Fo,
  bind: jo
}, tt = Wo, Fi = /* @__PURE__ */ new WeakMap(), er = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((e) => {
  e === "styleMedia" || e === "sharedStorage" || er.add(globalThis[e]);
});
var W = class {
  constructor(e, t, n, i) {
    this.type = e, this.value = t, this.start = n, this.end = i;
  }
}, zo = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new W("EOF", null, this.position, this.position)), this.tokens;
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
    this.tokens.push(new W("NUMBER", parseFloat(n), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new W("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new W("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new W("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new W("KEYWORD", t, e, this.position)) : this.tokens.push(new W("IDENTIFIER", t, e, this.position));
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
        this.position++, this.tokens.push(new W("STRING", n, e, this.position));
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
      this.position += 3, this.tokens.push(new W("OPERATOR", "===", e, this.position));
    else if (t === "!" && n === "=" && i === "=")
      this.position += 3, this.tokens.push(new W("OPERATOR", "!==", e, this.position));
    else if (t === "=" && n === "=")
      this.position += 2, this.tokens.push(new W("OPERATOR", "==", e, this.position));
    else if (t === "!" && n === "=")
      this.position += 2, this.tokens.push(new W("OPERATOR", "!=", e, this.position));
    else if (t === "<" && n === "=")
      this.position += 2, this.tokens.push(new W("OPERATOR", "<=", e, this.position));
    else if (t === ">" && n === "=")
      this.position += 2, this.tokens.push(new W("OPERATOR", ">=", e, this.position));
    else if (t === "&" && n === "&")
      this.position += 2, this.tokens.push(new W("OPERATOR", "&&", e, this.position));
    else if (t === "|" && n === "|")
      this.position += 2, this.tokens.push(new W("OPERATOR", "||", e, this.position));
    else if (t === "+" && n === "+")
      this.position += 2, this.tokens.push(new W("OPERATOR", "++", e, this.position));
    else if (t === "-" && n === "-")
      this.position += 2, this.tokens.push(new W("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const s = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new W(s, t, e, this.position));
    }
  }
}, Ko = class {
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
}, Vo = class {
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
          let S;
          e.callee.computed ? S = this.evaluate({ node: e.callee.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : S = e.callee.property.name, this.checkForDangerousKeywords(S);
          let P = g[S];
          if (typeof P != "function")
            throw new Error("Value is not a function");
          c = P.apply(g, o);
        } else if (e.callee.type === "Identifier") {
          const g = e.callee.name;
          let S;
          if (g in t)
            S = t[g];
          else
            throw new Error(`Undefined variable: ${g}`);
          if (typeof S != "function")
            throw new Error("Value is not a function");
          const P = n !== null ? n : t;
          c = S.apply(P, o);
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
          const S = t[g];
          return e.operator === "++" ? t[g] = S + 1 : e.operator === "--" && (t[g] = S - 1), e.prefix ? t[g] : S;
        } else if (e.argument.type === "MemberExpression") {
          const g = this.evaluate({ node: e.argument.object, scope: t, context: n, forceBindingRootScopeToFunctions: i }), S = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : e.argument.property.name;
          if (this.isDOMObject(g))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          this.checkForDangerousKeywords(S);
          const P = g[S];
          return e.operator === "++" ? g[S] = P + 1 : e.operator === "--" && (g[S] = P - 1), e.prefix ? g[S] : P;
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
        const D = this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: i });
        if (e.left.type === "Identifier")
          return t[e.left.name] = D, D;
        if (e.left.type === "MemberExpression") {
          const g = this.evaluate({ node: e.left.object, scope: t, context: n, forceBindingRootScopeToFunctions: i }), S = e.left.computed ? this.evaluate({ node: e.left.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : e.left.property.name;
          if (this.isDOMObject(g))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          return this.checkForDangerousKeywords(S), g[S] = D, D;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((g) => this.evaluate({ node: g, scope: t, context: n, forceBindingRootScopeToFunctions: i }));
      case "ObjectExpression":
        const v = {};
        for (const g of e.properties) {
          const S = g.computed ? this.evaluate({ node: g.key, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : g.key.type === "Identifier" ? g.key.name : this.evaluate({ node: g.key, scope: t, context: n, forceBindingRootScopeToFunctions: i }), P = this.evaluate({ node: g.value, scope: t, context: n, forceBindingRootScopeToFunctions: i });
          v[S] = P;
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
    if (e !== null && !(typeof e != "object" && typeof e != "function") && !Fi.has(e)) {
      if (e instanceof HTMLIFrameElement || e instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if (er.has(e))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return Fi.set(e, !0), !0;
    }
  }
};
function tr(e) {
  try {
    const n = new zo(e).tokenize(), s = new Ko(n).parse(), r = new Vo();
    return function(a = {}) {
      const { scope: o = {}, context: c = null, forceBindingRootScopeToFunctions: d = !1 } = a;
      return r.evaluate({ node: s, scope: o, context: c, forceBindingRootScopeToFunctions: d });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function Go(e, t, n = {}) {
  let i = nr(e), s = Ce([n.scope ?? {}, ...i]), r = n.params ?? [], o = tr(t)({
    scope: s,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && Ne ? o.apply(s, r) : o;
}
function Jo(e, t) {
  let n = nr(e);
  if (typeof t == "function")
    return Xa(n, t);
  let i = Zo(e, t, n);
  return Ka.bind(null, e, t, i);
}
function nr(e) {
  let t = {};
  return Ft(t, e), [t, ...Ze(e)];
}
function Zo(e, t, n) {
  if (e instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (e instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (i = () => {
  }, { scope: s = {}, params: r = [] } = {}) => {
    let a = Ce([s, ...n]), c = tr(t)({
      scope: a,
      forceBindingRootScopeToFunctions: !0
    });
    if (Ne && typeof c == "function") {
      let d = c.apply(c, r);
      d instanceof Promise ? d.then((p) => i(p)) : i(d);
    } else typeof c == "object" && c instanceof Promise ? c.then((d) => i(d)) : i(c);
  };
}
function Xo(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var gt = Object.assign, Yo = Object.prototype.hasOwnProperty, Un = (e, t) => Yo.call(e, t), mt = Array.isArray, pt = (e) => ir(e) === "[object Map]", Qo = (e) => typeof e == "string", xt = (e) => typeof e == "symbol", yt = (e) => e !== null && typeof e == "object", el = Object.prototype.toString, ir = (e) => el.call(e), sr = (e) => ir(e).slice(8, -1), ui = (e) => Qo(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, tl = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, nl = tl((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ae = (e, t) => !Object.is(e, t);
function Pe(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var C, gn = /* @__PURE__ */ new WeakSet(), Hi = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, gn.has(this) && (gn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || il(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Wi(this), ar(this);
    const e = C, t = ie;
    C = this, ie = !0;
    try {
      return this.fn();
    } finally {
      C !== this && Pe(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), or(this), C = e, ie = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        fi(e);
      this.deps = this.depsTail = void 0, Wi(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? gn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
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
}, rr = 0, ht, ft;
function il(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = ft, ft = e;
    return;
  }
  e.next = ht, ht = e;
}
function pi() {
  rr++;
}
function hi() {
  if (--rr > 0)
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
function ar(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function or(e) {
  let t, n = e.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), fi(i), rl(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  e.deps = t, e.depsTail = n;
}
function jn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (sl(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function sl(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === zt) || (e.globalVersion = zt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !jn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = C, i = ie;
  C = e, ie = !0;
  try {
    ar(e);
    const s = e.fn(e._value);
    (t.version === 0 || Ae(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    C = n, ie = i, or(e), e.flags &= -3;
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
function rl(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function al(e, t) {
  e.effect instanceof Hi && (e = e.effect.fn);
  const n = new Hi(e);
  t && gt(n, t);
  try {
    n.run();
  } catch (s) {
    throw n.stop(), s;
  }
  const i = n.run.bind(n);
  return i.effect = n, i;
}
function ol(e) {
  e.effect.stop();
}
var ie = !0, lr = [];
function ll() {
  lr.push(ie), ie = !1;
}
function cl() {
  const e = lr.pop();
  ie = e === void 0 ? !0 : e;
}
function Wi(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = C;
    C = void 0;
    try {
      t();
    } finally {
      C = n;
    }
  }
}
var zt = 0, dl = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, ul = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!C || !ie || C === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== C)
      t = this.activeLink = new dl(C, this), C.deps ? (t.prevDep = C.depsTail, C.depsTail.nextDep = t, C.depsTail = t) : C.deps = C.depsTail = t, cr(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = C.depsTail, t.nextDep = void 0, C.depsTail.nextDep = t, C.depsTail = t, C.deps === t && (C.deps = n);
    }
    return C.onTrack && C.onTrack(
      gt(
        {
          effect: C
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, zt++, this.notify(e);
  }
  notify(e) {
    pi();
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
      hi();
    }
  }
};
function cr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        cr(i);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var Bn = /* @__PURE__ */ new WeakMap(), Re = /* @__PURE__ */ Symbol(
  "Object iterate"
), Fn = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), vt = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function Y(e, t, n) {
  if (ie && C) {
    let i = Bn.get(e);
    i || Bn.set(e, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new ul()), s.map = i, s.key = n), s.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function ve(e, t, n, i, s, r) {
  const a = Bn.get(e);
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
  if (pi(), t === "clear")
    a.forEach(o);
  else {
    const c = mt(e), d = c && ui(n);
    if (c && n === "length") {
      const p = Number(i);
      a.forEach((m, E) => {
        (E === "length" || E === vt || !xt(E) && E >= p) && o(m);
      });
    } else
      switch ((n !== void 0 || a.has(void 0)) && o(a.get(n)), d && o(a.get(vt)), t) {
        case "add":
          c ? d && o(a.get("length")) : (o(a.get(Re)), pt(e) && o(a.get(Fn)));
          break;
        case "delete":
          c || (o(a.get(Re)), pt(e) && o(a.get(Fn)));
          break;
        case "set":
          pt(e) && o(a.get(Re));
          break;
      }
  }
  hi();
}
function Ve(e) {
  const t = I(e);
  return t === e ? t : (Y(t, "iterate", vt), Le(e) ? t : t.map(De));
}
function bi(e) {
  return Y(e = I(e), "iterate", vt), e;
}
function oe(e, t) {
  return $e(e) ? gr(e) ? _t(De(t)) : _t(t) : De(t);
}
var pl = {
  __proto__: null,
  [Symbol.iterator]() {
    return mn(this, Symbol.iterator, (e) => oe(this, e));
  },
  concat(...e) {
    return Ve(this).concat(
      ...e.map((t) => mt(t) ? Ve(t) : t)
    );
  },
  entries() {
    return mn(this, "entries", (e) => (e[1] = oe(this, e[1]), e));
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
    return yn(this, "includes", e);
  },
  indexOf(...e) {
    return yn(this, "indexOf", e);
  },
  join(e) {
    return Ve(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return yn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return de(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return at(this, "pop");
  },
  push(...e) {
    return at(this, "push", e);
  },
  reduce(e, ...t) {
    return zi(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return zi(this, "reduceRight", e, t);
  },
  shift() {
    return at(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return de(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return at(this, "splice", e);
  },
  toReversed() {
    return Ve(this).toReversed();
  },
  toSorted(e) {
    return Ve(this).toSorted(e);
  },
  toSpliced(...e) {
    return Ve(this).toSpliced(...e);
  },
  unshift(...e) {
    return at(this, "unshift", e);
  },
  values() {
    return mn(this, "values", (e) => oe(this, e));
  }
};
function mn(e, t, n) {
  const i = bi(e), s = i[t]();
  return i !== e && !Le(e) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.done || (r.value = n(r.value)), r;
  }), s;
}
var hl = Array.prototype;
function de(e, t, n, i, s, r) {
  const a = bi(e), o = a !== e && !Le(e), c = a[t];
  if (c !== hl[t]) {
    const m = c.apply(e, r);
    return o ? De(m) : m;
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
function zi(e, t, n, i) {
  const s = bi(e), r = s !== e && !Le(e);
  let a = n, o = !1;
  s !== e && (r ? (o = i.length === 0, a = function(d, p, m) {
    return o && (o = !1, d = oe(e, d)), n.call(this, d, oe(e, p), m, e);
  }) : n.length > 3 && (a = function(d, p, m) {
    return n.call(this, d, p, m, e);
  }));
  const c = s[t](a, ...i);
  return o ? oe(e, c) : c;
}
function yn(e, t, n) {
  const i = I(e);
  Y(i, "iterate", vt);
  const s = i[t](...n);
  return (s === -1 || s === !1) && Al(n[0]) ? (n[0] = I(n[0]), i[t](...n)) : s;
}
function at(e, t, n = []) {
  ll(), pi();
  const i = I(e)[t].apply(e, n);
  return hi(), cl(), i;
}
var fl = /* @__PURE__ */ Xo("__proto__,__v_isRef,__isVue"), dr = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(xt)
);
function bl(e) {
  xt(e) || (e = String(e));
  const t = I(this);
  return Y(t, "has", e), t.hasOwnProperty(e);
}
var ur = class {
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
      return n === (i ? s ? kl : fr : s ? Sl : hr).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const r = mt(e);
    if (!i) {
      let o;
      if (r && (o = pl[t]))
        return o;
      if (t === "hasOwnProperty")
        return bl;
    }
    const a = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      bt(e) ? e : n
    );
    if ((xt(t) ? dr.has(t) : fl(t)) || (i || Y(e, "get", t), s))
      return a;
    if (bt(a)) {
      const o = r && ui(t) ? a : a.value;
      return i && yt(o) ? Hn(o) : o;
    }
    return yt(a) ? i ? Hn(a) : gi(a) : a;
  }
}, gl = class extends ur {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, i) {
    let s = e[t];
    const r = mt(e) && ui(t);
    if (!this._isShallow) {
      const c = $e(s);
      if (!Le(n) && !$e(n) && (s = I(s), n = I(n)), !r && bt(s) && !bt(n))
        return c ? (Pe(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (s.value = n, !0);
    }
    const a = r ? Number(t) < e.length : Un(e, t), o = Reflect.set(
      e,
      t,
      n,
      bt(e) ? e : i
    );
    return e === I(i) && o && (a ? Ae(n, s) && ve(e, "set", t, n, s) : ve(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = Un(e, t), i = e[t], s = Reflect.deleteProperty(e, t);
    return s && n && ve(e, "delete", t, void 0, i), s;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!xt(t) || !dr.has(t)) && Y(e, "has", t), n;
  }
  ownKeys(e) {
    return Y(
      e,
      "iterate",
      mt(e) ? "length" : Re
    ), Reflect.ownKeys(e);
  }
}, ml = class extends ur {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, t) {
    return Pe(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, t) {
    return Pe(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, yl = /* @__PURE__ */ new gl(), vl = /* @__PURE__ */ new ml(), Pt = (e) => Reflect.getPrototypeOf(e);
function _l(e, t, n) {
  return function(...i) {
    const s = this.__v_raw, r = I(s), a = pt(r), o = e === "entries" || e === Symbol.iterator && a, c = e === "keys" && a, d = s[e](...i), p = t ? _t : De;
    return !t && Y(
      r,
      "iterate",
      c ? Fn : Re
    ), gt(
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
function $t(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      Pe(
        `${nl(e)} operation ${n}failed: target is readonly.`,
        I(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function wl(e, t) {
  const n = {
    get(s) {
      const r = this.__v_raw, a = I(r), o = I(s);
      e || (Ae(s, o) && Y(a, "get", s), Y(a, "get", o));
      const { has: c } = Pt(a), d = e ? _t : De;
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
      return e || (Ae(s, o) && Y(a, "has", s), Y(a, "has", o)), s === o ? r.has(s) : r.has(s) || r.has(o);
    },
    forEach(s, r) {
      const a = this, o = a.__v_raw, c = I(o), d = e ? _t : De;
      return !e && Y(c, "iterate", Re), o.forEach((p, m) => s.call(r, d(p), d(m), a));
    }
  };
  return gt(
    n,
    e ? {
      add: $t("add"),
      set: $t("set"),
      delete: $t("delete"),
      clear: $t("clear")
    } : {
      add(s) {
        const r = I(this), a = Pt(r), o = I(s), c = !Le(s) && !$e(s) ? o : s;
        return a.has.call(r, c) || Ae(s, c) && a.has.call(r, s) || Ae(o, c) && a.has.call(r, o) || (r.add(c), ve(r, "add", c, c)), this;
      },
      set(s, r) {
        !Le(r) && !$e(r) && (r = I(r));
        const a = I(this), { has: o, get: c } = Pt(a);
        let d = o.call(a, s);
        d ? Ki(a, o, s) : (s = I(s), d = o.call(a, s));
        const p = c.call(a, s);
        return a.set(s, r), d ? Ae(r, p) && ve(a, "set", s, r, p) : ve(a, "add", s, r), this;
      },
      delete(s) {
        const r = I(this), { has: a, get: o } = Pt(r);
        let c = a.call(r, s);
        c ? Ki(r, a, s) : (s = I(s), c = a.call(r, s));
        const d = o ? o.call(r, s) : void 0, p = r.delete(s);
        return c && ve(r, "delete", s, void 0, d), p;
      },
      clear() {
        const s = I(this), r = s.size !== 0, a = pt(s) ? new Map(s) : new Set(s), o = s.clear();
        return r && ve(
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
    n[s] = _l(s, e);
  }), n;
}
function pr(e, t) {
  const n = wl(e);
  return (i, s, r) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? i : Reflect.get(
    Un(n, s) && s in i ? n : i,
    s,
    r
  );
}
var xl = {
  get: /* @__PURE__ */ pr(!1)
}, El = {
  get: /* @__PURE__ */ pr(!0)
};
function Ki(e, t, n) {
  const i = I(n);
  if (i !== n && t.call(e, i)) {
    const s = sr(e);
    Pe(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var hr = /* @__PURE__ */ new WeakMap(), Sl = /* @__PURE__ */ new WeakMap(), fr = /* @__PURE__ */ new WeakMap(), kl = /* @__PURE__ */ new WeakMap();
function Ol(e) {
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
function gi(e) {
  return /* @__PURE__ */ $e(e) ? e : br(
    e,
    !1,
    yl,
    xl,
    hr
  );
}
function Hn(e) {
  return br(
    e,
    !0,
    vl,
    El,
    fr
  );
}
function br(e, t, n, i, s) {
  if (!yt(e))
    return Pe(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = s.get(e);
  if (r)
    return r;
  const a = Ol(sr(e));
  if (a === 0)
    return e;
  const o = new Proxy(
    e,
    a === 2 ? i : n
  );
  return s.set(e, o), o;
}
function gr(e) {
  return /* @__PURE__ */ $e(e) ? /* @__PURE__ */ gr(e.__v_raw) : !!(e && e.__v_isReactive);
}
function $e(e) {
  return !!(e && e.__v_isReadonly);
}
function Le(e) {
  return !!(e && e.__v_isShallow);
}
function Al(e) {
  return e ? !!e.__v_raw : !1;
}
function I(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ I(t) : e;
}
var De = (e) => yt(e) ? /* @__PURE__ */ gi(e) : e, _t = (e) => yt(e) ? /* @__PURE__ */ Hn(e) : e;
function bt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
se("nextTick", () => oi);
se("dispatch", (e) => ut.bind(ut, e));
se("watch", (e, { evaluateLater: t, cleanup: n }) => (i, s) => {
  let r = t(i), o = ds(() => {
    let c;
    return r((d) => c = d), c;
  }, s);
  n(o);
});
se("store", Uo);
se("data", (e) => ys(e));
se("root", (e) => Zt(e));
se("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Ce(Tl(e))), e._x_refs_proxy));
function Tl(e) {
  let t = [];
  return he(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var vn = {};
function mr(e) {
  return vn[e] || (vn[e] = 0), ++vn[e];
}
function Nl(e, t) {
  return he(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Ml(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = mr(t));
}
se("id", (e, { cleanup: t }) => (n, i = null) => {
  let s = `${n}${i ? `-${i}` : ""}`;
  return Rl(e, s, t, () => {
    let r = Nl(e, n), a = r ? r._x_ids[n] : mr(n);
    return i ? `${n}-${a}-${i}` : `${n}-${a}`;
  });
});
Yt((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Rl(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = i();
  return e._x_id[t] = s, n(() => {
    delete e._x_id[t];
  }), s;
}
se("el", (e) => e);
yr("Focus", "focus", "focus");
yr("Persist", "persist", "persist");
function yr(e, t, n) {
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
    let p = e._x_model.get, m = e._x_model.setWithModifiers, E = Zs(
      {
        get() {
          return p();
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
    s(E);
  });
});
B("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && le("x-teleport can only be used on a <template> tag", e);
  let s = Vi(n), r = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = r, r._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    r.addEventListener(o, (c) => {
      c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
    });
  }), wt(r, {}, e);
  let a = (o, c, d) => {
    d.includes("prepend") ? c.parentNode.insertBefore(o, c) : d.includes("append") ? c.parentNode.insertBefore(o, c.nextSibling) : c.appendChild(o);
  };
  j(() => {
    we(() => {
      a(r, s, t), fe(r);
    })();
  }), e._x_teleportPutBack = () => {
    let o = Vi(n);
    j(() => {
      a(e._x_teleport, o, t);
    });
  }, i(
    () => j(() => {
      r.remove(), Ue(r);
    })
  );
});
var Cl = document.createElement("div");
function Vi(e) {
  let t = we(() => document.querySelector(e), () => Cl)();
  return t || le(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var vr = () => {
};
vr.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
B("ignore", vr);
B("effect", we((e, { expression: t }, { effect: n }) => {
  n(X(e, t));
}));
function Je(e, t, n, i) {
  let s = e, r = (c) => i(c), a = {}, o = (c, d) => (p) => d(c, p);
  return n.includes("dot") && (t = Il(t)), n.includes("camel") && (t = Pl(t)), n.includes("capture") && (a.capture = !0), n.includes("window") && (s = window), n.includes("document") && (s = document), n.includes("passive") && (a.passive = n[n.indexOf("passive") + 1] !== "false"), r = _r(n, r), n.includes("prevent") && (r = o(r, (c, d) => {
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
  })), (Ll(t) || wr(t)) && (r = o(r, (c, d) => {
    Dl(d, n) || c(d);
  })), s.addEventListener(t, r, a), () => {
    s.removeEventListener(t, r, a);
  };
}
function _r(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", i = Kt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Gs(t, i);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", i = Kt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Js(t, i);
  }
  return t;
}
function Il(e) {
  return e.replace(/-/g, ".");
}
function Pl(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Kt(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function $l(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Ll(e) {
  return ["keydown", "keyup"].includes(e);
}
function wr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function Dl(e, t) {
  let n = t.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(r));
  if (n.includes("debounce")) {
    let r = n.indexOf("debounce");
    n.splice(r, Kt((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let r = n.indexOf("throttle");
    n.splice(r, Kt((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Gi(e.key).includes(n[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => n.includes(r));
  return n = n.filter((r) => !s.includes(r)), !(s.length > 0 && s.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), e[`${a}Key`])).length === s.length && (wr(e.type) || Gi(e.key).includes(n[0])));
}
function Gi(e) {
  if (!e)
    return [];
  e = $l(e);
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
    return a((g) => v = g), Ji(v) ? v.get() : v;
  }, d = (v) => {
    let g;
    a((S) => g = S), Ji(g) ? g.set(v) : o(() => {
    }, {
      scope: { __placeholder: v }
    });
  };
  typeof n == "string" && e.type === "radio" && j(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let p = t.includes("change") || t.includes("lazy"), m = t.includes("blur"), E = t.includes("enter"), M = p || m || E, D;
  if (_e)
    D = () => {
    };
  else if (M) {
    let v = [], g = (S) => d(Lt(e, t, S, c()));
    if (p && v.push(Je(e, "change", t, g)), m && (v.push(Je(e, "blur", t, g)), e.form)) {
      let S = e.form, P = () => g({ target: e });
      S._x_pendingModelUpdates || (S._x_pendingModelUpdates = []), S._x_pendingModelUpdates.push(P), s(() => {
        S._x_pendingModelUpdates && S._x_pendingModelUpdates.splice(S._x_pendingModelUpdates.indexOf(P), 1);
      });
    }
    E && v.push(Je(e, "keydown", t, (S) => {
      S.key === "Enter" && g(S);
    })), D = () => v.forEach((S) => S());
  } else {
    let v = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    D = Je(e, v, t, (g) => {
      d(Lt(e, t, g, c()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(c()) || Wt(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    Lt(e, t, { target: e }, c())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = D, s(() => e._x_removeModelListeners.default()), e.form) {
    let v = Je(e.form, "reset", [], (g) => {
      oi(() => e._x_model && e._x_model.set(Lt(e, t, { target: e }, c())));
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
    setWithModifiers: _r(t, d)
  }, e._x_forceModelUpdate = (v) => {
    v === void 0 && typeof n == "string" && n.match(/\./) && (v = ""), j(() => {
      Wt(e) ? Array.isArray(v) ? e.checked = v.some((g) => g == e.value) : e.checked = !!v : di(e) ? typeof v == "boolean" ? e.checked = qt(e.value) === v : e.checked = e.value == v : zs(e, "value", v);
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
    if (Wt(e))
      if (Array.isArray(i)) {
        let s = null;
        return t.includes("number") ? s = _n(n.target.value) : t.includes("boolean") ? s = qt(n.target.value) : s = n.target.value, n.target.checked ? i.includes(s) ? i : i.concat([s]) : i.filter((r) => !ql(r, s));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return _n(r);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return qt(r);
        }) : Array.from(n.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return di(e) ? n.target.checked ? s = n.target.value : s = i : s = n.target.value, t.includes("number") ? _n(s) : t.includes("boolean") ? qt(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function _n(e) {
  let t = e ? parseFloat(e) : null;
  return Ul(t) ? t : e;
}
function ql(e, t) {
  return e == t;
}
function Ul(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ji(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
B("cloak", (e) => queueMicrotask(() => j(() => e.removeAttribute(et("cloak")))));
Us(() => `[${et("init")}]`);
B("init", we((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
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
        Array.from(e.children).forEach((a) => Ue(a)), e.innerHTML = r ?? "", e._x_ignoreSelf = !0, fe(e), delete e._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
si(Ns(":", Ms(et("bind:"))));
var xr = (e, { value: t, modifiers: n, expression: i, original: s }, { effect: r, cleanup: a }) => {
  if (!t) {
    let c = {};
    Bo(c), X(e, i)((p) => {
      Ys(e, p, s);
    }, { scope: c });
    return;
  }
  if (t === "key")
    return jl(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = X(e, i);
  r(() => o((c) => {
    c === void 0 && typeof i == "string" && i.match(/\./) && (c = ""), j(() => zs(e, t, c, n));
  })), a(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
xr.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
B("bind", xr);
function jl(e, t) {
  e._x_keyExpression = t;
}
qs(() => `[${et("data")}]`);
var Oe = /* @__PURE__ */ Symbol();
B("data", (e, { expression: t }, { cleanup: n }) => {
  if (Fl(e))
    return;
  let i = e[Oe];
  if (i?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let s = {};
  Ft(s, e);
  let r = {};
  Ho(r, s);
  let a = Me(e, t, { scope: r });
  (a === void 0 || a === !0) && (a = {}), Ft(a, e);
  let o;
  if (i?.reactiveData) {
    o = i.reactiveData, Bl(o, a);
    let d = { expression: t };
    e[Oe] = d, queueMicrotask(() => {
      e[Oe] === d && delete e[Oe];
    });
  } else
    o = Ye(a);
  ei(o, n);
  let c = wt(e, o);
  o.init && Me(e, o.init), n(() => {
    o.destroy && Me(e, o.destroy), c();
    let d = { reactiveData: o };
    e[Oe] = d, queueMicrotask(() => {
      e[Oe] === d && delete e[Oe];
    });
  });
});
function Bl(e, t) {
  Object.keys(t).forEach((n) => {
    let i = Object.getOwnPropertyDescriptor(t, n), s = Object.getOwnPropertyDescriptor(e, n);
    i.get || i.set || s?.get || s?.set ? (s && delete e[n], s || (e[n] = void 0), i.get || i.set ? Object.defineProperty(e, n, i) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
Yt((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Fl(e) {
  return _e ? qn ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
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
  }, o = () => setTimeout(a), c = Ln(
    (m) => m ? a() : r(),
    (m) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, m, a, r) : m ? o() : r();
    }
  ), d, p = !0;
  i(() => s((m) => {
    !p && m === d || (t.includes("immediate") && (m ? o() : r()), c(m), d = m, p = !1);
  }));
});
B("for", we((e, { expression: t }, { effect: n, cleanup: i }) => {
  let s = zl(t), r = X(e, s.items), a = X(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => Wl(e, s, r, a), { priority: "structural" }), i(() => {
    e._x_lookup.forEach(
      (o) => j(() => {
        Ue(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function Hl(e) {
  return (t) => {
    Object.entries(t).forEach(([n, i]) => {
      e[n] = i;
    });
  };
}
function Wl(e, t, n, i) {
  n((s) => {
    Vl(s) && (s = Array.from({ length: s }, (d, p) => p + 1)), s == null && (s = []), s instanceof Set && (s = Array.from(s)), s instanceof Map && (s = Array.from(s));
    let r = e._x_lookup, a = /* @__PURE__ */ new Map();
    e._x_lookup = a;
    let o = Gl(s), c = Object.entries(s).map(([d, p]) => {
      o || (d = parseInt(d));
      let m = Kl(t, p, d, s), E;
      return i((M) => {
        typeof M == "object" && le("x-for key cannot be an object, it must be a string or an integer", e), r.has(M) && (a.set(M, r.get(M)), r.delete(M)), E = M;
      }, { scope: { index: d, ...m } }), [E, m];
    });
    j(() => {
      r.forEach((m) => {
        Ue(m), m.remove();
      });
      let d = /* @__PURE__ */ new Set(), p = e;
      c.forEach(([m, E]) => {
        if (a.has(m)) {
          let v = a.get(m);
          v._x_refreshXForScope(E), p.nextElementSibling !== v && (p.nextElementSibling && v.replaceWith(p.nextElementSibling), p.after(v)), p = v, v._x_currentIfEl && (v.nextElementSibling !== v._x_currentIfEl && p.after(v._x_currentIfEl), p = v._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && le("x-for templates require a single root element, additional elements will be ignored.", e);
        let M = document.importNode(e.content, !0).firstElementChild, D = Ye(E);
        wt(M, D, e), M._x_refreshXForScope = Hl(D), a.set(m, M), d.add(M), p.after(M), p = M;
      }), d.forEach((m) => fe(m)), p !== e ? e._x_lastRenderedEl = p : delete e._x_lastRenderedEl;
    });
  });
}
function zl(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = e.match(i);
  if (!s)
    return;
  let r = {};
  r.items = s[2].trim();
  let a = s[1].replace(n, "").trim(), o = a.match(t);
  return o ? (r.item = a.replace(t, "").trim(), r.index = o[1].trim(), o[2] && (r.collection = o[2].trim())) : r.item = a, r;
}
function Kl(e, t, n, i) {
  let s = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    s[a] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    s[a] = t[a];
  }) : s[e.item] = t, e.index && (s[e.index] = n), e.collection && (s[e.collection] = i), s;
}
function Vl(e) {
  return typeof e != "object" && !isNaN(e);
}
function Gl(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function Er() {
}
Er.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = Zt(e);
  i && (i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]));
};
B("ref", Er);
B("if", we((e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && le("x-if can only be used on a <template> tag", e);
  let s = X(e, t), r = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return wt(o, {}, e), j(() => {
      e.after(o), fe(o);
    }), e._x_currentIfEl = o, e._x_lastRenderedEl = o, e._x_undoIf = () => {
      j(() => {
        Ue(o), o.remove();
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
  n(t).forEach((s) => Ml(e, s));
});
Yt((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
si(Ns("@", Ms(et("on:"))));
B("on", we((e, { value: t, modifiers: n, expression: i }, { cleanup: s }) => {
  let r = i ? X(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let a = Je(e, t, n, (o) => {
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
  B(t, (i) => le(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
B("html", (e, { expression: t }) => {
  ti(new Error("Using the x-html directive is prohibited in the CSP build"), e);
});
tt.setEvaluator(Jo);
tt.setRawEvaluator(Go);
tt.setReactivityEngine({
  reactive: gi,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = al(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: ol,
  raw: I
});
var Jl = tt, dt = Jl;
function Zl(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const Vt = "__siteationDebugBarHostLock";
function Xl(e) {
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
function Yl() {
  const e = window[Vt];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[Vt]);
}
function Zi(e, t) {
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
    id: "history",
    label: "History",
    lead: "Every request still on disk, so an earlier one is one click away.",
    graded: !1
  }
];
function Sr(e, t) {
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
const Ql = {
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
  caret: '<path d="m6 9 6 6 6-6"/>'
};
function G(e, t = "") {
  return `<svg class="ndb-icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${Ql[e] || ""}</svg>`;
}
function ec(e) {
  return [...tc(e), ...nc(e), ...ic(e)];
}
function tc(e) {
  return Wn.map((t) => {
    const n = Sr(t.id, e);
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
function nc(e) {
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
function ic(e) {
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
function sc(e, t) {
  const n = String(t || "").trim().toLowerCase(), i = n ? e.filter((s) => `${s.group} ${s.label} ${s.keywords}`.toLowerCase().includes(n)) : e;
  return i.map((s, r) => ({
    ...s,
    leads: r === 0 || i[r - 1].group !== s.group
  }));
}
function rc() {
  return `
<div class="ndb-palette" data-ndb-bind:class="paletteOpen && 'is-open'"
     data-ndb-on:keydown="paletteKeys($event)">
  <div class="ndb-palette-backdrop" data-ndb-on:click="closePalette()"></div>

  <div class="ndb-palette-box" data-ndb-ref="palette"
       role="dialog" aria-modal="true" aria-label="Commands">
    <div class="ndb-palette-field">
      ${G("search")}
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
const Xe = "full", kr = "masked", je = "none", ac = "[redacted]", oc = "[masked]", lc = "[maximum depth reached]", cc = "[circular]", dc = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, uc = 5, Ut = 100, Xi = 400;
function pc(e) {
  return [Xe, kr, je].includes(e) ? e : Xe;
}
function hc(e) {
  return dc.test(String(e));
}
function Or(e, t = Xe) {
  if (t !== je)
    return mi(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function Gt(e, t = Xe) {
  return t === je ? "" : t === kr ? e === "" ? "" : oc : e.length <= Xi ? e : `${e.slice(0, Xi)}...`;
}
function Ar(e, t = Xe) {
  if (t === je) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return Gt(n, Xe);
}
function mi(e, t, n, i) {
  if (e == null) return e;
  const s = typeof e;
  return s === "string" ? Gt(e, t) : s === "number" || s === "boolean" ? e : s === "function" ? `ƒ ${e.name || "anonymous"}()` : s === "symbol" ? e.toString() : s === "bigint" ? `${e}n` : s !== "object" ? s : e instanceof Node ? gc(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${Gt(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= uc ? lc : i.has(e) ? cc : (i.add(e), Array.isArray(e) ? fc(e, t, n, i) : bc(e, t, n, i));
}
function fc(e, t, n, i) {
  const s = e.slice(0, Ut).map((r) => mi(r, t, n + 1, i));
  return e.length > Ut && s.push(`[${e.length - Ut} more]`), s;
}
function bc(e, t, n, i) {
  const s = yi(e), r = /* @__PURE__ */ Object.create(null);
  let a = 0;
  for (const o of s) {
    if (a >= Ut) {
      r.__truncated__ = s.length - a;
      break;
    }
    if (hc(o)) {
      r[o] = ac, a++;
      continue;
    }
    try {
      r[o] = mi(e[o], t, n + 1, i);
    } catch (c) {
      r[o] = `[unreadable: ${c && c.message ? c.message : "threw"}]`;
    }
    a++;
  }
  return r;
}
function yi(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function gc(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
function mc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var wn, Yi;
function yc() {
  if (Yi) return wn;
  Yi = 1;
  function e(l) {
    return l instanceof Map ? l.clear = l.delete = l.set = function() {
      throw new Error("map is read-only");
    } : l instanceof Set && (l.add = l.clear = l.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(l), Object.getOwnPropertyNames(l).forEach((u) => {
      const f = l[u], O = typeof f;
      (O === "object" || O === "function") && !Object.isFrozen(f) && e(f);
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
    for (const O in l)
      f[O] = l[O];
    return u.forEach(function(O) {
      for (const q in O)
        f[q] = O[q];
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
        ...f.map((O, q) => `${O}${"_".repeat(q + 1)}`)
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
      return typeof f == "string" ? u.addText(f) : f.children && (u.openNode(f), f.children.forEach((O) => this._walk(u, O)), u.closeNode(f)), u;
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
      const O = u.root;
      f && (O.scope = `language:${f}`), this.add(O);
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
  function M(l) {
    return v("(?:", l, ")*");
  }
  function D(l) {
    return v("(?:", l, ")?");
  }
  function v(...l) {
    return l.map((f) => m(f)).join("");
  }
  function g(l) {
    const u = l[l.length - 1];
    return typeof u == "object" && u.constructor === Object ? (l.splice(l.length - 1, 1), u) : {};
  }
  function S(...l) {
    return "(" + (g(l).capture ? "" : "?:") + l.map((O) => m(O)).join("|") + ")";
  }
  function P(l) {
    return new RegExp(l.toString() + "|").exec("").length - 1;
  }
  function Be(l, u) {
    const f = l && l.exec(u);
    return f && f.index === 0;
  }
  const Fe = new RegExp(S(
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
    return l.map((O) => {
      f += 1;
      const q = f;
      let U = m(O), _ = "";
      for (; U.length > 0; ) {
        const y = Fe.exec(U);
        if (!y) {
          _ += U;
          break;
        }
        _ += U.substring(0, y.index), U = U.substring(y.index + y[0].length), y[0][0] === "\\" && y[1] ? _ += "\\" + String(Number(y[1]) + q) : (_ += y[0], (y[0] === "(" || /^\(\?[<']/.test(y[0])) && f++);
      }
      return _;
    }).map((O) => `(${O})`).join(u);
  }
  const Q = /\b\B/, He = "[a-zA-Z]\\w*", be = "[a-zA-Z_]\\w*", te = "\\b\\d+(\\.\\d+)?", Et = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", St = "\\b(0b[01]+)", nn = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", sn = (l = {}) => {
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
      "on:begin": (f, O) => {
        f.index !== 0 && O.ignoreMatch();
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
  }, K = function(l, u, f = {}) {
    const O = i(
      {
        scope: "comment",
        begin: l,
        end: u,
        contains: []
      },
      f
    );
    O.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const q = S(
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
    return O.contains.push(
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
    ), O;
  }, ge = K("//", "$"), Ee = K("/\\*", "\\*/"), We = K("#", "$"), nt = {
    scope: "number",
    begin: te,
    relevance: 0
  }, Ot = {
    scope: "number",
    begin: Et,
    relevance: 0
  }, $r = {
    scope: "number",
    begin: St,
    relevance: 0
  }, Lr = {
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
  }, Dr = {
    scope: "title",
    begin: He,
    relevance: 0
  }, qr = {
    scope: "title",
    begin: be,
    relevance: 0
  }, Ur = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + be,
    relevance: 0
  };
  var At = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: rn,
    BACKSLASH_ESCAPE: xe,
    BINARY_NUMBER_MODE: $r,
    BINARY_NUMBER_RE: St,
    COMMENT: K,
    C_BLOCK_COMMENT_MODE: Ee,
    C_LINE_COMMENT_MODE: ge,
    C_NUMBER_MODE: Ot,
    C_NUMBER_RE: Et,
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
    METHOD_GUARD: Ur,
    NUMBER_MODE: nt,
    NUMBER_RE: te,
    PHRASAL_WORDS_MODE: an,
    QUOTE_STRING_MODE: kt,
    REGEXP_MODE: Lr,
    RE_STARTERS_RE: nn,
    SHEBANG: sn,
    TITLE_MODE: Dr,
    UNDERSCORE_IDENT_RE: be,
    UNDERSCORE_TITLE_MODE: qr
  });
  function jr(l, u) {
    l.input[l.index - 1] === "." && u.ignoreMatch();
  }
  function Br(l, u) {
    l.className !== void 0 && (l.scope = l.className, delete l.className);
  }
  function Fr(l, u) {
    u && l.beginKeywords && (l.begin = "\\b(" + l.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", l.__beforeBegin = jr, l.keywords = l.keywords || l.beginKeywords, delete l.beginKeywords, l.relevance === void 0 && (l.relevance = 0));
  }
  function Hr(l, u) {
    Array.isArray(l.illegal) && (l.illegal = S(...l.illegal));
  }
  function Wr(l, u) {
    if (l.match) {
      if (l.begin || l.end) throw new Error("begin & end are not supported with match");
      l.begin = l.match, delete l.match;
    }
  }
  function zr(l, u) {
    l.relevance === void 0 && (l.relevance = 1);
  }
  const Kr = (l, u) => {
    if (!l.beforeMatch) return;
    if (l.starts) throw new Error("beforeMatch cannot be used with starts");
    const f = Object.assign({}, l);
    Object.keys(l).forEach((O) => {
      delete l[O];
    }), l.keywords = f.keywords, l.begin = v(f.beforeMatch, E(f.begin)), l.starts = {
      relevance: 0,
      contains: [
        Object.assign(f, { endsParent: !0 })
      ]
    }, l.relevance = 0, delete f.beforeMatch;
  }, Vr = [
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
  ], Gr = "keyword";
  function wi(l, u, f = Gr) {
    const O = /* @__PURE__ */ Object.create(null);
    return typeof l == "string" ? q(f, l.split(" ")) : Array.isArray(l) ? q(f, l) : Object.keys(l).forEach(function(U) {
      Object.assign(
        O,
        wi(l[U], u, U)
      );
    }), O;
    function q(U, _) {
      u && (_ = _.map((y) => y.toLowerCase())), _.forEach(function(y) {
        const k = y.split("|");
        O[k[0]] = [U, Jr(k[0], k[1])];
      });
    }
  }
  function Jr(l, u) {
    return u ? Number(u) : Zr(l) ? 0 : 1;
  }
  function Zr(l) {
    return Vr.includes(l.toLowerCase());
  }
  const xi = {}, Se = (l) => {
    console.error(l);
  }, Ei = (l, ...u) => {
    console.log(`WARN: ${l}`, ...u);
  }, ze = (l, u) => {
    xi[`${l}/${u}`] || (console.log(`Deprecated as of ${l}. ${u}`), xi[`${l}/${u}`] = !0);
  }, Tt = new Error();
  function Si(l, u, { key: f }) {
    let O = 0;
    const q = l[f], U = {}, _ = {};
    for (let y = 1; y <= u.length; y++)
      _[y + O] = q[y], U[y + O] = !0, O += P(u[y - 1]);
    l[f] = _, l[f]._emit = U, l[f]._multi = !0;
  }
  function Xr(l) {
    if (Array.isArray(l.begin)) {
      if (l.skip || l.excludeBegin || l.returnBegin)
        throw Se("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Tt;
      if (typeof l.beginScope != "object" || l.beginScope === null)
        throw Se("beginScope must be object"), Tt;
      Si(l, l.begin, { key: "beginScope" }), l.begin = Z(l.begin, { joinWith: "" });
    }
  }
  function Yr(l) {
    if (Array.isArray(l.end)) {
      if (l.skip || l.excludeEnd || l.returnEnd)
        throw Se("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Tt;
      if (typeof l.endScope != "object" || l.endScope === null)
        throw Se("endScope must be object"), Tt;
      Si(l, l.end, { key: "endScope" }), l.end = Z(l.end, { joinWith: "" });
    }
  }
  function Qr(l) {
    l.scope && typeof l.scope == "object" && l.scope !== null && (l.beginScope = l.scope, delete l.scope);
  }
  function ea(l) {
    Qr(l), typeof l.beginScope == "string" && (l.beginScope = { _wrap: l.beginScope }), typeof l.endScope == "string" && (l.endScope = { _wrap: l.endScope }), Xr(l), Yr(l);
  }
  function ta(l) {
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
      addRule(y, k) {
        k.position = this.position++, this.matchIndexes[this.matchAt] = k, this.regexes.push([k, y]), this.matchAt += P(y) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const y = this.regexes.map((k) => k[1]);
        this.matcherRe = u(Z(y, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(y) {
        this.matcherRe.lastIndex = this.lastIndex;
        const k = this.matcherRe.exec(y);
        if (!k)
          return null;
        const z = k.findIndex((it, ln) => ln > 0 && it !== void 0), F = this.matchIndexes[z];
        return k.splice(0, z), Object.assign(k, F);
      }
    }
    class O {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(y) {
        if (this.multiRegexes[y]) return this.multiRegexes[y];
        const k = new f();
        return this.rules.slice(y).forEach(([z, F]) => k.addRule(z, F)), k.compile(), this.multiRegexes[y] = k, k;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(y, k) {
        this.rules.push([y, k]), k.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(y) {
        const k = this.getMatcher(this.regexIndex);
        k.lastIndex = this.lastIndex;
        let z = k.exec(y);
        if (this.resumingScanAtSamePosition() && !(z && z.index === this.lastIndex)) {
          const F = this.getMatcher(0);
          F.lastIndex = this.lastIndex + 1, z = F.exec(y);
        }
        return z && (this.regexIndex += z.position + 1, this.regexIndex === this.count && this.considerAll()), z;
      }
    }
    function q(_) {
      const y = new O();
      return _.contains.forEach((k) => y.addRule(k.begin, { rule: k, type: "begin" })), _.terminatorEnd && y.addRule(_.terminatorEnd, { type: "end" }), _.illegal && y.addRule(_.illegal, { type: "illegal" }), y;
    }
    function U(_, y) {
      const k = (
        /** @type CompiledMode */
        _
      );
      if (_.isCompiled) return k;
      [
        Br,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Wr,
        ea,
        Kr
      ].forEach((F) => F(_, y)), l.compilerExtensions.forEach((F) => F(_, y)), _.__beforeBegin = null, [
        Fr,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Hr,
        // default to 1 relevance if not specified
        zr
      ].forEach((F) => F(_, y)), _.isCompiled = !0;
      let z = null;
      return typeof _.keywords == "object" && _.keywords.$pattern && (_.keywords = Object.assign({}, _.keywords), z = _.keywords.$pattern, delete _.keywords.$pattern), z = z || /\w+/, _.keywords && (_.keywords = wi(_.keywords, l.case_insensitive)), k.keywordPatternRe = u(z, !0), y && (_.begin || (_.begin = /\B|\b/), k.beginRe = u(k.begin), !_.end && !_.endsWithParent && (_.end = /\B|\b/), _.end && (k.endRe = u(k.end)), k.terminatorEnd = m(k.end) || "", _.endsWithParent && y.terminatorEnd && (k.terminatorEnd += (_.end ? "|" : "") + y.terminatorEnd)), _.illegal && (k.illegalRe = u(
        /** @type {RegExp | string} */
        _.illegal
      )), _.contains || (_.contains = []), _.contains = [].concat(..._.contains.map(function(F) {
        return na(F === "self" ? _ : F);
      })), _.contains.forEach(function(F) {
        U(
          /** @type Mode */
          F,
          k
        );
      }), _.starts && U(_.starts, y), k.matcher = q(k), k;
    }
    if (l.compilerExtensions || (l.compilerExtensions = []), l.contains && l.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return l.classNameAliases = i(l.classNameAliases || {}), U(
      /** @type Mode */
      l
    );
  }
  function ki(l) {
    return l ? l.endsWithParent || ki(l.starts) : !1;
  }
  function na(l) {
    return l.variants && !l.cachedVariants && (l.cachedVariants = l.variants.map(function(u) {
      return i(l, { variants: null }, u);
    })), l.cachedVariants ? l.cachedVariants : ki(l) ? i(l, { starts: l.starts ? i(l.starts) : null }) : Object.isFrozen(l) ? i(l) : l;
  }
  var ia = "11.12.0";
  class sa extends Error {
    constructor(u, f) {
      super(u), this.name = "HTMLInjectionError", this.html = f;
    }
  }
  const on = n, Oi = i, Ai = /* @__PURE__ */ Symbol("nomatch"), ra = 7, Ti = function(l) {
    const u = /* @__PURE__ */ Object.create(null), f = /* @__PURE__ */ Object.create(null), O = [];
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
    function k(h) {
      return y.noHighlightRe.test(h);
    }
    function z(h) {
      let x = h.className + " ";
      x += h.parentNode ? h.parentNode.className : "";
      const N = y.languageDetectRe.exec(x);
      if (N) {
        const $ = me(N[1]);
        return $ || (Ei(U.replace("{}", N[1])), Ei("Falling back to no-highlight mode for this block.", h)), $ ? N[1] : "no-highlight";
      }
      return x.split(/\s+/).find(($) => k($) || me($));
    }
    function F(h, x, N) {
      let $ = "", H = "";
      typeof x == "object" ? ($ = h, N = x.ignoreIllegals, H = x.language) : (ze("10.7.0", "highlight(lang, code, ...args) has been deprecated."), ze("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), H = h, $ = x), N === void 0 && (N = !0);
      const ne = {
        code: $,
        language: H
      };
      Mt("before:highlight", ne);
      const ye = ne.result ? ne.result : it(ne.language, ne.code, N);
      return ye.code = ne.code, Mt("after:highlight", ye), ye;
    }
    function it(h, x, N, $) {
      const H = /* @__PURE__ */ Object.create(null);
      function ne(b, w) {
        return b.keywords[w];
      }
      function ye() {
        if (!A.keywords) {
          V.addText(L);
          return;
        }
        let b = 0;
        A.keywordPatternRe.lastIndex = 0;
        let w = A.keywordPatternRe.exec(L), T = "";
        for (; w; ) {
          T += L.substring(b, w.index);
          const R = ae.case_insensitive ? w[0].toLowerCase() : w[0], J = ne(A, R);
          if (J) {
            const [ce, xa] = J;
            if (V.addText(T), T = "", H[R] = (H[R] || 0) + 1, H[R] <= ra && (It += xa), ce.startsWith("_"))
              T += w[0];
            else {
              const Ea = ae.classNameAliases[ce] || ce;
              re(w[0], Ea);
            }
          } else
            T += w[0];
          b = A.keywordPatternRe.lastIndex, w = A.keywordPatternRe.exec(L);
        }
        T += L.substring(b), V.addText(T);
      }
      function Rt() {
        if (L === "") return;
        let b = null;
        if (typeof A.subLanguage == "string") {
          if (!u[A.subLanguage]) {
            V.addText(L);
            return;
          }
          b = it(A.subLanguage, L, !0, Li[A.subLanguage]), Li[A.subLanguage] = /** @type {CompiledMode} */
          b._top;
        } else
          b = cn(L, A.subLanguage.length ? A.subLanguage : null);
        A.relevance > 0 && (It += b.relevance), V.__addSublanguage(b._emitter, b.language);
      }
      function ee() {
        A.subLanguage != null ? Rt() : ye(), L = "";
      }
      function re(b, w) {
        b !== "" && (V.startScope(w), V.addText(b), V.endScope());
      }
      function Ci(b, w) {
        let T = 1;
        const R = w.length - 1;
        for (; T <= R; ) {
          if (!b._emit[T]) {
            T++;
            continue;
          }
          const J = ae.classNameAliases[b[T]] || b[T], ce = w[T];
          J ? re(ce, J) : (L = ce, ye(), L = ""), T++;
        }
      }
      function Ii(b, w) {
        return b.scope && typeof b.scope == "string" && V.openNode(ae.classNameAliases[b.scope] || b.scope), b.beginScope && (b.beginScope._wrap ? (re(L, ae.classNameAliases[b.beginScope._wrap] || b.beginScope._wrap), L = "") : b.beginScope._multi && (Ci(b.beginScope, w), L = "")), A = Object.create(b, { parent: { value: A } }), A;
      }
      function Pi(b, w, T) {
        let R = Be(b.endRe, T);
        if (R) {
          if (b["on:end"]) {
            const J = new t(b);
            b["on:end"](w, J), J.isMatchIgnored && (R = !1);
          }
          if (R) {
            for (; b.endsParent && b.parent; )
              b = b.parent;
            return b;
          }
        }
        if (b.endsWithParent)
          return Pi(b.parent, w, T);
      }
      function ma(b) {
        return A.matcher.regexIndex === 0 ? (L += b[0], 1) : (hn = !0, 0);
      }
      function ya(b) {
        const w = b[0], T = b.rule, R = new t(T), J = [T.__beforeBegin, T["on:begin"]];
        for (const ce of J)
          if (ce && (ce(b, R), R.isMatchIgnored))
            return ma(w);
        return T.skip ? L += w : (T.excludeBegin && (L += w), ee(), !T.returnBegin && !T.excludeBegin && (L = w)), Ii(T, b), T.returnBegin ? 0 : w.length;
      }
      function va(b) {
        const w = b[0], T = x.substring(b.index), R = Pi(A, b, T);
        if (!R)
          return Ai;
        const J = A;
        A.endScope && A.endScope._wrap ? (ee(), re(w, A.endScope._wrap)) : A.endScope && A.endScope._multi ? (ee(), Ci(A.endScope, b)) : J.skip ? L += w : (J.returnEnd || J.excludeEnd || (L += w), ee(), J.excludeEnd && (L = w));
        do
          A.scope && V.closeNode(), !A.skip && !A.subLanguage && (It += A.relevance), A = A.parent;
        while (A !== R.parent);
        return R.starts && Ii(R.starts, b), J.returnEnd ? 0 : w.length;
      }
      function _a() {
        const b = [];
        for (let w = A; w !== ae; w = w.parent)
          w.scope && b.unshift(w.scope);
        b.forEach((w) => V.openNode(w));
      }
      let Ct = {};
      function $i(b, w) {
        const T = w && w[0];
        if (L += b, T == null)
          return ee(), 0;
        if (Ct.type === "begin" && w.type === "end" && Ct.index === w.index && T === "") {
          if (L += x.slice(w.index, w.index + 1), !q) {
            const R = new Error(`0 width match regex (${h})`);
            throw R.languageName = h, R.badRule = Ct.rule, R;
          }
          return 1;
        }
        if (Ct = w, w.type === "begin")
          return ya(w);
        if (w.type === "illegal" && !N) {
          const R = new Error('Illegal lexeme "' + T + '" for mode "' + (A.scope || "<unnamed>") + '"');
          throw R.mode = A, R;
        } else if (w.type === "end") {
          const R = va(w);
          if (R !== Ai)
            return R;
        }
        if (w.type === "illegal" && T === "")
          return w.index === x.length || (L += `
`), 1;
        if (pn > 1e5 && pn > w.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return L += T, T.length;
      }
      const ae = me(h);
      if (!ae)
        throw Se(U.replace("{}", h)), new Error('Unknown language: "' + h + '"');
      const wa = ta(ae);
      let un = "", A = $ || wa;
      const Li = {}, V = new y.__emitter(y);
      _a();
      let L = "", It = 0, ke = 0, pn = 0, hn = !1;
      try {
        if (ae.__emitTokens)
          ae.__emitTokens(x, V);
        else {
          for (A.matcher.considerAll(); ; ) {
            pn++, hn ? hn = !1 : A.matcher.considerAll(), A.matcher.lastIndex = ke;
            const b = A.matcher.exec(x);
            if (!b) break;
            const w = x.substring(ke, b.index), T = $i(w, b);
            ke = b.index + T;
          }
          $i(x.substring(ke));
        }
        return V.finalize(), un = V.toHTML(), {
          language: h,
          value: un,
          relevance: It,
          illegal: !1,
          _emitter: V,
          _top: A
        };
      } catch (b) {
        if (b.message && b.message.includes("Illegal"))
          return {
            language: h,
            value: on(x),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: b.message,
              index: ke,
              context: x.slice(ke - 100, ke + 100),
              mode: b.mode,
              resultSoFar: un
            },
            _emitter: V
          };
        if (q)
          return {
            language: h,
            value: on(x),
            illegal: !1,
            relevance: 0,
            errorRaised: b,
            _emitter: V,
            _top: A
          };
        throw b;
      }
    }
    function ln(h) {
      const x = {
        value: on(h),
        illegal: !1,
        relevance: 0,
        _top: _,
        _emitter: new y.__emitter(y)
      };
      return x._emitter.addText(h), x;
    }
    function cn(h, x) {
      x = x || y.languages || Object.keys(u);
      const N = ln(h), $ = x.filter(me).filter(Ri).map(
        (ee) => it(ee, h, !1)
      );
      $.unshift(N);
      const H = $.sort((ee, re) => {
        if (ee.relevance !== re.relevance) return re.relevance - ee.relevance;
        if (ee.language && re.language) {
          if (me(ee.language).supersetOf === re.language)
            return 1;
          if (me(re.language).supersetOf === ee.language)
            return -1;
        }
        return 0;
      }), [ne, ye] = H, Rt = ne;
      return Rt.secondBest = ye, Rt;
    }
    function aa(h, x, N) {
      const $ = x && f[x] || N;
      h.classList.add("hljs"), h.classList.add(`language-${$}`);
    }
    function dn(h) {
      let x = null;
      const N = z(h);
      if (k(N)) return;
      if (Mt(
        "before:highlightElement",
        { el: h, language: N }
      ), h.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", h);
        return;
      }
      if (h.children.length > 0 && (y.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(h)), y.throwUnescapedHTML))
        throw new sa(
          "One of your code blocks includes unescaped HTML.",
          h.innerHTML
        );
      x = h;
      const $ = x.textContent, H = N ? F($, { language: N, ignoreIllegals: !0 }) : cn($);
      h.innerHTML = H.value, h.dataset.highlighted = "yes", aa(h, N, H.language), h.result = {
        language: H.language,
        // TODO: remove with version 11.0
        re: H.relevance,
        relevance: H.relevance
      }, H.secondBest && (h.secondBest = {
        language: H.secondBest.language,
        relevance: H.secondBest.relevance
      }), Mt("after:highlightElement", { el: h, result: H, text: $ });
    }
    function oa(h) {
      y = Oi(y, h);
    }
    const la = () => {
      Nt(), ze("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function ca() {
      Nt(), ze("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Ni = !1;
    function Nt() {
      function h() {
        Nt();
      }
      if (document.readyState === "loading") {
        Ni || window.addEventListener("DOMContentLoaded", h, !1), Ni = !0;
        return;
      }
      document.querySelectorAll(y.cssSelector).forEach(dn);
    }
    function da(h, x) {
      let N = null;
      try {
        N = x(l);
      } catch ($) {
        if (Se("Language definition for '{}' could not be registered.".replace("{}", h)), q)
          Se($);
        else
          throw $;
        N = _;
      }
      N.name || (N.name = h), u[h] = N, N.rawDefinition = x.bind(null, l), N.aliases && Mi(N.aliases, { languageName: h });
    }
    function ua(h) {
      delete u[h];
      for (const x of Object.keys(f))
        f[x] === h && delete f[x];
    }
    function pa() {
      return Object.keys(u);
    }
    function me(h) {
      return h = (h || "").toLowerCase(), u[h] || u[f[h]];
    }
    function Mi(h, { languageName: x }) {
      typeof h == "string" && (h = [h]), h.forEach((N) => {
        f[N.toLowerCase()] = x;
      });
    }
    function Ri(h) {
      const x = me(h);
      return x && !x.disableAutodetect;
    }
    function ha(h) {
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
    function fa(h) {
      ha(h), O.push(h);
    }
    function ba(h) {
      const x = O.indexOf(h);
      x !== -1 && O.splice(x, 1);
    }
    function Mt(h, x) {
      const N = h;
      O.forEach(function($) {
        $[N] && $[N](x);
      });
    }
    function ga(h) {
      return ze("10.7.0", "highlightBlock will be removed entirely in v12.0"), ze("10.7.0", "Please use highlightElement now."), dn(h);
    }
    Object.assign(l, {
      highlight: F,
      highlightAuto: cn,
      highlightAll: Nt,
      highlightElement: dn,
      // TODO: Remove with v12 API
      highlightBlock: ga,
      configure: oa,
      initHighlighting: la,
      initHighlightingOnLoad: ca,
      registerLanguage: da,
      unregisterLanguage: ua,
      listLanguages: pa,
      getLanguage: me,
      registerAliases: Mi,
      autoDetection: Ri,
      inherit: Oi,
      addPlugin: fa,
      removePlugin: ba
    }), l.debugMode = function() {
      q = !1;
    }, l.safeMode = function() {
      q = !0;
    }, l.versionString = ia, l.regex = {
      concat: v,
      lookahead: E,
      either: S,
      optional: D,
      anyNumberOfTimes: M
    };
    for (const h in At)
      typeof At[h] == "object" && e(At[h]);
    return Object.assign(l, At), l;
  }, Ke = Ti({});
  return Ke.newInstance = () => Ti({}), wn = Ke, Ke.HighlightJS = Ke, Ke.default = Ke, wn;
}
var vc = /* @__PURE__ */ yc();
const en = /* @__PURE__ */ mc(vc), Qi = "[A-Za-z$_][0-9A-Za-z$_]*", _c = [
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
], wc = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], Tr = [
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
], Nr = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], Mr = [
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
], xc = [
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
], Ec = [].concat(
  Mr,
  Tr,
  Nr
);
function Sc(e) {
  const t = e.regex, n = (K, { after: ge }) => {
    const Ee = "</" + K[0].slice(1);
    return K.input.indexOf(Ee, ge) !== -1;
  }, i = Qi, s = {
    begin: "<>",
    end: "</>"
  }, r = /<[A-Za-z0-9\\._:-]+\s*\/>/, a = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (K, ge) => {
      const Ee = K[0].length + K.index, We = K.input[Ee];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        We === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        We === ","
      ) {
        ge.ignoreMatch();
        return;
      }
      We === ">" && (n(K, { after: Ee }) || ge.ignoreMatch());
      let nt;
      const Ot = K.input.substring(Ee);
      if (nt = Ot.match(/^\s*=/)) {
        ge.ignoreMatch();
        return;
      }
      if ((nt = Ot.match(/^\s+extends\s+/)) && nt.index === 0) {
        ge.ignoreMatch();
        return;
      }
    }
  }, o = {
    $pattern: Qi,
    keyword: _c,
    literal: wc,
    built_in: Ec,
    "variable.language": xc
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
  }, M = {
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
  }, D = {
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
    M,
    D,
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
  }, be = {
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
        ...Tr,
        ...Nr
      ]
    }
  }, te = {
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
    contains: [Q],
    illegal: /%/
  }, St = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function nn(K) {
    return t.concat("(?!", K.join("|"), ")");
  }
  const sn = {
    match: t.concat(
      /\b/,
      nn([
        ...Mr,
        "super",
        "import",
        "await"
      ].map((K) => `${K}\\s*\\(`)),
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
      Q
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
      Q
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: o,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: Z, CLASS_REFERENCE: be },
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
      M,
      D,
      v,
      g,
      P,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      m,
      be,
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
          P,
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
          Q,
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
        contains: [Q]
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
const kc = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity", Oc = {
  scope: "number",
  match: kc,
  relevance: 0
};
function Ac(e) {
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
      Oc,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function Tc(e) {
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
  ], M = p, D = [
    ...d,
    ...c
  ].filter((Z) => !p.includes(Z)), v = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  }, g = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  }, S = {
    match: t.concat(/\b/, t.either(...M), /\s*\(/),
    relevance: 0,
    keywords: { built_in: M }
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
    const be = He;
    return Q = Q || [], Z.map((te) => te.match(/\|\d+$/) || Q.includes(te) ? te : be(te) ? `${te}|0` : te);
  }
  return {
    name: "SQL",
    case_insensitive: !0,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: Fe(D, { when: (Z) => Z.length < 3 }),
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
      S,
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
en.registerLanguage("javascript", Sc);
en.registerLanguage("json", Ac);
en.registerLanguage("sql", Tc);
const Dt = /* @__PURE__ */ new Map(), Nc = 400, Mc = 2e4;
function es(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Rc(e, t) {
  const n = String(e ?? "");
  if (n === "") return "";
  if (n.length > Mc) return es(n);
  const i = `${t}:${n}`, s = Dt.get(i);
  if (s !== void 0) return s;
  let r;
  try {
    r = en.highlight(n, { language: t, ignoreIllegals: !0 }).value;
  } catch {
    r = es(n);
  }
  return Dt.size >= Nc && Dt.clear(), Dt.set(i, r), r;
}
async function zn(e) {
  const t = await fetch(e, { headers: { Accept: "application/json" } }), n = await t.json().catch(() => null);
  if (!t.ok) throw new Error(n && n.error || `HTTP ${t.status}`);
  if (n === null) throw new Error("The response was not JSON.");
  return n;
}
async function ts(e) {
  const t = await zn(e), n = {};
  return Object.entries(t.sections || {}).forEach(([i, s]) => {
    n[i] = s.payload || {};
  }), { profile: t, payloads: n };
}
function vi(e, t = 0) {
  return Number(e || 0).toFixed(t);
}
function _i(e) {
  const t = Number(e || 0);
  return t < 1024 ? `${t} B` : t < 1048576 ? `${(t / 1024).toFixed(1)} kB` : `${(t / 1048576).toFixed(1)} MB`;
}
function Cc(e, t, n) {
  return `${e} ${Number(e) === 1 ? t : n}`;
}
function Ic(e, t = Date.now() / 1e3) {
  const n = Math.max(0, t - Number(e || 0));
  return n < 60 ? `${Math.round(n)}s ago` : n < 3600 ? `${Math.round(n / 60)}m ago` : `${Math.round(n / 3600)}h ago`;
}
function Pc(e, t) {
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
function $c(e) {
  const t = e && e.magewire;
  return t && t.component ? `${t.component} ${t.action || ""}`.trim() : e && e.path || "/";
}
function Lc(e) {
  if (!e || e.delta === null || e.delta === void 0) return "not comparable";
  if (e.delta === 0) return "no change";
  const t = e.delta > 0 ? "+" : "-", n = e.unit === "B" ? _i(Math.abs(e.delta)) : `${vi(Math.abs(e.delta), e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
  return `${t}${n}`;
}
function Dc(e, t) {
  const n = e[t];
  return n == null ? "none" : e.unit === "B" ? _i(n) : `${vi(n, e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
}
function qc(e) {
  return Object.entries(e.methods || {}).map(([t, n]) => `${n} ${t}`).join(", ");
}
function Rr(e, t, n, i) {
  if (!e || !n || !/^[a-z][a-z0-9+.-]*:\/\//i.test(e) || /^(javascript|data|vbscript):/i.test(e))
    return "";
  const s = n.startsWith("/") ? n : `${t}/${n}`;
  return e.replace("%f", () => encodeURI(s)).replace("%l", () => String(i || 1));
}
function Uc(e, t, n) {
  const i = String(n || "").match(/^(.+\.php):(\d+)$/);
  return i ? Rr(e, t, i[1], Number(i[2])) : "";
}
const xn = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map();
let ns = 0;
function tn() {
  const e = Sn || window.Alpine;
  return !e || typeof e != "object" || e === dt ? null : e;
}
function Cr(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function Kn(e) {
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
function jc(e) {
  if (typeof e.evaluate != "function") return null;
  const t = Kn(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function is() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function Bc(e) {
  if (typeof e.injectMagics == "function") {
    const t = Kn(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = Kn(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function Fc(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function Hc(e) {
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
function Wc(e) {
  return xn.has(e) || (ns += 1, xn.set(e, ns)), xn.get(e);
}
function Ir(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function zc(e) {
  const t = tn();
  if (Jt.clear(), !t) return [];
  const n = Cr(t), i = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((r) => {
    const a = Wc(r), o = (r.getAttribute(n) || "").trim(), c = (r.getAttribute(i) || "").trim(), d = Ir(t, r);
    return Jt.set(a, r), {
      id: a,
      name: Fc(o),
      expression: Ar(o, e),
      path: Hc(r),
      initialised: !!r._x_dataStack,
      deferred: r.hasAttribute(i),
      strategy: c || "none",
      keys: e === je || !d ? 0 : yi(d).length
    };
  });
}
function ss(e, t) {
  if (t === je)
    return "The value policy is set to none, so component state is not read.";
  const n = tn(), i = Jt.get(e);
  if (!n || !i) return "This component is no longer on the page.";
  if (!i._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const s = Ir(n, i);
  if (!s) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(Or(s, t), null, 2);
  } catch (r) {
    return `Could not read this component: ${r && r.message ? r.message : "threw"}`;
  }
}
function Kc(e) {
  const t = tn();
  if (!t) return [];
  const n = Bc(t);
  return n ? Object.keys(n).map((i) => {
    let s = n[i], r = 0;
    if (r = s && typeof s == "object" ? yi(s).length : 0, e === je)
      return { name: i, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      s = JSON.stringify(Or(s, e), null, 2);
    } catch (a) {
      s = `Could not read this store: ${a && a.message ? a.message : "threw"}`;
    }
    return { name: i, keys: r, value: s };
  }) : [];
}
function Vc(e) {
  const t = window.__siteationDebugBar;
  return !t || !Array.isArray(t.alpineErrors) ? [] : t.alpineErrors.map((n) => {
    const i = String(n.message || ""), s = i.match(/Expression: "([\s\S]*?)"/);
    return {
      // An expression that threw is still a server rendered expression, and a message that
      // names the value it choked on is still that value. The rest of this section applies
      // the policy to exactly these two things; this was the one reader that did not.
      message: Gt(i.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""), e),
      expression: s ? Ar(s[1], e) : "",
      element: String(n.element || ""),
      during_init: !!n.during_init
    };
  });
}
function Gc() {
  const e = tn();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: jc(e),
    source: is(),
    prefix: Cr(e)
  } : { present: !1, version: "", csp: null, source: is(), prefix: "" };
}
function Jc(e, t) {
  const n = Jt.get(e);
  if (!n || !n.style) return;
  if (t) {
    ot.has(e) || ot.set(e, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  if (!ot.has(e)) return;
  const i = ot.get(e);
  n.style.outline = i.outline, n.style.outlineOffset = i.offset, ot.delete(e);
}
const Zc = 1e3, Pr = "siteation.debugbar.v1", Xc = "__PROFILE_ID__";
function Yc() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function Qc() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(Pr) || "{}") };
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
function ed() {
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
    editorTemplate: "",
    editorRoot: "",
    activeId: null,
    pageProfile: {},
    init() {
      this.profile = Yc(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const e = Qc();
      this.open = e.open, this.section = e.section, this.placement = e.placement === "top" ? "top" : "bottom", this.maximised = !!e.maximised, this.theme = ["system", "light", "dark"].includes(e.theme) ? e.theme : "system", this.favourites = Array.isArray(e.favourites) ? e.favourites.filter((t) => Wn.some((n) => n.id === t)) : [], this.watchColorScheme(), this.valuePolicy = pc(this.rootElement()?.dataset.valuePolicy), this.editorTemplate = this.rootElement()?.dataset.editor || "", this.editorRoot = this.rootElement()?.dataset.editorRoot || "", this.refreshAlpine(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), this.$watch("section", (t) => {
        t === "history" && this.loadHistory();
      }), this.open && this.section === "history" && this.loadHistory(), this.$watch("activeId", () => {
        this.comparison = null, this.baselineId = "";
      }), document.addEventListener("keydown", (t) => this.paletteShortcut(t)), this.open && this.$nextTick(() => this.lock()), this.requests = Zl((t) => {
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
      return t ? t.replace(Xc, encodeURIComponent(e)) : null;
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
          const { profile: n, payloads: i } = await ts(t);
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
          const n = await zn(t);
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
        this.comparison = await zn(n);
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
      return Lc(e);
    },
    /**
     * @param {object} metric
     * @param {'baseline'|'subject'} side which profile's value the cell shows
     * @returns {string}
     */
    metricValue(e, t) {
      return Dc(e, t);
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
      return Ic(e);
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
      return $c(e);
    },
    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(e) {
      return Pc(e, window.location.origin);
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
          this.payloads = (await ts(e)).payloads;
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
      return Ge(e, this.querySearch, ["sql"]);
    },
    /** @returns {number} how many statements ran a shape that ran more than once */
    get repeatedCount() {
      return this.itemsOf("queries").filter((e) => Number(e.repeat_count || 1) > 1).length;
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
      return ec(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return sc(this.commands, this.paletteSearch);
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
      return Wn.map((e) => ({ ...e, count: Sr(e.id, this) }));
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
    openInspector() {
      this.open || (this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), Yl(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus());
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
      Xl(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(e) {
      if (e.key === "Escape") {
        this.closeInspector();
        return;
      }
      Zi(e, this.$refs.sheet);
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
    refreshAlpine() {
      this.alpineHealth = Gc(), this.alpineComponents = zc(this.valuePolicy), this.alpineStores = Kc(this.valuePolicy), this.alpineErrors = Vc(this.valuePolicy), this.alpineExpanded.forEach((e) => {
        this.alpineStates[e] = ss(e, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, Zc);
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
      this.alpineExpanded = [...this.alpineExpanded, e], this.alpineStates[e] = ss(e, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(e, t) {
      Jc(e, t);
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
      Zi(e, this.$refs.palette);
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
        localStorage.setItem(Pr, JSON.stringify({
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
      return vi(e, t);
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(e) {
      return qc(e);
    },
    /**
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(e, t) {
      return Rc(e, t);
    },
    /**
     * @param {string} file
     * @param {number} line
     * @returns {string}
     */
    editorUrl(e, t) {
      return Rr(this.editorTemplate, this.editorRoot, e, t);
    },
    /**
     * @param {string} location
     * @returns {string}
     */
    locationUrl(e) {
      return Uc(this.editorTemplate, this.editorRoot, e);
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
      return Cc(e, t, n);
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(e) {
      return _i(e);
    }
  };
}
function lt(e) {
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
function rs({ sheet: e }) {
  return `
<div class="ndb-header">
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
      ${G("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + queryTone">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </div>

    <div class="ndb-stat">
      ${G("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </div>

    <div class="ndb-stat is-secondary">
      ${G("chip", "is-accent")}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </div>
  </div>`}

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openPalette()"
            title="Search sections and settings">
      ${G("search")}
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="cycleTheme()"
            data-ndb-bind:title="'Theme: ' + theme + '. Click for the next one.'">
      <span data-ndb-show="theme === 'system'">${G("monitor")}</span>
      <span data-ndb-show="theme === 'light'">${G("sun")}</span>
      <span data-ndb-show="theme === 'dark'">${G("moon")}</span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="select('findings')"
            data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
            title="Findings">
      ${G("alert")}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <span class="ndb-controls-divider"></span>

    ${e ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      <span data-ndb-show="!maximised">${G("expand")}</span>
      <span data-ndb-show="maximised">${G("collapse")}</span>
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${G("minimise")}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button is-open" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${G("expand")}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="dismiss()"
            title="Hide until the next page load">
      ${G("close")}
    </button>
  </div>
</div>`;
}
function as(e, t) {
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
      ${G("star")}
    </button>
  </div>
</template>`;
}
function td() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${as("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${as("otherSections", !1)}
</nav>`;
}
function os(e, t) {
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
const nd = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme">

  <div class="ndb-dock" data-ndb-show="!open && !dismissed" data-ndb-cloak
       title="Open the inspector" data-ndb-on:click="openFromBar($event)">
    ${rs({ sheet: !1 })}
  </div>

  ${rc()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${rs({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${G("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${td()}

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
            ${lt([
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
            ${lt([
  { label: "Route", value: "request.route || 'unknown'", mono: !0 },
  { label: "Action", value: "request.action || 'unknown'", mono: !0 },
  { label: "Intercepted types", value: "interception.plugin_count || 0" },
  { label: "Observers run", value: "observers.count || 0" }
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
            ${lt([
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
            ${lt([
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

      <template data-ndb-if="isSection('history')">
      <div>
        ${os("historyTab", [
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
          ${os("alpineTab", [
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
                    ${G("caret", "ndb-alpine-caret")}
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
            ${lt([
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
`, id = "data-ndb-", sd = "siteation-debugbar";
function rd(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const s = document.createElement("link");
    s.rel = "stylesheet", s.href = n, t.append(s);
  }
  const i = document.createElement("div");
  return i.innerHTML = nd, t.append(...i.children), t.querySelector(".ndb");
}
const En = document.getElementById(sd);
if (En && !En.shadowRoot) {
  const e = rd(En);
  dt.prefix(id), dt.data("debugBar", ed), dt.directive("code", (t, { expression: n }, { effect: i, evaluateLater: s }) => {
    const r = s(n);
    i(() => r((a) => {
      t.innerHTML = typeof a == "string" ? a : "";
    }));
  }), e && dt.initTree(e), Sn && (window.Alpine = Sn);
}
