'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatNumber = (num: number): string => {
  if (num >= 10000) return num.toFixed(0);
  if (num >= 1000) return num.toFixed(1);
  if (num >= 100) return num.toFixed(2);
  if (num >= 10) return num.toFixed(3);
  return num.toFixed(4);
};

interface FibResult {
  entryPoint: number;
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
  const [highPrice, setHighPrice] = useState('');
  const [lowPrice, setLowPrice] = useState('');
  const [riskRewardRatio, setRiskRewardRatio] = useState('2');
  const [results, setResults] = useState<FibResult[]>([]);

  const calculateFibLevels = (high: number, low: number, isShort: boolean = false) => {
    const diff = high - low;
    const levels = [
      { level: '0', value: 0 },
      { level: '0.236', value: 0.236 },
      { level: '0.382', value: 0.382 },
      { level: '0.5', value: 0.5 },
      { level: '0.618', value: 0.618 },
      { level: '0.786', value: 0.786 },
      { level: '1', value: 1 },
      { level: '1.618', value: 1.618 },
      { level: '2.618', value: 2.618 },
      { level: '3.618', value: 3.618 },
      { level: '4.236', value: 4.236 }
    ];

    return levels.map(({ level, value }) => ({
      level,
      price: isShort ? high - diff * value : low + diff * value
    }));
  };

  const calculateScenarios = () => {
    const high = parseFloat(highPrice);
    const low = parseFloat(lowPrice);
    const rr = parseFloat(riskRewardRatio);

    if (isNaN(high) || isNaN(low) || isNaN(rr) || high <= low) {
      return;
    }

    const longScenario = calculateFibLevels(high, low);
    const shortScenario = calculateFibLevels(high, low, true);

    // 做空：止损在高点，止盈在38.2%回调位置
    const shortTP = high - (high - low) * 0.382;
    const shortSL = high;
    // 修正：根据盈亏比计算入场点
    // 止损距离 = shortSL - shortEntry
    // 止盈距离 = shortEntry - shortTP
    // 止盈距离 = rr * 止损距离
    // shortEntry - shortTP = rr * (shortSL - shortEntry)
    const shortEntry = (shortTP + rr * shortSL) / (1 + rr);

    // 做多：止损在低点，止盈在38.2%回调位置
    const longTP = low + (high - low) * 0.382;
    const longSL = low;
    const longRiskDistance = longTP - longSL;
    const longEntry = longTP - longRiskDistance / rr;

    // 计算盈利百分比和亏损百分比
    const longProfitPercentage = ((longTP - longEntry) / longEntry) * 100;
    const longLossPercentage = ((longEntry - longSL) / longEntry) * 100;
    const shortProfitPercentage = ((shortEntry - shortTP) / shortEntry) * 100;
    const shortLossPercentage = ((shortSL - shortEntry) / shortEntry) * 100;
    
    setResults([
      {
        scenario: '多头',
        entryPoint: longEntry,
        stopLoss: longSL,
        takeProfit: longTP,
        profitPercentage: longProfitPercentage,
        lossPercentage: longLossPercentage,
        fibLevels: longScenario
      },
      {
        scenario: '空头',
        entryPoint: shortEntry,
        stopLoss: shortSL,
        takeProfit: shortTP,
        profitPercentage: shortProfitPercentage,
        lossPercentage: shortLossPercentage,
        fibLevels: shortScenario
      }
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
            <Input
              type="number"
              value={riskRewardRatio}
              onChange={(e) => setRiskRewardRatio(e.target.value)}
              className="w-48"
            />
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
                      <p>入场点：{formatNumber(result.entryPoint)}</p>
                      <p>止损：{formatNumber(result.stopLoss)} ({result.lossPercentage.toFixed(2)}%)</p>
                      <p>止盈：{formatNumber(result.takeProfit)} ({result.profitPercentage.toFixed(2)}%)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">斐波那契水平</h4>
                      {result.fibLevels.map((level, i) => (
                        <p key={i}>
                          {level.level}: {formatNumber(level.price)}
                        </p>
                      ))}
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