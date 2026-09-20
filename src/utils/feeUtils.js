export const CLASS_1_TO_7 = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'
];

export const isClass1to7 = (className) => {
  return CLASS_1_TO_7.includes(className);
};

/**
 * Calculates how many billing months have elapsed since a student's joining date.
 * E.g. Joined Jan 15 -> Jan 15 to Feb 14 = 1 month.
 *      Feb 15 -> 2 months.
 *      Mar 15 -> 3 months.
 */
export const getStudentElapsedMonths = (joiningDate, referenceDate = new Date()) => {
  if (!joiningDate) return 1;
  const start = new Date(joiningDate);
  const now = new Date(referenceDate);
  if (isNaN(start.getTime())) return 1;
  if (now < start) return 1; // Minimum 1 month for initial admission cycle

  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const triggerDay = Math.min(start.getDate(), daysInCurrentMonth);

  if (now.getDate() >= triggerDay) {
    months += 1;
  }
  return Math.max(1, months);
};

/**
 * Computes dynamic fee statistics for a student.
 * For Class 1 to 7: Monthly dynamic fee (monthlyFee * elapsedMonths).
 * For other classes: Fixed full-course fee.
 */
export const getStudentComputedFee = (student, referenceDate = new Date()) => {
  if (!student) {
    return {
      monthlyFee: 0,
      elapsedMonths: 1,
      totalFees: 0,
      netFee: 0,
      paidFees: 0,
      discount: 0,
      pendingFee: 0,
      isMonthly: false
    };
  }

  const isMonthly = isClass1to7(student.class);
  const discount = Number(student.discount) || 0;
  const paidFees = Number(student.paidFees) || 0;

  if (isMonthly) {
    const monthlyRate = Number(student.totalFees) || 0;
    const elapsedMonths = getStudentElapsedMonths(student.joiningDate || student.createdAt, referenceDate);
    const effectiveTotal = monthlyRate * elapsedMonths;
    const netFee = Math.max(0, effectiveTotal - discount);
    const pendingFee = Math.max(0, netFee - paidFees);

    return {
      monthlyFee: monthlyRate,
      elapsedMonths,
      totalFees: effectiveTotal,
      netFee,
      paidFees,
      discount,
      pendingFee,
      isMonthly: true
    };
  } else {
    const totalFees = Number(student.totalFees) || 0;
    const netFee = Math.max(0, totalFees - discount);
    const pendingFee = Math.max(0, netFee - paidFees);

    return {
      monthlyFee: 0,
      elapsedMonths: 1,
      totalFees,
      netFee,
      paidFees,
      discount,
      pendingFee,
      isMonthly: false
    };
  }
};
