type t = {
  position: Vector.t(int),
  rotation: Vector.t(int),
  velocity: int,
};

[@bs.deriving abstract]
type abstract = {
  position: array(int),
  rotation: array(int),
};

let toAbstract = cam =>
  abstract(
    ~rotation=cam.rotation |> Vector.toArray,
    ~position=cam.position |> Vector.toArray,
  );
