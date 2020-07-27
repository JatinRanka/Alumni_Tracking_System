import React, { useEffect, useState } from 'react';
import {shallowEqual, useSelector } from 'react-redux'
import { base_url } from '../../Endpoint/endpoint'
import RoomCard from './RoomCard'
import Spinner from 'react-bootstrap/Spinner'
import { notifyError_with_msg } from '../Utils/Message'


const Rooms = () => {

    let [ error, setError ] = useState(false);
    let [ loading, setLoading ] = useState(true);
    let [ rooms, setRooms ] = useState(null);
    let [ colleges, setColleges ] = useState([]);
    let [ college, setCollege ] = useState(null);

    const { token, user } = useSelector(state => ({
        token: state.Auth_token,
        user: state.Auth_user,
      }), shallowEqual);

      
    useEffect (() => {

        async function whenMount(){
            const values = {
                method : "GET",
                headers : {
                    'x-auth' : token,
                } 
            }
            try{
            const response = await fetch(`${base_url}/${user}/chatrooms`, values);
            console.log(response)
            const json = await response.json();
            if (!response.ok) {
                setError(true)
                notifyError_with_msg(json.err);
            }console.log(json)
            if(response.ok){ 
                setRooms(json);
                setLoading(false)
            }}
            catch(error){
                console.log(error)
                setError(true)
                notifyError_with_msg('Unable To Fetch Rooms');
            }
        }
        
        async function whenMountForAdmin(){
            const values = {
                method : "GET"
            }
            try{
            const response = await fetch(`${base_url}/college`, values);
            const json = await response.json();
            if (!response.ok) {
                setError(true)
                notifyError_with_msg(json.err);
            }console.log(json)
            if(response.ok){ 
                setColleges(json);
            }}
            catch(error){
                console.log(error)
                setError(true)
                notifyError_with_msg('Unable To Fetch Colleges');
            }
        } 

        if(user !== 'admin'){
        whenMount();
        }
        else whenMountForAdmin();

    }, [token,user])

    function handlechg(event){
        setCollege(event.target.value);
        onChoose();
    } 

    async function onChoose(){
        setLoading(true);
        let data = college;
        const values = {
            method : "GET",
            headers : {
                'Content-Type' : 'application/json',
                'x-auth' : token,
            },
            body : JSON.stringify(data)
        }
        try{
        const response = await fetch(`${base_url}/admin/chatrooms`, values);
        console.log(response)
        const json = await response.json();
        if (!response.ok) {
            setError(true)
            notifyError_with_msg(json.err);
        }console.log(json)
        if(response.ok){ 
            setRooms(json);
            setLoading(false)
        }}
        catch(error){
            console.log(error)
            setError(true)
            notifyError_with_msg('Unable To Fetch Rooms');
        }
    }

    return(
        <div>
            <div className="container is-fluid">
                <div className="notification">
                { (user === 'admin') ? (
                    (colleges.length !== 0) ? (
                        <div>
                    <h6>Select College</h6>
                    <select  onChange={handlechg} id='collegeId'>
                        <option value="">Choose a college</option>
                        {colleges.map((data,index) => (
                            <option key={index} value={data.collegeId}>{data.collegeName}</option>
                        ))}
                    </select>
                    </div>) : (null)
                ) : (null)}
                <br/>
                {!loading ? 
                (
                    <div>{rooms.map((room,index) => <RoomCard key={index} id={room._id} name={room.name}/>)}</div>
                ) : (
                    (!error) ? (
                    <div id='Loading-id'>
                    <Spinner  animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                    </Spinner>
                    </div>) : (null)
                )
                }
                </div>
            </div>
        </div>
    )
}

export default Rooms;