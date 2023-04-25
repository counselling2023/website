import React from "react";
import Header from "../../components/Headers/Header";
import image1 from "../../image 119.png";
import image2 from "../../image 94.png";
import image3 from "../image1.png";
import "./frame15.css";
export default function frame15() {
  return (
    <>
      <Header />
      <div className="container-frame15">
        <div className="container1-frame15">
          <div className="container1-1">
            <img
              style={{
                width: "1242px",
                height: "686px",
                marginLeft: "100px",
                borderRadius: "10px",
              }}
              src={image1}
            />
            <h1 style={{ marginLeft: "100px", marginTop: "40px" }}>
              All about UGEE(a smart gateway to IIIT H)
            </h1>
            <h3 style={{ marginLeft: "100px", marginTop: "10px" }}>
              Posted: 8 March 2023
            </h3>
          </div>
          <div className="container1-2">
            <div className="details">
              <h1>Discussion</h1>
              <h3>
                UGEE (Undergraduate Entrance Examination) is conducted by the
                International Institute of Information Technology (IIIT)
                Hyderabad to offer admission into its undergraduate courses. The
                UGEE exam is an online computer-based test that tests the
                candidate's knowledge in subjects such as Mathematics, Physics,
                and Chemistry. UGEE is one of the modes of admission for the
                following programs:
              </h3>
              <h3>1. B.Tech. in Computer Science and Engineering (CSE)</h3>
              <h3>
                2. B.Tech. in Electronics and Communication Engineering (ECE)
              </h3>
              <h3>
                3. B.Tech. in Civil Engineering (CE) B.Tech. in Mechanical
                Engineering (ME)
              </h3>
            </div>
          </div>
          <div className="container1-3">
            <div className="container1-frame1-5">
              <h1 className="Detail-frame1-5">
                Aditya Pansari{" "}
                <h3>| IIIT H - CSE | 2020-2022 | Hindi, English</h3>
              </h1>
              <h3 className="bio">
                Bio: I am a blah bsadglhk adsglkh ;hagdskl; hadgsadsgasdhsad
                sdah sdah hsfadh asffah afh asfh hfas fsah fsha
              </h3>
              <div className="expertimage">
                <img style={{ width: "282px", height: "282px" }} src={image2} />
              </div>
              <div className="expert-button1-0">
                <div className="BookNow">
                  <h4>Book Now</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container2-frame15">
          <div>
          <div className="recommended">
            <h2 className="heading-Rbar">Recommended</h2>
            </div>
          
          <div className="recommended-videos">
            <div className="recommended-video-column1">
              <img style={{ width: "220px", height: "160px" }} src={image3} />
            </div>
            <div className="recommended-video-column2">
              <h3>6 months ago</h3>
              <h3>NSUT Delhi</h3>
              <h3>Computer Science and Electronics</h3>
              <h3>Avg Package - 17 LPA</h3>
            </div>
            <h2 className="heading-Rbar1" style={{width:"170%"}}>3 things about NSUT-CSE that make it better than NITs</h2>
          </div>
           
           
          

          {/* <div className="recommended">
            <h2 className="heading-Rbar">Recommended</h2>
            </div> */}
          
          </div>
          
          <div className="container2-2-frame15">
            <div className="comments1">
              <h1 style={{ color: "white" }}>Comments </h1>
              <input clssname="search" type="text" name="name" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
