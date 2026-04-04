import { ICrimeVerificationState } from "./ICrimeVerificationState.js";
import { CrimeVerificationContext } from "./CrimeVerificationContext.js";

export class VerifiedState implements ICrimeVerificationState {
  private context: CrimeVerificationContext;

  constructor(context: CrimeVerificationContext) {
    this.context = context;
  }

  async verify(remark: string, verifiedBy?: string): Promise<void> {
    throw new Error("Crime is already verified.");
  }

  async reject(remark: string, verifiedBy?: string): Promise<void> {
    throw new Error("Cannot reject a verified crime.");
  }

  getStatus(): string {
    return "verified";
  }
}
