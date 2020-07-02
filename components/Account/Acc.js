import React, { Component } from 'react';
import { Modal, StyleSheet, View, Text, Alert, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { DatePicker } from "native-base";
//Scrollable view Library
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dateFormat from 'dateformat';

import Otp from 'react-native-rave/components/General/Otp';
import VBVSecure from 'react-native-rave/components/General/vbvSecure';


export default class AccModal extends Component {
  constructor(props) {
    super(props);

    this.state = { dob: '', selectedDate: false, banks: [], accountnumber: '', phonenumber: (this.props.phone == null) ? '' : this.props.phone, dobErr: '#fff', accountbankErr: 'none', accountnumberErr: 'none', phonenumberErr: '#fff', otp: "", flwRef: "", otpModal: false, loading: false, otp: "", phone: (this.props.phone == null) ? '' : this.props.phone, cardErr: '#fff', accountbank: this.props.accountbank };
    this.confirmOtp = this.confirmOtp.bind(this);
    this.pay = this.pay.bind(this);
    this.check = this.check.bind(this);
    this.confirmVBV = this.confirmVBV.bind(this);
    
  }


  // Performs a check on the card form
  check() {
    this.setState({
      accountbankErr: 'none', accountnumberErr: 'none', phonenumberErr: '#fff', dobErr: 'none'
    })

    if (this.props.accountbank.length < 2 || this.state.accountnumber.length < 10 || this.state.phonenumber.length < 3) {

      if (this.props.accountbank < 2) {
        this.setState({
          accountbankErr: 'flex'
        })

      }

      if (this.state.accountnumber.length < 10) {
        this.setState({
          accountnumberErr: 'flex'
        })
      }
      if (this.state.phonenumber.length < 3) {
        this.setState({
          phonenumberErr: '#F5A623'
        })
      }
    } else if (this.props.accountbank == "058" || this.props.accountbank == "011") {
      if (Number(this.props.amount) < 100) {
        Alert.alert(
          'Alert',
          'Amount can\'t be less than 100',
          [
            {
              text: 'Cancel', onPress: () => this.setState({
                loading: false
              })
            },
          ],
          { cancelable: false }
        )
      } else {
        return true
      }
    } else if (this.props.accountbank == "057") {
      if (!this.state.selectedDate) {
        this.setState({
          dobErr: 'flex'
        })
        return false
      }

      return true

    } else {
      return true


    }
  }

  // The Pay button handler
  pay() {
    if (this.check()) {
      this.setState({
        loading: true
      })

      this.props.rave.getAccountFees({ amount: this.props.amount, currency: this.props.currency }).then((resp) => {

        Alert.alert(
          '',
          'You will be charged a total of ' + this.props.currency + resp.data.charge_amount + ' . Do you want to continue?',
          [
            {
              text: 'Cancel', onPress: () => this.setState({
                loading: false
              })
            },
            {
              text: 'Yes', onPress: () => this.charge()
            },
          ],
          { cancelable: false }
        )

      }).catch((err) => {
        this.setState({
          loading: false
        })
        this.props.onFailure(err);
      })
    }
  }

  //This closes the otp modal and makes the otp validate
  confirmOtp() {
    this.setState({
      otpModal: false
    })

    //validate with otp
    this.props.rave.validateAccount({ transactionreference: this.state.flwRef, otp: this.state.otp }).then((res) => {
      if (res.data.status.toUpperCase() === "SUCCESSFUL") {
        this.setState({
          loading: false
        })
        this.props.rave.verifyTransaction(res.data.txRef).then((resp) => {
          this.props.onSuccess(resp);
          if (resp.data.status.toUpperCase() === "SUCCESSFUL" && resp.data.chargecode === "00") {
            Alert.alert(
              '',
              'Transaction Successful',
              [{
                text: 'Ok',
                onPress: () => this.setState({
                  loading: false,
                  // "accountbank": "", // get the bank code from the bank list endpoint.
                  "accountnumber": "",
                  "phonenumber": "",
                  "otp": ""
                  // "dob": ""
                })
              }]
            )
          }
        }).catch((error) => {
          this.props.onFailure(error);
        })
      } else {
        this.setState({
          loading: false
        })
        this.props.onFailure(res);
      }
    }).catch((e) => {
      this.setState({
        loading: false
      })
      this.props.onFailure(e);
    })

  }

  //This closes the vbv modal and makes validation
  confirmVBV(err, data) {
    this.setState({
      vbvModal: false,
      loading: false
    })

    if (data.status == "successful") {
      this.props.rave.verifyTransaction(data.txRef).then((resp) => {
        this.props.onSuccess(resp);
      }).catch((error) => {
        this.props.onFailure(error);
      })
    }
    else {
      this.props.onFailure(data);
    }
  }

  // Sends payload to Flutterwave
  charge() {
    //Set button to loading
    this.setState({
      loading: true
    })

    // Initiate the charge
    let payload = {
      "accountbank": this.props.accountbank,// get the bank code from the bank list endpoint.
      "accountnumber": this.state.accountnumber,
      "phonenumber": this.state.phonenumber,
      "payment_type": "account"
    }

    if (this.state.accountbank == "057") {
      payload = {
        "accountbank": this.props.accountbank,// get the bank code from the bank list endpoint.
        "accountnumber": this.state.accountnumber,
        "phonenumber": this.state.phonenumber,
        "passcode": dateFormat(this.state.dob, "ddmmyyyy"),
        "payment_type": "account"
      }
    }
    this.props.rave.initiatecharge(payload).then((res) => {
      // Check for suggested auth
      if (res.data.status.toUpperCase() === "SUCCESSFUL") {
        this.setState({
          loading: false
        })
        this.props.rave.verifyTransaction(res.data.txRef).then((resp) => {
          this.props.onSuccess(resp);
        }).catch((error) => {
          this.props.onFailure(error);
        })
      }
      else if (res.data.chargeResponseCode === "02" && res.data.authurl.toUpperCase() === "NO-URL") {
        this.setState({
          flwRef: res.data.flwRef,
          otpModal: true,
          loading: true,
          chargeResponseMessage: (res.data.validateInstruction) ? res.data.validateInstruction : 'Please validate with the OTP sent to your mobile or email'
        })

      } else {
        this.setState({ vbvModal: true, vbvurl: res.data.authurl });
      }

    }).catch((e) => {
      this.setState({
        loading: false
      })

      this.props.onFailure(e);
    })

  }


  render() {

    const styles = StyleSheet.create({
      container: {
        paddingHorizontal: 25,
        marginTop: 40,
        paddingBottom: 50,
        height: '60%',
        // position: 'absolute',
        // zIndex: 2
      },
      label: {
        color: "#ACACAC"
      },
      input: {
        borderRadius: 2,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: this.state.phonenumberErr,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 10
      },
      logo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        paddingVertical: 10
      },
      formGroup: {
        marginBottom: 20,
        // width: '100%'
      }
    });

    let btnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>PAY {this.props.currency} {this.props.amount}</Text>;

    let zenith = <View></View>

    if (this.props.accountbank == "057") {
      zenith = (<View style={styles.formGroup}>
        {/* <Text style={styles.label}>Date of Birth</Text> */}
        <View style={styles.input}>
          <Text style={{ color: '#999999', fontSize: 16 }}>Date of Birth</Text>
          <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
            <DatePicker
              // defaultDate={new Date(2004, 4, 4)}
              locale={"en"}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText="Select date"
              textStyle={{ color: "#000" }}
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              onDateChange={(date) => this.setState({ dob: date, selectedDate: true })}
            />
          </View>
        </View>
        {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.dobErr, fontWeight: 'bold', marginTop: 5 }}>Enter date of birth</Text> */}
      </View>)
    }

    let logo = <View></View>
    if (this.props.accountbank == '044') {
      logo = <View style={styles.logo}><Image source={require('../../assets/icons/access.png')} /></View>
    } else if (this.props.accountbank == '101') {
      logo = <View style={styles.logo}><Image source={require('../../assets/icons/pb.png')} /></View>
    } else if (this.props.accountbank == '232') {
      logo = <View style={styles.logo}><Image source={require('../../assets/icons/sterlingBankLogoWk.png')} /></View>
    } else if (this.props.accountbank == '057') {
      logo = <View style={styles.logo}><Image source={require('../../assets/icons/zenithLogo.png')} /></View>
    }

    if (this.state.loading) {

      btnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />

    }

    return (
      
        <KeyboardAwareScrollView style={{ backgroundColor: this.props.background, width: "100%", paddingVertical: 60, paddingHorizontal: 30 }} keyboardShouldPersistTaps='always'>
          {/* <Otp primarycolor={this.props.primarycolor} secondarycolor={this.props.secondarycolor} otpModal={this.state.otpModal} confirm={this.confirmOtp} otp={this.state.otp} chargeResponseMessage={this.state.chargeResponseMessage} otpEdit={(otp) => this.setState({ otp })} /> */}
          <VBVSecure vbvModal={this.state.vbvModal} url={this.state.vbvurl} confirm={this.confirmVBV} />
          <View style={{ flex: 1 }}>
            {logo}
            <View style={styles.formGroup}>
              {/* <Text style={styles.label}>Phone Number</Text> */}
              <View style={styles.input}>
                <Text style={{ color: '#999999', fontSize: 16 }}>Phone Number</Text>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    autoCorrect={false}
                    editable={(this.state.loading) ? false : true}
                    keyboardType="phone-pad"
                    style={{ fontSize: 16, paddingHorizontal: 10, minWidth: "100%" }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(phonenumber) => this.setState({ phonenumber })}
                    value={this.state.phonenumber}
                    placeholder='08023456789'
                  />
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.phonenumberErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid phone number</Text> */}
            </View>

            <View style={styles.formGroup}>
              {/* <Text style={styles.label}>Account Number</Text> */}
              <View style={styles.input}>
                <Text style={{ color: '#999999', fontSize: 16 }}>Account Number</Text>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    autoCorrect={false}
                    editable={(this.state.loading) ? false : true}
                    keyboardType="numeric"
                    style={{ fontSize: 16, paddingHorizontal: 10, minWidth: "100%" }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    maxLength={10}
                    onChangeText={(accountnumber) => this.setState({ accountnumber })}
                    value={this.state.accountnumber}
                    placeholder='00012223423'
                  />
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.accountnumberErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid account number</Text> */}
            </View>

            {zenith}

 
          </View>

          <TouchableOpacity onPress={this.pay} style={{ width: "100%", marginTop: 20 }} disabled={(this.state.loading == false) ? false : true}>
            <View style={{ backgroundColor: this.props.primarycolor, paddingVertical: 15, borderRadius: 5, opacity: (this.state.loading == false) ? 1 : 0.6 }}>
              {btnText}
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        
      
    )
  }
}


