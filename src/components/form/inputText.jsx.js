import React from 'react'

class InputText extends React.Component{

    constructor(props){
      super(props)
      this.state = {
        value : this.props.value
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleClear = this.handleClear.bind(this);
    }

    handleChange(e){
      this.setState({
        value: e.target.value
      })
    }

    handleClear(){
      this.setState({
        value: ''
      })
    }

    render(){
        return(
        <React.Fragment>
            <div className="input-container">
                <input type="text"
                       id={this.props.inputId}
                       className="form-input input-text clearable"
                       required={this.props.required}
                       placeholder={this.props.placeholder}
                       value={this.state.value}
                       onChange={this.handleChange}
                       />
                {
                    this.props.clearable &&
                        <span className="clearInput" onClick={this.handleClear}>
                            <svg className="icon icon-close">
                                <use href="/img/icons_sprite.svg#close"></use>
                            </svg>
                        </span>
                }
            </div>
        </React.Fragment>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value !== this.state.value;
    }

}

export default InputText;
