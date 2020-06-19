import React from 'react';
import { connect } from 'react-redux'
import Facebookbutton from './facebookLogin';
import Add_token from '../../Redux/action/addtoken'
import { Link, Redirect } from "react-router-dom";
import Serialize from './Utils/data';
import '../Style/toStyleLogin.css'
import 'bulma/css/bulma.css';


class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            email : '',
            password: '',
            user:'',
            redirect : false,
            error : false,
            loading:false
          }

        this.onChangefunc = this.onChangefunc.bind(this);
        this.officiallogin = this.officiallogin.bind(this);
        this.redirect = this.redirect.bind(this);
    }


    onChangefunc = (event) =>{
        this.setState({
          [event.target.name]: event.target.value,
          error:false
        });
      }

    
    async officiallogin(e){
        e.preventDefault();
        this.setState({
            error : false,
            loading:true
        })
        const { email , password, user } = this.state
        const data = { email , password } 
            const values = {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(data)
        }
        try{
        const response = await fetch(`https://alumni-backend-app.herokuapp.com/${user}/login`,values)
        const json = await response.json()
        if(!response.ok){
            throw new Error(response.status); // 404
        }
        let storeToken = json.user.tokens[0].token;
        let storeUser = this.state.user;
        Serialize(storeToken,storeUser);
        await this.props.addtoken();
        this.redirect();
        }
        catch(error){
            console.log(error)
            this.setState({
                error : true,
                loading:false
            });
            
        }

    }

    redirect = () => {
        if(this.props.Auth){
            this.setState({
                redirect : true
            })
        }
    }

    render(){
        console.log(this.props.Auth)
        let loading = this.state.loading
        return( 
            <div>
                <br/>
                <br/>
            <div className="container" id='Login-contain-1'>
            <div className="notification" id='Login-container'>
            <br/>
            <div className='LoginDiv'>
                <form id='loginform' onSubmit={this.officiallogin}>
                    <h2>Login</h2>
                    <br/>
                    <div>
                    <label>E-Mail</label>
                    <input required className="div-input" type='email' name='email' value={this.state.email} onChange={this.onChangefunc}/>
                    </div>
                    <br/> 
                    <div> 
                    <label>Password</label>
                    <input required className="div-input" type='password' name='password' value={this.state.password} onChange={this.onChangefunc}/>
                    </div>
                    <br/>
                    <div>
                    <label>Please select who you are</label>
                    <select required id='Login-Select' name='user' onChange={this.onChangefunc}>
                        <option value=''></option>
                        <option value='alumni'>Alumni</option>
                        <option value='student'>Student</option>
                        <option value='admin'>Admin</option>
                        <option value='college'>College</option>
                    </select>
                    </div>
                    <br/>
                    <br/>
                    <button id='Submit-button'disabled={loading} type='submit'>submit</button>
                </form>
                <br/>
                <div id='facebook-flex'>
                Or <Facebookbutton/>
                </div>
                <br/>
                <h6 id='login-span-text'>Or , You can</h6>
                <br/>
                    <button id='button1'><Link id='button-link' to='/register'>Register</Link></button>
                <br/>
                <br/>
                <br/>
                {
                    (this.state.redirect) ? ( <Redirect to="/"/> ) : (null)
                }
            </div>
            </div>
            </div>
                {
                    (this.state.error) ? (
                        // <h5>Error with Login ..</h5>
                        alert("Error with Login ..")
                    ) : (null)
                }
            </div>
        );
    }
}

const mapStatesToProps = state => {
    return{
        Auth : state.Auth_state
    }
}

const mapDispatchToProps = dispatch => {
    return{
        addtoken : () => dispatch(Add_token())
    }
}

export default connect(mapStatesToProps,mapDispatchToProps) (Login);