import { isNil } from 'lodash';

function notNil(value) {
  return !isNil(value);
}

export { notNil };
