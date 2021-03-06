import React from "react";
import PropTypes from "prop-types";
import "./Pad.css";

class Pad extends React.Component {
  constructor(props) {
    super(props);
    this.touched = false;
  }

  handlePress(isTouch) {
    // prevent double click on mobile (https://github.com/facebook/react/issues/9809)
    if (isTouch) {
      this.touched = true;
    } else if (this.touched === true) {
      this.touched = false;
      return;
    }
    const pressed = !this.props.pressed;
    this.props[pressed ? "onPress" : "onRelease"](this.props.name);
  }

  render() {
    const { color, pressed, touch, image, name } = this.props;
    return (
      <button
        className={`Pad ${pressed ? "pressed" : ""}`}
        style={{
          borderColor: color
        }}
        onTouchStart={touch ? () => this.handlePress(true) : undefined}
        onMouseDown={() => this.handlePress(false)}
      >
        {image ? <img src={image} alt={name} /> : ""}
      </button>
    );
  }
}

Pad.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  prtessed: PropTypes.bool,
  touch: PropTypes.bool,
  image: PropTypes.string
};

export const EmptyPad = ({ name }) => (
  <button className="Pad" style={{ borderColor: "transparent" }}>
    {name}
  </button>
);

export default Pad;
