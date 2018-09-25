type axis =
  | X
  | Y
  | Z;

type t =
  | Rotation(axis)
  | Translation(axis);
