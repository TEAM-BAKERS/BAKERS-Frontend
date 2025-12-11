"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface RunningRecord {
  runningId: number;
  userId: number;
  crewId: number;
  distance: number; // 미터(m) 단위
  duration: number; // 초(s) 단위
  avgHeartrate: number | null;
  pace: number | null; // 초(s)/km 단위, null 가능
  startedAt: string; // "2024-11-24T00:00:00"
  createdAt: string;
}

interface ProcessedData {
  monthlyStats: { month: string; distance: string; count: string }[];
  bestRecord: {
    maxDist: { value: string; date: string };
    bestPace: { value: string; date: string };
  };
  history: {
    id: number;
    date: string;
    distance: string;
    time: string;
    pace: string;
  }[];
}

export default function RunningPage() {
  const router = useRouter();
  const [data, setData] = useState<ProcessedData | null>(null);
  const [loading, setLoading] = useState(true);

  // 헬퍼 함수
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatPace = (sec: number | null) => {
    if (!sec) return "-"; // pace가 null이면 '-' 표시
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}'${s.toString().padStart(2, "0")}"`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
  };

  // 메인 함수
  const processRunningData = (records: RunningRecord[]): ProcessedData => {
    // 데이터가 아예 없는 경우 빈 값 반환
    if (!records || records.length === 0) {
      return {
        monthlyStats: [],
        bestRecord: {
          maxDist: { value: "0", date: "-" },
          bestPace: { value: "-", date: "-" },
        },
        history: [],
      };
    }

    // 히스토리 데이터 가공 (리스트용)
    const history = records.map((r) => ({
      id: r.runningId,
      date: formatDate(r.startedAt), // startedAt 기준
      distance: (r.distance / 1000).toFixed(2), // m -> km
      time: formatTime(r.duration),
      pace: formatPace(r.pace),
    }));

    // 개인 최고 기록 계산
    // 1) 최장 거리: distance가 가장 큰 것
    const maxDistRun = records.reduce((prev, curr) =>
      prev.distance > curr.distance ? prev : curr
    );

    // 2) 최고 페이스: pace가 가장 작은 것 (null 제외, 0 제외)
    const validPaceRecords = records.filter((r) => r.pace && r.pace > 0);

    let bestPaceRun: RunningRecord | null = null;
    if (validPaceRecords.length > 0) {
      bestPaceRun = validPaceRecords.reduce((prev, curr) =>
        prev.pace! < curr.pace! ? prev : curr
      );
    }

    const bestRecord = {
      maxDist: {
        value: (maxDistRun.distance / 1000).toFixed(1),
        date: formatDate(maxDistRun.startedAt),
      },
      bestPace: {
        value: bestPaceRun ? formatTime(bestPaceRun.pace!) : "-",
        date: bestPaceRun ? formatDate(bestPaceRun.startedAt) : "-",
      },
    };

    // 월별 통계 계산
    const monthlyMap = new Map<string, { dist: number; count: number }>();

    records.forEach((r) => {
      const date = new Date(r.startedAt);
      const monthKey = `${date.getMonth() + 1}월`;

      const current = monthlyMap.get(monthKey) || { dist: 0, count: 0 };
      monthlyMap.set(monthKey, {
        dist: current.dist + r.distance,
        count: current.count + 1,
      });
    });

    const monthlyStats = Array.from(monthlyMap.entries()).map(
      ([month, val]) => ({
        month: month,
        distance: `${(val.dist / 1000).toFixed(1)}km`,
        count: `${val.count}회`,
      })
    );

    return { history, bestRecord, monthlyStats };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("로그인이 필요합니다.");
          router.push("/login");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/runnings/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const rawData: RunningRecord[] = await res.json();
          console.log("러닝 기록 전체 조회 성공:", rawData);

          const processed = processRunningData(rawData);
          setData(processed);
        } else {
          console.error("러닝 기록 조회 실패:", res.status);
          setData(processRunningData([]));
        }
      } catch (error) {
        console.error("데이터 로딩 에러", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        로딩 중...
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen flex justify-center items-center">
        기록을 불러올 수 없습니다.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex justify-center">
      {/* 모바일 컨테이너 (최대 너비 430px) */}
      <div className="w-full max-w-[430px] bg-[#F5F6F8] min-h-screen relative flex flex-col pb-28 shadow-xl overflow-hidden">
        {/* 1. 헤더 영역 */}
        <header className="bg-primary-blue px-6 pt-16 pb-10 shadow-md z-10">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            러닝 기록
          </h1>
          <p className="text-blue-100 text-base font-medium opacity-90">
            나의 러닝 활동을 확인하세요
          </p>
        </header>

        {/* 메인 스크롤 영역 */}
        <main className="flex flex-col gap-8 px-5 mt-6">
          {/* 2. 월별 통계 (가로 스크롤) */}
          <section>
            <h2 className="text-base font-semibold mb-3 pl-1">월별 통계</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
              {data.monthlyStats.length > 0 ? (
                data.monthlyStats.map((stat, index) => (
                  <div
                    key={index}
                    className="min-w-[110px] bg-white rounded-[12px] p-5 flex flex-col items-center justify-center"
                  >
                    <span className="text-sm text-sub-gray mb-2">
                      {stat.month}
                    </span>
                    <span className="text-xl font-semibold mb-1 tracking-tight">
                      {stat.distance}
                    </span>
                    <span className="text-sm text-sub-gray">{stat.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400 p-2">
                  기록이 없습니다.
                </div>
              )}
            </div>
          </section>

          {/* 3. 개인 최고 기록 */}
          <section>
            <h2 className="font-semibold mb-3 pl-1 flex items-center gap-1">
              개인 최고 기록 <span className="text-base">🥇</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* 최장 거리 */}
              <div className="bg-primary-blue rounded-[12px] p-5 flex flex-col items-center justify-center text-white h-[140px]">
                <span className="text-sm mb-2">최장 거리</span>
                <span className="text-xl font-semibold mb-3 tracking-tight">
                  {data.bestRecord.maxDist.value}
                  <span className="text-xl font-semibold ml-0.5">km</span>
                </span>
                <span className="text-sm opacity-80 px-2 py-0.5 bg-white/10 rounded-full">
                  {data.bestRecord.maxDist.date}
                </span>
              </div>

              {/* 최고 페이스 */}
              <div className="bg-[#632FE9] rounded-[12px] p-5 flex flex-col items-center justify-center text-white h-[140px]">
                <span className="text-sm mb-2">최고 페이스</span>
                <span className="text-xl font-semibold mb-3 tracking-tight">
                  {data.bestRecord.bestPace.value}
                </span>
                <span className="text-sm opacity-80 px-2 py-0.5 bg-white/10 rounded-full">
                  {data.bestRecord.bestPace.date}
                </span>
              </div>
            </div>
          </section>

          {/* 4. 러닝 히스토리 */}
          <section>
            <h2 className="font-semibold mb-3 pl-1">러닝 히스토리</h2>
            <div className="flex flex-col gap-3">
              {data.history.length > 0 ? (
                data.history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-[12px] p-6 shadow-sm"
                  >
                    {/* 날짜 */}
                    <div className="text-xs text-sub-gray font-medium mb-5">
                      {item.date}
                    </div>

                    {/* 기록 수치 */}
                    <div className="flex justify-between items-center px-2">
                      <div className="flex-1 flex flex-col items-center">
                        <span className="text-2xl font-bold tracking-tighter">
                          {item.distance}
                        </span>
                        <span className="text-sm text-sub-gray mt-1">거리</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <span className="text-2xl font-bold tracking-tighter">
                          {item.time}
                        </span>
                        <span className="text-sm text-sub-gray mt-1">시간</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <span className="text-2xl font-bold tracking-tighter">
                          {item.pace}
                        </span>
                        <span className="text-sm text-sub-gray mt-1">
                          페이스
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[12px] p-6 text-center text-gray-400">
                  아직 러닝 기록이 없습니다. <br /> 첫 기록을 남겨보세요!
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
