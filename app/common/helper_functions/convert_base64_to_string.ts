/**
 * @description Method to convert base64 encodings to normal string
 * @author Dauda Pona
 * @export
 * @param {(string | Buffer)} data
 * @return {*}  {string}
 */
export default function convertBase64ToString(base64Encoding: string): string {
  return Buffer.from(base64Encoding, 'base64').toString('utf8')
}
