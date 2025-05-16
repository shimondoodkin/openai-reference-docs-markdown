import {
    r as c,
    j as e,
    aR as B,
    u as K,
    w as P,
    aS as H,
    aK as m,
    aT as q,
    aU as T,
    aV as A,
    aW as N,
    aX as V,
    aO as W,
    aY as J,
    t as Q,
    aZ as X,
    aQ as Y,
    a_ as Z,
    aL as G
  } from "./index-V_aL6qyg.js";
  import {
    D as v
  } from "./jJcedfkj85.js";
  import {
    u as ee
  } from "./CWpxWoFY9Y.js";
  import {
    a as re
  } from "./cBb6QHDK4q.js"; /* empty css          */
  import "./BBlRhcS_kx.js";
  const C = "/docs/api-reference";
  var M;
  
  
  (function(n) {
    n.meta = "x-oaiMeta", n.typeLabel = "x-oaiTypeLabel", n.supportedSDKs = "x-oaiSupportedSDKs"
  })(M || (M = {}));
  const ne = ({
      docsContainerRef: n,
      lastSetSectionRef: r
    }) => {
      const {
        push: a
      } = Y();
      c.useEffect(() => {
        if (!n.current) return;
        const s = new Set,
          i = new IntersectionObserver(l => {
            var p;
            for (const u of l) u.isIntersecting ? s.add(u.target) : s.delete(u.target);
            const o = (p = Z.minBy(Array.from(s), "offsetTop")) == null ? void 0 : p.getAttribute("data-name");
            o && (r.current = o, a("".concat(C, "/").concat(o)))
          }, {
            threshold: 0,
            rootMargin: "0% 0% -50% 0%"
          });
        for (const l of document.querySelectorAll("h2[data-name]")) i.observe(l);
        return () => {
          i.disconnect()
        }
      }, [n, r, a])
    },
    E = ({
      relativeUrl: n,
      sectionRef: r,
      docsContainerRef: a,
      lastSetSectionRef: t
    }) => {
      const s = G(i => i.pathname === "/docs/api-reference/".concat(n));
      c.useEffect(() => {
        const i = a.current,
          l = r.current;
        if (!i || !l || !s) return;
        if (t.current === n) {
          t.current = null;
          return
        }
        const o = l.offsetTop,
          p = i.scrollTop - o;
        (p < 0 || p >= 150) && i.scrollTo({
          top: o
        })
      }, [s, n, a, t, r])
    },
    te = () => {
      ee("API Reference", "Complete reference documentation for the OpenAI API, including examples and code snippets for our endpoints in Python, cURL, and Node.js.");
      const n = c.useRef(null),
        r = c.useRef(null);
      return ne({
        docsContainerRef: n,
        lastSetSectionRef: r
      }), e.jsx(B, {
        pathPrefix: C,
        children: e.jsx("div", {
          ref: n,
          className: "docs-scroll-container",
          "data-important-algolia-crawl": !0,
          children: e.jsx("div", {
            className: "page-body full-width flush docs-page",
            children: e.jsx("div", {
              className: "api-ref",
              children: re.map(a => e.jsxs(c.Fragment, {
                children: [e.jsx(se, {
                  ...a,
                  docsContainerRef: n,
                  lastSetSectionRef: r
                }), ("sections" in a ? a.sections : []).map(t => {
                  if (t.type === "objectgroup") return e.jsx(ae, {
                    relativeUrl: t.relativeUrl,
                    docsContainerRef: n,
                    lastSetSectionRef: r
                  }, t.url);
                  if (t.type === "object") return e.jsx(ie, {
                    name: t.title,
                    description: t.content,
                    relativeUrl: t.relativeUrl,
                    example: t.example,
                    definition: t.definition,
                    docsContainerRef: n,
                    lastSetSectionRef: r
                  }, t.url);
                  if (t.type === "endpoint") {
                    const {
                      method: s,
                      path: i,
                      definition: l
                    } = t;
                    return e.jsx(oe, {
                      title: t.title,
                      path: i,
                      method: s,
                      definition: l,
                      relativeUrl: t.relativeUrl,
                      docsContainerRef: n,
                      lastSetSectionRef: r
                    }, t.url)
                  }
                  return null
                })]
              }, a.id))
            })
          })
        })
      })
    },
    be = c.memo(te),
    se = c.memo(n => {
      const {
        docsContainerRef: r,
        lastSetSectionRef: a
      } = n, t = K.useState(l => {
        var o;
        return (o = l.activeOrgId) != null ? o : "YOUR_ORG_ID"
      }), s = c.useMemo(() => n.content.replace(/VAR_orgId/g, t), [n.content, t]), i = c.useRef(null);
      return E({
        relativeUrl: n.id,
        sectionRef: i,
        docsContainerRef: r,
        lastSetSectionRef: a
      }), e.jsxs("div", {
        className: P("section md"),
        ref: i,
        children: ["sections" in n && n.title && e.jsx(H, {
          level: 2,
          slug: n.id,
          children: e.jsxs("div", {
            className: "flex flex-row items-center gap-3",
            children: [n.title, n.deprecated && e.jsx(m, {
              color: "warning",
              size: "md",
              children: "Deprecated"
            }), n.beta && e.jsx(m, {
              color: "warning",
              size: "md",
              children: "Beta"
            }), n.legacy && e.jsx(m, {
              color: "warning",
              size: "md",
              children: "Legacy"
            })]
          })
        }), e.jsx(v, {
          children: s
        })]
      })
    }),
    ae = c.memo(n => {
      const {
        relativeUrl: r,
        docsContainerRef: a,
        lastSetSectionRef: t
      } = n, s = c.useRef(null);
      return E({
        relativeUrl: r,
        sectionRef: s,
        docsContainerRef: a,
        lastSetSectionRef: t
      }), e.jsx("div", {
        ref: s,
        children: e.jsx(q, {
          tag: "h2",
          name: r,
          children: e.jsx("div", {})
        })
      })
    }),
    ie = c.memo(n => {
      var j, h;
      const {
        name: r,
        description: a,
        relativeUrl: t,
        definition: s,
        docsContainerRef: i,
        lastSetSectionRef: l,
        example: o
      } = n, p = c.useRef(null);
      E({
        relativeUrl: t,
        sectionRef: p,
        docsContainerRef: i,
        lastSetSectionRef: l
      });
      const u = c.useMemo(() => R(s), [s]),
        d = c.useMemo(() => _(s), [s]);
      return e.jsxs("div", {
        className: "section",
        ref: p,
        children: [e.jsx(q, {
          tag: "h2",
          name: t,
          children: e.jsxs("div", {
            className: "flex flex-row items-center gap-3",
            children: [r, s.deprecated && e.jsx(m, {
              color: "warning",
              size: "md",
              children: "Deprecated"
            }), ((j = s == null ? void 0 : s["x-oaiMeta"]) == null ? void 0 : j.beta) && e.jsx(m, {
              color: "warning",
              size: "md",
              children: "Beta"
            }), ((h = s == null ? void 0 : s["x-oaiMeta"]) == null ? void 0 : h.legacy) && e.jsx(m, {
              color: "warning",
              size: "md",
              children: "Legacy"
            })]
          })
        }), e.jsxs("div", {
          className: "endpoint",
          children: [e.jsxs("div", {
            className: "section-left",
            children: [e.jsx(v, {
              source: a
            }), u && e.jsx(b, {
              docsGroupPath: t,
              params: u,
              paramId: t,
              showTags: !1,
              isObject: !0
            }), d && e.jsx(ue, {
              events: d,
              docsGroupPath: t,
              tableId: t
            })]
          }), e.jsx("div", {
            className: "section-right",
            children: e.jsx("div", {
              className: "section-right-inner",
              children: o && e.jsx(T, {
                title: "OBJECT ".concat(r),
                language: "JSON",
                code: o
              })
            })
          })]
        })]
      })
    }),
    oe = c.memo(n => {
      const {
        title: r,
        path: a,
        method: t,
        definition: s,
        relativeUrl: i,
        docsContainerRef: l,
        lastSetSectionRef: o
      } = n, p = c.useRef(null), {
        deprecated: u,
        ["x-oaiMeta"]: {
          examples: d,
          beta: j,
          legacy: h,
          returns: O
        },
        parameters: S,
        summary: y
      } = s, g = s.requestBody, [f, w] = c.useState(Array.isArray(d) ? d[0] : d);
      return E({
        relativeUrl: i,
        sectionRef: p,
        docsContainerRef: l,
        lastSetSectionRef: o
      }), e.jsxs("div", {
        className: "section",
        ref: p,
        children: [e.jsx(q, {
          tag: "h2",
          name: i,
          children: e.jsxs("div", {
            className: "flex flex-row items-center gap-3",
            children: [r, j && e.jsx(m, {
              color: "warning",
              size: "md",
              children: "Beta"
            }), u && e.jsx(m, {
              color: "warning",
              size: "md",
              children: "Deprecated"
            }), h && e.jsx(m, {
              color: "warning",
              size: "md",
              children: "Legacy"
            })]
          })
        }), e.jsxs("div", {
          className: "endpoint",
          children: [e.jsxs("div", {
            className: "section-left",
            children: [e.jsx("div", {
              children: e.jsxs("span", {
                className: "endpoint-text",
                children: [e.jsx("span", {
                  className: "endpoint-method endpoint-method-".concat(t),
                  children: t
                }), " ", e.jsxs("span", {
                  className: "endpoint-path",
                  children: ["https://api.openai.com/v1", a]
                })]
              })
            }), e.jsx(v, {
              source: String(y),
              className: "endpoint-summary"
            }), S && e.jsx(le, {
              parameters: S,
              docsGroupPath: i
            }), g && e.jsx(ce, {
              requestBody: g,
              docsGroupPath: i
            }), O && e.jsx(de, {
              content: O
            })]
          }), e.jsx("div", {
            className: "section-right",
            children: e.jsxs("div", {
              className: P("section-right-inner", (d == null ? void 0 : d.length) > 1 && "section-right-inner-with-examples"),
              children: [(d == null ? void 0 : d.length) > 1 && e.jsx("div", {
                className: "mb-3 md:mb-0",
                children: e.jsx(A, {
                  value: f.title,
                  onChange: x => {
                    const D = d.find(({
                      title: z
                    }) => z === x);
                    D && w(D)
                  },
                  "aria-label": "Code example",
                  children: d.map(({
                    title: x
                  }) => e.jsx(A.Option, {
                    value: x,
                    children: x
                  }, x))
                })
              }), (f == null ? void 0 : f.request) && e.jsx(T, {
                title: "Example request",
                code: f.request,
                showModelSelect: !0
              }), (f == null ? void 0 : f.response) && e.jsx(T, {
                title: "Response",
                language: "json",
                code: f.response
              })]
            })
          })]
        })]
      })
    });
  
  function le({
    docsGroupPath: n,
    parameters: r
  }) {
    const [a, t] = c.useMemo(() => {
      const i = [],
        l = [];
      return r.forEach(o => {
        o.in === "path" ? i.push({
          name: o.name,
          required: !0,
          schema: {
            ...o.schema,
            description: o.description
          }
        }) : l.push({
          name: o.name,
          required: o.required || !1,
          schema: {
            ...o.schema,
            description: o.description
          }
        })
      }), [i, l]
    }, [r]), s = [];
    return a.length && s.push([e.jsxs("div", {
      className: "param-section",
      children: [e.jsx("h4", {
        children: "Path parameters"
      }), e.jsx(b, {
        docsGroupPath: n,
        params: a,
        paramId: N(n)
      })]
    }, "path")]), t.length && s.push([e.jsxs("div", {
      className: "param-section",
      children: [e.jsx("h4", {
        children: "Query parameters"
      }), e.jsx(b, {
        docsGroupPath: n,
        params: t,
        paramId: N(n)
      })]
    }, "query")]), e.jsx(e.Fragment, {
      children: s
    })
  }
  
  function ce({
    docsGroupPath: n,
    requestBody: r
  }) {
    const a = c.useMemo(() => {
      const t = r.content["application/json"] || r.content["multipart/form-data"] || {};
      return R(t.schema)
    }, [r]);
    return e.jsxs("div", {
      className: "param-section",
      children: [e.jsx("h4", {
        children: "Request body"
      }), e.jsx(b, {
        docsGroupPath: n,
        params: a,
        paramId: N(n)
      })]
    })
  }
  
  function de({
    content: n
  }) {
    return e.jsxs("div", {
      className: "param-section",
      children: [e.jsx("h4", {
        children: "Returns"
      }), e.jsx("div", {
        className: "param-table",
        children: e.jsx("div", {
          className: "param-row",
          children: e.jsx(v, {
            source: n
          })
        })
      })]
    })
  }
  
  function ue({
    docsGroupPath: n,
    events: r,
    tableId: a
  }) {
    const t = [...r].sort((s, i) => s.name.localeCompare(i.name));
    return e.jsx("div", {
      className: "param-table",
      children: t.map(s => e.jsx(I, {
        classNames: ["event-row"],
        docsGroupPath: n,
        param: {
          name: s.name,
          required: !1,
          schema: {
            type: "string",
            description: s.description,
            "x-oaiTypeLabel": s.dataDescription
          }
        },
        paramId: a + "-" + N(s.name),
        showTags: !1
      }, s.name))
    })
  }
  
  function b({
    docsGroupPath: n,
    params: r,
    showTags: a = !0,
    paramId: t,
    isObject: s = !1
  }) {
    const i = [...r].sort((l, o) => s ? l.name.localeCompare(o.name) : l.required && !o.required ? -1 : !l.required && o.required ? 1 : l.name.localeCompare(o.name));
    return e.jsx("div", {
      className: "param-table",
      id: t + "__table",
      children: i.map(l => e.jsx(I, {
        docsGroupPath: n,
        param: l,
        paramId: t + "-" + N(l.name),
        showTags: a
      }, l.name))
    })
  }
  
  function I({
    docsGroupPath: n,
    param: r,
    paramId: a,
    showTags: t,
    classNames: s
  }) {
    const {
      name: i,
      required: l = !1,
      schema: o
    } = r, p = o.description || "", u = o.oneOf, d = o.anyOf, j = c.useRef(null), [h, O] = c.useState(!1);
    c.useEffect(() => {
      var x;
      const w = window.location.hash.replace("#", "");
      !h && w.startsWith(a) && (O(!0), w === a && ((x = j.current) == null || x.scrollIntoView()))
    }, [a, h]);
    const S = u ? L(u) : d ? L(d) : $(o),
      y = o.default;
    let g;
    y === "" ? g = "''" : Array.isArray(y) && y.length === 0 ? g = "[]" : g = String(y);
    let f = [];
    return o["x-oaiSupportedSDKs"] && (f = o["x-oaiSupportedSDKs"]), e.jsxs("div", {
      className: P("param-row", ...s || []),
      ref: j,
      children: [e.jsxs("div", {
        className: "param-row-header api-ref-anchor-link-hover",
        children: [e.jsx(me, {
          docsGroupPath: n,
          paramId: a
        }), e.jsx("div", {
          className: "param-name",
          children: i
        }), o.deprecated && e.jsx("div", {
          className: "param-depr",
          children: "Deprecated"
        }), e.jsx("div", {
          className: "param-type",
          children: e.jsx(v, {
            source: S
          })
        }), t ? e.jsxs(e.Fragment, {
          children: [l ? e.jsx("div", {
            className: "param-reqd",
            children: "Required"
          }) : e.jsx("div", {
            className: "param-optl",
            children: "Optional"
          }), !l && y !== void 0 && e.jsxs("div", {
            className: "param-default",
            children: ["Defaults to ", g]
          })]
        }) : null, f.length > 0 && e.jsx("div", {
          className: "bg-blue-900 text-xs text-white px-1 py-0.5 rounded-sm ml-2",
          children: "SDK Only"
        })]
      }), p && e.jsx("div", {
        className: "param-desc",
        children: e.jsx(v, {
          source: p
        })
      }), e.jsx(U, {
        docsGroupPath: n,
        paramId: a,
        schema: o,
        showTags: t
      })]
    })
  }
  
  function pe({
    docsGroupPath: n,
    paramId: r,
    showTags: a = !0,
    schemas: t
  }) {
    return e.jsx("div", {
      className: "param-table",
      id: r + "__table",
      children: t.map((s, i) => e.jsx(fe, {
        schema: s,
        docsGroupPath: n,
        showTags: a,
        paramId: r + "-" + N(s.title || s.type || "".concat(i))
      }, s.title || i))
    })
  }
  
  function fe({
    docsGroupPath: n,
    paramId: r,
    schema: a,
    showTags: t
  }) {
    return e.jsxs("div", {
      className: "param-row",
      children: [e.jsxs("div", {
        className: "param-row-header api-ref-anchor-link-hover",
        children: [a.title && e.jsx("div", {
          className: "param-title",
          children: a.title
        }), e.jsx("div", {
          className: "param-type",
          children: $(a)
        }), a.deprecated && e.jsx("div", {
          className: "param-depr",
          children: "Deprecated"
        })]
      }), a.description && e.jsx("div", {
        className: "param-desc",
        children: e.jsx(v, {
          source: a.description
        })
      }), e.jsx(U, {
        docsGroupPath: n,
        paramId: r,
        schema: a,
        showTags: t
      })]
    })
  }
  
  function U({
    docsGroupPath: n,
    schema: r,
    showTags: a,
    paramId: t
  }) {
    const [s, i] = c.useState(!1);
    r = F(r);
    const l = c.useMemo(() => {
        const u = d => "$ref" in d ? !1 : d.oneOf && d.oneOf.some(u) || d.anyOf && d.anyOf.some(u) || d.type === "object" ? !0 : d.type === "array" ? u(d.items) : !1;
        if (r.oneOf && u(r)) return r.oneOf;
        if (r.anyOf && u(r)) return r.anyOf;
        if (r.type === "array" && "items" in r && r.items.oneOf && u(r)) return r.items.oneOf;
        if (r.type === "array" && "items" in r && r.items.anyOf && u(r)) return r.items.anyOf
      }, [r]),
      o = c.useMemo(() => r.type === "array" && "items" in r && r.items.type === "object" ? R(r.items) : r.type === "object" && r.properties ? R(r) : null, [r]),
      p = t + "_table";
    return l ? e.jsxs(e.Fragment, {
      children: [e.jsx(k, {
        controlsId: p,
        isExpanded: s,
        label: "possible types",
        onClick: () => i(!s)
      }), s && e.jsx(pe, {
        docsGroupPath: n,
        schemas: l,
        paramId: t,
        showTags: a
      })]
    }) : o ? e.jsxs(e.Fragment, {
      children: [e.jsx(k, {
        controlsId: p,
        isExpanded: s,
        label: "properties",
        onClick: () => i(!s)
      }), s && e.jsx(b, {
        docsGroupPath: n,
        params: o,
        paramId: t,
        showTags: a
      })]
    }) : null
  }
  
  function k({
    controlsId: n,
    isExpanded: r,
    label: a,
    onClick: t
  }) {
    return e.jsx("button", {
      className: "param-expand-button link-style",
      onClick: t,
      "aria-expanded": r ? "true" : "false",
      "aria-controls": n,
      children: r ? e.jsxs(e.Fragment, {
        children: [e.jsx(V, {}), e.jsxs("span", {
          children: ["Hide ", a]
        })]
      }) : e.jsxs(e.Fragment, {
        children: [e.jsx(W, {}), e.jsxs("span", {
          children: ["Show ", a]
        })]
      })
    })
  }
  
  function me({
    docsGroupPath: n,
    paramId: r
  }) {
    const a = c.useCallback(t => {
      t.preventDefault(), J(window.location.origin + C + "/" + n + "#" + r), Q.success("Link copied!")
    }, [n, r]);
    return e.jsx("a", {
      href: "#".concat(r),
      "data-anchor": r,
      onClick: a,
      className: "api-ref-anchor-link",
      children: e.jsx(X, {})
    })
  }
  
  function R(n) {
    const r = (n == null ? void 0 : n.properties) || {},
      a = (n == null ? void 0 : n.required) || [];
    return Object.keys(r).map(s => ({
      name: s,
      required: Array.isArray(a) ? a.includes(s) : !1,
      schema: F(r[s])
    })).sort((s, i) => s.name.localeCompare(i.name))
  }
  
  function _(n) {
    if ("oneOf" in n) {
      const r = [];
      return n.oneOf.forEach(t => {
        var s, i;
        if (t.type === "object") {
          const l = (s = t.properties) == null ? void 0 : s.event;
          if (l && "enum" in l) r.push({
            name: l.enum && l.enum[0] || "",
            dataDescription: ((i = t["x-oaiMeta"]) == null ? void 0 : i.dataDescription) || "",
            description: t.description || ""
          });
          else throw new Error("Expected event schema to have an enum")
        } else "oneOf" in t && r.push(..._(t))
      }), r
    }
    return []
  }
  
  function $(n) {
    if (n["x-oaiTypeLabel"]) return n["x-oaiTypeLabel"];
    let r = n.type;
    return r === "string" && n.format === "binary" && (r = "file"), n.nullable ? "".concat(r, " or null") : r
  }
  
  function xe(n) {
    var r;
    return ((r = n.enum) == null ? void 0 : r.length) === 1 ? n.type === "string" ? '"'.concat(n.enum[0], '"') : n.enum[0] : n.type
  }
  
  function F(n) {
    if (n.anyOf) {
      const r = n.anyOf.filter(a => !("type" in a) || a.type !== "null");
      return r.length === 1 ? r[0] : {
        ...n,
        anyOf: r
      }
    }
    return n
  }
  
  function L(n) {
    const r = {};
    let a = !1;
    n.forEach(s => {
      const i = xe(s);
      i && (r[i] = !0), s.nullable && (a = !0)
    });
    const t = Object.keys(r);
    return a && t.push("null"), t.length === 2 ? t.join(" or ") : t.join(" / ")
  }
  export {
    be as
    default
  };