import { ICrimeVerificationState } from "./ICrimeVerificationState.js";
import { CrimeVerificationContext } from "./CrimeVerificationContext.js";
import { VerifiedState } from "./VerifiedState.js";
import { RejectedState } from "./RejectedState.js";

export class PendingState implements ICrimeVerificationState {
  private context: CrimeVerificationContext;

  constructor(context: CrimeVerificationContext) {
    this.context = context;
  }

  async verify(remark:string): Promise<void> {
    await this.context.updateStatusInDB("verified",remark);
    this.context.setState(new VerifiedState(this.context));
  }

  async reject(remark:string): Promise<void> {
    await this.context.updateStatusInDB("rejected",remark);
    this.context.setState(new RejectedState(this.context));
  }

  getStatus(): string {
    return "pending";
  }
}
