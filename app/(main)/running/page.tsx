import React from "react";

export default function RunningPage() {
  // 1. 월별 통계 더미 데이터
  const monthlyStats = [
    { month: "10월", distance: "45.4km", count: "12회" },
    { month: "11월", distance: "38.2km", count: "10회" },
    { month: "12월", distance: "5.24km", count: "1회" },
    { month: "1월", distance: "0km", count: "0회" }, // 스크롤 확인용
  ];

  // 2. 러닝 히스토리 더미 데이터
  const historyData = [
    {
      id: 1,
      date: "2025.11.14",
      distance: "5.24",
      time: "39:12",
      pace: "7’30”",
    },
    {
      id: 2,
      date: "2025.11.12",
      distance: "3.80",
      time: "28:05",
      pace: "7’22”",
    },
  ];

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
            {/* scrollbar-hide 클래스는 아래 style 태그 참조 */}
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
              {monthlyStats.map((stat, index) => (
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
              ))}
            </div>
          </section>

          {/* 3. 개인 최고 기록 */}
          <section>
            <h2 className=" font-semibold mb-3 pl-1 flex items-center gap-1">
              개인 최고 기록 <span className="text-base">🥇</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* 최장 거리 (파랑) */}
              <div className="bg-primary-blue rounded-[12px] p-5 flex flex-col items-center justify-center text-white h-[140px]">
                <span className="text-sm mb-2">최장 거리</span>
                <span className="text-xl font-semibold mb-3 tracking-tight">
                  12.5<span className="text-xl font-semibold ml-0.5">km</span>
                </span>
                <span className="text-sm opacity-80 px-2 py-0.5">
                  2025.10.28
                </span>
              </div>

              {/* 최고 페이스 (보라) */}
              <div className="bg-[#632FE9] rounded-[12px] p-5 flex flex-col items-center justify-center text-white h-[140px]">
                <span className="text-sm mb-2">최고 페이스</span>
                <span className="text-xl font-semibold mb-3 tracking-tight">
                  4:39
                </span>
                <span className="text-sm opacity-80 px-2 py-0.5">
                  2025.11.05
                </span>
              </div>
            </div>
          </section>

          {/* 4. 러닝 히스토리 */}
          <section>
            <h2 className="font-semibold mb-3 pl-1">러닝 히스토리</h2>
            <div className="flex flex-col gap-3">
              {historyData.map((item) => (
                <div key={item.id} className="bg-white rounded-[12px] p-6">
                  {/* 날짜 */}
                  <div className="text-xs text-sub-gray font-medium mb-5">
                    {item.date}
                  </div>

                  {/* 기록 수치 */}
                  <div className="flex justify-between items-center px-2">
                    {/* 거리 */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-2xl font-bold tracking-tighter">
                        {item.distance}
                      </span>
                      <span className="text-sm text-sub-gray mt-1">거리</span>
                    </div>

                    {/* 시간 */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-2xl font-bold tracking-tighter">
                        {item.time}
                      </span>
                      <span className="text-sm text-sub-gray mt-1">시간</span>
                    </div>

                    {/* 페이스 */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-2xl font-bold tracking-tighter">
                        {item.pace}
                      </span>
                      <span className="text-sm text-sub-gray mt-1">페이스</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
