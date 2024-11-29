import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  tableContainer: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    padding: 5,
  },
  tableCell: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'grey',
  },
});

interface RMDResultsPDFProps {
  initialBalance: number;
  taxBracket: number;
  rmdProjection: {
    year: number;
    rmdBalance: number;
    rothBalance: number;
    rmdWithdrawal: number;
    taxes: number;
  }[];
  branding: any;
}

export function RMDResultsPDF({
  initialBalance,
  taxBracket,
  rmdProjection,
  branding,
}: RMDResultsPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {branding?.logoUrl && (
            <Image src={branding.logoUrl} style={styles.logo} />
          )}
          <View>
            <Text>{branding?.companyName}</Text>
            <Text>{branding?.website}</Text>
          </View>
        </View>

        <Text style={styles.title}>RMD Analysis Report</Text>

        <View style={styles.section}>
          <Text>Initial Balance: ${initialBalance.toLocaleString()}</Text>
          <Text>Tax Bracket: {taxBracket}%</Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={{ width: '20%' }}>Year</Text>
            <Text style={{ width: '20%' }}>RMD Balance</Text>
            <Text style={{ width: '20%' }}>Roth Balance</Text>
            <Text style={{ width: '20%' }}>RMD Withdrawal</Text>
            <Text style={{ width: '20%' }}>Taxes</Text>
          </View>
          {rmdProjection.map((year) => (
            <View key={year.year} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '20%' }]}>
                {year.year}
              </Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>
                ${year.rmdBalance.toLocaleString()}
              </Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>
                ${year.rothBalance.toLocaleString()}
              </Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>
                ${year.rmdWithdrawal.toLocaleString()}
              </Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>
                ${year.taxes.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>
            Prepared by: {branding?.firstName} {branding?.lastName}
          </Text>
          <Text>{branding?.email}</Text>
        </View>
      </Page>
    </Document>
  );
}