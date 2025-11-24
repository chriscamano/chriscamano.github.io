window.MathJax = window.MathJax || {};
window.MathJax.tex = window.MathJax.tex || {};
window.MathJax.tex.macros = Object.assign(window.MathJax.tex.macros || {}, {


  /* === Number systems === */
  bbR: "{\\mathbb{R}}",
  bbC: "{\\mathbb{C}}",
  bbF: "{\\mathbb{F}}",
  Sym: "{\\mathbb{H}}",
  nat: "{\\mathbb{N}}",
  onevec: "{\\mathbb{1}}",
  indicator: "{\\mathbb{1}}",

  /* === Bold vectors === */
  va: "{\\boldsymbol{a}}",
  vb: "{\\boldsymbol{b}}",
  vc: "{\\boldsymbol{c}}",
  vd: "{\\boldsymbol{d}}",
  ve: "{\\boldsymbol{e}}",
  vf: "{\\boldsymbol{f}}",
  vg: "{\\boldsymbol{g}}",
  vh: "{\\boldsymbol{h}}",
  vi: "{\\boldsymbol{i}}",
  vj: "{\\boldsymbol{j}}",
  vk: "{\\boldsymbol{k}}",
  vl: "{\\boldsymbol{\\ell}}",
  vm: "{\\boldsymbol{m}}",
  vn: "{\\boldsymbol{n}}",
  vo: "{\\boldsymbol{o}}",
  vp: "{\\boldsymbol{p}}",
  vq: "{\\boldsymbol{q}}",
  vr: "{\\boldsymbol{r}}",
  vs: "{\\boldsymbol{s}}",
  vt: "{\\boldsymbol{t}}",
  vu: "{\\boldsymbol{u}}",
  vv: "{\\boldsymbol{v}}",
  vw: "{\\boldsymbol{w}}",
  vx: "{\\boldsymbol{x}}",
  vy: "{\\boldsymbol{y}}",
  vz: "{\\boldsymbol{z}}",
  vell: "{\\boldsymbol{\\ell}}",

  valpha: "{\\boldsymbol{\\alpha}}",
  vbeta: "{\\boldsymbol{\\beta}}",
  vgamma: "{\\boldsymbol{\\gamma}}",
  vdelta: "{\\boldsymbol{\\delta}}",
  vepsilon: "{\\boldsymbol{\\epsilon}}",
  vvarepsilon: "{\\boldsymbol{\\varepsilon}}",
  vzeta: "{\\boldsymbol{\\zeta}}",
  veta: "{\\boldsymbol{\\eta}}",
  vtheta: "{\\boldsymbol{\\theta}}",
  vvartheta: "{\\boldsymbol{\\vartheta}}",
  viota: "{\\boldsymbol{\\iota}}",
  vkappa: "{\\boldsymbol{\\kappa}}",
  vlambda: "{\\boldsymbol{\\lambda}}",
  vmu: "{\\boldsymbol{\\mu}}",
  vnu: "{\\boldsymbol{\\nu}}",
  vxi: "{\\boldsymbol{\\xi}}",
  vpi: "{\\boldsymbol{\\pi}}",
  vvarpi: "{\\boldsymbol{\\varpi}}",
  vrho: "{\\boldsymbol{\\rho}}",
  vvarrho: "{\\boldsymbol{\\varrho}}",
  vsigma: "{\\boldsymbol{\\sigma}}",
  vvarsigma: "{\\boldsymbol{\\varsigma}}",
  vtau: "{\\boldsymbol{\\tau}}",
  vupsilon: "{\\boldsymbol{\\upsilon}}",
  vphi: "{\\boldsymbol{\\phi}}",
  vvarphi: "{\\boldsymbol{\\varphi}}",
  vchi: "{\\boldsymbol{\\chi}}",
  vpsi: "{\\boldsymbol{\\psi}}",
  vomega: "{\\boldsymbol{\\omega}}",

  veps: "{\\boldsymbol{\\varepsilon}}",
  vone: "{\\mathbf{1}}",
  vzero: "{\\mathbf{0}}",

  /* === Bold matrices === */
  mA: "{\\mathbf{A}}", mB: "{\\mathbf{B}}", mC: "{\\mathbf{C}}",
  mD: "{\\mathbf{D}}", mE: "{\\mathbf{E}}", mF: "{\\mathbf{F}}",
  mG: "{\\mathbf{G}}", mH: "{\\mathbf{H}}", mI: "{\\mathbf{I}}",
  mJ: "{\\mathbf{J}}", mK: "{\\mathbf{K}}", mL: "{\\mathbf{L}}",
  mM: "{\\mathbf{M}}", mN: "{\\mathbf{N}}", mO: "{\\mathbf{O}}",
  mP: "{\\mathbf{P}}", mQ: "{\\mathbf{Q}}", mR: "{\\mathbf{R}}",
  mS: "{\\mathbf{S}}", mT: "{\\mathbf{T}}", mU: "{\\mathbf{U}}",
  mV: "{\\mathbf{V}}", mW: "{\\mathbf{W}}", mX: "{\\mathbf{X}}",
  mY: "{\\mathbf{Y}}", mZ: "{\\mathbf{Z}}",

  mSigma: "{\\mathbf{\\Sigma}}",
  mDelta: "{\\mathbf{\\Delta}}",
  mOmega: "{\\mathbf{\\Omega}}",
  mPi: "{\\mathbf{\\Pi}}",

  /* === Sans-serif matrices === */
  sfA: "{\\mathsf{A}}", sfB: "{\\mathsf{B}}", sfC: "{\\mathsf{C}}",
  sfD: "{\\mathsf{D}}", sfE: "{\\mathsf{E}}", sfF: "{\\mathsf{F}}",
  sfG: "{\\mathsf{G}}", sfH: "{\\mathsf{H}}", sfI: "{\\mathsf{I}}",
  sfJ: "{\\mathsf{J}}", sfK: "{\\mathsf{K}}", sfL: "{\\mathsf{L}}",
  sfM: "{\\mathsf{M}}", sfN: "{\\mathsf{N}}", sfO: "{\\mathsf{O}}",
  sfP: "{\\mathsf{P}}", sfQ: "{\\mathsf{Q}}", sfR: "{\\mathsf{R}}",
  sfS: "{\\mathsf{S}}", sfT: "{\\mathsf{T}}", sfU: "{\\mathsf{U}}",
  sfV: "{\\mathsf{V}}", sfW: "{\\mathsf{W}}", sfX: "{\\mathsf{X}}",
  sfY: "{\\mathsf{Y}}", sfZ: "{\\mathsf{Z}}",

  /* === Bold calligraphic tensors === */
  tA: "{\\boldsymbol{\\mathcal{A}}}", tB: "{\\boldsymbol{\\mathcal{B}}}",
  tC: "{\\boldsymbol{\\mathcal{C}}}", tD: "{\\boldsymbol{\\mathcal{D}}}",
  tE: "{\\boldsymbol{\\mathcal{E}}}", tF: "{\\boldsymbol{\\mathcal{F}}}",
  tG: "{\\boldsymbol{\\mathcal{G}}}", tH: "{\\boldsymbol{\\mathcal{H}}}",
  tI: "{\\boldsymbol{\\mathcal{I}}}", tJ: "{\\boldsymbol{\\mathcal{J}}}",
  tK: "{\\boldsymbol{\\mathcal{K}}}", tL: "{\\boldsymbol{\\mathcal{L}}}",
  tM: "{\\boldsymbol{\\mathcal{M}}}", tN: "{\\boldsymbol{\\mathcal{N}}}",
  tO: "{\\boldsymbol{\\mathcal{O}}}", tP: "{\\boldsymbol{\\mathcal{P}}}",
  tQ: "{\\boldsymbol{\\mathcal{Q}}}", tR: "{\\boldsymbol{\\mathcal{R}}}",
  tS: "{\\boldsymbol{\\mathcal{S}}}", 
  tT: "{\\boldsymbol{\\mathcal{T}}}",
  tU: "{\\boldsymbol{\\mathcal{U}}}", tV: "{\\boldsymbol{\\mathcal{V}}}",
  tW: "{\\boldsymbol{\\mathcal{W}}}", tX: "{\\boldsymbol{\\mathcal{X}}}",
  tY: "{\\boldsymbol{\\mathcal{Y}}}", tZ: "{\\boldsymbol{\\mathcal{Z}}}",
  tPsi: "{\\boldsymbol{\\Psi}}",
  tDelta: "{\\boldsymbol{\\Delta}}",

  /* === Constants / Operators === */
  rA: "{\\mathrm{A}}", rB: "{\\mathrm{B}}", rC: "{\\mathrm{C}}",
  rD: "{\\mathrm{D}}", rE: "{\\mathrm{E}}", rF: "{\\mathrm{F}}",
  rG: "{\\mathrm{G}}", rH: "{\\mathrm{H}}", rI: "{\\mathrm{I}}",
  rJ: "{\\mathrm{J}}", rK: "{\\mathrm{K}}", rL: "{\\mathrm{L}}",
  rM: "{\\mathrm{M}}", rN: "{\\mathrm{N}}", rO: "{\\mathrm{O}}",
  rP: "{\\mathrm{P}}", rQ: "{\\mathrm{Q}}", rR: "{\\mathrm{R}}",
  rS: "{\\mathrm{S}}", rT: "{\\mathrm{T}}", rU: "{\\mathrm{U}}",
  rV: "{\\mathrm{V}}", rW: "{\\mathrm{W}}", rX: "{\\mathrm{X}}",
  rY: "{\\mathrm{Y}}", rZ: "{\\mathrm{Z}}",

  cA: "{\\mathcal{A}}", cB: "{\\mathcal{B}}", cC: "{\\mathcal{C}}",
  cD: "{\\mathcal{D}}", cE: "{\\mathcal{E}}", cF: "{\\mathcal{F}}",
  cG: "{\\mathcal{G}}", cH: "{\\mathcal{H}}", cI: "{\\mathcal{I}}",
  cJ: "{\\mathcal{J}}", cK: "{\\mathcal{K}}", cL: "{\\mathcal{L}}",
  cM: "{\\mathcal{M}}", cN: "{\\mathcal{N}}", cO: "{\\mathcal{O}}",
  cP: "{\\mathcal{P}}", cQ: "{\\mathcal{Q}}", cR: "{\\mathcal{R}}",
  cS: "{\\mathcal{S}}", cT: "{\\mathcal{T}}", cU: "{\\mathcal{U}}",
  cV: "{\\mathcal{V}}", cW: "{\\mathcal{W}}", cX: "{\\mathcal{X}}",
  cY: "{\\mathcal{Y}}", cZ: "{\\mathcal{Z}}",

  /* === Probability / Statistics === */
  Var: "{\\mathrm{Var}}",
  Cov: "{\\mathrm{Cov}}",
  PP: "{\\mathrm{PP}}",
  COPY: "{\\mathrm{COPY}}",
  E: "{\\mathbb{E}}",
  prob: "{\\mathbb{P}}",
  Unif: "{\\textsc{Unif}}",

  normal: "{\\textsc{normal}}",
  uniform: "{\\textsc{Uniform}}",
  bernoulli: "{\\textsc{Bernoulli}}",
  binomial: "{\\textsc{Binomial}}",
  poisson: "{\\textsc{Poisson}}",
  geometric: "{\\textsc{Geometric}}",
  exponential: "{\\textsc{Exponential}}",
  multinomial: "{\\textsc{Multinomial}}",

  /* === Asymptotics === */
  order: "{\\mathcal{O}}",
  orderish: "{\\widetilde{\\mathcal{O}}}",

  /* === Utility === */
  defeq: "{\\;\\vcentcolon=\\;}",
  eps: "{\\varepsilon}",
  skron: "{\\mathbin{|{\\mkern-4mu}\\otimes{\\mkern-4mu}|}}",
  Tp: "{\\mathrm{Tp}}",
  set: ["{\\mathsf{#1}}", 1],
  e: "{\\mathrm{e}}",
  im: "{\\mathrm{i}}",
  Re: "{\\mathrm{Re}}",
  Im: "{\\mathrm{Im}}",
  hat: ["{\\widehat{#1}}", 1],
  tilde: ["{\\widetilde{#1}}", 1],

  /* === Common functions === */
  inner: ["{\\langle #1, #2 \\rangle}", 2],
  norm: ["{\\lVert #1 \\rVert}", 1],
  /* === Tensor tools === */

  matop: ["{\\operatorname{mat}_{#1}\\!\\left(#2\\right)}", 2],
  mat:   ["{\\operatorname{mat}\\!\\left(#1\\right)}", 1],

  vecop: ["{\\operatorname{vec}\\!\\left(#1\\right)}", 1],
  tenop: ["{\\operatorname{ten}\\!\\left(#1\\right)}", 1],

  cp: ["{\\times_{#1}^{#2}}", 2],

  multisum: ["{\\sum_{#1_1=1}^{#3}\\mkern-3mu\\cdots\\mkern-3mu\\sum_{#1_{#2}=1}^{#3}}", 3],

  bigKron: ["{\\bigotimes_{r=1}^{#1}}", 1],

  tspace:   ["{\\mathbb{F}^{d_1 \\times \\cdots \\times d_{#1}}}", 1],
  Rtspace:  ["{\\mathbb{R}^{d_1 \\times \\cdots \\times d_{#1}}}", 1],

  otspace:  ["{(\\mathbb{F}^d)^{\\otimes #1}}", 1],
  Cdtensor: ["{(\\mathbb{C}^{d})^{\\otimes #1}}", 1],
  Rdtensor: ["{(\\mathbb{R}^{d})^{\\otimes #1}}", 1],

  lex: ["{\\ell_{#1}\\!\\left(#2\\right)}", 2],

  rmps: "{\\mathsf{rMPS}}",
  mps:  "{\\mathsf{MPS}}",
  mpo:  "{\\mathsf{MPO}}",

  rmpss: "{\\mathsf{rMPSs}}",
  mpss:  "{\\mathsf{MPSs}}",
  mpos:  "{\\mathsf{MPOs}}",

  trps: "{\\mathsf{TRPs}}",
  trp:  "{\\mathsf{TRP}}"

});

