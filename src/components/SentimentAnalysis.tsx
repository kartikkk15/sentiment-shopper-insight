import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { NLPService } from "@/services/NLPService";
import { TrendingUp, TrendingDown, Minus, Star, ThumbsUp, ThumbsDown, Brain, Loader2, Play } from "lucide-react";

interface TopicSentiment {
  topic: string;
  sentiment: number;
  mentions: number;
  keywords: string[];
}

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
  topicBreakdown: TopicSentiment[];
}


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
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customReviews, setCustomReviews] = useState("");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with sample data and load model
    initializeNLP();
  }, []);

  const initializeNLP = async () => {
    try {
      setIsAnalyzing(true);
      await NLPService.initialize();
      setIsModelLoaded(true);
      
      // Analyze sample reviews on initialization
      const sampleReviews = NLPService.getSampleReviews();
      const analysis = await NLPService.analyzeReviews(sampleReviews);
      setSentimentData(analysis);
      
      toast({
        title: "NLP Model Loaded",
        description: "Real-time sentiment analysis is now active!"
      });
    } catch (error) {
      console.error('Failed to initialize NLP:', error);
      toast({
        title: "Model Loading Failed",
        description: "Using fallback analysis. Try refreshing the page.",
        variant: "destructive"
      });
      setSentimentData(NLPService['getDefaultAnalysis']());
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCustomReviews = async () => {
    if (!customReviews.trim()) {
      toast({
        title: "No Reviews",
        description: "Please enter some reviews to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Split reviews by line breaks
      const reviews = customReviews
        .split('\n')
        .filter(review => review.trim().length > 10)
        .slice(0, 50); // Limit to prevent overwhelming

      if (reviews.length === 0) {
        throw new Error("Please enter valid reviews (at least 10 characters each)");
      }

      const analysis = await NLPService.analyzeReviews(reviews);
      setSentimentData(analysis);
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${reviews.length} reviews with AI sentiment analysis`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze reviews",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!sentimentData) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading NLP model...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* NLP Model Status */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">AI-Powered Sentiment Analysis</h3>
              <p className="text-sm text-muted-foreground">
                {isModelLoaded ? "DistilBERT model active" : "Loading model..."}
              </p>
            </div>
          </div>
          <Badge variant={isModelLoaded ? "default" : "outline"}>
            {isModelLoaded ? "Active" : "Loading"}
          </Badge>
        </div>
      </Card>

      {/* Custom Review Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analyze Custom Reviews</h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Paste customer reviews here (one per line)..."
            value={customReviews}
            onChange={(e) => setCustomReviews(e.target.value)}
            className="min-h-32"
          />
          <Button 
            onClick={analyzeCustomReviews}
            disabled={isAnalyzing || !isModelLoaded}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Analyze Reviews with NLP
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Overall Sentiment Card */}
      <Card className="p-6 card-gradient">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Live Sentiment Analysis</h2>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold">{sentimentData.overall}</span>
            <span className="text-muted-foreground">({sentimentData.totalReviews} reviews)</span>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsUp className="h-4 w-4 text-positive" />
              <span className="font-medium">Positive</span>
            </div>
            <div className="text-2xl font-bold text-positive mb-1">{sentimentData.positive}%</div>
            <Progress value={sentimentData.positive} className="h-2" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Minus className="h-4 w-4 text-neutral" />
              <span className="font-medium">Neutral</span>
            </div>
            <div className="text-2xl font-bold text-neutral mb-1">{sentimentData.neutral}%</div>
            <Progress value={sentimentData.neutral} className="h-2" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsDown className="h-4 w-4 text-negative" />
              <span className="font-medium">Negative</span>
            </div>
            <div className="text-2xl font-bold text-negative mb-1">{sentimentData.negative}%</div>
            <Progress value={sentimentData.negative} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 card-gradient">
          <h3 className="text-lg font-semibold mb-4 text-positive">What Customers Love</h3>
          <ul className="space-y-2">
            {sentimentData.keyInsights.pros.map((pro, index) => (
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
            {sentimentData.keyInsights.cons.map((con, index) => (
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
        <h3 className="text-lg font-semibold mb-4">AI Topic Analysis</h3>
        <div className="space-y-4">
          {sentimentData.topicBreakdown.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="font-medium min-w-0">{topic.topic}</span>
                <span className="text-sm text-muted-foreground">({topic.mentions} mentions)</span>
                {topic.keywords && topic.keywords.length > 0 && (
                  <div className="flex gap-1">
                    {topic.keywords.slice(0, 2).map((keyword, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <SentimentBadge sentiment={topic.sentiment} size="sm" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};