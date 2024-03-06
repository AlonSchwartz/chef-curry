import { TrieNode } from "./trie-node";

export class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode;
    }

    /**
     * insert a given word into the trie
     * @param word the word to insert
     */
    insert(word: string) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            // This node can't be undefined, because we are checking above if its not exists
            node = node.children.get(char)!;
        }
        node.isEndOfWord = true;
    }

    /**
     * Searches for words in the trie that contain a given substring.
     * @param substring The substring to search for within words in the trie.
     * @returns An array of words in the trie that contain the specified substring.
     */
    search(substring: string): string[] {
        const suggestions: string[] = [];
        this.findAllWords(this.root, substring.toLowerCase(), suggestions);
        return suggestions;
    }

    /**
     * Recursively finds words in the trie that contain a given substring.
     * @param node The current node being examined in the trie.
     * @param substring The substring to search for within words in the trie
     * @param suggestions An array to store words found containing the substring
     * @param currentWord The word constructed so far during traversal (default: "")
     */
    findAllWords(
        node: TrieNode,
        substring: string,
        suggestions: string[],
        currentWord: string = ""
    ) {
        if (node.isEndOfWord) {
            if (currentWord.includes(substring)) {
                suggestions.push(currentWord);
            }
        }

        // Loop through the children of the current node
        for (const [char, child] of node.children) {
            // Recursively call findAllWords on each child node
            this.findAllWords(child, substring, suggestions, currentWord + char);
        }
    }
}
