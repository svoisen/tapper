/*!
 * tapper.js
 * version 1.0.0
 * Author: Sean Voisen
 * https://github.com/svoisen/tapper
 */

(function() {
  var _frameClassName = "tapper-frame";
  var _buildClassName = "build";
  var _tapLayerClassName = "tapper-tap-layer";

  var defaults = {
    containerId: 'tapper',
    slides: []
  };

  function Tapper(config) {
    this.config = config != null ? config : defaults;
    this._initialize();
  }

  Tapper.prototype._currentSlide = 0;
  Tapper.prototype._currentBuildable = 0;
  Tapper.prototype._buildables = [];
  Tapper.prototype._frames = [];
  Tapper.prototype._frameValues = [];
  Tapper.prototype._currentFrame = 2;
  Tapper.prototype._previousFrame = 0;
  Tapper.prototype._nextFrame = 1;

  Tapper.prototype.loadSlide = function(slideNumber) {
    if (this._frameValues[this._nextFrame] == this.config.slides[slideNumber]) {
      this._frames[this._nextFrame].style.zIndex = 1;
      this._frames[this._currentFrame].style.zIndex = 0;

      var previous = this._previousFrame;
      this._previousFrame = this._currentFrame;
      this._currentFrame = this._nextFrame;
      this._nextFrame = previous;

      this._processBuildables();
      this._frames[this._nextFrame].src = this._frameValues[this._nextFrame] = this.config.slides[this.getNextSlideNumber(slideNumber)];
    }
    else if (this._frameValues[this._previousFrame] == this.config.slides[slideNumber]) {
      this._frames[this._previousFrame].style.zIndex = 1;
      this._frames[this._currentFrame].style.zIndex = 0;

      var next = this._nextFrame;
      this._nextFrame = this._currentFrame;
      this._currentFrame = this._previousFrame;
      this._previousFrame = next;

      this._processReverseBuildables();
      this._frames[this._previousFrame].src = this._frameValues[this._previousFrame] = this.config.slides[this.getPreviousSlideNumber(slideNumber)];
    }
    else {
      this._frames[this._currentFrame].style.zIndex = 1;
      this._frames[this._nextFrame].style.zIndex = 0;
      this._frames[this._previousFrame].style.zIndex = 0;

      this._frameLoadHandlerBind = this._frameLoadHandler.bind(this);
      this._frames[this._currentFrame].addEventListener('load', this._frameLoadHandlerBind);
      this._frames[this._currentFrame].src = this._frameValues[this._currentFrame] = this.config.slides[slideNumber];
      this._frames[this._nextFrame].src = this._frameValues[this._nextFrame] = this.config.slides[this.getNextSlideNumber(slideNumber)];
      this._frames[this._previousFrame].src = this._frameValues[this._previousFrame] = this.config.slides[this.getPreviousSlideNumber(slideNumber)];
    }
  };

  Tapper.prototype.moveForward = function() {
    if (this._buildables.length > 0 && this._currentBuildable < this._buildables.length) {
      this._buildables[this._currentBuildable].style.visibility = "visible";
      this._currentBuildable++;
    }
    else {
      this._currentSlide = (this._currentSlide + 1) % this.config.slides.length;
      this.loadSlide(this._currentSlide);
    }
  };

  Tapper.prototype.moveBackward = function() {
    if (this._buildables.length > 0 && this._currentBuildable > 0) {
      this._buildables[this._currentBuildable - 1].style.visibility = "hidden";
      this._currentBuildable--;
    }
    else {
      this._currentSlide = this._currentSlide > 0 ? this._currentSlide - 1 : this.config.slides.length - 1;
      this.loadSlide(this._currentSlide);
    }
  };

  Tapper.prototype.getNextSlideNumber = function(slideNumber) {
    return (slideNumber + 1) % this.config.slides.length;
  };

  Tapper.prototype.getPreviousSlideNumber = function(slideNumber) {
    if (slideNumber == 0) 
      return this.config.slides.length - 1;

    return slideNumber - 1;
  };

  Tapper.prototype._initialize = function() {
    this._container = document.getElementById(this.config.containerId);

    if (this._container != null) {
      this._createFrames();
      this._createTapLayer();
      this._listenForTaps();
      this.loadSlide(this._currentSlide);
    }
    else {
      throw "Container element not defined or does not exist"
    }
  };

  Tapper.prototype._createFrames = function() {
    for (var i = 0; i < 3; i++) {
      this._frames[i] = document.createElement("iframe");
      this._frames[i].className = _frameClassName;
      this._frames[i].style.zIndex = 0;
      this._container.appendChild(this._frames[i]);
    }
  };

  Tapper.prototype._createTapLayer = function() {
    this._tapLayer = document.createElement("div");
    this._tapLayer.className = _tapLayerClassName;
    this._container.appendChild(this._tapLayer);
  };

  Tapper.prototype._listenForTaps = function() {
    document.addEventListener('keydown', this._keyDownHandler.bind(this));
    this._tapLayer.addEventListener('mouseup', this._mouseupHandler.bind(this));
    this._tapLayer.addEventListener('touchend', this._touchendHandler.bind(this));
  };

  Tapper.prototype._processBuildables = function() {
    this._buildables = this._frames[this._currentFrame].contentWindow.document.getElementsByClassName(_buildClassName);
    for (var i = 0; i < this._buildables.length; i++) {
      this._buildables[i].style.visibility = "hidden";
    }

    this._currentBuildable = 0;
  };

  Tapper.prototype._processReverseBuildables = function() {
    this._buildables = this._frames[this._currentFrame].contentWindow.document.getElementsByClassName(_buildClassName);
    for (var i = 0; i < this._buildables.length; i++) {
      this._buildables[i].style.visibility = "visible";
    }

    this._currentBuildable = this._buildables.length;
  };

  Tapper.prototype._keyDownHandler = function(event) {
    if (event.keyCode == 39) {
      this.moveForward();
    }
    else if (event.keyCode == 37) {
      this.moveBackward();
    }
  };

  Tapper.prototype._mouseupHandler = function(event) {
    this.moveForward();
  };

  Tapper.prototype._touchendHandler = function(event) {
    this.moveForward();
  };

  Tapper.prototype._frameLoadHandler = function(event) {
    this._frames[this._currentFrame].removeEventListener('load', this._frameLoadHandlerBind);
    delete this._frameLoadHandlerBind;
    this._processBuildables();
  };

  this.Tapper = Tapper;
}).call(this);
