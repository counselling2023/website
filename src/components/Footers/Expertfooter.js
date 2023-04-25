import React from 'react'
import image1 from "../../views/expertimage.png"
import Header from 'components/Headers/Header'


function Expertfooter() {
  return (
    <div>
        <Header/>
        <img style={{ width: "180px", height: "170px", borderRadius: "400/ 2" }} src={image1} />
        
    </div>
  )
}

export default Expertfooter