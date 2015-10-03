const React = require("react");
const NumberInput = require("./NumberInput");

const primitiveTypes = {
  "float": {
    type: "number",
    step: 0.1,
    value: 0.0,
    get: function (input) { return parseFloat(input.value, 10); }
  },
  "int": {
    type: "number",
    step: 1,
    value: 0,
    get: function (input) { return parseInt(input.value, 10); }
  },
  "bool": {
    type: "checkbox",
    checked: false,
    get: function (input) { return input.checked; }
  }
};

class UniformComponentInput extends React.Component {

  constructor (props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange (e) {
    var primitive = primitiveTypes[this.props.primitiveType];
    var value = primitive ? primitive.get(e.target) : e;
    if (value !== this.props.value) {
      this.props.onChange(value);
    }
  }

  render () {
    const {
      primitiveType,
      value,
      renderSampler2DInput
    } = this.props;
    if (primitiveType === "sampler2D") {
      return renderSampler2DInput(this.props);
    }
    else {
      const primitive = primitiveTypes[primitiveType];
      var props = {
        type: primitive.type,
        onChange: this.onChange
      };
      if ("step" in primitive)
        props.step = primitive.step;
      if ("checked" in primitive)
        props.checked = value || primitive.checked;
      else
        props.value = value || primitive.value;
      props = { ...this.props, ...props };
      if (props.type === "number")
        return <NumberInput {...props} />;
      else
        return <input {...props} />;
    }
  }
}

module.exports = UniformComponentInput;
