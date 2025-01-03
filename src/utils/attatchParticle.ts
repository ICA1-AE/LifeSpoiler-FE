// 받침 여부를 판단하는 함수
const hasFinalConsonant = (word: string): boolean => {
    const lastChar = word.charAt(word.length - 1);
    const lastCharCode = lastChar.charCodeAt(0);
    return (lastCharCode - 0xac00) % 28 !== 0; // 받침이 있으면 true
};

// 주격 조사를 반환하는 함수
export const getSubjectParticle = (word: string): string => {
    return hasFinalConsonant(word) ? "이" : "가";
};

// 목적격 조사를 반환하는 함수
export const getObjectParticle = (word: string): string => {
    return hasFinalConsonant(word) ? "을" : "를";
};