// app/challenge/page.tsx (또는 원하는 경로)

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from "./challenge.module.css"; // CSS 모듈 파일 경로

// =================================================================
// 0. 필수 상수 및 환경 변수
// =================================================================
// .env.local 파일에 정의된 NEXT_PUBLIC_API_URL을 사용합니다.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 쿠키에 저장할 토큰 키 상수
const ACCESS_TOKEN_KEY = 'accessToken';
// API 응답 타입 정의 (protectedFetch의 반환 타입)
type ApiResponse<T> = T; 

// =================================================================
// 1. 🍪 쿠키 유틸리티 함수 (getCookie)
// =================================================================
/**
 * 쿠키에서 값을 가져옵니다. (Client Component 전용)
 * @param name 쿠키 이름
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// =================================================================
// 2. 🔑 보호된 API 요청 함수 (protectedFetch)
// =================================================================
/**
 * 인증 토큰을 요구하는 API 요청을 처리하는 제네릭 함수.
 * 쿠키에서 accessToken을 자동으로 읽어와 Authorization 헤더에 추가합니다.
 * @param endpoint API 엔드포인트 경로
 * @param options fetch에 전달할 추가 옵션
 */
async function protectedFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");
  }
  
  // 1. 쿠키에서 accessToken을 읽어옵니다.
  const accessToken = getCookie(ACCESS_TOKEN_KEY); 

  if (!accessToken) {
    // 토큰이 없으면 에러 발생 (로그인 필요)
    throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
  }

  // 2. Authorization 헤더 설정 (Bearer 스키마 사용)
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 3. 응답 오류 처리
  if (!response.ok) {
    try {
        const errorData = await response.json();
        throw new Error(errorData.message || `API 요청 실패 (Status: ${response.status})`);
    } catch (e) {
        throw new Error(`API 요청 실패: 서버 응답을 확인할 수 없습니다. Status: ${response.status}`);
    }
  }

  // 4. 성공 응답 파싱
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json") || response.status === 204) {
    return {} as ApiResponse<T>; 
  }

  return response.json();
}

// =================================================================
// 3. 챌린지 관련 타입 정의 (명세서 기반)
// =================================================================

interface CrewMember {
    userId: number;
    nickname: string;
    contributedDistance: number;
}

interface CrewChallenge {
    challengeId: number;
    title: string;
    description: string;
    type: "DISTANCE" | "STREAK";
    goalValue: number;
    currentValue: number;
    progressRate: number;
    daysRemaining: number;
    status: "ACTIVE" | "SUCCESS" | "FAILED";
    startAt: string;
    endAt: string;
    crewMembers: CrewMember[];
}

interface PersonalChallenge {
    title: string;
    description: string;
    type: "DISTANCE" | "STREAK";
    goalValue: number;
    currentValue: number;
    progressRate: number;
    daysRemaining: number;
    startAt: string;
    endAt: string;
}

interface ChallengeResponse {
    crewChallenges: CrewChallenge[];
    personalChallenges: PersonalChallenge[];
}

type ChallengeItem = CrewChallenge | PersonalChallenge;

// =================================================================
// 4. 목(Mock) 데이터 정의 (API 호출 실패 시 사용)
// =================================================================

const MOCK_CHALLENGE_DATA: ChallengeResponse = {
  "crewChallenges": [
    {
      "challengeId": 1,
      "title": "11월 대전 챌린지 (Mock)",
      "description": "크루 전체가 함께 달려요",
      "type": "DISTANCE",
      "goalValue": 200000,
      "currentValue": 184500,
      "progressRate": 92,
      "daysRemaining": 16,
      "status": "ACTIVE",
      "startAt": "2025-11-01T00:00:00",
      "endAt": "2025-11-30T23:59:59",
      "crewMembers": []
    },
    {
      "challengeId": 2,
      "title": "주간 100km 챌린지 (Mock)",
      "description": "100km에 도전 해보세요",
      "type": "DISTANCE",
      "goalValue": 100000,
      "currentValue": 78300,
      "progressRate": 78,
      "daysRemaining": 3,
      "status": "ACTIVE",
      "startAt": "2025-12-01T00:00:00",
      "endAt": "2025-12-07T23:59:59",
      "crewMembers": []
    }
  ],
  "personalChallenges": [
    {
      "title": "주 3회 러닝하기 (Mock)",
      "description": "이번 주 목표 달성",
      "type": "STREAK",
      "goalValue": 3,
      "currentValue": 2,
      "progressRate": 67,
      "daysRemaining": 16,
      "startAt": "2025-12-01T00:00:00",
      "endAt": "2025-12-31T23:59:59"
    },
    {
      "title": "10km 달성하기 (Mock)",
      "description": "개인 기록 경신 도전",
      "type": "DISTANCE",
      "goalValue": 10000,
      "currentValue": 5200,
      "progressRate": 52,
      "daysRemaining": 0,
      "startAt": "2025-12-01T00:00:00",
      "endAt": "2025-12-31T23:59:59"
    }
  ]
};

// =================================================================
// 5. 데이터 포맷팅 및 챌린지 카드 컴포넌트
// =================================================================

/**
 * 목표값과 현재값을 명세서에 맞게 포맷팅합니다.
 */
const formatChallengeValue = (challenge: ChallengeItem) => {
    if (challenge.type === 'DISTANCE') {
        // type이 DISTANCE면 → goalValue/1000 + " km" 표시
        const currentKm = (challenge.currentValue / 1000).toFixed(1);
        const goalKm = challenge.goalValue / 1000;
        return `${currentKm}/${goalKm} km`;
    } else if (challenge.type === 'STREAK') {
        // type이 STREAK면 → goalValue + " 회" 표시
        return `${challenge.currentValue}/${challenge.goalValue} 회`;
    }
    return `${challenge.currentValue}/${challenge.goalValue}`;
};

/**
 * 남은 일수를 포맷팅합니다. (daysRemaining → "D-" + daysRemaining)
 */
const formatDaysRemaining = (days: number) => {
    return `D-${days}`;
};

/**
 * 챌린지 항목 렌더링 컴포넌트
 */
const ChallengeDetailCard: React.FC<{ challenge: ChallengeItem; isCrew: boolean }> = ({ challenge, isCrew }) => {
    // 크루 챌린지: #06f (파란색) / 개인 챌린지: #632FE9 (보라색)
    const accentColor = isCrew ? '#06f' : '#632FE9';
    
    // UI에 표시할 값 계산
    const displayValue = formatChallengeValue(challenge);
    const progressText = `${challenge.progressRate}% 달성`;
    const daysText = formatDaysRemaining(challenge.daysRemaining);
    
    // 아이콘 경로 설정
    const iconSrc = isCrew ? "/whiteTrophy.svg" : "/star.svg";
    const imgWrapStyle = isCrew ? {} : { backgroundColor: '#632FE9' }; // 개인 챌린지만 배경색 변경

    return (
        <div className={styles.infoDetail}>
            <div className={styles.upInfo}>
                <div className={styles.imgWrap} style={imgWrapStyle}>
                    <Image
                        src={iconSrc}
                        alt="챌린지 아이콘"
                        width={28}
                        height={28}
                    />
                </div>
                <div style={{ marginRight: 'auto' }}>
                    <p style={{ fontSize: '17px', fontWeight: '600', color: '#171719' }}>{challenge.title}</p>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(55, 56, 60, 0.61)' }}>{challenge.description}</p>
                </div>
                <div className={styles.ddaywrap}>
                    <Image
                        src="/brownClock.svg"
                        alt="디데이 아이콘"
                        width={16}
                        height={16}
                    />
                    {daysText}
                </div>
            </div>
            <div className={styles.midInfo}>
                <p style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(55, 56, 60, 0.61)' }}>진행률</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>{displayValue}</p>
            </div>
            <div
                className={styles.progressBarContainer}
                style={{ height: `8px` }}
            >
                <div
                    className={styles.progressBarFill}
                    style={{
                        width: `${challenge.progressRate}%`, // 동적으로 너비 설정
                        backgroundColor: accentColor, // 동적으로 색상 설정
                    }}
                />
            </div>
            <div className={styles.wrap}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: accentColor, marginLeft: 'auto' }}>
                    {progressText}
                </p>
            </div>
        </div>
    );
};

// =================================================================
// 6. 메인 Challenge 컴포넌트
// =================================================================

export default function Challenge() {
    const [challengeData, setChallengeData] = useState<ChallengeResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                // 토큰을 자동으로 헤더에 포함하여 API 호출
                const data = await protectedFetch<ChallengeResponse>('/api/v1/challenges', { method: 'GET' });
                setChallengeData(data);
            } catch (error) {
                console.error("챌린지 API 호출 실패, 목 데이터 사용:", error);
                // API 호출 실패 시 목 데이터로 대체
                setChallengeData(MOCK_CHALLENGE_DATA);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    // 로딩 중 처리
    if (isLoading) {
        return (
            <div className={styles.outerContainer}>
                <div className={styles.container}>
                    <p style={{ padding: '50px', textAlign: 'center' }}>챌린지 정보를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }
    
    const crewChallenges = challengeData?.crewChallenges || [];
    const personalChallenges = challengeData?.personalChallenges || [];

    return (
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <div className={styles.upperSection}>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginTop: '18px' }}>챌린지</p>
                    <p style={{ fontSize: '16px', fontWeight: '500', color: '#fff', marginTop: '4px', marginBottom: '40px' }}>목표를 향해 함께 달려요</p>
                </div>
                
                {/* ------------------- 진행 중인 크루 챌린지 ------------------- */}
                <div className={styles.infoContainer}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#171719', marginTop: '32px' }}>진행 중인 크루 챌린지</p>
                    
                    {crewChallenges.length > 0 ? (
                        crewChallenges.map((challenge) => (
                            <ChallengeDetailCard 
                                key={challenge.challengeId}
                                challenge={challenge} 
                                isCrew={true} 
                            />
                        ))
                    ) : (
                        <p style={{ margin: '10px 0', color: '#666' }}>현재 진행 중인 크루 챌린지가 없습니다.</p>
                    )}
                </div>

                {/* ------------------- 나의 개인 챌린지 ------------------- */}
                <div className={styles.infoContainer}>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#171719', marginTop: '32px' }}>나의 개인 챌린지</p>
                    
                    {personalChallenges.length > 0 ? (
                        personalChallenges.map((challenge, index) => (
                            <ChallengeDetailCard 
                                key={index} 
                                challenge={challenge} 
                                isCrew={false} 
                            />
                        ))
                    ) : (
                        <p style={{ margin: '10px 0', color: '#666' }}>현재 진행 중인 개인 챌린지가 없습니다.</p>
                    )}
                </div>
            </div>
            {/* 하단 네비게이션바 등은 기존 JSX 구조를 유지했습니다. */}
        </div>
    );
}