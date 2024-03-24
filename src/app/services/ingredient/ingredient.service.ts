import { Injectable } from '@angular/core';
import { INGREDIENTS } from './ingerdients';
import { Trie } from 'src/app/classes/trie';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private trie: Trie;
  private threshold = 50;

  constructor() {
    this.trie = new Trie;

    INGREDIENTS.forEach(ingredient => {
      ingredient = ingredient.toLowerCase()
      this.trie.insert(ingredient)
    })
  }

  /**
   * Handles user input changes and provides suggestions based on a trie data structure.
   * @param inputValue The user's input value.
   * @returns An array of suggestions based on the input, capped at the defined threshold.
   */
  onInputChange(inputValue: string): string[] {
    const suggestions = this.trie.search(inputValue.toLowerCase());

    // make it faster, as we taking results up to the threshold.
    if (suggestions.length > this.threshold) {
      return suggestions.slice(0, 49);
    }

    return suggestions;
  }
}


