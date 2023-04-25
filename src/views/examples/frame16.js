import React from "react";
import Header from "components/Headers/Header";
import image1 from "image 119.png";

export default function frame16() {
  return (
    <div>
      <Header />
      <div className="container-frame16">
        <div className="container1-frame16">
          <h1>All about UGEE(a smart gateway to IIIT H)</h1>
          <h4>Last Edited: 8 March 2023</h4>
          <img
            style={{
              width: "901px",
              height: "507px",
              left: "207px",
              top: "326px",
            }}
            src={image1}
          />
          <h2 style={{marginBottom: "30px"}}>
            UGEE (Undergraduate Entrance Examination) is conducted by the
            International Institute of Information Technology (IIIT) Hyderabad
            to offer admission into its undergraduate courses. The UGEE exam is
            an online computer-based test that tests the candidate's knowledge
            in subjects such as Mathematics, Physics, and Chemistry. UGEE is one
            of the modes of admission for the following programs:
            <h2>1. B.Tech. in Computer Science and Engineering (CSE)</h2>
            <h2>
              2. B.Tech. in Electronics and Communication Engineering (ECE)
            </h2>
            <h2>3. B.Tech. in Civil Engineering (CE)</h2>
            <h2 >4. B.Tech. in Mechanical Engineering (ME)</h2>
          </h2>
          <h2 style={{marginBottom: "50px"}}>
            UGEE Eligibility Criteria: To be eligible for the UGEE exam,
            candidates must have passed the 10+2 or equivalent examination with
            at least 60% marks in Mathematics, Physics, and Chemistry.
            Candidates who are appearing for their final exams are also eligible
            to apply.
            <h2 style={{marginBottom: "30px"}}>
              UGEE Exam Pattern: The UGEE exam is a 3-hour computer-based test.
              The question paper will have 3 sections – Mathematics, Physics,
              and Chemistry. Each section will have 20 questions. The questions
              will be of multiple-choice type, and each question will carry 4
              marks. There will be negative marking of 1 mark for every
              incorrect answer.
            </h2>
            <h2 style={{marginBottom: "30px"}}>
              UGEE Application Process: Candidates can apply for the UGEE exam
              online on the official website of IIIT Hyderabad. The application
              fee for the UGEE exam is Rs. 2000 for Indian candidates and $40
              for foreign candidates.
            </h2>
            <h2 style={{marginBottom: "30px"}}>
              UGEE Important Dates: The important dates for the UGEE exam are
              usually announced in the month of January. The application process
              begins in January, and the exam is conducted in April or May.
            </h2>
            UGEE Selection Process: The selection process for the UGEE exam
            consists of the following steps:
            <h2>
              1. UGEE Exam: Candidates who meet the eligibility criteria must
              appear for the UGEE exam and score the minimum qualifying marks.
            </h2>
            <h2>
              2. Interview: Candidates who clear the UGEE exam will be called
              for an interview. The interview will test the candidate's
              knowledge in the relevant subjects and their aptitude for the
              chosen course.
            </h2>
            <h2>
              3. Final Selection: The final selection will be based on the
              candidate's performance in the UGEE exam and the interview.
            </h2>
          </h2>
        </div>
        <div className="container2-frame16">
          
        </div>
      </div>
    </div>
  );
}
