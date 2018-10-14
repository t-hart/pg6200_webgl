[@bs.deriving abstract]
type abstractNew =
  | Abstract;

[@bs.module "../camera"] external create: unit => abstractNew = "";
