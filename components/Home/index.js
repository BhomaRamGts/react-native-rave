import React, { Component } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base'

//Scrollable view Library
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class index extends Component {
    constructor(props) {
        super(props);

        this.closeRave = this.closeRave.bind(this);
    }

    closeRave() {
        this.props.onClose();
    }

    render() {

        const styles = StyleSheet.create({
            container: {
                paddingHorizontal: 25,
                paddingBottom: 20,
                height: '100%'
            },
            label: {
                color: "#ACACAC"
            },
            text: {
                fontSize: 42,
                fontWeight: '700',
                paddingTop: 50,
                color: '#12122c'
            }
        });
        let lockIcon, closeIcon;
        lockIcon = <Icon name="md-lock" style={{ color: "#d1d1d1", marginTop: 10, marginRight: 0 }} />;
        
        closeIcon = <Icon name='md-close-circle' style={{ color: '#d1d1d1', marginTop: 0, marginRight: 0 }} />;
        return (
            <KeyboardAvoidingView behavior="padding" enabled>
                <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                    <View style={{ flex: 1 }}>
                        <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: "space-between" }}><Text style={{ fontSize: 13, fontWeight: '400' }}>{lockIcon} SECURED BY FLUTTERWAVE</Text>
                            <TouchableOpacity onPress={this.closeRave}>{closeIcon}</TouchableOpacity>
                        </View>
                        <Text style={styles.text}>How would you</Text>
                        <Text style={{ fontSize: 42, fontWeight: '700', paddingTop: 10, color: '#12122c' }}>like to pay? </Text>
                        <View style={{ borderBottomWidth: 4, marginTop: 30, marginRight: '50%', borderBottomColor: '#F5A623' }}></View>
                    </View>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        )
    }
}