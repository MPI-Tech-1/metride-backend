import cardPaymentConfig from '#config/card_payment_config'
import HttpClient from '#infrastructure_providers/internals/http_client'
import type CardPaymentInterface from '#infrastructure_providers/type_checkings/card_payment/card_payment_interface'
import type InitiateTransactionInputOptions from '#infrastructure_providers/type_checkings/card_payment/initiate_transaction_input_options'
import type InitiateTransactionOutputOptions from '#infrastructure_providers/type_checkings/card_payment/initiate_transaction_output_options'
import type VerifyTransactionOutputOptions from '#infrastructure_providers/type_checkings/card_payment/verify_transaction_output_options'
import { DateTime } from 'luxon'

export default class PaystackPaymentProvider implements CardPaymentInterface {
  private secretKey: string = cardPaymentConfig.paystack.secretKey
  private initiateTransactionEndpoint: string =
    cardPaymentConfig.paystack.initiateTransactionEndpoint
  private verifyTransactionEndpoint: string = cardPaymentConfig.paystack.verifyTransactionEndpoint

  public async initiateTransaction(
    initiateTransactionInputOptions: InitiateTransactionInputOptions
  ): Promise<InitiateTransactionOutputOptions> {
    try {
      const {
        emailAddress,
        amount,
        metadata,
        paymentChannel,
        cancelTransactionRedirectUrl,
        redirectTransactionRedirectUrl,
      } = initiateTransactionInputOptions

      const httpClientResponse = await HttpClient.post({
        endpointUrl: this.initiateTransactionEndpoint,
        dataPayload: {
          amount,
          email: emailAddress,
          channels: paymentChannel,
          callback_url: redirectTransactionRedirectUrl,

          metadata: {
            ...metadata,
            cancel_action: cancelTransactionRedirectUrl,
          },
        },
        headerOptions: {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      })

      const transactionStatus = httpClientResponse.apiResponse.data.status

      if (transactionStatus === 'abandoned') {
        return {
          transactionStatus: 'pending',
          infrastructureResults: httpClientResponse.apiResponse.data,
          initiateTransactionInformation: {
            checkoutUrl: '',
            transactionReference: httpClientResponse.apiResponse.data.reference,
            amount: httpClientResponse.apiResponse.data.amount,
            transactionDate:
              DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date) ||
              DateTime.now(),
          },
        }
      }

      if (transactionStatus === 'failed') {
        return {
          transactionStatus: 'failed',
          infrastructureResults: httpClientResponse.apiResponse.data,
          initiateTransactionInformation: {
            checkoutUrl: '',
            transactionReference: httpClientResponse.apiResponse.data.reference,
            amount: httpClientResponse.apiResponse.data.amount,
            transactionDate:
              DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date) ||
              DateTime.now(),
          },
        }
      }

      return {
        transactionStatus: 'success',
        infrastructureResults: httpClientResponse.apiResponse.data,
        initiateTransactionInformation: {
          checkoutUrl: httpClientResponse.apiResponse.data.authorization_url,
          transactionReference: httpClientResponse.apiResponse.data.reference,
          amount: httpClientResponse.apiResponse.data.amount,
          transactionDate: DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date),
        },
      }
    } catch (initiateTransactionError) {
      console.log('PaystackPaymentProvider.initiateTransactionError -> ', initiateTransactionError)
      return {
        transactionStatus: 'failed',
        infrastructureResults: null,
        initiateTransactionInformation: null,
      }
    }
  }
  public async verifyTransaction(
    transactionReference: string
  ): Promise<VerifyTransactionOutputOptions> {
    try {
      const httpClientResponse = await HttpClient.get({
        endpointUrl: `${this.verifyTransactionEndpoint}/${transactionReference}`,
        headerOptions: {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      })

      const transactionStatus = httpClientResponse.apiResponse.data.status

      if (transactionStatus === 'abandoned') {
        return {
          transactionStatus: 'pending',
          infrastructureResults: httpClientResponse.apiResponse.data,
          transactionVerificationInformation: {
            transactionReference: httpClientResponse.apiResponse.data.reference,
            amount: httpClientResponse.apiResponse.data.amount,
            transactionDate:
              DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date) ||
              DateTime.now(),
          },
        }
      }

      if (transactionStatus === 'failed') {
        return {
          transactionStatus: 'failed',
          infrastructureResults: httpClientResponse.apiResponse.data,
          transactionVerificationInformation: {
            transactionReference: httpClientResponse.apiResponse.data.reference,
            amount: httpClientResponse.apiResponse.data.amount,
            transactionDate:
              DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date) ||
              DateTime.now(),
          },
        }
      }

      return {
        transactionStatus: 'success',
        infrastructureResults: httpClientResponse.apiResponse.data,
        transactionVerificationInformation: {
          transactionReference: httpClientResponse.apiResponse.data.reference,
          amount: httpClientResponse.apiResponse.data.amount,
          transactionDate: DateTime.fromISO(httpClientResponse.apiResponse.data.transaction_date),
        },
      }
    } catch (verifyTransactionError) {
      console.log('PaystackPaymentProvider.verifyTransactionError -> ', verifyTransactionError)
      return {
        transactionStatus: 'failed',
        infrastructureResults: null,
        transactionVerificationInformation: null,
      }
    }
  }
}
