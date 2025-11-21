'use client';
import styles from "./group.module.css";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Group() {
    const router = useRouter();

    const handleFindGroup = () => {
        router.push("/group/findgroup");
    };
    return(
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <div className={styles.upperSection}>
                    <p style={{ fontSize: '28px', fontWeight:'700',color:'#fff', marginTop:'18px', marginBottom:'32px' }}>그룹</p>
                    <div className={styles.rectangle1}>
                        <div className={styles.rectangle2}>
                            <Image
                            src="/Social.svg"
                            alt="사람 아이콘"
                            width={48} 
                            height={100}
                            className={styles.statIcon}
                        />
                        </div>
                        <p style={{ fontSize: '20px', fontWeight:'600',color:'#fff', marginBottom:'4px' }}>아직 그룹이 없어요</p>
                        <p style={{ fontSize: '14px', fontWeight:'500',color:'#fff', marginBottom:'20px' }}>그룹에 가입하고 함께 달려보세요!</p>
                        <button className={styles.findBtn} onClick={handleFindGroup}><img></img>그룹 찾아보기</button>
                    </div>
                </div>
                <div>
                    <p style={{ fontSize: '16px', fontWeight:'600',color:'#171719', marginLeft:'20px', marginTop:'24px', marginBottom:'12px'}}>그룹이란?</p>
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
                                <p style={{ fontSize: '14px', fontWeight:'600',color:'rgba(55, 56, 60, 0.61)'}}>그룹원들과 목표를 함께 달성하세요</p>
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
                                <p style={{ fontSize: '14px', fontWeight:'600',color:'rgba(55, 56, 60, 0.61)'}}>그룹 내에서 순위를 겨루어 보세요</p>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    );
}