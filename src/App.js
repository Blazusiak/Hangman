import React, { Component } from "react";
import axios from "axios";
import hangman_0 from "./images/hangman_0.png";
import hangman_1 from "./images/hangman_1.png";
import hangman_2 from "./images/hangman_2.png";
import hangman_3 from "./images/hangman_3.png";
import hangman_4 from "./images/hangman_4.png";
import hangman_5 from "./images/hangman_5.png";
import hangman_6 from "./images/hangman_6.png";
import hangman_won from "./images/hangman_won.png";

class App extends Component {
  state = {
    keyboard: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
    images: [
      hangman_0,
      hangman_1,
      hangman_2,
      hangman_3,
      hangman_4,
      hangman_5,
      hangman_6,
    ],
    gameOver: false,
    gameWon: false,
    guessed: [],
    mistakes: 0,
    maxMistakes: 6,
    wordState: "",
    answer: "",
    message: "",
  };

  // Upon mounting component, generate a word to guess
  componentDidMount() {
    this.generateWord();
  }

  // Fetch a random word from an existing API
  async generateWord() {
    const response = await axios
      .get("https://random-word-api.herokuapp.com//word?number=1")
      .then((response) => {
        return response.data.toString();
      });
    let wordState = " _ ".repeat(response.length);
    this.setState({ wordState: wordState, answer: response });
  }

  // Generate the interactive keyboard
  generateKeyboard(element) {
    return element.split("").map((letter) => {
      return (
        <button
          className="btn btn-lg btn-primary m-2"
          key={letter}
          id={letter}
          onClick={() => this.handleGuess(`${letter}`)}
        >
          {letter}
        </button>
      );
    });
  }

  // Handle a guess made by the user
  async handleGuess(letter) {
    this.state.guessed.push(letter);
    document.getElementById(letter).setAttribute("disabled", true);

    if (this.state.answer.indexOf(letter) >= 0) {
      let wordState = this.state.answer
        .split("")
        .map((letter) =>
          this.state.guessed.indexOf(letter) >= 0 ? letter : " _ "
        )
        .join("");
      this.setState({ wordState }, () => this.evaluateGameState());
    } else if (this.state.answer.indexOf(letter) === -1) {
      this.setState(
        (prevState) => ({
          mistakes: prevState.mistakes + 1,
        }),
        () => this.evaluateGameState()
      );
    }
  }

  // Determine whether the player has won or lost
  evaluateGameState() {
    if (
      this.state.wordState === this.state.answer &&
      this.state.answer !== ""
    ) {
      this.setState({
        message: "Congratulations! You Won, The word was " + this.state.answer,
        gameWon: true,
        gameOver: true,
      });
      this.disableKeyboard();
    }
    if (this.state.mistakes >= this.state.maxMistakes) {
      this.setState({
        message:
          "Unfortunately, you did not guess the word " + this.state.answer,
        gameOver: true,
      });

      this.disableKeyboard();
    }
  }

  // Enable keyboard when game reset
  // Disable keyboard when game over state is reached
  disableKeyboard(disable = true) {
    if (disable) {
      this.state.keyboard.map((element) =>
        element
          .split("")
          .map((letter) =>
            document.getElementById(letter).setAttribute("disabled", true)
          )
      );
    } else {
      this.state.keyboard.map((element) =>
        element
          .split("")
          .map((letter) =>
            document.getElementById(letter).removeAttribute("disabled", true)
          )
      );
    }
  }

  // Reset the game and pick a new word
  async reset() {
    await this.generateWord();
    this.disableKeyboard(false);
    this.setState({
      gameOver: false,
      gameWon: false,
      message: "",
      mistakes: 0,
      guessed: [],
    });
  }

  render() {
    return (
      <div className="container">
        <header className="text-center">
          <h1>Hangman</h1>
        </header>
        <div className="text-center">Guess the word</div>
        <div className="text-center">
          {this.state.gameWon ? (
            <img src={hangman_won} alt="hangman_won_img" />
          ) : (
            <img
              src={
                this.state.gameOver === true
                  ? this.state.images[this.state.maxMistakes]
                  : this.state.images[this.state.mistakes]
              }
              alt="hangman_img"
            />
          )}
        </div>
        <div className="text-center">{this.state.wordState}</div>
        <div className="text-center">
          {this.state.gameOver === true ? this.state.message : null}
        </div>
        <div>
          {this.state.keyboard.map((element) => (
            <div className="row justify-content-center" key={element}>
              <div className="btn-group">{this.generateKeyboard(element)}</div>
            </div>
          ))}
        </div>
        <div>
          <button
            className="btn btn-lg btn-primary m-2"
            onClick={() => this.reset()}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
}

export default App;
