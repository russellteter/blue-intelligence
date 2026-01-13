/**
 * Centralized TypeScript type definitions for SC Election Map 2026
 *
 * These types are the source of truth for the data schema used throughout
 * the application. They match the output structure of scripts/process-data.py.
 */

/**
 * Incumbent information for a district
 */
export interface Incumbent {
  name: string;
  party: 'Democratic' | 'Republican';
}

/**
 * Individual candidate who has filed with the SC Ethics Commission
 */
export interface Candidate {
  /** Candidate's full name */
  name: string;
  /** Party affiliation (null if unknown) */
  party: string | null;
  /** Filing status (e.g., "filed") */
  status: string;
  /** Date the candidate filed their initial report (ISO format) */
  filedDate: string | null;
  /** URL to the candidate's Ethics Commission filing */
  ethicsUrl: string | null;
  /** Unique report ID from the Ethics Commission */
  reportId: string;
  /** Data source (e.g., "ethics") */
  source: string;
  /** Whether this candidate is the current incumbent for the district */
  isIncumbent?: boolean;
}

/**
 * A legislative district with candidate information
 */
export interface District {
  /** District number (1-124 for House, 1-46 for Senate) */
  districtNumber: number;
  /** List of candidates who have filed in this district */
  candidates: Candidate[];
  /** Current incumbent information for this district */
  incumbent?: Incumbent | null;
}

/**
 * Complete candidates data structure loaded from candidates.json
 */
export interface CandidatesData {
  /** ISO timestamp of when the data was last updated */
  lastUpdated: string;
  /** House districts (124 total) keyed by district number string */
  house: Record<string, District>;
  /** Senate districts (46 total) keyed by district number string */
  senate: Record<string, District>;
}

/**
 * Chamber type for House or Senate
 */
export type Chamber = 'house' | 'senate';

/**
 * Party type for filtering and display
 */
export type Party = 'Democratic' | 'Republican' | 'unknown';

/**
 * Search result from the SearchBar component
 */
export interface SearchResult {
  type: 'candidate' | 'district';
  chamber: Chamber;
  districtNumber: number;
  label: string;
  sublabel?: string;
}

// =============================================================================
// Election History Types (from scripts/fetch-election-results.py)
// =============================================================================

/**
 * Election result for a single candidate
 */
export interface ElectionCandidate {
  name: string;
  party: string;
  votes: number;
  percentage: number;
}

/**
 * Single election result for a district
 */
export interface ElectionResult {
  year: number;
  totalVotes: number;
  winner: ElectionCandidate;
  runnerUp?: ElectionCandidate;
  margin: number;
  marginVotes: number;
  uncontested?: boolean;
}

/**
 * Competitiveness metrics for a district
 */
export interface Competitiveness {
  /** Competitiveness score (0-100, higher = more competitive) */
  score: number;
  /** Average margin percentage over recent elections */
  avgMargin: number;
  /** Whether the district has changed party control */
  hasSwung: boolean;
  /** Number of contested races in recent elections */
  contestedRaces: number;
  /** Dominant party if one-sided, null if swing district */
  dominantParty: string | null;
}

/**
 * Historical election data for a single district
 */
export interface DistrictElectionHistory {
  districtNumber: number;
  /** Election results keyed by year string (e.g., "2024") */
  elections: Record<string, ElectionResult>;
  /** Competitiveness metrics */
  competitiveness: Competitiveness;
}

/**
 * Complete election history data from elections.json
 */
export interface ElectionsData {
  lastUpdated: string;
  house: Record<string, DistrictElectionHistory>;
  senate: Record<string, DistrictElectionHistory>;
}

// =============================================================================
// Chamber Statistics
// =============================================================================

/**
 * Statistics calculated for a chamber
 */
export interface ChamberStats {
  /** Number of districts with a Democratic candidate */
  democrats: number;
  /** Number of districts with a Republican candidate */
  republicans: number;
  /** Number of districts with candidates but unknown party */
  unknown: number;
  /** Number of districts with no candidates */
  empty: number;
  /** Total number of individual candidates */
  totalCandidates: number;
  /** Number of candidates with known party affiliation */
  enrichedCandidates: number;
  /** Percentage of candidates with known party (0-100) */
  enrichmentPercent: number;
  /** Number of candidates who are incumbents */
  incumbents?: number;
}

// =============================================================================
// Opportunity Scoring Types (from scripts/calculate-opportunity.py)
// =============================================================================

/**
 * Opportunity tier classification
 */
export type OpportunityTier =
  | 'HIGH_OPPORTUNITY'
  | 'EMERGING'
  | 'BUILD'
  | 'DEFENSIVE'
  | 'NON_COMPETITIVE';

/**
 * Factors contributing to opportunity score
 */
export interface OpportunityFactors {
  /** Historical competitiveness factor (0-1) */
  competitiveness: number;
  /** Margin trend factor (0-1, higher = trending toward Dems) */
  marginTrend: number;
  /** Incumbency factor (1.0 for open seat, 0.5 for incumbent running) */
  incumbency: number;
  /** Candidate presence factor (1.0 if Dem filed, 0 if not) */
  candidatePresence: number;
  /** Whether this is an open seat */
  openSeatBonus: boolean;
}

/**
 * Raw metrics used in scoring
 */
export interface OpportunityMetrics {
  /** Average margin over recent elections */
  avgMargin: number;
  /** Margin change (positive = shrinking = good for Dems) */
  trendChange: number;
  /** Original competitiveness score from elections.json */
  competitivenessScore: number;
}

/**
 * Strategic flags for filtering and display
 */
export interface OpportunityFlags {
  /** Needs a Democratic candidate (score >= 50, no Dem filed) */
  needsCandidate: boolean;
  /** This is an open seat */
  openSeat: boolean;
  /** Margins are trending toward Democrats */
  trendingDem: boolean;
  /** This is a defensive seat (Dem incumbent) */
  defensive: boolean;
  /** A Democratic candidate has filed */
  hasDemocrat: boolean;
}

/**
 * Opportunity score for a single district
 */
export interface DistrictOpportunity {
  /** District number */
  districtNumber: number;
  /** Computed opportunity score (0-100) */
  opportunityScore: number;
  /** Tier classification code */
  tier: OpportunityTier;
  /** Human-readable tier label */
  tierLabel: string;
  /** Factor breakdown */
  factors: OpportunityFactors;
  /** Raw metrics */
  metrics: OpportunityMetrics;
  /** Strategic flags */
  flags: OpportunityFlags;
  /** Strategic recommendation text */
  recommendation: string;
}

/**
 * Complete opportunity data from opportunity.json
 */
export interface OpportunityData {
  /** ISO timestamp of when scores were calculated */
  lastUpdated: string;
  /** House district opportunities keyed by district number string */
  house: Record<string, DistrictOpportunity>;
  /** Senate district opportunities keyed by district number string */
  senate: Record<string, DistrictOpportunity>;
}

/**
 * Opportunity statistics for a chamber
 */
export interface OpportunityStats {
  /** High opportunity districts (score 70+) */
  highOpportunity: number;
  /** Emerging opportunity districts (score 50-69) */
  emerging: number;
  /** Build districts (score 30-49) */
  build: number;
  /** Defensive districts (Dem incumbent) */
  defensive: number;
  /** Non-competitive districts (score <30) */
  nonCompetitive: number;
  /** Districts needing a Democratic candidate */
  needsCandidate: number;
  /** Districts with Democratic candidates filed */
  demFiled: number;
}
