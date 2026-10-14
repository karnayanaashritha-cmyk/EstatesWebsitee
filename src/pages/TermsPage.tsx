import React from 'react';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Platform Guidelines</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Terms of Service & Regulatory Disclosures
              </h1>
            </div>
          </div>

          <div className="text-xs text-slate-500 pb-4 border-b border-slate-100">
            Applicable to all users, owners, and agents accessing Hyderabad Heights in Hyderabad, Telangana.
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                1. Telangana RERA (TGRERA) Regulatory Disclaimer
              </h2>
              <p>
                Hyderabad Heights functions as an advertising portal connecting property owners, builders, agents, and buyers. While we require listings to provide valid Telangana Real Estate Regulatory Authority (TGRERA) registration identifiers where legally mandated under the RERA Act 2016, prospective purchasers are expressly advised to conduct independent due diligence:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Verify project sanction orders on the official TGRERA portal (<a href="https://rera.telangana.gov.in" target="_blank" rel="noreferrer" className="text-rose-600 underline font-semibold">rera.telangana.gov.in</a>).</li>
                <li>Verify encumbrance certificates (EC), land title deeds, and GHMC/HMDA building permits through a qualified legal advocate.</li>
                <li>Hyderabad Heights is not an escrow agent and does not process financial disbursements between buyers and sellers.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                2. Sample Data and Demonstration Notice
              </h2>
              <p>
                Demonstration records on the portal are explicitly labeled with the <strong>"Sample Data"</strong> badge. These listings exist to demonstrate system capabilities and layout structures. Sample records must not be construed as commercial offerings.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                3. Listing Submission Code of Conduct
              </h2>
              <p>
                Owners and agents listing properties on Hyderabad Heights warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>They hold lawful title or valid written marketing authorization from the registered property owner.</li>
                <li>Photographs submitted represent the actual unit, project, or plot.</li>
                <li>All pricing, carpet area figures, and maintenance charges represent truthful figures.</li>
                <li>Hyderabad Heights administrators reserve the unilateral right to suspend, reject, or remove any listing reported for misrepresentation.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                4. Jurisdiction
              </h2>
              <p>
                These terms shall be governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
