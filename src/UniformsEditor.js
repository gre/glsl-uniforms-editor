import React from "react";
import {defaultValueForType} from "./core";
import UniformEditor from "./UniformEditor";

var _ = require("lodash");

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
    const uniformValues = _.clone(this.props.values);
    const current = _.clone(uniformValues[u]) || defaultValueForType(this.props.types[u]);
    if (typeof current !== "string" && _.isArray(current)) {
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

    const inputStyleWithDefaults = _.extend({}, defaultProps.inputStyle, inputStyle);

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
      return <div style={style}>{uniforms}</div>;
    }
    else {
      return <div style={style}>
        {this.props.renderNoUniforms()}
      </div>;
    }
  }

}

UniformsEditor.propTypes = propTypes;
UniformsEditor.defaultProps = defaultProps;
