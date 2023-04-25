import React from "react";
import Header from "../../components/Headers/Header";
import image from "../../Ellipse.png";
import image1 from "../image1.png";
import "../examples/experts.css";

export default function Experts() {  
  return (
    <div>
      <Header />
      <div className="expert">
        <div className="expert-column">
          <img src={image} />
        </div>
        <div className="expert-column-name">
          <h1 style={{ color: "white" }}>Name: Nikhil Bishnoi</h1>
          <h3 style={{ color: "white" }}>Education: 12th</h3>
          <h3 style={{ color: "white" }}>Stream: Maths Science</h3>
        </div>
        <div className="expert-column-button">
          <h2 style={{marginTop: "14px"}}>Edit Profile</h2>
        </div>
      </div>
      <div className="expert-video">
        <div className="expert-video-column">
          <img style={{ width: "380px", height: "230px" }} src={image1} />
        </div>
        <div className="expert-column-name1">
          <h2>3 things about NSUT-CSE that make it better than NITs</h2>
          <h3>6 months ago</h3>
          <h3>NSUT Delhi</h3>
          <h3>Computer Science and Electronics</h3>
          <h3>Avg Package - 17 LPA</h3>
        </div>
        <div className="expert-button">
          <div className="expert-column-button1">
            <h4 style={{marginTop: "-10px"}}>Watch Now</h4>
          </div>
          <div className="expert-column-button2">
            <h4 style={{marginTop: "-10px"}}>Watch Later </h4>
          </div>
        </div>
      </div>
      <div className="expert-video">
        <div className="expert-video-column">
          <img style={{ width: "370px", height: "220px" }} src={image1} />
        </div>
        <div className="expert-column-name1">
          <h2>3 things about NSUT-CSE that make it better than NITs</h2>
          <h3>6 months ago</h3>
          <h3>NSUT Delhi</h3>
          <h3>Computer Science and Electronics</h3>
          <h3>Avg Package - 17 LPA</h3>
        </div>
        <div className="expert-button">
          <div className="expert-column-button1">
            <h4 style={{marginTop: "-10px"}}>Watch Now</h4>
          </div>
          <div className="expert-column-button2">
            <h4 style={{marginTop: "-10px"}}>Watch Later </h4>
          </div>
        </div>
      </div>
      <div className="expert-video">
        <div className="expert-video-column">
          <img style={{ width: "370px", height: "220px" }} src={image1} />
        </div>
        <div className="expert-column-name1">
          <h2>3 things about NSUT-CSE that make it better than NITs</h2>
          <h3>6 months ago</h3>
          <h3>NSUT Delhi</h3>
          <h3>Computer Science and Electronics</h3>
          <h3>Avg Package - 17 LPA</h3>
        </div>
        <div className="expert-button">
          <div className="expert-column-button1">
            <h4 style={{marginTop: "-10px"}}>Watch Now</h4>
          </div>
          <div className="expert-column-button2">
            <h4 style={{marginTop: "-10px"}}>Watch Later </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
