export function getControlDischarge(policyNumber) {
    let firstTemporaryResult = '';
    let secondAction = '';
    let actionsSum = 0;
    for (let i = policyNumber.length - 2; i >= 0; i -= 2) {
        firstTemporaryResult += policyNumber[i];
    }
    const firstAction = +firstTemporaryResult * 2;
    for (let i = policyNumber.length - 3; i >= 0; i -= 2) {
        secondAction += policyNumber[i];
    }
    const thirdAction = secondAction + firstAction;
    for (let i = 0, l = thirdAction.length; i < l; i++) {
        actionsSum += Number(thirdAction[i]);
    }
    const acc = Math.ceil(actionsSum / 10) * 10;
    return acc - actionsSum;
}
