function isValueCorrectType(value, type) {
  let isValueTypeValidated = false;
  switch (type) {
    case 'string':
      isValueTypeValidated = typeof value === 'string';
      break;
    case 'number':
      isValueTypeValidated = typeof value === 'number';
      break;
    case 'boolean':
      isValueTypeValidated = typeof value === 'boolean';
      break;
    case 'array':
      isValueTypeValidated = Array.isArray(value);
      break;
    case 'object':
      isValueTypeValidated = value.constructor === Object;
      break;
    default:
      return 'unknown type';
  }
  return isValueTypeValidated;
}

function doesObjectHaveRequiredProperties(obj, propsArray) {
  const missingProps = [];
  propsArray.forEach((prop) => {
    if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
      missingProps.push(prop);
    }
  });
  return missingProps.length === 0;
}

function createWordList(wordArray) {
  let wordList = '';
  switch (wordArray.length) {
    case 0:
      wordList = '';
      break;
    case 1:
      wordList = `${wordArray[0]}`;
      break;
    case 2:
      wordList = `${wordArray[0]} and ${wordArray[1]}`;
      break;
    default:
      for (let i = 0; i < wordArray.length - 1; i += 1) {
        wordList += `${wordArray[i]}, `;
      }
      wordList += `and ${wordArray[wordArray.length - 1]}`;
  }
  return wordList;
}

export { isValueCorrectType, doesObjectHaveRequiredProperties, createWordList };
