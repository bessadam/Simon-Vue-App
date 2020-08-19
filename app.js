Vue.config.devtools = true
var myApp = new Vue({
  el: '#app',
  data: {
    active: false,
    running: false,
    strict: false,
    activeInputState: false,
    series: [],
    inputSeries: [],
    activeCount: 1,
    targetCount: 20,
    activeButton: null,
    timeouts: [],
    message: 'info',
    sounds: {
      1: '/assets/sounds/1.mp3',
      2:'/assets/sounds/2.mp3',
      3: '/assets/sounds/3.mp3',
      4: '/assets/sounds/4.mp3'
    }
  },
  created () {},
  mounted () {},
  watch: {
    'message' (newVal, oldVal) {
      if (oldVal === 'warn' && newVal === null) {
        if (this.strict) {
          this.activeCount = 1
        } else {
          this.displaySeries()
        }
      }
    },
    'active' () {
      this.running = false
      this.strict = false
      this.activeInputState = false
    },
    'running' (val) {
      this.activeCount = 1
      if (val) {
        this.startGame()
      } else {
        this.timeouts.forEach((item) => {
          clearTimeout(item)
        })
      }
      this.activeInputState = false
    }
  },
  computed: {
    getActiveCount () {
      return (this.active && this.running) ? this.activeCount < 30 ? '0' + this.activeCount : this.activeCount : '0'
    }
  },
  methods: {
    playSound (id) {
      this.$refs['sound' + id][0].play()
    },
    handleButtonClick (button) {
      if (!this.activeInputState) return
      clearTimeout(this.waitforInput)

      this.playSound(button)

      let index = this.inputSeries.length

      if (this.series[index] === button) {
        this.inputSeries.push(button)
      } else {
        this.message = 'warn'
      }

      if (this.inputSeries.length === this.activeCount) {
        if (this.activeCount === this.targetCount) {
          this.message = 'success'
          this.running = false
        } else {
          this.activeCount++
          this.displaySeries()
        }
      }
    },
    displaySeries (callback) {
      this.activeInputState = false
      this.inputSeries = []
      for (var i = 0; i < this.activeCount; i++) {
        let tmp = i

        let to = setTimeout(() => {
          this.activeButton = this.series[tmp]
          this.playSound(this.activeButton)
          setTimeout(() => {
            this.activeButton = null
            if (tmp === this.activeCount - 1) {
              this.activeInputState = true
              clearTimeout(this.waitforInput)
              if (callback) callback()
            }
          }, 600)
        },
        400 + (i * 400))

        this.timeouts.push(to)
      }
    },
    startGame () {
      this.generateSeries()
      this.displaySeries()
    },
    generateSeries () {
      this.series = []
      for (var i = 0; i < this.targetCount; i++) {
        this.series.push(Math.floor((Math.random() * 4) + 1))
      }
    },
    toggleActive () {
      this.active = !this.active
    },
    toggleRunning () {
      if (!this.active) return
      this.running = !this.running
    },
    toggleStrict () {
      if (!this.active) return
      this.strict = !this.strict
    }
  }
})