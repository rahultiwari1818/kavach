import { ICrimeVerificationState } from "./ICrimeVerificationState.js";
import { PendingState } from "./PendingState.js";
import { VerifiedState } from "./VerifiedState.js";
import { RejectedState } from "./RejectedState.js";
import CrimeReportModel from "../../models/crimeReport.model.js";

export class CrimeVerificationContext {
  private state: ICrimeVerificationState;
  private crimeId: string;

  constructor(crimeId: string, currentStatus: string) {
    this.crimeId = crimeId;
    this.state = this.getStateInstance(currentStatus);
  }

  private getStateInstance(status: string): ICrimeVerificationState {
    switch (status) {
      case "verified":
        return new VerifiedState(this);
      case "rejected":
        return new RejectedState(this);
      default:
        return new PendingState(this);
    }
  }

  setState(state: ICrimeVerificationState) {
    this.state = state;
  }

  getState(): ICrimeVerificationState {
    return this.state;
  }

  async updateStatusInDB(status: string, remarks?: string, verifiedBy?: string) {
    await CrimeReportModel.findByIdAndUpdate(
      this.crimeId,
      {
        verificationStatus: status,
        verificationRemarks: remarks || "",
        verifiedBy: verifiedBy || undefined,
      },
      { new: true }
    );
  }
}
