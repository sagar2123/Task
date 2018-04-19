import React, { Component } from 'react';
import './App.css';
const text= "Hi you there"

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      words : [],
      value : "",
      wordCounter: 0,
      correctWord: true,
      currentCorrectWord: [],
      wordsPerMin: 0,
      wordsPerMinIsVisible: false
    } 
    this.compareText = this.compareText.bind(this);
    this.checkKeycode = this.checkKeycode.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkSubString = this.checkSubString.bind(this);
    
  }

  componentWillMount() {
    let parser, htmlDoc;
    var promise = new Promise(function (resolve, reject) {
      // call resolve if the method succeeds
      fetch('http://www.randomtext.me/api/', {
          method: 'GET'
      }).then(res => {
          resolve(res.json());
      }).catch(err => {
          console.log(err);
      });

  })
  promise.then((res)=>{
    console.log(res.text_out)
    parser=new DOMParser();
    htmlDoc=parser.parseFromString(res.text_out, "text/html");
    let textString =  htmlDoc.getElementsByTagName("body")[0];
    console.log(textString.textContent);

    this.setState({
      words: textString.textContent.split(" ")
    }, () => {
    let self = this;
    setInterval(function() {
          self.setState({
            wordsPerMin: self.state.wordCounter,
            wordsPerMinIsVisible: true
          });
          },60000);
    });

  })
  }


  checkKeycode(e) {
    if(e.keyCode === 32){
      this.compareText();
    }else if(this.state.value === " ") {
      this.setState({
        value: ""
      });
    }
    this.checkSubString();
  }

  checkSubString(){
    if(this.state.words[this.state.wordCounter] && this.state.words[this.state.wordCounter].indexOf(this.state.value) === 0){
      this.setState({
        correctWord: true
      })
    }else{
      this.setState({
        correctWord: false
      })
    }
  }

  compareText() {
    let currentCorrectWord = this.state.currentCorrectWord
    if(this.state.words[this.state.wordCounter] === this.state.value){
      currentCorrectWord.push(true);
      this.setState({
        value: "",
        wordCounter: this.state.wordCounter + 1,
        correctWord: true,
        currentCorrectWord: currentCorrectWord
      })
    }
  }

  handleInputChange(e, newPartialInput) {
    this.setState({ value: newPartialInput })
  }
  render() {
    return (
      <div className="App">
      <form action="">
        {this.state.words.map((word, index) => {
          return <span className={this.state.currentCorrectWord[index]===true?'highlight':'white'} key={index} >{word+ " "}</span>
        }) 
        }
        <br/><input id="inputText" className={ this.state.correctWord ? "white" : "red"} value={this.state.value} onKeyDown={e => this.checkKeycode(e,e.target.value)} onChange={e => this.handleInputChange(e, e.target.value)} autoComplete="off"></input> 
      </form>
     {this.state.wordsPerMinIsVisible ? <h2 >Words per mintue {this.state.wordsPerMin}</h2>: <h2>Time is running hurry up type each word. If you make a mistake input box will be coloured red otherwise it will stay white. For with every correct word you word will be highlghted</h2>} 
      </div>
    );
  }
}

export default App;
