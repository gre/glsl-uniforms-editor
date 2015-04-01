var React = require("react");

// React have issues with input type=number – some workaround here

function isValidNumber (text) {
  return text && !isNaN(text) && text[text.length-1]!=='.';
}

var NumberInput = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    step: React.PropTypes.number,
    value: React.PropTypes.number
  },
  getDefaultProps: function () {
    return {
      step: 1
    };
  },
  getInitialState: function () {
    return {
      value: this.props.value
    };
  },
  onChange: function (e) {
    var inputValue = e.target.value;
    this.setState({
      value: inputValue
    });
    if (isValidNumber(inputValue))
      this.props.onChange(e);
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.value !== this.props.value && nextProps.value!==parseFloat(this.state.value, 10)) {
      this.setState({
        value: nextProps.value
      });
    }
  },

  render: function () {
    var props = {};
    if (!this.props.type) props.type = "number";
    props.value = ""+this.state.value; // The concatenation is important
    props.onChange = this.onChange;
    return <input {...this.props} {...props} />;
  }
});

module.exports = NumberInput;
