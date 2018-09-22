let toOption = Js.Nullable.toOption;

let debug = a => {
  Js.log(a);
  a;
};

let value = event => event->ReactEvent.Form.target##value;

let const = (a, _) => a;
