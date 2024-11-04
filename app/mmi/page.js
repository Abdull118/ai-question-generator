"use client"; // Ensure the component runs on the client side

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css'; // Assuming you have a CSS module for styling
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
  const router = useRouter();

  useEffect(() => {
    // Load incorrect and correct questions from localStorage if available
    const storedIncorrect = JSON.parse(localStorage.getItem('incorrectQuestions')) || [];
    const storedCorrect = JSON.parse(localStorage.getItem('correctQuestions')) || [];
    setIncorrectQuestions(storedIncorrect);
    setCorrectQuestions(storedCorrect);

    // Filter out questions marked as correct and incorrect
    const filteredQuestions = questionsData.filter(
      (question) =>
        !storedCorrect.some((correct) => correct.question === question.question) &&
        !storedIncorrect.some((incorrect) => incorrect.question === question.question)
    );

    setQuestions(filteredQuestions);
  }, []);

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
      setQuestions(questionsData.filter(
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
      <div className={styles.card}>
        {!reviewMode && questions.length > 0 && (
          <>
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
            <span className={styles.questionTracker}>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
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
        <button className={styles.reviewButton} onClick={handleReturnHome}>
          Return to Home
        </button>
      </div>
    </>
  );
};

export default Page;
