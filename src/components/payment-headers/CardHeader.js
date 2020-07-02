import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements'
// import Header from 'react-native-rave/src/components/Header';

export default class CardHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    this.switchToCard = this.switchToCard.bind(this);

  }

  switchToCard() {
    this.setState({
      show: !this.state.show
    }, function () {
      if (this.state.show) {
        this.props.page("card")

      } else {
        this.props.page("home")
      }
    })
  }

  render() {
    if (this.props.colorTwo === '#F5A623') {
      icon = <Icon name='keyboard-arrow-down' color='#647482' />;

    } else {
      icon = <Icon name='keyboard-arrow-up' color='#647482' />;

    }

    const styles = StyleSheet.create({
      container: {
        width: '100%',
        bottom: this.props.bottomTwo,
        top: this.props.topTwo,
        display: this.props.displayTwo,
        position: 'absolute'
      },
      nav: {
        backgroundColor: '#fbeed8',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 87,
        width: '100%'
      },
      text: {
        fontSize: 16,
        textAlign: 'center',
        color: this.props.colorTwo
      }
    });

    return (
      <View >
        <View style={styles.container}>
          <View style={styles.nav}>
            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }} onPress={this.switchToCard}>
              <Text style={styles.text}>Pay with <Text style={{ fontWeight: 'bold' }}>Debit Card</Text></Text>
              {icon}
            </TouchableOpacity>

          </View>
        </View>

      </View>
    )
  }
}