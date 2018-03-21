const test = require("tape");
const { calculateNextDueDate } = require("../lib");

const testPlan = {
  customer: {
    id: "123"
  },
  plan: {
    price: {
      amount: 1000,
      currency: "DKK"
    },
    frequency: "monthly",
    permissions: ["test"],
    interval: 1
  },
  start_date: new Date(2017, 0, 31),
  expiration_date: new Date(2018, 5, 20),
  period: 0,
  cancelled: false,
  transactions: []
};

test("calculating due date correctly", t => {
  const testPlan1 = {
    ...testPlan,
    start_date: new Date(2017, 0, 1)
  };

  t.equal(
    calculateNextDueDate(testPlan1).getTime(),
    new Date(2017, 1, 1).getTime(),
    "When frequency"
  );

  const testPlan2 = {
    ...testPlan,
    start_date: new Date(2017, 0, 31)
  };

  t.equal(
    calculateNextDueDate(testPlan2).getTime(),
    new Date(2017, 2, 3).getTime(),
    "Dates should be equal"
  );

  t.end();
});
