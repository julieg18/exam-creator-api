function validateValueType(value, type) {
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

export { validateValueType };
