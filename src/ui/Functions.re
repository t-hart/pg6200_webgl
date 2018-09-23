let toOption = Js.Nullable.toOption;

let debug = (msg, a) => {
  Js.log2(msg, a);
  a;
};

let toDecimal = x => float_of_int(x) /. 100.0;

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

/* let render = */
/*     ( */
/*       opts: Types.globalOptionsAbstract, */
/*       drawArgs: Types.drawArgs, */
/*       draw: (Types.drawArgs, float, Types.globalOptionsAbstract) => unit, */
/*       rotation: float, */
/*       previousTime: float, */
/*       currentTime: float, */
/*     ) => { */
/*   let currentSeconds = currentTime * 0.001; */
/*   let delta = currentSeconds - previousTime; */
/*   draw(drawArgs, rotation, opts); */
/*   render(opts, drawArgs, draw, rotation + delta, currentTime); */
/* }; */

/* const render = (cubeRotation: number) => (then: number) => (now: number) => { */
/*   const nowSeconds = now * 0.001 */
/*     const deltaS = nowSeconds - then */
/*     drawScene(drawArgs, cubeRotation, opts) */
/*     requestAnimationFrame(render(cubeRotation + deltaS)(nowSeconds)) */
/* } */
