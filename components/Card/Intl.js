import React, { Component } from 'react';
import { ScrollView, StyleSheet, Modal, Text, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class IntlModal extends Component {
  constructor(props) {
    super(props);
    this.state = { address: '', city: '', state: '', zipcode: '', country: '', addressErr: 'none', cityErr: 'none', stateErr: 'none', zipcodeErr: 'none', countryErr: 'none', cardErr: '#fff' };
    this.submit = this.submit.bind(this)
  }


  check() {
    this.setState({
      addressErr: 'none', cityErr: 'none', stateErr: 'none', zipcodeErr: 'none', countryErr: 'none'
    })
    if (this.state.address.length < 1 || this.state.city.length < 1 || this.state.state.length < 1 || this.state.zipcode.length < 1 || this.state.country.length < 1) {

      if (this.state.address.length < 1) {
        this.setState({
          addressErr: 'flex',
          cardErr: '#f5a623'
        })
      }

      if (this.state.city.length < 1) {
        this.setState({
          cityErr: 'flex',
          cardErr: '#f5a623'
        })
      }

      if (this.state.state.length < 1) {
        this.setState({
          stateErr: 'flex',
          cardErr: '#f5a623'
        })
      }

      if (this.state.zipcode.length < 1) {
        this.setState({
          zipcodeErr: 'flex',
          cardErr: '#f5a623'
        })
      }

      if (this.state.country.length < 1) {
        this.setState({
          countryErr: 'flex',
          cardErr: '#f5a623'
        })
      }
      return false
    } else {
      return true


    }
  }

  submit() {
    if (this.check()) {
      this.props.confirm({
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        zipcode: this.state.zipcode,
        country: this.state.country
      })
    }
  }


  render() {
    const styles = StyleSheet.create({
      formGroup: {
        marginTop: 20
      },
      label: {
        color: "#ACACAC"
      },
      input: {
        paddingVertical: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: this.state.cardErr,
        backgroundColor: '#ffffff',
        height: 76,

      }
    });
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.intlModal}
        onRequestClose={() => console.log()}>
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          <KeyboardAwareScrollView enableAutomaticScroll={true} extraHeight={180} style={{ backgroundColor: "#f2f2f2", width: "100%", paddingVertical: 60, paddingHorizontal: 30 }}>
          
            <Text style={{ textAlign: "center", fontWeight: 'bold', fontSize: 17 }}>Enter your billing details address</Text>


            <View style={styles.formGroup}>
              <View style={styles.input}>
              <Text style={{ color: '#999999', fontSize: 16, paddingHorizontal: 10 }}>ADDRESS</Text>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    placeholder="20 Saltlake Eldorado"
                    style={{ fontSize: 13, paddingHorizontal: 10, width: '100%' }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(address) => this.setState({ address })}
                    value={this.state.address}
                  />
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.addressErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid address</Text> */}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.input}>
              <Text style={{ color: '#999999', fontSize: 16, paddingHorizontal: 10 }}>CITY</Text>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    placeholder="Livingstone"
                    style={{ fontSize: 13, paddingHorizontal: 10, width: '100%' }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(city) => this.setState({ city })}
                    value={this.state.city}
                  />
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.cityErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid city</Text> */}
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.input}>
              <Text style={{ color: '#999999', fontSize: 16, paddingHorizontal: 10 }}>STATE</Text>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    placeholder="CA"
                    style={{ fontSize: 13, paddingHorizontal: 10, width: '100%' }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(state) => this.setState({ state })}
                    value={this.state.state}
                  />
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.stateErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid state</Text> */}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.input}>
              <Text style={{ color: '#999999', fontSize: 16, paddingHorizontal: 10 }}>ZIP CODE</Text>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    placeholder="928302"
                    style={{ fontSize: 13, paddingHorizontal: 10, width: '100%' }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(zipcode) => this.setState({ zipcode })}
                    value={this.state.zipcode}
                  />
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.zipcodeErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid zip code</Text> */}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.input}>
              <Text style={{ color: '#999999', fontSize: 16, paddingHorizontal: 10 }}>COUNTRY</Text>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    placeholder="US"
                    style={{ fontSize: 13, paddingHorizontal: 10, width: '100%' }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(country) => this.setState({ country })}
                    value={this.state.country}
                  />
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.countryErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid country</Text> */}
            </View>


            <TouchableOpacity onPress={this.submit} style={{ width: "100%", marginTop: 30 }}>
              <View style={{ backgroundColor: this.props.primarycolor, paddingVertical: 15, borderRadius: 5 }}>
                <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold" }}>ENTER</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </ScrollView>
      </Modal>
    );
  }
}

