export interface ICrimeVerificationState {
  verify(): Promise<void>;
  reject(): Promise<void>;
  getStatus(): string;
}