#!/usr/bin/env python3
"""
Calculate Opportunity Scores for SC Democratic Strategy Dashboard

Computes a 0-100 opportunity score for each legislative district based on:
- Historical competitiveness (from elections.json)
- Margin trend direction (improving toward Democrats)
- Incumbency status (open seats = higher opportunity)
- Democratic candidate presence (filed = bonus)
- Defensive status (Dem incumbent = protect)

Outputs: opportunity.json with scores and tier classifications
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Tier thresholds
TIER_HIGH = 70
TIER_EMERGING = 50
TIER_BUILD = 30

# Weights (must sum to 1.0)
WEIGHT_COMPETITIVENESS = 0.40  # Historical margin-based score
WEIGHT_MARGIN_TREND = 0.25     # Direction of margin change
WEIGHT_INCUMBENCY = 0.15       # Open seat bonus
WEIGHT_CANDIDATE = 0.10        # Dem candidate filed
WEIGHT_OPEN_SEAT = 0.10        # Additional open seat factor


def load_json(path: Path) -> dict:
    """Load JSON file."""
    with open(path, 'r') as f:
        return json.load(f)


def calculate_margin_trend(elections: dict) -> Tuple[float, float]:
    """
    Calculate margin trend from election history.
    Returns (trend_score 0-1, actual_change in percentage points).

    Positive trend = margins shrinking (better for challenger/Dems)
    """
    years = sorted(elections.keys(), reverse=True)
    if len(years) < 2:
        return 0.5, 0.0  # No trend data

    margins = []
    for year in years[:3]:  # Last 3 elections
        election = elections[year]
        if election.get('uncontested'):
            margins.append(100.0)  # Treat uncontested as 100% margin
        else:
            margins.append(election.get('margin', 100.0))

    if len(margins) < 2:
        return 0.5, 0.0

    # Calculate trend: newer margin - older margin
    # Negative = margins shrinking = good for Dems
    trend_change = margins[0] - margins[-1]

    # Normalize to 0-1 scale
    # -30 or more shrinkage = 1.0 (great trend)
    # +30 or more growth = 0.0 (bad trend)
    normalized = max(0, min(1, (30 - trend_change) / 60))

    return normalized, -trend_change  # Return actual change as positive = good


def calculate_competitiveness_factor(comp_score: int) -> float:
    """
    Convert existing competitiveness score (0-100) to factor.
    Higher competitiveness = higher opportunity.
    """
    return comp_score / 100.0


def has_democratic_candidate(candidates: list) -> bool:
    """Check if any Democratic candidate has filed."""
    return any(
        (c.get('party') or '').lower() == 'democratic'
        for c in candidates
    )


def is_open_seat(candidates: list, incumbent: Optional[dict]) -> bool:
    """
    Determine if this is an open seat.
    Open if no incumbent or incumbent not running.
    """
    if not incumbent:
        return True

    incumbent_name = incumbent.get('name', '').lower()

    # Check if incumbent is among candidates
    for c in candidates:
        candidate_name = c.get('name', '').lower()
        # Normalize names for comparison
        if incumbent_name in candidate_name or candidate_name in incumbent_name:
            return False  # Incumbent is running

    return True  # Incumbent not found in candidates


def is_dem_incumbent(incumbent: Optional[dict]) -> bool:
    """Check if current incumbent is a Democrat."""
    if not incumbent:
        return False
    return incumbent.get('party', '').lower() == 'democratic'


def classify_tier(score: float, has_dem: bool, is_dem_inc: bool, open_seat: bool) -> Tuple[str, str]:
    """
    Classify district into strategic tier.
    Returns (tier_code, tier_label).
    """
    # Defensive: Dem incumbent or very close margins with Dem
    if is_dem_inc:
        return 'DEFENSIVE', 'Defensive'

    if score >= TIER_HIGH:
        return 'HIGH_OPPORTUNITY', 'High Opportunity'
    elif score >= TIER_EMERGING:
        return 'EMERGING', 'Emerging'
    elif score >= TIER_BUILD:
        return 'BUILD', 'Build'
    else:
        return 'NON_COMPETITIVE', 'Non-Competitive'


def get_recommendation(tier: str, has_dem: bool, open_seat: bool) -> str:
    """Generate strategic recommendation based on tier."""
    if tier == 'DEFENSIVE':
        return 'Protect seat - ensure strong candidate and resources'
    elif tier == 'HIGH_OPPORTUNITY':
        if not has_dem:
            return 'URGENT: Recruit Democratic candidate immediately'
        return 'High priority - maximum resource investment'
    elif tier == 'EMERGING':
        if not has_dem:
            return 'Priority candidate recruitment target'
        if open_seat:
            return 'Open seat opportunity - invest early'
        return 'Winnable with strong campaign - invest resources'
    elif tier == 'BUILD':
        return 'Long-term investment - party building focus'
    else:
        return 'Low priority - minimal resources'


def calculate_opportunity_score(
    district_num: int,
    elections_data: dict,
    candidates_data: dict,
    chamber: str
) -> dict:
    """
    Calculate opportunity score for a single district.
    """
    elections = elections_data.get(chamber, {}).get(str(district_num), {})
    candidates = candidates_data.get(chamber, {}).get(str(district_num), {})

    # Get election history
    election_history = elections.get('elections', {})
    competitiveness = elections.get('competitiveness', {})

    # Get candidate info
    candidate_list = candidates.get('candidates', [])
    incumbent = candidates.get('incumbent')

    # Calculate factors
    comp_score = competitiveness.get('score', 5)
    comp_factor = calculate_competitiveness_factor(comp_score)

    trend_factor, trend_change = calculate_margin_trend(election_history)

    has_dem = has_democratic_candidate(candidate_list)
    open_seat = is_open_seat(candidate_list, incumbent)
    dem_incumbent = is_dem_incumbent(incumbent)

    # Incumbency factor: open seat = 1.0, incumbent running = 0.5
    incumbency_factor = 1.0 if open_seat else 0.5

    # Candidate factor: Dem filed = 1.0, no Dem = 0.0
    candidate_factor = 1.0 if has_dem else 0.0

    # Open seat bonus: additional points for open seats
    open_seat_factor = 1.0 if open_seat else 0.0

    # Calculate weighted score
    raw_score = (
        WEIGHT_COMPETITIVENESS * comp_factor +
        WEIGHT_MARGIN_TREND * trend_factor +
        WEIGHT_INCUMBENCY * incumbency_factor +
        WEIGHT_CANDIDATE * candidate_factor +
        WEIGHT_OPEN_SEAT * open_seat_factor
    ) * 100

    # Boost for open seats with good competitiveness
    if open_seat and comp_score > 30:
        raw_score = min(100, raw_score + 10)

    # Defensive override: Dem incumbents get special treatment
    if dem_incumbent:
        raw_score = max(60, raw_score)  # Ensure defensives show up

    # Clamp to 0-100
    final_score = max(0, min(100, round(raw_score)))

    # Classify tier
    tier, tier_label = classify_tier(final_score, has_dem, dem_incumbent, open_seat)

    # Generate recommendation
    recommendation = get_recommendation(tier, has_dem, open_seat)

    # Get average margin for display
    avg_margin = competitiveness.get('avgMargin', 100.0)

    return {
        'districtNumber': district_num,
        'opportunityScore': final_score,
        'tier': tier,
        'tierLabel': tier_label,
        'factors': {
            'competitiveness': round(comp_factor, 2),
            'marginTrend': round(trend_factor, 2),
            'incumbency': round(incumbency_factor, 2),
            'candidatePresence': round(candidate_factor, 2),
            'openSeatBonus': open_seat
        },
        'metrics': {
            'avgMargin': round(avg_margin, 1),
            'trendChange': round(trend_change, 1),
            'competitivenessScore': comp_score
        },
        'flags': {
            'needsCandidate': not has_dem and final_score >= TIER_EMERGING,
            'openSeat': open_seat,
            'trendingDem': trend_change > 2,
            'defensive': dem_incumbent,
            'hasDemocrat': has_dem
        },
        'recommendation': recommendation
    }


def main():
    """Main entry point."""
    # Paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    elections_path = project_root / 'public' / 'data' / 'elections.json'
    candidates_path = project_root / 'public' / 'data' / 'candidates.json'
    output_path = project_root / 'public' / 'data' / 'opportunity.json'
    backup_path = project_root / 'src' / 'data' / 'opportunity.json'

    # Load data
    print("Loading elections data...")
    elections_data = load_json(elections_path)

    print("Loading candidates data...")
    candidates_data = load_json(candidates_path)

    # Calculate scores for all districts
    opportunity_data = {
        'lastUpdated': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
        'house': {},
        'senate': {}
    }

    # Statistics
    stats = {
        'house': {'high': 0, 'emerging': 0, 'build': 0, 'defensive': 0, 'non_competitive': 0, 'needs_candidate': 0},
        'senate': {'high': 0, 'emerging': 0, 'build': 0, 'defensive': 0, 'non_competitive': 0, 'needs_candidate': 0}
    }

    # Process House districts (1-124)
    print("\nCalculating House district opportunities...")
    for district_num in range(1, 125):
        result = calculate_opportunity_score(
            district_num,
            elections_data,
            candidates_data,
            'house'
        )
        opportunity_data['house'][str(district_num)] = result

        # Update stats
        tier = result['tier'].lower().replace('_', '')
        if tier == 'highopportunity':
            stats['house']['high'] += 1
        elif tier == 'emerging':
            stats['house']['emerging'] += 1
        elif tier == 'build':
            stats['house']['build'] += 1
        elif tier == 'defensive':
            stats['house']['defensive'] += 1
        else:
            stats['house']['non_competitive'] += 1

        if result['flags']['needsCandidate']:
            stats['house']['needs_candidate'] += 1

    # Process Senate districts (1-46)
    print("Calculating Senate district opportunities...")
    for district_num in range(1, 47):
        result = calculate_opportunity_score(
            district_num,
            elections_data,
            candidates_data,
            'senate'
        )
        opportunity_data['senate'][str(district_num)] = result

        # Update stats
        tier = result['tier'].lower().replace('_', '')
        if tier == 'highopportunity':
            stats['senate']['high'] += 1
        elif tier == 'emerging':
            stats['senate']['emerging'] += 1
        elif tier == 'build':
            stats['senate']['build'] += 1
        elif tier == 'defensive':
            stats['senate']['defensive'] += 1
        else:
            stats['senate']['non_competitive'] += 1

        if result['flags']['needsCandidate']:
            stats['senate']['needs_candidate'] += 1

    # Write output
    print(f"\nWriting to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(opportunity_data, f, indent=2)

    # Backup copy
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    with open(backup_path, 'w') as f:
        json.dump(opportunity_data, f, indent=2)

    # Print summary
    print("\n" + "="*60)
    print("OPPORTUNITY SCORE SUMMARY")
    print("="*60)

    for chamber in ['house', 'senate']:
        s = stats[chamber]
        total = 124 if chamber == 'house' else 46
        print(f"\n{chamber.upper()} ({total} districts):")
        print(f"  High Opportunity (70+):  {s['high']:3d}")
        print(f"  Emerging (50-69):        {s['emerging']:3d}")
        print(f"  Build (30-49):           {s['build']:3d}")
        print(f"  Defensive (Dem held):    {s['defensive']:3d}")
        print(f"  Non-Competitive (<30):   {s['non_competitive']:3d}")
        print(f"  ---")
        print(f"  NEEDS CANDIDATE:         {s['needs_candidate']:3d}")

    print("\n" + "="*60)
    print(f"Output written to: {output_path}")
    print(f"Backup written to: {backup_path}")


if __name__ == '__main__':
    main()
