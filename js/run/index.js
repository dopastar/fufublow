var app = new Vue({
  el: '#app',
  data: {
    status: '',
    volume: 0,
    audioContext: null,
    meter: null,
    canvasContext: null,
    WIDTH: null,
    HEIGHT: null,
    rafID: null,
    mediaStreamSource: null,
  },
  methods: {
    didntGetStream: function() {
      alert('麥克風載入失敗');
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
    init: function() {

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

    },
  },
  mounted: function() {
    this.init();
  },
  watch: {},
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