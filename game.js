const question = document.querySelector('#question')
const choices = Array.from(document.querySelectorAll('.choice-text'))
const progressText = document.querySelector('#progressText')
const scoreText = document.querySelector('#score')
const progressBarFull = document.querySelector('#progressBarFull')
const timerSpan = document.getElementById('timer')

let currentQuestion = {}
let acceptingAnswers;
let score;
let questionCounter;
let availableQuestions = []
let startTime = 60

let questions = [
  {
    question: 'JavaScript language is ___',
    choice1: 'Object-oriented',
    choice2: 'Object-based',
    choice3: 'Functional programming',
    choice4: 'All of the above',
    answer: 2,
  },
  {
    question: 'JavaScript ignores?',
    choice1: 'newlines',
    choice2: 'tabs',
    choice3: 'spaces',
    choice4: 'All of the above',
    answer: 4,
  },
  {
    question: 'JavaScript objects are written with _____.',
    choice1: 'round brackets ()',
    choice2: 'curly brackets {}',
    choice3: 'double quotes ""',
    choice4: 'square brackets []',
    answer: 2,
  },
  {
    question: 'JavaScript arrays are written with _____.',
    choice1: 'round brackets ()',
    choice2: 'curly brackets {}',
    choice3: 'double quotes ""',
    choice4: 'square brackets []',
    answer: 4,
  },
]

const SCORE_POINTS = 100
const MAX_QUESTIONS = 4

startGame = () => {
  questionCounter = 0
  score = 0
  availableQuestions = [...questions]
  getNewQuestion()
}

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore', score)
    return window.location.assign('/end.html')
  }

  questionCounter++
  progressText.innertext = `Question ${questionCounter} of $(MAX_QUESTIONS}`
  progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`

  const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
  currentQuestion = availableQuestions[questionsIndex]
  question.innerText = currentQuestion.question

  choices.forEach((choice) => {
    const number = choice.dataset['number']
    choice.innerText = currentQuestion['choice' + number]
  })

  availableQuestions.splice(questionsIndex, 1)

  acceptingAnswers = true
}

choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswers) return

    acceptingAnswers = false
    const selectedChoice = e.target
    const selectedAnswer = selectedChoice.dataset['number']

    let classToApply =
      selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

    if (classToApply === 'correct') {
      incrementScore(SCORE_POINTS)
    } else {
      // if classToApply is not equal to the string 'correct', then we know the 
      // user selected the wrong answer, so now we deduct time from the timer
      startTime = startTime - 10;
    }

    selectedChoice.parentElement.classList.add(classToApply)

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply)
      getNewQuestion()
    }, 1000)
  })
})

incrementScore = (num) => {
  score += num
  scoreText.innerText = score
}

function beginTimer() {
  // set my timer span to the current value of startTime
  timerSpan.textContent = `${startTime} seconds left in the quiz`
  let theIntervalId = setInterval(function () {
    // if the start time equals zero, show something else
    if (startTime <= 0) {
      timerSpan.textContent = 'Times up! Game is over!'
      clearInterval(theIntervalId)
      localStorage.setItem('mostRecentScore', score)
      // you may want to run some other function which clears the screen and display some other html
      // when the time reaches zero. You need to think about that later.
      // you would add that function call here
      // i.e. showHighScores()
      setTimeout(() => {
        window.location.assign('/end.html')
      }, 1000)
      // return null
    }
    // subtract one from the time
    startTime--
    // set the text content of my timerSpan to startTime
    timerSpan.textContent = `${startTime} seconds left in the quiz`
  }, 1000)
}

// begin the timer when this JavaScript file is read by the browser
beginTimer()

startGame()
