import React from 'react'
import Select from 'react-select';


class optionUser extends React.Component{
    constructor(props){
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    handleMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onSelect(this.props.option, event);
    }

    render(){
        return(

            <div className="Select-menu-item" onMouseDown={this.handleMouseDown}>
                <div className='Select-menu-item__avatar'>
                    <img src={this.props.option.avatarUrl}/>
                </div>
                <span className="Select-menu-item__name">
                    {this.props.option.login}
                </span>
                <span className="Select-menu-item__floor">
                    {this.props.option.homeFloor}
                </span>
            </div>
        )
    }
}


class UserSelect extends React.Component{


    render(){
        let usersArr = Array.from(this.props.selectedUsers);
        return(
            <React.Fragment>
                <Select
                    name="form-field-name"
                    value=''
                    onChange={this.props.addUserHandler}
                    labelKey='login'
                    options={this.props.users}
                    optionComponent={optionUser}
                    placeholder="Например, Тор Одинович"
                />
                <div className="checked-users">
                    {
                        usersArr.map((user,item) => {
                            return(
                                <React.Fragment key={user.id}>
                                    <input type="checkbox" className="checkbox-user" id={user.id} checked={true} onChange={()=>this.props.removeUserHandler(user)} />
                                    <div className="checked-user">
                                        <div className="checked-user__avatar"><img src={user.avatarUrl}/></div>
                                        <span className="checked-user__name">{user.login}</span>
                                        <label className="checked-user__delete" htmlFor={user.id}>
                                            <svg className="icon icon-close">
                                                <use href="/img/icons_sprite.svg#close"></use>
                                            </svg>
                                        </label>
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }
                </div>
            </React.Fragment>
        )
    }

}

export default UserSelect;
