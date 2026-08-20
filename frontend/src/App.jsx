import React from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  WalletCards,
  Target,
  BarChart3,
  UserRound,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Search,
  Sparkles,
  CircleDollarSign,
  Trash2,
  Edit3,
  Save,
  TrendingUp,
  TrendingDown,
  PiggyBank
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

const API_URL ="https://finwell-okf7.onrender.com/api";

const trend = [
  { month: "Mar", income: 42000, expense: 25000 },
  { month: "Apr", income: 45000, expense: 27500 },
  { month: "May", income: 45000, expense: 29000 },
  { month: "Jun", income: 47000, expense: 26500 },
  { month: "Jul", income: 48000, expense: 27300 },
  { month: "Aug", income: 50000, expense: 26100 }
];

const COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#8b5cf6"
];

function App() {
  const [active, setActive] = React.useState("Dashboard");
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showTransactionForm, setShowTransactionForm] =
    React.useState(false);
  const [searchTerm, setSearchTerm] =
  React.useState("");

const [showNotifications, setShowNotifications] =
  React.useState(false);  

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/transactions`
      );

      const data = await response.json();

      if (response.ok) {
        setTransactions(data);
      }
    } catch (error) {
      console.error(
        "Error fetching transactions:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (formData) => {
    try {
      const response = await fetch(
        `${API_URL}/transactions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            amount: Number(formData.amount),
            type: formData.type
          })
        }
      );

      const savedTransaction =
        await response.json();

      if (!response.ok) {
        alert(
          savedTransaction.message ||
          "Failed to add transaction"
        );

        return false;
      }

      setTransactions((previous) => [
        savedTransaction,
        ...previous
      ]);

      return true;

    } catch (error) {
      console.error(
        "Error adding transaction:",
        error
      );

      alert(
        "Backend connection failed."
      );

      return false;
    }
  };

  const handleDeleteTransaction =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this transaction?"
        );

      if (!confirmDelete) return;

      try {
        const response = await fetch(
          `${API_URL}/transactions/${id}`,
          {
            method: "DELETE"
          }
        );

        if (!response.ok) {
          alert(
            "Failed to delete transaction"
          );

          return;
        }

        setTransactions((previous) =>
          previous.filter(
            (transaction) =>
              transaction._id !== id &&
              transaction.id !== id
          )
        );

      } catch (error) {
        console.error(
          "Error deleting transaction:",
          error
        );
      }
    };

  const renderPage = () => {

    if (active === "Dashboard") {
      return (
        <Dashboard
          transactions={transactions}
          onAdd={() =>
            setShowTransactionForm(true)
          }
        />
      );
    }

    if (active === "Transactions") {
      return (
        <TransactionsPage
          transactions={transactions}
          onDelete={handleDeleteTransaction}
          onAdd={() =>
            setShowTransactionForm(true)
          }
        />
      );
    }

    if (active === "Budget") {
      return (
        <BudgetPage
          transactions={transactions}
        />
      );
    }

    if (active === "Goals") {
      return <GoalsPage />;
    }

    if (active === "Insights") {
      return (
        <InsightsPage
          transactions={transactions}
        />
      );
    }

    if (active === "Profile") {
      return <ProfilePage />;
    }

    return null;
  };

  return (
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand">
          <CircleDollarSign size={30} />
          <span>FinWell</span>
        </div>

        <nav>
          {[
            ["Dashboard", LayoutDashboard],
            ["Transactions", ArrowLeftRight],
            ["Budget", WalletCards],
            ["Goals", Target],
            ["Insights", BarChart3],
            ["Profile", UserRound]
          ].map(([label, Icon]) => (

            <button
              className={
                active === label
                  ? "nav-item active"
                  : "nav-item"
              }
              key={label}
              onClick={() =>
                setActive(label)
              }
            >
              <Icon size={19} />

              <span>
                {label}
              </span>

            </button>

          ))}
        </nav>

        <div className="sidebar-tip">

          <Sparkles size={20} />

          <b>
            Financial wellness
          </b>

          <span>
            Build better money habits one
            month at a time.
          </span>

        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div>

            <div className="eyebrow">
              PERSONAL FINANCE
            </div>

            <h1>
              {active}
            </h1>

          </div>

         <div className="top-actions">

  <div className="search">
    <Search size={17} />

   <input
  type="text"
  placeholder="Search transactions..."
  value={searchTerm}
  onChange={(event) =>
    setSearchTerm(event.target.value)
  }
/> 
  </div>

  <div className="notification-wrapper">

    <button
  className="icon-btn"
  onClick={() => {
    setShowNotifications(
      !showNotifications
    );
  }}
>
  <Bell size={19} />
</button>

    {showNotifications && (
      <><div className="notification-popup">

                  <h3>Notifications</h3>

                  <p>
                    💰 Your transactions are up to date.
                  </p>

                  <p>
                    🎯 Keep saving towards your goals!
                  </p>

                  <p>
                    📊 Check your latest financial insights.
                  </p>

                </div><div className="notification-panel">

                    <h4>Notifications</h4>

                    <div className="notification-item">
                      <Sparkles size={17} />

                      <div>
                        <b>Welcome to FinWell!</b>
                        <span>
                          Start tracking your finances.
                        </span>
                      </div>
                    </div>

                    <div className="notification-item">
                      <WalletCards size={17} />

                      <div>
                        <b>Budget Reminder</b>
                        <span>
                          Keep an eye on your monthly expenses.
                        </span>
                      </div>
                    </div>

                  </div></>

    )}

  </div>

  <button
    className="avatar"
    onClick={() =>
      setActive("Profile")
    }
    title="Open Profile"
  >
    B
  </button>

</div> 

        </header>

        {loading ? (
          <div className="loading">
            Loading FinWell...
          </div>
        ) : (
          renderPage()
        )}

      </main>

      {showTransactionForm && (

        <TransactionModal
          onClose={() =>
            setShowTransactionForm(false)
          }
          onAdd={handleAddTransaction}
        />

      )}

    </div>
  );
}

/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({
  transactions,
  onAdd
}) {

  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    );

  const expenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    );

  const balance =
    income - expenses;

  const spending = getSpendingData(
    transactions
  );

  return (
    <>

      <section className="hero-row">

        <div>

          <p className="muted">
            Good morning, Bharat 👋
          </p>

          <h2>
            Your money, made simple.
          </h2>

          <p className="muted">
            Track your income and expenses
            in one place.
          </p>

        </div>

        <button
          className="primary"
          onClick={onAdd}
        >

          <Plus size={18} />

          Add transaction

        </button>

      </section>

      <section className="cards">

        <Stat
          title="Total Balance"
          value={`₹${balance.toLocaleString("en-IN")}`}
          change="Live"
          icon={<CircleDollarSign />}
        />

        <Stat
          title="Income"
          value={`₹${income.toLocaleString("en-IN")}`}
          change="Total"
          icon={<ArrowUpRight />}
        />

        <Stat
          title="Expenses"
          value={`₹${expenses.toLocaleString("en-IN")}`}
          change="Total"
          icon={<ArrowDownRight />}
        />

        <Stat
          title="Health Score"
          value={
            expenses > income
              ? "45 / 100"
              : "78 / 100"
          }
          change="Good"
          icon={<Sparkles />}
        />

      </section>

      <section className="grid-2">

        <div className="panel">

          <div className="panel-head">

            <div>

              <h3>
                Cash flow
              </h3>

              <span className="muted">
                Income vs expenses
              </span>

            </div>

            <span className="pill">
              Last 6 months
            </span>

          </div>

          <div className="chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart data={trend}>

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.12}
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.08}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="panel">

          <div className="panel-head">

            <div>

              <h3>
                Spending breakdown
              </h3>

              <span className="muted">
                Current expenses
              </span>

            </div>

          </div>

          <div className="pie-wrap">

            <div className="pie">

              {spending.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={spending}
                      dataKey="value"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={3}
                    >

                      {spending.map(
                        (item, index) => (

                          <Cell
                            key={item.name}
                            fill={
                              COLORS[
                                index %
                                COLORS.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              ) : (

                <div className="no-data">
                  No expense data
                </div>

              )}

            </div>

            <div className="legend">

              {spending.map(
                (item, index) => (

                  <div
                    key={item.name}
                  >

                    <span
                      className="dot"
                      style={{
                        background:
                          COLORS[
                            index %
                            COLORS.length
                          ]
                      }}
                    />

                    <span>
                      {item.name}
                    </span>

                    <b>
                      ₹
                      {item.value.toLocaleString(
                        "en-IN"
                      )}
                    </b>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </section>

      <section className="grid-2 lower">

        <div className="panel">

          <div className="panel-head">

            <div>

              <h3>
                Recent transactions
              </h3>

              <span className="muted">
                Latest activity
              </span>

            </div>

          </div>

          <div className="transactions">

            {transactions
              .slice(0, 6)
              .map(
                (transaction) => (

                  <TransactionRow
                    key={
                      transaction._id
                    }
                    transaction={
                      transaction
                    }
                  />

                )
              )}

            {transactions.length === 0 && (

              <p className="muted">
                No transactions yet.
              </p>

            )}

          </div>

        </div>

        <div className="panel goal">

          <div className="panel-head">

            <div>

              <h3>
                Emergency fund
              </h3>

              <span className="muted">
                Savings goal
              </span>

            </div>

            <Target />

          </div>

          <div className="goal-amount">

            ₹75,000

            <span>
              / ₹1,20,000
            </span>

          </div>

          <div className="progress">
            <i
              style={{
                width: "62%"
              }}
            />
          </div>

          <div className="goal-meta">

            <span>
              62% completed
            </span>

            <span>
              ₹45,000 left
            </span>

          </div>

        </div>

      </section>

    </>
  );
}

/* =====================================================
   TRANSACTIONS
===================================================== */

function TransactionsPage({
  transactions,
  onDelete,
  onAdd
}) {

  const [searchTerm, setSearchTerm] =
    React.useState("");

  const [filter, setFilter] =
    React.useState("all");

  const filteredTransactions =
    transactions.filter(
      (transaction) => {

        const matchesSearch =
          transaction.name
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          transaction.category
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesFilter =
          filter === "all" ||
          transaction.type === filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  return (
    <div className="transactions-page">

      <div className="page-controls">

        <div className="transaction-search">

          <Search size={18} />

          <input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value
            )
          }
        >

          <option value="all">
            All Transactions
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expenses
          </option>

        </select>

        <button
          className="primary"
          onClick={onAdd}
        >

          <Plus size={17} />

          Add

        </button>

      </div>

      <div className="panel transactions-list">

        <div className="panel-head">

          <div>

            <h3>
              All Transactions
            </h3>

            <span className="muted">

              {filteredTransactions.length}
              {" "}transaction(s)

            </span>

          </div>

        </div>

        <div className="transactions">

          {filteredTransactions.map(
            (transaction) => {

              const id =
                transaction._id ||
                transaction.id;

              return (

                <div
                  className="transaction"
                  key={id}
                >

                  <div className="tx-icon">

                    {transaction.type ===
                    "income" ? (
                      <ArrowUpRight />
                    ) : (
                      <ArrowDownRight />
                    )}

                  </div>

                  <div>

                    <b>
                      {transaction.name}
                    </b>

                    <small>
                      {transaction.category}
                    </small>

                  </div>

                  <strong
                    className={
                      transaction.type
                    }
                  >

                    {transaction.type ===
                    "income"
                      ? "+"
                      : "-"}

                    ₹
                    {Number(
                      transaction.amount
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      onDelete(id)
                    }
                  >

                    <Trash2 size={17} />

                  </button>

                </div>

              );
            }
          )}

          {filteredTransactions.length ===
            0 && (

            <p className="muted">
              No transactions found.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   BUDGET
===================================================== */

function BudgetPage({
  transactions
}) {

  const [budget, setBudget] =
    React.useState(
      Number(
        localStorage.getItem(
          "finwell-budget"
        )
      ) || 50000
    );

  const [editing, setEditing] =
    React.useState(false);

  const expenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    );

  const remaining =
    budget - expenses;

  const percentage =
    budget > 0
      ? Math.min(
          (expenses / budget) * 100,
          100
        )
      : 0;

  const saveBudget = () => {

    localStorage.setItem(
      "finwell-budget",
      budget
    );

    setEditing(false);
  };

  return (
    <div>

      <section className="hero-row">

        <div>

          <p className="muted">
            Manage your monthly spending
          </p>

          <h2>
            Monthly Budget
          </h2>

        </div>

        <button
          className="primary"
          onClick={() =>
            editing
              ? saveBudget()
              : setEditing(true)
          }
        >

          {editing ? (
            <Save size={18} />
          ) : (
            <Edit3 size={18} />
          )}

          {editing
            ? "Save Budget"
            : "Edit Budget"}

        </button>

      </section>

      <section className="cards">

        <Stat
          title="Monthly Budget"
          value={`₹${Number(
            budget
          ).toLocaleString("en-IN")}`}
          change="Limit"
          icon={<WalletCards />}
        />

        <Stat
          title="Spent"
          value={`₹${expenses.toLocaleString(
            "en-IN"
          )}`}
          change="Used"
          icon={<TrendingDown />}
        />

        <Stat
          title="Remaining"
          value={`₹${Math.max(
            remaining,
            0
          ).toLocaleString("en-IN")}`}
          change={
            remaining < 0
              ? "Over budget"
              : "Available"
          }
          icon={<PiggyBank />}
        />

        <Stat
          title="Usage"
          value={`${percentage.toFixed(0)}%`}
          change="This month"
          icon={<BarChart3 />}
        />

      </section>

      <div className="panel budget-panel">

        <h3>
          Budget Progress
        </h3>

        {editing && (

          <input
            className="budget-input"
            type="number"
            value={budget}
            onChange={(event) =>
              setBudget(
                Number(event.target.value)
              )
            }
          />

        )}

        <div className="goal-amount">

          ₹{expenses.toLocaleString(
            "en-IN"
          )}

          <span>
            / ₹{Number(
              budget
            ).toLocaleString("en-IN")}
          </span>

        </div>

        <div className="progress">

          <i
            style={{
              width: `${percentage}%`
            }}
          />

        </div>

        <div className="goal-meta">

          <span>
            {percentage.toFixed(1)}%
            {" "}used
          </span>

          <span>
            ₹{Math.max(
              remaining,
              0
            ).toLocaleString("en-IN")}
            {" "}remaining
          </span>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   GOALS
===================================================== */

function GoalsPage() {

  const [goal, setGoal] =
    React.useState(() => {

      const saved =
        localStorage.getItem(
          "finwell-goal"
        );

      return saved
        ? JSON.parse(saved)
        : {
            name: "Emergency Fund",
            current: 75000,
            target: 120000
          };
    });

  const [editing, setEditing] =
    React.useState(false);

  const percentage =
    Math.min(
      (Number(goal.current) /
        Number(goal.target)) *
        100,
      100
    );

  const saveGoal = () => {

    localStorage.setItem(
      "finwell-goal",
      JSON.stringify(goal)
    );

    setEditing(false);
  };

  return (
    <div>

      <section className="hero-row">

        <div>

          <p className="muted">
            Build your financial future
          </p>

          <h2>
            Savings Goals
          </h2>

        </div>

        <button
          className="primary"
          onClick={() =>
            editing
              ? saveGoal()
              : setEditing(true)
          }
        >

          {editing ? (
            <Save size={18} />
          ) : (
            <Edit3 size={18} />
          )}

          {editing
            ? "Save Goal"
            : "Edit Goal"}

        </button>

      </section>

      <div className="panel goal-big">

        {editing ? (

          <div className="goal-form">

            <input
              value={goal.name}
              onChange={(event) =>
                setGoal({
                  ...goal,
                  name:
                    event.target.value
                })
              }
            />

            <input
              type="number"
              value={goal.current}
              onChange={(event) =>
                setGoal({
                  ...goal,
                  current:
                    Number(
                      event.target.value
                    )
                })
              }
            />

            <input
              type="number"
              value={goal.target}
              onChange={(event) =>
                setGoal({
                  ...goal,
                  target:
                    Number(
                      event.target.value
                    )
                })
              }
            />

          </div>

        ) : (

          <>

            <Target
              size={42}
            />

            <h2>
              {goal.name}
            </h2>

          </>

        )}

        <div className="goal-amount">

          ₹{Number(
            goal.current
          ).toLocaleString("en-IN")}

          <span>
            / ₹{Number(
              goal.target
            ).toLocaleString("en-IN")}
          </span>

        </div>

        <div className="progress">

          <i
            style={{
              width:
                `${percentage}%`
            }}
          />

        </div>

        <div className="goal-meta">

          <span>
            {percentage.toFixed(1)}%
            {" "}completed
          </span>

          <span>
            ₹{Math.max(
              Number(goal.target) -
              Number(goal.current),
              0
            ).toLocaleString("en-IN")}
            {" "}left
          </span>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   INSIGHTS
===================================================== */

function InsightsPage({
  transactions
}) {

  const income = transactions
    .filter(
      (item) =>
        item.type === "income"
    )
    .reduce(
      (sum, item) =>
        sum +
        Number(item.amount),
      0
    );

  const expenses = transactions
    .filter(
      (item) =>
        item.type === "expense"
    )
    .reduce(
      (sum, item) =>
        sum +
        Number(item.amount),
      0
    );

  const savings =
    income - expenses;

  const spending =
    getSpendingData(
      transactions
    );

  const highestCategory =
    spending.length > 0
      ? [...spending].sort(
          (a, b) =>
            b.value - a.value
        )[0]
      : null;

  const chartData = [
    {
      name: "Income",
      amount: income
    },
    {
      name: "Expenses",
      amount: expenses
    },
    {
      name: "Savings",
      amount:
        savings > 0
          ? savings
          : 0
    }
  ];

  return (
    <div>

      <section className="cards">

        <Stat
          title="Savings"
          value={`₹${savings.toLocaleString(
            "en-IN"
          )}`}
          change="Net"
          icon={<PiggyBank />}
        />

        <Stat
          title="Income"
          value={`₹${income.toLocaleString(
            "en-IN"
          )}`}
          change="Earned"
          icon={<TrendingUp />}
        />

        <Stat
          title="Expenses"
          value={`₹${expenses.toLocaleString(
            "en-IN"
          )}`}
          change="Spent"
          icon={<TrendingDown />}
        />

        <Stat
          title="Transactions"
          value={transactions.length}
          change="Total"
          icon={<BarChart3 />}
        />

      </section>

      <section className="grid-2">

        <div className="panel">

          <h3>
            Financial Overview
          </h3>

          <div className="chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={chartData}
              >

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="amount"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="panel insight-panel">

          <Sparkles
            size={30}
          />

          <h3>
            Smart Insight
          </h3>

          {highestCategory ? (

            <p className="muted">

              Your highest spending category
              is{" "}

              <b>
                {highestCategory.name}
              </b>

              {" "}with ₹
              {highestCategory.value.toLocaleString(
                "en-IN"
              )}.

            </p>

          ) : (

            <p className="muted">
              Add expense transactions to
              receive insights.
            </p>

          )}

          {savings > 0 ? (

            <p>
              Great! You currently have
              positive savings of ₹
              {savings.toLocaleString(
                "en-IN"
              )}.
            </p>

          ) : (

            <p>
              Your expenses are higher than
              your income. Try reducing
              unnecessary spending.
            </p>

          )}

        </div>

      </section>

    </div>
  );
}

/* =====================================================
   PROFILE
===================================================== */

function ProfilePage() {

  const [profile, setProfile] =
    React.useState(() => {

      const saved =
        localStorage.getItem(
          "finwell-profile"
        );

      return saved
        ? JSON.parse(saved)
        : {
            name: "Bharat",
            email:
              "bharat@example.com",
            currency: "INR"
          };
    });

  const [saved, setSaved] =
    React.useState(false);

  const handleSave = () => {

    localStorage.setItem(
      "finwell-profile",
      JSON.stringify(profile)
    );

    setSaved(true);

    setTimeout(
      () =>
        setSaved(false),
      2000
    );
  };

  return (
    <div className="profile-page">

      <div className="panel profile-card">

        <div className="profile-avatar">
          {profile.name
            .charAt(0)
            .toUpperCase()}
        </div>

        <h2>
          {profile.name}
        </h2>

        <p className="muted">
          Manage your FinWell profile
        </p>

        <div className="profile-form">

          <label>
            Full Name
          </label>

          <input
            value={profile.name}
            onChange={(event) =>
              setProfile({
                ...profile,
                name:
                  event.target.value
              })
            }
          />

          <label>
            Email
          </label>

          <input
            type="email"
            value={profile.email}
            onChange={(event) =>
              setProfile({
                ...profile,
                email:
                  event.target.value
              })
            }
          />

          <label>
            Currency
          </label>

          <select
            value={
              profile.currency
            }
            onChange={(event) =>
              setProfile({
                ...profile,
                currency:
                  event.target.value
              })
            }
          >

            <option value="INR">
              INR - Indian Rupee
            </option>

            <option value="USD">
              USD - US Dollar
            </option>

            <option value="EUR">
              EUR - Euro
            </option>

          </select>

          <button
            className="primary"
            onClick={handleSave}
          >

            <Save size={18} />

            {saved
              ? "Saved!"
              : "Save Profile"}

          </button>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   TRANSACTION MODAL
===================================================== */

function TransactionModal({
  onClose,
  onAdd
}) {

  const [formData, setFormData] =
    React.useState({
      name: "",
      amount: "",
      type: "expense",
      category: "Food"
    });

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );
  };

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      if (
        !formData.name.trim() ||
        !formData.amount ||
        Number(
          formData.amount
        ) <= 0
      ) {

        alert(
          "Please enter a valid transaction."
        );

        return;
      }

      const success =
        await onAdd(formData);

      if (success) {
        onClose();
      }
    };

  return (
    <div className="modal-overlay">

      <div className="transaction-modal">

        <div className="modal-header">

          <h2>
            Add Transaction
          </h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
        >

          <label>
            Transaction Name
          </label>

          <input
            name="name"
            placeholder="Swiggy, Salary..."
            value={formData.name}
            onChange={handleChange}
          />

          <label>
            Amount
          </label>

          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
          />

          <label>
            Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >

            <option value="expense">
              Expense
            </option>

            <option value="income">
              Income
            </option>

          </select>

          <label>
            Category
          </label>

          <select
            name="category"
            value={
              formData.category
            }
            onChange={handleChange}
          >

            <option value="Food">
              Food
            </option>

            <option value="Shopping">
              Shopping
            </option>

            <option value="Transport">
              Transport
            </option>

            <option value="Bills">
              Bills
            </option>

            <option value="Salary">
              Salary
            </option>

            <option value="Freelance">
              Freelance
            </option>

            <option value="Other">
              Other
            </option>

          </select>

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="primary"
              type="submit"
            >
              Add Transaction
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function TransactionRow({
  transaction
}) {

  return (
    <div className="transaction">

      <div className="tx-icon">

        {transaction.type ===
        "income" ? (
          <ArrowUpRight />
        ) : (
          <ArrowDownRight />
        )}

      </div>

      <div>

        <b>
          {transaction.name}
        </b>

        <small>
          {transaction.category}
        </small>

      </div>

      <strong
        className={
          transaction.type
        }
      >

        {transaction.type ===
        "income"
          ? "+"
          : "-"}

        ₹
        {Number(
          transaction.amount
        ).toLocaleString(
          "en-IN"
        )}

      </strong>

    </div>
  );
}

function Stat({
  title,
  value,
  change,
  icon
}) {

  return (
    <div className="stat">

      <div className="stat-top">

        <span>
          {title}
        </span>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <strong>
        {value}
      </strong>

      <small>

        {change}

        <span>
          {" "}this month
        </span>

      </small>

    </div>
  );
}

function getSpendingData(
  transactions
) {

  return transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (
        accumulator,
        transaction
      ) => {

        const existing =
          accumulator.find(
            (item) =>
              item.name ===
              transaction.category
          );

        if (existing) {

          existing.value +=
            Number(
              transaction.amount
            );

        } else {

          accumulator.push({
            name:
              transaction.category,
            value:
              Number(
                transaction.amount
              )
          });

        }

        return accumulator;

      },
      []
    );
}

export default App;