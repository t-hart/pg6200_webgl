type t = {
  objData: AbstractTypes.objData,
  programs: StringMap.t(AbstractTypes.webGlProgram),
  texture: option(AbstractTypes.webGlTexture),
};

let toRenderArgs = (model, programName) =>
  AbstractTypes.renderArg(
    ~objData=model.objData,
    ~program=StringMap.find(programName, model.programs),
    ~texture=model.texture,
  );

let fromAbstract = abstract =>
  AbstractTypes.{
    objData: abstract->objDataGet,
    programs: abstract->programsGet |> StringMap.fromJsDict,
    texture: abstract->textureGet,
  };
