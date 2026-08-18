import React, { useState, useMemo } from 'react';
import {
  NatalChartData,
  PlanetPosition,
  Aspect,
  ZODIAC_SIGNS,
  normalizeAngle
} from '@/lib/astrologyCalculations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Info,
  Layers,
  Compass,
  Zap,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface BirthChartWheelProps {
  chart: NatalChartData;
  isPro?: boolean;
}

type AspectFilter = 'all' | 'harmonious' | 'dynamic' | 'major';

export function BirthChartWheel({ chart, isPro = true }: BirthChartWheelProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<Aspect | null>(null);
  const [aspectFilter, setAspectFilter] = useState<AspectFilter>('all');
  const [showHouseLines, setShowHouseLines] = useState(true);

  // SVG Chart Geometry Constants
  const size = 640;
  const center = size / 2;
  const rOuter = 295;
  const rZodiacOuter = 290;
  const rZodiacInner = 245;
  const rHouses = 200;
  const rAspects = 135;

  const activePlanet = hoveredPlanet || selectedPlanet;

  // Ascendant angle (placed at 180° in SVG space = 9 o'clock / East Horizon)
  const ascLong = chart.ascendant.longitude;

  /**
   * Converts a celestial longitude (0-360) into SVG angle (degrees),
   * putting the Ascendant on the left (180° / 9 o'clock), rotating counter-clockwise.
   */
  const getSvgAngle = (longitude: number): number => {
    // Offset relative to Ascendant
    const rel = normalizeAngle(longitude - ascLong);
    // 180 is left (9 o'clock). As longitude increases counter-clockwise, SVG angle decreases:
    return normalizeAngle(180 - rel);
  };

  /**
   * Converts polar coordinates (radius, angleDeg) to Cartesian {x, y}
   */
  const polarToCartesian = (radius: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center - radius * Math.sin(rad), // SVG y-axis points downward
    };
  };

  // Filter aspects based on active filter
  const filteredAspects = useMemo(() => {
    return chart.aspects.filter((asp) => {
      // If a planet is hovered or selected, only show aspects for that planet
      if (activePlanet) {
        if (asp.planet1.id !== activePlanet.id && asp.planet2.id !== activePlanet.id) {
          return false;
        }
      }

      if (aspectFilter === 'harmonious') {
        return asp.aspectType === 'Trine' || asp.aspectType === 'Sextile';
      }
      if (aspectFilter === 'dynamic') {
        return asp.aspectType === 'Square' || asp.aspectType === 'Opposition';
      }
      if (aspectFilter === 'major') {
        return asp.orb <= 5;
      }
      return true;
    });
  }, [chart.aspects, activePlanet, aspectFilter]);

  // Generate SVG path for a circular ring sector (slice)
  const describeArcSector = (rIn: number, rOut: number, startAngle: number, endAngle: number) => {
    const p1 = polarToCartesian(rOut, startAngle);
    const p2 = polarToCartesian(rOut, endAngle);
    const p3 = polarToCartesian(rIn, endAngle);
    const p4 = polarToCartesian(rIn, startAngle);

    const diff = normalizeAngle(endAngle - startAngle);
    const largeArc = diff > 180 ? 1 : 0;

    return `
      M ${p1.x} ${p1.y}
      A ${rOut} ${rOut} 0 ${largeArc} 0 ${p2.x} ${p2.y}
      L ${p3.x} ${p3.y}
      A ${rIn} ${rIn} 0 ${largeArc} 1 ${p4.x} ${p4.y}
      Z
    `;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Chart Wheel Canvas */}
      <Card className="lg:col-span-8 bg-zinc-950/80 border-zinc-800/80 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <div className="p-4 sm:p-6 border-b border-zinc-800/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                Natal Chart Wheel
                <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-400 bg-amber-500/5">
                  Geocentric Placidus
                </Badge>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Tap or hover any planet or aspect line to inspect degrees & cosmic connections.
              </p>
            </div>
          </div>

          {/* Aspect Line Filter Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              variant={aspectFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className={`h-7 px-2.5 text-xs rounded-lg ${
                aspectFilter === 'all'
                  ? 'bg-amber-500 text-zinc-950 font-semibold'
                  : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              onClick={() => { setAspectFilter('all'); setSelectedPlanet(null); }}
            >
              All Lines ({chart.aspects.length})
            </Button>
            <Button
              variant={aspectFilter === 'harmonious' ? 'outline' : 'ghost'}
              size="sm"
              className={`h-7 px-2.5 text-xs rounded-lg ${
                aspectFilter === 'harmonious'
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              onClick={() => setAspectFilter('harmonious')}
            >
              Harmonic △⚹
            </Button>
            <Button
              variant={aspectFilter === 'dynamic' ? 'outline' : 'ghost'}
              size="sm"
              className={`h-7 px-2.5 text-xs rounded-lg ${
                aspectFilter === 'dynamic'
                  ? 'border-red-500/50 bg-red-500/10 text-red-300 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              onClick={() => setAspectFilter('dynamic')}
            >
              Dynamic □☍
            </Button>
          </div>
        </div>

        <CardContent className="p-2 sm:p-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[580px] aspect-square flex items-center justify-center select-none">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full drop-shadow-2xl"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Center Gradient Glow */}
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#18181b" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#09090b" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#040406" stopOpacity="1" />
                </radialGradient>

                {/* Aspect Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Plate */}
              <circle cx={center} cy={center} r={rOuter} fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
              <circle cx={center} cy={center} r={rAspects} fill="url(#centerGlow)" stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />

              {/* 1. Zodiac Signs Outer Band (12 Segments) */}
              {ZODIAC_SIGNS.map((sign, idx) => {
                const signStartLong = idx * 30;
                const signEndLong = (idx + 1) * 30;
                const startAngle = getSvgAngle(signStartLong);
                const endAngle = getSvgAngle(signEndLong);
                const midAngle = getSvgAngle(signStartLong + 15);

                const glyphPos = polarToCartesian((rZodiacOuter + rZodiacInner) / 2, midAngle);
                const textPos = polarToCartesian(rZodiacOuter - 8, midAngle);

                // Element color theme
                const elementBg =
                  sign.element === 'Fire' ? '#ef444415' :
                  sign.element === 'Earth' ? '#10b98115' :
                  sign.element === 'Air' ? '#0284c715' : '#8b5cf615';

                const elementBorder =
                  sign.element === 'Fire' ? '#ef444450' :
                  sign.element === 'Earth' ? '#10b98150' :
                  sign.element === 'Air' ? '#0284c750' : '#8b5cf650';

                return (
                  <g key={sign.name} className="transition-all duration-300">
                    {/* Zodiac Segment Wedge */}
                    <path
                      d={describeArcSector(rZodiacInner, rZodiacOuter, startAngle, endAngle)}
                      fill={elementBg}
                      stroke={elementBorder}
                      strokeWidth="1"
                    />

                    {/* Zodiac Glyph */}
                    <text
                      x={glyphPos.x}
                      y={glyphPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="18"
                      fontWeight="bold"
                      fill={sign.color}
                      className="cursor-default pointer-events-none select-none font-serif"
                    >
                      {sign.glyph}
                    </text>
                  </g>
                );
              })}

              {/* 2. House Division Lines (12 Cusps) */}
              {showHouseLines &&
                chart.houses.map((house) => {
                  const angle = getSvgAngle(house.longitude);
                  const outerPt = polarToCartesian(rZodiacInner, angle);
                  const innerPt = polarToCartesian(rAspects, angle);

                  // Highlight ASC (1st) and MC (10th)
                  const isMainAxis = house.house === 1 || house.house === 7 || house.house === 10 || house.house === 4;
                  const strokeColor = isMainAxis ? '#f59e0b' : '#3f3f46';
                  const strokeWidth = isMainAxis ? 1.8 : 0.8;
                  const dash = isMainAxis ? '' : '2 2';

                  // House Number Label Position
                  const midHouseAngle = getSvgAngle(house.longitude + 15);
                  const numPos = polarToCartesian((rHouses + rAspects) / 2, midHouseAngle);

                  return (
                    <g key={`house-${house.house}`}>
                      <line
                        x1={innerPt.x}
                        y1={innerPt.y}
                        x2={outerPt.x}
                        y2={outerPt.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={dash}
                        opacity={isMainAxis ? 0.9 : 0.4}
                      />
                      <text
                        x={numPos.x}
                        y={numPos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="10"
                        fontWeight="600"
                        fill="#71717a"
                        className="pointer-events-none select-none"
                      >
                        {house.house}
                      </text>
                    </g>
                  );
                })}

              {/* 3. Aspect Lines (Chords across center) */}
              <g className="aspect-lines">
                {filteredAspects.map((asp) => {
                  const angle1 = getSvgAngle(asp.planet1.longitude);
                  const angle2 = getSvgAngle(asp.planet2.longitude);

                  const p1 = polarToCartesian(rAspects, angle1);
                  const p2 = polarToCartesian(rAspects, angle2);

                  const isHighlighted =
                    selectedAspect?.id === asp.id ||
                    (activePlanet && (asp.planet1.id === activePlanet.id || asp.planet2.id === activePlanet.id));

                  return (
                    <line
                      key={asp.id}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={asp.color}
                      strokeWidth={isHighlighted ? 2.5 : 1}
                      strokeOpacity={isHighlighted ? 0.95 : activePlanet ? 0.15 : 0.45}
                      strokeDasharray={asp.aspectType === 'Square' || asp.aspectType === 'Opposition' ? '4 3' : ''}
                      filter={isHighlighted ? 'url(#glow)' : undefined}
                      className="transition-all duration-200 cursor-pointer hover:stroke-width-2 hover:stroke-opacity-100"
                      onClick={() => setSelectedAspect(asp)}
                    />
                  );
                })}
              </g>

              {/* 4. Planetary Placements on Wheel */}
              {chart.planets.map((planet) => {
                const angle = getSvgAngle(planet.longitude);
                // Radius in the planet ring
                const pos = polarToCartesian((rHouses + rZodiacInner) / 2, angle);
                const isSelected = selectedPlanet?.id === planet.id;
                const isHovered = hoveredPlanet?.id === planet.id;
                const isActive = isSelected || isHovered;

                return (
                  <g
                    key={planet.id}
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => setHoveredPlanet(planet)}
                    onMouseLeave={() => setHoveredPlanet(null)}
                    onClick={() => {
                      setSelectedPlanet(selectedPlanet?.id === planet.id ? null : planet);
                      setSelectedAspect(null);
                    }}
                  >
                    {/* Selection Ring */}
                    {isActive && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="16"
                        fill="#f59e0b20"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        filter="url(#glow)"
                        className="animate-pulse"
                      />
                    )}

                    {/* Planet Circle Badge */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="12"
                      fill="#18181b"
                      stroke={isActive ? '#f59e0b' : '#3f3f46'}
                      strokeWidth={isActive ? 2 : 1}
                      className="hover:scale-110 transition-all"
                    />

                    {/* Planet Glyph */}
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="12"
                      fontWeight="bold"
                      fill={isActive ? '#fbbf24' : '#e4e4e7'}
                      className="pointer-events-none select-none font-sans"
                    >
                      {planet.glyph}
                    </text>

                    {/* Retrograde 'R' indicator */}
                    {planet.isRetrograde && (
                      <text
                        x={pos.x + 9}
                        y={pos.y - 7}
                        fontSize="8"
                        fontWeight="bold"
                        fill="#ef4444"
                        className="pointer-events-none select-none"
                      >
                        ℞
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Center Ascendant / Axis Badges */}
              <g className="pointer-events-none">
                {/* ASC on Left (9 o'clock) */}
                <rect x="36" y={center - 11} width="36" height="22" rx="6" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
                <text x="54" y={center + 1} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="bold" fill="#f59e0b">
                  ASC
                </text>

                {/* MC on Top (12 o'clock) */}
                <rect x={center - 14} y="36" width="28" height="22" rx="6" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
                <text x={center} y="47" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="bold" fill="#f59e0b">
                  MC
                </text>
              </g>
            </svg>
          </div>

          {/* Aspect Legend Bar */}
          <div className="mt-4 pt-3 border-t border-zinc-800/60 w-full flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-3 h-0.5 bg-blue-400 rounded-full" />
              <span>Trine 120° (Harmonic)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
              <span>Sextile 60° (Opportunity)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-3 h-0.5 bg-red-400 rounded-full" />
              <span>Square 90° (Dynamic)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-3 h-0.5 bg-orange-400 rounded-full" />
              <span>Opposition 180° (Polarity)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-3 h-0.5 bg-yellow-400 rounded-full" />
              <span>Conjunction 0° (Fusion)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Planet / Aspect Inspector Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        {activePlanet ? (
          <Card className="bg-zinc-950/80 border-amber-500/40 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl font-bold text-amber-400 font-serif">
                    {activePlanet.glyph}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                      {activePlanet.name}
                      {activePlanet.isRetrograde && (
                        <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/30 bg-red-500/10">
                          Retrograde ℞
                        </Badge>
                      )}
                    </h4>
                    <p className="text-xs text-amber-400 font-medium">
                      {activePlanet.formattedDegree}
                    </p>
                  </div>
                </div>

                <Badge className="bg-zinc-900 border-zinc-700 text-zinc-300 text-xs">
                  {activePlanet.house}{activePlanet.house === 1 ? 'st' : activePlanet.house === 2 ? 'nd' : activePlanet.house === 3 ? 'rd' : 'th'} House
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Element</span>
                  <span className="font-semibold text-zinc-200">{activePlanet.element}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Modality</span>
                  <span className="font-semibold text-zinc-200">{activePlanet.modality}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Astrological Role</span>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                  {activePlanet.interpretation}
                </p>
              </div>

              {/* Aspects connected to this planet */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  Connected Aspects
                  <span className="text-[10px] text-amber-400 lowercase font-normal">
                    {chart.aspects.filter(a => a.planet1.id === activePlanet.id || a.planet2.id === activePlanet.id).length} links
                  </span>
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {chart.aspects
                    .filter(a => a.planet1.id === activePlanet.id || a.planet2.id === activePlanet.id)
                    .map((asp) => {
                      const otherPlanet = asp.planet1.id === activePlanet.id ? asp.planet2 : asp.planet1;
                      return (
                        <div
                          key={asp.id}
                          className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60 text-xs flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-colors"
                          onClick={() => setSelectedAspect(asp)}
                        >
                          <div className="flex items-center gap-2">
                            <span style={{ color: asp.color }} className="font-bold">
                              {asp.symbol}
                            </span>
                            <span className="text-zinc-200 font-medium">
                              {asp.aspectType} {otherPlanet.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            orb {asp.formattedOrb}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-zinc-400 hover:text-zinc-200 h-8"
                onClick={() => { setSelectedPlanet(null); setSelectedAspect(null); }}
              >
                Clear Selection
              </Button>
            </div>
          </Card>
        ) : selectedAspect ? (
          <Card className="bg-zinc-950/80 border-cyan-500/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-lg"
                    style={{ backgroundColor: `${selectedAspect.color}15`, borderColor: selectedAspect.color, color: selectedAspect.color }}
                  >
                    {selectedAspect.symbol}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">
                      {selectedAspect.planet1.name} {selectedAspect.aspectType} {selectedAspect.planet2.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Angle: {selectedAspect.actualAngle}° (Orb {selectedAspect.formattedOrb})
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Nature</span>
                  <Badge variant="outline" style={{ borderColor: selectedAspect.color, color: selectedAspect.color }}>
                    {selectedAspect.nature}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed pt-1 border-t border-zinc-800">
                  {selectedAspect.interpretation}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-zinc-400 hover:text-zinc-200 h-8"
                onClick={() => setSelectedAspect(null)}
              >
                Close Aspect Inspector
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Chart Guide</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hover over or click any planetary glyph in the wheel to view its exact degree, house placement, elemental harmony, and geometric aspect lines.
            </p>

            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Quick Planet Selector
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {chart.planets.map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    size="sm"
                    className="h-8 p-0 text-xs border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/10 flex items-center justify-center gap-1 text-zinc-300"
                    onClick={() => setSelectedPlanet(p)}
                  >
                    <span className="text-amber-400 font-serif">{p.glyph}</span>
                    <span className="text-[10px] font-medium">{p.name.slice(0, 3)}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
