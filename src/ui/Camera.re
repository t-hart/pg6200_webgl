[@bs.deriving abstract]
type t =
  | Abstract;

[@bs.module "../camera"] external create: unit => t = "";
