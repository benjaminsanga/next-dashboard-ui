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
    margin: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  border: {
    border: "3px solid #f3f3f3",
    padding: 10,
    width: "495px",
    minHeight: "532px",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6a4c26",
    marginBottom: 5,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 10,
    color: "#444",
    textAlign: "center",
  },
  info: {
    fontSize: 12,
    margin: "5px 0",
    color: "#000",
  },
  tableRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  tableCell: {
    fontSize: 12,
    color: "#444",
    textAlign: "left",
    padding: 4,
  },
  tableColumnCourse: {
    width: "50%",
    textAlign: "left",
  },
  tableColumnScore: {
    width: "25%",
    textAlign: "center",
  },
  tableColumnGrade: {
    width: "25%",
    textAlign: "center",
  },
  tableHead: {
    fontSize: 12,
    color: "#444",
    textAlign: "left",
    fontWeight: "bold",
    paddingBottom: 5,
  },
  signature: {
    marginTop: 40,
    marginLeft: "10%",
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
  results: { title: string; grade: string; score: string }[];
  date: string;
  department: string;
  studentId: string;
  totalGrade?: string;
  year?: string | null;
  quarter?: string | null;
  academic_session?: string | null;
  semester?: string | null;
  gpa?: string | number;
}> = ({ name, results, date, course, department, studentId, totalGrade, year, quarter, academic_session, semester, gpa }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.border}>
        <Text style={styles.header}>
          Nigerian Army School of Finance and Administration
        </Text>
        <Text style={styles.subHeader}>Student Academic Result</Text>
        <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Name:</Text> {name}
        </Text>
        <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Department:</Text> {department}
        </Text>
        <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Student ID:</Text> {studentId}
        </Text>
        <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Date:</Text> {date}
        </Text>
        <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Course:</Text> {course}
        </Text>
        {year !== null && <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Year:</Text> {year}
        </Text>}
        {quarter !== null && <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Quarter:</Text> {quarter}
        </Text>}
        {academic_session !== null && <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Academic Session:</Text> {academic_session}
        </Text>}
        {semester !== null && <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Semester:</Text> {semester}
        </Text>}
        {!!totalGrade && <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>Total Grade:</Text> {totalGrade}
        </Text>}
        {!!gpa && <Text style={styles.info}>
          <Text style={{ fontWeight: "bold" }}>GPA:</Text> {gpa}
        </Text>}
        <View style={{ padding: "10px 0" }}></View>
        <View style={styles.tableRow}>
          <Text style={{ ...styles.tableHead, ...styles.tableColumnCourse, paddingRight: 10 }}>
            Subject
          </Text>
          <Text style={{ ...styles.tableHead, ...styles.tableColumnScore, paddingRight: 10 }}>
            Score
          </Text>
          <Text style={{ ...styles.tableHead, ...styles.tableColumnGrade, paddingRight: 10 }}>
            Grade
          </Text>
        </View>
        <hr />
        {results.map((result, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={{ ...styles.tableCell, ...styles.tableColumnCourse }}>
              {result.title}
            </Text>
            <Text style={{ ...styles.tableCell, ...styles.tableColumnScore }}>
              {result.score}
            </Text>
            <Text style={{ ...styles.tableCell, ...styles.tableColumnGrade }}>
              {result.grade}
            </Text>
          </View>
        ))}

        <View style={styles.signature}>
          <View style={styles.signatureBlock}>
            <Text style={styles.info}>_______________</Text>
            <Text style={styles.info}>Commandant</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.info}>_______________</Text>
            <Text style={styles.info}>Registrar</Text>
          </View>
        </View>
        <Text style={{...styles.info, textAlign: 'center'}}>NASFA | Excellence in Education</Text>
      </View>
    </Page>
  </Document>
);


export default CertificatePDF;
