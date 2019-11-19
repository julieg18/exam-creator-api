function isValueCorrectType(value, type) {
  let isValueTypeValidated = false;
  switch (type) {
    case 'string':
      isValueTypeValidated = typeof value === 'string';
      break;
    case 'number':
      isValueTypeValidated = typeof value === 'number' && !Number.isNaN(value);
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
  return { doesObjHaveRequiredProps: missingProps.length === 0, missingProps };
}

function createList(listArray) {
  let list = '';
  switch (listArray.length) {
    case 0:
      list = '';
      break;
    case 1:
      list = `${listArray[0]}`;
      break;
    case 2:
      list = `${listArray[0]} and ${listArray[1]}`;
      break;
    default:
      for (let i = 0; i < listArray.length - 1; i += 1) {
        list += `${listArray[i]}, `;
      }
      list += `and ${listArray[listArray.length - 1]}`;
  }
  return list;
}

function doesRequestHaveRequiredParams(requiredParams, request) {
  const {
    doesObjHaveRequiredProps,
    missingProps,
  } = doesObjectHaveRequiredProperties(request, requiredParams);
  return {
    doesReqHaveRequiredParams: doesObjHaveRequiredProps,
    errorMessage: `${createList(missingProps)} ${
      missingProps.length === 1 ? 'is' : 'are'
    } required`,
  };
}

function areRequestParamsEmpty(params, request) {
  const emptyParams = [];
  params.forEach((param) => {
    if (request[param].length === 0) {
      emptyParams.push(param);
    }
  });
  return {
    areReqParamsEmpty: emptyParams.length !== 0,
    errorMessage: `${createList(emptyParams)} must not be empty`,
  };
}

export {
  isValueCorrectType,
  doesObjectHaveRequiredProperties,
  createList,
  doesRequestHaveRequiredParams,
  areRequestParamsEmpty,
};
