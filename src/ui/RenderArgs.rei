[@bs.deriving abstract]
type abstract = {
  objData: ObjData.abstract,
  program: WebGl.program,
  texture: option(WebGl.texture),
};
