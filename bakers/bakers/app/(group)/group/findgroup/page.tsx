'use client';

import { useState } from "react";
import Image from 'next/image';
import styles from "./findgroup.module.css"; // CSS Module 임포트

// ----------------------------------------------------
// 1. 데이터 타입 정의
// ----------------------------------------------------
interface GroupData {
    id: number;
    name: string;
    description: string;
    tags: string[];
    memberCount: number;
    memberLimit: number;
    totalDistance: number;
    groupImage: string;
}

// ----------------------------------------------------
// 2. 더미 데이터 배열 선언
// ----------------------------------------------------
const DUMMY_GROUPS: GroupData[] = [
    {
        id: 1,
        name: "한강 러닝 크루",
        description: "매일저녁 7시, 한강에서 달려요!",
        tags: ["저녁", "한강", "초보환영"],
        memberCount: 24,
        memberLimit: 30,
        totalDistance: 453.8,
        groupImage: "/Container.png", 
    },
    {
        id: 2,
        name: "을지로런 크루",
        description: "퇴근 후 을지로 도심을 뛰어봐요 😊",
        tags: ["을지로", "청계천", "퇴근"],
        memberCount: 14,
        memberLimit: 20,
        totalDistance: 82.6,
        groupImage: "/Variant.png",
    },
    {
        id: 3,
        name: "탄천 슬로우 러닝",
        description: "탄천에서 슬로우 러닝 하실 분 😁",
        tags: ["탄천", "슬로우러닝", "조깅"],
        memberCount: 42,
        memberLimit: 100,
        totalDistance: 533.8,
        groupImage: "/members1.png",
    },
    {
        id: 4,
        name: "스피드 챌린저스",
        description: "빠른 페이스를 원한다면 환영해요!",
        tags: ["기록", "서울", "스피드"],
        memberCount: 28,
        memberLimit: 50,
        totalDistance: 243.9,
        groupImage: "/solo.png",
    }
];

// ----------------------------------------------------
// 3. 재사용 가능한 그룹 카드 컴포넌트 정의
// ----------------------------------------------------
function GroupCard({ group, onApplyClick }: { group: GroupData, onApplyClick: (groupName: string) => void }) {
    
    const renderTags = group.tags.map((tag, index) => (
        <div key={index} className={styles.tagdiv}>
            #{tag}
        </div>
    ));

    return (
        <div className={styles.infoDetail}>
            {/* 상단 정보 영역 */}
            <div className={styles.upInfo}>
                <Image
                    src={group.groupImage}
                    alt={`${group.name} 그룹 이미지`}
                    width={64} 
                    height={64}
                    className={styles.groupImage} 
                />
                
                <div>
                    <p style={{ fontSize: '17px', fontWeight: '600', color: '#171719' }}>{group.name}</p>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(46, 47, 51, 0.88)' }}>{group.description}</p>
                    <div className={styles.tagArea}>
                        {renderTags}
                    </div>
                </div>
            </div>

            <hr style={{ width: '96%', marginTop: '16px', marginBottom: '16px' }} />

            {/* 하단 통계 및 버튼 영역 */}
            <div className={styles.downInfo}>
                <div className={styles.groupStatArea}>
                    <div className={styles.eachStat}>
                        {/* 💡 2. 멤버 아이콘: styles.statIcon 클래스 적용 */}
                        <Image
                            src="/graymem.svg"
                            alt="멤버 수 아이콘"
                            width={24} 
                            height={24}
                            className={styles.statIcon} 
                        />
                        <p style={{ color: 'rgba(55, 56, 60, 0.61)', fontSize: '12px', fontWeight: '500' }}>
                            {group.memberCount}/{group.memberLimit}명
                        </p>
                    </div>
                    <div className={styles.eachStat}>
                        {/* 💡 3. 거리 아이콘: styles.statIcon 클래스 적용 */}
                        <Image
                            src="/Compass.svg"
                            alt="누적 거리 아이콘"
                            width={24} 
                            height={24}
                            className={styles.statIcon}
                        />
                        <p style={{ color: 'rgba(55, 56, 60, 0.61)', fontSize: '12px', fontWeight: '500' }}>
                            {group.totalDistance.toFixed(1)}km
                        </p>
                    </div>
                </div>
                {/* 💡 버튼 클릭 시 onApplyClick 함수 실행 */}
                <button 
                    className={styles.applyBtn}
                    onClick={() => onApplyClick(group.name)} // 그룹 이름을 상위 컴포넌트로 전달
                >
                    가입 신청
                </button>
            </div>
        </div>
    );
}


// ----------------------------------------------------
// 5. 가입 신청 모달 컴포넌트
// ----------------------------------------------------
interface ApplyModalProps {
    groupName: string;
    onClose: () => void;
}

function ApplyModal({ groupName, onClose }: ApplyModalProps) {
    return (
        // 모달 오버레이 (배경)
        <div className={styles.modalOverlay}>
            {/* 모달 내용 컨테이너 */}
            <div className={styles.modalContainer}>
                
                {/* 닫기 버튼 (X) */}
                <button className={styles.modalCloseButton} onClick={onClose}>
                    &times; 
                </button>

                {/* 모달 제목 */}
                <div className={styles.modalTitle}>
                    가입 신청
                </div>
                
                {/* 그룹 이름 */}
                <h3 className={styles.modalGroupName}>{groupName}</h3>

                {/* 안내 문구 */}
                <p className={styles.modalBodyText}>
                    이 그룹에 가입 신청하시겠어요?
                    <br/>
                    그룹장 승인 후 가입이 완료됩니다
                </p>

                {/* 버튼 영역 */}
                <div className={styles.modalButtonArea}>
                    <button 
                        className={styles.modalCancelButton} 
                        onClick={onClose} // 닫기 기능
                    >
                        취소
                    </button>
                    <button 
                        className={styles.modalConfirmButton}
                        // 실제 신청 로직은 없으므로 일단 닫기 기능만 연결
                        onClick={onClose} 
                    >
                        신청하기
                    </button>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// 4. 메인 페이지 컴포넌트 (모달 상태 관리)
// ----------------------------------------------------
export default function Findgroup() {
    
    const filteredGroups = DUMMY_GROUPS;

    const [searchTerm, setSearchTerm] = useState('');
    
    // 💡 모달 상태 관리: null이면 닫혀있음, 문자열이면 열려있음 (선택된 그룹 이름)
    const [modalGroup, setModalGroup] = useState<string | null>(null); 

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // 💡 모달 열기 핸들러
    const handleOpenModal = (groupName: string) => {
        setModalGroup(groupName);
    };

    // 💡 모달 닫기 핸들러
    const handleCloseModal = () => {
        setModalGroup(null);
    };

    return(
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <div className={styles.upperContainer}>
                    <p style={{fontSize:'20px', fontWeight:'600', marginTop:'16px'}}>그룹 찾기</p>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="그룹명 또는 태그를 입력해주세요"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <hr/>
                <div className={styles.infoContainer}>
                    <p style={{fontSize:'16px',fontWeight:'400',color:'#171719', marginTop:'24px', marginBottom:'24px'}}>
                        총 <span style={{color:'#06f', fontWeight:'600'}}>{filteredGroups.length}개</span>의 그룹을 찾았습니다
                    </p>
                    
                    {filteredGroups.map((group) => (
                        <GroupCard 
                            key={group.id} 
                            group={group} 
                            onApplyClick={handleOpenModal} // 모달 열기 함수 전달
                        />
                    ))}

                </div>
            </div>
            
            {/* 💡 모달 조건부 렌더링 */}
            {modalGroup && (
                <ApplyModal 
                    groupName={modalGroup} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
}