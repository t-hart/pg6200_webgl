let keycodeMovementMap: StringMap.t(Movement.t);

let getMovement: string => option(Movement.t);

let move: (Movement.axis, int) => Vector.t(option(int));
