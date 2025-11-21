import styles from "./challenge.module.css";
import Image from 'next/image';

export default function Challenge() {
    return(
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <div className={styles.upperSection}>
                    <p style={{ fontSize: '24px', fontWeight:'700',color:'#fff', marginTop:'18px' }}>챌린지</p>
                    <p style={{ fontSize: '16px', fontWeight:'500',color:'#fff', marginTop:'4px', marginBottom:'40px' }}>목표를 향해 함께 달려요</p>
                </div>
                <div className={styles.infoContainer}>
                    <p style={{ fontSize: '16px', fontWeight:'600',color:'#171719', marginTop:'32px'}}>진행 중인 그룹 챌린지</p>
                    <div className={styles.infoDetail}>
                        <div className={styles.upInfo}>
                            <div className={styles.imgWrap}>
                                <Image
                                                src="/whiteTrophy.svg"
                                                alt="달성 아이콘"
                                                width={28} 
                                                height={28}
                                            />
                            </div>
                            <div style={{marginRight:'auto'}}>
                                <p style={{ fontSize: '17px', fontWeight:'600',color:'#171719'}}>11월 대전 챌린지</p>
                                <p style={{ fontSize: '13px', fontWeight:'500',color:'rgba(55, 56, 60, 0.61)'}}>크루 전체가 함께 달려요</p>
                            </div>
                            <div className={styles.ddaywrap}><Image
                                                src="/brownClock.svg"
                                                alt="디데이 아이콘"
                                                width={16} 
                                                height={16}
                                            />D-16</div>
                        </div>
                        <div className={styles.midInfo}>
                            <p style={{ fontSize: '14px', fontWeight:'400',color:'rgba(55, 56, 60, 0.61)'}}>진행률</p>
                            <p style={{ fontSize: '14px', fontWeight:'600',color:'#000'}}>184.5/200 km</p>
                        </div>
                        <div 
                    className={styles.progressBarContainer}
                    style={{ height: `8px` }} 
                    >
                    <div
                        className={styles.progressBarFill}
                        style={{ 
                            width: `92%`, // 동적으로 너비 설정
                            backgroundColor: `#06f`, // 동적으로 색상 설정
                        }}
                    />
                    </div>
                        <div className={styles.wrap}><p style={{fontSize:'13px', fontWeight:'500', color:'#06f', marginLeft:'auto'}}>92% 달성</p></div>
                    </div>
                    <div className={styles.infoDetail}>
                        <div className={styles.upInfo}>
                            <div className={styles.imgWrap}>
                                <Image
                                                src="/whiteTrophy.svg"
                                                alt="달성 아이콘"
                                                width={28} 
                                                height={28}
                                            />
                            </div>
                            <div style={{marginRight:'auto'}}>
                                <p style={{ fontSize: '17px', fontWeight:'600',color:'#171719'}}>주간 100km 챌린지</p>
                                <p style={{ fontSize: '13px', fontWeight:'500',color:'rgba(55, 56, 60, 0.61)'}}>100km에 도전 해보세요</p>
                            </div>
                            <div className={styles.ddaywrap}><Image
                                                src="/brownClock.svg"
                                                alt="디데이 아이콘"
                                                width={16} 
                                                height={16}
                                            />D-3</div>
                        </div>
                        <div className={styles.midInfo}>
                            <p style={{ fontSize: '14px', fontWeight:'400',color:'rgba(55, 56, 60, 0.61)'}}>진행률</p>
                            <p style={{ fontSize: '14px', fontWeight:'600',color:'#000'}}>78.3/100 km</p>
                        </div>
                        <div 
                    className={styles.progressBarContainer}
                    style={{ height: `8px` }} 
                    >
                    <div
                        className={styles.progressBarFill}
                        style={{ 
                            width: `78%`, // 동적으로 너비 설정
                            backgroundColor: `#06f`, // 동적으로 색상 설정
                        }}
                    />
                    </div>
                        <div className={styles.wrap}><p style={{fontSize:'13px', fontWeight:'500', color:'#06f', marginLeft:'auto'}}>78% 달성</p></div>
                    </div>
                </div>
                <div className={styles.infoContainer}>
                    <p style={{ fontSize: '16px', fontWeight:'600',color:'#171719', marginTop:'32px'}}>나의 개인 챌린지</p>
                    <div className={styles.infoDetail}>
                        <div className={styles.upInfo}>
                            <div className={styles.imgWrap} style={{backgroundColor:'#632FE9'}}>
                                <Image
                                                src="/star.svg"
                                                alt="달성 아이콘"
                                                width={28} 
                                                height={28}
                                            />
                            </div>
                            <div style={{marginRight:'88px'}}>
                                <p style={{ fontSize: '17px', fontWeight:'600',color:'#171719'}}>주 3회 러닝하기</p>
                                <p style={{ fontSize: '13px', fontWeight:'500',color:'rgba(55, 56, 60, 0.61)'}}>이번 주 목표 달성</p>
                            </div>
                            <div className={styles.ddaywrap}><Image
                                                src="/brownClock.svg"
                                                alt="디데이 아이콘"
                                                width={16} 
                                                height={16}
                                            />D-16</div>
                        </div>
                        <div className={styles.midInfo}>
                            <p style={{ fontSize: '14px', fontWeight:'400',color:'rgba(55, 56, 60, 0.61)'}}>진행률</p>
                            <p style={{ fontSize: '14px', fontWeight:'600',color:'#000'}}>2/3 회</p>
                        </div>
                        <div 
                    className={styles.progressBarContainer}
                    style={{ height: `8px` }} 
                    >
                    <div
                        className={styles.progressBarFill}
                        style={{ 
                            width: `67%`, // 동적으로 너비 설정
                            backgroundColor: `#632FE9`, // 동적으로 색상 설정
                        }}
                    />
                    </div>
                        <div className={styles.wrap}><p style={{fontSize:'13px', fontWeight:'500', color:'#632FE9', marginLeft:'auto'}}>67% 달성</p></div>
                    </div>
                    <div className={styles.infoDetail}>
                        <div className={styles.upInfo}>
                            <div className={styles.imgWrap} style={{backgroundColor:'#632FE9'}}>
                                <Image
                                                src="/star.svg"
                                                alt="달성 아이콘"
                                                width={28} 
                                                height={28}
                                            />
                            </div>
                            <div style={{marginRight:'auto'}}>
                                <p style={{ fontSize: '17px', fontWeight:'600',color:'#171719'}}>10km 달성하기</p>
                                <p style={{ fontSize: '13px', fontWeight:'500',color:'rgba(55, 56, 60, 0.61)'}}>개인 기록 경신 도전</p>
                            </div>
                        </div>
                        <div className={styles.midInfo}>
                            <p style={{ fontSize: '14px', fontWeight:'400',color:'rgba(55, 56, 60, 0.61)'}}>진행률</p>
                            <p style={{ fontSize: '14px', fontWeight:'600',color:'#000'}}>5.2/10 km</p>
                        </div>
                        <div 
                    className={styles.progressBarContainer}
                    style={{ height: `8px` }} 
                    >
                    <div
                        className={styles.progressBarFill}
                        style={{ 
                            width: `52%`, // 동적으로 너비 설정
                            backgroundColor: `#632FE9`, // 동적으로 색상 설정
                        }}
                    />
                    </div>
                        <div className={styles.wrap}><p style={{fontSize:'13px', fontWeight:'500', color:'#632FE9', marginLeft:'auto'}}>52% 달성</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}