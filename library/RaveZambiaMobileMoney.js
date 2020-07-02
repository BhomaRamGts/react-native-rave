import React from 'react'
import encryption from 'react-native-rave/library/encryption';
import Axios from 'axios';

export default class RaveUgandaMobileMoney {
<<<<<<< HEAD
  constructor({ publicKey, encryptionKey, currency = "ZMW", country = "NG", txRef = "txref-" + Date.now(), network = "MTN", amount, orderRef = "orderref_" + Date.now(), email, firstname, lastname, is_mobile_money_ug = true }) {
    var baseUrlMap = "https://api.ravepay.co/"
    this.baseUrl = baseUrlMap;

    this.getPublicKey = function () {
      return publicKey;
    }
    this.getEncryptionKey = function () {
      return encryptionKey;
    }
    this.getCountry = function () {
      return country;
    }
    this.getCurrency = function () {
      return currency;
    }
    this.getTransactionReference = function () {
      return txRef;
    }
    this.getAmount = function () {
      return amount;
    }

    this.getNetwork = function () {
      return network;
    }

    this.getOrderReference = function () {
      return orderRef;
    }
    this.getEmail = function () {
      return email;
    }
    this.getFirstname = function () {
      return firstname;
    }
    this.getLastname = function () {
      return lastname;
    }
    this.getUgandaMobileMoney = function () {
      return is_mobile_money_ug;
    }


    this.charge = function (payload) {
      //insert constant data
      payload.PBFPubKey = this.getPublicKey();
      payload.currency = this.getCurrency();
      payload.country = this.getCountry();
      payload.txRef = this.getTransactionReference();
      payload.amount = this.getAmount();
      payload.network = this.getNetwork();
      payload.orderRef = this.getOrderReference();
      payload.email = this.getEmail();
      payload.firstname = this.getFirstname();
      payload.lastname = this.getLastname();
      payload.is_mobile_money_ug = this.getUgandaMobileMoney();
      

      return new Promise((resolve, reject) => {
        var client = encryption({ payload, encryptionkey: this.getEncryptionKey() });

        Axios({
          url: this.baseUrl + 'flwv3-pug/getpaidx/api/charge',
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: {
            PBFPubKey: this.getPublicKey(),
            client,
            alg: "3DES-24"
          },
        })
          .then(function (response) {
            resolve(response.data);
          })
          .catch(function (error) {
            reject(error.response.data);
          });
      })
    }
  }

  initiatecharge(payload) {
    return new Promise((resolve, reject) => {
      this.charge(payload).then((response) => {
        resolve(response);
      }).catch((e) => {
        reject(e);
      })
    })
  }

  getCardFees({ amount, currency, card6 }) {
    return new Promise((resolve, reject) => {
      Axios({
        url: this.baseUrl + 'flwv3-pug/getpaidx/api/fee',
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          PBFPubKey: this.getPublicKey(),
          amount,
          currency,
          card6
        },
      })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    })
  }

  getAccountFees({ amount, currency }) {
    return new Promise((resolve, reject) => {
      Axios({
        url: this.baseUrl + 'flwv3-pug/getpaidx/api/fee',
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          PBFPubKey: this.getPublicKey(),
          amount,
          currency,
          ptype: 2
        },
      })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    })
  }

  // verifyTransaction(txref) {
  //   return new Promise((resolve, reject) => {
  //     Axios({
  //       url: this.baseUrl + 'flwv3-pug/getpaidx/api/v2/verify',
  //       method: 'post',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       data: {
  //         txref,
  //         SECKEY: this.getSecretKey()
  //       },
  //     })
  //       .then(function (response) {
  //         resolve(response.data);
  //       })
  //       .catch(function (error) {
  //         reject(error.response.data);
  //       });
  //   })
  // }


}
=======
                 constructor({
                   publicKey,
                   encryptionKey,
                   currency = "ZMW",
                   country = "NG",
                   txRef = "txref-" + Date.now(),
                   network = "MTN",
                   amount,
                   orderRef = "orderref_" + Date.now(),
                   email,
                   firstname,
                   lastname,
                   is_mobile_money_ug = true,
                   meta,
                   subaccounts
                 }) {
                   var baseUrlMap = "https://api.ravepay.co/";
                   this.baseUrl = baseUrlMap;

                   this.getPublicKey = function() {
                     return publicKey;
                   };
                   this.getEncryptionKey = function() {
                     return encryptionKey;
                   };
                   this.getCountry = function() {
                     return country;
                   };
                   this.getCurrency = function() {
                     return currency;
                   };
                   this.getTransactionReference = function() {
                     return txRef;
                   };
                   this.getAmount = function() {
                     return amount;
                   };

                   this.getNetwork = function() {
                     return network;
                   };

                   this.getOrderReference = function() {
                     return orderRef;
                   };
                   this.getEmail = function() {
                     return email;
                   };
                   this.getFirstname = function() {
                     return firstname;
                   };
                   this.getLastname = function() {
                     return lastname;
                   };
                   this.getUgandaMobileMoney = function() {
                     return is_mobile_money_ug;
                   };
                   this.getMetadata = function() {
                     return meta;
                   };
                   this.getSubaccounts = function() {
                     return subaccounts;
                   };

                   this.charge = function(payload) {
                     //insert constant data
                     payload.PBFPubKey = this.getPublicKey();
                     payload.currency = this.getCurrency();
                     payload.country = this.getCountry();
                     payload.txRef = this.getTransactionReference();
                     payload.amount = this.getAmount();
                     payload.network = this.getNetwork();
                     payload.orderRef = this.getOrderReference();
                     payload.email = this.getEmail();
                     payload.firstname = this.getFirstname();
                     payload.lastname = this.getLastname();
                     payload.is_mobile_money_ug = this.getUgandaMobileMoney();
                     payload.meta = this.getMetadata();
                     payload.subaccounts = this.getSubaccounts();

                     return new Promise((resolve, reject) => {
                       var client = encryption({
                         payload,
                         encryptionkey: this.getEncryptionKey()
                       });

                       Axios({
                         url: this.baseUrl + "flwv3-pug/getpaidx/api/charge",
                         method: "post",
                         headers: {
                           Accept: "application/json",
                           "Content-Type": "application/json"
                         },
                         data: {
                           PBFPubKey: this.getPublicKey(),
                           client,
                           alg: "3DES-24"
                         }
                       })
                         .then(function(response) {
                           resolve(response.data);
                         })
                         .catch(function(error) {
                           reject(error.response.data);
                         });
                     });
                   };
                 }

                 initiatecharge(payload) {
                   return new Promise((resolve, reject) => {
                     this.charge(payload)
                       .then(response => {
                         resolve(response);
                       })
                       .catch(e => {
                         reject(e);
                       });
                   });
                 }

                 getCardFees({ amount, currency, card6 }) {
                   return new Promise((resolve, reject) => {
                     Axios({
                       url: this.baseUrl + "flwv3-pug/getpaidx/api/fee",
                       method: "post",
                       headers: {
                         Accept: "application/json",
                         "Content-Type": "application/json"
                       },
                       data: {
                         PBFPubKey: this.getPublicKey(),
                         amount,
                         currency,
                         card6
                       }
                     })
                       .then(function(response) {
                         resolve(response.data);
                       })
                       .catch(function(error) {
                         reject(error.response.data);
                       });
                   });
                 }

                 getAccountFees({ amount, currency }) {
                   return new Promise((resolve, reject) => {
                     Axios({
                       url: this.baseUrl + "flwv3-pug/getpaidx/api/fee",
                       method: "post",
                       headers: {
                         Accept: "application/json",
                         "Content-Type": "application/json"
                       },
                       data: {
                         PBFPubKey: this.getPublicKey(),
                         amount,
                         currency,
                         ptype: 2
                       }
                     })
                       .then(function(response) {
                         resolve(response.data);
                       })
                       .catch(function(error) {
                         reject(error.response.data);
                       });
                   });
                 }

                 // verifyTransaction(txref) {
                 //   return new Promise((resolve, reject) => {
                 //     Axios({
                 //       url: this.baseUrl + 'flwv3-pug/getpaidx/api/v2/verify',
                 //       method: 'post',
                 //       headers: {
                 //         'Accept': 'application/json',
                 //         'Content-Type': 'application/json'
                 //       },
                 //       data: {
                 //         txref,
                 //         SECKEY: this.getSecretKey()
                 //       },
                 //     })
                 //       .then(function (response) {
                 //         resolve(response.data);
                 //       })
                 //       .catch(function (error) {
                 //         reject(error.response.data);
                 //       });
                 //   })
                 // }
               }
>>>>>>> 8b65eff417f36d8d361c42a5d01f53854d547804
