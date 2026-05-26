import {
  BookOpen,
  Briefcase,
  Code2,
  FileSearch,
  KeyRound,
  Layers,
  Network,
  Radar,
  Route,
  Search,
  Server,
  Workflow,
} from "lucide-react";

/**
 * 학습 그래프에 표시할 노드 데이터입니다.
 *
 * 이 파일은 UI 컴포넌트와 데이터를 분리하기 위해 만들었습니다.
 * LearningFlowVisualization.jsx에서는 이 데이터를 import해서 사용하면 됩니다.
 *
 * 각 노드 필드 설명:
 * - id: 노드를 구분하는 고유 ID입니다.
 * - group: 카테고리 필터에 사용되는 그룹명입니다.
 * - title: 노드 카드와 상세 패널에 표시되는 제목입니다.
 * - subtitle: 노드 카드에 표시되는 짧은 설명입니다.
 * - x, y: SVG viewBox 기준 노드 좌표입니다.
 * - icon: lucide-react 아이콘 컴포넌트입니다.
 * - level: 노드 배지에 표시되는 학습 성격입니다.
 * - summary: 상세 패널의 "이 노드의 의미"에 표시됩니다.
 * - questions: 실제 질문 유형입니다.
 * - concepts: 연결되는 핵심 개념입니다.
 * - labs: 실습 흔적, 도구, 환경입니다.
 * - portfolio: 포트폴리오 관점에서의 의미입니다.
 */
export const learningGraphNodes = [
  {
    id: "network-core",
    group: "네트워크 기반",
    title: "패킷 흐름 이해",
    subtitle: "ACL, 라우팅, 상태 기반 통신",
    x: 120,
    y: 420,
    icon: Network,
    level: "기반",
    summary:
      "단순히 명령어를 외우는 것이 아니라, 패킷이 어느 방향으로 흐르고 어떤 장비에서 허용/차단되는지 계속 확인한 영역입니다.",
    questions: [
      "ACL inbound/outbound 방향이 실제 차단 결과에 어떤 영향을 주는가?",
      "ASAv나 pfSense에서 응답 패킷은 왜 별도 허용 없이 돌아오는가?",
      "ICMP echo와 echo-reply를 각각 어떻게 구분해서 필터링하는가?",
    ],
    concepts: ["상태 기반 방화벽", "표준/확장 ACL", "라우팅 테이블", "NAT/PAT", "ICMP 흐름"],
    labs: ["Packet Tracer", "GNS3", "Cisco ASAv", "pfSense", "traceroute/ping 기반 검증"],
    portfolio:
      "네트워크 구성도와 패킷 흐름 설명을 같이 적으면, 단순 툴 사용자가 아니라 통신 구조를 이해하는 지원자로 보일 수 있습니다.",
  },
  {
    id: "routing-vlan",
    group: "네트워크 기반",
    title: "라우팅·VLAN 설계",
    subtitle: "OSPF/EIGRP/VLAN/HSRP",
    x: 300,
    y: 180,
    icon: Route,
    level: "심화",
    summary:
      "여러 네트워크 대역을 나누고, 라우팅 프로토콜과 게이트웨이 이중화를 연결해서 생각한 영역입니다.",
    questions: [
      "OSPF area와 router-id는 실제로 어떤 역할을 하는가?",
      "EIGRP와 OSPF를 재분배할 때 경계는 어디가 되는가?",
      "VLAN access/trunk/native VLAN은 어떤 상황에서 필요한가?",
      "HSRP/VRRP는 장애 상황에서 어떻게 게이트웨이를 유지하는가?",
    ],
    concepts: ["동적 라우팅", "라우팅 재분배", "VLAN 분리", "게이트웨이 이중화", "서브넷 설계"],
    labs: ["/26 서브넷 분할", "조직별 VLAN", "OSPF 네트워크 선언", "pfSense 정적 라우팅"],
    portfolio:
      "보안 장비 이전에 네트워크 자체를 설계할 수 있다는 증거가 됩니다. 인프라 보안 직무에서 특히 중요합니다.",
  },
  {
    id: "fuzz-crack",
    group: "CTF/탐색",
    title: "퍼징·크래킹·단서 추론",
    subtitle: "ffuf, Hydra, wordlist, SSH key",
    x: 120,
    y: 160,
    icon: Search,
    level: "탐색",
    summary:
      "숨겨진 경로, 계정, 인증키, 약한 비밀번호를 찾는 과정에서 도구의 한계와 단서 추론 문제를 고민한 영역입니다.",
    questions: [
      "ffuf 확장자 옵션이나 필터 옵션은 왜 안 먹는가?",
      "rockyou.txt로 무작정 찾는 것이 너무 오래 걸릴 때 어떻게 단서를 줄이는가?",
      "id_rsa는 왜 잘 알려진 SSH 키 파일명인가?",
      "magellan 같은 계정명을 어떻게 유추하라는 CTF는 합리적인가?",
    ],
    concepts: ["디렉터리 퍼징", "워드리스트", "브루트포스", "SSH private key", "단서 기반 추론", "CTF 품질 평가"],
    labs: ["ffuf", "Hydra", "rockyou.txt", "directory-list", "common.txt 비교", "known_hosts", "id_rsa"],
    portfolio:
      "단순 자동화 도구 사용보다 단서를 어떻게 줄이고, 불필요한 시도를 어떻게 배제했는지 보여주면 분석력이 드러납니다.",
  },
  {
    id: "virtual-lab",
    group: "실습 인프라",
    title: "가상 보안랩 구축",
    subtitle: "VirtualBox, GNS3, 다중 VM",
    x: 500,
    y: 300,
    icon: Layers,
    level: "실습",
    summary:
      "여러 VM을 동시에 켜고 WEB/DNS/DB/보안 장비를 분리하면서 실제 인프라 형태에 가깝게 실습한 영역입니다.",
    questions: [
      "VirtualBox에서 여러 VM을 켜면 왜 멈추거나 중단되는가?",
      "WEB, DNS, DB 서버를 분리하면 방화벽 규칙은 어떻게 잡아야 하는가?",
      "GNS3와 VirtualBox VM을 함께 붙일 때 네트워크 연결은 어떻게 구성하는가?",
    ],
    concepts: ["가상 네트워크", "NAT/브리지/Host-only", "리소스 병목", "서비스 분리", "보안 구역 설계"],
    labs: ["WEB .101", "DNS .102", "DB .103", "Kali/Windows/Wazuh/Graylog", "VM 리소스 조절"],
    portfolio:
      "구성도, IP 주소표, 서버 역할표를 남기면 실제 보안 실습 인프라를 직접 설계했다는 자료가 됩니다.",
  },
  {
    id: "linux-service",
    group: "서버 운영",
    title: "Linux 서비스 운영",
    subtitle: "Apache, SSH, DNS, MariaDB",
    x: 760,
    y: 160,
    icon: Server,
    level: "운영",
    summary:
      "웹 서버, DNS, DB, SSH, 방화벽, SELinux 문제를 직접 만지면서 서비스 운영 감각을 쌓은 영역입니다.",
    questions: [
      "Apache에서 기본 페이지를 login.php나 index.php로 보내려면 어떻게 하는가?",
      "BIND named.conf에서 listen-on과 recursion 설정은 어떤 의미인가?",
      "MariaDB 계정 권한에서 localhost와 % 또는 192.168.x.%는 어떻게 다른가?",
      "SSH known_hosts, 인증키, 권한 문제는 어떻게 해결하는가?",
    ],
    concepts: ["systemd", "firewalld", "SELinux", "Apache DirectoryIndex", "MariaDB GRANT", "BIND zone"],
    labs: ["Rocky Linux", "Ubuntu", "Debian", "httpd", "named", "sshd", "mariadb"],
    portfolio:
      "보안 도구만 쓰는 것이 아니라 서버 자체를 배포·운영·문제 해결할 수 있다는 근거가 됩니다.",
  },
  {
    id: "web-db-app",
    group: "웹/DB 프로젝트",
    title: "PHP·MariaDB 관리 시스템",
    subtitle: "People/Trade, 권한별 UI",
    x: 1060,
    y: 300,
    icon: Code2,
    level: "구현",
    summary:
      "직접 만든 웹 프로젝트에서 로그인, 세션, 권한별 메뉴, 검색, 정렬, 페이지네이션, 다크모드까지 구현한 영역입니다.",
    questions: [
      "부서별로 People/Trade 메뉴를 다르게 보여주려면 어떻게 설계하는가?",
      "password 컬럼은 목록에서 어떻게 숨기는가?",
      "검색, 정렬, 페이지네이션을 기존 코드 최소 수정으로 어떻게 붙이는가?",
      "People과 Trade create/edit 디자인을 어떻게 통일하는가?",
    ],
    concepts: ["세션 기반 인증", "역할 기반 접근 제어", "CRUD", "검색/정렬", "UI 일관성", "SQL 스키마"],
    labs: ["People 테이블", "Trade 테이블", "login.php", "index.php redirect", "다크/라이트 테마", "LogAnalyzer 링크"],
    portfolio:
      "단순 보안 실습이 아니라 실제 관리형 웹 서비스를 만들고 보안/권한/로그 연동까지 고려했다는 증거가 됩니다.",
  },
  {
    id: "log-pipeline",
    group: "로그 파이프라인",
    title: "로그 수집·저장 구조",
    subtitle: "rsyslog → MariaDB → LogAnalyzer",
    x: 760,
    y: 520,
    icon: Workflow,
    level: "관제",
    summary:
      "로그가 어디서 발생하고, 어떤 서버를 거쳐 DB에 저장되며, 분석 화면에 어떻게 나타나는지 추적한 영역입니다.",
    questions: [
      "rsyslog 설정은 WEB에서 재시작해야 하는가, DB에서 해야 하는가?",
      "logger 명령으로 찍은 로그와 서비스 재시작 로그는 왜 다르게 보이는가?",
      "클라이언트별 로그가 LogAnalyzer에 안 뜰 때 어디를 확인해야 하는가?",
      "rsyslog에서 @와 @@ 포워딩은 어떤 차이가 있는가?",
    ],
    concepts: ["syslog", "TCP/UDP 로그 포워딩", "ommysql", "DB 저장", "로그 필드 매핑", "서비스 재시작"],
    labs: ["Syslog DB", "LogAnalyzer", "rsyslog.conf", "logger", "3306/tcp", "클라이언트 로그 수집"],
    portfolio:
      "보안관제의 핵심인 로그 발생 지점부터 저장·조회까지의 전체 흐름을 설명할 수 있는 자료가 됩니다.",
  },
  {
    id: "ids-siem",
    group: "탐지/관제",
    title: "IDS/SIEM 탐지 룰",
    subtitle: "Snort, Wazuh, Graylog, OSSEC",
    x: 500,
    y: 660,
    icon: Radar,
    level: "탐지",
    summary:
      "공격 트래픽을 직접 발생시키고, 탐지 룰이 실제로 반응하는지 검증한 영역입니다.",
    questions: [
      "Snort2 local.rules에서 ICMP, UDP Flood, SQLi 룰은 어떻게 작성하는가?",
      "Snort3의 daq, afpacket, inline 모드는 어떤 의미인가?",
      "룰 문법 오류가 fatal error로 뜰 때 어느 부분을 봐야 하는가?",
      "Wazuh/Graylog에서 특정 공격 로그가 안 뜨면 어디를 점검하는가?",
    ],
    concepts: ["시그니처 기반 탐지", "detection_filter", "flow", "content match", "inline drop", "오탐/미탐"],
    labs: ["SQLi OR 1=1", "ICMP Smurf", "UDP Flood", "Ping 허용 로깅", "Snort local.rules", "Wazuh 이벤트"],
    portfolio:
      "탐지 룰, 공격 명령, 탐지 화면, 오탐 가능성까지 한 세트로 정리하면 보안관제 포트폴리오로 강해집니다.",
  },
  {
    id: "ctf-web",
    group: "CTF/웹 취약점",
    title: "웹 취약점 분석",
    subtitle: "SQLi, LFI, 인증 우회",
    x: 300,
    y: 820,
    icon: FileSearch,
    level: "공격 이해",
    summary:
      "VulnHub CTF에서 웹 취약점으로 초기 foothold를 얻는 흐름을 반복적으로 연습한 영역입니다.",
    questions: [
      "mercuryfacts에서 UNION SELECT로 테이블명을 어떻게 추출하는가?",
      "../../../../../etc/passwd가 보이면 어떤 취약점인가?",
      "Burp Suite에서 response를 수정하거나 요청 파라미터를 바꾸는 흐름은 무엇인가?",
      "PHP strcmp/type juggling 취약점은 왜 인증 우회로 이어지는가?",
    ],
    concepts: ["SQL Injection", "UNION SELECT", "information_schema", "LFI", "인증 우회", "PHP type juggling"],
    labs: ["The Planets: Mercury", "Hacksudo Thor", "Burp Suite", "curl", "secret.php command", "webmaster 계정"],
    portfolio:
      "공격 성공 자체보다 입력값, 취약한 코드 패턴, 우회 원리, 대응 방안을 함께 정리하는 것이 중요합니다.",
  },
  {
    id: "ctf-privesc",
    group: "CTF/권한 상승",
    title: "Linux 권한 상승",
    subtitle: "SUID, sudo, polkit, bash -p",
    x: 120,
    y: 660,
    icon: KeyRound,
    level: "권한 상승",
    summary:
      "CTF 후반부에서 일반 사용자 권한에서 root까지 올라가는 원리를 집중적으로 다룬 영역입니다.",
    questions: [
      "find로 SUID 파일을 찾은 뒤 무엇을 확인해야 하는가?",
      "/bin/bash를 복사하고 SUID를 주면 왜 /tmp/bash -p에서 root가 되는가?",
      "sudo -l 결과에서 어떤 바이너리가 권한 상승으로 이어지는가?",
      "취약한 polkit은 실제로 이용 가능한가?",
    ],
    concepts: ["SUID", "sudoers", "GTFOBins", "polkit", "권한/소유자", "환경 변수/경로"],
    labs: ["/tmp/bash -p", "sudo find / -perm -u=s", "sudo -l", "backup 파일", "python3 input 취약점", "root shell"],
    portfolio:
      "권한 상승은 위험한 기법 자체보다 왜 권한이 상승했는지, 어떤 설정이 취약했는지, 어떻게 막는지를 설명해야 합니다.",
  },
  {
    id: "security-theory",
    group: "보안 개념",
    title: "보안 이론 연결",
    subtitle: "XDR, SIEM, DMZ, 전자서명",
    x: 760,
    y: 820,
    icon: BookOpen,
    level: "개념화",
    summary:
      "실습 중 마주친 용어들을 이론적으로 정리하면서 보안 전체 구조를 넓히는 영역입니다.",
    questions: [
      "SIEM, XDR, Wazuh, Graylog, Splunk는 어떻게 다른가?",
      "DMZ는 정확히 어떤 보안 구역인가?",
      "전자서명에서 해시와 암호화는 각각 어떤 역할을 하는가?",
      "인증기관 CA와 등록기관 RA는 어떻게 나뉘는가?",
    ],
    concepts: ["SIEM", "XDR", "DMZ", "PKI", "전자서명", "CA/RA", "보안 아키텍처"],
    labs: ["Wazuh 개념", "Graylog 개념", "Splunk 비교", "현대 네트워크 인프라 구조", "DMZ 설계"],
    portfolio:
      "실습 결과에 이론적 설명을 붙이면 면접에서 질문이 들어와도 구조적으로 답변하기 쉬워집니다.",
  },
  {
    id: "doc-career",
    group: "문서화/진로",
    title: "포트폴리오·취업 연결",
    subtitle: "Notion, PDF, 자격증, 직무 방향",
    x: 1060,
    y: 700,
    icon: Briefcase,
    level: "정리",
    summary:
      "실습을 취업용 결과물로 바꾸기 위해 문서 구조, 자격증, 직무 방향, 불안감까지 함께 다룬 영역입니다.",
    questions: [
      "내가 제대로 공부하고 있는지, 남들보다 뒤처지는 것은 아닌지?",
      "정보보안기사, 리눅스마스터, CCNP 같은 자격증은 어떤 의미가 있는가?",
      "CTF 풀이를 PDF로 어떻게 정리해야 이해하기 쉬운가?",
      "보안관제/인프라 보안/모의해킹 중 어느 방향이 더 맞는가?",
    ],
    concepts: ["학습 로드맵", "포트폴리오 구조", "보고서 작성", "직무 매칭", "실습 증거화"],
    labs: ["Notion 문서화", "CTF 풀이 PDF", "국비교육 포트폴리오", "중견/대기업 취업 고민", "자격증 계획"],
    portfolio:
      "지금까지의 실습을 하나의 큰 프로젝트처럼 묶으면, 단순 공부 기록이 아니라 실무형 성장 기록이 됩니다.",
  },
];

/**
 * 학습 그래프의 연결선 데이터입니다.
 *
 * 각 링크 필드 설명:
 * - from: 시작 노드 ID입니다.
 * - to: 도착 노드 ID입니다.
 * - label: 연결선 위에 표시할 관계 설명입니다.
 */
export const learningGraphLinks = [
  { from: "network-core", to: "routing-vlan", label: "통신 기반 확장" },
  { from: "routing-vlan", to: "virtual-lab", label: "토폴로지 구현" },
  { from: "virtual-lab", to: "linux-service", label: "서버 역할 부여" },
  { from: "linux-service", to: "web-db-app", label: "서비스 구현" },
  { from: "linux-service", to: "log-pipeline", label: "로그 발생" },
  { from: "log-pipeline", to: "ids-siem", label: "수집/탐지" },
  { from: "ids-siem", to: "network-core", label: "패킷 해석 필요" },
  { from: "ctf-web", to: "ctf-privesc", label: "초기 침투 이후" },
  { from: "fuzz-crack", to: "ctf-web", label: "공격면 발견" },
  { from: "ctf-web", to: "ids-siem", label: "탐지 룰 검증" },
  { from: "ctf-privesc", to: "linux-service", label: "권한 구조 이해" },
  { from: "web-db-app", to: "log-pipeline", label: "서비스 로그화" },
  { from: "web-db-app", to: "doc-career", label: "프로젝트 증거" },
  { from: "ids-siem", to: "doc-career", label: "관제 포트폴리오" },
  { from: "ctf-privesc", to: "doc-career", label: "분석 보고서" },
  { from: "security-theory", to: "doc-career", label: "면접 설명력" },
  { from: "security-theory", to: "ids-siem", label: "개념 보강" },
  { from: "network-core", to: "security-theory", label: "아키텍처 이해" },
];

/**
 * 카테고리 필터 버튼에 사용할 그룹 목록을 생성합니다.
 * 노드 데이터가 변경되어도 자동으로 카테고리가 갱신됩니다.
 */
export const learningGraphGroups = ["all", ...Array.from(new Set(learningGraphNodes.map((node) => node.group)))];
