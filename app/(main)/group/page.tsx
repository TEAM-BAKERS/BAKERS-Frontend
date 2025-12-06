'use client';
import styles from "./group.module.css";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// API 문서에서 hasCrew: true 일 때의 응답을 기반으로 한 목업 데이터
const crewData = {
    "hasCrew": true ,
    "crew": {
        "id": 1,
        "intro": "최근 핫 플레이스로 도심을 누비는 직장인 러닝 크루예요...",
        "imgUrl": null,
        "stats": {
            "totalDistanceKm": 458.3, // 피그마 이미지와 일치하도록 수정
            "totalDurationHour": 24, // 피그마 이미지와 일치하도록 수정
            "goalAchieveRate": 92, // 피그마 이미지와 일치하도록 수정
        },
        "teamChallenge": {
            "id": 1,
            "type": "DISTANCE",
            "goalValue": 100000, // 100km
            "currentValue": 92000, // 92km (92%)
            "progressRate": 92,
            "startAt": "2025-12-01T00:00:00",
            "endAt": "2025-12-23T23:59:59"
        },
        "todayMembers": [
            { "userId": 10, "username": "ten", "profileImageUrl": null },
            { "userId": 9, "username": "nine", "profileImageUrl": null },
            { "userId": 8, "username": "eight", "profileImageUrl": null },
            { "userId": 6, "username": "six", "profileImageUrl": null },
            { "userId": 3, "username": "me", "profileImageUrl": null },
        ],
        "info": {
            "createdAt": "2025.11.25",
            "memberCount": 24, // 피그마 이미지와 일치하도록 수정
            "maxMember": 30
        }
    }
};

// API 문서에서 그룹 화면 멤버 목록 조회 응답을 기반으로 한 목업 데이터
// 거리(monthlyDistance)는 m 기준이며 km로 변환하여 출력해야 함.
const memberListData = [
    { "userId": 8, "nickname": "이세빈", "imageUrl": null, "weeklyDistance": 6600, "monthlyDistance": 125300 }, // 예시로 이세빈으로 변경
    { "userId": 9, "nickname": "nine", "imageUrl": null, "weeklyDistance": 3000, "monthlyDistance": 3000 },
    { "userId": 10, "nickname": "ten", "imageUrl": null, "weeklyDistance": 5000, "monthlyDistance": 10000 },
    { "userId": 11, "nickname": "eleven", "imageUrl": null, "weeklyDistance": 1000, "monthlyDistance": 5000 },
    { "userId": 12, "nickname": "twelve", "imageUrl": null, "weeklyDistance": 9000, "monthlyDistance": 150000 },
];

export default function Group() {
    const router = useRouter();
    // 탭 상태 관리: 'info' (크루 정보) 또는 'members' (멤버 목록)
    const [activeTab, setActiveTab] = useState('info');

    // 현재 시나리오: 유저가 가입된 크루가 있는 경우
    const hasCrew = crewData.hasCrew;
    const crew = crewData.crew;

     const handleFindGroup = () => {
         router.push("/group/findgroup");
     };

    // 거리(m)를 km로 변환하는 함수
    const mToKm = (m: number):string => (m / 1000).toFixed(1);

    // hasCrew: true 일 때의 상단 크루 정보 섹션
    const CrewInfoUpperSection = () => (
        <div className={styles.upperSection}>
            <p className={styles.titleText}>크루</p>
            <div className={styles.crewCard}>
                <div className={styles.crewTop}>
                    <Image
                        src={crew.imgUrl || "/default-group-image.svg"}
                        alt="크루 이미지"
                        width={48} 
                        height={48}
                        className={styles.crewImage}
                    />
                    <div className={styles.crewTextContent}>
                        <p className={styles.crewName}>한강 러닝 크루</p> {/* 피그마의 '한강 러닝 크루' 하드코딩 */}
                        <p className={styles.crewIntro}>{crew.intro}</p>
                    </div>
                </div>
                <div className={styles.crewStats}>
                    <div className={styles.statItem}>
                        <p className={styles.statValue}>{crew.stats.totalDistanceKm}</p>
                        <p className={styles.statLabel}>누적거리</p>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statValue}>{crew.stats.totalDurationHour}</p>
                        <p className={styles.statLabel}>누적시간</p>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statValue}>{crew.stats.goalAchieveRate}%</p>
                        <p className={styles.statLabel}>목표달성률</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // 하단 '크루 정보' 탭 내용
    const CrewInfoContent = () => (
        <div className={styles.tabContent}>
            <div className={styles.teamChallengeSection}>
                <div className={styles.chalwordsection}>
                    <p className={styles.sectionTitle}>팀 챌린지</p>
                    <div className={styles.challengeRate}>{crew.teamChallenge.progressRate}%</div>
                </div>
                <div className={styles.chalinfosec}>
                    <div className={styles.challengeDistance}>
                        <p className={styles.currentDistance}>{mToKm(crew.teamChallenge.currentValue).split('.')[0]}km</p>
                        <p className={styles.goalDistance}>목표: {mToKm(crew.teamChallenge.goalValue).split('.')[0]}km</p>
                    </div>
                    <div className={styles.progressBarContainer}>
                        <div 
                            className={styles.progressBar} 
                            style={{ width: `${crew.teamChallenge.progressRate}%` }}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.todayMembersSection}>
                <p className={styles.sectionTitle}>오늘 달린 멤버</p>
                <div className={styles.todayMembersList}>
                    {crew.todayMembers.map((member, index) => (
                        <div key={member.userId} className={styles.memberAvatar}>
                            <Image
                                src={member.profileImageUrl || "/default-profile.svg"}
                                alt={member.username}
                                width={48}
                                height={48}
                            />
                            <p className={styles.memberUsername}>{member.username}</p>
                            {/* 마지막 아바타에 +@ 표시를 위한 조건부 렌더링 (피그마 반영)
                            {index === crew.todayMembers.length - 1 && (
                                <div className={styles.extraMemberCount}>
                                    +{crew.info.memberCount - crew.todayMembers.length}
                                </div>
                            )}*/}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.crewInfoSection}>
                <p className={styles.sectionTitle}>크루 정보</p>
                <div className={styles.infoRow}>
                    <p className={styles.infoLabel}>생성일</p>
                    <p className={styles.infoValue}>{crew.info.createdAt}</p>
                </div>
                <div className={styles.infoRow}>
                    <p className={styles.infoLabel}>정원</p>
                    <p className={styles.infoValue}>{crew.info.memberCount}/{crew.info.maxMember}명</p>
                </div>
            </div>
        </div>
    );

    // 하단 '멤버 목록' 탭 내용
    const MemberListContent = () => (
        <div className={styles.tabContent}>
            {memberListData.map((member) => (
                <div key={member.userId} className={styles.memberListItem}>
                    <Image
                        src={member.imageUrl || "/default-profile.svg"}
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

    return (
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                {/* 상단 크루 정보 */}
                {hasCrew && <CrewInfoUpperSection />}
                
                {/* 하단 탭 섹션 */}
                {hasCrew && (
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

                        {activeTab === 'info' ? <CrewInfoContent /> : <MemberListContent />}
                    </div>
                )}

                {/* hasCrew: false 시나리오 (기존 코드) - 현재는 true 시나리오만 렌더링 */}
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
                                <button className={styles.findBtn} onClick={handleFindGroup}><img></img>크루 찾아보기</button>
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