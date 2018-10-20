/* type t = { */
/*   disabled: bool, */
/*   content: ReasonReact.reactElement, */
/*   legend: string, */
/*   children: array(t), */
/* }; */

type node = {
  content: ReasonReact.reactElement,
  legend: string,
};

type branch = {
  legend: string,
  children: array(t),
}
and t =
  | Leaf(node)
  | Branch(branch);
