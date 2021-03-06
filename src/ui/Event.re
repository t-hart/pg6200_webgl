[@bs.val] external window: WindowRe.t = "";

let registration = (f, handler) =>
  f(handler, Webapi.Dom.Document.asEventTarget(Webapi.Dom.document));

let addKeyDownListener =
  registration(Webapi.Dom.EventTarget.addKeyDownEventListener);

let addKeyUpListener =
  registration(Webapi.Dom.EventTarget.addKeyUpEventListener);

let removeKeyDownListener =
  registration(Webapi.Dom.EventTarget.removeKeyDownEventListener);

let removeKeyUpListener =
  registration(Webapi.Dom.EventTarget.removeKeyUpEventListener);

let addResizeListener = f => WindowRe.addEventListener("resize", f, window);

let removeResizeListener = f =>
  WindowRe.removeEventListener("resize", f, window);

let value = event => event->ReactEvent.Form.target##value;
