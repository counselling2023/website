import { useState } from "react";
import Header from "components/Headers/Header.js";
import "./index.css";
import Icon from "../icons/icon";
import SearchIcon from "../icons/searchicon";
import man from "./image1.png";
import export1 from "./export.png";
import export2 from "./expert1.png";
import india from "./india.png";
import image1 from "../Vector.png";

const Index = (props) => {
  return (
    <>
      <div>
        <Header />
        <div className="home-container-column1">
            <p style={{fontSize: "xxx-large", marginLeft: "29px" }}>Main essence of platform who should use it and why? </p>
            <h1 style={{padding: "0.1%" , marginLeft: "29px"}}>
              Some Description on what else the motto of the service is and how
              will it help{" "}
            </h1>
            
          </div>
        <div className="home-container">
          <div className="home-container-column">
            <img className="IndiaImage" src={india} style={{ width: "1755.58px" ,height: "826.07px"}} />
          </div>
        </div>
        <div className="home-container-column1">
            <h1 style={{fontSize: "xxx-large", marginLeft: "29px" }}>
              India's First one-to-one remote Career Counselling platform{" "}
            </h1>
            <h1 style={{fontSize: "x-large", marginLeft: "29px" }}>
              Some Description on what else the motto of the service is and how
              will it help{" "}
            </h1>
          </div>

        <div className="home-container" >
        <div className="content-points">
              <h2
                style={{
                  color: "white",
                  textAlign: "left",
                  paddingLeft: "5%",
                  marginTop: "3%",
                  fontSize: "xx-large",
                }}
              >
                Content Points
              </h2>
              <div className="home-container">
                <div className="home-container-column1">
                  <h3 style={{ color: "white" }}>
                    {" "}
                    <Icon /> Content Point 1
                  </h3>
                </div>
                <div className="home-container-column1">
                  <h3 style={{ color: "white" }}>
                    {" "}
                    <Icon /> Content Point 2
                  </h3>
                </div>

                <div className="home-container-column1">
                  <h3 style={{ color: "white" }}>
                    {" "}
                    <Icon /> Content Point 3
                  </h3>
                </div>
                <div className="home-container-column1">
                  <h3 style={{ color: "white" }}>
                    {" "}
                    <Icon /> Content Point 4
                  </h3>
                </div>

                <div className="home-container-column1">
                  <h3 style={{ color: "white" }}>
                    {" "}
                    <Icon /> Content Point 5
                  </h3>
                </div>

                <div
                  className="home-container-column1"
                  style={{
                    color: "Black",
                    padding: "5px",
                    backgroundColor: "white",
                    borderRadius: "30px",
                    marginBottom: "7%",
                    marginTop: "-2%",
                    
                  }}
                >
                  <h3>
                    {" "}
                    <SearchIcon /> Search Page
                  </h3>
                </div>
              </div>
            </div>
          
          <div className="home-container-column">
            <img src={man} style={{ width: "600px" }} />
          </div>
        </div>

        <div
          className="home-container2-1"
          style={{
            backgroundColor: "#3485F0",
            marginLeft: "4%",
            marginRight: "9%",
            borderRadius: "60px",
            marginBottom: "3%",
            marginTop: "4%",
            height: "350px",
          }}
        >
          <div className="imge1">
          <img src={image1} style={{ width: "300px" }} />
          </div>
          <div className="home-container2">
          <h2 style={{ color: "white" , fontSize: "xx-large"}}>
            Personalize your content and let us help you choose the best
          </h2>
          <div className="home-container">
            <div className="home-container-column1">
              <h3 style={{ color: "white" }}>
                {" "}
                <Icon /> Content Point 1
              </h3>
            </div>
            <div className="home-container-column1">
              <h3 style={{ color: "white" }}>
                {" "}
                <Icon /> Content Point 2
              </h3>
            </div>

            <div className="home-container-column1">
              <h3 style={{ color: "white" }}>
                {" "}
                <Icon /> Content Point 3
              </h3>
            </div>
            <div className="home-container-column1">
              <h3 style={{ color: "white" }}>
                {" "}
                <Icon /> Content Point 4
              </h3>
            </div>

            <div className="home-container-column1">
              <h3 style={{ color: "white" }}>
                {" "}
                <Icon /> Content Point 5
              </h3>
            </div>

            <div className="home-container-column1">
              <h3 style={{ color: "white" }}>
                {" "}
                <Icon /> Content Point 6
              </h3>
            </div>
          </div>
          </div>
        </div>

        <div>
          <h1 style={{ textAlign: "center" }}>
            Connect with the most trusted source of Knowledge
          </h1>
        </div>
      </div>
    </>
  );
};

export default Index;
