module StringMapInternal =
  MapUtils.Make({
    type t = string;
    let compare = compare;
  });

include StringMapInternal;

let fromJsDict = jsDict =>
  jsDict
  |> Js.Dict.entries
  |> Array.fold_left((acc, (key, value)) => add(key, value, acc), empty);
