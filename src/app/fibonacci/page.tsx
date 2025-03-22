"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatNumber = (num: number): string => {
  if (num >= 10000) return num.toFixed(0);
  if (num >= 1000) return num.toFixed(1);
  if (num >= 100) return num.toFixed(2);
  if (num >= 10) return num.toFixed(3);
  return num.toFixed(4);
};

interface FibResult {
  entryPoint: number;
  entryPointMax: number;
  stopLoss: number;
  takeProfit: number;
  profitPercentage: number; // 盈利百分比字段
  lossPercentage: number; // 亏损百分比字段
  scenario: string;
  fibLevels: {
    level: string;
    price: number;
  }[];
}

export default function FibonacciTool() {
  const [highPrice, setHighPrice] = useState("");
  const [lowPrice, setLowPrice] = useState("");
  const [results, setResults] = useState<FibResult[]>([]);

  const calculateFibLevels = (
    high: number,
    low: number,
    isShort: boolean = false
  ) => {
    const diff = high - low;
    const levels = [
      { level: "0%", value: 0 },
      { level: "23.6%", value: 0.236 },
      { level: "38.2%", value: 0.382 },
      { level: "50%", value: 0.5 },
      { level: "61.8%", value: 0.618 },
      { level: "78.6%", value: 0.786 },
      { level: "100%", value: 1 },
      { level: "161.8%", value: 1.618 },
      // { level: '261.8%', value: 2.618 },
      // { level: '361.8%', value: 3.618 },
      // { level: '423.6%', value: 4.236 }
    ];

    return levels.map(({ level, value }) => ({
      level,
      price: isShort ? high - diff * value : low + diff * value,
    }));
  };

  const calculateScenarios = () => {
    const high = parseFloat(highPrice);
    const low = parseFloat(lowPrice);

    if (isNaN(high) || isNaN(low) || high <= low) {
      return;
    }

    const longScenario = calculateFibLevels(high, low);
    const shortScenario = calculateFibLevels(high, low, true);

    // 做空：止损在高点，止盈在38.2%回调位置
    const shortTP = high - (high - low) * 0.382;
    const shortSL = high;
    
    // 使用盈亏比2和3计算入场点范围
    const shortEntryRR2 = (shortTP + 2 * shortSL) / (1 + 2);
    const shortEntryRR3 = (shortTP + 3 * shortSL) / (1 + 3);

    // 做多：止损在低点，止盈在38.2%回调位置
    const longTP = low + (high - low) * 0.382;
    const longSL = low;
    const longRiskDistance = longTP - longSL;
    const longEntryRR2 = longTP - longRiskDistance / 2;
    const longEntryRR3 = longTP - longRiskDistance / 3;

    // 计算盈利百分比和亏损百分比 (使用盈亏比2.5的中间值计算百分比)
    const longEntryAvg = (longEntryRR2 + longEntryRR3) / 2;
    const shortEntryAvg = (shortEntryRR2 + shortEntryRR3) / 2;
    const longProfitPercentage = ((longTP - longEntryAvg) / longEntryAvg) * 100;
    const longLossPercentage = ((longEntryAvg - longSL) / longEntryAvg) * 100;
    const shortProfitPercentage = ((shortEntryAvg - shortTP) / shortEntryAvg) * 100;
    const shortLossPercentage = ((shortSL - shortEntryAvg) / shortEntryAvg) * 100;

    setResults([
      {
        scenario: "多头",
        entryPoint: Math.min(longEntryRR2, longEntryRR3),
        entryPointMax: Math.max(longEntryRR2, longEntryRR3),
        stopLoss: longSL,
        takeProfit: longTP,
        profitPercentage: longProfitPercentage,
        lossPercentage: longLossPercentage,
        fibLevels: longScenario,
      },
      {
        scenario: "空头",
        entryPoint: Math.min(shortEntryRR2, shortEntryRR3),
        entryPointMax: Math.max(shortEntryRR2, shortEntryRR3),
        stopLoss: shortSL,
        takeProfit: shortTP,
        profitPercentage: shortProfitPercentage,
        lossPercentage: shortLossPercentage,
        fibLevels: shortScenario,
      },
    ]);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-4">
            <label className="w-24 text-right">最高价：</label>
            <Input
              type="number"
              value={highPrice}
              onChange={(e) => setHighPrice(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-right">最低价：</label>
            <Input
              type="number"
              value={lowPrice}
              onChange={(e) => setLowPrice(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-right">风险收益比：</label>
            <div className="w-48 text-sm text-gray-500">2-3 (内置范围)</div>
          </div>
          <Button onClick={calculateScenarios} className="mt-4">
            计算
          </Button>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-2 gap-6">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{result.scenario}方案</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-green-500">入场点范围：{formatNumber(result.entryPoint)} - {formatNumber(result.entryPointMax)}</p>
                      <p>
                        止损：{formatNumber(result.stopLoss)} (
                        {result.lossPercentage.toFixed(2)}%)
                      </p>
                      <p className="text-blue-500">
                        止盈：{formatNumber(result.takeProfit)} (
                        {result.profitPercentage.toFixed(2)}%)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">斐波那契水平</h4>
                      <div className="space-y-1">
                        {result.scenario === "多头"
                          ? [...result.fibLevels].reverse().map((level, i) => (
                              <div key={i} className="border-b">
                                <div className="flex items-center">
                                  <div className="w-20 font-medium">
                                    {level.level}
                                  </div>
                                  <div>{formatNumber(level.price)}</div>
                                </div>
                                {level.level === "38.2%" && (
                                  <div className="ml-2 text-xs text-blue-500 italic">
                                    重要反弹点，强势趋势可能在此结束修正
                                  </div>
                                )}
                              </div>
                            ))
                          : result.fibLevels.map((level, i) => (
                              <div key={i} className="border-b">
                                <div key={i} className="flex items-center">
                                  <div className="w-20 font-medium">
                                    {level.level}
                                  </div>
                                  <div>{formatNumber(level.price)}</div>
                                </div>
                                {level.level === "38.2%" && (
                                  <div className="ml-2 text-xs text-blue-500 italic">
                                    重要反弹点，强势趋势可能在此结束修正
                                  </div>
                                )}
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
