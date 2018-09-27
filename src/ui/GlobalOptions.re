type t = {
  scale: int,
  rotation: Vector.t(int),
  camera: Camera.t,
};

let toAbstract = opts =>
  AbstractTypes.globalOptions(
    ~scale=opts.scale->Utils.toDecimal,
    ~rotation=opts.rotation->Vector.toFloatArray,
    ~camera=opts.camera->Camera.toAbstract,
  );
