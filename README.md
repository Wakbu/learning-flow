# Dynamic Learning Graph

개인 보안 학습 과정을 React 기반 동적 그래프로 시각화한 프로젝트입니다.
네트워크, Linux 서버 운영, 웹/DB 구현, 로그 파이프라인, IDS/SIEM, CTF, 권한 상승, 포트폴리오 정리까지 이어지는 학습 흐름을 하나의 인터랙티브 페이지로 구성했습니다.

## 프로젝트 목적

이 프로젝트는 단순히 "어떤 기술을 공부했다"를 나열하는 것이 아니라, 실제 질문과 실습 흐름을 기반으로 다음 내용을 시각화하는 것을 목표로 합니다.

* 어떤 문제를 실습하면서 마주쳤는지
* 그 문제가 어떤 보안/인프라 개념과 연결되는지
* 어떤 도구와 환경을 사용했는지
* 해당 경험을 포트폴리오나 면접에서 어떻게 설명할 수 있는지

즉, 보안 학습 기록을 보기 쉬운 웹 기반 포트폴리오 자료로 정리하기 위한 프로젝트입니다.

## 주요 기능

### 1. 동적 학습 그래프

각 학습 주제를 노드로 표현하고, 노드 사이의 관계를 연결선으로 시각화했습니다.

예시 흐름:

```text
패킷 흐름 이해
→ 라우팅·VLAN 설계
→ 가상 보안랩 구축
→ Linux 서비스 운영
→ 로그 수집·저장 구조
→ IDS/SIEM 탐지 룰
→ 포트폴리오·취업 연결
```

### 2. 데이터 흐름 애니메이션

노드 사이 연결선 위로 작은 입자가 이동하면서 학습 내용이 다른 주제로 확산되는 느낌을 표현했습니다.

### 3. 검색 기능

상단 검색창에서 특정 키워드를 검색할 수 있습니다.

예시:

```text
Snort
SUID
MariaDB
OSPF
Burp
Hydra
LogAnalyzer
```

검색어와 관련된 노드는 강조되고, 관련 없는 노드는 흐리게 표시됩니다.

### 4. 카테고리 필터

학습 영역별로 노드를 필터링할 수 있습니다.

카테고리 예시:

```text
네트워크 기반
CTF/탐색
실습 인프라
서버 운영
웹/DB 프로젝트
로그 파이프라인
탐지/관제
CTF/웹 취약점
CTF/권한 상승
보안 개념
문서화/진로
```

### 5. 확대/축소 및 드래그 이동

그래프 영역은 확대/축소할 수 있고, 마우스 드래그로 이동할 수 있습니다.
스크롤바를 사용하지 않고 그래프 자체를 움직이도록 구성해 시각적으로 더 깔끔하게 만들었습니다.

### 6. 상세 패널

노드를 클릭하면 우측 패널에서 해당 학습 영역의 상세 내용을 확인할 수 있습니다.

표시되는 내용:

* 이 노드의 의미
* 실제로 던졌던 질문 유형
* 연결되는 핵심 개념
* 실습 흔적·도구·환경
* 포트폴리오에서의 의미
* 면접에서 설명 가능한 요약 문장
* 직접 연결된 흐름

## 학습 영역 구성

이 프로젝트에 포함된 주요 학습 영역은 다음과 같습니다.

| 영역        | 내용                                                        |
| --------- | --------------------------------------------------------- |
| 네트워크 기반   | ACL, 라우팅, 상태 기반 방화벽, OSPF, EIGRP, VLAN                    |
| 실습 인프라    | VirtualBox, GNS3, 다중 VM, WEB/DNS/DB 서버 분리                 |
| 서버 운영     | Linux, Apache, MariaDB, BIND DNS, SSH, firewalld, SELinux |
| 웹/DB 프로젝트 | PHP, MariaDB, 로그인, 세션, 권한별 UI, CRUD                       |
| 로그 파이프라인  | rsyslog, MariaDB, LogAnalyzer, 로그 포워딩                     |
| 탐지/관제     | Snort, Wazuh, Graylog, OSSEC, 탐지 룰 작성                     |
| CTF/웹 취약점 | SQL Injection, LFI, 인증 우회, Burp Suite                     |
| CTF/권한 상승 | SUID, sudo, polkit, bash -p, GTFOBins                     |
| 보안 개념     | SIEM, XDR, DMZ, PKI, 전자서명, CA/RA                          |
| 문서화/진로    | Notion, PDF 정리, 자격증, 인프라 보안 직무 연결                         |

## 기술 스택

| 구분         | 기술                           |
| ---------- | ---------------------------- |
| Frontend   | React                        |
| Build Tool | Vite                         |
| Styling    | Tailwind CSS                 |
| Animation  | Framer Motion, SVG Animation |
| Icons      | lucide-react                 |
| Deployment | GitHub Pages                 |

## 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/깃허브아이디/learning-flow.git
cd learning-flow
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

실행 후 브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:5173/
```

## GitHub Pages 배포

GitHub Pages로 배포하려면 `vite.config.js`의 `base` 값을 저장소 이름과 맞춰야 합니다.

예를 들어 저장소 이름이 `learning-flow`라면:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite 설정 파일입니다.
 * GitHub Pages 배포 시 base 경로는 저장소 이름과 동일해야 합니다.
 */
export default defineConfig({
  base: "/learning-flow/",
  plugins: [react(), tailwindcss()],
});
```

배포 주소는 보통 아래와 같은 형태입니다.

```text
https://깃허브아이디.github.io/learning-flow/
```

## Git 커밋 예시

처음 프로젝트를 올릴 때:

```bash
git init
git add .
git commit -m "Add dynamic learning graph project"
git branch -M main
git remote add origin https://github.com/깃허브아이디/learning-flow.git
git push -u origin main
```

기능 수정 후:

```bash
git add src/LearningFlowVisualization.jsx README.md
git commit -m "Improve interactive learning graph portfolio"
git push
```

## 추천 저장소 설명

GitHub 저장소 설명에는 아래 문장을 사용할 수 있습니다.

```text
Interactive React visualization of my cybersecurity learning journey across networking, Linux, SIEM, IDS, CTF, and portfolio preparation.
```

## 향후 개선 사항

* 그래프 데이터와 UI 컴포넌트 분리
* 모바일 전용 카드 리스트 모드 추가
* 특정 학습 흐름만 강조하는 프리셋 모드 추가
* 각 노드별 관련 스크린샷 또는 실습 보고서 링크 추가
* 실제 GitHub Pages 배포 주소 README에 추가

## 프로젝트 의미

이 프로젝트는 보안 학습 과정을 단순 목록이 아니라 연결 구조로 보여주기 위한 시도입니다.
네트워크, 서버, 로그, 탐지, 취약점 분석, 문서화가 서로 분리된 공부가 아니라 하나의 인프라 보안 학습 흐름으로 이어진다는 점을 보여주는 데 초점을 두었습니다.
