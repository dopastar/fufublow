var app = new Vue({
  el: '#app',
  data: {
    shareLink: 'https://wasateam.com/blow',
    loading: true,
    muted:false,
    progress: 0,
    device: 'pc',
    pageloading: true,
    sharinging: false,
    mic: true,
    mode: 'index',
    bg: 'pink',
    index: {
      fufubroStatus: 0,
    },
    sound:{
      urls:{
        blow:'sound/363852__mtheodp__soplido-2.wav',
        bgMusic:'sound/416778__mativve__happy-sandbox.wav',
        complete:'sound/335361__cabled-mess__little-happy-tune-22-10.wav',
        gg:'sound/175409__kirbydx__wah-wah-sad-trombone.wav',
      }
    },
    round: {
      stage: 1,
      playActive: 0,
    },
    gaming: {
      status: 0,
      detecting: 1,
      lineWidth: 0,
      desShow: true,
    },
    success: {
      active: 0,
    },
    volumeDis: '',
    averageVolume: 0.02,
    startVolume: 0.05,
    baseVolume: 0,
    volume: 0,
    audioContext: null,
    meter: null,
    canvasContext: null,
    WIDTH: null,
    HEIGHT: null,
    rafID: null,
    mediaStreamSource: null,
    difficuty:0.7,
  },
  methods: {
    shareOpen:function(){
      app.sharinging = true;
    },
    shareClose:function(){
      app.sharinging = false;
    },
    copyShareUrl: function() {

      var copyText = document.getElementById("urlCopy");

      copyText.select();

      document.execCommand("Copy");
    },
    lineWidthPump: function() {
      app.$refs.blowSound.currentTime = 0;
      app.$refs.blowSound.play();
      event.preventDefault();
      app.gaming.desShow = false;
      if (app.gaming.status < 3) {
        app.gaming.lineWidth += 10;
        app.lineWidthSet();
      }
    },
    volumeDisAuto: function() {
      volumeDis = setInterval(function() {
        if (app.gaming.lineWidth > 0) {
          app.gaming.lineWidth -= app.round.stage * app.difficuty;
          app.lineWidthSet();
        }

      }, 90);
    },
    modeBlowTestOpen: function() {
      if (!app.mic) {
        app.mic = false;
        this.$refs.bgMusic.play();
        setTimeout(function() {
          app.modeRoundOpen(1);
        }, 10);
      } else if (app.volume) {
        setTimeout(function() {
          app.mode = 'blowtest';
        }, 10);
      } else {
        app.mic = false;
        this.$refs.bgMusic.play();
        this.$refs.bgMusic.play();
        setTimeout(function() {
          app.modeRoundOpen(1);
        }, 10);
      }
    },
    modeRoundOpen: function(stage) {

      app.gaming.detecting = 1;
      app.round.playActive = 0;
      app.gaming.desShow = true;
      app.bg = 'pink';
      app.gaming.lineWidth = 0;
      app.gaming.status = 0;
      app.round.stage = stage;
      app.mode = 'round';
      app.$refs.completeMusic.pause();
      app.$refs.completeMusic.currentTime=0;

      setTimeout(function() {
        app.round.playActive = 1;
      }, 2000);
      setTimeout(function() {
        app.modeStartOpen();
      }, 3500);

      if (!app.mic) {
        app.volumeDisAuto();
      }

    },
    modeStartOpen: function() {
      app.mode = 'start';
      app.bg = 'gray';
    },
    didntGetStream: function() {
      app.mic = false;
      // alert('麥克風載入失敗');
    },
    gotStream: function(stream) {
      mediaStreamSource = audioContext.createMediaStreamSource(stream);

      // Create a new volume meter and connect it.
      meter = createAudioMeter(audioContext);
      mediaStreamSource.connect(meter);
      this.drawLoop();
    },
    drawLoop: function(time) {
      this.volume = meter.volume;
      // set up the next visual callback
      rafID = window.requestAnimationFrame(this.drawLoop);
    },
    blowDetectOpen: function() {

      // monkeypatch Web Audio
      window.AudioContext = window.AudioContext || window.webkitAudioContext;

      // grab an audio context
      audioContext = new AudioContext();

      // Attempt to get audio input
      try {
        // monkeypatch getUserMedia
        navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;

        // ask for an audio inputs
        navigator.getUserMedia({
          "audio": {
            "mandatory": {
              "googEchoCancellation": "false",
              "googAutoGainControl": "false",
              "googNoiseSuppression": "false",
              "googHighpassFilter": "false"
            },
            "optional": []
          },
        }, this.gotStream, this.didntGetStream);
      } catch (e) {
        alert('getUserMedia threw exception :' + e);
      }
      setTimeout(function() {

      }, 10);
    },
    gameComplete: function() {
      app.gaming.detecting = 0;
      app.gaming.status = 3;
      if (app.round.stage > 3) {
        app.gameEnd();
      } else {
        setTimeout(function() {
          app.modeRoundOpen(app.round.stage + 1);
        }, 2000);
      }
    },
    gameFail: function() {
      app.gaming.detecting = 0;
      app.gaming.status = 4;
      setTimeout(function() {
        app.mode = 'fail';
        app.bg = 'pink';
        app.$refs.ggSound.play();
        app.$refs.bgMusic.pause();
        app.$refs.bgMusic.currentTime=0;
        setTimeout(function() {
          app.mode = 'share';
        }, 2000)
      }, 2000);
    },
    gameEnd: function() {
      app.gaming.detecting = 0;
      setTimeout(function() {
        app.mode = 'success';
        app.bg = 'pink';
        app.$refs.bgMusic.currentTime=0;
        app.$refs.bgMusic.pause();
        app.$refs.completeMusic.currentTime=0;
        app.$refs.completeMusic.play();
        setTimeout(function() {
          app.success.active = 1;
        }, 10)
        setTimeout(function() {
          app.mode = 'share';
        }, 2000)
      }, 2000);
    },
    mobileCheck: function() {
      window.mobileAndTabletcheck = function() {
        var check = false;
        (function(a) {
          if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
      };
    },
    getStageAdjustNumber: function() {
      var adjust = 2 * app.round.stage * (app.round.stage == 1 ? 1 : app.round.stage * 0.7);
      return adjust;
    },
    mutedCheck:function(){
      this.$refs.blowSound.muted=this.muted;
      this.$refs.blowSound.currentTime=0;
      this.$refs.bgMusic.muted=this.muted;
      this.$refs.bgMusic.currentTime=0;
      this.$refs.completeMusic.muted=this.muted;
      this.$refs.completeMusic.currentTime=0;
      this.$refs.ggSound.muted=this.muted;
      this.$refs.ggSound.currentTime=0;
    },
    lineWidthSet: function() {
      if (app.gaming.lineWidth < 10) {
        app.gaming.status = 0;
      } else if (app.gaming.lineWidth < 20) {
        app.gaming.status = 1;
      } else if (app.gaming.lineWidth < 50) {
        app.gaming.status = 2;
      } else if (app.gaming.lineWidth < 80) {

        app.gameComplete();
        if (!app.mic) {
          clearInterval(volumeDis);
        }
      } else {
        app.gameFail();
        if (!app.mic) {
          clearInterval(volumeDis);
        }
      }
    },
  },
  mounted: function() {
    // 背景音樂播放
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // alert('mobile');
      this.mic = false;
      this.device = 'mobile'
    }
    this.mutedCheck();
    if (this.mic) {
      this.blowDetectOpen();
    }

    setTimeout(function() {
      app.progress = 0;
    }, 0)
    $(window).bind("load", function() {
      app.pageloading = false;
      app.progress = 100;
      setTimeout(function() {
        app.loading = false;
      }, 500)
    });

  },
  watch: {
    volume: function() {
      if (app.mode == 'index' && app.baseVolume == 0 && app.mic) {
        app.baseVolume = app.volume;
        app.startVolume = app.baseVolume * 20;
        if (app.startVolume < 0.05 || app.startVolume > 0.1) {
          app.startVolume = 0.05;
        }
      }
      if (app.mode == 'blowtest' && app.volume > app.startVolume && app.mic) {
        app.modeRoundOpen(1);
        app.averageVolume = app.volume;
      }
      if (app.mode == 'start' && app.gaming.detecting && app.mic) {
        app.gaming.lineWidth = app.volume / app.getStageAdjustNumber() / app.averageVolume * 100;
        app.lineWidthSet();
      }
    },
    muted:function(){
      app.mutedCheck();
    },
  },
  directives: {
    'click-outside': {
      bind: function(el, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== 'function') {
          var compName = vNode.context.name
        }
        // Define Handler and cache it on the element
        var bubble = binding.modifiers.bubble

        function handler(e) {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e)
          }
        }
        el.__vueClickOutside__ = handler

        // add Event Listeners
        document.addEventListener('click', handler)
      },

      unbind: function(el, binding) {
        // Remove Event Listeners
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null

      }
    }
  }
})