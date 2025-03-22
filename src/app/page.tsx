import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">交易助手</h1>
        <p className="text-muted-foreground">
          提供各种辅助交易的实用小工具，帮助您做出更明智的交易决策
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>斐波那契回调计算器</CardTitle>
            <CardDescription>
              根据高低点计算斐波那契回调水平，帮助确定入场点、止损和止盈位置
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-sm text-muted-foreground">
              <p>• 自动计算多空方案</p>
              <p>• 基于风险收益比优化</p>
            </div>
            <div className="flex justify-end">
              <Link
                href="/fibonacci"
                className="inline-flex mt-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                使用工具
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 这里可以添加更多工具卡片 */}
        <Card className="hover:shadow-md transition-shadow opacity-70">
          <CardHeader>
            <CardTitle>波动率计算器</CardTitle>
            <CardDescription>
              计算资产的历史波动率，帮助评估市场风险和设置合理的止损位
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center pt-2">
            <div className="text-sm text-muted-foreground">
              <p>• 多时间周期分析</p>
              <p>• 波动率可视化</p>
            </div>
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-secondary text-secondary-foreground h-9 px-4 py-2">
              即将推出
            </span>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow opacity-70">
          <CardHeader>
            <CardTitle>仓位规模计算器</CardTitle>
            <CardDescription>
              根据账户规模和风险承受能力，计算合理的仓位大小
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center pt-2">
            <div className="text-sm text-muted-foreground">
              <p>• 基于风险百分比</p>
              <p>• 多种计算模型</p>
            </div>
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-secondary text-secondary-foreground h-9 px-4 py-2">
              即将推出
            </span>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} 交易助手 - 为交易者提供专业工具</p>
      </footer>
    </div>
  );
}
