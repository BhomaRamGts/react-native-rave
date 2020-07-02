import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Modal
} from "react-native";
import { Picker, DatePicker } from "native-base";
//Scrollable view Library
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { WebView } from 'react-native-webview';


export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      network: "Select Network",
      phonenumber: this.props.phone == null ? "" : this.props.phone,
      status: "",
      chargeResponseMessage: "",
      voucher: "",
      url:"",
      voucherErr: "#fff",
      networkErr: "#fff",
      phonenumberErr: "#fff",
      label: "flex",
      modalvisible: false,
      flwRef: "",
      loading: false,
      phone: this.props.phone == null ? "" : this.props.phone
    };

    this.pay = this.pay.bind(this);
    this.check = this.check.bind(this);
    this.mounted = false;
  }

  // Performs a check on the state of the network, phone, voucher fields, if they are filled as required
  check() {
    this.setState({
      networkErr: "#fff",
      phonenumberErr: "#fff",
      voucherErr: "#fff"
    });
    if (this.state.network === "Select Network") {
      this.setState({
        networkErr: this.props.primarycolor
      });
    } else if (this.state.phonenumber.length < 3) {
      this.setState({
        phonenumberErr: this.props.primarycolor
      });
    } else if (this.state.voucher === "" && this.state.network === "Vodafone") {
      this.setState({
        voucherErr: this.props.primarycolor
      });
    } else if (
      this.state.network === "MTN" ||
      this.state.network === "Tigo" ||
      this.state.network === "Vodafone"
    ) {
      if (Number(this.props.amount) < 1) {
        Alert.alert(
          "Alert",
          "Amount can't be less than 1GHS",
          [
            {
              text: "Cancel",
              onPress: () =>
                this.setState({
                  loading: false
                })
            }
          ],
          { cancelable: false }
        );
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  // Sends payload to Flutterwave
  charge() {
    //Set button to loading
    this.setState({
      loading: true
    });

    // Initiate the charge
    let payload = {
      network: this.state.network,
      phonenumber: this.state.phonenumber,
      voucher: this.state.voucher,
      payment_type: "mobilemoneygh"
    };

    // Sets the payload to be initiated by rave charge endpoint based on the selected network
    if (this.state.network === "Vodafone") {
      payload = {
        network: this.state.network,
        phonenumber: this.state.phonenumber,
        voucher: this.state.voucher,
        payment_type: "mobilemoneygh"
      };
    } else {
      payload = {
        network: this.state.network,
        phonenumber: this.state.phonenumber,
        voucher: "",
        payment_type: "mobilemoneygh"
      };
    }

    // this initiates the charge request
    this.props.rave
      .initiatecharge(payload)
      .then(res => {

         
          this.setState({
            url:res.data.link,
            modalvisible:true,
            loading:false
          })
          
          

      })
      .catch(e => {
        this.setState({
          loading: false
        });
        this.props.onFailure({
          txref: this.props.txref,
          status: "pendingVerification",
          amount: this.props.amount,
          nextAction: "verify"
        });
      });
  }

 


  // The Pay button handler
  pay() {
    if (this.check()) {
      this.setState({
        loading: true
      });

      this.props.rave
        .getAccountFees({
          amount: this.props.amount,
          currency: this.props.currency
        })
        .then(resp => {
          // Alert to display the charged amount in the GHS
          Alert.alert(
            "",
            "You will be charged a total of " +
              this.props.currency +
              resp.data.charge_amount +
              " and be Redirected to a verification page. Do you want to continue?",
            [
              {
                text: "Cancel",
                onPress: () =>
                  this.setState({
                    loading: false
                  })
              },
              {
                text: "Yes",
                onPress: () => this.charge()
              }
            ],
            { cancelable: false }
          );
        })
        .catch(err => {
          this.setState({
            loading: false
          });
          this.props.onFailure({
            txref: this.props.txref,
            status: "pendingVerification",
            amount: this.props.amount,
            nextAction: "verify"
          });
        });
    }
  }

  closeModal() {
    this.setState({modalvisible:false});
    this.props.onSuccess({
      txref: this.props.txref,
      status: "pendingWebhookCallback",
      amount: this.props.amount,
      nextAction: "webhookCallback"
    });
  }

  // This is the render function to render the payment interface
  render() {
    const styles = StyleSheet.create({
      container: {
        paddingHorizontal: 25,
        paddingTop: 120,
        height: "100%",
        backgroundColor: "#f2f2f2"
      },
      label: {
        color: "#12122c",
        fontWeight: "400",
        textAlign: "center",
        paddingBottom: 20,
        display: this.state.label
      },
      input: {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#fff",
        shadowColor: "#ccc",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 10,
        elevation: 2
      },
      formGroup: {
        marginBottom: 10
      },
      cancelButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#f5a623',
        borderRadius: 4,
        padding: 10,
        paddingTop: 7,
        paddingBottom: 7,
      },
      cancelText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    });

    let btnText = (
      <Text
        style={{
          fontSize: 13,
          textAlign: "center",
          fontWeight: "bold",
          color: this.props.secondarycolor
        }}
      >
        PAY {this.props.currency} {this.props.amount}
      </Text>
    );

    let Vodafone = <View></View>;
    let Voucher = <View></View>;
    let web = <View></View>
    let page = <View></View>

    // This checks the network selected and displays an instruction and also the voucher input field if it is Vodafone
    if (this.state.network === "Vodafone") {
      this.state.label = "none";
      Vodafone = (
        <View style={styles.formGroup}>
          <Text
            style={{
              color: "#999999",
              fontSize: 12,
              fontWeight: "bold",
              marginTop: 5
            }}
          >
          Dial *110# and follow the instructions to generate voucher
          </Text>
          {/* <Text style={{ color: "#999999", fontSize: 10, fontWeight: "bold" }}>
            1. Dial * 110# to generate your transaction voucher.
          </Text> */}
          {/* <Text style={{ color: "#999999", fontSize: 10, fontWeight: "bold" }}>
            2.Select Option 6, to generate the voucher.
          </Text> */}
          {/* <Text style={{ color: "#999999", fontSize: 10, fontWeight: "bold" }}>
            3.Enter your PIN in next prompt.
          </Text> */}
          {/* <Text style={{ color: "#999999", fontSize: 10, fontWeight: "bold" }}>
            4.Input the voucher generated in the payment modal.
          </Text> */}
        </View>
      );

      Voucher = (
        <View style={{ marginBottom: 5 }}>
          {/* <Text style={styles.label}>Voucher</Text> */}
          <View style={[styles.input, { borderColor: this.state.voucherErr }]}>
            <Text style={{ color: "#999999", fontSize: 16 }}>VOUCHER</Text>
            <View style={{ paddingVertical: 5, flexDirection: "row" }}>
              <TextInput
                autoCorrect={false}
                editable={this.state.loading ? false : true}
                keyboardType="numeric"
                style={{
                  fontSize: 16,
                  paddingHorizontal: 10,
                  minWidth: "100%"
                }}
                underlineColorAndroid="rgba(0,0,0,0)"
                maxLength={10}
                onChangeText={voucher => this.setState({ voucher })}
                value={this.state.voucher}
                placeholder="123456"
              />
            </View>
          </View>
          {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.voucherErr, fontWeight: 'bold', marginTop: 5 }}>Enter your voucher code</Text> */}
        </View>
      );
    }

    if (this.state.loading) {
      btnText = (
        <ActivityIndicator size="small" color={this.props.secondarycolor} />
      );
    }
    // this returns the Mobile Money payment form

   


     
    
  


    return (
      <View>
    
      <Modal
      visible={this.state.modalvisible}
      >
        <ScrollView>
              <WebView
                source={{ uri: this.state.url}}
                
              
                useWebKit={true}
                style={{ padding: "50%" }}
                
                javaScriptEnabled={true}
                contentContainerStyle={{ paddingBottom: 60}}
                scrollEnabled={true}
              />
            <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
                    this.closeModal()
                  }}
            >
                <Text style={styles.cancelText}>Close </Text>
            </TouchableOpacity>
          </ScrollView>
      </Modal>

      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          style={{ paddingBottom: 50 }}
        >

          <View style={{ flex: 1 }}>
            
            {Vodafone}
            <View style={styles.formGroup}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 20,
                    marginVertical: 10,
                    display: this.state.label
                  }
                ]}
              >
                Select your network and enter your phone number
              </Text>
              <View
                style={[styles.input, { borderColor: this.state.networkErr }]}
              >
                <Picker
                  mode="dropdown"
                  placeholder="Select Network"
                  selectedValue={this.state.network}
                  style={{ color: "#999999", width: "100%" }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ network: itemValue })
                  }
                >
                  <Picker.Item label="SELECT NETWORK" value="Select Network" />
                  <Picker.Item label="MTN" value="MTN" />
                  <Picker.Item label="Tigo" value="Tigo" />
                  <Picker.Item label="Vodafone" value="Vodafone" />
                </Picker>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.networkErr, fontWeight: 'bold', marginTop: 5 }}>Choose a network</Text> */}
            </View>
            <View style={styles.formGroup}>
              {/* <Text style={styles.label}>Phone Number</Text> */}
              <View
                style={[
                  styles.input,
                  { borderColor: this.state.phonenumberErr }
                ]}
              >
                <Text style={{ color: "#999999", fontSize: 16 }}>
                  PHONE NUMBER
                </Text>
                <View style={{ paddingVertical: 5, flexDirection: "row" }}>
                  <TextInput
                    autoCorrect={false}
                    editable={this.state.loading ? false : true}
                    keyboardType="phone-pad"
                    autoFocus
                    style={{
                      fontSize: 16,
                      paddingHorizontal: 10,
                      minWidth: "100%"
                    }}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    onChangeText={phonenumber => this.setState({ phonenumber })}
                    value={this.state.phonenumber}
                    placeholder="054709929220"
                  />
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.phonenumberErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid phone number</Text> */}
            </View>
  
            {Voucher}
          </View>
  
          <TouchableOpacity
            onPress={this.pay}
            style={{ width: "100%", marginTop: 20, marginBottom: 90 }}
            disabled={this.state.loading == false ? false : true}
          >
            <View
              style={{
                backgroundColor: this.props.primarycolor,
                paddingVertical: 15,
                borderRadius: 5,
                opacity: this.state.loading == false ? 1 : 0.6
              }}
            >
              {btnText}
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>

    </View> 
        
    );
  }
}