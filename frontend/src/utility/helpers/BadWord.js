const { log, isValid } = require('./common')

/* eslint-disable no-mixed-operators */
const localList = [] /* require('./lang.json').words*/
const baseList = [] /*require('badwords-list').array*/

class Filter {
  /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {array} options.list - Instantiate filter with custom list
   * @param {string} options.placeHolder - Character used to replace profane words.
   * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
   * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
   * @param {string} options.splitRegex - Regular expression used to split a string into words.
   */

  constructor(options = {}) {
    Object.assign(this, {
      list:
        (options.emptyList && []) ||
        Array.prototype.concat.apply(localList, [baseList, options.list || []]),
      exclude: options.exclude || [],
      splitRegex: options.splitRegex || /\b/,
      placeHolder: options.placeHolder || '*',
      regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
      replaceRegex: options.replaceRegex || /\w/g,
      wrongCount: 0
    })
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  isProfane(string) {
    return (
      this.list.filter((word) => {
        const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi')
        return !this.exclude.includes(word.toLowerCase()) && wordExp.test(string)
      }).length > 0 || false
    )
  }

  /**
   * Replace a word with placeHolder characters
   * @param {string} string - String to replace.
   */
  replaceWord(string) {
    // log("string", string)
    // return string
    //     .replace(this.regex, '')
    //     .replace(this.replaceRegex, ` x `)
    // string.replaceAll(this.replaceRegex, ` x `)
    return `©start©${string}©end©`
  }
  replaceWordRest(string) {
    // log("string", string)
    // return string
    //     .replace(this.regex, '')
    //     .replace(this.replaceRegex, ` x `)
    // string.replaceAll(this.replaceRegex, ` x `)
    return `©start_rest©${string}©end_rest©`
  }

  /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */
  clean(string) {
    // log(this.list)
    string = string.replace(/\s+/g, ' ').trim()
    const theArray = string.split(this.splitRegex)
    const arrayLength = theArray.length
    let x = 0
    this.wrongCount = 0
    while (x < arrayLength) {
      const word = theArray[x]
      if (this.isProfane(word)) {
        this.wrongCount++
        theArray[x] = this.replaceWord(word)
      } else {
        theArray[x] = this.replaceWordRest(word)
      }
      x++
    }
    return isValid(this.splitRegex.exec(string))
      ? theArray.join(this.splitRegex.exec(string)[0])
      : string
    // return string.split(this.splitRegex).map((word) => {
    //     if (this.isProfane(word)) {
    //         this.wrongCount++
    //         return this.replaceWord(word)
    //     } else {
    //         return this.replaceWordRest(word)
    //     }
    // }).join(this.splitRegex.exec(string)[0])
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} word - Word(s) to add to blacklist
   */
  addWords() {
    const words = Array.from(arguments)

    this.list.push(...words)

    words
      .map((word) => word.toLowerCase())
      .forEach((word) => {
        if (this.exclude.includes(word)) {
          this.exclude.splice(this.exclude.indexOf(word), 1)
        }
      })
  }
  getWrongCount() {
    return this.wrongCount
  }
  /**
   * Add words to whitelist filter
   * @param {...string} word - Word(s) to add to whitelist.
   */
  removeWords() {
    this.exclude.push(...Array.from(arguments).map((word) => word.toLowerCase()))
  }
}

export default Filter
