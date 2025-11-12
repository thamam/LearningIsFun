var defaultConfig = {
  "Position": "Right",
  "Menulang": "HE",
  "domains": {
    "js": "https://js.nagich.co.il/",
    "acc": "https://access.nagich.co.il/"
  },
  "btnStyle": {
    "vPosition": [
      null
    ],
    "scale": [
      "0.5",
      "0.5"
    ],
    "icon": {
      "type": 10,
      "shape": "circle",
      "outline": true
    }
  }
};
window.interdeal = {
  ...defaultConfig,
  ...window.interdeal
};

if (window.location.hostname.includes('apps.assets')) {
    window.interdeal.waitForTop = true;
}

(function (doc, head, body) {
    var coreCall = doc.createElement('script');
    coreCall.src = interdeal.domains.js + 'core/5.0.9/accessibility.js';
    coreCall.defer = true;
    coreCall.integrity = 'sha512-dxjHZQgpVIG70EQus4+1KR3oj2KGyrtwR/nr4lY+tcMjrQ1Yb9V1SCKNVLGhD3CcPMgANKAqOk4ldI8WWNnQTw==';
    coreCall.crossOrigin = 'anonymous';
    coreCall.setAttribute('data-cfasync', true);
    body ? body.appendChild(coreCall) : head.appendChild(coreCall);
})(document, document.head, document.body);

