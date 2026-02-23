import React from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const data = [
  {
    name: "Jan",
    value: 4000,
  },
  {
    name: "Feb",
    value: 3000,
  },
  {
    name: "Mar",
    value: 2000,
  },
  {
    name: "Apr",
    value: 2780,
  },
  {
    name: "May",
    value: 1890,
  },
  {
    name: "Jun",
    value: 2390,
  },
  {
    name: "Jul",
    value: 3490,
  },
];
const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="glass-card style-42c6ce63">
    <div className="style-f7930129">
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: `rgba(${color}, 0.1)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          size={22}
          style={{
            color: `rgb(${color})`,
          }}
        />
      </div>
      <button className="style-77b6ff8c">
        <MoreVertical size={18} />
      </button>
    </div>
    <div className="style-5bcf4cf5">
      <span className="style-4fe116eb">{title}</span>
      <div className="style-aff9a952">
        <h3 className="style-59213fb2">{value}</h3>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: change.startsWith("+") ? "#10b981" : "#ef4444",
            display: "flex",
            alignItems: "center",
            gap: "2px",
            paddingBottom: "4px",
          }}
        >
          {change}{" "}
          {change.startsWith("+") ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
        </span>
      </div>
    </div>
  </div>
);
const Dashboard: React.FC = () => {
  return (
    <div className="animate-fade">
      <div className="style-656f9746">
        <h1 className="style-d81a05f7">Overview</h1>
        <p className="style-7abb3a4e">
          Welcome back, Alex. Here's what's happening today.
        </p>
      </div>

      <div className="style-259699ed">
        <StatCard
          title="Total Revenue"
          value="$45,231"
          change="+12.5%"
          icon={DollarSign}
          color="124, 58, 237"
        />
        <StatCard
          title="Active Users"
          value="2,345"
          change="+18.2%"
          icon={Users}
          color="16, 185, 129"
        />
        <StatCard
          title="Total Orders"
          value="1,205"
          change="-3.1%"
          icon={ShoppingBag}
          color="245, 158, 11"
        />
        <StatCard
          title="Growth Rate"
          value="+14.2%"
          change="+5.4%"
          icon={TrendingUp}
          color="6, 182, 212"
        />
      </div>

      <div className="style-2a6fb0ce">
        <div className="glass-panel style-aa0da8a6">
          <div className="style-bbc98b25">
            <h3 className="style-14fa8787">Revenue Analytics</h3>
            <select className="style-aa110ac5">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="style-5f4d51f5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary-color)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary-color)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--text-muted)",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--text-muted)",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(24, 24, 27, 0.95)",
                    border: "1px solid rgba(63, 63, 70, 0.4)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{
                    color: "var(--text-main)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary-color)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel style-aa0da8a6">
          <h3 className="style-229e8d3f">Recent Orders</h3>
          <div className="style-f48bc238">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  paddingBottom: "1rem",
                  borderBottom:
                    i !== 4 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div className="style-d6fc11ca">
                  <ShoppingBag size={18} />
                </div>
                <div className="style-df12fcd6">
                  <span className="style-8c5fd05a">Apple iPhone 15 Pro</span>
                  <span className="style-bc3433db">2 mins ago</span>
                </div>
                <span className="style-a88a7934">$999</span>
              </div>
            ))}
            <button className="style-91a97cc4">View All Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
