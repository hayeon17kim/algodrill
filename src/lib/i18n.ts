export type Lang = "ko" | "en";

export interface Bilingual {
  ko: string;
  en: string;
}

export interface BilingualArray {
  ko: string[];
  en: string[];
}

// Type-safe localization function with overloads
export function L(field: Bilingual, lang: Lang): string;
export function L(field: BilingualArray, lang: Lang): string[];
export function L(field: string, lang: Lang): string;
export function L(field: string[], lang: Lang): string[];
export function L(field: Bilingual | BilingualArray | string | string[], lang: Lang): string | string[] {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (Array.isArray(field)) return field;
  if (typeof field === "object" && field[lang] !== undefined) return field[lang];
  if (typeof field === "object") return field.ko || field.en || "";
  return "";
}

export const TEXTS: Record<Lang, Record<string, string>> = {
  ko: {
    appName: "AlgoDrill",
    tagline: "라이브 코딩 면접, 매일 5분씩",
    todayStudy: "오늘의 학습",
    problems: "문제",
    reviewDue: "복습할 문제가 있어요",
    correct: "정답",
    startSession: "학습 시작 →",
    reviewAll: "전체 복습 →",
    progress: "학습 진도",
    totalMaster: "전체 마스터",
    tipTitle: "오늘의 팁",
    tipText:
      '라이브 코딩에서는 **침묵이 가장 큰 적**입니다. 생각하는 중에도 "지금 ~를 고민하고 있는데요"라고 말해주세요.',
    patternRecog: "패턴 인식",
    approachOrder: "접근 순서 맞추기",
    fillBlank: "빈칸 채우기",
    speakingPractice: "말하기 연습",
    correctAnswer: "정답!",
    wrongAnswer: "틀렸어요",
    sayThis: "이렇게 말하세요",
    next: "다음 →",
    checkAnswer: "정답 확인",
    myOrder: "내가 선택한 순서:",
    tapToSelect: "탭하여 순서대로 선택:",
    undoLast: "↩ 마지막 취소",
    perfect: "완벽해요!",
    checkOrder: "순서를 확인해보세요",
    correctOrder: "올바른 순서:",
    allCorrect: "모두 맞았어요!",
    speakAloud: "소리 내어 말해보세요!",
    speakAloudSub: "(혼잣말이라도 OK) 면접에서 실제로 말하듯이 접근법을 설명해보세요.",
    doneShowAnswer: "다 말했어요, 모범답안 보기",
    goodExample: "좋은 답변 예시:",
    badExample: "피해야 할 답변:",
    howWasI: "내 답변은 어땠나요?",
    didBad: "잘 못했어요",
    didGood: "비슷했어요",
    resultPerfect: "완벽해요! 🎯",
    resultGreat: "거의 다 맞혔어요!",
    resultGood: "좋은 출발이에요!",
    resultStudy: "복습이 필요해요!",
    spacedRepeat: "틀린 문제는 곧 다시 나올 거예요 (간격 반복)",
    goHome: "홈으로 돌아가기",
    resetProgress: "진도 초기화",
    resetConfirm: "정말 초기화할까요?",
    saved: "진도가 자동 저장됩니다",
    categoryMode: "카테고리별 학습",
    allCategories: "전체",
    selectCategory: "공부할 카테고리를 선택하세요",
    questionsAvailable: "문제",
    masteredLabel: "마스터",
    startCategorySession: "선택한 카테고리 학습 →",
    noCategoryQuestions: "이 카테고리에 복습할 문제가 없어요",
    back: "← 뒤로",
    mixedSession: "섞어서 학습",
    categorySession: "카테고리 학습",
    synced: "서버에 저장됨",
    offline: "오프라인 모드",
    loginWithGitHub: "GitHub으로 로그인",
    logout: "로그아웃",
    // XP & Level
    level: "레벨",
    xpEarned: "XP 획득",
    totalXP: "총 XP",
    nextLevel: "다음 레벨까지",
    levelUp: "레벨 업!",
    // Streak
    dailyStreak: "연속 학습",
    currentStreak: "현재 스트릭",
    bestStreak: "최고 기록",
    streakDays: "일",
    keepItUp: "계속 이어가세요!",
    streakBroken: "스트릭이 끊겼어요",
    streakSafe: "스트릭 유지!",
    // Result feedback
    greatSession: "훌륭한 세션이었어요!",
    xpBreakdown: "획득 XP",
    questionsCorrect: "문제 정답",
    accuracyRate: "정답률",
    // Encouragement
    encouragement1: "매일 조금씩이 큰 차이를 만듭니다!",
    encouragement2: "꾸준함이 실력을 만듭니다!",
    encouragement3: "오늘도 한 발짝 전진했어요!",
  },
  en: {
    appName: "AlgoDrill",
    tagline: "Live coding interviews, 5 min a day",
    todayStudy: "Today's Study",
    problems: "problems",
    reviewDue: "You have problems to review",
    correct: "correct",
    startSession: "Start Session →",
    reviewAll: "Review All →",
    progress: "Progress",
    totalMaster: "Total Mastered",
    tipTitle: "Tip of the Day",
    tipText:
      'In live coding, **silence is your biggest enemy**. Even while thinking, say "I\'m currently considering...". The interviewer wants to see your thought process.',
    patternRecog: "Pattern Recognition",
    approachOrder: "Order the Steps",
    fillBlank: "Fill in the Blank",
    speakingPractice: "Speaking Practice",
    correctAnswer: "Correct!",
    wrongAnswer: "Incorrect",
    sayThis: "Say it like this",
    next: "Next →",
    checkAnswer: "Check Answer",
    myOrder: "Your selected order:",
    tapToSelect: "Tap to select in order:",
    undoLast: "↩ Undo last",
    perfect: "Perfect!",
    checkOrder: "Check the correct order",
    correctOrder: "Correct order:",
    allCorrect: "All correct!",
    speakAloud: "Say it out loud!",
    speakAloudSub: "(Talking to yourself is fine) Explain your approach as if you're in an actual interview.",
    doneShowAnswer: "Done, show me the answer",
    goodExample: "Good answer example:",
    badExample: "Answers to avoid:",
    howWasI: "How was your answer?",
    didBad: "Not great",
    didGood: "Similar!",
    resultPerfect: "Perfect! 🎯",
    resultGreat: "Almost all correct!",
    resultGood: "Good start!",
    resultStudy: "Review needed!",
    spacedRepeat: "Wrong answers will come back soon (spaced repetition)",
    goHome: "Back to Home",
    resetProgress: "Reset Progress",
    resetConfirm: "Reset all progress?",
    saved: "Progress is auto-saved",
    categoryMode: "Study by Category",
    allCategories: "All",
    selectCategory: "Choose a category to study",
    questionsAvailable: "questions",
    masteredLabel: "mastered",
    startCategorySession: "Start Category Session →",
    noCategoryQuestions: "No questions due for review in this category",
    back: "← Back",
    mixedSession: "Mixed Session",
    categorySession: "Category Session",
    synced: "Synced to server",
    offline: "Offline mode",
    loginWithGitHub: "Login with GitHub",
    logout: "Logout",
    // XP & Level
    level: "Level",
    xpEarned: "XP Earned",
    totalXP: "Total XP",
    nextLevel: "to next level",
    levelUp: "Level Up!",
    // Streak
    dailyStreak: "Daily Streak",
    currentStreak: "Current Streak",
    bestStreak: "Best Streak",
    streakDays: " days",
    keepItUp: "Keep it up!",
    streakBroken: "Streak broken",
    streakSafe: "Streak safe!",
    // Result feedback
    greatSession: "Great session!",
    xpBreakdown: "XP Earned",
    questionsCorrect: "Questions Correct",
    accuracyRate: "Accuracy",
    // Encouragement
    encouragement1: "Small daily progress makes a big difference!",
    encouragement2: "Consistency builds mastery!",
    encouragement3: "One step forward today!",
  },
};
