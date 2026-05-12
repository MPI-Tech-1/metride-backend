export type Bank = {
  name: string

  bankCode: string
}
interface BankListInterface {
  listBanks(): Promise<Bank[]>
}

export default BankListInterface
