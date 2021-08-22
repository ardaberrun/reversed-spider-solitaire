import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import Stack from './components/Stack';
import Card from './components/Card';
import { BASE_DECK, CARD_BACK } from './utils/base-deck';
import { showError, showWonPopup } from './utils/toaster';

const INITIAL_STACKS = new Array(10).fill(null).map((_, i) => ({ id: i.toString(), cards: [] }));

function App() {
  const [decks, setDecks] = useState([]);
  const [stacks, setStacks] = useState(INITIAL_STACKS);
  const [isGameStart, setisGameStart] = useState(false);
  const [completedDeck, setCompletedDeck] = useState(0);
  const [move, setMove] = useState(0);

  /* Start Game */
  useEffect(() => {
    const allDeck = createDecks();
    setDecks(allDeck);
    setisGameStart(true);
  }, []);

  useEffect(() => {
    if (isGameStart) {
      const { copyStacks, copyDecks } = createStacks();
      setDecks(copyDecks);
      setStacks(copyStacks);
      // setMoveHistory({ deckHistory: copyDecks, stackHistory: copyStacks });
      setisGameStart(false);
    }
  }, [isGameStart]);
  /* Start game end */


  const restart = () => {
    const allDeck = createDecks();
    
    setDecks(allDeck);
    setCompletedDeck(0);
    setMove(0);
    setisGameStart(true);
  };


  // Creates 8 decks that each containing BASE_DECK, 
  // assigns each card a random id and shuffles them.
  const createDecks = () => {
    const allDecks = new Array(8)
      .fill(BASE_DECK)
      .map((deck) =>
        deck.map((card) => ({ ...card, id: Math.random().toString() }))
      );
    const sortedDecks = allDecks.map((deck) => _.shuffle(deck));

    return sortedDecks.flat();
  };


  const createStacks = () => {
    const copyDecks = Object.assign([], decks);
    const copyStacks = Object.assign([], stacks);

    copyStacks.map((stack, i) => i < 4 ? createStackItems(6, copyDecks, stack) : createStackItems(5, copyDecks, stack));

    return { copyStacks, copyDecks };
  };


  const createStackItems = (index, copyDecks, stack) => {
    const stackItems = copyDecks.splice(copyDecks.length - index);
    stackItems[stackItems.length - 1].reversed = false;

    stack.cards.push(...stackItems);
  };


  const dealCard = () => {
    if (stacks.some(stack => !stack.cards.length)) {
      showError('You cant deal cards if there is an empty stack!');
      return;
    }

    const deal = decks.splice(0, 10).map((dealCard) => ({ ...dealCard, reversed: false }));

    setDecks(decks);
    setStacks(stacks.map((stack, i) => ({ ...stack, cards: [...stack.cards, deal[i]] })));
    // setMoveHistory({ deckHistory: decks, stackHistory: stacks });
  };


  // check win state
  useEffect(() => {
    checkCompletedDeck();
    if (completedDeck === 8) {
      showWonPopup(restart);
    }
  }, [stacks]);


  const checkCompletedDeck = () => {
    if (stacks.some((stack) => stack.cards.length >= 13)) {
      stacks.forEach((stack) => {
        if (stack.cards.length >= 13) {
          const lastThirteenCards = stack.cards.slice(stack.cards.length - 13);

          if (checkDifferenceOfCardValues(lastThirteenCards)) {
            let slicedCards = stack.cards.slice(0, stack.cards.length - 13);

            if (slicedCards.length) {
              slicedCards[slicedCards.length - 1].reversed = false;
            }

            setStacks(
              stacks.map((mapStack) =>
                mapStack.id === stack.id
                  ? { ...mapStack, cards: slicedCards }
                  : mapStack
              )
            );
            setCompletedDeck((prev) => prev + 1);
          }
        }
      });
    }

    return;
  };


  // If the difference between the value of the card and
  // the value of the next card is not 1, exit the function.
  const checkDifferenceOfCardValues = (cards, idx = 0) => {
    for (let i = idx; i < cards.length - 1; i++) {
      if (cards[i].value - cards[i + 1].value !== 1) {
        return false;
      }
    }

    return true;
  };


  return (
    <>
      <div className="game__info">
        <h2>Completed Deck: {completedDeck}/8</h2>
        <h2>Moves: {move}</h2>
      </div>
      <div className="game__board">
        <div className="game__board-deal">
          <div onClick={decks.length ? dealCard : undefined}>
            {decks.length ? (
              <Card
                src={CARD_BACK}
                alt="card-back"
              />
            ) : null}
          </div>
        </div>
        <div className="game__board-stacks">
            {stacks.map((stack, i) => (
              <Stack
                CARD_BACK={CARD_BACK}
                checkDifferenceOfCardValues={checkDifferenceOfCardValues}
                stacks={stacks}
                stackItems={stack}
                setStacks={setStacks}
                setMove={setMove}      
                key={i}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
