import { useGetIdentity } from '@refinedev/core';
import React, { useEffect, useState } from 'react'
import { useForm } from '@refinedev/react-hook-form';
import type { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Form from '../components/common/Form';

  type User = {
    email: string;
    iss?: string;
    azp?: string;
    aud?: string;
    sub?: string;
  };

  const CreateProperty = () => {
    const navigate = useNavigate();
    
    const { data: user} = useGetIdentity<User>();
    
    console.log("User Data in CreateProperty:", user);
      const [propertyImage, setPropertyImage] = useState({ name: '', url: '' });
      const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
      } = useForm();
    
       const handleImageChange = (file: File) => {
        const reader = (readFile: File) =>
          new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.readAsDataURL(readFile);
          });
    
        reader(file).then((result: string) =>
          setPropertyImage({ name: file?.name, url: result }),
        );
    }; 

    const onFinishHandler = async(data: FieldValues)=>{

      console.log("onFinishHandler called with data:", data);
      console.log("onFinishHandler user email:", user?.email);
      
      if (!user || !user.email) {
        alert("User data is missing. Please log in again.");
        return; 
      }
      
      console.log("User in onFinishHandler:", user);
        if (!propertyImage.name) return alert("Please select an image");

         await onFinish({
            ...data,
            price: parseFloat(data.price),
            photo: propertyImage.url,
            email: user.email,
        }); 
    };  
  return (
     <Form
     type="Create"
     register={register}
     onFinish={onFinish}
     formLoading={formLoading}
     handleSubmit={handleSubmit}
     handleImageChange={handleImageChange}
     onFinishHandler={onFinishHandler}
     propertyImage={propertyImage}
    />

  )
} 


export default CreateProperty