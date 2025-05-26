---
title: Sucessive Randomized Compression (SRC)
slug: randomized-tensor-contraction
---
<hr class="page-title-hr" />
In my paper [Successive randomized compression](https://arxiv.org/abs/2504.06475) we design a randomized algorithm for the *compressed* MPO-MPS product. Compared to alternatives, it is either faster (contract-then-compress, density 
matrix) or more accurate (zip-up, variational/fitting) than other leading methods for this problem.
<figure class="gallery-figure mathjax-process">
  <img src="/assets/img/gallery/Fig2_final.png" alt="Scaling comparison across dimensions." />
 <figcaption class="image-titlecard">
    (<strong>MPO-MPS Contraction Algorithm Runtime and Accuracy Comparison</strong>)
  </figcaption>  <div class="image-discussion mathjax-process">
  This synthetic experiment measures the (log-scaled) runtime and relative error of approximate MPO-MPS contraction algorithms with respect to a precomputed machine-accuracy contract-then-compress baseline. The input MPS and MPO are populated with uniformly random entries in \([\alpha,1]\) for \(\alpha=-0.5\). Both the MPO and MPS are $n=100$ tensors long with uniform MPO/MPS bond dimension $50$. Complete code for all of the methods in this plot can be found  
  <a href="https://github.com/chriscamano/RandomMPOMPS/blob/main/code/tensornetwork/contraction.py" target="_blank"><strong>here</strong></a>, and <a href="https://github.com/chriscamano/RandomMPOMPS/blob/main/code/tensornetwork/rounding.py" target="_blank"><strong>here</strong></a>.
</div>
</figure>




<figure class="gallery-figure mathjax-process">
  <img src="/assets/img/gallery/TDVP.png" alt="Contraction path evolution." />
  <figcaption class="image-titlecard">
    (<strong>TDVP unitary time evolution</strong>)
  </figcaption>

  <div class="image-discussion mathjax-process">
    <p>To demonstrate the effectiveness of SRC, we simulate the unitary time evolution 
      \[
        |\boldsymbol{\psi}(t)\rangle = \mathrm{e}^{-i t \mathbf{H}}\,|\boldsymbol{\psi}(0)\rangle 
      \]
      starting from a locally preturbed initial state vector of $n=101$ spins
      \[
        |\boldsymbol{\psi}(0)\rangle = \mathrm{e}^{i(\pi/4)\,\mathbf{Y}_{\lceil n/2\rceil}}\,|\boldsymbol{\psi}_{\min}\rangle\in \mathbb{C}^{2^{101}},
      \]
      under the long‐range interacting XY Hamiltonian
      \[
        \mathbf{H} = \frac{1}{2}\sum_{1 \le i < j \le n} \frac{J}{|i - j|^{1.5}}\bigl(\mathbf{X}_i\mathbf{X}_j + \mathbf{Y}_i\mathbf{Y}_j\bigr)\in \mathbb{C}^{2^{101}\times 2^{101}}.
      \]
      Here, \(|\boldsymbol{\psi}_{\min}\rangle\) is the ground state of \(\mathbf{H}\) obtained via DMRG-2. We then examine the magnetization dynamics of this defected system using the Time-Dependent Variational Principle with Ancillary Krylov Subspace method (<a href="https://arxiv.org/pdf/2005.06104" target="_blank"><strong>GSE-TDVP1</strong></a>). GSE-TDVP1 builds a Krylov space \(\mathcal{K}\) from compressed MPO–MPS products and uses it to enrich the MPS at each timestep—an extension of the original <a href="https://arxiv.org/abs/1103.0936" target="_blank"><strong>TDVP</strong></a> algorithm. Additional details for this experiment can be found in the full <a href="https://arxiv.org/abs/2504.06475" target="_blank"><strong>paper</strong></a>.</p>

    <p>Full Python implementations are available here:</p>
    <ul>
      <li><a href="https://github.com/chriscamano/RandomMPOMPS/blob/main/code/quantum/dmrg.py" target="_blank"><strong>DMRG-2 implementation</strong></a></li>
      <li><a href="https://github.com/chriscamano/RandomMPOMPS/blob/main/code/quantum/tdvp.py" target="_blank"><strong>GSE-TDVP1 implementation</strong></a></li>
    </ul>
  </div>
</figure>

