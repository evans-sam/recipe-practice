import { DatabaseSchema } from './types';

export const BeefWellington = {
  name: 'beefWellington',
  ingredients: ['1 beef tenderloin', 'puff pastry', 'love'],
  instructions: ['sear tenderloin', 'wrap in pastry', '...', 'PROFIT'],
};
export const Sourdough = {
  name: 'sourdough',
  ingredients: ['flour', 'water', 'yeast'],
  instructions: ['something', 'bake'],
};
export const IceCream = {
  name: 'iceCream',
  ingredients: ['milk', 'sugar', 'whatever you want'],
  instructions: ['combine all', 'put in ice cream maker'],
};
export const MockDatabase: DatabaseSchema = {
  recipes: [BeefWellington, Sourdough, IceCream],
};

export const MockDatabaseService = {
  openDB: jest.fn(),
  saveDB: jest.fn(),
};
