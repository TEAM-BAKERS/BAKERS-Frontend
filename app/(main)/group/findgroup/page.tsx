// app/(test)/test/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import styles from "./findgroup.module.css"; // CSS Module 임포트
import { useRouter } from 'next/navigation';

// =================================================================
// 0. 필수 상수 및 LocalStorage 유틸리티 (인증 모듈 임시 통합)
// =================================================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken'; 
type ApiResponse<T> = T; 

function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}
function removeLocalStorageItem(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

/**
 * 🔑 보호된 API 요청 함수: LocalStorage에서 토큰을 읽어와 Authorization 헤더에 추가
 */
async function protectedFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");
  }
  
  const accessToken = getLocalStorageItem(ACCESS_TOKEN_KEY); 

  if (!accessToken) {
    throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다. (LocalStorage is empty)');
  }

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

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      const authError = await response.json().catch(() => ({ message: "인증/권한 오류" }));
      // 인증 오류 발생 시 강제 에러 throw
      throw new Error(`인증 오류 (${response.status}): ${authError.message}. 로그인이 필요합니다.`);
    }

    try {
        const errorData = await response.json();
        throw new Error(errorData.message || `API 요청 실패 (Status: ${response.status})`);
    } catch (e) {
        throw new Error(`API 요청 실패: 서버 응답을 확인할 수 없습니다. Status: ${response.status}`);
    }
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json") || response.status === 204) {
    return {} as ApiResponse<T>; 
  }

  return response.json();
}

// ----------------------------------------------------
// 1. 데이터 타입 정의 (API 명세 반영)
// ----------------------------------------------------
interface Tag {
    tagId: number;
    name: string;
}

interface CrewData {
    groupId: number; // 기존 id -> groupId
    name: string;
    intro: string; // 기존 description -> intro
    tags: Tag[]; // 기존 string[] -> Tag[]
    current: number; // 기존 memberCount -> current
    max: number; // 기존 memberLimit -> max
    distance: number; // 기존 totalDistance -> distance
    imgUrl: string; // 기존 groupImage -> imgUrl
}

// 💡 새로운 API 응답 구조 타입
interface CrewListResponse {
    groupList: CrewData[];
    count: number; // 총 그룹 수
}

// 💡 자동완성 결과 타입 (기존 유지)
interface AutoCompleteResult {
    id: number;
    name: string;
}

interface SignupResponse {
    success: boolean;
    crewId: number;
    message: string;
}

interface CreateGroupResponse {
    success: boolean;
    crewId?: number; // 성공 시에만 존재
    message: string;
}
// ----------------------------------------------------
// 2. 목(Mock) 데이터 배열 선언 (API 응답 구조에 맞게 재구성)
// ----------------------------------------------------
const MOCK_CREW_LIST: CrewListResponse = {
    "groupList": [
        {
            "groupId": 4,
            "name": "스피드 챌린저스 (Mock)",
            "intro": "빠른 페이스로 기록을 깨고 싶은 러너들을 위한 도전형 크루입니다.",
            "tags": [
                { "tagId": 10, "name": "스피드 훈련" },
                { "tagId": 11, "name": "인터벌 트레이닝" },
                { "tagId": 12, "name": "기록 갱신" }
            ],
            "current": 28, // 기존 DUMMY_GROUPS 값 유지
            "max": 50,
            "distance": 243.9, // 기존 DUMMY_GROUPS 값 유지
            "imgUrl": "/solo.png"
        },
        {
            "groupId": 3,
            "name": "탄천 슬로우 러닝 (Mock)",
            "intro": "천천히, 오래 달리고 싶은 러너들을 위한 슬로우 러닝 모임입니다.",
            "tags": [
                { "tagId": 7, "name": "슬로우러닝" },
                { "tagId": 8, "name": "장거리" },
                { "tagId": 9, "name": "조깅" }
            ],
            "current": 42,
            "max": 100,
            "distance": 533.8,
            "imgUrl": "/members1.png"
        },
        {
            "groupId": 2,
            "name": "을지로런 크루 (Mock)",
            "intro": "퇴근 후 을지로 도심을 뛰는 직장인 러닝 크루예요.",
            "tags": [
                { "tagId": 4, "name": "을지로" },
                { "tagId": 5, "name": "청계천" },
                { "tagId": 6, "name": "퇴근" }
            ],
            "current": 14,
            "max": 20,
            "distance": 82.6,
            "imgUrl": "/Variant.png"
        },
        {
            "groupId": 1,
            "name": "한강 러닝 크루 (Mock)",
            "intro": "매일 저녁 7시, 한강에서 같이 달리는 크루입니다.",
            "tags": [
                { "tagId": 1, "name": "저녁" },
                { "tagId": 2, "name": "한강" },
                { "tagId": 3, "name": "초보환영" }
            ],
            "current": 24,
            "max": 30,
            "distance": 453.8,
            "imgUrl": "/Container.png"
        }
    ],
    "count": 4
};

// 💡 API 명세 응답 구조를 모방한 더미 자동완성 데이터 (기존 유지)
const DUMMY_AUTOCOMPLETE: AutoCompleteResult[] = [
    { id: 1, name: "한강 러닝 크루" },
    { id: 5, name: "한강에서" },
    { id: 6, name: "한강" },
    { id: 7, name: "을지로런 크루" },
    { id: 8, name: "탄천 슬로우 러닝" },
    { id: 9, name: "스피드 챌린저스" },
    { id: 10, name: "러닝" },
    { id: 11, name: "크루" },
    { id: 12, name: "챌린저스" },
];


// ----------------------------------------------------
// 3. 재사용 가능한 크루 카드 컴포넌트 정의 (GroupCard)
// ----------------------------------------------------
// 타입 변경: GroupData -> CrewData
function GroupCard({ group, onApplyClick }: { group: CrewData, onApplyClick: (group: CrewData) => void }) {
    
    // API 응답 tags 구조에 맞춰 렌더링 로직 수정
    const renderTags = group.tags.map((tag, index) => (
        <div key={tag.tagId} className={styles.tagdiv}>
            #{tag.name}
        </div>
    ));

    return (
        <div className={styles.infoDetail}>
            {/* 상단 정보 영역 */}
            <div className={styles.upInfo}>
                <Image
                    // imgUrl 필드 사용
                    src={group.imgUrl || "/default-group-image.svg"}
                    alt={`${group.name} 크루 이미지`}
                    width={64} 
                    height={64}
                    className={styles.groupImage} 
                />
                
                <div>
                    <p style={{ fontSize: '17px', fontWeight: '600', color: '#171719' }}>{group.name}</p>
                    {/* intro 필드 사용 */}
                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(46, 47, 51, 0.88)' }}>{group.intro}</p> 
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
                        <Image
                            src="/graymem.svg"
                            alt="멤버 수 아이콘"
                            width={24} 
                            height={24}
                            className={styles.statIcon} 
                        />
                        <p style={{ color: 'rgba(55, 56, 60, 0.61)', fontSize: '12px', fontWeight: '500' }}>
                            {/* current/max 필드 사용 */}
                            {group.current}/{group.max}명
                        </p>
                    </div>
                    <div className={styles.eachStat}>
                        <Image
                            src="/Compass.svg"
                            alt="누적 거리 아이콘"
                            width={24} 
                            height={24}
                            className={styles.statIcon}
                        />
                        <p style={{ color: 'rgba(55, 56, 60, 0.61)', fontSize: '12px', fontWeight: '500' }}>
                            {/* distance 필드 사용 */}
                            {group.distance.toFixed(1)}km
                        </p>
                    </div>
                </div>
                <button 
                    className={styles.applyBtn}
                    onClick={() => onApplyClick(group)}
                >
                    가입 신청
                </button>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// 5. 가입 신청 모달 컴포넌트 (ApplyModal - 변경 없음)
// ----------------------------------------------------
interface ApplyModalProps {
    groupName: string;
    onConfirm: () => void;
    onClose: () => void;
}

function ApplyModal({ groupName, onClose, onConfirm }: ApplyModalProps) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <button className={styles.modalCloseButton} onClick={onClose}>
                    &times; 
                </button>
                <div className={styles.modalTitle}>
                    가입 신청
                </div>
                <h3 className={styles.modalGroupName}>{groupName}</h3>
                <p className={styles.modalBodyText}>
                    이 크루에 가입 신청하시겠어요?
                    <br/>
                    크루장 승인 후 가입이 완료됩니다
                </p>
                <div className={styles.modalButtonArea}>
                    <button 
                        className={styles.modalCancelButton} 
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button 
                        className={styles.modalConfirmButton}
                        onClick={onConfirm} 
                    >
                        신청하기
                    </button>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// 6. 자동완성 항목 컴포넌트 (AutoCompleteItem - 변경 없음)
// ----------------------------------------------------
interface AutoCompleteItemProps {
    result: AutoCompleteResult;
    onClick: (name: string) => void;
}

function AutoCompleteItem({ result, onClick }: AutoCompleteItemProps) {
    return (
        <li 
            className={styles.autocompleteItem} 
            onClick={() => onClick(result.name)}
        >
            {result.name}
        </li>
    );
}

// =================================================================
// 🆕 새 컴포넌트 1: 그룹 생성 플로팅 버튼 (FAB)
// =================================================================
interface CreateGroupFabProps {
    onClick: () => void;
}

function CreateGroupFab({ onClick }: CreateGroupFabProps) {
    return (
        // FAB (Floating Action Button) 스타일을 가정하여 새로운 클래스 이름 사용
        <button className={styles.fabButton} onClick={onClick}>
            {/* ➕ 아이콘 (예: Plus.svg 또는 간단히 '+' 텍스트) */}
            <span style={{ fontSize: '30px', fontWeight: '300', lineHeight: '1', color: '#fff' }}>+</span>
        </button>
    );
}

// =================================================================
// 🆕 새 컴포넌트 2: 그룹 생성 모달 (API 로직 통합)
// =================================================================
interface CreateGroupModalProps {
    onClose: () => void;
    // onCreate 함수 타입 변경: API 호출을 외부에서 관리하도록 수정 (fetchCrewList를 받기 위해)
    onCreate: (name: string, intro: string, maxMember: number) => Promise<void>; 
}

function CreateGroupModal({ onClose, onCreate }: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState('');
    const [groupIntro, setGroupIntro] = useState('');
    const [maxMember, setMaxMember] = useState(20); // 기본값 20
    const [isCreating, setIsCreating] = useState(false); // 로딩 상태 추가

    // 유효성 검사: 이름, 설명, 정원(최소 1명)
    const isFormValid = groupName.trim().length > 0 && 
                        groupIntro.trim().length > 0 && 
                        maxMember >= 1 &&
                        !isCreating; // 생성 중일 때는 비활성화

    const handleCreate = async () => {
        if (!isFormValid || isCreating) return;
        
        setIsCreating(true);
        try {
            await onCreate(groupName, groupIntro, maxMember);
            onClose(); // 성공 시 모달 닫기
        } catch (error) {
            // onCreate 내부에서 에러 처리 및 alert이 이미 수행되므로 여기서는 무시
            console.error("그룹 생성 중 오류 발생:", error);
        } finally {
            setIsCreating(false);
        }
    };
    
    // 정원 증가/감소 핸들러
    const handleMemberChange = (delta: number) => {
        setMaxMember(prev => Math.max(1, prev + delta)); // 최소 1명
    }

 return (

        // 모달 오버레이와 컨테이너는 기존 ApplyModal의 스타일을 재사용하거나 새로 정의해야 함

        <div className={styles.modalOverlay}>

            <div className={styles.createGroupModalContainer}> {/* 새 스타일 클래스 */}

                <button

                    className={styles.modalCloseButton}

                    onClick={onClose}

                    style={{ position: 'absolute', top: '20px', right: '20px' }}

                >

                    &times;

                </button>

                <div className={styles.modalTitle} style={{ fontSize: '17px', fontWeight: '600', marginBottom: '40px' , textAlign:'center'}}>

                    그룹 생성

                </div>

               

                <div className={styles.inputSection}>

                    <p className={styles.inputLabel}>그룹 이름</p>

                    <input

                        type="text"

                        className={styles.groupNameInput}

                        placeholder="그룹 이름을 입력하세요"

                        value={groupName}

                        onChange={(e) => setGroupName(e.target.value)}

                    />

                </div>

               

                <div className={styles.inputSection} style={{ marginTop: '20px' }}>

                    <p className={styles.inputLabel}>그룹 설명</p>

                    <textarea

                        className={styles.groupIntroTextarea}

                        placeholder="그룹에 대해 간단히 설명해주세요."

                        rows={3}

                        value={groupIntro}

                        onChange={(e) => setGroupIntro(e.target.value)}

                    />

                </div>

                <p className={styles.inputLabel}>정원</p>

                <div className={styles.inputSection} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    <div className={styles.memberControl}>

                        <input

                            type="number"

                            className={styles.memberCountInput}

                            value={maxMember}

                            readOnly // 버튼으로만 수정하도록 ReadOnly 설정

                            style={{ textAlign: 'left' }}

                        />

                        <div className={styles.memberButtons}>

                            <button className={styles.memberMinus} onClick={() => handleMemberChange(-1)} disabled={maxMember <= 1}>-</button>

                            <button className={styles.memberPlus} onClick={() => handleMemberChange(1)}>+</button>

                        </div>

                    </div>

                </div>

               

                <div className={styles.modalButtonArea} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>

                    <button className={styles.modalCancelButton} onClick={onClose}>

                        취소

                    </button>

                    <button

                        className={styles.modalConfirmButton}

                        onClick={handleCreate}

                        disabled={!groupName || !groupIntro || maxMember < 1} // 기본 유효성 검사

                    >

                        생성하기

                    </button>

                </div>

            </div>

        </div>

    );

}


// ----------------------------------------------------
// 4. 메인 페이지 컴포넌트 (API 로딩 및 상태 관리)
// ----------------------------------------------------
export default function Findgroup() {
    const router = useRouter();

    // 💡 API 응답을 저장할 상태
    const [crewData, setCrewData] = useState<CrewData[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [autocompleteResults, setAutocompleteResults] = useState<AutoCompleteResult[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalGroupInfo, setModalGroupInfo] = useState<CrewData | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // 💡 인증 오류 처리 핸들러 (챌린지 페이지와 동일)
    const handleAuthError = useCallback(() => {
        removeLocalStorageItem(ACCESS_TOKEN_KEY);
        removeLocalStorageItem(REFRESH_TOKEN_KEY);
        alert("인증 정보가 만료되었거나 유효하지 않습니다. 다시 로그인 해주세요.");
        router.push('/login'); // 적절한 로그인 경로로 수정
    }, [router]);
    
    // 💡 크루 목록 API 호출 함수
    const fetchCrewList = useCallback(async () => {
        setIsLoading(true);
        try {
            // GET /api/crew/list 엔드포인트 호출 (인증 필요)
            const data = await protectedFetch<CrewListResponse>('/api/crew/list', { method: 'GET' });
            
            setCrewData(data.groupList);
            setTotalCount(data.count);

        } catch (error) {
            console.error("크루 목록 API 호출 실패:", error);
            
            if (error instanceof Error && error.message.includes("인증 오류")) {
                handleAuthError();
                return; 
            }

            // API 호출 실패 시 목 데이터로 대체
            setCrewData(MOCK_CREW_LIST.groupList);
            setTotalCount(MOCK_CREW_LIST.count);

        } finally {
            setIsLoading(false);
        }
    }, [handleAuthError]);

    const handleApplyConfirm = useCallback(async () => {
        if (!modalGroupInfo) return;

        const crewIdToSignup = modalGroupInfo.groupId;
        
        // 1. 모달 닫기
        setModalGroupInfo(null);
        console.log(`${modalGroupInfo.name} 크루 가입을 신청합니다...`); // UX를 위한 임시 메시지

        try {
            // POST /api/crew/signup 엔드포인트 호출
            const data = await protectedFetch<SignupResponse>('/api/crew/signup', {
                method: 'POST',
                body: JSON.stringify({ crewId: crewIdToSignup }), //
            });
            
            // 2. API 응답 처리 (성공/실패)
            if (data.success) {
                console.log(`✅ 성공: ${data.message}`); // 크루 가입 완료!
                // 가입 성공 후 크루 목록을 새로고침하거나 UI를 업데이트해야 함
                fetchCrewList(); 
            } else {
                console.log(`❌ 실패: ${data.message}`); // 이미 가입한 크루가 있는 경우
            }

        } catch (error) {
            console.error("크루 가입 신청 API 호출 실패:", error);
            
            if (error instanceof Error && error.message.includes("인증 오류")) {
                handleAuthError();
            } else {
                console.log(`⛔ 오류 발생: 가입 신청에 실패했습니다.`);
            }
        }
    }, [modalGroupInfo, handleAuthError, fetchCrewList]);


    useEffect(() => {
        // 컴포넌트 마운트 시 크루 목록 API 호출
        fetchCrewList();
    }, [fetchCrewList]);


    // 💡 자동완성 API 호출 시뮬레이션 함수 (기존 유지)
    const fetchAutocomplete = (keyword: string) => {
        // 실제 API 호출 (GET /api/crew/search/keyword?keyword=...) 대신 더미 데이터 사용

        if (!keyword.trim()) {
            setAutocompleteResults([]);
            return;
        }

        const filtered = DUMMY_AUTOCOMPLETE
            .filter(item => 
                item.name.toLowerCase().startsWith(keyword.toLowerCase())
            )
            .slice(0, 5); 
            
        setAutocompleteResults(filtered);
    }
    
    // 💡 검색어 변경 핸들러
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);

        // 검색어가 변경될 때마다 자동완성 함수 호출
        fetchAutocomplete(newSearchTerm);
    };

    // 💡 자동완성 항목 클릭 핸들러
    const handleAutocompleteClick = (name: string) => {
        setSearchTerm(name); 
        setAutocompleteResults([]); 
        // 💡 실제로는 여기서 필터링된 크루 목록 API를 호출해야 함 (예: fetchCrewList(name);)
        // 현재는 더미데이터이므로 목록 변화 없음
    }


    // 💡 모달 열기/닫기 핸들러 (기존 유지)
    const handleOpenModal = (group: CrewData) => {
        setModalGroupInfo(group);
    };
    const handleCloseModal = () => {
        setModalGroupInfo(null);
    };
    // 🟢 새 핸들러: 그룹 생성 모달 열기/닫기
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };
    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    // 🟢 새 핸들러: 그룹 생성 API 호출 및 처리 로직 (POST /api/crew)
    const handleCreateGroupConfirm = useCallback(async (name: string, intro: string, maxMember: number) => {
        
        try {

            // POST /api/crew 엔드포인트 호출
            const data = await protectedFetch<CreateGroupResponse>('/api/crew', {
                method: 'POST',
                // API 명세에 따른 Request Body 구성
                body: JSON.stringify({ 
                    name: name,
                    intro: intro,
                    max: maxMember 
                }), 
            });
            
            // API 응답 처리
            if (data.success) {
                console.log(`✅ 그룹 생성 완료: ${data.message} (ID: ${data.crewId})`);
                // 생성 성공 후 크루 목록을 새로고침
                fetchCrewList(); 
            } else {
                // 이미 가입한 크루가 있는 경우 등 실패 메시지
                console.log(`❌ 그룹 생성 실패: ${data.message}`);
            }

        } catch (error) {
            console.error("그룹 생성 API 호출 실패:", error);
            
            if (error instanceof Error && error.message.includes("인증 오류")) {
                handleAuthError();
            } else {
                // 서버 에러 메시지를 표시
                console.log(`⛔ 오류 발생: ${error instanceof Error ? error.message : "그룹 생성에 실패했습니다."}`);
            }
            // 오류 발생 시 모달을 닫지 않고 사용자에게 오류 내용을 보여주는 것이 일반적이지만, 
            // 현재 CreateGroupModal 로직에 따라 모달을 닫는 처리는 CreateGroupModal 내부에서 수행합니다.
            throw error; // CreateGroupModal에서 catch하도록 오류를 다시 throw
        }
    }, [fetchCrewList, handleAuthError]); // 의존성 추가
    // 로딩 중 표시
    if (isLoading) {
        return (
            <div className={styles.outerContainer}>
                <div className={styles.container}>
                    <div className={styles.upperContainer}>
                        <p style={{fontSize:'20px', fontWeight:'600', marginTop:'16px'}}>크루 찾기</p>
                        <div className={styles.searchBox}><div className={styles.searchInput}>로딩 중...</div></div>
                    </div>
                    <hr style={{ width: '100%', border: '1px solid #e5e7eb' }}/>
                    <p style={{ margin: '50px', textAlign: 'center' }}>크루 목록을 불러오는 중입니다.</p>
                </div>
            </div>
        );
    }


    return(
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <div className={styles.upperContainer}>
                    <p style={{fontSize:'20px', fontWeight:'600', marginTop:'16px'}}>크루 찾기</p>
                    
                    {/* 검색창과 자동완성 목록을 감싸는 div 추가 */}
                    <div className={styles.searchAutocompleteWrapper}>
                        <div className={styles.searchBox}>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="크루명 또는 태그를 입력해주세요"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* 자동완성 결과 목록 조건부 렌더링 */}
                        {autocompleteResults.length > 0 && (
                            <ul className={styles.autocompleteList}>
                                {autocompleteResults.map((result) => (
                                    <AutoCompleteItem 
                                        key={result.id} 
                                        result={result} 
                                        onClick={handleAutocompleteClick}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                
                <hr style={{ width: '100%', border: '1px solid #e5e7eb' }}/>

                <div className={styles.infoContainer}>
                    <p style={{fontSize:'16px',fontWeight:'400',color:'#171719', marginTop:'24px', marginBottom:'24px'}}>
                        총 <span style={{color:'#06f', fontWeight:'600'}}>{totalCount}개</span>의 크루를 찾았습니다
                    </p>
                    
                    {crewData.map((group) => (
                        <GroupCard 
                            key={group.groupId} // groupId 사용
                            group={group} 
                            onApplyClick={handleOpenModal}
                        />
                    ))}
                </div>
            </div>
            
            {/* 모달 조건부 렌더링 */}
            {modalGroupInfo && (
                <ApplyModal 
                    groupName={modalGroupInfo.name} 
                    onClose={handleCloseModal} 
                    onConfirm={handleApplyConfirm} // 🟢 [추가된 부분] API 호출 함수 연결
                />
            )}

            {/* 🟢 플로팅 버튼 추가 */}
            <CreateGroupFab onClick={handleOpenCreateModal} />

            {/* 🟢 그룹 생성 모달 조건부 렌더링 */}
            {isCreateModalOpen && (
                <CreateGroupModal 
                    onClose={handleCloseCreateModal}
                    onCreate={handleCreateGroupConfirm} // 나중에 API 연결
                />
            )}
        </div>
    );
}