import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import Header from 'react-native-rave/src/components/Header';

export default class MpesaHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
        this.switchToMpesa = this.switchToMpesa.bind(this);

    }

    switchToMpesa() {
        this.setState({
            show: !this.state.show
        })
        if (this.state.show) {
            this.props.page("home")

        } else {
            this.props.page("mpesa")
        }
    }

    render() {
        let icon;
        if (this.props.colorOne === '#F5A623') {
            icon = <Icon name='keyboard-arrow-down' color='#647482' />;

        } else {
            icon = <Icon name='keyboard-arrow-up' color='#647482' />;

        }

        const styles = StyleSheet.create({
            container: {
                width: '100%',
                bottom: this.props.bottomOne,
                position: 'absolute'
            },
            nav: {
                backgroundColor: '#fbeed8',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
                borderBottomWidth: 1,
                borderBottomColor: '#f2f2f2',
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
                color: this.props.colorOne
            }
        });

        return (
            <View >
                <View style={styles.container}>
                    <View style={styles.nav}>
                        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', }} onPress={this.switchToMpesa} >
                            <Text style={styles.text}>Pay with <Text style={{ fontWeight: 'bold' }}>Mpesa</Text></Text>
                            {icon}
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        )
    }
}

