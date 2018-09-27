type t = {
  position: Vector.t(int),
  rotation: Vector.t(int),
  velocity: int,
};

[@bs.deriving abstract]
type abstract = {
  position: array(float),
  rotation: array(float),
};

let toAbstract = cam =>
  abstract(
    ~rotation=cam.rotation |> Vector.toFloatArray,
    ~position=cam.position |> Vector.toFloatArray,
  );
