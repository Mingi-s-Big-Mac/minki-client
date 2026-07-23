import { Route, Routes } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Home from "@/pages/app/Home";
import Search from "@/pages/app/Search";
import JobDetail from "@/pages/app/JobDetail";
import Saved from "@/pages/app/Saved";
import Compare from "@/pages/app/Compare";
import Ask from "@/pages/app/Ask";
import Roadmap from "@/pages/app/Roadmap";
import MyPage from "@/pages/app/MyPage";
import NotFound from "@/pages/NotFound";

/**
 * App routes (react-router-dom). Publishing only — no API yet.
 *   /            → 로그인 전 메인 페이지 (Landing)
 *   /login       → 로그인
 *   /signup      → 회원가입
 *   /home        → 로그인 후 메인 홈
 *   /search      → 진로 검색
 *   /jobs/:id    → 직무 상세
 *   /saved       → 관심 직무 저장 목록
 *   /compare     → 직무 비교
 *   /ask         → AI 질의응답
 *   /roadmap     → 진로 로드맵 생성
 *   /mypage      → 마이 페이지 (프로필 · 비밀번호 변경)
 *   *            → 404 페이지
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/ask" element={<Ask />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
