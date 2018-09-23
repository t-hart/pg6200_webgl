module StringMapInternal =
  Map.Make({
    type t = string;
    let compare = compare;
  });

include StringMapInternal;

let fromJsDict = jsDict =>
  jsDict
  |> Js.Dict.entries
  |> Array.fold_left((acc, (key, value)) => add(key, value, acc), empty);

let get = (key, map) =>
  exists((k, _) => k === key, map) ? find(key, map)->Some : None;

let update = (key, f, map) => add(key, get(key, map)->f, map);

let keys = map => bindings(map) |> List.map(((k, _)) => k);
