import React, { useState } from 'react';
import './SpellingTest.css';
const SpellingTest = () => {
 const [words, setWords] = useState('');
 const [shuffledWords, setShuffledWords] = useState([]);
 const [currentIndex, setCurrentIndex] = useState(0);
 const [userInput, setUserInput] = useState('');
 const [savedWords, setSavedWords] = useState([]);
 const [testStarted, setTestStarted] = useState(false);
 const [displayResults, setDisplayResults] = useState(false);
 const [pronunciationActive, setPronunciationActive] = useState(false);
 const [retake, setRetake] = useState(false);

 const shuffleArray = (array) => {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
 };

 const handleSubmit = (e) => {
    e.preventDefault();
    setShuffledWords(shuffleArray(words.split(',').map(word => word.trim())));
    setCurrentIndex(0);
    setTestStarted(true);
 };

 const speak = (word, callback) => {
  const synth = window.speechSynthesis;

  // Get the list of available voices
  const voices = synth.getVoices();

  // Find the Microsoft Indian voice
  const indianVoice = voices.find((voice) => voice.name === 'Microsoft Harika - Telugu (India)');

  // Create a SpeechSynthesisUtterance with the selected voice
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.voice = indianVoice;

  // Set the callback for when the speech ends
  utterance.onend = callback;

  // Speak the word using the specified voice
  synth.speak(utterance);
};


 const handleSave = () => {
  const isCorrect = userInput.trim().toLowerCase() === shuffledWords[currentIndex].toLowerCase();
  setSavedWords([...savedWords, { actual: shuffledWords[currentIndex], input: userInput, result: isCorrect ? 'Correct' : 'Incorrect' }]);
  setUserInput('');
  setCurrentIndex(currentIndex + 1);

  if (currentIndex === shuffledWords.length - 1) {
    handleEndTest();
  }
};

 const handleSkip = () => {
    setUserInput('');
    setCurrentIndex(currentIndex + 1);
 };

 const handleEndTest = () => {
    setDisplayResults(true);
 };

 const handleRetake = () => {
    setDisplayResults(false);
    setTestStarted(true);
 };

 const handleNewTest = () => {
    setWords('');
    setSavedWords([]);
    setTestStarted(false);
    setDisplayResults(false);
    setRetake(false);
 };

 return (
    <div>
      <h1>Spelling Test</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="words">Enter words separated by commas:</label>
        {!testStarted && <input type="text" id="words" name="words" value={words} onChange={(e) => setWords(e.target.value)} required />}
        <button type="submit">Start Test</button>
      </form>
      <div id="shuffledWords">
        {currentIndex < shuffledWords.length && (
          <div>
            <button onClick={() => { setPronunciationActive(true); speak(shuffledWords[currentIndex], () => setPronunciationActive(false)) }}>
              Listen to Pronunciation
            </button>
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleSkip}>Skip</button>
          </div>
        )}
      </div>
      {displayResults && (
        <div>
          <table border="1">
            <thead>
              <tr>
                <th>Actual Word</th>
                <th>User Input</th>
                <th>Result</th> {/* Added Result column */}
              </tr>
            </thead>
            <tbody>
              {savedWords.map((word, index) => (
                <tr key={index}>
                  <td>{word.actual}</td>
                  <td>{word.input}</td>
                  <td>{word.result}</td> {/* Display the result */}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleRetake}>Retake Test</button>
          <button onClick={handleNewTest}>Start New Test</button>
        </div>
      )}
    </div>
 );
}

export default SpellingTest;