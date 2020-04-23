export default interface NewPasswordModel {
  email?: string
  token?: string
  oldPassword?: string
  newPassword: string
  newPasswordAgain: string
}
