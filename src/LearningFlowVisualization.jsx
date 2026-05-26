import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Briefcase,
  Code2,
  Database,
  FileSearch,
  FileText,
  Flame,
  GitBranch,
  KeyRound,
  Layers,
  Lock,
  Network,
  Radar,
  Route,
  Search,
  Server,
  TerminalSquare,
  Workflow,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

/**
 * 지금까지의 질문 흐름을 세부 학습 이력 그래프로 시각화하는 React 컴포넌트입니다.
 *
 * 개선 내용:
 * 1. 노드 간 간격을 넓히기 위해 SVG viewBox와 실제 렌더링 높이를 확장했습니다.
 * 2. 검색어와 관련된 노드를 강조하는 검색 기능을 추가했습니다.
 * 3. 카테고리 버튼을 클릭하면 해당 그룹만 강조하는 필터 기능을 추가했습니다.
 * 4. 검색/필터 결과와 관련 없는 노드는 흐리게 표시하여 그래프를 읽기 쉽게 만들었습니다.
 * 5. 노드 카드의 글자 잘림을 줄이기 위해 카드 크기, 줄바꿈, line-clamp 처리를 조정했습니다.
 */
export default function LearningFlowVisualization() {
  /**
   * 현재 선택된 노드 ID입니다.
   */
  const [selectedId, setSelectedId] = useState("network-core");

  /**
   * 그래프 보기 모드입니다.
   * map: 전체 연결을 넓게 보여줍니다.
   * deep: 선택 노드와 직접 연결된 노드를 더 강하게 강조합니다.
   */
  const [viewMode, setViewMode] = useState("map");

  /**
   * 노드 검색어입니다.
   * title, subtitle, group, questions, concepts, labs, portfolio 전체를 대상으로 검색합니다.
   */
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * 선택된 카테고리입니다.
   * "all"이면 전체 카테고리를 표시합니다.
   */
  const [activeGroup, setActiveGroup] = useState("all");

  /**
   * 그래프 확대/축소 비율입니다.
   * 내부 스크롤바 대신 그래프 자체를 확대/축소해서 볼 수 있도록 사용합니다.
   */
  const [zoom, setZoom] = useState(0.92);

  /**
   * 그래프 이동 위치입니다.
   * 확대 상태에서 원하는 노드로 이동할 수 있도록 translate 값으로 사용합니다.
   */
  const [pan, setPan] = useState({ x: 0, y: 0 });

  /**
   * 현재 그래프 배경을 드래그 중인지 확인하는 상태입니다.
   */
  const [isPanning, setIsPanning] = useState(false);

  /**
   * 드래그를 시작한 지점과 기존 pan 값을 함께 저장합니다.
   * 이렇게 해야 드래그 중 위치가 튀지 않고 자연스럽게 이어집니다.
   */
  const [panStart, setPanStart] = useState({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 });

  /**
   * SVG 그래프에 표시되는 세부 학습 노드 목록입니다.
   * x, y 좌표는 넓어진 SVG viewBox 기준으로 다시 배치했습니다.
   */
  const nodes = useMemo(
    () => [
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
    ],
    []
  );

  /**
   * 세부 노드 사이의 방향성 있는 연결 관계입니다.
   */
  const links = useMemo(
    () => [
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
    ],
    []
  );

  /**
   * 노드를 빠르게 찾기 위한 Map입니다.
   */
  const nodeMap = useMemo(() => {
    const map = new Map();
    nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [nodes]);

  /**
   * 카테고리 목록입니다.
   */
  const groups = useMemo(() => ["all", ...Array.from(new Set(nodes.map((node) => node.group)))], [nodes]);

  /**
   * 검색 대상 문자열을 하나로 합칩니다.
   */
  const createSearchText = (node) =>
    [
      node.group,
      node.title,
      node.subtitle,
      node.level,
      node.summary,
      ...node.questions,
      ...node.concepts,
      ...node.labs,
      node.portfolio,
    ]
      .join(" ")
      .toLowerCase();

  /**
   * 검색어와 카테고리 필터를 통과하는 노드 ID 목록입니다.
   */
  const matchedNodeIds = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return new Set(
      nodes
        .filter((node) => {
          const groupMatched = activeGroup === "all" || node.group === activeGroup;
          const searchMatched = normalizedSearchTerm.length === 0 || createSearchText(node).includes(normalizedSearchTerm);
          return groupMatched && searchMatched;
        })
        .map((node) => node.id)
    );
  }, [nodes, activeGroup, searchTerm]);

  /**
   * 필터가 활성화되었는지 확인합니다.
   */
  const hasActiveFilter = searchTerm.trim().length > 0 || activeGroup !== "all";

  /**
   * 현재 선택된 노드 정보입니다.
   */
  const selectedNode = nodeMap.get(selectedId) ?? nodes[0];

  /**
   * 선택한 노드와 직접 연결된 링크 목록입니다.
   */
  const relatedLinks = links.filter((link) => link.from === selectedId || link.to === selectedId);

  /**
   * 선택한 노드와 직접 연결된 노드 ID 목록입니다.
   */
  const relatedNodeIds = new Set(relatedLinks.flatMap((link) => [link.from, link.to]));

  /**
   * 검색 또는 카테고리 필터를 초기화합니다.
   */
  const resetFilters = () => {
    setSearchTerm("");
    setActiveGroup("all");
  };

  /**
   * 그래프를 한 단계 확대합니다.
   */
  const zoomIn = () => {
    setZoom((currentZoom) => Math.min(1.25, Number((currentZoom + 0.08).toFixed(2))));
  };

  /**
   * 그래프를 한 단계 축소합니다.
   */
  const zoomOut = () => {
    setZoom((currentZoom) => Math.max(0.72, Number((currentZoom - 0.08).toFixed(2))));
  };

  /**
   * 그래프를 기본 보기 배율로 되돌립니다.
   */
  const resetZoom = () => {
    setZoom(0.92);
    setPan({ x: 0, y: 0 });
  };

  /**
   * 그래프 배경을 마우스로 눌렀을 때 이동 준비를 시작합니다.
   * 노드, 버튼, 입력창 위에서 누른 경우에는 기존 클릭 동작을 방해하지 않도록 제외합니다.
   */
  const startPan = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest("button, input")) return;

    setIsPanning(true);
    setPanStart({
      mouseX: event.clientX,
      mouseY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    });
  };

  /**
   * 마우스를 움직이는 동안 그래프 위치를 갱신합니다.
   */
  const movePan = (event) => {
    if (!isPanning) return;

    setPan({
      x: panStart.panX + event.clientX - panStart.mouseX,
      y: panStart.panY + event.clientY - panStart.mouseY,
    });
  };

  /**
   * 마우스 버튼을 놓거나 그래프 영역 밖으로 나가면 드래그 이동을 종료합니다.
   */
  const stopPan = () => {
    setIsPanning(false);
  };

  /**
   * 선택된 노드를 면접 답변에 바로 쓸 수 있는 문장으로 변환합니다.
   * 노드 데이터에 별도 문장을 전부 하드코딩하지 않고, 현재 노드의 핵심 실습과 개념을 조합합니다.
   */
  const createInterviewSummary = (node) => {
    const mainConcepts = node.concepts.slice(0, 3).join(", ");
    const mainLabs = node.labs.slice(0, 3).join(", ");

    return `${node.title} 영역에서는 ${mainLabs} 등을 직접 다루면서 ${mainConcepts} 개념을 실습 중심으로 확인했습니다. 단순히 도구 사용에 그치지 않고, 문제가 발생한 원인과 다른 영역으로 이어지는 흐름까지 정리해 포트폴리오 자료로 확장할 수 있습니다.`;
  };

  /**
   * 두 노드 사이의 곡선 SVG 경로를 생성합니다.
   * 이전보다 전체 캔버스가 넓어졌기 때문에 곡률을 조금 더 부드럽게 잡았습니다.
   */
  const createCurvePath = (fromNode, toNode, index) => {
    const midX = (fromNode.x + toNode.x) / 2;
    const midY = (fromNode.y + toNode.y) / 2;
    const direction = index % 2 === 0 ? 1 : -1;
    const distanceX = Math.abs(fromNode.x - toNode.x);
    const distanceY = Math.abs(fromNode.y - toNode.y);
    const curveStrength = Math.max(70, Math.min(150, (distanceX + distanceY) / 5));
    const controlX = midX;
    const controlY = midY + curveStrength * direction;

    return `M ${fromNode.x} ${fromNode.y} Q ${controlX} ${controlY} ${toNode.x} ${toNode.y}`;
  };

  /**
   * 노드 중요도에 따라 배지 스타일을 반환합니다.
   */
  const getLevelClassName = (level) => {
    if (level === "기반") return "bg-cyan-400/15 text-cyan-100 border-cyan-300/25";
    if (level === "심화") return "bg-indigo-400/15 text-indigo-100 border-indigo-300/25";
    if (level === "실습") return "bg-emerald-400/15 text-emerald-100 border-emerald-300/25";
    if (level === "탐지") return "bg-orange-400/15 text-orange-100 border-orange-300/25";
    if (level === "권한 상승") return "bg-red-400/15 text-red-100 border-red-300/25";
    if (level === "정리") return "bg-purple-400/15 text-purple-100 border-purple-300/25";
    return "bg-slate-400/15 text-slate-100 border-slate-300/25";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 mb-4">
                <Activity className="w-4 h-4 mr-2" />
                Detailed Dynamic Learning Graph
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                질문 기록 기반 세부 학습 연결 지도
              </h1>
              <p className="text-slate-300 max-w-4xl leading-relaxed">
                단순히 어떤 분야를 배웠는지가 아니라, 질문이 어떤 실습 문제에서 출발했고 어떤 개념으로 이어졌으며,
                포트폴리오에서 어떤 증거가 되는지까지 세부적으로 연결했습니다.
              </p>
            </div>

            <div className="flex rounded-2xl border border-slate-700 bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  viewMode === "map" ? "bg-cyan-400/20 text-cyan-100" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                전체 지도
              </button>
              <button
                type="button"
                onClick={() => setViewMode("deep")}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  viewMode === "deep" ? "bg-cyan-400/20 text-cyan-100" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                상세 중심
              </button>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 2xl:grid-cols-[1fr_470px] gap-6">
          <section className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/80 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_80%_75%,rgba(168,85,247,0.15),transparent_35%)]" />

            <div className="relative p-4 border-b border-slate-700/60 bg-slate-950/40">
              <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
                <div className="relative w-full xl:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="예: Snort, SUID, MariaDB, OSPF, Burp"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-3 pl-10 pr-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                      aria-label="검색어 지우기"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-cyan-100">
                    표시 노드 {matchedNodeIds.size}/{nodes.length}
                  </span>
                  {hasActiveFilter && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-cyan-300/60 hover:text-cyan-100"
                    >
                      필터 초기화
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {groups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setActiveGroup(group)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      activeGroup === group
                        ? "border-cyan-300/70 bg-cyan-400/20 text-cyan-100"
                        : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-300/50 hover:text-cyan-100"
                    }`}
                  >
                    {group === "all" ? "전체" : group}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`relative h-[860px] overflow-hidden select-none ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
              onMouseDown={startPan}
              onMouseMove={movePan}
              onMouseUp={stopPan}
              onMouseLeave={stopPan}
            >
              <div className="absolute right-4 top-4 z-20 flex items-center rounded-2xl border border-slate-700 bg-slate-950/80 p-1 shadow-xl backdrop-blur">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="rounded-xl p-2 text-slate-300 transition hover:bg-slate-800 hover:text-cyan-100"
                  aria-label="그래프 축소"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="min-w-14 px-2 text-center text-xs text-slate-300">{Math.round(zoom * 100)}%</div>
                <button
                  type="button"
                  onClick={zoomIn}
                  className="rounded-xl p-2 text-slate-300 transition hover:bg-slate-800 hover:text-cyan-100"
                  aria-label="그래프 확대"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="ml-1 rounded-xl p-2 text-slate-300 transition hover:bg-slate-800 hover:text-cyan-100"
                  aria-label="그래프 기본 배율로 되돌리기"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <svg
                className="relative w-full h-full transition-transform duration-300 ease-out"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center center" }}
                viewBox="0 0 1180 920"
                role="img"
                aria-label="세부 학습 주제 간 연결 그래프"
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity="0.18" />
                  </linearGradient>
                </defs>

                {/* 배경 격자입니다. */}
                {Array.from({ length: 13 }).map((_, index) => (
                  <line
                    key={`v-${index}`}
                    x1={index * 100}
                    y1="0"
                    x2={index * 100}
                    y2="920"
                    stroke="rgba(148,163,184,0.07)"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 11 }).map((_, index) => (
                  <line
                    key={`h-${index}`}
                    x1="0"
                    y1={index * 90}
                    x2="1180"
                    y2={index * 90}
                    stroke="rgba(148,163,184,0.07)"
                    strokeWidth="1"
                  />
                ))}

                {/* 연결선과 데이터 흐름 입자입니다. */}
                {links.map((link, index) => {
                  const fromNode = nodeMap.get(link.from);
                  const toNode = nodeMap.get(link.to);
                  const path = createCurvePath(fromNode, toNode, index);
                  const pathId = `detail-flow-path-${index}`;
                  const isSelectedRelated = selectedId === link.from || selectedId === link.to;
                  const isFilterRelated = matchedNodeIds.has(link.from) && matchedNodeIds.has(link.to);
                  const isHighlighted = isSelectedRelated || (hasActiveFilter && isFilterRelated);
                  const shouldDim = viewMode === "deep" ? !isSelectedRelated : hasActiveFilter && !isFilterRelated;

                  return (
                    <g key={pathId} opacity={shouldDim ? 0.18 : 1}>
                      <path
                        id={pathId}
                        d={path}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth={isHighlighted ? 4 : 1.8}
                        strokeOpacity={isHighlighted ? 0.95 : 0.42}
                        filter={isHighlighted ? "url(#glow)" : "none"}
                      />

                      <text fontSize="11" fill={isHighlighted ? "rgba(224,242,254,0.95)" : "rgba(226,232,240,0.48)"}>
                        <textPath href={`#${pathId}`} startOffset="46%">
                          {link.label}
                        </textPath>
                      </text>

                      {Array.from({ length: isHighlighted ? 5 : 2 }).map((_, particleIndex) => (
                        <circle
                          key={`${pathId}-particle-${particleIndex}`}
                          r={isHighlighted ? 4.6 : 2.7}
                          fill={isHighlighted ? "#67e8f9" : "#a5b4fc"}
                          opacity={isHighlighted ? 1 : 0.65}
                          filter="url(#glow)"
                        >
                          <animateMotion
                            dur={`${5.2 + particleIndex * 0.8}s`}
                            begin={`${particleIndex * 0.6}s`}
                            repeatCount="indefinite"
                            path={path}
                          />
                        </circle>
                      ))}
                    </g>
                  );
                })}

                {/* 세부 학습 노드입니다. */}
                {nodes.map((node) => {
                  const Icon = node.icon;
                  const isSelected = selectedId === node.id;
                  const isRelated = relatedNodeIds.has(node.id);
                  const isMatched = matchedNodeIds.has(node.id);
                  const dimmedByDeepMode = viewMode === "deep" && !isSelected && !isRelated;
                  const dimmedByFilter = hasActiveFilter && !isMatched;
                  const dimmed = dimmedByDeepMode || dimmedByFilter;

                  return (
                    <foreignObject key={node.id} x={node.x - 88} y={node.y - 66} width="176" height="132">
                      <button
                        type="button"
                        onClick={() => setSelectedId(node.id)}
                        className={`w-full h-full rounded-2xl border px-3.5 py-3 text-left transition-all duration-300 overflow-hidden ${
                          isSelected
                            ? "border-cyan-300 bg-cyan-300/20 shadow-[0_0_34px_rgba(34,211,238,0.45)]"
                            : isRelated
                              ? "border-indigo-300/70 bg-indigo-300/10"
                              : isMatched && hasActiveFilter
                                ? "border-emerald-300/70 bg-emerald-300/10 shadow-[0_0_22px_rgba(52,211,153,0.18)]"
                                : "border-slate-600/80 bg-slate-950/82 hover:border-cyan-300/70 hover:bg-slate-800/90"
                        } ${dimmed ? "opacity-25" : "opacity-100"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`rounded-xl p-1.5 ${isSelected ? "bg-cyan-300/25" : "bg-slate-700/80"}`}>
                            <Icon className="w-4 h-4 text-cyan-200" />
                          </div>
                          <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] ${getLevelClassName(node.level)}`}>
                            {node.level}
                          </span>
                        </div>
                        <div className="text-[13px] font-bold text-white leading-tight break-keep line-clamp-2">{node.title}</div>
                        <div className="text-[10.5px] text-slate-300 mt-1.5 leading-snug break-keep line-clamp-2">{node.subtitle}</div>
                        <div className="mt-2 text-[9.5px] text-slate-500 break-keep line-clamp-1">{node.group}</div>
                      </button>
                    </foreignObject>
                  );
                })}
              </svg>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-700/70 bg-slate-900 p-6 shadow-2xl">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
            >
              <div className="flex items-start mb-4">
                <div className="rounded-2xl bg-cyan-400/15 p-3 mr-3">
                  {React.createElement(selectedNode.icon, { className: "w-7 h-7 text-cyan-200" })}
                </div>
                <div>
                  <div className="text-xs text-cyan-200 mb-1">{selectedNode.group}</div>
                  <h2 className="text-2xl font-bold leading-tight">{selectedNode.title}</h2>
                  <p className="text-sm text-slate-300 mt-1">{selectedNode.subtitle}</p>
                </div>
              </div>

              <div className="mb-5 rounded-2xl bg-slate-950/80 border border-slate-700 p-4">
                <div className="flex items-center mb-2 text-cyan-100 text-sm font-semibold">
                  <GitBranch className="w-4 h-4 mr-2" />
                  이 노드의 의미
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedNode.summary}</p>
              </div>

              <DetailSection icon={AlertTriangle} title="실제로 던졌던 질문 유형" items={selectedNode.questions} />
              <DetailSection icon={Lock} title="연결되는 핵심 개념" items={selectedNode.concepts} />
              <DetailSection icon={TerminalSquare} title="실습 흔적·도구·환경" items={selectedNode.labs} />

              <div className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-400/10 p-4">
                <div className="flex items-center mb-2 text-purple-100 text-sm font-semibold">
                  <FileText className="w-4 h-4 mr-2" />
                  포트폴리오에서의 의미
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedNode.portfolio}</p>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center mb-2 text-emerald-100 text-sm font-semibold">
                  <Briefcase className="w-4 h-4 mr-2" />
                  면접에서 이렇게 설명 가능
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{createInterviewSummary(selectedNode)}</p>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="flex items-center mb-3 text-slate-100 text-sm font-semibold">
                  <Flame className="w-4 h-4 mr-2 text-orange-200" />
                  직접 연결된 흐름
                </div>
                <div className="space-y-2">
                  {relatedLinks.map((link) => {
                    const fromNode = nodeMap.get(link.from);
                    const toNode = nodeMap.get(link.to);
                    return (
                      <div key={`${link.from}-${link.to}-${link.label}`} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">
                        <span className="text-slate-100">{fromNode.title}</span>
                        <span className="mx-2 text-cyan-200">→</span>
                        <span className="text-slate-100">{toNode.title}</span>
                        <div className="mt-1 text-slate-400">{link.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </aside>
        </main>
      </div>
    </div>
  );
}

/**
 * 우측 상세 패널에서 반복적으로 사용하는 정보 섹션 컴포넌트입니다.
 * 질문 유형, 핵심 개념, 실습 흔적을 동일한 형식으로 표시합니다.
 */
function DetailSection({ icon: Icon, title, items }) {
  return (
    <section className="mb-5">
      <div className="flex items-center mb-2 text-cyan-100 text-sm font-semibold">
        <Icon className="w-4 h-4 mr-2" />
        {title}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 leading-relaxed"
          >
            {item}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
