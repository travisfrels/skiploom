import type { Recipe } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: "Grandma's Chocolate Chip Cookies",
    description:
      'The classic family recipe passed down for generations. Crispy on the outside, chewy on the inside.',
    ingredients: [
      { id: '1-1', amount: 2.25, unit: 'cups', name: 'all-purpose flour' },
      { id: '1-2', amount: 1, unit: 'tsp', name: 'baking soda' },
      { id: '1-3', amount: 1, unit: 'tsp', name: 'salt' },
      { id: '1-4', amount: 1, unit: 'cup', name: 'butter, softened' },
      { id: '1-5', amount: 0.75, unit: 'cup', name: 'granulated sugar' },
      { id: '1-6', amount: 0.75, unit: 'cup', name: 'brown sugar, packed' },
      { id: '1-7', amount: 2, unit: 'large', name: 'eggs' },
      { id: '1-8', amount: 1, unit: 'tsp', name: 'vanilla extract' },
      { id: '1-9', amount: 2, unit: 'cups', name: 'chocolate chips' },
    ],
    steps: [
      {
        id: '1-s1',
        orderIndex: 1,
        instruction: 'Preheat oven to 375°F (190°C).',
      },
      {
        id: '1-s2',
        orderIndex: 2,
        instruction:
          'Combine flour, baking soda, and salt in a small bowl.',
      },
      {
        id: '1-s3',
        orderIndex: 3,
        instruction:
          'Beat butter, granulated sugar, and brown sugar in a large mixer bowl until creamy.',
      },
      {
        id: '1-s4',
        orderIndex: 4,
        instruction: 'Add eggs and vanilla extract; beat well.',
      },
      {
        id: '1-s5',
        orderIndex: 5,
        instruction: 'Gradually beat in flour mixture. Stir in chocolate chips.',
      },
      {
        id: '1-s6',
        orderIndex: 6,
        instruction:
          'Drop rounded tablespoons of dough onto ungreased baking sheets.',
      },
      {
        id: '1-s7',
        orderIndex: 7,
        instruction:
          'Bake for 9 to 11 minutes or until golden brown. Cool on baking sheets for 2 minutes.',
      },
    ],
  },
  {
    id: '2',
    title: 'Mom\'s Chicken Noodle Soup',
    description: 'The perfect comfort food for cold days or when you\'re feeling under the weather.',
    ingredients: [
      { id: '2-1', amount: 1, unit: 'whole', name: 'chicken (about 4 lbs)' },
      { id: '2-2', amount: 10, unit: 'cups', name: 'water' },
      { id: '2-3', amount: 3, unit: 'stalks', name: 'celery, chopped' },
      { id: '2-4', amount: 3, unit: 'medium', name: 'carrots, sliced' },
      { id: '2-5', amount: 1, unit: 'large', name: 'onion, diced' },
      { id: '2-6', amount: 2, unit: 'cloves', name: 'garlic, minced' },
      { id: '2-7', amount: 8, unit: 'oz', name: 'egg noodles' },
      { id: '2-8', amount: 2, unit: 'tsp', name: 'salt' },
      { id: '2-9', amount: 0.5, unit: 'tsp', name: 'black pepper' },
      { id: '2-10', amount: 2, unit: 'tbsp', name: 'fresh parsley, chopped' },
    ],
    steps: [
      {
        id: '2-s1',
        orderIndex: 1,
        instruction: 'Place chicken in a large pot and cover with water. Bring to a boil.',
      },
      {
        id: '2-s2',
        orderIndex: 2,
        instruction: 'Reduce heat and simmer for 1 hour until chicken is cooked through.',
      },
      {
        id: '2-s3',
        orderIndex: 3,
        instruction: 'Remove chicken and let cool. Strain broth and return to pot.',
      },
      {
        id: '2-s4',
        orderIndex: 4,
        instruction: 'Add celery, carrots, onion, and garlic to broth. Simmer for 15 minutes.',
      },
      {
        id: '2-s5',
        orderIndex: 5,
        instruction: 'Shred chicken meat and add back to pot. Discard bones and skin.',
      },
      {
        id: '2-s6',
        orderIndex: 6,
        instruction: 'Add egg noodles and cook for 8-10 minutes until tender.',
      },
      {
        id: '2-s7',
        orderIndex: 7,
        instruction: 'Season with salt, pepper, and parsley. Serve hot.',
      },
    ],
  },
  {
    id: '3',
    title: 'Dad\'s Famous Pancakes',
    description: 'Fluffy weekend pancakes that the whole family loves.',
    ingredients: [
      { id: '3-1', amount: 1.5, unit: 'cups', name: 'all-purpose flour' },
      { id: '3-2', amount: 3.5, unit: 'tsp', name: 'baking powder' },
      { id: '3-3', amount: 1, unit: 'tbsp', name: 'sugar' },
      { id: '3-4', amount: 0.25, unit: 'tsp', name: 'salt' },
      { id: '3-5', amount: 1.25, unit: 'cups', name: 'milk' },
      { id: '3-6', amount: 1, unit: 'large', name: 'egg' },
      { id: '3-7', amount: 3, unit: 'tbsp', name: 'butter, melted' },
    ],
    steps: [
      {
        id: '3-s1',
        orderIndex: 1,
        instruction: 'Mix flour, baking powder, sugar, and salt in a large bowl.',
      },
      {
        id: '3-s2',
        orderIndex: 2,
        instruction: 'Make a well in the center and pour in milk, egg, and melted butter.',
      },
      {
        id: '3-s3',
        orderIndex: 3,
        instruction: 'Mix until smooth but don\'t overmix - some lumps are okay.',
      },
      {
        id: '3-s4',
        orderIndex: 4,
        instruction: 'Heat a griddle over medium-high heat and lightly grease.',
      },
      {
        id: '3-s5',
        orderIndex: 5,
        instruction: 'Pour 1/4 cup batter for each pancake. Cook until bubbles form on surface.',
      },
      {
        id: '3-s6',
        orderIndex: 6,
        instruction: 'Flip and cook until golden brown on both sides. Serve with maple syrup.',
      },
    ],
  },
  {
    id: '4',
    title: 'Aunt Sara\'s Apple Pie',
    description: 'A traditional apple pie with a flaky crust and warm spices.',
    ingredients: [
      { id: '4-1', amount: 2, unit: 'cups', name: 'all-purpose flour' },
      { id: '4-2', amount: 1, unit: 'tsp', name: 'salt' },
      { id: '4-3', amount: 0.75, unit: 'cup', name: 'cold butter, cubed' },
      { id: '4-4', amount: 6, unit: 'tbsp', name: 'ice water' },
      { id: '4-5', amount: 6, unit: 'medium', name: 'apples, peeled and sliced' },
      { id: '4-6', amount: 0.75, unit: 'cup', name: 'sugar' },
      { id: '4-7', amount: 2, unit: 'tbsp', name: 'flour' },
      { id: '4-8', amount: 1, unit: 'tsp', name: 'cinnamon' },
      { id: '4-9', amount: 0.25, unit: 'tsp', name: 'nutmeg' },
    ],
    steps: [
      {
        id: '4-s1',
        orderIndex: 1,
        instruction: 'Mix 2 cups flour and salt. Cut in butter until crumbly.',
      },
      {
        id: '4-s2',
        orderIndex: 2,
        instruction: 'Add ice water gradually until dough forms. Divide in half and chill.',
      },
      {
        id: '4-s3',
        orderIndex: 3,
        instruction: 'Preheat oven to 425°F (220°C).',
      },
      {
        id: '4-s4',
        orderIndex: 4,
        instruction: 'Toss apples with sugar, 2 tbsp flour, cinnamon, and nutmeg.',
      },
      {
        id: '4-s5',
        orderIndex: 5,
        instruction: 'Roll out one dough half and place in 9-inch pie plate.',
      },
      {
        id: '4-s6',
        orderIndex: 6,
        instruction: 'Fill with apple mixture. Roll out second dough and place on top. Crimp edges.',
      },
      {
        id: '4-s7',
        orderIndex: 7,
        instruction: 'Cut slits in top crust. Bake 45-50 minutes until golden.',
      },
    ],
  },
];
