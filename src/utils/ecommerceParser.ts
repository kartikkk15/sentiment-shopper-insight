interface ProductInfo {
  platform: string;
  productId?: string;
  name?: string;
  isValid: boolean;
}

export class EcommerceParser {
  private static platformPatterns = {
    amazon: [
      /amazon\.(com|in|co\.uk|de|fr|jp).*\/dp\/([A-Z0-9]{10})/i,
      /amazon\.(com|in|co\.uk|de|fr|jp).*\/gp\/product\/([A-Z0-9]{10})/i,
      /amazon\.(com|in|co\.uk|de|fr|jp).*\/product\/([A-Z0-9]{10})/i
    ],
    flipkart: [
      /flipkart\.com.*\/p\/[^?]*\?pid=([A-Z0-9]+)/i,
      /flipkart\.com.*\/([^/]+)\/p\//i
    ],
    myntra: [
      /myntra\.com.*\/([0-9]+)/i
    ],
    ajio: [
      /ajio\.com.*\/p\/([0-9]+)/i
    ],
    nykaa: [
      /nykaa\.com.*\/p\/([0-9]+)/i
    ],
    snapdeal: [
      /snapdeal\.com.*\/product\/[^/]+\/([0-9]+)/i
    ],
    meesho: [
      /meesho\.com.*\/p\/([0-9]+)/i
    ]
  };

  static parseUrl(url: string): ProductInfo {
    const cleanUrl = url.trim();
    
    for (const [platform, patterns] of Object.entries(this.platformPatterns)) {
      for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match) {
          return {
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            productId: match[2] || match[1],
            isValid: true
          };
        }
      }
    }

    return {
      platform: 'Unknown',
      isValid: false
    };
  }

  static getSupportedPlatforms(): string[] {
    return Object.keys(this.platformPatterns).map(
      platform => platform.charAt(0).toUpperCase() + platform.slice(1)
    );
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return this.parseUrl(url).isValid;
    } catch {
      return false;
    }
  }

  // Mock product data based on platform (in a real app, this would call APIs)
  static async fetchProductData(url: string): Promise<any> {
    const parsed = this.parseUrl(url);
    
    if (!parsed.isValid) {
      throw new Error('Invalid or unsupported product URL');
    }

    // Mock data based on platform
    const mockData = {
      Amazon: {
        name: "Apple iPhone 15 Pro Max - 256GB Natural Titanium",
        brand: "Apple",
        currentPrice: 1199.99,
        originalPrice: 1299.99,
        rating: 4.5,
        reviewCount: 2847,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center",
        description: "The iPhone 15 Pro Max features a titanium design, Action Button, and powerful A17 Pro chip.",
        availability: "In Stock",
        seller: "Amazon"
      },
      Flipkart: {
        name: "Samsung Galaxy S24 Ultra 5G - 512GB Titanium Gray",
        brand: "Samsung", 
        currentPrice: 1049.99,
        originalPrice: 1199.99,
        rating: 4.3,
        reviewCount: 1856,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center",
        description: "Experience the power of Galaxy AI with the most advanced Galaxy S series smartphone.",
        availability: "In Stock",
        seller: "Flipkart"
      },
      Myntra: {
        name: "Nike Air Force 1 '07 White Sneakers",
        brand: "Nike",
        currentPrice: 89.99,
        originalPrice: 119.99,
        rating: 4.4,
        reviewCount: 3421,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
        description: "Classic white leather sneakers with iconic Air Force 1 design and comfort.",
        availability: "In Stock", 
        seller: "Myntra"
      },
      Ajio: {
        name: "Levi's 511 Slim Fit Jeans - Dark Blue",
        brand: "Levi's",
        currentPrice: 59.99,
        originalPrice: 79.99,
        rating: 4.2,
        reviewCount: 892,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
        description: "Classic slim-fit jeans with premium denim construction and comfortable fit.",
        availability: "In Stock",
        seller: "Ajio"
      },
      Nykaa: {
        name: "MAC Lipstick - Ruby Woo Matte Red",
        brand: "MAC",
        currentPrice: 24.99,
        originalPrice: 29.99,
        rating: 4.6,
        reviewCount: 1543,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop&crop=center",
        description: "Iconic matte red lipstick with full-coverage, long-wearing formula.",
        availability: "In Stock",
        seller: "Nykaa"
      }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return mockData[parsed.platform as keyof typeof mockData] || mockData.Amazon;
  }
}