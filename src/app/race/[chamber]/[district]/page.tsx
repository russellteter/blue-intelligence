import RaceProfileClient from '@/components/Race/RaceProfileClient';

/**
 * Generate all possible chamber/district combinations for static export
 */
export function generateStaticParams() {
  const params: { chamber: string; district: string }[] = [];

  // House districts: 1-124
  for (let i = 1; i <= 124; i++) {
    params.push({ chamber: 'house', district: String(i) });
  }

  // Senate districts: 1-46
  for (let i = 1; i <= 46; i++) {
    params.push({ chamber: 'senate', district: String(i) });
  }

  return params;
}

interface PageProps {
  params: Promise<{
    chamber: string;
    district: string;
  }>;
}

/**
 * Race Profile Page - Dynamic route for individual district races
 * Path: /race/[chamber]/[district]
 * Example: /race/house/15, /race/senate/7
 */
export default async function RaceProfilePage({ params }: PageProps) {
  const { chamber, district } = await params;
  return <RaceProfileClient chamber={chamber} district={district} />;
}
