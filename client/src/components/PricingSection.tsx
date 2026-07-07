import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, MessageCircle, Database, Crown } from 'lucide-react';

const tiers = [
  {
    name: 'The Basics',
    price: 15.99,
    period: 'month',
    description: 'Essential numerology tools to get started',
    icon: Sparkles,
    features: [
      'Core numerology calculator',
      'Basic astrology tools',
      'Limited explore page access',
      'Daily energy overview',
    ],
    popular: false,
  },
  {
    name: 'CueChats',
    price: 28,
    period: 'month',
    description: 'AI-powered personalized guidance',
    icon: MessageCircle,
    features: [
      'Everything in Basics',
      'Full AI chat access',
      'Personalized real-time answers',
      'Unlimited questions to AI',
      'Based on your unique birthdate',
    ],
    popular: false,
  },
  {
    name: 'CUE+',
    price: 35,
    period: 'month',
    description: 'Complete access to all features',
    icon: Database,
    features: [
      'Everything in previous tiers',
      'Full access to 22,000+ cues database',
      'All AI chat features',
      'In-depth readings and reports',
      'Study zone access',
      'Priority feature updates',
    ],
    popular: true,
  },
  {
    name: 'Lifetime',
    price: null,
    period: 'one-time',
    description: 'All features forever',
    icon: Crown,
    features: [
      'All CUE+ features forever',
      'Exclusive Discord community',
      'Weekly Q&A with experts',
      'Early access to new features',
      'Voting rights on development',
      'Annual plans build credit toward lifetime',
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <div className="space-y-8" data-testid="pricing-section">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Pricing</Badge>
        <h2 className="text-6 md:text-7 font-semibold mb-4">
          Choose Your <span className="gradient-text">Energy Level</span>
        </h2>
        <p className="text-gray-11 text-3 max-w-2xl mx-auto">
          From basic numerology tools to complete cosmic guidance, find the plan that aligns with your journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            variant={tier.popular ? 'glow' : 'frosted'}
            className={`relative ${tier.popular ? 'lg:-translate-y-2' : ''}`}
            data-testid={`card-pricing-${tier.name.toLowerCase().replace(/\s/g, '-')}`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gold-gradient text-gray-1 shadow-lg">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-14 h-14 mx-auto rounded-lg flex items-center justify-center mb-4 ${
                tier.popular 
                  ? 'bg-gold-gradient' 
                  : 'bg-gray-a3'
              }`}>
                <tier.icon className={`w-7 h-7 ${tier.popular ? 'text-gray-1' : 'text-gray-12'}`} />
              </div>
              <CardTitle className="text-4">{tier.name}</CardTitle>
              <CardDescription className="text-2 text-gray-11">{tier.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                {tier.price !== null ? (
                  <>
                    <span className="text-7 font-bold">${tier.price}</span>
                    <span className="text-gray-11">/{tier.period}</span>
                  </>
                ) : (
                  <span className="text-5 font-bold">Limited Spots</span>
                )}
              </div>

              <ul className="space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-2">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      tier.popular ? 'text-amber-9' : 'text-green-9'
                    }`} />
                    <span className="text-gray-11">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.popular ? 'gold' : 'outline'}
                className="w-full"
                data-testid={`button-pricing-${tier.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                {tier.price ? 'Get Started' : 'Join Waitlist'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
