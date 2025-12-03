"use client";
import { useState, useEffect } from "react";

// 더미 데이터 (나중에 API로 교체)
const DUMMY_BATTLE_DATA = {
  myTeam: { name: "Run", distance: 52 },
  enemyTeam: { name: "Duel", distance: 29 },
  dDay: 20,
};

export default function TeamBattle() {
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
  const totalDistance =
    DUMMY_BATTLE_DATA.myTeam.distance + DUMMY_BATTLE_DATA.enemyTeam.distance;
  const myTeamPercent = Math.round(
    (DUMMY_BATTLE_DATA.myTeam.distance / totalDistance) * 100
  );
  const enemyTeamPercent = 100 - myTeamPercent;

  return (
    <>
      {/* 2. 배틀 현황 카드 */}
      <section className="bg-white rounded-[24px] p-6 shadow-sm">
        {/* 팀 점수 */}
        <div className="flex justify-between items-end mb-6 px-2">
          <div className="text-center">
            <div className="text-[32px] font-kbl text-brand-blue">
              {DUMMY_BATTLE_DATA.myTeam.name}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {DUMMY_BATTLE_DATA.myTeam.distance}
              <span className="text-sm font-normal ml-1">km</span>
            </div>
          </div>
          <div className="text-[rgba(46,47,51,0.88)] font-bagel text-2xl mb-3">
            vs
          </div>
          <div className="text-center">
            <div className="text-[32px] font-kbl text-brand-red">
              {DUMMY_BATTLE_DATA.enemyTeam.name}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {DUMMY_BATTLE_DATA.enemyTeam.distance}
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
            style={{ width: `${enemyTeamPercent}%` }}
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
          <span>{enemyTeamPercent}%</span>
        </div>
      </section>
    </>
  );
}
