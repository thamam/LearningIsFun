var cet = cet || {};
cet.ui = cet.ui || {};
cet.ui.soundplayer = cet.ui.soundplayer || {};

cet.ui.soundplayer.has_touchevents = ('ontouchstart' in window);

if (typeof (normalizeEvent) == "undefined") {
  normalizeEvent = function (event) {
    if (!event.stopPropagation) {
      event.stopPropagation = function () { this.cancelBubble = true; };
      event.preventDefault = function () { this.returnValue = false; };
    }
    if (!event.stop) {
      event.stop = function () {
        this.stopPropagation();
        this.preventDefault();
      };
    }
    if (event.type == "keypress") {
      event.code = (event.charCode == null) ? event.keyCode : event.charCode;
      event.character = String.fromCharCode(event.code);
    }
    if (cet.ui.soundplayer.has_touchevents) {
      if (event.type === "touchstart" || event.type === "touchmove" || event.type === "touchend") {
        var touches = event.touches || event.originalEvent.touches;
        if (touches.length > 0) {
          event.clientX = touches[0].clientX;
          event.clientY = touches[0].clientY;
        }
        event.which = 1;
      }
    }
    return event;
  }
}

soundManager.setup({
  url: 'http://cdn.cet.ac.il/libs/soundmanager2/latest/swf/',
  preferFlash: false,
  debugMode: false
});

cet.ui.soundplayer.soundplayervol = 100;

cet.ui.soundplayer.soundplayer = function (params, element, listener) {
  var defaults = { url: '', autoplay: false }

  this.isDevice = false;
  if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
    this.isDevice = true;
  }

  //params.url = "http://archive.org/download/testmp3testfile/mpthreetest.mp3";

  var options = $.extend({}, defaults, params);
  var thisSound = null;
  var DEFAULT_ZOOM = 1;
  var $this = this;

  this.isVolumeOn = false;
  this.isPlaying = false;
  this.userEvent = false; // for iOS refusing to preload or autoplay
  this.isMovingPosKnob = false;
  this.isMovingVolKnob = false;
  this.posKnobZero = 0;
  this.soundlength = 0;
  this.volKnobZero = -4;
  this.volTimeout = 0;
  this.zoom = DEFAULT_ZOOM;

  this._create(options, element);
  this._setupEvents();

  this.play = function () {
    if (thisSound === null) {
      thisSound = soundManager.createSound({
        url: options.url,
        volume: cet.ui.soundplayer.soundplayervol,
        whileloading: whileloading,
        whileplaying: whileplaying,
        onfinish: onfinish
      });
    }
    thisSound.play();
    listener && listener("play");
  };
  this.pause = function () {
    if (thisSound !== null) {
      thisSound.pause();
    }
    listener && listener("pause");
  }
  this.playpause = function () {
    $this.isPlaying = !$this.isPlaying;
    $this.userEvent = true;
    $this._playpause();
  }
  function onstop() {
  }

  function onfinish() {
    if (thisSound != null) {
      thisSound.stop();
      thisSound.setPosition(0);
      whileplaying();
      $this.isPlaying = !$this.isPlaying;
      listener && listener("stop");
      $this._playpause();
    }
  }

  this.setPosition = function (pos) {
    if (thisSound !== null) {
      thisSound.setPosition(pos);
    }
  }

  this.setVolume = function (vol) {
    if (thisSound !== null) {
      thisSound.setVolume(vol);
      cet.ui.soundplayer.soundplayervol = vol;
    }
  };

  this.getVolume = function () {
    var retVal = -1;
    if (thisSound !== null) {
      retVal = thisSound.volume;
    }

    return retVal;
  };

  this.canPlay = function () {
    var retVal = false;
    if (!this.userEvent) {
      thisSound = null; // give another chance when user clicks
      return true;
    }
    if (thisSound !== null) {
      retVal = thisSound.readyState === 1 || thisSound.readyState === 3;
    }
    return retVal;
  };

  this.resize = function () {
    this._resizeControls();
  }

  function whileloading() {
    $this.soundlength = thisSound.durationEstimate;
    if (thisSound.durationEstimate > 0) {
      $this.timingtotal.html($this._getTime(thisSound.durationEstimate));
    }
  }

  function whileplaying() {
    $this.timingposition.html($this._getTime(thisSound.position));
    $this.timingtotal.html($this._getTime(thisSound.durationEstimate));
    var pos = thisSound.position / thisSound.durationEstimate;
    var knobpos = pos * ($this.progressbar.width() - 8);
    $this.positionknob.transition({ x: knobpos, queue: false }, 0);
    $this.positionbar.width((pos * 100) + '%');
  };

  function autoplay() {
    if ($this.canPlay()) {
      $this.isPlaying = true;
      $this._playpause();
    }
    else {
      setTimeout(function () { autoplay(); }, 100);
    }
  };

  soundManager.onready(function () {
    //prelaod sound (not effective on iOS)
    thisSound = soundManager.createSound({
      url: options.url,
      autoLoad: true,
      stream: true,
      volume: cet.ui.soundplayer.soundplayervol,
      whileloading: whileloading,
      whileplaying: whileplaying,
      onfinish: onfinish
    });
    if (options.autoplay) {
      setTimeout(function () { autoplay(); }, 100);
    }
  });
};

cet.ui.soundplayer.soundplayer.prototype = {
  _create: function (options, elemet) {
    this.element = elemet;
    this.element.addClass("cet-ui-soundplayer");

    this._createControls();
    this._createTiming();
    this._createVolumeControl();
    this._resizeControls();
   
  },
  _resizeControls: function () {
    //var prgressbarwidth = this.element.width() - this.playbutton.outerWidth(true) - this.volumebutton.outerWidth(true) - this.splitter.outerWidth(true) - this.timing.outerWidth(true) - 30;
    var splitterLeft = (this.splitter && this.splitter.position()) ? this.splitter.position().left : 0;
    var prgressbarwidth = this.element.width() - splitterLeft - this.timing.width() - 30;
    this.progressbar.width(prgressbarwidth);

    var progressbarLeft = (this.progressbar && this.progressbar.position()) ? this.progressbar.position().left : 0;
    this.posKnobZero = progressbarLeft - 5;
    this.positionknob.css("left", this.posKnobZero);

    this.volumecontrol.width(prgressbarwidth);

    this.posKnobMaxX = this.progressbar.width() - 8;
    this.volKnobMaxX = this.volumecontrol.width() - this.volKnobZero - 6;
  },
  _createControls: function () {
    this.controls = $("<div></div>").appendTo(this.element);
    this.controls.addClass("cet-ui-soundplayer-controls");
    if (this.isDevice) {
      this.controls.addClass("isDevice");
    }

    this.playbutton = $("<div></div>").appendTo(this.controls);
    this.playbutton.addClass("cet-ui-button cet-ui-playbutton");

    if (!this.isDevice) {
      this.volumebutton = $("<div></div>").appendTo(this.controls);
      this.volumebutton.addClass("cet-ui-button  cet-ui-volumebutton");
    }

    this.splitter = $("<div></div>").appendTo(this.controls);
    this.splitter.addClass("cet-ui-splitter");

    this.progressbar = $("<div></div>").appendTo(this.controls);
    this.progressbar.addClass("cet-ui-progressbar");

    this.loadingbar = $("<div></div>").appendTo(this.progressbar);
    this.loadingbar.addClass("cet-ui-loadingbar");

    this.positionbar = $("<div></div>").appendTo(this.progressbar);
    this.positionbar.addClass("cet-ui-positionbar");

    this.positionknob = $("<div></div>").appendTo(this.controls);
    this.positionknob.addClass("cet-ui-positionknob");
  },
  _createTiming: function () {
    this.timing = $("<div></div>").appendTo(this.element);
    this.timing.addClass("cet-ui-timing");

    this.timingdata = $("<div></div>").appendTo(this.timing);
    this.timingdata.addClass("cet-ui-timingdata");

    this.timingposition = $("<span>00:00</span>").appendTo(this.timingdata);
    this.timingposition.addClass("cet-ui-timingposition");

    this.timingdata.append(" / ");

    this.timingtotal = $("<span>00:00</span>").appendTo(this.timingdata);
    this.timingtotal.addClass("cet-ui-timingtotal");
  },
  _createVolumeControl: function () {
    this.volumecontrol = $("<div></div>").appendTo(this.element);
    this.volumecontrol.addClass("cet-ui-volumecontrol");

    this.volumehitarea = $("<div></div>").appendTo(this.volumecontrol);
    this.volumehitarea.addClass("cet-ui-volumehitarea");

    this.volumeval = $("<div></div>").appendTo(this.volumehitarea);
    this.volumeval.addClass("cet-ui-volumeval");

    this.volumeknob = $("<div></div>").appendTo(this.volumecontrol);
    this.volumeknob.addClass("cet-ui-volumeknob");
  },
  _setExternalZoom: function (zoom) {
    this.zoom = zoom || DEFAULT_ZOOM;
  },
  _setupEvents: function () {
    var $this = this;

    if (!this.isDevice) {
      this.volumebutton.bind("click", function (e) {
        if (e.which === 1) {
          $this.volumeknob.transition({ x: ($this.getVolume() / 100) * ($this.volKnobZero + $this.volKnobMaxX), queue: false }, 0);
          $this.volumehitarea.width($this.getVolume() + "%");
          $this.isVolumeOn = !$this.isVolumeOn;
          $this._hideShowPosition();
          $this._hideShowVolumeMenu();
          $this._setAudioAutoHide();
        }
      });

      window.addEventListener('enteredFullscreen', function(ev) {
        $this._setExternalZoom(ev.detail && ev.detail.zoom);
      });
      window.addEventListener('exitedFullscreen', function(ev) {
        $this._setExternalZoom(ev.detail && ev.detail.zoom);
      });
    }

    this.volumecontrol.bind("mouseenter", function (e) {
      clearTimeout($this.volTimeout);
    });

    this.volumecontrol.bind("mouseleave", function (e) {
      //$this._setAudioAutoHide(500);
    });

    this.playbutton.bind("click", function (e) {
      if (e.which === 1) {
        $this.isPlaying = !$this.isPlaying;
        $this.userEvent = true;
        $this._playpause();
      }
    });

    this.element.bind("mousedown touchstart", function (e) {
      e = normalizeEvent(e);
      if (e.which === 1) {
        $this.isMovingPosKnob = e.target.className === "cet-ui-positionknob";
        $this.isMovingVolKnob = e.target.className === "cet-ui-volumeknob";
        if (e.target.className === "cet-ui-progressbar" || e.target.className === "cet-ui-positionbar") {
          $this.isMovingPosKnob = true;
          $this._movePosition(e);
          $this._setPosition();
        }

        if (!$this.isMovingPosKnob) {
          if (e.target.className === "cet-ui-volumeval" || e.target.className === "cet-ui-volumehitarea") {
            $this.isMovingVolKnob = true;
            $this._moveVolume(e);
            $this._setVolume();
          }
          else if (e.target.className === "cet-ui-volumecontrol") {
            if (e.offsetY > 13 && e.offsetY < 21) {
              $this.isMovingVolKnob = true;
              $this._moveVolume(e);
              $this._setVolume();
            }
          }
        }

        if ($this.isMovingPosKnob && $this.isPlaying) {
          $this.pause();
        }

        $this.element.bind("mousemove touchmove", function (e) {
          if ($this.isMovingPosKnob) {
            $this._movePosition(normalizeEvent(e));
            $this._setPosition();
          }
          else if ($this.isMovingVolKnob) {
            $this._moveVolume(normalizeEvent(e));
            $this._setVolume();
            $this._setAudioAutoHide(3000);
          }
          e.preventDefault();
        });
      }
    });

    this.element.bind("mouseup mouseleave touchend touchleave", function (e) {
      e = normalizeEvent(e);
      if (e.which === 1) {
        $this.element.unbind("mousemove touchmove");

        if ($this.isMovingPosKnob && $this.isPlaying) {
          $this.play();
        }

        $this.isMovingPosKnob = false;
      }
    });
  },
  _hideShowPosition: function () {
    if (this.isVolumeOn) {
      this.progressbar.hide();
      this.positionknob.hide();
    }
    else {
      this.progressbar.show();
      this.positionknob.show();
    }
  },
  _hideShowVolumeMenu: function () {
    if (this.isVolumeOn) {
      this.volumecontrol.show();
      this.volumebutton.addClass("selected");
    }
    else {
      this.volumecontrol.hide();
      this.volumebutton.removeClass("selected");
    }
  },
  _playpause: function () {
    if (this.canPlay()) {
      if (this.isPlaying) {
        this.play();
        this.playbutton.addClass("playing");
      }
      else {
        this.pause();
        this.playbutton.removeClass("playing");
      }
    }
  },
  _getTime: function (nMSec) {
    // convert milliseconds to mm:ss, return as string
    var nSec = Math.floor(nMSec / 1000),
  min = Math.floor(nSec / 60),
  sec = nSec - (min * 60);
    return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
  },
  _movePosition: function (e) {
    var zoom = this.zoom;
    var l = Math.max((e.clientX - this.progressbar.offset().left * zoom - 11 * zoom) / zoom, 0);
    l = Math.min(l, this.posKnobMaxX);
    this.positionknob.transition({ x: l, queue: false }, 0);
  },
  _moveVolume: function (e) {
    var l = Math.max(e.clientX - this.volumecontrol.offset().left - 14, 0);
    l = Math.min(l, this.volKnobMaxX);
    this.volumeknob.transition({ x: l, queue: false }, 0);
  },
  _setPosition: function () {
    var leftos = this.positionknob.position().left;
    var newpos = (leftos - this.posKnobZero) / (this.progressbar.width() - 8) * this.soundlength;
    this.setPosition(newpos);
    this.timingposition.html(this._getTime(newpos));
  },
  _setVolume: function () {
    var leftos = this.volumeknob.position().left;
    var newvol = parseInt((leftos - this.volKnobZero) / this.volKnobMaxX * 100);
    this.setVolume(newvol);
    this.volumehitarea.width(this.getVolume() + "%");
  },
  _setAudioAutoHide: function (timeout) {
    timeout = timeout || 2500
    var $this = this;
    clearTimeout(this.volTimeout);
    if (this.isVolumeOn) {
      this.volTimeout = setTimeout(function () {
        $this.isVolumeOn = false;
        $this._hideShowPosition();
        $this._hideShowVolumeMenu();
      }, timeout);
    }
  }
};