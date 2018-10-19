[@bs.deriving abstract]
type t =
  | ();

[@bs.module "../camera"] external create: unit => t = "";
