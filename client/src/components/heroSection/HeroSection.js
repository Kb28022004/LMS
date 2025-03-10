import React, { useState } from 'react'
import './HeroSection.css'
import { useNavigate } from 'react-router-dom'
const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const navigate=useNavigate()
  const handleSubmit=async()=>{
    if(searchQuery.trim() !==""){
      navigate(`/course/search?query=${searchQuery}`)

    }
    setSearchQuery('')
  }
  return (
    <div className='heroSectionContainer'>
        <h1>Find The Best Courses For You</h1>
        <p>Discover,Learn and Upskill with your wide range of courses</p>
        <div className='searchContainer'>
        <input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder='Search Courses' type="search" />
        <button onClick={handleSubmit} >Search</button>
        </div>
        <button onClick={()=> navigate(`/course/search?query`)} >Explore Courses</button>
    </div>
  )
}

export default HeroSection