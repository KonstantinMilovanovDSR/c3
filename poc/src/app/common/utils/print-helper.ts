const hideFromPrintClass = 'pe-no-print'
const preservePrintClass = 'pe-preserve-print'
const preserveAncestorClass = 'pe-preserve-ancestor'
const bodyElementName = 'BODY'

export class PrintHelper {
  private _hide = (element) => {
    if (!element.classList.contains(preservePrintClass)) {
      element.classList.add(hideFromPrintClass)
    }
  }

  private _preserve(element, isStartingElement) {
    element.classList.remove(hideFromPrintClass)
    element.classList.add(preservePrintClass)
    if (!isStartingElement) {
      element.classList.add(preserveAncestorClass)
    }
  }

  private _clean = (element) => {
    element.classList.remove(hideFromPrintClass)
    element.classList.remove(preservePrintClass)
    element.classList.remove(preserveAncestorClass)
  }

  private _walkSiblings(element, callback) {
    let sibling = element.previousElementSibling
    while (sibling) {
      callback(sibling)
      sibling = sibling.previousElementSibling
    }
    sibling = element.nextElementSibling
    while (sibling) {
      callback(sibling)
      sibling = sibling.nextElementSibling
    }
  }

  private _attachPrintClasses = (element, isStartingElement) => {
    this._preserve(element, isStartingElement)
    this._walkSiblings(element, this._hide)
  }

  _cleanup = (element, isStartingElement) => {
    this._clean(element)
    this._walkSiblings(element, this._clean)
  }

  _walkTree(element, callback) {
    let currentElement = element
    callback(currentElement, true)
    currentElement = currentElement.parentElement
    while (currentElement && currentElement.nodeName !== bodyElementName) {
      callback(currentElement, false)
      currentElement = currentElement.parentElement
    }
  }

  print(elements: HTMLElement[]): void {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < elements.length; i++) {
      this._walkTree(elements[i], this._attachPrintClasses)
    }
    window.print()
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < elements.length; i++) {
      this._walkTree(elements[i], this._cleanup)
    }
  }
}
