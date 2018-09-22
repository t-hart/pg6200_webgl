let toOption = Js.Nullable.toOption;

let debug = (msg, a) => {
  Js.log2(msg, a);
  a;
};

let value = event => event->ReactEvent.Form.target##value;

let const = (a, _) => a;

let eventRegistration = (f, event, handler) =>
  f(event, handler, Webapi.Dom.Document.asEventTarget(Webapi.Dom.document));

let addEventListener =
  eventRegistration(Webapi.Dom.EventTarget.addEventListener);

let removeEventListener =
  eventRegistration(Webapi.Dom.EventTarget.removeEventListener);

let addKeyboardEventListener = addEventListener("keypress");

let removeKeyboardEventListener = removeEventListener("keypress");
