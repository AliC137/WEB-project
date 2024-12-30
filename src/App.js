import React, { useState, useEffect } from "react";
import './App.css'; 
import questions from "./data/questions"; 

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false); 
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false); 
  const [wrongAnswers, setWrongAnswers] = useState(0); 

  useEffect(() => {
    const shuffled = shuffleArray(questions);
    setShuffledQuestions(shuffled);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0 && !showExplanation) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [isTimerRunning, timeLeft, showExplanation]);

  // Function to shuffle questions
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const appStyle = {
    backgroundImage: `url("/download.jpeg")`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };


  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      getNextQuestion();
    }
  }, [shuffledQuestions]);


  const handleTimeUp = () => {
    setShowExplanation(true); 
    setIsTimerRunning(false); 
    setIsAnswerConfirmed(true); 
  };


  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setIsAnswerConfirmed(false); 
  };


  const confirmAnswer = () => {
    setIsAnswerConfirmed(true); 
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }
    setShowExplanation(true); 
    setIsTimerRunning(false); 
  };


  const getNextQuestion = () => {
    if (wrongAnswers >= 5) {
      setIsQuizFinished(true); 
    } else if (answeredQuestions.length < shuffledQuestions.length) {
      let nextQuestionIndex;
      do {
        nextQuestionIndex = Math.floor(Math.random() * shuffledQuestions.length);
      } while (answeredQuestions.includes(nextQuestionIndex));

      setAnsweredQuestions([...answeredQuestions, nextQuestionIndex]);
      setCurrentQuestionIndex(nextQuestionIndex);
      setTimeLeft(30); 
      setIsTimerRunning(true); 
      setShowExplanation(false); 
      setSelectedAnswer(null); 
      setIsAnswerConfirmed(false); 
    } else {
      setIsQuizFinished(true); 
    }
  };

  if (shuffledQuestions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="App" style={appStyle}>
      {!isQuizFinished ? (
        <div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            ></div>
          </div>
          <div className="question-box">
            <p>{currentQuestion.question}</p>
            <div>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswerConfirmed}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="timer">Time Left: {timeLeft} seconds</div>


          <div className="remaining-tries">
            Remaining Tries: {5 - wrongAnswers}
          </div>

          {!isAnswerConfirmed && selectedAnswer && (
            <button onClick={confirmAnswer}>Confirm Answer</button>
          )}


          <div className="answer-feedback">
            {isAnswerConfirmed && selectedAnswer === currentQuestion.correctAnswer && (
              <p style={{ color: 'green' }}>Correct!</p>
            )}
            {isAnswerConfirmed && selectedAnswer !== currentQuestion.correctAnswer && (
              <p style={{ color: 'red' }}>Incorrect!</p>
            )}
          </div>

          {showExplanation && (
            <div className="explanation-box">
              <h3>Explanation:</h3>
              <p>{currentQuestion.explanation}</p>
              <button onClick={getNextQuestion}>Next Question</button>
            </div>
          )}
        </div>
      ) : (
        <div className="results">
          <h2>Quiz Finished</h2>
          <p>Your score is: {score} out of {shuffledQuestions.length}</p>
          <button className="restart-button" onClick={() => window.location.reload()}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;
