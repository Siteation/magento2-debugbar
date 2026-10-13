const Ln = window.Alpine;
var Dn = !1, qn = !1, pe = [], Un = -1, Jt = !1, rs = !1;
function io(e) {
  oo(e);
}
function ao() {
  rs = !0;
}
function ro() {
  rs = !1, Ii();
}
function oo(e) {
  pe.includes(e) || (pe.push(e), e._x_schedulerPriority !== void 0 && (Jt = !0)), Ii();
}
function lo(e) {
  let t = pe.indexOf(e);
  t !== -1 && t > Un && pe.splice(t, 1);
}
function Ii() {
  if (!qn && !Dn) {
    if (rs)
      return;
    Dn = !0, queueMicrotask(co);
  }
}
function co() {
  Dn = !1, qn = !0;
  for (let e = 0; e < pe.length; e++)
    Jt && uo(e), pe[e](), Un = e;
  pe.length = 0, Un = -1, Jt = !1, qn = !1;
}
function uo(e) {
  let t = /* @__PURE__ */ new Map(), n = pe.slice(e).sort((s, i) => po(s, i, t));
  for (let s = 0; s < n.length; s++)
    pe[e + s] = n[s];
  Jt = !1;
}
function po(e, t, n) {
  return An(e) ? An(t) ? ni(e._x_schedulerPriority.el, n) - ni(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : An(t) ? 1 : 0;
}
function An(e) {
  return e._x_schedulerPriority !== void 0;
}
function ni(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, s = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(s, n), n;
}
var it, ze, at, Li, ho = 0, jn = !0;
function fo(e) {
  jn = !1, e(), jn = !0;
}
function bo(e) {
  it = e.reactive, at = e.release, ze = (t) => e.effect(t, { scheduler: (n) => {
    jn ? io(n) : n();
  } }), Li = e.raw;
}
function si(e) {
  ze = e;
}
function go(e) {
  let t = () => {
  };
  return [(s, i) => {
    let r = i?.priority === "structural" ? ho++ : void 0, a = ze(s);
    return r !== void 0 && a !== void 0 && (a._x_schedulerPriority = { el: e, order: r }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(a), t = () => {
      a !== void 0 && (e._x_effects.delete(a), at(a));
    }, a;
  }, () => {
    t();
  }];
}
function Di(e, t) {
  let n = !0, s, i, r = ze(() => {
    let a = e(), o = JSON.stringify(a);
    if (!n && (typeof a == "object" || a !== s)) {
      let c = typeof s == "object" ? JSON.parse(i) : s;
      queueMicrotask(() => {
        t(a, c);
      });
    }
    s = a, i = o, n = !1;
  });
  return () => at(r);
}
async function mo(e) {
  ao();
  try {
    await e(), await Promise.resolve();
  } finally {
    ro();
  }
}
var qi = [], Ui = [], ji = [];
function yo(e) {
  ji.push(e);
}
function os(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Ui.push(t));
}
function Bi(e) {
  qi.push(e);
}
function Fi(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function Hi(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, s]) => {
    (t === void 0 || t.includes(n)) && (s.forEach((i) => i()), delete e._x_attributeCleanups[n]);
  });
}
function vo(e) {
  for (e._x_effects?.forEach(lo); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var ls = new MutationObserver(ps), cs = !1;
function ds() {
  ls.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), cs = !0;
}
function Wi() {
  wo(), ls.disconnect(), cs = !1;
}
var dt = [];
function wo() {
  let e = ls.takeRecords();
  dt.push(() => e.length > 0 && ps(e));
  let t = dt.length;
  queueMicrotask(() => {
    if (dt.length === t)
      for (; dt.length > 0; )
        dt.shift()();
  });
}
function B(e) {
  if (!cs)
    return e();
  Wi();
  let t = e();
  return ds(), t;
}
var us = !1, Xt = [];
function _o() {
  us = !0;
}
function xo() {
  us = !1, ps(Xt), Xt = [];
}
function ps(e) {
  if (us) {
    Xt = Xt.concat(e);
    return;
  }
  let t = [], n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
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
        s.has(a) || s.set(a, []), s.get(a).push({ name: o, value: a.getAttribute(o) });
      }, u = () => {
        i.has(a) || i.set(a, []), i.get(a).push(o);
      };
      a.hasAttribute(o) && c === null ? d() : a.hasAttribute(o) ? (u(), d()) : u();
    }
  i.forEach((r, a) => {
    Hi(a, r);
  }), s.forEach((r, a) => {
    qi.forEach((o) => o(a, r));
  });
  for (let r of n)
    t.some((a) => a.contains(r)) || Ui.forEach((a) => a(r));
  for (let r of t)
    r.isConnected && ji.forEach((a) => a(r));
  t = null, n = null, s = null, i = null;
}
function zi(e) {
  return De(nt(e));
}
function Tt(e, t, n) {
  return e._x_dataStack = [t, ...nt(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((s) => s !== t);
  };
}
function nt(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? nt(e.host) : e.parentNode ? nt(e.parentNode) : [];
}
function De(e) {
  return new Proxy({ objects: e }, Eo);
}
function Ki(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : Ki(Object.getPrototypeOf(e), t);
}
var Eo = {
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
    return t == "toJSON" ? ko : Reflect.get(
      e.find(
        (s) => Reflect.has(s, t)
      ) || {},
      t,
      n
    );
  },
  set({ objects: e }, t, n, s) {
    let i;
    for (const a of e)
      if (i = Ki(a, t), i)
        break;
    i || (i = e[e.length - 1]);
    const r = Object.getOwnPropertyDescriptor(i, t);
    return r?.set && r?.get ? r.set.call(s, n) || !0 : Reflect.set(i, t, n);
  }
};
function ko() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function hs(e, t = () => {
}) {
  let n = (i) => typeof i == "object" && !Array.isArray(i) && i !== null, s = (i, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([a, { value: o, enumerable: c }]) => {
      if (c === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let d = r === "" ? a : `${r}.${a}`;
      typeof o == "object" && o !== null && o._x_interceptor ? i[a] = o.initialize(e, d, a, t) : n(o) && o !== i && !(o instanceof Element) && s(o, d);
    });
  };
  return s(e);
}
function Gi(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(s, i, r, a) {
      return e(this.initialValue, () => So(s, i), (o) => Bn(s, i, o), i, r, a);
    }
  };
  return t(n), (s) => {
    if (typeof s == "object" && s !== null && s._x_interceptor) {
      let i = n.initialize.bind(n);
      n.initialize = (r, a, o, c) => {
        let d = s.initialize(r, a, o, c);
        return n.initialValue = d, i(r, a, o, c);
      };
    } else
      n.initialValue = s;
    return n;
  };
}
function So(e, t) {
  return t.split(".").reduce((n, s) => n[s], e);
}
function Bn(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Bn(e[t[0]], t.slice(1), n);
  }
}
var Vi = {};
function ie(e, t) {
  Vi[e] = t;
}
function Zt(e, t) {
  let n = Ao(t);
  return Object.entries(Vi).forEach(([s, i]) => {
    Object.defineProperty(e, `$${s}`, {
      get() {
        return i(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function Ao(e) {
  let [t, n] = ta(e), s = { interceptor: Gi, ...t };
  return os(e, n), s;
}
function Oo(e, t, n, ...s) {
  try {
    return n(...s);
  } catch (i) {
    fs(i, e, t);
  }
}
function fs(...e) {
  return Ji(...e);
}
var Ji = Mo;
function To(e) {
  Ji = e;
}
function Mo(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var $e = !0;
function Xi(e) {
  let t = $e;
  $e = !1;
  let n = e();
  return $e = t, n;
}
function Pe(e, t, n = {}) {
  let s;
  return Z(e, t)((i) => s = i, n), s;
}
function Z(...e) {
  return Zi(...e);
}
var Zi = () => {
};
function No(e) {
  Zi = e;
}
var Yi;
function Co(e) {
  Yi = e;
}
function Ro(e, t) {
  return (n = () => {
  }, { scope: s = {}, params: i = [], context: r } = {}) => {
    if (!$e) {
      Fn(n, t, De([s, ...e]), i);
      return;
    }
    let a = t.apply(De([s, ...e]), i);
    Fn(n, a);
  };
}
function Fn(e, t, n, s, i) {
  if ($e && typeof t == "function") {
    let r = t.apply(n, s);
    r instanceof Promise ? r.then((a) => Fn(e, a, n, s)).catch((a) => fs(a, i, t)) : e(r);
  } else typeof t == "object" && t instanceof Promise ? t.then((r) => e(r)) : e(t);
}
function $o(...e) {
  return Yi(...e);
}
var bs = "x-";
function rt(e = "") {
  return bs + e;
}
function Po(e) {
  bs = e;
}
var Yt = {};
function F(e, t) {
  return Yt[e] = t, {
    before(n) {
      if (!Yt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const s = Re.indexOf(n);
      Re.splice(s >= 0 ? s : Re.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Io(e) {
  return Object.keys(Yt).includes(e);
}
function gs(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let r = Object.entries(e._x_virtualDirectives).map(([o, c]) => ({ name: o, value: c })), a = Qi(r);
    r = r.map((o) => a.find((c) => c.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(r);
  }
  let s = {};
  return t.map(ia((r, a) => s[r] = a)).filter(ra).map(qo(s, n)).sort(Uo).map((r) => Do(e, r));
}
function Qi(e) {
  return Array.from(e).map(ia()).filter((t) => !ra(t));
}
var Hn = !1, ft = /* @__PURE__ */ new Map(), ea = /* @__PURE__ */ Symbol();
function Lo(e) {
  Hn = !0;
  let t = /* @__PURE__ */ Symbol();
  ea = t, ft.set(t, []);
  let n = () => {
    for (; ft.get(t).length; )
      ft.get(t).shift()();
    ft.delete(t);
  }, s = () => {
    Hn = !1, n();
  };
  e(n), s();
}
function ta(e) {
  let t = [], n = (o) => t.push(o), [s, i] = go(e);
  return t.push(i), [{
    Alpine: ot,
    effect: s,
    cleanup: n,
    evaluateLater: Z.bind(Z, e),
    evaluate: Pe.bind(Pe, e)
  }, () => t.forEach((o) => o())];
}
function Do(e, t) {
  let n = () => {
  }, s = Yt[t.type] || n, [i, r] = ta(e);
  Fi(e, t.original, r);
  let a = () => {
    e._x_ignore || e._x_ignoreSelf || (s.inline && s.inline(e, t, i), s = s.bind(s, e, t, i), Hn ? ft.get(ea).push(s) : s());
  };
  return a.runCleanups = r, a;
}
var na = (e, t) => ({ name: n, value: s }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: s }), sa = (e) => e;
function ia(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: s, value: i } = aa.reduce((r, a) => a(r), { name: t, value: n });
    return s !== t && e(s, t), { name: s, value: i };
  };
}
var aa = [];
function ms(e) {
  aa.push(e);
}
function ra({ name: e }) {
  return oa().test(e);
}
var oa = () => new RegExp(`^${bs}([^:^.]+)\\b`);
function qo(e, t) {
  return ({ name: n, value: s }) => {
    n === s && (s = "");
    let i = n.match(oa()), r = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: i ? i[1] : null,
      value: r ? r[1] : null,
      modifiers: a.map((c) => c.replace(".", "")),
      expression: s,
      original: o
    };
  };
}
var Wn = "DEFAULT", Re = [
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
  Wn,
  "teleport"
];
function Uo(e, t) {
  let n = Re.indexOf(e.type) === -1 ? Wn : e.type, s = Re.indexOf(t.type) === -1 ? Wn : t.type;
  return Re.indexOf(n) - Re.indexOf(s);
}
function bt(e, t, n = {}, s = {}) {
  return e.dispatchEvent(
    new CustomEvent(t, {
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
function qe(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((i) => qe(i, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let s = e.firstElementChild;
  for (; s; )
    qe(s, t), s = s.nextElementSibling;
}
function le(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var ii = !1;
function jo() {
  ii && le("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), ii = !0, document.body || le("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), bt(document, "alpine:init"), bt(document, "alpine:initializing"), ds(), yo((t) => fe(t, qe)), os((t) => Ke(t)), Bi((t, n) => {
    gs(t, n).forEach((s) => s());
  });
  let e = (t) => !ln(t.parentElement, !0);
  Array.from(document.querySelectorAll(da().join(","))).filter(e).forEach((t) => {
    fe(t);
  }), bt(document, "alpine:initialized"), setTimeout(() => {
    Wo();
  });
}
var ys = [], la = [];
function ca() {
  return ys.map((e) => e());
}
function da() {
  return ys.concat(la).map((e) => e());
}
function ua(e) {
  ys.push(e);
}
function pa(e) {
  la.push(e);
}
function ln(e, t = !1) {
  return he(e, (n) => {
    if ((t ? da() : ca()).some((i) => n.matches(i)))
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
function Bo(e) {
  return ca().some((t) => e.matches(t));
}
var ha = [];
function Fo(e) {
  ha.push(e);
}
var Ho = 1;
function fe(e, t = qe, n = () => {
}) {
  he(e, (s) => s._x_ignore) || Lo(() => {
    t(e, (s, i) => {
      s._x_marker || (n(s, i), ha.forEach((r) => r(s, i)), gs(s, s.attributes).forEach((r) => r()), s._x_ignore || (s._x_marker = Ho++), s._x_ignore && i());
    });
  });
}
function Ke(e, t = qe) {
  t(e, (n) => {
    vo(n), Hi(n), delete n._x_marker;
  });
}
function Wo() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, s]) => {
    Io(n) || s.some((i) => {
      if (document.querySelector(i))
        return le(`found "${i}", but missing ${t} plugin`), !0;
    });
  });
}
var zn = [], vs = !1;
function ws(e = () => {
}) {
  return queueMicrotask(() => {
    vs || setTimeout(() => {
      Kn();
    });
  }), new Promise((t) => {
    zn.push(() => {
      e(), t();
    });
  });
}
function Kn() {
  for (vs = !1; zn.length; )
    zn.shift()();
}
function zo() {
  vs = !0;
}
function _s(e, t) {
  return Array.isArray(t) ? ai(e, t.join(" ")) : typeof t == "object" && t !== null ? Ko(e, t) : typeof t == "function" ? _s(e, t()) : ai(e, t);
}
function Gn(e) {
  return e.split(/\s/).filter(Boolean);
}
function ai(e, t) {
  let n = (i) => Gn(i).filter((r) => !e.classList.contains(r)).filter(Boolean), s = (i) => (e.classList.add(...i), () => {
    e.classList.remove(...i);
  });
  return t = t === !0 ? t = "" : t || "", s(n(t));
}
function Ko(e, t) {
  let n = Object.entries(t).flatMap(([a, o]) => o ? Gn(a) : !1).filter(Boolean), s = Object.entries(t).flatMap(([a, o]) => o ? !1 : Gn(a)).filter(Boolean), i = [], r = [];
  return s.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), r.push(a));
  }), n.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), i.push(a));
  }), () => {
    r.forEach((a) => e.classList.add(a)), i.forEach((a) => e.classList.remove(a));
  };
}
function cn(e, t) {
  return typeof t == "object" && t !== null ? Go(e, t) : Vo(e, t);
}
function Go(e, t) {
  let n = {};
  return Object.entries(t).forEach(([s, i]) => {
    n[s] = e.style[s], s.startsWith("--") || (s = Jo(s)), e.style.setProperty(s, i);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    cn(e, n);
  };
}
function Vo(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Jo(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Vn(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
F("transition", (e, { value: t, modifiers: n, expression: s }, { evaluate: i }) => {
  typeof s == "function" && (s = i(s)), s !== !1 && (!s || typeof s == "boolean" ? Zo(e, n, t) : Xo(e, s, t));
});
function Xo(e, t, n) {
  fa(e, _s, ""), {
    enter: (i) => {
      e._x_transition.enter.during = i;
    },
    "enter-start": (i) => {
      e._x_transition.enter.start = i;
    },
    "enter-end": (i) => {
      e._x_transition.enter.end = i;
    },
    leave: (i) => {
      e._x_transition.leave.during = i;
    },
    "leave-start": (i) => {
      e._x_transition.leave.start = i;
    },
    "leave-end": (i) => {
      e._x_transition.leave.end = i;
    }
  }[n](t);
}
function Zo(e, t, n) {
  fa(e, cn);
  let s = !t.includes("in") && !t.includes("out") && !n, i = s || t.includes("in") || ["enter"].includes(n), r = s || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !s && (t = t.filter((k, I) => I < t.indexOf("out"))), t.includes("out") && !s && (t = t.filter((k, I) => I > t.indexOf("out")));
  let a = !t.includes("opacity") && !t.includes("scale"), o = a || t.includes("opacity"), c = a || t.includes("scale"), d = o ? 0 : 1, u = c ? ut(t, "scale", 95) / 100 : 1, h = ut(t, "delay", 0) / 1e3, v = ut(t, "origin", "center"), T = "opacity, transform", C = ut(t, "duration", 150) / 1e3, g = ut(t, "duration", 75) / 1e3, y = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  i && (e._x_transition.enter.during = {
    transformOrigin: v,
    transitionDelay: `${h}s`,
    transitionProperty: T,
    transitionDuration: `${C}s`,
    transitionTimingFunction: y
  }, e._x_transition.enter.start = {
    opacity: d,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), r && (e._x_transition.leave.during = {
    transformOrigin: v,
    transitionDelay: `${h}s`,
    transitionProperty: T,
    transitionDuration: `${g}s`,
    transitionTimingFunction: y
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: d,
    transform: `scale(${u})`
  });
}
function fa(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(s = () => {
    }, i = () => {
    }) {
      Jn(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, s, i);
    },
    out(s = () => {
    }, i = () => {
    }) {
      Jn(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, s, i);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, n, s) {
  const i = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let r = () => i(n);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(n) : r() : e._x_transition ? e._x_transition.in(n) : r();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((a, o) => {
    e._x_transition.out(() => {
    }, () => a(s)), e._x_transitioning && e._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(s), queueMicrotask(() => {
    let a = ba(e);
    a ? (a._x_hideChildren || (a._x_hideChildren = []), a._x_hideChildren.push(e)) : i(() => {
      let o = (c) => {
        let d = Promise.all([
          c._x_hidePromise,
          ...(c._x_hideChildren || []).map(o)
        ]).then(([u]) => u?.());
        return delete c._x_hidePromise, delete c._x_hideChildren, d;
      };
      o(e).catch((c) => {
        if (!c.isFromCancelledTransition)
          throw c;
      });
    });
  });
};
function ba(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : ba(t);
}
function Jn(e, t, { during: n, start: s, end: i } = {}, r = () => {
}, a = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(s).length === 0 && Object.keys(i).length === 0) {
    r(), a();
    return;
  }
  let o, c, d;
  Yo(e, {
    start() {
      o = t(e, s);
    },
    during() {
      c = t(e, n);
    },
    before: r,
    end() {
      o(), d = t(e, i);
    },
    after: a,
    cleanup() {
      c(), d();
    }
  });
}
function Yo(e, t) {
  let n, s, i, r = Vn(() => {
    B(() => {
      n = !0, s || t.before(), i || (t.end(), Kn()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(a) {
      this.beforeCancels.push(a);
    },
    cancel: Vn(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      r();
    }),
    finish: r
  }, B(() => {
    t.start(), t.during();
  }), zo(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), B(() => {
      t.before();
    }), s = !0, requestAnimationFrame(() => {
      n || (B(() => {
        t.end();
      }), Kn(), setTimeout(e._x_transitioning.finish, a + o), i = !0);
    });
  });
}
function ut(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const s = e[e.indexOf(t) + 1];
  if (!s || t === "scale" && isNaN(s))
    return n;
  if (t === "duration" || t === "delay") {
    let i = s.match(/([0-9]+)ms/);
    if (i)
      return i[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [s, e[e.indexOf(t) + 2]].join(" ") : s;
}
var Ee = !1;
function ke(e, t = () => {
}) {
  return (...n) => Ee ? t(...n) : e(...n);
}
function Qo(e) {
  return (...t) => Ee && e(...t);
}
var ga = [];
function dn(e) {
  ga.push(e);
}
function el(e, t) {
  ga.forEach((n) => n(e, t)), Ee = !0, ma(() => {
    fe(t, (n, s) => {
      s(n, () => {
      });
    });
  }), Ee = !1;
}
var Xn = !1;
function tl(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), Ee = !0, Xn = !0, ma(() => {
    nl(t);
  }), Ee = !1, Xn = !1;
}
function nl(e) {
  let t = !1;
  fe(e, (s, i) => {
    qe(s, (r, a) => {
      if (t && Bo(r))
        return a();
      t = !0, i(r, a);
    });
  });
}
function ma(e) {
  let t = ze;
  si((n, s) => {
    let i = t(n);
    return at(i), () => {
    };
  }), e(), si(t);
}
function ya(e, t, n, s = []) {
  switch (e._x_bindings || (e._x_bindings = it({})), e._x_bindings[t] = n, t = s.includes("camel") ? dl(t) : t, t) {
    case "value":
      sl(e, n);
      break;
    case "style":
      al(e, n);
      break;
    case "class":
      il(e, n);
      break;
    case "selected":
    case "checked":
      rl(e, t, n);
      break;
    default:
      xs(e, t, n);
      break;
  }
}
function sl(e, t) {
  if (Es(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (Qt(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => ul(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    cl(e, t);
  else if (e.tagName === "OPTION")
    xs(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function il(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = _s(e, t);
}
function al(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = cn(e, t);
}
function rl(e, t, n) {
  xs(e, t, n), ll(e, t, n);
}
function xs(e, t, n) {
  [null, void 0, !1].includes(n) && hl(t) ? e.removeAttribute(t) : (va(t) && (n = t), fl(n) && (n = JSON.stringify(n)), ol(e, t, n));
}
function ol(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function ll(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function cl(e, t) {
  const n = [].concat(t).map((s) => s + "");
  Array.from(e.options).forEach((s) => {
    s.selected = n.includes(s.value);
  });
}
function dl(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function ul(e, t) {
  return e == t;
}
function Gt(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var pl = /* @__PURE__ */ new Set([
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
function va(e) {
  return pl.has(e);
}
function hl(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function fl(e) {
  return typeof e == "object" && e !== null;
}
function bl(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : wa(e, t, n);
}
function gl(e, t, n, s = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let i = e._x_inlineBindings[t];
    return i.extract = s, Xi(() => Pe(e, i.expression));
  }
  return wa(e, t, n);
}
function wa(e, t, n) {
  let s = e.getAttribute(t);
  return s === null ? typeof n == "function" ? n() : n : s === "" ? !0 : va(t) ? !![t, "true"].includes(s) : s;
}
function Qt(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Es(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function _a(e, t) {
  let n;
  return function() {
    const s = this, i = arguments, r = function() {
      n = null, e.apply(s, i);
    };
    clearTimeout(n), n = setTimeout(r, t);
  };
}
function xa(e, t) {
  let n;
  return function() {
    let s = this, i = arguments;
    n || (e.apply(s, i), n = !0, setTimeout(() => n = !1, t));
  };
}
function Ea({ get: e, set: t }, { get: n, set: s }) {
  let i = !0, r, a = ze(() => {
    let o = e(), c = n();
    if (i)
      s(On(o)), i = !1;
    else {
      let d = JSON.stringify(o), u = JSON.stringify(c);
      d !== r ? s(On(o)) : d !== u && t(On(c));
    }
    r = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    at(a);
  };
}
function On(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function ml(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(ot));
}
var ue = {}, ri = !1;
function yl(e, t) {
  if (ri || (ue = it(ue), ri = !0), t === void 0)
    return ue[e];
  ue[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? ue[e] = t.initialize(ue, e, e, () => {
  }) : hs(ue[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ue[e].init();
}
function vl() {
  return ue;
}
var ka = {};
function wl(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? Sa(e, n()) : (ka[e] = n, () => {
  });
}
function _l(e) {
  return Object.entries(ka).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...s) => n(...s);
      }
    });
  }), e;
}
function Sa(e, t, n) {
  let s = [];
  for (; s.length; )
    s.pop()();
  let i = Object.entries(t).map(([a, o]) => ({ name: a, value: o })), r = Qi(i);
  return i = i.map((a) => r.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), gs(e, i, n).map((a) => {
    s.push(a.runCleanups), a();
  }), () => {
    for (; s.length; )
      s.pop()();
  };
}
var Aa = {};
function xl(e, t) {
  Aa[e] = t;
}
function El(e, t) {
  return Object.entries(Aa).forEach(([n, s]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...i) => s.bind(t)(...i);
      },
      enumerable: !1
    });
  }), e;
}
var kl = {
  get reactive() {
    return it;
  },
  get release() {
    return at;
  },
  get effect() {
    return ze;
  },
  get raw() {
    return Li;
  },
  get transaction() {
    return mo;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: xo,
  dontAutoEvaluateFunctions: Xi,
  disableEffectScheduling: fo,
  startObservingMutations: ds,
  stopObservingMutations: Wi,
  setReactivityEngine: bo,
  onAttributeRemoved: Fi,
  onAttributesAdded: Bi,
  closestDataStack: nt,
  skipDuringClone: ke,
  onlyDuringClone: Qo,
  addRootSelector: ua,
  addInitSelector: pa,
  setErrorHandler: To,
  interceptClone: dn,
  addScopeToNode: Tt,
  deferMutations: _o,
  mapAttributes: ms,
  evaluateLater: Z,
  interceptInit: Fo,
  initInterceptors: hs,
  injectMagics: Zt,
  setEvaluator: No,
  setRawEvaluator: Co,
  mergeProxies: De,
  extractProp: gl,
  findClosest: he,
  onElRemoved: os,
  closestRoot: ln,
  destroyTree: Ke,
  interceptor: Gi,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Jn,
  // INTERNAL
  setStyles: cn,
  // INTERNAL
  mutateDom: B,
  directive: F,
  entangle: Ea,
  throttle: xa,
  debounce: _a,
  evaluate: Pe,
  evaluateRaw: $o,
  initTree: fe,
  nextTick: ws,
  prefixed: rt,
  prefix: Po,
  plugin: ml,
  magic: ie,
  store: yl,
  start: jo,
  clone: tl,
  // INTERNAL
  cloneNode: el,
  // INTERNAL
  bound: bl,
  $data: zi,
  watch: Di,
  walk: qe,
  data: xl,
  bind: wl
}, ot = kl, oi = /* @__PURE__ */ new WeakMap(), Oa = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((e) => {
  e === "styleMedia" || e === "sharedStorage" || Oa.add(globalThis[e]);
});
var z = class {
  constructor(e, t, n, s) {
    this.type = e, this.value = t, this.start = n, this.end = s;
  }
}, Sl = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new z("EOF", null, this.position, this.position)), this.tokens;
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
      const s = this.input[this.position];
      if (this.isDigit(s))
        this.position++;
      else if (s === "." && !t)
        t = !0, this.position++;
      else
        break;
    }
    const n = this.input.slice(e, this.position);
    this.tokens.push(new z("NUMBER", parseFloat(n), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new z("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new z("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new z("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new z("KEYWORD", t, e, this.position)) : this.tokens.push(new z("IDENTIFIER", t, e, this.position));
  }
  readString() {
    const e = this.position, t = this.input[this.position];
    this.position++;
    let n = "", s = !1;
    for (; this.position < this.input.length; ) {
      const i = this.input[this.position];
      if (s) {
        switch (i) {
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
            n += i;
        }
        s = !1;
      } else if (i === "\\")
        s = !0;
      else if (i === t) {
        this.position++, this.tokens.push(new z("STRING", n, e, this.position));
        return;
      } else
        n += i;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${e}`);
  }
  readOperatorOrPunctuation() {
    const e = this.position, t = this.input[this.position], n = this.peek(), s = this.peek(2);
    if (t === "=" && n === "=" && s === "=")
      this.position += 3, this.tokens.push(new z("OPERATOR", "===", e, this.position));
    else if (t === "!" && n === "=" && s === "=")
      this.position += 3, this.tokens.push(new z("OPERATOR", "!==", e, this.position));
    else if (t === "=" && n === "=")
      this.position += 2, this.tokens.push(new z("OPERATOR", "==", e, this.position));
    else if (t === "!" && n === "=")
      this.position += 2, this.tokens.push(new z("OPERATOR", "!=", e, this.position));
    else if (t === "<" && n === "=")
      this.position += 2, this.tokens.push(new z("OPERATOR", "<=", e, this.position));
    else if (t === ">" && n === "=")
      this.position += 2, this.tokens.push(new z("OPERATOR", ">=", e, this.position));
    else if (t === "&" && n === "&")
      this.position += 2, this.tokens.push(new z("OPERATOR", "&&", e, this.position));
    else if (t === "|" && n === "|")
      this.position += 2, this.tokens.push(new z("OPERATOR", "||", e, this.position));
    else if (t === "+" && n === "+")
      this.position += 2, this.tokens.push(new z("OPERATOR", "++", e, this.position));
    else if (t === "-" && n === "-")
      this.position += 2, this.tokens.push(new z("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const i = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new z(i, t, e, this.position));
    }
  }
}, Al = class {
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
      const s = this.parseExpression();
      if (e.push({
        type: "Property",
        key: t,
        value: s,
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
        const s = n;
        for (let i = 1; i < e.length; i++)
          if (this.check(s, e[i]))
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
}, Ol = class {
  evaluate({ node: e, scope: t = {}, context: n = null, forceBindingRootScopeToFunctions: s = !0 }) {
    switch (e.type) {
      case "Literal":
        return e.value;
      case "Identifier":
        if (e.name in t) {
          const y = t[e.name];
          return this.checkForDangerousValues(y), typeof y == "function" ? y.bind(t) : y;
        }
        throw new Error(`Undefined variable: ${e.name}`);
      case "MemberExpression":
        const i = this.evaluate({ node: e.object, scope: t, context: n, forceBindingRootScopeToFunctions: s });
        if (i == null)
          throw new Error("Cannot read property of null or undefined");
        let r;
        e.computed ? r = this.evaluate({ node: e.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : r = e.property.name, this.checkForDangerousKeywords(r);
        let a = i[r];
        return this.checkForDangerousValues(a), typeof a == "function" ? s ? a.bind(t) : a.bind(i) : a;
      case "CallExpression":
        const o = e.arguments.map((y) => this.evaluate({ node: y, scope: t, context: n, forceBindingRootScopeToFunctions: s }));
        let c;
        if (e.callee.type === "MemberExpression") {
          const y = this.evaluate({ node: e.callee.object, scope: t, context: n, forceBindingRootScopeToFunctions: s });
          let k;
          e.callee.computed ? k = this.evaluate({ node: e.callee.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : k = e.callee.property.name, this.checkForDangerousKeywords(k);
          let I = y[k];
          if (typeof I != "function")
            throw new Error("Value is not a function");
          c = I.apply(y, o);
        } else if (e.callee.type === "Identifier") {
          const y = e.callee.name;
          let k;
          if (y in t)
            k = t[y];
          else
            throw new Error(`Undefined variable: ${y}`);
          if (typeof k != "function")
            throw new Error("Value is not a function");
          const I = n !== null ? n : t;
          c = k.apply(I, o);
        } else {
          const y = this.evaluate({ node: e.callee, scope: t, context: n, forceBindingRootScopeToFunctions: s });
          if (typeof y != "function")
            throw new Error("Value is not a function");
          c = y.apply(n, o);
        }
        return this.checkForDangerousValues(c), c;
      case "UnaryExpression":
        const d = this.evaluate({ node: e.argument, scope: t, context: n, forceBindingRootScopeToFunctions: s });
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
          const y = e.argument.name;
          if (!(y in t))
            throw new Error(`Undefined variable: ${y}`);
          const k = t[y];
          return e.operator === "++" ? t[y] = k + 1 : e.operator === "--" && (t[y] = k - 1), e.prefix ? t[y] : k;
        } else if (e.argument.type === "MemberExpression") {
          const y = this.evaluate({ node: e.argument.object, scope: t, context: n, forceBindingRootScopeToFunctions: s }), k = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : e.argument.property.name;
          if (this.isDOMObject(y))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          this.checkForDangerousKeywords(k);
          const I = y[k];
          return e.operator === "++" ? y[k] = I + 1 : e.operator === "--" && (y[k] = I - 1), e.prefix ? y[k] : I;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const u = this.evaluate({ node: e.left, scope: t, context: n, forceBindingRootScopeToFunctions: s }), h = () => this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: s });
        if (e.operator === "&&")
          return u && h();
        if (e.operator === "||")
          return u || h();
        const v = h();
        switch (e.operator) {
          case "+":
            return u + v;
          case "-":
            return u - v;
          case "*":
            return u * v;
          case "/":
            return u / v;
          case "%":
            return u % v;
          case "==":
            return u == v;
          case "!=":
            return u != v;
          case "===":
            return u === v;
          case "!==":
            return u !== v;
          case "<":
            return u < v;
          case ">":
            return u > v;
          case "<=":
            return u <= v;
          case ">=":
            return u >= v;
          default:
            throw new Error(`Unknown binary operator: ${e.operator}`);
        }
      case "ConditionalExpression":
        return this.evaluate({ node: e.test, scope: t, context: n, forceBindingRootScopeToFunctions: s }) ? this.evaluate({ node: e.consequent, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : this.evaluate({ node: e.alternate, scope: t, context: n, forceBindingRootScopeToFunctions: s });
      case "AssignmentExpression":
        const C = this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: s });
        if (e.left.type === "Identifier")
          return t[e.left.name] = C, C;
        if (e.left.type === "MemberExpression") {
          const y = this.evaluate({ node: e.left.object, scope: t, context: n, forceBindingRootScopeToFunctions: s }), k = e.left.computed ? this.evaluate({ node: e.left.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : e.left.property.name;
          if (this.isDOMObject(y))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          return this.checkForDangerousKeywords(k), y[k] = C, C;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((y) => this.evaluate({ node: y, scope: t, context: n, forceBindingRootScopeToFunctions: s }));
      case "ObjectExpression":
        const g = {};
        for (const y of e.properties) {
          const k = y.computed ? this.evaluate({ node: y.key, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : y.key.type === "Identifier" ? y.key.name : this.evaluate({ node: y.key, scope: t, context: n, forceBindingRootScopeToFunctions: s }), I = this.evaluate({ node: y.value, scope: t, context: n, forceBindingRootScopeToFunctions: s });
          g[k] = I;
        }
        return g;
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
    if (e !== null && !(typeof e != "object" && typeof e != "function") && !oi.has(e)) {
      if (e instanceof HTMLIFrameElement || e instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if (Oa.has(e))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return oi.set(e, !0), !0;
    }
  }
};
function Ta(e) {
  try {
    const n = new Sl(e).tokenize(), i = new Al(n).parse(), r = new Ol();
    return function(a = {}) {
      const { scope: o = {}, context: c = null, forceBindingRootScopeToFunctions: d = !1 } = a;
      return r.evaluate({ node: i, scope: o, context: c, forceBindingRootScopeToFunctions: d });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function Tl(e, t, n = {}) {
  let s = Ma(e), i = De([n.scope ?? {}, ...s]), r = n.params ?? [], o = Ta(t)({
    scope: i,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && $e ? o.apply(i, r) : o;
}
function Ml(e, t) {
  let n = Ma(e);
  if (typeof t == "function")
    return Ro(n, t);
  let s = Nl(e, t, n);
  return Oo.bind(null, e, t, s);
}
function Ma(e) {
  let t = {};
  return Zt(t, e), [t, ...nt(e)];
}
function Nl(e, t, n) {
  if (e instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (e instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (s = () => {
  }, { scope: i = {}, params: r = [] } = {}) => {
    let a = De([i, ...n]), c = Ta(t)({
      scope: a,
      forceBindingRootScopeToFunctions: !0
    });
    if ($e && typeof c == "function") {
      let d = c.apply(c, r);
      d instanceof Promise ? d.then((u) => s(u)) : s(d);
    } else typeof c == "object" && c instanceof Promise ? c.then((d) => s(d)) : s(c);
  };
}
function Cl(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var _t = Object.assign, Rl = Object.prototype.hasOwnProperty, Zn = (e, t) => Rl.call(e, t), xt = Array.isArray, gt = (e) => Na(e) === "[object Map]", $l = (e) => typeof e == "string", Mt = (e) => typeof e == "symbol", Et = (e) => e !== null && typeof e == "object", Pl = Object.prototype.toString, Na = (e) => Pl.call(e), Ca = (e) => Na(e).slice(8, -1), ks = (e) => $l(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Il = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Ll = Il((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ce = (e, t) => !Object.is(e, t);
function Ue(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var $, Tn = /* @__PURE__ */ new WeakSet(), li = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Tn.has(this) && (Tn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Dl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ci(this), $a(this);
    const e = $, t = se;
    $ = this, se = !0;
    try {
      return this.fn();
    } finally {
      $ !== this && Ue(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Pa(this), $ = e, se = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Os(e);
      this.deps = this.depsTail = void 0, ci(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Tn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Yn(this) && this.run();
  }
  get dirty() {
    return Yn(this);
  }
}, Ra = 0, mt, yt;
function Dl(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = yt, yt = e;
    return;
  }
  e.next = mt, mt = e;
}
function Ss() {
  Ra++;
}
function As() {
  if (--Ra > 0)
    return;
  if (yt) {
    let t = yt;
    for (yt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; mt; ) {
    let t = mt;
    for (mt = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e)
    throw e;
}
function $a(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pa(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), Os(s), Ul(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function Yn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ql(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ql(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === en) || (e.globalVersion = en, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Yn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = $, s = se;
  $ = e, se = !0;
  try {
    $a(e);
    const i = e.fn(e._value);
    (t.version === 0 || Ce(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    $ = n, se = s, Pa(e), e.flags &= -3;
  }
}
function Os(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Os(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ul(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function jl(e, t) {
  e.effect instanceof li && (e = e.effect.fn);
  const n = new li(e);
  t && _t(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const s = n.run.bind(n);
  return s.effect = n, s;
}
function Bl(e) {
  e.effect.stop();
}
var se = !0, Ia = [];
function Fl() {
  Ia.push(se), se = !1;
}
function Hl() {
  const e = Ia.pop();
  se = e === void 0 ? !0 : e;
}
function ci(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = $;
    $ = void 0;
    try {
      t();
    } finally {
      $ = n;
    }
  }
}
var en = 0, Wl = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, zl = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!$ || !se || $ === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== $)
      t = this.activeLink = new Wl($, this), $.deps ? (t.prevDep = $.depsTail, $.depsTail.nextDep = t, $.depsTail = t) : $.deps = $.depsTail = t, La(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = $.depsTail, t.nextDep = void 0, $.depsTail.nextDep = t, $.depsTail = t, $.deps === t && ($.deps = n);
    }
    return $.onTrack && $.onTrack(
      _t(
        {
          effect: $
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, en++, this.notify(e);
  }
  notify(e) {
    Ss();
    try {
      for (let t = this.subsHead; t; t = t.nextSub)
        t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(
          _t(
            {
              effect: t.sub
            },
            e
          )
        );
      for (let t = this.subs; t; t = t.prevSub)
        t.sub.notify() && t.sub.dep.notify();
    } finally {
      As();
    }
  }
};
function La(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        La(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var Qn = /* @__PURE__ */ new WeakMap(), Ie = /* @__PURE__ */ Symbol(
  "Object iterate"
), es = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), kt = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function Y(e, t, n) {
  if (se && $) {
    let s = Qn.get(e);
    s || Qn.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new zl()), i.map = s, i.key = n), i.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function xe(e, t, n, s, i, r) {
  const a = Qn.get(e);
  if (!a) {
    en++;
    return;
  }
  const o = (c) => {
    c && c.trigger({
      target: e,
      type: t,
      key: n,
      newValue: s,
      oldValue: i,
      oldTarget: r
    });
  };
  if (Ss(), t === "clear")
    a.forEach(o);
  else {
    const c = xt(e), d = c && ks(n);
    if (c && n === "length") {
      const u = Number(s);
      a.forEach((h, v) => {
        (v === "length" || v === kt || !Mt(v) && v >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || a.has(void 0)) && o(a.get(n)), d && o(a.get(kt)), t) {
        case "add":
          c ? d && o(a.get("length")) : (o(a.get(Ie)), gt(e) && o(a.get(es)));
          break;
        case "delete":
          c || (o(a.get(Ie)), gt(e) && o(a.get(es)));
          break;
        case "set":
          gt(e) && o(a.get(Ie));
          break;
      }
  }
  As();
}
function Qe(e) {
  const t = P(e);
  return t === e ? t : (Y(t, "iterate", kt), Be(e) ? t : t.map(Fe));
}
function Ts(e) {
  return Y(e = P(e), "iterate", kt), e;
}
function oe(e, t) {
  return je(e) ? Ha(e) ? St(Fe(t)) : St(t) : Fe(t);
}
var Kl = {
  __proto__: null,
  [Symbol.iterator]() {
    return Mn(this, Symbol.iterator, (e) => oe(this, e));
  },
  concat(...e) {
    return Qe(this).concat(
      ...e.map((t) => xt(t) ? Qe(t) : t)
    );
  },
  entries() {
    return Mn(this, "entries", (e) => (e[1] = oe(this, e[1]), e));
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
      (n) => n.map((s) => oe(this, s)),
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
    return Nn(this, "includes", e);
  },
  indexOf(...e) {
    return Nn(this, "indexOf", e);
  },
  join(e) {
    return Qe(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Nn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return de(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return pt(this, "pop");
  },
  push(...e) {
    return pt(this, "push", e);
  },
  reduce(e, ...t) {
    return di(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return di(this, "reduceRight", e, t);
  },
  shift() {
    return pt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return de(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return pt(this, "splice", e);
  },
  toReversed() {
    return Qe(this).toReversed();
  },
  toSorted(e) {
    return Qe(this).toSorted(e);
  },
  toSpliced(...e) {
    return Qe(this).toSpliced(...e);
  },
  unshift(...e) {
    return pt(this, "unshift", e);
  },
  values() {
    return Mn(this, "values", (e) => oe(this, e));
  }
};
function Mn(e, t, n) {
  const s = Ts(e), i = s[t]();
  return s !== e && !Be(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.done || (r.value = n(r.value)), r;
  }), i;
}
var Gl = Array.prototype;
function de(e, t, n, s, i, r) {
  const a = Ts(e), o = a !== e && !Be(e), c = a[t];
  if (c !== Gl[t]) {
    const h = c.apply(e, r);
    return o ? Fe(h) : h;
  }
  let d = n;
  a !== e && (o ? d = function(h, v) {
    return n.call(this, oe(e, h), v, e);
  } : n.length > 2 && (d = function(h, v) {
    return n.call(this, h, v, e);
  }));
  const u = c.call(a, d, s);
  return o && i ? i(u) : u;
}
function di(e, t, n, s) {
  const i = Ts(e), r = i !== e && !Be(e);
  let a = n, o = !1;
  i !== e && (r ? (o = s.length === 0, a = function(d, u, h) {
    return o && (o = !1, d = oe(e, d)), n.call(this, d, oe(e, u), h, e);
  }) : n.length > 3 && (a = function(d, u, h) {
    return n.call(this, d, u, h, e);
  }));
  const c = i[t](a, ...s);
  return o ? oe(e, c) : c;
}
function Nn(e, t, n) {
  const s = P(e);
  Y(s, "iterate", kt);
  const i = s[t](...n);
  return (i === -1 || i === !1) && oc(n[0]) ? (n[0] = P(n[0]), s[t](...n)) : i;
}
function pt(e, t, n = []) {
  Fl(), Ss();
  const s = P(e)[t].apply(e, n);
  return As(), Hl(), s;
}
var Vl = /* @__PURE__ */ Cl("__proto__,__v_isRef,__isVue"), Da = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Mt)
);
function Jl(e) {
  Mt(e) || (e = String(e));
  const t = P(this);
  return Y(t, "has", e), t.hasOwnProperty(e);
}
var qa = class {
  constructor(e = !1, t = !1) {
    this._isReadonly = e, this._isShallow = t;
  }
  get(e, t, n) {
    if (t === "__v_skip")
      return e.__v_skip;
    const s = this._isReadonly, i = this._isShallow;
    if (t === "__v_isReactive")
      return !s;
    if (t === "__v_isReadonly")
      return s;
    if (t === "__v_isShallow")
      return i;
    if (t === "__v_raw")
      return n === (s ? i ? ac : Ba : i ? ic : ja).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const r = xt(e);
    if (!s) {
      let o;
      if (r && (o = Kl[t]))
        return o;
      if (t === "hasOwnProperty")
        return Jl;
    }
    const a = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      vt(e) ? e : n
    );
    if ((Mt(t) ? Da.has(t) : Vl(t)) || (s || Y(e, "get", t), i))
      return a;
    if (vt(a)) {
      const o = r && ks(t) ? a : a.value;
      return s && Et(o) ? ts(o) : o;
    }
    return Et(a) ? s ? ts(a) : Ms(a) : a;
  }
}, Xl = class extends qa {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, s) {
    let i = e[t];
    const r = xt(e) && ks(t);
    if (!this._isShallow) {
      const c = je(i);
      if (!Be(n) && !je(n) && (i = P(i), n = P(n)), !r && vt(i) && !vt(n))
        return c ? (Ue(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (i.value = n, !0);
    }
    const a = r ? Number(t) < e.length : Zn(e, t), o = Reflect.set(
      e,
      t,
      n,
      vt(e) ? e : s
    );
    return e === P(s) && o && (a ? Ce(n, i) && xe(e, "set", t, n, i) : xe(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = Zn(e, t), s = e[t], i = Reflect.deleteProperty(e, t);
    return i && n && xe(e, "delete", t, void 0, s), i;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!Mt(t) || !Da.has(t)) && Y(e, "has", t), n;
  }
  ownKeys(e) {
    return Y(
      e,
      "iterate",
      xt(e) ? "length" : Ie
    ), Reflect.ownKeys(e);
  }
}, Zl = class extends qa {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, t) {
    return Ue(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, t) {
    return Ue(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, Yl = /* @__PURE__ */ new Xl(), Ql = /* @__PURE__ */ new Zl(), Bt = (e) => Reflect.getPrototypeOf(e);
function ec(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = P(i), a = gt(r), o = e === "entries" || e === Symbol.iterator && a, c = e === "keys" && a, d = i[e](...s), u = t ? St : Fe;
    return !t && Y(
      r,
      "iterate",
      c ? es : Ie
    ), _t(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: h, done: v } = d.next();
          return v ? { value: h, done: v } : {
            value: o ? [u(h[0]), u(h[1])] : u(h),
            done: v
          };
        }
      }
    );
  };
}
function Ft(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      Ue(
        `${Ll(e)} operation ${n}failed: target is readonly.`,
        P(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function tc(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, a = P(r), o = P(i);
      e || (Ce(i, o) && Y(a, "get", i), Y(a, "get", o));
      const { has: c } = Bt(a), d = e ? St : Fe;
      if (c.call(a, i))
        return d(r.get(i));
      if (c.call(a, o))
        return d(r.get(o));
      r !== a && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && Y(P(i), "iterate", Ie), i.size;
    },
    has(i) {
      const r = this.__v_raw, a = P(r), o = P(i);
      return e || (Ce(i, o) && Y(a, "has", i), Y(a, "has", o)), i === o ? r.has(i) : r.has(i) || r.has(o);
    },
    forEach(i, r) {
      const a = this, o = a.__v_raw, c = P(o), d = e ? St : Fe;
      return !e && Y(c, "iterate", Ie), o.forEach((u, h) => i.call(r, d(u), d(h), a));
    }
  };
  return _t(
    n,
    e ? {
      add: Ft("add"),
      set: Ft("set"),
      delete: Ft("delete"),
      clear: Ft("clear")
    } : {
      add(i) {
        const r = P(this), a = Bt(r), o = P(i), c = !Be(i) && !je(i) ? o : i;
        return a.has.call(r, c) || Ce(i, c) && a.has.call(r, i) || Ce(o, c) && a.has.call(r, o) || (r.add(c), xe(r, "add", c, c)), this;
      },
      set(i, r) {
        !Be(r) && !je(r) && (r = P(r));
        const a = P(this), { has: o, get: c } = Bt(a);
        let d = o.call(a, i);
        d ? ui(a, o, i) : (i = P(i), d = o.call(a, i));
        const u = c.call(a, i);
        return a.set(i, r), d ? Ce(r, u) && xe(a, "set", i, r, u) : xe(a, "add", i, r), this;
      },
      delete(i) {
        const r = P(this), { has: a, get: o } = Bt(r);
        let c = a.call(r, i);
        c ? ui(r, a, i) : (i = P(i), c = a.call(r, i));
        const d = o ? o.call(r, i) : void 0, u = r.delete(i);
        return c && xe(r, "delete", i, void 0, d), u;
      },
      clear() {
        const i = P(this), r = i.size !== 0, a = gt(i) ? new Map(i) : new Set(i), o = i.clear();
        return r && xe(
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
    n[i] = ec(i, e);
  }), n;
}
function Ua(e, t) {
  const n = tc(e);
  return (s, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? s : Reflect.get(
    Zn(n, i) && i in s ? n : s,
    i,
    r
  );
}
var nc = {
  get: /* @__PURE__ */ Ua(!1)
}, sc = {
  get: /* @__PURE__ */ Ua(!0)
};
function ui(e, t, n) {
  const s = P(n);
  if (s !== n && t.call(e, s)) {
    const i = Ca(e);
    Ue(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var ja = /* @__PURE__ */ new WeakMap(), ic = /* @__PURE__ */ new WeakMap(), Ba = /* @__PURE__ */ new WeakMap(), ac = /* @__PURE__ */ new WeakMap();
function rc(e) {
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
function Ms(e) {
  return /* @__PURE__ */ je(e) ? e : Fa(
    e,
    !1,
    Yl,
    nc,
    ja
  );
}
function ts(e) {
  return Fa(
    e,
    !0,
    Ql,
    sc,
    Ba
  );
}
function Fa(e, t, n, s, i) {
  if (!Et(e))
    return Ue(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = i.get(e);
  if (r)
    return r;
  const a = rc(Ca(e));
  if (a === 0)
    return e;
  const o = new Proxy(
    e,
    a === 2 ? s : n
  );
  return i.set(e, o), o;
}
function Ha(e) {
  return /* @__PURE__ */ je(e) ? /* @__PURE__ */ Ha(e.__v_raw) : !!(e && e.__v_isReactive);
}
function je(e) {
  return !!(e && e.__v_isReadonly);
}
function Be(e) {
  return !!(e && e.__v_isShallow);
}
function oc(e) {
  return e ? !!e.__v_raw : !1;
}
function P(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ P(t) : e;
}
var Fe = (e) => Et(e) ? /* @__PURE__ */ Ms(e) : e, St = (e) => Et(e) ? /* @__PURE__ */ ts(e) : e;
function vt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
ie("nextTick", () => ws);
ie("dispatch", (e) => bt.bind(bt, e));
ie("watch", (e, { evaluateLater: t, cleanup: n }) => (s, i) => {
  let r = t(s), o = Di(() => {
    let c;
    return r((d) => c = d), c;
  }, i);
  n(o);
});
ie("store", vl);
ie("data", (e) => zi(e));
ie("root", (e) => ln(e));
ie("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = De(lc(e))), e._x_refs_proxy));
function lc(e) {
  let t = [];
  return he(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Cn = {};
function Wa(e) {
  return Cn[e] || (Cn[e] = 0), ++Cn[e];
}
function cc(e, t) {
  return he(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function dc(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Wa(t));
}
ie("id", (e, { cleanup: t }) => (n, s = null) => {
  let i = `${n}${s ? `-${s}` : ""}`;
  return uc(e, i, t, () => {
    let r = cc(e, n), a = r ? r._x_ids[n] : Wa(n);
    return s ? `${n}-${a}-${s}` : `${n}-${a}`;
  });
});
dn((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function uc(e, t, n, s) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let i = s();
  return e._x_id[t] = i, n(() => {
    delete e._x_id[t];
  }), i;
}
ie("el", (e) => e);
za("Focus", "focus", "focus");
za("Persist", "persist", "persist");
function za(e, t, n) {
  ie(t, (s) => le(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, s));
}
F("modelable", (e, { expression: t }, { effect: n, evaluateLater: s, cleanup: i }) => {
  let r = s(t), a = () => {
    let u;
    return r((h) => u = h), u;
  }, o = s(`${t} = __placeholder`), c = (u) => o(() => {
  }, { scope: { __placeholder: u } }), d = a();
  c(d), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, h = e._x_model.setWithModifiers, v = Ea(
      {
        get() {
          return u();
        },
        set(T) {
          h(T);
        }
      },
      {
        get() {
          return a();
        },
        set(T) {
          c(T);
        }
      }
    );
    i(v);
  });
});
F("teleport", (e, { modifiers: t, expression: n }, { cleanup: s }) => {
  e.tagName.toLowerCase() !== "template" && le("x-teleport can only be used on a <template> tag", e);
  let i = pi(n), r = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = r, r._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    r.addEventListener(o, (c) => {
      c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
    });
  }), Tt(r, {}, e);
  let a = (o, c, d) => {
    d.includes("prepend") ? c.parentNode.insertBefore(o, c) : d.includes("append") ? c.parentNode.insertBefore(o, c.nextSibling) : c.appendChild(o);
  };
  B(() => {
    ke(() => {
      a(r, i, t), fe(r);
    })();
  }), e._x_teleportPutBack = () => {
    let o = pi(n);
    B(() => {
      a(e._x_teleport, o, t);
    });
  }, s(
    () => B(() => {
      r.remove(), Ke(r);
    })
  );
});
var pc = document.createElement("div");
function pi(e) {
  let t = ke(() => document.querySelector(e), () => pc)();
  return t || le(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Ka = () => {
};
Ka.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
F("ignore", Ka);
F("effect", ke((e, { expression: t }, { effect: n }) => {
  n(Z(e, t));
}));
function tt(e, t, n, s) {
  let i = e, r = (c) => s(c), a = {}, o = (c, d) => (u) => d(c, u);
  return n.includes("dot") && (t = hc(t)), n.includes("camel") && (t = fc(t)), n.includes("capture") && (a.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("passive") && (a.passive = n[n.indexOf("passive") + 1] !== "false"), r = Ga(n, r), n.includes("prevent") && (r = o(r, (c, d) => {
    d.preventDefault(), c(d);
  })), n.includes("stop") && (r = o(r, (c, d) => {
    d.stopPropagation(), c(d);
  })), n.includes("once") && (r = o(r, (c, d) => {
    c(d), i.removeEventListener(t, r, a);
  })), (n.includes("away") || n.includes("outside")) && (i = document, r = o(r, (c, d) => {
    e.contains(d.target) || d.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && c(d));
  })), n.includes("self") && (r = o(r, (c, d) => {
    d.target === e && c(d);
  })), t === "submit" && (r = o(r, (c, d) => {
    d.target._x_pendingModelUpdates && d.target._x_pendingModelUpdates.forEach((u) => u()), c(d);
  })), (gc(t) || Va(t)) && (r = o(r, (c, d) => {
    mc(d, n) || c(d);
  })), i.addEventListener(t, r, a), () => {
    i.removeEventListener(t, r, a);
  };
}
function Ga(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", s = tn(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = _a(t, s);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", s = tn(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = xa(t, s);
  }
  return t;
}
function hc(e) {
  return e.replace(/-/g, ".");
}
function fc(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function tn(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function bc(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function gc(e) {
  return ["keydown", "keyup"].includes(e);
}
function Va(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function mc(e, t) {
  let n = t.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(r));
  if (n.includes("debounce")) {
    let r = n.indexOf("debounce");
    n.splice(r, tn((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let r = n.indexOf("throttle");
    n.splice(r, tn((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && hi(e.key).includes(n[0]))
    return !1;
  const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => n.includes(r));
  return n = n.filter((r) => !i.includes(r)), !(i.length > 0 && i.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), e[`${a}Key`])).length === i.length && (Va(e.type) || hi(e.key).includes(n[0])));
}
function hi(e) {
  if (!e)
    return [];
  e = bc(e);
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
F("model", (e, { modifiers: t, expression: n }, { effect: s, cleanup: i }) => {
  let r = e;
  t.includes("parent") && (r = he(e, (g) => g !== e));
  let a = Z(r, n), o;
  typeof n == "string" ? o = Z(r, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = Z(r, `${n()} = __placeholder`) : o = () => {
  };
  let c = () => {
    let g;
    return a((y) => g = y), fi(g) ? g.get() : g;
  }, d = (g) => {
    let y;
    a((k) => y = k), fi(y) ? y.set(g) : o(() => {
    }, {
      scope: { __placeholder: g }
    });
  };
  typeof n == "string" && e.type === "radio" && B(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = t.includes("change") || t.includes("lazy"), h = t.includes("blur"), v = t.includes("enter"), T = u || h || v, C;
  if (Ee)
    C = () => {
    };
  else if (T) {
    let g = [], y = (k) => d(Ht(e, t, k, c()));
    if (u && g.push(tt(e, "change", t, y)), h && (g.push(tt(e, "blur", t, y)), e.form)) {
      let k = e.form, I = () => y({ target: e });
      k._x_pendingModelUpdates || (k._x_pendingModelUpdates = []), k._x_pendingModelUpdates.push(I), i(() => {
        k._x_pendingModelUpdates && k._x_pendingModelUpdates.splice(k._x_pendingModelUpdates.indexOf(I), 1);
      });
    }
    v && g.push(tt(e, "keydown", t, (k) => {
      k.key === "Enter" && y(k);
    })), C = () => g.forEach((k) => k());
  } else {
    let g = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    C = tt(e, g, t, (y) => {
      d(Ht(e, t, y, c()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(c()) || Qt(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    Ht(e, t, { target: e }, c())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = C, i(() => e._x_removeModelListeners.default()), e.form) {
    let g = tt(e.form, "reset", [], (y) => {
      ws(() => e._x_model && e._x_model.set(Ht(e, t, { target: e }, c())));
    });
    i(() => g());
  }
  if (e._x_model = {
    get() {
      return c();
    },
    set(g) {
      d(g);
    },
    setWithModifiers: Ga(t, d)
  }, e._x_forceModelUpdate = (g) => {
    g === void 0 && typeof n == "string" && n.match(/\./) && (g = ""), B(() => {
      Qt(e) ? Array.isArray(g) ? e.checked = g.some((y) => y == e.value) : e.checked = !!g : Es(e) ? typeof g == "boolean" ? e.checked = Gt(e.value) === g : e.checked = e.value == g : ya(e, "value", g);
    });
  }, e.tagName === "SELECT") {
    let g = new MutationObserver(() => {
      e._x_forceModelUpdate(c());
    });
    g.observe(e, { childList: !0 }), i(() => g.disconnect());
  }
  s(() => {
    let g = c();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(g);
  });
});
function Ht(e, t, n, s) {
  return B(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Qt(e))
      if (Array.isArray(s)) {
        let i = null;
        return t.includes("number") ? i = Rn(n.target.value) : t.includes("boolean") ? i = Gt(n.target.value) : i = n.target.value, n.target.checked ? s.includes(i) ? s : s.concat([i]) : s.filter((r) => !yc(r, i));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((i) => {
          let r = i.value || i.text;
          return Rn(r);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((i) => {
          let r = i.value || i.text;
          return Gt(r);
        }) : Array.from(n.target.selectedOptions).map((i) => i.value || i.text);
      {
        let i;
        return Es(e) ? n.target.checked ? i = n.target.value : i = s : i = n.target.value, t.includes("number") ? Rn(i) : t.includes("boolean") ? Gt(i) : t.includes("trim") ? i.trim() : i;
      }
    }
  });
}
function Rn(e) {
  let t = e ? parseFloat(e) : null;
  return vc(t) ? t : e;
}
function yc(e, t) {
  return e == t;
}
function vc(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function fi(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
F("cloak", (e) => queueMicrotask(() => B(() => e.removeAttribute(rt("cloak")))));
pa(() => `[${rt("init")}]`);
F("init", ke((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
F("text", (e, { expression: t }, { effect: n, evaluateLater: s }) => {
  let i = s(t);
  n(() => {
    i((r) => {
      B(() => {
        e.textContent = r;
      });
    });
  });
});
F("html", (e, { expression: t }, { effect: n, evaluateLater: s }) => {
  let i = s(t);
  n(() => {
    i((r) => {
      B(() => {
        Array.from(e.children).forEach((a) => Ke(a)), e.innerHTML = r ?? "", e._x_ignoreSelf = !0, fe(e), delete e._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
ms(na(":", sa(rt("bind:"))));
var Ja = (e, { value: t, modifiers: n, expression: s, original: i }, { effect: r, cleanup: a }) => {
  if (!t) {
    let c = {};
    _l(c), Z(e, s)((u) => {
      Sa(e, u, i);
    }, { scope: c });
    return;
  }
  if (t === "key")
    return wc(e, s);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = Z(e, s);
  r(() => o((c) => {
    c === void 0 && typeof s == "string" && s.match(/\./) && (c = ""), B(() => ya(e, t, c, n));
  })), a(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Ja.inline = (e, { value: t, modifiers: n, expression: s }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: s, extract: !1 });
};
F("bind", Ja);
function wc(e, t) {
  e._x_keyExpression = t;
}
ua(() => `[${rt("data")}]`);
var Me = /* @__PURE__ */ Symbol();
F("data", (e, { expression: t }, { cleanup: n }) => {
  if (xc(e))
    return;
  let s = e[Me];
  if (s?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let i = {};
  Zt(i, e);
  let r = {};
  El(r, i);
  let a = Pe(e, t, { scope: r });
  (a === void 0 || a === !0) && (a = {}), Zt(a, e);
  let o;
  if (s?.reactiveData) {
    o = s.reactiveData, _c(o, a);
    let d = { expression: t };
    e[Me] = d, queueMicrotask(() => {
      e[Me] === d && delete e[Me];
    });
  } else
    o = it(a);
  hs(o, n);
  let c = Tt(e, o);
  o.init && Pe(e, o.init), n(() => {
    o.destroy && Pe(e, o.destroy), c();
    let d = { reactiveData: o };
    e[Me] = d, queueMicrotask(() => {
      e[Me] === d && delete e[Me];
    });
  });
});
function _c(e, t) {
  Object.keys(t).forEach((n) => {
    let s = Object.getOwnPropertyDescriptor(t, n), i = Object.getOwnPropertyDescriptor(e, n);
    s.get || s.set || i?.get || i?.set ? (i && delete e[n], i || (e[n] = void 0), s.get || s.set ? Object.defineProperty(e, n, s) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
dn((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function xc(e) {
  return Ee ? Xn ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
F("show", (e, { modifiers: t, expression: n }, { effect: s }) => {
  let i = Z(e, n);
  e._x_doHide || (e._x_doHide = () => {
    B(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    B(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let r = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, a = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, o = () => setTimeout(a), c = Vn(
    (h) => h ? a() : r(),
    (h) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, h, a, r) : h ? o() : r();
    }
  ), d, u = !0;
  s(() => i((h) => {
    !u && h === d || (t.includes("immediate") && (h ? o() : r()), c(h), d = h, u = !1);
  }));
});
F("for", ke((e, { expression: t }, { effect: n, cleanup: s }) => {
  let i = Sc(t), r = Z(e, i.items), a = Z(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => kc(e, i, r, a), { priority: "structural" }), s(() => {
    e._x_lookup.forEach(
      (o) => B(() => {
        Ke(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function Ec(e) {
  return (t) => {
    Object.entries(t).forEach(([n, s]) => {
      e[n] = s;
    });
  };
}
function kc(e, t, n, s) {
  n((i) => {
    Oc(i) && (i = Array.from({ length: i }, (d, u) => u + 1)), i == null && (i = []), i instanceof Set && (i = Array.from(i)), i instanceof Map && (i = Array.from(i));
    let r = e._x_lookup, a = /* @__PURE__ */ new Map();
    e._x_lookup = a;
    let o = Tc(i), c = Object.entries(i).map(([d, u]) => {
      o || (d = parseInt(d));
      let h = Ac(t, u, d, i), v;
      return s((T) => {
        typeof T == "object" && le("x-for key cannot be an object, it must be a string or an integer", e), r.has(T) && (a.set(T, r.get(T)), r.delete(T)), v = T;
      }, { scope: { index: d, ...h } }), [v, h];
    });
    B(() => {
      r.forEach((h) => {
        Ke(h), h.remove();
      });
      let d = /* @__PURE__ */ new Set(), u = e;
      c.forEach(([h, v]) => {
        if (a.has(h)) {
          let g = a.get(h);
          g._x_refreshXForScope(v), u.nextElementSibling !== g && (u.nextElementSibling && g.replaceWith(u.nextElementSibling), u.after(g)), u = g, g._x_currentIfEl && (g.nextElementSibling !== g._x_currentIfEl && u.after(g._x_currentIfEl), u = g._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && le("x-for templates require a single root element, additional elements will be ignored.", e);
        let T = document.importNode(e.content, !0).firstElementChild, C = it(v);
        Tt(T, C, e), T._x_refreshXForScope = Ec(C), a.set(h, T), d.add(T), u.after(T), u = T;
      }), d.forEach((h) => fe(h)), u !== e ? e._x_lastRenderedEl = u : delete e._x_lastRenderedEl;
    });
  });
}
function Sc(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, s = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, i = e.match(s);
  if (!i)
    return;
  let r = {};
  r.items = i[2].trim();
  let a = i[1].replace(n, "").trim(), o = a.match(t);
  return o ? (r.item = a.replace(t, "").trim(), r.index = o[1].trim(), o[2] && (r.collection = o[2].trim())) : r.item = a, r;
}
function Ac(e, t, n, s) {
  let i = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    i[a] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    i[a] = t[a];
  }) : i[e.item] = t, e.index && (i[e.index] = n), e.collection && (i[e.collection] = s), i;
}
function Oc(e) {
  return typeof e != "object" && !isNaN(e);
}
function Tc(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function Xa() {
}
Xa.inline = (e, { expression: t }, { cleanup: n }) => {
  let s = ln(e);
  s && (s._x_refs || (s._x_refs = {}), s._x_refs[t] = e, n(() => delete s._x_refs[t]));
};
F("ref", Xa);
F("if", ke((e, { expression: t }, { effect: n, cleanup: s }) => {
  e.tagName.toLowerCase() !== "template" && le("x-if can only be used on a <template> tag", e);
  let i = Z(e, t), r = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return Tt(o, {}, e), B(() => {
      e.after(o), fe(o);
    }), e._x_currentIfEl = o, e._x_lastRenderedEl = o, e._x_undoIf = () => {
      B(() => {
        Ke(o), o.remove();
      }), delete e._x_currentIfEl, delete e._x_lastRenderedEl;
    }, o;
  }, a = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => i((o) => {
    o ? r() : a();
  }), { priority: "structural" }), s(() => e._x_undoIf && e._x_undoIf());
}));
F("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((i) => dc(e, i));
});
dn((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
ms(na("@", sa(rt("on:"))));
F("on", ke((e, { value: t, modifiers: n, expression: s }, { cleanup: i }) => {
  let r = s ? Z(e, s) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let a = tt(e, t, n, (o) => {
    r(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  i(() => a());
}));
un("Collapse", "collapse", "collapse");
un("Intersect", "intersect", "intersect");
un("Focus", "trap", "focus");
un("Mask", "mask", "mask");
function un(e, t, n) {
  F(t, (s) => le(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, s));
}
F("html", (e, { expression: t }) => {
  fs(new Error("Using the x-html directive is prohibited in the CSP build"), e);
});
ot.setEvaluator(Ml);
ot.setRawEvaluator(Tl);
ot.setReactivityEngine({
  reactive: Ms,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = jl(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: Bl,
  raw: P
});
var Mc = ot, wt = Mc;
function Nc(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const nn = "__siteationDebugBarHostLock";
function Cc(e) {
  if (!e || window[nn]) return;
  const t = document.body, n = Math.max(0, window.innerWidth - document.documentElement.clientWidth), s = {
    overflow: t.style.overflow,
    paddingRight: t.style.paddingRight,
    inert: []
  };
  if (Array.from(t.children).forEach((i) => {
    i === e || i.contains(e) || !(i instanceof HTMLElement) || i.matches("script, style, link") || (s.inert.push([i, i.inert]), i.inert = !0);
  }), t.style.overflow = "hidden", n > 0) {
    const i = Number.parseFloat(window.getComputedStyle(t).paddingRight || "0");
    t.style.paddingRight = `${i + n}px`;
  }
  window[nn] = s;
}
function Rc() {
  const e = window[nn];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[nn]);
}
function bi(e, t) {
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(t.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((a) => a.offsetParent !== null);
  if (n.length === 0) return;
  const s = n[0], i = n[n.length - 1], r = t.getRootNode().activeElement;
  e.shiftKey && r === s ? (e.preventDefault(), i.focus()) : !e.shiftKey && r === i && (e.preventDefault(), s.focus());
}
const et = 12;
function $c(e) {
  return !!(e && typeof e == "object" && Number.isFinite(e.left) && Number.isFinite(e.top));
}
function $n(e, t, n) {
  const s = Math.max(et, n.width - t.width - et), i = Math.max(et, n.height - t.height - et);
  return {
    left: Math.min(Math.max(e.left, et), s),
    top: Math.min(Math.max(e.top, et), i)
  };
}
function Pc(e, t, n) {
  return e.top + t.height / 2 < n / 2 ? "top" : "bottom";
}
const Ic = 3;
function Lc(e, t) {
  return Math.hypot(e, t) >= Ic;
}
function Dc(e) {
  const t = String(e || "").split(",").map((n) => n.trim()).filter(Boolean);
  return t.length === 0 ? sn : sn.filter((n) => qc.includes(n.id) || t.includes(n.id));
}
const qc = ["findings", "overview"], sn = [
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
    id: "seo",
    label: "SEO",
    lead: "This page as a search engine or a link preview reads it: tags, headings, images, links and structured data.",
    graded: !1
  },
  {
    id: "history",
    label: "History",
    lead: "Every request still on disk, so an earlier one is one click away.",
    graded: !1
  }
];
function Za(e, t) {
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
    case "seo":
      return t.seo.warningCount || null;
    case "history":
      return t.history.length || null;
    default:
      return null;
  }
}
const Uc = {
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
function j(e, t = "") {
  return `<svg class="ndb-icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${Uc[e] || ""}</svg>`;
}
function jc(e) {
  return [...Bc(e), ...Fc(e), ...Hc(e)];
}
function Bc(e) {
  return sn.map((t) => {
    const n = Za(t.id, e);
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
function Fc(e) {
  const t = [
    { value: "system", label: "Follow the system theme" },
    { value: "light", label: "Use the light theme" },
    { value: "dark", label: "Use the dark theme" }
  ], n = e.currentSection || {};
  return [
    ...t.map((s) => ({
      id: `theme:${s.value}`,
      group: "Appearance",
      label: s.label,
      hint: e.theme === s.value ? "Current" : "",
      keywords: `theme ${s.value}`,
      kind: "theme",
      arg: s.value
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
    ...e.dockPosition ? [{
      id: "dock-reset",
      group: "Appearance",
      label: "Put the bar back on its edge",
      hint: "moved",
      keywords: "reset dock position centre center move drag restore default",
      kind: "dock-reset",
      arg: ""
    }] : [],
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
function Hc(e) {
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
function Wc(e, t) {
  const n = String(t || "").trim().toLowerCase(), s = n ? e.filter((i) => `${i.group} ${i.label} ${i.keywords}`.toLowerCase().includes(n)) : e;
  return s.map((i, r) => ({
    ...i,
    leads: r === 0 || s[r - 1].group !== i.group
  }));
}
function zc() {
  return `
<div class="ndb-palette" data-ndb-bind:class="paletteOpen && 'is-open'"
     data-ndb-on:keydown="paletteKeys($event)">
  <div class="ndb-palette-backdrop" data-ndb-on:click="closePalette()"></div>

  <div class="ndb-palette-box" data-ndb-ref="palette"
       role="dialog" aria-modal="true" aria-label="Commands">
    <div class="ndb-palette-field">
      ${j("search")}
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
const st = "full", Ya = "masked", ge = "none", Kc = "[redacted]", Gc = "[masked]", Vc = "[maximum depth reached]", Jc = "[circular]", Xc = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, Zc = 5, Vt = 100, gi = 400;
function Yc(e) {
  return [st, Ya, ge].includes(e) ? e : st;
}
function Qc(e) {
  return Xc.test(String(e));
}
function Ns(e, t = st) {
  if (t !== ge)
    return Cs(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function an(e, t = st) {
  return t === ge ? "" : t === Ya ? e === "" ? "" : Gc : e.length <= gi ? e : `${e.slice(0, gi)}...`;
}
function Qa(e, t = st) {
  if (t === ge) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return an(n, st);
}
function Cs(e, t, n, s) {
  if (e == null) return e;
  const i = typeof e;
  return i === "string" ? an(e, t) : i === "number" || i === "boolean" ? e : i === "function" ? `ƒ ${e.name || "anonymous"}()` : i === "symbol" ? e.toString() : i === "bigint" ? `${e}n` : i !== "object" ? i : e instanceof Node ? nd(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${an(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= Zc ? Vc : s.has(e) ? Jc : (s.add(e), Array.isArray(e) ? ed(e, t, n, s) : td(e, t, n, s));
}
function ed(e, t, n, s) {
  const i = e.slice(0, Vt).map((r) => Cs(r, t, n + 1, s));
  return e.length > Vt && i.push(`[${e.length - Vt} more]`), i;
}
function td(e, t, n, s) {
  const i = pn(e), r = /* @__PURE__ */ Object.create(null);
  let a = 0;
  for (const o of i) {
    if (a >= Vt) {
      r.__truncated__ = i.length - a;
      break;
    }
    if (Qc(o)) {
      r[o] = Kc, a++;
      continue;
    }
    try {
      r[o] = Cs(e[o], t, n + 1, s);
    } catch (c) {
      r[o] = `[unreadable: ${c && c.message ? c.message : "threw"}]`;
    }
    a++;
  }
  return r;
}
function pn(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function nd(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
function sd(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Pn, mi;
function id() {
  if (mi) return Pn;
  mi = 1;
  function e(l) {
    return l instanceof Map ? l.clear = l.delete = l.set = function() {
      throw new Error("map is read-only");
    } : l instanceof Set && (l.add = l.clear = l.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(l), Object.getOwnPropertyNames(l).forEach((p) => {
      const b = l[p], A = typeof b;
      (A === "object" || A === "function") && !Object.isFrozen(b) && e(b);
    }), l;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(p) {
      p.data === void 0 && (p.data = {}), this.data = p.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(l) {
    return l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function s(l, ...p) {
    const b = /* @__PURE__ */ Object.create(null);
    for (const A in l)
      b[A] = l[A];
    return p.forEach(function(A) {
      for (const q in A)
        b[q] = A[q];
    }), /** @type {T} */
    b;
  }
  const i = "</span>", r = (l) => !!l.scope, a = (l, { prefix: p }) => {
    if (l.startsWith("language:"))
      return l.replace("language:", "language-");
    if (l.includes(".")) {
      const b = l.split(".");
      return [
        `${p}${b.shift()}`,
        ...b.map((A, q) => `${A}${"_".repeat(q + 1)}`)
      ].join(" ");
    }
    return `${p}${l}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(p, b) {
      this.buffer = "", this.classPrefix = b.classPrefix, p.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(p) {
      this.buffer += n(p);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(p) {
      if (!r(p)) return;
      const b = a(
        p.scope,
        { prefix: this.classPrefix }
      );
      this.span(b);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(p) {
      r(p) && (this.buffer += i);
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
    span(p) {
      this.buffer += `<span class="${p}">`;
    }
  }
  const c = (l = {}) => {
    const p = { children: [] };
    return Object.assign(p, l), p;
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
    add(p) {
      this.top.children.push(p);
    }
    /** @param {string} scope */
    openNode(p) {
      const b = c({ scope: p });
      this.add(b), this.stack.push(b);
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
    walk(p) {
      return this.constructor._walk(p, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(p, b) {
      return typeof b == "string" ? p.addText(b) : b.children && (p.openNode(b), b.children.forEach((A) => this._walk(p, A)), p.closeNode(b)), p;
    }
    /**
     * @param {Node} node
     */
    static _collapse(p) {
      typeof p != "string" && p.children && (p.children.every((b) => typeof b == "string") ? p.children = [p.children.join("")] : p.children.forEach((b) => {
        d._collapse(b);
      }));
    }
  }
  class u extends d {
    /**
     * @param {*} options
     */
    constructor(p) {
      super(), this.options = p;
    }
    /**
     * @param {string} text
     */
    addText(p) {
      p !== "" && this.add(p);
    }
    /** @param {string} scope */
    startScope(p) {
      this.openNode(p);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(p, b) {
      const A = p.root;
      b && (A.scope = `language:${b}`), this.add(A);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function h(l) {
    return l ? typeof l == "string" ? l : l.source : null;
  }
  function v(l) {
    return g("(?=", l, ")");
  }
  function T(l) {
    return g("(?:", l, ")*");
  }
  function C(l) {
    return g("(?:", l, ")?");
  }
  function g(...l) {
    return l.map((b) => h(b)).join("");
  }
  function y(l) {
    const p = l[l.length - 1];
    return typeof p == "object" && p.constructor === Object ? (l.splice(l.length - 1, 1), p) : {};
  }
  function k(...l) {
    return "(" + (y(l).capture ? "" : "?:") + l.map((A) => h(A)).join("|") + ")";
  }
  function I(l) {
    return new RegExp(l.toString() + "|").exec("").length - 1;
  }
  function Ge(l, p) {
    const b = l && l.exec(p);
    return b && b.index === 0;
  }
  const Ve = new RegExp(k(
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
  function X(l, { joinWith: p }) {
    let b = 0;
    return l.map((A) => {
      b += 1;
      const q = b;
      let U = h(A), _ = "";
      for (; U.length > 0; ) {
        const w = Ve.exec(U);
        if (!w) {
          _ += U;
          break;
        }
        _ += U.substring(0, w.index), U = U.substring(w.index + w[0].length), w[0][0] === "\\" && w[1] ? _ += "\\" + String(Number(w[1]) + q) : (_ += w[0], (w[0] === "(" || /^\(\?[<']/.test(w[0])) && b++);
      }
      return _;
    }).map((A) => `(${A})`).join(p);
  }
  const Q = /\b\B/, Je = "[a-zA-Z]\\w*", me = "[a-zA-Z_]\\w*", te = "\\b\\d+(\\.\\d+)?", Nt = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", Ct = "\\b(0b[01]+)", bn = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", gn = (l = {}) => {
    const p = /^#![ ]*\//;
    return l.binary && (l.begin = g(
      p,
      /.*\b/,
      l.binary,
      /\b.*/
    )), s({
      scope: "meta",
      begin: p,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (b, A) => {
        b.index !== 0 && A.ignoreMatch();
      }
    }, l);
  }, Se = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, mn = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [Se]
  }, Rt = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [Se]
  }, yn = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, G = function(l, p, b = {}) {
    const A = s(
      {
        scope: "comment",
        begin: l,
        end: p,
        contains: []
      },
      b
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
        begin: g(
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
  }, ye = G("//", "$"), Ae = G("/\\*", "\\*/"), Xe = G("#", "$"), lt = {
    scope: "number",
    begin: te,
    relevance: 0
  }, $t = {
    scope: "number",
    begin: Nt,
    relevance: 0
  }, br = {
    scope: "number",
    begin: Ct,
    relevance: 0
  }, gr = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      Se,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Se]
      }
    ]
  }, mr = {
    scope: "title",
    begin: Je,
    relevance: 0
  }, yr = {
    scope: "title",
    begin: me,
    relevance: 0
  }, vr = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + me,
    relevance: 0
  };
  var Pt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: mn,
    BACKSLASH_ESCAPE: Se,
    BINARY_NUMBER_MODE: br,
    BINARY_NUMBER_RE: Ct,
    COMMENT: G,
    C_BLOCK_COMMENT_MODE: Ae,
    C_LINE_COMMENT_MODE: ye,
    C_NUMBER_MODE: $t,
    C_NUMBER_RE: Nt,
    END_SAME_AS_BEGIN: function(l) {
      return Object.assign(
        l,
        {
          /** @type {ModeCallback} */
          "on:begin": (p, b) => {
            b.data._beginMatch = p[1];
          },
          /** @type {ModeCallback} */
          "on:end": (p, b) => {
            b.data._beginMatch !== p[1] && b.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: Xe,
    IDENT_RE: Je,
    MATCH_NOTHING_RE: Q,
    METHOD_GUARD: vr,
    NUMBER_MODE: lt,
    NUMBER_RE: te,
    PHRASAL_WORDS_MODE: yn,
    QUOTE_STRING_MODE: Rt,
    REGEXP_MODE: gr,
    RE_STARTERS_RE: bn,
    SHEBANG: gn,
    TITLE_MODE: mr,
    UNDERSCORE_IDENT_RE: me,
    UNDERSCORE_TITLE_MODE: yr
  });
  function wr(l, p) {
    l.input[l.index - 1] === "." && p.ignoreMatch();
  }
  function _r(l, p) {
    l.className !== void 0 && (l.scope = l.className, delete l.className);
  }
  function xr(l, p) {
    p && l.beginKeywords && (l.begin = "\\b(" + l.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", l.__beforeBegin = wr, l.keywords = l.keywords || l.beginKeywords, delete l.beginKeywords, l.relevance === void 0 && (l.relevance = 0));
  }
  function Er(l, p) {
    Array.isArray(l.illegal) && (l.illegal = k(...l.illegal));
  }
  function kr(l, p) {
    if (l.match) {
      if (l.begin || l.end) throw new Error("begin & end are not supported with match");
      l.begin = l.match, delete l.match;
    }
  }
  function Sr(l, p) {
    l.relevance === void 0 && (l.relevance = 1);
  }
  const Ar = (l, p) => {
    if (!l.beforeMatch) return;
    if (l.starts) throw new Error("beforeMatch cannot be used with starts");
    const b = Object.assign({}, l);
    Object.keys(l).forEach((A) => {
      delete l[A];
    }), l.keywords = b.keywords, l.begin = g(b.beforeMatch, v(b.begin)), l.starts = {
      relevance: 0,
      contains: [
        Object.assign(b, { endsParent: !0 })
      ]
    }, l.relevance = 0, delete b.beforeMatch;
  }, Or = [
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
  ], Tr = "keyword";
  function js(l, p, b = Tr) {
    const A = /* @__PURE__ */ Object.create(null);
    return typeof l == "string" ? q(b, l.split(" ")) : Array.isArray(l) ? q(b, l) : Object.keys(l).forEach(function(U) {
      Object.assign(
        A,
        js(l[U], p, U)
      );
    }), A;
    function q(U, _) {
      p && (_ = _.map((w) => w.toLowerCase())), _.forEach(function(w) {
        const S = w.split("|");
        A[S[0]] = [U, Mr(S[0], S[1])];
      });
    }
  }
  function Mr(l, p) {
    return p ? Number(p) : Nr(l) ? 0 : 1;
  }
  function Nr(l) {
    return Or.includes(l.toLowerCase());
  }
  const Bs = {}, Oe = (l) => {
    console.error(l);
  }, Fs = (l, ...p) => {
    console.log(`WARN: ${l}`, ...p);
  }, Ze = (l, p) => {
    Bs[`${l}/${p}`] || (console.log(`Deprecated as of ${l}. ${p}`), Bs[`${l}/${p}`] = !0);
  }, It = new Error();
  function Hs(l, p, { key: b }) {
    let A = 0;
    const q = l[b], U = {}, _ = {};
    for (let w = 1; w <= p.length; w++)
      _[w + A] = q[w], U[w + A] = !0, A += I(p[w - 1]);
    l[b] = _, l[b]._emit = U, l[b]._multi = !0;
  }
  function Cr(l) {
    if (Array.isArray(l.begin)) {
      if (l.skip || l.excludeBegin || l.returnBegin)
        throw Oe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), It;
      if (typeof l.beginScope != "object" || l.beginScope === null)
        throw Oe("beginScope must be object"), It;
      Hs(l, l.begin, { key: "beginScope" }), l.begin = X(l.begin, { joinWith: "" });
    }
  }
  function Rr(l) {
    if (Array.isArray(l.end)) {
      if (l.skip || l.excludeEnd || l.returnEnd)
        throw Oe("skip, excludeEnd, returnEnd not compatible with endScope: {}"), It;
      if (typeof l.endScope != "object" || l.endScope === null)
        throw Oe("endScope must be object"), It;
      Hs(l, l.end, { key: "endScope" }), l.end = X(l.end, { joinWith: "" });
    }
  }
  function $r(l) {
    l.scope && typeof l.scope == "object" && l.scope !== null && (l.beginScope = l.scope, delete l.scope);
  }
  function Pr(l) {
    $r(l), typeof l.beginScope == "string" && (l.beginScope = { _wrap: l.beginScope }), typeof l.endScope == "string" && (l.endScope = { _wrap: l.endScope }), Cr(l), Rr(l);
  }
  function Ir(l) {
    function p(_, w) {
      return new RegExp(
        h(_),
        "m" + (l.case_insensitive ? "i" : "") + (l.unicodeRegex ? "u" : "") + (w ? "g" : "")
      );
    }
    class b {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(w, S) {
        S.position = this.position++, this.matchIndexes[this.matchAt] = S, this.regexes.push([S, w]), this.matchAt += I(w) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const w = this.regexes.map((S) => S[1]);
        this.matcherRe = p(X(w, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(w) {
        this.matcherRe.lastIndex = this.lastIndex;
        const S = this.matcherRe.exec(w);
        if (!S)
          return null;
        const K = S.findIndex((ct, wn) => wn > 0 && ct !== void 0), H = this.matchIndexes[K];
        return S.splice(0, K), Object.assign(S, H);
      }
    }
    class A {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(w) {
        if (this.multiRegexes[w]) return this.multiRegexes[w];
        const S = new b();
        return this.rules.slice(w).forEach(([K, H]) => S.addRule(K, H)), S.compile(), this.multiRegexes[w] = S, S;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(w, S) {
        this.rules.push([w, S]), S.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(w) {
        const S = this.getMatcher(this.regexIndex);
        S.lastIndex = this.lastIndex;
        let K = S.exec(w);
        if (this.resumingScanAtSamePosition() && !(K && K.index === this.lastIndex)) {
          const H = this.getMatcher(0);
          H.lastIndex = this.lastIndex + 1, K = H.exec(w);
        }
        return K && (this.regexIndex += K.position + 1, this.regexIndex === this.count && this.considerAll()), K;
      }
    }
    function q(_) {
      const w = new A();
      return _.contains.forEach((S) => w.addRule(S.begin, { rule: S, type: "begin" })), _.terminatorEnd && w.addRule(_.terminatorEnd, { type: "end" }), _.illegal && w.addRule(_.illegal, { type: "illegal" }), w;
    }
    function U(_, w) {
      const S = (
        /** @type CompiledMode */
        _
      );
      if (_.isCompiled) return S;
      [
        _r,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        kr,
        Pr,
        Ar
      ].forEach((H) => H(_, w)), l.compilerExtensions.forEach((H) => H(_, w)), _.__beforeBegin = null, [
        xr,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Er,
        // default to 1 relevance if not specified
        Sr
      ].forEach((H) => H(_, w)), _.isCompiled = !0;
      let K = null;
      return typeof _.keywords == "object" && _.keywords.$pattern && (_.keywords = Object.assign({}, _.keywords), K = _.keywords.$pattern, delete _.keywords.$pattern), K = K || /\w+/, _.keywords && (_.keywords = js(_.keywords, l.case_insensitive)), S.keywordPatternRe = p(K, !0), w && (_.begin || (_.begin = /\B|\b/), S.beginRe = p(S.begin), !_.end && !_.endsWithParent && (_.end = /\B|\b/), _.end && (S.endRe = p(S.end)), S.terminatorEnd = h(S.end) || "", _.endsWithParent && w.terminatorEnd && (S.terminatorEnd += (_.end ? "|" : "") + w.terminatorEnd)), _.illegal && (S.illegalRe = p(
        /** @type {RegExp | string} */
        _.illegal
      )), _.contains || (_.contains = []), _.contains = [].concat(..._.contains.map(function(H) {
        return Lr(H === "self" ? _ : H);
      })), _.contains.forEach(function(H) {
        U(
          /** @type Mode */
          H,
          S
        );
      }), _.starts && U(_.starts, w), S.matcher = q(S), S;
    }
    if (l.compilerExtensions || (l.compilerExtensions = []), l.contains && l.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return l.classNameAliases = s(l.classNameAliases || {}), U(
      /** @type Mode */
      l
    );
  }
  function Ws(l) {
    return l ? l.endsWithParent || Ws(l.starts) : !1;
  }
  function Lr(l) {
    return l.variants && !l.cachedVariants && (l.cachedVariants = l.variants.map(function(p) {
      return s(l, { variants: null }, p);
    })), l.cachedVariants ? l.cachedVariants : Ws(l) ? s(l, { starts: l.starts ? s(l.starts) : null }) : Object.isFrozen(l) ? s(l) : l;
  }
  var Dr = "11.12.0";
  class qr extends Error {
    constructor(p, b) {
      super(p), this.name = "HTMLInjectionError", this.html = b;
    }
  }
  const vn = n, zs = s, Ks = /* @__PURE__ */ Symbol("nomatch"), Ur = 7, Gs = function(l) {
    const p = /* @__PURE__ */ Object.create(null), b = /* @__PURE__ */ Object.create(null), A = [];
    let q = !0;
    const U = "Could not find the language '{}', did you forget to load/include a language module?", _ = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let w = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: u
    };
    function S(f) {
      return w.noHighlightRe.test(f);
    }
    function K(f) {
      let E = f.className + " ";
      E += f.parentNode ? f.parentNode.className : "";
      const N = w.languageDetectRe.exec(E);
      if (N) {
        const L = ve(N[1]);
        return L || (Fs(U.replace("{}", N[1])), Fs("Falling back to no-highlight mode for this block.", f)), L ? N[1] : "no-highlight";
      }
      return E.split(/\s+/).find((L) => S(L) || ve(L));
    }
    function H(f, E, N) {
      let L = "", W = "";
      typeof E == "object" ? (L = f, N = E.ignoreIllegals, W = E.language) : (Ze("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ze("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), W = f, L = E), N === void 0 && (N = !0);
      const ne = {
        code: L,
        language: W
      };
      Dt("before:highlight", ne);
      const we = ne.result ? ne.result : ct(ne.language, ne.code, N);
      return we.code = ne.code, Dt("after:highlight", we), we;
    }
    function ct(f, E, N, L) {
      const W = /* @__PURE__ */ Object.create(null);
      function ne(m, x) {
        return m.keywords[x];
      }
      function we() {
        if (!O.keywords) {
          V.addText(D);
          return;
        }
        let m = 0;
        O.keywordPatternRe.lastIndex = 0;
        let x = O.keywordPatternRe.exec(D), M = "";
        for (; x; ) {
          M += D.substring(m, x.index);
          const R = re.case_insensitive ? x[0].toLowerCase() : x[0], J = ne(O, R);
          if (J) {
            const [ce, no] = J;
            if (V.addText(M), M = "", W[R] = (W[R] || 0) + 1, W[R] <= Ur && (jt += no), ce.startsWith("_"))
              M += x[0];
            else {
              const so = re.classNameAliases[ce] || ce;
              ae(x[0], so);
            }
          } else
            M += x[0];
          m = O.keywordPatternRe.lastIndex, x = O.keywordPatternRe.exec(D);
        }
        M += D.substring(m), V.addText(M);
      }
      function qt() {
        if (D === "") return;
        let m = null;
        if (typeof O.subLanguage == "string") {
          if (!p[O.subLanguage]) {
            V.addText(D);
            return;
          }
          m = ct(O.subLanguage, D, !0, ti[O.subLanguage]), ti[O.subLanguage] = /** @type {CompiledMode} */
          m._top;
        } else
          m = _n(D, O.subLanguage.length ? O.subLanguage : null);
        O.relevance > 0 && (jt += m.relevance), V.__addSublanguage(m._emitter, m.language);
      }
      function ee() {
        O.subLanguage != null ? qt() : we(), D = "";
      }
      function ae(m, x) {
        m !== "" && (V.startScope(x), V.addText(m), V.endScope());
      }
      function Zs(m, x) {
        let M = 1;
        const R = x.length - 1;
        for (; M <= R; ) {
          if (!m._emit[M]) {
            M++;
            continue;
          }
          const J = re.classNameAliases[m[M]] || m[M], ce = x[M];
          J ? ae(ce, J) : (D = ce, we(), D = ""), M++;
        }
      }
      function Ys(m, x) {
        return m.scope && typeof m.scope == "string" && V.openNode(re.classNameAliases[m.scope] || m.scope), m.beginScope && (m.beginScope._wrap ? (ae(D, re.classNameAliases[m.beginScope._wrap] || m.beginScope._wrap), D = "") : m.beginScope._multi && (Zs(m.beginScope, x), D = "")), O = Object.create(m, { parent: { value: O } }), O;
      }
      function Qs(m, x, M) {
        let R = Ge(m.endRe, M);
        if (R) {
          if (m["on:end"]) {
            const J = new t(m);
            m["on:end"](x, J), J.isMatchIgnored && (R = !1);
          }
          if (R) {
            for (; m.endsParent && m.parent; )
              m = m.parent;
            return m;
          }
        }
        if (m.endsWithParent)
          return Qs(m.parent, x, M);
      }
      function Zr(m) {
        return O.matcher.regexIndex === 0 ? (D += m[0], 1) : (Sn = !0, 0);
      }
      function Yr(m) {
        const x = m[0], M = m.rule, R = new t(M), J = [M.__beforeBegin, M["on:begin"]];
        for (const ce of J)
          if (ce && (ce(m, R), R.isMatchIgnored))
            return Zr(x);
        return M.skip ? D += x : (M.excludeBegin && (D += x), ee(), !M.returnBegin && !M.excludeBegin && (D = x)), Ys(M, m), M.returnBegin ? 0 : x.length;
      }
      function Qr(m) {
        const x = m[0], M = E.substring(m.index), R = Qs(O, m, M);
        if (!R)
          return Ks;
        const J = O;
        O.endScope && O.endScope._wrap ? (ee(), ae(x, O.endScope._wrap)) : O.endScope && O.endScope._multi ? (ee(), Zs(O.endScope, m)) : J.skip ? D += x : (J.returnEnd || J.excludeEnd || (D += x), ee(), J.excludeEnd && (D = x));
        do
          O.scope && V.closeNode(), !O.skip && !O.subLanguage && (jt += O.relevance), O = O.parent;
        while (O !== R.parent);
        return R.starts && Ys(R.starts, m), J.returnEnd ? 0 : x.length;
      }
      function eo() {
        const m = [];
        for (let x = O; x !== re; x = x.parent)
          x.scope && m.unshift(x.scope);
        m.forEach((x) => V.openNode(x));
      }
      let Ut = {};
      function ei(m, x) {
        const M = x && x[0];
        if (D += m, M == null)
          return ee(), 0;
        if (Ut.type === "begin" && x.type === "end" && Ut.index === x.index && M === "") {
          if (D += E.slice(x.index, x.index + 1), !q) {
            const R = new Error(`0 width match regex (${f})`);
            throw R.languageName = f, R.badRule = Ut.rule, R;
          }
          return 1;
        }
        if (Ut = x, x.type === "begin")
          return Yr(x);
        if (x.type === "illegal" && !N) {
          const R = new Error('Illegal lexeme "' + M + '" for mode "' + (O.scope || "<unnamed>") + '"');
          throw R.mode = O, R;
        } else if (x.type === "end") {
          const R = Qr(x);
          if (R !== Ks)
            return R;
        }
        if (x.type === "illegal" && M === "")
          return x.index === E.length || (D += `
`), 1;
        if (kn > 1e5 && kn > x.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return D += M, M.length;
      }
      const re = ve(f);
      if (!re)
        throw Oe(U.replace("{}", f)), new Error('Unknown language: "' + f + '"');
      const to = Ir(re);
      let En = "", O = L || to;
      const ti = {}, V = new w.__emitter(w);
      eo();
      let D = "", jt = 0, Te = 0, kn = 0, Sn = !1;
      try {
        if (re.__emitTokens)
          re.__emitTokens(E, V);
        else {
          for (O.matcher.considerAll(); ; ) {
            kn++, Sn ? Sn = !1 : O.matcher.considerAll(), O.matcher.lastIndex = Te;
            const m = O.matcher.exec(E);
            if (!m) break;
            const x = E.substring(Te, m.index), M = ei(x, m);
            Te = m.index + M;
          }
          ei(E.substring(Te));
        }
        return V.finalize(), En = V.toHTML(), {
          language: f,
          value: En,
          relevance: jt,
          illegal: !1,
          _emitter: V,
          _top: O
        };
      } catch (m) {
        if (m.message && m.message.includes("Illegal"))
          return {
            language: f,
            value: vn(E),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: m.message,
              index: Te,
              context: E.slice(Te - 100, Te + 100),
              mode: m.mode,
              resultSoFar: En
            },
            _emitter: V
          };
        if (q)
          return {
            language: f,
            value: vn(E),
            illegal: !1,
            relevance: 0,
            errorRaised: m,
            _emitter: V,
            _top: O
          };
        throw m;
      }
    }
    function wn(f) {
      const E = {
        value: vn(f),
        illegal: !1,
        relevance: 0,
        _top: _,
        _emitter: new w.__emitter(w)
      };
      return E._emitter.addText(f), E;
    }
    function _n(f, E) {
      E = E || w.languages || Object.keys(p);
      const N = wn(f), L = E.filter(ve).filter(Xs).map(
        (ee) => ct(ee, f, !1)
      );
      L.unshift(N);
      const W = L.sort((ee, ae) => {
        if (ee.relevance !== ae.relevance) return ae.relevance - ee.relevance;
        if (ee.language && ae.language) {
          if (ve(ee.language).supersetOf === ae.language)
            return 1;
          if (ve(ae.language).supersetOf === ee.language)
            return -1;
        }
        return 0;
      }), [ne, we] = W, qt = ne;
      return qt.secondBest = we, qt;
    }
    function jr(f, E, N) {
      const L = E && b[E] || N;
      f.classList.add("hljs"), f.classList.add(`language-${L}`);
    }
    function xn(f) {
      let E = null;
      const N = K(f);
      if (S(N)) return;
      if (Dt(
        "before:highlightElement",
        { el: f, language: N }
      ), f.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", f);
        return;
      }
      if (f.children.length > 0 && (w.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(f)), w.throwUnescapedHTML))
        throw new qr(
          "One of your code blocks includes unescaped HTML.",
          f.innerHTML
        );
      E = f;
      const L = E.textContent, W = N ? H(L, { language: N, ignoreIllegals: !0 }) : _n(L);
      f.innerHTML = W.value, f.dataset.highlighted = "yes", jr(f, N, W.language), f.result = {
        language: W.language,
        // TODO: remove with version 11.0
        re: W.relevance,
        relevance: W.relevance
      }, W.secondBest && (f.secondBest = {
        language: W.secondBest.language,
        relevance: W.secondBest.relevance
      }), Dt("after:highlightElement", { el: f, result: W, text: L });
    }
    function Br(f) {
      w = zs(w, f);
    }
    const Fr = () => {
      Lt(), Ze("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Hr() {
      Lt(), Ze("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Vs = !1;
    function Lt() {
      function f() {
        Lt();
      }
      if (document.readyState === "loading") {
        Vs || window.addEventListener("DOMContentLoaded", f, !1), Vs = !0;
        return;
      }
      document.querySelectorAll(w.cssSelector).forEach(xn);
    }
    function Wr(f, E) {
      let N = null;
      try {
        N = E(l);
      } catch (L) {
        if (Oe("Language definition for '{}' could not be registered.".replace("{}", f)), q)
          Oe(L);
        else
          throw L;
        N = _;
      }
      N.name || (N.name = f), p[f] = N, N.rawDefinition = E.bind(null, l), N.aliases && Js(N.aliases, { languageName: f });
    }
    function zr(f) {
      delete p[f];
      for (const E of Object.keys(b))
        b[E] === f && delete b[E];
    }
    function Kr() {
      return Object.keys(p);
    }
    function ve(f) {
      return f = (f || "").toLowerCase(), p[f] || p[b[f]];
    }
    function Js(f, { languageName: E }) {
      typeof f == "string" && (f = [f]), f.forEach((N) => {
        b[N.toLowerCase()] = E;
      });
    }
    function Xs(f) {
      const E = ve(f);
      return E && !E.disableAutodetect;
    }
    function Gr(f) {
      f["before:highlightBlock"] && !f["before:highlightElement"] && (f["before:highlightElement"] = (E) => {
        f["before:highlightBlock"](
          Object.assign({ block: E.el }, E)
        );
      }), f["after:highlightBlock"] && !f["after:highlightElement"] && (f["after:highlightElement"] = (E) => {
        f["after:highlightBlock"](
          Object.assign({ block: E.el }, E)
        );
      });
    }
    function Vr(f) {
      Gr(f), A.push(f);
    }
    function Jr(f) {
      const E = A.indexOf(f);
      E !== -1 && A.splice(E, 1);
    }
    function Dt(f, E) {
      const N = f;
      A.forEach(function(L) {
        L[N] && L[N](E);
      });
    }
    function Xr(f) {
      return Ze("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ze("10.7.0", "Please use highlightElement now."), xn(f);
    }
    Object.assign(l, {
      highlight: H,
      highlightAuto: _n,
      highlightAll: Lt,
      highlightElement: xn,
      // TODO: Remove with v12 API
      highlightBlock: Xr,
      configure: Br,
      initHighlighting: Fr,
      initHighlightingOnLoad: Hr,
      registerLanguage: Wr,
      unregisterLanguage: zr,
      listLanguages: Kr,
      getLanguage: ve,
      registerAliases: Js,
      autoDetection: Xs,
      inherit: zs,
      addPlugin: Vr,
      removePlugin: Jr
    }), l.debugMode = function() {
      q = !1;
    }, l.safeMode = function() {
      q = !0;
    }, l.versionString = Dr, l.regex = {
      concat: g,
      lookahead: v,
      either: k,
      optional: C,
      anyNumberOfTimes: T
    };
    for (const f in Pt)
      typeof Pt[f] == "object" && e(Pt[f]);
    return Object.assign(l, Pt), l;
  }, Ye = Gs({});
  return Ye.newInstance = () => Gs({}), Pn = Ye, Ye.HighlightJS = Ye, Ye.default = Ye, Pn;
}
var ad = /* @__PURE__ */ id();
const hn = /* @__PURE__ */ sd(ad), yi = "[A-Za-z$_][0-9A-Za-z$_]*", rd = [
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
], od = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], er = [
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
], tr = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], nr = [
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
], ld = [
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
], cd = [].concat(
  nr,
  er,
  tr
);
function dd(e) {
  const t = e.regex, n = (G, { after: ye }) => {
    const Ae = "</" + G[0].slice(1);
    return G.input.indexOf(Ae, ye) !== -1;
  }, s = yi, i = {
    begin: "<>",
    end: "</>"
  }, r = /<[A-Za-z0-9\\._:-]+\s*\/>/, a = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (G, ye) => {
      const Ae = G[0].length + G.index, Xe = G.input[Ae];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        Xe === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        Xe === ","
      ) {
        ye.ignoreMatch();
        return;
      }
      Xe === ">" && (n(G, { after: Ae }) || ye.ignoreMatch());
      let lt;
      const $t = G.input.substring(Ae);
      if (lt = $t.match(/^\s*=/)) {
        ye.ignoreMatch();
        return;
      }
      if ((lt = $t.match(/^\s+extends\s+/)) && lt.index === 0) {
        ye.ignoreMatch();
        return;
      }
    }
  }, o = {
    $pattern: yi,
    keyword: rd,
    literal: od,
    built_in: cd,
    "variable.language": ld
  }, c = "[0-9](_?[0-9])*", d = `\\.(${c})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", h = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${u})((${d})|\\.)?|(${d}))[eE][+-]?(${c})\\b` },
      { begin: `\\b(${u})\\b((${d})\\b|\\.)?|(${d})\\b` },
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
  }, v = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: o,
    contains: []
    // defined later
  }, T = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        v
      ],
      subLanguage: "xml"
    }
  }, C = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        v
      ],
      subLanguage: "css"
    }
  }, g = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        v
      ],
      subLanguage: "graphql"
    }
  }, y = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      e.BACKSLASH_ESCAPE,
      v
    ]
  }, I = {
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
                  begin: s + "(?=\\s*(-)|$)",
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
  }, Ge = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    T,
    C,
    g,
    y,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    h
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  v.contains = Ge.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: o,
    contains: [
      "self"
    ].concat(Ge)
  });
  const Ve = [].concat(I, v.contains), X = Ve.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: o,
      contains: ["self"].concat(Ve)
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
    contains: X
  }, Je = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          s,
          /\s+/,
          /extends/,
          /\s+/,
          t.concat(s, "(", t.concat(/\./, s), ")*")
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
          s
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, me = {
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
        ...er,
        ...tr
      ]
    }
  }, te = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, Nt = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          s,
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
  }, Ct = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function bn(G) {
    return t.concat("(?!", G.join("|"), ")");
  }
  const gn = {
    match: t.concat(
      /\b/,
      bn([
        ...nr,
        "super",
        "import",
        "await"
      ].map((G) => `${G}\\s*\\(`)),
      s,
      t.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, Se = {
    begin: t.concat(/\./, t.lookahead(
      t.concat(s, /(?![0-9A-Za-z$_(])/)
    )),
    end: s,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, mn = {
    match: [
      /get|set/,
      /\s+/,
      s,
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
  }, Rt = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", yn = {
    match: [
      /const|var|let/,
      /\s+/,
      s,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      t.lookahead(Rt)
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
    exports: { PARAMS_CONTAINS: X, CLASS_REFERENCE: me },
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
      T,
      C,
      g,
      y,
      I,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      h,
      me,
      {
        scope: "attr",
        match: s + t.lookahead(":"),
        relevance: 0
      },
      yn,
      {
        // "value" container
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          I,
          e.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: Rt,
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
                    contains: X
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
              { begin: i.begin, end: i.end },
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
      Nt,
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
          e.inherit(e.TITLE_MODE, { begin: s, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      Se,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + s,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [Q]
      },
      gn,
      Ct,
      Je,
      mn,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const ud = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity", pd = {
  scope: "number",
  match: ud,
  relevance: 0
};
function hd(e) {
  const t = {
    className: "attr",
    begin: /(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,
    relevance: 1.01
  }, n = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, s = [
    "true",
    "false",
    "null"
  ], i = {
    scope: "literal",
    beginKeywords: s.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc", "json5"],
    keywords: {
      literal: s
    },
    contains: [
      t,
      n,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      i,
      pd,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function fd(e) {
  const t = e.regex, n = e.COMMENT("--", "$"), s = {
    scope: "string",
    variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [{ match: /''/ }]
      }
    ]
  }, i = {
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
  ], u = [
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
  ], h = [
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
  ], v = [
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
  ], T = u, C = [
    ...d,
    ...c
  ].filter((X) => !u.includes(X)), g = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  }, y = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  }, k = {
    match: t.concat(/\b/, t.either(...T), /\s*\(/),
    relevance: 0,
    keywords: { built_in: T }
  };
  function I(X) {
    return t.concat(
      /\b/,
      t.either(...X.map((Q) => Q.replace(/\s+/, "\\s+"))),
      /\b/
    );
  }
  const Ge = {
    scope: "keyword",
    match: I(v),
    relevance: 0
  };
  function Ve(X, {
    exceptions: Q,
    when: Je
  } = {}) {
    const me = Je;
    return Q = Q || [], X.map((te) => te.match(/\|\d+$/) || Q.includes(te) ? te : me(te) ? `${te}|0` : te);
  }
  return {
    name: "SQL",
    case_insensitive: !0,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: Ve(C, { when: (X) => X.length < 3 }),
      literal: r,
      type: o,
      built_in: h
    },
    contains: [
      {
        scope: "type",
        match: I(a)
      },
      Ge,
      k,
      g,
      s,
      i,
      e.C_NUMBER_MODE,
      e.C_BLOCK_COMMENT_MODE,
      n,
      y
    ]
  };
}
hn.registerLanguage("javascript", dd);
hn.registerLanguage("json", hd);
hn.registerLanguage("sql", fd);
const Wt = /* @__PURE__ */ new Map(), bd = 400, gd = 2e4;
function vi(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function md(e, t) {
  const n = String(e ?? "");
  if (n === "") return "";
  if (n.length > gd) return vi(n);
  const s = `${t}:${n}`, i = Wt.get(s);
  if (i !== void 0) return i;
  let r;
  try {
    r = hn.highlight(n, { language: t, ignoreIllegals: !0 }).value;
  } catch {
    r = vi(n);
  }
  return Wt.size >= bd && Wt.clear(), Wt.set(s, r), r;
}
async function ns(e) {
  const t = await fetch(e, { headers: { Accept: "application/json" } }), n = await t.json().catch(() => null);
  if (!t.ok) throw new Error(n && n.error || `HTTP ${t.status}`);
  if (n === null) throw new Error("The response was not JSON.");
  return n;
}
async function wi(e) {
  const t = await ns(e), n = {};
  return Object.entries(t.sections || {}).forEach(([s, i]) => {
    n[s] = i.payload || {};
  }), { profile: t, payloads: n };
}
function Rs(e, t = 0) {
  return Number(e || 0).toFixed(t);
}
function $s(e) {
  const t = Number(e || 0);
  return t < 1024 ? `${t} B` : t < 1048576 ? `${(t / 1024).toFixed(1)} kB` : `${(t / 1048576).toFixed(1)} MB`;
}
function yd(e, t, n) {
  return `${e} ${Number(e) === 1 ? t : n}`;
}
function vd(e, t = Date.now() / 1e3) {
  const n = Math.max(0, t - Number(e || 0));
  return n < 60 ? `${Math.round(n)}s ago` : n < 3600 ? `${Math.round(n / 60)}m ago` : `${Math.round(n / 3600)}h ago`;
}
function wd(e, t) {
  let n = e;
  try {
    n = new URL(e, t).pathname;
  } catch {
    return e;
  }
  if (n.length <= 42) return n;
  const s = n.split("/").filter(Boolean);
  return s.length > 2 ? `…/${s.slice(-2).join("/")}` : n;
}
function _d(e) {
  const t = e && e.magewire;
  return t && t.component ? `${t.component} ${t.action || ""}`.trim() : e && e.path || "/";
}
function xd(e) {
  if (!e || e.delta === null || e.delta === void 0) return "not comparable";
  if (e.delta === 0) return "no change";
  const t = e.delta > 0 ? "+" : "-", n = e.unit === "B" ? $s(Math.abs(e.delta)) : `${Rs(Math.abs(e.delta), e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
  return `${t}${n}`;
}
function Ed(e, t) {
  const n = e[t];
  return n == null ? "none" : e.unit === "B" ? $s(n) : `${Rs(n, e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
}
function kd(e) {
  return Object.entries(e.methods || {}).map(([t, n]) => `${n} ${t}`).join(", ");
}
function sr(e, t, n, s) {
  if (!e || !n || !/^[a-z][a-z0-9+.-]*:\/\//i.test(e) || /^(javascript|data|vbscript):/i.test(e))
    return "";
  const i = n.startsWith("/") ? n : `${t}/${n}`;
  return e.replace("%f", () => encodeURI(i)).replace("%l", () => String(s || 1));
}
function Sd(e, t, n) {
  const s = String(n || "").match(/^(.+\.php):(\d+)$/);
  return s ? sr(e, t, s[1], Number(s[2])) : "";
}
const ss = /* @__PURE__ */ new Map(), zt = /* @__PURE__ */ new Map();
function Ps() {
  const e = window.Magewire || window.magewire;
  return e && typeof e == "object" ? e : null;
}
function Is() {
  const e = Ps();
  try {
    return Object.values(e?.components?.componentsById ?? {});
  } catch {
    return [];
  }
}
function Ad(e) {
  try {
    return JSON.stringify(e ?? {}).length;
  } catch {
    return 0;
  }
}
function Od(e) {
  return ss.clear(), Is().map((t) => {
    const n = t.fingerprint ?? {}, s = t.serverMemo ?? {}, i = String(n.id ?? "");
    return t.el && ss.set(i, t.el), {
      id: i,
      name: String(n.name ?? "unknown"),
      resolver: String(n.resolver ?? "unknown"),
      handle: String(n.handle ?? ""),
      keys: e === ge ? 0 : pn(s.data ?? {}).length,
      memo_bytes: Ad(s),
      listeners: (t.effects?.listeners ?? []).length,
      children: Object.keys(s.children ?? {}).length,
      path: t.el ? Td(t.el) : ""
    };
  });
}
function Td(e) {
  const t = e.tagName ? e.tagName.toLowerCase() : "?";
  return e.id ? `${t}#${e.id}` : t;
}
function _i(e, t) {
  if (t === ge)
    return "The value policy is set to none, so component state is not read.";
  const n = Is().find((s) => String(s.fingerprint?.id) === String(e));
  if (!n) return "This component is no longer on the page.";
  try {
    return JSON.stringify(Ns(n.serverMemo?.data ?? {}, t), null, 2);
  } catch (s) {
    return `Could not read this component: ${s && s.message ? s.message : "threw"}`;
  }
}
function Md() {
  return {
    present: Ps() !== null,
    components: Is().length,
    // Already the route, not the base: Magewire publishes it as /magewire/post and the
    // client appends the action itself.
    endpoint: String(window.livewire_app_url || "")
  };
}
function xi(e) {
  const t = Ps();
  if (!t || typeof t.hook != "function") return !1;
  const n = /* @__PURE__ */ new Map(), s = (r) => String(r?.fingerprint?.name ?? "unknown"), i = (r) => String(r?.component?.fingerprint?.id ?? "");
  try {
    t.hook("message.sent", (r, a) => {
      n.set(i(r), { at: performance.now(), name: s(a) });
    }), t.hook("message.processed", (r, a) => {
      const o = n.get(i(r));
      n.delete(i(r)), e({
        component: s(a),
        action: Ei(r),
        duration_ms: o ? Math.round((performance.now() - o.at) * 10) / 10 : null,
        failed: !1
      });
    }), t.hook("message.failed", (r, a) => {
      n.delete(i(r)), e({
        component: s(a),
        action: Ei(r),
        duration_ms: null,
        failed: !0
      });
    });
  } catch {
    return !1;
  }
  return !0;
}
function Ei(e) {
  const t = (e?.updateQueue ?? [])[0];
  if (!t) return "refresh";
  const n = t.payload ?? {}, s = (...i) => i.map((r) => n[r] ?? t[r]).find(Boolean) ?? "unknown";
  return t.type === "callMethod" ? `${s("method")}()` : t.type === "syncInput" ? `set ${s("name")}` : t.type === "fireEvent" ? `on ${s("event")}` : String(t.type || "update");
}
function Nd(e, t) {
  const n = ss.get(String(e));
  if (!n || !n.style) return;
  if (t) {
    zt.has(String(e)) || zt.set(String(e), {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  const s = zt.get(String(e));
  s && (n.style.outline = s.outline, n.style.outlineOffset = s.offset, zt.delete(String(e)));
}
const In = /* @__PURE__ */ new WeakMap(), rn = /* @__PURE__ */ new Map(), ht = /* @__PURE__ */ new Map();
let ki = 0;
function fn() {
  const e = Ln || window.Alpine;
  return !e || typeof e != "object" || e === wt ? null : e;
}
function ir(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function is(e) {
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
function Cd(e) {
  if (typeof e.evaluate != "function") return null;
  const t = is(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function Si() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function Rd(e) {
  if (typeof e.injectMagics == "function") {
    const t = is(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = is(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function $d(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function Pd(e) {
  if (e.id) return `#${e.id}`;
  const t = [];
  let n = e;
  for (; n && n !== document.body && t.length < 4; ) {
    const s = n.parentElement, i = n.tagName.toLowerCase();
    if (n.id) {
      t.unshift(`#${n.id}`);
      break;
    }
    if (s) {
      const r = Array.from(s.children).filter((a) => a.tagName === n.tagName);
      t.unshift(r.length > 1 ? `${i}:nth-of-type(${r.indexOf(n) + 1})` : i);
    } else
      t.unshift(i);
    n = s;
  }
  return t.join(" > ");
}
function Id(e) {
  return In.has(e) || (ki += 1, In.set(e, ki)), In.get(e);
}
function ar(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function Ld(e) {
  const t = fn();
  if (rn.clear(), !t) return [];
  const n = ir(t), s = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((r) => {
    const a = Id(r), o = (r.getAttribute(n) || "").trim(), c = (r.getAttribute(s) || "").trim(), d = ar(t, r);
    return rn.set(a, r), {
      id: a,
      name: $d(o),
      expression: Qa(o, e),
      path: Pd(r),
      initialised: !!r._x_dataStack,
      deferred: r.hasAttribute(s),
      strategy: c || "none",
      keys: e === ge || !d ? 0 : pn(d).length
    };
  });
}
function Ai(e, t) {
  if (t === ge)
    return "The value policy is set to none, so component state is not read.";
  const n = fn(), s = rn.get(e);
  if (!n || !s) return "This component is no longer on the page.";
  if (!s._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const i = ar(n, s);
  if (!i) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(Ns(i, t), null, 2);
  } catch (r) {
    return `Could not read this component: ${r && r.message ? r.message : "threw"}`;
  }
}
function Dd(e) {
  const t = fn();
  if (!t) return [];
  const n = Rd(t);
  return n ? Object.keys(n).map((s) => {
    let i = n[s], r = 0;
    if (r = i && typeof i == "object" ? pn(i).length : 0, e === ge)
      return { name: s, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      i = JSON.stringify(Ns(i, e), null, 2);
    } catch (a) {
      i = `Could not read this store: ${a && a.message ? a.message : "threw"}`;
    }
    return { name: s, keys: r, value: i };
  }) : [];
}
function qd(e) {
  const t = window.__siteationDebugBar;
  return !t || !Array.isArray(t.alpineErrors) ? [] : t.alpineErrors.map((n) => {
    const s = String(n.message || ""), i = s.match(/Expression: "([\s\S]*?)"/);
    return {
      // An expression that threw is still a server rendered expression, and a message that
      // names the value it choked on is still that value. The rest of this section applies
      // the policy to exactly these two things; this was the one reader that did not.
      message: an(s.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""), e),
      expression: i ? Qa(i[1], e) : "",
      element: String(n.element || ""),
      during_init: !!n.during_init
    };
  });
}
function Ud() {
  const e = fn();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: Cd(e),
    source: Si(),
    prefix: ir(e)
  } : { present: !1, version: "", csp: null, source: Si(), prefix: "" };
}
function jd(e, t) {
  const n = rn.get(e);
  if (!n || !n.style) return;
  if (t) {
    ht.has(e) || ht.set(e, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  if (!ht.has(e)) return;
  const s = ht.get(e);
  n.style.outline = s.outline, n.style.outlineOffset = s.offset, ht.delete(e);
}
const Oi = 2e5, Bd = /^https?:\/\/(www\.)?schema\.org\//i, rr = {
  Product: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/product-snippet",
    required: ["name"],
    oneOf: [["offers", "review", "aggregateRating"]],
    recommended: ["image", "description", "sku", "brand"]
  },
  Offer: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/merchant-listing",
    oneOf: [["price", "priceSpecification"]],
    required: ["priceCurrency"],
    recommended: ["availability", "url", "itemCondition"]
  },
  AggregateOffer: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/product-snippet",
    required: ["lowPrice", "priceCurrency"],
    recommended: ["highPrice", "offerCount"]
  },
  AggregateRating: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/review-snippet",
    required: ["ratingValue"],
    oneOf: [["ratingCount", "reviewCount"]],
    recommended: ["bestRating", "worstRating"]
  },
  Review: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/review-snippet",
    required: ["author", "reviewRating"],
    recommended: ["datePublished", "author.name"]
  },
  BreadcrumbList: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
    required: ["itemListElement"]
  },
  ListItem: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
    required: ["position"]
  },
  Organization: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/organization",
    recommended: ["name", "url", "logo", "sameAs"]
  },
  WebSite: {
    docs: "https://developers.google.com/search/docs/appearance/site-names",
    required: ["name", "url"],
    recommended: ["alternateName"],
    note: "Google stopped drawing the sitelinks search box in November 2024, so a SearchAction here no longer changes the result. The site name still comes from this block."
  },
  FAQPage: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
    required: ["mainEntity"],
    note: "Google shows FAQ rich results only for well known government and health sites since August 2023."
  },
  Question: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
    required: ["name", "acceptedAnswer"]
  },
  Answer: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
    required: ["text"]
  },
  Article: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/article",
    recommended: ["headline", "image", "datePublished", "dateModified", "author", "author.name"]
  }
}, Ls = {
  NewsArticle: "Article",
  BlogPosting: "Article",
  ProductGroup: "Product",
  Corporation: "Organization",
  OnlineStore: "Organization",
  OnlineBusiness: "Organization",
  LocalBusiness: "Organization",
  Store: "Organization"
}, Fd = ["BreadcrumbList", "WebSite", "Organization", "FAQPage"];
function be(e) {
  return (Array.isArray(e) ? e : String(e ?? "").split(/\s+/)).map((n) => String(n ?? "").trim().replace(Bd, "")).filter(Boolean);
}
function or(e) {
  for (const t of e) {
    const n = Ls[t] || t;
    if (rr[n]) return n;
  }
  return "";
}
function Hd(e, t) {
  const n = /line (\d+) column (\d+)/i.exec(e);
  if (n) return { line: Number(n[1]), column: Number(n[2]) };
  const s = /position (\d+)/i.exec(e);
  if (!s) return null;
  const i = t.slice(0, Number(s[1])).split(`
`);
  return { line: i.length, column: i[i.length - 1].length + 1 };
}
function Wd(e) {
  const t = [], n = [];
  return Array.from(e.querySelectorAll("script[type]")).filter((s) => s.getAttribute("type").trim().toLowerCase() === "application/ld+json").forEach((s, i) => {
    const r = String(s.textContent || ""), a = { index: i, error: "", at: null, excerpt: "", entities: 0 };
    if (t.push(a), r.trim() === "") {
      a.error = "The block is empty.";
      return;
    }
    let o;
    try {
      o = JSON.parse(r);
    } catch (d) {
      a.error = String(d && d.message || d), a.at = Hd(a.error, r), a.excerpt = a.at ? (r.split(`
`)[a.at.line - 1] || "").trim().slice(0, 160) : "";
      return;
    }
    (Array.isArray(o) ? o : [o]).forEach((d) => {
      if (!d || typeof d != "object") return;
      const u = Array.isArray(d["@graph"]) ? d["@graph"] : [d], h = d["@context"];
      u.forEach((v) => {
        if (!v || typeof v != "object") return;
        const T = h && !v["@context"] && v !== d ? { "@context": h, ...v } : v;
        n.push({ source: "json-ld", block: i, data: T }), a.entities += 1;
      });
    });
  }), { blocks: t, entities: n };
}
function zd(e) {
  const t = e.tagName.toLowerCase(), n = (s) => (e.getAttribute(s) || "").trim();
  return t === "meta" ? n("content") : ["a", "area", "link"].includes(t) ? n("href") : ["audio", "embed", "iframe", "img", "source", "track", "video"].includes(t) ? n("src") : t === "object" ? n("data") : ["data", "meter"].includes(t) ? n("value") : t === "time" && e.hasAttribute("datetime") ? n("datetime") : e.hasAttribute("content") ? n("content") : String(e.textContent || "").replace(/\s+/g, " ").trim();
}
function lr(e) {
  const t = {}, n = be(e.getAttribute("itemtype"));
  n.length === 1 ? t["@type"] = n[0] : n.length > 1 && (t["@type"] = n), e.getAttribute("itemid") && (t["@id"] = e.getAttribute("itemid"));
  const s = (r, a) => {
    r in t ? Array.isArray(t[r]) ? t[r].push(a) : t[r] = [t[r], a] : t[r] = a;
  }, i = (r) => {
    Array.from(r.children).forEach((a) => {
      const o = (a.getAttribute("itemprop") || "").trim().split(/\s+/).filter(Boolean), c = a.hasAttribute("itemscope");
      o.forEach((d) => s(d, c ? lr(a) : zd(a))), c || i(a);
    });
  };
  return i(e), t;
}
function cr(e) {
  const t = Array.from(e.querySelectorAll("[itemscope]")).filter((n) => !n.hasAttribute("itemprop"));
  return {
    entities: t.map((n, s) => {
      const i = be(n.getAttribute("itemtype")), r = t.findIndex((a) => a !== n && a.contains(n) && be(a.getAttribute("itemtype")).some((o) => i.includes(o)));
      return {
        source: "microdata",
        block: s,
        where: Kd(n),
        inside: r,
        data: lr(n)
      };
    }),
    elements: t
  };
}
function Kd(e) {
  const t = e.tagName.toLowerCase(), n = e.getAttribute("id"), s = (e.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
  return n ? `<${t} id="${n}">` : s.length > 0 ? `<${t} class="${s[0]}">` : `<${t}>`;
}
function Ds(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.some(Ds) : !0;
}
function Le(e, t) {
  const [n, ...s] = t.split("."), i = e[n];
  return s.length === 0 ? Ds(i) : (Array.isArray(i) ? i : [i]).some((a) => a && typeof a == "object" && Le(a, s.join(".")));
}
function dr(e, t, n, s = 0) {
  if (s > 6) return;
  const i = be(e["@type"]), r = or(i), a = t ? `${t} > ${i[0] || "item"}` : i[0] || "item", o = rr[r];
  if (o) {
    const c = (d, u) => n.push({ level: d, path: a, message: u, docs: o.docs });
    (o.required || []).filter((d) => !Le(e, d)).forEach((d) => {
      c("required", `Missing ${d}.`);
    }), (o.oneOf || []).filter((d) => !d.some((u) => Le(e, u))).forEach((d) => {
      c("required", `Needs one of ${d.join(", ")}.`);
    }), (o.recommended || []).filter((d) => !Le(e, d)).forEach((d) => {
      c("recommended", `No ${d}.`);
    }), o.note && c("note", o.note), r === "BreadcrumbList" && Gd(e, c), r === "WebSite" && Vd(e, c), (r === "Offer" || r === "AggregateOffer") && Jd(e, c);
  }
  Object.entries(e).forEach(([c, d]) => {
    if (c.startsWith("@")) return;
    (Array.isArray(d) ? d : [d]).forEach((h) => {
      h && typeof h == "object" && h["@type"] && dr(h, `${a} > ${c}`, n, s + 1);
    });
  });
}
function Gd(e, t) {
  const s = (Array.isArray(e.itemListElement) ? e.itemListElement : [e.itemListElement]).filter((r) => r && typeof r == "object");
  s.forEach((r, a) => {
    const o = Le(r, "name") || Le(r, "item.name"), c = Le(r, "item");
    o || t("required", `Crumb ${a + 1} has no name.`), !c && a < s.length - 1 && t("required", `Crumb ${a + 1} has no item URL.`);
  }), s.map((r) => Number(r.position)).some((r, a) => r !== a + 1) && t("required", "The crumb positions do not count up from 1.");
}
function Vd(e, t) {
  (Array.isArray(e.potentialAction) ? e.potentialAction : [e.potentialAction]).filter((s) => s && typeof s == "object" && be(s["@type"]).includes("SearchAction")).forEach((s) => {
    const i = typeof s.target == "object" && s.target ? String(s.target.urlTemplate || "") : String(s.target || ""), r = String(s["query-input"] || ""), a = (/name=([\w-]+)/.exec(r) || [])[1] || "";
    i ? a && !i.includes(`{${a}}`) && t("required", `The SearchAction target has no {${a}} for the query-input to fill.`) : t("required", "The SearchAction has no target.");
  });
}
function Jd(e, t) {
  const n = e.price ?? e.lowPrice;
  Ds(n) && !/^\d+(\.\d+)?$/.test(String(n).trim()) && t("required", `The price "${n}" is not a plain number. Use a dot for decimals and leave out the currency sign.`);
  const s = String(e.priceCurrency || "").trim();
  s && !/^[A-Z]{3}$/.test(s) && t("required", `"${s}" is not a three letter ISO 4217 currency code.`);
}
function Xd(e) {
  const t = e.name ?? e.headline ?? e.url ?? e["@id"] ?? "", n = Array.isArray(t) ? t[0] : t;
  return typeof n == "string" ? n.replace(/\s+/g, " ").trim().slice(0, 120) : "";
}
function ur(e) {
  const t = be(e["@type"]).map((s) => Ls[s] || s).sort(), n = e["@id"] || e.sku || e.url || e.name;
  return t.length === 0 || !n || typeof n != "string" ? "" : `${t.join("+")}|${n.trim().toLowerCase()}`;
}
function Ti(e) {
  const t = e.map((n) => ur(n.data));
  return t[0] !== "" && t.every((n) => n === t[0]);
}
function Zd(e) {
  const t = [], n = /* @__PURE__ */ new Map(), s = e.filter((a) => a.source === "microdata"), i = /* @__PURE__ */ new Set();
  s.forEach((a) => {
    if (a.inside === void 0 || a.inside < 0) return;
    const o = s.find((c) => c.block === a.inside);
    o && (i.add(o), t.push(`${a.type} is declared on ${o.where} and again on ${a.where} inside it. Its properties go to the inner one, so the outer one is a second, empty ${a.type}. Remove one itemscope.`));
  }), e = e.filter((a) => !i.has(a)), e.forEach((a) => {
    const o = ur(a.data);
    o && n.set(o, [...n.get(o) || [], a]);
  }), n.forEach((a) => {
    if (a.length < 2) return;
    const o = [...new Set(a.map((d) => d.source === "json-ld" ? "JSON-LD" : "microdata"))], c = o.length > 1 ? `in both ${o.join(" and ")}` : `${a.length} times in ${o[0]}`;
    t.push(`${a[0].type} "${a[0].name}" is described ${c}. Usually a theme and a module both write it; keep one.`);
  }), Fd.forEach((a) => {
    const o = e.filter((c) => be(c.data["@type"]).some((d) => (Ls[d] || d) === a));
    o.length > 1 && !Ti(o) && t.push(`${o.length} ${a} entities on one page. A page has one; keep the one that is right.`);
  });
  const r = e.filter((a) => or(be(a.data["@type"])) === "Product");
  return r.length > 1 && !Ti(r) && t.push(`${r.length} different top level products. A product page describes one; a list of products belongs in an ItemList.`), t;
}
function Yd(e) {
  let t;
  try {
    t = new URL(e).hostname.toLowerCase();
  } catch {
    return !1;
  }
  return !(t === "localhost" || !t.includes(".") || /\.(test|local|localhost|internal|example|invalid|lan|home|dev\.local)$/.test(t) || /^(10|127)\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^169\.254\./.test(t) || t.startsWith("["));
}
function Qd(e) {
  const t = Yd(e), n = encodeURIComponent(e);
  return {
    public: t,
    tools: [
      {
        label: "Rich Results Test",
        href: t ? `https://search.google.com/test/rich-results?url=${n}` : "https://search.google.com/test/rich-results"
      },
      {
        label: "Schema Markup Validator",
        href: t ? `https://validator.schema.org/#url=${n}` : "https://validator.schema.org/"
      }
    ]
  };
}
function eu(e) {
  const t = Array.from(e.querySelectorAll("script[type]")).filter((i) => i.getAttribute("type").trim().toLowerCase() === "application/ld+json").map((i) => `<script type="application/ld+json">${i.textContent}<\/script>`), n = cr(e).elements.map((i) => i.outerHTML), s = [...t, ...n].join(`
`);
  return s.length > Oi ? s.slice(0, Oi) : s;
}
function tu(e, t) {
  const n = Wd(e), s = cr(e), i = [...n.entities, ...s.entities].map((a, o) => {
    const c = [];
    return dr(a.data, "", c), {
      index: o,
      source: a.source,
      block: a.block,
      where: a.where || "",
      inside: a.inside ?? -1,
      type: be(a.data["@type"]).join(", ") || "untyped",
      name: Xd(a.data),
      json: JSON.stringify(a.data, null, 2),
      data: a.data,
      findings: c
    };
  }), r = [];
  return n.blocks.filter((a) => a.error).forEach((a) => {
    const o = a.at ? ` at line ${a.at.line}, column ${a.at.column}` : "";
    r.push(`JSON-LD block ${a.index + 1} does not parse${o}: ${a.error}`);
  }), r.push(...Zd(i)), i.forEach((a) => {
    a.wrapper = a.source === "microdata" && i.some((o) => o.source === "microdata" && o.inside === a.block);
  }), i.forEach((a) => {
    a.wrapper || a.findings.filter((o) => o.level === "required").forEach((o) => {
      r.push(`${o.path}: ${o.message}`);
    });
  }), i.forEach((a) => {
    delete a.data;
  }), {
    model: {
      blocks: n.blocks,
      entities: i,
      warnings: r,
      links: Qd(t)
    },
    elements: s.elements
  };
}
function nu() {
  return { blocks: [], entities: [], warnings: [], links: { public: !1, tools: [] } };
}
const su = { min: 30, max: 60 }, iu = { min: 70, max: 160 }, au = ["og:title", "og:type", "og:image", "og:url"], ru = ["twitter:card"], ou = 2, lu = 200, Mi = 160, cu = /^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?$/i;
function du(e) {
  const t = e.getBoundingClientRect(), n = e.ownerDocument.defaultView, s = n ? n.getComputedStyle(e) : null, i = !!s && (s.clip === "rect(0px, 0px, 0px, 0px)" || s.clipPath === "inset(50%)");
  return {
    visible: (typeof e.checkVisibility == "function" ? e.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 }) : t.width > 0 && t.height > 0) && !i && t.width > 1 && t.height > 1,
    top: t.top + (n ? n.scrollY : 0),
    width: t.width,
    height: t.height,
    naturalWidth: Number(e.naturalWidth || 0),
    naturalHeight: Number(e.naturalHeight || 0)
  };
}
function uu() {
  return {
    measure: du,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
}
function He(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length <= Mi ? t : `${t.slice(0, Mi)}...`;
}
function We(e, t) {
  try {
    return new URL(e, t);
  } catch {
    return null;
  }
}
function qs(e, t) {
  return String(e.getAttribute(t) || "").toLowerCase().split(/\s+/).filter(Boolean);
}
function on(e, t) {
  return Array.from(e.querySelectorAll("meta")).filter((n) => (n.getAttribute("name") || n.getAttribute("property") || "").toLowerCase() === t);
}
function Ni(e, t) {
  return e === 0 ? "missing" : e < t.min ? `too short, under ${t.min} characters` : e > t.max ? `too long, over ${t.max} characters, so it will be cut` : "";
}
function pr(e) {
  return e === "" ? "missing" : cu.test(e) ? /-uk$/i.test(e) ? `"${e}" uses UK, which is not a region code; use GB` : "" : `"${e}" is not a valid language code`;
}
function At(e) {
  return `${e.protocol}//${e.host}${e.pathname}${e.search}`;
}
function pu(e, t) {
  if (At(e) === At(t)) return "";
  if (e.protocol !== t.protocol)
    return `it uses ${e.protocol.replace(":", "")} and this page uses ${t.protocol.replace(":", "")}`;
  if (e.host !== t.host) return `it points to another host, ${e.host}`;
  const n = e.pathname.replace(/\/$/, "") === t.pathname.replace(/\/$/, "");
  return e.pathname !== t.pathname && n ? "only the trailing slash differs" : e.pathname !== t.pathname ? `it points to ${e.pathname}` : t.search && !e.search ? `this URL has a query string (${t.search}) that the canonical leaves out` : e.search && !t.search ? `it adds a query string (${e.search}) that this URL does not have` : "the query string differs";
}
function hu(e, t) {
  const n = Array.from(e.querySelectorAll("link[rel]")).filter((c) => qs(c, "rel").includes("canonical")), s = [];
  if (n.length === 0)
    return { href: "", resolved: "", count: 0, warnings: ["No canonical URL."] };
  n.length > 1 && s.push(`${n.length} canonical links. Search engines ignore all of them when they disagree, and may when they do not.`);
  const i = (n[0].getAttribute("href") || "").trim(), r = We(i, t), a = We(t, t);
  if (i === "" || !r)
    return s.push("The canonical link has no usable URL."), { href: i, resolved: "", count: n.length, warnings: s };
  /^[a-z][a-z0-9+.-]*:/i.test(i) || s.push("The canonical URL is relative. Use the full URL, with the scheme and host.");
  const o = a ? pu(r, a) : "";
  return o && s.push(`The canonical URL is not this page: ${o}.`), { href: i, resolved: r.href, count: n.length, warnings: s };
}
function fu(e, t) {
  const n = We(t, t), s = Array.from(e.querySelectorAll("link[hreflang]")).filter((r) => qs(r, "rel").includes("alternate")).map((r) => {
    const a = (r.getAttribute("hreflang") || "").trim(), o = We(r.getAttribute("href") || "", t);
    return {
      lang: a,
      href: o ? o.href : "",
      self: !!(o && n && At(o) === At(n)),
      problem: a.toLowerCase() === "x-default" ? "" : pr(a)
    };
  });
  if (s.length === 0) return { items: s, warnings: [] };
  const i = [];
  return s.some((r) => r.self) || i.push("No hreflang link points to this page. Every page in the set has to list itself."), s.some((r) => r.lang.toLowerCase() === "x-default") || i.push("No x-default alternate, so visitors whose language is not listed get no fallback."), s.filter((r) => r.problem).forEach((r) => {
    i.push(`hreflang ${r.problem}.`);
  }), { items: s, warnings: i };
}
function bu(e) {
  if (!e) return 0;
  let t = 0;
  const n = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG"]), s = (i) => {
    i.childNodes.forEach((r) => {
      r.nodeType === 3 ? t += (r.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length : r.nodeType === 1 && !n.has(r.nodeName.toUpperCase()) && s(r);
    });
  };
  return s(e), t;
}
function gu(e, t = "") {
  const n = [...on(e, "robots"), ...on(e, "googlebot")].map((r) => (r.getAttribute("content") || "").trim()).filter(Boolean).join(", "), s = [], i = `${n}, ${t}`.toLowerCase();
  return /\b(noindex|none)\b/.test(i) && s.push("This page asks not to be indexed."), /\b(nofollow|none)\b/.test(i) && s.push("This page asks search engines not to follow its links."), { meta: n, header: String(t || ""), warnings: s };
}
function mu(e, t, n = "") {
  const s = e.querySelector("head title") || e.querySelector("title"), i = He(s ? s.textContent : ""), r = on(e, "description")[0], a = He(r ? r.getAttribute("content") : ""), o = (e.documentElement.getAttribute("lang") || "").trim(), c = on(e, "viewport")[0], d = e.querySelector("meta[charset]") || Array.from(e.querySelectorAll("meta[http-equiv]")).find((h) => /charset=/i.test(h.getAttribute("content") || "")), u = {
    title: { value: i, length: i.length, hint: Ni(i.length, su) },
    description: {
      value: a,
      length: a.length,
      hint: Ni(a.length, iu)
    },
    canonical: hu(e, t),
    robots: gu(e, n),
    hreflang: fu(e, t),
    lang: { value: o, problem: pr(o) },
    viewport: c ? (c.getAttribute("content") || "").trim() : "",
    charset: {
      value: String(e.characterSet || e.charset || ""),
      declared: !!d
    },
    words: bu(e.body),
    warnings: []
  };
  return u.title.hint && u.warnings.push(`Title ${u.title.hint}.`), u.description.hint && u.warnings.push(`Meta description ${u.description.hint}.`), u.lang.problem && u.warnings.push(`<html lang> ${u.lang.problem}.`), u.viewport || u.warnings.push("No viewport meta tag, so phones draw the desktop layout."), u.charset.declared || u.warnings.push("No charset declared in the markup."), u.warnings.push(
    ...u.canonical.warnings,
    ...u.robots.warnings,
    ...u.hreflang.warnings
  ), u;
}
function yu(e, t) {
  const n = Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  let s = 0;
  const i = n.map((o, c) => {
    const d = Number(o.tagName.slice(1)), u = He(o.textContent), h = [];
    return u === "" && h.push("empty"), s > 0 && d > s + 1 && h.push(`skips from h${s} to h${d}`), t.measure(o).visible || h.push("hidden from view"), s = d, { index: c, level: d, text: u, warnings: h };
  }), r = i.filter((o) => o.level === 1).length, a = [];
  return r === 0 && a.push("No H1."), r > 1 && a.push(`${r} H1 headings. One page, one main heading.`), i.forEach((o) => o.warnings.forEach((c) => {
    a.push(`H${o.level} ${o.text ? `"${o.text}"` : `#${o.index + 1}`}: ${c}.`);
  })), { items: i, warnings: a, elements: n };
}
function vu(e, t) {
  const n = e.trim().toLowerCase();
  if (n === "") return !1;
  if (/\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/.test(n) || /^(img|image|dsc|dscn|photo|pic|screenshot)[-_ ]?\d+$/.test(n)) return !0;
  const i = String(t || "").split(/[?#]/)[0].split("/").pop().toLowerCase().replace(/\.[a-z0-9]+$/, "");
  return i !== "" && n === i;
}
function wu(e, t) {
  const n = Array.from(e.querySelectorAll("img")), s = n.map((a, o) => {
    const c = a.currentSrc || a.getAttribute("src") || a.getAttribute("data-src") || "", d = a.hasAttribute("alt") ? a.getAttribute("alt") : null, u = t.measure(a), h = [];
    d === null ? h.push("no alt attribute") : d.trim() === "" ? h.push("empty alt, which is right only for a decorative image") : vu(d, c) && h.push("alt text is a file name"), (!a.hasAttribute("width") || !a.hasAttribute("height")) && h.push("no width and height, so the page shifts when it loads");
    const v = u.width * t.pixelRatio;
    return u.visible && u.width > 0 && u.naturalWidth > v * ou && u.naturalWidth - v > lu && h.push(`${u.naturalWidth}px wide but drawn at ${Math.round(u.width)}px`), (a.getAttribute("loading") || "").toLowerCase() === "lazy" && u.visible && u.top < t.viewportHeight && h.push("lazy loaded but visible on the first screen, which delays it"), {
      index: o,
      src: c,
      alt: d === null ? null : He(d),
      size: u.naturalWidth && u.width ? `${Math.round(u.width)} × ${Math.round(u.height)} of ${u.naturalWidth} × ${u.naturalHeight}` : "",
      warnings: h
    };
  }), i = s.filter((a) => a.warnings.length > 0), r = i.length > 0 ? [`${i.length} of ${s.length} images have a problem.`] : [];
  return { items: s, warnings: r, elements: n };
}
function _u(e) {
  const t = He(e.textContent);
  if (t) return t;
  const n = Array.from(e.querySelectorAll("img[alt]")).map((s) => s.getAttribute("alt")).find(Boolean);
  return He(e.getAttribute("aria-label") || n || e.getAttribute("title") || "");
}
function xu(e, t) {
  const n = We(t, t), s = Array.from(e.querySelectorAll("a[href]")), i = { internal: 0, external: 0, nofollow: 0 }, r = s.map((c, d) => {
    const u = (c.getAttribute("href") || "").trim(), h = We(u, t), v = qs(c, "rel").includes("nofollow"), T = _u(c), C = [];
    let g = "other";
    return h && /^https?:$/.test(h.protocol) && (g = n && h.host === n.host ? "internal" : "external"), g !== "other" && (i[g] += 1), v && (i.nofollow += 1), T === "" && C.push("no text"), (u === "" || u === "#") && C.push("goes nowhere"), /^javascript:/i.test(u) && C.push("a javascript: link, which is a button pretending"), g === "internal" && v && C.push("internal link marked nofollow"), n && n.protocol === "https:" && h && h.protocol === "http:" && C.push("http: on an https: page"), { index: d, href: u, text: T, kind: g, nofollow: v, warnings: C };
  }), a = r.filter((c) => c.warnings.length > 0), o = a.length > 0 ? [`${a.length} of ${r.length} links have a problem.`] : [];
  return { items: r, counts: i, warnings: o, elements: s };
}
function Eu(e) {
  const t = Array.from(e.querySelectorAll("meta")).map((o) => ({
    name: (o.getAttribute("property") || o.getAttribute("name") || "").trim().toLowerCase(),
    value: He(o.getAttribute("content"))
  })), n = t.filter((o) => o.name.startsWith("og:")), s = t.filter((o) => o.name.startsWith("twitter:")), i = (o) => t.some((c) => c.name === o && c.value !== ""), r = [];
  au.filter((o) => !i(o)).forEach((o) => {
    r.push(`Missing ${o}.`);
  }), ru.filter((o) => !i(o)).forEach((o) => {
    r.push(`Missing ${o}, so X shows a bare link.`);
  });
  const a = n.find((o) => o.name === "og:image");
  return a && a.value && !/^https?:\/\//i.test(a.value) && r.push("og:image is not a full URL, and link previews will not fetch it."), { openGraph: n, x: s, warnings: r };
}
function ku(e) {
  const t = We(e, e);
  return t ? [
    { label: "robots.txt", href: `${t.origin}/robots.txt` },
    { label: "sitemap.xml", href: `${t.origin}/sitemap.xml` },
    {
      label: "PageSpeed Insights",
      href: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(At(t))}`
    }
  ] : [];
}
function Su(e, { url: t, robotsHeader: n = "", env: s }) {
  const { elements: i, ...r } = yu(e, s), { elements: a, ...o } = wu(e, s), { elements: c, ...d } = xu(e, t), { elements: u, model: h } = tu(e, t), v = (g) => g.items.filter((y) => y.warnings.length > 0).length, T = {
    overview: 0,
    headings: r.warnings.length,
    images: v(o),
    links: v(d),
    schema: h.warnings.length,
    social: 0
  }, C = {
    overview: mu(e, t, n),
    headings: r,
    images: o,
    links: d,
    schema: h,
    social: Eu(e),
    quickLinks: ku(t),
    counts: T
  };
  return T.overview = C.overview.warnings.length, T.social = C.social.warnings.length, C.warningCount = Object.values(T).reduce((g, y) => g + y, 0), {
    model: C,
    elements: {
      headings: i,
      images: a,
      links: c,
      schema: u
    }
  };
}
function Ci() {
  const e = { value: "", length: 0, hint: "" };
  return {
    overview: {
      title: e,
      description: e,
      canonical: { href: "", resolved: "", count: 0, warnings: [] },
      robots: { meta: "", header: "", warnings: [] },
      hreflang: { items: [], warnings: [] },
      lang: { value: "", problem: "" },
      viewport: "",
      charset: { value: "", declared: !1 },
      words: 0,
      warnings: []
    },
    headings: { items: [], warnings: [] },
    images: { items: [], warnings: [] },
    links: { items: [], counts: { internal: 0, external: 0, nofollow: 0 }, warnings: [] },
    schema: nu(),
    social: { openGraph: [], x: [], warnings: [] },
    quickLinks: [],
    counts: { overview: 0, headings: 0, images: 0, links: 0, schema: 0, social: 0 },
    warningCount: 0
  };
}
let Us = { headings: [], images: [], links: [], schema: [] };
const Ot = /* @__PURE__ */ new Map();
function Au(e = "") {
  Array.from(Ot.keys()).forEach((s) => hr(s));
  const { model: t, elements: n } = Su(document, {
    url: window.location.href,
    robotsHeader: e,
    env: uu()
  });
  return Us = n, t;
}
function hr(e) {
  const t = Ot.get(e);
  t && (e.style.outline = t.outline, e.style.outlineOffset = t.offset, Ot.delete(e));
}
function Ou() {
  return eu(document);
}
function as(e, t, n) {
  const s = (Us[e] || [])[t];
  if (!(!s || !s.style)) {
    if (!n) {
      hr(s);
      return;
    }
    Ot.has(s) || Ot.set(s, {
      outline: s.style.outline || "",
      offset: s.style.outlineOffset || ""
    }), s.style.outline = "2px solid #7f9cf5", s.style.outlineOffset = "2px";
  }
}
function Tu(e, t) {
  const n = (Us[e] || [])[t];
  n && (n.scrollIntoView({ block: "center", behavior: "smooth" }), as(e, t, !0));
}
const Mu = 1e3, fr = "siteation.debugbar.v1", Nu = "__PROFILE_ID__";
function Cu() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function Ru() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(fr) || "{}") };
  } catch {
    return e;
  }
}
function _e(e, t, n) {
  const s = t.trim().toLowerCase();
  return s ? e.filter((i) => n.some(
    (r) => String(i[r] ?? "").toLowerCase().includes(s)
  )) : e;
}
function $u() {
  return {
    profile: {},
    open: !1,
    section: "findings",
    placement: "bottom",
    dockPosition: null,
    dockDrag: null,
    dockDragMoved: !1,
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
    seoTab: "overview",
    seoSearch: "",
    // On by default: a list of every link on a category page is the evidence, and the
    // rows with something wrong are the answer.
    seoProblemsOnly: !0,
    seo: Ci(),
    seoError: "",
    /** @type {Array<number>} */
    schemaExpanded: [],
    schemaCopyState: "",
    schemaFallback: "",
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
      this.profile = Cu(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const e = Ru();
      this.collapsed = !!e.collapsed, this.open = e.open && !this.collapsed, this.section = e.section, this.placement = e.placement === "top" ? "top" : "bottom", this.dockPosition = $c(e.dockPosition) ? e.dockPosition : null, this.maximised = !!e.maximised, this.theme = ["system", "light", "dark"].includes(e.theme) ? e.theme : "system", this.favourites = Array.isArray(e.favourites) ? e.favourites.filter((t) => sn.some((n) => n.id === t)) : [], this.watchColorScheme(), this.valuePolicy = Yc(this.rootElement()?.dataset.valuePolicy), this.editorTemplate = this.rootElement()?.dataset.editor || "", this.editorRoot = this.rootElement()?.dataset.editorRoot || "", this.refreshAlpine(), this.refreshMagewire(), this.listenToMagewire(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), this.$watch("section", (t) => {
        t === "history" && this.loadHistory(), t === "seo" && this.refreshSeo();
      }), this.scheduleSeo(), this.open && this.section === "history" && this.loadHistory(), this.$watch("activeId", () => {
        this.comparison = null, this.baselineId = "";
      }), document.addEventListener("keydown", (t) => this.paletteShortcut(t)), this.open && this.$nextTick(() => this.lock()), this.requests = Nc((t) => {
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
      return t ? t.replace(Nu, encodeURIComponent(e)) : null;
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
          const { profile: n, payloads: s } = await wi(t);
          this.profile = n, this.payloads = s, this.activeId = e;
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
          const n = await ns(t);
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
      const e = this.history.filter((s) => s.profile_id !== this.activeId), t = this.request.path;
      return (e.find((s) => s.path === t) || e[0])?.profile_id || "";
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
        this.comparison = await ns(n);
      } catch (s) {
        this.comparison = null, this.compareError = String(s.message || s);
      } finally {
        this.comparing = !1;
      }
    },
    /**
     * @param {object} metric
     * @returns {string} the change, signed, in the metric's own unit
     */
    deltaLabel(e) {
      return xd(e);
    },
    /**
     * @param {object} metric
     * @param {'baseline'|'subject'} side which profile's value the cell shows
     * @returns {string}
     */
    metricValue(e, t) {
      return Ed(e, t);
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
      return vd(e);
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
      return _d(e);
    },
    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(e) {
      return wd(e, window.location.origin);
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
          this.payloads = (await wi(e)).payloads;
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
      return _e(e, this.querySearch, ["sql"]);
    },
    /** @returns {number} how many statements ran a shape that ran more than once */
    get repeatedCount() {
      return this.itemsOf("queries").filter((e) => Number(e.repeat_count || 1) > 1).length;
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const e = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((t) => t.observer_count === 0) : this.itemsOf("events");
      return _e(e, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return _e(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      return _e(this.itemsOf("blocks"), this.blockSearch, ["name", "template", "class"]);
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
      return _e(e, this.timelineSearch, ["label", "section"]);
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
      return _e(e, this.alpineSearch, ["name", "expression", "path"]);
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
      return jc(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return Wc(this.commands, this.paletteSearch);
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
      return Dc(this.rootElement()?.dataset.sections).map((e) => ({ ...e, count: Za(e.id, this) }));
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
        const s = [...this.favourites];
        s.splice(n, 0, s.splice(t, 1)[0]), this.favourites = s, this.persist();
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
     * Take the press, but stay a click until the pointer travels. A press that never moves
     * has to reach the grip's own click and double click, and pinning the dock where it
     * already sits would cost it the centring it has by default.
     *
     * Pointer capture keeps a drag alive after the pointer leaves the small handle or the
     * shadow root. The press is not cancelled, so the grip still takes focus and the arrow
     * keys are available straight after a drag.
     *
     * @param {PointerEvent} event
     */
    startDockDrag(e) {
      if (e.button !== 0 || !e.isPrimary) return;
      this.dockDragMoved = !1;
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
        height: n.height,
        moved: !1
      }, e.currentTarget.setPointerCapture(e.pointerId);
    },
    /** @param {PointerEvent} event */
    moveDockDrag(e) {
      const t = this.dockDrag;
      if (!t || t.pointerId !== e.pointerId) return;
      const n = e.clientX - t.pointerX, s = e.clientY - t.pointerY;
      !t.moved && !Lc(n, s) || (t.moved = !0, this.draggingDock = !0, this.dockPosition = $n(
        { left: t.left + n, top: t.top + s },
        t,
        { width: window.innerWidth, height: window.innerHeight }
      ), e.preventDefault());
    },
    /** @param {PointerEvent} event */
    endDockDrag(e) {
      const t = this.dockDrag;
      !t || t.pointerId !== e.pointerId || (this.moveDockDrag(e), this.draggingDock = !1, this.dockDrag = null, t.moved && (this.dockDragMoved = !0, this.updatePlacementFromDock(), this.persist()));
    },
    /**
     * A button labelled "Move" must work without a pointing device too. Enter and Space are
     * the keyboard's double click, so they reset rather than doing nothing.
     *
     * @param {KeyboardEvent} event
     */
    moveDockWithKeyboard(e) {
      if (e.key === "Enter" || e.key === " ") {
        this.resetDockPosition(), e.preventDefault();
        return;
      }
      const t = {
        ArrowLeft: [-10, 0],
        ArrowRight: [10, 0],
        ArrowUp: [0, -10],
        ArrowDown: [0, 10]
      }[e.key];
      if (!t) return;
      const n = this.$refs.dock;
      if (!n) return;
      const s = n.getBoundingClientRect();
      this.dockPosition = $n(
        { left: s.left + t[0], top: s.top + t[1] },
        s,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), this.persist(), e.preventDefault();
    },
    /** @param {MouseEvent} event */
    resetDockFromGrip(e) {
      e.preventDefault(), !this.dockDragMoved && this.resetDockPosition();
    },
    /**
     * Hand the dock back to the stylesheet, which centres it against the edge the placement
     * names. That edge is the one the bar was last dragged nearest, so a reset returns it to
     * the standard position closest to where it stood rather than across the viewport.
     */
    resetDockPosition() {
      this.dockPosition && (this.dockPosition = null, this.persist());
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
      const n = this.dockPosition, s = this.placement;
      this.dockPosition = $n(
        this.dockPosition,
        t,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), (n.left !== this.dockPosition.left || n.top !== this.dockPosition.top || s !== this.placement) && this.persist();
    },
    /** Keep the edge-bound inspector and bubble near the freely positioned dock. */
    updatePlacementFromDock() {
      const e = this.$refs.dock;
      !this.dockPosition || !e || (this.placement = Pc(
        this.dockPosition,
        e.getBoundingClientRect(),
        window.innerHeight
      ));
    },
    openInspector() {
      this.open || (this.collapsed = !1, this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), Rc(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus(), this.scheduleDockConstraint());
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
      Cc(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(e) {
      if (e.key === "Escape") {
        this.closeInspector();
        return;
      }
      bi(e, this.$refs.sheet);
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
      this.magewireHealth = Md(), this.magewireComponents = Od(this.valuePolicy), this.magewireExpanded.forEach((e) => {
        this.magewireStates[e] = _i(e, this.valuePolicy);
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
      xi(e) || document.addEventListener("magewire:load", () => {
        xi(e), this.refreshMagewire();
      }, { once: !0, passive: !0 });
    },
    /** @param {string} id */
    toggleMagewireComponent(e) {
      if (this.magewireExpanded.includes(e)) {
        this.magewireExpanded = this.magewireExpanded.filter((t) => t !== e), delete this.magewireStates[e];
        return;
      }
      this.magewireExpanded = [...this.magewireExpanded, e], this.magewireStates[e] = _i(e, this.valuePolicy);
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
      Nd(e, t);
    },
    /**
     * Read once the page has loaded, so images have their real sizes and the sidebar count
     * is there before the section is opened. Opening it reads again, since a page changes.
     */
    scheduleSeo() {
      if (!this.collects("seo")) return;
      const e = () => setTimeout(() => this.refreshSeo(), 0);
      document.readyState === "complete" ? e() : window.addEventListener("load", e, { once: !0, passive: !0 });
    },
    refreshSeo() {
      if (!this.collects("seo")) return;
      const e = this.pageProfile.sections?.request?.summary?.robots_header || "";
      try {
        this.seo = Au(e), this.seoError = "";
      } catch (t) {
        this.seo = Ci(), this.seoError = String(t && t.message || t);
      }
    },
    /**
     * @param {string} view
     * @param {number} index
     * @param {boolean} on
     */
    highlightSeo(e, t, n) {
      as(e, t, n);
    },
    /**
     * @param {string} view
     * @param {number} index
     */
    revealSeo(e, t) {
      Tu(e, t);
    },
    /**
     * @param {number} index
     * @returns {boolean}
     */
    isSchemaExpanded(e) {
      return this.schemaExpanded.includes(e);
    },
    /**
     * @param {object} entity
     * @returns {number}
     */
    schemaRequired(e) {
      return (e.findings || []).filter((t) => t.level === "required").length;
    },
    /** @param {number} index */
    toggleSchemaEntity(e) {
      this.schemaExpanded = this.isSchemaExpanded(e) ? this.schemaExpanded.filter((t) => t !== e) : [...this.schemaExpanded, e];
    },
    /**
     * A microdata entity is an element on the page, so its row can point at it. A JSON-LD
     * one is a script, which has nothing to point at.
     *
     * @param {object} entity
     * @param {boolean} on
     */
    highlightSchema(e, t) {
      e.source === "microdata" && as("schema", e.block, t);
    },
    /**
     * The validators cannot fetch a dev shop, so what they need goes on the clipboard to be
     * pasted into their code mode instead.
     *
     * @returns {Promise<void>}
     */
    async copySchemaMarkup() {
      const e = Ou();
      this.schemaFallback = "";
      try {
        await navigator.clipboard.writeText(e), this.schemaCopyState = "done", setTimeout(() => {
          this.schemaCopyState = "";
        }, 2500);
      } catch {
        this.schemaCopyState = "", this.schemaFallback = e;
      }
    },
    /** @returns {string} the admin redirect for what this page shows, '' when it is not known */
    get adminEditUrl() {
      return this.rootElement()?.dataset.adminEdit || "";
    },
    /** @returns {Array<object>} */
    get visibleSeoImages() {
      const e = this.seo.images?.items || [], t = this.seoProblemsOnly ? e.filter((n) => n.warnings.length > 0) : e;
      return _e(t, this.seoSearch, ["src", "alt"]);
    },
    /** @returns {Array<object>} */
    get visibleSeoLinks() {
      const e = this.seo.links?.items || [], t = this.seoProblemsOnly ? e.filter((n) => n.warnings.length > 0) : e;
      return _e(t, this.seoSearch, ["href", "text"]);
    },
    /**
     * @param {string|null} alt
     * @returns {string}
     */
    altLabel(e) {
      return e === null ? "no alt" : e === "" ? 'alt=""' : e;
    },
    refreshAlpine() {
      this.alpineHealth = Ud(), this.alpineComponents = Ld(this.valuePolicy), this.alpineStores = Dd(this.valuePolicy), this.alpineErrors = qd(this.valuePolicy), this.alpineExpanded.forEach((e) => {
        this.alpineStates[e] = Ai(e, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, Mu);
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
      this.alpineExpanded = [...this.alpineExpanded, e], this.alpineStates[e] = Ai(e, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(e, t) {
      jd(e, t);
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
      bi(e, this.$refs.palette);
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
          case "dock-reset":
            this.resetDockPosition();
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
        localStorage.setItem(fr, JSON.stringify({
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
      return Rs(e, t);
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(e) {
      return kd(e);
    },
    /**
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(e, t) {
      return md(e, t);
    },
    /**
     * @param {string} file
     * @param {number} line
     * @returns {string}
     */
    editorUrl(e, t) {
      return sr(this.editorTemplate, this.editorRoot, e, t);
    },
    /**
     * @param {string} location
     * @returns {string}
     */
    locationUrl(e) {
      return Sd(this.editorTemplate, this.editorRoot, e);
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
      return yd(e, t, n);
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(e) {
      return $s(e);
    }
  };
}
function Ne(e) {
  return `<dl class="ndb-facts">${e.map((n) => {
    const s = ["ndb-fact-value", n.mono ? "ndb-mono" : ""].filter(Boolean).join(" "), i = n.tone ? ` data-ndb-bind:class="'is-' + (${n.tone})"` : "", r = n.raw ? `<dd class="${s}"${i}>${n.value}</dd>` : `<dd class="${s}"${i} data-ndb-text="${n.value}"></dd>`, a = n.when ? ` data-ndb-if="${n.when}"` : "", o = `
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
function Ri({ sheet: e }) {
  return `
<div class="ndb-header">
${e ? "" : `  <button type="button" class="ndb-icon-button ndb-drag-handle"
          data-ndb-on:pointerdown="startDockDrag($event)"
          data-ndb-on:pointermove="moveDockDrag($event)"
          data-ndb-on:pointerup="endDockDrag($event)"
          data-ndb-on:pointercancel="endDockDrag($event)"
          data-ndb-on:dblclick="resetDockFromGrip($event)"
          data-ndb-on:keydown="moveDockWithKeyboard($event)"
          aria-label="Move debug bar"
          title="Drag to move the debug bar, double click to put it back; arrow keys move it 10 pixels">
    ${j("grip")}
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
      ${j("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + queryTone">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </div>

    <div class="ndb-stat">
      ${j("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </div>

    <div class="ndb-stat is-secondary">
      ${j("chip", "is-accent")}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </div>
  </div>`}

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openPalette()"
            title="Search sections and settings">
      ${j("search")}
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="cycleTheme()"
            data-ndb-bind:title="'Theme: ' + theme + '. Click for the next one.'">
      <span data-ndb-show="theme === 'system'">${j("monitor")}</span>
      <span data-ndb-show="theme === 'light'">${j("sun")}</span>
      <span data-ndb-show="theme === 'dark'">${j("moon")}</span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="select('findings')"
            data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
            title="Findings">
      ${j("alert")}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <span class="ndb-controls-divider"></span>

    ${e ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      <span data-ndb-show="!maximised">${j("expand")}</span>
      <span data-ndb-show="maximised">${j("collapse")}</span>
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${j("minimise")}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button is-open" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${j("expand")}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="collapse()"
            title="Collapse to a bubble">
      ${j("close")}
    </button>
  </div>
</div>`;
}
function $i(e, t) {
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
      ${j("star")}
    </button>
  </div>
</template>`;
}
function Pu() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${$i("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${$i("otherSections", !1)}
</nav>`;
}
function Kt(e, t) {
  return `<div class="ndb-subtabs" role="tablist">${t.map((s) => `
  <button type="button" class="ndb-subtab" role="tab"
          data-ndb-bind:aria-selected="${e} === '${s.id}' ? 'true' : 'false'"
          data-ndb-bind:class="${e} === '${s.id}' && 'is-active'"
          data-ndb-on:click="${e} = '${s.id}'">
    <span>${s.label}</span>
    ${s.count ? `<span class="ndb-pill"${s.tone ? ` data-ndb-bind:class="'is-' + (${s.tone})"` : ""}
            ${s.always ? "" : `data-ndb-show="${s.count}"`}
            data-ndb-text="${s.count}"></span>` : ""}
  </button>`).join("")}</div>`;
}
const Iu = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme"
     data-ndb-on:resize.window="constrainDock()">

  <div class="ndb-dock" data-ndb-ref="dock"
       data-ndb-show="!open && !dismissed && !collapsed" data-ndb-cloak
       data-ndb-bind:class="draggingDock && 'is-dragging'"
       data-ndb-bind:style="dockStyle"
       title="Open the inspector" data-ndb-on:click="openFromBar($event)">
    ${Ri({ sheet: !1 })}
  </div>

  <button type="button" class="ndb-bubble" data-ndb-show="collapsed && !dismissed" data-ndb-cloak
          data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
          data-ndb-on:click="expand()"
          aria-label="Show the debug bar" title="Show the debug bar">
    ${j("pulse")}
    <span class="ndb-badge" data-ndb-show="findings.length > 0"
          data-ndb-text="findings.length"></span>
  </button>

  ${zc()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${Ri({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${j("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${Pu()}

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
            ${Ne([
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
            ${Ne([
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
            ${Ne([
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
            ${Ne([
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
          ${Kt("magewireTab", [
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
                    ${j("caret", "ndb-alpine-caret")}
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

      <template data-ndb-if="isSection('seo')">
      <div>
        ${Kt("seoTab", [
  { id: "overview", label: "Overview", count: "seo.counts.overview", tone: "'warn'" },
  { id: "headings", label: "Headings", count: "seo.counts.headings", tone: "'warn'" },
  { id: "images", label: "Images", count: "seo.counts.images", tone: "'warn'" },
  { id: "links", label: "Links", count: "seo.counts.links", tone: "'warn'" },
  { id: "schema", label: "Schema", count: "seo.counts.schema", tone: "'warn'" },
  { id: "social", label: "Social", count: "seo.counts.social", tone: "'warn'" }
])}

        <p class="ndb-note" data-ndb-show="seoError">
          Could not read this page: <span data-ndb-text="seoError"></span>
        </p>

        <div class="ndb-controls">
          <template data-ndb-if="seoTab === 'images' || seoTab === 'links'">
            <input class="ndb-search" type="search" data-ndb-model="seoSearch"
                   data-ndb-bind:placeholder="seoTab === 'images' ? 'Filter by source or alt' : 'Filter by URL or text'">
          </template>
          <template data-ndb-if="seoTab === 'images' || seoTab === 'links'">
            <button type="button" class="ndb-chip"
                    data-ndb-bind:class="seoProblemsOnly && 'is-active'"
                    data-ndb-on:click="seoProblemsOnly = !seoProblemsOnly">
              Problems only
            </button>
          </template>
          <button type="button" class="ndb-chip" data-ndb-on:click="refreshSeo()"
                  title="Read the page again">Refresh</button>
          <span class="ndb-dim ndb-count">Read from the page as it is now, not from the profile.</span>
        </div>

        <div data-ndb-show="seoTab === 'overview'">
          <div class="ndb-callout is-warn" data-ndb-show="seo.overview.warnings.length > 0">
            <template data-ndb-for="(warning, index) in seo.overview.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          ${Ne([
  { label: "Title", value: "seo.overview.title.value || 'missing'", tone: "seo.overview.title.hint ? 'warn' : 'ok'" },
  { label: "Title length", value: "seo.overview.title.length + ' characters'", tone: "seo.overview.title.hint ? 'warn' : 'ok'" },
  { label: "Meta description", value: "seo.overview.description.value || 'missing'", tone: "seo.overview.description.hint ? 'warn' : 'ok'" },
  { label: "Description length", value: "seo.overview.description.length + ' characters'", tone: "seo.overview.description.hint ? 'warn' : 'ok'" },
  { label: "Canonical", value: "seo.overview.canonical.href || 'missing'", mono: !0, tone: "seo.overview.canonical.warnings.length ? 'warn' : 'ok'" },
  { label: "Robots meta", value: "seo.overview.robots.meta || 'none, so index and follow'", mono: !0 },
  { label: "X-Robots-Tag", value: "seo.overview.robots.header || 'not sent'", mono: !0 },
  { label: "Language", value: "seo.overview.lang.value || 'missing'", mono: !0, tone: "seo.overview.lang.problem ? 'warn' : 'ok'" },
  { label: "Viewport", value: "seo.overview.viewport || 'missing'", mono: !0, tone: "seo.overview.viewport ? 'ok' : 'warn'" },
  { label: "Charset", value: "seo.overview.charset.value + (seo.overview.charset.declared ? '' : ', not declared')", mono: !0 },
  { label: "Words", value: "seo.overview.words" }
])}

          <template data-ndb-if="seo.overview.hreflang.items.length > 0">
          <div class="ndb-seo-block">
            <div class="ndb-subhead">
              <div>
                <h3>hreflang</h3>
                <p>The other language versions this page says it has.</p>
              </div>
            </div>
            <table class="ndb-table">
              <thead><tr><th>Language</th><th>URL</th></tr></thead>
              <tbody>
                <template data-ndb-for="(alternate, index) in seo.overview.hreflang.items" data-ndb-bind:key="index">
                  <tr>
                    <td class="ndb-mono">
                      <span data-ndb-text="alternate.lang"></span>
                      <span class="ndb-tag" data-ndb-show="alternate.self">this page</span>
                      <span class="ndb-tag is-warn" data-ndb-show="alternate.problem"
                            data-ndb-text="alternate.problem"></span>
                    </td>
                    <td class="ndb-mono" data-ndb-text="alternate.href"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          </template>

          <div class="ndb-subhead">
            <div>
              <h3>Links</h3>
              <p>View the source with Ctrl+U, or Option+Command+U on a Mac. Browsers do not
                let a page link to it.</p>
            </div>
          </div>
          <div class="ndb-controls">
            <template data-ndb-if="adminEditUrl">
              <a class="ndb-chip" data-ndb-bind:href="adminEditUrl" target="_blank" rel="noopener">
                Edit this page in the admin
              </a>
            </template>
            <template data-ndb-for="(link, index) in seo.quickLinks" data-ndb-bind:key="index">
              <a class="ndb-chip" data-ndb-bind:href="link.href" target="_blank" rel="noopener"
                 data-ndb-text="link.label"></a>
            </template>
          </div>
        </div>

        <div data-ndb-show="seoTab === 'headings'">
          <div class="ndb-callout is-warn" data-ndb-show="seo.headings.warnings.length > 0">
            <template data-ndb-for="(warning, index) in seo.headings.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          <p class="ndb-empty" data-ndb-show="seo.headings.items.length === 0">
            No headings on this page.
          </p>

          <ol class="ndb-list ndb-seo-tree">
            <template data-ndb-for="heading in seo.headings.items" data-ndb-bind:key="heading.index">
              <li>
                <button type="button" class="ndb-seo-row"
                        data-ndb-bind:class="'is-level-' + heading.level"
                        data-ndb-on:click="revealSeo('headings', heading.index)"
                        data-ndb-on:mouseenter="highlightSeo('headings', heading.index, true)"
                        data-ndb-on:mouseleave="highlightSeo('headings', heading.index, false)"
                        data-ndb-on:focus="highlightSeo('headings', heading.index, true)"
                        data-ndb-on:blur="highlightSeo('headings', heading.index, false)"
                        title="Scroll to this heading">
                  <span class="ndb-tag" data-ndb-text="'H' + heading.level"></span>
                  <span class="ndb-seo-text" data-ndb-text="heading.text || '(empty)'"></span>
                  <template data-ndb-for="(warning, index) in heading.warnings" data-ndb-bind:key="index">
                    <span class="ndb-tag is-warn" data-ndb-text="warning"></span>
                  </template>
                </button>
              </li>
            </template>
          </ol>
        </div>

        <div data-ndb-show="seoTab === 'images'">
          <p class="ndb-dim ndb-count">
            <span data-ndb-text="plural(seo.images.items.length, 'image', 'images')"></span>,
            <span data-ndb-text="seo.counts.images"></span> with a problem
          </p>

          <ol class="ndb-list">
            <template data-ndb-for="image in visibleSeoImages" data-ndb-bind:key="image.index">
              <li>
                <button type="button" class="ndb-seo-row"
                        data-ndb-on:click="revealSeo('images', image.index)"
                        data-ndb-on:mouseenter="highlightSeo('images', image.index, true)"
                        data-ndb-on:mouseleave="highlightSeo('images', image.index, false)"
                        data-ndb-on:focus="highlightSeo('images', image.index, true)"
                        data-ndb-on:blur="highlightSeo('images', image.index, false)"
                        title="Scroll to this image">
                  <span class="ndb-seo-text">
                    <span data-ndb-text="altLabel(image.alt)"
                          data-ndb-bind:class="image.alt ? '' : 'ndb-dim'"></span>
                    <small class="ndb-dim ndb-mono ndb-block ndb-truncate" data-ndb-text="image.src"></small>
                    <small class="ndb-dim ndb-block" data-ndb-show="image.size" data-ndb-text="image.size"></small>
                  </span>
                  <template data-ndb-for="(warning, index) in image.warnings" data-ndb-bind:key="index">
                    <span class="ndb-tag is-warn" data-ndb-text="warning"></span>
                  </template>
                </button>
              </li>
            </template>
          </ol>

          <p class="ndb-empty" data-ndb-show="visibleSeoImages.length === 0">
            <span data-ndb-show="seoProblemsOnly && !seoSearch">No image has a problem.</span>
            <span data-ndb-show="!seoProblemsOnly || seoSearch">No images match.</span>
          </p>
        </div>

        <div data-ndb-show="seoTab === 'links'">
          ${Ne([
  { label: "Internal", value: "seo.links.counts.internal" },
  { label: "External", value: "seo.links.counts.external" },
  { label: "Nofollow", value: "seo.links.counts.nofollow" },
  { label: "With a problem", value: "seo.counts.links", tone: "seo.counts.links ? 'warn' : 'ok'" }
])}

          <ol class="ndb-list">
            <template data-ndb-for="link in visibleSeoLinks" data-ndb-bind:key="link.index">
              <li>
                <button type="button" class="ndb-seo-row"
                        data-ndb-on:click="revealSeo('links', link.index)"
                        data-ndb-on:mouseenter="highlightSeo('links', link.index, true)"
                        data-ndb-on:mouseleave="highlightSeo('links', link.index, false)"
                        data-ndb-on:focus="highlightSeo('links', link.index, true)"
                        data-ndb-on:blur="highlightSeo('links', link.index, false)"
                        title="Scroll to this link">
                  <span class="ndb-seo-text">
                    <span data-ndb-text="link.text || '(no text)'"
                          data-ndb-bind:class="link.text ? '' : 'ndb-dim'"></span>
                    <small class="ndb-dim ndb-mono ndb-block ndb-truncate" data-ndb-text="link.href"></small>
                  </span>
                  <span class="ndb-tag" data-ndb-text="link.kind"></span>
                  <span class="ndb-tag" data-ndb-show="link.nofollow">nofollow</span>
                  <template data-ndb-for="(warning, index) in link.warnings" data-ndb-bind:key="index">
                    <span class="ndb-tag is-warn" data-ndb-text="warning"></span>
                  </template>
                </button>
              </li>
            </template>
          </ol>

          <p class="ndb-empty" data-ndb-show="visibleSeoLinks.length === 0">
            <span data-ndb-show="seoProblemsOnly && !seoSearch">No link has a problem.</span>
            <span data-ndb-show="!seoProblemsOnly || seoSearch">No links match.</span>
          </p>
        </div>

        <div data-ndb-show="seoTab === 'schema'">
          <div class="ndb-callout is-warn" data-ndb-show="seo.schema.warnings.length > 0">
            <template data-ndb-for="(warning, index) in seo.schema.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          <p class="ndb-empty" data-ndb-show="seo.schema.entities.length === 0 && seo.schema.blocks.length === 0">
            No structured data on this page: no JSON-LD and no microdata.
          </p>

          <template data-ndb-for="block in seo.schema.blocks" data-ndb-bind:key="block.index">
            <div class="ndb-note" data-ndb-show="block.error">
              <p>
                JSON-LD block <span data-ndb-text="block.index + 1"></span> does not parse<span
                  data-ndb-show="block.at"
                  data-ndb-text="block.at ? ' at line ' + block.at.line + ', column ' + block.at.column : ''"></span>:
                <span data-ndb-text="block.error"></span>
              </p>
              <code class="ndb-mono" data-ndb-show="block.excerpt" data-ndb-text="block.excerpt"></code>
            </div>
          </template>

          <ol class="ndb-list">
            <template data-ndb-for="entity in seo.schema.entities" data-ndb-bind:key="entity.index">
              <li class="ndb-alpine ndb-schema-entity">
                <button type="button" class="ndb-alpine-head"
                        data-ndb-on:click="toggleSchemaEntity(entity.index)"
                        data-ndb-on:mouseenter="highlightSchema(entity, true)"
                        data-ndb-on:mouseleave="highlightSchema(entity, false)"
                        data-ndb-on:focus="highlightSchema(entity, true)"
                        data-ndb-on:blur="highlightSchema(entity, false)">
                  ${j("caret", "ndb-alpine-caret")}
                  <span class="ndb-alpine-name" data-ndb-text="entity.type"></span>
                  <span class="ndb-tag"
                        data-ndb-text="entity.source === 'json-ld' ? 'JSON-LD ' + (entity.block + 1) : 'microdata'"></span>
                  <span class="ndb-tag is-warn" data-ndb-show="entity.wrapper">declared twice</span>
                  <span class="ndb-alpine-path ndb-dim ndb-truncate"
                        data-ndb-text="entity.name || entity.where"></span>
                  <span class="ndb-pill is-warn"
                        data-ndb-show="schemaRequired(entity) > 0"
                        data-ndb-text="schemaRequired(entity) + ' required'"></span>
                </button>

                <div class="ndb-alpine-body" data-ndb-show="isSchemaExpanded(entity.index)">
                  <ul class="ndb-schema-findings" data-ndb-show="entity.findings.length > 0">
                    <template data-ndb-for="(finding, index) in entity.findings" data-ndb-bind:key="index">
                      <li>
                        <span class="ndb-tag"
                              data-ndb-bind:class="finding.level === 'required' ? 'is-warn' : ''"
                              data-ndb-text="finding.level"></span>
                        <span class="ndb-mono ndb-dim" data-ndb-text="finding.path"></span>
                        <span data-ndb-text="finding.message"></span>
                        <a data-ndb-bind:href="finding.docs" target="_blank" rel="noopener">Google's rules</a>
                      </li>
                    </template>
                  </ul>
                  <p class="ndb-dim" data-ndb-show="entity.source === 'microdata'">
                    Declared on <span class="ndb-mono" data-ndb-text="entity.where"></span>.
                  </p>
                  <pre class="ndb-json" data-ndb-code="highlight(entity.json, 'json')"></pre>
                </div>
              </li>
            </template>
          </ol>

          <div class="ndb-subhead">
            <div>
              <h3>Check it elsewhere</h3>
              <p data-ndb-show="seo.schema.links.public">These tools fetch this page by its URL.</p>
              <p data-ndb-show="!seo.schema.links.public">
                Google's tools cannot reach this host. Copy the markup and paste it into the
                tool's code tab.
              </p>
            </div>
          </div>
          <div class="ndb-controls">
            <button type="button" class="ndb-chip"
                    data-ndb-bind:class="schemaCopyState && 'is-active'"
                    data-ndb-on:click="copySchemaMarkup()"
                    data-ndb-text="schemaCopyState === 'done' ? 'Copied' : 'Copy the markup'"></button>
            <template data-ndb-for="(tool, index) in seo.schema.links.tools" data-ndb-bind:key="index">
              <a class="ndb-chip" data-ndb-bind:href="tool.href" target="_blank" rel="noopener"
                 data-ndb-text="tool.label"></a>
            </template>
          </div>
          <div class="ndb-note" data-ndb-show="schemaFallback">
            <p>This browser would not take the clipboard. Select this and copy it by hand.</p>
            <textarea class="ndb-copy-fallback" readonly rows="6" data-ndb-model="schemaFallback"
                      data-ndb-on:focus="$event.target.select()"></textarea>
          </div>
        </div>

        <div data-ndb-show="seoTab === 'social'">
          <div class="ndb-callout is-warn" data-ndb-show="seo.social.warnings.length > 0">
            <template data-ndb-for="(warning, index) in seo.social.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          <div class="ndb-subhead">
            <div>
              <h3>Open Graph</h3>
              <p>What Facebook, LinkedIn, Slack and most chat apps show when this page is shared.</p>
            </div>
          </div>
          <table class="ndb-table" data-ndb-show="seo.social.openGraph.length > 0">
            <tbody>
              <template data-ndb-for="(tag, index) in seo.social.openGraph" data-ndb-bind:key="index">
                <tr><td class="ndb-mono" data-ndb-text="tag.name"></td><td data-ndb-text="tag.value"></td></tr>
              </template>
            </tbody>
          </table>
          <p class="ndb-empty" data-ndb-show="seo.social.openGraph.length === 0">No Open Graph tags.</p>

          <div class="ndb-subhead">
            <div>
              <h3>X card</h3>
              <p>X falls back to Open Graph for the title, description and image.</p>
            </div>
          </div>
          <table class="ndb-table" data-ndb-show="seo.social.x.length > 0">
            <tbody>
              <template data-ndb-for="(tag, index) in seo.social.x" data-ndb-bind:key="index">
                <tr><td class="ndb-mono" data-ndb-text="tag.name"></td><td data-ndb-text="tag.value"></td></tr>
              </template>
            </tbody>
          </table>
          <p class="ndb-empty" data-ndb-show="seo.social.x.length === 0">No X card tags.</p>
        </div>
      </div>
      </template>

      <template data-ndb-if="isSection('history')">
      <div>
        ${Kt("historyTab", [
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
          ${Kt("alpineTab", [
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
                    ${j("caret", "ndb-alpine-caret")}
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
            ${Ne([
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
`, Lu = "data-ndb-", Pi = "siteation-debugbar";
function Du(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const i = document.createElement("link");
    i.rel = "stylesheet", i.href = n, t.append(i);
  }
  const s = document.createElement("div");
  return s.innerHTML = Iu, t.append(...s.children), t.querySelector(".ndb");
}
class qu extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const t = Du(this);
    t && wt.initTree(t);
  }
}
customElements.get(Pi) || (wt.prefix(Lu), wt.data("debugBar", $u), wt.directive("code", (e, { expression: t }, { effect: n, evaluateLater: s }) => {
  const i = s(t);
  n(() => i((r) => {
    e.innerHTML = typeof r == "string" ? r : "";
  }));
}), customElements.define(Pi, qu));
Ln && (window.Alpine = Ln);
