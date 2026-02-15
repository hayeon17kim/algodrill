import type { Bilingual } from "@/lib/i18n";

// ─── Question Types ─────────────────────────────────────────
export interface PatternQuestion {
  id: string;
  type: "pattern" | "complexity";
  categoryId: string;
  difficulty: number;
  question: Bilingual;
  options: string[];
  answer: number;
  explanation: Bilingual;
  speakingTip?: Bilingual;
}

export interface ApproachQuestion {
  id: string;
  type: "approach";
  categoryId: string;
  difficulty: number;
  question: Bilingual;
  steps: { ko: string[]; en: string[] };
  explanation: Bilingual;
}

export interface FillBlankQuestion {
  id: string;
  type: "fillblank";
  categoryId: string;
  difficulty: number;
  question: Bilingual;
  code: string;
  blanks: {
    placeholder: Bilingual;
    answer: string;
    options: string[];
  }[];
  explanation: Bilingual;
}

export interface SpeakingQuestion {
  id: string;
  type: "speaking";
  categoryId: string;
  difficulty: number;
  question: Bilingual;
  goodAnswer: Bilingual;
  badAnswers: { ko: string[]; en: string[] };
  explanation: Bilingual;
}

export type Question = PatternQuestion | ApproachQuestion | FillBlankQuestion | SpeakingQuestion;

// ─── Question Bank ──────────────────────────────────────────
export const QUESTIONS: Question[] = [
  // ===== TWO POINTERS =====
  {
    id: "tp1", type: "pattern", categoryId: "two-pointers", difficulty: 1,
    question: { ko: "배열이 정렬되어 있고, 두 수의 합이 target인 쌍을 찾아야 합니다. 어떤 패턴을 쓸까요?", en: "The array is sorted. Find a pair whose sum equals target. Which pattern?" },
    options: ["Two Pointers", "Sliding Window", "Binary Search", "Hash Map"], answer: 0,
    explanation: { ko: "정렬된 배열에서 합을 찾을 때는 양쪽 끝에서 포인터를 좁혀가는 Two Pointers가 O(n)으로 최적입니다.", en: "For a sorted array, Two Pointers from both ends is optimal at O(n)." },
    speakingTip: { ko: "'배열이 정렬되어 있으니 Two Pointers로 O(n)에 풀 수 있습니다.'", en: "'Since the array is sorted, I'll use Two Pointers at O(n).'" },
  },
  {
    id: "tp2", type: "pattern", categoryId: "two-pointers", difficulty: 2,
    question: { ko: "정렬된 배열에서 중복을 제거하고 고유 원소 수를 반환해야 합니다 (in-place).", en: "Remove duplicates from a sorted array in-place and return the count of unique elements." },
    options: ["Hash Set", "Two Pointers (slow/fast)", "Binary Search", "Stack"], answer: 1,
    explanation: { ko: "slow 포인터는 고유 원소의 마지막 위치, fast는 탐색용. 고유 원소를 만나면 slow++하고 복사.", en: "Slow pointer marks the end of unique elements. Fast scans forward. When a new unique is found, increment slow and copy." },
    speakingTip: { ko: "'정렬되어 있으니 연속 중복만 체크하면 됩니다. slow/fast 포인터로 O(n) in-place.'", en: "'Since it's sorted, only consecutive duplicates matter. I'll use slow/fast pointers for O(n) in-place.'" },
  },
  {
    id: "tp3", type: "fillblank", categoryId: "two-pointers", difficulty: 1,
    question: { ko: "Two Sum (정렬 배열) — 빈칸을 채우세요", en: "Two Sum (sorted array) — fill in the blanks" },
    code: `function twoSum(arr, target):
    left = 0
    right = arr.length - 1

    while left < right:
        sum = arr[left] + arr[right]
        if sum == target:
            return [left, right]
        else if sum < target:
            ???
        else:
            ???`,
    blanks: [
      { placeholder: { ko: "??? (sum < target일 때)", en: "??? (when sum < target)" }, answer: "left++", options: ["left++", "right++", "left--", "right--"] },
      { placeholder: { ko: "??? (sum > target일 때)", en: "??? (when sum > target)" }, answer: "right--", options: ["left++", "right++", "left--", "right--"] },
    ],
    explanation: { ko: "합이 target보다 작으면 더 큰 값이 필요하니 left++, 크면 right--.", en: "If sum < target, need larger value → left++. If sum > target → right--." },
  },

  // ===== SLIDING WINDOW =====
  {
    id: "sw1", type: "pattern", categoryId: "sliding-window", difficulty: 1,
    question: { ko: "연속된 부분 배열 중 길이가 k인 것의 최대 합을 구해야 합니다.", en: "Find the maximum sum of a contiguous subarray of length k." },
    options: ["DFS", "Sliding Window", "Dynamic Programming", "Greedy"], answer: 1,
    explanation: { ko: "고정 크기의 연속 부분 배열 문제는 Sliding Window의 전형적인 케이스. O(n).", en: "Fixed-size contiguous subarray = classic Sliding Window. O(n)." },
    speakingTip: { ko: "'고정 크기 k의 연속 부분 배열이니 Sliding Window를 쓰겠습니다.'", en: "'Fixed window of size k — I'll use Sliding Window at O(n).'" },
  },
  {
    id: "sw2", type: "pattern", categoryId: "sliding-window", difficulty: 2,
    question: { ko: "모든 문자가 서로 다른 가장 긴 부분 문자열의 길이를 구해야 합니다.", en: "Find the length of the longest substring without repeating characters." },
    options: ["Brute Force O(n³)", "Sliding Window + Hash Set", "Dynamic Programming", "Divide & Conquer"], answer: 1,
    explanation: { ko: "가변 크기 윈도우 + Set으로 중복 체크. 중복 발견 시 left를 이동. O(n).", en: "Variable-size sliding window with a HashSet. When a duplicate is found, shrink from the left. O(n)." },
    speakingTip: { ko: "'가변 크기 Sliding Window에 HashSet으로 중복 체크하겠습니다. O(n).'", en: "'I'll use a variable-size Sliding Window with a HashSet for O(n).'" },
  },

  // ===== BINARY SEARCH =====
  {
    id: "bs1", type: "pattern", categoryId: "binary-search", difficulty: 2,
    question: { ko: "정렬된 배열에서 target 이상인 첫 번째 위치를 찾아야 합니다.", en: "Find the first position ≥ target in a sorted array." },
    options: ["Linear Scan", "Binary Search", "Two Pointers", "Hash Map"], answer: 1,
    explanation: { ko: "정렬된 배열에서 조건의 첫 위치 → Binary Search lower_bound. O(log n).", en: "First position satisfying a condition in sorted array → Binary Search lower_bound. O(log n)." },
    speakingTip: { ko: "'정렬되어 있으니 Binary Search를 쓰겠습니다.'", en: "'Since it's sorted, I'll use Binary Search.'" },
  },
  {
    id: "bs2", type: "fillblank", categoryId: "binary-search", difficulty: 2,
    question: { ko: "Binary Search 기본 — 빈칸을 채우세요", en: "Basic Binary Search — fill in the blanks" },
    code: `function binarySearch(arr, target):
    left = 0
    right = arr.length - 1

    while ???:
        mid = left + (right - left) / 2
        if arr[mid] == target:
            return mid
        else if arr[mid] < target:
            left = ???
        else:
            right = ???

    return -1`,
    blanks: [
      { placeholder: { ko: "??? (while 조건)", en: "??? (while condition)" }, answer: "left <= right", options: ["left < right", "left <= right", "left != right", "left >= right"] },
      { placeholder: { ko: "??? (left 업데이트)", en: "??? (update left)" }, answer: "mid + 1", options: ["mid", "mid + 1", "mid - 1", "left + 1"] },
      { placeholder: { ko: "??? (right 업데이트)", en: "??? (update right)" }, answer: "mid - 1", options: ["mid", "mid + 1", "mid - 1", "right - 1"] },
    ],
    explanation: { ko: "left <= right: 같을 때도 검사. mid±1로 범위를 좁혀야 무한루프 방지.", en: "left <= right: must check when equal. Use mid±1 to shrink range, preventing infinite loop." },
  },
  {
    id: "bs3", type: "approach", categoryId: "binary-search", difficulty: 2,
    question: { ko: "정렬된 회전 배열(Rotated Sorted Array)에서 target을 찾는 접근 순서는?", en: "Steps to find target in a Rotated Sorted Array?" },
    steps: {
      ko: ["배열이 회전되어 있으므로 Binary Search를 변형해야 함을 인지", "mid 기준으로 왼쪽/오른쪽 중 정렬된 쪽 판단", "정렬된 쪽에 target이 있는지 확인", "있으면 그쪽으로, 없으면 반대쪽으로 축소", "left > right가 될 때까지 반복"],
      en: ["Recognize rotated array needs modified Binary Search", "Determine which side of mid is sorted", "Check if target lies in the sorted half", "If yes, search that half; otherwise search the other", "Repeat until left > right; return -1 if not found"],
    },
    explanation: { ko: "회전 배열을 반으로 나누면 한쪽은 반드시 정렬되어 있음.", en: "Key: splitting a rotated array always gives one sorted half." },
  },

  // ===== HASH MAP =====
  {
    id: "hm1", type: "pattern", categoryId: "hash-map", difficulty: 1,
    question: { ko: "비정렬 배열에서 두 수의 합이 target인 인덱스 쌍을 찾아야 합니다 (Two Sum).", en: "Find index pair with sum = target in an unsorted array (Two Sum)." },
    options: ["Sorting + Two Pointers", "Brute Force", "Hash Map", "Binary Search"], answer: 2,
    explanation: { ko: "비정렬 Two Sum은 Hash Map으로 O(n). target - num이 맵에 있는지 확인.", en: "Unsorted Two Sum uses Hash Map at O(n). Check if target - num exists in the map." },
    speakingTip: { ko: "'해시맵으로 한 번 순회로 O(n)에 풀겠습니다.'", en: "'I'll use a HashMap for a single-pass O(n) solution.'" },
  },
  {
    id: "hm2", type: "pattern", categoryId: "hash-map", difficulty: 2,
    question: { ko: "문자열에서 가장 많이 등장하는 문자를 찾아야 합니다.", en: "Find the most frequent character in a string." },
    options: ["Sorting", "Hash Map (frequency count)", "Two Pointers", "Stack"], answer: 1,
    explanation: { ko: "Hash Map으로 각 문자의 빈도를 세고, 최대값을 찾으면 O(n).", en: "Use Hash Map to count character frequencies, then find the max. O(n)." },
    speakingTip: { ko: "'HashMap으로 빈도수를 세겠습니다. O(n) time, O(k) space (k=유니크 문자 수).'", en: "'I'll count frequencies with a HashMap. O(n) time, O(k) space where k = unique chars.'" },
  },

  // ===== STACK / QUEUE =====
  {
    id: "sq1", type: "pattern", categoryId: "stack-queue", difficulty: 1,
    question: { ko: "괄호 문자열이 올바르게 닫혔는지 확인해야 합니다 (Valid Parentheses).", en: "Check if a parentheses string is valid (Valid Parentheses)." },
    options: ["Counter", "Stack", "Queue", "Recursion"], answer: 1,
    explanation: { ko: "열린 괄호를 Stack에 push, 닫힌 괄호 만나면 pop해서 매칭. O(n).", en: "Push open brackets onto stack. On close bracket, pop and check match. O(n)." },
    speakingTip: { ko: "'스택에 여는 괄호를 넣고, 닫는 괄호가 나오면 pop해서 짝이 맞는지 확인하겠습니다.'", en: "'I'll push opening brackets and pop on closing brackets to verify matching.'" },
  },
  {
    id: "sq2", type: "pattern", categoryId: "stack-queue", difficulty: 2,
    question: { ko: "각 원소에 대해 오른쪽에서 처음으로 큰 값을 찾아야 합니다 (Next Greater Element).", en: "For each element, find the first greater element to its right (Next Greater Element)." },
    options: ["Brute Force O(n²)", "Monotone Stack", "Priority Queue", "Binary Search"], answer: 1,
    explanation: { ko: "단조 감소 스택: 현재 값이 스택 top보다 크면 pop하며 답 기록. O(n).", en: "Monotone decreasing stack: when current > top, pop and record answer. O(n)." },
    speakingTip: { ko: "'Monotone Stack으로 O(n)에 풀겠습니다. 스택에는 아직 답을 못 찾은 인덱스를 유지합니다.'", en: "'I'll use a Monotone Stack at O(n), keeping indices of unresolved elements.'" },
  },
  {
    id: "sq3", type: "fillblank", categoryId: "stack-queue", difficulty: 1,
    question: { ko: "Valid Parentheses — 빈칸을 채우세요", en: "Valid Parentheses — fill in the blanks" },
    code: `function isValid(s):
    stack = []
    pairs = { ')':'(', ']':'[', '}':'{' }

    for char in s:
        if char in '([{':
            ???
        else:
            if stack is empty or ???:
                return false
            ???

    return ???`,
    blanks: [
      { placeholder: { ko: "??? (여는 괄호일 때)", en: "??? (opening bracket)" }, answer: "stack.push(char)", options: ["stack.push(char)", "stack.pop()", "return true", "continue"] },
      { placeholder: { ko: "??? (스택 top 비교)", en: "??? (compare stack top)" }, answer: "stack.top() != pairs[char]", options: ["stack.top() == char", "stack.top() != pairs[char]", "stack.top() == pairs[char]", "stack.size() > 0"] },
      { placeholder: { ko: "??? (매칭 성공 시)", en: "??? (on match)" }, answer: "stack.pop()", options: ["stack.push(char)", "stack.pop()", "return true", "continue"] },
      { placeholder: { ko: "??? (최종 반환)", en: "??? (final return)" }, answer: "stack is empty", options: ["true", "false", "stack is empty", "stack.size() == 1"] },
    ],
    explanation: { ko: "스택이 비어있으면 모든 괄호가 매칭된 것. 남아있으면 짝이 안 맞는 것.", en: "Empty stack means all brackets matched. Any remaining means unmatched." },
  },

  // ===== BFS / DFS =====
  {
    id: "bd1", type: "pattern", categoryId: "bfs-dfs", difficulty: 2,
    question: { ko: "2D 그리드에서 연결된 섬(island)의 개수를 세야 합니다.", en: "Count connected islands in a 2D grid." },
    options: ["Two Pointers", "Binary Search", "BFS/DFS", "Union-Find"], answer: 2,
    explanation: { ko: "그리드에서 연결 컴포넌트 = BFS/DFS. 방문 처리하면서 카운트.", en: "Connected components in a grid → BFS/DFS. Mark visited and count traversal starts." },
    speakingTip: { ko: "'그리드를 순회하면서 1을 만나면 BFS/DFS로 연결된 셀을 방문 처리하겠습니다.'", en: "'I'll iterate through the grid and BFS/DFS from each unvisited 1.'" },
  },
  {
    id: "bd2", type: "pattern", categoryId: "bfs-dfs", difficulty: 2,
    question: { ko: "미로에서 시작점에서 끝점까지의 최단 거리를 구해야 합니다.", en: "Find the shortest path from start to end in a maze." },
    options: ["DFS", "BFS", "Dynamic Programming", "Greedy"], answer: 1,
    explanation: { ko: "가중치 없는 그래프의 최단 거리 = BFS. 레벨 단위로 탐색하므로 처음 도달 시 최단.", en: "Shortest path in unweighted graph = BFS. Level-order ensures first arrival is shortest." },
    speakingTip: { ko: "'가중치가 없는 최단 경로이니 BFS를 쓰겠습니다. Queue에 시작점을 넣고 레벨 단위로 탐색.'", en: "'Unweighted shortest path → BFS. Enqueue start, explore level by level.'" },
  },

  // ===== TREE =====
  {
    id: "tr1", type: "pattern", categoryId: "tree", difficulty: 1,
    question: { ko: "이진 트리의 최대 깊이를 구해야 합니다.", en: "Find the maximum depth of a binary tree." },
    options: ["BFS (level count)", "DFS (recursive)", "Both work", "Neither"], answer: 2,
    explanation: { ko: "DFS: return 1 + max(left, right). BFS: 레벨 수 카운트. 둘 다 O(n).", en: "DFS: return 1 + max(left, right). BFS: count levels. Both O(n)." },
    speakingTip: { ko: "'재귀 DFS로 풀겠습니다. 각 노드에서 1 + max(왼쪽 깊이, 오른쪽 깊이)를 반환.'", en: "'I'll use recursive DFS. Each node returns 1 + max(left depth, right depth).'" },
  },
  {
    id: "tr2", type: "pattern", categoryId: "tree", difficulty: 2,
    question: { ko: "이진 탐색 트리(BST)에서 k번째로 작은 원소를 찾아야 합니다.", en: "Find the kth smallest element in a BST." },
    options: ["Level-order traversal", "Inorder traversal", "Preorder traversal", "Postorder traversal"], answer: 1,
    explanation: { ko: "BST의 inorder traversal은 오름차순 정렬. k번째 방문이 답. O(H+k).", en: "BST inorder gives sorted order. The kth visit is the answer. O(H+k)." },
    speakingTip: { ko: "'BST의 inorder는 정렬 순서입니다. inorder로 k번째 노드를 찾겠습니다.'", en: "'BST inorder is sorted order. I'll do inorder traversal and stop at the kth node.'" },
  },
  {
    id: "tr3", type: "pattern", categoryId: "tree", difficulty: 2,
    question: { ko: "이진 트리에서 두 노드의 최소 공통 조상(LCA)을 찾아야 합니다.", en: "Find the Lowest Common Ancestor (LCA) of two nodes in a binary tree." },
    options: ["BFS", "DFS (post-order recursive)", "Inorder traversal", "Level-order + Hash Map"], answer: 1,
    explanation: { ko: "Post-order DFS: 왼/오른쪽에서 p, q를 찾으면 현재 노드가 LCA. O(n).", en: "Post-order DFS: if left and right subtrees each contain one target, current node is LCA. O(n)." },
    speakingTip: { ko: "'재귀적으로 왼쪽/오른쪽 서브트리에서 p, q를 찾고, 양쪽에서 발견되면 현재 노드가 LCA.'", en: "'I'll recursively search both subtrees. If each side finds one target, the current node is the LCA.'" },
  },

  // ===== GRAPH =====
  {
    id: "gr1", type: "pattern", categoryId: "graph", difficulty: 2,
    question: { ko: "방향 그래프에서 사이클이 있는지 감지해야 합니다.", en: "Detect if a directed graph contains a cycle." },
    options: ["BFS only", "DFS with coloring (white/gray/black)", "Union-Find", "Topological Sort only"], answer: 1,
    explanation: { ko: "DFS에서 gray(방문 중) 노드를 다시 만나면 사이클. white→gray→black 3색 마킹.", en: "In DFS, encountering a gray (in-progress) node means a cycle. Use white→gray→black coloring." },
    speakingTip: { ko: "'DFS에서 3가지 상태를 쓰겠습니다. 방문 중인 노드를 다시 만나면 사이클입니다.'", en: "'I'll use DFS with 3 states. Revisiting an in-progress node indicates a cycle.'" },
  },
  {
    id: "gr2", type: "pattern", categoryId: "graph", difficulty: 2,
    question: { ko: "n개의 과목과 선수과목 관계가 있을 때, 수강 순서를 구해야 합니다 (Course Schedule).", en: "Given n courses and prerequisites, find a valid course order (Course Schedule)." },
    options: ["DFS", "BFS (Kahn's Algorithm)", "Both work", "Dijkstra"], answer: 2,
    explanation: { ko: "Topological Sort: BFS(Kahn's)로 indegree 0인 노드부터, 또는 DFS 후위순서 뒤집기.", en: "Topological Sort: BFS (Kahn's) starting from indegree-0 nodes, or reversed DFS post-order. Both work." },
    speakingTip: { ko: "'위상 정렬 문제입니다. Kahn's Algorithm으로 indegree가 0인 과목부터 큐에 넣겠습니다.'", en: "'This is topological sort. I'll use Kahn's Algorithm, enqueueing courses with indegree 0.'" },
  },

  // ===== DYNAMIC PROGRAMMING =====
  {
    id: "dp1", type: "pattern", categoryId: "dp", difficulty: 2,
    question: { ko: "계단을 1칸 또는 2칸씩 올라갈 수 있을 때, n번째 계단까지 올라가는 방법의 수는?", en: "You can climb 1 or 2 steps at a time. How many ways to reach step n?" },
    options: ["Greedy", "BFS", "Dynamic Programming", "Two Pointers"], answer: 2,
    explanation: { ko: "dp[i] = dp[i-1] + dp[i-2]. 피보나치와 동일한 점화식. O(n) time, O(1) space 가능.", en: "dp[i] = dp[i-1] + dp[i-2]. Same as Fibonacci. O(n) time, O(1) space possible." },
    speakingTip: { ko: "'각 계단에서의 경우의 수는 이전 두 계단의 합입니다. 피보나치와 같은 구조네요.'", en: "'Ways to reach step i = ways to i-1 + ways to i-2. It's a Fibonacci structure.'" },
  },
  {
    id: "dp2", type: "pattern", categoryId: "dp", difficulty: 2,
    question: { ko: "동전 종류가 주어졌을 때, 금액 amount를 만드는 최소 동전 수를 구해야 합니다.", en: "Given coin denominations, find the minimum coins to make amount." },
    options: ["Greedy", "Dynamic Programming (bottom-up)", "BFS", "Backtracking"], answer: 1,
    explanation: { ko: "dp[i] = min(dp[i-coin] + 1). Greedy는 반례 존재. DP가 정확.", en: "dp[i] = min(dp[i-coin] + 1). Greedy has counterexamples. DP is correct." },
    speakingTip: { ko: "'Greedy는 반례가 있어서 DP로 풀겠습니다. dp[i] = 금액 i를 만드는 최소 동전 수.'", en: "'Greedy has counterexamples here, so I'll use DP. dp[i] = min coins to make amount i.'" },
  },
  {
    id: "dp3", type: "pattern", categoryId: "dp", difficulty: 3,
    question: { ko: "가장 긴 증가하는 부분 수열(LIS)의 길이를 구해야 합니다.", en: "Find the length of the Longest Increasing Subsequence (LIS)." },
    options: ["Sliding Window", "DP O(n²)", "DP + Binary Search O(n log n)", "Both B and C work"], answer: 3,
    explanation: { ko: "기본 DP: dp[i] = i로 끝나는 LIS 길이, O(n²). 최적화: tails 배열 + Binary Search로 O(n log n).", en: "Basic DP: dp[i] = LIS ending at i, O(n²). Optimized: tails array + Binary Search for O(n log n)." },
    speakingTip: { ko: "'먼저 O(n²) DP로 설명하고, 최적화로 patience sorting + Binary Search를 언급하겠습니다.'", en: "'I'll start with O(n²) DP, then mention the O(n log n) optimization with patience sorting.'" },
  },
  {
    id: "dp4", type: "approach", categoryId: "dp", difficulty: 2,
    question: { ko: "DP 문제를 풀 때의 체계적인 접근 순서는?", en: "What is the systematic approach for solving DP problems?" },
    steps: {
      ko: ["상태(state) 정의: dp[i]가 뭘 의미하는지 명확히", "점화식(transition) 도출: dp[i]를 이전 상태로 표현", "기저 조건(base case) 설정", "계산 순서(방향) 결정: bottom-up or top-down", "공간 최적화 가능 여부 검토"],
      en: ["Define state: clarify what dp[i] represents", "Derive transition: express dp[i] in terms of previous states", "Set base cases", "Determine computation order: bottom-up or top-down", "Check if space optimization is possible"],
    },
    explanation: { ko: "DP는 '무엇을 기억할 것인가'가 핵심. 상태 정의가 잘 되면 나머지는 따라옴.", en: "DP is about 'what to memorize'. Good state definition makes the rest follow naturally." },
  },
  {
    id: "dp5", type: "fillblank", categoryId: "dp", difficulty: 2,
    question: { ko: "Climbing Stairs DP — 빈칸을 채우세요", en: "Climbing Stairs DP — fill in the blanks" },
    code: `function climbStairs(n):
    if n <= 2: return n

    prev2 = ???
    prev1 = ???

    for i from 3 to n:
        current = ???
        prev2 = prev1
        prev1 = current

    return ???`,
    blanks: [
      { placeholder: { ko: "??? (prev2 초기값)", en: "??? (init prev2)" }, answer: "1", options: ["0", "1", "2", "n"] },
      { placeholder: { ko: "??? (prev1 초기값)", en: "??? (init prev1)" }, answer: "2", options: ["0", "1", "2", "n"] },
      { placeholder: { ko: "??? (current 계산)", en: "??? (compute current)" }, answer: "prev1 + prev2", options: ["prev1 + prev2", "prev1 * prev2", "prev1 - prev2", "prev2 + 1"] },
      { placeholder: { ko: "??? (최종 반환)", en: "??? (final return)" }, answer: "prev1", options: ["prev1", "prev2", "current", "prev1 + prev2"] },
    ],
    explanation: { ko: "O(1) 공간으로 최적화. 직전 두 값만 유지하면 됨.", en: "Optimized to O(1) space by keeping only the previous two values." },
  },

  // ===== GREEDY =====
  {
    id: "gd1", type: "pattern", categoryId: "greedy", difficulty: 2,
    question: { ko: "구간들이 주어졌을 때, 겹치지 않는 최대 구간 수를 구해야 합니다.", en: "Given intervals, find the maximum number of non-overlapping intervals." },
    options: ["Dynamic Programming", "Greedy (sort by end time)", "BFS", "Backtracking"], answer: 1,
    explanation: { ko: "끝나는 시간 기준 정렬 → 가장 일찍 끝나는 것부터 선택.", en: "Sort by end time → always pick the earliest-ending interval." },
    speakingTip: { ko: "'끝나는 시간 기준으로 정렬한 뒤, 겹치지 않는 것을 그리디하게 선택하겠습니다.'", en: "'I'll sort by end time and greedily select non-overlapping intervals.'" },
  },
  {
    id: "gd2", type: "pattern", categoryId: "greedy", difficulty: 2,
    question: { ko: "주식 가격 배열이 주어졌을 때, 여러 번 사고팔아서 최대 이익을 구해야 합니다.", en: "Given stock prices, maximize profit with unlimited buy/sell transactions." },
    options: ["DP", "Greedy (buy low, sell high every upswing)", "Divide & Conquer", "Sliding Window"], answer: 1,
    explanation: { ko: "오르는 구간마다 이익을 챙기면 됨. O(n).", en: "Capture every upswing: if prices[i] > prices[i-1], add the difference. O(n)." },
    speakingTip: { ko: "'매일 오르는 날의 차익을 합산하면 최대 이익입니다. Greedy O(n).'", en: "'Sum up every daily gain — that's the max profit. Greedy O(n).'" },
  },
  {
    id: "gd3", type: "pattern", categoryId: "greedy", difficulty: 1,
    question: { ko: "배열에서 점프로 마지막 인덱스에 도달할 수 있는지 판별해야 합니다.", en: "Determine if you can reach the last index by jumping (Jump Game)." },
    options: ["BFS", "Greedy (track farthest reachable)", "DP", "Binary Search"], answer: 1,
    explanation: { ko: "현재까지 도달 가능한 최대 인덱스를 추적. farthest >= 마지막 인덱스면 true.", en: "Track the farthest reachable index. If farthest >= last index, return true." },
    speakingTip: { ko: "'Greedy로 도달 가능한 최대 위치를 추적하겠습니다. O(n).'", en: "'I'll greedily track the farthest reachable position. O(n).'" },
  },

  // ===== HEAP =====
  {
    id: "hp1", type: "pattern", categoryId: "heap", difficulty: 2,
    question: { ko: "데이터 스트림에서 K번째로 큰 원소를 실시간으로 구해야 합니다.", en: "Find the Kth largest element in a data stream in real-time." },
    options: ["Sort every time", "Min-Heap of size K", "Max-Heap", "Binary Search"], answer: 1,
    explanation: { ko: "크기 K의 Min-Heap 유지. top이 항상 K번째 큰 값.", en: "Maintain a Min-Heap of size K. Top is always the Kth largest." },
    speakingTip: { ko: "'크기 K의 Min-Heap을 유지하겠습니다. 삽입 O(log K), 조회 O(1).'", en: "'I'll maintain a Min-Heap of size K. Insert O(log K), query O(1).'" },
  },
  {
    id: "hp2", type: "pattern", categoryId: "heap", difficulty: 2,
    question: { ko: "K개의 정렬된 리스트를 하나로 병합해야 합니다.", en: "Merge K sorted lists into one sorted list." },
    options: ["Merge one by one", "Min-Heap with K pointers", "Divide & Conquer merge", "Both B and C"], answer: 3,
    explanation: { ko: "Min-Heap 또는 D&C 쌍 병합. 둘 다 O(N log K).", en: "Min-Heap or D&C pairwise merge. Both O(N log K)." },
    speakingTip: { ko: "'Min-Heap에 각 리스트의 head를 넣고 최소값을 추출하겠습니다. O(N log K).'", en: "'I'll push each list's head into a Min-Heap and extract min. O(N log K).'" },
  },

  // ===== SORTING / COMPLEXITY =====
  { id: "cx1", type: "complexity", categoryId: "sorting", difficulty: 1, question: { ko: "정렬된 배열에서 Binary Search의 시간복잡도는?", en: "Time complexity of Binary Search on a sorted array?" }, options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 1, explanation: { ko: "매번 절반으로 줄어드므로 O(log n).", en: "Range halves each step → O(log n)." } },
  { id: "cx2", type: "complexity", categoryId: "sorting", difficulty: 1, question: { ko: "HashMap의 평균 lookup 시간복잡도는?", en: "Average lookup time complexity of HashMap?" }, options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0, explanation: { ko: "해시 함수로 바로 접근 → 평균 O(1). 최악 O(n).", en: "Direct hash access → average O(1). Worst case O(n)." } },
  { id: "cx3", type: "complexity", categoryId: "sorting", difficulty: 2, question: { ko: "Merge Sort의 시간복잡도와 공간복잡도는?", en: "Time and space complexity of Merge Sort?" }, options: ["O(n log n) / O(1)", "O(n log n) / O(n)", "O(n²) / O(1)", "O(n²) / O(n)"], answer: 1, explanation: { ko: "항상 O(n log n), 병합에 추가 배열 필요 → O(n).", en: "Always O(n log n) but merge needs extra array → O(n) space." } },
  { id: "cx4", type: "complexity", categoryId: "sorting", difficulty: 2, question: { ko: "BFS 그래프 탐색 시간복잡도?", en: "BFS graph traversal time complexity?" }, options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"], answer: 2, explanation: { ko: "모든 정점 방문(V) + 각 간선 확인(E) → O(V + E).", en: "Visit each vertex (V) + check each edge (E) → O(V + E)." } },
  { id: "cx5", type: "complexity", categoryId: "sorting", difficulty: 2, question: { ko: "Heap에서 삽입과 삭제의 시간복잡도는?", en: "Time complexity of insert and delete in a Heap?" }, options: ["O(1) / O(1)", "O(log n) / O(log n)", "O(n) / O(n)", "O(1) / O(log n)"], answer: 1, explanation: { ko: "삽입: sift-up O(log n). 삭제: sift-down O(log n).", en: "Insert: sift-up O(log n). Delete: sift-down O(log n)." } },

  // ===== COMMUNICATION =====
  {
    id: "cm1", type: "speaking", categoryId: "communication", difficulty: 1,
    question: { ko: "면접관이 'Valid Parentheses' 문제를 줬습니다. 첫 마디로 뭐라고 할까요?", en: "The interviewer gave you 'Valid Parentheses'. What do you say first?" },
    goodAnswer: { ko: "문제를 확인하면 — 괄호 문자열이 주어졌을 때 올바르게 닫혔는지 확인하는 문제네요. 맞나요?", en: "Let me make sure I understand — I need to check if brackets are properly closed in correct order. Is that right?" },
    badAnswers: { ko: ["스택 쓰면 되죠?", "쉬운 문제네요.", "이거 예전에 풀어봤어요."], en: ["Just use a stack, right?", "This is easy.", "I've seen this before."] },
    explanation: { ko: "바로 풀이에 들어가지 말고, 문제를 자기 말로 정리해서 이해도를 보여주세요.", en: "Don't jump to the solution. Restate the problem to show understanding." },
  },
  {
    id: "cm2", type: "speaking", categoryId: "communication", difficulty: 2,
    question: { ko: "Brute force O(n²)를 설명한 후, 최적화 방향을 어떻게 전환할까요?", en: "After explaining brute force O(n²), how do you transition to optimization?" },
    goodAnswer: { ko: "Brute force는 O(n²)입니다. 이걸 개선하려면 — 이미 본 값을 기억해두면 O(n)이 가능합니다. 이 방향으로 진행해볼까요?", en: "Brute force is O(n²). To optimize — if we remember seen values, we can reach O(n). Should I go this direction?" },
    badAnswers: { ko: ["O(n²)은 느리니까 HashMap 쓸게요.", "더 나은 방법이 있긴 한데... 음..."], en: ["O(n²) is slow so I'll use HashMap.", "There's a better method but... um..."] },
    explanation: { ko: "왜 최적화 → 어떤 인사이트 → 어떤 방법 → 면접관 동의 구하기.", en: "Why optimize → What insight → Which technique → Ask interviewer's agreement." },
  },
  {
    id: "cm3", type: "speaking", categoryId: "communication", difficulty: 1,
    question: { ko: "코드를 다 작성한 후, 마무리로 뭐라고 해야 할까요?", en: "After finishing your code, what should you say to wrap up?" },
    goodAnswer: { ko: "코드 작성을 마쳤습니다. 제가 테스트 케이스로 검증해보겠습니다. 일반 케이스와 엣지 케이스도 확인해보겠습니다.", en: "I'm done coding. Let me verify with test cases — a normal case and edge cases like empty array and single element." },
    badAnswers: { ko: ["끝났습니다.", "맞는 것 같은데요.", "다른 문제 있나요?"], en: ["I'm done.", "I think it's correct.", "Any other questions?"] },
    explanation: { ko: "코드 작성 후 반드시 테스트! 일반 + 엣지 케이스를 직접 walkthrough하세요.", en: "Always test after coding! Walk through normal + edge cases yourself." },
  },
  {
    id: "ps1", type: "approach", categoryId: "communication", difficulty: 1,
    question: { ko: "라이브 코딩에서 문제를 받았을 때 올바른 접근 순서는?", en: "Correct approach order when receiving a problem in a live coding interview?" },
    steps: {
      ko: ["문제를 다시 말로 정리하고 제약조건 확인", "예제 입출력으로 이해도 검증", "brute force 접근법 먼저 설명", "최적화 방법 제시 및 시간/공간 복잡도 분석", "수도코드로 큰 흐름 설명", "코드 작성하며 각 줄 의도 설명", "테스트 케이스로 검증 (edge case 포함)"],
      en: ["Restate problem, clarify constraints", "Walk through examples to confirm understanding", "Explain brute force first", "Propose optimized approach with complexity", "Outline pseudocode", "Write code explaining intent", "Verify with test cases including edge cases"],
    },
    explanation: { ko: "바로 코드부터 쓰지 말고, 이해→분석→설계→구현→검증 순서로.", en: "Don't jump to code. Follow: Understand → Analyze → Design → Implement → Verify." },
  },
];
