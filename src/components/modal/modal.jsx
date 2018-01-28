import React from 'react'
import ReactModal from 'react-modal';
ReactModal.setAppElement('#root');


class Modal extends React.Component{
    constructor(props){
        super(props);
        this.generateModalContent = this.generateModalContent.bind(this);
    }

    generateModalContent(message){
        if (message){
            switch (message.type) {
                case 'event-success':
                    return {
                        title: "Встреча создана!",
                        iconUrl: '/img/emoji_create.png',
                        content: (() => {
                            return(
                                <React.Fragment>
                                    <div className="ReactModal__date">
                                        {message.data.dateStart.format('D MMMM')}, {message.data.dateStart.format('HH:mm')}&mdash;{message.data.dateEnd.format('HH:mm')}
                                    </div>
                                    <div className="ReactModal_room">{message.data.room.title} · {message.data.room.floor} этаж</div>
                                </React.Fragment>
                            )
                        })(),
                        buttons: [{
                            label: "Хорошо",
                            className: "button font_medium close-modal",
                            onClick: this.props.onClose
                        }]
                    };
                case 'event-edit-success':
                    return {
                        title: "Встреча изменена!",
                        iconUrl: '/img/emoji_create.png',
                        content: (() => {
                            return(
                                <React.Fragment>
                                    <div className="ReactModal__date">
                                        {message.data.dateStart.format('D MMMM')}, {message.data.dateStart.format('HH:mm')}&mdash;{message.data.dateEnd.format('HH:mm')}
                                    </div>
                                    <div className="ReactModal_room">{message.data.room.title} · {message.data.room.floor} этаж</div>
                                </React.Fragment>
                            )
                        })(),
                        buttons: [{
                            label: "Хорошо",
                            className: "button font_medium close-modal",
                            onClick: this.props.onClose
                        }]
                    };

            }
        }

        return {
            title: '',
            iconUrl: '',
            content: '',
            buttons: []
        }

    }


    render(){



        let data = this.generateModalContent(this.props.message);

        return(
            <ReactModal isOpen={this.props.isOpen}
                        onRequestClose={this.props.onClose}
                        shouldCloseOnOverlayClick={true}
                        shouldFocusAfterRender={false}
                        shouldCloseOnEsc={true}
                        overlayClassName="ReactModal__Overlay"
                        className="ReactModal__Content"
            >
                <div className="ReactModal__icon">
                    <img src={data.iconUrl}/>
                </div>
                <h1 className='ReactModal__title'>{data.title}</h1>
                <div className="ReactModal__text">
                    {data.content}
                </div>
                    {
                        data.buttons.map((button, index) => {
                            return <button key={index} className={button.className} onClick={button.onClick}>{button.label}</button>;
                        })
                    }

            </ReactModal>
        )

    }
}

export default Modal;