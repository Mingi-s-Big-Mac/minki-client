import { toast } from "sonner";
import { Button, Card, Icon, iconNames } from "@/components/ui";

/**
 * Implements the `div:shadow` card design (Figma node 1:1500) as the
 * centerpiece, and showcases the design system built from the Figma file:
 * tokens, the Button common component, and the icon set (node 1:1418).
 */
export default function App() {
  return (
    <main className="flex min-h-full items-center justify-center p-6">
      <Card surface="dark" className="w-full max-w-[640px] p-10">
        <header className="mb-8">
          <p className="text-sm font-semibold text-primary">Design System</p>
          <h1 className="mt-1 text-lg font-semibold text-white">
            Minki 공통 컴포넌트
          </h1>
          <p className="mt-2 text-sm text-ink-subtle">
            Figma 디자인에서 추출한 토큰과 공통 컴포넌트입니다.
          </p>
        </header>

        {/* Buttons */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold text-ink-subtle uppercase">
            Buttons
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => toast.success("로그인되었어요!")}>
              로그인
            </Button>
            <Button
              variant="outline"
              leftIcon={<Icon name="variant9" size={16} />}
              onClick={() => toast("전화 연결 중…")}
            >
              전화하기
            </Button>
            <Button variant="ghost">더보기</Button>
            <Button loading>불러오는 중</Button>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="mb-3 text-xs font-semibold text-ink-subtle uppercase">
            Icons ({iconNames.length})
          </h2>
          <div className="flex flex-wrap gap-4 text-primary">
            {iconNames.map((name) => (
              <Icon key={name} name={name} size={24} aria-label={name} />
            ))}
          </div>
        </section>
      </Card>
    </main>
  );
}
