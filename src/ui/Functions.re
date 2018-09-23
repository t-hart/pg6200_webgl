let modelFromAbstract = abstract =>
  AbstractTypes.{
    Types.objData: abstract->objDataGet,
    programs: abstract->programsGet |> StringMap.fromJsDict,
    texture: abstract->textureGet,
  };

let modelToRenderArgs = (model, programName) =>
  Types.(
    AbstractTypes.renderArg(
      ~objData=model.objData,
      ~program=StringMap.find(programName, model.programs),
      ~texture=model.texture,
    )
  );

let globalOptsToAbstract = opts =>
  Types.(
    AbstractTypes.globalOptions(
      ~scale=opts.scale->Utils.toDecimal,
      ~rotation=opts.rotation->Vector.asArray,
    )
  );

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
