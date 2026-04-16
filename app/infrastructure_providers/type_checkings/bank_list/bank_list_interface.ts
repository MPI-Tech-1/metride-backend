export type Bank = {
  name: string
}
interface BankListInterface {
  listBanks(): Promise<Bank[]>
}

export default BankListInterface
