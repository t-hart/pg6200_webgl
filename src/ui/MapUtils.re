module Make = (Ord: Map.OrderedType) => {
  include Map.Make(Ord);

  let get = (key, map) =>
    exists((k, _) => k === key, map) ? find(key, map)->Some : None;

  let getWithDefault = (map, default, key) =>
    Belt.Option.getWithDefault(get(key, map), default);

  let update = (key, f, map) =>
    switch (get(key, map)->f) {
    | Some(x) => add(key, x, map)
    | None => remove(key, map)
    };

  let keys = map => bindings(map) |> List.map(((k, _)) => k);

  let fromList = l =>
    l |> List.fold_left((acc, (k, v)) => add(k, v, acc), empty);

  let toArray = x =>
    /* fold((_, v, acc) => Js.Array.concat([|v|], acc), x, [||]); */
    fold((_, v, acc) => [v, ...acc], x, []) |> Array.of_list;
};
