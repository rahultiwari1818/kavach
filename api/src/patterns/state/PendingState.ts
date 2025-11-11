import { ICrimeVerificationState } from "./ICrimeVerificationState.js";
import { CrimeVerificationContext } from "./CrimeVerificationContext.js";
import { VerifiedState } from "./VerifiedState.js";
import { RejectedState } from "./RejectedState.js";

export class PendingState implements ICrimeVerificationState {
  private context: CrimeVerificationContext;

  constructor(context: CrimeVerificationContext) {
    this.context = context;
  }

  async verify(): Promise<void> {
    await this.context.updateStatusInDB("verified");
    this.context.setState(new VerifiedState(this.context));
  }

  async reject(): Promise<void> {
    await this.context.updateStatusInDB("rejected");
    this.context.setState(new RejectedState(this.context));
  }

  getStatus(): string {
    return "pending";
  }
}
