'use strict'
;(() => {
  const createElementFromHTML = (htmlString) => {
    if (typeof htmlString !== 'string') return htmlString
    const str = htmlString.replace(/\r?\n/g, '').replace(/\s+/g, ' ').trim()
    const div = document.createElement('div')
    div.innerHTML = str
    const arr = [].slice.call(div.children)
    return arr.length > 0 ? arr : htmlString
  }

  const isDom = (item) =>
    item.nodeType !== undefined && [3].indexOf(item.nodeType) === -1

  const whatType = (item) =>
    isDom(item)
      ? 'dom'
      : toString
          .call(item)
          .replace('[', '')
          .replace(']', '')
          .split(' ')[1]
          .toLowerCase()

  const readSelector = (selector) => {
    if (selector === undefined) return Array.from([])
    let elements = []
    const selectorTemp = createElementFromHTML(selector)
    const type = whatType(selectorTemp)
    if (type === 'array') selector = selectorTemp
    switch (type) {
      case 'dom':
        elements = [selector]
        break
      case 'text':
      case 'string':
        elements = document.querySelectorAll(selector)
        break
      case 'nodelist':
      case 'array':
        elements = selector
        break
      case 'object':
        elements =
          type === 'object' && selector.elements !== undefined
            ? selector.elements
            : []
        break
    }
    return Array.from(elements)
  }

  const emptyCallback = () => {}

  if (typeof ap === 'undefined') window.ap = {}
  window.ap = function (selector) {
    const elements = readSelector(selector)
    return {
      elements,
      selector,
      on(evt, selector = undefined, handler = undefined) {
        const matchesSelect = (target, selector) =>
          target.matches(selector + ', ' + selector + ' *')
        const isSrting = (selector) => typeof selector === 'string'
        this.each((element) => {
          element.addEventListener(evt, (event) => {
            const callback = handler === undefined ? selector : handler
            let target = false
            if (isSrting(selector) && matchesSelect(event.target, selector)) {
              target = event.target.closest(selector)
            } else if (
              isSrting(this.selector) &&
              matchesSelect(event.target, this.selector) &&
              selector === undefined
            ) {
              target = event.target
            }
            if (target !== false) {
              callback.apply(target, [event, target])
            }
          })
        })
        return this
      },
      each: (callback = emptyCallback) =>
        elements.forEach((element) => callback(element))
    }
  }
})()
