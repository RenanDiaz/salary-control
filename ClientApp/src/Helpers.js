export function roundCurrency(number) {
  return round(number, 2);
}

export function round(number, decimalPositions) {
  const powerOf10 = Math.pow(10, decimalPositions);
  const integer = number * powerOf10;
  const split = integer.toFixed(2).split('.');
  let result = split[0] / 1;
  if (split.length > 1) {
    const decimals = split[1] / 1;
    if (decimals > 50) {
      ++result;
    }
  }
  return result / powerOf10;
}

export function calculateTotals(payment) {
  payment.totalHours = 0;
  payment.grossPay = 0;
  payment.totalDiscounts = 0;
  const hourlyRate = payment.basePayment / payment.regularHours;
  for (const hour of payment.hours) {
    const hours = hour.hours;
    payment.totalHours += hours;
    const grossPay = payment.grossPay + hours * (hourlyRate * hour.multiplier);
    payment.grossPay = roundCurrency(grossPay);
  }
  for (const discount of payment.discounts) {
    const totalDiscounts =
      payment.totalDiscounts +
      (discount.amount ? discount.amount : payment.grossPay * discount.rate);
    payment.totalDiscounts = roundCurrency(totalDiscounts);
  }
  payment.netPay = payment.grossPay - payment.totalDiscounts;
}

export function calculateTotalsSpecial(payment) {
  payment.totalDiscounts = 0;
  let sum = 0;
  for (const previousPayment of payment.previousPayments) {
    sum += previousPayment.amount;
  }
  let divider = 1;
  switch (payment.type) {
    case 'decimo':
      divider = 12;
      break;
    case 'vacations':
      divider = payment.months;
      break;
    case 'bonus':
      divider = 1;
      break;
    default:
      break;
  }
  payment.grossPay = roundCurrency(sum / divider);
  for (const discount of payment.discounts) {
    const newDiscount = roundCurrency(
      discount.amount ? discount.amount : payment.grossPay * discount.rate
    );
    payment.totalDiscounts = payment.totalDiscounts + newDiscount;
  }
  payment.netPay = payment.grossPay - payment.totalDiscounts;
}
