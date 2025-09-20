import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Calendar, DollarSign, Target } from "lucide-react";
import { useState } from "react";

interface PricePoint {
  date: string;
  price: number;
  retailer: string;
}

const priceHistoryData: PricePoint[] = [
  { date: "2024-06-01", price: 299.99, retailer: "Amazon" },
  { date: "2024-06-15", price: 289.99, retailer: "Amazon" },
  { date: "2024-07-01", price: 279.99, retailer: "Amazon" },
  { date: "2024-07-15", price: 249.99, retailer: "Amazon" },
  { date: "2024-08-01", price: 269.99, retailer: "Amazon" },
  { date: "2024-08-15", price: 259.99, retailer: "Amazon" },
  { date: "2024-09-01", price: 239.99, retailer: "Amazon" },
  { date: "2024-09-15", price: 229.99, retailer: "Amazon" },
  { date: "2024-09-20", price: 219.99, retailer: "Amazon" },
];

const timeRanges = [
  { label: "1M", value: "1month" },
  { label: "3M", value: "3months" },
  { label: "6M", value: "6months" },
  { label: "1Y", value: "1year" },
];

export const PriceHistory = () => {
  const [selectedRange, setSelectedRange] = useState("6months");
  
  const currentPrice = priceHistoryData[priceHistoryData.length - 1].price;
  const startPrice = priceHistoryData[0].price;
  const lowestPrice = Math.min(...priceHistoryData.map(p => p.price));
  const highestPrice = Math.max(...priceHistoryData.map(p => p.price));
  const priceChange = currentPrice - startPrice;
  const priceChangePercent = ((priceChange / startPrice) * 100).toFixed(1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-primary">
            <span className="font-semibold">{formatPrice(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Price Overview */}
      <Card className="p-6 card-gradient">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Price History</h2>
          <div className="flex gap-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Price & Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <DollarSign className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{formatPrice(currentPrice)}</div>
            <div className="text-sm text-muted-foreground">Current Price</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {priceChange < 0 ? (
                <TrendingDown className="h-5 w-5 text-positive" />
              ) : (
                <TrendingUp className="h-5 w-5 text-negative" />
              )}
            </div>
            <div className={`text-2xl font-bold ${priceChange < 0 ? 'text-positive' : 'text-negative'}`}>
              {priceChange < 0 ? '' : '+'}{priceChangePercent}%
            </div>
            <div className="text-sm text-muted-foreground">6M Change</div>
          </div>

          <div className="text-center">
            <Target className="h-5 w-5 mx-auto mb-2 text-positive" />
            <div className="text-2xl font-bold text-positive">{formatPrice(lowestPrice)}</div>
            <div className="text-sm text-muted-foreground">Lowest</div>
          </div>

          <div className="text-center">
            <Calendar className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-bold">{formatPrice(highestPrice)}</div>
            <div className="text-sm text-muted-foreground">Highest</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-xs"
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                className="text-xs"
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Price Alerts & Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 card-gradient">
          <h3 className="text-lg font-semibold mb-4">Smart Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-positive-light rounded-lg border border-positive/20">
              <TrendingDown className="h-5 w-5 text-positive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-positive">Great time to buy!</p>
                <p className="text-sm text-muted-foreground">
                  Price has dropped 26.7% from its 6-month high
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Price Pattern</p>
                <p className="text-sm text-muted-foreground">
                  Historically drops 15% during holiday seasons
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 card-gradient">
          <h3 className="text-lg font-semibold mb-4">Price Tracking</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Target Price</span>
                <Badge variant="outline">Set Alert</Badge>
              </div>
              <div className="text-2xl font-bold text-primary">{formatPrice(199.99)}</div>
              <p className="text-sm text-muted-foreground">
                We'll notify you when price drops to this level
              </p>
            </div>

            <Button className="w-full" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Set Price Alert
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};