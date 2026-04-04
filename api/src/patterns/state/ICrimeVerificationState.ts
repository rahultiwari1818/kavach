export interface ICrimeVerificationState {
  verify(remark:string, verifiedBy?: string): Promise<void>;
  reject(remark:string, verifiedBy?: string): Promise<void>;
  getStatus(): string;
}