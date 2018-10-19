type t = {
  scale: int,
  rotation: Vector.t(int),
};

[@bs.deriving abstract]
type abstract = {
  scale: float,
  rotation: array(float),
  drawArgs: DrawArgs.abstract,
};

let toAbstract = (opts, drawArgs) =>
  abstract(
    ~scale=opts.scale->Utils.toDecimal,
    ~rotation=opts.rotation->Vector.toFloatArray,
    ~drawArgs,
  );
