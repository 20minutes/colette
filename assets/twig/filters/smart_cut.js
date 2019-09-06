module.exports = function extend(Twig) {
  /**
   * Return a truncated string without cutting within a word
   * Note that the default `truncate` filter fails when the limit falls
   * into the last word of `text`.
   *
   * @param string    text
   * @param int       maxLength
   * @param string    breaker
   *
   * @return string
   */
  function smartCut(text, maxLength = 30, breaker = '…') {
    if (!text || text.length <= maxLength) {
      return text
    }
    let textResult = text
    let newMaxLength = maxLength

    textResult = textResult.substr(0, newMaxLength)

    const breakpoint = textResult.lastIndexOf(' ')
    if (breakpoint > 0) {
      newMaxLength = breakpoint
    }

    return text.substr(0, newMaxLength).trim + breaker
  }

  Twig.extendFilter('smart_cut', smartCut)
}
