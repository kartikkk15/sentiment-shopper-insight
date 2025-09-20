import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Star, ThumbsUp, ThumbsDown } from "lucide-react";

interface SentimentData {
  overall: number;
  positive: number;
  neutral: number;
  negative: number;
  totalReviews: number;
  keyInsights: {
    pros: string[];
    cons: string[];
  };
  topicBreakdown: {
    topic: string;
    sentiment: number;
    mentions: number;
  }[];
}

const mockSentimentData: SentimentData = {
  overall: 4.2,
  positive: 68,
  neutral: 22,
  negative: 10,
  totalReviews: 1247,
  keyInsights: {
    pros: ["Excellent build quality", "Fast shipping", "Great customer service", "Value for money"],
    cons: ["Limited color options", "Instructions unclear", "Packaging could be better"]
  },
  topicBreakdown: [
    { topic: "Quality", sentiment: 85, mentions: 523 },
    { topic: "Price", sentiment: 72, mentions: 445 },
    { topic: "Shipping", sentiment: 91, mentions: 332 },
    { topic: "Design", sentiment: 58, mentions: 289 },
    { topic: "Customer Service", sentiment: 88, mentions: 156 }
  ]
};

const SentimentBadge = ({ sentiment, size = "default" }: { sentiment: number; size?: "default" | "sm" }) => {
  const getSentimentStyle = (score: number) => {
    if (score >= 70) return "sentiment-positive";
    if (score <= 40) return "sentiment-negative";
    return "sentiment-neutral";
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-3 w-3" />;
    if (score <= 40) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  return (
    <Badge variant="outline" className={`${getSentimentStyle(sentiment)} ${size === "sm" ? "text-xs px-2 py-0.5" : ""}`}>
      {getSentimentIcon(sentiment)}
      <span className="ml-1">{sentiment}%</span>
    </Badge>
  );
};

export const SentimentAnalysis = () => {
  return (
    <div className="space-y-6">
      {/* Overall Sentiment Card */}
      <Card className="p-6 card-gradient">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sentiment Analysis</h2>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold">{mockSentimentData.overall}</span>
            <span className="text-muted-foreground">({mockSentimentData.totalReviews} reviews)</span>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsUp className="h-4 w-4 text-positive" />
              <span className="font-medium">Positive</span>
            </div>
            <div className="text-2xl font-bold text-positive mb-1">{mockSentimentData.positive}%</div>
            <Progress value={mockSentimentData.positive} className="h-2" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Minus className="h-4 w-4 text-neutral" />
              <span className="font-medium">Neutral</span>
            </div>
            <div className="text-2xl font-bold text-neutral mb-1">{mockSentimentData.neutral}%</div>
            <Progress value={mockSentimentData.neutral} className="h-2" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsDown className="h-4 w-4 text-negative" />
              <span className="font-medium">Negative</span>
            </div>
            <div className="text-2xl font-bold text-negative mb-1">{mockSentimentData.negative}%</div>
            <Progress value={mockSentimentData.negative} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 card-gradient">
          <h3 className="text-lg font-semibold mb-4 text-positive">What Customers Love</h3>
          <ul className="space-y-2">
            {mockSentimentData.keyInsights.pros.map((pro, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 bg-positive rounded-full flex-shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 card-gradient">
          <h3 className="text-lg font-semibold mb-4 text-negative">Areas for Improvement</h3>
          <ul className="space-y-2">
            {mockSentimentData.keyInsights.cons.map((con, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 bg-negative rounded-full flex-shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Topic Breakdown */}
      <Card className="p-6 card-gradient">
        <h3 className="text-lg font-semibold mb-4">Sentiment by Topic</h3>
        <div className="space-y-4">
          {mockSentimentData.topicBreakdown.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="font-medium min-w-0">{topic.topic}</span>
                <span className="text-sm text-muted-foreground">({topic.mentions} mentions)</span>
              </div>
              <SentimentBadge sentiment={topic.sentiment} size="sm" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};