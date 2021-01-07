import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Dimensions,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Header } from "react-native-elements";
import { Linking } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      askPermissions: null,
      scanned: false,
      buttonState: "normal",
      scannedData: null,
      type: null,
    };
  }

  askCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      askPermissions: status === "granted",
      buttonState: "clicked",
    });
  };

  handleCameraPermissions = ({ type, data }) => {
    this.setState({
      scannedData: data,
      scanned: true,
      type: type,
      buttonState: "normal",
    });
  };
  render() {
    if (this.state.buttonState === "clicked" && this.state.askPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={
            this.state.scanned ? undefined : this.handleCameraPermissions
          }
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (this.state.buttonState === "normal") {
      return (
        <View style={styles.container}>
          <Header
            centerComponent={{
              text: "BarCode-Scanner",
              style: { color: "#fff", textTransform: "capitalize" },
            }}
          />
          <Text
            style={[styles.centerText, { marginTop: "50%" }]}
            onPress={() => {
              this.state.askPermissions && this.state.scanned
                ? Linking.openURL(this.state.scannedData)
                : alert("Please scan the QR code");
            }}
          >
            {this.state.askPermissions && this.state.scanned
              ? this.state.scannedData
              : "Camera Request Needed"}
          </Text>
          <Text style={[styles.centerText, { marginBottom: "50%" }]}>
            {this.state.askPermissions && this.state.scanned
              ? this.state.type
              : "Type of the code"}
          </Text>
          <Button title="Scan" onPress={this.askCameraPermissions} />
        </View>
      );
    } else if (
      this.state.buttonState === "clicked" &&
      !this.state.askPermissions
    ) {
      return this.setState({ buttonState: "normal" });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerText: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 20,
  },
});
