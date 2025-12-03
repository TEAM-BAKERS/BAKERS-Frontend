"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TeamBattle from "@/components/Teambattle";

const DUMMY_RANKING_DATA = [
  {
    id: 1,
    name: "이세빈",
    distance: 42.5,
    image: "/profile-lee.png",
    isMe: false,
  },
  {
    id: 2,
    name: "김철수",
    distance: 38.2,
    image: "/profile-lee.png",
    isMe: false,
  },
  {
    id: 3,
    name: "박영희",
    distance: 32.5,
    image: "/profile-lee.png",
    isMe: true,
  }, // 나
  {
    id: 4,
    name: "최민수",
    distance: 30.1,
    image: "/profile-lee.png",
    isMe: false,
  },
  {
    id: 5,
    name: "정수진",
    distance: 28.4,
    image: "/profile-lee.png",
    isMe: false,
  },
  {
    id: 6,
    name: "홍길동",
    distance: 25.0,
    image: "/profile-lee.png",
    isMe: false,
  },
  // ... 스크롤 테스트용 데이터 더 추가 가능
];

export default function BattleLeaguePage() {
  const router = useRouter();

  // 내 순위, 1등 거리 계산
  const myRanking = DUMMY_RANKING_DATA.find((user) => user.isMe);
  const maxDistance = DUMMY_RANKING_DATA[0]?.distance || 1;

  return (
    <div className="flex min-h-screen flex-col bg-bg-gray pb-32">
      {/* pb-32: 하단 고정 박스 공간 확보 */}
      {/* 1. 헤더 (뒤로가기 + 제목) */}
      <header className="relative flex items-center justify-center py-4 px-6 ml-4">
        <button
          onClick={() => router.back()}
          className="absolute left-0 text-gray-900"
        >
          <Image src="/back.svg" alt="go back" width={24} height={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">배틀리그</h1>
      </header>
      <main className="px-5 pt-6 flex flex-col gap-6">
        <TeamBattle />
        {/* 3. 개인 기여도 리스트 */}
        <section>
          <h2 className="text-[15px] font-bold text-gray-900 mb-3 pl-1">
            개인 기여도
          </h2>
          <div className="flex flex-col gap-3">
            {DUMMY_RANKING_DATA.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center p-4 rounded-[12px] bg-white shadow-sm border ${
                  user.isMe ? "border-brand-blue" : "border-transparent"
                }`}
              >
                {/* 등수 (나일 때 파란색 배경) */}
                <div
                  className={`w-8 h-8 rounded-[12px] flex items-center justify-center text-sm font-bold mr-4 ${
                    user.isMe
                      ? "bg-brand-blue text-white"
                      : "bg-[rgba(112,115,124,0.08)] text-[rgba(46,47,51,0.88)]"
                  }`}
                >
                  {index + 1}
                </div>

                {/* 프로필 이미지 */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                  {/* 이미지 경로가 없다면 기본 회색 박스 */}
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 이름 & 거리 그래프 */}
                <div className="flex-1">
                  <span className="text-[16px] font-semibold">{user.name}</span>
                  <div className="flex items-center gap-6">
                    {/* 개인 거리 바 (최대 50km 기준 비율 예시) */}
                    <div className="w-32 h-1.5 bg-[#E0E0E2] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#005EEB]"
                        style={{
                          width: `${Math.min(
                            (user.distance / maxDistance) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {user.distance} km
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* 4. 하단 고정 (내 기록) */}
      {myRanking && (
        <div className="fixed bottom-0 left-0 w-full bg-[#E1EBFB] p-4 pb-8 z-20 rounded-t-[12px]">
          <div className="flex items-center p-4 rounded-[20px] bg-white border border-[#4880EE]">
            {/* 내 등수 (리스트에서 찾은 인덱스 + 1) */}
            <div className="w-8 h-8 rounded-[12px] bg-brand-blue text-white flex items-center justify-center text-sm font-bold mr-4">
              {DUMMY_RANKING_DATA.findIndex((u) => u.isMe) + 1}
            </div>

            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
              <Image
                src={myRanking.image}
                alt={myRanking.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[15px] font-bold text-gray-900">
                  {myRanking.name}
                </span>
                <span className="text-xs font-medium text-gray-600">
                  {myRanking.distance} km
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E0E0E2] rounded-full overflow-hidden border border-blue-100">
                <div
                  className="h-full bg-[#005EEB]"
                  style={{
                    width: `${Math.min((myRanking.distance / 50) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
