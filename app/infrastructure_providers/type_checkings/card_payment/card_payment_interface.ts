import type InitiateTransactionInputOptions from '#infrastructure_providers/type_checkings/card_payment/initiate_transaction_input_options'
import type InitiateTransactionOutputOptions from '#infrastructure_providers/type_checkings/card_payment/initiate_transaction_output_options'
import type VerifyTransactionOutputOptions from '#infrastructure_providers/type_checkings/card_payment/verify_transaction_output_options'

interface CardPaymentInterface {
  initiateTransaction(
    initiateTransactionInputOptions: InitiateTransactionInputOptions
  ): Promise<InitiateTransactionOutputOptions>
  verifyTransaction(transactionReference: string): Promise<VerifyTransactionOutputOptions>
}

export default CardPaymentInterface
