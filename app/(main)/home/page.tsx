"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TeamBattle from "@/components/Teambattle";

interface BattleLeague {
  myCrewName: string;
  opponentCrewName: string;
  myCrewDistance: number;
  opponentCrewDistance: number;
}

interface TodayRunning {
  distance: number;
  duration: number; // 초 단위
  pace: number; // 초/km
}

interface RecentActivity {
  nickname: string;
  distance: number;
  duration: number;
  pace: number;
  profileImage?: string; // API에 없다면 기본 이미지 사용
}

interface HomeData {
  battleLeague: BattleLeague | null;
  todayRunning: TodayRunning | null;
  recentActivities: RecentActivity[];
}

export default function HomePage() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // 토큰이 필요한 경우 헤더에 추가
        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/home`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setHomeData(data);
        } else {
          console.error("홈 데이터 불러오기 실패");
        }
      } catch (error) {
        console.error("에러 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // 3. 헬퍼 함수: 시간 포맷팅 (초 -> mm:ss)
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // 헬퍼 함수: 페이스 포맷팅 (초 -> m'ss")
  const formatPace = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}'${sec.toString().padStart(2, "0")}"`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        로딩 중...
      </div>
    );

  // 렌더링
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[430px] bg-bg-gray min-h-screen relative flex flex-col pb-24 shadow-2xl overflow-hidden">
        {/* 1. 상단 헤더 배경 (그라데이션) */}
        <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-primary-blue from-0% to-transparent pointer-events-none z-0" />

        {/* 2. 헤더 내용 */}
        <header className="relative z-10 px-6 pt-12 pb-4 flex justify-between items-center">
          <p className="text-[32px] font-bagel text-brand-blue">Run Duel</p>

          <div className="relative w-20 h-20">
            <Image
              src="/bluedragon.png"
              alt="Character"
              fill
              className="object-contain"
            />
          </div>
        </header>

        {/* 메인 스크롤 영역 */}
        <main className="relative z-10 flex flex-col gap-6 px-5 ">
          {/* 3. 오늘의 러닝 (Today Run) */}
          <section>
            <h2 className="text-base font-semibold leading-normal tracking-[0.091px] mb-3 pl-1">
              오늘의 러닝
            </h2>
            <div className="bg-white rounded-[12px] px-1 py-6 flex justify-between items-center w-full">
              {homeData?.todayRunning ? (
                <>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-2xl font-bold text-black text-center tracking-[-0.552px] [font-feature-settings: 'ss10']">
                      {(homeData.todayRunning.distance / 1000).toFixed(2)}{" "}
                      {/* m -> km */}
                    </span>
                    <span className="text-sm text-sub-gray mt-1 font-medium">
                      거리 (km)
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-2xl font-bold text-black text-center tracking-[-0.552px] [font-feature-settings: 'ss10']">
                      {formatTime(homeData.todayRunning.duration)}
                    </span>
                    <span className="text-sm text-sub-gray mt-1 font-medium">
                      시간
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-2xl font-bold text-black text-center tracking-[-0.552px] [font-feature-settings: 'ss10']">
                      {formatPace(homeData.todayRunning.pace)}
                    </span>
                    <span className="text-sm text-sub-gray mt-1 font-medium">
                      페이스
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full text-center py-4 text-gray-400">
                  오늘의 러닝 기록이 없습니다.
                </div>
              )}
            </div>
          </section>

          {/* 4. 이번 달 배틀리그 */}
          <section>
            <div className="flex justify-between items-center mb-3 pl-1 pr-1">
              <h2 className="text-base font-semibold leading-normal tracking-[0.091px] mb-3 pl-1">
                이번 달 배틀 리그 <span className="text-lg">🔥</span>
              </h2>
              <button
                onClick={() => router.push("/home/battle-league")}
                className="text-sm font-medium text-primary-blue text-center leading-[142.9%] tracking-[0.203px] [font-feature-settings: 'ss10']"
              >
                더보기
              </button>
            </div>
            {homeData?.battleLeague ? (
              <TeamBattle
                myTeamName={homeData.battleLeague.myCrewName}
                opponentTeamName={homeData.battleLeague.opponentCrewName}
                myTeamDistance={homeData.battleLeague.myCrewDistance}
                opponentTeamDistance={
                  homeData.battleLeague.opponentCrewDistance
                }
              />
            ) : (
              <p>진행 중인 배틀이 없습니다</p>
            )}
          </section>

          {/* 5. 그룹 활동 (Group Activity) */}
          <section>
            <div className="flex justify-between items-center mb-3 pl-1 pr-1">
              <h2 className="text-base font-semibold leading-normal tracking-[0.091px] mb-3 pl-1">
                그룹 활동
              </h2>
              <button className="text-sm font-medium text-primary-blue text-center leading-[142.9%] tracking-[0.203px] [font-feature-settings: 'ss10']">
                전체보기
              </button>
            </div>

            {/* 활동 리스트 (API 데이터 매핑) */}
            <div className="flex flex-col gap-3">
              {homeData?.recentActivities &&
              homeData.recentActivities.length > 0 ? (
                homeData.recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-5 flex gap-4"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={activity.profileImage || "/profile.png"} // 없으면 기본 이미지
                        alt="profile image"
                        height={56}
                        width={56}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-[15px]">
                            {activity.nickname}
                          </h3>
                          <p className="text-sub-gray text-xs mt-0.5">
                            새로운 기록을 공유했어요
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-sub-gray font-medium">
                        <span className="flex items-center gap-1">
                          📍 {(activity.distance / 1000).toFixed(2)}km
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱️ {formatTime(activity.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          ⚡ {formatPace(activity.pace)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400">
                  최근 활동이 없습니다.
                </div>
              )}
            </div>
          </section>
        </main>

        {/* 6. Floating Action Button (+) */}
        <button
          onClick={() => router.push("/home/upload")}
          className="fixed bottom-24 right-5 w-14 h-14 bg-primary-blue rounded-[20px] shadow-lg shadow-blue-500/30 flex items-center justify-center z-20 active:scale-95 transition-transform"
        >
          <Image src="/plus.svg" width="24" height="24" />
        </button>
      </div>
    </div>
  );
}
