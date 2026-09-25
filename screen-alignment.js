/* Project the existing interactive iOS screen onto the actual GLB's OLED face.
   The four model-viewer hotspots are anchored to the supplied iPhone mesh. */
(() => {
  'use strict';
  const viewer = document.getElementById('phoneModel');
  const phone = document.getElementById('phone');
  if (!viewer || !phone) return;
  const names = ['tl', 'tr', 'br', 'bl'];
  let queued = false;
  let retries = 0;

  function matrixFor(c, w, h) {
    const [tl, tr, br, bl] = c;
    const dx1 = tr.x - br.x, dy1 = tr.y - br.y;
    const dx2 = bl.x - br.x, dy2 = bl.y - br.y;
    const dx3 = tl.x - tr.x + br.x - bl.x;
    const dy3 = tl.y - tr.y + br.y - bl.y;
    const determinant = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(determinant) < 0.001 || !w || !h) return null;
    const g = (dx3 * dy2 - dx2 * dy3) / determinant;
    const k = (dx1 * dy3 - dx3 * dy1) / determinant;
    const a = tr.x - tl.x + g * tr.x;
    const b = bl.x - tl.x + k * bl.x;
    const d = tr.y - tl.y + g * tr.y;
    const e = bl.y - tl.y + k * bl.y;
    const m = [a / w, d / w, 0, g / w,
               b / h, e / h, 0, k / h,
               0, 0, 1, 0,
               tl.x, tl.y, 0, 1];
    return m.every(Number.isFinite) ? 'matrix3d(' + m.join(',') + ')' : null;
  }

  function fallback() {
    document.body.classList.remove('screen-aligned', 'model-ready');
    phone.style.removeProperty('--phone-projection');
  }

  function align() {
    queued = false;
    if (!viewer.loaded || !document.body.classList.contains('model-ready')) return;
    if (typeof viewer.queryHotspot !== 'function') {
      console.warn('3D screen projection unavailable; retaining original interactive phone.');
      fallback();
      return;
    }
    const anchors = names.map(name => viewer.queryHotspot('hotspot-screen-' + name));
    if (anchors.some(h => !h || !h.canvasPosition)) {
      if (++retries <= 90) request();
      else fallback();
      return;
    }
    retries = 0;
    // Apps appear only on the front; the rear cameras remain unobstructed.
    if (anchors.some(h => h.facingCamera === false)) {
      document.body.classList.remove('screen-aligned');
      return;
    }
    const points = anchors.map(h => h.canvasPosition);
    if (points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) {
      document.body.classList.remove('screen-aligned');
      return;
    }
    const projectedWidth = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
    if (projectedWidth < 18) {
      document.body.classList.remove('screen-aligned');
      return;
    }
    const transform = matrixFor(points, phone.offsetWidth, phone.offsetHeight);
    if (!transform) {
      document.body.classList.remove('screen-aligned');
      return;
    }
    phone.style.setProperty('--phone-projection', transform);
    document.body.classList.add('screen-aligned');
  }

  function request() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(align);
  }
  viewer.addEventListener('load', request);
  viewer.addEventListener('camera-change', request);
  viewer.addEventListener('error', fallback);
  if (viewer.loaded) request();
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(request).observe(viewer);
  else window.addEventListener('resize', request);
})();