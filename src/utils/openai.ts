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
    const openai = new OpenAI({ 
      apiKey: openAIKey, 
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
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

export async function generatePixStoryNovel(
  captions: { [key: number]: string },
  metadata: { characterName: string; genre: string },
  openAIKey: string
): Promise<string> {
  try {
    const openai = new OpenAI({ 
      apiKey: openAIKey, 
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const captionCorpus = Object.entries(captions)
      .map(([key, value]) => `${Number(key) + 1}번째 이미지: ${value}`)
      .join('\n');

    const prompt = `
      당신은 창의적이고 이야기 제작에 능숙한 AI 작가입니다. 
      사용자의 입력과 사진의 캡션을 기반으로 매력적이고 장르에 맞는 스토리를 만들어 주세요. 
      사진의 캡션에 기반한 스토리는 캡션에 사용된 사진을 삽입하여 스토리를 보여주는 서비스를 만드는데 사용할 예정입니다.
      아래는 스토리를 작성하기 위한 조건입니다:

      입력 정보:
      이름: ${metadata.characterName}
      장르: ${metadata.genre}
      
      사진 캡션 정보:
      ${captionCorpus}
      
      요구 사항:
      1. 사용자의 이름과 선택한 장르를 반영하여 스토리를 만드세요.
      2. 각 사진 캡션의 내용을 자연스럽게 스토리에 녹여내세요.
      3. 각 사진 캡션의 내용에 해당하는 장면이 끝날 때 [image] 태그를 추가하여 사진 위치를 표시하세요.
      4. 스토리는 논리적이고 흥미롭게 전개되어야 합니다.
      5. 각 장면은 자연스럽게 연결되어야 합니다.
      6. 제목은 생략해주세요.
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

interface JobActionsResponse {
  job_title: string;
  actions: string[];
}

export async function generateJobActions(jobTitle: string, openAIKey: string): Promise<JobActionsResponse> {
  try {
    const openai = new OpenAI({ 
      apiKey: openAIKey, 
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const ACTION_PROMPT = `
    직업명을 입력하면 해당 직업에서 수행하는 10가지 구체적인 행동을 JSON 형식으로 출력합니다.
    요구사항:
    
    출력 형식은 아래의 JSON 구조를 따릅니다
    
    {
      "job_title": "입력받은 직업명",
      "actions": ["행동1", "행동2", ...]
    }
    
    actions 작성 규칙:
    - 해당 직업의 실제 업무를 반영한 구체적인 행동
    - 친근하고 활기찬 어투 사용
    - 각 행동은 현재 진행형으로 표현
    - 정확히 10개의 행동을 생성
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: ACTION_PROMPT },
        { role: "user", content: jobTitle }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('직업 행동 생성에 실패했습니다.');
    }

    const result = JSON.parse(response.choices[0].message.content) as JobActionsResponse;
    
    // Validate the response structure
    if (!result.job_title || !Array.isArray(result.actions) || result.actions.length === 0) {
      throw new Error('잘못된 응답 형식입니다.');
    }

    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error instanceof Error) {
      throw new Error(`직업 행동 생성 실패: ${error.message}`);
    }
    throw new Error('직업 행동 생성에 실패했습니다.');
  }
}

export async function generateDalle3Image(prompt: string, openAIKey: string): Promise<{ url: string; revisedPrompt: string }> {
  try {
    const openai = new OpenAI({ 
      apiKey: openAIKey, 
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}. The image should be photorealistic and high quality.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
      response_format: "b64_json"
    });

    if (!response.data[0]?.b64_json) {
      throw new Error('이미지 생성에 실패했습니다.');
    }

    // Create data URL from base64
    const dataUrl = `data:image/png;base64,${response.data[0].b64_json}`;

    return {
      url: dataUrl,
      revisedPrompt: response.data[0].revised_prompt || prompt
    };
  } catch (error) {
    console.error('DALL·E 3 API error:', error);
    if (error instanceof Error) {
      throw new Error(`이미지 생성 실패: ${error.message}`);
    }
    throw new Error('이미지 생성에 실패했습니다.');
  }
}