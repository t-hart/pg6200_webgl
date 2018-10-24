[@bs.module "../models"] external defaultProgram: string = "";

[@bs.deriving abstract]
type abstract = {
  scale: float,
  orientation: array(float),
  position: array(float),
  color: array(float),
  drawArgs: DrawArgs.abstract,
};

type t = {
  drawArgs: StringMap.t(DrawArgs.abstract),
  currentDrawArgs: string,
  isSelected: bool,
  scale: int,
  color: Vector.t(int),
  orientation: Vector.t(int),
  position: Vector.t(int),
};

let toAbstract = model =>
  abstract(
    ~scale=model.scale->Utils.toDecimal,
    ~orientation=model.orientation->Vector.toFloatArray,
    ~position=model.position->Vector.toFloatArray,
    ~color=model.color->Vector.toFloatArray4D(_, 100),
    ~drawArgs=StringMap.find(model.currentDrawArgs, model.drawArgs),
  );

let fromAbstract = drawArgsAbstract => {
  let drawArgs = StringMap.fromJsDict(drawArgsAbstract);
  {
    drawArgs,
    color: Vector.make(Random.int(101), Random.int(101), Random.int(101)),
    currentDrawArgs: defaultProgram,
    isSelected: false,
    scale: 100,
    orientation: Vector.zero,
    position: Vector.zero,
  };
};

let reset = t => {
  ...t,
  currentDrawArgs: defaultProgram,
  isSelected: false,
  scale: 100,
  orientation: Vector.zero,
  position: Vector.zero,
};
let isRotating = t => t.isSelected && !Vector.isZero(t.orientation);
let shouldRender = t => t.isSelected;
let changeDrawArgs = (drawArgs, t) => {...t, currentDrawArgs: drawArgs};
let toggleSelectedState = t => {...t, isSelected: !t.isSelected};
let setOrientation = (orientation, t) => {...t, orientation};
let setPosition = (position, t) => {...t, position};
let setColor = (color, t) => {...t, color};
let setScale = (scale, t) => {...t, scale};
