export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  keyPoints: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  free: boolean;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: 'intro-gg33',
    title: 'Introduction to GG33',
    description: 'Learn the basics of combining Chinese Astrology with Numerology',
    duration: '15 min',
    free: true,
    lessons: [
      {
        id: 'intro-1',
        title: 'What is GG33?',
        duration: '3 min',
        content: `GG33 is a unique system that combines the ancient wisdom of Chinese Astrology with the mathematical precision of Numerology to create a comprehensive understanding of human energy patterns.

Created by Gary "The Numbers Guy," this system provides insights into personality traits, life purpose, compatibility, and optimal timing for important decisions.

The "33" in GG33 represents the Master Number, symbolizing the highest level of spiritual awareness and teaching ability. This system aims to help you master your own energy and understand the energies of others.`,
        keyPoints: [
          'GG33 combines Chinese Astrology and Numerology',
          'Created by Gary "The Numbers Guy"',
          'Provides insights into personality, purpose, and compatibility',
          '33 represents the Master Number of spiritual awareness'
        ]
      },
      {
        id: 'intro-2',
        title: 'The Two Pillars: Numerology & Chinese Astrology',
        duration: '3 min',
        content: `GG33 stands on two powerful pillars of ancient wisdom:

**Numerology** - The study of numbers and their spiritual significance. Your birth date contains powerful numbers that reveal your life path, personality traits, and destiny. Key numbers include your Life Path Number, Expression Number, and Personal Year.

**Chinese Astrology** - A 12-year cycle based on the lunar calendar, assigning animal signs and elements to each year. Your birth year determines your Chinese Zodiac animal and element, revealing core personality traits and compatibility patterns.

When combined, these systems provide a 360-degree view of your energy signature.`,
        keyPoints: [
          'Numerology reveals life path through birth date numbers',
          'Chinese Astrology uses 12-year animal cycles',
          'Five elements (Wood, Fire, Earth, Metal, Water) add depth',
          'Combined systems create complete energy profile'
        ]
      },
      {
        id: 'intro-3',
        title: 'Understanding Your Energy Signature',
        duration: '3 min',
        content: `Your Energy Signature is a unique combination of your numerological and astrological influences. It describes who you are at your core.

**Components of Your Energy Signature:**

1. **Element** - Wood, Fire, Earth, Metal, or Water (from Chinese Astrology)
2. **Soul Type** - Based on your Life Path Number characteristics
3. **Energy Expression** - How you naturally express yourself

For example, a "Fire Soul Pioneer" would be someone born in a Fire element year with a Life Path 1, indicating passionate leadership energy.

Understanding your energy signature helps you make decisions aligned with your natural strengths.`,
        keyPoints: [
          'Energy Signature combines multiple factors',
          'Includes Element, Soul Type, and Expression',
          'Unique to your birth date and year',
          'Guides aligned decision-making'
        ]
      },
      {
        id: 'intro-4',
        title: 'How to Calculate Your Life Path Number',
        duration: '3 min',
        content: `Your Life Path Number is the most important number in Numerology. Here is how to calculate it:

**Step 1:** Write your full birth date (Month/Day/Year)
Example: March 15, 1990 = 03/15/1990

**Step 2:** Add all digits together
0 + 3 + 1 + 5 + 1 + 9 + 9 + 0 = 28

**Step 3:** Reduce to a single digit (unless 11, 22, or 33)
2 + 8 = 10
1 + 0 = 1

**Result:** Life Path Number 1

Master Numbers (11, 22, 33) are not reduced further as they carry special significance.`,
        keyPoints: [
          'Add all digits of your birth date',
          'Reduce to single digit (1-9)',
          'Master Numbers 11, 22, 33 are not reduced',
          'Life Path is your core numerological identity'
        ]
      },
      {
        id: 'intro-5',
        title: 'Finding Your Chinese Zodiac Sign',
        duration: '3 min',
        content: `Your Chinese Zodiac sign is determined by your birth year. The 12 animals cycle every 12 years:

**The 12 Animals:**
- Rat (2020, 2008, 1996, 1984)
- Ox (2021, 2009, 1997, 1985)
- Tiger (2022, 2010, 1998, 1986)
- Rabbit (2023, 2011, 1999, 1987)
- Dragon (2024, 2012, 2000, 1988)
- Snake (2013, 2001, 1989, 1977)
- Horse (2014, 2002, 1990, 1978)
- Goat (2015, 2003, 1991, 1979)
- Monkey (2016, 2004, 1992, 1980)
- Rooster (2017, 2005, 1993, 1981)
- Dog (2018, 2006, 1994, 1982)
- Pig (2019, 2007, 1995, 1983)

Note: Chinese New Year falls in January/February, so early-year births may belong to the previous year's animal.`,
        keyPoints: [
          '12 animals cycle every 12 years',
          'Birth year determines your animal',
          'Chinese New Year affects early-year births',
          'Each animal has unique personality traits'
        ]
      }
    ]
  },
  {
    id: 'life-path-numbers',
    title: 'Life Path Numbers',
    description: 'Deep dive into the meaning and significance of each life path number',
    duration: '45 min',
    free: true,
    lessons: [
      {
        id: 'lp-1',
        title: 'Life Path 1: The Pioneer',
        duration: '4 min',
        content: `Life Path 1 individuals are natural-born leaders who forge their own path in life.

**Core Traits:**
- Independent and self-reliant
- Innovative and original thinkers
- Ambitious and goal-oriented
- Courageous and determined

**Strengths:** Leadership, creativity, determination, initiative
**Challenges:** Stubbornness, ego, impatience, difficulty asking for help

**Career Paths:** Entrepreneur, CEO, inventor, freelancer, military leader

**Famous Life Path 1s:** Steve Jobs, Lady Gaga, Martin Luther King Jr.

Life Path 1s are here to learn independence and to lead by example. They often feel compelled to start new ventures and create original work.`,
        keyPoints: [
          'Natural leaders who forge their own path',
          'Independent, innovative, ambitious',
          'May struggle with ego and asking for help',
          'Best in entrepreneurial or leadership roles'
        ]
      },
      {
        id: 'lp-2',
        title: 'Life Path 2: The Diplomat',
        duration: '4 min',
        content: `Life Path 2 individuals are natural peacemakers who excel at bringing harmony to relationships.

**Core Traits:**
- Cooperative and diplomatic
- Sensitive and intuitive
- Patient and supportive
- Detail-oriented

**Strengths:** Mediation, partnership, empathy, patience
**Challenges:** Over-sensitivity, indecisiveness, people-pleasing, self-doubt

**Career Paths:** Counselor, mediator, diplomat, HR professional, therapist

**Famous Life Path 2s:** Barack Obama, Jennifer Aniston, Kim Kardashian

Life Path 2s are here to master the art of cooperation and to support others in achieving their goals.`,
        keyPoints: [
          'Natural peacemakers and diplomats',
          'Highly intuitive and empathetic',
          'Excel in partnerships and teamwork',
          'Need to balance giving with self-care'
        ]
      },
      {
        id: 'lp-3',
        title: 'Life Path 3: The Communicator',
        duration: '4 min',
        content: `Life Path 3 individuals are creative expressionists who inspire others through their words and art.

**Core Traits:**
- Creative and expressive
- Optimistic and joyful
- Social and charming
- Imaginative

**Strengths:** Communication, creativity, inspiration, entertainment
**Challenges:** Scattered energy, superficiality, mood swings, self-doubt

**Career Paths:** Writer, artist, actor, motivational speaker, marketing

**Famous Life Path 3s:** John Travolta, Snoop Dogg, Hillary Clinton

Life Path 3s are here to express themselves creatively and spread joy to the world.`,
        keyPoints: [
          'Creative expressionists and communicators',
          'Natural entertainers and artists',
          'Optimistic and socially gifted',
          'Need focus to avoid scattered energy'
        ]
      },
      {
        id: 'lp-4',
        title: 'Life Path 4: The Builder',
        duration: '4 min',
        content: `Life Path 4 individuals are practical builders who create lasting foundations.

**Core Traits:**
- Practical and hardworking
- Reliable and trustworthy
- Organized and methodical
- Patient and persistent

**Strengths:** Organization, discipline, loyalty, practicality
**Challenges:** Rigidity, workaholism, resistance to change, narrow-mindedness

**Career Paths:** Engineer, architect, accountant, project manager, craftsperson

**Famous Life Path 4s:** Oprah Winfrey, Bill Gates, Elton John

Life Path 4s are here to build solid foundations and create tangible results through hard work.`,
        keyPoints: [
          'Practical builders and organizers',
          'Extremely reliable and trustworthy',
          'Create lasting structures and systems',
          'Need flexibility to avoid rigidity'
        ]
      },
      {
        id: 'lp-5',
        title: 'Life Path 5: The Freedom Seeker',
        duration: '4 min',
        content: `Life Path 5 individuals crave freedom and adventure, constantly seeking new experiences.

**Core Traits:**
- Adventurous and versatile
- Adaptable and flexible
- Freedom-loving
- Curious and energetic

**Strengths:** Adaptability, versatility, resourcefulness, adventure
**Challenges:** Restlessness, inconsistency, impulsiveness, fear of commitment

**Career Paths:** Travel writer, sales, public relations, journalist, entrepreneur

**Famous Life Path 5s:** Beyonce, Angelina Jolie, Abraham Lincoln

Life Path 5s are here to experience life fully and teach others about freedom and change.`,
        keyPoints: [
          'Freedom seekers and adventurers',
          'Highly adaptable and versatile',
          'Crave variety and new experiences',
          'Need grounding to avoid restlessness'
        ]
      },
      {
        id: 'lp-6',
        title: 'Life Path 6: The Nurturer',
        duration: '4 min',
        content: `Life Path 6 individuals are natural caregivers devoted to family and community.

**Core Traits:**
- Nurturing and caring
- Responsible and protective
- Harmonious and balanced
- Artistic and creative

**Strengths:** Caregiving, responsibility, harmony, teaching
**Challenges:** Over-giving, perfectionism, worry, meddling

**Career Paths:** Teacher, nurse, counselor, designer, chef, social worker

**Famous Life Path 6s:** John Lennon, Victoria Beckham, Stevie Wonder

Life Path 6s are here to nurture and create beauty and harmony in their environment.`,
        keyPoints: [
          'Natural nurturers and caregivers',
          'Devoted to family and community',
          'Create beauty and harmony',
          'Must avoid over-giving and perfectionism'
        ]
      },
      {
        id: 'lp-7',
        title: 'Life Path 7: The Seeker',
        duration: '4 min',
        content: `Life Path 7 individuals are deep thinkers who seek truth and wisdom.

**Core Traits:**
- Analytical and intellectual
- Spiritual and introspective
- Intuitive and perceptive
- Independent and private

**Strengths:** Analysis, research, spirituality, wisdom
**Challenges:** Isolation, cynicism, over-thinking, difficulty trusting

**Career Paths:** Scientist, researcher, philosopher, spiritual teacher, analyst

**Famous Life Path 7s:** Princess Diana, Elon Musk, Leonardo DiCaprio

Life Path 7s are here to seek deeper truths and share their wisdom with the world.`,
        keyPoints: [
          'Deep thinkers and truth seekers',
          'Highly analytical and intuitive',
          'Need solitude for inner work',
          'Balance isolation with connection'
        ]
      },
      {
        id: 'lp-8',
        title: 'Life Path 8: The Powerhouse',
        duration: '4 min',
        content: `Life Path 8 individuals are ambitious achievers focused on material success and power.

**Core Traits:**
- Ambitious and goal-oriented
- Business-minded and practical
- Authoritative and confident
- Resilient and determined

**Strengths:** Business acumen, leadership, manifestation, abundance
**Challenges:** Workaholism, materialism, control issues, burnout

**Career Paths:** CEO, banker, lawyer, real estate, politician, investor

**Famous Life Path 8s:** Nelson Mandela, Pablo Picasso, Sandra Bullock

Life Path 8s are here to master the material world and use their power for good.`,
        keyPoints: [
          'Ambitious achievers and leaders',
          'Natural business and financial sense',
          'Powerful manifestors of abundance',
          'Must balance material with spiritual'
        ]
      },
      {
        id: 'lp-9',
        title: 'Life Path 9: The Humanitarian',
        duration: '4 min',
        content: `Life Path 9 individuals are compassionate souls devoted to serving humanity.

**Core Traits:**
- Compassionate and generous
- Idealistic and humanitarian
- Creative and artistic
- Wise and understanding

**Strengths:** Compassion, wisdom, creativity, philanthropy
**Challenges:** Martyrdom, resentment, letting go, boundaries

**Career Paths:** Nonprofit leader, artist, healer, teacher, humanitarian

**Famous Life Path 9s:** Mahatma Gandhi, Mother Teresa, Jim Carrey

Life Path 9s are here to serve humanity and leave the world better than they found it.`,
        keyPoints: [
          'Compassionate humanitarians',
          'Devoted to serving others',
          'Old souls with deep wisdom',
          'Must learn healthy boundaries'
        ]
      },
      {
        id: 'lp-11',
        title: 'Master Number 11: The Inspirer',
        duration: '4 min',
        content: `Master Number 11 is known as "The Inspirer" - a highly intuitive and spiritually aware soul.

**Core Traits:**
- Highly intuitive and psychic
- Inspiring and visionary
- Sensitive and empathic
- Charismatic and magnetic

**Strengths:** Intuition, inspiration, spiritual insight, healing
**Challenges:** Anxiety, overwhelm, nervous energy, self-doubt

**Career Paths:** Spiritual teacher, psychic, artist, inventor, leader

**Famous Life Path 11s:** Barack Obama, Madonna, Prince William

Master 11s carry the energy of 2 but amplified. They are here to inspire and enlighten others.`,
        keyPoints: [
          'Highly intuitive and spiritually gifted',
          'Natural inspirers and visionaries',
          'Carry amplified energy of 2',
          'Must manage sensitivity and anxiety'
        ]
      },
      {
        id: 'lp-22',
        title: 'Master Number 22: The Master Builder',
        duration: '4 min',
        content: `Master Number 22 is called "The Master Builder" - capable of turning dreams into reality on a grand scale.

**Core Traits:**
- Visionary and practical
- Ambitious and disciplined
- Capable of great achievements
- Methodical and systematic

**Strengths:** Building empires, manifesting visions, leadership, discipline
**Challenges:** Pressure, perfectionism, overwhelm, fear of failure

**Career Paths:** Architect, politician, international business, major nonprofit

**Famous Life Path 22s:** Sir Paul McCartney, Will Smith, Tina Fey

Master 22s carry amplified 4 energy. They can build lasting legacies that benefit humanity.`,
        keyPoints: [
          'Master builders of grand visions',
          'Turn dreams into tangible reality',
          'Carry amplified energy of 4',
          'Must not be overwhelmed by potential'
        ]
      },
      {
        id: 'lp-33',
        title: 'Master Number 33: The Master Teacher',
        duration: '5 min',
        content: `Master Number 33 is the rarest and most spiritually evolved - "The Master Teacher."

**Core Traits:**
- Deeply compassionate
- Spiritually evolved
- Natural healer and teacher
- Selflessly devoted to others

**Strengths:** Healing, teaching, unconditional love, spiritual mastery
**Challenges:** Self-sacrifice, martyrdom, carrying others' burdens

**Career Paths:** Spiritual leader, healer, counselor, humanitarian leader

**Famous Life Path 33s:** Albert Einstein, Stephen King, Meryl Streep

Master 33s combine the intuition of 11 and building ability of 22. They are here to uplift humanity through love.`,
        keyPoints: [
          'The rarest master number',
          'Master teachers and healers',
          'Combines 11 intuition + 22 building',
          'Must avoid martyrdom and self-sacrifice'
        ]
      }
    ]
  },
  {
    id: 'chinese-elements',
    title: 'Chinese Zodiac Elements',
    description: 'Understanding the five elements and their influence on personality',
    duration: '30 min',
    free: false,
    lessons: [
      {
        id: 'elem-1',
        title: 'Introduction to the Five Elements',
        duration: '4 min',
        content: `The Five Elements are fundamental to Chinese philosophy and astrology. They represent the basic forces of nature and how energy flows.

**The Five Elements:**
1. **Wood** - Growth, creativity, expansion
2. **Fire** - Passion, transformation, energy
3. **Earth** - Stability, nurturing, grounding
4. **Metal** - Precision, clarity, refinement
5. **Water** - Wisdom, adaptability, flow

Each element cycles every 10 years (2 years per element), and your birth year determines your dominant element.

Understanding your element helps explain your natural tendencies and how you interact with the world.`,
        keyPoints: [
          'Five elements: Wood, Fire, Earth, Metal, Water',
          'Each represents different life forces',
          '10-year elemental cycle (2 years each)',
          'Birth year determines your element'
        ]
      },
      {
        id: 'elem-2',
        title: 'Wood Element: The Creator',
        duration: '3 min',
        content: `Wood element people are natural creators and visionaries, like a tree growing toward the sun.

**Years:** 1984-85, 1994-95, 2004-05, 2014-15, 2024-25

**Characteristics:**
- Creative and innovative
- Growth-oriented
- Compassionate and generous
- Competitive and ambitious

**Strengths:** Vision, creativity, benevolence, flexibility
**Weaknesses:** Anger, impatience, over-extension

**Compatible Elements:** Water (nourishes), Fire (feeds)
**Challenging Elements:** Metal (cuts), Earth (depletes)`,
        keyPoints: [
          'Creative visionaries and growers',
          'Compassionate and generous nature',
          'Need to manage anger and impatience',
          'Thrive with Water and Fire elements'
        ]
      },
      {
        id: 'elem-3',
        title: 'Fire Element: The Transformer',
        duration: '3 min',
        content: `Fire element people are passionate transformers, radiating warmth and energy like a blazing flame.

**Years:** 1986-87, 1996-97, 2006-07, 2016-17, 2026-27

**Characteristics:**
- Passionate and enthusiastic
- Charismatic and inspiring
- Adventurous and bold
- Expressive and dramatic

**Strengths:** Passion, joy, leadership, transformation
**Weaknesses:** Impulsiveness, aggression, burnout

**Compatible Elements:** Wood (fuels), Earth (grounds)
**Challenging Elements:** Water (extinguishes), Metal (melts)`,
        keyPoints: [
          'Passionate and charismatic leaders',
          'Radiate warmth and inspiration',
          'Must avoid burnout and impulsiveness',
          'Thrive with Wood and Earth elements'
        ]
      },
      {
        id: 'elem-4',
        title: 'Earth Element: The Stabilizer',
        duration: '3 min',
        content: `Earth element people are natural stabilizers, providing grounding and nurturing like the solid ground beneath us.

**Years:** 1988-89, 1998-99, 2008-09, 2018-19, 2028-29

**Characteristics:**
- Stable and reliable
- Nurturing and supportive
- Practical and grounded
- Patient and methodical

**Strengths:** Stability, reliability, nurturing, practicality
**Weaknesses:** Stubbornness, worry, over-protectiveness

**Compatible Elements:** Fire (creates), Metal (produces)
**Challenging Elements:** Wood (depletes), Water (erodes)`,
        keyPoints: [
          'Stable and reliable nurturers',
          'Provide grounding for others',
          'Must avoid excessive worry',
          'Thrive with Fire and Metal elements'
        ]
      },
      {
        id: 'elem-5',
        title: 'Metal Element: The Refiner',
        duration: '3 min',
        content: `Metal element people are natural refiners, seeking perfection and clarity like a polished blade.

**Years:** 1980-81, 1990-91, 2000-01, 2010-11, 2020-21

**Characteristics:**
- Precise and detail-oriented
- Disciplined and organized
- Just and fair
- Determined and focused

**Strengths:** Clarity, discipline, justice, determination
**Weaknesses:** Rigidity, grief, criticism, coldness

**Compatible Elements:** Earth (produces), Water (refines)
**Challenging Elements:** Fire (melts), Wood (controls)`,
        keyPoints: [
          'Precise and disciplined refiners',
          'Seek clarity and perfection',
          'Must avoid rigidity and criticism',
          'Thrive with Earth and Water elements'
        ]
      },
      {
        id: 'elem-6',
        title: 'Water Element: The Philosopher',
        duration: '3 min',
        content: `Water element people are natural philosophers, flowing with wisdom and adaptability like a river.

**Years:** 1982-83, 1992-93, 2002-03, 2012-13, 2022-23

**Characteristics:**
- Wise and intuitive
- Adaptable and flexible
- Diplomatic and communicative
- Deep and mysterious

**Strengths:** Wisdom, intuition, diplomacy, flow
**Weaknesses:** Fear, indecision, manipulation, isolation

**Compatible Elements:** Metal (creates), Wood (nourishes)
**Challenging Elements:** Earth (blocks), Fire (evaporates)`,
        keyPoints: [
          'Wise and intuitive philosophers',
          'Highly adaptable and diplomatic',
          'Must overcome fear and indecision',
          'Thrive with Metal and Wood elements'
        ]
      },
      {
        id: 'elem-7',
        title: 'Element Cycles: Creation and Control',
        duration: '5 min',
        content: `The elements interact in two main cycles that explain compatibility and conflict:

**Creation Cycle (Supportive):**
- Wood feeds Fire
- Fire creates Earth (ash)
- Earth produces Metal
- Metal carries Water
- Water nourishes Wood

**Control Cycle (Challenging):**
- Wood depletes Earth
- Earth blocks Water
- Water extinguishes Fire
- Fire melts Metal
- Metal cuts Wood

Understanding these cycles helps predict relationship dynamics and energy interactions.`,
        keyPoints: [
          'Creation cycle shows supportive flow',
          'Control cycle shows challenging dynamics',
          'Use cycles to understand relationships',
          'Balance elements for harmony'
        ]
      },
      {
        id: 'elem-8',
        title: 'Balancing Your Element',
        duration: '6 min',
        content: `Every element has strengths and weaknesses. Here is how to balance each:

**Wood Balance:** Channel creativity productively. Practice patience. Spend time in nature.

**Fire Balance:** Ground your passion with routine. Rest to avoid burnout. Practice mindfulness.

**Earth Balance:** Set boundaries. Avoid over-worrying. Trust the process.

**Metal Balance:** Practice flexibility. Connect emotionally. Let go of perfectionism.

**Water Balance:** Take action despite fear. Set clear intentions. Maintain boundaries.

You can also support your element by incorporating colors, foods, and activities associated with supportive elements.`,
        keyPoints: [
          'Each element needs specific balancing',
          'Use supportive elements to strengthen',
          'Colors, foods, activities can help',
          'Self-awareness is key to balance'
        ]
      }
    ]
  },
  {
    id: 'compatibility',
    title: 'Compatibility Analysis',
    description: 'How to read and interpret compatibility scores effectively',
    duration: '40 min',
    free: false,
    lessons: [
      {
        id: 'compat-1',
        title: 'Understanding Compatibility in GG33',
        duration: '4 min',
        content: `Compatibility in GG33 is measured through multiple factors, creating a comprehensive picture of how two energies interact.

**Key Compatibility Factors:**
1. Life Path Number compatibility
2. Chinese Zodiac animal harmony
3. Elemental balance
4. Energy type alignment

No single factor determines compatibility. The combination reveals:
- Natural chemistry and attraction
- Communication styles
- Potential challenges
- Growth opportunities

High compatibility does not guarantee success, and low compatibility does not mean failure. Awareness enables navigation.`,
        keyPoints: [
          'Multiple factors create compatibility score',
          'Life Path, Zodiac, Element all matter',
          'High scores show natural harmony',
          'Awareness helps navigate any pairing'
        ]
      },
      {
        id: 'compat-2',
        title: 'Life Path Compatibility Basics',
        duration: '4 min',
        content: `Certain Life Path numbers naturally harmonize while others create friction:

**Natural Matches:**
- 1 & 5: Adventure and independence
- 2 & 6: Nurturing and harmony
- 3 & 9: Creativity and compassion
- 4 & 8: Building and ambition
- 7 & 7: Deep spiritual connection

**Challenging Matches:**
- 1 & 8: Power struggles
- 4 & 5: Stability vs freedom conflict
- 3 & 4: Spontaneity vs structure

**Growth Matches:**
- 1 & 2: Learning balance
- 5 & 6: Freedom meets responsibility
- 7 & 3: Depth meets expression`,
        keyPoints: [
          'Some numbers naturally harmonize',
          'Challenging matches create growth',
          'Same numbers can be powerful or competitive',
          'Master numbers add intensity'
        ]
      },
      {
        id: 'compat-3',
        title: 'Chinese Zodiac Compatibility',
        duration: '4 min',
        content: `The 12 animals form compatibility groups based on their position in the zodiac:

**Triangle Compatibilities (Best Matches):**
- Rat, Dragon, Monkey (ambitious achievers)
- Ox, Snake, Rooster (methodical thinkers)
- Tiger, Horse, Dog (action-oriented)
- Rabbit, Goat, Pig (peaceful creators)

**Opposite Signs (Challenging):**
- Rat vs Horse
- Ox vs Goat
- Tiger vs Monkey
- Rabbit vs Rooster
- Dragon vs Dog
- Snake vs Pig

Opposite signs can create powerful attractions but require more effort to maintain harmony.`,
        keyPoints: [
          'Triangle groups are naturally compatible',
          'Opposite signs create tension and attraction',
          'Adjacent signs have moderate compatibility',
          'Same sign can compete or complement'
        ]
      },
      {
        id: 'compat-4',
        title: 'Element Compatibility in Relationships',
        duration: '4 min',
        content: `Elements interact in relationships just as they do in nature:

**Harmonious Element Pairings:**
- Wood + Water: Nurturing growth
- Fire + Wood: Passionate inspiration
- Earth + Fire: Grounded passion
- Metal + Earth: Structured stability
- Water + Metal: Flowing clarity

**Challenging Element Pairings:**
- Water + Fire: Steam and conflict
- Metal + Wood: Cutting criticism
- Earth + Wood: Depleting energy
- Fire + Metal: Intense transformation
- Water + Earth: Blocked flow

Understanding elemental dynamics helps navigate emotional patterns in relationships.`,
        keyPoints: [
          'Creation cycle elements support each other',
          'Control cycle elements create friction',
          'Elemental balance can be cultivated',
          'Awareness helps manage conflicts'
        ]
      },
      {
        id: 'compat-5',
        title: 'Reading a Compatibility Report',
        duration: '4 min',
        content: `When analyzing a GG33 compatibility report, look for:

**Overall Score:** A percentage showing general harmony. Above 70% indicates strong natural compatibility.

**Breakdown Sections:**
- Life Path Match: Core personality alignment
- Element Balance: Emotional dynamics
- Zodiac Harmony: Behavioral patterns
- Energy Flow: How you energize each other

**Key Insights:**
- Strengths: Where you naturally sync
- Challenges: Potential friction points
- Growth Areas: What you can teach each other
- Recommendations: How to optimize the relationship`,
        keyPoints: [
          '70%+ indicates strong compatibility',
          'Review each breakdown section',
          'Note both strengths and challenges',
          'Use recommendations for growth'
        ]
      },
      {
        id: 'compat-6',
        title: 'Romantic Compatibility',
        duration: '4 min',
        content: `Romantic relationships require specific compatibility factors:

**Attraction Factors:**
- Complementary elements create chemistry
- Same Life Path can be magnetic
- Opposite zodiacs often attract initially

**Long-term Success Factors:**
- Life Path values alignment
- Emotional element balance
- Communication style harmony
- Shared growth direction

**Red Flags to Watch:**
- Control cycle elements without awareness
- Extreme number differences (1 vs 2)
- Competing same numbers without cooperation

The best romantic matches combine attraction with long-term compatibility.`,
        keyPoints: [
          'Attraction and compatibility differ',
          'Long-term success needs value alignment',
          'Communication styles must work together',
          'Awareness transforms challenges'
        ]
      },
      {
        id: 'compat-7',
        title: 'Business & Professional Compatibility',
        duration: '4 min',
        content: `Business partnerships require different compatibility factors than romance:

**Ideal Business Pairings:**
- 1 + 4: Visionary + Builder
- 3 + 8: Creative + Business-minded
- 2 + 1: Diplomat + Leader
- 5 + 7: Promoter + Strategist
- 6 + 4: Nurturer + Organizer

**Elements in Business:**
- Wood + Metal: Vision + Execution
- Fire + Earth: Passion + Stability
- Water + Fire: Strategy + Action

**Team Compatibility:**
Balance of numbers creates well-rounded teams. Avoid too many same numbers competing.`,
        keyPoints: [
          'Business needs complementary skills',
          'Balance visionaries with builders',
          'Element harmony affects work style',
          'Diverse teams outperform same-number groups'
        ]
      },
      {
        id: 'compat-8',
        title: 'Family Compatibility',
        duration: '4 min',
        content: `Family dynamics are influenced by generational patterns:

**Parent-Child Compatibility:**
- Similar numbers create understanding
- Different numbers offer growth lessons
- Element cycles affect emotional bonds

**Sibling Dynamics:**
- Same numbers may compete
- Complementary numbers support each other
- Birth order adds another layer

**Multi-Generational Patterns:**
- Master numbers often run in families
- Element cycles can repeat
- Understanding helps heal family wounds

Family is where we learn our first compatibility lessons. Awareness helps break negative patterns.`,
        keyPoints: [
          'Family patterns teach compatibility',
          'Parent-child dynamics follow number rules',
          'Sibling relationships show early patterns',
          'Awareness breaks negative cycles'
        ]
      },
      {
        id: 'compat-9',
        title: 'Self-Compatibility: Inner Balance',
        duration: '4 min',
        content: `The most important compatibility is with yourself:

**Internal Harmony:**
Your Life Path, Expression, and Soul Urge numbers should work together. Internal conflicts create life challenges.

**Element Balance:**
Your dominant element needs supporting elements in your environment, activities, and relationships.

**Shadow Work:**
Each number has shadow traits. Integrating your shadow creates self-compatibility.

**Signs of Self-Compatibility:**
- Confidence in decisions
- Authentic expression
- Attracting aligned relationships
- Inner peace despite external chaos`,
        keyPoints: [
          'Self-compatibility is foundational',
          'Internal number harmony matters',
          'Shadow integration creates balance',
          'Self-aligned people attract better matches'
        ]
      },
      {
        id: 'compat-10',
        title: 'Working with Low Compatibility',
        duration: '4 min',
        content: `Low compatibility is not destiny. Here is how to navigate it:

**Awareness Strategies:**
1. Identify specific friction points
2. Understand each other's core needs
3. Create communication bridges
4. Celebrate differences

**Practical Tools:**
- Use compatible elements to balance
- Find shared values beyond numbers
- Create rituals that honor both energies
- Seek outside support when needed

**Growth Mindset:**
Low compatibility relationships often teach the most profound lessons. The challenge is the curriculum.`,
        keyPoints: [
          'Low compatibility can still work',
          'Awareness is the key to navigation',
          'Use supporting elements to balance',
          'Challenges become growth opportunities'
        ]
      }
    ]
  },
  {
    id: 'daily-energy',
    title: 'Daily Energy Cycles',
    description: 'Master the art of using daily energy for optimal decision-making',
    duration: '35 min',
    free: false,
    lessons: [
      {
        id: 'daily-1',
        title: 'Understanding Personal Day Numbers',
        duration: '4 min',
        content: `Your Personal Day Number reveals the energy available each day for specific activities.

**How to Calculate:**
Personal Year + Personal Month + Calendar Day = Personal Day

**Example:** If today is the 15th, your Personal Month is 7, and Personal Year is 3:
3 + 7 + 15 = 25 → 2 + 5 = 7 (Personal Day 7)

**Personal Day Meanings:**
- 1: New beginnings, initiative
- 2: Cooperation, patience
- 3: Creativity, expression
- 4: Work, organization
- 5: Change, adventure
- 6: Home, responsibility
- 7: Reflection, research
- 8: Business, finance
- 9: Completion, release`,
        keyPoints: [
          'Personal Day shows daily energy',
          'Calculate from Year + Month + Day',
          'Each number has specific best uses',
          'Align activities with daily energy'
        ]
      },
      {
        id: 'daily-2',
        title: 'Personal Year Cycles',
        duration: '4 min',
        content: `Your Personal Year sets the theme for the entire year. It cycles 1-9.

**Calculate Your Personal Year:**
Birth Month + Birth Day + Current Year digits

**Example:** Birthday March 15, Year 2024:
3 + 15 + 2024 → 3 + 1 + 5 + 2 + 0 + 2 + 4 = 17 → 1 + 7 = 8 (Personal Year 8)

**Personal Year Themes:**
- Year 1: New beginnings, fresh starts
- Year 2: Partnerships, patience
- Year 3: Creativity, social expansion
- Year 4: Foundation building, hard work
- Year 5: Change, freedom, travel
- Year 6: Home, family, responsibility
- Year 7: Reflection, spiritual growth
- Year 8: Achievement, abundance
- Year 9: Completion, release`,
        keyPoints: [
          'Personal Year sets annual theme',
          'Cycles through 1-9 over nine years',
          'Major decisions align with year energy',
          'Year 9 ends cycles before Year 1 restart'
        ]
      },
      {
        id: 'daily-3',
        title: 'Universal Day Energy',
        duration: '4 min',
        content: `Universal Day energy affects everyone and combines with your Personal Day.

**Calculate Universal Day:**
Add the digits of today's full date (Month + Day + Year)

**Example:** December 6, 2024:
1 + 2 + 6 + 2 + 0 + 2 + 4 = 17 → 1 + 7 = 8 (Universal Day 8)

**Using Universal + Personal Days:**
Your Personal Day energy is influenced by the Universal Day. When they match, that energy is amplified.

**Universal Days for:**
- Starting projects: 1, 8
- Collaboration: 2, 6
- Creativity: 3, 5
- Planning: 4, 7
- Completion: 9`,
        keyPoints: [
          'Universal Day affects everyone',
          'Combines with Personal Day',
          'Matching numbers amplify energy',
          'Plan important events accordingly'
        ]
      },
      {
        id: 'daily-4',
        title: 'Optimal Days for Major Decisions',
        duration: '4 min',
        content: `Match your activities to favorable daily energies:

**Business Decisions:**
- Best: Days 1, 4, 8
- Avoid: Day 5 (too changeable), Day 7 (needs reflection)

**Relationship Talks:**
- Best: Days 2, 6
- Avoid: Day 1 (too self-focused), Day 5 (unsettled)

**Creative Projects:**
- Best: Days 3, 5
- Avoid: Day 4 (too rigid), Day 8 (too business-focused)

**Spiritual Practices:**
- Best: Days 7, 9, 11
- Avoid: Day 4 (too material), Day 8 (worldly focus)

**Endings/Letting Go:**
- Best: Day 9
- Avoid: Day 1 (beginning energy)`,
        keyPoints: [
          'Match activities to day energy',
          'Avoid conflicting energies',
          'Major decisions need aligned days',
          'Flexibility allows for adjustments'
        ]
      },
      {
        id: 'daily-5',
        title: 'Monthly Energy Patterns',
        duration: '4 min',
        content: `Personal Month energy provides a broader context for your weeks.

**Calculate Personal Month:**
Personal Year + Calendar Month

**Example:** Personal Year 8, October (10):
8 + 10 = 18 → 1 + 8 = 9 (Personal Month 9)

**Monthly Themes:**
- Month 1: Set intentions, start projects
- Month 2: Build relationships, be patient
- Month 3: Express yourself, be social
- Month 4: Organize, create systems
- Month 5: Embrace change, travel
- Month 6: Focus on home, family
- Month 7: Rest, reflect, research
- Month 8: Push for achievement
- Month 9: Complete, release, prepare

Personal Days operate within your Monthly energy framework.`,
        keyPoints: [
          'Monthly energy sets weekly context',
          'Personal Month = Year + Calendar Month',
          'Plan big projects across months',
          'Days work within monthly themes'
        ]
      },
      {
        id: 'daily-6',
        title: 'Weekly Energy Planning',
        duration: '4 min',
        content: `Each day of the week carries its own energy that combines with your numbers:

**Weekday Energies:**
- **Monday** (Moon): Emotions, intuition, new week intentions
- **Tuesday** (Mars): Action, courage, tackling challenges
- **Wednesday** (Mercury): Communication, meetings, learning
- **Thursday** (Jupiter): Expansion, luck, big thinking
- **Friday** (Venus): Relationships, creativity, pleasure
- **Saturday** (Saturn): Structure, discipline, practical work
- **Sunday** (Sun): Rest, reflection, spiritual renewal

Combine weekday energy with your Personal Day for optimal planning.`,
        keyPoints: [
          'Each weekday has planetary energy',
          'Combine with Personal Day numbers',
          'Monday for intentions, Friday for relationships',
          'Sunday for rest and reflection'
        ]
      },
      {
        id: 'daily-7',
        title: 'Void and Power Days',
        duration: '4 min',
        content: `Some days carry special significance in your cycle:

**Power Days:**
When your Personal Day matches your Life Path, you're in alignment. Example: Life Path 4 on Personal Day 4.
- Energy is amplified
- Actions have more impact
- Stay aligned with your purpose

**Void Days:**
Day 5 can feel scattered for everyone. Day 9 endings can feel heavy.
- Use for rest and reflection
- Avoid major commitments
- Good for completion, not initiation

**Master Number Days:**
Days 11, 22, 33 carry spiritual intensity.
- Heightened intuition
- Greater responsibility
- Potential for breakthrough or overwhelm`,
        keyPoints: [
          'Power Days match Life Path energy',
          'Void Days need careful navigation',
          'Master Number Days are intense',
          'Use each day type appropriately'
        ]
      },
      {
        id: 'daily-8',
        title: 'Creating Your Energy Calendar',
        duration: '4 min',
        content: `Build a personal energy calendar for optimal planning:

**Step 1:** Calculate your Personal Year for this year
**Step 2:** Calculate Personal Month for each month
**Step 3:** Mark important dates and their Personal Day energies
**Step 4:** Identify Power Days (matching Life Path)
**Step 5:** Note Master Number Days (11, 22)

**Calendar Tips:**
- Schedule launches on Day 1 or 8
- Book important meetings on Day 2 or 6
- Take breaks on Day 7 or 9
- Use Day 4 for admin and planning
- Embrace change on Day 5

Review your calendar weekly to align activities with energy.`,
        keyPoints: [
          'Calculate Personal Year first',
          'Map months and important days',
          'Mark Power Days and Master Days',
          'Review weekly for alignment'
        ]
      },
      {
        id: 'daily-9',
        title: 'Integrating Chinese Calendar',
        duration: '3 min',
        content: `The Chinese calendar adds another layer to daily energy:

**Lucky and Unlucky Days:**
Traditional Chinese calendars mark auspicious and inauspicious days for activities like:
- Marriage
- Moving
- Starting business
- Travel

**Lunar Phases:**
- New Moon: New beginnings
- Full Moon: Culmination, release
- Waxing: Growing, building
- Waning: Releasing, completing

**Combining Systems:**
Use Numerology for personal timing and Chinese calendar for collective timing. Both aligned = optimal.`,
        keyPoints: [
          'Chinese calendar marks auspicious days',
          'Lunar phases affect energy',
          'New Moon for beginnings, Full Moon for release',
          'Combine both systems for best results'
        ]
      }
    ]
  },
  {
    id: 'advanced-numerology',
    title: 'Advanced Numerology',
    description: 'Master numbers, personal year cycles, and advanced calculations',
    duration: '60 min',
    free: false,
    lessons: [
      {
        id: 'adv-1',
        title: 'Beyond Life Path: The Core Numbers',
        duration: '4 min',
        content: `Your complete numerology chart includes multiple core numbers:

**The Five Core Numbers:**
1. **Life Path** - Your life purpose (from birth date)
2. **Expression** - Your natural talents (from full birth name)
3. **Soul Urge** - Your heart's desire (from vowels in name)
4. **Personality** - How others see you (from consonants)
5. **Birthday** - Your special gift (from birth day only)

Each number adds depth to your profile. They can support each other or create internal tension.

A complete reading considers all five for a 360-degree view.`,
        keyPoints: [
          'Five core numbers create full profile',
          'Life Path is most important',
          'Expression comes from birth name',
          'Numbers can harmonize or conflict'
        ]
      },
      {
        id: 'adv-2',
        title: 'Calculating Expression Number',
        duration: '4 min',
        content: `Your Expression Number (also called Destiny Number) comes from your full birth name.

**Letter Values:**
A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9
S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8

**Calculation:**
1. Write your full birth certificate name
2. Convert each letter to its number
3. Add all numbers together
4. Reduce to single digit (or master number)

**Example:** "John Smith"
J(1)+O(6)+H(8)+N(5) = 20 → 2
S(1)+M(4)+I(9)+T(2)+H(8) = 24 → 6
Total: 2 + 6 = 8 (Expression 8)`,
        keyPoints: [
          'Use full birth certificate name',
          'Each letter has a number value',
          'Add all letters and reduce',
          'Expression shows your potential'
        ]
      },
      {
        id: 'adv-3',
        title: 'Soul Urge and Personality Numbers',
        duration: '4 min',
        content: `These numbers reveal your inner and outer self:

**Soul Urge (Heart's Desire):**
Calculated from VOWELS only (A, E, I, O, U)
Reveals: What you truly want deep down

**Example:** "John Smith"
O(6) + I(9) = 15 → 1 + 5 = 6 (Soul Urge 6)
This person deeply desires home, family, and harmony.

**Personality Number:**
Calculated from CONSONANTS only
Reveals: How others perceive you, your outer mask

**Example:** "John Smith"
J(1)+H(8)+N(5)+S(1)+M(4)+T(2)+H(8) = 29 → 11 (Personality 11)
Others see this person as inspiring and intuitive.`,
        keyPoints: [
          'Soul Urge = vowels only',
          'Personality = consonants only',
          'Soul Urge is your deepest desire',
          'Personality is your public image'
        ]
      },
      {
        id: 'adv-4',
        title: 'Karmic Debt Numbers',
        duration: '4 min',
        content: `Karmic Debt numbers indicate lessons carried from past lives:

**The Karmic Debt Numbers:** 13, 14, 16, 19

**13/4 - Karmic Debt of Laziness:**
Past life of avoiding work. This life requires extra effort and discipline.

**14/5 - Karmic Debt of Control:**
Past life of abusing freedom. This life teaches responsible freedom.

**16/7 - Karmic Debt of Ego:**
Past life of vanity. This life humbles through ego destruction.

**19/1 - Karmic Debt of Selfishness:**
Past life of self-centeredness. This life teaches through isolation until selflessness is learned.

If these numbers appear in your core calculations (before reducing), you carry this karmic lesson.`,
        keyPoints: [
          'Karmic Debts indicate past life lessons',
          '13, 14, 16, 19 are karmic numbers',
          'They appear before final reduction',
          'Each carries specific challenges'
        ]
      },
      {
        id: 'adv-5',
        title: 'Karmic Lessons and Missing Numbers',
        duration: '4 min',
        content: `Karmic Lessons come from numbers missing in your name:

**Finding Missing Numbers:**
1. Write your full birth name
2. Convert all letters to numbers
3. Note which numbers 1-9 are NOT present

**Karmic Lesson Meanings:**
- Missing 1: Learning self-reliance
- Missing 2: Learning cooperation
- Missing 3: Learning self-expression
- Missing 4: Learning discipline
- Missing 5: Learning adaptability
- Missing 6: Learning responsibility
- Missing 7: Learning faith
- Missing 8: Learning personal power
- Missing 9: Learning compassion

Multiple missing numbers indicate multiple lessons to master.`,
        keyPoints: [
          'Missing numbers show karmic lessons',
          'Find which 1-9 are absent from name',
          'Each missing number is a life lesson',
          'Work consciously on missing energies'
        ]
      },
      {
        id: 'adv-6',
        title: 'Pinnacles and Challenges',
        duration: '5 min',
        content: `Your life divides into four major periods called Pinnacles, each with a Challenge:

**Calculating Pinnacles:**
- First Pinnacle: Month + Day
- Second Pinnacle: Day + Year
- Third Pinnacle: First + Second
- Fourth Pinnacle: Month + Year

**Pinnacle Timing:**
- First: Birth to age 36 minus Life Path
- Second: Next 9 years
- Third: Next 9 years
- Fourth: Remainder of life

**Challenges:**
Subtract the same pairs to find the lesson during each period.

Pinnacles show opportunities; Challenges show what to overcome.`,
        keyPoints: [
          'Four Pinnacles divide your life',
          'Each has opportunities and challenges',
          'Calculate from birth date elements',
          'Timing based on Life Path number'
        ]
      },
      {
        id: 'adv-7',
        title: 'Personal Year Forecasting',
        duration: '4 min',
        content: `Advanced Personal Year analysis provides detailed life forecasting:

**9-Year Cycle Overview:**
- Years 1-3: Planting (initiation, growth, expression)
- Years 4-6: Cultivating (building, change, responsibility)
- Years 7-9: Harvesting (reflection, reward, completion)

**Year Transitions:**
Major life changes often occur during:
- Year 1: New chapter begins
- Year 5: Mid-cycle upheaval
- Year 9: Major endings

**Multiple Cycle Awareness:**
You're always in multiple cycles: Personal Year, Month, Day, and longer Pinnacle cycles. Master readers track all levels.`,
        keyPoints: [
          '9-year cycle has three phases',
          'Years 1, 5, 9 are transition points',
          'Multiple cycles operate simultaneously',
          'Track long and short-term patterns'
        ]
      },
      {
        id: 'adv-8',
        title: 'Name Analysis and Changes',
        duration: '4 min',
        content: `Names carry vibration, and changes affect your numerology:

**Birth Name:**
Always remains your core vibration, even if you change your name.

**Current Name (if different):**
Adds a new vibration layer. Does not replace birth name energy.

**Married Names:**
Adding spouse's surname adds their family energy to yours.

**Stage Names/Nicknames:**
Can be chosen strategically to enhance certain numbers.

**Changing Names Intentionally:**
Some people change spelling to adjust their Expression Number. Example: "Jon" vs "John" creates different vibrations.

Always honor your birth name as the foundation.`,
        keyPoints: [
          'Birth name is core vibration forever',
          'New names add energy layers',
          'Marriage adds family vibration',
          'Strategic spelling changes are possible'
        ]
      },
      {
        id: 'adv-9',
        title: 'Master Numbers Deep Dive',
        duration: '5 min',
        content: `Master Numbers carry higher vibration and responsibility:

**11 - The Intuitive Master:**
Doubled 1 energy with spiritual purpose. Channel: Inspiration, psychic ability, teaching.

**22 - The Architect Master:**
Doubled 2 energy with building power. Channel: Large-scale projects, global impact.

**33 - The Teacher Master:**
Doubled 3 energy with healing ability. Channel: Selfless service, spiritual teaching.

**44 - The Healer Master:**
Rare. Doubled 4 with manifesting power. Channel: Building systems that heal.

**Living Master Number Energy:**
Not everyone with these numbers lives their potential. Unrealized master numbers operate as their reduced form (11→2, 22→4, 33→6).`,
        keyPoints: [
          'Master Numbers are 11, 22, 33 (and 44)',
          'Carry higher potential and responsibility',
          'Must be consciously developed',
          'Unrealized masters live reduced energy'
        ]
      },
      {
        id: 'adv-10',
        title: 'Repeating Numbers and Synchronicity',
        duration: '4 min',
        content: `Seeing repeating numbers is not coincidence - it's communication:

**Common Repeating Patterns:**
- 111: New beginnings, manifest thoughts
- 222: Balance, partnerships coming
- 333: Ascended masters supporting you
- 444: Angels protecting, keep going
- 555: Major change approaching
- 666: Balance material and spiritual
- 777: Spiritual breakthrough
- 888: Abundance incoming
- 999: Cycle completing

**Personal Number Appearances:**
Seeing your Life Path number repeatedly is confirmation you're on path.

**How to Use:**
Notice when they appear. What were you thinking? That's the message context.`,
        keyPoints: [
          'Repeating numbers are messages',
          'Each pattern has meaning',
          'Context of appearance matters',
          'Your Life Path appearing = confirmation'
        ]
      },
      {
        id: 'adv-11',
        title: 'Numerology and Major Life Events',
        duration: '4 min',
        content: `Timing major life events using numerology:

**Optimal Timing:**
- Marriage: Year 2, 6, or 9 (6 is ideal)
- Starting Business: Year 1 or 8
- Having Children: Year 3 or 6
- Moving: Year 5
- Career Change: Year 1 or 5
- Retirement: Year 7 or 9

**Challenging Years:**
- Year 4: Avoid major risks, focus on building
- Year 7: Introspection, not action
- Year 9: Endings, not beginnings

**Combining with Partner:**
For relationships, consider both people's cycles. Both in Year 2 or 6 is excellent for commitment.`,
        keyPoints: [
          'Match life events to cycle energy',
          'Some years favor specific activities',
          'Avoid certain actions in wrong years',
          'Partner cycles affect shared events'
        ]
      },
      {
        id: 'adv-12',
        title: 'Creating Complete Numerology Reports',
        duration: '4 min',
        content: `Professional numerology readings include:

**Core Profile:**
- Life Path Number
- Expression Number
- Soul Urge Number
- Personality Number
- Birthday Number

**Timing Analysis:**
- Current Personal Year
- Current Personal Month
- Pinnacle and Challenge period
- Upcoming transitions

**Karmic Analysis:**
- Karmic Debt Numbers (if any)
- Karmic Lessons (missing numbers)
- Past patterns and lessons

**Recommendations:**
- Best timing for goals
- Challenges to navigate
- Strengths to leverage

A complete report synthesizes all elements into actionable guidance.`,
        keyPoints: [
          'Complete reports include all core numbers',
          'Timing shows current and future cycles',
          'Karmic elements reveal deeper patterns',
          'Synthesize into practical guidance'
        ]
      },
      {
        id: 'adv-13',
        title: 'Integrating Numerology with Chinese Astrology',
        duration: '4 min',
        content: `GG33's power comes from combining both systems:

**Integration Points:**
- Life Path + Zodiac Animal = Complete personality
- Element + Numbers = Behavioral tendencies
- Personal Year + Chinese Year = Annual timing

**Example Analysis:**
Life Path 1 + Dragon = Doubly powerful leadership
Life Path 2 + Tiger = Internal conflict (peace vs action)
Life Path 8 + Monkey = Strategic brilliance

**Compatibility Enhancement:**
Use both systems for relationship analysis:
- Numerology shows communication style
- Chinese Astrology shows instinctual patterns
- Elements show emotional dynamics

**Predictive Power:**
Chinese calendar + Personal Year = Superior timing.`,
        keyPoints: [
          'Integration creates complete picture',
          'Each system reveals different layers',
          'Compatibility uses both systems',
          'Timing combines both calendars'
        ]
      },
      {
        id: 'adv-14',
        title: 'Practical Application: Daily Life',
        duration: '4 min',
        content: `Apply advanced numerology daily:

**Morning Check:**
- What is my Personal Day?
- How does it interact with Universal Day?
- What activities align?

**Decision Making:**
- Major decision? Check your cycle position
- Relationship question? Check compatibility
- Timing sensitive? Calculate optimal date

**Self-Development:**
- Working on karmic lessons consciously
- Developing master number potential
- Balancing missing number energies

**Tracking Progress:**
- Journal insights about number patterns
- Note synchronicities
- Review at year transitions

Daily practice develops intuitive numerology sense.`,
        keyPoints: [
          'Check daily numbers each morning',
          'Use cycles for decision timing',
          'Work consciously on karmic lessons',
          'Track patterns in a journal'
        ]
      },
      {
        id: 'adv-15',
        title: 'Becoming a GG33 Practitioner',
        duration: '4 min',
        content: `To master GG33 and guide others:

**Knowledge Requirements:**
- All core numerology calculations
- Chinese Zodiac animals and elements
- Compatibility analysis methods
- Timing and cycles

**Practice Requirements:**
- Calculate your own complete chart
- Practice reading for friends and family
- Track predictions and accuracy
- Continuous learning

**Ethical Guidelines:**
- Never use readings to manipulate
- Empower, don't create dependency
- Acknowledge limits of any system
- Refer to professionals when needed

**Your Journey:**
GG33 is a path of self-discovery first. Master yourself before guiding others.

Congratulations on completing Advanced Numerology!`,
        keyPoints: [
          'Master all calculations',
          'Practice reading for others',
          'Follow ethical guidelines',
          'Continue learning always'
        ]
      }
    ]
  },
  {
    id: 'master-numbers',
    title: 'Master Numbers Mastery',
    description: 'A deep dive into the burdens, blessings, and extreme power of 11, 22, and 33',
    duration: '90 min',
    free: false,
    lessons: [
      {
        id: 'mn-1',
        title: 'The Burden of the Master Number',
        duration: '5 min',
        content: `Master Numbers are not "better" than single digits—they are higher frequency, which means they are harder to handle. 

**The Price of Power:**
- Master Numbers carry more nervous energy and anxiety.
- They are often tested more severely in early life.
- If not lived up to, they "reduce" to their base vibration (11 becomes 2, 22 becomes 4, 33 becomes 6).

**Why You Were Chosen:**
If you have a Master Number, your soul chose a path of high impact. You are held to a higher standard of integrity and service. Failing to meet this standard often results in significant life friction.`,
        keyPoints: [
          'High frequency brings high anxiety',
          'Master Numbers are tested more severely',
          'Reduction happens if potential isn\'t met',
          'Held to a higher karmic standard'
        ]
      },
      {
        id: 'mn-2',
        title: 'Master Number 11: The Psychic Conduit',
        duration: '8 min',
        content: `The 11 is the first of the Master Numbers. It is the bridge between the conscious and the subconscious.

**Key Frequencies:**
- **Intuition:** 11s have a "gut feeling" that is rarely wrong.
- **Illumination:** They are here to bring light to dark situations.
- **Sensitivity:** They are often hyper-aware of their environment.

**Mastering the 11:**
To succeed as an 11, you must trust your first impression. Over-analyzing (moving into the 2 energy) will lead to indecision and "analysis paralysis." You are a conduit for messages—listen to the silence.`,
        keyPoints: [
          'Bridge between conscious and subconscious',
          'Higher level of psychic intuition',
          'Must trust first impressions over logic',
          'Prone to environmental overstimulation'
        ]
      },
      {
        id: 'mn-3',
        title: 'Master Number 22: Architect of Empires',
        duration: '8 min',
        content: `The 22 is often considered the most powerful number in the entire system. It combines the vision of the 11 with the practicality of the 4.

**The Master Builder:**
- **Visionary Realism:** You don\'t just dream; you see the blueprint.
- **Discipline:** 22s require immense self-control to manifest their grand scale.
- **Universal Benefit:** A 22\'s work should benefit more than just themselves.

**The 22 Trap:**
Because the energy is so huge, many 22s feel overwhelmed and hide in the safety of the 4 (just working a 9-5). To activate the 22, you must take calculated risks on a global or systemic level.`,
        keyPoints: [
          'Most powerful manifesting energy',
          'Combines 11 vision with 4 structure',
          'Must work on projects that benefit many',
          'Overwhelm can lead to hiding in the 4'
        ]
      },
      {
        id: 'mn-4',
        title: 'Master Number 33: The Avatar Frequency',
        duration: '10 min',
        content: `The 33 is the rarest Master Number. It is the "Master Teacher" and the "Avatar" frequency.

**The Ultimate Service:**
- **Unconditional Love:** 33s are here to teach the world how to love selflessly.
- **The Burden of Others:** They naturally attract people who need healing.
- **Spiritual Mastery:** 33s must master their own emotions before they can teach others.

**Living as a 33:**
A 33 must avoid the "Martyr Complex." You cannot help everyone. Your primary goal is to be a beacon of high-vibration energy. If you let others drain you, you will fall into the negative 6 vibration (worry and interference).`,
        keyPoints: [
          'The Master Teacher frequency',
          'Highest level of spiritual service',
          'Must guard against a martyr complex',
          'Mastery of emotions is required'
        ]
      },
      {
        id: 'mn-5',
        title: 'How to Identify Master Numbers in Your Chart',
        duration: '8 min',
        content: `Master Numbers can appear in multiple positions in your chart, and each position carries a different weight.

**Where Master Numbers Appear:**
- **Life Path:** Your core mission and life purpose. A Master Number here means your entire life journey operates at a higher frequency.
- **Expression Number:** Your natural talents. A Master Number here means you were born with amplified abilities that demand to be expressed.
- **Soul Urge:** Your deepest desire. A Master Number here creates an intense inner pull toward spiritual or humanitarian work.
- **Personality Number:** How others perceive you. A Master Number here means people sense something "different" about you immediately.
- **Birthday Number:** Your special gift. A Master Number on your birthday gives you a specific superpower.

**The Calculation Rule:**
The most common mistake is premature reduction. When calculating, you must stop reducing at 11, 22, or 33. For example, if your Life Path calculation reaches 29, you reduce to 11—NOT to 2. The intermediate step matters.

**Single vs. Multiple Master Numbers:**
Having one Master Number is significant. Having two or more is rare and creates a "pressure cooker" effect on the soul. A person with an 11 Life Path and 22 Expression is operating on two high-voltage channels simultaneously—this brings immense potential but also immense nervous strain.

**The Ghost Master Number:**
Sometimes a Master Number appears during intermediate calculation steps but reduces away in the final answer. This is called a "Ghost Master Number"—you carry its echo but not its full weight. It still influences you subtly.`,
        keyPoints: [
          'Master Numbers can appear in any of the five core positions',
          'Never reduce 11, 22, or 33 during calculation',
          'Multiple Master Numbers amplify both power and pressure',
          'Ghost Master Numbers from intermediate steps still influence you'
        ]
      },
      {
        id: 'mn-6',
        title: 'Master Number 11 in Relationships & Career',
        duration: '10 min',
        content: `The 11 operates differently in love and work than any other number. Understanding these dynamics is critical for an 11 to thrive.

**The 11 in Love:**
- **Hyper-Sensitive Partners:** 11s feel their partner\'s emotions as if they were their own. This makes them incredibly empathetic but also easily overwhelmed.
- **Need for Depth:** Small talk kills an 11. They need deep, soulful connection or they will withdraw entirely.
- **The Idealist Trap:** 11s often put partners on pedestals, then feel crushed when reality doesn\'t match the vision. They must learn to love the human, not the ideal.
- **Emotional Boundaries:** Without clear energetic boundaries, an 11 will absorb a partner\'s anxiety, depression, and anger as their own.

**Best Romantic Matches for 11:**
- **Life Path 2:** Natural harmony—the 2 provides the patience the 11 needs.
- **Life Path 6:** The nurturer grounds the 11\'s nervous energy with warmth.
- **Life Path 9:** Shared humanitarian vision creates deep spiritual partnership.
- **Another 11:** Intense but electric—two psychic conduits amplifying each other.

**Career Sectors for the 11:**
- **Counseling & Therapy:** The 11\'s intuition makes them exceptional at reading people.
- **Creative Arts:** Music, film, and writing that carries a spiritual message.
- **Spiritual Leadership:** Teaching, coaching, or guiding others on their path.
- **Media & Broadcasting:** The 11 has a natural "antenna" for what the public needs to hear.
- **Innovation:** The 11 often sees trends and shifts before anyone else.

**The Career Danger:**
An 11 in a corporate cubicle doing meaningless data entry will develop chronic anxiety, insomnia, or depression. The frequency demands meaningful output. If your work doesn\'t feel purposeful, the 11 will punish you with restlessness.`,
        keyPoints: [
          '11s absorb partner emotions and need strong boundaries',
          'Best matches are 2, 6, 9, and fellow 11s',
          'Careers must feel meaningful or anxiety intensifies',
          'Excel in counseling, arts, media, and spiritual work'
        ]
      },
      {
        id: 'mn-7',
        title: 'Master Number 22 in Business & Legacy',
        duration: '10 min',
        content: `The 22 is called the "Master Builder" because its energy is designed for large-scale, world-changing projects. Understanding how to channel this energy is the difference between building an empire and burning out.

**The 22 Business Archetype:**
- **Systems Thinker:** 22s see the entire machine, not just individual parts. They excel at creating scalable systems.
- **Long-Term Vision:** While others chase quarterly results, the 22 naturally thinks in decades.
- **Infrastructure Builder:** 22s are drawn to projects that create lasting infrastructure—companies, platforms, institutions.

**Industries Where 22s Dominate:**
- **Real Estate Development:** Building physical structures that last generations.
- **Technology Platforms:** Creating systems that millions of people use daily.
- **Government & Policy:** Shaping the rules that govern society.
- **Education Systems:** Building schools, curricula, or training programs at scale.
- **Finance & Banking:** Creating wealth management systems that serve many.

**The 22 and Delegation:**
The biggest lesson for a 22 is learning to delegate. Because they see the full blueprint, they often feel no one else can execute it properly. This leads to micromanagement and burnout. The 22 must learn to trust their team—their role is the architect, not the bricklayer.

**Legacy vs. Quick Profit:**
A 22 chasing quick money is a 22 operating as a 4. The true power of the 22 activates only when the goal is larger than personal wealth. Ask yourself: "Will this matter in 50 years?" If the answer is yes, you are on the right frequency.

**The 22 Partnership Strategy:**
22s work best when paired with execution-oriented numbers. An 8 (The Powerhouse) handles the financial muscle. A 4 (The Builder) handles the day-to-day operations. A 1 (The Leader) drives the team forward. The 22 stays in the visionary seat.`,
        keyPoints: [
          '22s are designed for large-scale, lasting projects',
          'Must learn to delegate or risk burnout',
          'True power activates only with legacy-minded goals',
          'Best business partners are 1s, 4s, and 8s'
        ]
      },
      {
        id: 'mn-8',
        title: 'Master Number 33 in Healing & Teaching',
        duration: '10 min',
        content: `The 33 carries the highest vibrational frequency in the Master Number spectrum. It is the "Christ Consciousness" number—the energy of selfless love, healing, and cosmic teaching.

**The 33 Healing Frequency:**
- **Room Shifter:** When a fully activated 33 enters a room, the energy changes. People feel calmer, safer, or emotionally moved without knowing why.
- **Natural Healer:** 33s don\'t need formal training to heal. Their presence alone can alleviate emotional pain. Many are drawn to energy work, Reiki, or hands-on healing.
- **Emotional Sponge:** The downside is that 33s absorb the emotional toxins of everyone around them. Without regular "clearing" practices (meditation, nature, solitude), they become sick from other people\'s energy.

**The 33 as Teacher:**
- **Teaching Through Being:** The 33 doesn\'t teach through lectures alone—they teach by embodying the lesson. Their life IS the curriculum.
- **The Reluctant Guru:** Many 33s resist the teaching role because it feels like too much responsibility. But the energy will push them toward it regardless.
- **Modalities for 33 Teachers:** Group facilitation, spiritual retreats, one-on-one mentoring, written wisdom, and parenting (33 parents are often raising future leaders).

**The 33 and the Number 6:**
The 33 reduces to 6 (3+3=6). The 6 is the Nurturer, the Caretaker, the Responsible One. A 33 who falls into shadow becomes an overbearing, anxious 6—meddling in everyone\'s business, worrying obsessively, and sacrificing themselves to the point of illness.

**Protecting the 33 Frequency:**
- Spend at least 30 minutes daily in complete silence.
- Limit exposure to negative media, gossip, and energy-draining people.
- Ground regularly through nature walks, gardening, or physical exercise.
- Learn to say "no" without guilt—this is the 33\'s hardest lesson.

**The 33 Life Mission:**
Your mission is not to save the world. Your mission is to BE the frequency of love so clearly that others are inspired to raise their own vibration. Lead by example, not by force.`,
        keyPoints: [
          '33s shift the energy of any room they enter',
          'Must regularly clear absorbed emotional energy',
          'Teaching happens through embodiment, not just words',
          'Shadow 33 becomes an overbearing, anxious 6'
        ]
      },
      {
        id: 'mn-9',
        title: 'The Shadow Side of Master Numbers',
        duration: '10 min',
        content: `Every Master Number has a shadow frequency. When the high vibration is not properly channeled, it inverts into destructive patterns. Recognizing these shadows is the first step to correcting them.

**Shadow of the 11:**
- **Chronic Anxiety:** The 11\'s heightened nervous system, when ungrounded, produces constant worry, insomnia, and panic attacks.
- **Analysis Paralysis:** Instead of trusting intuition, the shadow 11 overanalyzes every decision until no action is taken.
- **Addictive Tendencies:** 11s may turn to substances, food, or screen time to "numb" their hypersensitivity.
- **The Fix:** Daily grounding practices (meditation, exercise, nature). Trust your gut. Limit stimulants like caffeine and excessive social media.

**Shadow of the 22:**
- **Perfectionism Paralysis:** The 22 sees such a grand vision that nothing feels "good enough" to start. Projects are delayed indefinitely.
- **Control Freak Syndrome:** Because the 22 sees the whole blueprint, they micromanage every detail and alienate their team.
- **Workaholism:** The 22 can become so consumed by the mission that they neglect health, relationships, and sleep.
- **The Fix:** Start before you are ready. Delegate ruthlessly. Schedule mandatory rest. Remember: done is better than perfect.

**Shadow of the 33:**
- **The Martyr Complex:** The 33 sacrifices everything for others and then resents them for not appreciating the sacrifice.
- **Emotional Burnout:** Absorbing everyone\'s pain without clearing it leads to chronic fatigue, depression, and illness.
- **Savior Delusion:** The shadow 33 believes they can "fix" everyone, leading to codependent relationships and overstepping boundaries.
- **The Fix:** Set firm boundaries. Practice daily energy clearing. Accept that you cannot save everyone. Your first responsibility is your own vibration.

**Recognizing Shadow Patterns:**
- Are you frequently exhausted without physical cause? (Shadow absorption)
- Do you procrastinate on important projects? (Shadow perfectionism)
- Do you say "yes" when you mean "no"? (Shadow martyrdom)
- Do you numb out with substances or screens? (Shadow overstimulation)

**The Return to Light:**
Shadow work is not about eliminating the darkness—it is about shining a light on it. Acknowledge the pattern, understand its origin (usually fear), and consciously choose the higher vibration response.`,
        keyPoints: [
          'Shadow 11 manifests as anxiety and analysis paralysis',
          'Shadow 22 manifests as perfectionism and workaholism',
          'Shadow 33 manifests as martyrdom and emotional burnout',
          'Awareness is the first step to returning to high vibration'
        ]
      },
      {
        id: 'mn-10',
        title: 'Living with Multiple Master Numbers',
        duration: '10 min',
        content: `Having two or more Master Numbers in your core chart is exceptionally rare. It creates a life of extraordinary potential—but also extraordinary pressure.

**Common Double Master Combinations:**

**11 Life Path + 22 Expression:**
You feel everything (11) and see the grand blueprint (22). This creates a person who intuitively knows what the world needs AND has the vision to build it. The challenge: overwhelming nervous energy from two high-frequency channels running simultaneously. You may feel like you\'re "vibrating out of your skin."

**11 Life Path + 33 Soul Urge:**
Your life mission is spiritual insight (11) and your heart\'s deepest desire is to heal and teach (33). This combination produces spiritual leaders, therapists, and transformational coaches. The challenge: taking on everyone\'s pain while processing your own heightened sensitivity.

**22 Expression + 33 Soul Urge:**
Your talents are in building large systems (22) and your inner drive is unconditional service (33). This combination creates philanthropists, nonprofit founders, and leaders who build empires for the greater good. The challenge: never feeling like you\'ve done "enough."

**The Triple Master (Extremely Rare):**
Having 11, 22, and 33 all present in your chart is almost unheard of. These individuals often live highly turbulent early lives as the energy calibrates. If they survive the "initiation period" (usually before age 35), they become profoundly influential.

**Management Strategies for Multiple Masters:**
1. **Daily Meditation is Non-Negotiable.** You are running more voltage than the average person—you need daily cooling systems.
2. **Physical Exercise.** The body must discharge excess nervous energy. Running, swimming, martial arts—anything that exhausts the physical body.
3. **Strict Boundaries.** You cannot be available to everyone all the time. Scheduled solitude is mandatory.
4. **A Trusted Inner Circle.** Surround yourself with grounded numbers (4s, 6s, 8s) who can anchor your energy when it spikes.
5. **Accept the Mission.** Fighting against your Master Number frequency creates more suffering than surrendering to it. Stop asking "why me?" and start asking "how can I serve?"

**Famous Multiple Master Number Holders:**
Many world leaders, spiritual teachers, and cultural icons carry multiple Master Numbers. Their lives are rarely "easy"—but they are always impactful.`,
        keyPoints: [
          'Multiple Master Numbers create extraordinary pressure and potential',
          'Each combination produces unique strengths and challenges',
          'Daily meditation and exercise are non-negotiable',
          'Surrender to the mission rather than fighting the frequency'
        ]
      }
    ]
  },
  {
    id: 'karmic-debt',
    title: 'The Karma Decoder',
    description: 'Identify and clear the four specific karmic debt numbers: 13, 14, 16, and 19',
    duration: '80 min',
    free: false,
    lessons: [
      {
        id: 'kd-1',
        title: 'What is Karmic Debt?',
        duration: '5 min',
        content: `Karmic Debt numbers (13, 14, 16, 19) indicate areas where the soul made errors in past cycles. They are not punishments, but "mandatory graduation requirements" for this life.

**Identification:**
These numbers usually appear in your Life Path, Day of Birth, or Expression numbers. If you find one, it explains why certain areas of your life feel like an uphill battle.

**The Goal:**
By acknowledging the debt and performing the "Corrective Action," the friction stops, and you unlock the hidden power behind the number.`,
        keyPoints: [
          'Mandatory soul graduation requirements',
          'Not punishments, but lessons to be mastered',
          'Explain recurring life friction',
          'Corrective action unlocks hidden power'
        ]
      },
      {
        id: 'kd-2',
        title: 'How to Find Karmic Debt in Your Chart',
        duration: '8 min',
        content: `Karmic Debt numbers hide inside your calculations. You must look at the numbers BEFORE they are reduced to find them.

**Where to Check:**

**Life Path Calculation:**
If your Life Path reduces from 13, 14, 16, or 19, you carry that karmic debt as your core life challenge. For example, if your birth date adds up to 16 before reducing to 7, you carry the 16/7 Karmic Debt.

**Day of Birth:**
If you were born on the 13th, 14th, 16th, or 19th of any month, you carry that specific karmic debt through your birthday vibration. This is the most direct form of karmic debt.

**Expression Number:**
If the sum of your full name reduces through 13, 14, 16, or 19, your talents and abilities are colored by that karmic lesson.

**Soul Urge Number:**
If your vowel sum passes through a karmic debt number, your deepest desires are influenced by past-life patterns.

**Multiple Karmic Debts:**
It is possible to have more than one karmic debt. A person born on the 14th with a 16/7 Life Path carries two debts simultaneously. This creates a more intense life curriculum but also unlocks greater power upon completion.

**The Position Matters:**
- Karmic Debt in Life Path = Your entire life journey is the lesson.
- Karmic Debt in Expression = Your talents are blocked until the debt is addressed.
- Karmic Debt in Soul Urge = Your inner world carries the unresolved pattern.
- Karmic Debt in Birthday = A specific gift is locked behind the lesson.

**Step-by-Step Check:**
1. Calculate your Life Path number—note the number BEFORE final reduction.
2. Calculate your Expression number—note intermediate sums.
3. Check your day of birth directly.
4. Calculate Soul Urge—note intermediate sums.
5. If 13, 14, 16, or 19 appears at any step, you carry that debt.`,
        keyPoints: [
          'Check numbers BEFORE reduction to find hidden debts',
          'Life Path, Expression, Soul Urge, and Birthday all carry debt',
          'Multiple debts create more intense but rewarding paths',
          'Position of the debt determines which life area is affected'
        ]
      },
      {
        id: 'kd-13',
        title: 'Karmic Debt 13: The Debt of Laziness',
        duration: '7 min',
        content: `The 13 debt suggests that in a past cycle, work was avoided or passed off to others.

**Symptoms:**
- Feeling that you have to work twice as hard as others for the same result.
- Constantly facing obstacles just as you\'re about to succeed.
- Tendency to give up when things get difficult.

**The Fix:**
Discipline. To clear the 13, you must embrace hard work without taking shortcuts. One you master the "Builder" energy of the 4 (1+3), the 13 becomes a powerhouse of productivity.`,
        keyPoints: [
          'Result of past-life laziness or avoidance',
          'Requires twice the effort for results',
          'The cure is unwavering discipline',
          'Avoid all shortcuts to clear the debt'
        ]
      },
      {
        id: 'kd-14',
        title: 'Karmic Debt 14: The Debt of Misused Freedom',
        duration: '7 min',
        content: `The 14 debt suggests that freedom or power was used to infringe on others or through excessive indulgence.

**Symptoms:**
- Issues with addiction (drugs, alcohol, sex, adrenaline).
- A life that is constantly changing or "chaotic."
- Difficulty sticking to one path.

**The Fix:**
Temperance. You must learn to find freedom *within* structure. Setting boundaries for yourself is the only way to clear the 14. Once cleared, you gain the 5\'s ability to adapt and succeed in any environment.`,
        keyPoints: [
          'Result of past-life excess or harm to others',
          'Manifests as addiction or chaos',
          'The cure is temperance and boundaries',
          'Must find freedom through structure'
        ]
      },
      {
        id: 'kd-16',
        title: 'Karmic Debt 16: The Debt of Ego (The Tower)',
        duration: '8 min',
        content: `The 16 is the most difficult karmic debt. It represents the "shattered ego" and a past-life misuse of love or intellectual superiority.

**Symptoms:**
- The "Tower" effect: Life building up to a peak, then collapsing suddenly.
- Difficulty with long-term relationships.
- Feeling "detached" or superior to others.

**The Fix:**
Humility. The 16 requires you to dismantle your own ego before the universe does it for you. You must seek spiritual truth and genuine connection over status. When cleared, the 16 becomes the highly intuitive and wise 7.`,
        keyPoints: [
          'Result of past-life ego and misuse of love',
          'Manifests as sudden collapses or "Towers"',
          'The cure is radical humility',
          'Must prioritize spirit over status'
        ]
      },
      {
        id: 'kd-19',
        title: 'Karmic Debt 19: The Debt of Power',
        duration: '8 min',
        content: `The 19 debt suggests that power was used selfishly, often ignoring the needs of others while focused solely on personal gain.

**Symptoms:**
- Feeling isolation or "alone at the top."
- Difficulty accepting help from others (Independence to a fault).
- Struggles with self-sabotage once power is attained.

**The Fix:**
Service. To clear the 19, you must learn that "to lead is to serve." You must use your natural 1 traits to uplift others. Once you start helping others succeed, your own path becomes infinitely smoother.`,
        keyPoints: [
          'Result of past-life misuse of power',
          'Manifests as isolation and self-sabotage',
          'The cure is using power to serve others',
          'Must learn to accept help gracefully'
        ]
      },
      {
        id: 'kd-5',
        title: 'Karmic Lessons: The Missing Numbers',
        duration: '10 min',
        content: `Karmic Lessons are different from Karmic Debt. While debt comes from past-life errors, Karmic Lessons come from missing numbers in your full birth name.

**How to Find Your Karmic Lessons:**
Convert every letter of your full birth name to its number (A=1, B=2... I=9, J=1... etc.). The numbers from 1-9 that do NOT appear in your name are your Karmic Lessons—areas where you have less natural ability and must work harder to develop.

**What Each Missing Number Means:**

- **Missing 1:** Difficulty asserting yourself. Must develop independence and self-confidence. Tendency to let others lead when you should step up.
- **Missing 2:** Struggle with cooperation and sensitivity. Must learn patience and diplomacy. May come across as insensitive to others\' feelings.
- **Missing 3:** Difficulty expressing yourself creatively. Must develop communication skills. May suppress emotions or struggle with joy.
- **Missing 4:** Lack of organization and discipline. Must develop structure and work ethic. Tendency to avoid responsibilities.
- **Missing 5:** Resistance to change and new experiences. Must develop adaptability. May cling to comfort zones even when growth requires risk.
- **Missing 6:** Difficulty with responsibility and nurturing. Must develop caregiving abilities. May avoid family obligations or domestic duties.
- **Missing 7:** Lack of introspection and spiritual depth. Must develop analytical thinking and faith. May avoid solitude or self-reflection.
- **Missing 8:** Difficulty with money and authority. Must develop financial literacy and leadership. May struggle with power dynamics.
- **Missing 9:** Difficulty with compassion and letting go. Must develop empathy and humanitarianism. May hold grudges or resist endings.

**Multiple Missing Numbers:**
Having 2-3 missing numbers is common. Having 4+ suggests a soul that chose an accelerated curriculum this lifetime. Each missing number represents a class you must "attend" through life experience.

**The Gift of Karmic Lessons:**
Unlike Karmic Debt (which carries friction), Karmic Lessons are simply areas of growth. They show where you are a "beginner" and where practice will yield the most rapid transformation.`,
        keyPoints: [
          'Missing numbers in your name reveal areas needing development',
          'Different from Karmic Debt—lessons are growth areas, not penalties',
          'Each missing number (1-9) points to a specific skill to build',
          'Multiple missing numbers indicate an accelerated life curriculum'
        ]
      },
      {
        id: 'kd-6',
        title: 'Karmic Debt in Relationships',
        duration: '10 min',
        content: `Karmic Debt doesn\'t just affect you individually—it profoundly shapes your relationships. Understanding how debt interacts between two people can explain the most intense connections in your life.

**When Partners Share the Same Debt:**
If both you and your partner carry the same Karmic Debt (e.g., both have 16/7), the relationship becomes a "mirror classroom." You will trigger each other\'s deepest patterns constantly. This can feel like an intensely passionate but turbulent relationship. The purpose is mutual growth—not comfort.

**Karmic Relationships vs. Soulmate Connections:**
- **Karmic Relationships:** Intense, often painful, designed to teach a specific lesson. Once the lesson is learned, the relationship often ends naturally. Characterized by obsession, push-pull dynamics, and a feeling of "I can\'t quit this person."
- **Soulmate Connections:** Supportive, growth-oriented, and nourishing. The relationship facilitates your Life Path rather than challenging it.
- **How to Tell the Difference:** If the relationship brings out your shadow patterns consistently, it is likely karmic. If it brings out your highest self, it is likely a soulmate bond.

**Debt-Specific Relationship Patterns:**
- **13/4 in Relationships:** One partner does all the work while the other coasts. The lesson is balanced effort and mutual contribution.
- **14/5 in Relationships:** Infidelity, excessive freedom-seeking, or one partner controlling the other. The lesson is trust and healthy boundaries.
- **16/7 in Relationships:** Sudden breakups, betrayals of trust, or one partner\'s ego destroying the connection. The lesson is vulnerability and humility.
- **19/1 in Relationships:** One partner dominates while the other feels invisible. The lesson is shared power and mutual respect.

**Breaking Toxic Karmic Cycles:**
1. Identify which Karmic Debt is active in the relationship.
2. Acknowledge your role in the pattern (not just your partner\'s).
3. Practice the corrective action for that specific debt.
4. If the relationship cannot evolve, release it with gratitude for the lesson.
5. Forgiveness (of yourself and the other person) is the final key to closing the karmic chapter.`,
        keyPoints: [
          'Shared Karmic Debt creates intense mirror relationships',
          'Karmic relationships teach through friction, not comfort',
          'Each debt number creates specific relationship patterns',
          'Forgiveness is the final key to closing karmic cycles'
        ]
      },
      {
        id: 'kd-7',
        title: 'Clearing Karmic Debt: Practical Protocols',
        duration: '10 min',
        content: `Clearing Karmic Debt is not theoretical—it requires consistent, practical action aligned with the specific lesson of your debt number.

**Protocol for Clearing 13/4 (Laziness):**
- **Daily Discipline:** Wake at the same time every day. No exceptions, no snooze button.
- **Finish What You Start:** Complete every project, no matter how small. This rewires the 13 pattern.
- **Physical Labor:** Volunteer for manual work—gardening, building, cleaning. The body must learn the satisfaction of effort.
- **Weekly Challenge:** Take on one task each week that you would normally avoid or delegate.
- **Timeline:** Consistent practice for 1-2 years begins to shift the pattern noticeably.

**Protocol for Clearing 14/5 (Excess):**
- **Structured Freedom:** Create a daily schedule that includes designated "free time." Freedom within a framework.
- **30-Day Challenges:** Practice abstinence from your primary vice for 30 days. Repeat with different vices.
- **Accountability Partner:** Find someone who holds you to your commitments without judgment.
- **Mindful Indulgence:** When you do indulge, do it consciously and with full awareness—not on autopilot.
- **Timeline:** The 14 often takes 2-3 years of consistent boundary-setting to shift.

**Protocol for Clearing 16/7 (Ego):**
- **Daily Humility Practice:** Each morning, acknowledge three things you don\'t know or can\'t control.
- **Anonymous Service:** Perform acts of kindness that no one will ever know about. The ego gets no reward.
- **Apology Practice:** When wrong, apologize immediately and fully. No "but" statements.
- **Spiritual Study:** Engage with wisdom traditions that emphasize surrender and humility.
- **Timeline:** The 16 is the hardest to clear. Expect 3-5 years of dedicated work, often punctuated by "Tower" events that accelerate growth.

**Protocol for Clearing 19/1 (Selfishness):**
- **Daily Mentoring:** Actively help one person each day with no expectation of return.
- **Ask for Help:** Deliberately ask others for assistance, even when you can do it yourself.
- **Collaborative Projects:** Join group efforts where your success depends on others.
- **Gratitude Practice:** Each evening, write three things others did for you that day.
- **Timeline:** The 19 typically begins clearing within 1-2 years of consistent service-oriented behavior.

**Signs Your Debt is Clearing:**
- The same situations that used to trigger you no longer do.
- Opportunities flow more easily without extreme effort.
- Relationships become less dramatic and more nourishing.
- You feel lighter and more at peace with your path.`,
        keyPoints: [
          'Each debt requires a specific, consistent corrective protocol',
          'Physical actions (not just awareness) are required to clear debt',
          'Clearing timelines range from 1-5 years of dedicated practice',
          'Signs of clearing include ease, peace, and natural flow'
        ]
      },
      {
        id: 'kd-8',
        title: 'The Karmic Reward: Life After Clearing',
        duration: '8 min',
        content: `Karmic Debt is not a life sentence. When you do the work, the debt clears—and what emerges on the other side is extraordinary power.

**The Transformation of Each Debt:**

**13/4 Cleared → The Master Builder:**
The person who once avoided work becomes the most productive force in the room. The 13/4 who has cleared their debt has an almost superhuman work ethic and can build lasting structures, businesses, and systems. Their discipline becomes their superpower.

**14/5 Cleared → The Liberated Adventurer:**
The person who once drowned in excess becomes a master of adaptable freedom. The cleared 14/5 can navigate any environment, pivot gracefully, and experience life fully without losing themselves. Their temperance becomes magnetic charisma.

**16/7 Cleared → The Enlightened Mystic:**
The person whose ego was shattered discovers deep spiritual wisdom. The cleared 16/7 becomes profoundly intuitive, wise beyond their years, and capable of seeing truth that others miss. Their humility becomes quiet authority.

**19/1 Cleared → The Servant Leader:**
The person who once used power selfishly becomes the leader everyone wants to follow. The cleared 19/1 inspires through genuine care, lifts others effortlessly, and attracts loyalty through service. Their generosity becomes unstoppable influence.

**How to Know You\'ve Cleared:**
- The triggering situation no longer produces an emotional charge.
- You can tell the story of your struggle without bitterness.
- Others begin seeking your advice in the exact area of your former weakness.
- Abundance flows in the area that was previously blocked.
- You feel genuine compassion (not resentment) toward those still learning the lesson.

**The Karmic Credit:**
Once a debt is cleared, you don\'t just return to zero—you earn "Karmic Credit." The cleared debt becomes your area of greatest mastery. Many healers, teachers, and leaders were forged in the fire of their own karmic lessons.

**Living Debt-Free:**
A numerologically debt-free life is characterized by flow, synchronicity, and a sense of being "on path." You still face challenges, but they feel purposeful rather than punishing. You become a living example that transformation is possible.`,
        keyPoints: [
          'Cleared debt transforms into your greatest area of mastery',
          'Each debt unlocks specific superpowers when resolved',
          'Karmic Credit means your former weakness becomes your strength',
          'A debt-free life flows with synchronicity and purpose'
        ]
      }
    ]
  },
  {
    id: 'wealth-codes',
    title: 'Wealth & Manifestation Codes',
    description: 'Align your cosmic DNA with financial abundance and career success',
    duration: '75 min',
    free: false,
    lessons: [
      {
        id: 'wc-1',
        title: 'The Numerology of Money',
        duration: '5 min',
        content: `Money is energy, and energy follows the numbers in your chart. Every Life Path has a "Natural Relationship" with wealth.

**The Money Vibe of Your Path:**
- **Leaders (1, 8):** Build empires and attract high-ticket capital.
- **Creators (3, 9):** Wealth through ideas and artistic expression.
- **Stabilizers (4, 6):** Wealth through consistency and solid management.

**Your Primary Obstacle:**
Most people block wealth because they operate in the *shadow* of their number. An 8 focusing on greed instead of high-level building will always struggle with cash flow. We must find the high vibration of your wealth code.`,
        keyPoints: [
          'Money is energy following numerological laws',
          'Every Life Path has a unique wealth archetype',
          'Shadow frequencies block abundance',
          'Manifestation depends on high-vibration alignment'
        ]
      },
      {
        id: 'wc-2',
        title: 'Identifying Your Money Years',
        duration: '8 min',
        content: `In the 9-year cycle, certain years are "Harvest" years and others are "Plowing" years.

**The Peak Wealth Years:**
- **Personal Year 1:** The Seed. Start the business now.
- **Personal Year 8:** The Harvest. This is the peak year for financial return.
- **Personal Year 9:** The Release. End old ventures to make space for the new cycle.

**Timing the Market:**
If you try to launch a major financial project in a Personal Year 7 (Introspection), you are fighting the cosmic current. We will calculate exactly where you sit in the cycle today.`,
        keyPoints: [
          'Wealth cycles flow in 9-year patterns',
          'Personal Year 8 is the primary financial harvest',
          'Personal Year 1 is for launching new ventures',
          'Don\'t force financial growth in Resting years'
        ]
      },
      {
        id: 'wc-3',
        title: 'Elemental Career Alignment',
        duration: '7 min',
        content: `Your Chinese Element dictates which industries and environments will yield the most profit for you.

**Industries by Element:**
- **Wood:** Design, education, agriculture, media.
- **Fire:** Tech startups, entertainment, sales, stock market.
- **Earth:** Real estate, construction, hospitality, logistics.
- **Metal:** Finance, law, jewelry, high-end manufacturing.
- **Water:** Psychology, shipping, creative arts, consulting.

**Optimal Environment:**
A Fire person in a slow-moving, bureaucratic Earth company will feel drained. A Metal person in a chaotic startup will lose focus. Your productivity (and wealth) triples when the environment matches your element.`,
        keyPoints: [
          'Elements define optimal profit sectors',
          'Work environments must match birth element',
          'Incompatibility leads to drainage and low income',
          'Maximize ROI by picking the right industry'
        ]
      },
      {
        id: 'wc-4',
        title: 'Manifestation Anchors',
        duration: '10 min',
        content: `To pull energy from the matrix into physical wealth, you need "Anchors" specific to your numbers.

**Personal Manifestation Tools:**
- **Signaling:** Using specific colors (based on your element) for business meetings.
- **Sacred Dates:** Signing contracts on your "Power Dates" (calculated from your Life Path).
- **The Numbers Guy Secret:** Using the number 8 or 33 in your prices to attract abundance frequency.

**Developing the Habit:**
Manifestation is a daily practice, not a one-time event. By aligning your digital passwords, prices, and meeting times with your favorable numbers, you create a "Wealth Net" that constantly catches opportunities.`,
        keyPoints: [
          'Use physical anchors to pull matrix energy',
          'Incorporate favorable numbers in pricing and dates',
          'Color-coded signaling for business success',
          'Build a daily "Wealth Net" habit'
        ]
      },
      {
        id: 'wc-5',
        title: 'Life Path Wealth Profiles',
        duration: '10 min',
        content: `Every Life Path number has a unique relationship with money. Understanding yours eliminates financial blind spots.

**The Wealth DNA by Life Path:**

- **Life Path 1 (The Pioneer):** Wealth through innovation and self-employment. Best as founders, not employees. Financial blind spot: spending impulsively on "the next big thing" before the last one is profitable.
- **Life Path 2 (The Diplomat):** Wealth through partnerships and negotiation. Excellent at closing deals behind the scenes. Financial blind spot: undercharging for services due to people-pleasing tendencies.
- **Life Path 3 (The Creator):** Wealth through creative expression—writing, speaking, performing, marketing. Financial blind spot: inconsistent income due to scattered focus and project-hopping.
- **Life Path 4 (The Builder):** Wealth through steady accumulation—real estate, savings, long-term investments. Financial blind spot: being too conservative and missing high-growth opportunities.
- **Life Path 5 (The Adventurer):** Wealth through adaptability—sales, consulting, travel industries. Financial blind spot: risky spending and difficulty saving due to craving experiences.
- **Life Path 6 (The Nurturer):** Wealth through service industries—healthcare, education, hospitality, design. Financial blind spot: giving away money to family or causes before securing your own foundation.
- **Life Path 7 (The Mystic):** Wealth through specialized knowledge—research, technology, spiritual services. Financial blind spot: being so focused on learning that you never monetize your expertise.
- **Life Path 8 (The Powerhouse):** Natural money magnetism—finance, real estate, executive leadership. Financial blind spot: equating self-worth with net worth, leading to workaholism.
- **Life Path 9 (The Humanitarian):** Wealth through large-scale impact—nonprofits, global ventures, philanthropy. Financial blind spot: giving everything away before building personal reserves.

**The Key Insight:**
You will always make more money doing work that aligns with your Life Path number. Fighting your natural financial DNA creates friction. Embrace it, and the money flows.`,
        keyPoints: [
          'Every Life Path has a unique wealth archetype and blind spots',
          'Aligning career with Life Path maximizes income potential',
          'Financial blind spots cause the most money leaks',
          'Embrace your natural money DNA instead of fighting it'
        ]
      },
      {
        id: 'wc-6',
        title: 'The Prosperity Cycle: Monthly Wealth Timing',
        duration: '8 min',
        content: `Just as Personal Years create annual waves, Personal Months create monthly micro-cycles for financial timing.

**Calculating Your Personal Month:**
Add your Personal Year number to the current calendar month number.
Example: Personal Year 5, in March (month 3): 5 + 3 = 8 Personal Month.

**Monthly Wealth Windows:**

- **Personal Month 1:** Launch new financial ventures, pitch ideas, open new accounts.
- **Personal Month 2:** Negotiate deals, form partnerships, wait for others to come to you.
- **Personal Month 3:** Market yourself, network aggressively, create content that generates leads.
- **Personal Month 4:** Do the boring financial work—budgets, spreadsheets, contract reviews, tax prep.
- **Personal Month 5:** Take calculated risks, pivot strategies, explore new revenue streams.
- **Personal Month 6:** Focus on family finances, home investments, service-based income.
- **Personal Month 7:** Research investments, study markets, plan strategy quietly. Do NOT launch.
- **Personal Month 8:** The peak money month. Close big deals, ask for raises, collect what you are owed.
- **Personal Month 9:** Release unprofitable ventures, donate, forgive debts. Clear the slate for the next cycle.

**The Golden Rule:**
Never sign a major financial contract in a Personal Month 7 (introspection) or 9 (endings). Wait for a 1 (new start) or 8 (harvest) month for maximum financial impact.

**Stacking Cycles:**
When your Personal Month 8 lands inside your Personal Year 8, you are in a "Double Harvest" window. This is the single most powerful financial period in your entire 9-year cycle. Plan your biggest moves for this window.`,
        keyPoints: [
          'Personal Months create micro-windows for financial timing',
          'Month 8 is the peak money month in any cycle',
          'Avoid major financial moves in Month 7 or 9',
          'Double Harvest (Month 8 in Year 8) is the ultimate wealth window'
        ]
      },
      {
        id: 'wc-7',
        title: 'Wealth Blocks by Birth Element',
        duration: '8 min',
        content: `Your Chinese birth element creates specific psychological patterns around money. Identifying your element\'s wealth block is the first step to removing it.

**Wood Element Wealth Block:**
- **The Pattern:** Difficulty sustaining growth. Projects start strong but plateau.
- **Root Cause:** Wood needs constant expansion but fears becoming "too big" or attracting envy.
- **The Fix:** Set growth targets that stretch you 20% beyond comfort. Surround yourself with Fire element people who fuel your momentum.

**Fire Element Wealth Block:**
- **The Pattern:** Boom-and-bust cycles. Making money fast but losing it just as quickly.
- **Root Cause:** Fire burns hot but burns out. Impulsive spending and emotional financial decisions.
- **The Fix:** Automate savings before you can touch the money. Partner with an Earth or Metal element person for financial stability.

**Earth Element Wealth Block:**
- **The Pattern:** Hoarding money but never investing it. Wealth sits stagnant.
- **Root Cause:** Earth fears instability so deeply that it overcompensates by sitting on resources.
- **The Fix:** Set a fixed percentage of income for investment. Start small. Movement creates more stability than stillness.

**Metal Element Wealth Block:**
- **The Pattern:** Perfectionism prevents products from launching. Analysis paralysis on financial decisions.
- **Root Cause:** Metal demands precision and fears making a "wrong" financial move.
- **The Fix:** Set deadlines and honor them. A launched product earning 80% of its potential is infinitely better than a perfect product that never ships.

**Water Element Wealth Block:**
- **The Pattern:** Giving money away or undervaluing your work. Chronic undercharging.
- **Root Cause:** Water flows toward others naturally and resists accumulating for itself.
- **The Fix:** Set prices based on market value, not personal comfort. Have someone else handle your pricing if necessary. Your worth is not diminished by receiving fair payment.`,
        keyPoints: [
          'Each element has a specific psychological money block',
          'Wood plateaus, Fire crashes, Earth hoards, Metal perfects, Water gives away',
          'Element-aware fixes target the root cause, not just symptoms',
          'Partner with complementary elements for financial balance'
        ]
      },
      {
        id: 'wc-8',
        title: 'Strategic Partnerships & Team Numerology',
        duration: '10 min',
        content: `The numerology of your team determines the ceiling of your business success. A single "enemy number" in a key position can sabotage the entire operation.

**The Ideal Business Partnerships by Life Path:**
- **1 + 5:** Innovation meets adaptability. Fast-moving, trend-setting ventures.
- **1 + 8:** Vision meets execution. The most powerful entrepreneurial pairing.
- **2 + 6:** Harmony meets service. Ideal for wellness, hospitality, and education businesses.
- **3 + 9:** Creativity meets global vision. Marketing agencies, media companies, nonprofits.
- **4 + 8:** Structure meets power. Real estate, construction, financial services.
- **4 + 22:** Foundation meets grand vision. Infrastructure and legacy projects.

**Partnerships to Avoid:**
- **1 + 2:** The leader clashes with the peacemaker. One pushes while the other pulls back.
- **4 + 5:** Rigidity vs. chaos. These two fundamentally disagree on pace and process.
- **8 + 9:** Money vs. mission. The 8 wants profit; the 9 wants impact. Unless both goals are explicitly aligned, friction is guaranteed.

**Building a Numerologically Optimized Team:**
- **The Visionary (1, 11, 22):** Sets direction and inspires the team.
- **The Communicator (3, 5):** Handles marketing, sales, and public-facing operations.
- **The Operator (4, 6):** Manages day-to-day systems and keeps the machine running.
- **The Closer (8):** Handles finances, negotiations, and high-stakes decisions.
- **The Strategist (7, 9):** Provides research, wisdom, and long-term planning.

**The Key Hire:**
If your Life Path is missing a critical business function, hire that number. A Life Path 3 (creative) who hires a Life Path 4 (operations manager) solves their biggest weakness instantly.`,
        keyPoints: [
          'Team numerology determines business success ceiling',
          'Certain Life Path combinations create powerful synergies',
          'Enemy-number partnerships create recurring friction',
          'Hire the Life Path number that covers your weakness'
        ]
      },
      {
        id: 'wc-9',
        title: 'The Numerology of Investments',
        duration: '8 min',
        content: `Timing your investments using Personal Year cycles gives you a mathematical edge that most investors ignore.

**The Investment Cycle:**
- **Personal Year 1:** Seed new investment strategies. Open new accounts. Begin dollar-cost averaging into new positions.
- **Personal Year 2-3:** Be patient. Let investments grow. Add to positions slowly. Network with potential partners.
- **Personal Year 4:** Review and restructure your portfolio. Cut underperformers. Strengthen foundations.
- **Personal Year 5:** Pivot. This is the year to explore new asset classes, markets, or strategies that you have never tried before.
- **Personal Year 6:** Focus on "responsible" investments—real estate, education funds, family trusts.
- **Personal Year 7:** Research only. Study markets deeply but make minimal moves. This is the year to learn, not act.
- **Personal Year 8:** Harvest. Take profits. Close deals. This is the peak return year. Cash out strong positions.
- **Personal Year 9:** Exit declining positions. Donate to charity (creates tax benefit and karmic credit). Prepare for the next cycle.

**Element-Based Industry Alignment:**
Your birth element naturally aligns with certain market sectors:
- **Wood:** Renewable energy, agriculture, education, healthcare.
- **Fire:** Technology, entertainment, social media, gaming.
- **Earth:** Real estate, construction, food industry, logistics.
- **Metal:** Precious metals, finance, luxury goods, aerospace.
- **Water:** Shipping, oil/gas, pharmaceuticals, creative industries.

**The 8-Year Wealth Wave:**
Every 9 years, your Personal Year 8 arrives. This is your peak financial window. The smartest investors plan 2-3 years in advance for this year, positioning assets to peak during their Personal Year 8.

**Reading the Universal Year:**
When your Personal Year 8 aligns with a Universal Year 8 (last occurred in 2024), the financial potential multiplies. Mark these rare alignments on your calendar decades in advance.`,
        keyPoints: [
          'Personal Year cycles create predictable investment windows',
          'Year 8 is the peak for harvesting investment returns',
          'Birth element aligns with specific profitable industries',
          'Plan years in advance for your Personal Year 8 window'
        ]
      },
      {
        id: 'wc-10',
        title: 'Creating Your Personal Wealth Blueprint',
        duration: '10 min',
        content: `This is the capstone lesson: combining everything you have learned into a personalized 9-year financial master plan.

**Step 1: Identify Your Wealth Archetype**
Using your Life Path number, determine your natural relationship with money. Are you a Pioneer (1), a Builder (4), a Powerhouse (8)? Your archetype determines your primary income strategy.

**Step 2: Map Your Element to Industry**
Using your Chinese birth element, identify the industries and environments where you will naturally thrive. Wood in education, Fire in tech, Earth in real estate, Metal in finance, Water in creative industries.

**Step 3: Calculate Your Current Cycle Position**
Where are you in your Personal Year cycle right now? This determines whether you should be planting (Years 1-3), tending (Years 4-6), or harvesting (Years 7-9).

**Step 4: Identify Your Wealth Blocks**
Using your element and Karmic Debt analysis, pinpoint the specific psychological patterns blocking your abundance. Create a corrective protocol.

**Step 5: Build Your Team**
Identify which Life Path numbers you need on your team to cover your blind spots. If you are a 3 (creative visionary), you need a 4 (operations) and an 8 (financial power).

**Step 6: Create the 9-Year Map**
Plot your Personal Years 1-9 on a timeline. For each year, assign:
- Primary financial focus (launch, build, maintain, harvest, or release)
- Target industries aligned with your element
- Key team hires or partnerships
- Investment strategy (aggressive, moderate, conservative, exit)

**Step 7: Identify Power Windows**
Calculate your future Personal Month 8s within your Personal Year 8. These are your "Super Harvest" windows. Plan your biggest financial moves for these specific months.

**Step 8: Annual Review Protocol**
Each year on your birthday (your annual reset point), review your blueprint:
- What worked with the cosmic current?
- What fought against the cycle?
- What adjustments are needed for next year?

**The Compound Effect:**
Following this blueprint for even one complete 9-year cycle creates a compound effect. By year 8, every element—your archetype, element, team, timing, and mindset—is working in concert. The results are exponential, not linear.`,
        keyPoints: [
          'Combine Life Path, element, and cycle into one master plan',
          'Map all 9 years with specific financial strategies',
          'Identify Super Harvest windows years in advance',
          'Annual birthday review keeps the blueprint aligned with cosmic shifts'
        ]
      }
    ]
  },
  {
    id: 'personal-year',
    title: 'Personal Year Cycles & Timing',
    description: 'Master the 9-year cycle to know exactly when to act, build, or rest',
    duration: '88 min',
    free: false,
    lessons: [
      {
        id: 'py-1',
        title: 'The 9-Year Cycle Explained',
        duration: '5 min',
        content: `Life does not move in a straight line; it moves in waves. In GG33, we track these waves through the 9-year Universal and Personal cycles.

**How to Calculate Your Personal Year:**
1. Your Day of Birth
2. Your Month of Birth
3. The Current Calendar Year
*Example: Born June 10, in 2024.*
6 + 1 + 0 + 2 + 0 + 2 + 4 = 15. 1 + 5 = **Personal Year 6.**

**The Cycle Energy:**
Years 1-3 are for planting. Years 4-6 are for tending and adjusting. Years 7-9 are for harvesting and clearing. Knowing your year is like knowing the weather before you go outside.`,
        keyPoints: [
          'Life moves in 9-year cycles of energy',
          'Calculate by adding birth day/month to current year',
          'Understanding your year prevents wasted effort',
          'Cycles dictate when to push and when to rest'
        ]
      },
      {
        id: 'py-2',
        title: 'The Action Years (1, 3, 5, 8)',
        duration: '10 min',
        content: `These are the years where you must be proactive. If you stay passive during an Action Year, you miss out on a decade of potential.

**Year 1 (The Start):** The most important year. New seeds, new business, new identity.
**Year 3 (Expression):** Social expansion, networking, and creative outbursts.
**Year 5 (Change):** The pivot point. Travel, fast movement, and unexpected opportunities.
**Year 8 (Harvest):** The peak of manifestation and money. Work your hardest here.

**Maximizing Action:**
In an 8 year, you should sleep less and work more. The universe is literally handing you the results of the previous 7 years. Don't waste it on vacation.`,
        keyPoints: [
          'Odd-numbered years are generally for outward action',
          'Year 1 sets the theme for the entire 9-year cycle',
          'Year 8 is the absolute peak for financial results',
          'Passive behavior in these years wastes the frequency'
        ]
      },
      {
        id: 'py-3',
        title: 'The Foundation & Introspection Years (2, 4, 7)',
        duration: '10 min',
        content: `These years are often misunderstood as "bad" because they feel slower, but they are critical for long-term success.

**Year 2 (Partnership):** Patience. Wait for others. Build relationships.
**Year 4 (Work):** The "plowing" year. Hard, boring, repetitive work that builds the foundation for the 8.
**Year 7 (Spirit):** The "danger" year for business but peak for wisdom. Introspection, learning, and rest.

**The Danger of Year 7:**
Trying to launch a massive aggressive business in a 7 year often leads to burnout or failure. This year is for the mind and spirit, not the wallet. Respect the pace.`,
        keyPoints: [
          'Slower years are for building internal strength',
          'Year 4 is essential work for the Year 8 harvest',
          'Year 7 is for spiritual and mental growth',
          'Forcing action in a 7 year leads to frustration'
        ]
      },
      {
        id: 'py-4',
        title: 'The Universal Year Connection',
        duration: '10 min',
        content: `Your Personal Year exists inside the Universal Year (the vibration of the world).

**Universal Year Calculation:**
2024 = 2+0+2+4 = **8 Universal Year.**
2025 = 2+0+2+5 = **9 Universal Year.**

**The Interaction:**
If you are in a Personal Year 1 (Start) during a Universal Year 9 (End), you may feel a push-pull effect. The world is letting go while you are trying to grab hold. Learning to balance your personal wave with the global tide is the mark of a master practitioner.`,
        keyPoints: [
          'Universal Years set the global tone/background',
          'The world moves through the 1-9 cycle collectively',
          'Balance your personal cycle against the global one',
          'Predict global shifts using the Universal Year'
        ]
      },
      {
        id: 'py-5',
        title: 'Personal Month Calculations',
        duration: '8 min',
        content: `While your Personal Year sets the overarching theme, your Personal Month dictates the immediate micro-climate of your life.

**How to Calculate Your Personal Month:**
Add your Personal Year number to the current calendar month number, then reduce to a single digit.
Example: If you are in a Personal Year 5, and it is March (the 3rd month): 5 + 3 = 8. You are in an 8 Personal Month.

**Monthly Energy Shifts:**
- **Month 1:** High energy, new ideas, impulse to start things.
- **Month 2:** Slowdown. Delays. Wait for others. Focus on partnerships.
- **Month 3:** Social peaking. Networking. Creative bursts.
- **Month 4:** Grind time. Admin work. Frustration if you try to take shortcuts.
- **Month 5:** Sudden changes. Travel. Unexpected news.
- **Month 6:** Home issues. Family demands. Responsibilities peak.
- **Month 7:** Isolation urge. Research. Low physical energy. Do not force action.
- **Month 8:** Power moves. Financial returns. High visibility.
- **Month 9:** Emotional clearing. Letting go. Finalizing projects.

**Strategic Monthly Planning:**
By mapping your 12 Personal Months for the year, you can schedule your life with precision. Never launch a product in a 7 month. Never ignore taxes in a 4 month.`,
        keyPoints: [
          'Personal Month = Personal Year + Calendar Month',
          'Months provide the micro-climate within the yearly cycle',
          'Schedule major actions in 1, 3, 5, and 8 months',
          'Schedule rest and planning in 2, 4, and 7 months'
        ]
      },
      {
        id: 'py-6',
        title: 'Personal Day Energy',
        duration: '7 min',
        content: `For day-to-day operations, the Personal Day number provides the ultimate tactical advantage. This is what the elites use to time their most critical meetings.

**How to Calculate Your Personal Day:**
Add your Personal Month number to the calendar day number, then reduce.
Example: If you are in an 8 Personal Month, and today is the 14th (1+4=5): 8 + 5 = 13 → 1+3 = 4. Today is a 4 Personal Day.

**Using Daily Energy:**
- **1 Day:** Pitching new clients, starting projects.
- **2 Day:** Diffusing conflicts, signing contracts.
- **3 Day:** Filming content, public speaking, dates.
- **4 Day:** Catching up on emails, organizing, budgeting.
- **5 Day:** Cold calling, traveling, breaking routine.
- **6 Day:** Helping team members, family obligations.
- **7 Day:** Strategic thinking, writing, avoiding crowds.
- **8 Day:** Asking for raises, closing big sales, demanding respect.
- **9 Day:** Firing someone, ending a bad habit, clearing clutter.

**Power Days:**
Your most powerful days occur when your Personal Day matches your Personal Year (e.g., an 8 Day in an 8 Year). These "double frequency" days are when you should execute your highest-leverage actions.`,
        keyPoints: [
          'Personal Day = Personal Month + Calendar Day',
          'Dictates the optimal tactical action for any given day',
          'Double frequency days (matching Year) are Power Days',
          'Reduces daily friction by working with the current'
        ]
      },
      {
        id: 'py-7',
        title: 'The Birthday Month: Your Annual Reset',
        duration: '8 min',
        content: `Your Personal Year technically begins on January 1st (aligning with the Universal Year), but the energy shift is not instantaneous. The true "reset" happens during your birth month.

**The Transition Window:**
January and February act as a bridge. If you are moving from a Year 3 to a Year 4, the early months will feel like a mix of both energies. But the moment your birth month arrives, the new frequency locks in completely.

**The Birthday Month Phenomenon:**
Your birth month is always the most intense month of your year because it acts as an energetic reboot.
- **Pre-Birthday Dip:** The 2-3 weeks before your birthday often feel sluggish or emotionally heavy. This is your system clearing out the old cycle.
- **Post-Birthday Surge:** The 2-3 weeks after your birthday provide a massive influx of clarity and momentum.

**How to Use the Reset Window:**
1. Do not make permanent, life-altering decisions in the three weeks before your birthday.
2. Use the pre-birthday window to fast, detox, declutter, and reflect.
3. Schedule major launches or new beginnings for the week *after* your birthday.
4. Set your intentions for the year on your exact birthday—the portal is open.`,
        keyPoints: [
          'New Year energy locks in fully during your birth month',
          'Pre-birthday weeks are for clearing and detoxing',
          'Post-birthday weeks are for launching and action',
          'The birthday itself is the ultimate intention-setting portal'
        ]
      },
      {
        id: 'py-8',
        title: 'The Critical Years: 6 and 9',
        duration: '10 min',
        content: `In the 9-year cycle, Years 6 and 9 are consistently reported as the most challenging. Understanding why prevents unnecessary suffering.

**The Personal Year 6 (The Crucible of Responsibility):**
- **The Theme:** Duty, family, and domestic realignment.
- **The Challenge:** The universe will test your ability to show up for others. Sick relatives, housing issues, or relationship ultimatums are common. You cannot escape your obligations this year.
- **The Trap:** Resentment. If you fight the responsibilities, the 6 year will crush you.
- **The Strategy:** Lean in. Be the rock for your family. Focus on health, home repairs, and serving your immediate community.

**The Personal Year 9 (The Void):**
- **The Theme:** Endings, clearing the slate, emotional culmination.
- **The Challenge:** Anything (or anyone) that is not aligned with your next 9-year cycle will be forcibly removed. Jobs end. Relationships break. Friendships fade.
- **The Trap:** Clinging to the past. The more you hold onto what is leaving, the more painful the 9 year becomes.
- **The Strategy:** Let it burn. Practice radical detachment. Do not start major new ventures (they rarely last). Forgive old grudges.

**The Hidden Blessing:**
The 6 year forces you to build a foundation strong enough to handle the harvest of the upcoming 8 year. The 9 year empties your cup so it can be filled with entirely new blessings in the upcoming 1 year.`,
        keyPoints: [
          'Year 6 tests responsibility and domestic stability',
          'Year 9 forces endings and clears the slate',
          'Fighting the 6 creates resentment; fighting the 9 creates pain',
          'Both years are necessary preparations for future success'
        ]
      },
      {
        id: 'py-9',
        title: 'Tracking Multiple Cycles Simultaneously',
        duration: '10 min',
        content: `Mastery in GG33 requires tracking the "Triple Stack": Your Personal Year, Personal Month, and Personal Day simultaneously.

**Reading the Triple Stack:**
Imagine a slot machine with three wheels.
- **Wheel 1 (Year):** The Macro Strategy
- **Wheel 2 (Month):** The Operational Tactic
- **Wheel 3 (Day):** The Immediate Action

**When the Stack Aligns:**
Example: Year 8, Month 8, Day 8.
This is a singularity point. The energy is hyper-concentrated. If you take action aligned with the number 8 (money, power, execution) on this day, the results are explosive.

**When the Stack Conflicts:**
Example: Year 1 (Action), Month 4 (Grind), Day 7 (Rest).
This creates confusion. You feel the urge to start something new (1), but you are bogged down by administrative delays (4), and you physically feel exhausted (7).
**The Fix:** Always defer to the smallest unit of time for immediate action. On a 7 day, rest—even if it\'s a 1 year. The day is the weather; the year is the season.

**The 5/4 Conflict:**
The most difficult stack is mixing 4 (Stability) and 5 (Change). A 5 month in a 4 year feels like driving with the parking brake on. You crave adventure but are trapped by obligation. The solution is finding "structured freedom"—taking small, controlled risks within your existing framework.`,
        keyPoints: [
          'The Triple Stack: Year, Month, and Day cycles running together',
          'Aligned stacks create hyper-concentrated energy portals',
          'Conflicting stacks require deferring to the daily energy',
          'Year = Season, Month = Climate, Day = Weather'
        ]
      },
      {
        id: 'py-10',
        title: 'Planning Major Life Events by Cycle',
        duration: '10 min',
        content: `Never leave major life transitions to chance. By aligning massive decisions with your cycles, you secure the cosmic wind at your back.

**Marriage & Engagement:**
- **Best Years:** 2 (Partnership), 6 (Family/Home).
- **Worst Years:** 5 (Chaos/Freedom), 7 (Isolation), 9 (Endings).
- *Note:* Marrying in a 9 year often means the marriage is finalizing an old karmic contract and rarely lasts into the new cycle.

**Buying Real Estate / Moving:**
- **Best Years:** 4 (Foundations), 6 (Home/Domestic), 8 (Assets).
- **Worst Years:** 5 (Unstable), 9 (Transitional).

**Starting a Business / Career Pivot:**
- **Best Years:** 1 (New Beginnings), 8 (Financial Power).
- **Worst Years:** 7 (Internal focus), 9 (Completion phase).

**Having Children (Conception/Birth):**
- **Common Years:** 3 (Creation/Child energy), 6 (Family responsibility), 9 (Bringing in new souls).

**Major Travel / Relocation:**
- **Best Year:** 5 (The quintessential year for adventure and moving across borders).

**The Master Timeline Strategy:**
Look 3-5 years ahead in your cycle. If you are currently in a 7 year, do not force a business launch. Use the 7 year to research, the 8 year to secure funding, and the 9 year to clear out distractions, so you can launch flawlessly in your upcoming 1 year.`,
        keyPoints: [
          'Align major life events with the corresponding cycle energy',
          'Marriages in Year 9 often finalize old karma rather than building futures',
          'Launch businesses in 1 or 8; buy property in 4, 6, or 8',
          'Map your 5-year timeline to prepare for future cycle windows'
        ]
      }
    ]
  },
  {
    id: 'adv-letterology',
    title: 'Advanced Letterology',
    description: 'Understand the hidden frequencies of names and how they shape destiny',
    duration: '96 min',
    free: false,
    lessons: [
      {
        id: 'al-1',
        title: 'The Difference Between Name and Number',
        duration: '5 min',
        content: `While your birth date is your "Blueprint" (Destiny), your Name is your "Vibration" (How the world sees you).

**The Name Components:**
- **Cornerstone (1st Letter):** Your approach to new opportunities.
- **Capstone (Last Letter):** Your ability to finish what you start.
- **Expression Number:** The sum of all letters—the "Total You."

**Name Changes:**
When you change your name (marriage, stage name), you are adding a new frequency to your life. This is why many successful people use "power names" that vibrate to 8, 11, or 33.`,
        keyPoints: [
          'Birth date is the blueprint; name is the frequency',
          'Names shape how the world perceives your energy',
          'Letter positions (First/Last) indicate success patterns',
          'Name changes alter your daily energy frequency'
        ]
      },
      {
        id: 'al-2',
        title: 'The Soul Urge (Vowels Only)',
        duration: '10 min',
        content: `Your Soul Urge number is calculated by adding only the vowels in your full birth name. It reveals what you *truly* want, even if you never tell anyone.

**Vowel Significance:**
- **A (1):** Desire for independence and being first.
- **E (5):** Desire for variation and sensory experience.
- **I (9):** Desire for humanitarian impact and wisdom.
- **O (6):** Desire for domestic harmony and responsibility.
- **U (3):** Desire for creative expression and joy.

**The Internal Drive:**
If your Life Path is an 8 (Money) but your Soul Urge is a 2 (Peace), you will always feel a conflict between your career and your heart. Aligning these is the key to happiness.`,
        keyPoints: [
          'Soul Urge reveals deep, hidden desires',
          'Calculated using only the vowels of birth name',
          'Explains internal personality conflicts',
          'Essential for understanding true motivation'
        ]
      },
      {
        id: 'al-3',
        title: 'Picking Business & Brand Names',
        duration: '15 min',
        content: `In business, the name is often more important than the product. 

**The Power Numbers for Business:**
- **Vibration 8:** For finance, real estate, and high-end luxury.
- **Vibration 3:** For marketing, entertainment, and social apps.
- **Vibration 1:** For innovative tech and leadership consulting.

**Avoiding the "Enemy" Name:**
A business name should never vibrate to a number that is an "enemy" of the founder's Life Path. If a Life Path 1 starts a company named "Harmony" (vibrating to 2), the company will lack the aggressive edge needed for the founder to succeed.`,
        keyPoints: [
          'Business names carry specific commercial frequencies',
          '8 and 33 are the "Gold Standards" for high-end success',
          'Match brand vibration to the industry type',
          'Ensure the name is compatible with the founder\'s path'
        ]
      },
      {
        id: 'al-4',
        title: 'The Power of the Signature',
        duration: '10 min',
        content: `How you sign your name is a magical act. It is the physical manifestation of your frequency.

**Signature Analysis:**
- **Ascending Line:** Optimism and growth.
- **Underline:** Self-reliance and stability.
- **Large Initials:** Confidence and social presence.
- **Illegibility:** Secrecy or a desire for mystery.

**Crafting Your Power Signature:**
We will walk through how to design a signature that incorporates your most favorable numbers and elements, ensuring every contract you sign is backed by your cosmic energy.`,
        keyPoints: [
          'Signatures are physical manifestation tools',
          'Handwriting direction indicates energy flow',
          'Design signatures to favor your personal numbers',
          'Use signatures to anchor intentions in reality'
        ]
      },
      {
        id: 'al-5',
        title: 'The Full Alphabet Decoded',
        duration: '10 min',
        content: `Every letter in the alphabet carries a specific frequency (1-9) and belongs to a specific category.

**The Numerical Values:**
- **1:** A, J, S
- **2:** B, K, T
- **3:** C, L, U
- **4:** D, M, V
- **5:** E, N, W
- **6:** F, O, X
- **7:** G, P, Y
- **8:** H, Q, Z
- **9:** I, R

**The Four Categories of Letters:**
- **Physical Letters (D, E, M, W):** Practical, active, body-oriented. Many physical letters make a person grounded and hardworking.
- **Mental Letters (A, H, J, N, P, G, L):** Analytical, intellectual, logical. Many mental letters create a thinker or strategist.
- **Emotional Letters (B, C, F, O, R, S, T, U, X, Z):** Feeling, artistic, empathetic. Many emotional letters indicate a highly sensitive, creative person.
- **Intuitive Letters (K, Q, V, Y):** Spiritual, psychic, perceptive. Intuitive letters suggest a strong connection to the unseen world.

**Letter Imbalance:**
A name that is overwhelmingly Mental but has zero Emotional letters indicates a person who is brilliant but struggles with empathy. A name heavily weighted in Physical letters indicates someone who needs constant movement and action.`,
        keyPoints: [
          'Letters are converted to numbers 1-9 using the Pythagorean system',
          'Every letter falls into Physical, Mental, Emotional, or Intuitive categories',
          'The balance of categories shapes your natural temperament',
          'Missing categories indicate areas requiring conscious development'
        ]
      },
      {
        id: 'al-6',
        title: 'Hidden Passion & Subconscious Self',
        duration: '8 min',
        content: `Beyond the core name numbers, two hidden calculations reveal deep psychological truths.

**The Hidden Passion Number:**
This is the number (1-9) that appears most frequently in your full birth name.
- It represents a concentrated talent and a strong subconscious desire.
- If you have five 5s in your name, your Hidden Passion is 5 (freedom, change, travel). You will constantly seek variety, even if your Life Path is a stable 4.
- Multiple Hidden Passions (e.g., tied between 3 and 8) pull you in multiple directions.

**The Subconscious Self Number:**
This is calculated by counting how many *different* numbers (1-9) appear in your name.
- It reveals how you react to sudden crises or emergencies.
- **Score of 9 (All numbers present):** Highly resilient. Can adapt to any situation quickly.
- **Score of 8:** Very competent, but may have one specific blind spot under extreme stress.
- **Score of 7 or lower:** Struggles significantly with unexpected change. Needs strong support systems during a crisis.

**The Synthesis:**
Your Hidden Passion drives your daily cravings, while your Subconscious Self determines your resilience when the world falls apart. Understanding both gives you immense psychological leverage over yourself.`,
        keyPoints: [
          'Hidden Passion is the most frequently occurring number in your name',
          'It reveals concentrated talent and subconscious desires',
          'Subconscious Self is the count of unique numbers (1-9) in your name',
          'It predicts resilience and reaction to sudden crises'
        ]
      },
      {
        id: 'al-7',
        title: 'The Planes of Expression',
        duration: '10 min',
        content: `Your name is a grid. By sorting the letters of your name into the Four Planes (Physical, Mental, Emotional, Intuitive), you create a psychological profile that rivals modern personality tests.

**Calculating the Planes:**
List all the letters of your full birth name. Categorize each letter into one of the four planes (refer to Lesson al-5). Count how many letters fall into each plane.

**Interpreting the Profile:**

- **Physical Plane Dominant:** You process the world through action. You learn by doing. You need tangible results and physical evidence. Excellent builders, athletes, and executors.
- **Mental Plane Dominant:** You process the world through logic. You need data, facts, and structure. Excellent executives, analysts, and strategists.
- **Emotional Plane Dominant:** You process the world through feeling. You read the room, understand human motives, and communicate powerfully. Excellent artists, therapists, and leaders.
- **Intuitive Plane Dominant:** You process the world through "knowing." You rely on gut feelings and sudden flashes of insight. Excellent innovators, spiritual guides, and trendsetters.

**The Balanced vs. Unbalanced Grid:**
A "perfectly balanced" grid is rare and often leads to a "jack of all trades, master of none" scenario. An unbalanced grid (e.g., heavy mental, zero intuitive) gives you a sharp specialty but requires you to consciously manage your blind spots.

**The Matrix Hack:**
When hiring a team, map their Planes of Expression. Do not put a Physical dominant person in a purely Strategic (Mental) role.`,
        keyPoints: [
          'The Four Planes map how you process reality',
          'Physical = Doing, Mental = Thinking, Emotional = Feeling, Intuitive = Knowing',
          'Dominant planes indicate your specialized superpower',
          'Weak or empty planes highlight your blind spots'
        ]
      },
      {
        id: 'al-8',
        title: 'Nicknames, Married Names & Stage Names',
        duration: '8 min',
        content: `Your birth name is your Destiny (Blueprint). But every time you adopt a new name, you put on a new energetic "coat."

**The Energetic Shift:**
- **The Birth Name:** This vibration never leaves you. It is the foundation.
- **The Current Name (Married/Changed):** This is the "minor" vibration. It colors your interactions but does not override the birth name.
- **Nicknames:** The shortest frequency. If everyone calls you "Bob" instead of "Robert," you are projecting the frequency of "Bob" into your daily social life.

**Married Names:**
Taking a partner\'s last name mathematically alters your Expression and Soul Urge numbers.
- **Favorable Shift:** The new name adds a missing number or creates a harmonizing frequency with your Life Path.
- **Unfavorable Shift:** The new name introduces "enemy numbers" or creates an imbalance (e.g., too many 4s, leading to feeling trapped in the marriage).
- **The Hack:** Always calculate a married name before legally changing it. If it vibrates poorly, keep your maiden name or hyphenate.

**Stage Names & Brand Names:**
Celebrities change their names because their birth name didn\'t carry the right frequency for mass appeal.
- Normal Jean Mortenson → Marilyn Monroe.
- Reginald Kenneth Dwight → Elton John.
- If you are building a public persona, you must engineer a name that vibrates to 1 (Leadership), 3 (Entertainment/Charisma), or 8 (Power/Money).`,
        keyPoints: [
          'Birth name is permanent destiny; changed names are secondary influences',
          'Married names can positively or negatively shift your daily frequency',
          'Always calculate a new name before legally adopting it',
          'Stage names should be engineered for 1, 3, or 8 vibrations'
        ]
      },
      {
        id: 'al-9',
        title: 'Transit Letters: Your Annual Name Cycle',
        duration: '10 min',
        content: `Your Personal Year (calculated by birth date) is the macro-cycle. But the letters of your name create a secondary, highly specific micro-cycle called Transits.

**How Transits Work:**
Each letter in your first, middle, and last name influences you for a specific number of years, equal to its numerical value.
- An \'A\' (Value 1) rules for 1 year.
- An \'E\' (Value 5) rules for 5 years.
- An \'S\' (Value 1) rules for 1 year.

**The Three Streams:**
You have three Transits running simultaneously at all times:
1. **Physical Transit (First Name):** Affects your body, environment, and daily actions.
2. **Mental Transit (Middle Name):** Affects your thoughts, studies, and state of mind.
3. **Spiritual Transit (Last Name):** Affects your inner growth, family, and soul lessons.

**Reading the Transit:**
If you are currently in an \'E\' (5) Physical Transit, your environment will be chaotic, full of travel, change, and instability for five years. If this overlaps with an \'H\' (8) Mental Transit, you will spend those five years intensely focused on business and money (8) while traveling or dealing with sudden shifts (5).

**The Essence Number:**
By adding your three current Transit letters together, you get your "Essence Number" for the year. This number tells you exactly what kind of experiences you will attract that year.
- **Essence 8:** A year of major financial flow or career promotion.
- **Essence 9:** A year of heavy emotional clearing, breakups, or relocation.`,
        keyPoints: [
          'Transit letters create specific multi-year cycles from your name',
          'Letters rule for a duration equal to their numerical value (1-9 years)',
          'First name = Physical, Middle = Mental, Last = Spiritual',
          'The Essence Number (sum of transits) predicts the year\'s theme'
        ]
      },
      {
        id: 'al-10',
        title: 'Name Optimization: Case Studies',
        duration: '10 min',
        content: `To master Letterology, you must see it applied. Here we look at how optimizing a name changes a destiny.

**Case Study 1: The Struggling Artist**
- **Original Name:** Vibrated to a 4 Expression, 7 Soul Urge. Highly analytical, rigid, isolated. This person made great art but couldn\'t sell it and hated networking.
- **The Optimization:** We engineered a "Stage Name" that vibrated to a 3 Expression (Charisma, Communication) and an 8 Soul Urge (Desire for Wealth).
- **The Result:** Within 18 months of using the new name professionally, they secured gallery representation. The 3 frequency made them magnetic to buyers; the 8 frequency allowed them to ask for high prices without guilt.

**Case Study 2: The Toxic Marriage Name**
- **Original Name:** 1 Life Path, 8 Expression. A powerhouse leader.
- **Married Name:** Changed the Expression to a 2 (Subservience, Peacekeeping) and the Soul Urge to a 6 (Sacrifice).
- **The Result:** The client lost her business edge, became overly accommodating, and felt deeply resentful. She was living a 2/6 frequency while her soul demanded a 1/8 frequency.
- **The Fix:** She legally reverted to her maiden name while staying married. Her career recovered within a year.

**How to Audit Your Own Name:**
1. Calculate your Birth Name Expression and Soul Urge. Do they align with your Life Path?
2. Check your Hidden Passion and Subconscious Self. What are your blind spots?
3. Calculate your Current (used) Name. Does it enhance or suppress your birth frequency?
4. If you use a brand or stage name, check its vibration against the 8 (Wealth) or 3 (Charisma) standard.

**The Golden Rule of Letterology:**
You cannot change your Life Path, but you have absolute control over your Name. If your life is stuck, change your frequency by changing your name.`,
        keyPoints: [
          'Name optimization can dramatically shift career and social success',
          'A stage name should inject the frequencies you naturally lack',
          'Changing back to a maiden name can restore lost personal power',
          'You control your name, which means you control your projected frequency'
        ]
      }
    ]
  },
  {
    id: 'health-vitality',
    title: 'Health, Vitality & The Elements',
    description: 'Discover how your Zodiac and Element influence your physical vessel',
    duration: '95 min',
    free: false,
    lessons: [
      {
        id: 'hv-1',
        title: 'The Body as an Elemental System',
        duration: '5 min',
        content: `In Eastern wisdom, health is the balance of the Five Elements within the body. When one element is too "High" or too "Low," disease manifests.

**Elemental Weak Points:**
- **Wood:** Liver and Gallbladder.
- **Fire:** Heart and Small Intestine.
- **Earth:** Spleen and Stomach.
- **Metal:** Lungs and Large Intestine.
- **Water:** Kidneys and Bladder.

**The Goal:**
By identifying your birth element, you can predict which systems will be the first to struggle under stress. You don't wait for the symptoms—you balance the element before the issue starts.`,
        keyPoints: [
          'Health is the balance of the five elements',
          'Elements correspond to specific organ systems',
          'Birth element indicates natural biological weak points',
          'Preventative care starts with elemental balancing'
        ]
      },
      {
        id: 'hv-2',
        title: 'Zodiac Vitality Patterns',
        duration: '10 min',
        content: `Each Chinese Zodiac animal enters this world with a different reservoir of "Jing" (Vitality).

**High Energy Animals:** Dragon, Tiger, Horse (Need high-impact activity).
**Refined Energy Animals:** Snake, Rooster, Rat (Need precision and mental rest).
**Steady Energy Animals:** Ox, Goat, Pig (Need consistency and grounding).

**The Danger of Over-Training:**
A Snake (Refined/Low physical Jing) trying to follow a heavy bodybuilding program designed for a Tiger will often end up with adrenal Fatigue. You must train and eat according to your animal's nature.`,
        keyPoints: [
          'Zodiac animals have different vitality reservoirs',
          'Match exercise intensity to your animal type',
          'Different animals prone to different types of stress',
          'Over-exerting refined animals leads to rapid aging'
        ]
      },
      {
        id: 'hv-3',
        title: 'Dietary Alignment for Success',
        duration: '15 min',
        content: `What you eat either fuels your element or extinguishes it.

**The Elemental Kitchen:**
- **Fire Elements:** Need "cooling" foods to prevent inflammation (Cucumber, Mint).
- **Water Elements:** Need "warming" foods to prevent depression/stagnation (Ginger, Soup).
- **Metal Elements:** Need "moisturizing" foods to prevent dry lungs/skin (Pear, Honey).

**Timing Your Meals:**
Using the Chinese Organ Clock, we will look at when you should eat based on your weakest element. Eating a heavy meal when your Stomach/Spleen energy is at its lowest is a recipe for low productivity.`,
        keyPoints: [
          'Foods have thermal and elemental properties',
          'Oppose element excess with dietary property',
          'Utilize the Organ Clock for optimal digestion',
          'Nutritional timing determines daily energy output'
        ]
      },
      {
        id: 'hv-4',
        title: 'The Chinese Organ Clock',
        duration: '8 min',
        content: `Traditional Chinese Medicine (TCM) operates on a 24-hour clock. Every two hours, a different organ system reaches its peak energetic state.

**The Clock Breakdown:**
- **3 AM - 5 AM (Lungs / Metal):** Peak time for deep breathing and waking up. If you wake up coughing or anxious during this time, you have unresolved grief (Metal element emotion).
- **5 AM - 7 AM (Large Intestine / Metal):** The ideal time for elimination and letting go—both physically and mentally.
- **7 AM - 9 AM (Stomach / Earth):** The best time for your largest meal of the day. The digestive fire is at its peak.
- **9 AM - 11 AM (Spleen / Earth):** Best time for focused mental work. The Spleen converts food to Qi (energy).
- **11 AM - 1 PM (Heart / Fire):** High energy, joy, and connection. Best time for socializing or collaborating.
- **1 PM - 3 PM (Small Intestine / Fire):** Sorting out the pure from the impure. Good time for problem-solving.
- **3 PM - 5 PM (Bladder / Water):** Energy dip. Good time for hydration and a light restorative break.
- **5 PM - 7 PM (Kidneys / Water):** Restoring the core reserves. Dinner should be light.
- **7 PM - 9 PM (Pericardium / Fire):** Protection of the heart. Time for reading, intimacy, and unwinding.
- **9 PM - 11 PM (Triple Burner / Fire):** Endocrine system regulation. You should be asleep or heading to sleep.
- **11 PM - 1 AM (Gallbladder / Wood):** Cellular repair. If you are awake here, you are burning your core vitality.
- **1 AM - 3 AM (Liver / Wood):** Deep blood cleansing. Waking up during this time indicates suppressed anger (Wood element emotion).

**Strategic Alignment:**
If your birth element is Wood, the 11 PM - 3 AM window is critical for you. Staying up late will destroy a Wood element person faster than any other element. Align your daily routine with your elemental strengths and weaknesses.`,
        keyPoints: [
          'Energy peaks in different organ systems every two hours',
          'Waking at specific times reveals specific emotional blockages',
          'Align meals and work with the Stomach and Spleen windows',
          'Sleep during your birth element\'s peak window is non-negotiable'
        ]
      },
      {
        id: 'hv-5',
        title: 'Exercise Protocols by Element & Animal',
        duration: '10 min',
        content: `A workout that makes one person a millionaire might put another person in the hospital. Exercise must be prescribed by Element and Zodiac Animal.

**Elemental Workouts:**
- **Wood (Growth/Flexibility):** Yoga, Pilates, martial arts, stretching. Wood needs to remain pliable. Stiff muscles lead to a stiff mind and blocked finances.
- **Fire (Heat/Explosion):** HIIT, sprinting, competitive sports. Fire needs to sweat aggressively to burn off excess nervous energy.
- **Earth (Stability/Grounding):** Heavy weightlifting, hiking, rock climbing. Earth needs to feel gravity and resistance to build strength.
- **Metal (Structure/Breath):** Marathon running, breathwork (Wim Hof), structured calisthenics. Metal thrives on endurance and repetitive precision.
- **Water (Flow/Cooling):** Swimming, Tai Chi, steady-state cardio, rowing. Water needs continuous, fluid movement without aggressive joint impact.

**Animal Intensity Matching:**
- **The Workhorses (Ox, Horse, Dragon, Tiger):** Need high volume and high intensity. They can handle daily grueling workouts.
- **The Refined (Rabbit, Sheep, Snake):** Need elegance and form over brute strength. Overtraining will wreck their nervous systems.
- **The Adaptable (Rat, Monkey, Rooster, Dog, Pig):** Need variety. Doing the same workout every day will cause them to plateau mentally and physically.

**The Golden Rule:**
If you leave the gym feeling depleted for the rest of the day, you are training against your element. You should leave feeling activated.`,
        keyPoints: [
          'Exercise must match your elemental constitution',
          'Wood needs flexibility; Fire needs heat; Earth needs resistance',
          'Metal needs endurance; Water needs fluid motion',
          'Overtraining refined Zodiac animals destroys their vitality'
        ]
      },
      {
        id: 'hv-6',
        title: 'Mental Health & Your Numbers',
        duration: '10 min',
        content: `Your Life Path number heavily influences your psychological vulnerabilities. Understanding your number\'s "Shadow State" is critical for mental health.

**The Anxiety Spectrum (2, 7, 11, 22, 33):**
- **Life Path 2 & 11:** Hypersensitive to other people\'s emotions. Anxiety comes from absorbing the environment. *Cure:* Strict isolation and boundary setting.
- **Life Path 7:** Existential anxiety. Overthinking until the mind spins out. *Cure:* Getting out of the head and into the physical body (heavy exercise).
- **Master Numbers (11, 22, 33):** High-frequency nervous systems. Prone to panic attacks if they aren\'t living their purpose. *Cure:* Service to others and daily grounding.

**The Depression Spectrum (4, 6, 9):**
- **Life Path 4:** Depression from feeling "trapped" by obligations or lack of progress. *Cure:* Breaking routine and doing something purely spontaneous.
- **Life Path 6:** Martyrdom depression. Feeling unappreciated for sacrifices. *Cure:* Saying "no" without guilt and taking care of oneself first.
- **Life Path 9:** Nostalgic or grief-based depression. Inability to let go of the past. *Cure:* Radical acceptance and closing old chapters permanently.

**The Burnout Spectrum (1, 3, 5, 8):**
- **Life Path 1 & 8:** Adrenal burnout from overworking and needing to control everything. *Cure:* Delegating and forcing days off.
- **Life Path 3 & 5:** Dopamine burnout. Chasing the next high, leading to emotional crashes. *Cure:* Dopamine detox and embracing boredom.

**The Action Plan:**
When you feel your mental health slipping, identify whether it is an Anxiety, Depression, or Burnout pattern, and apply the specific cure for your number. Do not use a 7\'s cure (exercise) for an 11\'s problem (needs isolation).`,
        keyPoints: [
          'Different Life Paths are prone to different psychological shadow states',
          '2, 7, and Master Numbers battle anxiety',
          '4, 6, and 9 battle feeling trapped or unappreciated',
          '1, 3, 5, and 8 battle burnout from excess or control'
        ]
      },
      {
        id: 'hv-7',
        title: 'Seasonal Health Cycles',
        duration: '8 min',
        content: `Your vitality is not static; it fluctuates with the seasons. According to the Five Elements, each season is governed by a specific element.

**The Seasonal Wheel:**
- **Spring (Wood):** Energy pushes upward and outward. Time for detoxing, waking up early, and starting new physical routines. Liver health is paramount.
- **Summer (Fire):** Maximum expansion. High energy. Heart and small intestine health are key. Beware of dehydration and burnout.
- **Late Summer (Earth):** The transition period (August/September). Focus on digestion, grounding, and stability. Spleen and stomach need care.
- **Autumn (Metal):** Energy begins moving inward. Time for organization, letting go of bad habits, and preparing for the cold. Lung health is critical (deep breathing).
- **Winter (Water):** Maximum inward focus. Hibernation, rest, and storage of energy. Kidney and bladder health.

**Your Elemental Advantage:**
You will naturally feel most powerful during the season that matches your birth element (e.g., Fire elements peak in Summer).

**Your Elemental Danger Zone:**
You will feel weakest during the season that "destroys" your element in the control cycle.
- Wood is destroyed by Metal (Autumn is hard for Wood).
- Fire is destroyed by Water (Winter is hard for Fire).
- Earth is destroyed by Wood (Spring is hard for Earth).
- Metal is destroyed by Fire (Summer is hard for Metal).
- Water is destroyed by Earth (Late Summer is hard for Water).

**The Hack:**
During your "Danger Zone" season, you must drastically increase your self-care, sleep more, and avoid taking massive risks. During your "Advantage" season, push as hard as you can.`,
        keyPoints: [
          'Each season is ruled by a specific element and organ system',
          'You peak during the season that matches your birth element',
          'You are weakest during the season that controls/destroys your element',
          'Adjust your workload and rest based on the seasonal cycle'
        ]
      },
      {
        id: 'hv-8',
        title: 'Stress Response by Life Path',
        duration: '8 min',
        content: `When the pressure hits, every Life Path reverts to a specific defense mechanism. Knowing your default stress response allows you to catch it before it ruins your health or relationships.

**The Fight Response (1, 8):**
- Under stress, these numbers become aggressive, dictatorial, and combative. They try to assert dominance to regain control.
- **The Pivot:** Walk away. Physical distance is required before communication.

**The Flight/Chaos Response (3, 5):**
- Under stress, these numbers scatter. They run away, ghost people, quit jobs impulsively, or seek instant gratification (partying/spending) to escape the pressure.
- **The Pivot:** Write everything down. Create a list to anchor the chaotic energy.

**The Freeze/Overthink Response (4, 7):**
- Under stress, these numbers paralyze. The 4 gets stubborn and refuses to move; the 7 overanalyzes every detail until action is impossible.
- **The Pivot:** Take one tiny, physical action. Break the paralysis with movement.

**The Fawn/Appease Response (2, 6, 9):**
- Under stress, these numbers abandon their own needs to keep the peace. They agree to things they hate just to stop the conflict.
- **The Pivot:** Delay the response. Say "I need 24 hours to think about this" instead of saying yes.

**Master Numbers (11, 22, 33):**
- Under stress, Master Numbers often experience physical symptoms (migraines, stomach issues, sudden fatigue) before mental symptoms. Their bodies act as fuses that blow when the voltage gets too high.
- **The Pivot:** Immediate sensory deprivation (dark room, silence, sleep).`,
        keyPoints: [
          'Stress triggers predictable defense mechanisms based on your numbers',
          '1 and 8 fight; 3 and 5 flee; 4 and 7 freeze; 2, 6, and 9 appease',
          'Catching the default response allows you to pivot to healthy action',
          'Master numbers often experience stress physically first'
        ]
      },
      {
        id: 'hv-9',
        title: 'The Healing Numbers: 3, 6, 9',
        duration: '8 min',
        content: `Nikola Tesla famously said: "If you only knew the magnificence of the 3, 6 and 9, then you would have the key to the universe." In medical numerology, these are the frequencies of regeneration.

**The Trinity of Healing:**
- **The 3 (Creation/Cellular Joy):** The vibration of growth and immune strength. Laughter, singing, and play actually vibrate at a 3 frequency, which physically boosts the immune system.
- **The 6 (Nurturing/Homeostasis):** The vibration of balance. The body\'s ability to regulate temperature, blood pressure, and hormone levels relies on the 6 frequency.
- **The 9 (Completion/Detoxification):** The vibration of release. Sweating, fasting, and eliminating toxins all operate on the 9 frequency.

**Applying the 3-6-9 Protocol:**
When recovering from illness or extreme burnout, you can encode these numbers into your routine:
- **3:** Drink water in 3 large intervals daily. Take 3 deep breaths before eating.
- **6:** Ensure you get multiples of 3 hours of sleep (ideally 6 or 9 hours) to complete full REM cycles. Eat meals within a 6-hour window (intermittent fasting).
- **9:** Perform 9 minutes of intentional stretching or meditation. End showers with 9 seconds of cold water to stimulate the vagus nerve.

**The Missing Numbers:**
If you are missing 3, 6, or 9 in your core chart, you may struggle with the healing process. Missing 3s struggle to stay positive; missing 6s neglect their bodily needs; missing 9s hold onto toxic waste (physical and emotional). You must consciously inject these frequencies into your life.`,
        keyPoints: [
          '3, 6, and 9 are the frequencies of cellular regeneration and healing',
          '3 builds immunity; 6 creates balance; 9 eliminates toxins',
          'Apply 3-6-9 timing to daily habits for faster recovery',
          'Missing these numbers in your chart requires conscious effort to heal'
        ]
      },
      {
        id: 'hv-10',
        title: 'Sleep, Recovery & Longevity by Element',
        duration: '10 min',
        content: `Sleep is not a one-size-fits-all requirement. Your elemental makeup dictates how much sleep you need, what kind of sleep environment works best, and how you achieve longevity.

**Sleep Profiles by Element:**

- **Water Element (The Deep Sleeper):** Needs the most sleep (8-9 hours). Water requires deep, uninterrupted rest to replenish Kidney essence (the root of longevity). A cold, pitch-black room is mandatory.
- **Wood Element (The Restless Sleeper):** Needs 7-8 hours but often struggles to wind down due to an overactive Liver (planning/anger). Must stop screen time 2 hours before bed.
- **Fire Element (The Light Sleeper):** Can function on 6-7 hours. Prone to vivid dreams and waking up in the middle of the night. Needs a cooling environment to calm the Heart.
- **Earth Element (The Heavy Sleeper):** Needs 7-8 hours but struggles with grogginess in the morning. Digestion issues often interrupt their sleep. Should not eat within 3 hours of bedtime.
- **Metal Element (The Structured Sleeper):** Needs exactly 7-8 hours. Metal thrives on a strict routine. Going to bed at the exact same time every night is crucial for their longevity.

**The Concept of "Jing" (Essence):**
In Chinese Medicine, you are born with a finite amount of "Jing" (stored in the Kidneys/Water element). When your Jing runs out, you die.
- **Burning Jing:** Drugs, alcohol, excessive stress, lack of sleep, and overworking all burn Jing rapidly.
- **Preserving Jing:** Meditation, Qigong, adequate sleep, and living in alignment with your numbers preserve Jing.

**Longevity Strategies:**
1. Protect your Water element (hydration, rest, fear management).
2. Never skip the Gallbladder/Liver sleep window (11 PM - 3 AM).
3. Do not push your physical vessel during your "Danger Season."
4. If you have a Karmic Debt, clear it—unresolved karmic debt creates chronic physical tension that ages the body prematurely.`,
        keyPoints: [
          'Sleep requirements and optimal environments vary by element',
          'Water needs the most rest; Fire can often function on less',
          'Jing is your finite life essence—protect it through rest and alignment',
          'Chronic stress from fighting your numerology accelerates aging'
        ]
      }
    ]
  },
  {
    id: 'matrix-hacking',
    title: 'Matrix Hacking: Defensive Numerology',
    description: 'Defensive numerology: how to survive and thrive when the energy is against you',
    duration: '105 min',
    free: false,
    lessons: [
      {
        id: 'mh-1',
        title: 'The "Enemy" Numbers',
        duration: '8 min',
        content: `The matrix is a system of math. Just as 1+1=2, certain energy combinations result in friction. We call these "Enemy Numbers."

**The Primary Enemies:**
- **1 vs 2:** Leadership vs Cooperation (Can be friction).
- **4 vs 5:** Structure vs Chaos (The most common office conflict).
- **8 vs 9:** Materialism vs Humanitarianism.

**Identifying Your Enemy:**
An enemy is someone whose Life Path is in direct mathematical opposition to yours. You cannot "fix" them. You must learn to *navigate* them or use a "Bridge Number" to communicate.`,
        keyPoints: [
          'The matrix has inherent mathematical frictions',
          'Enemy numbers are pairs that struggle to coexist',
          'Don\'t try to change an enemy energy—navigate it',
          'Use "Bridge" numbers to mediate conflicts'
        ]
      },
      {
        id: 'mh-2',
        title: 'Surviving Incompatible Cycles',
        duration: '10 min',
        content: `What happens when you are in a Personal Year 1 (I want to start) but the world is in a Universal Year 9 (Everything is ending)?

**The Counter-Current:**
This is when people feel "stuck" despite doing everything right. 

**Survival Strategies:**
- **Lower the Stakes:** Don't bet the whole house on a venture during a counter-current.
- **Focus on Research:** Use the friction as a time to sharpen your blade.
- **The Pivot:** Sometimes the matrix is telling you to go a different direction.

We will look at the Universal Year 4 (The global plowing year) and how to protect your assets when the collective energy is restrictive.`,
        keyPoints: [
          'Predict periods of "Counter-Current" energy',
          'Lower financial risk when cycles are opposed',
          'Use restrictive global years for internal building',
          'Recognize "Stall" patterns before they cause burnout'
        ]
      },
      {
        id: 'mh-3',
        title: 'Cosmic Armor: Number Signaling',
        duration: '12 min',
        content: `Number Signaling as a defensive tool. 

**Power Colors:**
Wearing your element's favorable color isn't just fashion; it's a frequency shield. 

**Digital Shields:**
- **Pins and Passwords:** Never use your enemy number in your PIN. Use your Power Numbers (calculated from Life Path) to "lock" your energy.
- **Email Send Times:** Use a delay-send tool to ensure major communications go out on your Power Hours.

**Manifestation Redirection:**
When bad energy is coming your way (e.g., a challenging year), you can "redirect" it by performing specific charitable acts that resonate with the challenging number. For example, if facing a difficult 16/7 year, perform acts of radical humility.`,
        keyPoints: [
          'Use colors and numbers as frequency shields',
          'Avoid enemy numbers in critical digital security',
          'Time communications to align with Power Hours',
          'Redirect negative energy through specific charity'
        ]
      },
      {
        id: 'mh-4',
        title: 'The GG33 Master Mindset',
        duration: '15 min',
        content: `The final lesson in the Study Zone. Moving from a "Victim" of the numbers to a "Master" of the matrix.

**The Golden Rules:**
1. Numbers don't make you; they reveal you.
2. Timing beats talent.
3. Awareness is 90% of the battle.

**The Path Forward:**
You now have the keys to the kingdom. Use this wisdom to help yourself, build your family, and serve your community. The matrix is just a game of numbers. Once you know the rules, you can decide how to play.

Welcome to the elite circle of GG33 practitioners.`,
        keyPoints: [
          'Shift from being a victim to a master of path',
          'Timing is often more important than pure skill',
          'Always prioritize awareness over reaction',
          'Use this knowledge for self-mastery and service'
        ]
      },
      {
        id: 'mh-5',
        title: 'The Address & Location Shield',
        duration: '10 min',
        content: `Where you live and work heavily dictates the energy you absorb every day. Your physical location is a frequency receiver.

**Calculating Your Address Vibration:**
Add the numbers of your street address (or apartment number) until you get a single digit. Ignore letters unless it is a specific unit (e.g., Apt 4B = 4 + 2(B) = 6).
- **Example:** 1435 Main St. -> 1+4+3+5 = 13 -> 4.

**The Best Frequencies:**
- **Vibration 8:** The ultimate frequency for wealth, business, and power. Perfect for offices.
- **Vibration 6:** The ideal frequency for raising a family, domestic harmony, and healing.
- **Vibration 3:** Great for artists, writers, and social hubs. High energy and fun.

**The Problem Frequencies:**
- **Vibration 9:** A place of endings and transition. You won\'t live here long. Things break often.
- **Vibration 5:** Chaotic. High turnover, loud neighbors, constant movement. Hard to sleep.
- **Vibration 7:** Isolating. Great for a monastery or writer\'s retreat, terrible for an active social life.

**The Hack (Correcting a Bad Address):**
If you live in a 5 house and crave stability (4), you don\'t have to move. You can "hack" the matrix by writing the number needed to bridge the gap (in this case, an 8, because 5+8=13=4) on the inside of your front door. You are mathematically altering the incoming frequency.`,
        keyPoints: [
          'Address numbers determine the energetic baseline of a location',
          '8 is best for wealth; 6 is best for family; 3 is best for creativity',
          '9, 5, and 7 create challenging living environments for most people',
          'Add a bridging number inside your door to alter the house frequency'
        ]
      },
      {
        id: 'mh-6',
        title: 'Travel Numerology: Safe Dates & Destinations',
        duration: '10 min',
        content: `Traveling shifts your energy field drastically. When you travel on the wrong dates or to incompatible locations, you experience delays, lost luggage, and accidents.

**Calculating Safe Travel Dates:**
Always travel on a Personal Day that aligns with your Life Path or is universally favorable.
- **Best Travel Days:** 5 (The traveler\'s number), 3 (Smooth, easy energy), 1 (Fast, direct).
- **Worst Travel Days:** 4 (Delays, strict security, mechanical issues), 7 (Isolation, getting lost), 9 (Ending/losing things).

**Destination Compatibility:**
Cities and countries vibrate to specific numbers (calculate the sum of the letters).
- **New York (3):** Fast, loud, creative, social.
- **London (7):** Historical, reserved, rainy, analytical.
- **Tokyo (8):** Efficient, wealthy, structured, powerful.
- **Paris (1):** Proud, independent, trend-setting.

**The Void-of-Course Protocol:**
If you *must* travel on a 4 or 9 day, or if you are in a Personal Year 7 (when travel is naturally difficult), you must apply defensive protocols:
1. Arrive 3 hours early (counteract the 4 delay).
2. Double-check all documentation (counteract the 9 loss).
3. Wear your power element colors while in transit to shield your aura.`,
        keyPoints: [
          'Travel on 1, 3, or 5 Personal Days for smooth journeys',
          'Avoid traveling on 4 (delays) or 9 (loss) Personal Days',
          'Cities carry distinct numerical vibrations that interact with your chart',
          'Apply strict defensive protocols when forced to travel on bad dates'
        ]
      },
      {
        id: 'mh-7',
        title: 'Digital Hygiene by the Numbers',
        duration: '8 min',
        content: `Your digital footprint is an extension of your energetic body. If your digital life is misaligned, you leak power daily.

**Social Media Timing:**
Don\'t post randomly. Post when your target audience is mathematically receptive, or when your Personal Day supports visibility.
- **To go viral/entertain:** Post on a 3 or 5 Personal Day.
- **To sell/launch:** Post on a 1 or 8 Personal Day.
- **To educate/inform:** Post on a 7 or 9 Personal Day.

**Phone Number Analysis:**
Your phone number is your primary communication frequency.
- Add the entire 10-digit number together to find its core vibration.
- A business phone number vibrating to 8 attracts high-paying clients.
- A business phone vibrating to 4 attracts steady, reliable, but lower-paying clients.
- A business phone vibrating to 7 will rarely ring.

**The Digital Detox Cycle:**
Your electronics are tied to the Fire element. Overuse leads to "Fire excess" (anxiety, insomnia, burnout). Schedule your digital detoxes on your 7 Personal Days. Turn off all screens 2 hours before the Gallbladder sleep window (11 PM) to prevent matrix overload.`,
        keyPoints: [
          'Time social media posts to align with Personal Day energy',
          'Phone numbers have distinct frequencies that attract specific caller types',
          '8 and 3 are ideal phone vibrations for business',
          'Digital detoxes are mandatory on 7 Personal Days'
        ]
      },
      {
        id: 'mh-8',
        title: 'Relationship Shields & Boundary Numbers',
        duration: '10 min',
        content: `Energy vampires are real. They are usually people operating in the negative shadow of their Life Path, and they unconsciously siphon your vitality.

**Recognizing the Drain:**
- The Shadow 2: Drains you through constant complaining and neediness.
- The Shadow 8: Drains you through intimidation and financial control.
- The Shadow 9: Drains you through emotional manipulation and guilt trips.

**Setting Energetic Boundaries:**
When dealing with a toxic individual, you must adopt the energy of the number that naturally checks or overrides theirs.
- **To block a toxic 8 (Aggressor):** Use the 4 (Unmovable structure/rules). Do not argue; point to the contract or the policy.
- **To block a toxic 2 (Manipulator):** Use the 1 (Direct independence). Say "No" without explanation.
- **To block a toxic 5 (Agent of Chaos):** Use the 8 (Authority). Take command of the environment immediately.

**The Bridge Technique:**
If you must work with an incompatible number (e.g., you are a 4, they are a 5), use the Bridge Number. The Bridge is the difference between your numbers (5 - 4 = 1).
- The 1 frequency (Leadership/Action) is the bridge. Stop arguing about process (4) or freedom (5) and focus entirely on taking decisive action (1).

**Group Protection:**
Before entering a crowded, low-vibration space, visualize your Life Path number or your favorable Master Number (11, 22, 33) as a glowing shield around your body. It sounds simple, but it mathematically alters your aura\'s resonance.`,
        keyPoints: [
          'Energy vampires operate in the shadow frequencies of their numbers',
          'Use specific blocking numbers to shut down toxic behavior',
          'Use the Bridge Number (the difference) to communicate with incompatible people',
          'Visualize your power numbers as energetic shields in crowds'
        ]
      },
      {
        id: 'mh-9',
        title: 'The Annual Defense Strategy',
        duration: '10 min',
        content: `A master practitioner doesn\'t wait for a crisis; they map the battlefield a year in advance. This is how you build an Annual Defense Strategy.

**Step 1: Identify the Vulnerable Months**
Look at your upcoming 12 months. Flag any Personal Month 4 (Grind/Delays), Month 7 (Isolation/Low Energy), or Month 9 (Endings/Loss). These are your vulnerability windows.

**Step 2: Pre-emptive Action**
- If you know a 4 month is coming, finish all administrative tasks *before* it arrives so you aren\'t crushed by paperwork.
- If a 7 month is coming, schedule your vacation or retreat for that month. Lean into the isolation.
- If a 9 month is coming, preemptively fire bad clients or break off toxic relationships. Choose what ends before the matrix chooses for you.

**Step 3: The Financial Buffer**
During an 8 month, you must save at least 20% of your influx to cover the inevitable slow periods (Months 2 and 7). Matrix hackers never assume the 8 energy will last forever.

**Step 4: The Numerological First Aid Kit**
Keep specific tools ready for your weak periods:
- Elemental foods that support your birth element.
- A list of tasks suited for low-energy days.
- A trusted advisor (preferably an 8 or 4) to call when you feel overwhelmed.

By mapping the year in advance, a "crisis" becomes a scheduled, manageable event.`,
        keyPoints: [
          'Map your 4, 7, and 9 Personal Months a year in advance',
          'Take preemptive action to align with the difficult energy rather than fight it',
          'Save excess from 8 months to fund the slower months',
          'A planned crisis is no longer a crisis; it is just a phase of the cycle'
        ]
      },
      {
        id: 'mh-10',
        title: 'Emergency Numerology: Crisis Navigation',
        duration: '10 min',
        content: `Sometimes the matrix throws a "Tower" event (16/7 energy) that you didn\'t see coming. A sudden job loss, a medical emergency, or a massive betrayal. Here is the emergency protocol.

**1. Stop the Bleeding (The 4 Protocol)**
In a crisis, the instinct is to panic (5 energy). You must immediately invoke the 4. Create structure. Make lists. Focus entirely on the physical steps required in the next 24 hours. No long-term thinking yet.

**2. Read the Numbers of the Crisis**
What day did the event happen? What was the Personal Day number? The numbers will tell you *why* it happened.
- If it happened on a 9 day, it was karmically destined to end. Let it go.
- If it happened on a 5 day, it is a forced pivot. Look for the hidden opportunity.

**3. The Birthday Reset**
If you are in a catastrophic cycle, your next Birthday is your emergency exit. The matrix resets your Personal Year on your birth month. Use the time leading up to your birthday to completely clear the slate so the new energy can enter cleanly.

**4. The 5 Exit Strategy**
When you are completely trapped in a toxic situation (a bad job, a dangerous relationship) and the normal rules aren\'t working, you must invoke the 5 (Chaos/Radical Change). You break the rules. You move in the middle of the night. You quit with no notice. The 5 is the emergency shatter-glass option. Use it rarely, but know it exists.

**Rebuilding:**
After a Tower event, do not try to rebuild the exact same structure. The matrix knocked it down because the foundation was flawed. When the smoke clears, start over on a 1 Day, using the wisdom of the destruction to build something impenetrable.`,
        keyPoints: [
          'Invoke 4 (Structure) immediately during a crisis to stop panic',
          'Read the numbers of the event to understand its true cosmic purpose',
          'Your birthday is your ultimate emergency energetic reset point',
          'Use the 5 (Radical Change) as the shatter-glass option when trapped'
        ]
      }
    ]
  }
];

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getLessonById(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseById(courseId);
  return course?.lessons.find(l => l.id === lessonId);
}

export function getTotalLessons(): number {
  return courses.reduce((acc, course) => acc + course.lessons.length, 0);
}

export function getTotalDuration(): string {
  const totalMinutes = courses.reduce((acc, course) => {
    const minutes = parseInt(course.duration);
    return acc + (isNaN(minutes) ? 0 : minutes);
  }, 0);

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }
  return `${totalMinutes} min`;
}
