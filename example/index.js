import React from "react/addons";
import UniformsEditor from "..";
import libPackage from "../package.json";

window.Perf = React.addons.Perf;

const linkStyle = {
  color: "#49F",
  textDecoration: "none"
};

const editorStyle = {
  display: "inline-block",
  marginRight: "40px"
};

class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      types: {
        bool: "bool",
        float: "float",
        int: "int",
        bvec2: "bvec2",
        ivec2: "ivec2",
        vec2: "vec2",
        bvec3: "bvec3",
        vec3: "vec3",
        bvec4: "bvec4",
        vec4: "vec4",
        mat2: "mat2",
        mat3: "mat3",
        sampler2D: "sampler2D"
      },
      values: {
        bool: true,
        float: 0.2,
        int: 42,
        ivec2: [4, 2],
        vec2: [1, 0],
        vec3: [3.4, 12.5, 5.6],
        bvec3: [false, true, true],
        mat2: [1,2,3,4],
        mat3: [0,0,0, 4,0,0.1, 3.3,0,0],
        sampler2D: "https://i.imgur.com/EtR2qn4.png"
      }
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange (values) {
    this.setState({ values });
  }

  render() {
    const {
      types,
      values
    } = this.state;
    return <div>
      <h1><a href={libPackage.homepage} style={linkStyle}>{libPackage.name}</a></h1>
      <h2 style={{ color: "#aaa", fontWeight: "normal" }}>{libPackage.description}</h2>
      <blockquote>
      <strong>values</strong>{" = "}<code>{JSON.stringify(values)}</code>
      </blockquote>

      <hr />

      <UniformsEditor
        style={editorStyle}
        types={types}
        values={values}
        onChange={this.onChange}
      />

      <UniformsEditor
        style={editorStyle}
        types={types}
        values={values}
        onChange={this.onChange}
        width={400}
        colorLabel="#000"
        colorHighlight="#f39"
        colorHighlightHover="#ccc"
        inputStyle={{
          background: "#555",
          color: "#fff"
        }}
      />

      <hr />

      <p>
        <a style={linkStyle} target="_blank" href={libPackage.homepage+"/blob/master/example/index.js"}>Source code of these examples.</a>
      </p>
    </div>;
  }
}

document.body.style.padding = "0px 20px";
document.body.style.color = "#333";
document.body.style.background = "#fff";
document.body.style.fontFamily = "sans-serif";
React.render(<Example />, document.body);
