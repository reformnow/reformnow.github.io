
  document.write(
    '<script src="' + location.protocol + '//' +
    (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1&amp;port=35729"' +
    '></' +
    'script>');


{"@context":"https://schema.org","@type":"WebPage","description":"How the land was divided among the sons of Israel.","headline":"The Twelve Tribes of Israel","url":"http://localhost:4000/maps/tribes/"}









  document.addEventListener('DOMContentLoaded', function() {
    /* Initializing the map centered on the biblical world */
    var map = L.map('bible-map', {
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: 'topleft'
      }
    }).setView([31.8, 35.3], 8);

    var globalMarkers = {};
    window.openMapPopup = function(id) {
      if (globalMarkers[id]) {
        var m = globalMarkers[id];
        if (typeof m.layerGroup !== 'undefined' && !map.hasLayer(m.layerGroup)) {
          map.addLayer(m.layerGroup);
        }
        /* Animate to the target location, then open the popup to avoid animation collision */
        var targetZoom = map.getZoom() < 9 ? 9 : map.getZoom();
        map.flyTo(m.getLatLng(), targetZoom, { duration: 0.6 });
        
        map.once('moveend', function() {
          m.openPopup();
        });
        /* No need to scrollIntoView('bible-map') since the map is now sticky on the screen. */
      }
    };

    /* Base Map selection */
    
      var baseTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 13,
        className: 'parchment-filter'
      }).addTo(map);
    

    /* Add a subtle reference label layer on top */
    var referenceLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 13,
      opacity: 0.35,
      className: 'parchment-filter'
    }).addTo(map);

    var overlayMaps = {};
    var bounds = L.latLngBounds();

    /* ===== GeoJSON loading (preferred path) ===== */
    
      fetch('/assets/geo/tribes.geojson?v=' + new Date().getTime())
        .then(function(response) { return response.json(); })
        .then(function(data) {
          var geojsonLayer = L.geoJSON(data, {
            style: function(feature) {
              if (feature.properties.isWater) {
                return {
                  fillColor: feature.properties.color,
                  weight: feature.geometry.type.includes('LineString') ? 4 : 1.5,
                  opacity: 0.9,
                  color: feature.properties.color,
                  fillOpacity: 0.7
                };
              }
              return {
                fillColor: feature.properties.color || '#888',
                weight: 1.8,
                opacity: 1,
                color: '#665c49',
                fillOpacity: 0.45
              };
            },
            onEachFeature: function(feature, layer) {
              var p = feature.properties;

              /* Bilingual popup with verse reference */
              var popup = '<div style="font-family: Georgia, serif; min-width: 220px; font-size: 1.05em;">';
              if (p.image) {
                popup += "<img src='" + p.image + "' style='width: 100%; height: auto; max-height: 160px; object-fit: cover; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(0,0,0,0.1);'>";
              }
              popup += '<div style="font-size: 1.15em; font-weight: 700; color: #3e2723; border-bottom: 2px solid #d4af37; padding-bottom: 6px; margin-bottom: 8px;">';
              popup += p.name + ' / ' + (p.name_zh || '') + '</div>';
              if (p.desc) {
                popup += '<div style="font-size: 1.0em; color: #444; line-height: 1.5;">' + p.desc + '</div>';
              }
              if (p.desc_zh) {
                popup += '<div style="font-size: 1.0em; color: #555; line-height: 1.5; margin-top: 6px;">' + p.desc_zh + '</div>';
              }
              if (p.verse) {
                popup += '<div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #e0d5c1; font-style: italic; color: #b8860b; font-size: 0.9em;">';
                popup += '📖 ' + p.verse;
                if (p.verse_zh) popup += ' / ' + p.verse_zh;
                popup += '</div>';
              }
              popup += '</div>';
              layer.bindPopup(popup);

              /* Permanent center label (tribe name) */
              layer.bindTooltip(
                '<div style="text-align:center; font-weight:700;">' + p.name + '<br>' + (p.name_zh || '') + '</div>',
                { permanent: true, direction: 'center', className: 'bible-label', opacity: 0.8 }
              );

              /* Hover highlight */
              layer.on('mouseover', function() {
                this.setStyle({ fillOpacity: 0.65, weight: 3 });
              });
              layer.on('mouseout', function() {
                geojsonLayer.resetStyle(this);
              });
            }
          }).addTo(map);

          /* --- Local Editing Support --- */
          if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
            map.pm.setGlobalOptions({ limitMarkersToCount: 50 });
            map.pm.addControls({
              position: 'topleft',
              drawPolyline: true,
              drawPolygon: true,
              drawMarker: true,
              drawCircleMarker: false,
              drawRectangle: true,
              drawCircle: false,
              drawText: false,
              editMode: true,
              dragMode: true,
              cutPolygon: true,
              removalMode: true
            });

            /* Push drawn shapes into the exportable geojsonLayer */
            map.on('pm:create', function(e) {
              var newLayer = e.layer;
              if (!newLayer.feature) {
                newLayer.feature = { type: "Feature", properties: { name: "New Feature", color: "#888" } };
              }
              geojsonLayer.addLayer(newLayer);
            });
            map.on('pm:remove', function(e) {
              if (geojsonLayer.hasLayer(e.layer)) {
                geojsonLayer.removeLayer(e.layer);
              }
            });

            var SaveControl = L.Control.extend({
              options: { position: 'topleft' },
              onAdd: function (map_instance) {
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                container.style.backgroundColor = 'white';
                container.style.padding = '8px 12px';
                container.style.cursor = 'pointer';
                container.style.fontWeight = 'bold';
                container.style.color = '#3e2723';
                container.innerHTML = '💾 Download Edits';
                
                container.onclick = function(e) {
                  e.stopPropagation();
                  var newData = geojsonLayer.toGeoJSON();
                  container.innerHTML = '⏳ Saving...';
                  
                  fetch('http://localhost:4001/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: 'tribes.geojson', data: newData })
                  })
                  .then(response => {
                    if (response.ok) {
                      container.innerHTML = '✅ Saved Locally!';
                      setTimeout(() => container.innerHTML = '💾 Save to Codebase', 3000);
                    } else {
                      container.innerHTML = '❌ Save Failed';
                      setTimeout(() => container.innerHTML = '💾 Save to Codebase', 3000);
                    }
                  })
                  .catch(err => {
                    console.error('Save error:', err);
                    container.innerHTML = '❌ Server Not Running';
                    setTimeout(() => container.innerHTML = '💾 Save to Codebase', 3000);
                  });
                }
                return container;
              }
            });
            map.addControl(new SaveControl());

            /* --- Image Reference Tool --- */
            var DigitizingControl = L.Control.extend({
              options: { position: 'bottomright' },
              onAdd: function (map_instance) {
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                container.style.backgroundColor = 'white';
                container.style.padding = '10px';
                container.style.width = '250px';
                container.style.maxHeight = '90vh';
                container.style.overflowY = 'auto';
                container.innerHTML = `
                  <div style="font-weight:bold; margin-bottom:8px; font-size:13px; color:#3e2723;">Reference Image</div>
                  <input type="file" id="ref-image-upload" accept="image/*" style="width:100%; margin-bottom:8px; font-size:11px;">
                  
                  <div id="ref-image-controls" style="display:none; font-size:12px; color:#444;">
                    <label style="display:flex; justify-content:space-between; margin-top:5px; align-items:center;">Opacity: 
                      <input type="number" id="val-opacity" min="0" max="1" step="0.01" value="0.5" style="width:50px; font-size:11px; padding:2px; height:20px; text-align:right;">
                    </label>
                    <input type="range" id="slider-opacity" min="0" max="1" step="0.01" value="0.5" style="width:100%;">
                    
                    <label style="display:flex; justify-content:space-between; margin-top:5px; align-items:center;">Rotation (°): 
                      <input type="number" id="val-rot" min="-180" max="180" step="1" value="0" style="width:50px; font-size:11px; padding:2px; height:20px; text-align:right;">
                    </label>
                    <input type="range" id="slider-rot" min="-180" max="180" step="1" value="0" style="width:100%;">
                    
                    <label style="display:flex; justify-content:space-between; margin-top:5px; align-items:center;">Overall Scale: 
                      <input type="number" id="val-scale" min="0.1" max="100" step="0.01" value="1.0" style="width:50px; font-size:11px; padding:2px; height:20px; text-align:right;">
                    </label>
                    <input type="range" id="slider-scale" min="0.1" max="10" step="0.01" value="1" style="width:100%;">

                    <label style="display:flex; justify-content:space-between; margin-top:5px; align-items:center;">Scale X (Width): 
                      <input type="number" id="val-scale-x" min="0.1" max="100" step="0.01" value="1.0" style="width:50px; font-size:11px; padding:2px; height:20px; text-align:right;">
                    </label>
                    <input type="range" id="slider-scale-x" min="0.1" max="10" step="0.01" value="1" style="width:100%;">

                    <label style="display:flex; justify-content:space-between; margin-top:5px; align-items:center;">Scale Y (Height): 
                      <input type="number" id="val-scale-y" min="0.1" max="100" step="0.01" value="1.0" style="width:50px; font-size:11px; padding:2px; height:20px; text-align:right;">
                    </label>
                    <input type="range" id="slider-scale-y" min="0.1" max="10" step="0.01" value="1" style="width:100%;">

                    <label style="display:block; margin-top:5px;">Fine-tune N/S (Lat)</label>
                    <input type="range" id="slider-lat" min="-1" max="1" step="0.001" value="0" style="width:100%;">

                    <label style="display:block; margin-top:5px;">Fine-tune E/W (Lng)</label>
                    <input type="range" id="slider-lng" min="-1" max="1" step="0.001" value="0" style="width:100%;">
                    
                    <button id="btn-ref-center" style="margin-top:8px; width:100%; padding:4px;">Move to Center</button>
                    <button id="btn-ref-hide" style="margin-top:4px; width:100%; padding:4px;">Toggle Visibility</button>
                    <button id="btn-ref-pin" style="margin-top:4px; width:100%; padding:4px;">Pin Image (Disable Dragging)</button>
                    <button id="btn-ref-save" style="margin-top:4px; width:100%; padding:4px; background:#4CAF50; color:white; font-weight:bold; border:none; border-radius:3px;">💾 Save Map Reference</button>
                  </div>
                `;
                
                L.DomEvent.disableClickPropagation(container);
                L.DomEvent.disableScrollPropagation(container);

                setTimeout(() => {
                  var uploadInput = document.getElementById('ref-image-upload');
                  var controlsDiv = document.getElementById('ref-image-controls');
                  var sOp = document.getElementById('slider-opacity');
                  var sRot = document.getElementById('slider-rot');
                  var sScale = document.getElementById('slider-scale');
                  var sScaleX = document.getElementById('slider-scale-x');
                  var sScaleY = document.getElementById('slider-scale-y');
                  var sLat = document.getElementById('slider-lat');
                  var sLng = document.getElementById('slider-lng');
                  
                  var vOp = document.getElementById('val-opacity');
                  var vRot = document.getElementById('val-rot');
                  var vScale = document.getElementById('val-scale');
                  var vScaleX = document.getElementById('val-scale-x');
                  var vScaleY = document.getElementById('val-scale-y');

                  var refOverlay = null;
                  var svgEl = null;
                  var imgEl = null;

                  var baseLat = 0;
                  var baseLng = 0;
                  var baseWidth = 0.5;
                  var baseHeight = 0.5;
                  
                  var naturalWidth = 100;
                  var naturalHeight = 100;

                  var isDraggingImg = false;
                  var isPinned = false;
                  var dragStartPoint = null;
                  var startDragLat = null;
                  var startDragLng = null;

                  document.getElementById('btn-ref-pin').onclick = function(e) {
                    e.preventDefault();
                    isPinned = !isPinned;
                    this.innerText = isPinned ? 'Unpin Image (Enable Dragging)' : 'Pin Image (Disable Dragging)';
                    if (refOverlay) refOverlay.getElement().style.cursor = isPinned ? 'default' : 'move';
                    
                    var saveBtn = document.getElementById('btn-ref-save');
                    if(isPinned) {
                      saveBtn.style.opacity = '1';
                      saveBtn.style.cursor = 'pointer';
                      saveBtn.innerText = '💾 Save Map Reference';
                    } else {
                      saveBtn.style.opacity = '0.5';
                      saveBtn.style.cursor = 'not-allowed';
                      saveBtn.innerText = '🔒 Pin to Enable Save';
                    }
                  };

                  document.getElementById('btn-ref-save').onclick = function(e) {
                    e.preventDefault();
                    if (!isPinned) {
                      alert("Please pin the image before saving to prevent accidental drag.");
                      return;
                    }
                    if(!imgEl) return;
                    var btn = this;
                    btn.innerText = '⏳ Saving...';
                    
                    var payload = {
                      imgUrl: imgEl.getAttribute('href'),
                      naturalWidth: naturalWidth, naturalHeight: naturalHeight,
                      baseLat: baseLat, baseLng: baseLng, baseWidth: baseWidth, baseHeight: baseHeight,
                      op: parseFloat(sOp.value), rot: parseFloat(sRot.value),
                      sc: parseFloat(sScale.value), scX: parseFloat(sScaleX.value), scY: parseFloat(sScaleY.value),
                      isPinned: isPinned
                    };
                    
                    var refName = 'tribes.geojson'.replace('.geojson', '_ref.json');
                    if(!refName || refName === 'tribes.geojson') refName = 'default_ref.json';

                    fetch('http://localhost:4001/save', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ filename: refName, data: payload })
                    }).then(r => {
                      if(r.ok) { btn.innerText = '✅ Saved to ' + refName; setTimeout(()=>btn.innerText='💾 Save Map Reference', 3000); }
                      else { btn.innerText = '❌ Failed'; setTimeout(()=>btn.innerText='💾 Save Map Reference', 3000); }
                    }).catch(err => {
                      btn.innerText = '❌ Server Not Running'; setTimeout(()=>btn.innerText='💾 Save Map Reference', 3000);
                    });
                  };

                  // Initial button state
                  document.getElementById('btn-ref-save').style.opacity = '0.5';
                  document.getElementById('btn-ref-save').style.cursor = 'not-allowed';
                  document.getElementById('btn-ref-save').innerText = '🔒 Pin to Enable Save';

                  function bindImageDrag() {
                    if(!refOverlay) return;
                    refOverlay.getElement().style.cursor = isPinned ? 'default' : 'move';
                    refOverlay.on('mousedown', function(e) {
                      if (isPinned) return;
                      isDraggingImg = true;
                      dragStartPoint = e.latlng;
                      startDragLat = baseLat;
                      startDragLng = baseLng;
                      map_instance.dragging.disable();
                    });
                  }

                  function updateOverlay() {
                    if (!refOverlay) return;
                    var op = parseFloat(sOp.value);
                    var rot = parseFloat(sRot.value);
                    var sc = parseFloat(sScale.value);
                    var scX = parseFloat(sScaleX.value);
                    var scY = parseFloat(sScaleY.value);
                    var dLat = parseFloat(sLat.value);
                    var dLng = parseFloat(sLng.value);

                    if(document.activeElement !== vOp) vOp.value = op.toFixed(2);
                    if(document.activeElement !== vRot) vRot.value = rot;
                    if(document.activeElement !== vScale) vScale.value = sc.toFixed(2);
                    if(document.activeElement !== vScaleX) vScaleX.value = scX.toFixed(2);
                    if(document.activeElement !== vScaleY) vScaleY.value = scY.toFixed(2);

                    imgEl.setAttribute('opacity', op);
                    imgEl.setAttribute('transform', 'rotate(' + rot + ' ' + (naturalWidth/2) + ' ' + (naturalHeight/2) + ')');
                    
                    var curBaseLat = baseLat + dLat;
                    var curBaseLng = baseLng + dLng;
                    
                    var curW = baseWidth * sc * scX;
                    var curH = baseHeight * sc * scY;

                    var bounds = [
                      [curBaseLat - curH/2, curBaseLng - curW/2],
                      [curBaseLat + curH/2, curBaseLng + curW/2]
                    ];
                    
                    refOverlay.setBounds(bounds);
                  }

                  uploadInput.addEventListener('change', function(e) {
                    var file = e.target.files[0];
                    if (!file) return;
                    var reader = new FileReader();
                    reader.onload = function(event) {
                      var imgUrl = event.target.result;
                      var tempImg = new Image();
                      tempImg.onload = function() {
                        naturalWidth = tempImg.width;
                        naturalHeight = tempImg.height;
                        var aspect = naturalWidth / naturalHeight;
                        
                        var mbounds = map_instance.getBounds();
                        baseWidth = mbounds.getEast() - mbounds.getWest();
                        baseHeight = mbounds.getNorth() - mbounds.getSouth();

                        var center = map_instance.getCenter();
                        baseLat = center.lat;
                        baseLng = center.lng;

                        sLat.value = 0;
                        sLng.value = 0;
                        sScale.value = 1;
                        sScaleX.value = 1;
                        sScaleY.value = 1;
                        sRot.value = 0;
                        sOp.value = 0.5;

                        if (refOverlay) {
                          map_instance.removeLayer(refOverlay);
                        }

                        svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                        svgEl.setAttribute('viewBox', '0 0 ' + naturalWidth + ' ' + naturalHeight);
                        svgEl.setAttribute('preserveAspectRatio', 'none');
                        
                        imgEl = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                        imgEl.setAttribute('href', imgUrl);
                        imgEl.setAttribute('x', '0');
                        imgEl.setAttribute('y', '0');
                        imgEl.setAttribute('width', naturalWidth);
                        imgEl.setAttribute('height', naturalHeight);
                        imgEl.setAttribute('preserveAspectRatio', 'none');
                        svgEl.appendChild(imgEl);

                        var bounds = [
                          [baseLat - baseHeight/2, baseLng - baseWidth/2],
                          [baseLat + baseHeight/2, baseLng + baseWidth/2]
                        ];

                        refOverlay = L.svgOverlay(svgEl, bounds, { interactive: true }).addTo(map_instance);
                        isPinned = false;
                        document.getElementById('btn-ref-pin').innerText = 'Pin Image (Disable Dragging)';
                        
                        var saveBtn = document.getElementById('btn-ref-save');
                        saveBtn.style.opacity = '0.5';
                        saveBtn.style.cursor = 'not-allowed';
                        saveBtn.innerText = '🔒 Pin to Enable Save';

                        bindImageDrag();

                        controlsDiv.style.display = 'block';
                        updateOverlay();
                      };
                      tempImg.src = imgUrl;
                    };
                    reader.readAsDataURL(file);
                  });

                  var refNameLoad = 'tribes.geojson'.replace('.geojson', '_ref.json');
                  if(refNameLoad && refNameLoad !== 'tribes.geojson') {
                    fetch('/assets/geo/' + refNameLoad + '?v=' + new Date().getTime())
                      .then(r => { if(r.ok) return r.json(); throw new Error('no ref'); })
                      .then(rd => {
                        naturalWidth = rd.naturalWidth;
                        naturalHeight = rd.naturalHeight;
                        baseLat = rd.baseLat;
                        baseLng = rd.baseLng;
                        baseWidth = rd.baseWidth;
                        baseHeight = rd.baseHeight;
                        
                        sOp.value = rd.op;
                        sRot.value = rd.rot;
                        sScale.value = rd.sc;
                        sScaleX.value = rd.scX;
                        sScaleY.value = rd.scY;
                        sLat.value = 0;
                        sLng.value = 0;

                        svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                        svgEl.setAttribute('viewBox', '0 0 ' + naturalWidth + ' ' + naturalHeight);
                        svgEl.setAttribute('preserveAspectRatio', 'none');
                        
                        imgEl = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                        imgEl.setAttribute('href', rd.imgUrl);
                        imgEl.setAttribute('x', '0');
                        imgEl.setAttribute('y', '0');
                        imgEl.setAttribute('width', naturalWidth);
                        imgEl.setAttribute('height', naturalHeight);
                        imgEl.setAttribute('preserveAspectRatio', 'none');
                        svgEl.appendChild(imgEl);

                        var bounds = [
                          [baseLat - baseHeight/2, baseLng - baseWidth/2],
                          [baseLat + baseHeight/2, baseLng + baseWidth/2]
                        ];

                        refOverlay = L.svgOverlay(svgEl, bounds, { interactive: true }).addTo(map_instance);
                        
                        isPinned = rd.isPinned;
                        // For backwards compatibility: if undefined, act as unpinned
                        if (isPinned === undefined) isPinned = false; 

                        var pBtn = document.getElementById('btn-ref-pin');
                        var sBtn = document.getElementById('btn-ref-save');

                        if(isPinned) {
                          pBtn.innerText = 'Unpin Image (Enable Dragging)';
                          sBtn.style.opacity = '1';
                          sBtn.style.cursor = 'pointer';
                          sBtn.innerText = '💾 Save Map Reference';
                        } else {
                          pBtn.innerText = 'Pin Image (Disable Dragging)';
                          sBtn.style.opacity = '0.5';
                          sBtn.style.cursor = 'not-allowed';
                          sBtn.innerText = '🔒 Pin to Enable Save';
                        }
                        
                        bindImageDrag();

                        controlsDiv.style.display = 'block';
                        updateOverlay();
                      })
                      .catch(e => { /* Ignore, no file or valid json */ });
                  }

                  map_instance.on('mousemove', function(e) {
                    if (!isDraggingImg || isPinned) return;
                    var dLat = e.latlng.lat - dragStartPoint.lat;
                    var dLng = e.latlng.lng - dragStartPoint.lng;
                    baseLat = startDragLat + dLat;
                    baseLng = startDragLng + dLng;
                    updateOverlay();
                  });

                  map_instance.on('mouseup', function(e) {
                    if (isDraggingImg) {
                      isDraggingImg = false;
                      map_instance.dragging.enable();
                    }
                  });

                  sOp.addEventListener('input', updateOverlay);
                  sRot.addEventListener('input', updateOverlay);
                  sScale.addEventListener('input', updateOverlay);
                  sScaleX.addEventListener('input', updateOverlay);
                  sScaleY.addEventListener('input', updateOverlay);
                  sLat.addEventListener('input', updateOverlay);
                  sLng.addEventListener('input', updateOverlay);

                  /* Bi-directional bindings for number inputs */
                  [
                    { num: vOp, slider: sOp },
                    { num: vRot, slider: sRot },
                    { num: vScale, slider: sScale },
                    { num: vScaleX, slider: sScaleX },
                    { num: vScaleY, slider: sScaleY }
                  ].forEach(pair => {
                    pair.num.addEventListener('input', function() {
                      pair.slider.value = this.value;
                      updateOverlay();
                    });
                  });

                  document.getElementById('btn-ref-center').addEventListener('click', function(e) {
                    e.preventDefault();
                    var center = map_instance.getCenter();
                    baseLat = center.lat;
                    baseLng = center.lng;
                    sLat.value = 0;
                    sLng.value = 0;
                    updateOverlay();
                  });

                  document.getElementById('btn-ref-hide').addEventListener('click', function(e) {
                    e.preventDefault();
                    if(!refOverlay) return;
                    if(map_instance.hasLayer(refOverlay)) {
                      map_instance.removeLayer(refOverlay);
                    } else {
                      map_instance.addLayer(refOverlay);
                    }
                  });
                  
                }, 200);

                return container;
              }
            });
            map.addControl(new DigitizingControl());
          }
          /* -------------------------- */

        })
        .catch(function(err) {
          console.error('Failed to load GeoJSON:', err);
        });

      /* ===== Load existing saved Map Reference if it exists (PUBLIC STATIC SITE ONLY) ===== */
      var isLocalEditor = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost');
      var refFile = 'tribes.geojson'.replace('.geojson', '_ref.json');
      if (!isLocalEditor && refFile && refFile !== 'tribes.geojson') {
        fetch('/assets/geo/' + refFile + '?v=' + new Date().getTime())
          .then(function(res) { if (res.ok) return res.json(); throw new Error('No ref'); })
          .then(function(rd) {
            var tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            tempSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            tempSvg.setAttribute('viewBox', '0 0 ' + rd.naturalWidth + ' ' + rd.naturalHeight);
            tempSvg.setAttribute('preserveAspectRatio', 'none');
            
            var tImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            tImg.setAttribute('href', rd.imgUrl);
            tImg.setAttribute('x', '0');
            tImg.setAttribute('y', '0');
            tImg.setAttribute('width', rd.naturalWidth);
            tImg.setAttribute('height', rd.naturalHeight);
            tImg.setAttribute('preserveAspectRatio', 'none');
            tImg.setAttribute('opacity', rd.op);
            tImg.setAttribute('transform', 'rotate(' + rd.rot + ' ' + (rd.naturalWidth/2) + ' ' + (rd.naturalHeight/2) + ')');
            tempSvg.appendChild(tImg);
            
            var curW = rd.baseWidth * rd.sc * rd.scX;
            var curH = rd.baseHeight * rd.sc * rd.scY;
            var curBounds = [
              [rd.baseLat - curH/2, rd.baseLng - curW/2],
              [rd.baseLat + curH/2, rd.baseLng + curW/2]
            ];
            L.svgOverlay(tempSvg, curBounds, {interactive: false}).addTo(map);
          })
          .catch(function() { /* silently ignore if absent */ });
      }
    

    /* ===== City markers ===== */
    
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">1</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([31.7767, 35.2342], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Jerusalem</strong><br>耶路撒冷</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>1. Jerusalem / 耶路撒冷</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>The city of David and the Temple.<br>大卫之城与圣殿所在地。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>2 Samuel 5:7 / 撒母耳记下 5:7</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_1'] = marker;
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">2</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([31.2447, 34.8408], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Beersheba</strong><br>别是巴</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>2. Beersheba / 别是巴</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>The southern boundary of the land.<br>以色列地最南端。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>Judges 20:1 / 士师记 20:1</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_2'] = marker;
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">3</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([33.249, 35.652], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Dan</strong><br>但</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>3. Dan / 但</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>The northern boundary of the land.<br>以色列地最北端。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>Judges 20:1 / 士师记 20:1</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_3'] = marker;
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">4</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([31.5251, 35.1022], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Hebron</strong><br>希伯仑</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>4. Hebron / 希伯仑</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>Where the patriarchs are buried; David's first capital.<br>先祖墓穴所在地，大卫最初作王之地。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>Genesis 23:2 / 创世记 23:2</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_4'] = marker;
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">5</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([32.2136, 35.2819], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Shechem</strong><br>示剑</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>5. Shechem / 示剑</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>Where Joshua renewed the covenant.<br>约书亚带民立约之地。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>Joshua 24:1 / 约书亚记 24:1</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_5'] = marker;
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">6</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([32.0557, 35.2896], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Shiloh</strong><br>示罗</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>6. Shiloh / 示罗</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>Location of the Tabernacle before Jerusalem.<br>圣殿迁至耶路撒冷前的会幕所在地。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>Joshua 18:1 / 约书亚记 18:1</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_6'] = marker;
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">7</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([31.8717, 35.4446], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Jericho</strong><br>耶利哥</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>7. Jericho / 耶利哥</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>The first city conquered by Israel.<br>以色列人进入迦南后攻取的首座城市。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>Joshua 6:1 / 约书亚记 6:1</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_7'] = marker;
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">8</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([31.9228, 35.2414], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Bethel</strong><br>伯特利</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>8. Bethel / 伯特利</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>Where Jacob saw the ladder to heaven.<br>雅各梦见天梯之地。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>Genesis 28:19 / 创世记 28:19</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_8'] = marker;
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">9</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([32.7021, 35.2977], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Nazareth</strong><br>拿撒勒</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>9. Nazareth / 拿撒勒</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>The childhood home of Jesus.<br>主耶稣肉身的故乡。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>Matthew 2:23 / 马太福音 2:23</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_9'] = marker;
      
        var markerIcon = L.divIcon({
          className: '',
          html: '<div class="numbered-marker" style="--marker-color: #d4af37;">10</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        var marker = L.marker([32.8811, 35.575], { icon: markerIcon }).addTo(map);
        
        marker.bindTooltip(
          "<div style='text-align:center;'><strong>Capernaum</strong><br>迦百农</div>", 
          { permanent: true, direction: "top", opacity: 0.9, className: 'bible-label', offset: [0, -10] }
        );

        var popupContent = "<div style='font-family: Georgia, serif; min-width: 220px;'>";
        
        popupContent += "<div style='font-size: 1.2em;'><strong>10. Capernaum / 迦百农</strong></div>";
        
        popupContent += "<div style='margin-top: 8px; opacity: 0.9; font-size: 1.05em; line-height: 1.45;'>The center of Jesus' ministry in Galilee.<br>耶稣在加利利事奉的中心。</div>";
        
        
          popupContent += "<div style='margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1); font-style: italic; color: #d4af37; font-weight: 600; font-size: 0.95em;'>Matthew 4:13 / 马太福音 4:13</div>";
        
        popupContent += "</div>";

        marker.bindPopup(popupContent);
        globalMarkers['loc_10'] = marker;
      
    

    /* ===== Subtle Reference Reference Cities ===== */
    

    /* ===== Vintage Ships ===== */
    

    /* ===== Legacy polygon rendering (fallback) ===== */
    
      
    

    /* ===== Route path rendering ===== */
    

    /* ===== Layer Groups for multiple toggleable journeys ===== */
    
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    

    /* ===== Reset Map Bounds Control ===== */
    var resetViewControl = L.control({position: 'topleft'});
    
    resetViewControl.onAdd = function (map_instance) {
      var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      div.innerHTML = '<a href="#" title="Center to Route" role="button" aria-label="Center Map" style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; color: #444; background: white;"><i class="fas fa-expand-arrows-alt" style="font-size: 1.1rem;"></i></a>';
      
      div.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof fitActiveLayers === 'function') {
          fitActiveLayers();
        } else if (bounds && bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
        } else {
          map.setView([31.8, 35.3], 8);
        }
      };
      
      return div;
    };
    
    resetViewControl.addTo(map);

    /* ===== Vintage Compass Rose Control ===== */
    var compassControl = L.control({position: 'bottomleft'});
    compassControl.onAdd = function(map_instance) {
      var div = L.DomUtil.create('div', 'leaflet-compass-rose');
      div.innerHTML = `
        <svg width="85" height="85" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.9; filter: drop-shadow(2px 3px 5px rgba(0,0,0,0.3)); pointer-events: none;">
          <g transform="translate(50,50)">
            <!-- Rings -->
            <circle cx="0" cy="0" r="32" fill="rgba(255, 245, 215, 0.6)" stroke="#6a5d4d" stroke-width="1"/>
            <circle cx="0" cy="0" r="28" fill="none" stroke="#6a5d4d" stroke-width="1" stroke-dasharray="2 3"/>
            
            <!-- Secondary Points (NE, SE, SW, NW) -->
            <g transform="rotate(45)">
              <polygon points="0,-28 5,-6 0,0 -5,-6" fill="#7a6b58" />
              <polygon points="0,-28 0,0 -5,-6" fill="#bca588" />
              <polygon points="0,28 5,6 0,0 -5,6" fill="#7a6b58" />
              <polygon points="0,28 0,0 -5,6" fill="#bca588" />
              <polygon points="28,0 6,5 0,0 6,-5" fill="#7a6b58" />
              <polygon points="28,0 0,0 6,-5" fill="#bca588" />
              <polygon points="-28,0 -6,5 0,0 -6,-5" fill="#7a6b58" />
              <polygon points="-28,0 0,0 -6,-5" fill="#bca588" />
            </g>

            <!-- Primary Points -->
            <polygon points="0,-40 7,-7 0,0 -7,-7" fill="#3e2723" />
            <polygon points="0,-40 0,0 -7,-7" fill="#8c7b65" />
            <polygon points="0,38 7,7 0,0 -7,7" fill="#4e342e" />
            <polygon points="0,38 0,0 -7,7" fill="#9c8b75" />
            <polygon points="38,0 7,7 0,0 7,-7" fill="#4e342e" />
            <polygon points="38,0 0,0 7,-7" fill="#9c8b75" />
            <polygon points="-38,0 -7,7 0,0 -7,-7" fill="#4e342e" />
            <polygon points="-38,0 0,0 -7,-7" fill="#9c8b75" />

            <!-- Center -->
            <circle cx="0" cy="0" r="3.5" fill="#d4af37" stroke="#3e2723" stroke-width="1"/>

            <!-- Labels -->
            <text x="0" y="-43" font-family="Georgia, serif" font-size="15" font-weight="bold" fill="#3e2723" text-anchor="middle">N</text>
            <text x="0" y="49" font-family="Georgia, serif" font-size="11" font-weight="bold" fill="#4e342e" text-anchor="middle">S</text>
            <text x="44" y="4" font-family="Georgia, serif" font-size="11" font-weight="bold" fill="#4e342e" text-anchor="middle">E</text>
            <text x="-44" y="4" font-family="Georgia, serif" font-size="11" font-weight="bold" fill="#4e342e" text-anchor="middle">W</text>
          </g>
        </svg>
      `;
      div.style.marginBottom = '20px';
      div.style.marginLeft = '10px';
      return div;
    };
    compassControl.addTo(map);

    /* Handle fullscreen resize issues */
    map.on('fullscreenchange', function () {
      /* Need a slight delay to allow the CSS dimensional change to take place */
      setTimeout(function() {
        map.invalidateSize();
        if (typeof fitActiveLayers === 'function') {
          fitActiveLayers();
        } else if (bounds && bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      }, 250);
    });

    /* ===== Setup Sidebar List ===== */
    
      var panelWrapper = document.getElementById('panel-wrapper');
      if (panelWrapper) {
        var sidebarHtml = '<div class="access"><section><h2 class="panel-heading"><span class="lang-en">Locations</span><span class="lang-zh">行进地点</span></h2><ul class="map-sidebar-list">';

        
          sidebarHtml += '<div class="map-sidebar-group">';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_1\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">1</div>' +
              '<div class="map-sidebar-text"><strong>Jerusalem</strong><br><span class="text-muted" style="font-size:0.85em;">耶路撒冷</span></div>' +
            '</li>';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_2\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">2</div>' +
              '<div class="map-sidebar-text"><strong>Beersheba</strong><br><span class="text-muted" style="font-size:0.85em;">别是巴</span></div>' +
            '</li>';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_3\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">3</div>' +
              '<div class="map-sidebar-text"><strong>Dan</strong><br><span class="text-muted" style="font-size:0.85em;">但</span></div>' +
            '</li>';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_4\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">4</div>' +
              '<div class="map-sidebar-text"><strong>Hebron</strong><br><span class="text-muted" style="font-size:0.85em;">希伯仑</span></div>' +
            '</li>';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_5\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">5</div>' +
              '<div class="map-sidebar-text"><strong>Shechem</strong><br><span class="text-muted" style="font-size:0.85em;">示剑</span></div>' +
            '</li>';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_6\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">6</div>' +
              '<div class="map-sidebar-text"><strong>Shiloh</strong><br><span class="text-muted" style="font-size:0.85em;">示罗</span></div>' +
            '</li>';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_7\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">7</div>' +
              '<div class="map-sidebar-text"><strong>Jericho</strong><br><span class="text-muted" style="font-size:0.85em;">耶利哥</span></div>' +
            '</li>';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_8\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">8</div>' +
              '<div class="map-sidebar-text"><strong>Bethel</strong><br><span class="text-muted" style="font-size:0.85em;">伯特利</span></div>' +
            '</li>';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_9\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">9</div>' +
              '<div class="map-sidebar-text"><strong>Nazareth</strong><br><span class="text-muted" style="font-size:0.85em;">拿撒勒</span></div>' +
            '</li>';
          
            sidebarHtml += '<li class="map-sidebar-item" onclick="openMapPopup(\'loc_10\')">' +
              '<div class="map-sidebar-number" style="background-color: var(--marker-color, #d4af37);">10</div>' +
              '<div class="map-sidebar-text"><strong>Capernaum</strong><br><span class="text-muted" style="font-size:0.85em;">迦百农</span></div>' +
            '</li>';
          
          sidebarHtml += '</div>';
        

        sidebarHtml += '</ul></section></div>';
        panelWrapper.innerHTML = sidebarHtml;
      }
    

  });


  
  document.addEventListener('DOMContentLoaded', () => {
    SimpleJekyllSearch({
      searchInput: document.getElementById('search-input'),
      resultsContainer: document.getElementById('search-results'),
      json: '/assets/js/data/search.json',
      searchResultTemplate: '  <article class="px-1 px-sm-2 px-lg-4 px-xl-0">    <header>      <h2><a href="{url}">{title}</a></h2>      <div class="post-meta d-flex flex-column flex-sm-row text-muted mt-1 mb-1">        {categories}        {tags}      </div>    </header>    <p>{content}</p>  </article>',
      noResultsText: '<p class="mt-5">搜索结果为空</p>',
      templateMiddleware: function(prop, value, template) {
        if (prop === 'categories') {
          if (value === '') {
            return `${value}`;
          } else {
            return `<div class="me-sm-4"><i class="far fa-folder fa-fw"></i>${value}</div>`;
          }
        }

        if (prop === 'tags') {
          if (value === '') {
            return `${value}`;
          } else {
            return `<div><i class="fa fa-tag fa-fw"></i>${value}</div>`;
          }
        }
      }
    });
  });

