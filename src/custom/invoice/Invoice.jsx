"use client";

import React from "react";
import {
  Page,
  View,
  Document,
  Image,
  Text,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { styles } from "./Style";
import { Download } from "lucide-react";

const generateBarcode = (value) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, value, {
    format: "CODE128",
    width: 1,
    height: 60,
    displayValue: false,
  });
  return canvas.toDataURL("image/png");
};

const generateQRCode = async (value) => {
  return await QRCode.toDataURL(value);
};

const MyDocument = ({ qrCodeValue, order }) => {
  const [qrCodeImage, setQRCodeImage] = React.useState("");

  React.useEffect(() => {
    const generateQR = async () => {
      const qr = await generateQRCode(qrCodeValue);
      setQRCodeImage(qr);
    };
    generateQR();
  }, [qrCodeValue]);

  return (
    <Document>
      {order.map((item, index) => {
        const barcodeImage = generateBarcode(item.orderId);
        const subtotal = item.products.reduce(
          (sum, product) => sum + product.price * product.quantity,
          0
        );
        const shippingCost = item.deliveryCharge;
        const tax = 0;
        const grandTotal = subtotal + shippingCost + tax;
        const formattedDate = new Date(item.createdAt).toLocaleString("en-GB", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Page key={index} size="A4" style={styles.page}>
            <View style={{ border: "1px solid black", borderRadius: "17px" }}>
              {/* Header Section */}
              <View style={styles.header}>
                <View style={styles.speechY}>
                  <Text style={styles.aexmart}>Glory Clothing</Text>
                  <Text style={styles.verified}>
                    ONLY VERIFIED BRANDS SELL ON - Abid Fashion
                  </Text>
                  <Text style={styles.verified}>100% AUTHENTIC</Text>
                </View>
                <View>
                  <Text style={styles.invoiceText}>INVOICE</Text>
                  <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
              </View>

              {/* Customer Info Section */}
              <View style={styles.heroSection}>
                <View style={styles.speechY}>
                  <Text style={[styles.billTo, styles.boldText]}>Bill To</Text>
                  <View style={styles.line} />
                  <Text style={styles.customerName}>{item.user.name}</Text>
                  <Text style={styles.customerPhone}>
                    +88 {item.user.phone}
                  </Text>
                  <Text style={styles.customerMail}>{item.user.email}</Text>
                  <Text style={styles.customerAddress}>
                    {item.user.address}
                  </Text>
                </View>
                <View style={styles.barcodeSection}>
                  <Image src={barcodeImage} style={styles.barcodeImage} />
                  <Text style={styles.qrbartext}>
                    INVOICE ID: {item.orderId}
                  </Text>
                </View>
              </View>

              {/* Items Table Section */}
              <View style={styles.itemsSection}>
                <Table tdStyle={{ padding: "2px" }}>
                  <TH
                    style={{
                      fontSize: 10,
                      fontFamily: "Times-Bold",
                      width: "100%",
                    }}
                  >
                    <TD
                      style={{
                        paddingVertical: "4px",
                        backgroundColor: "black",
                        color: "white",
                        justifyContent: "center",
                        width: "40%",
                      }}
                    >
                      Name
                    </TD>
                    <TD
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        justifyContent: "center",
                        width: "20%",
                      }}
                    >
                      Quantity
                    </TD>
                    <TD
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        justifyContent: "center",
                      }}
                    >
                      Unit Price
                    </TD>
                    <TD
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        justifyContent: "center",
                      }}
                    >
                      Total Price
                    </TD>
                  </TH>

                  {item.products.map((product, idx) => (
                    <TR key={idx}>
                      <TD
                        style={{
                          justifyContent: "center",
                          fontSize: 8,
                        }}
                      >
                        {product.name.length > 50
                          ? `${product.name.slice(0, 50)}...`
                          : product.name}
                      </TD>
                      <TD style={{ justifyContent: "center" }}>
                        {product.quantity}
                      </TD>
                      <TD style={{ justifyContent: "center" }}>
                        {product.price.toFixed(2)}
                      </TD>
                      <TD style={{ justifyContent: "center" }}>
                        {(product.price * product.quantity).toFixed(2)}
                      </TD>
                    </TR>
                  ))}
                </Table>
              </View>

              {/* Payment and Totals Section */}
              <View style={styles.parentPayTotal}>
                <View style={styles.speechY}>
                  <Text style={[styles.boldText, styles.paymentMethod]}>
                    Payment Method
                  </Text>
                  <View style={styles.line1} />
                  <Text style={styles.boldText}>
                    Payment Status: {item.payment.status.toUpperCase()}
                  </Text>
                  <Text>Method: {item.payment.method.toUpperCase()}</Text>
                  <Text>Collection Amount: {grandTotal.toFixed(2)}</Text>
                </View>

                <View style={styles.grandtotal}>
                  <Table tdStyle={{ padding: "2px", flexDirection: "column" }}>
                    <TH>
                      <TD>Sub Total</TD>
                      <TD>{subtotal.toFixed(2)}</TD>
                    </TH>
                    <TH>
                      <TD>Shopping Cost</TD>
                      <TD>{item.deliveryCharge}</TD>
                    </TH>
                    <TH>
                      <TD>Tax/VAT</TD>
                      <TD>{tax.toFixed(2)}</TD>
                    </TH>
                    <TH
                      style={{
                        fontSize: 10,
                        fontFamily: "Times-Bold",
                      }}
                    >
                      <TD
                        style={{
                          paddingHorizontal: 6,
                          backgroundColor: "black",
                          color: "white",
                          padding: 5,
                          fontSize: 12,
                          fontFamily: "Times-Bold",
                        }}
                      >
                        Grand Total
                      </TD>
                      <TD
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          padding: 5,
                          fontSize: 12,
                          fontFamily: "Times-Bold",
                        }}
                      >
                        {grandTotal.toFixed(2)}
                      </TD>
                    </TH>
                  </Table>
                </View>
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termscondition}>
                <View>
                  <Text style={[styles.boldText, styles.paymentMethod]}>
                    Terms & Condition
                  </Text>
                  <View style={styles.line1} />
                  <Text>
                    Delivery Time: Orders will be delivered within 1-3 business
                    days.
                  </Text>
                  <Text>
                    Return: Wrong or damaged items must be returned immediately
                    with the delivery person.
                  </Text>
                  <Text>
                    Eligibility: Returns are not accepted for physical damage or
                    broken seals.
                  </Text>
                  <Text>
                    Non-Returnable: Sold items are non-returnable, except for
                    defective products.
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 60,
                  }}
                >
                  <View
                    style={{
                      width: 120,
                      height: 1,
                      backgroundColor: "black",
                    }}
                  />
                  <Text style={{ fontFamily: "Times-Bold" }}>
                    Assurance Manager
                  </Text>
                  <Text style={{ fontSize: 6 }}>Glory ASSURANCE TEAM</Text>
                </View>
              </View>

              {/* Footer Messages */}
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Times-Bold",
                    fontSize: 10,
                  }}
                >
                  Dear {item.user.name}, Your satisfaction is our priority -
                  Thanks for shopping with Abid Fashion.
                </Text>
              </View>

              {/* QR Code */}
              <View
                style={{
                  marginHorizontal: 10,
                  marginBottom: 5,
                  height: 60,
                  width: 60,
                  textAlign: "center",
                }}
              >
                <Image src={qrCodeImage} />
                <Text
                  style={{
                    fontSize: 6,
                    fontFamily: "Times-Bold",
                  }}
                >
                  WhatsApp & Chat 24/7
                </Text>
              </View>

              {/* Red Footer Bar */}
              <View
                style={{
                  height: 60,
                  width: "100%",
                  backgroundColor: "red",
                  color: "white",
                  borderBottomRightRadius: 15,
                  borderBottomLeftRadius: 15,
                }}
              ></View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default function ReactPdfInvoice({ order }) {
  const ordersArray = Array.isArray(order) ? order : [order];
  const fileName = ordersArray[0]?.orderId || "Invoice";

  return (
    <PDFDownloadLink
      document={
        <MyDocument
          order={ordersArray}
          qrCodeValue="https://wa.me/8801770072063"
        />
      }
      fileName={`Invoice_${fileName}.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <div
            disabled
            className="flex items-center cursor-pointer py-1 px-2"
          >
            Generating...
          </div>
        ) : (
          <div className="flex items-center cursor-pointer py-1 px-2">
            <Download size={18} /> Invoice
          </div>
        )
      }
    </PDFDownloadLink>
  );
}
