import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Define styles for the certificate
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 0,
    margin: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  border: {
    border: "3px solid #f3f3f3",
    padding: 20,
    width: "495px",
    minHeight: "602px",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#6a4c26",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 10,
    color: "#444",
  },
  info: {
    fontSize: 12,
    margin: "5px 0",
    color: "#000",
  },
  body: {
    fontSize: 12,
    marginBottom: 10,
    color: "#444",
    lineHeight: 1.5,
  },
  footer: {
    fontSize: 12,
    marginTop: 30,
    color: "#6a4c26",
    textAlign: "center",
  },
  tableRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start", // Align horizontally at the start
    alignItems: "center", // Align vertically in the center
    padding: 8,
  },
  tableCell: {
    paddingRight: 50,
    flex: 1,
    fontSize: 12,
    color: "#444",
    textAlign: "left",
  },
  tableHead: {
    flex: 1,
    fontSize: 12,
    color: "#444",
    textAlign: "left",
    fontWeight: "bold",
    alignItems: "center",
  },
  signature: {
    marginTop: 40,
    marginLeft: '10%',
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  signatureBlock: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
});

const CertificatePDF: React.FC<{
  name: string;
  course: string;
  results: { title: string; date: string; grade: string; score: string }[];
  date: string;
  department: string;
  studentId: string;
}> = ({ name, results, date, course, department, studentId }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.border}>
        <Text style={styles.header}>
          Nigerian Army School of Finance and Administration
        </Text>
        <Text style={styles.subHeader}>
          Student Academic Result
        </Text>
        <Text style={styles.info}><Text style={{fontWeight: "bold"}}>Name:</Text> {name}</Text>
        <Text style={styles.info}><Text style={{fontWeight: "bold"}}>Department:</Text> {department}</Text>
        <Text style={styles.info}><Text style={{fontWeight: "bold"}}>Student ID:</Text> {studentId}</Text>
        <Text style={styles.info}><Text style={{fontWeight: "bold"}}>Date:</Text> {date}</Text>
        <Text style={styles.info}><Text style={{fontWeight: "bold"}}>Course:</Text> {course}</Text>
        <View style={{padding: "10px 0"}}></View>
        <View style={styles.tableRow}>
          <Text style={{...styles.tableHead, paddingRight: 90}}>Date</Text>
          <Text style={{...styles.tableHead, paddingRight: 70}}>Course</Text>
          <Text style={{...styles.tableHead, paddingRight: 40}}>Score</Text>
          <Text style={styles.tableHead}>Grade</Text>
        </View>
        <hr/>
        {results.map((result, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{result.date}</Text>
            <Text style={styles.tableCell}>{result.title}</Text>
            <Text style={styles.tableCell}>{result.score}</Text>
            <Text style={styles.tableCell}>{result.grade}</Text>
          </View>
        ))}

        <View style={styles.signature}>
          <View style={styles.signatureBlock}>
            <Text style={styles.body}>_______________</Text>
            <Text style={styles.body}>Authorized Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.body}>_______________</Text>
            <Text style={styles.body}>Director</Text>
          </View>
        </View>
        <Text style={styles.footer}>
          Nigerian Army School of Finance and Administration | Excellence in Education
        </Text>
      </View>
    </Page>
  </Document>
);

export default CertificatePDF;
