import React from "react";

interface ContentProps {
  activeTab: "pixstory" | "dreamlens";
}

export function Content({ activeTab }: ContentProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-8">
        <h1 className="text-4xl font-light tracking-tight">
          {activeTab === "dreamlens" ? (
            <>
              당신의 미래 이야기를
              <br />
              들려드립니다
            </>
          ) : (
            <>
              당신의 인생 이야기를
              <br />
              들려드립니다
            </>
          )}
        </h1>

        <p className="text-xl text-gray-600">
          {activeTab === "dreamlens" ? (
            <>
              원하는 직업과 그 안의 의미 있는 순간들을 선택하면,
              <br />
              <span className="text-black">Life Spoiler</span>가 당신만의 이야기로 만들어드립니다.
              <br />
              새로운 가능성을 발견하는 여정을 시작해보세요.
            </>
          ) : (
            <>
              한 장의 사진에는 수천 가지의 이야기가 담겨있습니다.
              <br />
              <span className="text-black">Life Spoiler</span>와 함께 잊혀진 과거의
              기억을 되살리고
              <br />
              당신이 꿈꾸는 미래로 한 걸음 나아가보세요.
            </>
          )}
        </p>
      </div>

      <div className="h-px w-24 bg-black" />
    </div>
  );
}