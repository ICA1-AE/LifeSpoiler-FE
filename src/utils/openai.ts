import OpenAI from 'openai';

function getBase64FromDataUrl(dataUrl: string): string {
  try {
    if (!dataUrl.startsWith('data:image/')) {
      throw new Error('Invalid image format');
    }
    const base64 = dataUrl.split('base64,')[1];
    if (!base64) {
      throw new Error('Invalid base64 data');
    }
    return base64;
  } catch (error) {
    console.error('Image data processing error:', error);
    throw new Error('이미지 데이터 처리에 실패했습니다.');
  }
}

export async function generateImageCaption(imageBase64: string, openAIKey: string): Promise<string> {
  try {
    const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: true });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `주어진 이미지에 대해 간결하고 명확한 디스크립션을 생성하세요. 
              디스크립션 작성 기준:
              - 한 문장으로 주요 객체, 배경, 활동 또는 상황, 분위기를 포함하여 작성합니다.
              - 각 디스크립션은 최대 20단어로 제한합니다.
              - 생동감 있는 언어로 이미지를 쉽게 떠올릴 수 있게 작성하세요.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${getBase64FromDataUrl(imageBase64)}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('캡션 생성에 실패했습니다.');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error instanceof Error) {
      throw new Error(`캡션 생성 실패: ${error.message}`);
    }
    throw new Error('캡션 생성에 실패했습니다.');
  }
}

export async function generateJobActions(jobTitle: string, openAIKey: string) {
  try {
    const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: true });
    
    const ACTION_PROMPT = `
    입력받은 직업에서 일반적으로 수행하는 4가지 구체적인 행동을 JSON 형식으로 출력하세요. 
    JSON의 키는 "job_title"과 "actions"로 구성되며, "actions"는 각 행동을 문자열로 포함하는 배열입니다.

    예시:
    입력된 직업명: "경찰관"
    출력:
    {
      "job_title": "경찰관",
      "actions": [
        "교통 체증을 완화하기 위해 교차로에서 차량을 통제합니다.",
        "긴급 상황에 대응하여 사건 현장으로 출동합니다.",
        "범죄 용의자를 추적하고 체포합니다.",
        "시민들의 안전을 위해 지역 순찰을 수행합니다."
      ]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: ACTION_PROMPT },
        { role: "user", content: jobTitle }
      ],
      max_tokens: 1000,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('직업 행동 생성에 실패했습니다.');
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error instanceof Error) {
      throw new Error(`직업 행동 생성 실패: ${error.message}`);
    }
    throw new Error('직업 행동 생성에 실패했습니다.');
  }
}

// DreamLens용 스토리 생성 함수
export async function generateDreamLensStory(
  jobActions: string[],
  userName: string,
  jobTitle: string,
  openAIKey: string
): Promise<string> {
  try {
    const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: true });
    
    const prompt = `
      당신은 창의적이고 이야기 제작에 능숙한 AI 작가입니다. 
      사용자가 선택한 직업의 행동을 활용해서 미래의 성공 스토리를 만들어 주세요. 
      아래는 스토리를 작성하기 위한 조건입니다:

      입력 정보:
      이름: ${userName}
      직업: ${jobTitle}
      직업 행동:
      ${jobActions.join('\n')}

      요구 사항:
      1. 사용자의 이름을 활용하여 개인화된 미래의 성공 스토리를 만드세요.
      2. 직업 행동은 스토리 속에서 자연스럽게 녹아들도록 해주세요.
      3. 스토리는 현재부터 시작하여 미래의 성공까지 시간 순서대로 진행되어야 합니다.
      4. 구체적이고 현실적인 내용으로 작성하되, 희망적이고 긍정적인 톤을 유지하세요.
      5. 각 직업 행동이 어떻게 성공으로 이어졌는지 자연스럽게 설명해주세요.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('스토리 생성에 실패했습니다.');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error instanceof Error) {
      throw new Error(`스토리 생성 실패: ${error.message}`);
    }
    throw new Error('스토리 생성에 실패했습니다.');
  }
}

// PixStory용 스토리 생성 함수
export async function generatePixStoryNovel(
  captions: { [key: number]: string },
  metadata: { characterName: string; genre: string },
  openAIKey: string
): Promise<string> {
  try {
    const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: true });
    
    const captionCorpus = Object.entries(captions)
      .map(([key, value]) => `${Number(key) + 1}번째 이미지: ${value}`)
      .join('\n');

    const prompt = `
      당신은 창의적이고 이야기 제작에 능숙한 AI 작가입니다. 
      사용자의 입력과 사진의 캡션을 기반으로 매력적이고 장르에 맞는 스토리를 만들어 주세요. 
      아래는 스토리를 작성하기 위한 조건입니다:

      입력 정보:
      이름: ${metadata.characterName}
      장르: ${metadata.genre}
      
      사진 캡션 정보:
      ${captionCorpus}
      
      요구 사항:
      1. 사용자의 이름과 선택한 장르를 반영하여 스토리를 만드세요.
      2. 각 사진 캡션의 내용을 자연스럽게 스토리에 녹여내세요.
      3. 각 장면이 끝날 때 [image] 태그를 추가하여 사진 위치를 표시하세요.
      4. 스토리는 논리적이고 흥미롭게 전개되어야 합니다.
      5. 각 장면은 자연스럽게 연결되어야 합니다.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "당신은 뛰어난 소설가입니다. 주어진 정보를 바탕으로 매력적이고 감동적인 이야기를 만들어주세요." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('스토리 생성에 실패했습니다.');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error instanceof Error) {
      throw new Error(`스토리 생성 실패: ${error.message}`);
    }
    throw new Error('스토리 생성에 실패했습니다.');
  }
}