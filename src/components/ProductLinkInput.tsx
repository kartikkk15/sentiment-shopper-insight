import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { EcommerceParser } from "@/utils/ecommerceParser";
import { Link2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProductLinkInputProps {
  onProductLoad: (productData: any) => void;
}

export const ProductLinkInput = ({ onProductLoad }: ProductLinkInputProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) {
      const valid = EcommerceParser.isValidUrl(value);
      setIsValid(valid);
    } else {
      setIsValid(null);
    }
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a product URL",
        variant: "destructive"
      });
      return;
    }

    if (!EcommerceParser.isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid product URL from supported platforms",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const productData = await EcommerceParser.fetchProductData(url);
      onProductLoad(productData);
      toast({
        title: "Success",
        description: "Product loaded successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load product",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const supportedPlatforms = EcommerceParser.getSupportedPlatforms();

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <label htmlFor="product-url" className="text-sm font-medium">
          Product URL
        </label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="product-url"
            placeholder="Paste product link here..."
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`pl-10 ${
              isValid === true ? 'border-positive' : 
              isValid === false ? 'border-destructive' : ''
            }`}
          />
          {isValid !== null && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValid ? (
                <CheckCircle2 className="h-4 w-4 text-positive" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Supported platforms:</p>
        <div className="flex flex-wrap gap-2">
          {supportedPlatforms.map((platform) => (
            <Badge key={platform} variant="outline" className="text-xs">
              {platform}
            </Badge>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleAnalyze}
        disabled={!isValid || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing Product...
          </>
        ) : (
          "Analyze Product"
        )}
      </Button>
    </Card>
  );
};