const ie = window.Alpine;
var se = !1, re = !1, $ = [], ae = -1, It = !1, Ee = !1;
function Ri(t) {
  Ni(t);
}
function Ii() {
  Ee = !0;
}
function qi() {
  Ee = !1, gn();
}
function Ni(t) {
  $.includes(t) || ($.push(t), t._x_schedulerPriority !== void 0 && (It = !0)), gn();
}
function Li(t) {
  let e = $.indexOf(t);
  e !== -1 && e > ae && $.splice(e, 1);
}
function gn() {
  if (!re && !se) {
    if (Ee)
      return;
    se = !0, queueMicrotask(Di);
  }
}
function Di() {
  se = !1, re = !0;
  for (let t = 0; t < $.length; t++)
    It && Fi(t), $[t](), ae = t;
  $.length = 0, ae = -1, It = !1, re = !1;
}
function Fi(t) {
  let e = /* @__PURE__ */ new Map(), n = $.slice(t).sort((i, s) => ji(i, s, e));
  for (let i = 0; i < n.length; i++)
    $[t + i] = n[i];
  It = !1;
}
function ji(t, e, n) {
  return Vt(t) ? Vt(e) ? Qe(t._x_schedulerPriority.el, n) - Qe(e._x_schedulerPriority.el, n) || t._x_schedulerPriority.order - e._x_schedulerPriority.order : -1 : Vt(e) ? 1 : 0;
}
function Vt(t) {
  return t._x_schedulerPriority !== void 0;
}
function Qe(t, e) {
  if (e.has(t))
    return e.get(t);
  let n = 0, i = t;
  for (; t; )
    n++, t._x_teleportBack ? t = t._x_teleportBack : typeof ShadowRoot == "function" && t.parentNode instanceof ShadowRoot ? t = t.parentNode.host : t = t.parentElement;
  return e.set(i, n), n;
}
var st, Y, rt, mn, Bi = 0, oe = !0;
function Hi(t) {
  oe = !1, t(), oe = !0;
}
function Wi(t) {
  st = t.reactive, rt = t.release, Y = (e) => t.effect(e, { scheduler: (n) => {
    oe ? Ri(n) : n();
  } }), mn = t.raw;
}
function Ze(t) {
  Y = t;
}
function Ki(t) {
  let e = () => {
  };
  return [(i, s) => {
    let r = s?.priority === "structural" ? Bi++ : void 0, a = Y(i);
    return r !== void 0 && a !== void 0 && (a._x_schedulerPriority = { el: t, order: r }), t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((o) => o());
    }), t._x_effects.add(a), e = () => {
      a !== void 0 && (t._x_effects.delete(a), rt(a));
    }, a;
  }, () => {
    e();
  }];
}
function vn(t, e) {
  let n = !0, i, s, r = Y(() => {
    let a = t(), o = JSON.stringify(a);
    if (!n && (typeof a == "object" || a !== i)) {
      let d = typeof i == "object" ? JSON.parse(s) : i;
      queueMicrotask(() => {
        e(a, d);
      });
    }
    i = a, s = o, n = !1;
  });
  return () => rt(r);
}
async function Ui(t) {
  Ii();
  try {
    await t(), await Promise.resolve();
  } finally {
    qi();
  }
}
var _n = [], yn = [], xn = [];
function zi(t) {
  xn.push(t);
}
function Ae(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, yn.push(e));
}
function wn(t) {
  _n.push(t);
}
function Sn(t, e, n) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n);
}
function En(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([n, i]) => {
    (e === void 0 || e.includes(n)) && (i.forEach((s) => s()), delete t._x_attributeCleanups[n]);
  });
}
function Vi(t) {
  for (t._x_effects?.forEach(Li); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var ke = new MutationObserver(Ce), Oe = !1;
function Te() {
  ke.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), Oe = !0;
}
function An() {
  Ji(), ke.disconnect(), Oe = !1;
}
var dt = [];
function Ji() {
  let t = ke.takeRecords();
  dt.push(() => t.length > 0 && Ce(t));
  let e = dt.length;
  queueMicrotask(() => {
    if (dt.length === e)
      for (; dt.length > 0; )
        dt.shift()();
  });
}
function m(t) {
  if (!Oe)
    return t();
  An();
  let e = t();
  return Te(), e;
}
var Me = !1, qt = [];
function Yi() {
  Me = !0;
}
function Qi() {
  Me = !1, Ce(qt), qt = [];
}
function Ce(t) {
  if (Me) {
    qt = qt.concat(t);
    return;
  }
  let e = [], n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
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
      let a = t[r].target, o = t[r].attributeName, d = t[r].oldValue, l = () => {
        i.has(a) || i.set(a, []), i.get(a).push({ name: o, value: a.getAttribute(o) });
      }, c = () => {
        s.has(a) || s.set(a, []), s.get(a).push(o);
      };
      a.hasAttribute(o) && d === null ? l() : a.hasAttribute(o) ? (c(), l()) : c();
    }
  s.forEach((r, a) => {
    En(a, r);
  }), i.forEach((r, a) => {
    _n.forEach((o) => o(a, r));
  });
  for (let r of n)
    e.some((a) => a.contains(r)) || yn.forEach((a) => a(r));
  for (let r of e)
    r.isConnected && xn.forEach((a) => a(r));
  e = null, n = null, i = null, s = null;
}
function kn(t) {
  return W(H(t));
}
function kt(t, e, n) {
  return t._x_dataStack = [e, ...H(n || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((i) => i !== e);
  };
}
function H(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? H(t.host) : t.parentNode ? H(t.parentNode) : [];
}
function W(t) {
  return new Proxy({ objects: t }, Zi);
}
function On(t, e) {
  return t === null || t === Object.prototype ? null : Object.prototype.hasOwnProperty.call(t, e) ? t : On(Object.getPrototypeOf(t), e);
}
var Zi = {
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
    return e == "toJSON" ? Gi : Reflect.get(
      t.find(
        (i) => Reflect.has(i, e)
      ) || {},
      e,
      n
    );
  },
  set({ objects: t }, e, n, i) {
    let s;
    for (const a of t)
      if (s = On(a, e), s)
        break;
    s || (s = t[t.length - 1]);
    const r = Object.getOwnPropertyDescriptor(s, e);
    return r?.set && r?.get ? r.set.call(i, n) || !0 : Reflect.set(s, e, n);
  }
};
function Gi() {
  return Reflect.ownKeys(this).reduce((e, n) => (e[n] = Reflect.get(this, n), e), {});
}
function $e(t, e = () => {
}) {
  let n = (s) => typeof s == "object" && !Array.isArray(s) && s !== null, i = (s, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(s)).forEach(([a, { value: o, enumerable: d }]) => {
      if (d === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let l = r === "" ? a : `${r}.${a}`;
      typeof o == "object" && o !== null && o._x_interceptor ? s[a] = o.initialize(t, l, a, e) : n(o) && o !== s && !(o instanceof Element) && i(o, l);
    });
  };
  return i(t);
}
function Tn(t, e = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, s, r, a) {
      return t(this.initialValue, () => Xi(i, s), (o) => de(i, s, o), s, r, a);
    }
  };
  return e(n), (i) => {
    if (typeof i == "object" && i !== null && i._x_interceptor) {
      let s = n.initialize.bind(n);
      n.initialize = (r, a, o, d) => {
        let l = i.initialize(r, a, o, d);
        return n.initialValue = l, s(r, a, o, d);
      };
    } else
      n.initialValue = i;
    return n;
  };
}
function Xi(t, e) {
  return e.split(".").reduce((n, i) => n[i], t);
}
function de(t, e, n) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = n;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), de(t[e[0]], e.slice(1), n);
  }
}
var Mn = {};
function A(t, e) {
  Mn[t] = e;
}
function vt(t, e) {
  let n = ts(e);
  return Object.entries(Mn).forEach(([i, s]) => {
    Object.defineProperty(t, `$${i}`, {
      get() {
        return s(e, n);
      },
      enumerable: !1
    });
  }), t;
}
function ts(t) {
  let [e, n] = Nn(t), i = { interceptor: Tn, ...e };
  return Ae(t, n), i;
}
function es(t, e, n, ...i) {
  try {
    return n(...i);
  } catch (s) {
    _t(s, t, e);
  }
}
function _t(...t) {
  return Cn(...t);
}
var Cn = is;
function ns(t) {
  Cn = t;
}
function is(t, e, n = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: n }
  ), console.warn(`Alpine Expression Error: ${t.message}

${n ? 'Expression: "' + n + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var nt = !0;
function $n(t) {
  let e = nt;
  nt = !1;
  let n = t();
  return nt = e, n;
}
function j(t, e, n = {}) {
  let i;
  return w(t, e)((s) => i = s, n), i;
}
function w(...t) {
  return Pn(...t);
}
var Pn = () => {
};
function ss(t) {
  Pn = t;
}
var Rn;
function rs(t) {
  Rn = t;
}
function as(t, e) {
  let n = {};
  vt(n, t);
  let i = [n, ...H(t)], s = typeof e == "function" ? os(i, e) : ls(i, e, t);
  return es.bind(null, t, e, s);
}
function os(t, e) {
  return (n = () => {
  }, { scope: i = {}, params: s = [], context: r } = {}) => {
    if (!nt) {
      yt(n, e, W([i, ...t]), s);
      return;
    }
    let a = e.apply(W([i, ...t]), s);
    yt(n, a);
  };
}
var Jt = {};
function ds(t, e) {
  if (Jt[t])
    return Jt[t];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, i = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t, r = (() => {
    try {
      let a = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${i} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(a, "name", {
        value: `[Alpine] ${t}`
      }), a;
    } catch (a) {
      return _t(a, e, t), Promise.resolve();
    }
  })();
  return Jt[t] = r, r;
}
function ls(t, e, n) {
  let i = ds(e, n);
  return (s = () => {
  }, { scope: r = {}, params: a = [], context: o } = {}) => {
    i.result = void 0, i.finished = !1;
    let d = W([r, ...t]);
    if (typeof i == "function") {
      let l = i.call(o, i, d).catch((c) => _t(c, n, e));
      i.finished ? (yt(s, i.result, d, a, n), i.result = void 0) : l.then((c) => {
        yt(s, c, d, a, n);
      }).catch((c) => _t(c, n, e)).finally(() => i.result = void 0);
    }
  };
}
function yt(t, e, n, i, s) {
  if (nt && typeof e == "function") {
    let r = e.apply(n, i);
    r instanceof Promise ? r.then((a) => yt(t, a, n, i)).catch((a) => _t(a, s, e)) : t(r);
  } else typeof e == "object" && e instanceof Promise ? e.then((r) => t(r)) : t(e);
}
function cs(...t) {
  return Rn(...t);
}
function us(t, e, n = {}) {
  let i = {};
  vt(i, t);
  let s = [i, ...H(t)], r = W([n.scope ?? {}, ...s]), a = n.params ?? [];
  if (e.includes("await")) {
    let o = Object.getPrototypeOf(async function() {
    }).constructor, d = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e;
    return new o(
      ["scope"],
      `with (scope) { let __result = ${d}; return __result }`
    ).call(n.context, r);
  } else {
    let o = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(()=>{ ${e} })()` : e, l = new Function(
      ["scope"],
      `with (scope) { let __result = ${o}; return __result }`
    ).call(n.context, r);
    return typeof l == "function" && nt ? l.apply(r, a) : l;
  }
}
var Pe = "x-";
function at(t = "") {
  return Pe + t;
}
function fs(t) {
  Pe = t;
}
var Nt = {};
function v(t, e) {
  return Nt[t] = e, {
    before(n) {
      if (!Nt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const i = F.indexOf(n);
      F.splice(i >= 0 ? i : F.indexOf("DEFAULT"), 0, t);
    }
  };
}
function ps(t) {
  return Object.keys(Nt).includes(t);
}
function Re(t, e, n) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let r = Object.entries(t._x_virtualDirectives).map(([o, d]) => ({ name: o, value: d })), a = In(r);
    r = r.map((o) => a.find((d) => d.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), e = e.concat(r);
  }
  let i = {};
  return e.map(Fn((r, a) => i[r] = a)).filter(Bn).map(gs(i, n)).sort(ms).map((r) => bs(t, r));
}
function In(t) {
  return Array.from(t).map(Fn()).filter((e) => !Bn(e));
}
var le = !1, ft = /* @__PURE__ */ new Map(), qn = /* @__PURE__ */ Symbol();
function hs(t) {
  le = !0;
  let e = /* @__PURE__ */ Symbol();
  qn = e, ft.set(e, []);
  let n = () => {
    for (; ft.get(e).length; )
      ft.get(e).shift()();
    ft.delete(e);
  }, i = () => {
    le = !1, n();
  };
  t(n), i();
}
function Nn(t) {
  let e = [], n = (o) => e.push(o), [i, s] = Ki(t);
  return e.push(s), [{
    Alpine: ot,
    effect: i,
    cleanup: n,
    evaluateLater: w.bind(w, t),
    evaluate: j.bind(j, t)
  }, () => e.forEach((o) => o())];
}
function bs(t, e) {
  let n = () => {
  }, i = Nt[e.type] || n, [s, r] = Nn(t);
  Sn(t, e.original, r);
  let a = () => {
    t._x_ignore || t._x_ignoreSelf || (i.inline && i.inline(t, e, s), i = i.bind(i, t, e, s), le ? ft.get(qn).push(i) : i());
  };
  return a.runCleanups = r, a;
}
var Ln = (t, e) => ({ name: n, value: i }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: i }), Dn = (t) => t;
function Fn(t = () => {
}) {
  return ({ name: e, value: n }) => {
    let { name: i, value: s } = jn.reduce((r, a) => a(r), { name: e, value: n });
    return i !== e && t(i, e), { name: i, value: s };
  };
}
var jn = [];
function Ie(t) {
  jn.push(t);
}
function Bn({ name: t }) {
  return Hn().test(t);
}
var Hn = () => new RegExp(`^${Pe}([^:^.]+)\\b`);
function gs(t, e) {
  return ({ name: n, value: i }) => {
    n === i && (i = "");
    let s = n.match(Hn()), r = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = e || t[n] || n;
    return {
      type: s ? s[1] : null,
      value: r ? r[1] : null,
      modifiers: a.map((d) => d.replace(".", "")),
      expression: i,
      original: o
    };
  };
}
var ce = "DEFAULT", F = [
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
  ce,
  "teleport"
];
function ms(t, e) {
  let n = F.indexOf(t.type) === -1 ? ce : t.type, i = F.indexOf(e.type) === -1 ? ce : e.type;
  return F.indexOf(n) - F.indexOf(i);
}
function pt(t, e, n = {}, i = {}) {
  return t.dispatchEvent(
    new CustomEvent(e, {
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
function K(t, e) {
  if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
    Array.from(t.children).forEach((s) => K(s, e));
    return;
  }
  let n = !1;
  if (e(t, () => n = !0), n)
    return;
  let i = t.firstElementChild;
  for (; i; )
    K(i, e), i = i.nextElementSibling;
}
function O(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var Ge = !1;
function vs() {
  Ge && O("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Ge = !0, document.body || O("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), pt(document, "alpine:init"), pt(document, "alpine:initializing"), Te(), zi((e) => R(e, K)), Ae((e) => Q(e)), wn((e, n) => {
    Re(e, n).forEach((i) => i());
  });
  let t = (e) => !Ht(e.parentElement, !0);
  Array.from(document.querySelectorAll(Un().join(","))).filter(t).forEach((e) => {
    R(e);
  }), pt(document, "alpine:initialized"), setTimeout(() => {
    ws();
  });
}
var qe = [], Wn = [];
function Kn() {
  return qe.map((t) => t());
}
function Un() {
  return qe.concat(Wn).map((t) => t());
}
function zn(t) {
  qe.push(t);
}
function Vn(t) {
  Wn.push(t);
}
function Ht(t, e = !1) {
  return P(t, (n) => {
    if ((e ? Un() : Kn()).some((s) => n.matches(s)))
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
function _s(t) {
  return Kn().some((e) => t.matches(e));
}
var Jn = [];
function ys(t) {
  Jn.push(t);
}
var xs = 1;
function R(t, e = K, n = () => {
}) {
  P(t, (i) => i._x_ignore) || hs(() => {
    e(t, (i, s) => {
      i._x_marker || (n(i, s), Jn.forEach((r) => r(i, s)), Re(i, i.attributes).forEach((r) => r()), i._x_ignore || (i._x_marker = xs++), i._x_ignore && s());
    });
  });
}
function Q(t, e = K) {
  e(t, (n) => {
    Vi(n), En(n), delete n._x_marker;
  });
}
function ws() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, n, i]) => {
    ps(n) || i.some((s) => {
      if (document.querySelector(s))
        return O(`found "${s}", but missing ${e} plugin`), !0;
    });
  });
}
var ue = [], Ne = !1;
function Le(t = () => {
}) {
  return queueMicrotask(() => {
    Ne || setTimeout(() => {
      fe();
    });
  }), new Promise((e) => {
    ue.push(() => {
      t(), e();
    });
  });
}
function fe() {
  for (Ne = !1; ue.length; )
    ue.shift()();
}
function Ss() {
  Ne = !0;
}
function De(t, e) {
  return Array.isArray(e) ? Xe(t, e.join(" ")) : typeof e == "object" && e !== null ? Es(t, e) : typeof e == "function" ? De(t, e()) : Xe(t, e);
}
function pe(t) {
  return t.split(/\s/).filter(Boolean);
}
function Xe(t, e) {
  let n = (s) => pe(s).filter((r) => !t.classList.contains(r)).filter(Boolean), i = (s) => (t.classList.add(...s), () => {
    t.classList.remove(...s);
  });
  return e = e === !0 ? e = "" : e || "", i(n(e));
}
function Es(t, e) {
  let n = Object.entries(e).flatMap(([a, o]) => o ? pe(a) : !1).filter(Boolean), i = Object.entries(e).flatMap(([a, o]) => o ? !1 : pe(a)).filter(Boolean), s = [], r = [];
  return i.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), r.push(a));
  }), n.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), s.push(a));
  }), () => {
    r.forEach((a) => t.classList.add(a)), s.forEach((a) => t.classList.remove(a));
  };
}
function Wt(t, e) {
  return typeof e == "object" && e !== null ? As(t, e) : ks(t, e);
}
function As(t, e) {
  let n = {};
  return Object.entries(e).forEach(([i, s]) => {
    n[i] = t.style[i], i.startsWith("--") || (i = Os(i)), t.style.setProperty(i, s);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    Wt(t, n);
  };
}
function ks(t, e) {
  let n = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", n || "");
  };
}
function Os(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function he(t, e = () => {
}) {
  let n = !1;
  return function() {
    n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments));
  };
}
v("transition", (t, { value: e, modifiers: n, expression: i }, { evaluate: s }) => {
  typeof i == "function" && (i = s(i)), i !== !1 && (!i || typeof i == "boolean" ? Ms(t, n, e) : Ts(t, i, e));
});
function Ts(t, e, n) {
  Yn(t, De, ""), {
    enter: (s) => {
      t._x_transition.enter.during = s;
    },
    "enter-start": (s) => {
      t._x_transition.enter.start = s;
    },
    "enter-end": (s) => {
      t._x_transition.enter.end = s;
    },
    leave: (s) => {
      t._x_transition.leave.during = s;
    },
    "leave-start": (s) => {
      t._x_transition.leave.start = s;
    },
    "leave-end": (s) => {
      t._x_transition.leave.end = s;
    }
  }[n](e);
}
function Ms(t, e, n) {
  Yn(t, Wt);
  let i = !e.includes("in") && !e.includes("out") && !n, s = i || e.includes("in") || ["enter"].includes(n), r = i || e.includes("out") || ["leave"].includes(n);
  e.includes("in") && !i && (e = e.filter((y, G) => G < e.indexOf("out"))), e.includes("out") && !i && (e = e.filter((y, G) => G > e.indexOf("out")));
  let a = !e.includes("opacity") && !e.includes("scale"), o = a || e.includes("opacity"), d = a || e.includes("scale"), l = o ? 0 : 1, c = d ? lt(e, "scale", 95) / 100 : 1, u = lt(e, "delay", 0) / 1e3, b = lt(e, "origin", "center"), g = "opacity, transform", T = lt(e, "duration", 150) / 1e3, f = lt(e, "duration", 75) / 1e3, _ = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (t._x_transition.enter.during = {
    transformOrigin: b,
    transitionDelay: `${u}s`,
    transitionProperty: g,
    transitionDuration: `${T}s`,
    transitionTimingFunction: _
  }, t._x_transition.enter.start = {
    opacity: l,
    transform: `scale(${c})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), r && (t._x_transition.leave.during = {
    transformOrigin: b,
    transitionDelay: `${u}s`,
    transitionProperty: g,
    transitionDuration: `${f}s`,
    transitionTimingFunction: _
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: l,
    transform: `scale(${c})`
  });
}
function Yn(t, e, n = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, s = () => {
    }) {
      be(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, s);
    },
    out(i = () => {
    }, s = () => {
    }) {
      be(t, e, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, i, s);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(t, e, n, i) {
  const s = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let r = () => s(n);
  if (e) {
    t._x_transition && (t._x_transition.enter || t._x_transition.leave) ? t._x_transition.enter && (Object.entries(t._x_transition.enter.during).length || Object.entries(t._x_transition.enter.start).length || Object.entries(t._x_transition.enter.end).length) ? t._x_transition.in(n) : r() : t._x_transition ? t._x_transition.in(n) : r();
    return;
  }
  t._x_hidePromise = t._x_transition ? new Promise((a, o) => {
    t._x_transition.out(() => {
    }, () => a(i)), t._x_transitioning && t._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(i), queueMicrotask(() => {
    let a = Qn(t);
    a ? (a._x_hideChildren || (a._x_hideChildren = []), a._x_hideChildren.push(t)) : s(() => {
      let o = (d) => {
        let l = Promise.all([
          d._x_hidePromise,
          ...(d._x_hideChildren || []).map(o)
        ]).then(([c]) => c?.());
        return delete d._x_hidePromise, delete d._x_hideChildren, l;
      };
      o(t).catch((d) => {
        if (!d.isFromCancelledTransition)
          throw d;
      });
    });
  });
};
function Qn(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : Qn(e);
}
function be(t, e, { during: n, start: i, end: s } = {}, r = () => {
}, a = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(s).length === 0) {
    r(), a();
    return;
  }
  let o, d, l;
  Cs(t, {
    start() {
      o = e(t, i);
    },
    during() {
      d = e(t, n);
    },
    before: r,
    end() {
      o(), l = e(t, s);
    },
    after: a,
    cleanup() {
      d(), l();
    }
  });
}
function Cs(t, e) {
  let n, i, s, r = he(() => {
    m(() => {
      n = !0, i || e.before(), s || (e.end(), fe()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(a) {
      this.beforeCancels.push(a);
    },
    cancel: he(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      r();
    }),
    finish: r
  }, m(() => {
    e.start(), e.during();
  }), Ss(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), m(() => {
      e.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (m(() => {
        e.end();
      }), fe(), setTimeout(t._x_transitioning.finish, a + o), s = !0);
    });
  });
}
function lt(t, e, n) {
  if (t.indexOf(e) === -1)
    return n;
  const i = t[t.indexOf(e) + 1];
  if (!i || e === "scale" && isNaN(i))
    return n;
  if (e === "duration" || e === "delay") {
    let s = i.match(/([0-9]+)ms/);
    if (s)
      return s[1];
  }
  return e === "origin" && ["top", "right", "left", "center", "bottom"].includes(t[t.indexOf(e) + 2]) ? [i, t[t.indexOf(e) + 2]].join(" ") : i;
}
var q = !1;
function N(t, e = () => {
}) {
  return (...n) => q ? e(...n) : t(...n);
}
function $s(t) {
  return (...e) => q && t(...e);
}
var Zn = [];
function Kt(t) {
  Zn.push(t);
}
function Ps(t, e) {
  Zn.forEach((n) => n(t, e)), q = !0, Gn(() => {
    R(e, (n, i) => {
      i(n, () => {
      });
    });
  }), q = !1;
}
var ge = !1;
function Rs(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), q = !0, ge = !0, Gn(() => {
    Is(e);
  }), q = !1, ge = !1;
}
function Is(t) {
  let e = !1;
  R(t, (i, s) => {
    K(i, (r, a) => {
      if (e && _s(r))
        return a();
      e = !0, s(r, a);
    });
  });
}
function Gn(t) {
  let e = Y;
  Ze((n, i) => {
    let s = e(n);
    return rt(s), () => {
    };
  }), t(), Ze(e);
}
function Xn(t, e, n, i = []) {
  switch (t._x_bindings || (t._x_bindings = st({})), t._x_bindings[e] = n, e = i.includes("camel") ? Hs(e) : e, e) {
    case "value":
      qs(t, n);
      break;
    case "style":
      Ls(t, n);
      break;
    case "class":
      Ns(t, n);
      break;
    case "selected":
    case "checked":
      Ds(t, e, n);
      break;
    default:
      Fe(t, e, n);
      break;
  }
}
function qs(t, e) {
  if (je(t))
    t.attributes.value === void 0 && (t.value = e);
  else if (Lt(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((n) => Ws(n, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    Bs(t, e);
  else if (t.tagName === "OPTION")
    Fe(t, "value", e);
  else {
    if (t.value === e && (typeof e != "object" || e === null))
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function Ns(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = De(t, e);
}
function Ls(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = Wt(t, e);
}
function Ds(t, e, n) {
  Fe(t, e, n), js(t, e, n);
}
function Fe(t, e, n) {
  [null, void 0, !1].includes(n) && Us(e) ? t.removeAttribute(e) : (ti(e) && (n = e), zs(n) && (n = JSON.stringify(n)), Fs(t, e, n));
}
function Fs(t, e, n) {
  t.getAttribute(e) != n && t.setAttribute(e, n);
}
function js(t, e, n) {
  t[e] !== n && (t[e] = n);
}
function Bs(t, e) {
  const n = [].concat(e).map((i) => i + "");
  Array.from(t.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Hs(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function Ws(t, e) {
  return t == e;
}
function $t(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var Ks = /* @__PURE__ */ new Set([
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
function ti(t) {
  return Ks.has(t);
}
function Us(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function zs(t) {
  return typeof t == "object" && t !== null;
}
function Vs(t, e, n) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : ei(t, e, n);
}
function Js(t, e, n, i = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let s = t._x_inlineBindings[e];
    return s.extract = i, $n(() => j(t, s.expression));
  }
  return ei(t, e, n);
}
function ei(t, e, n) {
  let i = t.getAttribute(e);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : ti(e) ? !![e, "true"].includes(i) : i;
}
function Lt(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function je(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function ni(t, e) {
  let n;
  return function() {
    const i = this, s = arguments, r = function() {
      n = null, t.apply(i, s);
    };
    clearTimeout(n), n = setTimeout(r, e);
  };
}
function ii(t, e) {
  let n;
  return function() {
    let i = this, s = arguments;
    n || (t.apply(i, s), n = !0, setTimeout(() => n = !1, e));
  };
}
function si({ get: t, set: e }, { get: n, set: i }) {
  let s = !0, r, a = Y(() => {
    let o = t(), d = n();
    if (s)
      i(Yt(o)), s = !1;
    else {
      let l = JSON.stringify(o), c = JSON.stringify(d);
      l !== r ? i(Yt(o)) : l !== c && e(Yt(d));
    }
    r = JSON.stringify(t()), JSON.stringify(n());
  });
  return () => {
    rt(a);
  };
}
function Yt(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function Ys(t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => n(ot));
}
var C = {}, tn = !1;
function Qs(t, e) {
  if (tn || (C = st(C), tn = !0), e === void 0)
    return C[t];
  C[t] = e, typeof e == "object" && e !== null && e._x_interceptor ? C[t] = e.initialize(C, t, t, () => {
  }) : $e(C[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && C[t].init();
}
function Zs() {
  return C;
}
var ri = {};
function Gs(t, e) {
  let n = typeof e != "function" ? () => e : e;
  return t instanceof Element ? ai(t, n()) : (ri[t] = n, () => {
  });
}
function Xs(t) {
  return Object.entries(ri).forEach(([e, n]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), t;
}
function ai(t, e, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let s = Object.entries(e).map(([a, o]) => ({ name: a, value: o })), r = In(s);
  return s = s.map((a) => r.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), Re(t, s, n).map((a) => {
    i.push(a.runCleanups), a();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var oi = {};
function tr(t, e) {
  oi[t] = e;
}
function er(t, e) {
  return Object.entries(oi).forEach(([n, i]) => {
    Object.defineProperty(t, n, {
      get() {
        return (...s) => i.bind(e)(...s);
      },
      enumerable: !1
    });
  }), t;
}
var nr = {
  get reactive() {
    return st;
  },
  get release() {
    return rt;
  },
  get effect() {
    return Y;
  },
  get raw() {
    return mn;
  },
  get transaction() {
    return Ui;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Qi,
  dontAutoEvaluateFunctions: $n,
  disableEffectScheduling: Hi,
  startObservingMutations: Te,
  stopObservingMutations: An,
  setReactivityEngine: Wi,
  onAttributeRemoved: Sn,
  onAttributesAdded: wn,
  closestDataStack: H,
  skipDuringClone: N,
  onlyDuringClone: $s,
  addRootSelector: zn,
  addInitSelector: Vn,
  setErrorHandler: ns,
  interceptClone: Kt,
  addScopeToNode: kt,
  deferMutations: Yi,
  mapAttributes: Ie,
  evaluateLater: w,
  interceptInit: ys,
  initInterceptors: $e,
  injectMagics: vt,
  setEvaluator: ss,
  setRawEvaluator: rs,
  mergeProxies: W,
  extractProp: Js,
  findClosest: P,
  onElRemoved: Ae,
  closestRoot: Ht,
  destroyTree: Q,
  interceptor: Tn,
  // INTERNAL: not public API and is subject to change without major release.
  transition: be,
  // INTERNAL
  setStyles: Wt,
  // INTERNAL
  mutateDom: m,
  directive: v,
  entangle: si,
  throttle: ii,
  debounce: ni,
  evaluate: j,
  evaluateRaw: cs,
  initTree: R,
  nextTick: Le,
  prefixed: at,
  prefix: fs,
  plugin: Ys,
  magic: A,
  store: Qs,
  start: vs,
  clone: Rs,
  // INTERNAL
  cloneNode: Ps,
  // INTERNAL
  bound: Vs,
  $data: kn,
  watch: vn,
  walk: K,
  data: tr,
  bind: Gs
}, ot = nr;
function ir(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(","))
    e[n] = 1;
  return (n) => n in e;
}
var xt = Object.assign, sr = Object.prototype.hasOwnProperty, me = (t, e) => sr.call(t, e), wt = Array.isArray, ht = (t) => di(t) === "[object Map]", rr = (t) => typeof t == "string", Ot = (t) => typeof t == "symbol", St = (t) => t !== null && typeof t == "object", ar = Object.prototype.toString, di = (t) => ar.call(t), li = (t) => di(t).slice(8, -1), Be = (t) => rr(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, or = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, dr = or((t) => t.charAt(0).toUpperCase() + t.slice(1)), D = (t, e) => !Object.is(t, e);
function U(t, ...e) {
  console.warn(`[Vue warn] ${t}`, ...e);
}
var p, Qt = /* @__PURE__ */ new WeakSet(), en = class {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Qt.has(this) && (Qt.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || lr(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, nn(this), ui(this);
    const t = p, e = E;
    p = this, E = !0;
    try {
      return this.fn();
    } finally {
      p !== this && U(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), fi(this), p = t, E = e, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Ke(t);
      this.deps = this.depsTail = void 0, nn(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Qt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ve(this) && this.run();
  }
  get dirty() {
    return ve(this);
  }
}, ci = 0, bt, gt;
function lr(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = gt, gt = t;
    return;
  }
  t.next = bt, bt = t;
}
function He() {
  ci++;
}
function We() {
  if (--ci > 0)
    return;
  if (gt) {
    let e = gt;
    for (gt = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; bt; ) {
    let e = bt;
    for (bt = void 0; e; ) {
      const n = e.next;
      if (e.next = void 0, e.flags &= -9, e.flags & 1)
        try {
          e.trigger();
        } catch (i) {
          t || (t = i);
        }
      e = n;
    }
  }
  if (t)
    throw t;
}
function ui(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function fi(t) {
  let e, n = t.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), Ke(i), ur(i)) : e = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  t.deps = e, t.depsTail = n;
}
function ve(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (cr(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function cr(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === Dt) || (t.globalVersion = Dt, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !ve(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = p, i = E;
  p = t, E = !0;
  try {
    ui(t);
    const s = t.fn(t._value);
    (e.version === 0 || D(s, t._value)) && (t.flags |= 128, t._value = s, e.version++);
  } catch (s) {
    throw e.version++, s;
  } finally {
    p = n, E = i, fi(t), t.flags &= -3;
  }
}
function Ke(t, e = !1) {
  const { dep: n, prevSub: i, nextSub: s } = t;
  if (i && (i.nextSub = s, t.prevSub = void 0), s && (s.prevSub = i, t.nextSub = void 0), n.subsHead === t && (n.subsHead = s), n.subs === t && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Ke(r, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function ur(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
function fr(t, e) {
  t.effect instanceof en && (t = t.effect.fn);
  const n = new en(t);
  e && xt(n, e);
  try {
    n.run();
  } catch (s) {
    throw n.stop(), s;
  }
  const i = n.run.bind(n);
  return i.effect = n, i;
}
function pr(t) {
  t.effect.stop();
}
var E = !0, pi = [];
function hr() {
  pi.push(E), E = !1;
}
function br() {
  const t = pi.pop();
  E = t === void 0 ? !0 : t;
}
function nn(t) {
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
var Dt = 0, gr = class {
  constructor(t, e) {
    this.sub = t, this.dep = e, this.version = e.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, mr = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!p || !E || p === this.computed)
      return;
    let e = this.activeLink;
    if (e === void 0 || e.sub !== p)
      e = this.activeLink = new gr(p, this), p.deps ? (e.prevDep = p.depsTail, p.depsTail.nextDep = e, p.depsTail = e) : p.deps = p.depsTail = e, hi(e);
    else if (e.version === -1 && (e.version = this.version, e.nextDep)) {
      const n = e.nextDep;
      n.prevDep = e.prevDep, e.prevDep && (e.prevDep.nextDep = n), e.prevDep = p.depsTail, e.nextDep = void 0, p.depsTail.nextDep = e, p.depsTail = e, p.deps === e && (p.deps = n);
    }
    return p.onTrack && p.onTrack(
      xt(
        {
          effect: p
        },
        t
      )
    ), e;
  }
  trigger(t) {
    this.version++, Dt++, this.notify(t);
  }
  notify(t) {
    He();
    try {
      for (let e = this.subsHead; e; e = e.nextSub)
        e.sub.onTrigger && !(e.sub.flags & 8) && e.sub.onTrigger(
          xt(
            {
              effect: e.sub
            },
            t
          )
        );
      for (let e = this.subs; e; e = e.prevSub)
        e.sub.notify() && e.sub.dep.notify();
    } finally {
      We();
    }
  }
};
function hi(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let i = e.deps; i; i = i.nextDep)
        hi(i);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subsHead === void 0 && (t.dep.subsHead = t), t.dep.subs = t;
  }
}
var _e = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ Symbol(
  "Object iterate"
), ye = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), Et = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function S(t, e, n) {
  if (E && p) {
    let i = _e.get(t);
    i || _e.set(t, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new mr()), s.map = i, s.key = n), s.track({
      target: t,
      type: e,
      key: n
    });
  }
}
function I(t, e, n, i, s, r) {
  const a = _e.get(t);
  if (!a) {
    Dt++;
    return;
  }
  const o = (d) => {
    d && d.trigger({
      target: t,
      type: e,
      key: n,
      newValue: i,
      oldValue: s,
      oldTarget: r
    });
  };
  if (He(), e === "clear")
    a.forEach(o);
  else {
    const d = wt(t), l = d && Be(n);
    if (d && n === "length") {
      const c = Number(i);
      a.forEach((u, b) => {
        (b === "length" || b === Et || !Ot(b) && b >= c) && o(u);
      });
    } else
      switch ((n !== void 0 || a.has(void 0)) && o(a.get(n)), l && o(a.get(Et)), e) {
        case "add":
          d ? l && o(a.get("length")) : (o(a.get(B)), ht(t) && o(a.get(ye)));
          break;
        case "delete":
          d || (o(a.get(B)), ht(t) && o(a.get(ye)));
          break;
        case "set":
          ht(t) && o(a.get(B));
          break;
      }
  }
  We();
}
function X(t) {
  const e = h(t);
  return e === t ? e : (S(e, "iterate", Et), V(t) ? e : e.map(J));
}
function Ue(t) {
  return S(t = h(t), "iterate", Et), t;
}
function k(t, e) {
  return z(t) ? xi(t) ? At(J(e)) : At(e) : J(e);
}
var vr = {
  __proto__: null,
  [Symbol.iterator]() {
    return Zt(this, Symbol.iterator, (t) => k(this, t));
  },
  concat(...t) {
    return X(this).concat(
      ...t.map((e) => wt(e) ? X(e) : e)
    );
  },
  entries() {
    return Zt(this, "entries", (t) => (t[1] = k(this, t[1]), t));
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
      (n) => n.map((i) => k(this, i)),
      arguments
    );
  },
  find(t, e) {
    return M(
      this,
      "find",
      t,
      e,
      (n) => k(this, n),
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
      (n) => k(this, n),
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
    return Gt(this, "includes", t);
  },
  indexOf(...t) {
    return Gt(this, "indexOf", t);
  },
  join(t) {
    return X(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Gt(this, "lastIndexOf", t);
  },
  map(t, e) {
    return M(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return ct(this, "pop");
  },
  push(...t) {
    return ct(this, "push", t);
  },
  reduce(t, ...e) {
    return sn(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return sn(this, "reduceRight", t, e);
  },
  shift() {
    return ct(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return M(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return ct(this, "splice", t);
  },
  toReversed() {
    return X(this).toReversed();
  },
  toSorted(t) {
    return X(this).toSorted(t);
  },
  toSpliced(...t) {
    return X(this).toSpliced(...t);
  },
  unshift(...t) {
    return ct(this, "unshift", t);
  },
  values() {
    return Zt(this, "values", (t) => k(this, t));
  }
};
function Zt(t, e, n) {
  const i = Ue(t), s = i[e]();
  return i !== t && !V(t) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.done || (r.value = n(r.value)), r;
  }), s;
}
var _r = Array.prototype;
function M(t, e, n, i, s, r) {
  const a = Ue(t), o = a !== t && !V(t), d = a[e];
  if (d !== _r[e]) {
    const u = d.apply(t, r);
    return o ? J(u) : u;
  }
  let l = n;
  a !== t && (o ? l = function(u, b) {
    return n.call(this, k(t, u), b, t);
  } : n.length > 2 && (l = function(u, b) {
    return n.call(this, u, b, t);
  }));
  const c = d.call(a, l, i);
  return o && s ? s(c) : c;
}
function sn(t, e, n, i) {
  const s = Ue(t), r = s !== t && !V(t);
  let a = n, o = !1;
  s !== t && (r ? (o = i.length === 0, a = function(l, c, u) {
    return o && (o = !1, l = k(t, l)), n.call(this, l, k(t, c), u, t);
  }) : n.length > 3 && (a = function(l, c, u) {
    return n.call(this, l, c, u, t);
  }));
  const d = s[e](a, ...i);
  return o ? k(t, d) : d;
}
function Gt(t, e, n) {
  const i = h(t);
  S(i, "iterate", Et);
  const s = i[e](...n);
  return (s === -1 || s === !1) && Rr(n[0]) ? (n[0] = h(n[0]), i[e](...n)) : s;
}
function ct(t, e, n = []) {
  hr(), He();
  const i = h(t)[e].apply(t, n);
  return We(), br(), i;
}
var yr = /* @__PURE__ */ ir("__proto__,__v_isRef,__isVue"), bi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(Ot)
);
function xr(t) {
  Ot(t) || (t = String(t));
  const e = h(this);
  return S(e, "has", t), e.hasOwnProperty(t);
}
var gi = class {
  constructor(t = !1, e = !1) {
    this._isReadonly = t, this._isShallow = e;
  }
  get(t, e, n) {
    if (e === "__v_skip")
      return t.__v_skip;
    const i = this._isReadonly, s = this._isShallow;
    if (e === "__v_isReactive")
      return !i;
    if (e === "__v_isReadonly")
      return i;
    if (e === "__v_isShallow")
      return s;
    if (e === "__v_raw")
      return n === (i ? s ? $r : _i : s ? Cr : vi).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const r = wt(t);
    if (!i) {
      let o;
      if (r && (o = vr[e]))
        return o;
      if (e === "hasOwnProperty")
        return xr;
    }
    const a = Reflect.get(
      t,
      e,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      mt(t) ? t : n
    );
    if ((Ot(e) ? bi.has(e) : yr(e)) || (i || S(t, "get", e), s))
      return a;
    if (mt(a)) {
      const o = r && Be(e) ? a : a.value;
      return i && St(o) ? xe(o) : o;
    }
    return St(a) ? i ? xe(a) : ze(a) : a;
  }
}, wr = class extends gi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, e, n, i) {
    let s = t[e];
    const r = wt(t) && Be(e);
    if (!this._isShallow) {
      const d = z(s);
      if (!V(n) && !z(n) && (s = h(s), n = h(n)), !r && mt(s) && !mt(n))
        return d ? (U(
          `Set operation on key "${String(e)}" failed: target is readonly.`,
          t[e]
        ), !0) : (s.value = n, !0);
    }
    const a = r ? Number(e) < t.length : me(t, e), o = Reflect.set(
      t,
      e,
      n,
      mt(t) ? t : i
    );
    return t === h(i) && o && (a ? D(n, s) && I(t, "set", e, n, s) : I(t, "add", e, n)), o;
  }
  deleteProperty(t, e) {
    const n = me(t, e), i = t[e], s = Reflect.deleteProperty(t, e);
    return s && n && I(t, "delete", e, void 0, i), s;
  }
  has(t, e) {
    const n = Reflect.has(t, e);
    return (!Ot(e) || !bi.has(e)) && S(t, "has", e), n;
  }
  ownKeys(t) {
    return S(
      t,
      "iterate",
      wt(t) ? "length" : B
    ), Reflect.ownKeys(t);
  }
}, Sr = class extends gi {
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
}, Er = /* @__PURE__ */ new wr(), Ar = /* @__PURE__ */ new Sr(), Tt = (t) => Reflect.getPrototypeOf(t);
function kr(t, e, n) {
  return function(...i) {
    const s = this.__v_raw, r = h(s), a = ht(r), o = t === "entries" || t === Symbol.iterator && a, d = t === "keys" && a, l = s[t](...i), c = e ? At : J;
    return !e && S(
      r,
      "iterate",
      d ? ye : B
    ), xt(
      // inheriting all iterator properties
      Object.create(l),
      {
        // iterator protocol
        next() {
          const { value: u, done: b } = l.next();
          return b ? { value: u, done: b } : {
            value: o ? [c(u[0]), c(u[1])] : c(u),
            done: b
          };
        }
      }
    );
  };
}
function Mt(t) {
  return function(...e) {
    {
      const n = e[0] ? `on key "${e[0]}" ` : "";
      U(
        `${dr(t)} operation ${n}failed: target is readonly.`,
        h(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function Or(t, e) {
  const n = {
    get(s) {
      const r = this.__v_raw, a = h(r), o = h(s);
      t || (D(s, o) && S(a, "get", s), S(a, "get", o));
      const { has: d } = Tt(a), l = t ? At : J;
      if (d.call(a, s))
        return l(r.get(s));
      if (d.call(a, o))
        return l(r.get(o));
      r !== a && r.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !t && S(h(s), "iterate", B), s.size;
    },
    has(s) {
      const r = this.__v_raw, a = h(r), o = h(s);
      return t || (D(s, o) && S(a, "has", s), S(a, "has", o)), s === o ? r.has(s) : r.has(s) || r.has(o);
    },
    forEach(s, r) {
      const a = this, o = a.__v_raw, d = h(o), l = t ? At : J;
      return !t && S(d, "iterate", B), o.forEach((c, u) => s.call(r, l(c), l(u), a));
    }
  };
  return xt(
    n,
    t ? {
      add: Mt("add"),
      set: Mt("set"),
      delete: Mt("delete"),
      clear: Mt("clear")
    } : {
      add(s) {
        const r = h(this), a = Tt(r), o = h(s), d = !V(s) && !z(s) ? o : s;
        return a.has.call(r, d) || D(s, d) && a.has.call(r, s) || D(o, d) && a.has.call(r, o) || (r.add(d), I(r, "add", d, d)), this;
      },
      set(s, r) {
        !V(r) && !z(r) && (r = h(r));
        const a = h(this), { has: o, get: d } = Tt(a);
        let l = o.call(a, s);
        l ? rn(a, o, s) : (s = h(s), l = o.call(a, s));
        const c = d.call(a, s);
        return a.set(s, r), l ? D(r, c) && I(a, "set", s, r, c) : I(a, "add", s, r), this;
      },
      delete(s) {
        const r = h(this), { has: a, get: o } = Tt(r);
        let d = a.call(r, s);
        d ? rn(r, a, s) : (s = h(s), d = a.call(r, s));
        const l = o ? o.call(r, s) : void 0, c = r.delete(s);
        return d && I(r, "delete", s, void 0, l), c;
      },
      clear() {
        const s = h(this), r = s.size !== 0, a = ht(s) ? new Map(s) : new Set(s), o = s.clear();
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
    n[s] = kr(s, t);
  }), n;
}
function mi(t, e) {
  const n = Or(t);
  return (i, s, r) => s === "__v_isReactive" ? !t : s === "__v_isReadonly" ? t : s === "__v_raw" ? i : Reflect.get(
    me(n, s) && s in i ? n : i,
    s,
    r
  );
}
var Tr = {
  get: /* @__PURE__ */ mi(!1)
}, Mr = {
  get: /* @__PURE__ */ mi(!0)
};
function rn(t, e, n) {
  const i = h(n);
  if (i !== n && e.call(t, i)) {
    const s = li(t);
    U(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var vi = /* @__PURE__ */ new WeakMap(), Cr = /* @__PURE__ */ new WeakMap(), _i = /* @__PURE__ */ new WeakMap(), $r = /* @__PURE__ */ new WeakMap();
function Pr(t) {
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
function ze(t) {
  return /* @__PURE__ */ z(t) ? t : yi(
    t,
    !1,
    Er,
    Tr,
    vi
  );
}
function xe(t) {
  return yi(
    t,
    !0,
    Ar,
    Mr,
    _i
  );
}
function yi(t, e, n, i, s) {
  if (!St(t))
    return U(
      `value cannot be made ${e ? "readonly" : "reactive"}: ${String(
        t
      )}`
    ), t;
  if (t.__v_raw && !(e && t.__v_isReactive) || t.__v_skip || !Object.isExtensible(t))
    return t;
  const r = s.get(t);
  if (r)
    return r;
  const a = Pr(li(t));
  if (a === 0)
    return t;
  const o = new Proxy(
    t,
    a === 2 ? i : n
  );
  return s.set(t, o), o;
}
function xi(t) {
  return /* @__PURE__ */ z(t) ? /* @__PURE__ */ xi(t.__v_raw) : !!(t && t.__v_isReactive);
}
function z(t) {
  return !!(t && t.__v_isReadonly);
}
function V(t) {
  return !!(t && t.__v_isShallow);
}
function Rr(t) {
  return t ? !!t.__v_raw : !1;
}
function h(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ h(e) : t;
}
var J = (t) => St(t) ? /* @__PURE__ */ ze(t) : t, At = (t) => St(t) ? /* @__PURE__ */ xe(t) : t;
function mt(t) {
  return t ? t.__v_isRef === !0 : !1;
}
A("nextTick", () => Le);
A("dispatch", (t) => pt.bind(pt, t));
A("watch", (t, { evaluateLater: e, cleanup: n }) => (i, s) => {
  let r = e(i), o = vn(() => {
    let d;
    return r((l) => d = l), d;
  }, s);
  n(o);
});
A("store", Zs);
A("data", (t) => kn(t));
A("root", (t) => Ht(t));
A("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = W(Ir(t))), t._x_refs_proxy));
function Ir(t) {
  let e = [];
  return P(t, (n) => {
    n._x_refs && e.push(n._x_refs);
  }), e;
}
var Xt = {};
function wi(t) {
  return Xt[t] || (Xt[t] = 0), ++Xt[t];
}
function qr(t, e) {
  return P(t, (n) => {
    if (n._x_ids && n._x_ids[e])
      return !0;
  });
}
function Nr(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = wi(e));
}
A("id", (t, { cleanup: e }) => (n, i = null) => {
  let s = `${n}${i ? `-${i}` : ""}`;
  return Lr(t, s, e, () => {
    let r = qr(t, n), a = r ? r._x_ids[n] : wi(n);
    return i ? `${n}-${a}-${i}` : `${n}-${a}`;
  });
});
Kt((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function Lr(t, e, n, i) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let s = i();
  return t._x_id[e] = s, n(() => {
    delete t._x_id[e];
  }), s;
}
A("el", (t) => t);
Si("Focus", "focus", "focus");
Si("Persist", "persist", "persist");
function Si(t, e, n) {
  A(e, (i) => O(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
v("modelable", (t, { expression: e }, { effect: n, evaluateLater: i, cleanup: s }) => {
  let r = i(e), a = () => {
    let c;
    return r((u) => c = u), c;
  }, o = i(`${e} = __placeholder`), d = (c) => o(() => {
  }, { scope: { __placeholder: c } }), l = a();
  d(l), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let c = t._x_model.get, u = t._x_model.setWithModifiers, b = si(
      {
        get() {
          return c();
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
    s(b);
  });
});
v("teleport", (t, { modifiers: e, expression: n }, { cleanup: i }) => {
  t.tagName.toLowerCase() !== "template" && O("x-teleport can only be used on a <template> tag", t);
  let s = an(n), r = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = r, r._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((o) => {
    r.addEventListener(o, (d) => {
      d.stopPropagation(), t.dispatchEvent(new d.constructor(d.type, d));
    });
  }), kt(r, {}, t);
  let a = (o, d, l) => {
    l.includes("prepend") ? d.parentNode.insertBefore(o, d) : l.includes("append") ? d.parentNode.insertBefore(o, d.nextSibling) : d.appendChild(o);
  };
  m(() => {
    N(() => {
      a(r, s, e), R(r);
    })();
  }), t._x_teleportPutBack = () => {
    let o = an(n);
    m(() => {
      a(t._x_teleport, o, e);
    });
  }, i(
    () => m(() => {
      r.remove(), Q(r);
    })
  );
});
var Dr = document.createElement("div");
function an(t) {
  let e = N(() => document.querySelector(t), () => Dr)();
  return e || O(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var Ei = () => {
};
Ei.inline = (t, { modifiers: e }, { cleanup: n }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
v("ignore", Ei);
v("effect", N((t, { expression: e }, { effect: n }) => {
  n(w(t, e));
}));
function et(t, e, n, i) {
  let s = t, r = (d) => i(d), a = {}, o = (d, l) => (c) => l(d, c);
  return n.includes("dot") && (e = Fr(e)), n.includes("camel") && (e = jr(e)), n.includes("capture") && (a.capture = !0), n.includes("window") && (s = window), n.includes("document") && (s = document), n.includes("passive") && (a.passive = n[n.indexOf("passive") + 1] !== "false"), r = Ai(n, r), n.includes("prevent") && (r = o(r, (d, l) => {
    l.preventDefault(), d(l);
  })), n.includes("stop") && (r = o(r, (d, l) => {
    l.stopPropagation(), d(l);
  })), n.includes("once") && (r = o(r, (d, l) => {
    d(l), s.removeEventListener(e, r, a);
  })), (n.includes("away") || n.includes("outside")) && (s = document, r = o(r, (d, l) => {
    t.contains(l.target) || l.target.isConnected !== !1 && (t.offsetWidth < 1 && t.offsetHeight < 1 || t._x_isShown !== !1 && d(l));
  })), n.includes("self") && (r = o(r, (d, l) => {
    l.target === t && d(l);
  })), e === "submit" && (r = o(r, (d, l) => {
    l.target._x_pendingModelUpdates && l.target._x_pendingModelUpdates.forEach((c) => c()), d(l);
  })), (Hr(e) || ki(e)) && (r = o(r, (d, l) => {
    Wr(l, n) || d(l);
  })), s.addEventListener(e, r, a), () => {
    s.removeEventListener(e, r, a);
  };
}
function Ai(t, e) {
  if (t.includes("debounce")) {
    let n = t[t.indexOf("debounce") + 1] || "invalid-wait", i = Ft(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = ni(e, i);
  }
  if (t.includes("throttle")) {
    let n = t[t.indexOf("throttle") + 1] || "invalid-wait", i = Ft(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    e = ii(e, i);
  }
  return e;
}
function Fr(t) {
  return t.replace(/-/g, ".");
}
function jr(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function Ft(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Br(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Hr(t) {
  return ["keydown", "keyup"].includes(t);
}
function ki(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function Wr(t, e) {
  let n = e.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(r));
  if (n.includes("debounce")) {
    let r = n.indexOf("debounce");
    n.splice(r, Ft((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let r = n.indexOf("throttle");
    n.splice(r, Ft((n[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && on(t.key).includes(n[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => n.includes(r));
  return n = n.filter((r) => !s.includes(r)), !(s.length > 0 && s.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), t[`${a}Key`])).length === s.length && (ki(t.type) || on(t.key).includes(n[0])));
}
function on(t) {
  if (!t)
    return [];
  t = Br(t);
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
v("model", (t, { modifiers: e, expression: n }, { effect: i, cleanup: s }) => {
  let r = t;
  e.includes("parent") && (r = P(t, (f) => f !== t));
  let a = w(r, n), o;
  typeof n == "string" ? o = w(r, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = w(r, `${n()} = __placeholder`) : o = () => {
  };
  let d = () => {
    let f;
    return a((_) => f = _), dn(f) ? f.get() : f;
  }, l = (f) => {
    let _;
    a((y) => _ = y), dn(_) ? _.set(f) : o(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && t.type === "radio" && m(() => {
    t.hasAttribute("name") || t.setAttribute("name", n);
  });
  let c = e.includes("change") || e.includes("lazy"), u = e.includes("blur"), b = e.includes("enter"), g = c || u || b, T;
  if (q)
    T = () => {
    };
  else if (g) {
    let f = [], _ = (y) => l(Ct(t, e, y, d()));
    if (c && f.push(et(t, "change", e, _)), u && (f.push(et(t, "blur", e, _)), t.form)) {
      let y = t.form, G = () => _({ target: t });
      y._x_pendingModelUpdates || (y._x_pendingModelUpdates = []), y._x_pendingModelUpdates.push(G), s(() => {
        y._x_pendingModelUpdates && y._x_pendingModelUpdates.splice(y._x_pendingModelUpdates.indexOf(G), 1);
      });
    }
    b && f.push(et(t, "keydown", e, (y) => {
      y.key === "Enter" && _(y);
    })), T = () => f.forEach((y) => y());
  } else {
    let f = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) ? "change" : "input";
    T = et(t, f, e, (_) => {
      l(Ct(t, e, _, d()));
    });
  }
  if (e.includes("fill") && ([void 0, null, ""].includes(d()) || Lt(t) && Array.isArray(d()) || t.tagName.toLowerCase() === "select" && t.multiple) && l(
    Ct(t, e, { target: t }, d())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = T, s(() => t._x_removeModelListeners.default()), t.form) {
    let f = et(t.form, "reset", [], (_) => {
      Le(() => t._x_model && t._x_model.set(Ct(t, e, { target: t }, d())));
    });
    s(() => f());
  }
  if (t._x_model = {
    get() {
      return d();
    },
    set(f) {
      l(f);
    },
    setWithModifiers: Ai(e, l)
  }, t._x_forceModelUpdate = (f) => {
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), m(() => {
      Lt(t) ? Array.isArray(f) ? t.checked = f.some((_) => _ == t.value) : t.checked = !!f : je(t) ? typeof f == "boolean" ? t.checked = $t(t.value) === f : t.checked = t.value == f : Xn(t, "value", f);
    });
  }, t.tagName === "SELECT") {
    let f = new MutationObserver(() => {
      t._x_forceModelUpdate(d());
    });
    f.observe(t, { childList: !0 }), s(() => f.disconnect());
  }
  i(() => {
    let f = d();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function Ct(t, e, n, i) {
  return m(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Lt(t))
      if (Array.isArray(i)) {
        let s = null;
        return e.includes("number") ? s = te(n.target.value) : e.includes("boolean") ? s = $t(n.target.value) : s = n.target.value, n.target.checked ? i.includes(s) ? i : i.concat([s]) : i.filter((r) => !Kr(r, s));
      } else
        return n.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return te(r);
        }) : e.includes("boolean") ? Array.from(n.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return $t(r);
        }) : Array.from(n.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return je(t) ? n.target.checked ? s = n.target.value : s = i : s = n.target.value, e.includes("number") ? te(s) : e.includes("boolean") ? $t(s) : e.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function te(t) {
  let e = t ? parseFloat(t) : null;
  return Ur(e) ? e : t;
}
function Kr(t, e) {
  return t == e;
}
function Ur(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function dn(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
v("cloak", (t) => queueMicrotask(() => m(() => t.removeAttribute(at("cloak")))));
Vn(() => `[${at("init")}]`);
v("init", N((t, { expression: e }, { evaluate: n }) => typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)));
v("text", (t, { expression: e }, { effect: n, evaluateLater: i }) => {
  let s = i(e);
  n(() => {
    s((r) => {
      m(() => {
        t.textContent = r;
      });
    });
  });
});
v("html", (t, { expression: e }, { effect: n, evaluateLater: i }) => {
  let s = i(e);
  n(() => {
    s((r) => {
      m(() => {
        Array.from(t.children).forEach((a) => Q(a)), t.innerHTML = r ?? "", t._x_ignoreSelf = !0, R(t), delete t._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
Ie(Ln(":", Dn(at("bind:"))));
var Oi = (t, { value: e, modifiers: n, expression: i, original: s }, { effect: r, cleanup: a }) => {
  if (!e) {
    let d = {};
    Xs(d), w(t, i)((c) => {
      ai(t, c, s);
    }, { scope: d });
    return;
  }
  if (e === "key")
    return zr(t, i);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let o = w(t, i);
  r(() => o((d) => {
    d === void 0 && typeof i == "string" && i.match(/\./) && (d = ""), m(() => Xn(t, e, d, n));
  })), a(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
Oi.inline = (t, { value: e, modifiers: n, expression: i }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: i, extract: !1 });
};
v("bind", Oi);
function zr(t, e) {
  t._x_keyExpression = e;
}
zn(() => `[${at("data")}]`);
var L = /* @__PURE__ */ Symbol();
v("data", (t, { expression: e }, { cleanup: n }) => {
  if (Jr(t))
    return;
  let i = t[L];
  if (i?.expression === e)
    return;
  e = e === "" ? "{}" : e;
  let s = {};
  vt(s, t);
  let r = {};
  er(r, s);
  let a = j(t, e, { scope: r });
  (a === void 0 || a === !0) && (a = {}), vt(a, t);
  let o;
  if (i?.reactiveData) {
    o = i.reactiveData, Vr(o, a);
    let l = { expression: e };
    t[L] = l, queueMicrotask(() => {
      t[L] === l && delete t[L];
    });
  } else
    o = st(a);
  $e(o, n);
  let d = kt(t, o);
  o.init && j(t, o.init), n(() => {
    o.destroy && j(t, o.destroy), d();
    let l = { reactiveData: o };
    t[L] = l, queueMicrotask(() => {
      t[L] === l && delete t[L];
    });
  });
});
function Vr(t, e) {
  Object.keys(e).forEach((n) => {
    let i = Object.getOwnPropertyDescriptor(e, n), s = Object.getOwnPropertyDescriptor(t, n);
    i.get || i.set || s?.get || s?.set ? (s && delete t[n], s || (t[n] = void 0), i.get || i.set ? Object.defineProperty(t, n, i) : t[n] = e[n]) : t[n] = e[n];
  }), Object.keys(t).filter((n) => !Object.prototype.hasOwnProperty.call(e, n)).forEach((n) => delete t[n]);
}
Kt((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function Jr(t) {
  return q ? ge ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
v("show", (t, { modifiers: e, expression: n }, { effect: i }) => {
  let s = w(t, n);
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
  }, o = () => setTimeout(a), d = he(
    (u) => u ? a() : r(),
    (u) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, u, a, r) : u ? o() : r();
    }
  ), l, c = !0;
  i(() => s((u) => {
    !c && u === l || (e.includes("immediate") && (u ? o() : r()), d(u), l = u, c = !1);
  }));
});
v("for", N((t, { expression: e }, { effect: n, cleanup: i }) => {
  let s = Zr(e), r = w(t, s.items), a = w(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_lookup = /* @__PURE__ */ new Map(), n(() => Qr(t, s, r, a), { priority: "structural" }), i(() => {
    t._x_lookup.forEach(
      (o) => m(() => {
        Q(o), o.remove();
      })
    ), delete t._x_lookup, delete t._x_lastRenderedEl;
  });
}));
function Yr(t) {
  return (e) => {
    Object.entries(e).forEach(([n, i]) => {
      t[n] = i;
    });
  };
}
function Qr(t, e, n, i) {
  n((s) => {
    Xr(s) && (s = Array.from({ length: s }, (l, c) => c + 1)), s == null && (s = []), s instanceof Set && (s = Array.from(s)), s instanceof Map && (s = Array.from(s));
    let r = t._x_lookup, a = /* @__PURE__ */ new Map();
    t._x_lookup = a;
    let o = ta(s), d = Object.entries(s).map(([l, c]) => {
      o || (l = parseInt(l));
      let u = Gr(e, c, l, s), b;
      return i((g) => {
        typeof g == "object" && O("x-for key cannot be an object, it must be a string or an integer", t), r.has(g) && (a.set(g, r.get(g)), r.delete(g)), b = g;
      }, { scope: { index: l, ...u } }), [b, u];
    });
    m(() => {
      r.forEach((u) => {
        Q(u), u.remove();
      });
      let l = /* @__PURE__ */ new Set(), c = t;
      d.forEach(([u, b]) => {
        if (a.has(u)) {
          let f = a.get(u);
          f._x_refreshXForScope(b), c.nextElementSibling !== f && (c.nextElementSibling && f.replaceWith(c.nextElementSibling), c.after(f)), c = f, f._x_currentIfEl && (f.nextElementSibling !== f._x_currentIfEl && c.after(f._x_currentIfEl), c = f._x_currentIfEl);
          return;
        }
        t.content.children.length > 1 && O("x-for templates require a single root element, additional elements will be ignored.", t);
        let g = document.importNode(t.content, !0).firstElementChild, T = st(b);
        kt(g, T, t), g._x_refreshXForScope = Yr(T), a.set(u, g), l.add(g), c.after(g), c = g;
      }), l.forEach((u) => R(u)), c !== t ? t._x_lastRenderedEl = c : delete t._x_lastRenderedEl;
    });
  });
}
function Zr(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = t.match(i);
  if (!s)
    return;
  let r = {};
  r.items = s[2].trim();
  let a = s[1].replace(n, "").trim(), o = a.match(e);
  return o ? (r.item = a.replace(e, "").trim(), r.index = o[1].trim(), o[2] && (r.collection = o[2].trim())) : r.item = a, r;
}
function Gr(t, e, n, i) {
  let s = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    s[a] = e[o];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    s[a] = e[a];
  }) : s[t.item] = e, t.index && (s[t.index] = n), t.collection && (s[t.collection] = i), s;
}
function Xr(t) {
  return typeof t != "object" && !isNaN(t);
}
function ta(t) {
  return typeof t == "object" && !Array.isArray(t);
}
function Ti() {
}
Ti.inline = (t, { expression: e }, { cleanup: n }) => {
  let i = Ht(t);
  i && (i._x_refs || (i._x_refs = {}), i._x_refs[e] = t, n(() => delete i._x_refs[e]));
};
v("ref", Ti);
v("if", N((t, { expression: e }, { effect: n, cleanup: i }) => {
  t.tagName.toLowerCase() !== "template" && O("x-if can only be used on a <template> tag", t);
  let s = w(t, e), r = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let o = t.content.cloneNode(!0).firstElementChild;
    return kt(o, {}, t), m(() => {
      t.after(o), R(o);
    }), t._x_currentIfEl = o, t._x_lastRenderedEl = o, t._x_undoIf = () => {
      m(() => {
        Q(o), o.remove();
      }), delete t._x_currentIfEl, delete t._x_lastRenderedEl;
    }, o;
  }, a = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  n(() => s((o) => {
    o ? r() : a();
  }), { priority: "structural" }), i(() => t._x_undoIf && t._x_undoIf());
}));
v("id", (t, { expression: e }, { evaluate: n }) => {
  n(e).forEach((s) => Nr(t, s));
});
Kt((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
Ie(Ln("@", Dn(at("on:"))));
v("on", N((t, { value: e, modifiers: n, expression: i }, { cleanup: s }) => {
  let r = i ? w(t, i) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let a = et(t, e, n, (o) => {
    r(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  s(() => a());
}));
Ut("Collapse", "collapse", "collapse");
Ut("Intersect", "intersect", "intersect");
Ut("Focus", "trap", "focus");
Ut("Mask", "mask", "mask");
function Ut(t, e, n) {
  v(e, (i) => O(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
ot.setEvaluator(as);
ot.setRawEvaluator(us);
ot.setReactivityEngine({
  reactive: ze,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (t, e = {}) => {
    let n;
    return n = fr(t, {
      scheduler: () => {
        n && (e.scheduler ? e.scheduler(n) : n());
      }
    }), n;
  },
  release: pr,
  raw: h
});
var ea = ot, Pt = ea;
function na(t) {
  const e = window.__siteationDebugBar;
  return e ? (e.onRequest = t, e.requests.slice()) : [];
}
const jt = "__siteationDebugBarHostLock";
function ia(t) {
  if (!t || window[jt]) return;
  const e = document.body, n = Math.max(0, window.innerWidth - document.documentElement.clientWidth), i = {
    overflow: e.style.overflow,
    paddingRight: e.style.paddingRight,
    inert: []
  };
  if (Array.from(e.children).forEach((s) => {
    s === t || s.contains(t) || !(s instanceof HTMLElement) || s.matches("script, style, link") || (i.inert.push([s, s.inert]), s.inert = !0);
  }), e.style.overflow = "hidden", n > 0) {
    const s = Number.parseFloat(window.getComputedStyle(e).paddingRight || "0");
    e.style.paddingRight = `${s + n}px`;
  }
  window[jt] = i;
}
function sa() {
  const t = window[jt];
  t && (t.inert.forEach(([e, n]) => {
    e.inert = n;
  }), document.body.style.overflow = t.overflow, document.body.style.paddingRight = t.paddingRight, delete window[jt]);
}
function ra(t, e) {
  if (t.key !== "Tab" || !e) return;
  const n = Array.from(e.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((a) => a.offsetParent !== null);
  if (n.length === 0) return;
  const i = n[0], s = n[n.length - 1], r = e.getRootNode().activeElement;
  t.shiftKey && r === i ? (t.preventDefault(), s.focus()) : !t.shiftKey && r === s && (t.preventDefault(), i.focus());
}
const ln = [
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
function aa(t, e) {
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
    case "alpine":
      return e.alpineComponents.length || null;
    default:
      return null;
  }
}
const it = "full", Ve = "masked", Z = "none", oa = "[redacted]", da = "[masked]", la = "[maximum depth reached]", ca = "[circular]", ua = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, fa = 5, Rt = 100, cn = 400;
function pa(t) {
  return [it, Ve, Z].includes(t) ? t : it;
}
function ha(t) {
  return ua.test(String(t));
}
function Mi(t, e = it) {
  if (e !== Z)
    return Je(t, e, 0, /* @__PURE__ */ new WeakSet());
}
function we(t, e = it) {
  return e === Z ? "" : e === Ve ? t === "" ? "" : da : t.length <= cn ? t : `${t.slice(0, cn)}...`;
}
function ba(t, e = it) {
  if (e === Z) return "";
  const n = t.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return we(n, e === Ve ? it : e);
}
function Je(t, e, n, i) {
  if (t == null) return t;
  const s = typeof t;
  return s === "string" ? we(t, e) : s === "number" || s === "boolean" ? t : s === "function" ? `ƒ ${t.name || "anonymous"}()` : s === "symbol" ? t.toString() : s === "bigint" ? `${t}n` : s !== "object" ? s : t instanceof Node ? va(t) : t instanceof Date ? t.toISOString() : t instanceof Error ? `${t.name}: ${we(t.message, e)}` : t instanceof Map ? `Map(${t.size})` : t instanceof Set ? `Set(${t.size})` : n >= fa ? la : i.has(t) ? ca : (i.add(t), Array.isArray(t) ? ga(t, e, n, i) : ma(t, e, n, i));
}
function ga(t, e, n, i) {
  const s = t.slice(0, Rt).map((r) => Je(r, e, n + 1, i));
  return t.length > Rt && s.push(`[${t.length - Rt} more]`), s;
}
function ma(t, e, n, i) {
  const s = Ye(t), r = {};
  let a = 0;
  for (const o of s) {
    if (a >= Rt) {
      r.__truncated__ = s.length - a;
      break;
    }
    if (ha(o)) {
      r[o] = oa, a++;
      continue;
    }
    try {
      r[o] = Je(t[o], e, n + 1, i);
    } catch (d) {
      r[o] = `[unreadable: ${d && d.message ? d.message : "threw"}]`;
    }
    a++;
  }
  return r;
}
function Ye(t) {
  try {
    const e = Object.keys(t);
    return e.length > 0 ? e : Reflect.ownKeys(t).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function va(t) {
  if (!(t instanceof Element)) return `<${t.nodeName.toLowerCase()}>`;
  const e = t.id ? `#${t.id}` : "", n = typeof t.className == "string" && t.className.trim() ? `.${t.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${t.tagName.toLowerCase()}${e}${n}>`;
}
const ee = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map();
let un = 0;
function zt() {
  const t = ie || window.Alpine;
  return !t || typeof t != "object" || t === Pt ? null : t;
}
function Ci(t) {
  try {
    return typeof t.prefixed == "function" ? t.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function Se(t) {
  const e = console.warn;
  try {
    return console.warn = () => {
    }, t();
  } catch {
    return;
  } finally {
    console.warn = e;
  }
}
function _a(t) {
  if (typeof t.evaluate != "function") return null;
  const e = Se(() => t.evaluate(document.body, "1"));
  return e === 1 ? !1 : e === void 0 ? !0 : null;
}
function fn() {
  return Array.from(document.scripts).map((t) => t.src).filter((t) => /alpine/i.test(t)).map((t) => t.split("/").pop().split("?")[0]).join(", ");
}
function ya(t) {
  if (typeof t.injectMagics == "function") {
    const e = Se(() => {
      const n = {};
      return t.injectMagics(n, document.body), n.$store;
    });
    if (e && typeof e == "object") return e;
  }
  if (typeof t.evaluate == "function") {
    const e = Se(() => t.evaluate(document.body, "$store"));
    if (e && typeof e == "object") return e;
  }
  return null;
}
function xa(t) {
  const e = t.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return e ? e[1] : "inline";
}
function wa(t) {
  if (t.id) return `#${t.id}`;
  const e = [];
  let n = t;
  for (; n && n !== document.body && e.length < 4; ) {
    const i = n.parentElement, s = n.tagName.toLowerCase();
    if (n.id) {
      e.unshift(`#${n.id}`);
      break;
    }
    if (i) {
      const r = Array.from(i.children).filter((a) => a.tagName === n.tagName);
      e.unshift(r.length > 1 ? `${s}:nth-of-type(${r.indexOf(n) + 1})` : s);
    } else
      e.unshift(s);
    n = i;
  }
  return e.join(" > ");
}
function Sa(t) {
  return ee.has(t) || (un += 1, ee.set(t, un)), ee.get(t);
}
function $i(t, e) {
  const n = e._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof t.$data != "function") return null;
  try {
    return t.$data(e);
  } catch {
    return null;
  }
}
function Ea(t) {
  const e = zt();
  if (Bt.clear(), !e) return [];
  const n = Ci(e), i = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((r) => {
    const a = Sa(r), o = (r.getAttribute(n) || "").trim(), d = (r.getAttribute(i) || "").trim(), l = $i(e, r);
    return Bt.set(a, r), {
      id: a,
      name: xa(o),
      expression: ba(o, t),
      path: wa(r),
      initialised: !!r._x_dataStack,
      deferred: r.hasAttribute(i),
      strategy: d || "none",
      keys: t === Z || !l ? 0 : Ye(l).length
    };
  });
}
function pn(t, e) {
  if (e === Z)
    return "The value policy is set to none, so component state is not read.";
  const n = zt(), i = Bt.get(t);
  if (!n || !i) return "This component is no longer on the page.";
  if (!i._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const s = $i(n, i);
  if (!s) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(Mi(s, e), null, 2);
  } catch (r) {
    return `Could not read this component: ${r && r.message ? r.message : "threw"}`;
  }
}
function Aa(t) {
  const e = zt();
  if (!e) return [];
  const n = ya(e);
  return n ? Object.keys(n).map((i) => {
    let s = n[i], r = 0;
    if (r = s && typeof s == "object" ? Ye(s).length : 0, t === Z)
      return { name: i, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      s = JSON.stringify(Mi(s, t), null, 2);
    } catch (a) {
      s = `Could not read this store: ${a && a.message ? a.message : "threw"}`;
    }
    return { name: i, keys: r, value: s };
  }) : [];
}
function ka() {
  const t = window.__siteationDebugBar;
  return !t || !Array.isArray(t.alpineErrors) ? [] : t.alpineErrors.map((e) => {
    const n = String(e.message || ""), i = n.match(/Expression: "([\s\S]*?)"/);
    return {
      message: n.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""),
      expression: i ? i[1] : "",
      element: String(e.element || ""),
      during_init: !!e.during_init
    };
  });
}
function Oa() {
  const t = zt();
  return t ? {
    present: !0,
    version: String(t.version || "unknown"),
    csp: _a(t),
    source: fn(),
    prefix: Ci(t)
  } : { present: !1, version: "", csp: null, source: fn(), prefix: "" };
}
function Ta(t, e) {
  const n = Bt.get(t);
  if (!(!n || !n.style)) {
    if (e) {
      ut.has(t) || ut.set(t, n.style.outline || ""), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
      return;
    }
    ut.has(t) && (n.style.outline = ut.get(t), n.style.removeProperty("outline-offset"), ut.delete(t));
  }
}
const Ma = 1e3, Pi = "siteation.debugbar.v1", Ca = "__PROFILE_ID__";
function $a() {
  const t = document.getElementById("siteation-debugbar-profile");
  if (!t) return {};
  try {
    return JSON.parse(t.textContent || "{}");
  } catch {
    return {};
  }
}
function Pa() {
  const t = { open: !1, section: "overview" };
  try {
    return { ...t, ...JSON.parse(localStorage.getItem(Pi) || "{}") };
  } catch {
    return t;
  }
}
function tt(t, e, n) {
  const i = e.trim().toLowerCase();
  return i ? t.filter((s) => n.some(
    (r) => String(s[r] ?? "").toLowerCase().includes(i)
  )) : t;
}
function Ra() {
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
    payloads: {},
    loading: !1,
    loadError: "",
    requests: [],
    activeId: null,
    pageProfile: {},
    init() {
      this.profile = $a(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const t = Pa();
      this.open = t.open, this.section = t.section, this.placement = t.placement === "top" ? "top" : "bottom", this.maximised = !!t.maximised, this.theme = ["system", "light", "dark"].includes(t.theme) ? t.theme : "system", this.favourites = Array.isArray(t.favourites) ? t.favourites.filter((e) => ln.some((n) => n.id === e)) : [], this.watchColorScheme(), this.valuePolicy = pa(this.rootElement()?.dataset.valuePolicy), this.refreshAlpine(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.open && this.$nextTick(() => this.lock()), this.requests = na((e) => {
        this.requests.some((n) => n.id === e.id) || (this.requests = [e, ...this.requests].slice(0, 25));
      }).filter((e) => e.id !== this.profile.id), this.open && this.loadPayloads();
    },
    /** @returns {HTMLElement|null} the host element, which carries the bar's settings */
    rootElement() {
      return document.getElementById("siteation-debugbar");
    },
    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(t) {
      const e = this.rootElement()?.dataset.profileUrl;
      return e ? e.replace(Ca, encodeURIComponent(t)) : null;
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
          const i = await n.json(), s = {};
          Object.entries(i.sections || {}).forEach(([r, a]) => {
            s[r] = a.payload || {};
          }), this.profile = i, this.payloads = s, this.activeId = t;
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
          const n = await e.json(), i = {};
          Object.entries(n.sections || {}).forEach(([s, r]) => {
            i[s] = r.payload || {};
          }), this.payloads = i;
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
      return tt(t, this.querySearch, ["sql"]);
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const t = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((e) => e.observer_count === 0) : this.itemsOf("events");
      return tt(t, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return tt(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      return tt(this.itemsOf("blocks"), this.blockSearch, ["name", "template", "class"]);
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
      return tt(t, this.timelineSearch, ["label", "section"]);
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
    /** @returns {Array<object>} */
    get visibleAlpineComponents() {
      const t = this.alpineTab === "deferred" ? this.alpineComponents.filter((e) => e.deferred) : this.alpineComponents;
      return tt(t, this.alpineSearch, ["name", "expression", "path"]);
    },
    /** @returns {number} */
    get alpineDeferredCount() {
      return this.alpineComponents.filter((t) => t.deferred).length;
    },
    /**
     * A deferred component that has not run yet is the usual answer to "why is nothing
     * happening", so it is worth counting on its own.
     *
     * @returns {number}
     */
    get alpinePendingCount() {
      return this.alpineComponents.filter((t) => !t.initialised).length;
    },
    /** @returns {string} */
    get alpineBuild() {
      return this.alpineHealth.csp === null ? "could not tell" : this.alpineHealth.csp ? "CSP friendly" : "standard";
    },
    /** @returns {boolean} whether the page should be re-read on a timer */
    get alpineLiveWanted() {
      return this.open && !this.dismissed && this.alpineLive && this.section === "alpine";
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
      return ln.map((t) => ({ ...t, count: aa(t.id, this) }));
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
        const i = [...this.favourites];
        i.splice(n, 0, i.splice(e, 1)[0]), this.favourites = i, this.persist();
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
      this.open && (this.open = !1, this.persist(), sa(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus());
    },
    toggle() {
      this.open ? this.closeInspector() : this.openInspector();
    },
    toggleMaximised() {
      this.maximised = !this.maximised, this.persist();
    },
    /** No control reaches this yet: the placement toggle left the header for the palette. */
    movePlacement() {
      this.placement = this.placement === "bottom" ? "top" : "bottom", this.persist();
    },
    dismiss() {
      this.closeInspector(), this.dismissed = !0;
    },
    lock() {
      ia(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(t) {
      if (t.key === "Escape") {
        this.closeInspector();
        return;
      }
      ra(t, this.$refs.sheet);
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
     * The one section whose data is not in the profile, so it is read again rather than
     * waited for.
     */
    refreshAlpine() {
      this.alpineHealth = Oa(), this.alpineComponents = Ea(this.valuePolicy), this.alpineStores = Aa(this.valuePolicy), this.alpineErrors = ka(), this.alpineExpanded.forEach((t) => {
        this.alpineStates[t] = pn(t, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, Ma);
        return;
      }
      !this.alpineLiveWanted && this.alpineTimer && (clearInterval(this.alpineTimer), this.alpineTimer = null);
    },
    /**
     * @param {number} id
     * @returns {boolean}
     */
    isAlpineExpanded(t) {
      return this.alpineExpanded.includes(t);
    },
    /**
     * State is read here rather than during the scan, because a page carries dozens of
     * components and walking all of them to fill rows nobody opened is work for nothing.
     *
     * @param {number} id
     */
    toggleAlpineComponent(t) {
      if (this.isAlpineExpanded(t)) {
        this.alpineExpanded = this.alpineExpanded.filter((e) => e !== t), delete this.alpineStates[t];
        return;
      }
      this.alpineExpanded = [...this.alpineExpanded, t], this.alpineStates[t] = pn(t, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(t, e) {
      Ta(t, e);
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
        localStorage.setItem(Pi, JSON.stringify({
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
const Ia = {
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
    aria-hidden="true">${Ia[t] || ""}</svg>`;
}
function hn({ sheet: t }) {
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
      <span class="ndb-env-dot" data-ndb-bind:class="'is-' + findingsTone"></span>
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
function bn(t, e) {
  return `
<template data-ndb-for="item in ${t}" data-ndb-bind:key="item.id">
  <div class="ndb-nav-row"
       data-ndb-bind:class="dropTargetId === item.id && 'is-drop-target'"
       ${e ? `
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
function qa() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${bn("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${bn("otherSections", !1)}
</nav>`;
}
function Na(t, e) {
  return `<div class="ndb-subtabs" role="tablist">${e.map((i) => `
  <button type="button" class="ndb-subtab" role="tab"
          data-ndb-bind:aria-selected="${t} === '${i.id}' ? 'true' : 'false'"
          data-ndb-bind:class="${t} === '${i.id}' && 'is-active'"
          data-ndb-on:click="${t} = '${i.id}'">
    <span>${i.label}</span>
    ${i.count ? `<span class="ndb-pill" data-ndb-show="${i.count}" data-ndb-text="${i.count}"></span>` : ""}
  </button>`).join("")}</div>`;
}
const La = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme">

  <div class="ndb-dock" data-ndb-show="!open && !dismissed" data-ndb-cloak>
    ${hn({ sheet: !1 })}
  </div>

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${hn({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${x("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${qa()}

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

      <div data-ndb-show="isSection('alpine')">
        <p class="ndb-note" data-ndb-show="!alpineHealth.present">
          No Alpine on this page. This section reads the page's own instance, so it has
          nothing to show until a theme loads one.
        </p>

        <div data-ndb-show="alpineHealth.present">
          ${Na("alpineTab", [
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
            <dl class="ndb-facts">
              <div><dt>Version</dt><dd data-ndb-text="alpineHealth.version"></dd></div>
              <div><dt>Build</dt><dd data-ndb-text="alpineBuild"></dd></div>
              <div><dt>Prefix</dt><dd class="ndb-mono" data-ndb-text="alpineHealth.prefix"></dd></div>
              <div><dt>Loaded from</dt><dd class="ndb-mono"
                data-ndb-text="alpineHealth.source || 'not a separate file'"></dd></div>
              <div><dt>Components</dt><dd data-ndb-text="alpineComponents.length"></dd></div>
              <div><dt>Not started</dt><dd data-ndb-text="alpinePendingCount"></dd></div>
              <div><dt>Deferred</dt><dd data-ndb-text="alpineDeferredCount"></dd></div>
              <div><dt>Stores</dt><dd data-ndb-text="alpineStores.length"></dd></div>
            </dl>

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
`, Da = "data-ndb-", Fa = "siteation-debugbar";
function ja(t) {
  const e = t.attachShadow({ mode: "open" }), n = t.dataset.css;
  if (n) {
    const s = document.createElement("link");
    s.rel = "stylesheet", s.href = n, e.append(s);
  }
  const i = document.createElement("div");
  return i.innerHTML = La, e.append(...i.children), e.querySelector(".ndb");
}
const ne = document.getElementById(Fa);
if (ne && !ne.shadowRoot) {
  const t = ja(ne);
  Pt.prefix(Da), Pt.data("debugBar", Ra), t && Pt.initTree(t), ie && (window.Alpine = ie);
}
