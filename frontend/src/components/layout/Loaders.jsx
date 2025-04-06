import { Grid, Skeleton, Stack } from '@mui/material'
import React from 'react'

const Loaders = () => {
  return (
    <Grid sx={{
        display:"grid",
        gridTemplateColumns:{
            xs:'1fr',
            sm:'1fr 1fr 1fr',
        },
        height:'calc(100vh - 4rem)',
        spacing:"1rem"
    }} >
        {/* Left Sidebar */}
        <Grid 
        sx={{
            display:{xs:"none",sm:"block"},
           
        }}
        
        >
            <Skeleton variant='rectangular' height={"100vh"} />
        </Grid>

        {/* Main Content */}

        <Grid  >
            
                <Stack spacing={"1rem"} >
                {Array.from({length:10}).map((_,index)=>(
                    <Skeleton key={index} variant='rounded' height={"5rem"} />
                    
                ))}
                </Stack>
            
            <Skeleton variant='rectangular' />
        </Grid>

         {/* Right Sidebar */}
        <Grid 
        sx={{
            display:{xs:"none",md:"block"},
        }}  
        >
            <Skeleton variant='rectangular' height={"100vh"} />
        </Grid>
    </Grid>
  )
}

export default Loaders
