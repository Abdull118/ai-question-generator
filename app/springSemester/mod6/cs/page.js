"use client"; // Ensure the component runs on the client side

import React, { useState, useEffect } from 'react';
import styles from '../../../page.module.css'; // Assuming you have a CSS module for styling
import { useRouter } from 'next/navigation';

const Page = () => {
  const [questions, setQuestions] = useState([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]); // State for incorrect questions
  const [correctQuestions, setCorrectQuestions] = useState([]); // State for correct questions
  const [reviewIncorrect, setReviewIncorrect] = useState(false); // State for incorrect review mode
  const [reviewCorrect, setReviewCorrect] = useState(false); // State for correct review mode
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/getQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionName: `mod6_cs${selectedLecture}.txt`, 
          folder: `mod6`, // Assuming folders are named modX
          fileName: `cs${selectedLecture}.txt`, // Assuming files follow this pattern
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching questions: ${response.statusText}`);
      }

      const fetchedQuestions = await response.json();

      // Exclude questions that have a metadata field
      const filteredQuestions = fetchedQuestions.filter(
        (question) => !question.metadata
      );

      setQuestions((prevQuestions) => [...prevQuestions, ...filteredQuestions]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error.message);
      setLoading(false);
    }
  };

  const fetchIncorrectQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/getIncorrectQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionName: `mod6_cs${selectedLecture}.txt`, 
          folder: `mod6`,
          fileName: `cs${selectedLecture}.txt`,
          ipAddress: "unknown"
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching incorrect questions: ${response.statusText}`);
      }

      const fetchedIncorrectQuestions = await response.json();
      setIncorrectQuestions(fetchedIncorrectQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching incorrect questions:', error.message);
      setLoading(false);
    }
  };

  const fetchCorrectQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/getCorrectQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionName: `mod6_cs${selectedLecture}.txt`, 
          folder: `mod6`,
          fileName: `cs${selectedLecture}.txt`,
          ipAddress: "unknown"
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching correct questions: ${response.statusText}`);
      }

      const fetchedCorrectQuestions = await response.json();
      setCorrectQuestions(fetchedCorrectQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching correct questions:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLecture !== null) {
      fetchQuestions();
      fetchIncorrectQuestions();
      fetchCorrectQuestions();
    }
  }, [selectedLecture]);

  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    let currentQuestions = questions; // default if not in review mode

    if (reviewIncorrect) {
      currentQuestions = incorrectQuestions;
    } else if (reviewCorrect) {
      currentQuestions = correctQuestions;
    }

    if (currentQuestions.length > 0) {
        const currentQuestion = currentQuestions[currentQuestionIndex];
        setCorrectAnswer(currentQuestion.answer);
        setSubmitted(true);

        const isCorrect = selectedOption === currentQuestion.answer;

      // Make API call to mark question as complete and track result
      try {
        await fetch('/api/markQuestion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: currentQuestion.id, 
            ipAddress: "unknown", 
            completed: true,
            correct: isCorrect,
            collectionName: `mod6_cs${selectedLecture}.txt`, 
            folder: `mod6`, 
            fileName: `cs${selectedLecture}.txt`, 
          }),
        });
      } catch (error) {
        console.error('Error marking question:', error.message);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setCorrectAnswer(null);
      setSubmitted(false);
    } else {
      fetchQuestions();
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setCorrectAnswer(null);
      setSubmitted(false);
    }
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  const handleReviewIncorrect = () => {
    setSubmitted(false)
    fetchIncorrectQuestions()
    setReviewIncorrect(true);
    setReviewCorrect(false);
    setCurrentQuestionIndex(0);
  };

  const handleReviewCorrect = () => {
    setSubmitted(false)
    fetchCorrectQuestions()
    setReviewIncorrect(false);
    setReviewCorrect(true);
    setCurrentQuestionIndex(0);
  };

  const renderQuestions = (questionsToRender) => (
    <>
      <h3>{questionsToRender[currentQuestionIndex].question}</h3>
      <div className={styles.answerChoices}>
        {questionsToRender[currentQuestionIndex].answer_choices.map((choice, index) => (
          <div key={index} className={styles.answerChoice}>
            {choice}
          </div>
        ))}
      </div>
      <div className={styles.optionButtons}>
        {questionsToRender[currentQuestionIndex].answer_choices.map((choice, index) => (
          <button
            key={index}
            className={
              `${styles.optionButton} 
              ${selectedOption === choice ? styles.selected : ""}
              ${submitted && choice === correctAnswer ? styles.correct : ''} 
              ${submitted && selectedOption === choice && choice !== correctAnswer
                  ? styles.incorrect
                  : ''
              }`
            }
            onClick={() => handleOptionSelect(choice)}
            disabled={submitted}
          >
            {String.fromCharCode(65 + index)}
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
          {currentQuestionIndex === questionsToRender.length - 1
            ? 'Fetch More Questions'
            : 'Next'}
        </button>
      )}
    </>
  );

  return (
    <>
      {!selectedLecture && (
        <div className={styles.lectureSelection}>
          <h2>Please select a lecture:</h2>
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
            className={styles.reviewButton1}
            onClick={handleReturnHome}
          >
            Return Home
          </button>
        </div>
      )}

      {selectedLecture && (
        <div className={styles.card}>
          {loading ? (
            <p>Loading...</p>
          ) : reviewIncorrect ? (
            renderQuestions(incorrectQuestions)
          ) : reviewCorrect ? (
            renderQuestions(correctQuestions)
          ) : questions.length > 0 ? (
            renderQuestions(questions)
          ) : (
            <p>No questions available. Please select a lecture to begin.</p>
          )}
<div className={styles.reviewButtons}>
  {/* Normal mode: show both review buttons */}
  {!reviewIncorrect && !reviewCorrect && (
    <>
      <button className={styles.reviewButton} onClick={handleReviewIncorrect}>
        Review Incorrect Questions
      </button>
      <button className={styles.reviewButton} onClick={handleReviewCorrect}>
        Review Correct Questions
      </button>
    </>
  )}

  {/* Review incorrect mode: show "Do New Questions" + "Review Correct" */}
  {reviewIncorrect && (
    <>
      <button
        className={styles.reviewButton}
        onClick={() => {
          // Switch to normal mode
          setReviewIncorrect(false);
          setReviewCorrect(false);
          setCurrentQuestionIndex(0);
          setSubmitted(false);
          setSelectedOption(null);
          setCorrectAnswer(null);
        }}
      >
        Do New Questions
      </button>
      <button
        className={styles.reviewButton}
        onClick={handleReviewCorrect}
      >
        Review Correct Questions
      </button>
    </>
  )}

  {/* Review correct mode: show "Do New Questions" + "Review Incorrect" */}
  {reviewCorrect && (
    <>
      <button
        className={styles.reviewButton}
        onClick={() => {
          // Switch to normal mode
          setReviewCorrect(false);
          setReviewIncorrect(false);
          setCurrentQuestionIndex(0);
          setSubmitted(false);
          setSelectedOption(null);
          setCorrectAnswer(null);
        }}
      >
        Do New Questions
      </button>
      <button
        className={styles.reviewButton}
        onClick={handleReviewIncorrect}
      >
        Review Incorrect Questions
      </button>
    </>
  )}
</div>

        </div>
      )}
    </>
  );
};

export default Page;
