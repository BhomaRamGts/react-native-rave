import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { DatePicker, Picker } from "native-base";

import { Col, Row, Grid } from 'react-native-easy-grid';
//Scrollable view Library
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = { value: '', dob: '', selectedDate: false, banks: [], accountbank: '', accountnumber: '', phonenumber: (this.props.phone == null) ? '' : this.props.phone, status: "", chargeResponseMessage: '', suggested_auth: "", vbvModal: false, vbvurl: '', dobErr: 'none', accountbankErr: 'none', accountnumberErr: 'none', phonenumberErr: 'none', inputErr: '#fff', otp: "", flwRef: "", otpModal: false, loading: false, otp: "", phone: (this.props.phone == null) ? '' : this.props.phone, accModal: false, background: '#f2f2f2', page: this.props.page };

    this.next = this.next.bind(this)
    this.confirmOtp = this.confirmOtp.bind(this);
    this.pay = this.pay.bind(this);
    this.check = this.check.bind(this);
    this.confirmVBV = this.confirmVBV.bind(this);

  }

  next() {
    this.setState({
      accModal: true
    })
  }

  confirmBank(value) {
    this.setState({
      accountbank: value,
      background: (value) == '044' ? '#143f89' : (value) == '232' ? '#ad1620' : (value) == '057' ? '#ed3237' : (value) == '101' ? '#fff' : '#f2f2f2'

    }, function () {
      this.next()
    })

  }

  componentDidMount() {
    this.mounted = true;
    let banks;
    this.props.rave.listBanks().then((response) => {

      banks = response.map((bank) => {
        return (
          <Picker.Item key={bank.bankcode} label={bank.bankname} value={bank.bankcode} />
        )
      })
      if (this.mounted) {
        this.setState({ banks, accountbank: response[5].bankcode })
      }
    }).catch((e) => {
      console.log(e);

    })

  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // Performs a check on the card form
  check() {
    this.setState({
      accountbankErr: 'none', accountnumberErr: 'none', phonenumberErr: '#fff', dobErr: 'none', inputErr: '#fff'
    })

    if (this.state.accountbank.length < 2 || this.state.accountnumber.length < 10 || this.state.phonenumber.length < 3) {

      if (this.state.accountbank < 2) {
        this.setState({
          accountbankErr: 'flex',
          inputErr: this.props.primarycolor
        })

      }

      if (this.state.accountnumber.length < 10) {
        this.setState({
          accountnumberErr: 'flex',
          inputErr: this.props.primarycolor
        })
      }
      if (this.state.phonenumber.length < 3) {
        this.setState({
          phonenumberErr: '#F5A623',
          inputErr: this.props.primarycolor
        })
      }
    } else if (this.state.accountbank == "058" || this.state.accountbank == "011") {
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
    } else if (this.state.accountbank == "057") {
      if (!this.state.selectedDate) {
        this.setState({
          dobErr: 'flex',
          inputErr: this.props.primarycolor
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
      loading: true
    })
    //validate with otp
    this.props.rave.validateAccount({ transactionreference: this.state.flwRef, otp: this.state.otp }).then((res) => {
      if (res.data.status.toUpperCase() === "SUCCESSFUL") {
        this.setState({
          loading: false
        })
          this.props.onSuccess(res);
            Alert.alert(
              '',
              'Transaction Successful',
              [{
                text: 'Ok',
                onPress: () => this.setState({
                  loading: false,
                  otpModal: false,
                  vbvModal: false,
                  accModal: false,
                  // "accountbank": "", // get the bank code from the bank list endpoint.
                  "accountnumber": "",
                  "phonenumber": "",
                  "otp": ""
                  // "dob": ""
                })
              }]
            )
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
        this.props.onSuccess(data);
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
      "accountbank": this.state.accountbank,// get the bank code from the bank list endpoint.
      "accountnumber": this.state.accountnumber,
      "phonenumber": this.state.phonenumber,
      "payment_type": "account"
    }

    if (this.state.accountbank == "057") {
      payload = {
        "accountbank": this.state.accountbank,// get the bank code from the bank list endpoint.
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
          loading: false,
          "accountnumber": "",
          "phonenumber": "",
        })
        this.props.onSuccess(res);
      }
      else if (res.data.chargeResponseCode === "02" && res.data.authurl.toUpperCase() === "NO-URL") {
        this.setState({
          flwRef: res.data.flwRef,
          otpModal: true,
          background: '#f2f2f2',
          loading: false,
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
        paddingTop: 120,
        height: '100%',
        backgroundColor: this.state.background
      },
      label: {
        color: "#12122c",
        fontWeight: '400',
        textAlign: 'center',
        paddingBottom: 20
      },
      input: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: this.state.inputErr,
        backgroundColor: '#fff',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 10,
        elevation: 2
      },
      div: {
        borderWidth: 0,
        borderRadius: 5,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1

      },
      formGroup: {
        marginBottom: 20
      },
      logo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
      }
    });

    let btnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>PAY {this.props.currency} {this.props.amount}</Text>;

    let otpBtnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>Confirm OTP</Text>;

    let zenith;
    if (this.state.accountbank == '057') {
      zenith = <View style={styles.formGroup}>
        <View style={styles.input}>
          <Text style={{ color: '#999999', fontSize: 16 }}>Date of Birth</Text>
          <View style={{ paddingVertical: 3, flexDirection: 'row' }}>
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
      </View>
    }

    let logo = <View></View>
    if (this.state.accountbank == '044') {
      logo = <View style={styles.logo}><Image source={require('../../assets/icons/access.png')} /></View>
    } else if (this.state.accountbank == '101') {
      logo = <View style={styles.logo}><Image source={require('../../assets/icons/pb.png')} /></View>
    } else if (this.state.accountbank == '232') {
      logo = <View style={styles.logo}><Image source={require('../../assets/icons/sterlingBankLogoWk.png')} /></View>
    } else if (this.state.accountbank == '057') {
      logo = <View style={styles.logo}><Image source={require('../../assets/icons/zenithLogo.png')} /></View>
    }

    if (this.state.loading) {

      btnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />

      otpBtnText = <ActivityIndicator size="small" color={this.props.secondarycolor}/>
    }

    let access = <Image source={require('../../assets/icons/access.png')} />;
    let providus = <Image source={require('../../assets/icons/pb.png')} />;
    let sterling = <Image source={require('../../assets/icons/sterlingBankLogoWk.png')} />;
    let zenithLogo = <Image source={require('../../assets/icons/zenithLogo.png')} />;

    let page;
    if (this.state.accModal) {
      page = <KeyboardAwareScrollView  keyboardShouldPersistTaps='always'>
        <View style={{ flex: 1 }}>
          {logo}
          <View style={styles.formGroup}>
            {/* <Text style={styles.label}>Phone Number</Text> */}
            <View style={styles.input}>
              <Text style={{ color: '#999999', fontSize: 16 }}>Phone Number</Text>
              <View style={{ paddingVertical: 5, flexDirection: 'row' }}>
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
              <View style={{ paddingVertical: 5, flexDirection: 'row' }}>
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

        <TouchableOpacity onPress={this.pay} style={{ width: "100%", marginTop: 15 }} disabled={(this.state.loading == false) ? false : true}>
          <View style={{ backgroundColor: this.props.primarycolor, paddingVertical: 10, borderRadius: 5, opacity: (this.state.loading == false) ? 1 : 0.6 }}>
            {btnText}
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>;

      if (this.state.otpModal) {
        page = <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
          <View style={{ flex: 1 }}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { fontSize: 20 }]}>{this.state.chargeResponseMessage}</Text>
              <View style={styles.input}>
                <Text style={{ color: '#999999', fontSize: 14 }}>Enter OTP</Text>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    autoCorrect={false}
                    keyboardType="numeric"
                    style={{ fontSize: 20, paddingHorizontal: 10, minWidth: "98%" }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(otp) => this.setState({ otp })}
                    value={this.state.otp}
                  />
                </View>
              </View>
            </View>


            <TouchableOpacity onPress={this.confirmOtp} style={{ width: "100%" }} disabled={(this.state.loading == false) ? false : true}>
              <View style={{ backgroundColor: this.props.primarycolor, paddingVertical: 15, borderRadius: 5, opacity: (this.state.loading == false) ? 1 : 0.6 }}>
              {otpBtnText}
              </View>
            </TouchableOpacity>

          </View>
        </KeyboardAwareScrollView>;
      }

    } else {

      page = <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

        <View style={{ flex: 1 }}>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { fontSize: 20 }]}>Please select your bank</Text>
            <View style={{ minWidth: "100%" }}>
              <Grid style={{ marginBottom: 8 }}>
                <Row>
                  <Col style={[styles.div, { backgroundColor: '#143f89', marginRight: 3 }]}><TouchableOpacity onPress={this.confirmBank.bind(this, '044')}>{access}</TouchableOpacity></Col>

                  <Col style={[styles.div, { backgroundColor: '#fff', marginLeft: 3 }]}><TouchableOpacity onPress={this.confirmBank.bind(this, '101')}>{providus}</TouchableOpacity></Col>
                </Row>
              </Grid>

              <Grid style={{ justifyContent: 'space-between' }}>
                <Row>
                  <Col style={[styles.div, { backgroundColor: '#ad1620', marginRight: 3 }
                  ]}><TouchableOpacity onPress={this.confirmBank.bind(this, '232')}>{sterling}</TouchableOpacity></Col>

                  <Col style={[styles.div, { backgroundColor: '#ed3237', marginLeft: 3 }
                  ]}><TouchableOpacity onPress={this.confirmBank.bind(this, '057')} >{zenithLogo}</TouchableOpacity></Col>
                </Row>
              </Grid>
            </View>

            {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.accountnumberErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid account number</Text> */}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>OR</Text>
            <View style={styles.input}>
              <Text style={{ color: '#999999', fontSize: 16 }}>Select a different bank</Text>
              <Picker
                mode="dropdown"
                placeholder="Select Bank"
                selectedValue={this.state.accountbank}
                enabled={(this.state.loading) ? false : true}
                style={{ width: '100%' }}
                onValueChange={(itemValue, itemIndex) => this.setState({ accountbank: itemValue }, this.confirmBank.bind(this, itemValue))}>
                {this.state.banks}
              </Picker>
            </View>
            {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.accountbankErr, fontWeight: 'bold', marginTop: 5 }}>Choose a bank</Text> */}
          </View>
        </View>
      </KeyboardAwareScrollView>;
    }

    return (

      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        {page}
      </KeyboardAvoidingView>
    )
  }
}