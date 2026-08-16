'use client';

import React from 'react';
import CorporateProjectDetailsPage from '@/app/corporate/projects/[id]/page';

export default function CompanyProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return <CorporateProjectDetailsPage params={params} />;
}
