HTMLElement.prototype.__defineGetter__('currentStyle', function () {
  return this.ownerDocument.defaultView.getComputedStyle(this, null);
})