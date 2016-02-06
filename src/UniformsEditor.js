const React = require("react");
const {PropTypes} = React;
const {defaultValueForType} = require("./core");
const UniformEditor = require("./UniformEditor");

class UniformsEditor extends React.Component {

  onUniformChange (u, value, index) {
    const uniformValues = { ...this.props.values };
    if (index !== null) {
      const current = u in uniformValues ?
        uniformValues[u].slice(0) :
        defaultValueForType(this.props.types[u]);
      current[index] = value;
      uniformValues[u] = current;
    }
    else {
      uniformValues[u] = value;
    }
    this.props.onChange(uniformValues);
  }

  render () {
    const {
      types,
      values,
      width,
      labelsWidth,
      inputStyle,
      labelStyle,
      uniformInputMargin,
      renderSampler2DInput,
      style,
      renderNoUniforms
    } = this.props;

    const styles = { ...style, width: width+"px" };

    const uniforms = Object.keys(types).map(u => {
      const type = types[u];
      const value = values[u] || defaultValueForType(type);
      return <UniformEditor
        key={u}
        id={u}
        type={type}
        name={u}
        value={value}
        onChange={this.onUniformChange.bind(this, u)}
        width={width}
        labelsWidth={labelsWidth}
        inputStyle={inputStyle}
        labelStyle={labelStyle}
        uniformInputMargin={uniformInputMargin}
        renderSampler2DInput={renderSampler2DInput}
      />;
    });

    if (uniforms.length) {
      return <div style={styles}>{uniforms}</div>;
    }
    else {
      return <div style={styles}>
        {renderNoUniforms()}
      </div>;
    }
  }

}

UniformsEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  types: PropTypes.object.isRequired,
  values: PropTypes.object,
  width: PropTypes.number,
  labelsWidth: PropTypes.number,
  uniformInputMargin: PropTypes.number,
  inputStyle: PropTypes.func,
  labelStyle: PropTypes.func,
  style: PropTypes.object,
  renderNoUniforms: PropTypes.func,
  renderSampler2DInput: PropTypes.func
};

UniformsEditor.defaultProps = {
  width: 300,
  labelsWidth: 100,
  values: {},
  uniformInputMargin: 6,
  labelStyle: (highlight, hover) => ({
    color: highlight ? "#49f" : hover ? "#9cf" : "#579",
    fontSize: "12px",
    lineHeight: "20px",
    fontFamily: "Monaco, monospace"
  }),
  inputStyle: (focus, hover, { primitiveType }) => primitiveType === "bool" ? {} : ({
    color: "#579",
    fontSize: "12px",
    fontFamily: "Monaco, monospace",
    lineHeight: "16px",
    padding: "0 3px",
    margin: "0",
    border: "1px solid "+(focus ? "#49F" : (hover ? "#9cf" : "#eee")),
    outline: focus ? "#49F 1px solid" : "none",
    boxShadow: focus ? "0px 0px 2px #49F" : "none"
  }),
  style: {},
  renderSampler2DInput (props) {
    // The Sampler2D can be enhanced for more "validation" and with a context.
    const onChange = e => {
      const value = e.target.value || null;
      props.onChange(value);

    };
    return <input
      {...props}
      type="url"
      value={props.value}
      onChange={onChange}
    />;
  },
  renderNoUniforms () {
    return <div>no uniforms.</div>;
  }
};

module.exports = UniformsEditor;
