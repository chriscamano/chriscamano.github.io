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
      step: 0.012,
      glideMs: 1200,
      programmatic: false,
      period: 90,
      timer: null
    };

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function wrapAngle(a) {
      while (a > Math.PI) a -= 2 * Math.PI;
      while (a < -Math.PI) a += 2 * Math.PI;
      return a;
    }

    function getTracked(div) {
      return rot.plots.find(function (p) { return p.div === div; });
    }

    var radius = Math.sqrt(baseEye.x * baseEye.x + baseEye.y * baseEye.y);
    var height = baseEye.z;
    var initAngle = Math.atan2(baseEye.y, baseEye.x);
    var tracked = getTracked(plotDiv);

    if (tracked) {
      tracked.radius = radius;
      tracked.height = height;
      tracked.canonicalRadius = radius;
      tracked.canonicalHeight = height;
      tracked.canonicalEye = { x: baseEye.x, y: baseEye.y, z: baseEye.z };
      tracked.canonicalUp = tracked.canonicalUp || { x: 0, y: 0, z: 1 };
      tracked.canonicalCenter = tracked.canonicalCenter || { x: 0, y: 0, z: 0 };
      tracked.up = tracked.up || { x: 0, y: 0, z: 1 };
      tracked.center = tracked.center || { x: 0, y: 0, z: 0 };
      tracked.angle = typeof tracked.angle === "number" ? tracked.angle : initAngle;
      tracked.baseAngle = typeof tracked.baseAngle === "number" ? tracked.baseAngle : initAngle;
      tracked.currentStep = typeof tracked.currentStep === "number" ? tracked.currentStep : rot.step;
      tracked.interacting = false;
      tracked.returning = false;
      tracked.returnToken = tracked.returnToken || 0;
    } else {
      tracked = {
        div: plotDiv,
        radius: radius,
        height: height,
        canonicalRadius: radius,
        canonicalHeight: height,
        canonicalEye: { x: baseEye.x, y: baseEye.y, z: baseEye.z },
        canonicalUp: { x: 0, y: 0, z: 1 },
        canonicalCenter: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 0, z: 1 },
        center: { x: 0, y: 0, z: 0 },
        angle: initAngle,
        baseAngle: initAngle,
        currentStep: rot.step,
        interacting: false,
        returning: false,
        returnToken: 0
      };
      rot.plots.push(tracked);
    }

    window.__tensorRotation = rot;

    function syncFromPlotCamera(div) {
      if (!div || !div._fullLayout || !div._fullLayout.scene || !div._fullLayout.scene.camera) return;
      var cam = div._fullLayout.scene.camera;
      var eye = cam.eye;
      if (!eye) return;
      var p = getTracked(div);
      if (!p) return;
      p.radius = Math.sqrt(eye.x * eye.x + eye.y * eye.y);
      p.height = eye.z;
      p.angle = Math.atan2(eye.y, eye.x);
      if (cam.up) p.up = { x: cam.up.x, y: cam.up.y, z: cam.up.z };
      if (cam.center) p.center = { x: cam.center.x, y: cam.center.y, z: cam.center.z };
    }

    function setInteractionActive(active, div) {
      var p = getTracked(div);
      if (!p) return;
      p.interacting = active;
      if (active) {
        if (p.returning) {
          p.returning = false;
          p.returnToken += 1;
        }
        p.currentStep = 0;
      } else {
        syncFromPlotCamera(div);
      }
    }

    function startCanonicalReturn(div) {
      var p = getTracked(div);
      if (!p || p.returning) return;

      p.returning = true;
      p.returnToken += 1;
      var token = p.returnToken;
      var frameCount = 0;

      function stepReturn(ts) {
        if (p.returnToken !== token) return;
        frameCount += 1;

        var canonicalUp = p.canonicalUp || { x: 0, y: 0, z: 1 };
        var canonicalCenter = p.canonicalCenter || { x: 0, y: 0, z: 0 };

        // Gentle chase to the moving baseline angle and canonical view geometry.
        p.angle = p.angle + wrapAngle(p.baseAngle - p.angle) * 0.08;
        p.radius = lerp(p.radius, p.canonicalRadius, 0.065);
        p.height = lerp(p.height, p.canonicalHeight, 0.065);
        p.up = {
          x: lerp(p.up.x, canonicalUp.x, 0.085),
          y: lerp(p.up.y, canonicalUp.y, 0.085),
          z: lerp(p.up.z, canonicalUp.z, 0.085)
        };
        p.center = {
          x: lerp(p.center.x, canonicalCenter.x, 0.085),
          y: lerp(p.center.y, canonicalCenter.y, 0.085),
          z: lerp(p.center.z, canonicalCenter.z, 0.085)
        };

        var camera = {
          eye: {
            x: p.radius * Math.cos(p.angle),
            y: p.radius * Math.sin(p.angle),
            z: p.height
          },
          up: p.up,
          center: p.center
        };

        rot.programmatic = true;
        Plotly.relayout(div, { "scene.camera": camera })
          .catch(function () {})
          .finally(function () {
            rot.programmatic = false;
          });

        var done =
          Math.abs(p.radius - p.canonicalRadius) < 0.01 &&
          Math.abs(p.height - p.canonicalHeight) < 0.01 &&
          Math.abs(wrapAngle(p.baseAngle - p.angle)) < 0.008 &&
          Math.abs(p.center.x - canonicalCenter.x) < 0.005 &&
          Math.abs(p.center.y - canonicalCenter.y) < 0.005 &&
          Math.abs(p.center.z - canonicalCenter.z) < 0.005 &&
          frameCount > 14;

        if (done) {
          p.returning = false;
          p.currentStep = 0;
          return;
        }

        requestAnimationFrame(stepReturn);
      }

      requestAnimationFrame(stepReturn);
    }

    if (!plotDiv.__tensorInteractionHooked) {
      plotDiv.__tensorInteractionHooked = true;
      plotDiv.__tensorPointerActive = false;

      plotDiv.addEventListener("pointerdown", function (ev) {
        if (plotDiv.__tensorPointerActive) return;
        plotDiv.__tensorPointerActive = true;
        setInteractionActive(true, plotDiv);
      });

      window.addEventListener("pointerup", function (ev) {
        if (!plotDiv.__tensorPointerActive) return;
        plotDiv.__tensorPointerActive = false;
        requestAnimationFrame(function () {
          setInteractionActive(false, plotDiv);
          startCanonicalReturn(plotDiv);
        });
      });

      window.addEventListener("pointercancel", function (ev) {
        if (!plotDiv.__tensorPointerActive) return;
        plotDiv.__tensorPointerActive = false;
        setInteractionActive(false, plotDiv);
        startCanonicalReturn(plotDiv);
      });
    }

    if (!plotDiv.__tensorRelayoutHooked) {
      plotDiv.__tensorRelayoutHooked = true;
      function applyCameraEvent(ev) {
        if (rot.programmatic || !ev) return;
        var camEvent = ev["scene.camera"] || null;
        var eye = ev["scene.camera.eye"] || (camEvent && camEvent.eye);
        if (!eye) return;
        var p = getTracked(plotDiv);
        if (!p) return;
        p.radius = Math.sqrt(eye.x * eye.x + eye.y * eye.y);
        p.height = eye.z;
        p.angle = Math.atan2(eye.y, eye.x);
        var up = ev["scene.camera.up"] || (camEvent && camEvent.up);
        if (up) p.up = { x: up.x, y: up.y, z: up.z };
        var center = ev["scene.camera.center"] || (camEvent && camEvent.center);
        if (center) p.center = { x: center.x, y: center.y, z: center.z };
      }

      plotDiv.on("plotly_relayouting", applyCameraEvent);
      plotDiv.on("plotly_relayout", applyCameraEvent);
    }

    if (!rot.timer) {
      rot.timer = setInterval(function () {
        rot.programmatic = true;
        var relayoutJobs = [];

        rot.plots.forEach(function (p) {
          p.baseAngle = p.baseAngle + rot.step;
          if (p.interacting || p.returning) return;

          if (p.currentStep < rot.step) {
            var accel = (rot.period / rot.glideMs) * rot.step;
            p.currentStep = Math.min(rot.step, p.currentStep + accel);
          }

          var drift = wrapAngle(p.baseAngle - p.angle);
          if (Math.abs(drift) > p.currentStep) {
            p.angle += (drift > 0 ? p.currentStep : -p.currentStep);
          } else {
            p.angle = p.baseAngle;
          }

          var eye = {
            x: p.radius * Math.cos(p.angle),
            y: p.radius * Math.sin(p.angle),
            z: p.height
          };
          var camera = { eye: eye };
          if (p.up) camera.up = p.up;
          if (p.center) camera.center = p.center;
          relayoutJobs.push(Plotly.relayout(p.div, { "scene.camera": camera }));
        });

        Promise.allSettled(relayoutJobs).finally(function () {
          rot.programmatic = false;
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
