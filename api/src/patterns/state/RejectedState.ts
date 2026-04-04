import { ICrimeVerificationState } from "./ICrimeVerificationState.js";
import { CrimeVerificationContext } from "./CrimeVerificationContext.js";

export class RejectedState implements ICrimeVerificationState {
  private context: CrimeVerificationContext;

  constructor(context: CrimeVerificationContext) {
    this.context = context;
  }

  async verify(remark: string, verifiedBy?: string): Promise<void> {
    throw new Error("Cannot verify a rejected crime.");
  }

  async reject(remark: string, verifiedBy?: string): Promise<void> {
    throw new Error("Crime is already rejected.");
  }

  getStatus(): string {
    return "rejected";
  }
}
