export interface ICrimeVerificationState {
  verify(remark:string): Promise<void>;
  reject(remark:string): Promise<void>;
  getStatus(): string;
}