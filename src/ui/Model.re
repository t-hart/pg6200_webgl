[@bs.module "../models"] external defaultProgram: string = "";

[@bs.deriving abstract]
type abstract = {
  scale: float,
  rotation: array(float),
  drawArgs: DrawArgs.abstract,
};

type t = {
  drawArgs: StringMap.t(DrawArgs.abstract),
  currentDrawArgs: string,
  isSelected: bool,
  scale: int,
  rotation: Vector.t(int),
};

let toAbstract = model =>
  abstract(
    ~scale=model.scale->Utils.toDecimal,
    ~rotation=model.rotation->Vector.toFloatArray,
    ~drawArgs=StringMap.find(model.currentDrawArgs, model.drawArgs),
  );

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

let isRotating = t => t.isSelected && t.rotation !== Vector.zero;
let shouldRender = t => t.isSelected;
let changeDrawArgs = (drawArgs, t) => {...t, currentDrawArgs: drawArgs};
let toggleSelectedState = t => {...t, isSelected: !t.isSelected};
let setRotation = (rotation, t) => {...t, rotation};
let setScale = (scale, t) => {...t, scale};
