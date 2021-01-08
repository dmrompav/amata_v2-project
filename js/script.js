"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ! ========== DOM ===============================
var body = document.querySelector('.body'),
    canvas = document.getElementById('canvas'),
    wrapper = document.querySelector('.wrapper'),
    centrlBtn = document.querySelector('.central-btn'),
    rotator = document.querySelector('.rotator'),
    menu = document.querySelector('.menu'),
    circles = document.querySelector('.menu__circles'),
    but = document.querySelector('.menu__large-btn'),
    butNames = document.querySelector('.menu__names'),
    butLogos = document.querySelector('.menu__logos'),
    nav = document.querySelector('.menu__nav'),
    ul = document.querySelector('.menu__ul'),
    li = document.querySelectorAll('.menu__li'),
    liBut = document.querySelectorAll('.menu-li__button'),
    main = document.querySelector('.main'),
    tapfield = document.querySelector('.main__tapfield'),
    popup = document.querySelectorAll('.main__popup'),
    lazy = [];

for (var i = 0; i < popup.length; i++) {
  lazy[i] = popup[i].querySelectorAll('.popup__lazy');
} // ! ============ VIEW ============================


var maxSize, minSize;
document.addEventListener("resize", Resize, false);

function Resize() {
  if (window.innerWidth < window.innerHeight) {
    maxSize = window.innerHeight;
    minSize = window.innerWidth;
  } else {
    maxSize = window.innerWidth;
    minSize = window.innerHeight;
  }

  canvas.width = maxSize * 2;
  canvas.height = maxSize * 2;
}

Resize(); // * Bubbles ================================

(function () {
  var config = {
    dotsQuantity: 40,
    dotMinRad: 1,
    dotMaxRad: 20,
    sphereRad: 300,
    bigDotRad: 35,
    mouseSize: 120,
    massFactor: 0.003,
    firstMouseColor: "rgba(256, 0, 0, 0.3)",
    secondMouseColor: "rgba(256, 256, 256, 0.6)",
    firstColor: "rgba(256, 256, 256, 0.1)",
    secondColor: "rgba(256, 256, 256, 0.4)",
    smooth: 0.85
  };
  var TWO_PI = 2 * Math.PI;
  var ctx = canvas.getContext("2d");
  var w, h, mouse, dots;

  var Dot = /*#__PURE__*/function () {
    function Dot(r) {
      _classCallCheck(this, Dot);

      this.pos = {
        x: mouse.x,
        y: mouse.y
      };
      this.vel = {
        x: 0,
        y: 0
      };
      this.rad = r || random(config.dotMinRad, config.dotMaxRad);
      this.mass = this.rad * config.massFactor;
      this.color = config.defColor;
    }

    _createClass(Dot, [{
      key: "drawMouse",
      value: function drawMouse(x, y) {
        this.pos.x = x || this.pos.x + this.vel.x;
        this.pos.y = y || this.pos.y + this.vel.y;
        createCircle(this.pos.x, this.pos.y, this.rad, true, config.firstMouseColor);
        createCircle(this.pos.x, this.pos.y, this.rad, false, config.secondMouseColor);
      }
    }, {
      key: "draw",
      value: function draw(x, y) {
        this.pos.x = x || this.pos.x + this.vel.x;
        this.pos.y = y || this.pos.y + this.vel.y;
        createCircle(this.pos.x, this.pos.y, this.rad, true, config.firstColor);
        createCircle(this.pos.x, this.pos.y, this.rad, false, config.secondColor);
      }
    }]);

    return Dot;
  }();

  function updateDots() {
    for (var _i = 1; _i < dots.length; _i++) {
      var acc = {
        x: 0,
        y: 0
      };

      for (var j = 0; j < dots.length; j++) {
        if (_i == j) continue;
        var _ref = [dots[_i], dots[j]],
            a = _ref[0],
            b = _ref[1];
        var delta = {
          x: b.pos.x - a.pos.x,
          y: b.pos.y - a.pos.y
        };
        var dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
        var force = (dist - config.sphereRad) / dist * b.mass;

        if (j == 0) {
          var alpha = config.mouseSize / dist;
          a.color = "rgba(250, 10, 30, ".concat(alpha, ")");
          dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
        }

        acc.x += delta.x * force;
        acc.y += delta.y * force;
      }

      dots[_i].vel.x = dots[_i].vel.x * config.smooth + acc.x * dots[_i].mass;
      dots[_i].vel.y = dots[_i].vel.y * config.smooth + acc.y * dots[_i].mass;
    }

    dots.map(function (e) {
      return e == dots[0] ? e.drawMouse(mouse.x, mouse.y) : e.draw();
    });
  }

  function createCircle(x, y, rad, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, TWO_PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function init() {
    w = canvas.width = maxSize * 2;
    h = canvas.height = maxSize * 2;
    mouse = {
      x: w / 2,
      y: h / 2,
      down: false
    };
    dots = [];
    dots.push(new Dot(config.bigDotRad));
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);

    if (dots.length < config.dotsQuantity) {
      dots.push(new Dot());
    }

    updateDots();
    window.requestAnimationFrame(loop);
  }

  init();
  loop();

  function setPos(event) {
    var _ref2 = [event.clientX, event.clientY];
    mouse.x = _ref2[0];
    mouse.y = _ref2[1];
  }

  document.addEventListener("mousemove", setPos);
  document.addEventListener("mousedown", function () {
    return config.sphereRad = 100;
  });
  document.addEventListener("mouseup", function () {
    return config.sphereRad = 300;
  }); // setInterval(() => {
  // 	config.sphereRad = Math.random() * (350-150) + 150
  // }, 3000);
  // setInterval(() => {
  // 	config.sphereRad = Math.random() * (950-550) + 550
  // }, 15001);
})(); // ! ================= CONTROL ===================================
// mouse move => menu rotate


document.addEventListener('mousemove', function (e) {
  var rotationX = -(e.clientX - window.innerWidth / 2) / window.innerWidth * 30 - 7,
      rotationY = (e.clientY - window.innerHeight / 2) / window.innerHeight * 30 + 7;
  rotator.style.transform = 'rotateX(' + rotationY + 'deg) rotateY(' + rotationX + 'deg)';
}, false); // central button mouse hover

centrlBtn.addEventListener('mouseover', function () {
  butNames.classList.add('menu__names--hover');
}, false);
centrlBtn.addEventListener('mouseout', function () {
  butNames.classList.remove('menu__names--hover');
}, false); // central button click => open nav + some animations

var isOpened = false;
centrlBtn.addEventListener('click', centrlBtnClick, false);
but.addEventListener('click', centrlBtnClick, false); // nav buttons click => open popup

var indexOfPopup;
liBut.forEach(function (e) {
  e.addEventListener('click', OpenPopUp, false);
});
tapfield.addEventListener('click', ClosePopUp, false); // ------- functions -------------------

function centrlBtnClick() {
  if (!isOpened) {
    but.classList.add('menu__large-btn--opened');
    butNames.classList.add('menu__names--opened');
    butLogos.classList.add('menu__logos--opened');
    circles.classList.add('menu__circles--opened');
    nav.classList.add('menu__nav--opened');
    ul.classList.add('menu__ul--opened');
    li.forEach(function (e) {
      e.classList.add('menu__li--opened');
    });
    liBut.forEach(function (e) {
      e.classList.add('menu-li__button--opened');
    });
  } else {
    but.classList.remove('menu__large-btn--opened');
    butNames.classList.remove('menu__names--opened');
    butLogos.classList.remove('menu__logos--opened');
    circles.classList.remove('menu__circles--opened');
    nav.classList.remove('menu__nav--opened');
    ul.classList.remove('menu__ul--opened');
    li.forEach(function (e) {
      e.classList.remove('menu__li--opened');
    });
    liBut.forEach(function (e) {
      e.classList.remove('menu-li__button--opened');
    });
  }

  isOpened = !isOpened;
}

function OpenPopUp() {
  var _this = this;

  liBut.forEach(function (e, i) {
    if (e === _this) {
      indexOfPopup = i;
      menu.classList.add('menu--hidden');
      tapfield.classList.add('main__tapfield--opened');
      body.classList.add('body--popup-opened');
      popup[indexOfPopup].classList.add('main__popup--opened');
      var close = document.createElement('div');
      popup[indexOfPopup].prepend(close);
      close.classList.add('main__close');
      close.innerHTML = 'X';
      close.addEventListener('click', ClosePopUp, false);
      LazyPopup(indexOfPopup);
    }
  });
}

function LazyPopup(i) {
  var j = 0;
  var lazyInterval = setInterval(function () {
    lazy[i][j].classList.add('popup__lazy--opened');
    j++;

    if (j === lazy[i].length) {
      clearInterval(lazyInterval);
    }
  }, 100);
}

function ClosePopUp() {
  menu.classList.remove('menu--hidden');
  tapfield.classList.remove('main__tapfield--opened');
  body.classList.remove('body--popup-opened');
  popup[indexOfPopup].classList.remove('main__popup--opened');
  popup[indexOfPopup].querySelector('.main__close').remove();
  lazy[indexOfPopup].forEach(function (e) {
    e.classList.remove('popup__lazy--opened');
  });
}