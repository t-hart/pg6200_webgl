module Make = (Ord: Map.OrderedType) => {
  include Map.Make(Ord);

  let get = (key, map) =>
    exists((k, _) => k === key, map) ? find(key, map)->Some : None;

  let getWithDefault = (map, default, key) =>
    Belt.Option.getWithDefault(get(key, map), default);

  let update = (key, f, map) => add(key, get(key, map)->f, map);

  let keys = map => bindings(map) |> List.map(((k, _)) => k);

  let fromList = l =>
    l |> List.fold_left((acc, (k, v)) => add(k, v, acc), empty);
};
