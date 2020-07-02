import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.container}>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
    width: '100%'
  },
  textContainer: {
    flexDirection: 'row',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24
  },
  textBold: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold'
  }
});