import React from 'react'

class InputText extends React.Component{


    render(){
        return(
        <React.Fragment>
            <label htmlFor={this.props.inputId} className="input-label">{this.props.labelText}</label>
            <div className="input-container">
                <input type="text"
                       id={this.props.inputId}
                       className="form-input input-text clearable"
                       required={this.props.required}
                       placeholder={this.props.placeholder}
                       name={this.props.inputId}
                       ref={this.props.inputId}
                       value={this.props.value}
                       onChange={()=>this.props.changeHandler(this.refs[this.props.inputId].name,this.refs[this.props.inputId].value)}/>
                {
                    this.props.clearable &&
                        <span className="clearInput" onClick={()=>this.props.changeHandler(this.refs[this.props.inputId].name,'')}>
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