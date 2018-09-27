type t = {
  objData: ObjData.abstract,
  programs: StringMap.t(WebGl.program),
  texture: option(WebGl.texture),
};

[@bs.deriving abstract]
type abstract = {
  objData: ObjData.abstract,
  programs: Js.Dict.t(WebGl.program),
  texture: option(WebGl.texture),
};

let toRenderArgs = (model, programName) =>
  RenderArgs.abstract(
    ~objData=model.objData,
    ~program=StringMap.find(programName, model.programs),
    ~texture=model.texture,
  );

let fromAbstract = abstract => {
  objData: abstract->objDataGet,
  programs: abstract->programsGet |> StringMap.fromJsDict,
  texture: abstract->textureGet,
};
