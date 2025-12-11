// app/(test)/test/page.tsx

"use client";

import React, { useState, FormEvent } from 'react';

// =================================================================
// 1. ⚙️ 환경 변수 및 상수 정의
// =================================================================

// NEXT_PUBLIC_API_URL은 .env.local 파일에 설정된 값을 사용합니다.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// =================================================================
// 2. 💾 LocalStorage 유틸리티 함수
//    (Client Component에서만 작동)
// =================================================================

/**
 * LocalStorage에 값을 설정합니다.
 */
function setLocalStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

/**
 * LocalStorage에서 값을 가져옵니다.
 */
function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

/**
 * LocalStorage에서 키와 값을 제거합니다.
 */
function removeLocalStorageItem(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// =================================================================
// 3. 🔑 API 호출 함수 (이전 코드와 동일)
// =================================================================

// 타입 정의
interface SignupRequest { email: string; password: string; nickname: string; }
interface SignupResponse { id: number; email: string; nickname: string; }
interface SigninRequest { email: string; password: string; }
interface SigninResponse { accessToken: string; refreshToken: string; tokenType: 'Bearer'; expiresIn: number; }

/**
 * 회원가입 API 호출
 */
async function signup(data: SignupRequest): Promise<SignupResponse> {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");
  
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '회원가입에 실패했습니다.');
  }
  return response.json();
}

/**
 * 로그인 API 호출
 */
async function signin(data: SigninRequest): Promise<SigninResponse> {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");

  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.');
  }
  return response.json();
}

// =================================================================
// 4. 🖥️ 메인 인증 컴포넌트
// =================================================================

export default function AuthTestPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('test@naver.com');
  const [password, setPassword] = useState('12345678');
  const [nickname, setNickname] = useState('건우');
  const [message, setMessage] = useState('');
  
  // 상태 변화 시 LocalStorage를 직접 읽어와 표시 (렌더링 시마다 최신 상태 반영)
  // 쿠키 대신 getLocalStorageItem 사용
  const currentAccessToken = getLocalStorageItem(ACCESS_TOKEN_KEY);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('⏳ 요청 처리 중...');

    try {
      if (isLoginMode) {
        // --- 로그인 로직 ---
        const result = await signin({ email, password });
        
        // 액세스 토큰과 리프레시 토큰을 LocalStorage에 저장
        setLocalStorageItem(ACCESS_TOKEN_KEY, result.accessToken); 
        setLocalStorageItem(REFRESH_TOKEN_KEY, result.refreshToken); 
        
        // 토큰이 저장되었으므로 컴포넌트 강제 재렌더링
        // (getLocalStorageItem 호출로 상태 반영됨)
        
        setMessage(`✅ 로그인 성공! LocalStorage에 토큰 저장 완료. 환영합니다!`);

      } else {
        // --- 회원가입 로직 ---
        const result = await signup({ email, password, nickname });
        
        setMessage(`✅ 회원가입 성공! ID: ${result.id} (${result.email}). 이제 로그인 모드로 전환합니다.`);
        
        // 성공 후 로그인 폼으로 자동 전환
        setIsLoginMode(true);
      }
    } catch (error) {
      console.error('인증 오류:', error);
      setMessage(`❌ 오류: ${error instanceof Error ? error.message : '알 수 없는 오류 발생'}`);
    }
  };

  const handleLogout = () => {
    // LocalStorage에서 토큰 삭제
    removeLocalStorageItem(ACCESS_TOKEN_KEY);
    removeLocalStorageItem(REFRESH_TOKEN_KEY);
    setMessage('로그아웃 되었습니다. LocalStorage 토큰 삭제 완료.');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h2>{isLoginMode ? '🔑 로그인 테스트 (LocalStorage)' : '📝 회원가입 테스트 (LocalStorage)'}</h2>
      <p style={{ fontWeight: 'bold', color: currentAccessToken ? 'green' : 'red' }}>
        현재 로그인 상태: **{currentAccessToken ? '로그인됨 (토큰 있음)' : '로그아웃됨 (토큰 없음)'}**
        <span style={{ fontSize: '12px', color: '#666', display: 'block' }}>
            (개발자 도구 → Application → Local Storage에서 확인 가능)
        </span>
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px', border: '1px solid #ddd' }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px', border: '1px solid #ddd' }}
        />
        {!isLoginMode && (
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            style={{ padding: '8px', border: '1px solid #ddd' }}
          />
        )}
        
        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: isLoginMode ? '#0070f3' : '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isLoginMode ? '로그인' : '회원가입'}
        </button>
      </form>

      <button 
        onClick={() => setIsLoginMode(!isLoginMode)} 
        style={{ marginTop: '15px', padding: '8px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', width: '100%', cursor: 'pointer' }}
      >
        {isLoginMode ? '👉 회원가입 모드로 전환' : '👈 로그인 모드로 전환'}
      </button>

      {currentAccessToken && (
        <button 
          onClick={handleLogout} 
          style={{ marginTop: '10px', padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', width: '100%', cursor: 'pointer' }}
        >
          🚫 로그아웃 (토큰 삭제)
        </button>
      )}

      {message && <p style={{ marginTop: '20px', padding: '10px', backgroundColor: message.startsWith('✅') ? '#ecfdf5' : '#fee2e2', border: '1px solid', borderColor: message.startsWith('✅') ? '#a7f3d0' : '#fca5a5', borderRadius: '4px' }}>{message}</p>}
      
      <p style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        **백엔드 URL**: {API_BASE_URL || 'NEXT_PUBLIC_API_URL 미설정'}
      </p>
    </div>
  );
}