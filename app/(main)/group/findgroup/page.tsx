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
                    src={group.imgUrl} 
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
        alert(`${modalGroupInfo.name} 크루 가입을 신청합니다...`); // UX를 위한 임시 메시지

        try {
            // POST /api/crew/signup 엔드포인트 호출
            const data = await protectedFetch<SignupResponse>('/api/crew/signup', {
                method: 'POST',
                body: JSON.stringify({ crewId: crewIdToSignup }), //
            });
            
            // 2. API 응답 처리 (성공/실패)
            if (data.success) {
                alert(`✅ 성공: ${data.message}`); // 크루 가입 완료!
                // 가입 성공 후 크루 목록을 새로고침하거나 UI를 업데이트해야 함
                fetchCrewList(); 
            } else {
                alert(`❌ 실패: ${data.message}`); // 이미 가입한 크루가 있는 경우
            }

        } catch (error) {
            console.error("크루 가입 신청 API 호출 실패:", error);
            
            if (error instanceof Error && error.message.includes("인증 오류")) {
                handleAuthError();
            } else {
                alert(`⛔ 오류 발생: 가입 신청에 실패했습니다.`);
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
        </div>
    );
}