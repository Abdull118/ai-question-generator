"use client"; // Ensure the component runs on the client side

import React, { useState, useEffect } from 'react';
import styles from '../../page.module.css'; // Assuming you have a CSS module for styling
import questionsData from './questions.json'; // Importing the questions JSON
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
      console.log(`Selected Lecture: ${selectedLecture}`);
    console.log('Questions Data:', questionsData[selectedLecture]);
      const storedIncorrect = JSON.parse(localStorage.getItem('incorrectQuestions')) || [];
      const storedCorrect = JSON.parse(localStorage.getItem('correctQuestions')) || [];
      setIncorrectQuestions(storedIncorrect);
      setCorrectQuestions(storedCorrect);
  
      // Filter questions based on selected lecture (number as key)
      const filteredLectureQuestions =
        selectedLecture === "all"
          ? Object.values(questionsData).flat() // Select all questions if "all" is selected
          : questionsData[selectedLecture] || []; // Select questions under the numerical key or return an empty array if undefined
  
      // Ensure filteredLectureQuestions is an array before filtering
      const filteredQuestions = Array.isArray(filteredLectureQuestions)
        ? filteredLectureQuestions.filter(
            (question) =>
              !storedCorrect.some((correct) => correct.question === question.question) &&
              !storedIncorrect.some((incorrect) => incorrect.question === question.question)
          )
        : [];
  
      setQuestions(filteredQuestions);
    }
  }, [selectedLecture]);
  
  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (questions.length > 0) {
      const currentQuestion = reviewMode ? incorrectQuestions[currentQuestionIndex] : questions[currentQuestionIndex];
      setCorrectAnswer(currentQuestion.answer);
      setSubmitted(true);

      // Handle correct and incorrect answer tracking
      if (selectedOption === currentQuestion.answer) {
        const updatedCorrectQuestions = [...correctQuestions, currentQuestion];
        const uniqueCorrectQuestions = updatedCorrectQuestions.filter(
          (item, index, self) =>
            index === self.findIndex((q) => q.question === item.question)
        );

        setCorrectQuestions(uniqueCorrectQuestions);
        localStorage.setItem('correctQuestions', JSON.stringify(uniqueCorrectQuestions));

        if (reviewMode) {
          const filteredIncorrectQuestions = incorrectQuestions.filter(
            (q) => q.question !== currentQuestion.question
          );
          setIncorrectQuestions(filteredIncorrectQuestions);
          localStorage.setItem('incorrectQuestions', JSON.stringify(filteredIncorrectQuestions));
        }
      } else {
        const updatedIncorrectQuestions = [...incorrectQuestions, currentQuestion];
        const uniqueIncorrectQuestions = updatedIncorrectQuestions.filter(
          (item, index, self) =>
            index === self.findIndex((q) => q.question === item.question)
        );

        setIncorrectQuestions(uniqueIncorrectQuestions);
        localStorage.setItem('incorrectQuestions', JSON.stringify(uniqueIncorrectQuestions));
      }
    }
  };

  const handleNext = () => {
    if (reviewMode) {
      if (currentQuestionIndex < incorrectQuestions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setReviewMode(false);
        setQuestions(questionsData.filter(
          (question) => !correctQuestions.some((correct) => correct.question === question.question)
        ));
        setCurrentQuestionIndex(0);
      }
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
    setSelectedOption(null);
    setCorrectAnswer(null);
    setSubmitted(false);
  };

  const handleReviewToggle = () => {
    if (reviewMode) {
      setReviewMode(false);
  
      // Filter questions based on the selected lecture when exiting review mode
      const filteredLectureQuestions =
        selectedLecture === "all"
          ? questionsData // Show all questions if "all" is selected
          : questionsData.filter((question) => question.lecture === selectedLecture);
  
      // Filter out questions that were already answered correctly
      const filteredQuestions = filteredLectureQuestions.filter(
        (question) => !correctQuestions.some((correct) => correct.question === question.question)
      );
  
      setQuestions(filteredQuestions);
      setCurrentQuestionIndex(0);
    } else {
      setReviewMode(true);
  
      // Filter incorrect questions based on the selected lecture
      const filteredIncorrectQuestions =
        selectedLecture === "all"
          ? incorrectQuestions // Show all incorrect questions if "all" is selected
          : incorrectQuestions.filter((question) => question.lecture === selectedLecture);
  
      setIncorrectQuestions(filteredIncorrectQuestions);
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
  {['1', '2', '3', '4', '5', '6'].map((lecture) => (
    <button
      key={lecture}
      className={styles.lectureButton}
      onClick={() => handleLectureSelect(lecture)}
    >
      Lecture {lecture}
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
            {!reviewMode && questions.length > 0 && (
              <>
                <span className={styles.questionTracker}>
                  <strong>{selectedLecture !== 'all' ? `Lecture ${selectedLecture}` : null}</strong><br/>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <h3>{questions[currentQuestionIndex].question}</h3>
                <div className={styles.options}>
                  {questions[currentQuestionIndex].options.map((option, index) => (
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

                {selectedOption && !submitted && (
                  <button className={styles.submitButton} onClick={handleSubmit}>
                    Submit
                  </button>
                )}
                {submitted && currentQuestionIndex < questions.length - 1 && (
                  <button className={styles.nextButton} onClick={handleNext}>
                    Next
                  </button>
                )}
                {submitted && currentQuestionIndex === questions.length - 1 && <p>End of questions</p>}
              </>
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
