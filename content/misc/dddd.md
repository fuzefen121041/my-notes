# JavaScript 数据结构与算法详解

## 目录
- #简介
- #时间复杂度与空间复杂度
- #数组
- #栈
- #队列
- #链表
- #树
- #图
- #哈希表
- #堆
- #排序算法
- #搜索算法
- #递归与动态规划

---

## 简介

数据结构是计算机存储、组织数据的方式，算法是解决问题的一系列步骤。良好的数据结构和算法设计可以显著提高程序效率。

## 时间复杂度与空间复杂度

### 大O表示法
```javascript
// O(1) - 常数时间复杂度
function constantTime(arr) {
    return arr[0];  // 无论数组多大，操作时间相同
}

// O(n) - 线性时间复杂度
function linearTime(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);  // 操作次数与数组长度成正比
    }
}

// O(n²) - 平方时间复杂度
function quadraticTime(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            console.log(arr[i], arr[j]);
        }
    }
}
```

### 常见时间复杂度比较
- O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)

## 数组

### 基本操作
```javascript
class MyArray {
    constructor() {
        this.length = 0;
        this.data = {};
    }

    // O(1)
    get(index) {
        return this.data[index];
    }

    // O(1)
    push(item) {
        this.data[this.length] = item;
        this.length++;
        return this.length;
    }

    // O(1)
    pop() {
        if (this.length === 0) return undefined;
        const lastItem = this.data[this.length - 1];
        delete this.data[this.length - 1];
        this.length--;
        return lastItem;
    }

    // O(n)
    delete(index) {
        if (index >= this.length) return undefined;
        
        const item = this.data[index];
        this.shiftItems(index);
        return item;
    }

    shiftItems(index) {
        for (let i = index; i < this.length - 1; i++) {
            this.data[i] = this.data[i + 1];
        }
        delete this.data[this.length - 1];
        this.length--;
    }
}
```

## 栈

### 实现与应用
```javascript
class Stack {
    constructor() {
        this.items = [];
        this.count = 0;
    }

    // 入栈 O(1)
    push(element) {
        this.items[this.count] = element;
        this.count++;
        return this.count - 1;
    }

    // 出栈 O(1)
    pop() {
        if (this.count === 0) return undefined;
        const deletedItem = this.items[this.count - 1];
        this.count--;
        return deletedItem;
    }

    // 查看栈顶 O(1)
    peek() {
        return this.items[this.count - 1];
    }

    isEmpty() {
        return this.count === 0;
    }

    size() {
        return this.count;
    }

    clear() {
        this.items = [];
        this.count = 0;
    }
}

// 栈的应用：括号匹配
function isValidParentheses(str) {
    const stack = new Stack();
    const pairs = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (let char of str) {
        if (['(', '[', '{'].includes(char)) {
            stack.push(char);
        } else if ([')', ']', '}'].includes(char)) {
            if (stack.isEmpty() || stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }

    return stack.isEmpty();
}
```

## 队列

### 基本队列
```javascript
class Queue {
    constructor() {
        this.items = {};
        this.front = 0;
        this.rear = 0;
    }

    // 入队 O(1)
    enqueue(element) {
        this.items[this.rear] = element;
        this.rear++;
    }

    // 出队 O(1)
    dequeue() {
        if (this.isEmpty()) return undefined;
        
        const item = this.items[this.front];
        delete this.items[this.front];
        this.front++;
        return item;
    }

    peek() {
        return this.items[this.front];
    }

    isEmpty() {
        return this.rear - this.front === 0;
    }

    size() {
        return this.rear - this.front;
    }

    print() {
        console.log(Object.values(this.items));
    }
}
```

### 优先队列
```javascript
class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}
```

## 链表

### 单向链表
```javascript
class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // O(1)
    addFirst(data) {
        const newNode = new ListNode(data);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }

    // O(n)
    addLast(data) {
        const newNode = new ListNode(data);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    // O(n)
    insertAt(data, index) {
        if (index < 0 || index > this.size) return false;
        
        if (index === 0) {
            this.addFirst(data);
            return true;
        }

        const newNode = new ListNode(data);
        let current = this.head;
        let previous = null;
        let count = 0;

        while (count < index) {
            previous = current;
            current = current.next;
            count++;
        }

        newNode.next = current;
        previous.next = newNode;
        this.size++;
        return true;
    }

    // O(n)
    removeAt(index) {
        if (index < 0 || index >= this.size) return null;
        
        let current = this.head;
        
        if (index === 0) {
            this.head = current.next;
        } else {
            let previous = null;
            let count = 0;
            
            while (count < index) {
                previous = current;
                current = current.next;
                count++;
            }
            
            previous.next = current.next;
        }
        
        this.size--;
        return current.data;
    }

    // O(n)
    find(data) {
        let current = this.head;
        let index = 0;
        
        while (current) {
            if (current.data === data) {
                return index;
            }
            current = current.next;
            index++;
        }
        
        return -1;
    }

    print() {
        let current = this.head;
        const result = [];
        
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        
        console.log(result.join(' -> '));
    }
}
```

### 双向链表
```javascript
class DoublyListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    addFirst(data) {
        const newNode = new DoublyListNode(data);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.size++;
    }

    addLast(data) {
        const newNode = new DoublyListNode(data);
        
        if (!this.tail) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }
}
```

## 树

### 二叉树节点
```javascript
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
```

### 二叉树遍历
```javascript
class BinaryTree {
    constructor() {
        this.root = null;
    }

    // 前序遍历：根 -> 左 -> 右
    preOrderTraversal(node = this.root, result = []) {
        if (node) {
            result.push(node.value);
            this.preOrderTraversal(node.left, result);
            this.preOrderTraversal(node.right, result);
        }
        return result;
    }

    // 中序遍历：左 -> 根 -> 右
    inOrderTraversal(node = this.root, result = []) {
        if (node) {
            this.inOrderTraversal(node.left, result);
            result.push(node.value);
            this.inOrderTraversal(node.right, result);
        }
        return result;
    }

    // 后序遍历：左 -> 右 -> 根
    postOrderTraversal(node = this.root, result = []) {
        if (node) {
            this.postOrderTraversal(node.left, result);
            this.postOrderTraversal(node.right, result);
            result.push(node.value);
        }
        return result;
    }

    // 层次遍历（广度优先）
    levelOrderTraversal() {
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel = [];
            
            for (let i = 0; i < levelSize; i++) {
                const currentNode = queue.shift();
                currentLevel.push(currentNode.value);
                
                if (currentNode.left) queue.push(currentNode.left);
                if (currentNode.right) queue.push(currentNode.right);
            }
            
            result.push(currentLevel);
        }
        
        return result;
    }
}
```

### 二叉搜索树
```javascript
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new TreeNode(value);
        
        if (!this.root) {
            this.root = newNode;
            return this;
        }
        
        let current = this.root;
        
        while (true) {
            if (value === current.value) return undefined;
            
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }

    find(value) {
        if (!this.root) return false;
        
        let current = this.root;
        let found = false;
        
        while (current && !found) {
            if (value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            } else {
                found = true;
            }
        }
        
        return found ? current : false;
    }

    // 查找最小值
    findMin(node = this.root) {
        while (node && node.left) {
            node = node.left;
        }
        return node;
    }

    // 查找最大值
    findMax(node = this.root) {
        while (node && node.right) {
            node = node.right;
        }
        return node;
    }
}
```

## 图

### 图的表示与遍历
```javascript
class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1].push(vertex2);
        this.adjacencyList[vertex2].push(vertex1);
    }

    // 深度优先搜索
    depthFirstSearch(start) {
        const result = [];
        const visited = {};
        const adjacencyList = this.adjacencyList;

        (function dfs(vertex) {
            if (!vertex) return null;
            visited[vertex] = true;
            result.push(vertex);
            
            adjacencyList[vertex].forEach(neighbor => {
                if (!visited[neighbor]) {
                    return dfs(neighbor);
                }
            });
        })(start);

        return result;
    }

    // 广度优先搜索
    breadthFirstSearch(start) {
        const queue = [start];
        const result = [];
        const visited = {};
        visited[start] = true;

        while (queue.length) {
            const currentVertex = queue.shift();
            result.push(currentVertex);

            this.adjacencyList[currentVertex].forEach(neighbor => {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                }
            });
        }

        return result;
    }
}
```

## 哈希表

### 哈希表实现
```javascript
class HashTable {
    constructor(size = 53) {
        this.keyMap = new Array(size);
    }

    _hash(key) {
        let total = 0;
        const WEIRD_PRIME = 31;
        
        for (let i = 0; i < Math.min(key.length, 100); i++) {
            const char = key[i];
            const value = char.charCodeAt(0) - 96;
            total = (total * WEIRD_PRIME + value) % this.keyMap.length;
        }
        
        return total;
    }

    set(key, value) {
        const index = this._hash(key);
        
        if (!this.keyMap[index]) {
            this.keyMap[index] = [];
        }
        
        // 检查是否已存在相同的key，存在则更新
        for (let i = 0; i < this.keyMap[index].length; i++) {
            if (this.keyMap[index][i][0] === key) {
                this.keyMap[index][i][1] = value;
                return;
            }
        }
        
        this.keyMap[index].push([key, value]);
    }

    get(key) {
        const index = this._hash(key);
        
        if (this.keyMap[index]) {
            for (let i = 0; i < this.keyMap[index].length; i++) {
                if (this.keyMap[index][i][0] === key) {
                    return this.keyMap[index][i][1];
                }
            }
        }
        
        return undefined;
    }

    keys() {
        const keysArr = [];
        
        for (let i = 0; i < this.keyMap.length; i++) {
            if (this.keyMap[i]) {
                for (let j = 0; j < this.keyMap[i].length; j++) {
                    if (!keysArr.includes(this.keyMap[i][j][0])) {
                        keysArr.push(this.keyMap[i][j][0]);
                    }
                }
            }
        }
        
        return keysArr;
    }

    values() {
        const valuesArr = [];
        
        for (let i = 0; i < this.keyMap.length; i++) {
            if (this.keyMap[i]) {
                for (let j = 0; j < this.keyMap[i].length; j++) {
                    if (!valuesArr.includes(this.keyMap[i][j][1])) {
                        valuesArr.push(this.keyMap[i][j][1]);
                    }
                }
            }
        }
        
        return valuesArr;
    }
}
```

## 堆

### 最小堆实现
```javascript
class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    insert(value) {
        this.heap.push(value);
        this.heapifyUp();
    }

    heapifyUp() {
        let currentIndex = this.heap.length - 1;
        
        while (currentIndex > 0) {
            const parentIndex = this.getParentIndex(currentIndex);
            
            if (this.heap[parentIndex] <= this.heap[currentIndex]) {
                break;
            }
            
            this.swap(parentIndex, currentIndex);
            currentIndex = parentIndex;
        }
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        
        return min;
    }

    heapifyDown() {
        let currentIndex = 0;
        
        while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(currentIndex);
            const rightChildIndex = this.getRightChildIndex(currentIndex);
            
            if (rightChildIndex < this.heap.length && 
                this.heap[rightChildIndex] < this.heap[smallerChildIndex]) {
                smallerChildIndex = rightChildIndex;
            }
            
            if (this.heap[currentIndex] <= this.heap[smallerChildIndex]) {
                break;
            }
            
            this.swap(currentIndex, smallerChildIndex);
            currentIndex = smallerChildIndex;
        }
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    size() {
        return this.heap.length;
    }
}
```

## 排序算法

### 冒泡排序
```javascript
function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换元素
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        // 如果没有发生交换，说明已经有序
        if (!swapped) break;
    }
    
    return arr;
}
```

### 选择排序
```javascript
function selectionSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        // 在未排序部分找到最小元素
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // 将最小元素交换到已排序部分的末尾
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    
    return arr;
}
```

### 插入排序
```javascript
function insertionSort(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        
        // 将大于key的元素向后移动
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
    
    return arr;
}
```

### 归并排序
```javascript
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}
```

### 快速排序
```javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const pivotIndex = partition(arr, left, right);
        quickSort(arr, left, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, right);
    }
    return arr;
}

function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left;
    
    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
        }
    }
    
    [arr[i], arr[right]] = [arr[right], arr[i]];
    return i;
}
```

## 搜索算法

### 二分查找
```javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// 递归版本
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) return -1;
    
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
        return mid;
    } else if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}
```

## 递归与动态规划

### 斐波那契数列
```javascript
// 递归版本（时间复杂度高）
function fibonacciRecursive(n) {
    if (n <= 1) return n;
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// 动态规划版本
function fibonacciDP(n) {
    if (n <= 1) return n;
    
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// 空间优化的动态规划版本
function fibonacciOptimized(n) {
    if (n <= 1) return n;
    
    let prev1 = 1;  // dp[i-1]
    let prev2 = 0;  // dp[i-2]
    
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```

### 背包问题
```javascript
function knapSack(capacity, weights, values, n) {
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][capacity];
}
```

---

## 总结

本文详细介绍了JavaScript中常用的数据结构和算法，包括：

1. **基础数据结构**：数组、栈、队列、链表
2. **复杂数据结构**：树、图、哈希表、堆
3. **排序算法**：冒泡、选择、插入、归并、快速排序
4. **搜索算法**：二分查找
5. **高级算法**：递归、动态规划

掌握这些数据结构和算法对于编写高效、可维护的代码至关重要。建议通过实际编码练习来加深理解，并尝试解决LeetCode等平台上的算法题目来提升技能。