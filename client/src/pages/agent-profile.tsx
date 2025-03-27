import { useOne } from '@refinedev/core';
import React from 'react'
import { Profile } from '../components';
import { useParams } from 'react-router-dom';


const AgentProfile = () => {
  
  const {id} = useParams();

  const {data, isLoading, isError} = useOne({
    resource: 'users', 
    id: id as string
  })

  const myProfile = data?.data ?? {};

  console.log("getting Agent profile is", myProfile)
  
  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>Error...</div>  

  return (
        <Profile
          type="Agent"
          name={myProfile.email}
          avatar={myProfile.avatar}
          properties={myProfile.allProperties}
          email= {myProfile.email}    
        />  
  ) 

}

export default AgentProfile