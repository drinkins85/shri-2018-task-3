import React from 'react'

class FormMessage extends React.Component {

    render(){
        return(
            <div className="form-message form-message__visible" >
                <div className="form-message__close">
                    <svg className="icon icon-close_color_white" onClick={this.props.onClear}>
                        <use href="/img/icons_sprite.svg#close"></use>
                    </svg>
                </div>
                {
                    this.props.messages.map(function (message, index) {
                        return(
                            <div key={index}>{message}</div>
                        )
                    })
                }
            </div>
        )
    }
}

export default FormMessage;