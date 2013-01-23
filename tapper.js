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

  Tapper.prototype.loadSlide = function(slideNumber) {
    this._frame.addEventListener('load', this._frameLoadHandler.bind(this));
    this._frame.src = this.config.slides[slideNumber];
  };

  Tapper.prototype.doTap = function() {
    if (this._buildables.length > 0 && this._currentBuildable < this._buildables.length) {
      this._buildables[this._currentBuildable].style.visibility = "visible";
      this._currentBuildable++;
    }
    else {
      this.loadSlide(++this._currentSlide % this.config.slides.length);
    }
  };

  Tapper.prototype._initialize = function() {
    this._container = document.getElementById(this.config.containerId);

    if (this._container != null) {
      this._createFrame();
      this._createTapLayer();
      this._listenForTaps();
    }
    else {
      throw "Container element not defined or does not exist"
    }
  };

  Tapper.prototype._createFrame = function() {
    this._frame = document.createElement("iframe");
    this._frame.className = _frameClassName;
    this._container.appendChild(this._frame);
    this.loadSlide(this._currentSlide);
  };

  Tapper.prototype._createTapLayer = function() {
    this._tapLayer = document.createElement("div");
    this._tapLayer.className = _tapLayerClassName;
    this._container.appendChild(this._tapLayer);
  };

  Tapper.prototype._listenForTaps = function() {
    this._tapLayer.addEventListener('mouseup', this._mouseupHandler.bind(this));
    this._tapLayer.addEventListener('touchend', this._touchendHandler.bind(this));
  };

  Tapper.prototype._processBuildables = function() {
    this._buildables = this._frame.contentWindow.document.getElementsByClassName(_buildClassName);
    for (var i = 0; i < this._buildables.length; i++) {
      this._buildables[i].style.visibility = "hidden";
    }

    this._currentBuildable = 0;
  };

  Tapper.prototype._mouseupHandler = function(event) {
    this.doTap();
  };

  Tapper.prototype._touchendHandler = function(event) {
    this.doTap();
  };

  Tapper.prototype._frameLoadHandler = function(event) {
    this._processBuildables();
  };

  this.Tapper = Tapper;
}).call(this);
