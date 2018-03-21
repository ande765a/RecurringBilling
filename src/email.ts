export interface IEmailSender {
  sendEmail(email: string, msg: string): Promise<any>;
}
