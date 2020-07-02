import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Picker, DatePicker } from "native-base";
//Scrollable view Library
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WebView } from 'react-native-webview';


export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {phonenumber: (this.props.phone == null) ? '' : this.props.phone, status: "", chargeResponseMessage: '', phonenumberErr: 'none', flwRef: "", inputErr: '#fff', loading: false, phone: (this.props.phone == null) ? '' : this.props.phone , url:"", webState:false,};

    this.pay = this.pay.bind(this);
    this.check = this.check.bind(this);
    this.mounted = false;
  }


  // Performs a check on the state of the network, phone, voucher fields, if they are filled as required
  check() {
    this.setState({
      phonenumberErr: 'none', inputErr: '#fff'
    })
    if (this.state.phonenumber.length < 3) {
      this.setState({
        phonenumberErr: 'flex',
        inputErr: this.props.primarycolor
      })
    }else if (Number(this.props.amount) < 10 ) {
        Alert.alert(
          'Alert',
          'Amount can\'t be less than 1UGX',
          [
            {
              text: 'Cancel', onPress: () => this.setState({
                loading: false
              }) },
          ],
          { cancelable: false }
        )
      } else {
        return true
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
      "phonenumber": this.state.phonenumber,
      "payment_type": "mobilemoneyuganda"
    }

    // this initiates the charge request
    this.props.rave.initiatecharge(payload).then((res) => {
      // Check for charge status
      this.setState({
        url:res.data.link,
        webState:true,
        loading:false
      })
    }).catch((e) => {
      this.setState({
        loading: false
      })
      this.props.onFailure(e);
    })
  }


  // The Pay button handler
  pay() {
    if (this.check()) {
      this.setState({
        loading: true
      })

      this.props.rave.getAccountFees({ amount: this.props.amount, currency: this.props.currency }).then((resp) => {
        // Alert to display the charged amount in the UGX
        Alert.alert(
          '',
          'You will be charged a total of ' + this.props.currency + resp.data.charge_amount + ' . Do you want to continue?',
          [
            {
              text: 'Cancel', onPress: () => this.setState({
                loading: false
              }) },
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


// This is the render function to render the payment interface
  render() {

    const styles = StyleSheet.create({
      container: {
        paddingHorizontal: 25,
        paddingTop: 120,
        height: '100%',
        backgroundColor: '#f2f2f2' 
      },
      label: {
        color: "#12122c",
        fontWeight: '400',
        textAlign: 'center',
        paddingBottom: 20
      },
      input: {
        borderColor: this.state.inputErr,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 10,
        elevation: 2
      },
      formGroup: {
        marginBottom: 20,
      }
    });

    let btnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>PAY {this.props.currency} {this.props.amount}</Text>;
    
  
    if (this.state.loading) {

      btnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />

    }
    // this returns the Uganda Mobile Money payment form
    let web = <View></View>
    let page = <View></View>

    if(this.state.webState){
        web = (

          <View>
              
          <ScrollView
          contentContainerStyle={{ paddingBottom: 50}}
          >
    
          <WebView
            source={{ uri: this.state.url}}
    
            useWebKit={true}
            style={{ padding: "50%" }}
           
            javaScriptEnabled={true}
            contentContainerStyle={{ paddingBottom: 60}}
            scrollEnabled={true}
          />
          </ScrollView>
          </View>

        )

    }else{

      page = (

        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
          <View style={{ flex: 1 }}>
            <View style={styles.formGroup}>
            <Text style={[styles.label, { fontSize: 20, marginVertical: 10 }]}>Enter your phone number</Text>
              <View style={styles.input}>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    autoCorrect={false}
                    editable={(this.state.loading) ? false : true}
                    keyboardType="phone-pad"
                    style={{ fontSize: 20, paddingHorizontal: 10, minWidth: "100%" }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(phonenumber) => this.setState({phonenumber})}
                    value={this.state.phonenumber}
                  />
                </View>
              </View>
              <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.phonenumberErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid phone number</Text>
            </View>
          </View>

          <TouchableOpacity onPress={this.pay} style={{ width: "100%", marginTop: 25 }} disabled={(this.state.loading == false) ? false : true}>
            <View style={{ backgroundColor: this.props.primarycolor, paddingVertical: 15, borderRadius: 5, opacity: (this.state.loading == false) ? 1 : 0.6 }}>
              {btnText}
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>

      )


    }




    return (

      <View>
         {page}
         {web}
      </View>
      
    )
  }
}


