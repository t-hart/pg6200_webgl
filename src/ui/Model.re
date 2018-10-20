[@bs.module "../models"] external defaultProgram: string = "";

[@bs.deriving abstract]
type abstract = Js.Dict.t(DrawArgs.abstract);

type t = {
  drawArgs: StringMap.t(DrawArgs.abstract),
  currentDrawArgs: string,
  isSelected: bool,
  scale: int,
  rotation: Vector.t(int),
};

let isRotating = t => t.isSelected && t.rotation !== Vector.zero;

let shouldRender = t => t.isSelected;

let changeDrawArgs = (drawArgs, t) => {...t, currentDrawArgs: drawArgs};

let toggleSelectedState = t => {...t, isSelected: !t.isSelected};

let setRotation = (rotation, t) => {...t, rotation};

let setScale = (scale, t) => {...t, scale};

let fromAbstract = drawArgsAbstract => {
  let drawArgs = StringMap.fromJsDict(drawArgsAbstract);
  {
    drawArgs,
    currentDrawArgs: defaultProgram,
    isSelected: false,
    scale: 100,
    rotation: Vector.zero,
  };
};

let toAbstract = a =>
  ModelOptions.toAbstract({
    scale: a.scale,
    rotation: a.rotation,
    drawArgs: StringMap.find(a.currentDrawArgs, a.drawArgs),
  });
