import React from 'react'
import { useState } from 'react'
import{
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material"
import { useNavigate } from 'react-router-dom'
      const AddCity = () => {
  const navigate=useNavigate();
   const [formData, setFormData] = useState({
     city:"",
     state:"",
     zip:"",
   });

  const handleSave = () =>{
       const stored= JSON.parse(localStorage.getItem("cities"))||[];
       const newCity={
        id:Date.now(),
        ...formData,
        status:"active",
        country:"india"
       }
localStorage.setItem("cities",JSON.stringify([...stored,newCity]));
navigate("/cities");

};


// navigate("/country");


  return (
    <Container>
          <Box mt={5}>
        <Paper sx={{ p:4}}>
          < Typography variant='h5' gutterBottom>
           Add City
          </Typography>
   
          <TextField fullWidth label="city name" value={formData.city} onChange={(e)=>setFormData({...formData,
            city:e.target.value})}>
   
          </TextField>

            <TextField fullWidth label="state name" value={formData.city} onChange={(e)=>setFormData({...formData,
            state:e.target.value})}>
   
          </TextField>

            <TextField fullWidth label="city name" value={formData.city} onChange={(e)=>setFormData({...formData,
            state:e.target.value})}>
   
          </TextField>
          <Button variant='contained' onClick={handleSave}>
         Save
          </Button>
   
        </Paper>
   
            
          </Box>
   
        </Container>
  )
      };

export default AddCity;
