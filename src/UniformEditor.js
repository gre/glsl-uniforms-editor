const React = require("react");
const {primitiveForType, arityForType, componentLinesForType, labelsForType} = require("./core");
const UniformComponentInput = require("./UniformComponentInput");

function range (min, max) {
  var t = [];
  for (var i=min; i<max; ++i)
    t.push(i);
  return t;
}

class UniformEditor extends React.Component {

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
      inputStyle,
      labelStyle,
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
      width: inputsWidth+"px",
      position: "relative"
    };

    const highlight = labels && (focus ?
       (focus.length ? labels[focus[0]] : labels) :
       null);

    const highlightHover = labels && !highlight && (hover ?
      (hover.length ? labels[hover[0]] : labels) :
      null);

    const styleParams = { primitiveType, arity, componentLines, type, name };

    const labelHighlightStyle = labelStyle(true, false, styleParams);

    const labelHighlightHoverStyle = labelStyle(true, true, styleParams);

    const lblStyle = {
      display: "inline-block",
      width: labelsWidth+"px",
      verticalAlign: "top",
      ...labelStyle(false, false, styleParams),
      ...(hover && !labels ? labelHighlightHoverStyle : {}),
      ...(focus && !labels ? labelHighlightStyle : {})
    };

    const style = {
      position: "relative",
      width: width+"px",
      paddingBottom: uniformInputMargin+"px"
    };

    const inputsLines = range(0, componentLines).map(function (l) {

      var inputsPerLine = arity / componentLines;
      const inputStyleBase = {
        boxSizing: "border-box",
        width: Math.floor(inputsWidth / inputsPerLine + 1) + "px",
        margin: "0"
      };

      let isFocusOrHover = false;

      const inputs = (function(){
        if (inputsPerLine === 1) {
          var iid = id+"_"+l;
          isFocusOrHover = focus||hover;
          return <UniformComponentInput
            style={{ ...inputStyleBase, ...inputStyle(focus, hover, styleParams) }}
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
            var isFocus = focus && focus[0]===index;
            var isHover = hover && hover[0]===index;
            if (isFocus || isHover) isFocusOrHover = true;
            return <label key={"label-"+iid} style={{
              position: "relative",
              marginLeft: "-1px",
              zIndex: isFocus || isHover ? 2 : 0
            }}>
              <UniformComponentInput
                style={{
                  ...inputStyleBase,
                  ...inputStyle(isFocus, isHover, styleParams)
                }}
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

      const lineStyle = {
        position: "relative",
        marginTop: l>0 ? "-2px" : "0px",
        zIndex: isFocusOrHover ? 1 : 0
      };

      return <div key={"input-line-"+l} style={lineStyle}>{inputs}</div>;
    });

    return <div style={style}>
      <label style={lblStyle}>{name}{
        !highlight && !highlightHover ? undefined :
        <span style={highlightHover ? labelHighlightHoverStyle : labelHighlightStyle}>
        {highlight || highlightHover}
        </span>
      }</label>
      <div style={inputsStyle}>{inputsLines}</div>
    </div>;
  }
}

module.exports = UniformEditor;
