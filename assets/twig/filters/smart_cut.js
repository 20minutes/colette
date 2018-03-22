module.exports = function (Twig) {
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
            return text;
        }

        text = text.substr(0, maxLength);

        const breakpoint = text.lastIndexOf(' ');
        if (breakpoint > 0) {
            maxLength = breakpoint;
        }

        return text.substr(0, maxLength).trim + breaker;
    }

    Twig.extendFilter('smart_cut', smartCut);
};
