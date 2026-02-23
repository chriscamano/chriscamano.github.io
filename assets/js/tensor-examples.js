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

  function renderFullTensor(plotDiv, config) {
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
        bgcolor: "rgba(0,0,0,0)"
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)"
    };

    Plotly.newPlot(plotDiv, cubeTraces.concat([traceLabels, box.frame, box.grid]), layout, {
      displayModeBar: false,
      responsive: true
    });

    registerSyncedRotation(plotDiv, { x: 2.0, y: 1.75, z: 1.35 });
  }

  function renderBasisTensor(plotDiv, config) {
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
        bgcolor: "rgba(0,0,0,0)"
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)"
    };

    Plotly.newPlot(plotDiv, [traceVoxels, traceOne, box.frame, box.grid], layout, {
      displayModeBar: false,
      responsive: true
    });

    var baseEye = isInline ? { x: 1.6, y: 1.35, z: 1.05 } : { x: 1.8, y: 1.5, z: 1.15 };
    registerSyncedRotation(plotDiv, baseEye);
  }

  function init() {
    var examples = window.__tensorExamples || [];
    if (!examples.length) return;

    ensurePlotly(function () {
      var activePlots = window.__tensorActivePlots || [];
      var visiblePlots = window.__tensorVisiblePlots || new Set();
      window.__tensorActivePlots = activePlots;
      window.__tensorVisiblePlots = visiblePlots;
      var MAX_ACTIVE_PLOTS = 16;

      function purgePlot(div) {
        if (!div || !div.dataset.plotInitialized) return;
        try {
          Plotly.purge(div);
        } catch {}
        div.dataset.plotInitialized = "";
        if (window.__tensorRotation && window.__tensorRotation.plots) {
          window.__tensorRotation.plots = window.__tensorRotation.plots.filter(function (p) {
            return p.div !== div;
          });
        }
      }

      function activatePlot(div, renderFn) {
        if (div.dataset.plotInitialized === "true") return;
        if (activePlots.length >= MAX_ACTIVE_PLOTS) {
          var idxToPurge = activePlots.findIndex(function (el) {
            return !visiblePlots.has(el);
          });
          if (idxToPurge >= 0) {
            var toPurge = activePlots.splice(idxToPurge, 1)[0];
            purgePlot(toPurge);
          }
        }
        renderFn();
        div.dataset.plotInitialized = "true";
        activePlots.push(div);
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var div = entry.target;
          if (entry.isIntersecting) {
            visiblePlots.add(div);
          } else {
            visiblePlots.delete(div);
          }
          if (!entry.isIntersecting) return;
          if (div.__tensorRenderFn) {
            activatePlot(div, div.__tensorRenderFn);
          }
        });
      }, { rootMargin: "1000px 0px" });

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
          if (el.open) return;
          el.querySelectorAll(".tensor-plot").forEach(function (div) {
            purgePlot(div);
          });
        });
      });
    });
  }

  function renderTensor3(plotDiv, config) {
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
        bgcolor: "rgba(0,0,0,0)"
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)"
    };

    Plotly.newPlot(plotDiv, [traceVoxels, box.frame, box.grid], layout, {
      displayModeBar: false,
      responsive: true
    });

    var baseEye = config.baseEye || { x: 2.6, y: 2.2, z: 1.6 };
    registerSyncedRotation(plotDiv, baseEye);
  }

  function registerSyncedRotation(plotDiv, baseEye) {
    var rot = window.__tensorRotation || {
      plots: [],
      angle: 0,
      step: 0.012,
      period: 90,
      timer: null
    };

    var radius = Math.sqrt(baseEye.x * baseEye.x + baseEye.y * baseEye.y);
    var height = baseEye.z;
    rot.plots.push({ div: plotDiv, radius: radius, height: height });
    window.__tensorRotation = rot;

    if (!rot.timer) {
      rot.timer = setInterval(function () {
        rot.angle += rot.step;
        rot.plots.forEach(function (p) {
          var eye = {
            x: p.radius * Math.cos(rot.angle),
            y: p.radius * Math.sin(rot.angle),
            z: p.height
          };
          Plotly.relayout(p.div, { "scene.camera.eye": eye });
        });
      }, rot.period);
    }
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
