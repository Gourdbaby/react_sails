
import { Button, Form, Input, Message, Layout } from 'element-react';
import 'element-theme-default';
require('./style.less');
const user = JSON.parse(localStorage.getItem('user'))
class Content extends React.Component{
    constructor(props){
        super(props);
        this.handleAdd = this.handleAdd.bind(this);
        this.handlePush = this.handlePush.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.deleteContent = this.deleteContent.bind(this);
        this.state={
            list:[]
        }
    }
    componentDidMount(){
        this.getContent()
    }
    message(msg, type, onClose){
        Message({
            showClose: true,
            message: msg,
            type: type || 'error',
            onClose: onClose
        });
    }
    getContent(){
        let obj = {
            url : '/api/getContent',
            type:'get',
            data:{
                userid: user.id
            }
        }
        Base.ajaxGet(obj, (result) => {
            if(result.status == 'success'){
                if(result.data.length){
                    this.setState({ list: result.data })
                }else{
                    this.setState({ list: [{id: 1, value:''}] })
                }
            }else if(result.status=="noLogin"){
                this.message(result.message,undefined,function(){ 
                    location.href = '/dist/reactlogin.html'
                 })
            }else{
                this.message(result.message)
            }
        })
    }
    handleAdd(key){
        let state = this.state;
        let list = state.list;
        let newList;
        list.forEach(item => {
            if(item.id == key){
                newList = Object.assign({}, item)
            }
        })
        newList.id = list[list.length - 1].id + 1;
        list.push(newList)
        this.setState({ list: list })
    }
    handleInput(key, value){
        let list = this.state.list;
        list.forEach(item => {
            if(item.id == key){
                item.content = value
            }
        })
        this.setState({list})
    }
    handlePush(key, value){
        let data = {
            id: key,
            content: value,
            userid: user.id
        }
        let obj = {
            url : '/api/saveContent',
            type:'post',
            data: data
        }
        Base.ajaxPost(obj, (result) => {
            console.log(result)
            if(result.status !== 'success'){
                return this.message('请求失败！')
            }else{
                return this.message('上传成功！','success')
            }
        })
    }
    deleteContent(id){
        let obj = {
            url : '/api/deleteContent',
            type:'get',
            data: {
                id: id
            }
        }
        Base.ajaxGet(obj, (result) => {
            console.log(result)
            if(result.status !== 'success'){
                return this.message('请求失败！')
            }else{
                this.setState({list: result.data})
                return this.message('删除成功!','success')
            }
        })
    }
    render(){
        let state = this.state;
        let list = state.list.map(item => {
            return <div className="content-item" key={ item.id }>
                <Input placeholder="请输入内容" value={ item.content } onChange={ (e) => { this.handleInput(item.id, e) } } />
                <em className="el-icon-plus" onClick={ () => this.handleAdd(item.id) }></em>
                <em className="el-icon-delete" onClick={ () => this.deleteContent(item.id) }></em>
                <em onClick={ () => { this.handlePush(item.id, item.content) } }>Push</em>
            </div>
        })
        return <Layout.Row gutter="20">
                <Layout.Col span="12" offset="6">
                    <div className="grid-content bg-purple content">
                        <p className="title"><i className="el-icon-caret-right"></i> New Task and show Task</p>
                        { list }
                    </div>  
                </Layout.Col>
            </Layout.Row>   
    }
}

ReactDOM.render(
    <Content />,
    document.getElementById('root')
);