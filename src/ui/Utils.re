let toOption = Js.Nullable.toOption;

let debug = (msg, a) => {
  Js.log2(msg, a);
  a;
};

let toDecimal = x => float_of_int(x) /. 100.0;

let const = (a, _) => a;

let id = a => a;

let default = (a, b) => Belt.Option.getWithDefault(b, a);

let mapOption = (f, a) => Belt.Option.map(a, f);
