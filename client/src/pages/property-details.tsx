import { ChatBubble, Delete, Phone, Place, Star } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { useDelete, useGetIdentity, useOne, useShow } from '@refinedev/core';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomButton } from '../components';
import { Edit } from '@refinedev/mui';

interface User {
    email: string;
    name: string;
    avatar?: string;
  }

const PropertyDetails = () => {

  function checkImage(url: any){
    const img = new Image();
    img.src = url;
    return img.width != 0 && img.height != 0;
  }
  const navigate = useNavigate();
  const {data: user} = useGetIdentity<User>();
  const {id} = useParams();
  const {mutate} = useDelete();
  const {query: queryResult} = useShow({
    resource: 'properties', // Make sure the resource name matches your API
    id, // Ensure the id is correctly passed
  });

  const {data, isLoading, isError} =  queryResult;

  //console.log("Data:", data);

  if(isLoading) return <div>Loading....</div>
  if(isError) return <div>Error...</div>

  const propertyDetails = data?.data ?? {};
  console.log(propertyDetails)
  //console.log("Fetching property with ID:", id);
  const isCurrentUser = user?.email === propertyDetails?.creator?.email;

  console.log("User:", user);
  console.log("Property Details:", propertyDetails);
  console.log("Creator:", propertyDetails?.creator);

  const handleDeleteProperty = () => {
    const response = confirm("Are you sure you want to delete this property?");
    if (response) {
      mutate(
        {
          resource: "properties",
          id: id as string,
        },
        {
          onSuccess: () => {
            navigate("/properties");
          },
        },
      );
    }
  };

  
  return (
    
    <Box
     borderRadius="15px"
     padding="20px"
     bgcolor="#fcfcfc"
     width="fit-content"
    >
     <Typography 
      fontSize={25} 
      fontWeight={700} 
      color='#11142d'
      >
        Details
     </Typography>

     <Box 
        mt="20px" 
        display="flex" 
        flexDirection={{xs: "column" , lg: "row"}} 
        gap={4}>
 
            <Box flex={1} maxWidth={764}>
             <img
              src={propertyDetails.photo}
              alt="property_details-img"
              height={546}
              style={{objectFit: "cover", borderRadius: "10px"}}
              className="property_details-img"
             />
 
             <Box mt="15px">
               <Stack direction="row"
                 justifyContent="space-between" 
                 flexWrap="wrap"
                 alignItems="center"
                >
                     <Typography 
                      fontSize={18} 
                      fontWeight={500} 
                      color="#11142d" 
                      textTransform="capitalize" 
                     >
                         {propertyDetails.propertyType}
                     </Typography>
 
                     <Box>
                         {[1, 2, 3, 4, 5].map((star)=> <Star key={`star-${star}`} sx={{color: '#f2c94c'}}/>)}
                     </Box>
                </Stack>
                
                <Stack
                 direction="row"
                 flexWrap="wrap"
                 justifyContent="space-between"
                 alignItems="center"
                 gap={2}
                >
                  <Box>
                     <Typography
                      fontSize={22}
                      fontWeight={600}
                      mt="10px"
                      color="#11142d"
                     >
                      {propertyDetails.title}
                     </Typography>
                     
                     <Stack mt = {0.5} direction="row"
                      alignItems="center"
                      gap = {0.5}
                     >
                      <Place sx={ { color: "#808191"}}/>
                      <Typography fontSize={14}  color="#808191"
                      >{propertyDetails.location}
                      </Typography>
 
                     </Stack>
                  </Box>
 
                 <Box>
                  <Typography 
                  fontSize={16}
                  fontWeight={600}
                  mt="10px"
                  color="#11142d">
 
                  Price
 
                  </Typography>
 
                  <Stack
                  direction="row" alignItems="flex-end"
                  gap={1}
                  >
                  <Typography fontSize={25} fontWeight={700} color="#475BE8" 
                  >
                   ${propertyDetails.price}
                  </Typography>
                  
                  <Typography fontSize={14} color="#808191d" mb={0.5}>
                   for one day
                  </Typography>
                 </Stack>
                </Box>
 
               </Stack>
 
               <Stack
                  mt = "25px" direction="column"
                  gap="10px"
                  >
                  <Typography fontSize={18}  color="#11142d" 
                  >
                   Description
                  </Typography>
                  
                  <Typography fontSize={14} color="#808191d" mb={0.5}>
                   {propertyDetails.description}
                  </Typography>
               </Stack>

             </Box>

            </Box>

            {/* details of agent */}

            <Box
             width="100%"
             flex={1}
             maxWidth={326}
             display="flex"
             flexDirection="column"
             gap= "20px"
             >
             <Stack
                width="100%"
                p={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
                border="1px solid #E4E4E4"
                borderRadius={2}
                >
                <Stack
                 mt={2}
                 justifyContent="center"
                 alignItems="center"
                 textAlign="center"
                 >
                 <img
                    src={
                        checkImage(propertyDetails.creator.avatar)?
                        propertyDetails.creator.avatar:
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                    }
                    alt="avatar"
                    width={90}
                    height={90}
                    style={{
                        borderRadius: "100%",
                        objectFit: "cover"
                    }}
                 /> 
                 <Box mt="10px">
                    <Typography fontSize={18} fontWeight={600} color="#11142d">
                        {propertyDetails.creator.name}
                    </Typography>

                    <Typography
                    mt = "5px"
                    fontSize={14}
                    fontWeight={400}
                    color="#808191"
                    >
                        Agent 
                    </Typography>
                    
                 </Box> 

                 <Stack
                    mt="15px" direction="row" alignItems="center" gap={1}>
                    <Place sx={{color: "#808191"}}/>
                    <Typography fontSize={14} fontWeight={400} color="#808191">
                        North Carolina, USA
                    </Typography>
                 </Stack>  

                 <Typography mt={1} fontSize={16} fontWeight={600} color="#11142d">
                    {propertyDetails.creator.allProperties.length} 
                     Properties 
                 </Typography>  

                </Stack>
                
                <Stack 
                 width="100%"
                 mt = "25px"
                 direction= "row"
                 justifyContent="space-between"
                 flexWrap= "wrap"
                 gap = {2}
                 >
                 <CustomButton 
                  title= {!isCurrentUser? "Message": "Edit"}
                  backgroundColor="#475BE8"
                  color= "#FCFCFC"
                  //fullWidth icon={!isCurrentUser ? <ChatBubble/>: <Edit/>}
                  handleClick={()=>{
                   if(isCurrentUser){
                     navigate(`/properties/edit/${propertyDetails._id}`);
                   }
                  }}
                 />
                 <CustomButton
                 title={!isCurrentUser ? "Call" : "Delete"}
                 backgroundColor={!isCurrentUser? "#2ED480" : "#d42e2e"}
                 color= "#FCFCFC"
                 //fullWidth icon={!isCurrentUser ? <Phone/>: <Delete/>}
                 handleClick={ ()=>{
                 if(isCurrentUser) handleDeleteProperty();
                 }}
                 />

                </Stack>
                
             </Stack>

             <Stack>
                <img src="https://serpmedia.org/scigen/images/googlemaps-nyc-standard.png?crc=3787557525"
                width = "100%"
                height={306}
                style = {{borderRadius: 10, objectFit: "cover"}}
                />
             </Stack>

             <Box>
                <CustomButton
                title="Book Now"
                backgroundColor="#475BE8"
                color="#FCFCFC"
                fullWidth
                />
             </Box>
            </Box>

            
          </Box>
    </Box>
  )
}

export default PropertyDetails


