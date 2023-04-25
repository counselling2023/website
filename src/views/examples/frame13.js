import React from "react";
import image1 from "../image1.png";
import image2 from "../../image 94.png";
import Header from "../../components/Headers/Header.js";
import "./frame13.css";

export default function frame13() {
  return (
    <div>
      <Header />
      <div className="image-frame13">
        <img style={{ width: "1305px", height: "774px" }} src={image1} />
      </div>
      <div className="container-frame13">
        <div className="container1-frame13">
          <h1 className="Detail-frame13">
            Aditya Pansari <h3>| IIIT H - CSE | 2020-2022 | Hindi, English</h3>
          </h1>
          <h3 className="bio">
            Bio: I am a blah bsadglhk adsglkh ;hagdskl; hadgsadsgasdhsad sdah
            sdah hsfadh asffah afh asfh hfas fsah fsha
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
        <div className="container2-frame13">
          <div className="comments">
            <h1 style={{ color: "white" }}>Comments </h1>
            <input clssname="search" type="text" name="name" />
          </div>
        </div>
      </div>
    </div>
  );
}
