import { ICrimeVerificationState } from "./ICrimeVerificationState.js";
import { CrimeVerificationContext } from "./CrimeVerificationContext.js";

export class VerifiedState implements ICrimeVerificationState {
  private context: CrimeVerificationContext;

  constructor(context: CrimeVerificationContext) {
    this.context = context;
  }

  async verify(): Promise<void> {
    throw new Error("Crime is already verified.");
  }

  async reject(): Promise<void> {
    throw new Error("Cannot reject a verified crime.");
  }

  getStatus(): string {
    return "verified";
  }
}
