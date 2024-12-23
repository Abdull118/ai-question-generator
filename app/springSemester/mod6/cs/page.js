"use client"; // Ensure the component runs on the client side

import React, { useState, useEffect } from 'react';
import styles from '../../../page.module.css'; // Assuming you have a CSS module for styling
import { useRouter } from 'next/navigation';

const Page = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [correctQuestions, setCorrectQuestions] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (selectedLecture !== null) {
      // Load incorrect and correct questions from localStorage if available
      const storedIncorrect = JSON.parse(localStorage.getItem('incorrectQuestions')) || [];
      const storedCorrect = JSON.parse(localStorage.getItem('correctQuestions')) || [];
      setIncorrectQuestions(storedIncorrect);
      setCorrectQuestions(storedCorrect);
  
      fetchQuestions();
    }
  }, [selectedLecture]);

  const [allQuestions, setAllQuestions] = useState([]); // Stores all fetched questions
  const [loading, setLoading] = useState(false);
  
    
      // Fetch AI-generated questions based on the selected lecture
      const fetchQuestions = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/AI', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              folder: `mod6`, // Assuming folders are named modX
              fileName: `cs${selectedLecture}.txt`, // Assuming files follow this pattern
              sampleQuestions: `
              Sample Question 1: A 25 y.o. male presents to his physician with a complaint of “yellow eyes” for the past day. For the past five days he has been ill with a low-grade fever, rhinorrhea, myalgias, and generalized malaise. The physical exam confirms scleral icterus but is otherwise unremarkable. Electrolytes and CBC are all within normal limits. Other labs show: AST 31IU/L, ALT 25 IU/L, AlkPO4 45 IU/L, Total Bilirubin 3 mg/dL, LDH 40IU/L, Haptoglobin 76 mg/dl (nl 46-316). His UA demonstrates a normal bilirubin level. What is the most appropriate treatment for this patient?
                A. Corticosteroids
                B. No treatment is required
                C. Pegylated interferon
                D. Phenobarbital
                E. Ursodeoxycholic acid
    
              Sample Question 2: A 65-year-old female presents to the ED with persistent RUQ pain with nausea and vomiting. CT of the abdomen reveals a polypoid mass of the gallbladder protruding into the lumen, diffuse thickening of the gallbladder wall and enlarged lymph nodes. This patient most likely has a history of which of the following?
                A. Ascaris lumbricoides
                B. Cigarette smoking
                C. Gallstones
                D. Schistosoma haematobium
                E. Tuberculosis
              `,
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Error fetching questions: ${response.statusText}`);
          }
  
          const questions = await response.json(); // Directly parse JSON response
          console.log('Fetched questions:', questions);
      
          setAllQuestions((prevQuestions) => [...prevQuestions, ...questions]); // Append new questions to the list
          setLoading(false);
        } catch (error) {
          console.error('Error fetching questions:', error.message);
          setLoading(false);
        }
      };
  
  

      const handleLectureSelect = (lecture) => {
        setSelectedLecture(lecture);
      };
    
      const handleOptionSelect = (option) => {
        setSelectedOption(option);
      };
    
      const handleSubmit = () => {
        if (allQuestions.length > 0) {
          const currentQuestion = allQuestions[currentQuestionIndex];
          setCorrectAnswer(currentQuestion.answer); // Show the correct answer
          setSubmitted(true);
    
          // Handle correct and incorrect tracking
          if (selectedOption === currentQuestion.answer) {
            const updatedCorrectQuestions = [...correctQuestions, currentQuestion];
            setCorrectQuestions(updatedCorrectQuestions);
            localStorage.setItem("correctQuestions", JSON.stringify(updatedCorrectQuestions));
          } else {
            const updatedIncorrectQuestions = [...incorrectQuestions, currentQuestion];
            setIncorrectQuestions(updatedIncorrectQuestions);
            localStorage.setItem("incorrectQuestions", JSON.stringify(updatedIncorrectQuestions));
          }
        }
      };
    
      const handleNextQuestion = () => {
        if (currentQuestionIndex < allQuestions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setSelectedOption(null);
          setCorrectAnswer(null);
          setSubmitted(false);
        } else if (currentQuestionIndex === allQuestions.length - 1) {
          // Fetch new set of questions after the 5th question
          fetchQuestions();
          setCurrentQuestionIndex(0); // Reset to the first question of the new set
          setSelectedOption(null);
          setCorrectAnswer(null);
          setSubmitted(false);
        }
      };

  const handleReviewToggle = () => {
    if (reviewMode) {
      setReviewMode(false);
      setQuestions(questions.filter(
        (question) => !correctQuestions.some((correct) => correct.question === question.question)
      ));
      setCurrentQuestionIndex(0);
    } else {
      setReviewMode(true);
      setCurrentQuestionIndex(0);
    }
  };

  const handleReturnHome = () => {
    router.push('/'); // Navigate to the home route
  };

  const totalQuestions = reviewMode ? incorrectQuestions.length : questions.length;

  return (
    <>
      {!selectedLecture && (
        <div className={styles.lectureSelection}>
          <h2>Please select a lecture or all:</h2>
          {[...Array(15).keys()].map((lecture) => (
            <button
              key={lecture}
              className={styles.lectureButton}
              onClick={() => handleLectureSelect(lecture + 1)}
            >
              Lecture {lecture + 1}
            </button>
          ))}
          <button
            className={styles.lectureButton}
            onClick={() => handleLectureSelect("all")}
          >
            All Lectures
          </button>
          <button className={styles.reviewButton1} onClick={handleReturnHome}>
              Return Home
            </button>
        </div>
      )}
      {selectedLecture && (
        <>
          <div className={styles.card}>
            {!reviewMode && loading ? (
      <p>Loading...</p>
    ) : allQuestions.length > 0 ? (
      <>
        <h3>{allQuestions[currentQuestionIndex].question}</h3>
                <div className={styles.options}>
                  {allQuestions[currentQuestionIndex].answer_choices.map((choice, index) => (
                    <button
                      key={index}
                      className={`
                        ${styles.optionButton}
                        ${submitted && choice === correctAnswer ? styles.correct : ""}
                        ${submitted && selectedOption === choice && choice !== correctAnswer ? styles.incorrect : ""}
                      `}
                      onClick={() => handleOptionSelect(choice)}
                      disabled={submitted}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {selectedOption && !submitted && (
                  <button className={styles.submitButton} onClick={handleSubmit}>
                    Submit
                  </button>
                )}
                {submitted && (
                  <button className={styles.nextButton} onClick={handleNextQuestion}>
                    {currentQuestionIndex === allQuestions.length - 1
                      ? "Fetch More Questions"
                      : "Next"}
                  </button>
                )}
      </>
    ) : (
      <p>No questions available. Please select a lecture to begin.</p>
    )}
            {reviewMode && incorrectQuestions.length > 0 && incorrectQuestions[currentQuestionIndex] && (
              <>
                <h2>Review Mode</h2>
                <h3>{incorrectQuestions[currentQuestionIndex].question}</h3>
                <div className={styles.options}>
                  {incorrectQuestions[currentQuestionIndex].options.map((option, index) => (
                    <div key={index} className={styles.optionText}>
                      {option}
                    </div>
                  ))}
                </div>
                <div className={styles.optionButtons}>
                  {['A', 'B', 'C', 'D', 'E'].map((option, index) => (
                    <button
                      key={index}
                      className={`
                        ${styles.optionButton}
                        ${submitted && option === correctAnswer ? styles.correct : ''}
                        ${submitted && selectedOption === option && option !== correctAnswer ? styles.incorrect : ''}
                      `}
                      onClick={() => handleOptionSelect(option)}
                      disabled={submitted}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <span className={styles.questionTracker}>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                {selectedOption && !submitted && (
                  <button className={styles.submitButton} onClick={handleSubmit}>
                    Submit
                  </button>
                )}
                {submitted && currentQuestionIndex < incorrectQuestions.length - 1 && (
                  <button className={styles.nextButton} onClick={handleNext}>
                    Next
                  </button>
                )}
                {submitted && currentQuestionIndex === incorrectQuestions.length - 1 && <p>End of review</p>}
              </>
            )}
            {reviewMode && incorrectQuestions.length === 0 && <p>No incorrect questions to review.</p>}
          </div>
          <div className={styles.buttons}>
            <button className={styles.reviewButton} onClick={handleReviewToggle}>
              {reviewMode ? 'Return to All Questions' : 'Review Incorrect Questions'}
            </button>
            <div>
              <button className={styles.reviewButton} onClick={()=>setSelectedLecture(null)}>
                Go Back
              </button>
              <button className={styles.reviewButton} onClick={handleReturnHome}>
                Return Home
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
