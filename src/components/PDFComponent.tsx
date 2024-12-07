import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Define styles for the certificate
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fdf6e4",
    padding: 40,
    margin: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    border: "10px solid #c9ad6d",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    textAlign: "center",
    display: 'flex',
    flexDirection: 'column',
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
    fontSize: 40,
    margin: "20px 0",
    fontWeight: "bold",
    color: "#6a4c26",
    textTransform: "uppercase",
  },
  body: {
    fontSize: 16,
    marginBottom: 10,
    color: "#444",
    lineHeight: 1.5,
  },
  footer: {
    fontSize: 14,
    marginTop: 30,
    color: "#6a4c26",
    textAlign: "center",
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

// Certificate PDF Component
const CertificatePDF: React.FC<{
  name: string;
  course: string;
  date: string;
  institution: string;
}> = ({ name, course, date, institution }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.border}>
        <Text style={styles.header}>{institution}</Text>
        <Text style={styles.subHeader}>
          This certificate is awarded to:
        </Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.body}>
          For successfully completing the <Text style={{fontWeight: 'bold'}}>{course}</Text> course.
        </Text>
        <Text style={styles.body}>Awarded on: {date}</Text>
        <View style={styles.signature}>
          <View style={styles.signatureBlock}>
            <Text>_________________________</Text>
            <Text>Authorized Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text>_________________________</Text>
            <Text>Director</Text>
          </View>
        </View>
        <Text style={styles.footer}>
          {institution} | Excellence in Education
        </Text>
      </View>
    </Page>
  </Document>
);

export default CertificatePDF;
