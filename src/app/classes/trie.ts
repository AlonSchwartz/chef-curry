import { TrieNode } from "./trie-node";

export class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode;
    }

    insert(word: string) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            // This node will can't be undefined, because we are checking above if its not exists
            node = node.children.get(char)!;
        }
        node.isEndOfWord = true;
    }

    search(substring: string): string[] {
        const suggestions: string[] = [];
        this.findAllWords(this.root, substring.toLowerCase(), suggestions);
        return suggestions;
    }

    findAllWords(
        node: TrieNode,
        substring: string,
        suggestions: string[],
        currentWord: string = ""
    ) {

        // Check if the current word contains the desired substring
        if (currentWord.toLowerCase().includes(substring)) {
            //if (currentWord.length > 3){
            //console.log(currentWord + " includes " + substring)}

            if (node.isEndOfWord) {
                suggestions.push(currentWord.trim());
            }
        }

        // Loop through the children of the current node
        for (const [char, child] of node.children) {
            // Recursively call findAllWords on each child node
            this.findAllWords(child, substring, suggestions, currentWord + char);
        }
    }
}
