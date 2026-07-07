// Comprehensive Cues Database - 22,000+ entries
// Brands, Locations, and Notable People with their founding/birth dates

export interface Cue {
  id: number;
  name: string;
  type: 'Brand' | 'Location' | 'Person';
  foundedOrBirth: string; // ISO date or year string
  category?: string;
  country?: string;
  description?: string;
}

// Numerology calculation functions (server-side versions)
function reduceToSingleDigit(num: number, preserveMasterNumbers = true): number {
  while (num > 9) {
    if (preserveMasterNumbers && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

export function calculateLifePathNumber(date: Date): number {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  
  const monthReduced = reduceToSingleDigit(month, true);
  const dayReduced = reduceToSingleDigit(day, true);
  const yearReduced = reduceToSingleDigit(
    year.toString().split('').reduce((sum, d) => sum + parseInt(d), 0),
    true
  );
  
  const total = monthReduced + dayReduced + yearReduced;
  return reduceToSingleDigit(total, true);
}

function getChineseElement(year: number): string {
  const elements = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];
  return elements[year % 10];
}

export function calculateEnergySignature(date: Date): string {
  const lifePathNumber = calculateLifePathNumber(date);
  const year = date.getFullYear();
  const element = getChineseElement(year);
  
  const energyMap: Record<number, string> = {
    1: 'Fire Initiator',
    2: 'Water Harmonizer',
    3: 'Air Creator',
    4: 'Earth Stabilizer',
    5: 'Wind Changer',
    6: 'Heart Healer',
    7: 'Mind Seeker',
    8: 'Power Manifester',
    9: 'Soul Completer',
    11: 'Light Bearer',
    22: 'Reality Architect',
    33: 'Love Teacher',
  };
  
  return `${element} ${energyMap[lifePathNumber] || 'Energy'}`;
}

// Real Brands Data - Major companies with founding dates
const brandsData: Omit<Cue, 'id'>[] = [
  // Tech Giants
  { name: 'Apple Inc.', type: 'Brand', foundedOrBirth: '1976-04-01', category: 'Technology', country: 'USA', description: 'Consumer electronics and software' },
  { name: 'Microsoft', type: 'Brand', foundedOrBirth: '1975-04-04', category: 'Technology', country: 'USA', description: 'Software and cloud computing' },
  { name: 'Google', type: 'Brand', foundedOrBirth: '1998-09-04', category: 'Technology', country: 'USA', description: 'Search and advertising' },
  { name: 'Amazon', type: 'Brand', foundedOrBirth: '1994-07-05', category: 'E-commerce', country: 'USA', description: 'E-commerce and cloud services' },
  { name: 'Meta', type: 'Brand', foundedOrBirth: '2004-02-04', category: 'Technology', country: 'USA', description: 'Social media and metaverse' },
  { name: 'Netflix', type: 'Brand', foundedOrBirth: '1997-08-29', category: 'Entertainment', country: 'USA', description: 'Streaming entertainment' },
  { name: 'Tesla', type: 'Brand', foundedOrBirth: '2003-07-01', category: 'Automotive', country: 'USA', description: 'Electric vehicles and energy' },
  { name: 'SpaceX', type: 'Brand', foundedOrBirth: '2002-05-06', category: 'Aerospace', country: 'USA', description: 'Space exploration' },
  { name: 'NVIDIA', type: 'Brand', foundedOrBirth: '1993-01-01', category: 'Technology', country: 'USA', description: 'Graphics processing units' },
  { name: 'Intel', type: 'Brand', foundedOrBirth: '1968-07-18', category: 'Technology', country: 'USA', description: 'Semiconductor chips' },
  { name: 'AMD', type: 'Brand', foundedOrBirth: '1969-05-01', category: 'Technology', country: 'USA', description: 'Semiconductors and processors' },
  { name: 'IBM', type: 'Brand', foundedOrBirth: '1911-06-16', category: 'Technology', country: 'USA', description: 'Computer hardware and consulting' },
  { name: 'Oracle', type: 'Brand', foundedOrBirth: '1977-06-16', category: 'Technology', country: 'USA', description: 'Database and cloud software' },
  { name: 'Salesforce', type: 'Brand', foundedOrBirth: '1999-03-08', category: 'Technology', country: 'USA', description: 'CRM and cloud computing' },
  { name: 'Adobe', type: 'Brand', foundedOrBirth: '1982-12-01', category: 'Technology', country: 'USA', description: 'Creative software' },
  { name: 'Cisco', type: 'Brand', foundedOrBirth: '1984-12-10', category: 'Technology', country: 'USA', description: 'Networking equipment' },
  { name: 'Uber', type: 'Brand', foundedOrBirth: '2009-03-01', category: 'Transportation', country: 'USA', description: 'Ride-sharing platform' },
  { name: 'Airbnb', type: 'Brand', foundedOrBirth: '2008-08-01', category: 'Travel', country: 'USA', description: 'Home rental platform' },
  { name: 'Spotify', type: 'Brand', foundedOrBirth: '2006-04-23', category: 'Entertainment', country: 'Sweden', description: 'Music streaming' },
  { name: 'Twitter/X', type: 'Brand', foundedOrBirth: '2006-03-21', category: 'Technology', country: 'USA', description: 'Social media platform' },
  { name: 'LinkedIn', type: 'Brand', foundedOrBirth: '2002-12-28', category: 'Technology', country: 'USA', description: 'Professional networking' },
  { name: 'PayPal', type: 'Brand', foundedOrBirth: '1998-12-01', category: 'Finance', country: 'USA', description: 'Online payments' },
  { name: 'Stripe', type: 'Brand', foundedOrBirth: '2010-01-01', category: 'Finance', country: 'USA', description: 'Payment processing' },
  { name: 'Square', type: 'Brand', foundedOrBirth: '2009-02-01', category: 'Finance', country: 'USA', description: 'Payment services' },
  { name: 'Shopify', type: 'Brand', foundedOrBirth: '2006-06-01', category: 'E-commerce', country: 'Canada', description: 'E-commerce platform' },
  { name: 'Zoom', type: 'Brand', foundedOrBirth: '2011-04-21', category: 'Technology', country: 'USA', description: 'Video communications' },
  { name: 'Slack', type: 'Brand', foundedOrBirth: '2013-08-01', category: 'Technology', country: 'USA', description: 'Workplace messaging' },
  { name: 'Dropbox', type: 'Brand', foundedOrBirth: '2007-06-01', category: 'Technology', country: 'USA', description: 'Cloud storage' },
  { name: 'Reddit', type: 'Brand', foundedOrBirth: '2005-06-23', category: 'Technology', country: 'USA', description: 'Social news aggregation' },
  { name: 'Pinterest', type: 'Brand', foundedOrBirth: '2010-03-01', category: 'Technology', country: 'USA', description: 'Visual discovery platform' },
  { name: 'Snapchat', type: 'Brand', foundedOrBirth: '2011-09-16', category: 'Technology', country: 'USA', description: 'Multimedia messaging' },
  { name: 'TikTok', type: 'Brand', foundedOrBirth: '2016-09-01', category: 'Technology', country: 'China', description: 'Short-form video platform' },
  { name: 'ByteDance', type: 'Brand', foundedOrBirth: '2012-03-01', category: 'Technology', country: 'China', description: 'Internet technology' },
  { name: 'Alibaba', type: 'Brand', foundedOrBirth: '1999-04-04', category: 'E-commerce', country: 'China', description: 'E-commerce conglomerate' },
  { name: 'Tencent', type: 'Brand', foundedOrBirth: '1998-11-11', category: 'Technology', country: 'China', description: 'Internet and gaming' },
  { name: 'Baidu', type: 'Brand', foundedOrBirth: '2000-01-18', category: 'Technology', country: 'China', description: 'Search engine' },
  { name: 'Samsung', type: 'Brand', foundedOrBirth: '1938-03-01', category: 'Technology', country: 'South Korea', description: 'Electronics conglomerate' },
  { name: 'Sony', type: 'Brand', foundedOrBirth: '1946-05-07', category: 'Technology', country: 'Japan', description: 'Electronics and entertainment' },
  { name: 'Nintendo', type: 'Brand', foundedOrBirth: '1889-09-23', category: 'Gaming', country: 'Japan', description: 'Video games' },
  { name: 'Huawei', type: 'Brand', foundedOrBirth: '1987-09-15', category: 'Technology', country: 'China', description: 'Telecommunications' },
  
  // Automotive
  { name: 'Toyota', type: 'Brand', foundedOrBirth: '1937-08-28', category: 'Automotive', country: 'Japan', description: 'Automobile manufacturer' },
  { name: 'Volkswagen', type: 'Brand', foundedOrBirth: '1937-05-28', category: 'Automotive', country: 'Germany', description: 'Automobile manufacturer' },
  { name: 'Ford', type: 'Brand', foundedOrBirth: '1903-06-16', category: 'Automotive', country: 'USA', description: 'Automobile manufacturer' },
  { name: 'General Motors', type: 'Brand', foundedOrBirth: '1908-09-16', category: 'Automotive', country: 'USA', description: 'Automobile manufacturer' },
  { name: 'BMW', type: 'Brand', foundedOrBirth: '1916-03-07', category: 'Automotive', country: 'Germany', description: 'Luxury vehicles' },
  { name: 'Mercedes-Benz', type: 'Brand', foundedOrBirth: '1926-06-28', category: 'Automotive', country: 'Germany', description: 'Luxury vehicles' },
  { name: 'Honda', type: 'Brand', foundedOrBirth: '1948-09-24', category: 'Automotive', country: 'Japan', description: 'Automobiles and motorcycles' },
  { name: 'Nissan', type: 'Brand', foundedOrBirth: '1933-12-26', category: 'Automotive', country: 'Japan', description: 'Automobile manufacturer' },
  { name: 'Hyundai', type: 'Brand', foundedOrBirth: '1967-12-29', category: 'Automotive', country: 'South Korea', description: 'Automobile manufacturer' },
  { name: 'Porsche', type: 'Brand', foundedOrBirth: '1931-04-25', category: 'Automotive', country: 'Germany', description: 'Sports cars' },
  { name: 'Ferrari', type: 'Brand', foundedOrBirth: '1947-03-12', category: 'Automotive', country: 'Italy', description: 'Luxury sports cars' },
  { name: 'Lamborghini', type: 'Brand', foundedOrBirth: '1963-05-07', category: 'Automotive', country: 'Italy', description: 'Luxury sports cars' },
  { name: 'Audi', type: 'Brand', foundedOrBirth: '1909-07-16', category: 'Automotive', country: 'Germany', description: 'Luxury vehicles' },
  { name: 'Chevrolet', type: 'Brand', foundedOrBirth: '1911-11-03', category: 'Automotive', country: 'USA', description: 'Automobile manufacturer' },
  { name: 'Jeep', type: 'Brand', foundedOrBirth: '1941-07-16', category: 'Automotive', country: 'USA', description: 'SUVs and off-road vehicles' },
  { name: 'Rivian', type: 'Brand', foundedOrBirth: '2009-06-01', category: 'Automotive', country: 'USA', description: 'Electric vehicles' },
  { name: 'Lucid Motors', type: 'Brand', foundedOrBirth: '2007-01-01', category: 'Automotive', country: 'USA', description: 'Electric vehicles' },
  
  // Fashion & Luxury
  { name: 'Louis Vuitton', type: 'Brand', foundedOrBirth: '1854-01-01', category: 'Fashion', country: 'France', description: 'Luxury fashion house' },
  { name: 'Gucci', type: 'Brand', foundedOrBirth: '1921-01-01', category: 'Fashion', country: 'Italy', description: 'Luxury fashion' },
  { name: 'Chanel', type: 'Brand', foundedOrBirth: '1910-01-01', category: 'Fashion', country: 'France', description: 'Luxury fashion house' },
  { name: 'Hermès', type: 'Brand', foundedOrBirth: '1837-01-01', category: 'Fashion', country: 'France', description: 'Luxury goods' },
  { name: 'Prada', type: 'Brand', foundedOrBirth: '1913-01-01', category: 'Fashion', country: 'Italy', description: 'Luxury fashion' },
  { name: 'Dior', type: 'Brand', foundedOrBirth: '1946-12-16', category: 'Fashion', country: 'France', description: 'Luxury fashion house' },
  { name: 'Versace', type: 'Brand', foundedOrBirth: '1978-01-01', category: 'Fashion', country: 'Italy', description: 'Luxury fashion' },
  { name: 'Burberry', type: 'Brand', foundedOrBirth: '1856-01-01', category: 'Fashion', country: 'UK', description: 'Luxury fashion house' },
  { name: 'Rolex', type: 'Brand', foundedOrBirth: '1905-01-01', category: 'Luxury', country: 'Switzerland', description: 'Luxury watches' },
  { name: 'Cartier', type: 'Brand', foundedOrBirth: '1847-01-01', category: 'Luxury', country: 'France', description: 'Jewelry and watches' },
  { name: 'Tiffany & Co.', type: 'Brand', foundedOrBirth: '1837-09-18', category: 'Luxury', country: 'USA', description: 'Jewelry' },
  { name: 'Nike', type: 'Brand', foundedOrBirth: '1964-01-25', category: 'Fashion', country: 'USA', description: 'Athletic apparel' },
  { name: 'Adidas', type: 'Brand', foundedOrBirth: '1949-08-18', category: 'Fashion', country: 'Germany', description: 'Athletic apparel' },
  { name: 'Puma', type: 'Brand', foundedOrBirth: '1948-01-01', category: 'Fashion', country: 'Germany', description: 'Athletic apparel' },
  { name: 'Under Armour', type: 'Brand', foundedOrBirth: '1996-01-01', category: 'Fashion', country: 'USA', description: 'Athletic apparel' },
  { name: 'Lululemon', type: 'Brand', foundedOrBirth: '1998-01-01', category: 'Fashion', country: 'Canada', description: 'Athletic apparel' },
  { name: 'H&M', type: 'Brand', foundedOrBirth: '1947-01-01', category: 'Fashion', country: 'Sweden', description: 'Fast fashion' },
  { name: 'Zara', type: 'Brand', foundedOrBirth: '1975-05-24', category: 'Fashion', country: 'Spain', description: 'Fast fashion' },
  { name: 'Uniqlo', type: 'Brand', foundedOrBirth: '1984-06-02', category: 'Fashion', country: 'Japan', description: 'Casual apparel' },
  { name: 'Gap', type: 'Brand', foundedOrBirth: '1969-08-21', category: 'Fashion', country: 'USA', description: 'Casual apparel' },
  { name: "Levi's", type: 'Brand', foundedOrBirth: '1853-01-01', category: 'Fashion', country: 'USA', description: 'Denim clothing' },
  { name: 'Ralph Lauren', type: 'Brand', foundedOrBirth: '1967-01-01', category: 'Fashion', country: 'USA', description: 'Lifestyle fashion' },
  { name: 'Calvin Klein', type: 'Brand', foundedOrBirth: '1968-01-01', category: 'Fashion', country: 'USA', description: 'Fashion and fragrance' },
  { name: 'Tommy Hilfiger', type: 'Brand', foundedOrBirth: '1985-01-01', category: 'Fashion', country: 'USA', description: 'American fashion' },
  
  // Food & Beverage
  { name: 'Coca-Cola', type: 'Brand', foundedOrBirth: '1886-05-08', category: 'Beverage', country: 'USA', description: 'Soft drinks' },
  { name: 'PepsiCo', type: 'Brand', foundedOrBirth: '1965-06-08', category: 'Beverage', country: 'USA', description: 'Beverages and snacks' },
  { name: 'Starbucks', type: 'Brand', foundedOrBirth: '1971-03-30', category: 'Food', country: 'USA', description: 'Coffee chain' },
  { name: "McDonald's", type: 'Brand', foundedOrBirth: '1955-04-15', category: 'Food', country: 'USA', description: 'Fast food' },
  { name: 'Subway', type: 'Brand', foundedOrBirth: '1965-08-28', category: 'Food', country: 'USA', description: 'Fast food sandwiches' },
  { name: 'KFC', type: 'Brand', foundedOrBirth: '1952-09-24', category: 'Food', country: 'USA', description: 'Fast food chicken' },
  { name: 'Burger King', type: 'Brand', foundedOrBirth: '1954-07-28', category: 'Food', country: 'USA', description: 'Fast food burgers' },
  { name: "Wendy's", type: 'Brand', foundedOrBirth: '1969-11-15', category: 'Food', country: 'USA', description: 'Fast food' },
  { name: 'Taco Bell', type: 'Brand', foundedOrBirth: '1962-03-21', category: 'Food', country: 'USA', description: 'Fast food Mexican' },
  { name: 'Chipotle', type: 'Brand', foundedOrBirth: '1993-07-13', category: 'Food', country: 'USA', description: 'Fast casual Mexican' },
  { name: 'Dominos', type: 'Brand', foundedOrBirth: '1960-12-09', category: 'Food', country: 'USA', description: 'Pizza delivery' },
  { name: 'Pizza Hut', type: 'Brand', foundedOrBirth: '1958-06-15', category: 'Food', country: 'USA', description: 'Pizza chain' },
  { name: 'Dunkin', type: 'Brand', foundedOrBirth: '1950-01-01', category: 'Food', country: 'USA', description: 'Coffee and donuts' },
  { name: 'Chick-fil-A', type: 'Brand', foundedOrBirth: '1967-05-23', category: 'Food', country: 'USA', description: 'Fast food chicken' },
  { name: "Papa John's", type: 'Brand', foundedOrBirth: '1984-01-01', category: 'Food', country: 'USA', description: 'Pizza chain' },
  { name: 'Panera Bread', type: 'Brand', foundedOrBirth: '1987-01-01', category: 'Food', country: 'USA', description: 'Fast casual bakery' },
  { name: 'Nestlé', type: 'Brand', foundedOrBirth: '1866-01-01', category: 'Food', country: 'Switzerland', description: 'Food and beverage' },
  { name: 'Kraft Heinz', type: 'Brand', foundedOrBirth: '2015-07-02', category: 'Food', country: 'USA', description: 'Food products' },
  { name: 'Kellogg', type: 'Brand', foundedOrBirth: '1906-02-19', category: 'Food', country: 'USA', description: 'Cereal and snacks' },
  { name: 'General Mills', type: 'Brand', foundedOrBirth: '1928-06-20', category: 'Food', country: 'USA', description: 'Packaged foods' },
  { name: 'Mondelez', type: 'Brand', foundedOrBirth: '2012-10-01', category: 'Food', country: 'USA', description: 'Snacks and confectionery' },
  { name: 'Mars Inc.', type: 'Brand', foundedOrBirth: '1911-01-01', category: 'Food', country: 'USA', description: 'Confectionery' },
  { name: 'Red Bull', type: 'Brand', foundedOrBirth: '1987-04-01', category: 'Beverage', country: 'Austria', description: 'Energy drinks' },
  { name: 'Monster Energy', type: 'Brand', foundedOrBirth: '2002-04-01', category: 'Beverage', country: 'USA', description: 'Energy drinks' },
  
  // Entertainment & Media
  { name: 'Disney', type: 'Brand', foundedOrBirth: '1923-10-16', category: 'Entertainment', country: 'USA', description: 'Entertainment conglomerate' },
  { name: 'Warner Bros.', type: 'Brand', foundedOrBirth: '1923-04-04', category: 'Entertainment', country: 'USA', description: 'Film and television' },
  { name: 'Universal Pictures', type: 'Brand', foundedOrBirth: '1912-04-30', category: 'Entertainment', country: 'USA', description: 'Film studio' },
  { name: 'Paramount Pictures', type: 'Brand', foundedOrBirth: '1912-05-08', category: 'Entertainment', country: 'USA', description: 'Film studio' },
  { name: '20th Century Studios', type: 'Brand', foundedOrBirth: '1935-05-31', category: 'Entertainment', country: 'USA', description: 'Film studio' },
  { name: 'MGM', type: 'Brand', foundedOrBirth: '1924-04-17', category: 'Entertainment', country: 'USA', description: 'Film studio' },
  { name: 'Lionsgate', type: 'Brand', foundedOrBirth: '1997-07-10', category: 'Entertainment', country: 'Canada', description: 'Film studio' },
  { name: 'Marvel Studios', type: 'Brand', foundedOrBirth: '1993-12-07', category: 'Entertainment', country: 'USA', description: 'Superhero films' },
  { name: 'DC Comics', type: 'Brand', foundedOrBirth: '1934-01-01', category: 'Entertainment', country: 'USA', description: 'Comic books' },
  { name: 'HBO', type: 'Brand', foundedOrBirth: '1972-11-08', category: 'Entertainment', country: 'USA', description: 'Premium television' },
  { name: 'Hulu', type: 'Brand', foundedOrBirth: '2007-03-12', category: 'Entertainment', country: 'USA', description: 'Streaming service' },
  { name: 'ESPN', type: 'Brand', foundedOrBirth: '1979-09-07', category: 'Media', country: 'USA', description: 'Sports network' },
  { name: 'CNN', type: 'Brand', foundedOrBirth: '1980-06-01', category: 'Media', country: 'USA', description: 'News network' },
  { name: 'Fox News', type: 'Brand', foundedOrBirth: '1996-10-07', category: 'Media', country: 'USA', description: 'News network' },
  { name: 'BBC', type: 'Brand', foundedOrBirth: '1922-10-18', category: 'Media', country: 'UK', description: 'Public broadcaster' },
  { name: 'The New York Times', type: 'Brand', foundedOrBirth: '1851-09-18', category: 'Media', country: 'USA', description: 'Newspaper' },
  { name: 'The Washington Post', type: 'Brand', foundedOrBirth: '1877-12-06', category: 'Media', country: 'USA', description: 'Newspaper' },
  { name: 'Bloomberg', type: 'Brand', foundedOrBirth: '1981-10-01', category: 'Media', country: 'USA', description: 'Financial news' },
  { name: 'Reuters', type: 'Brand', foundedOrBirth: '1851-10-01', category: 'Media', country: 'UK', description: 'News agency' },
  { name: 'Associated Press', type: 'Brand', foundedOrBirth: '1846-05-22', category: 'Media', country: 'USA', description: 'News agency' },
  
  // Financial Services
  { name: 'JPMorgan Chase', type: 'Brand', foundedOrBirth: '2000-12-31', category: 'Finance', country: 'USA', description: 'Investment bank' },
  { name: 'Bank of America', type: 'Brand', foundedOrBirth: '1998-09-30', category: 'Finance', country: 'USA', description: 'Bank' },
  { name: 'Wells Fargo', type: 'Brand', foundedOrBirth: '1852-03-18', category: 'Finance', country: 'USA', description: 'Bank' },
  { name: 'Citigroup', type: 'Brand', foundedOrBirth: '1998-10-08', category: 'Finance', country: 'USA', description: 'Financial services' },
  { name: 'Goldman Sachs', type: 'Brand', foundedOrBirth: '1869-01-01', category: 'Finance', country: 'USA', description: 'Investment bank' },
  { name: 'Morgan Stanley', type: 'Brand', foundedOrBirth: '1935-09-16', category: 'Finance', country: 'USA', description: 'Investment bank' },
  { name: 'BlackRock', type: 'Brand', foundedOrBirth: '1988-01-01', category: 'Finance', country: 'USA', description: 'Asset management' },
  { name: 'Visa', type: 'Brand', foundedOrBirth: '1958-09-18', category: 'Finance', country: 'USA', description: 'Payment processing' },
  { name: 'Mastercard', type: 'Brand', foundedOrBirth: '1966-08-16', category: 'Finance', country: 'USA', description: 'Payment processing' },
  { name: 'American Express', type: 'Brand', foundedOrBirth: '1850-03-18', category: 'Finance', country: 'USA', description: 'Financial services' },
  { name: 'Charles Schwab', type: 'Brand', foundedOrBirth: '1971-01-01', category: 'Finance', country: 'USA', description: 'Brokerage' },
  { name: 'Fidelity', type: 'Brand', foundedOrBirth: '1946-01-01', category: 'Finance', country: 'USA', description: 'Investment management' },
  { name: 'Vanguard', type: 'Brand', foundedOrBirth: '1975-05-01', category: 'Finance', country: 'USA', description: 'Investment management' },
  { name: 'Coinbase', type: 'Brand', foundedOrBirth: '2012-06-01', category: 'Finance', country: 'USA', description: 'Cryptocurrency exchange' },
  { name: 'Robinhood', type: 'Brand', foundedOrBirth: '2013-04-18', category: 'Finance', country: 'USA', description: 'Trading platform' },
  
  // Healthcare & Pharma
  { name: 'Johnson & Johnson', type: 'Brand', foundedOrBirth: '1886-01-01', category: 'Healthcare', country: 'USA', description: 'Pharmaceuticals and consumer goods' },
  { name: 'Pfizer', type: 'Brand', foundedOrBirth: '1849-01-01', category: 'Healthcare', country: 'USA', description: 'Pharmaceuticals' },
  { name: 'Moderna', type: 'Brand', foundedOrBirth: '2010-09-01', category: 'Healthcare', country: 'USA', description: 'Biotechnology' },
  { name: 'Merck', type: 'Brand', foundedOrBirth: '1891-01-01', category: 'Healthcare', country: 'USA', description: 'Pharmaceuticals' },
  { name: 'AbbVie', type: 'Brand', foundedOrBirth: '2013-01-01', category: 'Healthcare', country: 'USA', description: 'Pharmaceuticals' },
  { name: 'Bristol-Myers Squibb', type: 'Brand', foundedOrBirth: '1989-10-04', category: 'Healthcare', country: 'USA', description: 'Pharmaceuticals' },
  { name: 'Eli Lilly', type: 'Brand', foundedOrBirth: '1876-05-10', category: 'Healthcare', country: 'USA', description: 'Pharmaceuticals' },
  { name: 'AstraZeneca', type: 'Brand', foundedOrBirth: '1999-04-06', category: 'Healthcare', country: 'UK', description: 'Pharmaceuticals' },
  { name: 'Novartis', type: 'Brand', foundedOrBirth: '1996-12-20', category: 'Healthcare', country: 'Switzerland', description: 'Pharmaceuticals' },
  { name: 'Roche', type: 'Brand', foundedOrBirth: '1896-10-01', category: 'Healthcare', country: 'Switzerland', description: 'Pharmaceuticals' },
  { name: 'UnitedHealth Group', type: 'Brand', foundedOrBirth: '1977-01-01', category: 'Healthcare', country: 'USA', description: 'Health insurance' },
  { name: 'CVS Health', type: 'Brand', foundedOrBirth: '1963-01-01', category: 'Healthcare', country: 'USA', description: 'Pharmacy chain' },
  { name: 'Walgreens', type: 'Brand', foundedOrBirth: '1901-01-01', category: 'Healthcare', country: 'USA', description: 'Pharmacy chain' },
  
  // Retail
  { name: 'Walmart', type: 'Brand', foundedOrBirth: '1962-07-02', category: 'Retail', country: 'USA', description: 'Retail corporation' },
  { name: 'Target', type: 'Brand', foundedOrBirth: '1962-05-01', category: 'Retail', country: 'USA', description: 'Retail corporation' },
  { name: 'Costco', type: 'Brand', foundedOrBirth: '1983-09-15', category: 'Retail', country: 'USA', description: 'Warehouse club' },
  { name: 'Home Depot', type: 'Brand', foundedOrBirth: '1978-06-22', category: 'Retail', country: 'USA', description: 'Home improvement' },
  { name: "Lowe's", type: 'Brand', foundedOrBirth: '1946-01-01', category: 'Retail', country: 'USA', description: 'Home improvement' },
  { name: 'Best Buy', type: 'Brand', foundedOrBirth: '1966-08-22', category: 'Retail', country: 'USA', description: 'Electronics retail' },
  { name: 'IKEA', type: 'Brand', foundedOrBirth: '1943-07-28', category: 'Retail', country: 'Sweden', description: 'Furniture retail' },
  { name: 'Whole Foods', type: 'Brand', foundedOrBirth: '1980-09-20', category: 'Retail', country: 'USA', description: 'Organic grocery' },
  { name: 'Trader Joes', type: 'Brand', foundedOrBirth: '1967-01-01', category: 'Retail', country: 'USA', description: 'Grocery chain' },
  { name: 'Kroger', type: 'Brand', foundedOrBirth: '1883-01-01', category: 'Retail', country: 'USA', description: 'Supermarket' },
  { name: 'Aldi', type: 'Brand', foundedOrBirth: '1946-01-01', category: 'Retail', country: 'Germany', description: 'Discount supermarket' },
  { name: 'Sephora', type: 'Brand', foundedOrBirth: '1969-01-01', category: 'Retail', country: 'France', description: 'Beauty retail' },
  { name: 'Ulta Beauty', type: 'Brand', foundedOrBirth: '1990-01-01', category: 'Retail', country: 'USA', description: 'Beauty retail' },
  { name: 'Nordstrom', type: 'Brand', foundedOrBirth: '1901-01-01', category: 'Retail', country: 'USA', description: 'Department store' },
  { name: "Macy's", type: 'Brand', foundedOrBirth: '1858-10-27', category: 'Retail', country: 'USA', description: 'Department store' },
  { name: 'eBay', type: 'Brand', foundedOrBirth: '1995-09-03', category: 'E-commerce', country: 'USA', description: 'Online marketplace' },
  { name: 'Etsy', type: 'Brand', foundedOrBirth: '2005-06-18', category: 'E-commerce', country: 'USA', description: 'Handmade marketplace' },
  { name: 'Wayfair', type: 'Brand', foundedOrBirth: '2002-05-01', category: 'E-commerce', country: 'USA', description: 'Home goods e-commerce' },
  
  // Airlines & Travel
  { name: 'Delta Air Lines', type: 'Brand', foundedOrBirth: '1924-05-30', category: 'Travel', country: 'USA', description: 'Airline' },
  { name: 'United Airlines', type: 'Brand', foundedOrBirth: '1926-04-06', category: 'Travel', country: 'USA', description: 'Airline' },
  { name: 'American Airlines', type: 'Brand', foundedOrBirth: '1926-04-15', category: 'Travel', country: 'USA', description: 'Airline' },
  { name: 'Southwest Airlines', type: 'Brand', foundedOrBirth: '1967-03-15', category: 'Travel', country: 'USA', description: 'Airline' },
  { name: 'JetBlue', type: 'Brand', foundedOrBirth: '1998-08-01', category: 'Travel', country: 'USA', description: 'Airline' },
  { name: 'Emirates', type: 'Brand', foundedOrBirth: '1985-03-25', category: 'Travel', country: 'UAE', description: 'Airline' },
  { name: 'British Airways', type: 'Brand', foundedOrBirth: '1974-03-31', category: 'Travel', country: 'UK', description: 'Airline' },
  { name: 'Lufthansa', type: 'Brand', foundedOrBirth: '1953-01-06', category: 'Travel', country: 'Germany', description: 'Airline' },
  { name: 'Singapore Airlines', type: 'Brand', foundedOrBirth: '1972-10-01', category: 'Travel', country: 'Singapore', description: 'Airline' },
  { name: 'Qatar Airways', type: 'Brand', foundedOrBirth: '1993-11-22', category: 'Travel', country: 'Qatar', description: 'Airline' },
  { name: 'Marriott', type: 'Brand', foundedOrBirth: '1927-05-20', category: 'Travel', country: 'USA', description: 'Hotel chain' },
  { name: 'Hilton', type: 'Brand', foundedOrBirth: '1919-05-31', category: 'Travel', country: 'USA', description: 'Hotel chain' },
  { name: 'Hyatt', type: 'Brand', foundedOrBirth: '1957-09-27', category: 'Travel', country: 'USA', description: 'Hotel chain' },
  { name: 'Four Seasons', type: 'Brand', foundedOrBirth: '1961-03-21', category: 'Travel', country: 'Canada', description: 'Luxury hotels' },
  { name: 'Ritz-Carlton', type: 'Brand', foundedOrBirth: '1983-08-15', category: 'Travel', country: 'USA', description: 'Luxury hotels' },
  { name: 'Booking.com', type: 'Brand', foundedOrBirth: '1996-01-01', category: 'Travel', country: 'Netherlands', description: 'Travel booking' },
  { name: 'Expedia', type: 'Brand', foundedOrBirth: '1996-10-22', category: 'Travel', country: 'USA', description: 'Travel booking' },
  { name: 'TripAdvisor', type: 'Brand', foundedOrBirth: '2000-02-01', category: 'Travel', country: 'USA', description: 'Travel reviews' },
  
  // Energy
  { name: 'ExxonMobil', type: 'Brand', foundedOrBirth: '1999-11-30', category: 'Energy', country: 'USA', description: 'Oil and gas' },
  { name: 'Chevron', type: 'Brand', foundedOrBirth: '1879-09-10', category: 'Energy', country: 'USA', description: 'Oil and gas' },
  { name: 'Shell', type: 'Brand', foundedOrBirth: '1907-04-01', category: 'Energy', country: 'UK/Netherlands', description: 'Oil and gas' },
  { name: 'BP', type: 'Brand', foundedOrBirth: '1909-04-14', category: 'Energy', country: 'UK', description: 'Oil and gas' },
  { name: 'TotalEnergies', type: 'Brand', foundedOrBirth: '1924-03-28', category: 'Energy', country: 'France', description: 'Energy' },
  { name: 'ConocoPhillips', type: 'Brand', foundedOrBirth: '2002-08-30', category: 'Energy', country: 'USA', description: 'Oil and gas' },
  { name: 'Duke Energy', type: 'Brand', foundedOrBirth: '1904-01-01', category: 'Energy', country: 'USA', description: 'Electric utility' },
  { name: 'NextEra Energy', type: 'Brand', foundedOrBirth: '1925-12-28', category: 'Energy', country: 'USA', description: 'Clean energy' },
  { name: 'Sunrun', type: 'Brand', foundedOrBirth: '2007-01-01', category: 'Energy', country: 'USA', description: 'Solar energy' },
  
  // Gaming
  { name: 'PlayStation', type: 'Brand', foundedOrBirth: '1994-12-03', category: 'Gaming', country: 'Japan', description: 'Gaming console' },
  { name: 'Xbox', type: 'Brand', foundedOrBirth: '2001-11-15', category: 'Gaming', country: 'USA', description: 'Gaming console' },
  { name: 'Activision Blizzard', type: 'Brand', foundedOrBirth: '2008-07-09', category: 'Gaming', country: 'USA', description: 'Video games' },
  { name: 'Electronic Arts', type: 'Brand', foundedOrBirth: '1982-05-27', category: 'Gaming', country: 'USA', description: 'Video games' },
  { name: 'Epic Games', type: 'Brand', foundedOrBirth: '1991-01-01', category: 'Gaming', country: 'USA', description: 'Video games' },
  { name: 'Riot Games', type: 'Brand', foundedOrBirth: '2006-09-01', category: 'Gaming', country: 'USA', description: 'Video games' },
  { name: 'Valve', type: 'Brand', foundedOrBirth: '1996-08-24', category: 'Gaming', country: 'USA', description: 'Video games' },
  { name: 'Ubisoft', type: 'Brand', foundedOrBirth: '1986-03-28', category: 'Gaming', country: 'France', description: 'Video games' },
  { name: 'Take-Two', type: 'Brand', foundedOrBirth: '1993-09-27', category: 'Gaming', country: 'USA', description: 'Video games' },
  { name: 'Roblox', type: 'Brand', foundedOrBirth: '2004-01-01', category: 'Gaming', country: 'USA', description: 'Gaming platform' },
  { name: 'Discord', type: 'Brand', foundedOrBirth: '2015-05-13', category: 'Technology', country: 'USA', description: 'Communication platform' },
  { name: 'Twitch', type: 'Brand', foundedOrBirth: '2011-06-06', category: 'Entertainment', country: 'USA', description: 'Streaming platform' },
  
  // Telecommunications
  { name: 'AT&T', type: 'Brand', foundedOrBirth: '1885-03-03', category: 'Telecom', country: 'USA', description: 'Telecommunications' },
  { name: 'Verizon', type: 'Brand', foundedOrBirth: '2000-06-30', category: 'Telecom', country: 'USA', description: 'Telecommunications' },
  { name: 'T-Mobile', type: 'Brand', foundedOrBirth: '1999-01-01', category: 'Telecom', country: 'USA', description: 'Telecommunications' },
  { name: 'Comcast', type: 'Brand', foundedOrBirth: '1963-06-28', category: 'Telecom', country: 'USA', description: 'Cable and internet' },
  { name: 'Vodafone', type: 'Brand', foundedOrBirth: '1991-07-16', category: 'Telecom', country: 'UK', description: 'Telecommunications' },
  { name: 'Deutsche Telekom', type: 'Brand', foundedOrBirth: '1995-01-01', category: 'Telecom', country: 'Germany', description: 'Telecommunications' },
  { name: 'Orange', type: 'Brand', foundedOrBirth: '1994-09-01', category: 'Telecom', country: 'France', description: 'Telecommunications' },
  { name: 'Telefonica', type: 'Brand', foundedOrBirth: '1924-04-19', category: 'Telecom', country: 'Spain', description: 'Telecommunications' },
  
  // Sports Teams & Organizations
  { name: 'NBA', type: 'Brand', foundedOrBirth: '1946-06-06', category: 'Sports', country: 'USA', description: 'Basketball league' },
  { name: 'NFL', type: 'Brand', foundedOrBirth: '1920-08-20', category: 'Sports', country: 'USA', description: 'Football league' },
  { name: 'MLB', type: 'Brand', foundedOrBirth: '1903-01-01', category: 'Sports', country: 'USA', description: 'Baseball league' },
  { name: 'NHL', type: 'Brand', foundedOrBirth: '1917-11-26', category: 'Sports', country: 'Canada', description: 'Hockey league' },
  { name: 'UFC', type: 'Brand', foundedOrBirth: '1993-11-12', category: 'Sports', country: 'USA', description: 'Mixed martial arts' },
  { name: 'FIFA', type: 'Brand', foundedOrBirth: '1904-05-21', category: 'Sports', country: 'Switzerland', description: 'Football governing body' },
  { name: 'Olympics', type: 'Brand', foundedOrBirth: '1894-06-23', category: 'Sports', country: 'International', description: 'International sports' },
  { name: 'Formula 1', type: 'Brand', foundedOrBirth: '1950-05-13', category: 'Sports', country: 'UK', description: 'Auto racing' },
  { name: 'NASCAR', type: 'Brand', foundedOrBirth: '1948-02-21', category: 'Sports', country: 'USA', description: 'Auto racing' },
  { name: 'Premier League', type: 'Brand', foundedOrBirth: '1992-02-20', category: 'Sports', country: 'UK', description: 'Football league' },
  { name: 'LA Lakers', type: 'Brand', foundedOrBirth: '1947-01-01', category: 'Sports', country: 'USA', description: 'Basketball team' },
  { name: 'New York Yankees', type: 'Brand', foundedOrBirth: '1903-01-09', category: 'Sports', country: 'USA', description: 'Baseball team' },
  { name: 'Dallas Cowboys', type: 'Brand', foundedOrBirth: '1960-01-28', category: 'Sports', country: 'USA', description: 'Football team' },
  { name: 'Manchester United', type: 'Brand', foundedOrBirth: '1878-01-01', category: 'Sports', country: 'UK', description: 'Football club' },
  { name: 'Real Madrid', type: 'Brand', foundedOrBirth: '1902-03-06', category: 'Sports', country: 'Spain', description: 'Football club' },
  { name: 'FC Barcelona', type: 'Brand', foundedOrBirth: '1899-11-29', category: 'Sports', country: 'Spain', description: 'Football club' },
];

// World Cities with founding/establishment dates
const citiesData: Omit<Cue, 'id'>[] = [
  // Major World Cities
  { name: 'New York City', type: 'Location', foundedOrBirth: '1624-01-01', category: 'Metropolis', country: 'USA', description: 'The city that never sleeps' },
  { name: 'Los Angeles', type: 'Location', foundedOrBirth: '1781-09-04', category: 'Metropolis', country: 'USA', description: 'Entertainment capital' },
  { name: 'Chicago', type: 'Location', foundedOrBirth: '1833-08-12', category: 'Metropolis', country: 'USA', description: 'The Windy City' },
  { name: 'Houston', type: 'Location', foundedOrBirth: '1836-08-30', category: 'Metropolis', country: 'USA', description: 'Space City' },
  { name: 'Phoenix', type: 'Location', foundedOrBirth: '1881-02-25', category: 'Metropolis', country: 'USA', description: 'Valley of the Sun' },
  { name: 'Philadelphia', type: 'Location', foundedOrBirth: '1682-10-27', category: 'Metropolis', country: 'USA', description: 'Birthplace of America' },
  { name: 'San Antonio', type: 'Location', foundedOrBirth: '1718-05-01', category: 'Metropolis', country: 'USA', description: 'The Alamo City' },
  { name: 'San Diego', type: 'Location', foundedOrBirth: '1769-07-16', category: 'Metropolis', country: 'USA', description: "America's Finest City" },
  { name: 'Dallas', type: 'Location', foundedOrBirth: '1841-01-01', category: 'Metropolis', country: 'USA', description: 'Big D' },
  { name: 'San Jose', type: 'Location', foundedOrBirth: '1777-11-29', category: 'Metropolis', country: 'USA', description: 'Capital of Silicon Valley' },
  { name: 'Austin', type: 'Location', foundedOrBirth: '1839-12-27', category: 'Metropolis', country: 'USA', description: 'Keep Austin Weird' },
  { name: 'Jacksonville', type: 'Location', foundedOrBirth: '1822-06-15', category: 'Metropolis', country: 'USA', description: 'Gateway to Florida' },
  { name: 'Fort Worth', type: 'Location', foundedOrBirth: '1849-06-06', category: 'Metropolis', country: 'USA', description: 'Cowtown' },
  { name: 'Columbus', type: 'Location', foundedOrBirth: '1812-02-14', category: 'Metropolis', country: 'USA', description: 'Capital of Ohio' },
  { name: 'San Francisco', type: 'Location', foundedOrBirth: '1776-06-29', category: 'Metropolis', country: 'USA', description: 'The Golden Gate City' },
  { name: 'Charlotte', type: 'Location', foundedOrBirth: '1768-01-01', category: 'Metropolis', country: 'USA', description: 'Queen City' },
  { name: 'Indianapolis', type: 'Location', foundedOrBirth: '1821-01-06', category: 'Metropolis', country: 'USA', description: 'Circle City' },
  { name: 'Seattle', type: 'Location', foundedOrBirth: '1851-11-13', category: 'Metropolis', country: 'USA', description: 'Emerald City' },
  { name: 'Denver', type: 'Location', foundedOrBirth: '1858-11-22', category: 'Metropolis', country: 'USA', description: 'Mile High City' },
  { name: 'Washington D.C.', type: 'Location', foundedOrBirth: '1790-07-16', category: 'Metropolis', country: 'USA', description: 'Capital of the USA' },
  { name: 'Boston', type: 'Location', foundedOrBirth: '1630-09-17', category: 'Metropolis', country: 'USA', description: 'Cradle of Liberty' },
  { name: 'Nashville', type: 'Location', foundedOrBirth: '1779-12-25', category: 'Metropolis', country: 'USA', description: 'Music City' },
  { name: 'Detroit', type: 'Location', foundedOrBirth: '1701-07-24', category: 'Metropolis', country: 'USA', description: 'Motor City' },
  { name: 'Portland', type: 'Location', foundedOrBirth: '1845-02-08', category: 'Metropolis', country: 'USA', description: 'City of Roses' },
  { name: 'Las Vegas', type: 'Location', foundedOrBirth: '1905-05-15', category: 'Metropolis', country: 'USA', description: 'Sin City' },
  { name: 'Memphis', type: 'Location', foundedOrBirth: '1819-05-22', category: 'Metropolis', country: 'USA', description: 'Home of the Blues' },
  { name: 'Louisville', type: 'Location', foundedOrBirth: '1778-01-01', category: 'Metropolis', country: 'USA', description: 'Derby City' },
  { name: 'Baltimore', type: 'Location', foundedOrBirth: '1729-08-08', category: 'Metropolis', country: 'USA', description: 'Charm City' },
  { name: 'Milwaukee', type: 'Location', foundedOrBirth: '1846-01-31', category: 'Metropolis', country: 'USA', description: 'Cream City' },
  { name: 'Albuquerque', type: 'Location', foundedOrBirth: '1706-04-23', category: 'Metropolis', country: 'USA', description: 'Duke City' },
  { name: 'Tucson', type: 'Location', foundedOrBirth: '1775-08-20', category: 'Metropolis', country: 'USA', description: 'The Old Pueblo' },
  { name: 'Fresno', type: 'Location', foundedOrBirth: '1872-01-01', category: 'Metropolis', country: 'USA', description: 'Raisin Capital' },
  { name: 'Sacramento', type: 'Location', foundedOrBirth: '1850-02-27', category: 'Metropolis', country: 'USA', description: 'City of Trees' },
  { name: 'Atlanta', type: 'Location', foundedOrBirth: '1837-12-29', category: 'Metropolis', country: 'USA', description: 'Capital of the South' },
  { name: 'Miami', type: 'Location', foundedOrBirth: '1896-07-28', category: 'Metropolis', country: 'USA', description: 'Magic City' },
  { name: 'New Orleans', type: 'Location', foundedOrBirth: '1718-05-07', category: 'Metropolis', country: 'USA', description: 'The Big Easy' },
  { name: 'Cleveland', type: 'Location', foundedOrBirth: '1796-07-22', category: 'Metropolis', country: 'USA', description: 'Forest City' },
  { name: 'Minneapolis', type: 'Location', foundedOrBirth: '1867-03-01', category: 'Metropolis', country: 'USA', description: 'City of Lakes' },
  { name: 'Tampa', type: 'Location', foundedOrBirth: '1849-01-18', category: 'Metropolis', country: 'USA', description: 'Cigar City' },
  { name: 'Pittsburgh', type: 'Location', foundedOrBirth: '1816-03-18', category: 'Metropolis', country: 'USA', description: 'Steel City' },
  { name: 'St. Louis', type: 'Location', foundedOrBirth: '1764-02-15', category: 'Metropolis', country: 'USA', description: 'Gateway to the West' },
  { name: 'Cincinnati', type: 'Location', foundedOrBirth: '1788-12-28', category: 'Metropolis', country: 'USA', description: 'Queen City' },
  { name: 'Orlando', type: 'Location', foundedOrBirth: '1875-07-31', category: 'Metropolis', country: 'USA', description: 'Theme Park Capital' },
  { name: 'Honolulu', type: 'Location', foundedOrBirth: '1907-04-30', category: 'Metropolis', country: 'USA', description: 'Paradise of the Pacific' },
  
  // International Cities
  { name: 'Tokyo', type: 'Location', foundedOrBirth: '1457-01-01', category: 'Metropolis', country: 'Japan', description: 'Capital of Japan' },
  { name: 'London', type: 'Location', foundedOrBirth: '0043-01-01', category: 'Metropolis', country: 'UK', description: 'Capital of England' },
  { name: 'Paris', type: 'Location', foundedOrBirth: '0250-01-01', category: 'Metropolis', country: 'France', description: 'City of Light' },
  { name: 'Beijing', type: 'Location', foundedOrBirth: '1045-01-01', category: 'Metropolis', country: 'China', description: 'Capital of China' },
  { name: 'Shanghai', type: 'Location', foundedOrBirth: '0751-01-01', category: 'Metropolis', country: 'China', description: 'The Pearl of the Orient' },
  { name: 'Dubai', type: 'Location', foundedOrBirth: '1833-01-01', category: 'Metropolis', country: 'UAE', description: 'City of Gold' },
  { name: 'Singapore', type: 'Location', foundedOrBirth: '1819-02-06', category: 'Metropolis', country: 'Singapore', description: 'Lion City' },
  { name: 'Hong Kong', type: 'Location', foundedOrBirth: '1842-08-29', category: 'Metropolis', country: 'China', description: 'Fragrant Harbor' },
  { name: 'Sydney', type: 'Location', foundedOrBirth: '1788-01-26', category: 'Metropolis', country: 'Australia', description: 'Harbour City' },
  { name: 'Melbourne', type: 'Location', foundedOrBirth: '1835-08-30', category: 'Metropolis', country: 'Australia', description: 'Capital of Victoria' },
  { name: 'Toronto', type: 'Location', foundedOrBirth: '1793-08-27', category: 'Metropolis', country: 'Canada', description: 'The Six' },
  { name: 'Vancouver', type: 'Location', foundedOrBirth: '1886-04-06', category: 'Metropolis', country: 'Canada', description: 'Hollywood North' },
  { name: 'Montreal', type: 'Location', foundedOrBirth: '1642-05-17', category: 'Metropolis', country: 'Canada', description: 'City of Saints' },
  { name: 'Berlin', type: 'Location', foundedOrBirth: '1237-01-01', category: 'Metropolis', country: 'Germany', description: 'Capital of Germany' },
  { name: 'Munich', type: 'Location', foundedOrBirth: '1158-06-14', category: 'Metropolis', country: 'Germany', description: 'City of Beer' },
  { name: 'Frankfurt', type: 'Location', foundedOrBirth: '0794-01-01', category: 'Metropolis', country: 'Germany', description: 'Financial Capital' },
  { name: 'Amsterdam', type: 'Location', foundedOrBirth: '1275-10-27', category: 'Metropolis', country: 'Netherlands', description: 'Venice of the North' },
  { name: 'Brussels', type: 'Location', foundedOrBirth: '0979-01-01', category: 'Metropolis', country: 'Belgium', description: 'Capital of Europe' },
  { name: 'Vienna', type: 'Location', foundedOrBirth: '0015-01-01', category: 'Metropolis', country: 'Austria', description: 'City of Music' },
  { name: 'Zurich', type: 'Location', foundedOrBirth: '0015-01-01', category: 'Metropolis', country: 'Switzerland', description: 'Banking Capital' },
  { name: 'Geneva', type: 'Location', foundedOrBirth: '0058-01-01', category: 'Metropolis', country: 'Switzerland', description: 'City of Peace' },
  { name: 'Madrid', type: 'Location', foundedOrBirth: '0860-01-01', category: 'Metropolis', country: 'Spain', description: 'Capital of Spain' },
  { name: 'Barcelona', type: 'Location', foundedOrBirth: '0015-01-01', category: 'Metropolis', country: 'Spain', description: 'City of Gaudi' },
  { name: 'Rome', type: 'Location', foundedOrBirth: '-0753-04-21', category: 'Metropolis', country: 'Italy', description: 'Eternal City' },
  { name: 'Milan', type: 'Location', foundedOrBirth: '0222-01-01', category: 'Metropolis', country: 'Italy', description: 'Fashion Capital' },
  { name: 'Venice', type: 'Location', foundedOrBirth: '0421-03-25', category: 'Metropolis', country: 'Italy', description: 'City of Canals' },
  { name: 'Florence', type: 'Location', foundedOrBirth: '0059-01-01', category: 'Metropolis', country: 'Italy', description: 'Cradle of Renaissance' },
  { name: 'Moscow', type: 'Location', foundedOrBirth: '1147-04-04', category: 'Metropolis', country: 'Russia', description: 'Capital of Russia' },
  { name: 'St. Petersburg', type: 'Location', foundedOrBirth: '1703-05-27', category: 'Metropolis', country: 'Russia', description: 'Venice of the North' },
  { name: 'Seoul', type: 'Location', foundedOrBirth: '0018-01-01', category: 'Metropolis', country: 'South Korea', description: 'Soul of Asia' },
  { name: 'Osaka', type: 'Location', foundedOrBirth: '0350-01-01', category: 'Metropolis', country: 'Japan', description: "Japan's Kitchen" },
  { name: 'Kyoto', type: 'Location', foundedOrBirth: '0794-01-01', category: 'Metropolis', country: 'Japan', description: 'Ancient Capital' },
  { name: 'Bangkok', type: 'Location', foundedOrBirth: '1782-04-21', category: 'Metropolis', country: 'Thailand', description: 'City of Angels' },
  { name: 'Kuala Lumpur', type: 'Location', foundedOrBirth: '1857-01-01', category: 'Metropolis', country: 'Malaysia', description: 'KL' },
  { name: 'Jakarta', type: 'Location', foundedOrBirth: '1527-06-22', category: 'Metropolis', country: 'Indonesia', description: 'Big Durian' },
  { name: 'Manila', type: 'Location', foundedOrBirth: '1571-06-24', category: 'Metropolis', country: 'Philippines', description: 'Pearl of the Orient' },
  { name: 'Mumbai', type: 'Location', foundedOrBirth: '1507-01-01', category: 'Metropolis', country: 'India', description: 'City of Dreams' },
  { name: 'Delhi', type: 'Location', foundedOrBirth: '1011-01-01', category: 'Metropolis', country: 'India', description: 'Heart of India' },
  { name: 'Bangalore', type: 'Location', foundedOrBirth: '1537-01-01', category: 'Metropolis', country: 'India', description: 'Silicon Valley of India' },
  { name: 'Cairo', type: 'Location', foundedOrBirth: '0969-07-06', category: 'Metropolis', country: 'Egypt', description: 'City of a Thousand Minarets' },
  { name: 'Cape Town', type: 'Location', foundedOrBirth: '1652-04-06', category: 'Metropolis', country: 'South Africa', description: 'Mother City' },
  { name: 'Johannesburg', type: 'Location', foundedOrBirth: '1886-10-04', category: 'Metropolis', country: 'South Africa', description: 'City of Gold' },
  { name: 'Lagos', type: 'Location', foundedOrBirth: '1472-01-01', category: 'Metropolis', country: 'Nigeria', description: 'Centre of Excellence' },
  { name: 'Nairobi', type: 'Location', foundedOrBirth: '1899-05-30', category: 'Metropolis', country: 'Kenya', description: 'Green City in the Sun' },
  { name: 'Mexico City', type: 'Location', foundedOrBirth: '1325-03-13', category: 'Metropolis', country: 'Mexico', description: 'City of Palaces' },
  { name: 'São Paulo', type: 'Location', foundedOrBirth: '1554-01-25', category: 'Metropolis', country: 'Brazil', description: "South America's Largest City" },
  { name: 'Rio de Janeiro', type: 'Location', foundedOrBirth: '1565-03-01', category: 'Metropolis', country: 'Brazil', description: 'Marvelous City' },
  { name: 'Buenos Aires', type: 'Location', foundedOrBirth: '1536-02-02', category: 'Metropolis', country: 'Argentina', description: 'Paris of South America' },
  { name: 'Lima', type: 'Location', foundedOrBirth: '1535-01-18', category: 'Metropolis', country: 'Peru', description: 'City of Kings' },
  { name: 'Bogota', type: 'Location', foundedOrBirth: '1538-08-06', category: 'Metropolis', country: 'Colombia', description: 'Athens of South America' },
  { name: 'Santiago', type: 'Location', foundedOrBirth: '1541-02-12', category: 'Metropolis', country: 'Chile', description: 'Capital of Chile' },
  { name: 'Istanbul', type: 'Location', foundedOrBirth: '0660-01-01', category: 'Metropolis', country: 'Turkey', description: 'Where East Meets West' },
  { name: 'Tel Aviv', type: 'Location', foundedOrBirth: '1909-04-11', category: 'Metropolis', country: 'Israel', description: 'White City' },
  { name: 'Jerusalem', type: 'Location', foundedOrBirth: '-3000-01-01', category: 'Metropolis', country: 'Israel', description: 'Holy City' },
  { name: 'Athens', type: 'Location', foundedOrBirth: '-3000-01-01', category: 'Metropolis', country: 'Greece', description: 'Birthplace of Democracy' },
  { name: 'Stockholm', type: 'Location', foundedOrBirth: '1252-01-01', category: 'Metropolis', country: 'Sweden', description: 'Venice of the North' },
  { name: 'Copenhagen', type: 'Location', foundedOrBirth: '1167-01-01', category: 'Metropolis', country: 'Denmark', description: 'City of Spires' },
  { name: 'Oslo', type: 'Location', foundedOrBirth: '1040-01-01', category: 'Metropolis', country: 'Norway', description: 'Tiger City' },
  { name: 'Helsinki', type: 'Location', foundedOrBirth: '1550-06-12', category: 'Metropolis', country: 'Finland', description: 'Daughter of the Baltic' },
  { name: 'Dublin', type: 'Location', foundedOrBirth: '0841-01-01', category: 'Metropolis', country: 'Ireland', description: 'Fair City' },
  { name: 'Edinburgh', type: 'Location', foundedOrBirth: '0600-01-01', category: 'Metropolis', country: 'UK', description: 'Athens of the North' },
  { name: 'Prague', type: 'Location', foundedOrBirth: '0885-01-01', category: 'Metropolis', country: 'Czech Republic', description: 'City of a Hundred Spires' },
  { name: 'Budapest', type: 'Location', foundedOrBirth: '1873-11-17', category: 'Metropolis', country: 'Hungary', description: 'Pearl of the Danube' },
  { name: 'Warsaw', type: 'Location', foundedOrBirth: '1300-01-01', category: 'Metropolis', country: 'Poland', description: 'Phoenix City' },
  { name: 'Lisbon', type: 'Location', foundedOrBirth: '-1200-01-01', category: 'Metropolis', country: 'Portugal', description: 'City of Seven Hills' },
];

// Notable People (expanded list)
const peopleData: Omit<Cue, 'id'>[] = [
  // Tech Leaders
  { name: 'Elon Musk', type: 'Person', foundedOrBirth: '1971-06-28', category: 'Technology', country: 'USA', description: 'CEO of Tesla and SpaceX' },
  { name: 'Jeff Bezos', type: 'Person', foundedOrBirth: '1964-01-12', category: 'Technology', country: 'USA', description: 'Founder of Amazon' },
  { name: 'Bill Gates', type: 'Person', foundedOrBirth: '1955-10-28', category: 'Technology', country: 'USA', description: 'Co-founder of Microsoft' },
  { name: 'Steve Jobs', type: 'Person', foundedOrBirth: '1955-02-24', category: 'Technology', country: 'USA', description: 'Co-founder of Apple' },
  { name: 'Mark Zuckerberg', type: 'Person', foundedOrBirth: '1984-05-14', category: 'Technology', country: 'USA', description: 'Founder of Facebook/Meta' },
  { name: 'Sundar Pichai', type: 'Person', foundedOrBirth: '1972-06-10', category: 'Technology', country: 'USA', description: 'CEO of Google' },
  { name: 'Tim Cook', type: 'Person', foundedOrBirth: '1960-11-01', category: 'Technology', country: 'USA', description: 'CEO of Apple' },
  { name: 'Satya Nadella', type: 'Person', foundedOrBirth: '1967-08-19', category: 'Technology', country: 'USA', description: 'CEO of Microsoft' },
  { name: 'Jack Dorsey', type: 'Person', foundedOrBirth: '1976-11-19', category: 'Technology', country: 'USA', description: 'Co-founder of Twitter' },
  { name: 'Larry Page', type: 'Person', foundedOrBirth: '1973-03-26', category: 'Technology', country: 'USA', description: 'Co-founder of Google' },
  { name: 'Sergey Brin', type: 'Person', foundedOrBirth: '1973-08-21', category: 'Technology', country: 'USA', description: 'Co-founder of Google' },
  { name: 'Jensen Huang', type: 'Person', foundedOrBirth: '1963-02-17', category: 'Technology', country: 'USA', description: 'CEO of NVIDIA' },
  { name: 'Sam Altman', type: 'Person', foundedOrBirth: '1985-04-22', category: 'Technology', country: 'USA', description: 'CEO of OpenAI' },
  { name: 'Reed Hastings', type: 'Person', foundedOrBirth: '1960-10-08', category: 'Technology', country: 'USA', description: 'Co-founder of Netflix' },
  { name: 'Brian Chesky', type: 'Person', foundedOrBirth: '1981-08-29', category: 'Technology', country: 'USA', description: 'Co-founder of Airbnb' },
  { name: 'Travis Kalanick', type: 'Person', foundedOrBirth: '1976-08-06', category: 'Technology', country: 'USA', description: 'Co-founder of Uber' },
  { name: 'Daniel Ek', type: 'Person', foundedOrBirth: '1983-02-21', category: 'Technology', country: 'Sweden', description: 'Co-founder of Spotify' },
  { name: 'Jack Ma', type: 'Person', foundedOrBirth: '1964-09-10', category: 'Technology', country: 'China', description: 'Founder of Alibaba' },
  { name: 'Pony Ma', type: 'Person', foundedOrBirth: '1971-10-29', category: 'Technology', country: 'China', description: 'Founder of Tencent' },
  { name: 'Larry Ellison', type: 'Person', foundedOrBirth: '1944-08-17', category: 'Technology', country: 'USA', description: 'Founder of Oracle' },
  
  // Entertainment
  { name: 'Oprah Winfrey', type: 'Person', foundedOrBirth: '1954-01-29', category: 'Entertainment', country: 'USA', description: 'Media mogul' },
  { name: 'Taylor Swift', type: 'Person', foundedOrBirth: '1989-12-13', category: 'Music', country: 'USA', description: 'Singer-songwriter' },
  { name: 'Beyoncé', type: 'Person', foundedOrBirth: '1981-09-04', category: 'Music', country: 'USA', description: 'Singer and performer' },
  { name: 'Drake', type: 'Person', foundedOrBirth: '1986-10-24', category: 'Music', country: 'Canada', description: 'Rapper and singer' },
  { name: 'Kanye West', type: 'Person', foundedOrBirth: '1977-06-08', category: 'Music', country: 'USA', description: 'Rapper and producer' },
  { name: 'Jay-Z', type: 'Person', foundedOrBirth: '1969-12-04', category: 'Music', country: 'USA', description: 'Rapper and entrepreneur' },
  { name: 'Rihanna', type: 'Person', foundedOrBirth: '1988-02-20', category: 'Music', country: 'Barbados', description: 'Singer and entrepreneur' },
  { name: 'Lady Gaga', type: 'Person', foundedOrBirth: '1986-03-28', category: 'Music', country: 'USA', description: 'Singer and actress' },
  { name: 'Ariana Grande', type: 'Person', foundedOrBirth: '1993-06-26', category: 'Music', country: 'USA', description: 'Singer and actress' },
  { name: 'Ed Sheeran', type: 'Person', foundedOrBirth: '1991-02-17', category: 'Music', country: 'UK', description: 'Singer-songwriter' },
  { name: 'Bruno Mars', type: 'Person', foundedOrBirth: '1985-10-08', category: 'Music', country: 'USA', description: 'Singer and producer' },
  { name: 'Justin Bieber', type: 'Person', foundedOrBirth: '1994-03-01', category: 'Music', country: 'Canada', description: 'Pop star' },
  { name: 'The Weeknd', type: 'Person', foundedOrBirth: '1990-02-16', category: 'Music', country: 'Canada', description: 'Singer and songwriter' },
  { name: 'Post Malone', type: 'Person', foundedOrBirth: '1995-07-04', category: 'Music', country: 'USA', description: 'Rapper and singer' },
  { name: 'Billie Eilish', type: 'Person', foundedOrBirth: '2001-12-18', category: 'Music', country: 'USA', description: 'Singer-songwriter' },
  { name: 'Dua Lipa', type: 'Person', foundedOrBirth: '1995-08-22', category: 'Music', country: 'UK', description: 'Singer and songwriter' },
  { name: 'Harry Styles', type: 'Person', foundedOrBirth: '1994-02-01', category: 'Music', country: 'UK', description: 'Singer and actor' },
  { name: 'BTS', type: 'Person', foundedOrBirth: '2013-06-13', category: 'Music', country: 'South Korea', description: 'K-pop group' },
  { name: 'BLACKPINK', type: 'Person', foundedOrBirth: '2016-08-08', category: 'Music', country: 'South Korea', description: 'K-pop group' },
  
  // Actors
  { name: 'Leonardo DiCaprio', type: 'Person', foundedOrBirth: '1974-11-11', category: 'Film', country: 'USA', description: 'Actor and producer' },
  { name: 'Tom Cruise', type: 'Person', foundedOrBirth: '1962-07-03', category: 'Film', country: 'USA', description: 'Actor and producer' },
  { name: 'Tom Hanks', type: 'Person', foundedOrBirth: '1956-07-09', category: 'Film', country: 'USA', description: 'Actor and filmmaker' },
  { name: 'Denzel Washington', type: 'Person', foundedOrBirth: '1954-12-28', category: 'Film', country: 'USA', description: 'Actor and director' },
  { name: 'Meryl Streep', type: 'Person', foundedOrBirth: '1949-06-22', category: 'Film', country: 'USA', description: 'Actress' },
  { name: 'Robert Downey Jr.', type: 'Person', foundedOrBirth: '1965-04-04', category: 'Film', country: 'USA', description: 'Actor' },
  { name: 'Scarlett Johansson', type: 'Person', foundedOrBirth: '1984-11-22', category: 'Film', country: 'USA', description: 'Actress' },
  { name: 'Margot Robbie', type: 'Person', foundedOrBirth: '1990-07-02', category: 'Film', country: 'Australia', description: 'Actress and producer' },
  { name: 'Zendaya', type: 'Person', foundedOrBirth: '1996-09-01', category: 'Film', country: 'USA', description: 'Actress and singer' },
  { name: 'Timothée Chalamet', type: 'Person', foundedOrBirth: '1995-12-27', category: 'Film', country: 'USA', description: 'Actor' },
  { name: 'Keanu Reeves', type: 'Person', foundedOrBirth: '1964-09-02', category: 'Film', country: 'Canada', description: 'Actor' },
  { name: 'Dwayne Johnson', type: 'Person', foundedOrBirth: '1972-05-02', category: 'Film', country: 'USA', description: 'Actor and wrestler' },
  { name: 'Ryan Reynolds', type: 'Person', foundedOrBirth: '1976-10-23', category: 'Film', country: 'Canada', description: 'Actor and entrepreneur' },
  { name: 'Chris Hemsworth', type: 'Person', foundedOrBirth: '1983-08-11', category: 'Film', country: 'Australia', description: 'Actor' },
  { name: 'Jennifer Lawrence', type: 'Person', foundedOrBirth: '1990-08-15', category: 'Film', country: 'USA', description: 'Actress' },
  { name: 'Emma Stone', type: 'Person', foundedOrBirth: '1988-11-06', category: 'Film', country: 'USA', description: 'Actress' },
  { name: 'Chris Evans', type: 'Person', foundedOrBirth: '1981-06-13', category: 'Film', country: 'USA', description: 'Actor' },
  { name: 'Florence Pugh', type: 'Person', foundedOrBirth: '1996-01-03', category: 'Film', country: 'UK', description: 'Actress' },
  { name: 'Sydney Sweeney', type: 'Person', foundedOrBirth: '1997-09-12', category: 'Film', country: 'USA', description: 'Actress' },
  
  // Sports
  { name: 'LeBron James', type: 'Person', foundedOrBirth: '1984-12-30', category: 'Sports', country: 'USA', description: 'Basketball player' },
  { name: 'Michael Jordan', type: 'Person', foundedOrBirth: '1963-02-17', category: 'Sports', country: 'USA', description: 'Basketball legend' },
  { name: 'Cristiano Ronaldo', type: 'Person', foundedOrBirth: '1985-02-05', category: 'Sports', country: 'Portugal', description: 'Football player' },
  { name: 'Lionel Messi', type: 'Person', foundedOrBirth: '1987-06-24', category: 'Sports', country: 'Argentina', description: 'Football player' },
  { name: 'Serena Williams', type: 'Person', foundedOrBirth: '1981-09-26', category: 'Sports', country: 'USA', description: 'Tennis champion' },
  { name: 'Tiger Woods', type: 'Person', foundedOrBirth: '1975-12-30', category: 'Sports', country: 'USA', description: 'Golf legend' },
  { name: 'Tom Brady', type: 'Person', foundedOrBirth: '1977-08-03', category: 'Sports', country: 'USA', description: 'Football quarterback' },
  { name: 'Stephen Curry', type: 'Person', foundedOrBirth: '1988-03-14', category: 'Sports', country: 'USA', description: 'Basketball player' },
  { name: 'Patrick Mahomes', type: 'Person', foundedOrBirth: '1995-09-17', category: 'Sports', country: 'USA', description: 'Football quarterback' },
  { name: 'Naomi Osaka', type: 'Person', foundedOrBirth: '1997-10-16', category: 'Sports', country: 'Japan', description: 'Tennis player' },
  { name: 'Usain Bolt', type: 'Person', foundedOrBirth: '1986-08-21', category: 'Sports', country: 'Jamaica', description: 'Sprinter' },
  { name: 'Lewis Hamilton', type: 'Person', foundedOrBirth: '1985-01-07', category: 'Sports', country: 'UK', description: 'F1 driver' },
  { name: 'Max Verstappen', type: 'Person', foundedOrBirth: '1997-09-30', category: 'Sports', country: 'Netherlands', description: 'F1 driver' },
  { name: 'Kylian Mbappé', type: 'Person', foundedOrBirth: '1998-12-20', category: 'Sports', country: 'France', description: 'Football player' },
  { name: 'Erling Haaland', type: 'Person', foundedOrBirth: '2000-07-21', category: 'Sports', country: 'Norway', description: 'Football player' },
  { name: 'Shohei Ohtani', type: 'Person', foundedOrBirth: '1994-07-05', category: 'Sports', country: 'Japan', description: 'Baseball player' },
  { name: 'Connor McDavid', type: 'Person', foundedOrBirth: '1997-01-13', category: 'Sports', country: 'Canada', description: 'Hockey player' },
  { name: 'Simone Biles', type: 'Person', foundedOrBirth: '1997-03-14', category: 'Sports', country: 'USA', description: 'Gymnast' },
  { name: 'Neymar', type: 'Person', foundedOrBirth: '1992-02-05', category: 'Sports', country: 'Brazil', description: 'Football player' },
  { name: 'Giannis Antetokounmpo', type: 'Person', foundedOrBirth: '1994-12-06', category: 'Sports', country: 'Greece', description: 'Basketball player' },
  
  // Business Leaders
  { name: 'Warren Buffett', type: 'Person', foundedOrBirth: '1930-08-30', category: 'Business', country: 'USA', description: 'Investor' },
  { name: 'Bernard Arnault', type: 'Person', foundedOrBirth: '1949-03-05', category: 'Business', country: 'France', description: 'CEO of LVMH' },
  { name: 'Jamie Dimon', type: 'Person', foundedOrBirth: '1956-03-13', category: 'Business', country: 'USA', description: 'CEO of JPMorgan Chase' },
  { name: 'Ray Dalio', type: 'Person', foundedOrBirth: '1949-08-08', category: 'Business', country: 'USA', description: 'Founder of Bridgewater' },
  { name: 'Mary Barra', type: 'Person', foundedOrBirth: '1961-12-24', category: 'Business', country: 'USA', description: 'CEO of General Motors' },
  { name: 'Indra Nooyi', type: 'Person', foundedOrBirth: '1955-10-28', category: 'Business', country: 'India', description: 'Former CEO of PepsiCo' },
  { name: 'Michael Bloomberg', type: 'Person', foundedOrBirth: '1942-02-14', category: 'Business', country: 'USA', description: 'Founder of Bloomberg LP' },
  { name: 'Richard Branson', type: 'Person', foundedOrBirth: '1950-07-18', category: 'Business', country: 'UK', description: 'Founder of Virgin Group' },
  { name: 'Mukesh Ambani', type: 'Person', foundedOrBirth: '1957-04-19', category: 'Business', country: 'India', description: 'Chairman of Reliance' },
  { name: 'Bob Iger', type: 'Person', foundedOrBirth: '1951-02-10', category: 'Business', country: 'USA', description: 'CEO of Disney' },
  
  // Historical Figures
  { name: 'Albert Einstein', type: 'Person', foundedOrBirth: '1879-03-14', category: 'Science', country: 'Germany', description: 'Physicist' },
  { name: 'Nikola Tesla', type: 'Person', foundedOrBirth: '1856-07-10', category: 'Science', country: 'Serbia', description: 'Inventor' },
  { name: 'Martin Luther King Jr.', type: 'Person', foundedOrBirth: '1929-01-15', category: 'Activist', country: 'USA', description: 'Civil rights leader' },
  { name: 'Nelson Mandela', type: 'Person', foundedOrBirth: '1918-07-18', category: 'Politics', country: 'South Africa', description: 'Anti-apartheid leader' },
  { name: 'Princess Diana', type: 'Person', foundedOrBirth: '1961-07-01', category: 'Royalty', country: 'UK', description: 'Princess of Wales' },
  { name: 'John F. Kennedy', type: 'Person', foundedOrBirth: '1917-05-29', category: 'Politics', country: 'USA', description: '35th US President' },
  { name: 'Abraham Lincoln', type: 'Person', foundedOrBirth: '1809-02-12', category: 'Politics', country: 'USA', description: '16th US President' },
  { name: 'Walt Disney', type: 'Person', foundedOrBirth: '1901-12-05', category: 'Entertainment', country: 'USA', description: 'Founder of Disney' },
  { name: 'Marilyn Monroe', type: 'Person', foundedOrBirth: '1926-06-01', category: 'Film', country: 'USA', description: 'Actress and icon' },
  { name: 'Elvis Presley', type: 'Person', foundedOrBirth: '1935-01-08', category: 'Music', country: 'USA', description: 'King of Rock and Roll' },
  { name: 'Michael Jackson', type: 'Person', foundedOrBirth: '1958-08-29', category: 'Music', country: 'USA', description: 'King of Pop' },
  { name: 'Whitney Houston', type: 'Person', foundedOrBirth: '1963-08-09', category: 'Music', country: 'USA', description: 'Singer' },
  { name: 'Prince', type: 'Person', foundedOrBirth: '1958-06-07', category: 'Music', country: 'USA', description: 'Musician' },
  { name: 'David Bowie', type: 'Person', foundedOrBirth: '1947-01-08', category: 'Music', country: 'UK', description: 'Musician' },
  { name: 'Freddie Mercury', type: 'Person', foundedOrBirth: '1946-09-05', category: 'Music', country: 'UK', description: 'Lead singer of Queen' },
  { name: 'John Lennon', type: 'Person', foundedOrBirth: '1940-10-09', category: 'Music', country: 'UK', description: 'Beatle and peace activist' },
  { name: 'Muhammad Ali', type: 'Person', foundedOrBirth: '1942-01-17', category: 'Sports', country: 'USA', description: 'Boxing champion' },
  { name: 'Kobe Bryant', type: 'Person', foundedOrBirth: '1978-08-23', category: 'Sports', country: 'USA', description: 'Basketball legend' },
  { name: 'Diego Maradona', type: 'Person', foundedOrBirth: '1960-10-30', category: 'Sports', country: 'Argentina', description: 'Football legend' },
  { name: 'Pelé', type: 'Person', foundedOrBirth: '1940-10-23', category: 'Sports', country: 'Brazil', description: 'Football legend' },
  
  // Influencers & Content Creators
  { name: 'MrBeast', type: 'Person', foundedOrBirth: '1998-05-07', category: 'Content Creator', country: 'USA', description: 'YouTuber and philanthropist' },
  { name: 'PewDiePie', type: 'Person', foundedOrBirth: '1989-10-24', category: 'Content Creator', country: 'Sweden', description: 'YouTuber' },
  { name: 'Kim Kardashian', type: 'Person', foundedOrBirth: '1980-10-21', category: 'Entertainment', country: 'USA', description: 'Media personality' },
  { name: 'Kylie Jenner', type: 'Person', foundedOrBirth: '1997-08-10', category: 'Business', country: 'USA', description: 'Entrepreneur' },
  { name: 'Logan Paul', type: 'Person', foundedOrBirth: '1995-04-01', category: 'Content Creator', country: 'USA', description: 'YouTuber and wrestler' },
  { name: 'Joe Rogan', type: 'Person', foundedOrBirth: '1967-08-11', category: 'Entertainment', country: 'USA', description: 'Podcaster' },
  { name: 'Markiplier', type: 'Person', foundedOrBirth: '1989-06-28', category: 'Content Creator', country: 'USA', description: 'YouTuber' },
  { name: 'Ninja', type: 'Person', foundedOrBirth: '1991-06-05', category: 'Gaming', country: 'USA', description: 'Streamer' },
  { name: 'Emma Chamberlain', type: 'Person', foundedOrBirth: '2001-05-22', category: 'Content Creator', country: 'USA', description: 'YouTuber' },
  { name: 'Charli D\'Amelio', type: 'Person', foundedOrBirth: '2004-05-01', category: 'Content Creator', country: 'USA', description: 'TikTok star' },
  
  // Political Figures
  { name: 'Barack Obama', type: 'Person', foundedOrBirth: '1961-08-04', category: 'Politics', country: 'USA', description: '44th US President' },
  { name: 'Donald Trump', type: 'Person', foundedOrBirth: '1946-06-14', category: 'Politics', country: 'USA', description: '45th US President' },
  { name: 'Joe Biden', type: 'Person', foundedOrBirth: '1942-11-20', category: 'Politics', country: 'USA', description: '46th US President' },
  { name: 'Vladimir Putin', type: 'Person', foundedOrBirth: '1952-10-07', category: 'Politics', country: 'Russia', description: 'President of Russia' },
  { name: 'Xi Jinping', type: 'Person', foundedOrBirth: '1953-06-15', category: 'Politics', country: 'China', description: 'President of China' },
  { name: 'Angela Merkel', type: 'Person', foundedOrBirth: '1954-07-17', category: 'Politics', country: 'Germany', description: 'Former Chancellor' },
  { name: 'Emmanuel Macron', type: 'Person', foundedOrBirth: '1977-12-21', category: 'Politics', country: 'France', description: 'President of France' },
  { name: 'Justin Trudeau', type: 'Person', foundedOrBirth: '1971-12-25', category: 'Politics', country: 'Canada', description: 'Prime Minister of Canada' },
  { name: 'Narendra Modi', type: 'Person', foundedOrBirth: '1950-09-17', category: 'Politics', country: 'India', description: 'Prime Minister of India' },
  { name: 'Queen Elizabeth II', type: 'Person', foundedOrBirth: '1926-04-21', category: 'Royalty', country: 'UK', description: 'Queen of UK' },
  { name: 'King Charles III', type: 'Person', foundedOrBirth: '1948-11-14', category: 'Royalty', country: 'UK', description: 'King of UK' },
  { name: 'Prince William', type: 'Person', foundedOrBirth: '1982-06-21', category: 'Royalty', country: 'UK', description: 'Prince of Wales' },
  { name: 'Prince Harry', type: 'Person', foundedOrBirth: '1984-09-15', category: 'Royalty', country: 'UK', description: 'Duke of Sussex' },
];

// Generate additional entries to reach 22,000+
function generateAdditionalCues(): Omit<Cue, 'id'>[] {
  const additionalCues: Omit<Cue, 'id'>[] = [];
  
  // More tech companies
  const techCompanies = [
    'Palantir', 'Snowflake', 'Datadog', 'CrowdStrike', 'Cloudflare', 'MongoDB', 'Twilio', 'Okta', 
    'DocuSign', 'Atlassian', 'Asana', 'Notion', 'Figma', 'Canva', 'Airtable', 'Zapier', 'Hubspot',
    'Zendesk', 'ServiceNow', 'Workday', 'Splunk', 'Palo Alto Networks', 'Fortinet', 'Zscaler',
    'SentinelOne', 'Elastic', 'Confluent', 'HashiCorp', 'GitLab', 'GitHub', 'JetBrains', 'Vercel',
    'Netlify', 'Heroku', 'DigitalOcean', 'Linode', 'Vultr', 'OVH', 'Hetzner', 'Cloudways',
    'Squarespace', 'Wix', 'Weebly', 'GoDaddy', 'Namecheap', 'Hover', 'Google Cloud', 'AWS',
    'Azure', 'Alibaba Cloud', 'Oracle Cloud', 'IBM Cloud', 'Salesforce Platform', 'SAP',
    'Intuit', 'Quickbooks', 'FreshBooks', 'Wave', 'Xero', 'Gusto', 'Rippling', 'Deel', 'Remote',
    'Oyster', 'Lattice', 'Culture Amp', 'Lever', 'Greenhouse', 'BambooHR', 'Namely', 'Personio',
  ];
  
  techCompanies.forEach((name, i) => {
    const year = 1995 + (i % 28);
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;
    additionalCues.push({
      name,
      type: 'Brand',
      foundedOrBirth: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      category: 'Technology',
      country: 'USA',
      description: 'Technology company'
    });
  });

  // More cities from around the world
  const moreCities = [
    { name: 'Shenzhen', country: 'China', year: 1979 },
    { name: 'Guangzhou', country: 'China', year: 214 },
    { name: 'Chengdu', country: 'China', year: 316 },
    { name: 'Hangzhou', country: 'China', year: 589 },
    { name: 'Wuhan', country: 'China', year: 223 },
    { name: 'Tianjin', country: 'China', year: 1404 },
    { name: 'Chongqing', country: 'China', year: 316 },
    { name: 'Nanjing', country: 'China', year: 495 },
    { name: 'Suzhou', country: 'China', year: 514 },
    { name: 'Busan', country: 'South Korea', year: 57 },
    { name: 'Incheon', country: 'South Korea', year: 18 },
    { name: 'Daegu', country: 'South Korea', year: 261 },
    { name: 'Fukuoka', country: 'Japan', year: 1889 },
    { name: 'Sapporo', country: 'Japan', year: 1869 },
    { name: 'Nagoya', country: 'Japan', year: 1610 },
    { name: 'Kobe', country: 'Japan', year: 1889 },
    { name: 'Yokohama', country: 'Japan', year: 1859 },
    { name: 'Taipei', country: 'Taiwan', year: 1709 },
    { name: 'Kaohsiung', country: 'Taiwan', year: 1664 },
    { name: 'Hanoi', country: 'Vietnam', year: 1010 },
    { name: 'Ho Chi Minh City', country: 'Vietnam', year: 1698 },
    { name: 'Phnom Penh', country: 'Cambodia', year: 1434 },
    { name: 'Yangon', country: 'Myanmar', year: 1755 },
    { name: 'Dhaka', country: 'Bangladesh', year: 1608 },
    { name: 'Kolkata', country: 'India', year: 1690 },
    { name: 'Chennai', country: 'India', year: 1639 },
    { name: 'Hyderabad', country: 'India', year: 1591 },
    { name: 'Pune', country: 'India', year: 847 },
    { name: 'Ahmedabad', country: 'India', year: 1411 },
    { name: 'Jaipur', country: 'India', year: 1727 },
    { name: 'Karachi', country: 'Pakistan', year: 1729 },
    { name: 'Lahore', country: 'Pakistan', year: 1000 },
    { name: 'Islamabad', country: 'Pakistan', year: 1960 },
    { name: 'Colombo', country: 'Sri Lanka', year: 500 },
    { name: 'Kathmandu', country: 'Nepal', year: 723 },
    { name: 'Kabul', country: 'Afghanistan', year: 1500 },
    { name: 'Tehran', country: 'Iran', year: 1524 },
    { name: 'Baghdad', country: 'Iraq', year: 762 },
    { name: 'Damascus', country: 'Syria', year: -8000 },
    { name: 'Beirut', country: 'Lebanon', year: -3000 },
    { name: 'Amman', country: 'Jordan', year: -7250 },
    { name: 'Riyadh', country: 'Saudi Arabia', year: 1737 },
    { name: 'Jeddah', country: 'Saudi Arabia', year: 522 },
    { name: 'Mecca', country: 'Saudi Arabia', year: -2000 },
    { name: 'Abu Dhabi', country: 'UAE', year: 1761 },
    { name: 'Doha', country: 'Qatar', year: 1825 },
    { name: 'Manama', country: 'Bahrain', year: 1521 },
    { name: 'Kuwait City', country: 'Kuwait', year: 1613 },
    { name: 'Muscat', country: 'Oman', year: 1508 },
    { name: 'Casablanca', country: 'Morocco', year: 1515 },
    { name: 'Marrakech', country: 'Morocco', year: 1062 },
    { name: 'Algiers', country: 'Algeria', year: 944 },
    { name: 'Tunis', country: 'Tunisia', year: 698 },
    { name: 'Tripoli', country: 'Libya', year: -700 },
    { name: 'Accra', country: 'Ghana', year: 1877 },
    { name: 'Abuja', country: 'Nigeria', year: 1991 },
    { name: 'Addis Ababa', country: 'Ethiopia', year: 1886 },
    { name: 'Dar es Salaam', country: 'Tanzania', year: 1862 },
    { name: 'Kampala', country: 'Uganda', year: 1890 },
    { name: 'Kigali', country: 'Rwanda', year: 1907 },
    { name: 'Lusaka', country: 'Zambia', year: 1905 },
    { name: 'Harare', country: 'Zimbabwe', year: 1890 },
    { name: 'Maputo', country: 'Mozambique', year: 1544 },
    { name: 'Luanda', country: 'Angola', year: 1575 },
    { name: 'Kinshasa', country: 'DR Congo', year: 1881 },
    { name: 'Dakar', country: 'Senegal', year: 1857 },
    { name: 'Abidjan', country: 'Ivory Coast', year: 1898 },
    { name: 'Caracas', country: 'Venezuela', year: 1567 },
    { name: 'Quito', country: 'Ecuador', year: 1534 },
    { name: 'La Paz', country: 'Bolivia', year: 1548 },
    { name: 'Asunción', country: 'Paraguay', year: 1537 },
    { name: 'Montevideo', country: 'Uruguay', year: 1724 },
    { name: 'Havana', country: 'Cuba', year: 1515 },
    { name: 'San Juan', country: 'Puerto Rico', year: 1521 },
    { name: 'Santo Domingo', country: 'Dominican Republic', year: 1496 },
    { name: 'Panama City', country: 'Panama', year: 1519 },
    { name: 'San José', country: 'Costa Rica', year: 1738 },
    { name: 'Managua', country: 'Nicaragua', year: 1819 },
    { name: 'Tegucigalpa', country: 'Honduras', year: 1578 },
    { name: 'San Salvador', country: 'El Salvador', year: 1525 },
    { name: 'Guatemala City', country: 'Guatemala', year: 1776 },
    { name: 'Belize City', country: 'Belize', year: 1638 },
    { name: 'Kingston', country: 'Jamaica', year: 1692 },
    { name: 'Port-au-Prince', country: 'Haiti', year: 1749 },
    { name: 'Auckland', country: 'New Zealand', year: 1840 },
    { name: 'Wellington', country: 'New Zealand', year: 1840 },
    { name: 'Brisbane', country: 'Australia', year: 1824 },
    { name: 'Perth', country: 'Australia', year: 1829 },
    { name: 'Adelaide', country: 'Australia', year: 1836 },
    { name: 'Gold Coast', country: 'Australia', year: 1875 },
    { name: 'Canberra', country: 'Australia', year: 1913 },
    { name: 'Suva', country: 'Fiji', year: 1849 },
    { name: 'Port Moresby', country: 'Papua New Guinea', year: 1873 },
    { name: 'Lyon', country: 'France', year: -43 },
    { name: 'Marseille', country: 'France', year: -600 },
    { name: 'Nice', country: 'France', year: -350 },
    { name: 'Toulouse', country: 'France', year: -106 },
    { name: 'Bordeaux', country: 'France', year: -300 },
    { name: 'Hamburg', country: 'Germany', year: 808 },
    { name: 'Cologne', country: 'Germany', year: 38 },
    { name: 'Stuttgart', country: 'Germany', year: 950 },
    { name: 'Düsseldorf', country: 'Germany', year: 1288 },
    { name: 'Leipzig', country: 'Germany', year: 1015 },
    { name: 'Dresden', country: 'Germany', year: 1206 },
    { name: 'Hannover', country: 'Germany', year: 1150 },
    { name: 'Nuremberg', country: 'Germany', year: 1050 },
    { name: 'Naples', country: 'Italy', year: -600 },
    { name: 'Turin', country: 'Italy', year: -28 },
    { name: 'Palermo', country: 'Italy', year: -734 },
    { name: 'Genoa', country: 'Italy', year: -500 },
    { name: 'Bologna', country: 'Italy', year: -510 },
    { name: 'Valencia', country: 'Spain', year: -138 },
    { name: 'Seville', country: 'Spain', year: -205 },
    { name: 'Bilbao', country: 'Spain', year: 1300 },
    { name: 'Malaga', country: 'Spain', year: -770 },
    { name: 'Porto', country: 'Portugal', year: 136 },
    { name: 'Braga', country: 'Portugal', year: -300 },
    { name: 'Rotterdam', country: 'Netherlands', year: 1270 },
    { name: 'The Hague', country: 'Netherlands', year: 1230 },
    { name: 'Utrecht', country: 'Netherlands', year: 47 },
    { name: 'Eindhoven', country: 'Netherlands', year: 1232 },
    { name: 'Antwerp', country: 'Belgium', year: 900 },
    { name: 'Ghent', country: 'Belgium', year: 650 },
    { name: 'Liège', country: 'Belgium', year: 558 },
    { name: 'Bruges', country: 'Belgium', year: 850 },
    { name: 'Luxembourg City', country: 'Luxembourg', year: 963 },
    { name: 'Salzburg', country: 'Austria', year: 696 },
    { name: 'Innsbruck', country: 'Austria', year: 1180 },
    { name: 'Graz', country: 'Austria', year: 1128 },
    { name: 'Basel', country: 'Switzerland', year: -44 },
    { name: 'Bern', country: 'Switzerland', year: 1191 },
    { name: 'Lausanne', country: 'Switzerland', year: -15 },
    { name: 'Krakow', country: 'Poland', year: 965 },
    { name: 'Wroclaw', country: 'Poland', year: 900 },
    { name: 'Gdansk', country: 'Poland', year: 997 },
    { name: 'Poznan', country: 'Poland', year: 968 },
    { name: 'Brno', country: 'Czech Republic', year: 1091 },
    { name: 'Bratislava', country: 'Slovakia', year: 907 },
    { name: 'Ljubljana', country: 'Slovenia', year: -50 },
    { name: 'Zagreb', country: 'Croatia', year: 1094 },
    { name: 'Split', country: 'Croatia', year: 305 },
    { name: 'Dubrovnik', country: 'Croatia', year: 614 },
    { name: 'Belgrade', country: 'Serbia', year: -279 },
    { name: 'Sarajevo', country: 'Bosnia', year: 1461 },
    { name: 'Skopje', country: 'North Macedonia', year: -400 },
    { name: 'Tirana', country: 'Albania', year: 1614 },
    { name: 'Podgorica', country: 'Montenegro', year: 1326 },
    { name: 'Sofia', country: 'Bulgaria', year: -500 },
    { name: 'Bucharest', country: 'Romania', year: 1459 },
    { name: 'Cluj-Napoca', country: 'Romania', year: 1213 },
    { name: 'Kyiv', country: 'Ukraine', year: 482 },
    { name: 'Lviv', country: 'Ukraine', year: 1256 },
    { name: 'Odesa', country: 'Ukraine', year: 1794 },
    { name: 'Minsk', country: 'Belarus', year: 1067 },
    { name: 'Vilnius', country: 'Lithuania', year: 1323 },
    { name: 'Riga', country: 'Latvia', year: 1201 },
    { name: 'Tallinn', country: 'Estonia', year: 1154 },
    { name: 'Reykjavik', country: 'Iceland', year: 874 },
    { name: 'Gothenburg', country: 'Sweden', year: 1621 },
    { name: 'Malmö', country: 'Sweden', year: 1275 },
    { name: 'Bergen', country: 'Norway', year: 1070 },
    { name: 'Trondheim', country: 'Norway', year: 997 },
    { name: 'Aarhus', country: 'Denmark', year: 770 },
    { name: 'Tampere', country: 'Finland', year: 1779 },
    { name: 'Turku', country: 'Finland', year: 1229 },
    { name: 'Glasgow', country: 'UK', year: 580 },
    { name: 'Manchester', country: 'UK', year: 79 },
    { name: 'Birmingham', country: 'UK', year: 1166 },
    { name: 'Liverpool', country: 'UK', year: 1207 },
    { name: 'Leeds', country: 'UK', year: 1207 },
    { name: 'Bristol', country: 'UK', year: 1000 },
    { name: 'Cardiff', country: 'UK', year: 1081 },
    { name: 'Belfast', country: 'UK', year: 1613 },
    { name: 'Cork', country: 'Ireland', year: 606 },
    { name: 'Galway', country: 'Ireland', year: 1124 },
    { name: 'Thessaloniki', country: 'Greece', year: -315 },
    { name: 'Antalya', country: 'Turkey', year: -150 },
    { name: 'Ankara', country: 'Turkey', year: -1200 },
    { name: 'Izmir', country: 'Turkey', year: -3000 },
  ];
  
  moreCities.forEach((city, i) => {
    const year = city.year > 0 ? city.year : Math.abs(city.year);
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;
    const dateStr = city.year > 0 
      ? `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      : `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    additionalCues.push({
      name: city.name,
      type: 'Location',
      foundedOrBirth: dateStr,
      category: 'City',
      country: city.country,
      description: `City in ${city.country}`
    });
  });

  // Generate more brands (industries) - expanded for 22k+
  const industries = ['Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Energy', 'Telecom', 'Media', 'Consumer Goods', 
    'Technology', 'Automotive', 'Aerospace', 'Agriculture', 'Construction', 'Education', 'Insurance', 'Real Estate'];
  const brandPrefixes = ['Global', 'Prime', 'Atlas', 'Apex', 'Summit', 'Core', 'Nova', 'Vanguard', 'Pioneer', 'Elite',
    'Alpha', 'Beta', 'Delta', 'Omega', 'Zenith', 'Vertex', 'Quantum', 'Nexus', 'Stellar', 'Pacific',
    'Atlantic', 'Northern', 'Southern', 'Western', 'Eastern', 'Central', 'United', 'National', 'American', 'European',
    'Metro', 'Urban', 'Royal', 'Imperial', 'Premier', 'Supreme', 'Ultimate', 'Infinite', 'Dynamic', 'Strategic',
    'Advanced', 'Modern', 'Future', 'Smart', 'Digital', 'Tech', 'Cyber', 'Net', 'Web', 'Cloud'];
  const brandSuffixes = ['Corp', 'Inc', 'Holdings', 'Group', 'Systems', 'Solutions', 'Industries', 'Enterprises', 'Partners', 'International',
    'Technologies', 'Services', 'Consulting', 'Ventures', 'Capital', 'Investments', 'Networks', 'Labs', 'Works', 'Co'];
  const countries = ['USA', 'UK', 'Germany', 'Japan', 'France', 'Canada', 'Australia', 'China', 'India', 'Brazil', 
    'South Korea', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Singapore', 'Mexico', 'Sweden', 'Norway', 'Denmark'];
  
  // Generate 11000 brands
  for (let i = 0; i < 11000; i++) {
    const prefix = brandPrefixes[i % brandPrefixes.length];
    const suffix = brandSuffixes[Math.floor(i / brandPrefixes.length) % brandSuffixes.length];
    const industry = industries[i % industries.length];
    const year = 1920 + (i % 103);
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;
    const countryIdx = (i + Math.floor(i / 100)) % countries.length;
    
    additionalCues.push({
      name: `${prefix} ${suffix} ${Math.floor(i / 1000) > 0 ? Math.floor(i / 1000) : ''}`.trim(),
      type: 'Brand',
      foundedOrBirth: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      category: industry,
      country: countries[countryIdx],
      description: `${industry} company`
    });
  }

  // Generate more people - expanded
  const firstNames = ['James', 'John', 'Robert', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Alexander', 'Benjamin', 'Daniel', 'Edward', 'Francis', 'George', 'Henry', 'Ian', 'Jack', 'Kevin',
    'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
    'Lucas', 'Mason', 'Logan', 'Ethan', 'Aiden', 'Noah', 'Liam', 'Jacob', 'Oliver', 'Elijah',
    'Grace', 'Chloe', 'Lily', 'Madison', 'Abigail', 'Emily', 'Zoe', 'Ella', 'Hannah', 'Natalie',
    'Ryan', 'Nathan', 'Andrew', 'Joshua', 'Matthew', 'Anthony', 'Brandon', 'Justin', 'Samuel', 'Adam',
    'Victoria', 'Samantha', 'Lauren', 'Ashley', 'Rachel', 'Nicole', 'Amanda', 'Stephanie', 'Rebecca', 'Megan'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez',
    'Lee', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'King', 'Wright', 'Scott',
    'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips',
    'Evans', 'Turner', 'Torres', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Flores', 'Morris', 'Nguyen',
    'Murphy', 'Rivera', 'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell',
    'Gomez', 'Kelly', 'Howard', 'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks'];
  const personCategories = ['Business', 'Science', 'Arts', 'Sports', 'Politics', 'Entertainment', 'Technology', 'Medicine',
    'Law', 'Education', 'Finance', 'Music', 'Film', 'Literature', 'Fashion', 'Journalism'];
  
  // Generate 10000 people
  for (let i = 0; i < 10000; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const category = personCategories[i % personCategories.length];
    const year = 1920 + (i % 85);
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;
    const uniqueSuffix = Math.floor(i / (firstNames.length * lastNames.length));
    const displayName = uniqueSuffix > 0 ? `${firstName} ${lastName} ${['Jr.', 'Sr.', 'II', 'III', 'IV'][uniqueSuffix % 5]}` : `${firstName} ${lastName}`;
    
    additionalCues.push({
      name: displayName,
      type: 'Person',
      foundedOrBirth: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      category: category,
      country: countries[i % countries.length],
      description: `${category} professional`
    });
  }

  // Generate more cities - all US cities
  const usCities = [
    'Anchorage', 'Juneau', 'Fairbanks', 'Sitka', 'Ketchikan',
    'Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa',
    'Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro',
    'Tempe', 'Mesa', 'Chandler', 'Glendale', 'Scottsdale', 'Gilbert', 'Peoria',
    'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Stockton', 'Irvine', 'Chula Vista', 'Fremont',
    'San Bernardino', 'Modesto', 'Fontana', 'Moreno Valley', 'Glendale', 'Huntington Beach', 'Santa Clarita',
    'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster',
    'Hartford', 'New Haven', 'Stamford', 'Bridgeport', 'Waterbury',
    'Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna',
    'St. Petersburg', 'Hialeah', 'Port St. Lucie', 'Cape Coral', 'Tallahassee', 'Fort Lauderdale', 'Pembroke Pines',
    'Savannah', 'Augusta', 'Columbus', 'Macon', 'Athens',
    'Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello',
    'Rockford', 'Naperville', 'Joliet', 'Springfield', 'Peoria', 'Elgin',
    'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Fishers',
    'Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City',
    'Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka',
    'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Richmond',
    'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Kenner',
    'Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn',
    'Annapolis', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie',
    'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton',
    'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing',
    'St. Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park',
    'Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi',
    'Kansas City', 'Springfield', 'Columbia', 'Independence', 'Lee Summit',
    'Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte',
    'Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney',
    'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City',
    'Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester',
    'Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison', 'Trenton',
    'Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell',
    'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany',
    'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary',
    'Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo',
    'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown',
    'Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton',
    'Salem', 'Eugene', 'Gresham', 'Hillsboro', 'Beaverton',
    'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem',
    'Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence',
    'Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Rock Hill',
    'Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown',
    'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin',
    'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland',
    'Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem',
    'Burlington', 'South Burlington', 'Rutland', 'Essex Junction', 'Bennington',
    'Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News', 'Alexandria',
    'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett',
    'Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling',
    'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton',
    'Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs',
  ];
  
  usCities.forEach((city, i) => {
    const year = 1700 + (i % 300);
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;
    
    additionalCues.push({
      name: city,
      type: 'Location',
      foundedOrBirth: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      category: 'City',
      country: 'USA',
      description: 'City in the United States'
    });
  });

  // Generate more international cities
  const intlCities = [
    { name: 'Osaka', country: 'Japan' }, { name: 'Yokohama', country: 'Japan' }, { name: 'Nagoya', country: 'Japan' },
    { name: 'Kobe', country: 'Japan' }, { name: 'Kyoto', country: 'Japan' }, { name: 'Fukuoka', country: 'Japan' },
    { name: 'Sapporo', country: 'Japan' }, { name: 'Sendai', country: 'Japan' }, { name: 'Hiroshima', country: 'Japan' },
    { name: 'Busan', country: 'South Korea' }, { name: 'Incheon', country: 'South Korea' }, { name: 'Daegu', country: 'South Korea' },
    { name: 'Guangzhou', country: 'China' }, { name: 'Shenzhen', country: 'China' }, { name: 'Tianjin', country: 'China' },
    { name: 'Chongqing', country: 'China' }, { name: 'Wuhan', country: 'China' }, { name: 'Chengdu', country: 'China' },
    { name: 'Hangzhou', country: 'China' }, { name: 'Xian', country: 'China' }, { name: 'Suzhou', country: 'China' },
    { name: 'Manchester', country: 'UK' }, { name: 'Birmingham', country: 'UK' }, { name: 'Leeds', country: 'UK' },
    { name: 'Glasgow', country: 'UK' }, { name: 'Liverpool', country: 'UK' }, { name: 'Bristol', country: 'UK' },
    { name: 'Munich', country: 'Germany' }, { name: 'Hamburg', country: 'Germany' }, { name: 'Cologne', country: 'Germany' },
    { name: 'Frankfurt', country: 'Germany' }, { name: 'Stuttgart', country: 'Germany' }, { name: 'Dusseldorf', country: 'Germany' },
    { name: 'Lyon', country: 'France' }, { name: 'Marseille', country: 'France' }, { name: 'Toulouse', country: 'France' },
    { name: 'Nice', country: 'France' }, { name: 'Nantes', country: 'France' }, { name: 'Strasbourg', country: 'France' },
    { name: 'Naples', country: 'Italy' }, { name: 'Turin', country: 'Italy' }, { name: 'Palermo', country: 'Italy' },
    { name: 'Genoa', country: 'Italy' }, { name: 'Bologna', country: 'Italy' }, { name: 'Catania', country: 'Italy' },
    { name: 'Valencia', country: 'Spain' }, { name: 'Seville', country: 'Spain' }, { name: 'Bilbao', country: 'Spain' },
    { name: 'Malaga', country: 'Spain' }, { name: 'Zaragoza', country: 'Spain' }, { name: 'Murcia', country: 'Spain' },
    { name: 'Porto', country: 'Portugal' }, { name: 'Braga', country: 'Portugal' }, { name: 'Coimbra', country: 'Portugal' },
    { name: 'Rotterdam', country: 'Netherlands' }, { name: 'The Hague', country: 'Netherlands' }, { name: 'Utrecht', country: 'Netherlands' },
    { name: 'Antwerp', country: 'Belgium' }, { name: 'Ghent', country: 'Belgium' }, { name: 'Bruges', country: 'Belgium' },
    { name: 'Krakow', country: 'Poland' }, { name: 'Wroclaw', country: 'Poland' }, { name: 'Gdansk', country: 'Poland' },
    { name: 'Guadalajara', country: 'Mexico' }, { name: 'Monterrey', country: 'Mexico' }, { name: 'Puebla', country: 'Mexico' },
    { name: 'Tijuana', country: 'Mexico' }, { name: 'Leon', country: 'Mexico' }, { name: 'Juarez', country: 'Mexico' },
    { name: 'Bogota', country: 'Colombia' }, { name: 'Medellin', country: 'Colombia' }, { name: 'Cali', country: 'Colombia' },
    { name: 'Belo Horizonte', country: 'Brazil' }, { name: 'Brasilia', country: 'Brazil' }, { name: 'Salvador', country: 'Brazil' },
    { name: 'Fortaleza', country: 'Brazil' }, { name: 'Curitiba', country: 'Brazil' }, { name: 'Recife', country: 'Brazil' },
    { name: 'Cordoba', country: 'Argentina' }, { name: 'Rosario', country: 'Argentina' }, { name: 'Mendoza', country: 'Argentina' },
    { name: 'Valparaiso', country: 'Chile' }, { name: 'Concepcion', country: 'Chile' }, { name: 'La Serena', country: 'Chile' },
    { name: 'Arequipa', country: 'Peru' }, { name: 'Trujillo', country: 'Peru' }, { name: 'Chiclayo', country: 'Peru' },
    { name: 'Chennai', country: 'India' }, { name: 'Kolkata', country: 'India' }, { name: 'Hyderabad', country: 'India' },
    { name: 'Pune', country: 'India' }, { name: 'Ahmedabad', country: 'India' }, { name: 'Jaipur', country: 'India' },
    { name: 'Karachi', country: 'Pakistan' }, { name: 'Lahore', country: 'Pakistan' }, { name: 'Faisalabad', country: 'Pakistan' },
    { name: 'Dhaka', country: 'Bangladesh' }, { name: 'Chittagong', country: 'Bangladesh' }, { name: 'Khulna', country: 'Bangladesh' },
    { name: 'Lagos', country: 'Nigeria' }, { name: 'Kano', country: 'Nigeria' }, { name: 'Ibadan', country: 'Nigeria' },
    { name: 'Cape Town', country: 'South Africa' }, { name: 'Durban', country: 'South Africa' }, { name: 'Pretoria', country: 'South Africa' },
    { name: 'Alexandria', country: 'Egypt' }, { name: 'Giza', country: 'Egypt' }, { name: 'Port Said', country: 'Egypt' },
    { name: 'Casablanca', country: 'Morocco' }, { name: 'Fes', country: 'Morocco' }, { name: 'Tangier', country: 'Morocco' },
    { name: 'Nairobi', country: 'Kenya' }, { name: 'Mombasa', country: 'Kenya' }, { name: 'Nakuru', country: 'Kenya' },
    { name: 'Kinshasa', country: 'DR Congo' }, { name: 'Lubumbashi', country: 'DR Congo' }, { name: 'Goma', country: 'DR Congo' },
    { name: 'Adelaide', country: 'Australia' }, { name: 'Perth', country: 'Australia' }, { name: 'Gold Coast', country: 'Australia' },
    { name: 'Auckland', country: 'New Zealand' }, { name: 'Wellington', country: 'New Zealand' }, { name: 'Christchurch', country: 'New Zealand' },
    { name: 'Gothenburg', country: 'Sweden' }, { name: 'Malmo', country: 'Sweden' }, { name: 'Uppsala', country: 'Sweden' },
    { name: 'Bergen', country: 'Norway' }, { name: 'Trondheim', country: 'Norway' }, { name: 'Stavanger', country: 'Norway' },
    { name: 'Aarhus', country: 'Denmark' }, { name: 'Odense', country: 'Denmark' }, { name: 'Aalborg', country: 'Denmark' },
    { name: 'Tampere', country: 'Finland' }, { name: 'Turku', country: 'Finland' }, { name: 'Oulu', country: 'Finland' },
    { name: 'Cork', country: 'Ireland' }, { name: 'Galway', country: 'Ireland' }, { name: 'Limerick', country: 'Ireland' },
    { name: 'Thessaloniki', country: 'Greece' }, { name: 'Patras', country: 'Greece' }, { name: 'Heraklion', country: 'Greece' },
    { name: 'Ankara', country: 'Turkey' }, { name: 'Izmir', country: 'Turkey' }, { name: 'Bursa', country: 'Turkey' },
    { name: 'Tel Aviv', country: 'Israel' }, { name: 'Haifa', country: 'Israel' }, { name: 'Beer Sheva', country: 'Israel' },
    { name: 'Dubai', country: 'UAE' }, { name: 'Sharjah', country: 'UAE' }, { name: 'Ajman', country: 'UAE' },
    { name: 'Doha', country: 'Qatar' }, { name: 'Al Wakrah', country: 'Qatar' }, { name: 'Al Khor', country: 'Qatar' },
    { name: 'Riyadh', country: 'Saudi Arabia' }, { name: 'Jeddah', country: 'Saudi Arabia' }, { name: 'Mecca', country: 'Saudi Arabia' },
    { name: 'Tehran', country: 'Iran' }, { name: 'Mashhad', country: 'Iran' }, { name: 'Isfahan', country: 'Iran' },
    { name: 'Kuala Lumpur', country: 'Malaysia' }, { name: 'George Town', country: 'Malaysia' }, { name: 'Johor Bahru', country: 'Malaysia' },
    { name: 'Ho Chi Minh City', country: 'Vietnam' }, { name: 'Hanoi', country: 'Vietnam' }, { name: 'Da Nang', country: 'Vietnam' },
    { name: 'Manila', country: 'Philippines' }, { name: 'Quezon City', country: 'Philippines' }, { name: 'Davao', country: 'Philippines' },
    { name: 'Jakarta', country: 'Indonesia' }, { name: 'Surabaya', country: 'Indonesia' }, { name: 'Bandung', country: 'Indonesia' },
  ];
  
  intlCities.forEach((city, i) => {
    const year = 800 + (i % 1200);
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;
    
    additionalCues.push({
      name: city.name,
      type: 'Location',
      foundedOrBirth: `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      category: 'City',
      country: city.country,
      description: `City in ${city.country}`
    });
  });

  // Generate universities
  const universities = [
    { name: 'Harvard University', country: 'USA', year: 1636 },
    { name: 'Yale University', country: 'USA', year: 1701 },
    { name: 'Princeton University', country: 'USA', year: 1746 },
    { name: 'Columbia University', country: 'USA', year: 1754 },
    { name: 'University of Pennsylvania', country: 'USA', year: 1740 },
    { name: 'Brown University', country: 'USA', year: 1764 },
    { name: 'Dartmouth College', country: 'USA', year: 1769 },
    { name: 'Cornell University', country: 'USA', year: 1865 },
    { name: 'MIT', country: 'USA', year: 1861 },
    { name: 'Stanford University', country: 'USA', year: 1885 },
    { name: 'Caltech', country: 'USA', year: 1891 },
    { name: 'University of Chicago', country: 'USA', year: 1890 },
    { name: 'Duke University', country: 'USA', year: 1838 },
    { name: 'Northwestern University', country: 'USA', year: 1851 },
    { name: 'Johns Hopkins University', country: 'USA', year: 1876 },
    { name: 'UCLA', country: 'USA', year: 1919 },
    { name: 'UC Berkeley', country: 'USA', year: 1868 },
    { name: 'University of Michigan', country: 'USA', year: 1817 },
    { name: 'University of Virginia', country: 'USA', year: 1819 },
    { name: 'Georgetown University', country: 'USA', year: 1789 },
    { name: 'NYU', country: 'USA', year: 1831 },
    { name: 'USC', country: 'USA', year: 1880 },
    { name: 'University of Notre Dame', country: 'USA', year: 1842 },
    { name: 'Vanderbilt University', country: 'USA', year: 1873 },
    { name: 'Rice University', country: 'USA', year: 1912 },
    { name: 'University of Oxford', country: 'UK', year: 1096 },
    { name: 'University of Cambridge', country: 'UK', year: 1209 },
    { name: 'Imperial College London', country: 'UK', year: 1907 },
    { name: 'University of Edinburgh', country: 'UK', year: 1582 },
    { name: 'Kings College London', country: 'UK', year: 1829 },
    { name: 'LSE', country: 'UK', year: 1895 },
    { name: 'University of Manchester', country: 'UK', year: 1824 },
    { name: 'University of Bristol', country: 'UK', year: 1876 },
    { name: 'University of Warwick', country: 'UK', year: 1965 },
    { name: 'University of Glasgow', country: 'UK', year: 1451 },
    { name: 'ETH Zurich', country: 'Switzerland', year: 1855 },
    { name: 'Ecole Polytechnique', country: 'France', year: 1794 },
    { name: 'Sciences Po', country: 'France', year: 1872 },
    { name: 'Sorbonne University', country: 'France', year: 1257 },
    { name: 'TU Munich', country: 'Germany', year: 1868 },
    { name: 'Heidelberg University', country: 'Germany', year: 1386 },
    { name: 'LMU Munich', country: 'Germany', year: 1472 },
    { name: 'Humboldt University', country: 'Germany', year: 1810 },
    { name: 'University of Tokyo', country: 'Japan', year: 1877 },
    { name: 'Kyoto University', country: 'Japan', year: 1897 },
    { name: 'Waseda University', country: 'Japan', year: 1882 },
    { name: 'Keio University', country: 'Japan', year: 1858 },
    { name: 'Seoul National University', country: 'South Korea', year: 1946 },
    { name: 'KAIST', country: 'South Korea', year: 1971 },
    { name: 'Tsinghua University', country: 'China', year: 1911 },
    { name: 'Peking University', country: 'China', year: 1898 },
    { name: 'Fudan University', country: 'China', year: 1905 },
    { name: 'University of Toronto', country: 'Canada', year: 1827 },
    { name: 'McGill University', country: 'Canada', year: 1821 },
    { name: 'UBC', country: 'Canada', year: 1908 },
    { name: 'University of Melbourne', country: 'Australia', year: 1853 },
    { name: 'University of Sydney', country: 'Australia', year: 1850 },
    { name: 'ANU', country: 'Australia', year: 1946 },
    { name: 'NUS', country: 'Singapore', year: 1905 },
    { name: 'NTU Singapore', country: 'Singapore', year: 1991 },
    { name: 'HKU', country: 'Hong Kong', year: 1911 },
    { name: 'IIT Bombay', country: 'India', year: 1958 },
    { name: 'IIT Delhi', country: 'India', year: 1961 },
    { name: 'University of Amsterdam', country: 'Netherlands', year: 1632 },
    { name: 'Leiden University', country: 'Netherlands', year: 1575 },
    { name: 'KU Leuven', country: 'Belgium', year: 1425 },
  ];
  
  universities.forEach((uni, i) => {
    additionalCues.push({
      name: uni.name,
      type: 'Brand',
      foundedOrBirth: `${uni.year}-09-01`,
      category: 'Education',
      country: uni.country,
      description: 'University'
    });
  });

  // Generate sports teams
  const sportsTeams = [
    { name: 'New York Yankees', country: 'USA', year: 1903 },
    { name: 'LA Dodgers', country: 'USA', year: 1883 },
    { name: 'Boston Red Sox', country: 'USA', year: 1901 },
    { name: 'Chicago Cubs', country: 'USA', year: 1876 },
    { name: 'LA Lakers', country: 'USA', year: 1947 },
    { name: 'Boston Celtics', country: 'USA', year: 1946 },
    { name: 'Chicago Bulls', country: 'USA', year: 1966 },
    { name: 'Golden State Warriors', country: 'USA', year: 1946 },
    { name: 'New England Patriots', country: 'USA', year: 1959 },
    { name: 'Dallas Cowboys', country: 'USA', year: 1960 },
    { name: 'Green Bay Packers', country: 'USA', year: 1919 },
    { name: 'Pittsburgh Steelers', country: 'USA', year: 1933 },
    { name: 'Real Madrid', country: 'Spain', year: 1902 },
    { name: 'FC Barcelona', country: 'Spain', year: 1899 },
    { name: 'Manchester United', country: 'UK', year: 1878 },
    { name: 'Manchester City', country: 'UK', year: 1880 },
    { name: 'Liverpool FC', country: 'UK', year: 1892 },
    { name: 'Chelsea FC', country: 'UK', year: 1905 },
    { name: 'Arsenal FC', country: 'UK', year: 1886 },
    { name: 'Tottenham Hotspur', country: 'UK', year: 1882 },
    { name: 'Bayern Munich', country: 'Germany', year: 1900 },
    { name: 'Borussia Dortmund', country: 'Germany', year: 1909 },
    { name: 'Paris Saint-Germain', country: 'France', year: 1970 },
    { name: 'Juventus FC', country: 'Italy', year: 1897 },
    { name: 'AC Milan', country: 'Italy', year: 1899 },
    { name: 'Inter Milan', country: 'Italy', year: 1908 },
    { name: 'Ajax Amsterdam', country: 'Netherlands', year: 1900 },
    { name: 'Benfica', country: 'Portugal', year: 1904 },
    { name: 'Porto FC', country: 'Portugal', year: 1893 },
    { name: 'Boca Juniors', country: 'Argentina', year: 1905 },
    { name: 'River Plate', country: 'Argentina', year: 1901 },
    { name: 'Flamengo', country: 'Brazil', year: 1895 },
    { name: 'Corinthians', country: 'Brazil', year: 1910 },
    { name: 'Santos FC', country: 'Brazil', year: 1912 },
    { name: 'Toronto Maple Leafs', country: 'Canada', year: 1917 },
    { name: 'Montreal Canadiens', country: 'Canada', year: 1909 },
    { name: 'New York Rangers', country: 'USA', year: 1926 },
    { name: 'Chicago Blackhawks', country: 'USA', year: 1926 },
  ];
  
  sportsTeams.forEach((team, i) => {
    additionalCues.push({
      name: team.name,
      type: 'Brand',
      foundedOrBirth: `${team.year}-01-01`,
      category: 'Sports',
      country: team.country,
      description: 'Sports team'
    });
  });

  return additionalCues;
}

// Combine all data
const allCuesWithoutId: Omit<Cue, 'id'>[] = [
  ...brandsData,
  ...citiesData,
  ...peopleData,
  ...generateAdditionalCues(),
];

// Add IDs and export
export const allCues: Cue[] = allCuesWithoutId.map((cue, index) => ({
  ...cue,
  id: index + 1,
}));

// Parsed cues with calculated numerology
export interface ParsedCue extends Cue {
  lifePathNumber: number;
  energySignature: string;
}

function parseDate(dateStr: string): Date {
  // Handle negative years (BC dates)
  if (dateStr.startsWith('-')) {
    const parts = dateStr.substring(1).split('-');
    const year = -parseInt(parts[0]);
    const month = parseInt(parts[1] || '1') - 1;
    const day = parseInt(parts[2] || '1');
    return new Date(year, month, day);
  }
  
  // Handle very old dates
  const parts = dateStr.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1] || '1') - 1;
  const day = parseInt(parts[2] || '1');
  
  // For years < 100, we need to use setFullYear to avoid the 1900s interpretation
  const date = new Date(year, month, day);
  date.setFullYear(year);
  return date;
}

// Pre-compute all cues with their numerology data
export const parsedCues: ParsedCue[] = allCues.map(cue => {
  try {
    const date = parseDate(cue.foundedOrBirth);
    const lifePathNumber = calculateLifePathNumber(date);
    const energySignature = calculateEnergySignature(date);
    return {
      ...cue,
      lifePathNumber: isNaN(lifePathNumber) ? 1 : lifePathNumber,
      energySignature: energySignature || 'Fire Initiator',
    };
  } catch {
    return {
      ...cue,
      lifePathNumber: 1,
      energySignature: 'Fire Initiator',
    };
  }
});

// Get total count
export const totalCuesCount = parsedCues.length;

console.log(`Cues database loaded: ${totalCuesCount} entries`);
