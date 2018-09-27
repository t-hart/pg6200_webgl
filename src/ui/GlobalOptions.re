type t = {
  scale: int,
  rotation: Vector.t(int),
  camera: Camera.t,
};

[@bs.deriving abstract]
type abstract = {
  scale: float,
  rotation: array(float),
  camera: Camera.abstract,
};

let toAbstract = opts =>
  abstract(
    ~scale=opts.scale->Utils.toDecimal,
    ~rotation=opts.rotation->Vector.toFloatArray,
    ~camera=opts.camera->Camera.toAbstract,
  );
