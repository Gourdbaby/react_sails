
import { Button, Form, Input, Message } from 'element-react';
import 'element-theme-default';
require('./style.less')

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            form: {
                isShowRightPassword:false,
                name: '',
                password: '',
                rightPassword: ''
            }
        }
    }
    message(msg, type){
        Message({
            showClose: true,
            message: msg,
            type: type || 'error'
        });
    }
    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })
        });
    }
    handleSubmit(){
        let state = this.state.form;
        let url = '/api/user';
        if(!$.trim(state.name)){
            return this.message('账号不能为空。')
        }
        if(!$.trim(state.password)){
            return this.message('密码不能为空。')
        }
        if(state.isShowRightPassword){
            if(state.rightPassword !== state.password){
                this.message('两次密码输入不一致。');
                return false;
            }
            url = '/api/createUser'
        }
        
        let obj = {
            url : url,
            type:'post',
            data:{
                userName: state.name,
                password: state.password,
                rightPassword: state.rightPassword
            }
        }
        Base.ajaxPost(obj, (result) => {
            console.log(result)
            if(result.status == 'success'){
                localStorage.setItem('user',JSON.stringify(result.user))
                location.href="content.html";
            }else{
                this.message(result.message)
            }
        })
    }
    handleSignUp(){
        let form = this.state.form;
        form.isShowRightPassword = !form.isShowRightPassword;
        this.setState({ form })
    }
    render(){
        let state = this.state;
        return <div>
            <div className="login">
                <Form labelWidth="100" labelPosition="top" model={this.state.form} className="demo-form-stacked">
                    <Form.Item label="账号" required={ true }>
                    <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}></Input>
                    </Form.Item>
                    <Form.Item label="密码" required={ true }>
                    <Input type="password" value={this.state.form.password} onChange={this.onChange.bind(this, 'password')}></Input>
                    </Form.Item>
                    {
                        state.form.isShowRightPassword ?
                        <Form.Item label="确认密码" required={ true } >
                        <Input type="password" value={this.state.form.rightPassword} onChange={this.onChange.bind(this, 'rightPassword')}></Input>
                        </Form.Item>
                        : null
                    }
                    <Form.Item>
                        <Button type="primary" onClick={this.handleSubmit.bind(this)}>sign on</Button>
                        <Button onClick={this.handleSignUp.bind(this)}>sign up</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    }
}

ReactDOM.render(
    <Login />,
    document.getElementById('root')
);