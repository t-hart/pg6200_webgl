type t = {
  scale: int,
  rotation: Vector.t(int),
};

[@bs.deriving abstract]
type abstract = {
  scale: float,
  rotation: array(float),
  camera: Camera.abstractNew,
};

let toAbstract = (opts, camera) =>
  abstract(
    ~scale=opts.scale->Utils.toDecimal,
    ~rotation=opts.rotation->Vector.toFloatArray,
    ~camera,
  );
