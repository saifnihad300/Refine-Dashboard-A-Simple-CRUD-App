import { useGetIdentity, useOne } from '@refinedev/core';
import React from 'react'
import { Profile } from '../components';

interface User {
    userid: string,
}

const MyProfile = () => {
  
  const {data: user} = useGetIdentity<User>();

  const {data, isLoading, isError} = useOne({
    resource: 'users', 
    id: user?.userid
  })

  const myProfile = data?.data ?? {};

  console.log("getting my profile is", myProfile)
  
  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>Error...</div>  

  return (
       <Profile
          type="My"
          name={myProfile.email}
          avatar={myProfile.avatar}
          properties={myProfile.allProperties}
          email= {myProfile.email}    
        />  
  )
}

export default MyProfile