





import React, { use } from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { BiRefresh } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
 import img from "../assets/invalid.png";


const InvalidPage = () => {
  const navigate = useNavigate();
    const handleBackToLogin = () => {
    navigate("/signin"); // Login page route
  };

  const handleRequestNewLink = () => {
    navigate("/Forgetpassword"); // Reset link request page
  };
  return (
 
    <div className='h-screen flex items-center justify-center bg-blue-200'>
      <div className='size-90 p-6 items-center justify-center bg-white rounded-md'>
        {/* img */}
          <div className=' flex items-center justify-center mb-4'>
          <div className=' h-12 w-12 rounded-md bg-blue-500 flex items-center'>
          <div className="h-14 w-14 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
            TM
          </div>
      </div>
      </div>
        <h3 className='text-gray-500 font-medium text-center'>Task Manager</h3>
       
         <div className='flex items-center justify-center mb-4 p-1'>
          <img src='./invalid.png' height={10} width={10}/>
         
          </div>
          
          <h3 className='text-gray-950 font-bold text-center'>Invalid or Expired Link</h3>
          <p className=' text-gray-500 text-sm text-center'> your reset link is invalid or has expired.</p>
           <p className='text-gray-500 text-sm text-center'> please try again or request  a new rest link.</p>


             <button className='w-full mt-2 p-2 bg-blue-500 text-white rounded-md' 
              onClick={handleBackToLogin}><FaArrowLeft className='inline-block'/>
             Back to Login</button>

              
             <button             onClick={handleRequestNewLink}
             className='w-full mt-2 p-2 bg-gray-500 text-black rounded-md'> <BiRefresh  className='inline-block'/> Request new Link
             </button>
     
      </div>
    </div>
  )
}

export default InvalidPage
