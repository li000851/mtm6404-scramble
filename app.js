/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
      const x = copy[i]
      const y = Math.floor(Math.random() * length)
      const z = copy[y]
      copy[i] = z
      copy[y] = x
  }

  if (typeof src === 'string') {
      return copy.join('')
  }

  return copy
}

/**********************************************
* YOUR CODE BELOW
**********************************************/
const { useState, useEffect } = React

const words = [
'apple',
'banana',
'cherry',
'date',
'elderberry',
'fig',
'grape',
'honeydew',
'kiwi',
'lemon'
]

function ScrambleGame() {
  const [wordList, setWordList] = useState([...words])
  const [current, setCurrent] = useState(() => {
      const shuffledWords = shuffle([...words])
      return shuffledWords[0] 
  })
  const [wordScramble, setWordScramble] = useState(() => shuffle(shuffle(current)))
  const [guess, setGuess] = useState("")
  const [score, setScore] = useState(0)
  const [strike, setStrike] = useState(0)
  const [pass, setPass] = useState(3)
  const [message, setMessage] = useState("")

  useEffect(() => {
      const storedState = localStorage.getItem('scrambleGameState')
      if (storedState) {
          const { savedWordList, savedCurrent, savedWordScramble, savedScore, savedStrike, savedPass } = JSON.parse(storedState)
          setWordList(savedWordList)
          setCurrent(savedCurrent)
          setWordScramble(savedWordScramble)
          setScore(savedScore)
          setStrike(savedStrike)
          setPass(savedPass)
      } else {
          const initialWord = shuffle([...words])[0]
          setCurrent(initialWord)
          setWordScramble(shuffle(initialWord))
      }
  }, [])

  useEffect(() => {
      localStorage.setItem('scrambleGameState', JSON.stringify({ wordList, current, wordScramble, score, strike, pass }))
  }, [wordList, current, wordScramble, score, strike, pass])

//   const passDealer = () => {
//     if (pass > 0) {
//         setPass(pass - 1);
//         setMessage("You passed. Next word.");
//         const newWordList = wordList.filter(word => word !== current);
//         if (newWordList.length > 0) {
//             const newWord = shuffle(newWordList)[0];
//             setWordList(newWordList);
//             setCurrent(newWord);
//             setWordScramble(shuffle(newWord));
//         } else {
//             alert(`All Spelled Out! You scored ${score} points, and got ${strike}.`);
//         }
//     }
// };
const passDealer = () => {
  if (pass > 0) {
      setPass(pass - 1);
      setMessage("You passed. Next word.");
      const newWordList = wordList.filter(word => word !== current);
      if (newWordList.length > 0) {
          const newWord = shuffle(newWordList)[0];
          setWordList(newWordList);
          setCurrent(newWord);
          setWordScramble(shuffle(newWord));
      } else {
          setMessage(`Congratulations! You completed all words. Your final score is ${score}.`);
      }
  }
};

  // const guessDealer = (e) => {
  //     e.preventDefault()
  //     if (guess.toLowerCase() === current.toLowerCase()) {
  //         setScore(score + 1)
  //         setMessage("correct. Next Word.")
  //         const newWordList = wordList.filter(word => word !== current)
  //         if (newWordList.length > 0) {
  //             const newWord = shuffle(newWordList)[0]
  //             setWordList(newWordList)
  //             setCurrent(newWord)
  //             setWordScramble(shuffle(newWord))
  //         } else {
  //             alert(`All Spelled Out! You scored ${score + 1} points.`)
  //             resetGame()
  //         }
  //     } else {
  //         setStrike(strike + 1)
  //         setMessage("Wrong. Try again!")
  //         if (strike + 1 >= 3) {
  //             alert(`All Spelled Out! You scored ${score} points, ${strike + 1} strikes.`)
  //             resetGame()
  //         }
  //     }
  //     setGuess("")
  // }
  const guessDealer = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === current.toLowerCase()) {
        setScore(score + 1);
        setMessage("Correct! Next word.");
        const newWordList = wordList.filter(word => word !== current);
        if (newWordList.length > 0) {
            const newWord = shuffle(newWordList)[0];
            setWordList(newWordList);
            setCurrent(newWord);
            setWordScramble(shuffle(newWord));
        } else {
            setMessage(`Congratulations! You guessed all words correctly. Your final score is ${score + 1}.`);
        }
    } else {
        setStrike(strike + 1);
        setMessage("Wrong. Try again!");
        if (strike + 1 >= 3) {
            setMessage(`Game Over! You scored ${score} points with ${strike + 1} strikes.`);
        }
    }
    setGuess("");
};
  
  const resetGame = () => {
      setWordList([...words])
      const newWord = shuffle([...words])[0]
      setCurrent(newWord)
      setWordScramble(shuffle(newWord))
      setGuess('')
      setScore(0)
      setStrike(0)
      setPass(3)
      setMessage("")
      localStorage.removeItem('scrambleGameState')
  }

  return (
      <div>
          <header>
              <h1>Welcome to Scramble Game</h1>
          </header>
          <div id="container">
              <button onClick={resetGame}>Start</button>
              <p>Your Scrambled Word is: {wordScramble}</p>
              <form onSubmit={guessDealer}>
                  <input type="text" value={guess} onChange={(e) => setGuess(e.target.value)} />
                  <button type="submit">Enter</button>
              </form>
              <p>{message}</p>
              <p>You have {pass} passes left</p>
              <button onClick={passDealer} disabled={pass <= 0}>Pass</button>
              <div>
                  <p>Points: {score}</p>
                  <p>Strikes: {strike}</p>
              </div>
              
          </div>
      </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<ScrambleGame />)
