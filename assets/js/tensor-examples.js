(function () {
  function ensurePlotly(callback) {
    if (window.Plotly) {
      callback();
      return;
    }
    var script = document.createElement("script");
    script.src = "https://cdn.plot.ly/plotly-2.35.2.min.js";
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function buildCubeMesh(nx, ny, nz, pad, intensityProvider, includeFn) {
    var X = [], Y = [], Z = [];
    var I = [], J = [], K = [];
    var intensity = [];

    function addCube(cellI, cellJ, cellK, colorVal) {
      var base = X.length;

      var x0 = cellI + pad;
      var x1 = cellI + 1 - pad;
      var y0 = cellJ + pad;
      var y1 = cellJ + 1 - pad;
      var z0 = cellK + pad;
      var z1 = cellK + 1 - pad;

      var verts = [
        [x0, y0, z0],
        [x1, y0, z0],
        [x1, y1, z0],
        [x0, y1, z0],
        [x0, y0, z1],
        [x1, y0, z1],
        [x1, y1, z1],
        [x0, y1, z1]
      ];

      for (var t = 0; t < 8; t++) {
        X.push(verts[t][0]);
        Y.push(verts[t][1]);
        Z.push(verts[t][2]);
        intensity.push(colorVal);
      }

      var faces = [
        [0, 1, 2], [0, 2, 3],
        [4, 5, 6], [4, 6, 7],
        [0, 1, 5], [0, 5, 4],
        [3, 2, 6], [3, 6, 7],
        [0, 4, 7], [0, 7, 3],
        [1, 2, 6], [1, 6, 5]
      ];

      faces.forEach(function (f) {
        I.push(base + f[0]);
        J.push(base + f[1]);
        K.push(base + f[2]);
      });
    }

    for (var i = 0; i < nx; i++) {
      for (var j = 0; j < ny; j++) {
        for (var k = 0; k < nz; k++) {
          if (includeFn && includeFn(i, j, k) === false) continue;
          addCube(i, j, k, intensityProvider(i, j, k));
        }
      }
    }

    return { X: X, Y: Y, Z: Z, I: I, J: J, K: K, intensity: intensity };
  }

  function buildSingleCubeMesh(cellI, cellJ, cellK, pad, intensityVal) {
    var X = [], Y = [], Z = [];
    var I = [], J = [], K = [];
    var intensity = [];

    var x0 = cellI + pad;
    var x1 = cellI + 1 - pad;
    var y0 = cellJ + pad;
    var y1 = cellJ + 1 - pad;
    var z0 = cellK + pad;
    var z1 = cellK + 1 - pad;

    var verts = [
      [x0, y0, z0],
      [x1, y0, z0],
      [x1, y1, z0],
      [x0, y1, z0],
      [x0, y0, z1],
      [x1, y0, z1],
      [x1, y1, z1],
      [x0, y1, z1]
    ];

    for (var t = 0; t < 8; t++) {
      X.push(verts[t][0]);
      Y.push(verts[t][1]);
      Z.push(verts[t][2]);
      intensity.push(intensityVal);
    }

    var faces = [
      [0, 1, 2], [0, 2, 3],
      [4, 5, 6], [4, 6, 7],
      [0, 1, 5], [0, 5, 4],
      [3, 2, 6], [3, 6, 7],
      [0, 4, 7], [0, 7, 3],
      [1, 2, 6], [1, 6, 5]
    ];

    faces.forEach(function (f) {
      I.push(f[0]);
      J.push(f[1]);
      K.push(f[2]);
    });

    return { X: X, Y: Y, Z: Z, I: I, J: J, K: K, intensity: intensity };
  }

  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    var r = parseInt(h.slice(0, 2), 16);
    var g = parseInt(h.slice(2, 4), 16);
    var b = parseInt(h.slice(4, 6), 16);
    return { r: r, g: g, b: b };
  }

  function colorScaleFromHex(hex) {
    var rgb = hexToRgb(hex);
    var rgba = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    return [
      [0, rgba],
      [1, rgba]
    ];
  }

  function ensurePlotLoadingOverlay(plotDiv) {
    if (!plotDiv) return null;
    if (plotDiv.__tensorLoadingOverlay) return plotDiv.__tensorLoadingOverlay;
    var overlay = document.createElement("div");
    overlay.className = "tensor-plot-loading-overlay";
    var spinner = document.createElement("span");
    spinner.className = "tensor-plot-loading-spinner";
    spinner.setAttribute("aria-hidden", "true");
    overlay.appendChild(spinner);
    plotDiv.appendChild(overlay);
    plotDiv.__tensorLoadingOverlay = overlay;
    return overlay;
  }

  function setPlotLoading(plotDiv, isLoading) {
    if (!plotDiv) return;
    ensurePlotLoadingOverlay(plotDiv);
    if (isLoading) {
      plotDiv.classList.add("is-loading");
    } else {
      plotDiv.classList.remove("is-loading");
    }
  }

  function renderFullTensor(plotDiv, config) {
    setPlotLoading(plotDiv, true);
    var n = 2;
    var shrinkFrac = 0.12;
    var pad = shrinkFrac / 2.0;

    var values = config.values || {};
    var colors = config.colors || {};

    var cubeTraces = [];
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        for (var k = 0; k < n; k++) {
          var key = (i + 1) + "," + (j + 1) + "," + (k + 1);
          var cubeColor = colors[key] || "rgb(220,220,220)";
          var mesh = buildSingleCubeMesh(i, j, k, pad, 1);
          cubeTraces.push({
            type: "mesh3d",
            x: mesh.X,
            y: mesh.Y,
            z: mesh.Z,
            i: mesh.I,
            j: mesh.J,
            k: mesh.K,
            intensity: mesh.intensity,
            colorscale: [
              [0, cubeColor],
              [1, cubeColor]
            ],
            cmin: 0,
            cmax: 1,
            opacity: 1,
            flatshading: true,
            lighting: {
              ambient: 0.85,
              diffuse: 0.4,
              specular: 0.1,
              roughness: 0.9
            },
            lightposition: { x: 1.2, y: 1.0, z: 2.0 },
            showscale: false,
            name: "cube"
          });
        }
      }
    }

    var labelX = [], labelY = [], labelZ = [], labelText = [];
    Object.keys(values).forEach(function (key) {
      var parts = key.split(",").map(function (v) { return parseInt(v, 10) - 1; });
      var cx = parts[0] + 0.5;
      var cy = parts[1] + 0.5;
      var cz = parts[2] + 0.5;
      labelX.push(cx);
      labelY.push(cy);
      labelZ.push(cz);
      labelText.push(String(values[key]));
    });

    var traceLabels = {
      type: "scatter3d",
      x: labelX,
      y: labelY,
      z: labelZ,
      mode: "text",
      text: labelText,
      textfont: {
        size: 14,
        color: "#000"
      },
      hoverinfo: "skip",
      showlegend: false
    };

    var box = buildGridFrameTraces(n, n, n);

    var axisStyle = {
      range: [0, n],
      showbackground: false,
      showgrid: false,
      showticklabels: false,
      ticks: "",
      zeroline: false,
      showline: false,
      title: { text: "" }
    };

    var layout = {
      margin: { l: 0, r: 0, t: 0, b: 0 },
      scene: {
        xaxis: axisStyle,
        yaxis: axisStyle,
        zaxis: axisStyle,
        aspectmode: "cube",
        camera: {
          eye: { x: 2.0, y: 1.75, z: 1.35 },
          up: { x: 0, y: 0, z: 1 },
          center: { x: 0, y: 0, z: 0 }
        },
        bgcolor: "rgba(0,0,0,0)"
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)"
    };

    return Plotly.newPlot(plotDiv, cubeTraces.concat([traceLabels, box.grid, box.frame]), layout, {
      displayModeBar: false,
      responsive: true
    })
      .then(function () {
        setPlotLoading(plotDiv, false);
        registerSyncedRotation(plotDiv, { x: 2.0, y: 1.75, z: 1.35 });
      })
      .catch(function () {
        setPlotLoading(plotDiv, false);
      });
  }

  function renderBasisTensor(plotDiv, config) {
    setPlotLoading(plotDiv, true);
    var n = 2;
    var shrinkFrac = 0.1;
    var pad = shrinkFrac / 2.0;
    var pos = config.position || "1,1,1";
    var parts = pos.split(",").map(function (v) { return parseInt(v, 10) - 1; });
    var color = config.color || "#f28e2b";
    var isInline = config.size === "inline";

    var data = buildCubeMesh(n, n, n, pad, function (i, j, k) {
      if (i === parts[0] && j === parts[1] && k === parts[2]) {
        return 1.0;
      }
      return 0.05;
    });

    var traceVoxels = {
      type: "mesh3d",
      x: data.X,
      y: data.Y,
      z: data.Z,
      i: data.I,
      j: data.J,
      k: data.K,
      intensity: data.intensity,
      colorscale: [
        [0, "rgba(220,220,220,0.1)"],
        [0.5, "rgba(220,220,220,0.1)"],
        [1, "rgba(140,140,140,0.95)"]
      ],
      cmin: 0,
      cmax: 1,
      opacity: 0.95,
      flatshading: true,
      lighting: {
        ambient: 0.85,
        diffuse: 0.35,
        specular: 0.1,
        roughness: 0.9
      },
      lightposition: { x: 1.1, y: 1.0, z: 1.8 },
      showscale: false,
      name: "basis"
    };

    var labelX = [parts[0] + 0.5];
    var labelY = [parts[1] + 0.5];
    var labelZ = [parts[2] + 0.5];

    var traceOne = {
      type: "scatter3d",
      x: labelX,
      y: labelY,
      z: labelZ,
      mode: "text",
      text: ["1"],
      textposition: "middle center",
      textfont: {
        size: 15,
        color: "#000000"
      },
      opacity: 1,
      hoverinfo: "skip",
      showlegend: false
    };

    var box = buildGridFrameTraces(n, n, n);

    var axisStyle = {
      range: [0, n],
      showbackground: false,
      showgrid: false,
      showticklabels: false,
      ticks: "",
      zeroline: false,
      showline: false,
      title: { text: "" }
    };

    var layout = {
      margin: { l: 0, r: 0, t: 0, b: 0 },
      scene: {
        xaxis: axisStyle,
        yaxis: axisStyle,
        zaxis: axisStyle,
        aspectmode: "cube",
        camera: {
          eye: isInline ? { x: 1.6, y: 1.35, z: 1.05 } : { x: 1.8, y: 1.5, z: 1.15 },
          up: { x: 0, y: 0, z: 1 },
          center: { x: 0, y: 0, z: 0 }
        },
        bgcolor: "rgba(0,0,0,0)"
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)"
    };

    return Plotly.newPlot(plotDiv, [traceVoxels, traceOne, box.grid, box.frame], layout, {
      displayModeBar: false,
      responsive: true
    })
      .then(function () {
        setPlotLoading(plotDiv, false);
        var baseEye = isInline ? { x: 1.6, y: 1.35, z: 1.05 } : { x: 1.8, y: 1.5, z: 1.15 };
        registerSyncedRotation(plotDiv, baseEye);
      })
      .catch(function () {
        setPlotLoading(plotDiv, false);
      });
  }

  function init() {
    var examples = window.__tensorExamples || [];
    if (!examples.length) return;

    ensurePlotly(function () {
      var activePlots = window.__tensorActivePlots || [];
      var visiblePlots = window.__tensorVisiblePlots || new Set();
      window.__tensorActivePlots = activePlots;
      window.__tensorVisiblePlots = visiblePlots;
      var OFFSCREEN_KEEP_COUNT = 4;
      var recentOffscreenPlots = [];

      function purgePlot(div) {
        if (!div || !div.dataset.plotInitialized) return;
        setPlotLoading(div, false);
        if (div.__tensorRotationState) {
          var s = div.__tensorRotationState;
          if (s.timer) {
            clearInterval(s.timer);
            s.timer = null;
          }
          if (s.returnRaf) {
            cancelAnimationFrame(s.returnRaf);
            s.returnRaf = 0;
          }
          if (s.pointerUpHandler) {
            window.removeEventListener("pointerup", s.pointerUpHandler);
          }
          if (s.pointerCancelHandler) {
            window.removeEventListener("pointercancel", s.pointerCancelHandler);
            window.removeEventListener("touchcancel", s.pointerCancelHandler);
          }
          if (s.pointerDownHandler) {
            div.removeEventListener("pointerdown", s.pointerDownHandler);
          }
          if (s.mouseDownHandler) {
            div.removeEventListener("mousedown", s.mouseDownHandler);
          }
          if (s.touchStartHandler) {
            div.removeEventListener("touchstart", s.touchStartHandler);
          }
          if (s.pointerUpHandler) {
            window.removeEventListener("mouseup", s.pointerUpHandler);
            window.removeEventListener("touchend", s.pointerUpHandler);
          }
          div.__tensorRotationState = null;
        }
        try {
          Plotly.purge(div);
        } catch {}
        div.dataset.plotInitialized = "";
        div.__tensorInteractionHooked = false;
        div.__tensorRelayoutHooked = false;
        var activeIdx = activePlots.indexOf(div);
        if (activeIdx >= 0) {
          activePlots.splice(activeIdx, 1);
        }
        var recentIdx = recentOffscreenPlots.indexOf(div);
        if (recentIdx >= 0) {
          recentOffscreenPlots.splice(recentIdx, 1);
        }
      }

      function activatePlot(div, renderFn) {
        if (div.dataset.plotInitialized === "true" || div.dataset.plotInitializing === "true") return;
        div.dataset.plotInitializing = "true";
        Promise.resolve(renderFn())
          .then(function () {
            div.dataset.plotInitialized = "true";
            if (activePlots.indexOf(div) < 0) {
              activePlots.push(div);
            }
          })
          .catch(function () {
            div.dataset.plotInitialized = "";
          })
          .finally(function () {
            div.dataset.plotInitializing = "";
          });
      }

      function canRenderPlot(div) {
        if (!div) return false;
        if (div.getClientRects && div.getClientRects().length === 0) return false;
        var detailsParent = div.closest ? div.closest("details") : null;
        if (detailsParent && !detailsParent.open) return false;
        return true;
      }

      function ensurePlotActive(div) {
        if (!div || !div.__tensorRenderFn) return;
        if (!canRenderPlot(div)) return;
        activatePlot(div, div.__tensorRenderFn);
      }

      function resizeInitializedPlot(div) {
        if (!div || div.dataset.plotInitialized !== "true") return;
        if (!window.Plotly || !Plotly.Plots || !Plotly.Plots.resize) return;
        try {
          Plotly.Plots.resize(div);
        } catch {}
      }

      function markRecentOffscreen(div) {
        var idx = recentOffscreenPlots.indexOf(div);
        if (idx >= 0) {
          recentOffscreenPlots.splice(idx, 1);
        }
        recentOffscreenPlots.unshift(div);
        if (recentOffscreenPlots.length > OFFSCREEN_KEEP_COUNT) {
          recentOffscreenPlots.length = OFFSCREEN_KEEP_COUNT;
        }
      }

      function unmarkRecentOffscreen(div) {
        var idx = recentOffscreenPlots.indexOf(div);
        if (idx >= 0) {
          recentOffscreenPlots.splice(idx, 1);
        }
      }

      function reconcileActivePlots() {
        var keepSet = new Set();
        visiblePlots.forEach(function (div) {
          keepSet.add(div);
        });
        recentOffscreenPlots.forEach(function (div) {
          if (!visiblePlots.has(div)) {
            keepSet.add(div);
          }
        });
        activePlots.slice().forEach(function (div) {
          if (!keepSet.has(div)) {
            purgePlot(div);
          }
        });
      }

      var preloadPx = Math.round(Math.min(900, Math.max(320, (window.innerHeight || 800) * 0.75)));
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var div = entry.target;
          if (entry.isIntersecting) {
            visiblePlots.add(div);
            unmarkRecentOffscreen(div);
            ensurePlotActive(div);
            resizeInitializedPlot(div);
          } else {
            visiblePlots.delete(div);
            markRecentOffscreen(div);
          }
        });
        reconcileActivePlots();
      }, {
        root: null,
        rootMargin: preloadPx + "px 0px",
        threshold: 0.01
      });

      examples.forEach(function (ex) {
        if (!ex || !ex.id) return;
        var plotDiv = document.getElementById(ex.id);
        if (!plotDiv) return;
        plotDiv.__tensorRenderFn = function () {
          if (ex.type === "basis") {
            renderBasisTensor(plotDiv, ex);
          } else if (ex.type === "tensor3") {
            renderTensor3(plotDiv, ex);
          } else {
            renderFullTensor(plotDiv, ex);
          }
        };
        observer.observe(plotDiv);
      });

      document.querySelectorAll("details").forEach(function (el) {
        el.addEventListener("toggle", function () {
          if (el.open) {
            el.querySelectorAll(".tensor-plot").forEach(function (div) {
              ensurePlotActive(div);
              resizeInitializedPlot(div);
            });
            return;
          }
          el.querySelectorAll(".tensor-plot").forEach(function (div) {
            visiblePlots.delete(div);
            unmarkRecentOffscreen(div);
            purgePlot(div);
          });
        });
      });

      window.addEventListener("resize", function () {
        activePlots.forEach(function (div) {
          resizeInitializedPlot(div);
        });
      });
    });
  }

  function renderTensor3(plotDiv, config) {
    setPlotLoading(plotDiv, true);
    var dims = config.dims || [2, 2, 2];
    var nx = dims[0], ny = dims[1], nz = dims[2];
    var values = config.values || [];
    var shrinkFrac = config.shrink || 0.12;
    var pad = shrinkFrac / 2.0;

    var minVal = Infinity;
    var maxVal = -Infinity;
    for (var idx = 0; idx < values.length; idx++) {
      var v = values[idx];
      if (v < minVal) minVal = v;
      if (v > maxVal) maxVal = v;
    }
    if (!isFinite(minVal) || !isFinite(maxVal) || maxVal === minVal) {
      minVal = 0;
      maxVal = 1;
    }

    function valueAt(i, j, k) {
      var index = i + nx * (j + ny * k);
      return values[index] || 0;
    }

    var data = buildCubeMesh(
      nx,
      ny,
      nz,
      pad,
      function (i, j, k) {
        var v = valueAt(i, j, k);
        if (config.zeroTransparent && (v === 0 || Math.abs(v) < 1e-9)) return 0;
        return (v - minVal) / (maxVal - minVal);
      },
      config.zeroTransparent
        ? function (i, j, k) {
            var v = valueAt(i, j, k);
            return !(v === 0 || Math.abs(v) < 1e-9);
          }
        : null
    );

    var colorscale = config.colorscale || "Turbo";
    if (config.zeroTransparent) {
      var eps = 0.001;
      var baseScale = Array.isArray(colorscale)
        ? colorscale
        : [[0, "#2c7bb6"], [1, "#f29e2e"]];
      colorscale = [[0, "rgba(0,0,0,0)"], [eps, "rgba(0,0,0,0)"]]
        .concat(baseScale.map(function (stop) {
          return [eps + stop[0] * (1 - eps), stop[1]];
        }));
    }

    var traceVoxels = {
      type: "mesh3d",
      x: data.X,
      y: data.Y,
      z: data.Z,
      i: data.I,
      j: data.J,
      k: data.K,
      intensity: data.intensity,
      colorscale: colorscale,
      cmin: 0,
      cmax: 1,
      opacity: 1,
      flatshading: true,
      lighting: {
        ambient: 0.85,
        diffuse: 0.35,
        specular: 0.1,
        roughness: 0.9
      },
      lightposition: { x: 1.2, y: 1.0, z: 2.0 },
      showscale: false,
      name: "tensor"
    };

    var box = buildGridFrameTraces(nx, ny, nz);

    var axisStyle = {
      range: [0, 1],
      showbackground: false,
      showgrid: false,
      showticklabels: false,
      ticks: "",
      zeroline: false,
      showline: false,
      title: { text: "" }
    };

    var layout = {
      margin: { l: 0, r: 0, t: 0, b: 0 },
      scene: {
        xaxis: Object.assign({}, axisStyle, { range: [0, nx] }),
        yaxis: Object.assign({}, axisStyle, { range: [0, ny] }),
        zaxis: Object.assign({}, axisStyle, { range: [0, nz] }),
        aspectmode: "manual",
        aspectratio: { x: nx, y: ny, z: nz },
        camera: {
          eye: config.baseEye || { x: 2.6, y: 2.2, z: 1.6 },
          up: { x: 0, y: 0, z: 1 },
          center: { x: 0, y: 0, z: 0 }
        },
        bgcolor: "rgba(0,0,0,0)"
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)"
    };

    return Plotly.newPlot(plotDiv, [traceVoxels, box.grid, box.frame], layout, {
      displayModeBar: false,
      responsive: true
    })
      .then(function () {
        setPlotLoading(plotDiv, false);
        var baseEye = config.baseEye || { x: 2.6, y: 2.2, z: 1.6 };
        registerSyncedRotation(plotDiv, baseEye);
      })
      .catch(function () {
        setPlotLoading(plotDiv, false);
      });
  }

  function registerSyncedRotation(plotDiv, baseEye) {
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function isFiniteNumber(v) {
      return typeof v === "number" && isFinite(v);
    }

    function wrapAngle(a) {
      while (a > Math.PI) a -= 2 * Math.PI;
      while (a < -Math.PI) a += 2 * Math.PI;
      return a;
    }

    function phaseDeltaNearest(target, current) {
      return wrapAngle(target - current);
    }

    var radius = Math.sqrt(baseEye.x * baseEye.x + baseEye.y * baseEye.y);
    var height = baseEye.z;
    var initAngle = Math.atan2(baseEye.y, baseEye.x);
    var state = plotDiv.__tensorRotationState || {
      radius: radius,
      height: height,
      angle: initAngle,
      baseAngle: initAngle,
      canonicalRadius: radius,
      canonicalHeight: height,
      up: { x: 0, y: 0, z: 1 },
      center: { x: 0, y: 0, z: 0 },
      canonicalUp: { x: 0, y: 0, z: 1 },
      canonicalCenter: { x: 0, y: 0, z: 0 },
      autoRotate: true,
      userInteracting: false,
      returningToPerspective: false,
      returnToken: 0,
      returnRaf: 0,
      programmaticRelayout: false,
      baseStep: 0.01,
      currentStep: 0.01,
      glideMs: 1200,
      period: 80,
      timer: null,
      pointerActive: false,
      interactionReleaseTimer: null,
      pointerDownHandler: null,
      mouseDownHandler: null,
      touchStartHandler: null,
      pointerUpHandler: null,
      pointerCancelHandler: null
    };

    plotDiv.__tensorRotationState = state;
    state.radius = isFiniteNumber(state.radius) ? state.radius : radius;
    state.height = isFiniteNumber(state.height) ? state.height : height;
    state.canonicalRadius = radius;
    state.canonicalHeight = height;
    if (!isFiniteNumber(state.angle)) state.angle = initAngle;
    if (!isFiniteNumber(state.baseAngle)) state.baseAngle = initAngle;
    if (!state.up) state.up = { x: 0, y: 0, z: 1 };
    if (!state.center) state.center = { x: 0, y: 0, z: 0 };
    if (!state.canonicalUp) state.canonicalUp = { x: 0, y: 0, z: 1 };
    if (!state.canonicalCenter) state.canonicalCenter = { x: 0, y: 0, z: 0 };
    state.baseStep = 0.01;
    state.glideMs = 1200;
    state.period = 80;

    function syncFromLiveCamera() {
      if (!plotDiv || !plotDiv._fullLayout || !plotDiv._fullLayout.scene || !plotDiv._fullLayout.scene.camera) return;
      var cam = plotDiv._fullLayout.scene.camera;
      var eye = cam.eye;
      if (eye && isFiniteNumber(eye.x) && isFiniteNumber(eye.y) && isFiniteNumber(eye.z)) {
        var nextRadius = Math.sqrt(eye.x * eye.x + eye.y * eye.y);
        var nextAngle = Math.atan2(eye.y, eye.x);
        if (isFiniteNumber(nextRadius) && nextRadius > 0.01) state.radius = nextRadius;
        if (isFiniteNumber(eye.z)) state.height = eye.z;
        if (isFiniteNumber(nextAngle)) state.angle = nextAngle;
      }
      if (cam.up && isFiniteNumber(cam.up.x) && isFiniteNumber(cam.up.y) && isFiniteNumber(cam.up.z)) {
        state.up = { x: cam.up.x, y: cam.up.y, z: cam.up.z };
      }
      if (cam.center && isFiniteNumber(cam.center.x) && isFiniteNumber(cam.center.y) && isFiniteNumber(cam.center.z)) {
        state.center = { x: cam.center.x, y: cam.center.y, z: cam.center.z };
      }
    }

    function startPerspectiveReturn() {
      if (state.returningToPerspective) return;
      state.returningToPerspective = true;
      state.returnToken += 1;
      var token = state.returnToken;
      var frameCount = 0;

      function stepReturn() {
        if (token !== state.returnToken) return;
        frameCount += 1;

        var canonicalUp = state.canonicalUp || { x: 0, y: 0, z: 1 };
        var canonicalCenter = state.canonicalCenter || { x: 0, y: 0, z: 0 };
        var bounce = Math.exp(-0.11 * frameCount) * Math.sin(0.55 * frameCount) * 0.05;
        var targetRadius = state.canonicalRadius * (1 + bounce);
        var targetHeight = state.canonicalHeight * (1 + bounce * 0.28);

        state.angle = state.angle + phaseDeltaNearest(state.baseAngle, state.angle) * 0.085;
        state.radius = lerp(state.radius, targetRadius, 0.07);
        state.height = lerp(state.height, targetHeight, 0.07);
        state.up = {
          x: lerp(state.up.x, canonicalUp.x, 0.085),
          y: lerp(state.up.y, canonicalUp.y, 0.085),
          z: lerp(state.up.z, canonicalUp.z, 0.085)
        };
        state.center = {
          x: lerp(state.center.x, canonicalCenter.x, 0.085),
          y: lerp(state.center.y, canonicalCenter.y, 0.085),
          z: lerp(state.center.z, canonicalCenter.z, 0.085)
        };

        var camera = {
          eye: {
            x: state.radius * Math.cos(state.angle),
            y: state.radius * Math.sin(state.angle),
            z: state.height
          },
          up: state.up,
          center: state.center
        };

        state.programmaticRelayout = true;
        Plotly.relayout(plotDiv, { "scene.camera": camera })
          .catch(function () {})
          .finally(function () {
            state.programmaticRelayout = false;
          });

        var done =
          Math.abs(phaseDeltaNearest(state.baseAngle, state.angle)) < 0.01 &&
          Math.abs(state.radius - state.canonicalRadius) < 0.012 &&
          Math.abs(state.height - state.canonicalHeight) < 0.012 &&
          Math.abs(state.center.x - canonicalCenter.x) < 0.005 &&
          Math.abs(state.center.y - canonicalCenter.y) < 0.005 &&
          Math.abs(state.center.z - canonicalCenter.z) < 0.005 &&
          frameCount > 14;

        if (done) {
          state.returningToPerspective = false;
          state.currentStep = 0;
          state.returnRaf = 0;
          return;
        }

        state.returnRaf = requestAnimationFrame(stepReturn);
      }

      state.returnRaf = requestAnimationFrame(stepReturn);
    }

    function setInteractionActive(active) {
      state.userInteracting = active;
      if (active) {
        state.autoRotate = false;
        state.currentStep = 0;
        state.programmaticRelayout = false;
        if (state.interactionReleaseTimer) {
          clearTimeout(state.interactionReleaseTimer);
          state.interactionReleaseTimer = null;
        }
        syncFromLiveCamera();
        if (state.returningToPerspective) {
          state.returningToPerspective = false;
          state.returnToken += 1;
          if (state.returnRaf) {
            cancelAnimationFrame(state.returnRaf);
            state.returnRaf = 0;
          }
        }
      } else {
        if (state.interactionReleaseTimer) {
          clearTimeout(state.interactionReleaseTimer);
          state.interactionReleaseTimer = null;
        }
        syncFromLiveCamera();
        state.autoRotate = true;
        startPerspectiveReturn();
      }
    }

    function bumpInteractionFromRelayout() {
      setInteractionActive(true);
      if (state.interactionReleaseTimer) {
        clearTimeout(state.interactionReleaseTimer);
      }
      state.interactionReleaseTimer = setTimeout(function () {
        state.interactionReleaseTimer = null;
        if (!state.pointerActive) {
          setInteractionActive(false);
        }
      }, 140);
    }

    if (!plotDiv.__tensorInteractionHooked) {
      plotDiv.__tensorInteractionHooked = true;
      state.pointerDownHandler = function () {
        if (state.pointerActive) return;
        state.pointerActive = true;
        setInteractionActive(true);
      };
      state.mouseDownHandler = function () {
        if (state.pointerActive) return;
        state.pointerActive = true;
        setInteractionActive(true);
      };
      state.touchStartHandler = function () {
        if (state.pointerActive) return;
        state.pointerActive = true;
        setInteractionActive(true);
      };
      plotDiv.addEventListener("pointerdown", state.pointerDownHandler, true);
      plotDiv.addEventListener("mousedown", state.mouseDownHandler, true);
      plotDiv.addEventListener("touchstart", state.touchStartHandler, { capture: true, passive: true });

      state.pointerUpHandler = function () {
        if (!state.pointerActive) return;
        state.pointerActive = false;
        setInteractionActive(false);
      };
      state.pointerCancelHandler = function () {
        if (!state.pointerActive) return;
        state.pointerActive = false;
        setInteractionActive(false);
      };
      window.addEventListener("pointerup", state.pointerUpHandler);
      window.addEventListener("pointercancel", state.pointerCancelHandler);
      window.addEventListener("mouseup", state.pointerUpHandler);
      window.addEventListener("touchend", state.pointerUpHandler, { passive: true });
      window.addEventListener("touchcancel", state.pointerCancelHandler, { passive: true });
    }

    if (!plotDiv.__tensorRelayoutHooked) {
      plotDiv.__tensorRelayoutHooked = true;
      function applyCameraEvent(ev) {
        if (state.programmaticRelayout) return;
        if (!ev) return;
        bumpInteractionFromRelayout();
        var camEvent = ev["scene.camera"] || null;
        var eye = ev["scene.camera.eye"] || (camEvent && camEvent.eye);
        if (eye && isFiniteNumber(eye.x) && isFiniteNumber(eye.y) && isFiniteNumber(eye.z)) {
          var nextRadius = Math.sqrt(eye.x * eye.x + eye.y * eye.y);
          var nextAngle = Math.atan2(eye.y, eye.x);
          if (isFiniteNumber(nextRadius) && nextRadius > 0.01) state.radius = nextRadius;
          if (isFiniteNumber(eye.z)) state.height = eye.z;
          if (isFiniteNumber(nextAngle)) state.angle = nextAngle;
        }
        var up = ev["scene.camera.up"] || (camEvent && camEvent.up);
        if (up && isFiniteNumber(up.x) && isFiniteNumber(up.y) && isFiniteNumber(up.z)) {
          state.up = { x: up.x, y: up.y, z: up.z };
        }
        var center = ev["scene.camera.center"] || (camEvent && camEvent.center);
        if (center && isFiniteNumber(center.x) && isFiniteNumber(center.y) && isFiniteNumber(center.z)) {
          state.center = { x: center.x, y: center.y, z: center.z };
        }
      }

      plotDiv.on("plotly_relayouting", applyCameraEvent);
      plotDiv.on("plotly_relayout", applyCameraEvent);
    }

    function tick() {
      state.baseAngle += state.baseStep;
      if (!state.autoRotate || state.userInteracting) return;
      if (state.returningToPerspective) return;

      if (state.currentStep < state.baseStep) {
        var accel = (state.period / state.glideMs) * state.baseStep;
        state.currentStep = Math.min(state.baseStep, state.currentStep + accel);
      }

      var drift = phaseDeltaNearest(state.baseAngle, state.angle);
      if (Math.abs(drift) > state.currentStep) {
        state.angle += (drift > 0 ? state.currentStep : -state.currentStep);
      } else {
        state.angle = state.baseAngle;
      }

      var camera = {
        eye: {
          x: state.radius * Math.cos(state.angle),
          y: state.radius * Math.sin(state.angle),
          z: state.height
        },
        up: state.up,
        center: state.center
      };
      state.programmaticRelayout = true;
      Plotly.relayout(plotDiv, { "scene.camera": camera })
        .catch(function () {})
        .finally(function () {
          state.programmaticRelayout = false;
        });
    }

    if (state.timer) {
      clearInterval(state.timer);
    }
    state.timer = setInterval(tick, state.period);
  }

  function buildGridFrameTraces(nx, ny, nz) {
    var FX = [], FY = [], FZ = [];
    var GX = [], GY = [], GZ = [];

    function addSeg(arrX, arrY, arrZ, p0, p1) {
      arrX.push(p0[0], p1[0], null);
      arrY.push(p0[1], p1[1], null);
      arrZ.push(p0[2], p1[2], null);
    }

    function addBox(arrX, arrY, arrZ, minC, maxX, maxY, maxZ) {
      var corners = [
        [minC, minC, minC],
        [maxX, minC, minC],
        [maxX, maxY, minC],
        [minC, maxY, minC],
        [minC, minC, maxZ],
        [maxX, minC, maxZ],
        [maxX, maxY, maxZ],
        [minC, maxY, maxZ]
      ];
      var edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];
      edges.forEach(function (e) {
        addSeg(arrX, arrY, arrZ, corners[e[0]], corners[e[1]]);
      });
    }

    // Outer frame
    addBox(FX, FY, FZ, 0, nx, ny, nz);

    // Grid lines for each cell boundary
    for (var t = 0; t <= ny; t++) {
      for (var u = 0; u <= nz; u++) {
        addSeg(GX, GY, GZ, [0, t, u], [nx, t, u]);
      }
    }
    for (var t = 0; t <= nx; t++) {
      for (var u = 0; u <= nz; u++) {
        addSeg(GX, GY, GZ, [t, 0, u], [t, ny, u]);
      }
    }
    for (var t = 0; t <= nx; t++) {
      for (var u = 0; u <= ny; u++) {
        addSeg(GX, GY, GZ, [t, u, 0], [t, u, nz]);
      }
    }

    var frame = {
      type: "scatter3d",
      x: FX,
      y: FY,
      z: FZ,
      mode: "lines",
      line: {
        color: "rgba(0,0,0,0.9)",
        width: 4
      },
      hoverinfo: "skip",
      showlegend: false,
      name: "frame"
    };

    var grid = {
      type: "scatter3d",
      x: GX,
      y: GY,
      z: GZ,
      mode: "lines",
      line: {
        color: "rgba(0,0,0,0.25)",
        width: 2
      },
      hoverinfo: "skip",
      showlegend: false,
      name: "grid"
    };

    return { frame: frame, grid: grid };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
