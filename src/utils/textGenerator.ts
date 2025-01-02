// Temporary text generator for demonstration
export function generatePlaceholderText(index: number): string {
  const texts = [
    "어린 시절의 추억은 마치 오래된 사진첩처럼 따뜻하게 남아있습니다. 그 시절의 웃음소리와 발자국 소리가 아직도 생생합니다.",
    "시간이 흘러도 변치 않는 것들이 있습니다. 가족과 함께한 소소한 일상의 순간들, 그리고 그 속에서 피어난 행복한 기억들입니다.",
    "인생의 전환점에서 만난 특별한 순간들. 그 순간들이 모여 지금의 나를 만들어냈습니다.",
    "때로는 힘들었던 시간들도 지나고 보면 모두 의미 있는 경험이었습니다. 그 경험들이 저를 더 강하게 만들어주었죠.",
    "새로운 도전 앞에서 느꼈던 설렘과 두려움. 그 감정들이 저를 계속해서 앞으로 나아가게 했습니다."
  ];

  return texts[index % texts.length];
}