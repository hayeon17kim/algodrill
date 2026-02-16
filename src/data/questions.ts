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
  /** Optional per-option reasons explaining why each option is correct/incorrect */
  optionReasons?: Bilingual[];
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
    optionReasons: [
      { ko: "정렬된 배열의 양쪽 끝에서 합을 비교하며 좁혀감. O(n).", en: "Compare sums from both ends of sorted array. O(n)." },
      { ko: "연속 부분배열이 아닌 두 원소의 합이므로 윈도우가 적합하지 않음.", en: "Not a contiguous subarray problem — window doesn't apply." },
      { ko: "가능하지만 O(n log n). Two Pointers가 더 효율적.", en: "Possible but O(n log n). Two Pointers is more efficient." },
      { ko: "비정렬에서 유효. 정렬된 배열에선 추가 공간 없이 Two Pointers가 최적.", en: "Works for unsorted. For sorted arrays, Two Pointers needs no extra space." },
    ],
  },
  {
    id: "tp2", type: "pattern", categoryId: "two-pointers", difficulty: 2,
    question: { ko: "정렬된 배열에서 중복을 제거하고 고유 원소 수를 반환해야 합니다 (in-place).", en: "Remove duplicates from a sorted array in-place and return the count of unique elements." },
    options: ["Hash Set", "Two Pointers (slow/fast)", "Binary Search", "Stack"], answer: 1,
    explanation: { ko: "slow 포인터는 고유 원소의 마지막 위치, fast는 탐색용. 고유 원소를 만나면 slow++하고 복사.", en: "Slow pointer marks the end of unique elements. Fast scans forward. When a new unique is found, increment slow and copy." },
    speakingTip: { ko: "'정렬되어 있으니 연속 중복만 체크하면 됩니다. slow/fast 포인터로 O(n) in-place.'", en: "'Since it's sorted, only consecutive duplicates matter. I'll use slow/fast pointers for O(n) in-place.'" },
    optionReasons: [
      { ko: "O(n) space 필요. in-place 조건을 만족하지 않음.", en: "Requires O(n) space. Doesn't meet in-place requirement." },
      { ko: "slow는 결과 위치, fast는 탐색. in-place O(n) 최적.", en: "Slow marks result position, fast scans. Optimal in-place O(n)." },
      { ko: "중복 제거와 관련 없음. 검색 알고리즘.", en: "Not related to deduplication. It's a search algorithm." },
      { ko: "LIFO 구조가 이 문제에 적합하지 않음.", en: "LIFO structure doesn't fit this problem." },
    ],
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
    optionReasons: [
      { ko: "그래프 탐색 알고리즘. 배열의 연속 부분합과 관련 없음.", en: "Graph traversal algorithm. Not related to contiguous subarray sums." },
      { ko: "고정 크기 k의 연속 부분배열 → 윈도우를 한 칸씩 밀며 합 갱신. O(n).", en: "Fixed size k contiguous subarray → slide window one step at a time. O(n)." },
      { ko: "가능하지만 과잉 설계. 단순 합 문제에 DP는 불필요.", en: "Possible but overkill. DP isn't needed for a simple sum problem." },
      { ko: "탐욕법으로는 최적 부분배열을 보장할 수 없음.", en: "Greedy can't guarantee finding the optimal subarray." },
    ],
  },
  {
    id: "sw2", type: "pattern", categoryId: "sliding-window", difficulty: 2,
    question: { ko: "모든 문자가 서로 다른 가장 긴 부분 문자열의 길이를 구해야 합니다.", en: "Find the length of the longest substring without repeating characters." },
    options: ["Brute Force O(n³)", "Sliding Window + Hash Set", "Dynamic Programming", "Divide & Conquer"], answer: 1,
    explanation: { ko: "가변 크기 윈도우 + Set으로 중복 체크. 중복 발견 시 left를 이동. O(n).", en: "Variable-size sliding window with a HashSet. When a duplicate is found, shrink from the left. O(n)." },
    speakingTip: { ko: "'가변 크기 Sliding Window에 HashSet으로 중복 체크하겠습니다. O(n).'", en: "'I'll use a variable-size Sliding Window with a HashSet for O(n).'" },
    optionReasons: [
      { ko: "동작하지만 매우 비효율적. O(n³)은 면접에서 부적절.", en: "Works but extremely inefficient. O(n³) is unacceptable in interviews." },
      { ko: "가변 윈도우로 중복 없는 구간을 추적. O(n) 최적.", en: "Variable window tracks non-repeating range. Optimal O(n)." },
      { ko: "가능하지만 Sliding Window보다 복잡. 이 문제에선 과잉.", en: "Possible but more complex than Sliding Window. Overkill here." },
      { ko: "문자열을 분할해도 경계의 부분문자열을 놓칠 수 있음.", en: "Splitting the string can miss substrings that cross boundaries." },
    ],
  },

  // ===== BINARY SEARCH =====
  {
    id: "bs1", type: "pattern", categoryId: "binary-search", difficulty: 2,
    question: { ko: "정렬된 배열에서 target 이상인 첫 번째 위치를 찾아야 합니다.", en: "Find the first position ≥ target in a sorted array." },
    options: ["Linear Scan", "Binary Search", "Two Pointers", "Hash Map"], answer: 1,
    explanation: { ko: "정렬된 배열에서 조건의 첫 위치 → Binary Search lower_bound. O(log n).", en: "First position satisfying a condition in sorted array → Binary Search lower_bound. O(log n)." },
    speakingTip: { ko: "'정렬되어 있으니 Binary Search를 쓰겠습니다.'", en: "'Since it's sorted, I'll use Binary Search.'" },
    optionReasons: [
      { ko: "O(n). 동작하지만 정렬된 배열의 이점을 활용하지 않음.", en: "O(n). Works but doesn't leverage the sorted property." },
      { ko: "정렬 + 조건 기반 첫 위치 탐색 = lower_bound. O(log n).", en: "Sorted + condition-based first position = lower_bound. O(log n)." },
      { ko: "양끝 포인터는 합/쌍 문제에 적합. 단일 위치 탐색엔 비효율.", en: "Two pointers suit pair/sum problems. Inefficient for single position lookup." },
      { ko: "위치가 아닌 값의 존재 여부에 적합. 인덱스 반환 불가.", en: "Suited for value existence, not position finding." },
    ],
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
    optionReasons: [
      { ko: "O(n log n). 정렬하면 원래 인덱스를 잃음.", en: "O(n log n). Sorting loses original indices." },
      { ko: "O(n²). 동작하지만 면접에서 기대하는 최적 해법이 아님.", en: "O(n²). Works but not the optimal solution expected in interviews." },
      { ko: "target - num 보수를 저장. O(n) time, O(n) space.", en: "Store complement (target - num). O(n) time, O(n) space." },
      { ko: "비정렬 배열에서는 사용 불가.", en: "Cannot be used on unsorted arrays." },
    ],
  },
  {
    id: "hm2", type: "pattern", categoryId: "hash-map", difficulty: 2,
    question: { ko: "문자열에서 가장 많이 등장하는 문자를 찾아야 합니다.", en: "Find the most frequent character in a string." },
    options: ["Sorting", "Hash Map (frequency count)", "Two Pointers", "Stack"], answer: 1,
    explanation: { ko: "Hash Map으로 각 문자의 빈도를 세고, 최대값을 찾으면 O(n).", en: "Use Hash Map to count character frequencies, then find the max. O(n)." },
    speakingTip: { ko: "'HashMap으로 빈도수를 세겠습니다. O(n) time, O(k) space (k=유니크 문자 수).'", en: "'I'll count frequencies with a HashMap. O(n) time, O(k) space where k = unique chars.'" },
    optionReasons: [
      { ko: "O(n log n). 정렬 후 연속 카운트는 가능하지만 비효율적.", en: "O(n log n). Sort then count consecutive — works but inefficient." },
      { ko: "한 번 순회로 빈도 집계. O(n) time, O(k) space.", en: "Single pass frequency count. O(n) time, O(k) space." },
      { ko: "빈도 카운팅 문제에 포인터 이동은 적합하지 않음.", en: "Pointer movement doesn't suit frequency counting problems." },
      { ko: "LIFO 구조. 빈도 집계와 무관.", en: "LIFO structure. Unrelated to frequency counting." },
    ],
  },

  // ===== STACK / QUEUE =====
  {
    id: "sq1", type: "pattern", categoryId: "stack-queue", difficulty: 1,
    question: { ko: "괄호 문자열이 올바르게 닫혔는지 확인해야 합니다 (Valid Parentheses).", en: "Check if a parentheses string is valid (Valid Parentheses)." },
    options: ["Counter", "Stack", "Queue", "Recursion"], answer: 1,
    explanation: { ko: "열린 괄호를 Stack에 push, 닫힌 괄호 만나면 pop해서 매칭. O(n).", en: "Push open brackets onto stack. On close bracket, pop and check match. O(n)." },
    optionReasons: [
      { ko: "() 한 종류만 처리 가능. {}[]()가 섞이면 매칭 불가.", en: "Only handles one bracket type. Can't match mixed {}[]()." },
      { ko: "LIFO로 가장 최근 열린 괄호와 매칭. 모든 괄호 유형 처리.", en: "LIFO matches most recent open bracket. Handles all bracket types." },
      { ko: "FIFO 순서는 괄호 매칭에 부적합. 가장 최근 것과 매칭해야 함.", en: "FIFO order doesn't suit bracket matching. Need to match most recent." },
      { ko: "가능하지만 Stack이 더 직관적이고 효율적.", en: "Possible but Stack is more intuitive and efficient." },
    ],
    speakingTip: { ko: "'스택에 여는 괄호를 넣고, 닫는 괄호가 나오면 pop해서 짝이 맞는지 확인하겠습니다.'", en: "'I'll push opening brackets and pop on closing brackets to verify matching.'" },
  },
  {
    id: "sq2", type: "pattern", categoryId: "stack-queue", difficulty: 2,
    question: { ko: "각 원소에 대해 오른쪽에서 처음으로 큰 값을 찾아야 합니다 (Next Greater Element).", en: "For each element, find the first greater element to its right (Next Greater Element)." },
    options: ["Brute Force O(n²)", "Monotone Stack", "Priority Queue", "Binary Search"], answer: 1,
    explanation: { ko: "단조 감소 스택: 현재 값이 스택 top보다 크면 pop하며 답 기록. O(n).", en: "Monotone decreasing stack: when current > top, pop and record answer. O(n)." },
    optionReasons: [
      { ko: "O(n²)으로 가능하지만 비효율적", en: "Works at O(n²) but inefficient" },
      { ko: "단조 감소 스택으로 O(n)에 해결 — 최적", en: "Monotone decreasing stack solves in O(n) — optimal" },
      { ko: "우선순위와 무관한 순서 기반 문제", en: "Priority is irrelevant; this is order-based" },
      { ko: "정렬된 데이터가 아니므로 부적합", en: "Not applicable — data isn't sorted" },
    ],
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
    optionReasons: [
      { ko: "연결 요소 탐색과 무관", en: "Unrelated to connected component traversal" },
      { ko: "연결 요소 탐색과 무관", en: "Unrelated to connected component traversal" },
      { ko: "그리드의 연결된 셀을 탐색하는 최적 방법", en: "Optimal way to traverse connected cells in grid" },
      { ko: "가능하지만 BFS/DFS가 더 직관적", en: "Possible but BFS/DFS is more intuitive" },
    ],
    speakingTip: { ko: "'그리드를 순회하면서 1을 만나면 BFS/DFS로 연결된 셀을 방문 처리하겠습니다.'", en: "'I'll iterate through the grid and BFS/DFS from each unvisited 1.'" },
  },
  {
    id: "bd2", type: "pattern", categoryId: "bfs-dfs", difficulty: 2,
    question: { ko: "미로에서 시작점에서 끝점까지의 최단 거리를 구해야 합니다.", en: "Find the shortest path from start to end in a maze." },
    options: ["DFS", "BFS", "Dynamic Programming", "Greedy"], answer: 1,
    explanation: { ko: "가중치 없는 그래프의 최단 거리 = BFS. 레벨 단위로 탐색하므로 처음 도달 시 최단.", en: "Shortest path in unweighted graph = BFS. Level-order ensures first arrival is shortest." },
    optionReasons: [
      { ko: "최단 거리를 보장하지 않음", en: "Doesn't guarantee shortest path" },
      { ko: "가중치 없는 그래프의 최단 거리 = BFS", en: "Shortest path in unweighted graph = BFS" },
      { ko: "가중치 없는 단순 최단 거리에는 과도", en: "Overkill for simple unweighted shortest path" },
      { ko: "최단 경로 보장 안 됨", en: "Doesn't guarantee shortest path" },
    ],
    speakingTip: { ko: "'가중치가 없는 최단 경로이니 BFS를 쓰겠습니다. Queue에 시작점을 넣고 레벨 단위로 탐색.'", en: "'Unweighted shortest path → BFS. Enqueue start, explore level by level.'" },
  },

  // ===== TREE =====
  {
    id: "tr1", type: "pattern", categoryId: "tree", difficulty: 1,
    question: { ko: "이진 트리의 최대 깊이를 구해야 합니다.", en: "Find the maximum depth of a binary tree." },
    options: ["BFS (level count)", "DFS (recursive)", "Both work", "Neither"], answer: 2,
    explanation: { ko: "DFS: return 1 + max(left, right). BFS: 레벨 수 카운트. 둘 다 O(n).", en: "DFS: return 1 + max(left, right). BFS: count levels. Both O(n)." },
    optionReasons: [
      { ko: "레벨 수를 세면 되지만 단독 답은 아님", en: "Count levels works, but not the only answer" },
      { ko: "재귀로 가능하지만 단독 답은 아님", en: "Recursive works, but not the only answer" },
      { ko: "BFS(레벨 카운트)와 DFS(재귀) 모두 O(n)으로 가능", en: "Both BFS (level count) and DFS (recursive) work at O(n)" },
      { ko: "둘 다 가능하므로 틀림", en: "Both work, so this is incorrect" },
    ],
    speakingTip: { ko: "'재귀 DFS로 풀겠습니다. 각 노드에서 1 + max(왼쪽 깊이, 오른쪽 깊이)를 반환.'", en: "'I'll use recursive DFS. Each node returns 1 + max(left depth, right depth).'" },
  },
  {
    id: "tr2", type: "pattern", categoryId: "tree", difficulty: 2,
    question: { ko: "이진 탐색 트리(BST)에서 k번째로 작은 원소를 찾아야 합니다.", en: "Find the kth smallest element in a BST." },
    options: ["Level-order traversal", "Inorder traversal", "Preorder traversal", "Postorder traversal"], answer: 1,
    explanation: { ko: "BST의 inorder traversal은 오름차순 정렬. k번째 방문이 답. O(H+k).", en: "BST inorder gives sorted order. The kth visit is the answer. O(H+k)." },
    optionReasons: [
      { ko: "정렬 순서를 보장하지 않음", en: "Doesn't guarantee sorted order" },
      { ko: "BST의 inorder는 오름차순 — k번째가 답", en: "BST inorder gives ascending order — kth visit is answer" },
      { ko: "루트→왼→오 순서로 정렬 아님", en: "Root→left→right order, not sorted" },
      { ko: "왼→오→루트 순서로 정렬 아님", en: "Left→right→root order, not sorted" },
    ],
    speakingTip: { ko: "'BST의 inorder는 정렬 순서입니다. inorder로 k번째 노드를 찾겠습니다.'", en: "'BST inorder is sorted order. I'll do inorder traversal and stop at the kth node.'" },
  },
  {
    id: "tr3", type: "pattern", categoryId: "tree", difficulty: 2,
    question: { ko: "이진 트리에서 두 노드의 최소 공통 조상(LCA)을 찾아야 합니다.", en: "Find the Lowest Common Ancestor (LCA) of two nodes in a binary tree." },
    options: ["BFS", "DFS (post-order recursive)", "Inorder traversal", "Level-order + Hash Map"], answer: 1,
    explanation: { ko: "Post-order DFS: 왼/오른쪽에서 p, q를 찾으면 현재 노드가 LCA. O(n).", en: "Post-order DFS: if left and right subtrees each contain one target, current node is LCA. O(n)." },
    optionReasons: [
      { ko: "레벨 단위 탐색은 LCA 찾기에 비효율적", en: "Level-order is inefficient for finding LCA" },
      { ko: "Post-order로 양쪽 서브트리에서 타겟 찾으면 현재가 LCA", en: "Post-order: if both subtrees find targets, current is LCA" },
      { ko: "정렬 순서 탐색으로 LCA 못 찾음", en: "Sorted traversal doesn't help find LCA" },
      { ko: "가능하지만 DFS가 더 간결", en: "Possible but DFS is more concise" },
    ],
    speakingTip: { ko: "'재귀적으로 왼쪽/오른쪽 서브트리에서 p, q를 찾고, 양쪽에서 발견되면 현재 노드가 LCA.'", en: "'I'll recursively search both subtrees. If each side finds one target, the current node is the LCA.'" },
  },

  // ===== GRAPH =====
  {
    id: "gr1", type: "pattern", categoryId: "graph", difficulty: 2,
    question: { ko: "방향 그래프에서 사이클이 있는지 감지해야 합니다.", en: "Detect if a directed graph contains a cycle." },
    options: ["BFS only", "DFS with coloring (white/gray/black)", "Union-Find", "Topological Sort only"], answer: 1,
    explanation: { ko: "DFS에서 gray(방문 중) 노드를 다시 만나면 사이클. white→gray→black 3색 마킹.", en: "In DFS, encountering a gray (in-progress) node means a cycle. Use white→gray→black coloring." },
    optionReasons: [
      { ko: "사이클 탐지에 충분하지 않음", en: "Not sufficient for cycle detection alone" },
      { ko: "white→gray→black 3색으로 방문 중 노드 재방문 = 사이클", en: "3-color (white→gray→black): revisiting gray node = cycle" },
      { ko: "무방향 그래프용, 방향 그래프에는 부적합", en: "For undirected graphs, not ideal for directed" },
      { ko: "단독으로는 사이클 감지 불완전", en: "Topological sort alone is incomplete for detection" },
    ],
    speakingTip: { ko: "'DFS에서 3가지 상태를 쓰겠습니다. 방문 중인 노드를 다시 만나면 사이클입니다.'", en: "'I'll use DFS with 3 states. Revisiting an in-progress node indicates a cycle.'" },
  },
  {
    id: "gr2", type: "pattern", categoryId: "graph", difficulty: 2,
    question: { ko: "n개의 과목과 선수과목 관계가 있을 때, 수강 순서를 구해야 합니다 (Course Schedule).", en: "Given n courses and prerequisites, find a valid course order (Course Schedule)." },
    options: ["DFS", "BFS (Kahn's Algorithm)", "Both work", "Dijkstra"], answer: 2,
    explanation: { ko: "Topological Sort: BFS(Kahn's)로 indegree 0인 노드부터, 또는 DFS 후위순서 뒤집기.", en: "Topological Sort: BFS (Kahn's) starting from indegree-0 nodes, or reversed DFS post-order. Both work." },
    optionReasons: [
      { ko: "역순으로 가능하지만 단독 답은 아님", en: "Reversed post-order works but not the only answer" },
      { ko: "Kahn's Algorithm으로 가능하지만 단독 답은 아님", en: "Kahn's works but not the only answer" },
      { ko: "DFS(역순)와 BFS(Kahn's) 모두 위상 정렬 가능", en: "Both DFS (reversed) and BFS (Kahn's) do topological sort" },
      { ko: "가중치 최단 경로용, 위상 정렬 아님", en: "For weighted shortest paths, not topological sort" },
    ],
    speakingTip: { ko: "'위상 정렬 문제입니다. Kahn's Algorithm으로 indegree가 0인 과목부터 큐에 넣겠습니다.'", en: "'This is topological sort. I'll use Kahn's Algorithm, enqueueing courses with indegree 0.'" },
  },

  // ===== DYNAMIC PROGRAMMING =====
  {
    id: "dp1", type: "pattern", categoryId: "dp", difficulty: 2,
    question: { ko: "계단을 1칸 또는 2칸씩 올라갈 수 있을 때, n번째 계단까지 올라가는 방법의 수는?", en: "You can climb 1 or 2 steps at a time. How many ways to reach step n?" },
    options: ["Greedy", "BFS", "Dynamic Programming", "Two Pointers"], answer: 2,
    explanation: { ko: "dp[i] = dp[i-1] + dp[i-2]. 피보나치와 동일한 점화식. O(n) time, O(1) space 가능.", en: "dp[i] = dp[i-1] + dp[i-2]. Same as Fibonacci. O(n) time, O(1) space possible." },
    optionReasons: [
      { ko: "최적 부분 구조 없이 탐욕적 선택 불가", en: "No greedy choice property for this problem" },
      { ko: "경우의 수 세기에는 부적합", en: "Not suitable for counting ways" },
      { ko: "dp[i] = dp[i-1] + dp[i-2], 피보나치와 동일", en: "dp[i] = dp[i-1] + dp[i-2], same as Fibonacci" },
      { ko: "단조성이 없어 적용 불가", en: "No monotonic property to exploit" },
    ],
    speakingTip: { ko: "'각 계단에서의 경우의 수는 이전 두 계단의 합입니다. 피보나치와 같은 구조네요.'", en: "'Ways to reach step i = ways to i-1 + ways to i-2. It's a Fibonacci structure.'" },
  },
  {
    id: "dp2", type: "pattern", categoryId: "dp", difficulty: 2,
    question: { ko: "동전 종류가 주어졌을 때, 금액 amount를 만드는 최소 동전 수를 구해야 합니다.", en: "Given coin denominations, find the minimum coins to make amount." },
    options: ["Greedy", "Dynamic Programming (bottom-up)", "BFS", "Backtracking"], answer: 1,
    explanation: { ko: "dp[i] = min(dp[i-coin] + 1). Greedy는 반례 존재. DP가 정확.", en: "dp[i] = min(dp[i-coin] + 1). Greedy has counterexamples. DP is correct." },
    optionReasons: [
      { ko: "반례 존재 (예: [1,3,4]로 6 만들기)", en: "Has counterexamples (e.g., coins [1,3,4] for amount 6)" },
      { ko: "dp[i] = min(dp[i-coin] + 1)로 정확한 최적해", en: "dp[i] = min(dp[i-coin] + 1) gives exact optimal" },
      { ko: "최단 경로로 모델링 가능하지만 DP가 표준", en: "Can model as shortest path but DP is standard" },
      { ko: "지수 시간이라 비실용적", en: "Exponential time, impractical" },
    ],
    speakingTip: { ko: "'Greedy는 반례가 있어서 DP로 풀겠습니다. dp[i] = 금액 i를 만드는 최소 동전 수.'", en: "'Greedy has counterexamples here, so I'll use DP. dp[i] = min coins to make amount i.'" },
  },
  {
    id: "dp3", type: "pattern", categoryId: "dp", difficulty: 3,
    question: { ko: "가장 긴 증가하는 부분 수열(LIS)의 길이를 구해야 합니다.", en: "Find the length of the Longest Increasing Subsequence (LIS)." },
    options: ["Sliding Window", "DP O(n²)", "DP + Binary Search O(n log n)", "Both B and C work"], answer: 3,
    explanation: { ko: "기본 DP: dp[i] = i로 끝나는 LIS 길이, O(n²). 최적화: tails 배열 + Binary Search로 O(n log n).", en: "Basic DP: dp[i] = LIS ending at i, O(n²). Optimized: tails array + Binary Search for O(n log n)." },
    optionReasons: [
      { ko: "연속 부분 배열 문제가 아님", en: "Not a contiguous subarray problem" },
      { ko: "O(n²) DP 가능하지만 단독 답은 아님", en: "O(n²) DP works but not the only answer" },
      { ko: "tails 배열 + Binary Search로 O(n log n) 최적화 가능", en: "Optimized to O(n log n) with tails + Binary Search" },
      { ko: "기본 DP와 최적화 모두 정답", en: "Both basic DP and optimized approach are correct" },
    ],
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
    optionReasons: [
      { ko: "DP로 가능하지만 Greedy가 더 효율적", en: "DP works but Greedy is more efficient" },
      { ko: "끝나는 시간 정렬 후 그리디 선택 — 최적", en: "Sort by end time, greedily select — optimal" },
      { ko: "구간 선택 문제와 무관", en: "Unrelated to interval selection" },
      { ko: "지수 시간이라 비실용적", en: "Exponential time, impractical" },
    ],
    speakingTip: { ko: "'끝나는 시간 기준으로 정렬한 뒤, 겹치지 않는 것을 그리디하게 선택하겠습니다.'", en: "'I'll sort by end time and greedily select non-overlapping intervals.'" },
  },
  {
    id: "gd2", type: "pattern", categoryId: "greedy", difficulty: 2,
    question: { ko: "주식 가격 배열이 주어졌을 때, 여러 번 사고팔아서 최대 이익을 구해야 합니다.", en: "Given stock prices, maximize profit with unlimited buy/sell transactions." },
    options: ["DP", "Greedy (buy low, sell high every upswing)", "Divide & Conquer", "Sliding Window"], answer: 1,
    explanation: { ko: "오르는 구간마다 이익을 챙기면 됨. O(n).", en: "Capture every upswing: if prices[i] > prices[i-1], add the difference. O(n)." },
    optionReasons: [
      { ko: "가능하지만 과도, Greedy가 O(n)으로 충분", en: "Possible but overkill; Greedy is O(n)" },
      { ko: "오르는 구간마다 차익을 합산 — O(n) 최적", en: "Sum every upswing difference — O(n) optimal" },
      { ko: "순차 탐색에 분할 정복은 불필요", en: "Divide & Conquer unnecessary for sequential scan" },
      { ko: "연속이 아닌 여러 거래라 윈도우 부적합", en: "Multiple transactions, not a window problem" },
    ],
    speakingTip: { ko: "'매일 오르는 날의 차익을 합산하면 최대 이익입니다. Greedy O(n).'", en: "'Sum up every daily gain — that's the max profit. Greedy O(n).'" },
  },
  {
    id: "gd3", type: "pattern", categoryId: "greedy", difficulty: 1,
    question: { ko: "배열에서 점프로 마지막 인덱스에 도달할 수 있는지 판별해야 합니다.", en: "Determine if you can reach the last index by jumping (Jump Game)." },
    options: ["BFS", "Greedy (track farthest reachable)", "DP", "Binary Search"], answer: 1,
    explanation: { ko: "현재까지 도달 가능한 최대 인덱스를 추적. farthest >= 마지막 인덱스면 true.", en: "Track the farthest reachable index. If farthest >= last index, return true." },
    optionReasons: [
      { ko: "레벨 탐색과 무관한 문제", en: "Level traversal unrelated to this problem" },
      { ko: "도달 가능한 최대 인덱스를 그리디하게 추적 — O(n)", en: "Greedily track farthest reachable index — O(n)" },
      { ko: "DP로 가능하지만 Greedy가 더 간결", en: "DP works but Greedy is simpler" },
      { ko: "정렬된 데이터가 아니므로 부적합", en: "Data isn't sorted, not applicable" },
    ],
    speakingTip: { ko: "'Greedy로 도달 가능한 최대 위치를 추적하겠습니다. O(n).'", en: "'I'll greedily track the farthest reachable position. O(n).'" },
  },

  // ===== HEAP =====
  {
    id: "hp1", type: "pattern", categoryId: "heap", difficulty: 2,
    question: { ko: "데이터 스트림에서 K번째로 큰 원소를 실시간으로 구해야 합니다.", en: "Find the Kth largest element in a data stream in real-time." },
    options: ["Sort every time", "Min-Heap of size K", "Max-Heap", "Binary Search"], answer: 1,
    explanation: { ko: "크기 K의 Min-Heap 유지. top이 항상 K번째 큰 값.", en: "Maintain a Min-Heap of size K. Top is always the Kth largest." },
    optionReasons: [
      { ko: "매번 정렬하면 O(n log n)으로 비효율적", en: "Sorting each time is O(n log n), inefficient" },
      { ko: "크기 K Min-Heap의 top이 항상 K번째 큰 값", en: "Top of size-K Min-Heap is always Kth largest" },
      { ko: "최대값만 추적, K번째는 못 찾음", en: "Only tracks max, can't find Kth" },
      { ko: "스트림 데이터에 정렬 기반 탐색 부적합", en: "Binary Search doesn't work on streaming data" },
    ],
    speakingTip: { ko: "'크기 K의 Min-Heap을 유지하겠습니다. 삽입 O(log K), 조회 O(1).'", en: "'I'll maintain a Min-Heap of size K. Insert O(log K), query O(1).'" },
  },
  {
    id: "hp2", type: "pattern", categoryId: "heap", difficulty: 2,
    question: { ko: "K개의 정렬된 리스트를 하나로 병합해야 합니다.", en: "Merge K sorted lists into one sorted list." },
    options: ["Merge one by one", "Min-Heap with K pointers", "Divide & Conquer merge", "Both B and C"], answer: 3,
    explanation: { ko: "Min-Heap 또는 D&C 쌍 병합. 둘 다 O(N log K).", en: "Min-Heap or D&C pairwise merge. Both O(N log K)." },
    optionReasons: [
      { ko: "O(N·K)로 비효율적", en: "O(N·K) is inefficient" },
      { ko: "K 포인터 + Min-Heap으로 O(N log K)", en: "K pointers + Min-Heap for O(N log K)" },
      { ko: "쌍으로 병합하며 O(N log K)", en: "Pairwise merge at O(N log K)" },
      { ko: "Min-Heap과 D&C 모두 O(N log K)로 동작", en: "Both Min-Heap and D&C work at O(N log K)" },
    ],
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
  {
    id: "cm4", type: "speaking", categoryId: "communication", difficulty: 2,
    question: { ko: "면접관이 '공간복잡도를 줄일 수 있을까요?'라고 물었습니다. 어떻게 답할까요?", en: "Interviewer asks 'Can you reduce space complexity?' How do you respond?" },
    goodAnswer: { ko: "좋은 질문입니다. 현재 O(n) 공간을 쓰는데, in-place로 하면 O(1)이 가능할 것 같습니다. 트레이드오프는 코드가 약간 복잡해지는 것인데, 진행해볼까요?", en: "Good question. Currently using O(n) space. If we do it in-place, we can get O(1). The tradeoff is slightly more complex code. Shall I proceed?" },
    badAnswers: { ko: ["잘 모르겠는데요.", "이게 최선인 것 같은데요.", "음... 생각해볼게요."], en: ["I'm not sure.", "This seems optimal.", "Um... let me think."] },
    explanation: { ko: "현재 복잡도 → 개선 가능성 → 트레이드오프 언급 → 면접관 의견 구하기.", en: "Current complexity → Improvement possibility → Mention tradeoff → Ask for direction." },
  },
  {
    id: "cm5", type: "speaking", categoryId: "communication", difficulty: 2,
    question: { ko: "코드 작성 중 막혔을 때 어떻게 해야 할까요?", en: "What should you do when stuck while coding?" },
    goodAnswer: { ko: "음, 이 부분에서 약간 막혔습니다. 제가 지금까지 생각한 접근은... (설명). 이 부분에서 엣지 케이스 처리가 애매한데, 힌트를 주실 수 있을까요?", en: "I'm a bit stuck here. My approach so far is... (explain). I'm uncertain about handling this edge case. Could you give me a hint?" },
    badAnswers: { ko: ["모르겠어요.", "(침묵)", "다른 방법으로 해볼게요."], en: ["I don't know.", "(silence)", "Let me try another way."] },
    explanation: { ko: "침묵하지 말고, 현재 생각을 설명하고 구체적으로 어디서 막혔는지 질문하세요.", en: "Don't go silent. Explain your thinking and ask specific questions about where you're stuck." },
  },
  {
    id: "cm6", type: "speaking", categoryId: "communication", difficulty: 1,
    question: { ko: "문제를 보고 전혀 모를 때 첫 마디는?", en: "When you see a problem you've never encountered, what do you say first?" },
    goodAnswer: { ko: "처음 보는 유형이네요. 먼저 작은 예제로 패턴을 찾아보겠습니다. (예제 그리며 설명)", en: "This is new to me. Let me work through a small example to find patterns. (Draw and explain)" },
    badAnswers: { ko: ["이거 못 풀 것 같은데요.", "힌트 주세요.", "패스해도 될까요?"], en: ["I don't think I can solve this.", "Can I get a hint?", "Can we skip this?"] },
    explanation: { ko: "모르는 문제도 생각하는 과정을 보여주는 것이 중요. 예제로 패턴 찾기.", en: "Show your thought process even when unsure. Work through examples to find patterns." },
  },
  {
    id: "cm7", type: "speaking", categoryId: "communication", difficulty: 2,
    question: { ko: "시간이 부족할 때 어떻게 말해야 할까요?", en: "What do you say when running out of time?" },
    goodAnswer: { ko: "시간이 얼마 안 남은 것 같습니다. 핵심 로직은 완성했고, 엣지 케이스 처리가 남았는데 — 핵심부터 설명드리고 나머지는 말로 설명드려도 될까요?", en: "I see we're running short on time. I've completed the core logic. For the remaining edge cases, can I explain them verbally?" },
    badAnswers: { ko: ["시간이 부족하네요.", "(서두르며 엉성하게 작성)", "거의 다 했어요."], en: ["We're out of time.", "(rush and write messy code)", "Almost done."] },
    explanation: { ko: "완성한 부분 명시 → 남은 부분 설명 → 우선순위 협의.", en: "State what's done → Explain what remains → Negotiate priorities." },
  },
  {
    id: "cm8", type: "speaking", categoryId: "communication", difficulty: 3,
    question: { ko: "면접관이 '더 나은 방법이 있을까요?'라고 계속 물을 때는?", en: "Interviewer keeps asking 'Is there a better approach?'" },
    goodAnswer: { ko: "현재 O(n log n)인데... (생각) 정렬을 피하려면 해시를 쓸 수 있을 것 같습니다. O(n)이 가능하지만 공간이 O(n) 필요합니다. 이 방향이 맞나요?", en: "Currently O(n log n)... (think) To avoid sorting, I could use a hash. That's O(n) time but requires O(n) space. Is this the direction you're thinking?" },
    badAnswers: { ko: ["모르겠는데요.", "이게 최적 아닌가요?", "더 빠른 건 불가능할 것 같은데요."], en: ["I don't know.", "Isn't this optimal?", "I don't think it can be faster."] },
    explanation: { ko: "현재 방법 복잡도 → 개선 가능한 부분 분석 → 트레이드오프 언급 → 방향 확인.", en: "Current complexity → Analyze improvement opportunity → Mention tradeoff → Confirm direction." },
  },
  {
    id: "cm9", type: "approach", categoryId: "communication", difficulty: 2,
    question: { ko: "복잡도 분석을 설명하는 올바른 순서는?", en: "Correct order for explaining complexity analysis?" },
    steps: {
      ko: ["시간복잡도부터 설명 (루프 구조 분석)", "공간복잡도 설명 (추가 자료구조)", "최선/평균/최악 케이스 구분 필요시 언급", "트레이드오프가 있다면 명시 (시간 vs 공간)"],
      en: ["Explain time complexity first (analyze loops)", "Explain space complexity (additional data structures)", "Mention best/average/worst case if relevant", "State tradeoffs if any (time vs space)"],
    },
    explanation: { ko: "Big-O 표기법으로 간결하게. '이 루프는 n번, 이 루프는 log n번이므로...'", en: "Use Big-O notation concisely. 'This loop runs n times, this one log n, so...'" },
  },
  {
    id: "cm10", type: "speaking", categoryId: "communication", difficulty: 2,
    question: { ko: "버그를 발견했을 때 어떻게 말해야 할까요?", en: "What do you say when you spot a bug in your code?" },
    goodAnswer: { ko: "아, 여기 버그가 있네요. 엣지 케이스에서 인덱스가 범위를 벗어날 수 있습니다. 이 조건을 추가하겠습니다.", en: "Oh, I see a bug here. For edge cases, the index could go out of bounds. Let me add this check." },
    badAnswers: { ko: ["(버그를 숨김)", "나중에 고치겠습니다.", "테스트하면 나올 거예요."], en: ["(hide the bug)", "I'll fix it later.", "Testing will catch it."] },
    explanation: { ko: "버그 발견은 좋은 신호. 즉시 인정하고 수정하는 것이 문제 해결 능력을 보여줌.", en: "Finding bugs is good. Acknowledge and fix immediately to show debugging skills." },
  },

  // ===== TWO POINTERS (추가 7개) =====
  {
    id: "tp4", type: "pattern", categoryId: "two-pointers", difficulty: 2,
    question: { ko: "정렬된 배열에서 세 수의 합이 0이 되는 모든 트리플릿을 찾아야 합니다 (3Sum).", en: "Find all triplets in a sorted array that sum to zero (3Sum)." },
    options: ["Brute Force O(n³)", "Two Pointers with outer loop", "Binary Search", "Hash Map"], answer: 1,
    explanation: { ko: "첫 번째 수를 고정하고 나머지 두 수를 Two Pointers로 찾기. O(n²).", en: "Fix first number, use Two Pointers for remaining two. O(n²)." },
    optionReasons: [
      { ko: "O(n³)으로 비효율적", en: "O(n³) is inefficient" },
      { ko: "첫 수 고정 + Two Pointers로 O(n²) 최적", en: "Fix first + Two Pointers for O(n²) optimal" },
      { ko: "단독으로 세 수 조합 찾기 어려움", en: "Hard to find triplets with Binary Search alone" },
      { ko: "중복 처리가 어렵고 O(n²) 공간 필요", en: "Hard to handle duplicates, needs O(n²) space" },
    ],
    speakingTip: { ko: "'첫 번째 수를 순회하며 고정하고, 나머지는 Two Pointers로 target=-first를 찾겠습니다.'", en: "'I'll iterate through first number, then use Two Pointers to find pair with target=-first.'" },
  },
  {
    id: "tp5", type: "pattern", categoryId: "two-pointers", difficulty: 2,
    question: { ko: "정렬된 배열에서 0이 아닌 원소들을 앞으로, 0을 뒤로 이동 (in-place).", en: "Move all non-zero elements to front, zeros to back (in-place) in sorted array." },
    options: ["Create new array", "Two Pointers (slow/fast)", "Sorting", "Hash Map"], answer: 1,
    optionReasons: [
      { ko: "O(n) 추가 공간 필요, in-place 아님", en: "Needs O(n) extra space, not in-place" },
      { ko: "slow/fast 포인터로 in-place O(n) 해결", en: "Slow/fast pointers solve in-place at O(n)" },
      { ko: "이미 특정 순서라 재정렬 불필요", en: "Already specific order, re-sorting unnecessary" },
      { ko: "위치 추적이 아닌 존재 확인용", en: "For existence checks, not position tracking" },
    ],
    explanation: { ko: "slow는 0이 아닌 원소의 위치, fast는 탐색. 0 아닌 값 만나면 swap.", en: "Slow marks position for non-zero, fast scans. Swap when non-zero found." },
  },
  {
    id: "tp6", type: "complexity", categoryId: "two-pointers", difficulty: 1,
    question: { ko: "정렬된 배열에서 Two Pointers로 쌍 찾기의 시간복잡도는?", en: "Time complexity of Two Pointers for finding pair in sorted array?" },
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2,
    explanation: { ko: "두 포인터가 각각 최대 n번 이동하므로 O(n).", en: "Two pointers move at most n steps total → O(n)." },
  },
  {
    id: "tp7", type: "pattern", categoryId: "two-pointers", difficulty: 1,
    question: { ko: "정렬된 배열이 회문(palindrome)인지 확인해야 합니다.", en: "Check if a sorted array is a palindrome." },
    options: ["Reverse and compare", "Two Pointers from ends", "Hash Map", "Stack"], answer: 1,
    optionReasons: [
      { ko: "O(n) 추가 공간 필요", en: "Needs O(n) extra space" },
      { ko: "양끝에서 비교하며 O(n/2)로 최적", en: "Compare from both ends at O(n/2) — optimal" },
      { ko: "회문 확인에 불필요한 자료구조", en: "Unnecessary data structure for palindrome check" },
      { ko: "LIFO로 역순 비교 가능하지만 비효율적", en: "LIFO reverse comparison possible but inefficient" },
    ],
    explanation: { ko: "양끝에서 포인터를 좁혀가며 비교. O(n/2) = O(n).", en: "Two pointers from ends comparing inward. O(n/2) = O(n)." },
  },
  {
    id: "tp8", type: "fillblank", categoryId: "two-pointers", difficulty: 2,
    question: { ko: "Remove Duplicates (정렬 배열) — 빈칸 채우기", en: "Remove Duplicates (sorted array) — fill blanks" },
    code: `function removeDuplicates(arr):
    if arr.length == 0: return 0

    slow = 0
    for fast from 1 to arr.length:
        if arr[fast] != arr[???]:
            slow++
            arr[???] = arr[fast]

    return ???`,
    blanks: [
      { placeholder: { ko: "??? (비교 대상)", en: "??? (compare with)" }, answer: "slow", options: ["slow", "fast", "slow-1", "fast-1"] },
      { placeholder: { ko: "??? (복사 위치)", en: "??? (copy to)" }, answer: "slow", options: ["slow", "fast", "slow+1", "fast-1"] },
      { placeholder: { ko: "??? (고유 원소 수)", en: "??? (unique count)" }, answer: "slow + 1", options: ["slow", "slow + 1", "fast", "arr.length"] },
    ],
    explanation: { ko: "slow는 마지막 고유 원소 인덱스. 길이는 slow+1.", en: "Slow is last unique index. Length is slow+1." },
  },
  {
    id: "tp9", type: "pattern", categoryId: "two-pointers", difficulty: 3,
    question: { ko: "정렬된 배열에서 네 수의 합이 target인 모든 조합 (4Sum).", en: "Find all quadruplets that sum to target (4Sum)." },
    options: ["Brute Force O(n⁴)", "Two nested loops + Two Pointers O(n³)", "Hash Map", "Binary Search"], answer: 1,
    optionReasons: [
      { ko: "O(n⁴)으로 비효율적", en: "O(n⁴) is inefficient" },
      { ko: "이중 루프 + Two Pointers로 O(n³) 최적", en: "Nested loops + Two Pointers for O(n³) optimal" },
      { ko: "네 수 조합에 단독 적용 어려움", en: "Hard to apply alone for quadruplets" },
      { ko: "단독으로는 네 수 조합 불가", en: "Can't find quadruplets with Binary Search alone" },
    ],
    explanation: { ko: "첫 두 수를 이중 루프로 고정, 나머지 두 수는 Two Pointers. O(n³).", en: "Fix first two with nested loops, Two Pointers for remaining. O(n³)." },
  },
  {
    id: "tp10", type: "approach", categoryId: "two-pointers", difficulty: 2,
    question: { ko: "Two Pointers 패턴을 적용할 수 있는 조건은?", en: "When can you apply Two Pointers pattern?" },
    steps: {
      ko: ["배열이 정렬되어 있거나 정렬 가능", "찾는 값이 단조성을 가짐 (크면 한쪽, 작으면 반대쪽)", "양끝 또는 slow/fast 방식으로 포인터 이동 전략 수립", "O(n) 선형 탐색으로 해결 가능"],
      en: ["Array is sorted or sortable", "Target has monotonic property (larger→move one way, smaller→other)", "Establish pointer movement strategy (ends or slow/fast)", "Solvable in O(n) linear scan"],
    },
    explanation: { ko: "정렬 + 단조성 = Two Pointers의 핵심 조건.", en: "Sorted + monotonic property = key conditions for Two Pointers." },
  },

  // ===== SLIDING WINDOW (추가 8개) =====
  {
    id: "sw3", type: "fillblank", categoryId: "sliding-window", difficulty: 2,
    question: { ko: "Max Sum Subarray of Size K — 빈칸 채우기", en: "Max Sum Subarray of Size K — fill blanks" },
    code: `function maxSum(arr, k):
    windowSum = sum(arr[0:k])
    maxSum = windowSum

    for i from k to arr.length:
        windowSum = windowSum - arr[???] + arr[???]
        maxSum = max(maxSum, windowSum)

    return maxSum`,
    blanks: [
      { placeholder: { ko: "??? (제거할 원소)", en: "??? (remove element)" }, answer: "i - k", options: ["i", "i - k", "i - 1", "i + 1"] },
      { placeholder: { ko: "??? (추가할 원소)", en: "??? (add element)" }, answer: "i", options: ["i", "i - k", "i + k", "i - 1"] },
    ],
    explanation: { ko: "윈도우가 오른쪽으로 이동하면 왼쪽 원소 빼고 오른쪽 원소 더함.", en: "As window slides right, remove left element and add right element." },
  },
  {
    id: "sw4", type: "pattern", categoryId: "sliding-window", difficulty: 2,
    question: { ko: "문자열에서 k개 이하의 서로 다른 문자를 가진 가장 긴 부분 문자열.", en: "Longest substring with at most k distinct characters." },
    options: ["Brute Force", "Sliding Window + Hash Map", "Two Pointers only", "Binary Search"], answer: 1,
    explanation: { ko: "가변 윈도우 + HashMap으로 distinct 문자 카운트. 초과하면 left 이동.", en: "Variable window + HashMap to track distinct chars. Shrink when exceeding k." },
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "가변 윈도우 + HashMap으로 distinct 문자 추적 — O(n)", en: "Variable window + HashMap tracks distinct chars — O(n)" },
      { ko: "윈도우 확장/축소 로직 없이 부족", en: "Without window expand/shrink logic, insufficient" },
      { ko: "정렬된 데이터가 아니므로 부적합", en: "Data isn't sorted, not applicable" },
    ],
    speakingTip: { ko: "'HashMap으로 distinct 문자 수를 세며 Sliding Window를 확장하겠습니다.'", en: "'I'll use Sliding Window with HashMap to count distinct characters.'" },
  },
  {
    id: "sw5", type: "pattern", categoryId: "sliding-window", difficulty: 3,
    question: { ko: "문자열 s에서 t의 모든 문자를 포함하는 최소 윈도우 (Minimum Window Substring).", en: "Minimum window in s that contains all characters of t." },
    options: ["Brute Force O(n²)", "Sliding Window + Two HashMaps", "Binary Search", "Dynamic Programming"], answer: 1,
    explanation: { ko: "필요 문자를 HashMap에 저장. 윈도우 확장하며 만족하면 축소. O(n).", en: "Store needed chars in HashMap. Expand window until satisfied, then shrink. O(n)." },
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "두 HashMap으로 필요 문자 vs 현재 윈도우 비교 — O(n)", en: "Two HashMaps comparing needed vs current — O(n)" },
      { ko: "문자열 포함 관계에 부적합", en: "Not suitable for substring containment" },
      { ko: "최적 부분 구조 없음", en: "No optimal substructure" },
    ],
    speakingTip: { ko: "'두 개의 HashMap으로 필요 문자와 현재 윈도우 문자를 비교하겠습니다.'", en: "'I'll use two HashMaps to track needed vs current window characters.'" },
  },
  {
    id: "sw6", type: "complexity", categoryId: "sliding-window", difficulty: 1,
    question: { ko: "고정 크기 Sliding Window의 시간복잡도는?", en: "Time complexity of fixed-size Sliding Window?" },
    options: ["O(1)", "O(k)", "O(n)", "O(n·k)"], answer: 2,
    explanation: { ko: "각 원소를 한 번씩만 보므로 O(n). 윈도우 크기 k는 상수.", en: "Each element visited once → O(n). Window size k is constant." },
  },
  {
    id: "sw7", type: "pattern", categoryId: "sliding-window", difficulty: 2,
    question: { ko: "배열에서 평균이 threshold 이상인 길이 k의 부분 배열 개수.", en: "Count subarrays of length k with average ≥ threshold." },
    options: ["Brute Force", "Sliding Window", "Binary Search", "Prefix Sum"], answer: 1,
    optionReasons: [
      { ko: "O(n·k)로 비효율적", en: "O(n·k) is inefficient" },
      { ko: "고정 윈도우로 합 유지하며 O(n)에 해결", en: "Fixed window maintains sum at O(n)" },
      { ko: "연속 부분 배열 문제에 부적합", en: "Not suitable for contiguous subarray problems" },
      { ko: "Prefix Sum으로도 가능하지만 Sliding Window가 더 직관적", en: "Prefix Sum works but Sliding Window is more intuitive" },
    ],
    explanation: { ko: "고정 윈도우로 합을 유지하며 평균 계산. O(n).", en: "Maintain sum with fixed window and check average. O(n)." },
  },
  {
    id: "sw8", type: "pattern", categoryId: "sliding-window", difficulty: 2,
    question: { ko: "이진 배열에서 최대 k개의 0을 1로 바꿔 만들 수 있는 가장 긴 연속 1.", en: "Longest sequence of 1s after flipping at most k zeros." },
    options: ["Brute Force", "Sliding Window", "Dynamic Programming", "Greedy"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "윈도우 내 0 개수 추적하며 확장/축소 — O(n)", en: "Track zero count in window, expand/shrink — O(n)" },
      { ko: "상태 전이가 복잡해 불필요", en: "State transitions too complex, unnecessary" },
      { ko: "최적 해를 보장하지 않을 수 있음", en: "May not guarantee optimal solution" },
    ],
    explanation: { ko: "윈도우 내 0의 개수 추적. k 초과하면 left 이동.", en: "Track count of 0s in window. Shrink when exceeding k." },
  },
  {
    id: "sw9", type: "approach", categoryId: "sliding-window", difficulty: 2,
    question: { ko: "Sliding Window를 쓸 수 있는 문제 패턴은?", en: "Problem patterns where Sliding Window applies?" },
    steps: {
      ko: ["연속된 부분 배열/문자열 문제", "고정 크기 또는 조건을 만족하는 가변 크기", "윈도우 확장/축소로 O(n)에 해결 가능", "브루트 포스가 O(n²) 이상일 때"],
      en: ["Contiguous subarray/substring problems", "Fixed size or variable size with condition", "Expandable/shrinkable window for O(n) solution", "When brute force is O(n²) or worse"],
    },
    explanation: { ko: "연속성 + 윈도우 이동 = Sliding Window 신호.", en: "Contiguous + window movement = Sliding Window signal." },
  },
  {
    id: "sw10", type: "pattern", categoryId: "sliding-window", difficulty: 3,
    question: { ko: "문자열에서 anagram을 이루는 모든 부분 문자열 시작 인덱스 찾기.", en: "Find all anagram start indices in a string." },
    options: ["Brute Force + Sorting", "Sliding Window + Char Count Array", "Hash Map only", "Two Pointers"], answer: 1,
    optionReasons: [
      { ko: "정렬이 O(n·k log k)로 비효율적", en: "Sorting is O(n·k log k), inefficient" },
      { ko: "고정 윈도우 + 문자 빈도 배열 비교 — O(n)", en: "Fixed window + char frequency comparison — O(n)" },
      { ko: "단독으로는 윈도우 이동 로직 부족", en: "HashMap alone lacks window movement logic" },
      { ko: "단조성 없어 부적합", en: "No monotonic property to exploit" },
    ],
    explanation: { ko: "고정 윈도우 + 문자 빈도 배열 비교. O(n).", en: "Fixed window + character frequency array comparison. O(n)." },
  },

  // ===== BINARY SEARCH (추가 7개) =====
  {
    id: "bs4", type: "pattern", categoryId: "binary-search", difficulty: 2,
    question: { ko: "정렬된 2D 행렬에서 target을 찾아야 합니다 (각 행과 열이 정렬됨).", en: "Search for target in sorted 2D matrix (rows and columns sorted)." },
    options: ["Linear Search O(n·m)", "Binary Search on each row", "Start from top-right corner", "Hash Map"], answer: 2,
    optionReasons: [
      { ko: "O(n·m)으로 비효율적", en: "O(n·m) is inefficient" },
      { ko: "각 행에 Binary Search하면 O(n log m)", en: "Binary Search on each row is O(n log m)" },
      { ko: "오른쪽 위에서 시작하면 O(n+m)으로 최적", en: "Start from top-right for O(n+m) — optimal" },
      { ko: "추가 공간 필요하고 비효율적", en: "Needs extra space and is inefficient" },
    ],
    explanation: { ko: "오른쪽 위에서 시작. target보다 크면 왼쪽, 작으면 아래로. O(n+m).", en: "Start from top-right. If greater, go left. If smaller, go down. O(n+m)." },
  },
  {
    id: "bs5", type: "pattern", categoryId: "binary-search", difficulty: 3,
    question: { ko: "정렬된 배열에서 k번째로 작은 쌍의 거리 (K-th Smallest Pair Distance).", en: "Find k-th smallest pair distance in sorted array." },
    options: ["Sort all pairs", "Binary Search on answer", "Heap", "Two Pointers"], answer: 1,
    optionReasons: [
      { ko: "O(n² log n²)으로 비효율적", en: "O(n² log n²) is inefficient" },
      { ko: "답의 범위에 Binary Search + Two Pointers로 카운트", en: "Binary Search on answer + Two Pointers to count" },
      { ko: "모든 쌍을 힙에 넣으면 메모리 초과 위험", en: "Pushing all pairs to heap risks memory overflow" },
      { ko: "단독으로 쌍 거리 계산 불가", en: "Can't compute pair distances with Two Pointers alone" },
    ],
    explanation: { ko: "답의 범위에 Binary Search. mid 이하 쌍 개수를 Two Pointers로 세기.", en: "Binary search on answer range. Count pairs ≤ mid using Two Pointers." },
  },
  {
    id: "bs6", type: "complexity", categoryId: "binary-search", difficulty: 2,
    question: { ko: "Binary Search를 사용한 '답 찾기' (Binary Search on Answer)의 시간복잡도는?", en: "Time complexity of Binary Search on Answer?" },
    options: ["O(log n)", "O(n)", "O(n log n)", "O(log n · check())"], answer: 3,
    explanation: { ko: "log(답 범위) × check 함수 복잡도. 보통 O(n log MAX).", en: "log(answer range) × check function. Usually O(n log MAX)." },
  },
  {
    id: "bs7", type: "pattern", categoryId: "binary-search", difficulty: 2,
    question: { ko: "산 배열(Mountain Array)에서 peak 원소 찾기.", en: "Find peak element in mountain array." },
    options: ["Linear Scan", "Binary Search", "Two Pointers", "DFS"], answer: 1,
    optionReasons: [
      { ko: "O(n)으로 가능하지만 O(log n)이 최적", en: "O(n) works but O(log n) is optimal" },
      { ko: "mid 기준 증가/감소 방향으로 탐색 — O(log n)", en: "Search by ascending/descending direction at mid — O(log n)" },
      { ko: "양끝에서 접근하면 peak 놓칠 수 있음", en: "Approaching from ends may miss the peak" },
      { ko: "트리 탐색이 아닌 배열 문제", en: "Array problem, not tree traversal" },
    ],
    explanation: { ko: "mid가 증가 중이면 오른쪽, 감소 중이면 왼쪽 탐색. O(log n).", en: "If mid is ascending, search right. If descending, search left. O(log n)." },
  },
  {
    id: "bs8", type: "fillblank", categoryId: "binary-search", difficulty: 3,
    question: { ko: "Binary Search (Lower Bound) — 빈칸 채우기", en: "Binary Search (Lower Bound) — fill blanks" },
    code: `function lowerBound(arr, target):
    left = 0
    right = arr.length

    while left < right:
        mid = left + (right - left) / 2
        if arr[mid] < target:
            left = ???
        else:
            right = ???

    return ???`,
    blanks: [
      { placeholder: { ko: "??? (left 이동)", en: "??? (move left)" }, answer: "mid + 1", options: ["mid", "mid + 1", "mid - 1", "left + 1"] },
      { placeholder: { ko: "??? (right 이동)", en: "??? (move right)" }, answer: "mid", options: ["mid", "mid + 1", "mid - 1", "right - 1"] },
      { placeholder: { ko: "??? (반환값)", en: "??? (return)" }, answer: "left", options: ["left", "right", "mid", "left - 1"] },
    ],
    explanation: { ko: "lower_bound는 target 이상인 첫 위치. right=mid로 범위 유지.", en: "Lower_bound finds first position ≥ target. Use right=mid to preserve range." },
  },
  {
    id: "bs9", type: "pattern", categoryId: "binary-search", difficulty: 3,
    question: { ko: "정렬된 배열을 k번 회전했을 때 최소값 찾기.", en: "Find minimum in rotated sorted array (rotated k times)." },
    options: ["Linear Scan", "Binary Search", "Two Pointers", "Hash Map"], answer: 1,
    optionReasons: [
      { ko: "O(n)으로 가능하지만 O(log n)이 최적", en: "O(n) works but O(log n) is optimal" },
      { ko: "mid와 right 비교로 최소값 위치 판별 — O(log n)", en: "Compare mid with right to locate minimum — O(log n)" },
      { ko: "단조성 없어 부적합", en: "No monotonic property to exploit" },
      { ko: "위치 저장이 아닌 탐색 문제", en: "A search problem, not a storage problem" },
    ],
    explanation: { ko: "mid가 오른쪽 끝보다 크면 왼쪽은 정렬됨. 최소값은 오른쪽. O(log n).", en: "If mid > right end, left is sorted. Min is in right half. O(log n)." },
  },
  {
    id: "bs10", type: "approach", categoryId: "binary-search", difficulty: 2,
    question: { ko: "Binary Search를 적용할 수 있는 조건은?", en: "When can Binary Search be applied?" },
    steps: {
      ko: ["검색 공간이 정렬되어 있거나 단조성을 가짐", "중간값으로 좌우 범위를 배제 가능", "답의 범위가 정의되어 있음 (Binary Search on Answer)", "O(log n)으로 탐색 가능"],
      en: ["Search space is sorted or has monotonic property", "Can eliminate left or right half based on mid", "Answer range is defined (for Binary Search on Answer)", "Achievable in O(log n)"],
    },
    explanation: { ko: "정렬 또는 단조성 = Binary Search 신호.", en: "Sorted or monotonic = Binary Search signal." },
  },

  // ===== HASH MAP (추가 8개) =====
  {
    id: "hm3", type: "fillblank", categoryId: "hash-map", difficulty: 1,
    question: { ko: "Two Sum (비정렬) — 빈칸 채우기", en: "Two Sum (unsorted) — fill blanks" },
    code: `function twoSum(arr, target):
    seen = {}

    for i, num in enumerate(arr):
        complement = ???
        if complement in seen:
            return [seen[complement], i]
        seen[???] = i

    return []`,
    blanks: [
      { placeholder: { ko: "??? (보수)", en: "??? (complement)" }, answer: "target - num", options: ["target - num", "target + num", "num - target", "target / num"] },
      { placeholder: { ko: "??? (저장 키)", en: "??? (store key)" }, answer: "num", options: ["num", "i", "complement", "target"] },
    ],
    explanation: { ko: "현재 숫자의 보수를 맵에서 찾고, 없으면 현재 숫자 저장.", en: "Look for complement in map. If not found, store current number." },
  },
  {
    id: "hm4", type: "pattern", categoryId: "hash-map", difficulty: 2,
    question: { ko: "두 배열의 교집합을 찾아야 합니다.", en: "Find intersection of two arrays." },
    options: ["Nested loops O(n·m)", "Sort both + Two Pointers", "Hash Set", "All of above"], answer: 3,
    optionReasons: [
      { ko: "O(n·m)으로 비효율적", en: "O(n·m) is inefficient" },
      { ko: "정렬 후 Two Pointers로 O(n log n)", en: "Sort + Two Pointers at O(n log n)" },
      { ko: "Hash Set으로 O(n+m) 최적", en: "Hash Set at O(n+m) optimal" },
      { ko: "세 가지 방법 모두 정답", en: "All three methods work correctly" },
    ],
    explanation: { ko: "Hash Set이 O(n+m)로 가장 빠르지만, 정렬 후 Two Pointers도 가능.", en: "Hash Set is fastest at O(n+m), but sort + Two Pointers also works." },
  },
  {
    id: "hm5", type: "pattern", categoryId: "hash-map", difficulty: 2,
    question: { ko: "문자열 배열에서 anagram끼리 그룹화해야 합니다.", en: "Group anagrams from array of strings." },
    options: ["Brute Force comparison", "Hash Map with sorted string as key", "Trie", "Binary Search"], answer: 1,
    optionReasons: [
      { ko: "O(n²·k)로 비효율적", en: "O(n²·k) is inefficient" },
      { ko: "정렬된 문자열을 키로 — O(n·k log k)", en: "Sorted string as key — O(n·k log k)" },
      { ko: "문자열 그룹화에 Trie는 과도", en: "Trie is overkill for string grouping" },
      { ko: "정렬된 데이터가 아니므로 부적합", en: "Data isn't sorted, not applicable" },
    ],
    explanation: { ko: "각 문자열을 정렬한 것을 키로 사용. O(n·k log k), k=문자열 길이.", en: "Use sorted string as key. O(n·k log k) where k=string length." },
  },
  {
    id: "hm6", type: "pattern", categoryId: "hash-map", difficulty: 3,
    question: { ko: "배열에서 합이 0이 되는 네 수 조합의 개수 (4Sum Count).", en: "Count 4-element tuples with sum = 0 (4Sum Count)." },
    options: ["Brute Force O(n⁴)", "Hash Map for 2-sum pairs", "Binary Search", "Dynamic Programming"], answer: 1,
    optionReasons: [
      { ko: "O(n⁴)으로 비효율적", en: "O(n⁴) is inefficient" },
      { ko: "A+B 저장, -(C+D) 조회로 O(n²)", en: "Store A+B, lookup -(C+D) for O(n²)" },
      { ko: "네 배열 합에 적용 어려움", en: "Hard to apply for four-array sums" },
      { ko: "최적 부분 구조 없음", en: "No optimal substructure" },
    ],
    explanation: { ko: "A+B를 맵에 저장, C+D의 -값이 있는지 확인. O(n²).", en: "Store A+B in map, check if -(C+D) exists. O(n²)." },
  },
  {
    id: "hm7", type: "pattern", categoryId: "hash-map", difficulty: 2,
    question: { ko: "연속된 부분 배열의 합이 k인 것의 개수.", en: "Count subarrays with sum = k." },
    options: ["Brute Force", "Prefix Sum + Hash Map", "Sliding Window", "Two Pointers"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "Prefix Sum + HashMap으로 O(n) 최적", en: "Prefix Sum + HashMap for O(n) optimal" },
      { ko: "음수가 있으면 윈도우 축소 불가", en: "Can't shrink window with negative numbers" },
      { ko: "음수가 있으면 단조성 없음", en: "No monotonic property with negatives" },
    ],
    explanation: { ko: "Prefix Sum을 맵에 저장. prefixSum - k가 맵에 있으면 카운트.", en: "Store prefix sums in map. If prefixSum - k exists, increment count." },
  },
  {
    id: "hm8", type: "complexity", categoryId: "hash-map", difficulty: 1,
    question: { ko: "Hash Map의 최악의 경우 lookup 시간복잡도는?", en: "Worst-case lookup time complexity of Hash Map?" },
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2,
    explanation: { ko: "충돌로 인해 한 버킷에 모든 원소가 모이면 O(n). 평균은 O(1).", en: "All elements in one bucket due to collisions → O(n). Average is O(1)." },
  },
  {
    id: "hm9", type: "pattern", categoryId: "hash-map", difficulty: 2,
    question: { ko: "배열에서 가장 긴 연속 수열의 길이 (Longest Consecutive Sequence).", en: "Length of longest consecutive sequence in array." },
    options: ["Sort first", "Hash Set + smart iteration", "Binary Search", "Dynamic Programming"], answer: 1,
    optionReasons: [
      { ko: "O(n log n)으로 가능하지만 O(n)이 최적", en: "O(n log n) works but O(n) is optimal" },
      { ko: "시작점에서만 카운트하여 O(n) 달성", en: "Only count from sequence starts for O(n)" },
      { ko: "연속 수열에 정렬 기반 탐색 부적합", en: "Binary Search not suitable for consecutive sequences" },
      { ko: "상태 전이가 없으므로 DP 불필요", en: "No state transitions, DP unnecessary" },
    ],
    explanation: { ko: "Hash Set에 저장 후, 수열 시작점(n-1이 없음)에서만 카운트. O(n).", en: "Store in Hash Set. Only count from sequence start (no n-1). O(n)." },
  },
  {
    id: "hm10", type: "approach", categoryId: "hash-map", difficulty: 2,
    question: { ko: "Hash Map을 사용해야 하는 신호는?", en: "Signals to use Hash Map?" },
    steps: {
      ko: ["O(1) 조회가 필요한 경우", "이전에 본 값을 기억해야 하는 경우", "빈도수/존재 여부 확인", "비정렬 데이터에서 빠른 탐색"],
      en: ["Need O(1) lookup", "Must remember previously seen values", "Check frequency or existence", "Fast search in unsorted data"],
    },
    explanation: { ko: "'본 적 있나?' 질문 = Hash Map 신호.", en: "'Have we seen this?' question = Hash Map signal." },
  },

  // ===== STACK/QUEUE (추가 7개) =====
  {
    id: "sq4", type: "pattern", categoryId: "stack-queue", difficulty: 2,
    question: { ko: "수식 문자열을 후위 표기법으로 계산해야 합니다.", en: "Evaluate arithmetic expression in postfix notation." },
    options: ["Recursion", "Stack", "Queue", "Two Pointers"], answer: 1,
    optionReasons: [
      { ko: "재귀는 가능하지만 스택이 표준적", en: "Recursion works but Stack is standard" },
      { ko: "숫자 push, 연산자 시 pop 2개 → 계산 → push", en: "Push numbers, pop 2 on operator → calculate → push" },
      { ko: "FIFO 순서는 후위 표기법에 부적합", en: "FIFO order doesn't suit postfix evaluation" },
      { ko: "순차 탐색에 부적합", en: "Not suitable for sequential processing" },
    ],
    explanation: { ko: "숫자는 push, 연산자 만나면 두 개 pop해서 계산 후 push. O(n).", en: "Push numbers, pop two on operator, calculate and push result. O(n)." },
  },
  {
    id: "sq5", type: "pattern", categoryId: "stack-queue", difficulty: 3,
    question: { ko: "히스토그램에서 가장 큰 직사각형 넓이 (Largest Rectangle in Histogram).", en: "Find largest rectangle area in histogram." },
    options: ["Brute Force O(n²)", "Monotone Stack", "Binary Search", "Dynamic Programming"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "단조 증가 스택으로 O(n)에 최대 넓이 계산", en: "Monotone increasing stack calculates max area in O(n)" },
      { ko: "히스토그램에 Binary Search 적용 어려움", en: "Hard to apply Binary Search to histogram" },
      { ko: "최적 부분 구조 활용 어려움", en: "Hard to exploit optimal substructure" },
    ],
    explanation: { ko: "단조 증가 스택. 현재 높이가 낮아지면 pop하며 넓이 계산. O(n).", en: "Monotone increasing stack. Pop when current is lower, calculate area. O(n)." },
  },
  {
    id: "sq6", type: "pattern", categoryId: "stack-queue", difficulty: 2,
    question: { ko: "BFS 레벨 순회에 어떤 자료구조를 쓸까요?", en: "Which data structure for BFS level-order traversal?" },
    options: ["Stack", "Queue", "Priority Queue", "Hash Map"], answer: 1,
    optionReasons: [
      { ko: "LIFO로 레벨 순서 보장 안 됨", en: "LIFO doesn't guarantee level order" },
      { ko: "FIFO로 레벨별 순서 탐색 보장", en: "FIFO guarantees level-by-level order" },
      { ko: "우선순위가 아닌 순서 기반 문제", en: "Order-based, not priority-based" },
      { ko: "저장/조회용이지 순회용 아님", en: "For storage/lookup, not traversal" },
    ],
    explanation: { ko: "FIFO 순서로 레벨별 탐색이 필요하므로 Queue.", en: "FIFO order for level-by-level exploration → Queue." },
  },
  {
    id: "sq7", type: "fillblank", categoryId: "stack-queue", difficulty: 2,
    question: { ko: "Min Stack (최소값을 O(1)에 반환) — 빈칸 채우기", en: "Min Stack (return min in O(1)) — fill blanks" },
    code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.minStack = []

    def push(val):
        self.stack.append(val)
        minVal = min(val, self.minStack[-1] if ??? else val)
        self.minStack.append(???)

    def getMin():
        return ???`,
    blanks: [
      { placeholder: { ko: "??? (minStack 비어있지 않은지)", en: "??? (minStack not empty)" }, answer: "self.minStack", options: ["self.minStack", "self.stack", "val", "True"] },
      { placeholder: { ko: "??? (push할 최소값)", en: "??? (push min)" }, answer: "minVal", options: ["minVal", "val", "self.minStack[-1]", "min(val)"] },
      { placeholder: { ko: "??? (최소값 반환)", en: "??? (return min)" }, answer: "self.minStack[-1]", options: ["self.minStack[-1]", "self.stack[-1]", "min(self.stack)", "self.minStack[0]"] },
    ],
    explanation: { ko: "별도의 minStack에 각 시점의 최소값을 유지.", en: "Maintain separate minStack with minimum at each point." },
  },
  {
    id: "sq8", type: "pattern", categoryId: "stack-queue", difficulty: 2,
    question: { ko: "문자열 디코딩 (예: '3[a2[c]]' → 'accaccacc').", en: "Decode string (e.g., '3[a2[c]]' → 'accaccacc')." },
    options: ["Recursion", "Stack", "Queue", "Hash Map"], answer: 1,
    optionReasons: [
      { ko: "재귀로 가능하지만 스택이 더 직관적", en: "Recursion works but Stack is more intuitive" },
      { ko: "중첩 구조를 스택으로 추적 — ']'에서 pop/디코딩", en: "Track nesting with Stack — pop/decode on ']'" },
      { ko: "FIFO 순서는 중첩 디코딩에 부적합", en: "FIFO order doesn't suit nested decoding" },
      { ko: "키-값 저장이 아닌 순서 기반 문제", en: "Order-based, not key-value storage" },
    ],
    explanation: { ko: "숫자와 문자열을 스택에 push. ']' 만나면 pop해서 디코딩.", en: "Push numbers and strings to stack. On ']', pop and decode." },
  },
  {
    id: "sq9", type: "complexity", categoryId: "stack-queue", difficulty: 1,
    question: { ko: "Stack의 push와 pop 시간복잡도는?", en: "Time complexity of Stack push and pop?" },
    options: ["O(1) / O(1)", "O(1) / O(n)", "O(n) / O(1)", "O(log n) / O(log n)"], answer: 0,
    explanation: { ko: "둘 다 top에서만 작업하므로 O(1).", en: "Both operate only at top → O(1)." },
  },
  {
    id: "sq10", type: "approach", categoryId: "stack-queue", difficulty: 2,
    question: { ko: "Stack을 사용해야 하는 문제 패턴은?", en: "Problem patterns requiring Stack?" },
    steps: {
      ko: ["괄호/중첩 구조 매칭", "역순 처리 (LIFO)", "가장 가까운 큰/작은 원소 (Monotone Stack)", "최근 상태 기억 (undo/redo)"],
      en: ["Matching brackets/nested structures", "Reverse order processing (LIFO)", "Nearest greater/smaller (Monotone Stack)", "Remember recent state (undo/redo)"],
    },
    explanation: { ko: "중첩 구조 또는 역순 = Stack 신호.", en: "Nested structure or reverse order = Stack signal." },
  },

  // ===== BFS/DFS (추가 8개) =====
  {
    id: "bd3", type: "pattern", categoryId: "bfs-dfs", difficulty: 2,
    question: { ko: "그래프가 이분 그래프(Bipartite)인지 확인해야 합니다.", en: "Check if graph is bipartite." },
    options: ["DFS with 2-coloring", "BFS with 2-coloring", "Both work", "Union-Find"], answer: 2,
    optionReasons: [
      { ko: "2-coloring DFS로 가능하지만 단독 답 아님", en: "DFS 2-coloring works but not the only answer" },
      { ko: "2-coloring BFS로 가능하지만 단독 답 아님", en: "BFS 2-coloring works but not the only answer" },
      { ko: "DFS와 BFS 모두 2-coloring으로 이분 그래프 확인 가능", en: "Both DFS and BFS with 2-coloring check bipartiteness" },
      { ko: "연결 요소용이지 이분 확인용 아님", en: "For connected components, not bipartite check" },
    ],
    explanation: { ko: "인접 노드를 다른 색으로 칠하며 탐색. 충돌하면 false. O(V+E).", en: "Color adjacent nodes differently. If conflict, not bipartite. O(V+E)." },
  },
  {
    id: "bd4", type: "pattern", categoryId: "bfs-dfs", difficulty: 3,
    question: { ko: "그래프의 모든 경로를 찾아야 합니다 (All Paths).", en: "Find all paths in a graph." },
    options: ["BFS", "DFS with backtracking", "Dynamic Programming", "Greedy"], answer: 1,
    optionReasons: [
      { ko: "모든 경로 찾기에 BFS는 비효율적", en: "BFS is inefficient for finding all paths" },
      { ko: "DFS + 백트래킹으로 모든 경로 탐색", en: "DFS with backtracking explores all paths" },
      { ko: "모든 경로 열거에 DP 부적합", en: "DP not suitable for enumerating all paths" },
      { ko: "최적 경로가 아닌 전체 열거 문제", en: "Enumeration problem, not optimization" },
    ],
    explanation: { ko: "DFS로 탐색하며 경로 저장. 목적지 도달하면 기록 후 backtrack.", en: "DFS with path tracking. Record when reaching destination, then backtrack." },
  },
  {
    id: "bd5", type: "fillblank", categoryId: "bfs-dfs", difficulty: 2,
    question: { ko: "BFS 템플릿 — 빈칸 채우기", en: "BFS Template — fill blanks" },
    code: `function bfs(graph, start):
    queue = [start]
    visited = {start}

    while queue:
        node = queue.???(0)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.???
                queue.???

    return visited`,
    blanks: [
      { placeholder: { ko: "??? (큐에서 꺼내기)", en: "??? (dequeue)" }, answer: "pop", options: ["pop", "append", "push", "peek"] },
      { placeholder: { ko: "??? (방문 표시)", en: "??? (mark visited)" }, answer: "add(neighbor)", options: ["add(neighbor)", "append(neighbor)", "add(node)", "remove(neighbor)"] },
      { placeholder: { ko: "??? (큐에 추가)", en: "??? (enqueue)" }, answer: "append(neighbor)", options: ["append(neighbor)", "pop(neighbor)", "add(neighbor)", "insert(neighbor)"] },
    ],
    explanation: { ko: "BFS는 Queue + 방문 체크. FIFO 순서.", en: "BFS uses Queue + visited set. FIFO order." },
  },
  {
    id: "bd6", type: "pattern", categoryId: "bfs-dfs", difficulty: 2,
    question: { ko: "트리의 오른쪽에서 본 모습 (Right Side View)을 구해야 합니다.", en: "Find right side view of binary tree." },
    options: ["Preorder DFS", "BFS level-order", "Inorder DFS", "Postorder DFS"], answer: 1,
    optionReasons: [
      { ko: "전위 순서는 마지막 노드 수집에 부적합", en: "Preorder doesn't collect last node per level" },
      { ko: "레벨별 마지막 노드를 수집 — 최적", en: "Collect last node per level — optimal" },
      { ko: "중위 순서는 레벨 구분 안 됨", en: "Inorder doesn't distinguish levels" },
      { ko: "후위 순서도 레벨 구분 안 됨", en: "Postorder doesn't distinguish levels" },
    ],
    explanation: { ko: "BFS로 레벨별 순회하며 각 레벨의 마지막 노드 수집. O(n).", en: "BFS level-order, collect last node of each level. O(n)." },
  },
  {
    id: "bd7", type: "pattern", categoryId: "bfs-dfs", difficulty: 3,
    question: { ko: "그리드에서 0을 만나면 멈추는 최단 거리 (Shortest Path with Obstacles).", en: "Shortest path in grid with obstacles (stop at 0)." },
    options: ["DFS", "BFS", "Dijkstra", "A*"], answer: 1,
    optionReasons: [
      { ko: "최단 거리 보장 안 됨", en: "Doesn't guarantee shortest path" },
      { ko: "가중치 없는 최단 거리 = BFS, 장애물은 방문 불가 처리", en: "Unweighted shortest path = BFS, treat obstacles as blocked" },
      { ko: "가중치 없으므로 Dijkstra 불필요", en: "No weights, Dijkstra unnecessary" },
      { ko: "그리드에 A*는 과도", en: "A* is overkill for simple grid" },
    ],
    explanation: { ko: "가중치 없는 최단 거리 = BFS. 0은 방문 불가로 처리.", en: "Unweighted shortest path = BFS. Treat 0 as blocked." },
  },
  {
    id: "bd8", type: "complexity", categoryId: "bfs-dfs", difficulty: 2,
    question: { ko: "그래프 DFS의 시간복잡도는?", en: "Time complexity of graph DFS?" },
    options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"], answer: 2,
    explanation: { ko: "모든 정점 방문(V) + 각 간선 확인(E) → O(V + E).", en: "Visit all vertices (V) + check all edges (E) → O(V + E)." },
  },
  {
    id: "bd9", type: "pattern", categoryId: "bfs-dfs", difficulty: 2,
    question: { ko: "그래프에서 사이클을 찾아야 합니다 (무방향 그래프).", en: "Detect cycle in undirected graph." },
    options: ["BFS with parent tracking", "DFS with parent tracking", "Both work", "Union-Find"], answer: 3,
    optionReasons: [
      { ko: "부모 추적 BFS 가능하지만 단독 답 아님", en: "BFS with parent works but not the only answer" },
      { ko: "부모 추적 DFS 가능하지만 단독 답 아님", en: "DFS with parent works but not the only answer" },
      { ko: "DFS/BFS 모두 부모 추적으로 사이클 감지 가능", en: "Both DFS/BFS detect cycles with parent tracking" },
      { ko: "Union-Find도 사이클 감지 가능", en: "Union-Find also detects cycles" },
    ],
    explanation: { ko: "DFS/BFS 모두 가능. 방문한 노드를 다시 만나면(부모 제외) 사이클.", en: "Both DFS/BFS work. Revisiting a node (not parent) means cycle." },
  },
  {
    id: "bd10", type: "approach", categoryId: "bfs-dfs", difficulty: 2,
    question: { ko: "BFS vs DFS 선택 기준은?", en: "When to choose BFS vs DFS?" },
    steps: {
      ko: ["최단 거리 → BFS", "모든 경로/조합 → DFS", "레벨별 처리 → BFS", "메모리 제약 (넓은 그래프) → DFS"],
      en: ["Shortest path → BFS", "All paths/combinations → DFS", "Level-by-level → BFS", "Memory constraint (wide graph) → DFS"],
    },
    explanation: { ko: "BFS는 최단 거리, DFS는 완전 탐색에 유리.", en: "BFS for shortest path, DFS for exhaustive search." },
  },

  // ===== TREE (추가 7개) =====
  {
    id: "tr4", type: "fillblank", categoryId: "tree", difficulty: 2,
    question: { ko: "Tree Max Depth (DFS) — 빈칸 채우기", en: "Tree Max Depth (DFS) — fill blanks" },
    code: `function maxDepth(node):
    if node is None:
        return ???

    leftDepth = maxDepth(node.left)
    rightDepth = maxDepth(node.right)

    return 1 + max(???, ???)`,
    blanks: [
      { placeholder: { ko: "??? (base case)", en: "??? (base case)" }, answer: "0", options: ["0", "1", "-1", "None"] },
      { placeholder: { ko: "??? (왼쪽)", en: "??? (left)" }, answer: "leftDepth", options: ["leftDepth", "rightDepth", "node.left", "1"] },
      { placeholder: { ko: "??? (오른쪽)", en: "??? (right)" }, answer: "rightDepth", options: ["rightDepth", "leftDepth", "node.right", "0"] },
    ],
    explanation: { ko: "재귀로 왼/오른쪽 깊이 구하고 1 더하기.", en: "Recursively get left/right depth and add 1." },
  },
  {
    id: "tr5", type: "pattern", categoryId: "tree", difficulty: 2,
    question: { ko: "이진 트리가 대칭(Symmetric)인지 확인해야 합니다.", en: "Check if binary tree is symmetric." },
    options: ["Inorder traversal", "DFS mirroring comparison", "BFS level comparison", "Both B and C"], answer: 3,
    optionReasons: [
      { ko: "대칭은 순서와 무관", en: "Symmetry is unrelated to inorder sequence" },
      { ko: "DFS로 좌우 거울상 비교 가능", en: "DFS can compare left-right mirrors" },
      { ko: "BFS로 레벨별 대칭 비교 가능", en: "BFS can compare level symmetry" },
      { ko: "DFS와 BFS 모두 대칭 확인 가능", en: "Both DFS and BFS can check symmetry" },
    ],
    explanation: { ko: "왼쪽 서브트리와 오른쪽 서브트리가 거울상인지 재귀로 확인.", en: "Recursively check if left and right subtrees are mirrors." },
  },
  {
    id: "tr6", type: "pattern", categoryId: "tree", difficulty: 3,
    question: { ko: "이진 트리를 연결 리스트로 펼쳐야 합니다 (Flatten to Linked List).", en: "Flatten binary tree to linked list." },
    options: ["Preorder DFS", "Inorder DFS", "Postorder DFS", "BFS"], answer: 0,
    optionReasons: [
      { ko: "Preorder(루트→왼→오) 순서로 연결 리스트 펼침", en: "Preorder (root→left→right) flattens to linked list" },
      { ko: "정렬 순서라 연결 리스트와 무관", en: "Sorted order, unrelated to linked list" },
      { ko: "후위는 역순이라 부적합", en: "Postorder is reverse, not suitable" },
      { ko: "레벨 순서는 깊이 우선이 아님", en: "Level order is not depth-first" },
    ],
    explanation: { ko: "Preorder로 방문하며 오른쪽 자식을 이전 노드에 연결. O(n).", en: "Visit in preorder, connect right child to previous node. O(n)." },
  },
  {
    id: "tr7", type: "pattern", categoryId: "tree", difficulty: 2,
    question: { ko: "BST에서 두 노드 사이의 거리를 구해야 합니다.", en: "Find distance between two nodes in BST." },
    options: ["BFS", "Find LCA first", "Inorder traversal", "Level-order"], answer: 1,
    optionReasons: [
      { ko: "최단 거리용이지 트리 거리용 아님", en: "For shortest path, not tree distance" },
      { ko: "LCA를 먼저 찾고 각 노드까지 거리 합산 — O(H)", en: "Find LCA first, sum distances to each node — O(H)" },
      { ko: "정렬 순서로는 거리 계산 불가", en: "Can't compute distance from inorder" },
      { ko: "레벨 순서로는 BST 구조 활용 안 됨", en: "Level order doesn't exploit BST structure" },
    ],
    explanation: { ko: "LCA를 먼저 찾고, 각 노드까지의 거리를 합산. O(H).", en: "Find LCA first, sum distances from LCA to each node. O(H)." },
  },
  {
    id: "tr8", type: "complexity", categoryId: "tree", difficulty: 1,
    question: { ko: "균형 이진 트리의 높이는?", en: "Height of balanced binary tree with n nodes?" },
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 1,
    explanation: { ko: "균형 트리는 각 레벨마다 노드가 2배 → 높이 O(log n).", en: "Balanced tree doubles nodes per level → height O(log n)." },
  },
  {
    id: "tr9", type: "pattern", categoryId: "tree", difficulty: 3,
    question: { ko: "이진 트리에서 최대 경로 합 (Max Path Sum)을 구해야 합니다.", en: "Find maximum path sum in binary tree." },
    options: ["Preorder DFS", "Postorder DFS", "BFS", "Inorder DFS"], answer: 1,
    optionReasons: [
      { ko: "전위는 왼/오 최대값을 먼저 알 수 없음", en: "Preorder can't know left/right max first" },
      { ko: "Postorder로 왼/오 최대값 구한 뒤 경로 합 계산", en: "Postorder gets left/right max, then computes path sum" },
      { ko: "레벨별 탐색은 경로 합 추적에 비효율적", en: "Level traversal inefficient for path sum tracking" },
      { ko: "중위 순서는 경로 합과 무관", en: "Inorder is unrelated to path sum" },
    ],
    explanation: { ko: "Postorder로 왼/오 최대값 구하고, 현재 노드 포함 경로 계산.", en: "Postorder to get left/right max, calculate path including current node." },
  },
  {
    id: "tr10", type: "approach", categoryId: "tree", difficulty: 2,
    question: { ko: "트리 문제를 풀 때의 접근 순서는?", en: "Approach order for tree problems?" },
    steps: {
      ko: ["Base case 정의 (null 노드 처리)", "재귀 관계 파악 (왼/오 서브트리 결과로 현재 계산)", "순회 방법 선택 (pre/in/post/level)", "시간복잡도 확인 (보통 O(n))"],
      en: ["Define base case (null node)", "Identify recursion (compute current from left/right)", "Choose traversal (pre/in/post/level)", "Verify complexity (usually O(n))"],
    },
    explanation: { ko: "트리 = 재귀의 천국. Base case부터 명확히.", en: "Trees = recursion paradise. Start with clear base case." },
  },

  // ===== GRAPH (추가 8개) =====
  {
    id: "gr3", type: "pattern", categoryId: "graph", difficulty: 3,
    question: { ko: "가중치 있는 그래프에서 최단 경로 (Dijkstra).", en: "Shortest path in weighted graph (Dijkstra)." },
    options: ["BFS", "DFS", "Dijkstra with Min-Heap", "Bellman-Ford"], answer: 2,
    optionReasons: [
      { ko: "가중치 있으면 BFS로 최단 거리 보장 안 됨", en: "BFS doesn't guarantee shortest with weights" },
      { ko: "음수 가중치 처리 불가", en: "Can't handle negative weights" },
      { ko: "Min-Heap으로 최소 거리 노드 탐색 — O((V+E) log V)", en: "Explore min distance node with Min-Heap — O((V+E) log V)" },
      { ko: "음수 간선용이지 일반 양수 간선에는 과도", en: "For negative edges, overkill for positive-only" },
    ],
    explanation: { ko: "Min-Heap에 (거리, 노드) 저장. 최소 거리 노드 탐색. O((V+E) log V).", en: "Store (distance, node) in Min-Heap. Explore min distance node. O((V+E) log V)." },
  },
  {
    id: "gr4", type: "pattern", categoryId: "graph", difficulty: 3,
    question: { ko: "음수 간선이 있는 그래프의 최단 경로.", en: "Shortest path with negative edges." },
    options: ["Dijkstra", "Bellman-Ford", "BFS", "DFS"], answer: 1,
    optionReasons: [
      { ko: "음수 간선 처리 불가", en: "Can't handle negative edges" },
      { ko: "V-1번 모든 간선 완화로 음수 간선 처리 — O(VE)", en: "Relax all edges V-1 times for negative edges — O(VE)" },
      { ko: "가중치가 있으면 BFS 부적합", en: "BFS not suitable with weights" },
      { ko: "모든 경로 탐색은 불필요", en: "Exhaustive path search unnecessary" },
    ],
    explanation: { ko: "Bellman-Ford는 음수 간선 처리 가능. V-1번 모든 간선 완화. O(VE).", en: "Bellman-Ford handles negative edges. Relax all edges V-1 times. O(VE)." },
  },
  {
    id: "gr5", type: "pattern", categoryId: "graph", difficulty: 2,
    question: { ko: "그래프의 연결 요소(Connected Components) 개수를 세야 합니다.", en: "Count connected components in graph." },
    options: ["BFS", "DFS", "Union-Find", "All of above"], answer: 3,
    optionReasons: [
      { ko: "BFS로 컴포넌트별 탐색 가능", en: "BFS can explore per component" },
      { ko: "DFS로 컴포넌트별 탐색 가능", en: "DFS can explore per component" },
      { ko: "Union-Find로 집합 개수 세기 가능", en: "Union-Find can count sets" },
      { ko: "BFS, DFS, Union-Find 모두 가능", en: "BFS, DFS, and Union-Find all work" },
    ],
    explanation: { ko: "BFS/DFS로 각 컴포넌트 탐색하거나, Union-Find로 집합 개수.", en: "BFS/DFS to explore each component, or Union-Find to count sets." },
  },
  {
    id: "gr6", type: "fillblank", categoryId: "graph", difficulty: 3,
    question: { ko: "Topological Sort (Kahn's Algorithm) — 빈칸 채우기", en: "Topological Sort (Kahn's) — fill blanks" },
    code: `function topologicalSort(graph):
    indegree = [0] * n
    for node in graph:
        for neighbor in graph[node]:
            indegree[neighbor] += 1

    queue = [i for i in range(n) if indegree[i] == ???]
    result = []

    while queue:
        node = queue.pop(0)
        result.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == ???:
                queue.append(neighbor)

    return result if len(result) == n else ???`,
    blanks: [
      { placeholder: { ko: "??? (시작 조건)", en: "??? (start condition)" }, answer: "0", options: ["0", "1", "-1", "n"] },
      { placeholder: { ko: "??? (큐 추가 조건)", en: "??? (enqueue condition)" }, answer: "0", options: ["0", "1", "-1", "n"] },
      { placeholder: { ko: "??? (사이클 있을 때)", en: "??? (if cycle)" }, answer: "[]", options: ["[]", "None", "result", "-1"] },
    ],
    explanation: { ko: "Indegree 0인 노드부터 시작. 간선 제거하며 진행.", en: "Start from indegree 0. Remove edges as we go." },
  },
  {
    id: "gr7", type: "pattern", categoryId: "graph", difficulty: 3,
    question: { ko: "최소 신장 트리 (Minimum Spanning Tree)를 구해야 합니다.", en: "Find Minimum Spanning Tree." },
    options: ["Kruskal's Algorithm", "Prim's Algorithm", "Both work", "Dijkstra"], answer: 2,
    optionReasons: [
      { ko: "간선 정렬 + Union-Find로 가능", en: "Sort edges + Union-Find works" },
      { ko: "Min-Heap으로 가능", en: "Min-Heap approach works" },
      { ko: "Kruskal과 Prim 모두 O(E log E)로 동작", en: "Both Kruskal and Prim work at O(E log E)" },
      { ko: "최단 경로용이지 MST 아님", en: "For shortest paths, not MST" },
    ],
    explanation: { ko: "Kruskal은 간선 정렬 + Union-Find. Prim은 Min-Heap. 둘 다 O(E log E).", en: "Kruskal: sort edges + Union-Find. Prim: Min-Heap. Both O(E log E)." },
  },
  {
    id: "gr8", type: "complexity", categoryId: "graph", difficulty: 2,
    question: { ko: "인접 리스트 그래프에서 DFS 공간복잡도는?", en: "Space complexity of DFS on adjacency list graph?" },
    options: ["O(1)", "O(V)", "O(E)", "O(V + E)"], answer: 1,
    explanation: { ko: "재귀 스택 또는 visited 배열이 O(V).", en: "Recursion stack or visited array is O(V)." },
  },
  {
    id: "gr9", type: "pattern", categoryId: "graph", difficulty: 3,
    question: { ko: "모든 정점 쌍 간의 최단 거리 (All Pairs Shortest Path).", en: "Shortest paths between all pairs of vertices." },
    options: ["Dijkstra V times", "Floyd-Warshall", "BFS V times", "All of above"], answer: 3,
    optionReasons: [
      { ko: "Dijkstra V번 실행 가능", en: "Running Dijkstra V times works" },
      { ko: "O(V³)으로 간결하게 해결", en: "Solves concisely at O(V³)" },
      { ko: "가중치 없는 경우 BFS V번 가능", en: "BFS V times for unweighted case" },
      { ko: "세 가지 방법 모두 정답", en: "All three methods are correct" },
    ],
    explanation: { ko: "Floyd-Warshall이 O(V³)로 간결. Dijkstra V번도 가능.", en: "Floyd-Warshall is O(V³) and concise. Running Dijkstra V times also works." },
  },
  {
    id: "gr10", type: "approach", categoryId: "graph", difficulty: 3,
    question: { ko: "그래프 알고리즘 선택 기준은?", en: "How to choose graph algorithm?" },
    steps: {
      ko: ["최단 거리: BFS(가중치 없음), Dijkstra(양수), Bellman-Ford(음수)", "사이클 탐지: DFS coloring or Union-Find", "위상 정렬: Kahn's or DFS", "MST: Kruskal or Prim"],
      en: ["Shortest path: BFS(unweighted), Dijkstra(positive), Bellman-Ford(negative)", "Cycle detection: DFS coloring or Union-Find", "Topological sort: Kahn's or DFS", "MST: Kruskal or Prim"],
    },
    explanation: { ko: "문제 유형에 따라 알고리즘 선택. 가중치 유무가 핵심.", en: "Choose based on problem type. Edge weights are key factor." },
  },

  // ===== DP (추가 5개) =====
  {
    id: "dp6", type: "pattern", categoryId: "dp", difficulty: 3,
    question: { ko: "배낭 문제 (0/1 Knapsack)를 풀어야 합니다.", en: "Solve 0/1 Knapsack problem." },
    options: ["Greedy", "Dynamic Programming 2D", "Binary Search", "BFS"], answer: 1,
    optionReasons: [
      { ko: "아이템 선택/비선택 조합에 Greedy 부적합", en: "Greedy can't handle select/skip item combinations" },
      { ko: "dp[i][w] = i번째까지 고려, 무게 w의 최대 가치", en: "dp[i][w] = max value with first i items at weight w" },
      { ko: "정렬된 데이터가 아니므로 부적합", en: "Data isn't sorted, not applicable" },
      { ko: "조합 최적화에 BFS 비효율적", en: "BFS inefficient for combinatorial optimization" },
    ],
    explanation: { ko: "dp[i][w] = i번째까지 고려, 무게 w일 때 최대 가치. O(n·W).", en: "dp[i][w] = max value considering first i items with weight w. O(n·W)." },
  },
  {
    id: "dp7", type: "pattern", categoryId: "dp", difficulty: 3,
    question: { ko: "최장 공통 부분 수열 (Longest Common Subsequence).", en: "Longest Common Subsequence (LCS)." },
    options: ["Two Pointers", "DP 2D", "Greedy", "Binary Search"], answer: 1,
    optionReasons: [
      { ko: "순서 유지 비교에 Two Pointers 부적합", en: "Two Pointers can't maintain subsequence comparison" },
      { ko: "dp[i][j]로 두 문자열 비교 — O(n·m)", en: "dp[i][j] compares two strings — O(n·m)" },
      { ko: "최적 부분 구조에 Greedy 보장 없음", en: "No greedy guarantee for optimal substructure" },
      { ko: "정렬된 데이터가 아니므로 부적합", en: "Data isn't sorted, not applicable" },
    ],
    explanation: { ko: "dp[i][j] = s1[i]==s2[j] ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1]). O(n·m).", en: "dp[i][j] = s1[i]==s2[j] ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1]). O(n·m)." },
  },
  {
    id: "dp8", type: "pattern", categoryId: "dp", difficulty: 2,
    question: { ko: "집을 터는데 인접한 집은 털 수 없을 때 최대 금액 (House Robber).", en: "Max money robbing houses, can't rob adjacent (House Robber)." },
    options: ["Greedy", "DP", "Backtracking", "Binary Search"], answer: 1,
    optionReasons: [
      { ko: "인접 제약으로 Greedy 선택 불가", en: "Adjacent constraint prevents greedy choice" },
      { ko: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]) — O(n)", en: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]) — O(n)" },
      { ko: "지수 시간이라 비실용적", en: "Exponential time, impractical" },
      { ko: "정렬과 무관한 문제", en: "Unrelated to sorting" },
    ],
    explanation: { ko: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). O(n) time, O(1) space.", en: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). O(n) time, O(1) space." },
  },
  {
    id: "dp9", type: "fillblank", categoryId: "dp", difficulty: 3,
    question: { ko: "Coin Change DP — 빈칸 채우기", en: "Coin Change DP — fill blanks" },
    code: `function coinChange(coins, amount):
    dp = [Infinity] * (amount + 1)
    dp[0] = ???

    for i from 1 to amount:
        for coin in coins:
            if i >= coin:
                dp[i] = min(dp[i], dp[i - coin] + ???)

    return dp[amount] if dp[amount] != Infinity else ???`,
    blanks: [
      { placeholder: { ko: "??? (base case)", en: "??? (base case)" }, answer: "0", options: ["0", "1", "-1", "Infinity"] },
      { placeholder: { ko: "??? (동전 하나 추가)", en: "??? (add one coin)" }, answer: "1", options: ["1", "coin", "0", "i"] },
      { placeholder: { ko: "??? (불가능)", en: "??? (impossible)" }, answer: "-1", options: ["-1", "0", "Infinity", "None"] },
    ],
    explanation: { ko: "dp[i] = 금액 i를 만드는 최소 동전 수.", en: "dp[i] = minimum coins to make amount i." },
  },
  {
    id: "dp10", type: "pattern", categoryId: "dp", difficulty: 3,
    question: { ko: "문자열 편집 거리 (Edit Distance)를 구해야 합니다.", en: "Find Edit Distance between two strings." },
    options: ["Greedy", "DP 2D", "Two Pointers", "Hash Map"], answer: 1,
    optionReasons: [
      { ko: "최적 편집 순서에 Greedy 보장 없음", en: "No greedy guarantee for optimal edit sequence" },
      { ko: "삽입/삭제/교체 3가지 연산의 최소 비용 — O(n·m)", en: "Minimum cost of insert/delete/replace — O(n·m)" },
      { ko: "순차 비교만으로 편집 거리 계산 불가", en: "Sequential comparison can't compute edit distance" },
      { ko: "문자열 편집에 HashMap 부적합", en: "HashMap not suitable for string editing" },
    ],
    explanation: { ko: "dp[i][j] = s1[0..i]를 s2[0..j]로 만드는 최소 편집. 삽입/삭제/교체.", en: "dp[i][j] = min edits to transform s1[0..i] to s2[0..j]. Insert/delete/replace." },
  },

  // ===== GREEDY (추가 7개) =====
  {
    id: "gd4", type: "pattern", categoryId: "greedy", difficulty: 2,
    question: { ko: "회의실 배정 — 최소 회의실 개수 구하기.", en: "Minimum meeting rooms needed." },
    options: ["Greedy sort by start", "Greedy sort by end", "Min-Heap", "Dynamic Programming"], answer: 2,
    optionReasons: [
      { ko: "시작 시간 정렬만으로는 최소 회의실 못 구함", en: "Sort by start alone can't find minimum rooms" },
      { ko: "끝 시간 정렬만으로는 겹침 추적 어려움", en: "Sort by end alone can't track overlaps easily" },
      { ko: "시작 시간 정렬 + Min-Heap으로 끝 시간 추적 — O(n log n)", en: "Sort by start + Min-Heap for end times — O(n log n)" },
      { ko: "상태 전이 없이 DP 불필요", en: "No state transitions, DP unnecessary" },
    ],
    explanation: { ko: "시작 시간 정렬 후 Min-Heap으로 끝나는 시간 추적. O(n log n).", en: "Sort by start, use Min-Heap to track end times. O(n log n)." },
  },
  {
    id: "gd5", type: "pattern", categoryId: "greedy", difficulty: 2,
    question: { ko: "태스크 스케줄러 — 쿨다운이 있을 때 최소 시간.", en: "Task scheduler with cooldown — minimum time." },
    options: ["Greedy frequency count", "Dynamic Programming", "Binary Search", "BFS"], answer: 0,
    optionReasons: [
      { ko: "최빈 태스크 기준 슬롯 계산 — O(n) 최적", en: "Calculate slots from most frequent task — O(n) optimal" },
      { ko: "가능하지만 Greedy가 더 효율적", en: "Possible but Greedy is more efficient" },
      { ko: "스케줄링에 Binary Search 부적합", en: "Binary Search not suitable for scheduling" },
      { ko: "순차 탐색이 아닌 빈도 기반 문제", en: "Frequency-based, not sequential traversal" },
    ],
    explanation: { ko: "가장 빈도 높은 태스크 기준으로 슬롯 계산. O(n).", en: "Calculate slots based on most frequent task. O(n)." },
  },
  {
    id: "gd6", type: "fillblank", categoryId: "greedy", difficulty: 2,
    question: { ko: "Jump Game — 빈칸 채우기", en: "Jump Game — fill blanks" },
    code: `function canJump(nums):
    farthest = 0

    for i in range(len(nums)):
        if i > farthest:
            return ???
        farthest = max(farthest, i + ???)
        if farthest >= len(nums) - 1:
            return ???

    return ???`,
    blanks: [
      { placeholder: { ko: "??? (도달 불가)", en: "??? (unreachable)" }, answer: "False", options: ["False", "True", "0", "-1"] },
      { placeholder: { ko: "??? (도달 범위)", en: "??? (reach range)" }, answer: "nums[i]", options: ["nums[i]", "i", "farthest", "1"] },
      { placeholder: { ko: "??? (끝 도달)", en: "??? (reached end)" }, answer: "True", options: ["True", "False", "farthest", "i"] },
      { placeholder: { ko: "??? (최종 반환)", en: "??? (final return)" }, answer: "True", options: ["True", "False", "farthest", "-1"] },
    ],
    explanation: { ko: "각 위치에서 도달 가능한 최대 인덱스를 그리디하게 추적.", en: "Greedily track farthest reachable index from each position." },
  },
  {
    id: "gd7", type: "pattern", categoryId: "greedy", difficulty: 3,
    question: { ko: "주유소 순환 — 시작 위치 찾기 (Gas Station).", en: "Find starting gas station for circular tour." },
    options: ["Brute Force", "Greedy single pass", "Binary Search", "Dynamic Programming"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "한 번 순회로 부족 지점 다음부터 시작 — O(n)", en: "Single pass, start after deficit point — O(n)" },
      { ko: "순환 구조에 Binary Search 부적합", en: "Binary Search not suitable for circular structure" },
      { ko: "상태 전이 없이 DP 불필요", en: "No state transitions, DP unnecessary" },
    ],
    explanation: { ko: "총 gas ≥ 총 cost면 가능. 부족해지는 지점 다음부터 시작. O(n).", en: "If total gas ≥ total cost, possible. Start from point after deficit. O(n)." },
  },
  {
    id: "gd8", type: "complexity", categoryId: "greedy", difficulty: 1,
    question: { ko: "Greedy 알고리즘의 일반적인 시간복잡도는?", en: "Typical time complexity of Greedy algorithms?" },
    options: ["O(1)", "O(n)", "O(n log n)", "Depends on sorting"], answer: 3,
    explanation: { ko: "정렬이 필요하면 O(n log n), 아니면 O(n).", en: "O(n log n) if sorting needed, O(n) otherwise." },
  },
  {
    id: "gd9", type: "pattern", categoryId: "greedy", difficulty: 2,
    question: { ko: "파티션 라벨 — 같은 문자를 한 파티션에 (Partition Labels).", en: "Partition string so same char in one partition." },
    options: ["Brute Force", "Greedy with last occurrence", "Dynamic Programming", "Hash Map only"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "마지막 위치 기준 파티션 끝 확장 — O(n)", en: "Extend partition end by last occurrence — O(n)" },
      { ko: "상태 전이 없이 DP 불필요", en: "No state transitions, DP unnecessary" },
      { ko: "HashMap은 도구이지 단독 전략 아님", en: "HashMap is a tool, not a standalone strategy" },
    ],
    explanation: { ko: "각 문자의 마지막 위치 저장. 현재 파티션 끝을 확장하며 분할. O(n).", en: "Store last occurrence of each char. Extend partition end greedily. O(n)." },
  },
  {
    id: "gd10", type: "approach", categoryId: "greedy", difficulty: 2,
    question: { ko: "Greedy를 적용할 수 있는 조건은?", en: "When can Greedy be applied?" },
    steps: {
      ko: ["탐욕적 선택 속성: 각 단계의 최선이 전체 최선", "최적 부분 구조: 부분 문제의 최적해가 전체 최적해", "반례가 없는지 검증 필수", "정렬이 필요한 경우가 많음"],
      en: ["Greedy choice property: local optimum leads to global", "Optimal substructure: optimal solution contains optimal subproblems", "Must verify no counterexamples", "Often requires sorting first"],
    },
    explanation: { ko: "Greedy는 빠르지만 항상 최적은 아님. 검증 필수.", en: "Greedy is fast but not always optimal. Verification required." },
  },

  // ===== HEAP (추가 8개) =====
  {
    id: "hp3", type: "pattern", categoryId: "heap", difficulty: 3,
    question: { ko: "스트림에서 중앙값을 실시간으로 구해야 합니다 (Median of Stream).", en: "Find median from data stream in real-time." },
    options: ["Sorting each time", "Two Heaps (Max-Heap + Min-Heap)", "Binary Search", "Hash Map"], answer: 1,
    optionReasons: [
      { ko: "매번 정렬하면 O(n log n)으로 비효율적", en: "Sorting each time is O(n log n), inefficient" },
      { ko: "Max-Heap(작은 절반) + Min-Heap(큰 절반)으로 중앙값 추적", en: "Max-Heap (small half) + Min-Heap (large half) tracks median" },
      { ko: "삽입 위치 찾기는 O(n)이라 비효율적", en: "Finding insert position is O(n), inefficient" },
      { ko: "빈도 카운트가 아닌 순서 기반 문제", en: "Order-based, not frequency-based" },
    ],
    explanation: { ko: "Max-Heap(작은 절반) + Min-Heap(큰 절반). 중앙값은 두 top의 평균. O(log n) 삽입.", en: "Max-Heap (smaller half) + Min-Heap (larger half). Median is average of tops. O(log n) insert." },
  },
  {
    id: "hp4", type: "pattern", categoryId: "heap", difficulty: 2,
    question: { ko: "K번째로 자주 등장하는 원소들 (Top K Frequent Elements).", en: "Find K most frequent elements." },
    options: ["Sort by frequency", "Min-Heap of size K", "Hash Map + sorting", "All of above"], answer: 3,
    optionReasons: [
      { ko: "O(n log n)으로 가능", en: "O(n log n) is possible" },
      { ko: "Min-Heap 크기 K로 O(n log k)", en: "Min-Heap size K at O(n log k)" },
      { ko: "HashMap + 정렬로도 가능", en: "HashMap + sorting also works" },
      { ko: "세 가지 방법 모두 정답", en: "All three methods are correct" },
    ],
    explanation: { ko: "HashMap으로 빈도 세고, Min-Heap 크기 K 유지 또는 정렬. O(n log k).", en: "Count frequency with HashMap, maintain Min-Heap size K or sort. O(n log k)." },
  },
  {
    id: "hp5", type: "fillblank", categoryId: "heap", difficulty: 2,
    question: { ko: "Kth Largest in Stream (Min-Heap) — 빈칸 채우기", en: "Kth Largest in Stream (Min-Heap) — fill blanks" },
    code: `class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = nums
        heapify(self.heap)
        while len(self.heap) > k:
            ???

    def add(self, val):
        heappush(self.heap, val)
        if len(self.heap) > self.k:
            ???
        return ???`,
    blanks: [
      { placeholder: { ko: "??? (초기화 시 제거)", en: "??? (remove in init)" }, answer: "heappop(self.heap)", options: ["heappop(self.heap)", "heappush(self.heap, val)", "self.heap.pop()", "del self.heap[0]"] },
      { placeholder: { ko: "??? (추가 시 제거)", en: "??? (remove on add)" }, answer: "heappop(self.heap)", options: ["heappop(self.heap)", "heappush(self.heap, val)", "self.heap.pop()", "return val"] },
      { placeholder: { ko: "??? (K번째 큰 값)", en: "??? (Kth largest)" }, answer: "self.heap[0]", options: ["self.heap[0]", "self.heap[-1]", "max(self.heap)", "val"] },
    ],
    explanation: { ko: "Min-Heap 크기를 K로 유지. top이 K번째 큰 값.", en: "Maintain Min-Heap size K. Top is Kth largest." },
  },
  {
    id: "hp6", type: "pattern", categoryId: "heap", difficulty: 3,
    question: { ko: "구간을 병합하여 최소 구간 개수 (Minimum Interval to Include Each Query).", en: "Minimum interval covering each query." },
    options: ["Brute Force", "Min-Heap + sorting", "Binary Search", "Dynamic Programming"], answer: 1,
    optionReasons: [
      { ko: "O(n·q)로 비효율적", en: "O(n·q) is inefficient" },
      { ko: "정렬 후 Min-Heap으로 커버 구간 추적 — O(n log n)", en: "Sort + Min-Heap to track covering intervals — O(n log n)" },
      { ko: "구간 검색에 단독으로 부족", en: "Binary Search alone insufficient for intervals" },
      { ko: "상태 전이 없이 DP 불필요", en: "No state transitions, DP unnecessary" },
    ],
    explanation: { ko: "쿼리 정렬 후 Min-Heap으로 현재 커버 가능한 구간 추적. O(n log n).", en: "Sort queries, use Min-Heap to track currently covering intervals. O(n log n)." },
  },
  {
    id: "hp7", type: "complexity", categoryId: "heap", difficulty: 1,
    question: { ko: "Heap에서 최대/최소값 조회 시간복잡도는?", en: "Time complexity of peek (min/max) in Heap?" },
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0,
    explanation: { ko: "Heap의 root가 항상 최대/최소 → O(1).", en: "Heap root is always min/max → O(1)." },
  },
  {
    id: "hp8", type: "pattern", categoryId: "heap", difficulty: 2,
    question: { ko: "가장 가까운 K개의 점 (K Closest Points).", en: "Find K closest points to origin." },
    options: ["Sort all points", "Max-Heap of size K", "Quick Select", "Both B and C"], answer: 3,
    optionReasons: [
      { ko: "O(n log n)으로 가능하지만 단독 답 아님", en: "O(n log n) works but not the only answer" },
      { ko: "Max-Heap 크기 K로 O(n log k)", en: "Max-Heap size K at O(n log k)" },
      { ko: "평균 O(n)으로 효율적", en: "Average O(n), efficient" },
      { ko: "Max-Heap과 Quick Select 모두 정답", en: "Both Max-Heap and Quick Select are correct" },
    ],
    explanation: { ko: "Max-Heap 크기 K 유지 또는 Quick Select로 O(n) 평균. Heap은 O(n log k).", en: "Max-Heap size K is O(n log k). Quick Select averages O(n)." },
  },
  {
    id: "hp9", type: "pattern", categoryId: "heap", difficulty: 3,
    question: { ko: "여러 정렬된 배열에서 가장 작은 범위 (Smallest Range Covering K Lists).", en: "Smallest range covering elements from K sorted lists." },
    options: ["Brute Force", "Min-Heap tracking all lists", "Binary Search", "Two Pointers"], answer: 1,
    optionReasons: [
      { ko: "O(n² · k)로 비효율적", en: "O(n²·k) is inefficient" },
      { ko: "각 리스트의 현재 원소를 Min-Heap에 저장하며 범위 추적", en: "Store current element from each list in Min-Heap, track range" },
      { ko: "정렬된 다중 리스트에 Binary Search 단독 부적합", en: "Binary Search alone insufficient for multiple sorted lists" },
      { ko: "다중 리스트 병합에 Two Pointers 부족", en: "Two Pointers insufficient for multi-list merge" },
    ],
    explanation: { ko: "Min-Heap에 각 리스트의 현재 원소 저장. 최소값 제거하며 범위 추적.", en: "Store current element from each list in Min-Heap. Track range while removing min." },
  },
  {
    id: "hp10", type: "approach", categoryId: "heap", difficulty: 2,
    question: { ko: "Heap을 사용해야 하는 신호는?", en: "Signals to use Heap?" },
    steps: {
      ko: ["K번째 큰/작은 원소", "실시간 최대/최소값 추적", "우선순위 기반 처리", "여러 정렬된 스트림 병합"],
      en: ["Kth largest/smallest element", "Real-time min/max tracking", "Priority-based processing", "Merging sorted streams"],
    },
    explanation: { ko: "'K번째' 또는 '실시간 최대/최소' = Heap 신호.", en: "'Kth' or 'real-time min/max' = Heap signal." },
  },

  // ===== SORTING (추가 5개) =====
  {
    id: "cx6", type: "complexity", categoryId: "sorting", difficulty: 2,
    question: { ko: "Quick Sort의 평균/최악 시간복잡도는?", en: "Average/worst time complexity of Quick Sort?" },
    options: ["O(n log n) / O(n log n)", "O(n log n) / O(n²)", "O(n²) / O(n²)", "O(n) / O(n log n)"], answer: 1,
    explanation: { ko: "평균 O(n log n), 최악(이미 정렬됨) O(n²). Randomized pivot으로 완화.", en: "Average O(n log n), worst (already sorted) O(n²). Mitigate with randomized pivot." },
  },
  {
    id: "cx7", type: "pattern", categoryId: "sorting", difficulty: 2,
    question: { ko: "안정 정렬 (Stable Sort)이 필요할 때 사용하는 알고리즘은?", en: "Which algorithm for stable sort?" },
    options: ["Quick Sort", "Merge Sort", "Heap Sort", "Selection Sort"], answer: 1,
    optionReasons: [
      { ko: "불안정 정렬 — 동일 키의 순서 보장 안 됨", en: "Unstable — doesn't preserve order of equal keys" },
      { ko: "안정 정렬 — 동일 키의 상대 순서 유지", en: "Stable — preserves relative order of equal keys" },
      { ko: "불안정 정렬", en: "Unstable sort" },
      { ko: "O(n²)으로 비효율적이고 불안정", en: "O(n²) inefficient and unstable" },
    ],
    explanation: { ko: "Merge Sort는 안정 정렬. Quick/Heap Sort는 불안정.", en: "Merge Sort is stable. Quick/Heap Sort are unstable." },
  },
  {
    id: "cx8", type: "pattern", categoryId: "sorting", difficulty: 1,
    question: { ko: "정수 배열을 O(n)에 정렬하려면? (범위가 작을 때)", en: "Sort integer array in O(n) when range is small?" },
    options: ["Merge Sort", "Quick Sort", "Counting Sort", "Heap Sort"], answer: 2,
    optionReasons: [
      { ko: "O(n log n) — 범위 작을 때 O(n) 가능", en: "O(n log n) — O(n) possible when range is small" },
      { ko: "O(n log n) — 범위와 무관", en: "O(n log n) — regardless of range" },
      { ko: "범위 k가 작을 때 O(n+k)로 선형 정렬", en: "O(n+k) linear sort when range k is small" },
      { ko: "O(n log n) — 범위와 무관", en: "O(n log n) — regardless of range" },
    ],
    explanation: { ko: "Counting Sort는 범위가 작을 때 O(n+k). k=값의 범위.", en: "Counting Sort is O(n+k) when range k is small." },
  },
  {
    id: "cx9", type: "complexity", categoryId: "sorting", difficulty: 2,
    question: { ko: "Radix Sort의 시간복잡도는?", en: "Time complexity of Radix Sort?" },
    options: ["O(n log n)", "O(n·k)", "O(n²)", "O(k log n)"], answer: 1,
    explanation: { ko: "k=자릿수. 각 자릿수마다 O(n) 정렬 → O(n·k).", en: "k=number of digits. O(n) sort per digit → O(n·k)." },
  },
  {
    id: "cx10", type: "approach", categoryId: "sorting", difficulty: 2,
    question: { ko: "정렬 알고리즘 선택 기준은?", en: "How to choose sorting algorithm?" },
    steps: {
      ko: ["일반적: Merge Sort (안정, O(n log n) 보장)", "In-place 필요: Quick Sort (평균 빠름)", "거의 정렬됨: Insertion Sort", "범위 작음: Counting/Radix Sort"],
      en: ["General: Merge Sort (stable, guaranteed O(n log n))", "In-place needed: Quick Sort (fast average)", "Nearly sorted: Insertion Sort", "Small range: Counting/Radix Sort"],
    },
    explanation: { ko: "데이터 특성과 제약 조건에 따라 선택.", en: "Choose based on data characteristics and constraints." },
  },

  // ===== HARD PROBLEMS (difficulty 3) =====

  // TWO POINTERS (Hard)
  {
    id: "tp_h1", type: "pattern", categoryId: "two-pointers", difficulty: 3,
    question: { ko: "정렬된 배열에서 세 수의 곱이 target에 가장 가까운 트리플릿 (3Sum Closest 변형).", en: "Find triplet with product closest to target in sorted array." },
    options: ["Brute Force O(n³)", "Two Pointers with outer loop O(n²)", "Binary Search O(n² log n)", "Hash Map"], answer: 1,
    optionReasons: [
      { ko: "O(n³)으로 비효율적", en: "O(n³) is inefficient" },
      { ko: "첫 수 고정 + Two Pointers로 곱 계산 — O(n²)", en: "Fix first + Two Pointers for product — O(n²)" },
      { ko: "O(n² log n)으로 가능하지만 비효율적", en: "O(n² log n) possible but inefficient" },
      { ko: "곱 계산에 HashMap 부적합", en: "HashMap not suitable for product calculation" },
    ],
    explanation: { ko: "첫 수 고정 후 Two Pointers로 곱 계산. 차이 추적하며 최선 갱신. O(n²).", en: "Fix first number, use Two Pointers to calculate product. Track min difference. O(n²)." },
  },
  {
    id: "tp_h2", type: "pattern", categoryId: "two-pointers", difficulty: 3,
    question: { ko: "두 배열에서 각각 한 원소씩 선택해 절댓값 차이가 k 이하인 쌍의 최대 개수.", en: "Max pairs from two arrays with absolute difference ≤ k." },
    options: ["Brute Force", "Sort both + Two Pointers greedy", "Hash Map", "Binary Search"], answer: 1,
    optionReasons: [
      { ko: "O(n·m)으로 비효율적", en: "O(n·m) is inefficient" },
      { ko: "양쪽 정렬 후 그리디 매칭 — O(n log n)", en: "Sort both, greedy matching — O(n log n)" },
      { ko: "쌍 매칭에 HashMap 단독 부족", en: "HashMap alone insufficient for pair matching" },
      { ko: "단독으로 쌍 매칭 불가", en: "Can't match pairs with Binary Search alone" },
    ],
    explanation: { ko: "양쪽 정렬 후 Two Pointers. 차이 k 이하면 매칭, 초과면 작은 쪽 이동.", en: "Sort both, use Two Pointers. If diff ≤ k, match. If > k, move smaller." },
  },
  {
    id: "tp_h3", type: "fillblank", categoryId: "two-pointers", difficulty: 3,
    question: { ko: "Trapping Rain Water — 빈칸 채우기", en: "Trapping Rain Water — fill blanks" },
    code: `function trap(height):
    left = 0, right = height.length - 1
    leftMax = 0, rightMax = 0
    water = 0

    while left < right:
        if height[left] < height[right]:
            if height[left] >= leftMax:
                leftMax = ???
            else:
                water += ???
            left++
        else:
            if height[right] >= rightMax:
                rightMax = ???
            else:
                water += ???
            right--

    return water`,
    blanks: [
      { placeholder: { ko: "??? (leftMax 갱신)", en: "??? (update leftMax)" }, answer: "height[left]", options: ["height[left]", "height[right]", "leftMax", "water"] },
      { placeholder: { ko: "??? (왼쪽 물)", en: "??? (left water)" }, answer: "leftMax - height[left]", options: ["leftMax - height[left]", "height[left]", "leftMax", "rightMax - height[left]"] },
      { placeholder: { ko: "??? (rightMax 갱신)", en: "??? (update rightMax)" }, answer: "height[right]", options: ["height[right]", "height[left]", "rightMax", "water"] },
      { placeholder: { ko: "??? (오른쪽 물)", en: "??? (right water)" }, answer: "rightMax - height[right]", options: ["rightMax - height[right]", "height[right]", "rightMax", "leftMax - height[right]"] },
    ],
    explanation: { ko: "양쪽에서 포인터 이동하며 낮은 쪽 기준으로 물 계산. O(n).", en: "Move pointers from both ends, calculate water based on lower side. O(n)." },
  },

  // SLIDING WINDOW (Hard)
  {
    id: "sw_h1", type: "pattern", categoryId: "sliding-window", difficulty: 3,
    question: { ko: "최대 k번 문자 교체 후 가장 긴 같은 문자 연속 (Longest Repeating Character Replacement).", en: "Longest substring with same char after at most k replacements." },
    options: ["Brute Force", "Sliding Window + frequency count", "Binary Search", "Dynamic Programming"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "윈도우 길이 - 최빈 문자 ≤ k 유지하며 확장 — O(n)", en: "Expand while (window - max freq) ≤ k — O(n)" },
      { ko: "문자 교체 문제에 Binary Search 부적합", en: "Binary Search not suitable for char replacement" },
      { ko: "상태 전이 복잡해 DP 불필요", en: "Complex state transitions, DP unnecessary" },
    ],
    explanation: { ko: "윈도우 길이 - 최빈 문자 개수 ≤ k 유지하며 확장. O(n).", en: "Expand window while (window length - max frequency) ≤ k. O(n)." },
  },
  {
    id: "sw_h2", type: "pattern", categoryId: "sliding-window", difficulty: 3,
    question: { ko: "두 문자열 s1, s2에서 s1의 순열이 s2의 부분문자열인지 (Permutation in String).", en: "Check if s1's permutation is substring of s2." },
    options: ["Brute Force all permutations", "Sliding Window + char frequency", "Hash Map only", "Two Pointers"], answer: 1,
    optionReasons: [
      { ko: "n!개 순열 생성은 비현실적", en: "Generating n! permutations is impractical" },
      { ko: "고정 윈도우 + 문자 빈도 비교 — O(n)", en: "Fixed window + char frequency comparison — O(n)" },
      { ko: "HashMap만으로 윈도우 이동 로직 부족", en: "HashMap alone lacks window movement logic" },
      { ko: "단조성 없어 Two Pointers 부적합", en: "No monotonic property for Two Pointers" },
    ],
    explanation: { ko: "고정 윈도우(s1 길이)로 문자 빈도 비교. 일치하면 true. O(n).", en: "Fixed window of s1's length, compare char frequencies. Match = true. O(n)." },
  },
  {
    id: "sw_h3", type: "fillblank", categoryId: "sliding-window", difficulty: 3,
    question: { ko: "Minimum Window Substring — 빈칸 채우기", en: "Minimum Window Substring — fill blanks" },
    code: `function minWindow(s, t):
    need = Counter(t)
    have = {}
    formed = 0, required = len(need)
    left = 0, minLen = infinity, result = ""

    for right in range(len(s)):
        char = s[right]
        have[char] = have.get(char, 0) + 1
        if char in need and have[char] == need[char]:
            formed += 1

        while formed == required:
            if right - left + 1 < minLen:
                minLen = right - left + 1
                result = s[left:right+1]

            leftChar = s[left]
            have[leftChar] -= 1
            if leftChar in need and have[leftChar] < ???:
                formed -= 1
            left += 1

    return result`,
    blanks: [
      { placeholder: { ko: "??? (필요 개수)", en: "??? (required count)" }, answer: "need[leftChar]", options: ["need[leftChar]", "have[leftChar]", "1", "0"] },
    ],
    explanation: { ko: "윈도우 확장하며 조건 만족 시 축소. 최소 길이 기록. O(n).", en: "Expand window until satisfied, then shrink. Track minimum length. O(n)." },
  },

  // BINARY SEARCH (Hard)
  {
    id: "bs_h1", type: "pattern", categoryId: "binary-search", difficulty: 3,
    question: { ko: "정렬된 행렬(행/열 모두 정렬)에서 K번째로 작은 원소.", en: "Kth smallest element in sorted matrix (rows and columns sorted)." },
    options: ["Heap all elements", "Binary Search on value range", "Merge K sorted lists", "Linear scan"], answer: 1,
    optionReasons: [
      { ko: "한 번만 매칭하면 되므로 해시 불필요", en: "Only need single match, hash unnecessary" },
      { ko: "한 방향으로만 회전, 정렬된 부분 활용 — O(log n)", en: "One direction rotation, exploit sorted portion — O(log n)" },
      { ko: "O(n)으로 가능하지만 O(log n)이 최적", en: "O(n) works but O(log n) is optimal" },
      { ko: "정렬이 깨진 배열에 재정렬은 과도", en: "Re-sorting a rotated array is overkill" },
    ],
    explanation: { ko: "값 범위에 Binary Search. mid 이하 원소 개수를 세어 K 찾기. O(n log(max-min)).", en: "Binary search on value range. Count elements ≤ mid to find K. O(n log(max-min))." },
  },
  {
    id: "bs_h2", type: "pattern", categoryId: "binary-search", difficulty: 3,
    question: { ko: "N개의 바나나 더미, H시간 내에 모두 먹는 최소 속도 K (Koko Eating Bananas).", en: "Minimum eating speed K to finish N piles in H hours." },
    options: ["Linear search K", "Binary Search on K", "Greedy", "Dynamic Programming"], answer: 1,
    optionReasons: [
      { ko: "O(n)으로 가능하지만 최적 아님", en: "O(n) works but not optimal" },
      { ko: "답의 범위에 Binary Search — O(n log(max-min))", en: "Binary Search on answer range — O(n log(max-min))" },
      { ko: "모든 쌍 정렬은 O(n²)으로 비효율적", en: "Sorting all pairs is O(n²), inefficient" },
      { ko: "단독으로 쌍 탐색 어려움", en: "Hard to search pairs with Two Pointers alone" },
    ],
    explanation: { ko: "K 범위(1~max pile)에 Binary Search. 각 K로 H 내 가능한지 체크. O(n log max).", en: "Binary search on K (1 to max pile). Check if possible within H hours. O(n log max)." },
  },
  {
    id: "bs_h3", type: "pattern", categoryId: "binary-search", difficulty: 3,
    question: { ko: "두 정렬된 배열의 중앙값 (Median of Two Sorted Arrays) O(log(min(m,n))).", en: "Median of two sorted arrays in O(log(min(m,n)))." },
    options: ["Merge both O(m+n)", "Binary Search on partition", "Two Pointers", "Heap"], answer: 1,
    optionReasons: [
      { ko: "O(n)으로 가능하지만 최적 아님", en: "O(n) works but not optimal" },
      { ko: "행렬을 가상 1D 배열로 보고 Binary Search — O(log(n·m))", en: "Treat matrix as virtual 1D array, Binary Search — O(log(n·m))" },
      { ko: "정렬된 행렬에 Hash 불필요", en: "Hash unnecessary for sorted matrix" },
      { ko: "Two Pointers는 2D에 적용 어려움", en: "Two Pointers hard to apply in 2D" },
    ],
    explanation: { ko: "작은 배열에 Binary Search로 파티션 위치 찾기. 양쪽 균형 맞추기.", en: "Binary search on smaller array's partition. Balance both sides to find median." },
  },

  // HASH MAP (Hard)
  {
    id: "hm_h1", type: "pattern", categoryId: "hash-map", difficulty: 3,
    question: { ko: "최소 윈도우에서 모든 단어를 정확히 한 번씩 포함 (Substring with Concatenation).", en: "Minimum window containing all words exactly once (concatenation)." },
    options: ["Brute Force", "Sliding Window + HashMap of word counts", "Two Pointers only", "Trie"], answer: 1,
    optionReasons: [
      { ko: "매번 정렬은 O(n² log n)으로 비효율적", en: "Sorting each time is O(n² log n), inefficient" },
      { ko: "두 HashMap 비교로 O(n) 아나그램 확인", en: "Two HashMap comparison for O(n) anagram check" },
      { ko: "정렬된 데이터가 아니므로 부적합", en: "Data isn't sorted, not applicable" },
      { ko: "문자열 비교에 Trie는 과도", en: "Trie is overkill for string comparison" },
    ],
    explanation: { ko: "단어 길이로 고정 윈도우. 단어별 빈도를 HashMap으로 추적. O(n·k).", en: "Fixed window by word length. Track word frequencies with HashMap. O(n·k)." },
  },
  {
    id: "hm_h2", type: "pattern", categoryId: "hash-map", difficulty: 3,
    question: { ko: "배열에서 연속되지 않은 부분수열 중 합이 target인 개수 (Combination Sum IV 변형).", en: "Count non-contiguous subsequences with sum = target." },
    options: ["Backtracking", "DP + HashMap", "Two Pointers", "Greedy"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "Prefix Sum을 HashMap에 저장하여 O(n)에 해결", en: "Store prefix sums in HashMap for O(n) solution" },
      { ko: "나눗셈이 포함되면 Sliding Window 부적합", en: "Sliding Window doesn't work with division" },
      { ko: "DP는 가능하지만 HashMap이 더 효율적", en: "DP works but HashMap is more efficient" },
    ],
    explanation: { ko: "DP로 각 원소 포함/미포함. HashMap으로 부분합 메모이제이션. O(n·target).", en: "DP with include/exclude. HashMap for partial sum memoization. O(n·target)." },
  },
  {
    id: "hm_h3", type: "fillblank", categoryId: "hash-map", difficulty: 3,
    question: { ko: "LRU Cache — 빈칸 채우기", en: "LRU Cache — fill blanks" },
    code: `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # key -> node
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key):
        if key in self.cache:
            self._remove(self.cache[key])
            self._add(self.cache[key])
            return self.cache[key].value
        return ???

    def put(self, key, value):
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add(node)
        self.cache[key] = node
        if len(self.cache) > self.capacity:
            lru = self.head.next
            self._remove(lru)
            del self.cache[???]`,
    blanks: [
      { placeholder: { ko: "??? (키 없을 때)", en: "??? (key not found)" }, answer: "-1", options: ["-1", "None", "0", "False"] },
      { placeholder: { ko: "??? (제거할 키)", en: "??? (key to remove)" }, answer: "lru.key", options: ["lru.key", "key", "lru.value", "self.head.key"] },
    ],
    explanation: { ko: "HashMap + 이중 연결 리스트로 O(1) get/put. MRU를 tail 앞에, LRU는 head 다음.", en: "HashMap + doubly linked list for O(1) get/put. MRU near tail, LRU near head." },
  },

  // STACK/QUEUE (Hard)
  {
    id: "sq_h1", type: "pattern", categoryId: "stack-queue", difficulty: 3,
    question: { ko: "히스토그램 최대 직사각형 응용 — 행렬에서 1로만 이루어진 최대 직사각형.", en: "Maximal rectangle in matrix with only 1s (histogram application)." },
    options: ["Brute Force", "Monotone Stack per row", "Dynamic Programming", "BFS"], answer: 1,
    optionReasons: [
      { ko: "재귀 가능하지만 스택이 표준", en: "Recursion works but Stack is standard" },
      { ko: "중첩 표현식을 스택으로 추적 — 최적", en: "Track nested expressions with Stack — optimal" },
      { ko: "FIFO 순서는 중첩 계산에 부적합", en: "FIFO doesn't suit nested evaluation" },
      { ko: "정렬된 데이터가 아님", en: "Data isn't sorted" },
    ],
    explanation: { ko: "각 행을 히스토그램으로 변환. Monotone Stack으로 최대 직사각형. O(n·m).", en: "Convert each row to histogram. Use Monotone Stack for max rectangle. O(n·m)." },
  },
  {
    id: "sq_h2", type: "pattern", categoryId: "stack-queue", difficulty: 3,
    question: { ko: "중첩된 리스트의 iterator 구현 (Flatten Nested List Iterator).", en: "Implement iterator for nested list." },
    options: ["Recursion", "Stack with pre-processing", "Queue", "Hash Map"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "단조 스택으로 O(n)에 다음 큰/작은 온도 찾기", en: "Monotone Stack finds next warmer day in O(n)" },
      { ko: "순서 기반 문제에 HashMap 부적합", en: "HashMap not suitable for order-based problem" },
      { ko: "정렬하면 원래 인덱스 정보 손실", en: "Sorting loses original index information" },
    ],
    explanation: { ko: "Stack에 역순으로 push. next() 호출 시 정수 나올 때까지 펼치기.", en: "Push to stack in reverse. On next(), unwrap until integer found." },
  },
  {
    id: "sq_h3", type: "pattern", categoryId: "stack-queue", difficulty: 3,
    question: { ko: "슬라이딩 윈도우 최대값 (Sliding Window Maximum) O(n).", en: "Sliding window maximum in O(n)." },
    options: ["Heap O(n log k)", "Monotone Deque O(n)", "Binary Search", "Stack"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "단조 감소 스택으로 O(n)에 면적 최적화", en: "Monotone decreasing stack optimizes area in O(n)" },
      { ko: "2D 히스토그램에 Binary Search 부적합", en: "Binary Search not suitable for 2D histogram" },
      { ko: "행별 히스토그램 + 스택이 핵심", en: "Row histogram + Stack is the key approach" },
    ],
    explanation: { ko: "Monotone decreasing deque. 윈도우 벗어난 인덱스 제거, 작은 값 제거. O(n).", en: "Monotone decreasing deque. Remove out-of-window indices and smaller values. O(n)." },
  },

  // BFS/DFS (Hard)
  {
    id: "bd_h1", type: "pattern", categoryId: "bfs-dfs", difficulty: 3,
    question: { ko: "단어 사다리 — 한 글자씩 바꿔 start에서 end로 최단 변환 (Word Ladder).", en: "Shortest transformation from start to end word, one letter at a time." },
    options: ["DFS", "BFS with word list", "Dynamic Programming", "Greedy"], answer: 1,
    optionReasons: [
      { ko: "상태 공간 탐색에 DFS 단독 비효율적", en: "DFS alone inefficient for state space search" },
      { ko: "최소 비용 상태 탐색 = BFS — 최적", en: "Minimum cost state search = BFS — optimal" },
      { ko: "비트마스크 상태에 DP도 가능하지만 BFS가 표준", en: "DP with bitmask possible but BFS is standard" },
      { ko: "상태 공간에 Greedy 보장 없음", en: "No greedy guarantee in state space" },
    ],
    explanation: { ko: "BFS로 레벨별 탐색. 각 단어에서 한 글자 바꿔 사전에 있는지 확인. O(n·m²).", en: "BFS level-by-level. Try changing each letter to check if in dictionary. O(n·m²)." },
  },
  {
    id: "bd_h2", type: "pattern", categoryId: "bfs-dfs", difficulty: 3,
    question: { ko: "외계인 사전 — 정렬된 단어에서 알파벳 순서 복원 (Alien Dictionary).", en: "Reconstruct alphabet order from sorted alien words." },
    options: ["Sort comparison", "Topological Sort from word pairs", "Greedy", "Hash Map only"], answer: 1,
    optionReasons: [
      { ko: "모든 순서 생성에 DFS + 백트래킹 필수", en: "DFS with backtracking essential for all orderings" },
      { ko: "BFS는 모든 순열 생성에 비효율적", en: "BFS inefficient for generating all permutations" },
      { ko: "DP는 순열 열거에 부적합", en: "DP not suitable for permutation enumeration" },
      { ko: "Greedy는 모든 경우 열거 불가", en: "Greedy can't enumerate all cases" },
    ],
    explanation: { ko: "인접 단어 비교로 문자 순서 그래프 생성. Topological Sort로 순서 복원.", en: "Build graph from adjacent word pairs. Topological sort to find order." },
  },
  {
    id: "bd_h3", type: "fillblank", categoryId: "bfs-dfs", difficulty: 3,
    question: { ko: "Number of Islands II (동적 추가) — 빈칸 채우기", en: "Number of Islands II (dynamic) — fill blanks" },
    code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = 0

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return
        if self.rank[px] < self.rank[py]:
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.parent[py] = px
        else:
            self.parent[py] = px
            self.rank[px] += 1
        self.count -= ???`,
    blanks: [
      { placeholder: { ko: "??? (union 시 카운트)", en: "??? (count on union)" }, answer: "1", options: ["1", "2", "0", "px"] },
    ],
    explanation: { ko: "Union-Find로 동적 섬 추가 처리. union 시 컴포넌트 -1. O(α(n)).", en: "Union-Find for dynamic island addition. Decrement count on union. O(α(n))." },
  },
  {
    id: "bd_h4", type: "pattern", categoryId: "bfs-dfs", difficulty: 3,
    question: { ko: "0-1 BFS — 가중치가 0 또는 1일 때 최단 거리.", en: "Shortest path when edge weights are 0 or 1 (0-1 BFS)." },
    options: ["Dijkstra", "0-1 BFS with Deque", "Regular BFS", "DFS"], answer: 1,
    optionReasons: [
      { ko: "최단 경로에 DFS 비효율적", en: "DFS inefficient for shortest paths" },
      { ko: "다중 소스 BFS로 동시 확산 — 최적", en: "Multi-source BFS for simultaneous spread — optimal" },
      { ko: "가중치 없으므로 Dijkstra 불필요", en: "No weights, Dijkstra unnecessary" },
      { ko: "상태 전이 없이 DP 불필요", en: "No state transitions, DP unnecessary" },
    ],
    explanation: { ko: "Deque 사용. 가중치 0이면 front 삽입, 1이면 back 삽입. O(V+E).", en: "Use Deque. Weight 0 → push front, weight 1 → push back. O(V+E)." },
  },

  // TREE (Hard)
  {
    id: "tr_h1", type: "pattern", categoryId: "tree", difficulty: 3,
    question: { ko: "이진 트리를 직렬화/역직렬화 (Serialize/Deserialize Binary Tree).", en: "Serialize and deserialize binary tree." },
    options: ["Inorder only", "Preorder + Queue", "Level-order BFS", "Both B and C"], answer: 3,
    optionReasons: [
      { ko: "직렬화에 DFS가 더 자연스러움", en: "DFS is more natural for serialization" },
      { ko: "Preorder DFS로 직렬화/역직렬화 — 최적", en: "Preorder DFS for serialize/deserialize — optimal" },
      { ko: "BFS로도 가능하지만 DFS가 더 간결", en: "BFS possible but DFS is more concise" },
      { ko: "정렬 순서는 트리 구조 복원 불가", en: "Sorted order can't reconstruct tree structure" },
    ],
    explanation: { ko: "Preorder DFS 또는 Level BFS로 직렬화. null 마커 포함. 역직렬화 시 재구성.", en: "Serialize with Preorder DFS or Level BFS. Include null markers. Reconstruct on deserialize." },
  },
  {
    id: "tr_h2", type: "pattern", categoryId: "tree", difficulty: 3,
    question: { ko: "BST에서 두 노드의 합이 K인 쌍 찾기 (Two Sum BST).", en: "Find pair with sum K in BST." },
    options: ["Inorder + Two Pointers", "Hash Set + DFS", "BFS", "All of A and B"], answer: 3,
    optionReasons: [
      { ko: "모든 경로 합에 HashMap이 핵심 도구", en: "HashMap is key tool for all path sums" },
      { ko: "DFS + Prefix Sum + HashMap으로 O(n) 달성", en: "DFS + Prefix Sum + HashMap achieves O(n)" },
      { ko: "레벨 탐색은 경로 추적에 비효율적", en: "Level traversal inefficient for path tracking" },
      { ko: "정렬 순서는 경로와 무관", en: "Sorted order unrelated to paths" },
    ],
    explanation: { ko: "Inorder로 정렬 배열 만들어 Two Pointers. 또는 DFS하며 HashSet에 보수 확인.", en: "Inorder to sorted array + Two Pointers. Or DFS with HashSet for complement." },
  },
  {
    id: "tr_h3", type: "pattern", categoryId: "tree", difficulty: 3,
    question: { ko: "이진 트리의 모든 루트-리프 경로 합이 target인 개수 (Path Sum III).", en: "Count all root-to-leaf paths with sum = target (any subtree)." },
    options: ["DFS only", "DFS + Prefix Sum HashMap", "BFS", "Dynamic Programming"], answer: 1,
    optionReasons: [
      { ko: "BST 속성을 활용하지 못함", en: "Doesn't exploit BST property" },
      { ko: "BST 범위 제약으로 유효성 검증 — O(n)", en: "BST range constraint for validation — O(n)" },
      { ko: "Inorder로도 가능하지만 범위 검증이 표준", en: "Inorder possible but range validation is standard" },
      { ko: "BFS는 BST 속성 검증에 비효율적", en: "BFS inefficient for BST property validation" },
    ],
    explanation: { ko: "DFS하며 prefix sum을 HashMap에 저장. prefixSum - target 있으면 카운트.", en: "DFS tracking prefix sums in HashMap. Count when prefixSum - target exists." },
  },
  {
    id: "tr_h4", type: "fillblank", categoryId: "tree", difficulty: 3,
    question: { ko: "Binary Tree Max Path Sum — 빈칸 채우기", en: "Binary Tree Max Path Sum — fill blanks" },
    code: `function maxPathSum(root):
    maxSum = -Infinity

    def maxGain(node):
        nonlocal maxSum
        if not node: return 0

        leftGain = max(maxGain(node.left), ???)
        rightGain = max(maxGain(node.right), ???)

        currentPath = node.val + leftGain + rightGain
        maxSum = max(maxSum, ???)

        return node.val + max(leftGain, rightGain)

    maxGain(root)
    return maxSum`,
    blanks: [
      { placeholder: { ko: "??? (음수 무시)", en: "??? (ignore negative)" }, answer: "0", options: ["0", "-Infinity", "1", "node.val"] },
      { placeholder: { ko: "??? (음수 무시)", en: "??? (ignore negative)" }, answer: "0", options: ["0", "-Infinity", "1", "node.val"] },
      { placeholder: { ko: "??? (현재 경로)", en: "??? (current path)" }, answer: "currentPath", options: ["currentPath", "node.val", "leftGain + rightGain", "maxSum"] },
    ],
    explanation: { ko: "Postorder DFS. 음수 이득은 0 처리. 현재 노드 통과 최대 경로 갱신.", en: "Postorder DFS. Ignore negative gains (use 0). Update max path through current node." },
  },

  // GRAPH (Hard)
  {
    id: "gr_h1", type: "pattern", categoryId: "graph", difficulty: 3,
    question: { ko: "가장 저렴한 K번 경유 항공편 (Cheapest Flights Within K Stops).", en: "Cheapest flight with at most K stops." },
    options: ["Dijkstra", "BFS with cost tracking", "Bellman-Ford variant", "DFS"], answer: 2,
    optionReasons: [
      { ko: "가중치 있으므로 BFS 부적합", en: "Has weights, BFS not suitable" },
      { ko: "양수 가중치 최단 경로 = Dijkstra", en: "Positive weight shortest path = Dijkstra" },
      { ko: "음수 간선용이지만 여기선 과도", en: "For negative edges, overkill here" },
      { ko: "모든 정점 쌍용이지 단일 소스 아님", en: "For all pairs, not single source" },
    ],
    explanation: { ko: "최대 K번 간선 완화. Bellman-Ford 변형 또는 BFS. O(K·E).", en: "Relax edges at most K times. Bellman-Ford variant or BFS. O(K·E)." },
  },
  {
    id: "gr_h2", type: "pattern", categoryId: "graph", difficulty: 3,
    question: { ko: "네트워크 지연 시간 — 신호가 모든 노드에 도달하는 최소 시간 (Network Delay).", en: "Minimum time for signal to reach all nodes." },
    options: ["BFS", "Dijkstra from source", "DFS", "Floyd-Warshall"], answer: 1,
    optionReasons: [
      { ko: "양수 간선에서 Dijkstra가 더 효율적", en: "Dijkstra more efficient for positive edges" },
      { ko: "K번 완화로 최대 K개 경유 제한 처리", en: "K relaxations handle at-most-K-stop constraint" },
      { ko: "경유 제한에 BFS 단독 부적합", en: "BFS alone can't handle stop constraints" },
      { ko: "경유 제한 + 최소 비용에 DFS 비효율적", en: "DFS inefficient for stop constraint + min cost" },
    ],
    explanation: { ko: "Dijkstra로 source에서 모든 노드까지 최단 거리. 최대값이 답. O((V+E) log V).", en: "Dijkstra from source to all nodes. Maximum distance is answer. O((V+E) log V)." },
  },
  {
    id: "gr_h3", type: "pattern", categoryId: "graph", difficulty: 3,
    question: { ko: "강결합 컴포넌트 (Strongly Connected Components) 찾기 — Kosaraju or Tarjan.", en: "Find Strongly Connected Components (SCCs)." },
    options: ["Simple DFS", "Kosaraju's Algorithm", "BFS", "Union-Find"], answer: 1,
    optionReasons: [
      { ko: "이분 그래프에 DFS 2-coloring 표준", en: "DFS 2-coloring standard for bipartite check" },
      { ko: "BFS로도 2-coloring 가능", en: "BFS also possible with 2-coloring" },
      { ko: "DFS와 BFS 모두 이분 판별 가능", en: "Both DFS and BFS can determine bipartiteness" },
      { ko: "연결 요소용이지 이분 판별 아님", en: "For connected components, not bipartite check" },
    ],
    explanation: { ko: "Kosaraju: DFS로 순서 기록 → 역그래프 DFS. Tarjan: low-link 추적. O(V+E).", en: "Kosaraju: DFS to record order → DFS on reversed graph. Tarjan: track low-links. O(V+E)." },
  },
  {
    id: "gr_h4", type: "fillblank", categoryId: "graph", difficulty: 3,
    question: { ko: "Critical Connections (다리 찾기) — 빈칸 채우기", en: "Critical Connections (bridges) — fill blanks" },
    code: `function criticalConnections(n, connections):
    graph = build adjacency list
    visited = [False] * n
    disc = [0] * n
    low = [0] * n
    time = [0]
    result = []

    def dfs(u, parent):
        visited[u] = True
        disc[u] = low[u] = time[0]
        time[0] += 1

        for v in graph[u]:
            if v == parent: continue
            if not visited[v]:
                dfs(v, u)
                low[u] = min(low[u], ???)
                if low[v] > disc[u]:
                    result.append([u, v])
            else:
                low[u] = min(low[u], ???)

    dfs(0, -1)
    return result`,
    blanks: [
      { placeholder: { ko: "??? (자식 low)", en: "??? (child low)" }, answer: "low[v]", options: ["low[v]", "disc[v]", "low[u]", "time[0]"] },
      { placeholder: { ko: "??? (역방향 간선)", en: "??? (back edge)" }, answer: "disc[v]", options: ["disc[v]", "low[v]", "low[u]", "disc[u]"] },
    ],
    explanation: { ko: "Tarjan 알고리즘. low[v] > disc[u]면 (u,v)는 다리. O(V+E).", en: "Tarjan's algorithm. If low[v] > disc[u], (u,v) is a bridge. O(V+E)." },
  },

  // DP (Hard)
  {
    id: "dp_h1", type: "pattern", categoryId: "dp", difficulty: 3,
    question: { ko: "정규 표현식 매칭 — '.'과 '*' 지원 (Regular Expression Matching).", en: "Regular expression matching with '.' and '*'." },
    options: ["Backtracking only", "DP 2D", "Greedy", "DFS"], answer: 1,
    optionReasons: [
      { ko: "Greedy는 배열 분할 최적 보장 안 됨", en: "Greedy can't guarantee optimal array partition" },
      { ko: "Binary Search + DP/검증으로 O(n log S)", en: "Binary Search + DP/validation for O(n log S)" },
      { ko: "전체 탐색은 지수 시간", en: "Full search is exponential" },
      { ko: "단독으로 부분합 최적화 어려움", en: "Hard to optimize partition sums alone" },
    ],
    explanation: { ko: "dp[i][j] = s[0..i]가 p[0..j]와 매칭. '*'는 0회 이상 반복 처리. O(n·m).", en: "dp[i][j] = s[0..i] matches p[0..j]. Handle '*' as 0+ repetitions. O(n·m)." },
  },
  {
    id: "dp_h2", type: "pattern", categoryId: "dp", difficulty: 3,
    question: { ko: "서로 교차하지 않는 선으로 최대 연결 쌍 (Maximum Non-overlapping Segments).", en: "Max non-overlapping pairs with lines (DP on intervals)." },
    options: ["Greedy sort by end", "DP on sorted pairs", "Binary Search", "Both A and B"], answer: 3,
    optionReasons: [
      { ko: "비트마스크가 아닌 단순 DP로는 부족", en: "Simple DP without bitmask is insufficient" },
      { ko: "비트마스크 DP로 방문 상태 추적 — O(n² · 2ⁿ)", en: "Bitmask DP tracks visited states — O(n² · 2ⁿ)" },
      { ko: "탐욕적 선택으로 최적 보장 안 됨", en: "Greedy choice doesn't guarantee optimal" },
      { ko: "무방향이 아닌 완전 그래프 문제", en: "Complete graph problem, not undirected" },
    ],
    explanation: { ko: "끝점 정렬 후 Greedy로 선택. 또는 DP로 포함/미포함 결정. O(n log n).", en: "Sort by end, greedily pick. Or DP include/exclude decision. O(n log n)." },
  },
  {
    id: "dp_h3", type: "pattern", categoryId: "dp", difficulty: 3,
    question: { ko: "두 문자열의 최소 삭제 거리로 같게 만들기 (Delete Operation for Two Strings).", en: "Minimum deletions to make two strings equal." },
    options: ["Brute Force", "LCS + calculation", "Edit Distance", "Both B and C"], answer: 3,
    optionReasons: [
      { ko: "O(2ⁿ)으로 비효율적", en: "O(2ⁿ) is inefficient" },
      { ko: "dp[i][j] = 문자열 i..j가 회문인지 + 최소 분할", en: "dp[i][j] = is substring i..j palindrome + min cuts" },
      { ko: "탐욕적 선택으로 최소 분할 보장 안 됨", en: "Greedy can't guarantee minimum partitions" },
      { ko: "정렬된 데이터가 아니므로 부적합", en: "Data isn't sorted, not applicable" },
    ],
    explanation: { ko: "LCS 길이 구한 후 (m - LCS) + (n - LCS). 또는 Edit Distance 변형.", en: "Find LCS, then (m - LCS) + (n - LCS). Or use Edit Distance variant." },
  },
  {
    id: "dp_h4", type: "fillblank", categoryId: "dp", difficulty: 3,
    question: { ko: "Longest Increasing Subsequence (O(n log n)) — 빈칸 채우기", en: "Longest Increasing Subsequence (O(n log n)) — fill blanks" },
    code: `function lengthOfLIS(nums):
    tails = []

    for num in nums:
        pos = binarySearch(tails, num)
        if pos == len(tails):
            tails.append(???)
        else:
            tails[pos] = ???

    return ???`,
    blanks: [
      { placeholder: { ko: "??? (tails 끝 추가)", en: "??? (append to tails)" }, answer: "num", options: ["num", "pos", "len(tails)", "0"] },
      { placeholder: { ko: "??? (tails 교체)", en: "??? (replace in tails)" }, answer: "num", options: ["num", "pos", "tails[pos]", "tails[-1]"] },
      { placeholder: { ko: "??? (LIS 길이)", en: "??? (LIS length)" }, answer: "len(tails)", options: ["len(tails)", "tails[-1]", "pos", "len(nums)"] },
    ],
    explanation: { ko: "Patience sorting. tails[i] = 길이 i+1인 증가 수열의 최소 끝값. O(n log n).", en: "Patience sorting. tails[i] = min tail of increasing subsequence of length i+1. O(n log n)." },
  },
  {
    id: "dp_h5", type: "pattern", categoryId: "dp", difficulty: 3,
    question: { ko: "버스트 풍선 — 풍선 터뜨려 얻는 최대 점수 (Burst Balloons).", en: "Burst balloons for maximum coins." },
    options: ["Greedy", "DP on intervals", "Backtracking", "Binary Search"], answer: 1,
    optionReasons: [
      { ko: "탐욕적 선택이 최적 부분 집합 보장 안 됨", en: "Greedy can't guarantee optimal subset" },
      { ko: "dp[i][j] = i번째까지 j개 선택의 최대값", en: "dp[i][j] = max value selecting j from first i items" },
      { ko: "K개 제한에 Binary Search 부적합", en: "Binary Search not suitable for K-item constraint" },
      { ko: "조합 최적화에 BFS 비효율적", en: "BFS inefficient for combinatorial optimization" },
    ],
    explanation: { ko: "dp[i][j] = i~j 구간 풍선을 마지막으로 터뜨릴 때 최대 점수. O(n³).", en: "dp[i][j] = max coins bursting balloons in i~j, last one burst. O(n³)." },
  },

  // GREEDY (Hard)
  {
    id: "gd_h1", type: "pattern", categoryId: "greedy", difficulty: 3,
    question: { ko: "사탕 분배 — 인접한 애보다 평점 높으면 더 많이 (Candy Distribution).", en: "Distribute candy: higher rating gets more than neighbors." },
    options: ["Sort by rating", "Two-pass greedy", "Dynamic Programming", "Binary Search"], answer: 1,
    optionReasons: [
      { ko: "회의 순서에 Brute Force는 O(n!)로 비현실적", en: "Brute Force is O(n!), impractical" },
      { ko: "마감 기준 정렬 + 그리디 선택으로 최대 이익", en: "Sort by deadline + greedy selection for max profit" },
      { ko: "힙으로도 가능하지만 Greedy가 더 직관적", en: "Heap works but Greedy is more intuitive" },
      { ko: "상태 전이 없이 DP 불필요", en: "No state transitions, DP unnecessary" },
    ],
    explanation: { ko: "왼→오 한 번, 오→왼 한 번. 각 방향으로 증가 조건 체크. O(n).", en: "Two passes: left→right, right→left. Check increasing condition each way. O(n)." },
  },
  {
    id: "gd_h2", type: "pattern", categoryId: "greedy", difficulty: 3,
    question: { ko: "최소 플랫폼 — 기차 도착/출발 시간으로 필요한 최소 플랫폼 수.", en: "Minimum platforms needed for train arrivals/departures." },
    options: ["Sort arrivals", "Sort both + Two Pointers", "Heap", "Dynamic Programming"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "정렬 후 그리디하게 화살표 배치 — O(n log n)", en: "Sort + greedily place arrows — O(n log n)" },
      { ko: "겹침 판별에 Binary Search 단독 부족", en: "Binary Search alone insufficient for overlap check" },
      { ko: "상태 전이 없이 DP 불필요", en: "No state transitions, DP unnecessary" },
    ],
    explanation: { ko: "도착/출발 시간 분리 정렬. Two Pointers로 겹치는 최대 개수. O(n log n).", en: "Sort arrivals and departures separately. Two Pointers to find max overlap. O(n log n)." },
  },
  {
    id: "gd_h3", type: "pattern", categoryId: "greedy", difficulty: 3,
    question: { ko: "배 구명 — 제한 무게로 최소 보트 수 (Boats to Save People).", en: "Minimum boats with weight limit to save people." },
    options: ["Greedy heaviest + lightest", "Sort + greedy pairing", "Dynamic Programming", "Both A and B"], answer: 3,
    optionReasons: [
      { ko: "O(2ⁿ)으로 비현실적", en: "O(2ⁿ) is impractical" },
      { ko: "빈도 정렬 후 교대 배치 — O(n log n)", en: "Sort by frequency, alternate placement — O(n log n)" },
      { ko: "Heap으로도 가능하지만 Greedy가 핵심 전략", en: "Heap works but Greedy is the core strategy" },
      { ko: "순서 재배치에 DP 불필요", en: "DP unnecessary for rearrangement" },
    ],
    explanation: { ko: "정렬 후 가장 무거운+가장 가벼운 사람 짝짓기. Two Pointers. O(n log n).", en: "Sort, pair heaviest + lightest. Two Pointers greedy. O(n log n)." },
  },
  {
    id: "gd_h4", type: "fillblank", categoryId: "greedy", difficulty: 3,
    question: { ko: "Remove K Digits — 빈칸 채우기", en: "Remove K Digits — fill blanks" },
    code: `function removeKdigits(num, k):
    stack = []

    for digit in num:
        while stack and k > 0 and stack[-1] > ???:
            stack.pop()
            k -= 1
        stack.append(digit)

    while k > 0:
        stack.pop()
        k -= 1

    result = ''.join(stack).lstrip('0')
    return result if result else ???`,
    blanks: [
      { placeholder: { ko: "??? (스택 top 비교)", en: "??? (compare stack top)" }, answer: "digit", options: ["digit", "k", "stack[-1]", "num"] },
      { placeholder: { ko: "??? (빈 문자열)", en: "??? (empty string)" }, answer: "'0'", options: ["'0'", "''", "'1'", "None"] },
    ],
    explanation: { ko: "Monotone Stack. 앞자리가 작을수록 유리. k개 제거 후 최소값. O(n).", en: "Monotone Stack. Smaller leading digits better. Remove k for minimum. O(n)." },
  },

  // HEAP (Hard)
  {
    id: "hp_h1", type: "pattern", categoryId: "heap", difficulty: 3,
    question: { ko: "IPO — k개 프로젝트 선택해 최대 자본 (IPO Problem).", en: "Select k projects to maximize capital (IPO)." },
    options: ["Greedy sort by profit", "Two Heaps (available by capital, max profit)", "Dynamic Programming", "Binary Search"], answer: 1,
    optionReasons: [
      { ko: "O(n log n)으로 가능하지만 불필요", en: "O(n log n) works but unnecessary" },
      { ko: "Two Heaps로 구간 합류/이탈 추적 — 최적", en: "Two Heaps track interval join/leave — optimal" },
      { ko: "슬라이딩 윈도우만으로 중앙값 추적 어려움", en: "Sliding Window alone can't track median" },
      { ko: "구간 중앙값에 정렬 기반 탐색 부적합", en: "Binary Search not suitable for interval median" },
    ],
    explanation: { ko: "현재 자본으로 가능한 프로젝트를 Max-Heap에. 가장 이익 높은 것 선택. O(n log n).", en: "Push available projects (by capital) to Max-Heap. Pick max profit. O(n log n)." },
  },
  {
    id: "hp_h2", type: "pattern", categoryId: "heap", difficulty: 3,
    question: { ko: "회의 일정 III — K개 회의실로 가능한 최대 회의 수.", en: "Maximum meetings in K rooms (Meeting Rooms III)." },
    options: ["Greedy + K Min-Heaps", "Sort + simulation", "Dynamic Programming", "Both A and B"], answer: 3,
    optionReasons: [
      { ko: "매번 정렬은 O(n·k log k)로 비효율적", en: "Sorting each time is O(n·k log k), inefficient" },
      { ko: "Min-Heap으로 K번째까지 추출 — O(n + k log n)", en: "Extract up to Kth with Min-Heap — O(n + k log n)" },
      { ko: "거리 단순 정렬은 k번째 관계 못 찾음", en: "Simple distance sorting can't find kth relation" },
      { ko: "구간 합류에 Two Pointers 부적합", en: "Two Pointers not suitable for interval merging" },
    ],
    explanation: { ko: "회의 끝나는 시간을 Min-Heap에. 가능한 방 찾아 배정. O(n log k).", en: "Track room end times in Min-Heap. Assign to available room. O(n log k)." },
  },
  {
    id: "hp_h3", type: "pattern", categoryId: "heap", difficulty: 3,
    question: { ko: "이벤트 시뮬레이션 — CPU 태스크 스케줄링 최소 시간 (Task Scheduler II).", en: "Minimum time for CPU task scheduling with cooldown." },
    options: ["Greedy frequency", "Min-Heap + cooldown queue", "Dynamic Programming", "Binary Search"], answer: 1,
    optionReasons: [
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
      { ko: "정렬 + Heap으로 빈도 기반 문자 배치 — O(n log A)", en: "Sort + Heap for frequency-based char placement — O(n log A)" },
      { ko: "빈도 기반 배치에 Greedy만으로 부족", en: "Greedy alone insufficient for frequency placement" },
      { ko: "문자 재배치에 DP 불필요", en: "DP unnecessary for char rearrangement" },
    ],
    explanation: { ko: "Max-Heap으로 빈도 높은 태스크 먼저. 쿨다운 큐로 대기 관리. O(n log k).", en: "Max-Heap for most frequent task first. Cooldown queue for waiting. O(n log k)." },
  },
  {
    id: "hp_h4", type: "fillblank", categoryId: "heap", difficulty: 3,
    question: { ko: "Merge K Sorted Lists — 빈칸 채우기", en: "Merge K Sorted Lists — fill blanks" },
    code: `function mergeKLists(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heappush(heap, (lst.val, i, lst))

    dummy = ListNode(0)
    curr = dummy

    while heap:
        val, i, node = heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heappush(heap, (node.next.val, i, ???))

    return ???`,
    blanks: [
      { placeholder: { ko: "??? (다음 노드)", en: "??? (next node)" }, answer: "node.next", options: ["node.next", "node", "curr", "lists[i]"] },
      { placeholder: { ko: "??? (결과)", en: "??? (result)" }, answer: "dummy.next", options: ["dummy.next", "dummy", "curr", "heap"] },
    ],
    explanation: { ko: "Min-Heap에 각 리스트 head. 최소값 꺼내고 다음 노드 추가. O(N log K).", en: "Min-Heap with each list's head. Pop min, push next node. O(N log K)." },
  },

  // SORTING (Hard)
  {
    id: "cx_h1", type: "pattern", categoryId: "sorting", difficulty: 3,
    question: { ko: "역순 쌍 개수 세기 (Reverse Pairs) — Merge Sort 응용.", en: "Count reverse pairs using Merge Sort." },
    options: ["Brute Force O(n²)", "Merge Sort with count", "Quick Sort", "Heap Sort"], answer: 1,
    optionReasons: [
      { ko: "내부 정렬이라 인접 비교에 적합하지 않음", en: "Internal sort, not optimized for adjacent comparison" },
      { ko: "다중 키 정렬에 안정 정렬이 필수 — Merge Sort", en: "Stable sort essential for multi-key — Merge Sort" },
      { ko: "불안정 정렬이라 다중 키에 부적합", en: "Unstable sort, not suitable for multi-key" },
      { ko: "O(n²)으로 비효율적", en: "O(n²) is inefficient" },
    ],
    explanation: { ko: "Merge Sort 병합 시 역순 쌍 카운트. O(n log n).", en: "Count reverse pairs during merge step of Merge Sort. O(n log n)." },
  },
  {
    id: "cx_h2", type: "pattern", categoryId: "sorting", difficulty: 3,
    question: { ko: "K번째로 큰 원소 — Quick Select로 평균 O(n).", en: "Kth largest element using Quick Select in average O(n)." },
    options: ["Sort O(n log n)", "Min-Heap O(n log k)", "Quick Select O(n) average", "All of above"], answer: 3,
    optionReasons: [
      { ko: "비교 기반이라 O(n log n) 한계", en: "Comparison-based, limited to O(n log n)" },
      { ko: "범위가 작을 때 O(n+k)로 선형 정렬 가능", en: "Linear sort O(n+k) when range is small" },
      { ko: "자릿수 기반으로 범위 무관", en: "Digit-based, independent of range" },
      { ko: "비교 기반이라 O(n log n) 한계", en: "Comparison-based, limited to O(n log n)" },
    ],
    explanation: { ko: "Quick Select는 평균 O(n), 최악 O(n²). Randomize로 완화. Heap은 O(n log k).", en: "Quick Select averages O(n), worst O(n²). Randomize to mitigate. Heap is O(n log k)." },
  },
  {
    id: "cx_h3", type: "complexity", categoryId: "sorting", difficulty: 3,
    question: { ko: "비교 기반 정렬의 이론적 하한은?", en: "Theoretical lower bound for comparison-based sorting?" },
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 1,
    explanation: { ko: "비교만으로는 최소 O(n log n). 결정 트리 높이 = log(n!).", en: "Comparison-based sorting requires at least O(n log n). Decision tree height = log(n!)." },
  },

  // COMMUNICATION (Hard)
  {
    id: "cm_h1", type: "speaking", categoryId: "communication", difficulty: 3,
    question: { ko: "면접관이 '이 문제 어떻게 접근하시겠어요?'라고 물었는데 처음 보는 유형입니다.", en: "Interviewer asks 'How would you approach this?' but you've never seen this type." },
    goodAnswer: { ko: "처음 보는 유형이네요. 먼저 작은 예제로 패턴을 찾아보겠습니다. (예제 그리며) n=1,2,3일 때... 점화식이 보이는 것 같습니다. DP로 접근해보겠습니다.", en: "This is new to me. Let me work through small examples to find patterns. (Draw) For n=1,2,3... I see a recurrence relation. I'll try DP." },
    badAnswers: { ko: ["모르겠는데요.", "LeetCode에서 본 것 같은데...", "힌트 주시겠어요?"], en: ["I don't know.", "I think I saw this on LeetCode...", "Can you give a hint?"] },
    explanation: { ko: "모를 때도 생각하는 과정을 보여주는 게 핵심. 작은 예제로 패턴 찾기.", en: "Show your thought process even when unsure. Find patterns with small examples." },
  },
  {
    id: "cm_h2", type: "speaking", categoryId: "communication", difficulty: 3,
    question: { ko: "코드 작성 중 더 나은 방법이 떠올랐을 때 어떻게 말해야 할까요?", en: "What to say when a better approach occurs while coding?" },
    goodAnswer: { ko: "잠깐만요, 지금 생각해보니 이 부분을 해시맵으로 바꾸면 O(n²)을 O(n)으로 줄일 수 있을 것 같습니다. 처음부터 다시 시작해도 될까요?", en: "Wait, I just realized — if I use a HashMap here, I can reduce O(n²) to O(n). Would it be okay to restart with this approach?" },
    badAnswers: { ko: ["(조용히 지우고 다시 시작)", "아 이거 틀렸네요.", "음... 다시 해야겠어요."], en: ["(silently erase and restart)", "Oh this is wrong.", "Um... I need to redo this."] },
    explanation: { ko: "개선 사항을 발견하면 즉시 공유하고 면접관 동의 구하기. 사고 과정 보여주기.", en: "Share improvements immediately and ask for agreement. Demonstrate thinking process." },
  },
];
