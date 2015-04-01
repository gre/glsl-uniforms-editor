function contains (t, v) {
  return t.indexOf(v) !== -1;
}

const primitiveTypes = ["float", "int", "bool", "sampler2D"];

export function primitiveForType (t) {
  if (contains(primitiveTypes, t)) return t;
  if (t[0] === "b") return "bool";
  if (t[0] === "i") return "int";
  return "float";
}

export function arityForType (t) {
  if (contains(t, "vec2")) return 2;
  if (contains(t, "vec3")) return 3;
  if (contains(t, "vec4")) return 4;
  if (t === "mat2") return 4;
  if (t === "mat3") return 9;
  if (t === "mat4") return 16;
  return 1;
}

export function componentLinesForType (t) {
  if (t === "mat2") return 2;
  if (t === "mat3") return 3;
  if (t === "mat4") return 4;
  return 1;
}

export function labelsForType (t, name) {
  if (contains(t, "vec")) {
    var colorLike = (name||"").toLowerCase().indexOf("color") > -1 && (t[3]==="3" || t[3]==="4");
    return colorLike ? [".r",".g",".b",".a"] : [".x", ".y", ".z", ".w"];
  }
  if (t === "mat2") {
    return [
      "[0].x", "[0].y",
      "[1].x", "[1].y"
    ];
  }
  if (t === "mat3") {
    return [
      "[0].x", "[0].y", "[0].z",
      "[1].x", "[1].y", "[1].z",
      "[2].x", "[2].y", "[2].z"
    ];
  }
  if (t === "mat4") {
    return [
      "[0].x", "[0].y", "[0].z", "[0].w",
      "[1].x", "[1].y", "[1].z", "[1].w",
      "[2].x", "[2].y", "[2].z", "[2].w",
      "[3].x", "[3].y", "[3].z", "[3].w"
    ];
  }
}

const defValTypes = { "bool": false, "int": 0, "float": 0.0, "sampler2D": null };
export function defaultValueForType (t) {
  var arity = arityForType(t);
  var primitive = primitiveForType(t);
  var v = defValTypes[primitive];
  if (arity === 1) return v;
  var arr = [];
  for (var i=0; i<arity; ++i)
    arr.push(v);
  return arr;
}
