import { User } from '../lib/interfaces/user';

type UserValidation = Record<keyof User, string> & { [key: string]: string};

const objectForValidation: UserValidation = {
    name: 'string',
    email: 'string',
    city: 'string',
    web: 'string'
}

const objectForCompare: { [x: string]: boolean; } = {
    name: true,
    email: true,
    city: true,
    web: true
};

export function isNotEmpty (dataJson: User) {
    for (let property in dataJson) {
        if (dataJson.hasOwnProperty(property)) {
            // object is not empty
            return false;
        }
    }
    return true;
}

function isEqual(object1: { [x: string]: boolean; }, object2: { [x: string]: boolean; }) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (object1[key as any] !== object2[key as any]) {
        return false;
      }
    }
  
    return true;
  }

export function isDataValid (dataJson: User) {
    const resultcompare: { [x: string]: boolean; } = {};
    Object.entries(dataJson).map(([prop, value]) => {
        let passedValidation: boolean = false;
        passedValidation = typeof value === objectForValidation[prop]
        Object.assign(resultcompare, {[prop]: passedValidation});
        return { [prop]: passedValidation };
    });
    return isEqual(resultcompare, objectForCompare);
}