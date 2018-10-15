[@bs.val] external window: WindowRe.t = "";

let name = "canvasresize";

let dispatch = (width, height) => {
  let e =
    Webapi.Dom.CustomEvent.makeWithOptions(
      name,
      {
        "detail": {
          "width": width,
          "height": height,
        },
      },
    );
  EventTargetRe.dispatchEvent(e, window |> WindowRe.asEventTarget);
};

let details = e => {
  let width: Webapi.Dom.Event.t => int = [%bs.raw "e => e.detail.width"];
  let height: Webapi.Dom.Event.t => int = [%bs.raw "e => e.detail.height"];
  (width(e), height(e));
};

let addListener = f => WindowRe.addEventListener(name, f, window);

let removeListener = f => WindowRe.removeEventListener(name, f, window);
