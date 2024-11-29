import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  pdf
} from '@react-pdf/renderer';
import type { CalculationResults, CalculatorEntry } from '../../types/calculator';
import type { BrandingSettings } from '../../types/branding';
import { formatCurrency } from '../../utils/formatters';

// Register Helvetica as our primary font since it's built into PDF
Font.register({
  family: 'CustomFont',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf', fontWeight: 700 }
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'CustomFont',
    fontSize: 12,
    color: '#1f2937'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: 20
  },
  logo: {
    width: 200,
    height: 50,
    objectFit: 'contain'
  },
  companyInfo: {
    alignItems: 'flex-end'
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827'
  },
  agentName: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4
  },
  contactInfo: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 2
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827'
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#7c3aed' // Purple color for emphasis
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
    paddingBottom: 5,
    borderBottom: '1px solid #e5e7eb'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    color: '#4b5563',
    flex: 3,
    paddingRight: 10
  },
  value: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right'
  },
  comparisonContainer: {
    flexDirection: 'row',
    marginTop: 20
  },
  comparisonBox: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    margin: 5
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827'
  },
  disclaimer: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 40,
    textAlign: 'center'
  },
  introText: {
    marginBottom: 20,
    lineHeight: 1.6
  }
});

interface PDFReportProps {
  results: CalculationResults;
  formData: CalculatorEntry;
  branding: BrandingSettings;
}

function PDFDocument({ results, formData, branding }: PDFReportProps) {
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {branding.logoUrl && (
            <Image src={branding.logoUrl} style={styles.logo} />
          )}
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{branding.companyName}</Text>
            <Text style={styles.agentName}>{branding.firstName} {branding.lastName}</Text>
            <Text style={styles.contactInfo}>{branding.phone}</Text>
            <Text style={styles.contactInfo}>{branding.email}</Text>
          </View>
        </View>

        <Text style={styles.title}>{formData.firstName}'s Retirement Tax Bill</Text>
        <Text style={styles.subtitle}>Are you sitting on a tax time bomb?</Text>

        <Text style={styles.introText}>
          Many savers use a tax-deferred account, like a traditional IRA or 401(K), to save funds for retirement. Tax-deferred accounts, sometimes called Qualified Accounts, are funded with pre-tax dollars. These types of accounts accumulate funds tax-deferred, meaning taxes are owed on the funds when they are distributed, not contributed.{'\n\n'}
          With an existing qualified account, there are two potential ways to manage your account and the tax status of your savings:{'\n\n'}
          1. You can keep the account as is and accumulate funds tax-deferred{'\n'}
          2. You can reallocate your account to a tax-free vehicle¹ and accumulate funds tax-free
        </Text>

        <Text style={styles.disclaimer}>
          The following pages will show the amount of taxes your account could potentially generate under two scenarios. These examples are hypothetical and do not represent actual market experience. Your results may vary. Please note this report is not intended to provide tax advice. Please consult a qualified professional about your individual needs.
        </Text>
      </Page>

      {/* Analysis Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assumptions</Text>
          <Text style={styles.introText}>
            The values below show two scenarios:{'\n\n'}
            1. The total taxes paid if you live to age 90, assuming you continue to keep your tax-deferred account, take Required Minimum Distributions (RMDs)¹ when required, and reinvest these RMDs in a taxable account and the amount your beneficiaries could potentially pay{'\n\n'}
            2. The total taxes paid if you live to age 90, assuming you reallocate your qualified account to a tax-free option today.
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Current Age:</Text>
            <Text style={styles.value}>{formData.age}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Qualified Account Value:</Text>
            <Text style={styles.value}>{formatCurrency(formData.qualifiedAccountValue)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax Bracket:</Text>
            <Text style={styles.value}>{formData.taxBracket}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Growth Rate:</Text>
            <Text style={styles.value}>{formData.growthRate}%</Text>
          </View>
        </View>

        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonBox}>
            <Text style={styles.comparisonTitle}>Keep Qualified Account</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Taxes paid on RMDs at time of withdrawals:</Text>
              <Text style={styles.value}>{formatCurrency(results.keepQualified.rmdTaxes)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Taxes paid on reinvested RMDs:</Text>
              <Text style={styles.value}>{formatCurrency(results.keepQualified.reinvestedRmdTaxes)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Taxes paid on remaining account value at death:</Text>
              <Text style={styles.value}>{formatCurrency(results.keepQualified.remainingBalanceTaxes)}</Text>
            </View>
            <View style={[styles.row, { marginTop: 10, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10 }]}>
              <Text style={[styles.label, { color: '#dc2626' }]}>Current Retirement Tax Bill:</Text>
              <Text style={[styles.value, { color: '#dc2626' }]}>{formatCurrency(results.keepQualified.currentRetirementTaxBill)}</Text>
            </View>
          </View>

          <View style={styles.comparisonBox}>
            <Text style={styles.comparisonTitle}>S.M.A.R.T. Strategy</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Taxes paid on reallocation:</Text>
              <Text style={styles.value}>{formatCurrency(results.convertToRoth.conversionTaxes)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Taxes paid on tax-free growth account:</Text>
              <Text style={styles.value}>{formatCurrency(results.convertToRoth.futureGrowthTaxes)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Taxes paid on remaining tax-free account value at death:</Text>
              <Text style={styles.value}>{formatCurrency(results.convertToRoth.remainingBalanceTaxes)}</Text>
            </View>
            <View style={[styles.row, { marginTop: 10, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10 }]}>
              <Text style={[styles.label, { color: '#16a34a' }]}>Total Tax Savings:</Text>
              <Text style={[styles.value, { color: '#16a34a' }]}>{formatCurrency(results.convertToRoth.totalTaxSavings)}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Disclosures Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Important Disclosures</Text>
        <Text style={styles.introText}>
          These disclosures apply to this presentation in its entirety.{'\n\n'}
          Determining when (or if) you should convert to a Roth IRA is an individual decision based on factors such as your financial situation, age, tax bracket, current assets and alternate sources of retirement income. Your unique circumstances help determine what's right for you.{'\n\n'}
          The information contained herein is based on our understanding of current tax law. The tax and legislative information may be subject to change and different interpretations. We recommend that you seek professional legal advice for applicability to your personal situation.{'\n\n'}
          This is not a complete list of features and benefit of a qualified account and Required Minimum Distributions (RMDs) at the designated age. This information is provided for informational purposes only and should not be considered investment advice for individuals or advice on withdrawing funds from your qualified account.{'\n\n'}
          Circular 230 Disclosure: to ensure compliance with requirements imposed by the IRS, we inform you that any federal income tax information in this document is not intended to (and cannot) be used by anyone to avoid IRS penalties. Per the license limitations of the licensed professional presenting this material, this proposal is not intended to offer or provide, and no statement contained herein shall constitute tax or legal advice. See qualified professionals in these areas before making any decisions about your individual situation. Your financial professional is not permitted to offer, and no statement contained herein shall constitute, tax or legal advice.{'\n\n'}
          This entire document is © 2024 {branding.companyName}.
        </Text>
      </Page>
    </Document>
  );
}

export async function generatePDF({ results, formData, branding }: PDFReportProps): Promise<Blob> {
  try {
    return await pdf(<PDFDocument results={results} formData={formData} branding={branding} />).toBlob();
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF report. Please try again.');
  }
}