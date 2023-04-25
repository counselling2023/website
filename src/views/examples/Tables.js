import React from "react";
import Header from "components/Headers/Header.js";
import "../examples/tables.css";
import image1 from "../image1.png"

export default function () {
  return (
    <div>
      <Header />
      <div className="table">
        <div className="table-column">
          <div className="Heading">
            <h2 style={{ color: "white" }}>Filter</h2>
          </div>
        </div>
        <div>
        <div className="expert-video1">
        <div className="expert-video-column1">
          <img style={{ width: "370px", height: "220px" }} src={image1} />
        </div>
        <div className="expert-column-name1-0">
          <h2>3 things about NSUT-CSE that make it better than NITs</h2>
          <h3>6 months ago</h3>
          <h3>NSUT Delhi</h3>
          <h3>Computer Science and Electronics</h3>
          <h3>Avg Package - 17 LPA</h3>
        </div>
        <div className="expert-button1-0">
          <div className="expert-column-button1-0">
            <h4>Watch Now</h4>
          </div>
          <div className="expert-column-button2-0">
            <h4>Watch Later </h4>
          </div>
        </div>
      </div>
      <div>
        <div className="expert-video1">
        <div className="expert-video-column1">
          <img style={{ width: "370px", height: "220px" }} src={image1} />
        </div>
        <div className="expert-column-name1-0">
          <h2>3 things about NSUT-CSE that make it better than NITs</h2>
          <h3>6 months ago</h3>
          <h3>NSUT Delhi</h3>
          <h3>Computer Science and Electronics</h3>
          <h3>Avg Package - 17 LPA</h3>
        </div>
        <div className="expert-button1-0">
          <div className="expert-column-button1-0">
            <h4>Watch Now</h4>
          </div>
          <div className="expert-column-button2-0">
            <h4>Watch Later </h4>
          </div>
        </div>
      </div>
      
        </div>
        <div>
        <div className="expert-video1">
        <div className="expert-video-column1">
          <img style={{ width: "370px", height: "220px" }} src={image1} />
        </div>
        <div className="expert-column-name1-0">
          <h2>3 things about NSUT-CSE that make it better than NITs</h2>
          <h3>6 months ago</h3>
          <h3>NSUT Delhi</h3>
          <h3>Computer Science and Electronics</h3>
          <h3>Avg Package - 17 LPA</h3>
        </div>
        <div className="expert-button1-0">
          <div className="expert-column-button1-0">
            <h4>Watch Now</h4>
          </div>
          <div className="expert-column-button2-0">
            <h4>Watch Later </h4>
          </div>
        </div>
      </div>
      
        </div>
      
        </div>
        
      </div>
    </div>
  );
}
