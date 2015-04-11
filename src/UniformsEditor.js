import React from "react";
import {defaultValueForType} from "./core";
import UniformEditor from "./UniformEditor";
import objectAssign from "object-assign";

const PropTypes = React.PropTypes;

const propTypes = {
  onChange: PropTypes.func.isRequired,
  types: PropTypes.object.isRequired,
  values: PropTypes.object,
  width: PropTypes.number,
  labelsWidth: PropTypes.number,
  colorLabel: PropTypes.string,
  colorHighlight: PropTypes.string,
  colorHighlightHover: PropTypes.string,
  uniformInputMargin: PropTypes.number,
  inputStyle: PropTypes.object,
  style: PropTypes.object,
  renderNoUniforms: PropTypes.func,
  renderSampler2DInput: PropTypes.func
};

const defaultProps = {
  width: 300,
  labelsWidth: 100,
  colorLabel: "#579",
  colorHighlight: "#49F",
  colorHighlightHover: "#9cf",
  values: {},
  uniformInputMargin: 8,
  inputStyle: {
    color: "#579",
    fontFamily: "monospace",
    fontSize: "12px",
    lineHeight: "16px",
    padding: "0 5px",
    margin: "0"
  },
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

export default class UniformsEditor extends React.Component {

  onUniformChange (u, value, index) {
    const uniformValues = objectAssign({}, this.props.values);
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
      colorLabel,
      colorHighlight,
      colorHighlightHover,
      inputStyle,
      uniformInputMargin,
      renderSampler2DInput,
      style
    } = this.props;

    const styles = objectAssign({ width: width+"px" }, style);

    const inputStyleWithDefaults = objectAssign({}, defaultProps.inputStyle, inputStyle);

    const uniforms = Object.keys(types).map(function (u) {
      var type = types[u];
      var value = values[u] || defaultValueForType(type);
      return <UniformEditor
        key={u}
        id={u}
        type={type}
        name={u}
        value={value}
        onChange={this.onUniformChange.bind(this, u)}
        width={width}
        labelsWidth={labelsWidth}
        colorLabel={colorLabel}
        colorHighlight={colorHighlight}
        colorHighlightHover={colorHighlightHover}
        inputStyle={inputStyleWithDefaults}
        uniformInputMargin={uniformInputMargin}
        renderSampler2DInput={renderSampler2DInput}
      />;
    }, this);

    if (uniforms.length) {
      return <div style={styles}>{uniforms}</div>;
    }
    else {
      return <div style={styles}>
        {this.props.renderNoUniforms()}
      </div>;
    }
  }

}

UniformsEditor.propTypes = propTypes;
UniformsEditor.defaultProps = defaultProps;
