'use client';

import React from 'react';
import CorporateReportPage from '@/app/corporate/reports/[id]/page';

export default function CompanyReportPage({ params }: { params: Promise<{ id: string }> }) {
  return <CorporateReportPage params={params} />;
}
