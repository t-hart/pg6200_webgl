let getMovement: string => option((Movement.t, int => int));

let move: (Movement.axis, int) => Vector.t(option(int));
