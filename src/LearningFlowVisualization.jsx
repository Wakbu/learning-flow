import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  FileText,
  Flame,
  GitBranch,
  Lock,
  Maximize2,
  Search,
  TerminalSquare,
  Workflow,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import {
  learningGraphGroups,
  learningGraphLinks,
  learningGraphNodes,
} from "./data/learningGraphData";

/**
 * 질문 기록 기반 세부 학습 연결 지도를 렌더링하는 메인 컴포넌트입니다.
 *
 * 주요 기능:
 * - SVG 기반 동적 학습 그래프 출력
 * - 연결선 위 데이터 입자 애니메이션
 * - 노드 클릭 시 우측 상세 패널 변경
 * - 검색 기능
 * - 카테고리 필터 기능
 * - 그래프 확대/축소
 * - 그래프 드래그 이동
 *
 * 데이터는 src/data/learningGraphData.js에서 분리 관리합니다.
 */
export default function LearningFlowVisualization() {
  /**
   * 현재 선택된 노드 ID입니다.
   * 첫 진입 시 기본으로 "패킷 흐름 이해" 노드를 선택합니다.
   */
  const [selectedId, setSelectedId] = useState("network-core");

  /**
   * 그래프 보기 모드입니다.
   *
   * map:
   * - 전체 그래프를 기본적으로 보여줍니다.
   *
   * deep:
   * - 선택된 노드와 직접 연결된 노드를 더 강하게 강조합니다.
   */
  const [viewMode, setViewMode] = useState("map");

  /**
   * 검색창 입력값입니다.
   * 제목, 부제목, 그룹, 질문, 개념, 실습 흔적, 포트폴리오 문장을 대상으로 검색합니다.
   */
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * 현재 선택된 카테고리입니다.
   * "all"이면 모든 카테고리를 표시합니다.
   */
  const [activeGroup, setActiveGroup] = useState("all");

  /**
   * 그래프 확대/축소 비율입니다.
   * 내부 스크롤바 대신 그래프 자체를 확대/축소해서 탐색합니다.
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
   * 드래그를 시작한 마우스 좌표와 기존 pan 값을 저장합니다.
   * 드래그 중 위치가 튀지 않도록 기준점으로 사용합니다.
   */
  const [panStart, setPanStart] = useState({
    mouseX: 0,
    mouseY: 0,
    panX: 0,
    panY: 0,
  });

  /**
   * 그래프 노드 데이터입니다.
   * 데이터 파일에서 import한 값을 컴포넌트 내부 변수로 연결합니다.
   */
  const nodes = learningGraphNodes;

  /**
   * 그래프 연결선 데이터입니다.
   * 데이터 파일에서 import한 값을 컴포넌트 내부 변수로 연결합니다.
   */
  const links = learningGraphLinks;

  /**
   * 카테고리 필터 목록입니다.
   * 데이터 파일에서 import한 값을 사용합니다.
   */
  const groups = learningGraphGroups;

  /**
   * 노드를 빠르게 찾기 위한 Map입니다.
   * link.from, link.to로 노드를 찾을 때 반복 검색을 줄이기 위해 사용합니다.
   */
  const nodeMap = useMemo(() => {
    const map = new Map();

    nodes.forEach((node) => {
      map.set(node.id, node);
    });

    return map;
  }, [nodes]);

  /**
   * 검색 대상 문자열을 하나로 합칩니다.
   * 검색어가 제목뿐 아니라 질문, 개념, 실습 도구까지 찾을 수 있게 합니다.
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
   *
   * 예:
   * - searchTerm: "Snort"
   * - activeGroup: "탐지/관제"
   *
   * 위 조건을 모두 만족하는 노드만 matchedNodeIds에 포함됩니다.
   */
  const matchedNodeIds = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return new Set(
      nodes
        .filter((node) => {
          const groupMatched = activeGroup === "all" || node.group === activeGroup;

          const searchMatched =
            normalizedSearchTerm.length === 0 ||
            createSearchText(node).includes(normalizedSearchTerm);

          return groupMatched && searchMatched;
        })
        .map((node) => node.id)
    );
  }, [nodes, activeGroup, searchTerm]);

  /**
   * 검색 또는 카테고리 필터가 활성화되었는지 확인합니다.
   */
  const hasActiveFilter = searchTerm.trim().length > 0 || activeGroup !== "all";

  /**
   * 현재 선택된 노드 정보입니다.
   * 혹시 selectedId가 잘못된 경우 첫 번째 노드를 fallback으로 사용합니다.
   */
  const selectedNode = nodeMap.get(selectedId) ?? nodes[0];

  /**
   * 현재 선택된 노드와 직접 연결된 링크 목록입니다.
   */
  const relatedLinks = links.filter(
    (link) => link.from === selectedId || link.to === selectedId
  );

  /**
   * 현재 선택된 노드와 직접 연결된 노드 ID 목록입니다.
   * deep 모드에서 관련 노드를 강조할 때 사용합니다.
   */
  const relatedNodeIds = new Set(
    relatedLinks.flatMap((link) => [link.from, link.to])
  );

  /**
   * 검색어와 카테고리 필터를 초기화합니다.
   */
  const resetFilters = () => {
    setSearchTerm("");
    setActiveGroup("all");
  };

  /**
   * 그래프를 한 단계 확대합니다.
   * 너무 과하게 커지지 않도록 최대값을 제한합니다.
   */
  const zoomIn = () => {
    setZoom((currentZoom) =>
      Math.min(1.25, Number((currentZoom + 0.08).toFixed(2)))
    );
  };

  /**
   * 그래프를 한 단계 축소합니다.
   * 너무 작아져서 읽을 수 없게 되는 것을 막기 위해 최소값을 제한합니다.
   */
  const zoomOut = () => {
    setZoom((currentZoom) =>
      Math.max(0.72, Number((currentZoom - 0.08).toFixed(2)))
    );
  };

  /**
   * 그래프 배율과 이동 위치를 기본값으로 되돌립니다.
   */
  const resetZoom = () => {
    setZoom(0.92);
    setPan({ x: 0, y: 0 });
  };

  /**
   * 그래프 배경을 마우스로 눌렀을 때 이동 준비를 시작합니다.
   *
   * 주의:
   * - 마우스 왼쪽 버튼이 아니면 무시합니다.
   * - 버튼이나 입력창에서 발생한 이벤트는 드래그 이동으로 처리하지 않습니다.
   *   이렇게 해야 검색창 입력, 필터 클릭, 노드 클릭이 정상 작동합니다.
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
   *
   * 노드 데이터에 별도 면접 문장을 모두 하드코딩하지 않고,
   * 현재 노드의 핵심 실습과 개념을 조합해서 문장을 생성합니다.
   */
  const createInterviewSummary = (node) => {
    const mainConcepts = node.concepts.slice(0, 3).join(", ");
    const mainLabs = node.labs.slice(0, 3).join(", ");

    return `${node.title} 영역에서는 ${mainLabs} 등을 직접 다루면서 ${mainConcepts} 개념을 실습 중심으로 확인했습니다. 단순히 도구 사용에 그치지 않고, 문제가 발생한 원인과 다른 영역으로 이어지는 흐름까지 정리해 포트폴리오 자료로 확장할 수 있습니다.`;
  };

  /**
   * 두 노드 사이의 곡선 SVG 경로를 생성합니다.
   *
   * 직선으로 연결하면 선이 너무 딱딱하고 겹침이 심해져서,
   * Quadratic Bezier Curve를 사용해 부드럽게 연결합니다.
   */
  const createCurvePath = (fromNode, toNode, index) => {
    const midX = (fromNode.x + toNode.x) / 2;
    const midY = (fromNode.y + toNode.y) / 2;

    const direction = index % 2 === 0 ? 1 : -1;
    const distanceX = Math.abs(fromNode.x - toNode.x);
    const distanceY = Math.abs(fromNode.y - toNode.y);

    const curveStrength = Math.max(
      70,
      Math.min(150, (distanceX + distanceY) / 5)
    );

    const controlX = midX;
    const controlY = midY + curveStrength * direction;

    return `M ${fromNode.x} ${fromNode.y} Q ${controlX} ${controlY} ${toNode.x} ${toNode.y}`;
  };

  /**
   * 노드 level 값에 따라 배지 색상을 반환합니다.
   */
  const getLevelClassName = (level) => {
    if (level === "기반") {
      return "bg-cyan-400/15 text-cyan-100 border-cyan-300/25";
    }

    if (level === "심화") {
      return "bg-indigo-400/15 text-indigo-100 border-indigo-300/25";
    }

    if (level === "실습") {
      return "bg-emerald-400/15 text-emerald-100 border-emerald-300/25";
    }

    if (level === "탐지") {
      return "bg-orange-400/15 text-orange-100 border-orange-300/25";
    }

    if (level === "권한 상승") {
      return "bg-red-400/15 text-red-100 border-red-300/25";
    }

    if (level === "정리") {
      return "bg-purple-400/15 text-purple-100 border-purple-300/25";
    }

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
                단순히 어떤 분야를 배웠는지가 아니라, 질문이 어떤 실습 문제에서
                출발했고 어떤 개념으로 이어졌으며, 포트폴리오에서 어떤 증거가
                되는지까지 세부적으로 연결했습니다.
              </p>
            </div>

            <div className="flex rounded-2xl border border-slate-700 bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  viewMode === "map"
                    ? "bg-cyan-400/20 text-cyan-100"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                전체 지도
              </button>

              <button
                type="button"
                onClick={() => setViewMode("deep")}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  viewMode === "deep"
                    ? "bg-cyan-400/20 text-cyan-100"
                    : "text-slate-300 hover:bg-slate-800"
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
              className={`relative h-[860px] overflow-hidden select-none ${
                isPanning ? "cursor-grabbing" : "cursor-grab"
              }`}
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

                <div className="min-w-14 px-2 text-center text-xs text-slate-300">
                  {Math.round(zoom * 100)}%
                </div>

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
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
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

                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.9" />
                    <stop
                      offset="100%"
                      stopColor="#c084fc"
                      stopOpacity="0.18"
                    />
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

                  if (!fromNode || !toNode) return null;

                  const path = createCurvePath(fromNode, toNode, index);
                  const pathId = `detail-flow-path-${index}`;

                  const isSelectedRelated =
                    selectedId === link.from || selectedId === link.to;

                  const isFilterRelated =
                    matchedNodeIds.has(link.from) && matchedNodeIds.has(link.to);

                  const isHighlighted =
                    isSelectedRelated || (hasActiveFilter && isFilterRelated);

                  const shouldDim =
                    viewMode === "deep"
                      ? !isSelectedRelated
                      : hasActiveFilter && !isFilterRelated;

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

                      <text
                        fontSize="11"
                        fill={
                          isHighlighted
                            ? "rgba(224,242,254,0.95)"
                            : "rgba(226,232,240,0.48)"
                        }
                      >
                        <textPath href={`#${pathId}`} startOffset="46%">
                          {link.label}
                        </textPath>
                      </text>

                      {Array.from({ length: isHighlighted ? 5 : 2 }).map(
                        (_, particleIndex) => (
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
                        )
                      )}
                    </g>
                  );
                })}

                {/* 세부 학습 노드입니다. */}
                {nodes.map((node) => {
                  const Icon = node.icon;

                  const isSelected = selectedId === node.id;
                  const isRelated = relatedNodeIds.has(node.id);
                  const isMatched = matchedNodeIds.has(node.id);

                  const dimmedByDeepMode =
                    viewMode === "deep" && !isSelected && !isRelated;

                  const dimmedByFilter = hasActiveFilter && !isMatched;
                  const dimmed = dimmedByDeepMode || dimmedByFilter;

                  return (
                    <foreignObject
                      key={node.id}
                      x={node.x - 88}
                      y={node.y - 66}
                      width="176"
                      height="132"
                    >
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
                          <div
                            className={`rounded-xl p-1.5 ${
                              isSelected ? "bg-cyan-300/25" : "bg-slate-700/80"
                            }`}
                          >
                            <Icon className="w-4 h-4 text-cyan-200" />
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] ${getLevelClassName(
                              node.level
                            )}`}
                          >
                            {node.level}
                          </span>
                        </div>

                        <div className="text-[13px] font-bold text-white leading-tight break-keep line-clamp-2">
                          {node.title}
                        </div>

                        <div className="text-[10.5px] text-slate-300 mt-1.5 leading-snug break-keep line-clamp-2">
                          {node.subtitle}
                        </div>

                        <div className="mt-2 text-[9.5px] text-slate-500 break-keep line-clamp-1">
                          {node.group}
                        </div>
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
                  {React.createElement(selectedNode.icon, {
                    className: "w-7 h-7 text-cyan-200",
                  })}
                </div>

                <div>
                  <div className="text-xs text-cyan-200 mb-1">
                    {selectedNode.group}
                  </div>

                  <h2 className="text-2xl font-bold leading-tight">
                    {selectedNode.title}
                  </h2>

                  <p className="text-sm text-slate-300 mt-1">
                    {selectedNode.subtitle}
                  </p>
                </div>
              </div>

              <div className="mb-5 rounded-2xl bg-slate-950/80 border border-slate-700 p-4">
                <div className="flex items-center mb-2 text-cyan-100 text-sm font-semibold">
                  <GitBranch className="w-4 h-4 mr-2" />
                  이 노드의 의미
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedNode.summary}
                </p>
              </div>

              <DetailSection
                icon={AlertTriangle}
                title="실제로 던졌던 질문 유형"
                items={selectedNode.questions}
              />

              <DetailSection
                icon={Lock}
                title="연결되는 핵심 개념"
                items={selectedNode.concepts}
              />

              <DetailSection
                icon={TerminalSquare}
                title="실습 흔적·도구·환경"
                items={selectedNode.labs}
              />

              <div className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-400/10 p-4">
                <div className="flex items-center mb-2 text-purple-100 text-sm font-semibold">
                  <FileText className="w-4 h-4 mr-2" />
                  포트폴리오에서의 의미
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedNode.portfolio}
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center mb-2 text-emerald-100 text-sm font-semibold">
                  <Briefcase className="w-4 h-4 mr-2" />
                  면접에서 이렇게 설명 가능
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {createInterviewSummary(selectedNode)}
                </p>
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

                    if (!fromNode || !toNode) return null;

                    return (
                      <div
                        key={`${link.from}-${link.to}-${link.label}`}
                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300"
                      >
                        <span className="text-slate-100">
                          {fromNode.title}
                        </span>

                        <span className="mx-2 text-cyan-200">→</span>

                        <span className="text-slate-100">{toNode.title}</span>

                        <div className="mt-1 text-slate-400">
                          {link.label}
                        </div>
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
 *
 * 질문 유형, 핵심 개념, 실습 흔적을 동일한 카드 형식으로 출력합니다.
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