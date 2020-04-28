import React from 'react'
import { connect } from 'react-redux'
import Jobcard from './Jobcard'
import {
    Link
  } from "react-router-dom";


class Jobs extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            all: null,
            loading : true,
            data : null
          }
        
          this.toArray = this.toArray.bind(this);
    }

    async componentDidMount(){
        const values = {
            method : "GET",
            headers : {
                'x-auth' : this.props.token,
            } 
        }
        try{
        const response = await fetch('https://alumni-backend-app.herokuapp.com/alumni/jobs', values);
        console.log(response)
        if (!response.ok) {
            throw new Error(response.status); // 404
          }
        const json = await response.json();
        console.log(json)
        this.setState({all:json})
        this.toArray()
        }
        catch(error){
            console.log(error)
        }
    }

    toArray = () => {
        const dataarray = [];
        if(this.state.all)              
        {
            const stateall = this.state.all;
            Object.keys(stateall).forEach(key => {
                dataarray.push(stateall[key])
            })
            this.setState({
                data : dataarray,
                loading : false
            })
        }
    }
    


    render(){
        return(
            <div>
                <button type='button'><Link to='/addjobs'>Add Job</Link></button>
                { this.state.loading || !this.state.data ?
                (
                    <h5>Loading ..</h5>
                ) : (
                    <div>{this.state.data.map((item,index) => 
                    <Jobcard key={index} 
                    id={item._id}
                    title={item.workTitle} 
                    company={item.company}
                    industry={item.industry}
                    for={item.typeOfJob}
                    salary={item.salaryOffered}
                    description={item.description}
                    skill1={item.skillsRequired[0]}
                    skill2={item.skillsRequired[1]}
                    /> )}</div>
                ) }

            </div>
        )
    }
}

const mapStatesToProps = state => {
    return{
        token : state.Auth_token
    }
}


export default connect(mapStatesToProps,null) (Jobs);