import React, { Component  } from 'react';
import './App.css';
import Card from './Cards/Card';
import DrawButton from './DrawButton/DrawButton';
import firebase from 'firebase/app';
import 'firebase/database';

import {DB_CONFIG} from './config/firebase/dbconfig';

class App extends Component {
  constructor (props) {
    super(props);
    
    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('cards');
    
    this.updateCard = this.updateCard.bind(this);
    this.state = {
      cards: [
      ],
      currentCard: {}
    }
  }

  componentWillMount(){
    document.title = "A Course in Contemporary Chinese";
    const currentCards = this.state.cards;
    this.database.on('child_added', snap => {
      currentCards.push ({
        id: snap.key,
        eng: snap.val().eng,
        han: snap.val().han,
        pinyin: snap.val().pinyin
      })

      this.setState({
        cards: currentCards,
        currentCard: this.getRandomCard(currentCards)
      })
    })
  }

  getRandomCard(currentCards) {
    var card = currentCards[Math.floor(Math.random() * currentCards.length)]
    return card;
  }

  updateCard() {
    const currentCards = this.state.cards;
    this.setState({
      currentCard: this.getRandomCard(currentCards),
    })
  }

  render() {
    return (
      <div className="App">
        <div className = "cardRow">          
          <Card eng = {this.state.currentCard.eng} 
                han = {this.state.currentCard.han} 
                pinyin = {this.state.currentCard.pinyin} />
          </div>
        <div className = "buttonRow">
          <DrawButton drawCard={this.updateCard} ></DrawButton>
        </div>
      </div>
    );
  }   
}

export default App;
