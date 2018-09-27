type t = {
  position: Vector.t(int),
  rotation: Vector.t(int),
  velocity: int,
};

/* [@bs.deriving abstract] */
/* type cameraType = { */
/*   position: array(float), */
/*   rotation: array(float), */
/* }; */

let toAbstract = cam =>
  AbstractTypes.cameraType(
    ~rotation=cam.rotation |> Vector.toFloatArray,
    ~position=cam.position |> Vector.toFloatArray,
  );
