import React from "react";
import {primitiveForType, arityForType, componentLinesForType, labelsForType} from "./core";
import UniformComponentInput from "./UniformComponentInput";
import objectAssign from "object-assign";

function range (min, max) {
  var t = [];
  for (var i=min; i<max; ++i)
    t.push(i);
  return t;
}

export default class UniformEditor extends React.Component {

  constructor (props) {
    super(props);
    this.setBlur = this.setBlur.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.setHoverEnter = this.setHoverEnter.bind(this);
    this.setHoverLeave = this.setHoverLeave.bind(this);
    this.state = {
      focus: null,
      hover: null
    };
  }

  setBlur () {
    this.setState({
      focus: null
    });
  }

  setFocus (index) {
    this.setState({
      focus: (typeof index !== "number" ? [] : [index])
    });
  }

  setHoverLeave () {
    this.setState({
      hover: null
    });
  }

  setHoverEnter (index) {
    this.setState({
      hover: (typeof index !== "number" ? [] : [index])
    });
  }

  render() {
    const {
      setFocus,
      setBlur,
      setHoverEnter,
      setHoverLeave
    } = this;
    const {
      type,
      name,
      onChange,
      value,
      id,
      width,
      labelsWidth,
      colorLabel,
      colorHighlight,
      colorHighlightHover,
      inputStyle,
      uniformInputMargin,
      renderSampler2DInput
    } = this.props;
    const {
      focus,
      hover
    } = this.state;

    const inputsWidth = width - labelsWidth;

    const primitiveType = primitiveForType(type);
    const arity = arityForType(type);
    const componentLines = componentLinesForType(type);
    const labels = labelsForType(type, name);

    function onChangeForIndex (index) {
      return function (value) {
        onChange(value, index);
      };
    }

    const inputsStyle = {
      display: "inline-block",
      width: inputsWidth+"px"
    };

    const highlight = labels && (focus ?
       (focus.length ? labels[focus[0]] : labels) :
       null);

    const highlightHover = labels && !highlight && (hover ?
      (hover.length ? labels[hover[0]] : labels) :
      null);

    const labelHighlightStyle = {
      color: colorHighlight
    };

    const labelHighlightHoverStyle = {
      color: colorHighlightHover
    };

    const labelStyle = objectAssign({
      display: "inline-block",
      width: labelsWidth+"px",
      color: colorLabel,
      verticalAlign: "top"
    },
    hover && !labels ? labelHighlightHoverStyle : {},
    focus && !labels ? labelHighlightStyle : {});

    const style = {
      position: "relative",
      width: width+"px",
      paddingBottom: uniformInputMargin+"px"
    };

    const inputsLines = range(0, componentLines).map(function (l) {
      const lineStyle = {
        position: "relative"
      };
      var inputsPerLine = arity / componentLines;
      const inputStyleBase = {
        boxSizing: "border-box",
        width: Math.floor(inputsWidth / inputsPerLine) + "px"
      };
      function makeInputStyle (focused, hovered) {
        return objectAssign({}, inputStyle, inputStyleBase, primitiveType === "bool" ? {} : {
          borderStyle: "solid",
          borderColor: focused ? colorHighlight : (hovered ? colorHighlightHover : "#eee"),
          outline: focused ? colorHighlight+" 1px solid" : "none",
          boxShadow: focused ? "0px 0px 2px "+colorHighlight : "none",
          borderWidth: "1px"
        });
      }
      var inputs = (function(){
        if (inputsPerLine === 1) {
          var iid = id+"_"+l;
          return <UniformComponentInput
            style={makeInputStyle(focus, hover)}
            key={iid}
            primitiveType={primitiveType}
            value={value}
            onChange={onChangeForIndex(null)}
            onFocus={setFocus}
            onBlur={setBlur}
            onMouseEnter={setHoverEnter}
            onMouseLeave={setHoverLeave}
            renderSampler2DInput={renderSampler2DInput}
          />;
        }
        else {
          return range(0, inputsPerLine).map(function (i) {
            var index = l * inputsPerLine + i;
            var iid = id+"_"+index;
            return <label key={"label-"+iid}>
              <UniformComponentInput
                style={makeInputStyle(focus && focus[0]===index, hover && hover[0]===index)}
                key={iid}
                primitiveType={primitiveType}
                value={value && value[index]}
                onChange={onChangeForIndex(index)}
                onFocus={setFocus.bind(null, index)}
                onBlur={setBlur}
                onMouseEnter={setHoverEnter.bind(null, index)}
                onMouseLeave={setHoverLeave}
                renderSampler2DInput={renderSampler2DInput}
              />
            </label>;
          });
        }
      }());
      return <div key={"input-line-"+l} style={lineStyle}>{inputs}</div>;
    });

    return <div style={style}>
      <label style={labelStyle}>{name}{
        !highlight && !highlightHover ? undefined :
        <span style={highlightHover ? labelHighlightHoverStyle : labelHighlightStyle}>
        {highlight || highlightHover}
        </span>
      }</label>
      <div style={inputsStyle}>{inputsLines}</div>
    </div>;
  }
}
