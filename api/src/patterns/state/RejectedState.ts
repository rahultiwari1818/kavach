import { ICrimeVerificationState } from "./ICrimeVerificationState.js";
import { CrimeVerificationContext } from "./CrimeVerificationContext.js";

export class RejectedState implements ICrimeVerificationState {
  private context: CrimeVerificationContext;

  constructor(context: CrimeVerificationContext) {
    this.context = context;
  }

  async verify(): Promise<void> {
    throw new Error("Cannot verify a rejected crime.");
  }

  async reject(): Promise<void> {
    throw new Error("Crime is already rejected.");
  }

  getStatus(): string {
    return "rejected";
  }
}
