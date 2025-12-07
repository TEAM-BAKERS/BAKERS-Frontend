'use client';
import styles from "./group.module.css";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// API 응답 구조에 맞춰 타입을 정의 (선택 사항이지만 안전성 확보를 위해 추가)
interface Member {
    userId: number;
    nickname: string;
    imageUrl: string | null;
    weeklyDistance: number;
    monthlyDistance: number;
    // '오늘 달린 멤버'에서 사용되는 속성 (API 명세에 따라)
    profileImageUrl?: string | null;
    username?: string;
}

interface Crew {
    id: number;
    name: string;
    imgUrl: string | null;
    intro: string;
    stats: {
        totalDistanceKm: number;
        totalDurationHour: number;
        goalAchieveRate: number;
    };
    teamChallenge: {
        progressRate: number;
        currentValue: number;
        goalValue: number;
    };
    todayMembers: Member[];
    info: {
        createdAt: string;
        memberCount: number;
        maxMember: number;
    };
}

interface CrewDataState {
    hasCrew: boolean;
    crew: Crew | null;
}


// API 문서에서 그룹 화면 멤버 목록 조회 응답을 기반으로 한 목업 데이터 (임시 유지)
const MOCK_MEMBER_LIST: Member[] = [
    { "userId": 8, "nickname": "eight (Mock)", "imageUrl": null, "weeklyDistance": 6000, "monthlyDistance": 6000 },
    { "userId": 9, "nickname": "nine (Mock)", "imageUrl": null, "weeklyDistance": 3000, "monthlyDistance": 3000 },
    { "userId": 6, "nickname": "six (Mock)", "imageUrl": null, "weeklyDistance": 4000, "monthlyDistance": 4000 },
    { "userId": 10, "nickname": "ten (Mock)", "imageUrl": null, "weeklyDistance": 5000, "monthlyDistance": 5000 },
];

export default function Group() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('info');
    // crewDataState의 타입을 CrewDataState | null로 지정
    const [crewDataState, setCrewDataState] = useState<CrewDataState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 💡 [추가] 멤버 목록 상태 및 로딩 상태
    const [memberList, setMemberList] = useState<Member[]>([]);
    const [isMembersLoading, setIsMembersLoading] = useState(false);

    // 거리(m)를 km로 변환하는 함수
    const mToKm = (m: number):string => (m / 1000).toFixed(1);

    // 💡 [추가] 멤버 목록 Fetch 함수
    const fetchMemberList = async (crewId: number) => {
        if (isMembersLoading) return;

        setIsMembersLoading(true);
        setError(null);

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const accessToken = localStorage.getItem('accessToken'); 

        if (!API_BASE_URL || !accessToken) {
            setMemberList(MOCK_MEMBER_LIST); // 토큰/URL 오류 시 목 데이터 대체
            setIsMembersLoading(false);
            return;
        }

        try {
            const endpoint = `${API_BASE_URL}/api/crew/${crewId}/members/stats`;
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                 // API 실패 시 목 데이터로 대체
                setMemberList(MOCK_MEMBER_LIST); 
                console.error(`멤버 목록 API 호출 실패: Status ${response.status}`);
                return;
            }

            const data: Member[] = await response.json();
            setMemberList(data);

        } catch (e) {
            console.error("Failed to fetch member list:", e);
            setMemberList(MOCK_MEMBER_LIST); // 오류 발생 시 목 데이터 대체
        } finally {
            setIsMembersLoading(false);
        }
    };

    // 크루 데이터 Fetch 함수
    useEffect(() => {
        const fetchCrewData = async () => {
            setLoading(true);
            setError(null);
            
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
            if (!API_BASE_URL) {
                setError("API 기본 URL이 설정되지 않았습니다. .env 파일을 확인해 주세요.");
                setLoading(false);
                return;
            }

            const accessToken = localStorage.getItem('accessToken'); 
            
            if (!accessToken) {
                console.error("Access token not found in localStorage.");
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/crew`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                // 응답 본문을 한 번만 읽어 저장
                const responseText = await response.text();

                if (!response.ok) {
                    let errorMessage = `HTTP error! status: ${response.status}`;
                    
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage += `. Message: ${errorData.message || responseText}`;
                    } catch (e) {
                        if (response.status === 404) {
                            errorMessage = "요청 엔드포인트를 찾을 수 없습니다 (404). 백엔드 경로를 확인하세요.";
                        } else {
                            errorMessage += `. Response Text: ${responseText.substring(0, 100)}...`;
                        }
                    }
                    throw new Error(errorMessage);
                }

                // 성공적으로 응답을 받으면 JSON 파싱 및 타입 캐스팅
                const data: CrewDataState = JSON.parse(responseText);
                setCrewDataState(data);

            // 크루 정보 로드 성공 후, 멤버 목록도 미리 로드
                if (data.hasCrew && data.crew) {
                 fetchMemberList(data.crew.id); // 크루 ID를 사용하여 멤버 목록 로드
        }

            } catch (e) {
                console.error("Failed to fetch crew data:", e);
                // @ts-ignore
                setError(e.message || "크루 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchCrewData();
    }, []); 

    const hasCrew = crewDataState?.hasCrew ?? false;
    // crew 변수는 Crew 타입 또는 null
    const crew = crewDataState?.crew ?? null; 

    // hasCrew: true 일 때의 상단 크루 정보 섹션
    // Crew: null이 아님을 단언(!)
const CrewInfoUpperSection = ({ crew }: { crew: Crew }) => {
    // c 변수 대신 전달받은 crew 사용
    return (
        <div className={styles.upperSection}>
            <p className={styles.titleText}>크루</p>
            <div className={styles.crewCard}>
                <div className={styles.crewTop}>
                    <Image
                        src={crew.imgUrl || "/solo.png"}
                        alt="크루 이미지"
                        width={48} 
                        height={48}
                        className={styles.crewImage}
                    />
                    <div className={styles.crewTextContent}>
                        <p className={styles.crewName}>{crew.name}</p> 
                        <p className={styles.crewIntro}>{crew.intro}</p>
                    </div>
                </div>
                <div className={styles.crewStats}>
                    {/* 🚨 수정: stats 속성에 안전하게 접근 */}
                    <div className={styles.statItem}>
                        <p className={styles.statValue}>{crew.stats?.totalDistanceKm ?? 0}</p>
                        <p className={styles.statLabel}>누적거리</p>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statValue}>{crew.stats?.totalDurationHour ?? 0}</p>
                        <p className={styles.statLabel}>누적시간</p>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statValue}>{crew.stats?.goalAchieveRate ?? 0}%</p>
                        <p className={styles.statLabel}>목표달성률</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CrewInfoContent = ({ crew }: { crew: Crew }) => (
    <div className={styles.tabContent}>
        <div className={styles.teamChallengeSection}>
            <div className={styles.chalwordsection}>
                <p className={styles.sectionTitle}>팀 챌린지</p>
                {/* 🚨 오류 발생 지점 수정: crew.teamChallenge.progressRate */}
                <div className={styles.challengeRate}>
                    {crew.teamChallenge?.progressRate ?? 0}% 
                </div>
            </div>
            <div className={styles.chalinfosec}>
                <div className={styles.challengeDistance}>
                    {/* 🚨 수정: currentValue에 안전하게 접근 */}
                    <p className={styles.currentDistance}>
                        {mToKm(crew.teamChallenge?.currentValue ?? 0).split('.')[0]}km
                    </p>
                    {/* 🚨 수정: goalValue에 안전하게 접근 */}
                    <p className={styles.goalDistance}>
                        목표: {mToKm(crew.teamChallenge?.goalValue ?? 0).split('.')[0]}km
                    </p>
                </div>
                <div className={styles.progressBarContainer}>
                    <div 
                        className={styles.progressBar} 
                        // 🚨 수정: progressRate에 안전하게 접근
                        style={{ width: `${crew.teamChallenge?.progressRate ?? 0}%` }}
                    />
                </div>
            </div>
        </div>
        
        {/* '오늘 달린 멤버' 섹션 수정: todayMembers가 null/undefined일 경우 빈 배열([]) 사용 */}
        <div className={styles.todayMembersSection}>
            <p className={styles.sectionTitle}>오늘 달린 멤버</p>
            <div className={styles.todayMembersList}>
                {(crew.todayMembers ?? []).map((member) => ( 
                    <div key={member.userId} className={styles.memberAvatar}>
                        <Image
                            src={member.profileImageUrl || "/profile.png"}
                            alt={member.username || '멤버'}
                            width={48}
                            height={48}
                        />
                        <p className={styles.memberUsername}>{member.username ?? "이름 없음"}</p>
                    </div>
                ))}
            </div>
        </div>
        
        {/* '크루 정보' 섹션 수정: info 속성에 안전하게 접근 */}
        <div className={styles.crewInfoSection}>
            <p className={styles.sectionTitle}>크루 정보</p>
            <div className={styles.infoRow}>
                <p className={styles.infoLabel}>생성일</p>
                <p className={styles.infoValue}>{crew.info?.createdAt ?? "정보 없음"}</p>
            </div>
            <div className={styles.infoRow}>
                <p className={styles.infoLabel}>정원</p>
                <p className={styles.infoValue}>
                    {crew.info?.memberCount ?? "?"}/{crew.info?.maxMember ?? "?"}명
                </p>
            </div>
        </div>
    </div>
);

    // 하단 '멤버 목록' 탭 내용 (목업 데이터 유지)
    const MemberListContent = () => {
        if (isMembersLoading) {
            return (
                <div className={styles.tabContent}>
                    <p style={{ padding: '20px', textAlign: 'center' }}>멤버 목록을 불러오는 중...</p>
                </div>
            );
        }
        
        return (
            <div className={styles.tabContent}>
                {memberList.map((member) => ( // 💡 memberList 상태 사용
                    <div key={member.userId} className={styles.memberListItem}>
                        <Image
                            src={member.imageUrl || "/profile.png"}
                            alt={member.nickname}
                            width={56}
                            height={56}
                            className={styles.memberListImage}
                        />
                        <div className={styles.memberListTextContent}>
                            <p className={styles.memberNickname}>{member.nickname}</p>
                            <p className={styles.memberDistance}>
                                주간 {mToKm(member.weeklyDistance)}km | 월간 {mToKm(member.monthlyDistance)}km
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    
    // 로딩 및 에러 상태 처리
    if (loading) {
        return (
            <div className={styles.outerContainer}>
                <div className={styles.container}>
                    <p className={styles.titleText}>크루</p>
                    <p style={{ padding: '20px', textAlign: 'center' }}>크루 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.outerContainer}>
                <div className={styles.container}>
                    <p className={styles.titleText}>크루</p>
                    <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>에러: {error}</p>
                </div>
            </div>
        );
    }

    const handleFindGroup = () => {
        router.push("/group/findgroup");
    };

    return (
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                {/* 상단 크루 정보 */}
                {hasCrew && crew && <CrewInfoUpperSection crew={crew} />}
                
                {/* 하단 탭 섹션 */}
                {hasCrew && crew && ( // crew가 null이 아닐 때만 렌더링
                    <div className={styles.lowerSection}>
                        <div className={styles.tabBar}>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('info')}
                            >
                                크루 정보
                            </button>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'members' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('members')}
                            >
                                멤버 목록
                            </button>
                        </div>

                        {/* crew를 props로 전달 */}
                        {activeTab === 'info' ? <CrewInfoContent crew={crew} /> : <MemberListContent />}
                    </div>
                )}

                {/* hasCrew: false 시나리오 */}
                {!hasCrew && (
                    <>
                        <div className={styles.upperSection}>
                            <p className={styles.titleText}>크루</p>
                            <div className={styles.rectangle1}>
                                <div className={styles.rectangle2}>
                                    <Image src="/Social.svg" alt="사람 아이콘" width={48} height={100} className={styles.statIcon} />
                                </div>
                                <p style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>아직 크루가 없어요</p>
                                <p style={{ fontSize: '14px', fontWeight: '500', color: '#fff', marginBottom: '20px' }}>크루에 가입하고 함께 달려보세요!</p>
                                <button className={styles.findBtn} onClick={handleFindGroup}>크루 찾아보기</button>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: '16px', fontWeight: '600', color: '#171719', marginLeft: '20px', marginTop: '24px', marginBottom: '12px' }}>크루란?</p>
                            <div className={styles.infoContainer}>
                                <div className={styles.infoDetail}>
                                    <div className={styles.iconarea1}>
                                        <Image
                                            src="/trophy.svg"
                                            alt="달성 아이콘"
                                            width={24} 
                                            height={24}
                                            className={styles.statIcon}
                                        />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '16px', fontWeight:'600',color:'#171719', marginBottom:'4px' }}>함께 목표 달성</p>
                                        <p style={{ fontSize: '14px', fontWeight:'600',color:'rgba(55, 56, 60, 0.61)'}}>크루원들과 목표를 함께 달성하세요</p>
                                    </div>
                                </div>
                                <div className={styles.infoDetail}>
                                    <div className={styles.iconarea2}>
                                        <Image
                                            src="/lightning.svg"
                                            alt="배틀 아이콘"
                                            width={24} 
                                            height={24}
                                            className={styles.statIcon}
                                        />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '16px', fontWeight:'600',color:'#171719', marginBottom:'4px' }}>팀 배틀 참여</p>
                                        <p style={{ fontSize: '14px', fontWeight:'600',color:'rgba(55, 56, 60, 0.61)'}}>팀 간 러닝 대결에 기여하세요</p>
                                    </div>
                                </div>
                                <div className={styles.infoDetail}>
                                    <div className={styles.iconarea3}>
                                        <Image
                                            src="/crown.svg"
                                            alt="왕관 아이콘"
                                            width={24} 
                                            height={24}
                                            className={styles.statIcon}
                                        />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '16px', fontWeight:'600',color:'#171719', marginBottom:'4px' }}>랭킹 경쟁</p>
                                        <p style={{ fontSize: '14px', fontWeight:'600',color:'rgba(55, 56, 60, 0.61)'}}>크루 내에서 순위를 겨루어 보세요</p>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}