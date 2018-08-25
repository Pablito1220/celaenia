var container;
var camera, scene, renderer, pointLight, texture, pointLight2;
var mouseX = 0, mouseY = 0;
var oldMouseX = 0, oldMouseY = 0;
var windowHalfX;
var windowHalfY;
var isMouseDown;
var mode;
var SCALE = 0.4;
var offsetX, offsetY;
var light1IsOn, light2IsOn, textureIsOn;
var fov;
var couleur
var colorPickers;
init();
animate();
function init() {
  mode = 0;
  isMouseDown = false;
  container = document.getElementById('canvasContainer');
  colorPickers = document.getElementById('middleColorPicker');
  firstColorPicker = document.getElementById('firstColorPicker')
  // document.body.appendChild(container);
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera = new THREE.PerspectiveCamera(fov, 1, 1, 2000);
  // camera.position.z = -20;
  console.log(camera.fov)
  camera.fov = 10;
  console.log(camera.fov)
  camera.position.z = -30;
  camera.position.y = 0;
  fov = 1000;
  // scene
  scene = new THREE.Scene();
  pointLight = new THREE.PointLight(0xFF33A6, 1);
  pointLight2 = new THREE.PointLight(0xAF9FF, 1);


  camera.add(pointLight);
  camera.add(pointLight2);
  scene.add(camera);

  // texture
  var manager = new THREE.LoadingManager();
  manager.onProgress = function(item, loaded, total) {
    console.log(item, loaded, total);
  };
  var textureLoader = new THREE.TextureLoader(manager);
  texture = textureLoader.load('tex/textures19.png');
  texture.repeat.set(0.4, 0.4);
  texture.offset.x = 0.5;
  texture.offset.y = 0.5;

  // model
  var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
      if (Math.round(percentComplete, 2) < 100) {
        var lightMouse = document.getElementById('canvasContainer');
        lightMouse.style.cursor = 'wait';
      } else {
        var lightMouse = document.getElementById('canvasContainer');
        lightMouse.style.cursor = 'auto';
      }
    }
  };
  var onError = function(xhr) {};
  var loader = new THREE.OBJLoader(manager);
  loader.load('obj/typeNext2.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = texture;
        child.material.shininess = 100;
        child.material.skinning = true;
        child.material.refractionRatio = 3.9;
        // child.scale.set(1, 1, 1);
      }
    });
    scene.add(object);
  }, onProgress, onError);
  //
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth * SCALE, window.innerWidth * SCALE);
  container.appendChild(renderer.domElement);
  container.addEventListener('mousemove', onDocumentMouseMove, false);
  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('mouseup', onMouseRelease);
  colorPickers.addEventListener('input', function() {
    pointLight.color = new THREE.Color(colorPickers.value);
    // pointLight2.color = new
    // THREE.Color(hexToComplimentary(colorPickers.value));
  });
  firstColorPicker.addEventListener('input', function() {
    // pointLight.color = new THREE.Color(colorPickers.value);
    pointLight2.color = new THREE.Color(firstColorPicker.value);
  });
  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  camera.aspect = 1;
  renderer.setSize(window.innerWidth * SCALE, window.innerWidth * SCALE);
}
function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
  offsetX = oldMouseX - mouseX;
  offsetY = oldMouseY - mouseY;
  oldMouseX = mouseX;
  oldMouseY = mouseY;
}
function light1Mode() {
  light1IsOn = true;
  light2IsOn = false;
  textureIsOn = false;
  console.log('light1');
}
function light2Mode() {
  light1IsOn = false;
  light2IsOn = true;
  textureIsOn = false;
  console.log('light2');
}
function textureMode() {
  light1IsOn = false;
  light2IsOn = false;
  textureIsOn = true;
}
function onMouseDown(event) {
  console.log('downy');
  isMouseDown = true;
}
function onMouseRelease() {
  isMouseDown = false;
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  if (isMouseDown) {
    // pointLight.color.setRGB(0, 255, 0);
    if (light1IsOn) {
      pointLight2.position.x = mouseX / windowHalfX * 300;
      pointLight2.position.y = -mouseY / windowHalfY * 300;
    } else if (light2IsOn) {
      pointLight.position.x = mouseX / windowHalfX * 300;
      pointLight.position.y = -mouseY / windowHalfY * 300;
    } else if (textureIsOn) {
      texture.offset.x -= offsetX / 2000;  // 0.0 - 1.0
      texture.offset.y += offsetY / 2000;  // 0.0 - 1.0
    }
  }
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } :
                  null;
}
function hexToComplimentary(hex) {
  // Convert hex to rgb
  // Credit to Denis http://stackoverflow.com/a/36253499/4939630
  var rgb = 'rgb(' +
      (hex = hex.replace('#', ''))
          .match(new RegExp('(.{' + hex.length / 3 + '})', 'g'))
          .map(function(l) {
            return parseInt(hex.length % 2 ? l + l : l, 16);
          })
          .join(',') +
      ')';

  // Get array of RGB values
  rgb = rgb.replace(/[^\d,]/g, '').split(',');

  var r = rgb[0], g = rgb[1], b = rgb[2];

  // Convert RGB to HSL
  // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2.0;

  if (max == min) {
    h = s = 0;  // achromatic
  } else {
    var d = max - min;
    s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

    if (max == r && g >= b) {
      h = 1.0472 * (g - b) / d;
    } else if (max == r && g < b) {
      h = 1.0472 * (g - b) / d + 6.2832;
    } else if (max == g) {
      h = 1.0472 * (b - r) / d + 2.0944;
    } else if (max == b) {
      h = 1.0472 * (r - g) / d + 4.1888;
    }
  }

  h = h / 6.2832 * 360.0 + 0;

  // Shift hue to opposite side of wheel and convert to [0-1] value
  h += 180;
  if (h > 360) {
    h -= 360;
  }
  h /= 360;

  // Convert h s and l values into r g and b values
  // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
  if (s === 0) {
    r = g = b = l;  // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  // Convert r b and g values to hex
  rgb = b | (g << 8) | (r << 16);
  return '#' + (0x1000000 | rgb).toString(16).substring(1);
}
