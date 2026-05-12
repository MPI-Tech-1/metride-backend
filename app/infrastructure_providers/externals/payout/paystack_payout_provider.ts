import HttpClient from '#infrastructure_providers/internals/http_client'
import type CreatePayoutRecipientInputOptions from '#infrastructure_providers/type_checkings/payout/create_payout_recipient_input_options'
import type CreatePayoutRecipientOutputOptions from '#infrastructure_providers/type_checkings/payout/create_payout_recipient_output_options'
import type InitiatePayoutTransactionInputOptions from '#infrastructure_providers/type_checkings/payout/initiate_payout_transaction_input_options'
import type InitiatePayoutTransactionOutputOptions from '#infrastructure_providers/type_checkings/payout/initiate_payout_transaction_output_options'
import type PayoutInterface from '#infrastructure_providers/type_checkings/payout/payout_interface'
import payoutConfig from '#config/payout_config'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class PaystackPayoutProvider implements PayoutInterface {
  private secretKey: string = payoutConfig.paystack.secretKey
  private createTransferRecipientEndpoint: string =
    payoutConfig.paystack.createTransferRecipientEndpoint
  private initiatePayoutTransactionEndpoint: string = payoutConfig.paystack.initiateTransferEndpoint

  public async createPayoutRecipient(
    createPayoutRecipientInputOptions: CreatePayoutRecipientInputOptions
  ): Promise<CreatePayoutRecipientOutputOptions> {
    try {
      const { accountName, accountNumber, bankCode } = createPayoutRecipientInputOptions

      const httpClientResponse = await HttpClient.post({
        endpointUrl: this.createTransferRecipientEndpoint,
        dataPayload: {
          type: 'nuban',
          name: accountName,
          account_number: accountNumber,
          bank_code: bankCode,
          currency: 'NGN',
        },
        headerOptions: {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      })

      const results = httpClientResponse.apiResponse.data

      return {
        infrastructureResults: results,
        transferRecipientInformation: {
          accountName,
          accountNumber,
          bankCode,
          providerRecipientCode: results.recipient_code,
        },
      }
    } catch (createPayoutRecipientError) {
      await logApplicationError(createPayoutRecipientError)
      return {
        infrastructureResults: {},
        transferRecipientInformation: null,
      }
    }
  }
  public async initiatePayoutTransaction(
    initiatePayoutTransactionInputOptions: InitiatePayoutTransactionInputOptions
  ): Promise<InitiatePayoutTransactionOutputOptions> {
    try {
      const { amount, recipient, reference, reason } = initiatePayoutTransactionInputOptions

      const httpClientResponse = await HttpClient.post({
        endpointUrl: this.initiatePayoutTransactionEndpoint,
        dataPayload: {
          source: 'balance',
          amount,
          recipient,
          reference,
          reason,
        },
        headerOptions: {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      })

      const results = httpClientResponse.apiResponse.data
      return {
        infrastructureResults: results,
        initiatedPayoutTransactionInformation: {
          reference,
        },
      }
    } catch (initiatePayoutTransactionError) {
      await logApplicationError(initiatePayoutTransactionError)
      return {
        infrastructureResults: {},
        initiatedPayoutTransactionInformation: null,
      }
    }
  }
}
