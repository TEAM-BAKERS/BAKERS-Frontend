"use client";
import { useState, useEffect } from "react";

interface TeamBattleProps {
  myTeamName: string;
  opponentTeamName: string;
  myTeamDistance: number; // 미터(m) 단위로 받음
  opponentTeamDistance: number; // 미터(m) 단위로 받음
}

export default function TeamBattle({
  myTeamName,
  opponentTeamName,
  myTeamDistance,
  opponentTeamDistance,
}: TeamBattleProps) {
  // 날짜 계산 - 디데이
  const [leagueInfo, setLeagueInfo] = useState({
    month: 0,
    dDay: 0,
  });

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;

    // 예: 오늘이 11월이면 -> new Date(2024, 11, 0) -> 11월 30일
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      currentMonth,
      0
    ).getDate();

    const currentDay = today.getDate();
    const dDay = lastDayOfMonth - currentDay;

    setLeagueInfo({
      month: currentMonth,
      dDay: dDay,
    });
  }, []);

  // 퍼센트 계산 로직
  const totalDistance = myTeamDistance + opponentTeamDistance;

  // 0으로 나누기 방지 (초기 상태일 때 NaN 방지)
  const myTeamPercent =
    totalDistance === 0
      ? 50
      : Math.round((myTeamDistance / totalDistance) * 100);

  const opponentTeamPercent = 100 - myTeamPercent;

  return (
    <>
      {/* 2. 배틀 현황 카드 */}
      <section className="bg-white rounded-[24px] p-6 shadow-sm">
        {/* 팀 점수 */}
        <div className="flex justify-between items-end mb-6 px-2">
          <div className="text-center">
            <div className="text-[32px] font-kbl text-brand-blue">
              {myTeamName}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {Math.round(myTeamDistance / 1000)}
              <span className="text-sm font-normal ml-1">km</span>
            </div>
          </div>
          <div className="text-[rgba(46,47,51,0.88)] font-bagel text-2xl mb-3">
            vs
          </div>
          <div className="text-center">
            <div className="text-[32px] font-kbl text-brand-red">
              {opponentTeamName}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {Math.round(opponentTeamDistance / 1000)}
              <span className="text-sm font-normal ml-1">km</span>
            </div>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex mb-2">
          <div
            className="h-full bg-brand-blue"
            style={{ width: `${myTeamPercent}%` }}
          ></div>
          <div
            className="h-full bg-brand-red"
            style={{ width: `${opponentTeamPercent}%` }}
          ></div>
        </div>

        {/* 퍼센트 & D-Day */}
        <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
          <span>{myTeamPercent}%</span>
          <div className="text-center text-sub-gray text-xs font-medium mt-4">
            <span>{leagueInfo.month}월 배틀 리그 • </span>
            <span>
              {/* dDay가 0이면 D-Day, 아니면 D-숫자 */}
              {leagueInfo.dDay === 0 ? "D-Day" : `D-${leagueInfo.dDay}`}
            </span>
          </div>
          <span>{opponentTeamPercent}%</span>
        </div>
      </section>
    </>
  );
}
