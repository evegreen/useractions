'use strict';

/* eslint no-unused-vars:0 */
/* eslint strict:0 */

// VIEW ACTIONS

function immediateResultButtonClicked() {
  let immediateResultButton = document.querySelector(
    'input#immediateResultButton'
  );
  let newDiv = document.createElement('div');
  newDiv.id = 'immediateResult';
  newDiv.innerHTML = 'immediateResult';
  insertAfter(newDiv, immediateResultButton);
}

var onceButtonWasClickedCount = 0;
function onceButtonClicked() {
  onceButtonWasClickedCount++;
}

function promiseChainFirstClick() {
  let promiseChainFirstButton = document.querySelector(
    'input#forPromiseChainTest'
  );

  let secondDiv = document.createElement('div');
  let secondInput = document.createElement('input');
  let secondButton = document.createElement('input');

  setTimeout(() => {
    secondDiv.id = 'promiseChainSecondDiv';
    secondDiv.innerHTML = 'promiseChainTextResult1';
    insertAfter(secondDiv, promiseChainFirstButton);
  }, 300);

  setTimeout(() => {
    secondInput.id = 'promiseChainSecondInput';
    insertAfter(secondInput, secondDiv);
  }, 600);

  setTimeout(() => {
    secondButton.id = 'promiseChainSecondButton';
    secondButton.type = 'button';
    secondButton.onclick = promiseChainSecondClick;
    secondButton.value = 'promiseChainSecondButton';
    insertAfter(secondButton, secondInput);
  }, 900);
}

function promiseChainSecondClick() {
  let promiseChainSecondInput = document.querySelector(
    'input#promiseChainSecondInput'
  );
  let promiseChainSecondButton = document.querySelector(
    'input#promiseChainSecondButton'
  );

  let secondInputText = promiseChainSecondInput.value;

  setTimeout(() => {
    let thirdDiv = document.createElement('div');
    thirdDiv.id = 'promiseChainThirdDiv';
    thirdDiv.innerHTML = secondInputText + ' is given';
    insertAfter(thirdDiv, promiseChainSecondButton);
  }, 300);
}

function stepsExampleClicked() {
  setTimeout(() => {
    let stepsExampleFirstButton = document.querySelector(
      'input#forStepsExample'
    );
    let secondButton = document.createElement('input');
    secondButton.type = 'button';
    secondButton.onclick = stepsExampleSecondButtonClicked;
    secondButton.id = 'stepsExampleSecondButton';
    secondButton.value = 'stepsExampleSecondButton';
    insertAfter(secondButton, stepsExampleFirstButton);
  }, 300);
}

function stepsExampleSecondButtonClicked() {
  setTimeout(() => {
    let stepsExampleSecondButton = document.querySelector(
      'input#stepsExampleSecondButton'
    );
    let thirdButton = document.createElement('input');
    thirdButton.type = 'button';
    thirdButton.onclick = stepsExampleThirdButtonClicked;
    thirdButton.id = 'stepsExampleThirdButton';
    thirdButton.value = 'stepsExampleThirdButton';
    insertAfter(thirdButton, stepsExampleSecondButton);
  }, 300);
}

function stepsExampleThirdButtonClicked() {
  setTimeout(() => {
    let stepsExampleThirdButton = document.querySelector(
      'input#stepsExampleThirdButton'
    );
    let stepsExampleLastDiv = document.createElement('div');
    stepsExampleLastDiv.id = 'stepsExampleLastDiv';
    stepsExampleLastDiv.innerHTML = 'stepsExampleFinalText';
    insertAfter(stepsExampleLastDiv, stepsExampleThirdButton);
  }, 300);
}

// OTHER

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
