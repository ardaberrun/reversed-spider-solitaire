import React from 'react';
import Card from './Card';
import { showError } from '../utils/toaster';

function Stack({ CARD_BACK ,stackItems, setStacks, stacks, checkDifferenceOfCardValues, setMove, setPoint }) {

  const drag = (e, cardIdx) => {
    const transferItem = stackItems.cards.slice(cardIdx);
    const transferData = JSON.stringify({
      item: transferItem,
      parentId: e.target.parentNode.id,
    });

    changeDragImage(e, transferItem);

    e.dataTransfer.setData('item', transferData);
  };


  // set up the ghost image of items in drag state
  const changeDragImage = (e, transferItem) => {
    const dragImage = document.createElement('div');
    dragImage.setAttribute('style', 'position: relative; top: -2000px');
  
    transferItem.forEach((item, i) => {
      let newImg = document.createElement('img');
      newImg.src = item.img;
      newImg.setAttribute('style', `width: 85px; height: 110px; position: absolute; top: ${25 * i}px`);

      dragImage.appendChild(newImg);
    });
  
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 50);
  
    setTimeout(() => {
      dragImage.remove();
    });
  };


  const allowDrop = (e) => {
    e.preventDefault();
  };


  const drop = (e) => {
    e.preventDefault();
    const withoutParsedData = e.dataTransfer.getData('item');

    // exit the function if the drag event fail
    if (!withoutParsedData.length) {
      showError();
      setMove(prev => prev + 1);
      setPoint(prev => prev - 1);
      return;
    }
    
    const data = JSON.parse(withoutParsedData);

    // if the dragged item is drop on the stack where it exists, exit the function.
    if (data.parentId === e.target.parentNode.id) {
      return;
    }

    // target.id : img id 
    // target.parentNode.id : stack id
    const findedStack = stacks.find((stack) => stack.id === (e.target.parentNode.id || e.target.id));

    if (findedStack.cards.length && findedStack.cards[findedStack.cards.length - 1].value - data.item[0].value !== 1) {
      showError();
      setMove(prev => prev + 1);
      setPoint(prev => prev - 1);
      return;
    } else {
      setStacks(
        stacks.map((stack) => {
          if (stack.id === (e.target.parentNode.id || e.target.id)) {
            setMove(prev => prev +  1);
            setPoint(prev => prev - 1);
            // dragged items are add to the stack
            return { ...stack, cards: [...stack.cards, ...data.item] };
          } else if (stack.id === data.parentId) {
            return { ...stack, cards: changeOldStackState(stack.cards, data.item) };
          } else {
            return stack;
          }
        })
      );
    }
  };


  // This function remove the moved item from the stack it was in 
  // and turn over the last card of that stack. {reversed: false}
  const changeOldStackState = (cards, transferredItem) => {
    const findPlace = cards.findIndex((card) => card.id === transferredItem[0].id);
    const slicedCard = cards.slice(0, findPlace);

    if (slicedCard[slicedCard.length - 1]?.reversed) {
      slicedCard[slicedCard.length - 1].reversed = false;
    }

    return slicedCard;
  };


  return (
    <div
      className="stack"
      id={stackItems.id}
      onDragOver={(e) => allowDrop(e)}
      onDrop={(e) => drop(e)}
    >
      {stackItems.cards &&
        stackItems.cards.map((item, idx) => (
          <Card
            draggable={(item.reversed || !checkDifferenceOfCardValues(stackItems.cards, idx)) ? 'false' : 'true'}
            id={item.id}
            onDragStart={(e) => drag(e, idx)}
            src={item.reversed ? CARD_BACK : item.img}
            key={item.id}
            alt={item.name}
            style={{ top: `${25 * idx}px` }}
          />
        ))}
    </div>
  );
}

export default Stack;
