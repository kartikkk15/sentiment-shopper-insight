import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SentimentAnalysis } from "./SentimentAnalysis";
import { PriceHistory } from "./PriceHistory";
import { ProductLinkInput } from "./ProductLinkInput";
import { 
  BarChart3, 
  TrendingUp, 
  Star, 
  ShoppingCart, 
  ExternalLink,
  Heart,
  Share2,
  Filter,
  Search,
  Link2
} from "lucide-react";
import { Input } from "@/components/ui/input";

const mockProduct = {
  name: "Sony WH-1000XM4 Wireless Noise Canceling Headphones",
  brand: "Sony",
  currentPrice: 219.99,
  originalPrice: 349.99,
  rating: 4.2,
  reviewCount: 1247,
  image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&crop=center",
  description: "Industry-leading noise canceling with Dual Noise Sensor technology. Premium sound with 30mm drivers and DSEE Extreme upscaling.",
  availability: "In Stock",
  seller: "Amazon"
};

export const ProductDashboard = () => {
  const [currentProduct, setCurrentProduct] = useState(mockProduct);
  const [inputMode, setInputMode] = useState<'search' | 'link'>('search');
  
  const savings = currentProduct.originalPrice - currentProduct.currentPrice;
  const savingsPercent = ((savings / currentProduct.originalPrice) * 100).toFixed(0);

  const handleProductLoad = (productData: any) => {
    setCurrentProduct(productData);
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                SmartShopper
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as 'search' | 'link')} className="hidden md:block">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="search" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </TabsTrigger>
                  <TabsTrigger value="link" className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Paste Link
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {inputMode === 'search' && (
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10 w-64"
                  />
                </div>
              )}
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Link Input Section */}
        {inputMode === 'link' && (
          <div className="mb-8">
            <ProductLinkInput onProductLoad={handleProductLoad} />
          </div>
        )}

        {/* Product Overview */}
        <Card className="p-6 mb-8 elevated-card">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image & Info */}
            <div>
              <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                <img 
                  src={currentProduct.image} 
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="default" className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-2">{currentProduct.brand}</Badge>
                <h1 className="text-3xl font-bold mb-2">{currentProduct.name}</h1>
                <p className="text-muted-foreground leading-relaxed">{currentProduct.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-semibold">{currentProduct.rating}</span>
                  <span className="text-muted-foreground">({currentProduct.reviewCount} reviews)</span>
                </div>
                <Badge variant="outline" className="sentiment-positive">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending Up
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">${currentProduct.currentPrice}</span>
                  <span className="text-xl text-muted-foreground line-through">${currentProduct.originalPrice}</span>
                  <Badge className="bg-positive text-positive-foreground">
                    Save {savingsPercent}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  You save <span className="font-semibold text-positive">${savings.toFixed(2)}</span> with current pricing
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <span className="text-sm text-muted-foreground">Availability</span>
                  <div className="font-semibold text-positive">{currentProduct.availability}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Sold by</span>
                  <div className="font-semibold">{currentProduct.seller}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Analytics Tabs */}
        <Tabs defaultValue="sentiment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Sentiment Analysis
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Price History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sentiment">
            <SentimentAnalysis />
          </TabsContent>

          <TabsContent value="pricing">
            <PriceHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};