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
  const [ipAddress, setIpAddress] = useState()
  const [isGenerating, setIsGenerating] = useState(false);

  const getIp = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setIpAddress(data.ip)
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return "Unknown IP";
    }
  };

   useEffect(() => {
     if (selectedLecture !== null) {
       const storeIpAddressAndLecture = async () => {
         try {
           const ip = await getIp();
           const response = await fetch('/api/storeIp', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ ip, lecture: "MMI + " + selectedLecture }), // Include lecture number
           });
   
           if (!response.ok) {
             throw new Error('Failed to store IP address and lecture');
           }
         } catch (error) {
           console.error('Error storing IP address and lecture:', error);
         }
       };
   
       storeIpAddressAndLecture();
     }
   }, [selectedLecture]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/getQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionName: `mod7_mmi${selectedLecture}.txt`, 
          folder: `mod7`, // Assuming folders are named modX
          fileName: `mmi${selectedLecture}.txt`, // Assuming files follow this pattern
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching questions: ${response.statusText}`);
      }

      const fetchedQuestions = await response.json();

 
      const filteredQuestions = fetchedQuestions.filter((question) => {
        // If no metadata array at all, definitely keep this question.
        if (!question.metadata) {
          return true;
        }
      
        // If metadata exists, check if there's an entry with the IP we want to exclude.
        // If we find a matching ipAddress, we exclude this question by returning false.
        const hasMatchingIP = question.metadata.some(
          (meta) => meta.ipAddress === ipAddress
        );
      
        // We only keep questions that do NOT have a matching IP in their metadata.
        return !hasMatchingIP;
      });
      setQuestions(filteredQuestions);
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
          collectionName: `mod7_mmi${selectedLecture}.txt`, 
          folder: `mod7`,
          fileName: `mmi${selectedLecture}.txt`,
          ipAddress: ipAddress
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
          collectionName: `mod7_mmi${selectedLecture}.txt`, 
          folder: `mod7`,
          fileName: `mmi${selectedLecture}.txt`,
          ipAddress: ipAddress
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

  // Updated function with spinner
  const fetchMoreQuestions = async () => {
    // Show spinner
    setIsGenerating(true);
    try {
      // 1) Trigger your AI endpoint in the background
      await fetch('https://ai-generator-server.onrender.com/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder: `mod7`,
          fileName: `mmi${selectedLecture}.txt`,
          // Provide sample questions if your AI needs them
          // For instance, here we take the first few as examples:
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
      console.log("Background AI generation triggered.");
    } catch (error) {
      console.error("Error generating new questions:", error);
    }
    setQuestions([])
    // 2) Now fetch the newly added questions
    await fetchQuestions();

    // 3) Reset to show new questions from the start
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setCorrectAnswer(null);
    setSubmitted(false);

    // Hide spinner
    setIsGenerating(false);
  };

  useEffect(() => {
    if (selectedLecture !== null) {
      fetchQuestions();
      fetchIncorrectQuestions();
      fetchCorrectQuestions();
      getIp()
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
            ipAddress: ipAddress, 
            completed: true,
            correct: isCorrect,
            collectionName: `mod7_mmi${selectedLecture}.txt`, 
            folder: `mod7`, 
            fileName: `mmi${selectedLecture}.txt`, 
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
    setSubmitted(false);
    fetchIncorrectQuestions();
    setReviewIncorrect(true);
    setReviewCorrect(false);
    setCurrentQuestionIndex(0);
  };

  const handleReviewCorrect = () => {
    setSubmitted(false);
    fetchCorrectQuestions();
    setReviewIncorrect(false);
    setReviewCorrect(true);
    setCurrentQuestionIndex(0);
  };

  const handleGoBack = () => {
    setSelectedLecture(null);
    // Reset any states if desired:
    setReviewIncorrect(false);
    setReviewCorrect(false);
    setCurrentQuestionIndex(0);
    setSubmitted(false);
    setSelectedOption(null);
    setCorrectAnswer(null);
    setQuestions([])
    setCorrectQuestions([])
    setIncorrectQuestions([])
  };
  

  const renderQuestions = (questionsToRender) => (
    <>
      <div className={styles.topBar}>
        <img onClick={handleGoBack} src="/images/chevronBack.svg"/>
        <span className={styles.questionsRemaining}>
          Questions Remaining: {questionsToRender.length}
        </span>
        <img onClick={handleReturnHome} src="/images/home.svg"/>
      </div>
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
        <button
          className={styles.nextButton}
          onClick={
            // If on the last question AND in normal mode, fetch more
            currentQuestionIndex === questionsToRender.length - 1 &&
            !reviewIncorrect &&
            !reviewCorrect
              ? fetchMoreQuestions
              : handleNextQuestion
          }
        >
          {
            // Change the button text accordingly
            currentQuestionIndex === questionsToRender.length - 1 &&
            !reviewIncorrect &&
            !reviewCorrect
              ? 'Ask GPT for more Questions!'
              : 'Next'
          }
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Lecture Selection */}
      {!selectedLecture && (
        <div className={styles.lectureSelection}>
          <h2>Please select a lecture:</h2>
          <h2 className={styles.header}>Please select:</h2>
          {['1', '2', '3', '4', '5', '6', '7'].map((lecture) => (
            <button
              key={lecture}
              className={styles.lectureButton}
              onClick={() => handleLectureSelect(lecture)}
            >
              Lecture {lecture}
            </button>
          ))}
          <button className={styles.reviewButton1} onClick={handleReturnHome}>
            Return Home
          </button>
        </div>
      )}

      {/* Main Card Section */}
      {selectedLecture && (
        <div className={styles.card}>
          {/* If loading or generating, show spinner */}
          {(loading || isGenerating) ? (
          <p>Loading... {'('}this takes a min{')'}</p>
        ) : reviewIncorrect ? (
          // If no incorrect questions, show a message
          incorrectQuestions.length === 0 ? (
            <div>
              <h3>No incorrect questions to review.</h3>
            </div>
          ) : (
            renderQuestions(incorrectQuestions)
          )
        ) : reviewCorrect ? (
          // If no correct questions, show a message
          correctQuestions.length === 0 ? (
            <div>
              <h3>No correct questions to review.</h3>
            </div>
          ) : (
            renderQuestions(correctQuestions)
          )
        ) : questions.length > 0 ? (
          renderQuestions(questions)
        ) : (
          <>
          <div className={styles.topBar}>
        <img onClick={handleGoBack} src="/images/chevronBack.svg"/>
        <p>No questions available. Click the button below to generate more.</p>
        <img onClick={handleReturnHome} src="/images/home.svg"/>
        </div>
          <button 
          className={styles.nextButton}
          onClick={fetchMoreQuestions}>Ask GPT for more Questions</button>
          </>
        )}


          {/* Review Buttons */}
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
