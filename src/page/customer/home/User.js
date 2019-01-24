import React, {Component} from 'react';
import {userbyid, updateuser} from "../../../gql";
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {InputItem, Toast, List, Button, ActivityIndicator} from 'antd-mobile';

class User extends Component {
    render() {
        let {userID} = this.props;
        return (
            <Query query={gql(userbyid)} variables={{id: userID}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return (
                                <div className="tab-center">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            )
                        }
                        if (error) {
                            return 'error!';
                        }

                        let user = data.userbyid;
                        let tip = '';
                        if (user === null) {
                            tip = '还没登录，出现了错误'
                        }

                        return (
                            <div>
                                {
                                    tip ?
                                        <div className={'center'}>{tip}</div>
                                        :
                                        ''
                                }
                                <Message
                                    user={user}
                                />
                            </div>
                        )
                    }
                }
            </Query>
        );
    }
}

export default User;

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            phone: props.user.telephone,
            name: props.user.nickname,
            userID: props.user.id
        };
    }

    onErrorClick = () => {
        if (this.state.hasError) {
            Toast.info('请输入11位手机号码');
        }
    };

    onChange = (phone) => {
        if (phone.replace(/\s/g, '').length < 11) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            phone,
        });
    };

    nameChange = (name) => {
        this.setState({
            name,
        });
    };

    render() {
        return (
            <div>
                <List renderHeader={() => '填写你的信息'}>
                    <InputItem
                        placeholder="请输入联系人姓名"
                        value={this.state.name}
                        onChange={this.nameChange}
                    >姓名</InputItem>
                    <InputItem
                        type="phone"
                        placeholder="请输入手机号码"
                        error={this.state.hasError}
                        onErrorClick={this.onErrorClick}
                        onChange={this.onChange}
                        value={this.state.phone}
                    >手机号码</InputItem>
                </List>
                <SaveButton
                    userID={this.state.userID}
                    telephone={this.state.phone}
                    name={this.state.name}
                />
            </div>
        );
    }
}

class SaveButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {userID, telephone, name} = this.props;
        return (
            <Mutation mutation={gql(updateuser)}
            >
                {(updateuser, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="tab-center">
                                <ActivityIndicator text="Loading..." size="large"/>
                            </div>
                        );
                    if (error)
                        return 'error';
                    return (
                        <Button type={'primary'} style={{margin: '5px 10px'}} onClick={() => {
                            console.log(1);
                            updateuser({
                                variables: {
                                    id: userID,
                                    telephone,
                                    nickname: name,
                                    updatedAt: new Date().getTime()
                                }
                            })
                        }}>保存</Button>
                    )
                }}
            </Mutation>
        )
    }
}