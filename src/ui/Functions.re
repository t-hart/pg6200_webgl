/* let render = */
/*   ( */
/*   opts: AbstractTypes.globalOptions, */
/*   drawArgs: AbstractTypes.drawArgs, */
/*   draw: */
/*     (AbstractTypes.drawArgs, float, AbstractTypes.globalOptions) => unit, */
/*   rotation: float, */
/*   previousTime: float, */
/*   currentTime: float, */
/* ) => { */

let render = (opts, drawArgs, draw, rotation, previousTime, currentTime) => {
  let currentSeconds = currentTime *. 0.001;
  let delta = currentSeconds -. previousTime;
  draw(drawArgs, rotation, opts);
  (rotation +. delta, currentTime);
};
