"use client"; // Ensure the component runs on the client side

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css'; // Assuming you have a CSS module for styling
import { useRouter } from 'next/navigation';
import questionsData from './questions.json'; // Importing the questions JSON

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
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     if (!selectedLecture) return;
  
  //     try {
  //       const response = await fetch('/api/getQuestions', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ collectionName: `OMM` }), // Pass the collection name dynamically
  //       });
  
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch data');
  //       }
  
  //       const data = await response.json();
  //       console.log(data[0]); // Debug: check how data is being structured
  
  //       // Set questions based on the selected lecture
  //       if (selectedLecture && selectedLecture !== 'all') {
  //         setQuestions(data[0][selectedLecture] || []); // Set the questions from the selected lecture
  //       } else if (selectedLecture === 'all') {
  //         // Flatten all lecture arrays into one array for "all" selection
  //         const allQuestions = Object.keys(data[0])
  //           .filter(key => key !== '_id') // Exclude the `_id` field
  //           .reduce((acc, key) => acc.concat(data[0][key]), []);
  //         setQuestions(allQuestions);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching questions:', error);
  //     }
  //   };
  
  //   if (selectedLecture !== null) {
  //     fetchQuestions();
  //     console.log(`Selected Lecture: ${selectedLecture}`);
  //     const storedIncorrect = JSON.parse(localStorage.getItem('incorrectQuestions')) || [];
  //     const storedCorrect = JSON.parse(localStorage.getItem('correctQuestions')) || [];
  //     setIncorrectQuestions(storedIncorrect);
  //     setCorrectQuestions(storedCorrect);
  //   }
  // }, [selectedLecture]);
  
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
  
 
  useEffect(() => {
    // Call the API to store the user's IP address and timestamp
     const storeIpAddress = async () => {
        try {
          const response = await fetch('/api/storeIp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip: await getIp() }),
          });

          if (!response.ok) {
            throw new Error('Failed to store IP address');
          }
        } catch (error) {
          console.error('Error storing IP address:', error);
        }
      };

    const getIp = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
      } catch (error) {
        console.error('Error fetching IP address:', error);
        return 'Unknown IP';
      }
    };

    storeIpAddress();
  }, []);

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

  const handleExplain = async () => {
    setLoading(true); // Start loading
    const currentQuestion = questions[currentQuestionIndex];
  
    try {
      const response = await fetch('/api/explainAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          answerChoices: currentQuestion.options,
          correctAnswer: currentQuestion.answer,
          selectedAnswer: selectedOption,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch explanation');
      }
  
      const data = await response.json();
      setExplanation(data.explanationText);
    } catch (error) {
      console.error('Error fetching explanation:', error);
    } finally {
      setLoading(false); // Stop loading after the response is received
    }
  };
  

  const handleNext = () => {
    if (reviewMode) {
      if (currentQuestionIndex < incorrectQuestions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setReviewMode(false);
        setCurrentQuestionIndex(0);
      }
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
    setSelectedOption(null);
    setCorrectAnswer(null);
    setSubmitted(false);
    setExplanation(null)
  };

  const handleReviewToggle = () => {
    if (reviewMode) {
      setReviewMode(false);
      setExplanation(null)
      setCurrentQuestionIndex(0);
    } else {
      setReviewMode(true);
      setCurrentQuestionIndex(0);
      setExplanation(null)
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
          <h2 className={styles.header}>Please select:</h2>
          {['9a', '9b', '10a', '10b', '11', '12a', '12b', '13a', '13b', '13c', '13d'].map((lecture) => (
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
            <div className={styles.navigation}>
                <img src='/images/chevronBack.svg' onClick={()=>setSelectedLecture(null)}/>
                <img src='/images/home.svg' onClick={handleReturnHome}/>
              </div>{!reviewMode && questions.length > 0 && (
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
                  <> 
                  <button className={styles.explainButton} onClick={handleExplain}>
                    Explain
                  </button>
                  <button className={styles.nextButton} onClick={handleNext}>
                    Next
                  </button>
                  
                  </>
                )}
                {submitted && currentQuestionIndex === questions.length - 1 && <p>End of questions</p>}
              </>
            )}
              {loading && (
                <div className={styles.loadingSpinner}>
                  <p>Loading... (this usually takes a sec)</p> {/* You can replace this with a styled spinner */}
                </div>
              )}

              {explanation && (
                <div
                  className={styles.explanationText}
                  dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br/>') }}
                />
              )}


            {reviewMode && incorrectQuestions.length > 0 && incorrectQuestions[currentQuestionIndex] && (
              <>
                <h2>Review Mode</h2>
                <span className={styles.questionTracker}>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
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
                
                {selectedOption && !submitted && (
                  <button className={styles.submitButton} onClick={handleSubmit}>
                    Submit
                  </button>
                )}
                {submitted && currentQuestionIndex < incorrectQuestions.length - 1 && (
                  <>
                  <button className={styles.explainButton} onClick={handleExplain}>
                  Explain
                </button>
                  <button className={styles.nextButton} onClick={handleNext}>
                    Next
                  </button>
                  </>
                )}
                {submitted && currentQuestionIndex === incorrectQuestions.length - 1 && <p>End of review</p>}
                {loading && (
                    <div className={styles.loadingSpinner}>
                      <p>Generating an explanation from Chat GPT... (this usually takes a sec)</p> {/* You can replace this with a styled spinner */}
                    </div>
                  )}

                  {explanation && (
                    <div
                      className={styles.explanationText}
                      dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br/>') }}
                    />
)}

              </>
              
            )}
            {reviewMode && incorrectQuestions.length === 0 && <p>No incorrect questions to review.</p>}
          </div>
          <div className={styles.buttons}>
            <button className={styles.reviewButton} onClick={handleReviewToggle}>
              {reviewMode ? 'Return to All Questions' : 'Review Incorrect Questions'}
            </button>
            
          </div>
        </>
      )}
    </>
  );
};

export default Page;
