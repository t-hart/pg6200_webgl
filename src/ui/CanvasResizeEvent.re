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
  let dimensions: Webapi.Dom.Event.t => array(int) = [%bs.raw
    "({detail}) => [detail.width, detail.height]"
  ];
  e |> dimensions |> (d => (d[0], d[1]));
};

let addListener = f => WindowRe.addEventListener(name, f, window);

let removeListener = f => WindowRe.removeEventListener(name, f, window);
