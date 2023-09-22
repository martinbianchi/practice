const isCheckboxChecked = (answers, newAnswer) => answers.includes(newAnswer);

const addCheckboxAnswer = (answers, newAnswer) => [...answers, newAnswer];

const removeCheckboxAnswer = (answers, newAnswer) =>
  answers.filter((answerId) => answerId !== newAnswer);

const updateCheckboxValue = (answers, newAnswer) =>
  isCheckboxChecked(answers, newAnswer)
    ? removeCheckboxAnswer(answers, newAnswer)
    : addCheckboxAnswer(answers, newAnswer);

const updateRadioValue = (newAnswer) => [newAnswer];

export const ACTIONS = Object.freeze({
  SET_CHECKBOX_VALUE: "SET_CHECKBOX_VALUE",
  SET_RADIO_VALUE: "SET_RADIO_VALUE",
  SET_QUESTIONNAIRE: "SET_QUESTIONNAIRE",
});

export function mapQuestionnaireToState(questionnaire) {
  return questionnaire.reduce((questionnaireMap, item) => {
    questionnaireMap[item.id] = {
      value: [],
      answer: item.answer,
    };

    return questionnaireMap;
  }, {});
}

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CHECKBOX_VALUE: {
      const { questionId, answerId } = action.payload;
      const questionState = state[questionId];

      return {
        ...state,
        [questionId]: {
          ...questionState,
          value: updateCheckboxValue(questionState.value, answerId),
        },
      };
    }
    case ACTIONS.SET_RADIO_VALUE: {
      const { questionId, answerId } = action.payload;
      const questionState = state[questionId];

      return {
        ...state,
        [questionId]: {
          ...questionState,
          value: updateRadioValue(answerId),
        },
      };
    }

    case ACTIONS.SET_QUESTIONNAIRE: {
      return mapQuestionnaireToState(action.payload);
    }
  }
}
