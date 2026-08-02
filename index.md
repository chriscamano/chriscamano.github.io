---
layout: homepage
title: About Me
---

<div class="home-tensor-block">
  <div class="tensor-controls-stack">
    <div class="tensor-reroll-control">
      <button id="tensor-reroll-btn" class="tensor-reroll-btn" type="button" aria-label="Reroll tensor sample">
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <g transform="translate(3 4) rotate(-11 20 20)">
            <rect x="2" y="2" width="34" height="34" rx="7" ry="7" fill="#111"/>
            <circle cx="10" cy="10" r="2.4" fill="#f5f5f5"/>
            <circle cx="28" cy="10" r="2.4" fill="#f5f5f5"/>
            <circle cx="19" cy="19" r="2.4" fill="#f5f5f5"/>
            <circle cx="10" cy="28" r="2.4" fill="#f5f5f5"/>
            <circle cx="28" cy="28" r="2.4" fill="#f5f5f5"/>
          </g>
          <g transform="translate(31 25) rotate(12 15 15)">
            <rect x="1.5" y="1.5" width="30" height="30" rx="6.5" ry="6.5" fill="#111"/>
            <circle cx="9" cy="9" r="2.3" fill="#f5f5f5"/>
            <circle cx="16.5" cy="16.5" r="2.3" fill="#f5f5f5"/>
            <circle cx="24" cy="24" r="2.3" fill="#f5f5f5"/>
          </g>
        </svg>
      </button>
      <span class="tensor-reroll-label">re-roll</span>
    </div>
    <div class="tensor-reroll-control">
      <button id="tensor-symmetry-btn" class="tensor-reroll-btn" type="button" aria-label="Toggle symmetry planes and axis view" aria-pressed="false">
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <rect x="8" y="8" width="48" height="48" rx="7" ry="7" fill="none" stroke="#111" stroke-width="2.4" opacity="0.35"/>
          <line x1="10" y1="54" x2="54" y2="10" stroke="#c73e2a" stroke-width="3.6" stroke-linecap="round"/>
          <circle cx="10" cy="54" r="3" fill="#c73e2a"/>
          <circle cx="54" cy="10" r="3" fill="#c73e2a"/>
        </svg>
      </button>
      <span class="tensor-reroll-label">symmetry</span>
    </div>
  </div>
  <div class="tensor-plot-stack">
    <div id="tensor-plot-back" class="tensor-plot-layer tensor-plot-back" aria-hidden="true"></div>
    <div id="tensor-plot-front" class="tensor-plot-layer tensor-plot-front"></div>
  </div>
  <p class="tensor-caption"><strong>A sparse, symmetric random 3-tensor</strong></p>
</div>

I’m a second-year PhD student in the [Applied and Computational Mathematics department](https://www.cms.caltech.edu/academics/grad/grad_acm) at Caltech, advised by Professor [Joel Tropp](https://tropp.caltech.edu). My research focuses on the intersection of randomized numerical linear algebra (rNLA) and large-scale data science, with an emphasis on *random tensors*.

<p class="clear-tensor-float">I am currently funded through the <a href="https://www.nsfgrfp.org">National Science Foundation Graduate Research Fellowship</a> and the <a href="https://www.cms.caltech.edu/research/kortschak-scholars">Kortschak Scholars Fellowship</a>.</p>

<h2 id="research-interests" style="margin: 2px 0px -15px;">Research Interests</h2>

<hr style="border: none; height: 3px; background-color: #463935; margin: 1em 0;">

- <span style="font-size:1.05em; font-weight:bold;">Randomized Numerical Linear Algebra</span>: Sketching, low-rank matrix approximation, randomized eigencomputation, and fast algorithms.
- <span style="font-size:1.05em; font-weight:bold;">Tensor Networks and Quantum Simulation</span>: Matrix Product State (MPS) and Matrix Product Operator (MPO) representations, randomized tensor network algorithms, and efficient Hamiltonian time evolution/ground state preparation.

{% include_relative _includes/publications.md %}

<h2 id="news" style="margin: 2px 0px -15px;padding-top:1em;">News</h2>
<hr style="border: none; height: 3px; background-color: #463935; margin: 1em 0;">
- **[June 2026]** Invited to speak at the [ETH Zurich Data, Algorithms, Combinatorics, and Optimization (DACO) Seminar](https://math.ethz.ch/sam/news-and-events/daco-seminar.html) on moment calculations for random tensor networks using Penrose diagrams.
- **[June 2026]** Invited to speak at the Bernoulli Center for Fundamental Studies [RandNLA workshop](https://sites.google.com/view/randnlaworkshop/home) on [randomized tensor network dimension reduction](https://arxiv.org/abs/2606.15350).
- **[June 2026]** Invited for a research stay at EPFL to work with [Laura Grigori](https://who.rocq.inria.fr/Laura.Grigori/) on random tensor networks.
- **[May 2026]** Invited to speak at the [2026 International Linear Algebra Society Conference](https://ilas2026.math.vt.edu/) on randomized tensor network Krylov methods.
- **[Feb. 2026]** Attended the [ICERM workshop on Randomized Numerical Linear Algebra](https://icerm.brown.edu/program/semester_program_workshop/sp-s26-w1), presenting a poster on [sparse and tensor sketching](https://arxiv.org/abs/2508.21189).
- **[Jan. 2026]** Invited to speak at the [SIAM Symposium on Simplicity in Algorithms (SOSA 2026)](https://simons.berkeley.edu/workshops/linear-systems-eigenvalue-problems) on [debiasing polynomial regression with random matrix theory](https://arxiv.org/abs/2508.05920).


<details>
<summary style="cursor:pointer; font-weight:bold;font-size:1.25em;">Older news</summary>

<hr style="border: none; height: 2px; background-color: #463935; margin: 0.5em 0;">

<div markdown="1">

- **[Oct. 2025]** Attended the [Simons Institute workshop on Linear Systems and Eigenvalue Problems](https://simons.berkeley.edu/workshops/linear-systems-eigenvalue-problems), presenting a poster on [sparse and tensor sketching](https://arxiv.org/abs/2508.21189).
- **[Aug. 2025]** Attended the [Institute of Pure and Applied Mathematics (IPAM) RNLA workshop](https://www.ipam.ucla.edu/programs/special-events-and-conferences/research-collaboration-workshop-randomized-numerical-linear-algebra-rnla/) on randomized Krylov methods.
- **[Apr. 2025]** Invited to speak at [Southern California Applied Math Symposium](https://www.math.uci.edu/node/38364) on randomized tensor networks.
- **[Apr. 2025]** Invited to speak at [UCSD Mathematics of Information, Data, and Signals Seminar](https://sites.google.com/ucsd.edu/ucsd-minds/home) on randomized tensor networks.
- **[Feb. 2025]** Invited to speak at the [Argonne National Laboratory Toward Next-Generation Ecosystems for Scientific Computing workshop](https://events.cels.anl.gov/event/602/registrations/268/) on randomized tensor networks.
- **[Mar. 2024]** Awarded the NSF GRFP & Kortschak fellowships 🎉.  
- **[Feb. 2024]** Accepted to the Caltech PhD program 🎉.  
- **[Jan. 2024]** Invited to speak at the [Joint Math Meeting](https://jointmathematicsmeetings.org/jmm) 2024 on randomized tensor networks.  
- **[Oct. 2023]** Invited to speak on UMAP at the [Great Minds in STEM conference](https://greatmindsinstem.org/) 2023 (3rd place).  
- **[Jun. 2023]** Invited to research with [Joel Tropp](https://tropp.caltech.edu/) and [Ethan Epperly](https://www.ethanepperly.com) at Caltech University on randomized tensor networks.  
- **[Jun. 2023]** Invited to the [Mathematical Science Research Institute (MSRI)](https://www.slmath.org) Formalization of Mathematics summer school to learn the *Lean4* language. Project culminated with a PR to [*mathlib4*](https://github.com/leanprover-community/mathlib4).  
- **[Jan. 2023]** Invited to speak on randomized eigensolvers & tensor networks at the [Joint Math Meeting](https://jointmathematicsmeetings.org/jmm) 2023.  
- **[Jun. 2022]** Invited to research with [Xiaoye Li](https://crd.lbl.gov/divisions/amcr/applied-mathematics-dept/scalable-solvers/members/staff-members/xiaoye-li/) and [Roel Van Beeumen](https://crd.lbl.gov/divisions/amcr/applied-mathematics-dept/scalable-solvers/members/staff-members/roel-van-beeumen/) at [Lawrence Berkeley National Laboratory](https://crd.lbl.gov/divisions/amcr/computational-science-dept/).  

</div>
</details>
