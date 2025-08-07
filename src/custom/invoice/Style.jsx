import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    fontSize: 10,
    fontFamily: "Times-Roman",
    paddingHorizontal: 50,
    paddingVertical: 79,
    border: "1px solid black",
    
  },
  section: {
    margin: 10,
    padding: 10,
  },

  barcodeImage: {
    height: 60,
    width: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 100,
    width: "100%",
    backgroundColor: "Black",
    color: "white",
    paddingHorizontal: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  heroSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },

  boldText: {
    fontFamily: "Times-Bold",
  },

  itemsSection: {
    padding: 10,
  },
  invoiceText: {
    fontSize: 20,
    fontFamily: "Times-Bold",
  },
  parentPayTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 70,
  },
  grandtotal: {
    width: "200px",
  },

  termscondition: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
  },

  paymentMethod: {
    fontSize: 12,
  },

  dateText: {
    fontFamily: "Times-Bold",
    color: "red",
    marginTop: 8,
    fontSize: 8,
  },
  speechY: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontFamily: "Times-Roman",
  },
  aexmart: {
    fontFamily: "Times-Bold",
    fontSize: 15,
  },
  verified: {
    fontFamily: "Times-Roman",
    fontSize: 10,
  },
  qrbartext: {
    fontFamily: "Times-Roman",
    fontSize: 10,
  },

  barcodeSection: {
    display: "flex",
    alignItems: "center",
  },

  line: {
    width: "80px",
    height: "1px",
    backgroundColor: "black",
  },

  line1: {
    width: "100px",
    height: "1px",
    backgroundColor: "black",
  },
});
