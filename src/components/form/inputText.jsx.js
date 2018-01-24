import React from 'react'

class InputText extends React.Component{


    render(){
        return(
        <React.Fragment>
            <label htmlFor={this.props.inputId} className="input-label">{this.props.labelText}</label>
            <div className="input-container">
                <input type="text" id={this.props.inputId} className="form-input input-text clearable"  required placeholder={this.props.placeholder}/>
                {
                    this.props.clearable &&
                        <span className="clearInput">
                            <svg className="icon icon-close">
                                <use href="img/icons_sprite.svg#close"></use>
                            </svg>
                        </span>
                }
            </div>
        </React.Fragment>
        )
    }
}

export default InputText;