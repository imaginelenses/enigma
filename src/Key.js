import React from "react";
import "./Key.css"

class Key extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            keydown: false
        }
    }

    render() {
        return (
            <div className="Key" 
                style={{
                    color: this.props.isSelected ? "black" : "white",
                    backgroundColor: this.props.isSelected ? this.props.selectedColor : "black",
                }}
            >
                {this.props.alpha[0].toUpperCase()}
            </div>
        )
    }

}

export default Key;