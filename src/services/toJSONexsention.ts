class toJSON extends String {
  constructor(x = '') {
    super(x)
    this.otherInstanceProp = ':)'
  }

  somethingStupid() {
    return [].map
      .call(this, function(letter) {
        if (Math.random() * 1 > 0.5) return letter.toUpperCase()
        else return letter.toLowerCase()
      })
      .join('')
  }
}
