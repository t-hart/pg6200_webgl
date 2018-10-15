let dispatch: (int, int) => bool;

let details: Webapi.Dom.Event.t => (int, int);

let addListener: (Webapi.Dom.Event.t => unit) => unit;

let removeListener: (Webapi.Dom.Event.t => unit) => unit;
