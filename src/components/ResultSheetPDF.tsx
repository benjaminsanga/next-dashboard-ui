import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Define styles for the result sheet
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 40,
    margin: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    padding: 5,
    borderRadius: 15,
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#6a4c26",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 10,
    color: "#444",
  },
  name: {
    fontSize: 22,
    margin: "20px 0",
    fontWeight: "bold",
    color: "#6a4c26",
  },
  table: {
    display: "flex",
    width: "100%",
    borderCollapse: "collapse",
    marginVertical: 20,
  },
  tableHeader: {
    // backgroundColor: "#c9ad6d",
    color: "#000",
    flexDirection: "row",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    paddingVertical: 8,
  },
  tableCell: {
    paddingHorizontal: 8,
    flex: 1,
    fontSize: 14,
    color: "#444",
  },
  footer: {
    fontSize: 14,
    marginTop: 30,
    color: "#6a4c26",
    textAlign: "center",
  },
});

// Result Sheet PDF Component
const ResultSheetPDF: React.FC<{
  name: string;
  institution: string;
  results: { title: string; date: string; grade: string; score: string }[];
}> = ({ name, institution, results }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.border}>
        <Text style={styles.header}>{institution}</Text>
        <Text style={styles.subHeader}>Result Sheet</Text>
        <Text style={styles.name}>Student Name: {name}</Text>

        {/* Result Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Course Title</Text>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Grade</Text>
            <Text style={styles.tableCell}>Score</Text>
          </View>

          {/* Table Rows */}
          {results.map((result, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{result.title}</Text>
              <Text style={styles.tableCell}>{result.date}</Text>
              <Text style={styles.tableCell}>{result.grade}</Text>
              <Text style={styles.tableCell}>{result.score}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>{institution} | Excellence in Education</Text>
      </View>
    </Page>
  </Document>
);

export default ResultSheetPDF;
