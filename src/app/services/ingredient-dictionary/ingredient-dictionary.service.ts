import { Injectable } from '@angular/core';
import { INGREDIENTS } from './ingerdients';
import { Trie } from 'src/app/classes/trie';

@Injectable({
  providedIn: 'root'
})
export class IngredientDictionaryService {
  private dictionary: Map<string, string[]> = new Map();
  private threshold = 50;
  private trie: Trie;

  constructor() {
    this.trie = new Trie;

    INGREDIENTS.forEach(ingredient => {
      ingredient = ingredient.toLowerCase()
      //this.addIngredient(ingredient);

      this.trie.insert(ingredient)
    })
  }

  onInputChange(inputValue: string): string[] {
    const suggestions = this.trie.search(inputValue.toLowerCase());

    // make it faster, as we taking results up to the threshold.
    if (suggestions.length > this.threshold) {
      return suggestions.slice(0, 49);
    }


    return suggestions;
  }

  /*
    public addIngredient(ingredient: string): void {
      console.log("I AM IN ADD ING DICTIONARY METHOD")
      const firstLetter = ingredient.charAt(0);
      const ingredients = this.dictionary.get(firstLetter) || [];
  
      ingredients.push(ingredient)
      ingredients.sort((a, b) => a.localeCompare(b));
  
      this.dictionary.set(firstLetter, ingredients);
  
  
    }
  */
  test() {
    console.log(this.dictionary)
  }

}


