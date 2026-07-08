const LeaveRequest = require("../models/LeaveRequest");

/**
 * Checks if a user is currently on an approved leave, and whether an active emergency override exists.
 * @param {string} userId - The user's database ID.
 * @returns {Promise<{onLeave: boolean, overrideActive: boolean, leaveRequest?: any}>}
 */
async function checkUserLeaveStatus(userId) {
  const now = new Date();
  
  // Get local YYYY-MM-DD string
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;

  // Find all approved leave requests for this user
  const approvedLeaves = await LeaveRequest.find({
    requester: userId,
    status: "Approved",
  });

  // Find if any leave covers today in calendar dates
  const activeLeave = approvedLeaves.find((leave) => {
    const startStr = leave.startDate.toISOString().split("T")[0];
    const endStr = leave.endDate.toISOString().split("T")[0];
    return todayStr >= startStr && todayStr <= endStr;
  });

  if (!activeLeave) {
    return { onLeave: false, overrideActive: false };
  }

  // Check if there is an active, unexpired emergency override
  const override = activeLeave.emergencyOverride;
  const isOverrideActive =
    override &&
    override.isActive &&
    override.expiresAt &&
    override.expiresAt > now;

  return {
    onLeave: true,
    overrideActive: !!isOverrideActive,
    leaveRequest: activeLeave,
  };
}

module.exports = { checkUserLeaveStatus };
