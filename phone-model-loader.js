(function () {
  'use strict';
  // Replace only the visual phone shell. Keep all existing iOS/Photos/Safari DOM intact.
  const MODEL_URL = './assets/Phone%2017%20Pro%20Max%20Simple.glb';
  function mount() {
    const phone = document.getElementById('phone');
    if (!phone || phone.querySelector('.real-iphone-model')) return;
    const viewer = document.createElement('model-viewer');
    viewer.className = 'real-iphone-model';
    viewer.setAttribute('src', MODEL_URL);
    viewer.setAttribute('alt', 'iPhone 17 Pro Max 3D model');
    viewer.setAttribute('camera-orbit', '180deg 90deg auto');
    viewer.setAttribute('camera-target', 'auto auto auto');
    viewer.setAttribute('field-of-view', '30deg');
    viewer.setAttribute('interaction-prompt', 'none');
    viewer.setAttribute('shadow-intensity', '1');
    viewer.setAttribute('exposure', '1.15');
    viewer.setAttribute('loading', 'eager');
    viewer.setAttribute('reveal', 'auto');
    viewer.setAttribute('ar', 'false');
    viewer.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;background:transparent;--poster-color:transparent;pointer-events:none;z-index:0;backface-visibility:visible;';
    function syncPose() {
      const rootStyle = document.documentElement.style;
      const rx = Number.parseFloat(rootStyle.getPropertyValue('--rx')) || 0;
      const ry = Number.parseFloat(rootStyle.getPropertyValue('--ry')) || 0;
      // Front of the GLB is on -Z, back/cameras on +Z.
      viewer.setAttribute('camera-orbit', (180 - ry) + 'deg ' + (90 + rx) + 'deg auto');
    }
    viewer.addEventListener('load', function () {
      syncPose();
      phone.classList.add('has-external-model');
    }, {once:true});
    viewer.addEventListener('error', function () {
      // A missing asset must never turn the live site into a black/empty page.
      phone.classList.remove('has-external-model');
      viewer.remove();
    }, {once:true});
    phone.prepend(viewer);
    const observer = new MutationObserver(syncPose);
    observer.observe(document.documentElement, {attributes:true, attributeFilter:['style']});
    syncPose();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true});
  else mount();
})();