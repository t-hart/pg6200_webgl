type t = {
  scale: int,
  rotation: Vector.t(int),
  drawArgs: DrawArgs.abstract,
};

[@bs.deriving abstract]
type abstract = {
  scale: float,
  rotation: array(float),
  drawArgs: DrawArgs.abstract,
};

let create = drawArgs => {
  scale: 100,
  rotation: Vector.make(0, 0, 0),
  drawArgs,
};

let isRotating = t => t.rotation !== Vector.zero;

let toAbstract = opts =>
  abstract(
    ~scale=opts.scale->Utils.toDecimal,
    ~rotation=opts.rotation->Vector.toFloatArray,
    ~drawArgs=opts.drawArgs,
  );
